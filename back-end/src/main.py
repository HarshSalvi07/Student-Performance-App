import os
import sys
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# Make sure Python can find modules inside src/
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from ocr_handler import OCRHandler
from prompts import ANALYSIS_PROMPT


def run_automated_pipeline(image_path: str, subject: str):
    print("NOTE: This process may take up to 30 seconds, please be patient.")
    print("🚀 Step 1: Running OCR Engine...")

    ocr_worker = OCRHandler()
    extracted_text = ocr_worker.extract_text(image_path)

    if "Error:" in extracted_text or extracted_text == "No text detected.":
        print(f"❌ Automation Halted: {extracted_text}")
        return f"Could not analyze image: {extracted_text}"

    print("✅ Text extracted successfully!")
    print("📝 Step 2: Preparing subject-focused prompt...")

    # Inject both the subject and the OCR text into the prompt
    final_prompt = ANALYSIS_PROMPT.format(
        subject=subject.strip(),
        data=extracted_text
    )

    print(f"🧠 Step 3: Analyzing notes for subject → {subject} ...")

    try:
        client = Groq()
        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a strict, rule-following Academic Advisor. "
                        "Always adhere strictly to the requested markdown output format. "
                        "Do not add any conversational intro or outro."
                    )
                },
                {
                    "role": "user",
                    "content": final_prompt
                }
            ],
            temperature=1.5,          # lowered from 2.0 for more consistent results
            max_tokens=1500,
            top_p=1.0,
            stream=False,
        )

        print("\n=== ✨ SUBJECT-FOCUSED ADVISOR OUTPUT ===")
        print(response.choices[0].message.content)
        return response.choices[0].message.content

    except Exception as e:
        print(f"❌ LLM Error: {str(e)}")
        return f"LLM Error: {str(e)}"


if __name__ == "__main__":
    # ---- Get inputs ----
    target_image_file = "uploads/test_note.jpeg"

    # Ask for subject name
    subject = input("Enter the subject name (e.g. Thermodynamics, Organic Chemistry, Calculus): ").strip()

    if not subject:
        print("❌ Subject name cannot be empty.")
        sys.exit(1)

    if not os.path.exists(target_image_file):
        print(f"❌ File Error: '{target_image_file}' not found in this folder.")
        sys.exit(1)

    run_automated_pipeline(image_path=target_image_file, subject=subject)