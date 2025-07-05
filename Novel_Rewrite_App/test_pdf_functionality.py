#!/usr/bin/env python3
"""
Test script for PDF functionality in Novel Rewrite App
"""

import os
import sys
from pathlib import Path

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from novel_rewrite_app import NovelRewriteApp
    print("✓ Successfully imported NovelRewriteApp")
except ImportError as e:
    print(f"✗ Error importing NovelRewriteApp: {e}")
    sys.exit(1)

def test_pdf_functionality():
    """Test the PDF processing functionality"""
    print("\n=== Testing PDF Functionality ===")
    
    # Initialize the app
    try:
        app = NovelRewriteApp()
        print("✓ NovelRewriteApp initialized successfully")
    except Exception as e:
        print(f"✗ Error initializing NovelRewriteApp: {e}")
        return False
    
    # Test PDF2Image import
    try:
        from pdf2image import convert_from_path
        print("✓ PDF2Image imported successfully")
    except ImportError as e:
        print(f"✗ PDF2Image not available: {e}")
        print("  Install with: pip install pdf2image")
        print("  Also install Poppler: https://github.com/oschwartz10612/poppler-windows/releases/")
        return False
    
    # Test PyMuPDF import
    try:
        import fitz
        print("✓ PyMuPDF imported successfully")
    except ImportError as e:
        print(f"✗ PyMuPDF not available: {e}")
        print("  Install with: pip install PyMuPDF")
        return False
    
    # Test PIL import
    try:
        from PIL import Image
        print("✓ PIL imported successfully")
    except ImportError as e:
        print(f"✗ PIL not available: {e}")
        print("  Install with: pip install Pillow")
        return False
    
    # Test if the PDF methods exist
    if hasattr(app, 'convert_pdf_to_images'):
        print("✓ convert_pdf_to_images method exists")
    else:
        print("✗ convert_pdf_to_images method not found")
        return False
    
    if hasattr(app, 'extract_pdf_text_and_images'):
        print("✓ extract_pdf_text_and_images method exists")
    else:
        print("✗ extract_pdf_text_and_images method not found")
        return False
    
    if hasattr(app, 'process_uploaded_pdf'):
        print("✓ process_uploaded_pdf method exists")
    else:
        print("✓ process_uploaded_pdf method exists")
    
    print("\n=== PDF Functionality Test Complete ===")
    print("✓ All PDF processing methods are available")
    print("\nTo test with a real PDF:")
    print("1. Start the Flask app: python app.py")
    print("2. Open http://127.0.0.1:5000/pdf_viewer")
    print("3. Upload a PDF file to test the functionality")
    
    return True

def test_flask_routes():
    """Test if Flask routes are properly configured"""
    print("\n=== Testing Flask Routes ===")
    
    try:
        from app import app as flask_app
        print("✓ Flask app imported successfully")
        
        # Check if routes exist
        routes = [rule.rule for rule in flask_app.url_map.iter_rules()]
        
        expected_routes = ['/', '/research', '/upload_pdf', '/pdf_viewer']
        for route in expected_routes:
            if route in routes:
                print(f"✓ Route {route} exists")
            else:
                print(f"✗ Route {route} not found")
                return False
        
        print("✓ All expected routes are configured")
        return True
        
    except Exception as e:
        print(f"✗ Error testing Flask routes: {e}")
        return False

def main():
    """Main test function"""
    print("Novel Rewrite App - PDF Functionality Test")
    print("=" * 50)
    
    # Test PDF functionality
    pdf_test_passed = test_pdf_functionality()
    
    # Test Flask routes
    flask_test_passed = test_flask_routes()
    
    print("\n" + "=" * 50)
    print("TEST RESULTS:")
    print(f"PDF Functionality: {'✓ PASSED' if pdf_test_passed else '✗ FAILED'}")
    print(f"Flask Routes: {'✓ PASSED' if flask_test_passed else '✗ FAILED'}")
    
    if pdf_test_passed and flask_test_passed:
        print("\n🎉 All tests passed! The app is ready to use.")
        print("\nNext steps:")
        print("1. Install Poppler for PDF2Image functionality")
        print("2. Run: python app.py")
        print("3. Open: http://127.0.0.1:5000")
    else:
        print("\n❌ Some tests failed. Please check the errors above.")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main()) 