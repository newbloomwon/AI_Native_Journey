from flask import Flask, render_template, request, redirect, url_for, send_from_directory
from novel_rewrite_app import NovelRewriteApp # Import your core research logic
import json
import logging
from pathlib import Path
from werkzeug.utils import secure_filename # Import secure_filename
import os # Import os module
from PyPDF2 import PdfReader
from typing import Optional # Import Optional for type hinting
from datetime import datetime # Import datetime for timestamp

# --- Logging Configuration ---
logging.basicConfig(
    level=logging.INFO, # Set to DEBUG for more verbose output
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('flask_app.log'), # Logs to a file named flask_app.log
        logging.StreamHandler() # Logs to the console where you run the app
    ]
)
logger = logging.getLogger(__name__)

# --- Flask App Initialization ---
app = Flask(__name__)

# --- File Upload Configuration ---
UPLOAD_FOLDER = 'uploaded_pdfs'
ALLOWED_EXTENSIONS = {'pdf'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# Ensure the upload folder exists
Path(UPLOAD_FOLDER).mkdir(parents=True, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# --- Initialize the NovelRewriteApp ---
novel_app = None
try:
    config_path = 'config.json'
    if not Path(config_path).exists():
        logger.error(f"Error: {config_path} not found. Please ensure it's in the same directory as app.py.")
        raise FileNotFoundError(f"Missing {config_path}")

    novel_app = NovelRewriteApp()
    logger.info("NovelRewriteApp initialized successfully.")
except FileNotFoundError:
    logger.critical(f"Failed to load {config_path}. The research app will not function without it.")
except Exception as e:
    logger.critical(f"Error initializing NovelRewriteApp: {e}", exc_info=True)


# --- Flask Routes ---

@app.route('/', methods=['GET'])
def index():
    """Renders the main page with the research form."""
    return render_template('index.html', results=None)

@app.route('/research', methods=['POST'])
def perform_research():
    """Handles the research request from the web form."""
    if novel_app is None:
        return render_template('index.html', error="Research app not initialized. Check server logs (flask_app.log) for configuration errors."), 500

    topic = request.form.get('topic')
    context = request.form.get('context')
    keywords_str = request.form.get('keywords')
    keywords = [kw.strip() for kw in keywords_str.split(',') if kw.strip()] if keywords_str else []

    if not topic:
        return render_template('index.html', error="Research topic is required."), 400

    uploaded_pdf_url = None
    uploaded_pdf_filename = None
    extracted_pdf_text = None

    # Handle PDF file upload
    if 'pdf_file' in request.files:
        file = request.files['pdf_file']
        if (file.filename or '') == '':
            logger.info("No PDF file selected for upload.")
        elif file and allowed_file(file.filename or ''):
            filename = secure_filename(file.filename or '')
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            uploaded_pdf_url = url_for('uploaded_file', filename=filename)
            uploaded_pdf_filename = filename
            logger.info(f"PDF file uploaded: {filename}")
            # Extract text from PDF for use as context
            try:
                reader = PdfReader(file_path)
                extracted_text = ''
                for page in reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        extracted_text += page_text + '\n'
                extracted_pdf_text = extracted_text
            except Exception as e:
                logger.error(f'Error extracting text from PDF: {e}')
        else:
            logger.warning(f"Attempted to upload disallowed file type: {file.filename}")
            return render_template('index.html', error="Invalid file type for upload. Only PDFs are allowed."), 400

    # Do NOT use extracted PDF text as context for research
    # if not context and extracted_pdf_text:
    #     context = extracted_pdf_text[:2000]  # Limit context length for safety

    try:
        logger.info(f"Received research request for topic: '{topic}'")
        # Only use user-provided context, never PDF text
        synthesis = novel_app.run_research_workflow(topic, context or "", keywords)
        logger.info(f"Research completed for topic: '{topic}'")

        display_results = {
            "topic": synthesis.get("topic", topic),
            "summary": synthesis.get("summary", "No summary available."),
            "total_sources": synthesis.get("total_sources", 0),
            "key_facts": synthesis.get("key_facts", [])[:5],
            "output_file": synthesis.get("output_file", "Not saved to file (check logs)."),
            "uploaded_pdf_url": uploaded_pdf_url, # Pass the URL to the template
            "uploaded_pdf_filename": uploaded_pdf_filename, # Pass the filename to the template
            "sources": synthesis.get("sources", [])
        }
        return render_template('index.html', results=display_results)

    except Exception as e:
        logger.error(f"An error occurred during research execution for topic '{topic}': {e}", exc_info=True)
        return render_template('index.html', error=f"An error occurred during research: {e}. Please check the 'flask_app.log' file for details."), 500

# New route to serve uploaded files
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/pdf_viewer/<filename>')
def pdf_viewer(filename):
    """Serve a PDF.js-based viewer for the uploaded PDF file."""
    return render_template('pdf_viewer.html', pdf_url=url_for('uploaded_file', filename=filename), pdf_filename=filename)

# --- Main Execution Block ---
if __name__ == '__main__':
    Path("research_results").mkdir(parents=True, exist_ok=True)
    app.run(debug=True)