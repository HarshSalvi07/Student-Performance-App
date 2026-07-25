# ocr_handler.py
from paddleocr import PaddleOCR
import os

class OCRHandler:
    def __init__(self):
        # Initialize the PaddleOCR engine on CPU with minimal logging
        self.ocr = PaddleOCR(
            use_angle_cls=True, 
            lang='en', 
            show_log=False, 
            use_gpu=False
        )
        print("✅ PaddleOCR initialized successfully!")

    def extract_text(self, image_path):
        if not os.path.exists(image_path):
            return f"File not found: {image_path}"
        try:
            # Run OCR text detection
            result = self.ocr.ocr(image_path, cls=True)
            
            # PaddleOCR returns None or empty list if no text is found
            if not result or result[0] is None:
                return "No text detected."
            
            # Safely navigate PaddleOCR nested layout list and pull text fragments
            text_lines = []
            for block in result[0]:
                if block and len(block) > 1:
                    # block[1][0] safely targets the extracted string text fragment
                    text_lines.append(block[1][0]) 
                    
            return "\n".join(text_lines)
            
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
