"""Generate a synthetic starter dataset for the development classifier.

IMPORTANT: These are invented examples, not real student records. The labels
are generated from the same broad feature patterns the model will learn, so
metrics on this dataset do not establish real-world educational validity.
"""
from pathlib import Path
import csv
import random

ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "student_answers.csv"
SEED = 42

SUBJECTS = [
    ("Thermodynamics", ["energy", "heat", "temperature", "system", "work", "entropy", "pressure"]),
    ("Computer Science", ["algorithm", "data", "system", "program", "function", "memory", "process"]),
    ("Biology", ["cell", "organism", "energy", "process", "structure", "function", "growth"]),
    ("Mathematics", ["equation", "value", "function", "variable", "result", "method", "formula"]),
    ("Physics", ["force", "motion", "energy", "mass", "velocity", "system", "measurement"]),
]
LEVELS = ["Needs Improvement", "Developing", "Proficient", "Advanced"]

ANSWER_TEMPLATES = {
    "Needs Improvement": [
        "The topic is {terms}. It is important. {terms} are used in this topic.",
        "I think {terms} is the answer. I remember this term but cannot explain it clearly.",
        "The answer is about {terms}. More details are not known.",
    ],
    "Developing": [
        "{terms} are related to this topic. The main idea is that {terms} affect the process. For example, this can happen in a system.",
        "The concept of {terms} is important because it changes the result. One example is a basic system where the variables can change.",
        "{terms} are part of the process. First the system changes, and then the result can be observed. This explains part of the concept.",
    ],
    "Proficient": [
        "{terms} influence the process because they affect how the system behaves. For example, when one variable changes, the result can change as well. Therefore, the relationship between the variables is important.",
        "The concept describes how {terms} interact within a system. First, the conditions are identified; then the relationship is explained and an example is used to support the conclusion.",
        "{terms} are important in this process. This happens because the variables are connected, which means a change in one part can affect another part. For example, consider a system under different conditions.",
    ],
    "Advanced": [
        "{terms} interact through a defined mechanism. First, the assumptions and conditions are established; then the relationship is derived and interpreted. For example, changing one variable while controlling the others demonstrates the effect. However, the conclusion depends on the system boundaries and the validity of the assumptions.",
        "A detailed explanation of {terms} requires considering the mechanism, the relevant variables, and the constraints. Because these factors interact, the result should be justified step by step and checked against an example. In contrast, changing the initial conditions may produce a different outcome, so the assumptions must be stated.",
        "{terms} can be analysed by defining the system, identifying variables, and explaining their causal relationship. For instance, a controlled change provides evidence for the expected trend. The result should then be interpreted, limitations considered, and the reasoning compared with the governing principle.",
    ],
}

FEEDBACK = {
    "Needs Improvement": [
        "The response needs clearer explanations and more accurate topic coverage. Review the fundamentals and practise short examples.",
        "Several concepts are not explained. Revisit key definitions and write a step-by-step answer.",
    ],
    "Developing": [
        "Some understanding is demonstrated, but reasoning and examples need more detail. Practise connecting the main ideas.",
        "The response has a basic explanation. Add precise terminology and explain why the result follows.",
    ],
    "Proficient": [
        "The response is reasonably clear and uses relevant concepts. Strengthen it by checking details and adding a precise example.",
        "Good structure and explanation. Continue practising application questions and verifying factual accuracy.",
    ],
    "Advanced": [
        "The response shows detailed reasoning and considers assumptions. Continue testing conclusions with examples and edge cases.",
        "The explanation is well developed. Maintain this approach and verify each claim against trusted course material.",
    ],
}

def make_rows(count_per_level=250):
    rng = random.Random(SEED)
    rows = []
    for label in LEVELS:
        for i in range(count_per_level):
            subject, terms = rng.choice(SUBJECTS)
            selected = rng.sample(terms, k=rng.randint(2, min(5, len(terms))))
            term_text = ", ".join(selected)
            answer = rng.choice(ANSWER_TEMPLATES[label]).format(terms=term_text)
            # Add mild variation to avoid every example being identical.
            if rng.random() < 0.45:
                answer += " " + rng.choice([
                    "This is the key point to remember.",
                    "The exact result depends on the conditions.",
                    "The definition and example should be checked in the textbook.",
                    "A diagram can help explain this relationship.",
                ])
            feedback = rng.choice(FEEDBACK[label])
            # Synthetic scores are intentionally correlated with the target label.
            score_ranges = {
                "Needs Improvement": (15, 44),
                "Developing": (40, 64),
                "Proficient": (60, 84),
                "Advanced": (78, 98),
            }
            lo, hi = score_ranges[label]
            score = round(rng.uniform(lo, hi), 2)
            advisor_report = (
                f"Subject: {subject}. {feedback} "
                f"Advisor observation: {rng.choice(['reasoning', 'topic coverage', 'examples', 'clarity'])}."
            )
            rows.append({
                "answer_text": answer,
                "subject": subject,
                "subject_score": score,
                "advisor_report": advisor_report,
                "development_label": label,
            })
    rng.shuffle(rows)
    return rows

def main():
    rows = make_rows()
    with OUTPUT.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=[
            "answer_text", "subject", "subject_score", "advisor_report", "development_label"
        ])
        writer.writeheader()
        writer.writerows(rows)
    print(f"Generated {len(rows)} synthetic examples: {OUTPUT}")
    print("Labels:", ", ".join(LEVELS))
    print("WARNING: synthetic-data metrics are not real-world validation.")

if __name__ == "__main__":
    main()
