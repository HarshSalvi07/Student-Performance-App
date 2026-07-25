# ocr_handler.py
import os
import logging

# Set environmental flags BEFORE importing PaddleOCR to disable the broken oneDNN path
os.environ["FLAGS_use_mkldnn"] = "0"
os.environ["FLAGS_enable_pir_api"] = "0"
os.environ["PADDLE_PDX_ENABLE_MKLDNN_BYDEFAULT"] = "0"

from paddleocr import PaddleOCR

# Disable Paddle logging to keep the console clean
logging.getLogger("ppocr").setLevel(logging.ERROR)

class OCRHandler:
    def __init__(self):
        # Initialize PaddleOCR using the updated modern parameter system
        self.ocr = PaddleOCR(
            use_textline_orientation=True,  # Keep this parameter exclusively
            lang='en', 
            device='cpu',                   # Enforces CPU execution natively
            enable_mkldnn=False             # Bypasses the problematic oneDNN math backend
        )
        print("✅ PaddleOCR initialized successfully!")

    def extract_text(self, image_path):
        if not os.path.exists(image_path):
            return f"File not found: {image_path}"
        try:
            # Modern prediction call
            result = self.ocr.predict(image_path)
            
            if not result:
                return "No text detected."
                
            text_lines = []
            
            # Loop through individual page/document layout wrappers returned by v3.x
            for res in result:
                # Pattern A: Object has direct recognition attribute (Native PaddleOCR v3)
                if hasattr(res, 'rec_texts') and res.rec_texts:
                    if isinstance(res.rec_texts, list):
                        text_lines.extend(res.rec_texts)
                        
                # Pattern B: Extracted from a dictionary layout mapping
                elif isinstance(res, dict) and 'rec_texts' in res:
                    if isinstance(res['rec_texts'], list):
                        text_lines.extend(res['rec_texts'])
                        
                # Pattern C: Fallback extraction check targeting layout-block subparts
                elif hasattr(res, 'doc_res') and isinstance(res.doc_res, list):
                    for sub_item in res.doc_res:
                        if isinstance(sub_item, dict) and 'text' in sub_item:
                            text_lines.append(sub_item['text'])
                            
                # Pattern D: General sub-block extraction loop
                elif hasattr(res, 'res') and isinstance(res.res, dict) and 'texts' in res.res:
                    text_lines.extend(res.res['texts'])

            # Clean whitespace and drop any stray structural fragments
            text_lines = [str(line).strip() for line in text_lines if line and str(line).strip()]

            return "\n".join(text_lines) if text_lines else "No structured text found inside the object."
            
        except Exception as e:
            return f"Error: {str(e)}"

# Test execution blocks when running directly
if __name__ == '__main__':
    handler = OCRHandler()
    
    # Matches your local test filename
    image_name = "test_note.jpeg" 
    if os.path.exists(image_name):
        print(f"\n--- Running Isolated Local OCR Test on {image_name} ---")
        extracted_text = handler.extract_text(image_name)
        print(extracted_text)
    else:
        print(f"\nPut your image as {image_name} in this directory to run isolated tests.")
