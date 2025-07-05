#!/usr/bin/env python3
"""
Novel Rewrite Research Automation App - Fixed Version
====================================================

This application automates the research workflow for novel rewriting:
1. Query Formulation
2. Search Execution (using real search APIs)
3. Results Filtering
4. Information Extraction
5. Synthesis & Summarization
6. Storage & Organization

Author: Your Name
Date: 2025
"""

import os
import json
import time
import requests
from datetime import datetime
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, asdict
from pathlib import Path
import sqlite3
import pandas as pd
from bs4 import BeautifulSoup
import re
from urllib.parse import urlparse, urljoin
import logging
import fitz  # PyMuPDF
try:
    import pytesseract
    TESSERACT_AVAILABLE = True
except ImportError:
    TESSERACT_AVAILABLE = False
    print("Warning: pytesseract not available. OCR functionality will be disabled.")
from PIL import Image
import io
import base64
from pdf2image import convert_from_path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('novel_rewrite.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class ResearchQuery:
    """Represents a research query with metadata"""
    topic: str
    query_text: str
    keywords: List[str]
    created_at: str
    priority: int = 1
    
@dataclass
class SearchResult:
    """Represents a search result"""
    title: str
    url: str
    snippet: str
    source: str
    relevance_score: float
    domain: str
    
@dataclass
class ExtractedInfo:
    """Represents extracted information from a webpage"""
    url: str
    title: str
    content: str
    key_facts: List[str]
    summary: str
    extracted_at: str
    word_count: int

class NovelRewriteApp:
    """Main application class for novel rewrite research automation"""
    
    def __init__(self, config_file: str = "config.json"):
        self.config = self._load_config(config_file)
        self.db_path = "novel_research.db"
        self.results_dir = Path("research_results")
        self.results_dir.mkdir(exist_ok=True)
        self._init_database()
        
    def _load_config(self, config_file: str) -> Dict[str, Any]:
        """Load configuration from JSON file"""
        default_config = {
            "search_engines": {
                "google": {
                    "api_key": "",
                    "search_engine_id": "",
                    "base_url": "https://www.googleapis.com/customsearch/v1"
                }
            },
            "filtering": {
                "min_relevance_score": 0.3,
                "excluded_domains": ["wikipedia.org", "reddit.com"],
                "required_keywords": [],
                "max_results_per_query": 10
            },
            "extraction": {
                "max_content_length": 5000,
                "min_word_count": 100,
                "extract_headers": True,
                "extract_links": False
            },
            "storage": {
                "save_raw_html": False,
                "save_processed_data": True,
                "export_format": "markdown"
            }
        }
        
        if os.path.exists(config_file):
            with open(config_file, 'r') as f:
                user_config = json.load(f)
                # Merge with defaults
                for key, value in user_config.items():
                    if key in default_config:
                        default_config[key].update(value)
                    else:
                        default_config[key] = value
        
        return default_config
    
    def _init_database(self):
        """Initialize SQLite database for storing research data"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create tables
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS research_queries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                topic TEXT NOT NULL,
                query_text TEXT NOT NULL,
                keywords TEXT,
                created_at TEXT NOT NULL,
                priority INTEGER DEFAULT 1
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS search_results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                query_id INTEGER,
                title TEXT NOT NULL,
                url TEXT NOT NULL,
                snippet TEXT,
                source TEXT,
                relevance_score REAL,
                domain TEXT,
                FOREIGN KEY (query_id) REFERENCES research_queries (id)
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS extracted_info (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                result_id INTEGER,
                url TEXT NOT NULL,
                title TEXT,
                content TEXT,
                key_facts TEXT,
                summary TEXT,
                extracted_at TEXT NOT NULL,
                word_count INTEGER,
                FOREIGN KEY (result_id) REFERENCES search_results (id)
            )
        ''')
        
        conn.commit()
        conn.close()
        logger.info("Database initialized successfully")
    
    def formulate_query(self, topic: str, context: str = "", keywords: List[str] = None) -> ResearchQuery:
        """Formulate a research query based on topic and context"""
        if keywords is None:
            keywords = []
        
        # Basic query formulation
        query_parts = [topic]
        if context:
            query_parts.append(context)
        if keywords:
            query_parts.extend(keywords)
        
        query_text = " ".join(query_parts)
        
        # Add research-specific terms
        research_terms = ["research", "study", "analysis", "facts", "information"]
        query_text += " " + " ".join(research_terms[:2])  # Add 2 research terms
        
        query = ResearchQuery(
            topic=topic,
            query_text=query_text,
            keywords=keywords,
            created_at=datetime.now().isoformat()
        )
        
        # Save to database
        self._save_query(query)
        logger.info(f"Formulated query: {query_text}")
        
        return query
    
    def _save_query(self, query: ResearchQuery):
        """Save query to database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO research_queries (topic, query_text, keywords, created_at, priority)
            VALUES (?, ?, ?, ?, ?)
        ''', (query.topic, query.query_text, json.dumps(query.keywords), 
              query.created_at, query.priority))
        conn.commit()
        conn.close()
    
    def execute_search(self, query: ResearchQuery) -> List[SearchResult]:
        """Execute search using configured search engines"""
        results = []
        
        # Try Google Custom Search API if configured
        if (self.config["search_engines"]["google"]["api_key"] and 
            self.config["search_engines"]["google"]["search_engine_id"]):
            results.extend(self._google_search(query))
        
        # Use DuckDuckGo Instant Answer API as fallback
        if not results:
            results.extend(self._duckduckgo_search(query))
        
        # Filter results
        filtered_results = self._filter_results(results)
        
        # Save results to database
        if filtered_results:
            self._save_search_results(query, filtered_results)
        
        logger.info(f"Found {len(filtered_results)} relevant results for query: {query.query_text}")
        return filtered_results
    
    def _google_search(self, query: ResearchQuery) -> List[SearchResult]:
        """Execute Google Custom Search API"""
        try:
            params = {
                'key': self.config["search_engines"]["google"]["api_key"],
                'cx': self.config["search_engines"]["google"]["search_engine_id"],
                'q': query.query_text,
                'num': self.config["filtering"]["max_results_per_query"]
            }
            
            response = requests.get(
                self.config["search_engines"]["google"]["base_url"],
                params=params,
                timeout=10
            )
            response.raise_for_status()
            
            data = response.json()
            results = []
            
            if 'items' in data:
                for item in data['items']:
                    result = SearchResult(
                        title=item.get('title', ''),
                        url=item.get('link', ''),
                        snippet=item.get('snippet', ''),
                        source='google',
                        relevance_score=0.8,  # Default score
                        domain=urlparse(item.get('link', '')).netloc
                    )
                    results.append(result)
            
            return results
            
        except Exception as e:
            logger.error(f"Google search failed: {e}")
            return []
    
    def _duckduckgo_search(self, query: ResearchQuery) -> List[SearchResult]:
        """Use DuckDuckGo Instant Answer API as fallback"""
        try:
            # DuckDuckGo Instant Answer API
            url = "https://api.duckduckgo.com/"
            params = {
                'q': query.query_text,
                'format': 'json',
                'no_html': '1',
                'skip_disambig': '1'
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            results = []
            
            # Extract abstract if available
            if data.get('Abstract'):
                result = SearchResult(
                    title=data.get('Heading', query.topic),
                    url=data.get('AbstractURL', ''),
                    snippet=data.get('Abstract', ''),
                    source='duckduckgo',
                    relevance_score=0.9,
                    domain=urlparse(data.get('AbstractURL', '')).netloc if data.get('AbstractURL') else ''
                )
                results.append(result)
            
            # Add related topics
            for topic in data.get('RelatedTopics', [])[:3]:
                if isinstance(topic, dict) and topic.get('Text'):
                    result = SearchResult(
                        title=topic.get('Text', '')[:100],
                        url=topic.get('FirstURL', ''),
                        snippet=topic.get('Text', ''),
                        source='duckduckgo',
                        relevance_score=0.7,
                        domain=urlparse(topic.get('FirstURL', '')).netloc if topic.get('FirstURL') else ''
                    )
                    results.append(result)
            
            return results
            
        except Exception as e:
            logger.error(f"DuckDuckGo search failed: {e}")
            return []
    
    def _filter_results(self, results: List[SearchResult]) -> List[SearchResult]:
        """Filter search results based on relevance and domain criteria"""
        filtered = []
        
        for result in results:
            # Check domain exclusions
            if any(excluded in result.domain for excluded in self.config["filtering"]["excluded_domains"]):
                continue
            
            # Check relevance score
            if result.relevance_score < self.config["filtering"]["min_relevance_score"]:
                continue
            
            # Check required keywords
            if self.config["filtering"]["required_keywords"]:
                content_lower = (result.title + " " + result.snippet).lower()
                if not any(keyword.lower() in content_lower for keyword in self.config["filtering"]["required_keywords"]):
                    continue
            
            filtered.append(result)
        
        return filtered
    
    def _save_search_results(self, query: ResearchQuery, results: List[SearchResult]):
        """Save search results to database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get query ID
        cursor.execute('SELECT id FROM research_queries WHERE query_text = ?', (query.query_text,))
        query_id = cursor.fetchone()[0]
        
        for result in results:
            cursor.execute('''
                INSERT INTO search_results 
                (query_id, title, url, snippet, source, relevance_score, domain)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (query_id, result.title, result.url, result.snippet, 
                  result.source, result.relevance_score, result.domain))
        
        conn.commit()
        conn.close()
    
    def extract_information(self, results: List[SearchResult]) -> List[ExtractedInfo]:
        """Extract information from search result URLs"""
        extracted_data = []
        
        for result in results:
            try:
                info = self._extract_from_url(result.url)
                if info:
                    extracted_data.append(info)
                    self._save_extracted_info(result, info)
                    logger.info(f"Extracted info from: {result.url}")
                
                # Be respectful with requests
                time.sleep(1)
                
            except Exception as e:
                logger.error(f"Failed to extract from {result.url}: {e}")
        
        return extracted_data
    
    def _extract_from_url(self, url: str) -> Optional[ExtractedInfo]:
        """Extract information from a specific URL"""
        # If the URL is a PDF, do not extract text, just provide a link
        if url.lower().endswith('.pdf'):
            return ExtractedInfo(
                url=url,
                title="PDF Document",
                content="This is a PDF document. Click the link to view it in your browser.",
                key_facts=[],
                summary="PDF document. No text extracted.",
                extracted_at=datetime.now().isoformat(),
                word_count=0
            )
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            # Extract title
            title = soup.find('title')
            title_text = title.get_text().strip() if title else "No title"
            # Extract main content
            content = self._extract_main_content(soup)
            # Extract key facts
            key_facts = self._extract_key_facts(content)
            # Generate summary
            summary = self._generate_summary(content)
            # Count words
            word_count = len(content.split())
            return ExtractedInfo(
                url=url,
                title=title_text,
                content=content[:self.config["extraction"]["max_content_length"]],
                key_facts=key_facts,
                summary=summary,
                extracted_at=datetime.now().isoformat(),
                word_count=word_count
            )
        except Exception as e:
            logger.error(f"Error extracting from {url}: {e}")
            return None
    
    def _extract_main_content(self, soup: BeautifulSoup) -> str:
        """Extract main content from webpage"""
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()
        
        # Try to find main content areas
        content_selectors = [
            'main', 'article', '.content', '.post-content', '.entry-content',
            '#content', '#main', '.main-content'
        ]
        
        content = ""
        for selector in content_selectors:
            element = soup.select_one(selector)
            if element:
                content = element.get_text(separator=' ', strip=True)
                break
        
        # Fallback to body text
        if not content:
            content = soup.get_text(separator=' ', strip=True)
        
        # Clean up content
        content = re.sub(r'\s+', ' ', content)
        return content.strip()
    
    def _extract_key_facts(self, content: str) -> List[str]:
        """Extract key facts from content"""
        # Simple fact extraction - in practice you'd use NLP
        sentences = content.split('.')
        facts = []
        
        # Look for sentences with numbers, dates, or specific patterns
        for sentence in sentences[:20]:  # Check first 20 sentences
            sentence = sentence.strip()
            if len(sentence) > 20 and len(sentence) < 200:
                # Look for patterns that might indicate facts
                if any(pattern in sentence.lower() for pattern in ['research', 'study', 'found', 'discovered', 'according to']):
                    facts.append(sentence)
                elif re.search(r'\d+', sentence):  # Contains numbers
                    facts.append(sentence)
            
            if len(facts) >= 5:  # Limit to 5 facts
                break
        
        return facts
    
    def _generate_summary(self, content: str) -> str:
        """Generate a summary of the content"""
        # Simple summary generation - in practice you'd use NLP/LLM
        sentences = content.split('.')
        if len(sentences) <= 3:
            return content
        
        # Take first few sentences as summary
        summary_sentences = sentences[:3]
        return '. '.join(summary_sentences) + '.'
    
    def _save_extracted_info(self, result: SearchResult, info: ExtractedInfo):
        """Save extracted information to database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get result ID
        cursor.execute('SELECT id FROM search_results WHERE url = ?', (result.url,))
        result_id = cursor.fetchone()[0]
        
        cursor.execute('''
            INSERT INTO extracted_info 
            (result_id, url, title, content, key_facts, summary, extracted_at, word_count)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (result_id, info.url, info.title, info.content, 
              json.dumps(info.key_facts), info.summary, info.extracted_at, info.word_count))
        
        conn.commit()
        conn.close()
    
    def synthesize_information(self, extracted_data: List[ExtractedInfo]) -> Dict[str, Any]:
        """Synthesize extracted information into a coherent research summary"""
        if not extracted_data:
            # Return a default synthesis structure when no data is available
            return {
                "total_sources": 0,
                "total_word_count": 0,
                "key_facts": [],
                "summary": "No information was extracted from the search results.",
                "sources": [],
                "synthesized_at": datetime.now().isoformat()
            }
        
        # Combine all content
        all_content = "\n\n".join([info.content for info in extracted_data])
        all_facts = []
        for info in extracted_data:
            all_facts.extend(info.key_facts)
        
        # Generate synthesis
        synthesis = {
            "total_sources": len(extracted_data),
            "total_word_count": sum(info.word_count for info in extracted_data),
            "key_facts": list(set(all_facts))[:10],  # Remove duplicates, limit to 10
            "summary": self._generate_comprehensive_summary(all_content),
            "sources": [info.url for info in extracted_data],
            "synthesized_at": datetime.now().isoformat()
        }
        
        return synthesis
    
    def _generate_comprehensive_summary(self, content: str) -> str:
        """Generate a comprehensive summary of all content"""
        # Simple comprehensive summary - in practice you'd use NLP/LLM
        sentences = content.split('.')
        if len(sentences) <= 5:
            return content
        
        # Take first 5 sentences as comprehensive summary
        summary_sentences = sentences[:5]
        return '. '.join(summary_sentences) + '.'
    
    def save_research(self, synthesis: Dict[str, Any], topic: str, format: str = "markdown"):
        """Save research results in specified format"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{topic.replace(' ', '_')}_{timestamp}"
        
        if format.lower() == "markdown":
            self._save_as_markdown(synthesis, filename)
        elif format.lower() == "json":
            self._save_as_json(synthesis, filename)
        elif format.lower() == "csv":
            self._save_as_csv(synthesis, filename)
        
        logger.info(f"Research saved as {filename}.{format}")
    
    def _save_as_markdown(self, synthesis: Dict[str, Any], filename: str):
        """Save research as Markdown file"""
        filepath = self.results_dir / f"{filename}.md"
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(f"# Research Synthesis: {synthesis.get('topic', 'Unknown Topic')}\n\n")
            f.write(f"**Generated:** {synthesis['synthesized_at']}\n")
            f.write(f"**Total Sources:** {synthesis['total_sources']}\n")
            f.write(f"**Total Word Count:** {synthesis['total_word_count']}\n\n")
            
            f.write("## Summary\n\n")
            f.write(f"{synthesis['summary']}\n\n")
            
            f.write("## Key Facts\n\n")
            if synthesis['key_facts']:
                for i, fact in enumerate(synthesis['key_facts'], 1):
                    f.write(f"{i}. {fact}\n")
            else:
                f.write("No key facts were extracted.\n")
            f.write("\n")
            
            f.write("## Sources\n\n")
            if synthesis['sources']:
                for i, source in enumerate(synthesis['sources'], 1):
                    f.write(f"{i}. {source}\n")
            else:
                f.write("No sources were processed.\n")
    
    def _save_as_json(self, synthesis: Dict[str, Any], filename: str):
        """Save research as JSON file"""
        filepath = self.results_dir / f"{filename}.json"
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(synthesis, f, indent=2, ensure_ascii=False)
    
    def _save_as_csv(self, synthesis: Dict[str, Any], filename: str):
        """Save research as CSV file"""
        filepath = self.results_dir / f"{filename}.csv"
        
        # Create DataFrame from synthesis
        df = pd.DataFrame([{
            'topic': synthesis.get('topic', 'Unknown'),
            'total_sources': synthesis['total_sources'],
            'total_word_count': synthesis['total_word_count'],
            'summary': synthesis['summary'],
            'synthesized_at': synthesis['synthesized_at']
        }])
        
        df.to_csv(filepath, index=False)
    
    def run_research_workflow(self, topic: str, context: str = "", keywords: List[str] = None) -> Dict[str, Any]:
        """Run the complete research workflow"""
        logger.info(f"Starting research workflow for topic: {topic}")
        
        # Step 1: Formulate query
        query = self.formulate_query(topic, context, keywords)
        
        # Step 2: Execute search
        search_results = self.execute_search(query)
        
        # Step 3: Extract information
        extracted_data = self.extract_information(search_results)
        
        # Step 4: Synthesize information
        synthesis = self.synthesize_information(extracted_data)
        synthesis['topic'] = topic
        
        # Step 5: Save results
        self.save_research(synthesis, topic, self.config["storage"]["export_format"])
        
        logger.info(f"Research workflow completed for topic: {topic}")
        return synthesis

    def convert_pdf_to_images(self, pdf_path: str) -> List[Image.Image]:
        """Converts a PDF file to a list of PIL Image objects."""
        try:
            logger.info(f"Converting PDF to images: {pdf_path}")
            images = convert_from_path(pdf_path)
            logger.info(f"Successfully converted PDF to {len(images)} images")
            return images
        except Exception as e:
            logger.error(f"Error converting PDF to images: {e}")
            raise

    def extract_pdf_text_and_images(self, pdf_path: str) -> Dict[str, Any]:
        """Extract text and images from PDF using PyMuPDF and OCR"""
        try:
            logger.info(f"Extracting content from PDF: {pdf_path}")
            
            # Open the PDF
            doc = fitz.open(pdf_path)
            extracted_data = {
                "text": "",
                "images": [],
                "page_count": len(doc),
                "ocr_images": []
            }
            
            # Extract text and images from each page
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                
                # Extract text
                text = page.get_text()
                extracted_data["text"] += f"\n--- Page {page_num + 1} ---\n{text}\n"
                
                # Extract images
                image_list = page.get_images()
                for img_index, img in enumerate(image_list):
                    xref = img[0]
                    pix = fitz.Pixmap(doc, xref)
                    
                    if pix.n - pix.alpha < 4:  # GRAY or RGB
                        img_data = pix.tobytes("png")
                        img_base64 = base64.b64encode(img_data).decode()
                        extracted_data["images"].append({
                            "page": page_num + 1,
                            "index": img_index,
                            "data": img_base64,
                            "format": "png"
                        })
                    pix = None
            
            doc.close()
            
            # Convert PDF to images for OCR (if Tesseract is available)
            if TESSERACT_AVAILABLE:
                try:
                    pdf_images = self.convert_pdf_to_images(pdf_path)
                    for i, img in enumerate(pdf_images):
                        # Convert PIL image to base64
                        img_buffer = io.BytesIO()
                        img.save(img_buffer, format='PNG')
                        img_base64 = base64.b64encode(img_buffer.getvalue()).decode()
                        
                        extracted_data["ocr_images"].append({
                            "page": i + 1,
                            "data": img_base64,
                            "format": "png"
                        })
                except Exception as e:
                    logger.warning(f"Could not convert PDF to images for OCR: {e}")
            else:
                logger.info("OCR functionality disabled - Tesseract not available")
            
            logger.info(f"Successfully extracted content from PDF: {len(extracted_data['images'])} images, {len(extracted_data['ocr_images'])} OCR images")
            return extracted_data
            
        except Exception as e:
            logger.error(f"Error extracting PDF content: {e}")
            raise

    def process_uploaded_pdf(self, pdf_file) -> Dict[str, Any]:
        """Process an uploaded PDF file and return extracted content"""
        try:
            # Save uploaded file temporarily
            temp_path = Path("temp_upload.pdf")
            pdf_file.save(temp_path)
            
            # Extract content
            extracted_data = self.extract_pdf_text_and_images(str(temp_path))
            
            # Clean up temp file
            temp_path.unlink()
            
            return extracted_data
            
        except Exception as e:
            logger.error(f"Error processing uploaded PDF: {e}")
            raise

def main():
    """Main function to demonstrate the app"""
    print("=== Novel Rewrite Research Automation App (Fixed Version) ===\n")
    
    # Initialize the app
    app = NovelRewriteApp()
    
    # Example usage with real research topics
    topics = [
        "Venus colonization technology",
        "Interplanetary radio communication",
        "Space habitat design principles"
    ]
    
    for topic in topics:
        print(f"\n--- Researching: {topic} ---")
        try:
            synthesis = app.run_research_workflow(
                topic=topic,
                context="for science fiction novel research",
                keywords=["technology", "future", "space"]
            )
            
            print(f"✓ Completed research for: {topic}")
            print(f"  Sources found: {synthesis['total_sources']}")
            print(f"  Key facts extracted: {len(synthesis['key_facts'])}")
            print(f"  Summary: {synthesis['summary'][:100]}...")
            
        except Exception as e:
            print(f"✗ Error researching {topic}: {e}")
    
    print("\n=== Research Complete ===")
    print("Check the 'research_results' directory for output files.")
    print("\nTo get better results, consider:")
    print("1. Setting up Google Custom Search API in config.json")
    print("2. Adding more search engines")
    print("3. Implementing AI-powered summarization")

if __name__ == "__main__":
    main() 