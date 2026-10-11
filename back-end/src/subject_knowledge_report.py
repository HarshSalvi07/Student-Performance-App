from subject_knowledge_model import SubjectKnowledgeModel


def generate_subject_knowledge_report(ocr_text: str, subject: str) -> str:
    """
    Generate a subject-knowledge scoring report from OCR text.
    Returns the report as a Markdown string.
    """

    model = SubjectKnowledgeModel()

    scoring_result = model.assess(
        ocr_text=ocr_text,
        subject=subject
    )

    topic_ratings = scoring_result.get("topic_ratings", {})

    topics_output = "\n".join(
        f"- **{topic}:** "
        f"{details.get('score', 'N/A')}/100 — "
        f"{details.get('rating', 'Not rated')}"
        for topic, details in topic_ratings.items()
    ) or "- No topic ratings available."

    recommendations_output = "\n".join(
        f"- {item}"
        for item in scoring_result.get("recommendations", [])
    ) or "- No recommendations available."

    limitations_output = "\n".join(
        f"- {item}"
        for item in scoring_result.get("limitations", [])
    ) or "- No limitations provided."

    report = f"""
---

# Answer Knowledge Scoring

- **Subject:** {scoring_result.get('subject', subject)}
- **Overall Knowledge Score:** {scoring_result.get('overall_knowledge_score', 0)}/100
- **Overall Rating:** {scoring_result.get('overall_rating', 'Not available')}

## Topic Ratings

{topics_output}

## Recommendations

{recommendations_output}

## Assessment Summary

{scoring_result.get('overall_summary', 'No summary available.')}

## Limitations

{limitations_output}

> **Note:** This is a rule-based heuristic estimate, not verified factual grading or an official exam mark.
"""

    return report