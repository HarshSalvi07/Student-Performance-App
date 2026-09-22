import os
import sys
import tempfile
from pathlib import Path
from groq import Groq
from dotenv import load_dotenv


load_dotenv()


# Make sure Python can find modules inside src/
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))


from ocr_handler import OCRHandler
from prompts import ANALYSIS_PROMPT


# Supported image extensions
IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif', '.webp'}


def run_automated_pipeline(image_path: str, subject: str):
    print(f"\n{'='*60}")
    print(f"Processing: {os.path.basename(image_path)}")
    print(f"{'='*60}")
    print("NOTE: This process may take up to 30 seconds, please be patient.")
    print("🚀 Step 1: Running OCR Engine...")

    ocr_worker = OCRHandler()
    extracted_text = ocr_worker.extract_text(image_path)

    if "Error:" in extracted_text or extracted_text == "No text detected.":
        print(f"❌ Automation Halted: {extracted_text}")
        return f"Could not analyze image: {extracted_text}"

    print("✅ Text extracted successfully!")
    print("📝 Step 2: Preparing subject-focused prompt...")

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
            temperature=0.7,
            max_tokens=1500,
            top_p=1.0,
            stream=False,
        )

        print("\n=== ✨ SUBJECT-FOCUSED ADVISOR OUTPUT ===")
        result = response.choices[0].message.content
        print(result)
        return result

    except Exception as e:
        print(f"❌ LLM Error: {str(e)}")
        return f"LLM Error: {str(e)}"


def pdf_to_images(pdf_path: str, output_dir: str) -> list[str]:
    """Convert each page of a PDF into temporary PNG images."""
    try:
        from pdf2image import convert_from_path
    except ImportError:
        print("❌ Missing dependency: pdf2image")
        print("   Install it with:  pip install pdf2image")
        print("   Also install Poppler:")
        print("     • Ubuntu/Debian: sudo apt install poppler-utils")
        print("     • macOS:         brew install poppler")
        print("     • Windows:       https://github.com/oschwartz10612/poppler-windows")
        sys.exit(1)

    print(f"📄 Converting PDF pages to images: {os.path.basename(pdf_path)}")
    pages = convert_from_path(pdf_path, dpi=200)

    image_paths = []
    for i, page in enumerate(pages, 1):
        img_path = os.path.join(output_dir, f"page_{i:03d}.png")
        page.save(img_path, "PNG")
        image_paths.append(img_path)
        print(f"   → Saved page {i}/{len(pages)}")

    return image_paths


def process_file(file_path: str, subject: str):
    """Process either a single image or a single PDF."""
    path = Path(file_path)

    if not path.exists():
        print(f"❌ File not found: {file_path}")
        sys.exit(1)

    # Case 1: Single image
    if path.suffix.lower() in IMAGE_EXTENSIONS:
        print(f"🖼  Single image detected: {path.name}")
        result = run_automated_pipeline(str(path), subject)
        return {path.name: result}

    # Case 2: Single PDF
    if path.suffix.lower() == '.pdf':
        print(f"📄 PDF detected: {path.name}")
        with tempfile.TemporaryDirectory() as temp_dir:
            image_paths = pdf_to_images(str(path), temp_dir)

            results = {}
            for idx, img_path in enumerate(image_paths, 1):
                print(f"\n[{idx}/{len(image_paths)}]")
                result = run_automated_pipeline(img_path, subject)
                results[f"page_{idx:03d}"] = result

            return results

    print("❌ Unsupported file type.")
    sys.exit(1)


if __name__ == "__main__":

    IMAGE_PATH = "uploads/test_note.jpeg"
    PDF_PATH   = "uploads/notes.pdf"
    
    if os.path.exists(PDF_PATH):
        target_file = PDF_PATH
        print(f"📄 Found PDF → using: {PDF_PATH}")
    elif os.path.exists(IMAGE_PATH):
        target_file = IMAGE_PATH
        print(f"🖼  Found image → using: {IMAGE_PATH}")
    else:
        print("❌ Neither the image nor the PDF was found.")
        print(f"   Looked for image: {IMAGE_PATH}")
        print(f"   Looked for PDF:   {PDF_PATH}")
        sys.exit(1)

    # Ask only for the subject name (same as original)
    subject = input("Enter the subject name (e.g. Thermodynamics, Organic Chemistry, Calculus): ").strip()

    if not subject:
        print("❌ Subject name cannot be empty.")
        sys.exit(1)

    process_file(file_path=target_file, subject=subject)