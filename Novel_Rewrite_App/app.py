from flask import Flask, render_template, request, redirect, url_for
from novel_rewrite_app import NovelRewriteApp # Import your core research logic
import json
import logging
from pathlib import Path

# --- Logging Configuration ---
# Configure logging for the Flask app to see messages in console and a log file
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

# --- Initialize the NovelRewriteApp ---
# This part tries to load your config.json and set up the research app
novel_app = None
try:
    config_path = 'config.json'
    # Check if config.json exists in the current directory
    if not Path(config_path).exists():
        logger.error(f"Error: {config_path} not found. Please ensure it's in the same directory as app.py.")
        raise FileNotFoundError(f"Missing {config_path}")

    # The NovelRewriteApp class in novel_rewrite_app.py loads config.json internally,
    # so we just need to instantiate it.
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
    # The 'results' variable will be None on initial load,
    # so the results section in HTML won't show.
    return render_template('index.html', results=None)

@app.route('/research', methods=['POST'])
def perform_research():
    """Handles the research request from the web form."""
    # If NovelRewriteApp failed to initialize (e.g., config.json missing),
    # return an error to the user.
    if novel_app is None:
        return render_template('index.html', error="Research app not initialized. Check server logs (flask_app.log) for configuration errors."), 500

    # Get data submitted from the web form
    topic = request.form.get('topic')
    context = request.form.get('context')
    keywords_str = request.form.get('keywords')

    # Convert comma-separated keywords string into a Python list
    keywords = [kw.strip() for kw in keywords_str.split(',') if kw.strip()] if keywords_str else []

    # Basic input validation: Topic is required
    if not topic:
        return render_template('index.html', error="Research topic is required."), 400

    try:
        logger.info(f"Received research request for topic: '{topic}'")
        # Call the run_research_workflow method from your imported NovelRewriteApp instance
        synthesis = novel_app.run_research_workflow(topic, context, keywords)
        logger.info(f"Research completed for topic: '{topic}'")

        # Prepare a subset of the synthesis results to display on the web page
        display_results = {
            "topic": synthesis.get("topic", topic),
            "summary": synthesis.get("summary", "No summary available."),
            "total_sources": synthesis.get("total_sources", 0),
            "key_facts": synthesis.get("key_facts", [])[:5], # Display top 5 key facts
            "output_file": synthesis.get("output_file", "Not saved to file (check logs).") # Path to generated file
        }
        # Render the index.html template again, but this time pass the results
        return render_template('index.html', results=display_results)

    except Exception as e:
        # Log the full traceback for debugging
        logger.error(f"An error occurred during research execution for topic '{topic}': {e}", exc_info=True)
        # Display a user-friendly error message on the page
        return render_template('index.html', error=f"An error occurred during research: {e}. Please check the 'flask_app.log' file for details."), 500

# --- Main Execution Block ---
if __name__ == '__main__':
    # Ensure the 'research_results' directory exists.
    # This is where your novel_rewrite_app.py will save its output files.
    Path("research_results").mkdir(parents=True, exist_ok=True)
    
    # Run the Flask development server.
    # debug=True: Enables auto-reloading on code changes and provides more detailed error messages.
    # IMPORTANT: Set debug=False when deploying to a production environment!
    app.run(debug=True)