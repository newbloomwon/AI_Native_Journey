# You would need to install pdf2image and poppler
# pip install pdf2image
# On macOS: brew install poppler
# On Debian/Ubuntu: sudo apt-get install poppler-utils

from pdf2image import convert_from_path

def convert_pdf_to_images(pdf_path):
    """Converts a PDF file to a list of PIL Image objects."""
    return convert_from_path(pdf_path)

# Example usage
# images = convert_pdf_to_images('my_document.pdf')
#
# for i, image in enumerate(images):
#     image.save(f'page_{i + 1}.png', 'PNG')