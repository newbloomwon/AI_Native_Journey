# Novel Research Automation App with PDF Processing

A comprehensive research automation system that combines web research with advanced PDF processing capabilities. This application allows you to upload PDFs, extract text and images, and perform automated research analysis.

## Features

### 🔍 Research Automation
- **Query Formulation**: Automatically formulates research queries based on topics and context
- **Multi-Engine Search**: Uses Google Custom Search and DuckDuckGo APIs
- **Content Extraction**: Extracts and processes information from web pages
- **Information Synthesis**: Combines and summarizes research findings
- **Database Storage**: Stores all research data in SQLite database

### 📄 PDF Processing
- **Text Extraction**: Extracts text from PDF files using PyMuPDF
- **Image Extraction**: Extracts embedded images from PDFs
- **OCR Support**: Converts PDF pages to images for OCR processing
- **PDF2Image Integration**: Converts PDFs to high-quality images
- **Interactive Viewer**: Client-side PDF rendering with PDF.js

### 🖼️ Image Processing
- **Base64 Encoding**: Images are encoded for web display
- **Modal Viewer**: Click images to view in full-screen modal
- **Gallery Display**: Grid layout for extracted images
- **OCR Image Support**: Separate handling for OCR-processed images

### 🌐 Web Interface
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Real-time Processing**: Live PDF upload and processing
- **Research Integration**: Seamless connection between PDF analysis and research
- **Error Handling**: Comprehensive error handling and user feedback

## Installation

### Prerequisites

1. **Python 3.8+** installed on your system
2. **Poppler** (for PDF2Image functionality):
   - **Windows**: Download from [poppler releases](https://github.com/oschwartz10612/poppler-windows/releases/)
   - **macOS**: `brew install poppler`
   - **Ubuntu/Debian**: `sudo apt-get install poppler-utils`

3. **Tesseract OCR** (optional, for OCR functionality):
   - **Windows**: Download from [UB-Mannheim](https://github.com/UB-Mannheim/tesseract/wiki)
   - **macOS**: `brew install tesseract`
   - **Ubuntu/Debian**: `sudo apt-get install tesseract-ocr`

### Setup Instructions

1. **Clone or navigate to the project directory**:
   ```bash
   cd Novel_Rewrite_App
   ```

2. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**:
   - **Windows**: `venv\Scripts\activate`
   - **macOS/Linux**: `source venv/bin/activate`

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Configure the application**:
   - Copy `config.json.example` to `config.json` (if available)
   - Add your Google Custom Search API credentials (optional)

6. **Set up Poppler path** (Windows only):
   - Add Poppler's `bin` directory to your system PATH
   - Or set the `POPPLER_PATH` environment variable

## Usage

### Starting the Application

1. **Run the Flask app**:
   ```bash
   python app.py
   ```

2. **Access the web interface**:
   - Open your browser and go to `http://127.0.0.1:5000`
   - You'll see the main research interface

### Using the PDF Viewer

1. **Navigate to PDF Viewer**:
   - Click the "📄 PDF Viewer & Analysis" link on the main page
   - Or go directly to `http://127.0.0.1:5000/pdf_viewer`

2. **Upload a PDF**:
   - Click "Choose PDF File" and select your PDF
   - Click "Process PDF" to start extraction

3. **View Results**:
   - **PDF Rendering**: The PDF will be displayed with navigation controls
   - **Extracted Text**: View the extracted text content
   - **Images Gallery**: Browse extracted images (click to enlarge)
   - **Research Integration**: Use extracted content for research analysis

### Research Workflow

1. **From PDF Content**:
   - After processing a PDF, use the extracted text to formulate research topics
   - Enter a research topic, context, and keywords
   - Click "Start Research Analysis" to begin automated research

2. **Direct Research**:
   - On the main page, enter your research topic
   - Add optional context and keywords
   - Click "Start Research" to begin

3. **View Results**:
   - Research results include summaries, key facts, and source information
   - Results are saved to the `research_results` directory

## Configuration

### Google Custom Search API (Optional)

For enhanced search capabilities, set up Google Custom Search:

1. **Create a Google Cloud Project**
2. **Enable Custom Search API**
3. **Create API credentials**
4. **Set up Custom Search Engine**
5. **Update `config.json`**:
   ```json
   {
     "search_engines": {
       "google": {
         "api_key": "YOUR_API_KEY",
         "search_engine_id": "YOUR_SEARCH_ENGINE_ID"
       }
     }
   }
   ```

### File Structure

```
Novel_Rewrite_App/
├── app.py                          # Flask web application
├── novel_rewrite_app.py            # Core research logic
├── config.json                     # Configuration file
├── requirements.txt                # Python dependencies
├── README.md                      # This file
├── Templates/                     # HTML templates
│   ├── index.html                # Main research interface
│   └── pdf_viewer.html           # PDF viewer interface
├── research_results/              # Generated research files
├── uploads/                      # Temporary PDF uploads
└── novel_research.db             # SQLite database
```

## API Endpoints

### Web Interface
- `GET /` - Main research interface
- `GET /pdf_viewer` - PDF viewer and analysis interface
- `POST /research` - Perform research analysis
- `POST /upload_pdf` - Upload and process PDF files

### Response Formats

**PDF Upload Response**:
```json
{
  "success": true,
  "data": {
    "text": "Extracted text content...",
    "images": [
      {
        "page": 1,
        "index": 0,
        "data": "base64_encoded_image_data",
        "format": "png"
      }
    ],
    "page_count": 5,
    "ocr_images": [...]
  },
  "message": "PDF processed successfully. Found 3 images and 5 OCR images."
}
```

## Troubleshooting

### Common Issues

1. **PDF2Image Error**: "poppler not found"
   - **Solution**: Install Poppler and ensure it's in your PATH
   - **Windows**: Download Poppler and add to PATH or set POPPLER_PATH

2. **Tesseract Error**: "tesseract not found"
   - **Solution**: Install Tesseract OCR
   - **Windows**: Download from UB-Mannheim and add to PATH

3. **Import Errors**: Missing dependencies
   - **Solution**: Run `pip install -r requirements.txt`
   - **Note**: Some packages may require system-level dependencies

4. **Flask App Not Starting**:
   - **Check**: Ensure you're in the correct directory
   - **Check**: Verify all dependencies are installed
   - **Check**: Look at `flask_app.log` for error details

### Log Files

- `flask_app.log` - Flask application logs
- `novel_rewrite.log` - Research automation logs

### Performance Tips

1. **Large PDFs**: Processing large PDFs may take time
2. **Memory Usage**: PDF processing can be memory-intensive
3. **File Size**: Maximum upload size is 16MB
4. **Concurrent Users**: The app is designed for single-user operation

## Development

### Adding New Features

1. **PDF Processing**: Extend `NovelRewriteApp` with new PDF methods
2. **Web Interface**: Add new routes in `app.py`
3. **Frontend**: Modify templates in `Templates/` directory

### Testing

1. **Unit Tests**: Add tests for core functionality
2. **Integration Tests**: Test PDF processing pipeline
3. **Web Tests**: Test Flask routes and responses

## License

This project is for educational and research purposes. Please ensure you comply with all applicable laws and regulations when using this software.

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the log files for error details
3. Ensure all dependencies are properly installed
4. Verify your system meets the prerequisites

---

**Note**: This application processes PDFs and performs web research. Please ensure you have the right to process any PDFs you upload and comply with website terms of service for research activities.
