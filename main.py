# main.py
import os
import sys
from groq import Groq  
from dotenv import load_dotenv  

# Automatically locate and load variables from your local .env file
load_dotenv()

# Ensure Python knows where to find src/prompts.py
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from ocr_handler import OCRHandler
from prompts import ANALYSIS_PROMPT

def run_automated_pipeline(image_path):
    print("NOTE: This process may take upto 30 seconds, please be patient")
    print("🚀 Step 1: Running a stable PaddleOCR Engine...")
    ocr_worker = OCRHandler()
    extracted_text = ocr_worker.extract_text(image_path)
    
    if "Error:" in extracted_text or extracted_text == "No text detected.":
        print(f"❌ Automation Halted: {extracted_text}")
        return
        
    print("✅ Text layout map pulled from image structure!")
    
    print("📝 Step 2: Preparing consistent prompt structure...")
    # Injecting ONLY the raw OCR text string into the prompt template
    final_prompt = ANALYSIS_PROMPT.format(data=extracted_text)
    
    print("🧠 Step 3: Routing text payload directly to Llama-3.3-70b-Versatile...")
    try:
        client = Groq()
        
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are a strict, rule-following Academic Advisor. Always adhere strictly to the requested markdown output format blocks without conversational intro or outro fluff."
                },
                {
                    "role": "user",
                    "content": final_prompt
                }
            ],
            temperature=0.0,
            max_tokens=2048,
            top_p=1.0,
            stream=False,
        )
        print("Thank you for waiting, we appreciate your patience")
        print("\n=== ✨ CONSISTENT ADVISOR REMEDIATION OUTPUT ===")
        print(response.choices[0].message.content)
        return response.choices[0].message.content
        
    except Exception as e:
        print(f"❌ LLM Automation Error: {str(e)}")

if __name__ == "__main__":
    # The image path is the only item passed to the pipeline execution entry point
    target_image_file = "test_note.jpeg"
    
    if os.path.exists(target_image_file):
        run_automated_pipeline(image_path=target_image_file)
    else:
        print(f"❌ File Error: Please save your note as '{target_image_file}' in this folder.")
