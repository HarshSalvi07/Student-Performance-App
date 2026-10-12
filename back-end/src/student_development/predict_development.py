"""Load the trained development classifier and format a Markdown report."""
from pathlib import Path
import json
import re
import numpy as np
import torch
from torch import nn
from .train_model import extract_features, FEATURE_NAMES

ROOT = Path(__file__).resolve().parent
MODEL_PATH = ROOT / "models" / "development_model.pt"
METADATA_PATH = ROOT / "models" / "model_metadata.json"

class DevelopmentMLP(nn.Module):
    def __init__(self, input_size, num_classes):
        super().__init__()
        self.network = nn.Sequential(
            nn.Linear(input_size, 32),
            nn.ReLU(),
            nn.Dropout(0.10),
            nn.Linear(32, 16),
            nn.ReLU(),
            nn.Linear(16, num_classes),
        )

    def forward(self, x):
        return self.network(x)

def _score_from_report(report_text):
    patterns = [
        r"Overall Knowledge Score(?:\*\*)?\s*:\s*([0-9]+(?:\.[0-9]+)?)",
        r"Overall Score(?:\*\*)?\s*:\s*([0-9]+(?:\.[0-9]+)?)",
    ]
    for pattern in patterns:
        match = re.search(pattern, report_text or "", flags=re.IGNORECASE)
        if match:
            return float(match.group(1))
    return 50.0  # Explicit neutral fallback when no score can be found.

def predict_development(ocr_text: str, advisor_report: str, subject: str = "Unknown",
                       subject_score: float | None = None) -> dict:
    """Return prediction details. The score is an experimental class probability."""
    if not MODEL_PATH.exists() or not METADATA_PATH.exists():
        raise FileNotFoundError(
            "Trained model not found. From the project root, run: "
            "python -m student_development.generate_dataset && "
            "python -m student_development.train_model"
        )

    metadata = json.loads(METADATA_PATH.read_text(encoding="utf-8"))
    labels = metadata["labels"]
    if subject_score is None:
        subject_score = _score_from_report(advisor_report)

    features = np.asarray(
        extract_features(ocr_text, subject_score, advisor_report), dtype=np.float32
    )
    mean = np.asarray(metadata["feature_mean"], dtype=np.float32)
    std = np.asarray(metadata["feature_std"], dtype=np.float32)
    std[std < 1e-8] = 1.0
    features = (features - mean) / std

    model = DevelopmentMLP(metadata["input_size"], len(labels))
    state = torch.load(MODEL_PATH, map_location="cpu", weights_only=True)
    model.load_state_dict(state)
    model.eval()
    with torch.no_grad():
        probabilities = torch.softmax(model(torch.tensor(features).unsqueeze(0)), dim=1)[0]
    best_idx = int(torch.argmax(probabilities).item())
    probs = {label: round(float(probabilities[i].item()), 4) for i, label in enumerate(labels)}

    word_count = len(re.findall(r"\b\w+\b", ocr_text or ""))
    explanation_markers = len(re.findall(
        r"\b(because|therefore|thus|since|for example|as a result|however)\b",
        ocr_text or "", flags=re.IGNORECASE
    ))
    strengths = []
    improvements = []
    if word_count >= 100:
        strengths.append("The extracted response contains substantial written material.")
    else:
        improvements.append("Add enough detail to explain the concept, not just name it.")
    if explanation_markers >= 3:
        strengths.append("The answer uses several explanation or reasoning connectors.")
    else:
        improvements.append("Explain why each conclusion follows and include a worked example.")
    if subject_score >= 70:
        strengths.append("The existing subject-knowledge heuristic score is relatively high.")
    elif subject_score < 50:
        improvements.append("Review core concepts and verify terminology against trusted course material.")
    else:
        improvements.append("Practise applying the concepts to new questions and examples.")
    if not strengths:
        strengths.append("No strong evidence of a particular strength was detected by these simple features.")
    if not improvements:
        improvements.append("Continue practising and verify factual details with course materials.")

    return {
        "subject": subject,
        "predicted_level": labels[best_idx],
        "class_probabilities": probs,
        "subject_score_used": round(float(subject_score), 2),
        "word_count": word_count,
        "strengths": strengths,
        "areas_for_improvement": improvements,
        "limitations": [
            "The classifier was trained on synthetic examples, not real labelled student work.",
            "Class probabilities are model outputs, not calibrated probabilities of actual ability.",
            "Text length and vocabulary do not establish factual correctness or conceptual understanding.",
            "OCR mistakes and advisor-report wording can change the prediction.",
            "Use this as an experimental summary only, not for grades, admissions, or high-stakes decisions.",
        ],
    }

def generate_development_report(ocr_text: str, advisor_report: str,
                                subject: str = "Unknown",
                                subject_score: float | None = None) -> str:
    result = predict_development(
        ocr_text=ocr_text,
        advisor_report=advisor_report,
        subject=subject,
        subject_score=subject_score,
    )
    strengths = "\n".join(f"- {x}" for x in result["strengths"])
    improvements = "\n".join(f"- {x}" for x in result["areas_for_improvement"])
    limitations = "\n".join(f"- {x}" for x in result["limitations"])
    probabilities = "\n".join(
        f"- **{label}:** {prob:.1%}"
        for label, prob in result["class_probabilities"].items()
    )
    return f"""

---

# Student Overall Development (Experimental)

- **Subject:** {result['subject']}
- **Predicted Development Level:** {result['predicted_level']}
- **Existing Subject-Knowledge Score:** {result['subject_score_used']}/100
- **Extracted Word Count:** {result['word_count']}

## Model Class Scores
{probabilities}
"""
