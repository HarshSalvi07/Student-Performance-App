"""Train a small PyTorch MLP from randomly initialized weights."""
from pathlib import Path
import csv
import json
import random
import re
import numpy as np
import torch
from torch import nn
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

ROOT = Path(__file__).resolve().parent
DATA_PATH = ROOT / "student_answers.csv"
MODEL_DIR = ROOT / "models"
MODEL_PATH = MODEL_DIR / "development_model.pt"
METADATA_PATH = MODEL_DIR / "model_metadata.json"
EVALUATION_PATH = ROOT / "evaluation.json"

LABELS = ["Needs Improvement", "Developing", "Proficient", "Advanced"]
EXPLANATION_WORDS = {
    "because", "therefore", "thus", "since", "consequently", "means", "causes",
    "result", "relationship", "mechanism", "assumptions", "however", "whereas",
    "first", "then", "finally", "for", "example", "demonstrates", "interpret",
}
TOPIC_WORDS = {
    "energy", "heat", "temperature", "system", "work", "entropy", "pressure",
    "algorithm", "data", "program", "function", "memory", "process", "cell",
    "organism", "structure", "growth", "equation", "variable", "formula",
    "force", "motion", "mass", "velocity", "measurement",
}
POSITIVE_FEEDBACK = {"clear", "good", "well", "detailed", "strong", "relevant", "reasonably", "proficient"}
IMPROVEMENT_FEEDBACK = {"needs", "weakness", "unclear", "review", "practise", "practice", "limited", "missing", "improve", "gaps"}

def tokenize(text):
    return re.findall(r"[a-zA-Z]+", (text or "").lower())

def extract_features(answer_text, subject_score, advisor_report):
    words = tokenize(answer_text)
    unique_ratio = len(set(words)) / max(len(words), 1)
    sentences = [s for s in re.split(r"[.!?]+", answer_text or "") if s.strip()]
    explanation_count = sum(w in EXPLANATION_WORDS for w in words)
    topic_count = sum(w in TOPIC_WORDS for w in words)
    avg_word_length = float(np.mean([len(w) for w in words])) if words else 0.0
    feedback_words = tokenize(advisor_report)
    positive_count = sum(w in POSITIVE_FEEDBACK for w in feedback_words)
    improvement_count = sum(w in IMPROVEMENT_FEEDBACK for w in feedback_words)
    # All features are numeric, derived from answer text, numeric subject score,
    # and the existing advisor report. They do not prove factual correctness.
    return [
        min(len(words), 1000) / 1000.0,
        unique_ratio,
        min(len(sentences), 50) / 50.0,
        min(explanation_count, 100) / 100.0,
        min(topic_count, 100) / 100.0,
        min(avg_word_length, 15) / 15.0,
        max(0.0, min(float(subject_score), 100.0)) / 100.0,
        min(positive_count, 20) / 20.0,
        min(improvement_count, 20) / 20.0,
        min(len(feedback_words), 500) / 500.0,
    ]

FEATURE_NAMES = [
    "answer_word_count", "answer_unique_word_ratio", "sentence_count",
    "explanation_marker_count", "subject_term_count", "average_word_length",
    "subject_knowledge_score", "positive_advisor_terms",
    "improvement_advisor_terms", "advisor_report_word_count",
]

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

def set_seed(seed=42):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)

def load_data():
    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"{DATA_PATH} not found. Run: python -m student_development.generate_dataset"
        )
    with DATA_PATH.open(newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    x = np.array([
        extract_features(r["answer_text"], float(r["subject_score"]), r["advisor_report"])
        for r in rows
    ], dtype=np.float32)
    label_to_id = {label: i for i, label in enumerate(LABELS)}
    y = np.array([label_to_id[r["development_label"]] for r in rows], dtype=np.int64)
    return x, y

def main():
    set_seed()
    X, y = load_data()
    X_train, X_temp, y_train, y_temp = train_test_split(
        X, y, test_size=0.30, random_state=42, stratify=y
    )
    X_val, X_test, y_val, y_test = train_test_split(
        X_temp, y_temp, test_size=0.50, random_state=42, stratify=y_temp
    )

    # Standardize using training-set statistics only.
    mean = X_train.mean(axis=0)
    std = X_train.std(axis=0)
    std[std < 1e-8] = 1.0
    X_train = (X_train - mean) / std
    X_val = (X_val - mean) / std
    X_test = (X_test - mean) / std

    model = DevelopmentMLP(X.shape[1], len(LABELS))
    optimizer = torch.optim.Adam(model.parameters(), lr=0.003, weight_decay=1e-4)
    loss_fn = nn.CrossEntropyLoss()
    train_x = torch.tensor(X_train, dtype=torch.float32)
    train_y = torch.tensor(y_train, dtype=torch.long)
    val_x = torch.tensor(X_val, dtype=torch.float32)
    val_y = torch.tensor(y_val, dtype=torch.long)

    best_val_loss = float("inf")
    best_state = None
    patience, stale = 20, 0
    for epoch in range(1, 301):
        model.train()
        optimizer.zero_grad()
        loss = loss_fn(model(train_x), train_y)
        loss.backward()
        optimizer.step()

        model.eval()
        with torch.no_grad():
            val_loss = loss_fn(model(val_x), val_y).item()
        if val_loss < best_val_loss - 1e-4:
            best_val_loss = val_loss
            best_state = {k: v.detach().clone() for k, v in model.state_dict().items()}
            stale = 0
        else:
            stale += 1
        if epoch == 1 or epoch % 25 == 0:
            print(f"Epoch {epoch:3d} | train_loss={loss.item():.4f} | val_loss={val_loss:.4f}")
        if stale >= patience:
            print(f"Early stopping at epoch {epoch}")
            break

    if best_state is not None:
        model.load_state_dict(best_state)
    model.eval()
    with torch.no_grad():
        logits = model(torch.tensor(X_test, dtype=torch.float32))
        predictions = logits.argmax(dim=1).cpu().numpy()

    accuracy = float(accuracy_score(y_test, predictions))
    report = classification_report(
        y_test, predictions, labels=list(range(len(LABELS))),
        target_names=LABELS, output_dict=True, zero_division=0
    )
    evaluation = {
        "dataset_type": "synthetic",
        "test_accuracy": accuracy,
        "classification_report": report,
        "confusion_matrix": confusion_matrix(y_test, predictions).tolist(),
        "warning": "These metrics only measure performance on generated synthetic examples. They do not establish real-world validity.",
    }

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    torch.save(model.state_dict(), MODEL_PATH)
    metadata = {
        "labels": LABELS,
        "feature_names": FEATURE_NAMES,
        "feature_mean": mean.tolist(),
        "feature_std": std.tolist(),
        "input_size": int(X.shape[1]),
        "hidden_sizes": [32, 16],
        "seed": 42,
        "dataset_type": "synthetic",
    }
    METADATA_PATH.write_text(json.dumps(metadata, indent=2), encoding="utf-8")
    EVALUATION_PATH.write_text(json.dumps(evaluation, indent=2), encoding="utf-8")

    print(f"\nTest accuracy on synthetic examples: {accuracy:.3f}")
    print(f"Saved model: {MODEL_PATH}")
    print(f"Saved metadata: {METADATA_PATH}")
    print(f"Saved evaluation: {EVALUATION_PATH}")
    print("Reminder: synthetic-data performance is not evidence of real-student accuracy.")

if __name__ == "__main__":
    main()
