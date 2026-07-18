import pandas as pd
from pathlib import Path
from PIL import Image
import pytesseract
from langchain_community.document_loaders import PyPDFLoader

def extract_text_from_image(image_path):
    """Extract text from handwritten or printed image using OCR"""
    try:
        text = pytesseract.image_to_string(Image.open(image_path))
        return text
    except Exception as e:
        return f"OCR Error: {e}"

def load_student_data(file_path):
    """Load student data from CSV, PDF, or Image (handwritten)"""
    path = Path(file_path)
    
    if path.suffix.lower() == '.csv':
        df = pd.read_csv(path)
        summary = df.to_string(index=False)
        return df, summary, "CSV"
    
    elif path.suffix.lower() == '.pdf':
        loader = PyPDFLoader(str(path))
        pages = loader.load()
        text = "\n".join([page.page_content for page in pages])
        return None, text, "PDF"
    
    elif path.suffix.lower() in ['.jpg', '.png', '.jpeg']:
        text = extract_text_from_image(path)
        return None, text, "Image (OCR)"
    
    else:
        raise ValueError("Supported formats: CSV, PDF, JPG, PNG")