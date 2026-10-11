# Student Development Classifier (Prototype)

This module adds an experimental PyTorch classifier to the Student Performance Application.

## What it uses
- OCR-extracted answer text
- Existing subject-knowledge score (parsed from the report if not supplied)
- Existing Groq advisor report text

## Important limitation
The starter dataset is synthetic. Its labels are generated from template patterns and scores. The model can learn those patterns, but that does not mean it can accurately assess real students. Do not use the prediction as an official grade or for high-stakes decisions. Replace the generated data with reviewed, consented, real labelled examples before claiming real-world validity.

## Install dependencies
Activate the same virtual environment used by your application, then from the project root run:

```bash
pip install torch numpy scikit-learn
```

## Generate and train
Run these from the project root (`student_performance/`):

```bash
python -m student_development.generate_dataset
python -m student_development.train_model
```

This creates `student_development/student_answers.csv`, trained weights, metadata, and `evaluation.json`.

## Use from Python
```python
from student_development.predict_development import generate_development_report

report = generate_development_report(
    ocr_text=extracted_text,
    advisor_report=combined_groq_and_scoring_output,
    subject=subject,
)
```

The function parses the subject-knowledge score from the combined report. You may pass `subject_score=...` explicitly if your code already has that value.

## Minimal `main.py` integration
After you append the existing subject-knowledge report to `result`, add:

```python
try:
    from student_development.predict_development import generate_development_report

    development_output = generate_development_report(
        ocr_text=extracted_text,
        advisor_report=result,
        subject=subject,
    )
    result += development_output
except Exception as development_error:
    print(f"⚠️ Student development classification failed: {development_error}")
```

Keep this inside the same `try` scope where `result` and `extracted_text` exist, but use the nested try/except so a classifier error doesn't discard the Groq result.

## Evaluation
Open `student_development/evaluation.json` after training. Its metrics are measured on a held-out portion of the synthetic dataset only. They are not estimates of real-world performance.
