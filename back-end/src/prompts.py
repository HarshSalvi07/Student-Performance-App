from dotenv import load_dotenv
from groq import Groq
import base64
import os

load_dotenv()

def encode_image(image_path: str) -> str:
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

image_path = os.path.join("uploads", "test_note.jpeg")
base64_image = encode_image(image_path)

response = client.chat.completions.create(
    model="qwen/qwen3.6-27b",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Analyze this student performance data / test note and give useful suggestions:"
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{base64_image}"
                    }
                }
            ]
        }
    ],
    temperature=0.7,
    max_tokens=800          # ← keep this under 1000
)

print("=== Analysis Result ===")
print(response.choices[0].message.content)