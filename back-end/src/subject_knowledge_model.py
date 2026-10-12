import re
import math
from collections import Counter, defaultdict


class SubjectKnowledgeModel:
    """
    Rule-based subject knowledge evaluator.

    Uses OCR text and measurable text features to estimate answer quality.
    It does not use a pretrained model, external API, or reference answers.
    """

    SUBJECT_TERMS = {
        "computer science": [
            "algorithm", "database", "variable", "function", "class",
            "object", "program", "data", "loop", "array", "memory",
            "network", "software", "hardware", "compiler", "system",
            "complexity", "recursion", "inheritance", "polymorphism",
        ],
        "mathematics": [
            "equation", "formula", "theorem", "function", "variable",
            "matrix", "derivative", "integral", "probability", "angle",
            "fraction", "polynomial", "geometry", "algebra", "proof",
        ],
        "physics": [
            "force", "energy", "velocity", "acceleration", "motion",
            "gravity", "mass", "momentum", "current", "voltage",
            "resistance", "frequency", "wavelength", "power", "pressure",
        ],
        "chemistry": [
            "atom", "molecule", "element", "compound", "reaction",
            "electron", "proton", "bond", "acid", "base", "solution",
            "oxidation", "reduction", "catalyst", "molarity",
        ],
        "biology": [
            "cell", "tissue", "organ", "organism", "gene", "protein",
            "enzyme", "photosynthesis", "respiration", "evolution",
            "ecosystem", "bacteria", "reproduction", "nucleus",
        ],
    }

    EXPLANATION_WORDS = {
        "because", "therefore", "however", "thus", "hence",
        "consequently", "for example", "such as", "firstly",
        "secondly", "finally", "in addition", "as a result",
        "which", "whereas", "since",
    }

    QUESTION_PATTERN = re.compile(
        r"(?im)^\s*(?:question\s*)?(?:q\s*)?\d{1,2}"
        r"\s*[\).:\-]"
    )

    def __init__(self, subject_terms=None):
        self.custom_terms = [
            term.lower() for term in (subject_terms or [])
        ]

    def _get_terms(self, subject):
        subject = subject.lower().strip()

        for name, terms in self.SUBJECT_TERMS.items():
            if name in subject or subject in name:
                return set(terms) | set(self.custom_terms)

        return set(self.custom_terms)

    @staticmethod
    def _clean_text(text):
        text = text.lower()
        text = re.sub(r"[^\w\s.,;:!?%+\-=/()]", " ", text)
        return re.sub(r"\s+", " ", text).strip()

    def _score_answer(self, answer, subject_terms):
        words = re.findall(r"\b[a-zA-Z]+\b", answer.lower())
        word_count = len(words)

        if word_count == 0:
            return {
                "score": 0,
                "word_count": 0,
                "subject_term_count": 0,
                "explanation_count": 0,
                "details": "No readable answer was detected.",
            }

        unique_words = set(words)
        subject_matches = {
            term for term in subject_terms
            if re.search(
                r"\b" + re.escape(term) + r"\b",
                answer.lower()
            )
        }

        explanation_count = sum(
            answer.lower().count(phrase)
            for phrase in self.EXPLANATION_WORDS
        )

        # 1. Answer depth: rewards a developed answer, with a cap.
        length_score = min(word_count / 80, 1.0) * 30

        # 2. Vocabulary variety: measures repeated versus varied wording.
        vocabulary_score = (
            len(unique_words) / max(word_count, 1)
        ) * 15

        # 3. Subject terminology: measures detected domain vocabulary.
        terminology_score = min(len(subject_matches) / 5, 1.0) * 25

        # 4. Explanatory language: rewards signs of reasoning.
        explanation_score = min(explanation_count / 3, 1.0) * 15

        # 5. Structure: rewards sentences and organized presentation.
        sentence_count = len(
            [s for s in re.split(r"[.!?]+", answer) if s.strip()]
        )
        structure_score = min(sentence_count / 4, 1.0) * 15

        total = (
            length_score
            + vocabulary_score
            + terminology_score
            + explanation_score
            + structure_score
        )

        # Very short responses cannot receive a high score from
        # vocabulary or punctuation alone.
        if word_count < 5:
            total = min(total, 10)
        elif word_count < 15:
            total = min(total, 35)

        return {
            "score": round(max(0, min(total, 100)), 2),
            "word_count": word_count,
            "subject_term_count": len(subject_matches),
            "matched_terms": sorted(subject_matches),
            "explanation_count": explanation_count,
            "sentence_count": sentence_count,
            "details": (
                "Heuristic estimate based on length, vocabulary, "
                "subject terminology, explanation, and structure."
            ),
        }

    @staticmethod
    def _rating(score):
        if score >= 80:
            return "Strong indicators"
        elif score >= 60:
            return "Moderate indicators"
        elif score >= 40:
            return "Developing"
        else:
            return "Limited indicators"

    def assess(self, ocr_text, subject):
        if not isinstance(ocr_text, str) or not ocr_text.strip():
            raise ValueError("OCR text is empty.")

        if not isinstance(subject, str) or not subject.strip():
            raise ValueError("Please provide a subject.")

        subject_terms = self._get_terms(subject)
        cleaned = ocr_text.strip()

        # Split at numbered question labels when OCR preserves them.
        matches = list(self.QUESTION_PATTERN.finditer(cleaned))
        answers = []

        if matches:
            for index, match in enumerate(matches):
                start = match.end()
                end = (
                    matches[index + 1].start()
                    if index + 1 < len(matches)
                    else len(cleaned)
                )
                block = cleaned[start:end].strip()

                if block:
                    answers.append({
                        "question_number": index + 1,
                        "text": block,
                    })
        else:
            # If question numbers are not detectable, assess the text
            # as one document rather than inventing question boundaries.
            answers.append({
                "question_number": 1,
                "text": cleaned,
            })

        question_results = []

        for item in answers:
            result = self._score_answer(
                item["text"], subject_terms
            )
            question_results.append({
                "question_number": item["question_number"],
                **result,
            })

        scores = [item["score"] for item in question_results]
        overall_score = round(sum(scores) / len(scores), 2)

        # Group scores by detected subject terminology.
        topic_scores = defaultdict(list)

        for item in question_results:
            matched = item.get("matched_terms", [])

            if matched:
                for term in matched:
                    topic_scores[term].append(item["score"])
            else:
                topic_scores["General subject knowledge"].append(
                    item["score"]
                )

        topic_ratings = {}

        for topic, values in sorted(topic_scores.items()):
            topic_score = round(sum(values) / len(values), 2)
            topic_ratings[topic] = {
                "score": topic_score,
                "rating": self._rating(topic_score),
                "observations": len(values),
            }

        recommendations = []

        average_words = sum(
            item["word_count"] for item in question_results
        ) / len(question_results)

        if average_words < 20:
            recommendations.append(
                "Practise writing more complete, developed answers."
            )

        if subject_terms and not any(
            item.get("matched_terms") for item in question_results
        ):
            recommendations.append(
                "Review subject-specific terminology and verify "
                "that OCR captured the answers correctly."
            )

        if not recommendations:
            recommendations.append(
                "Review the answers manually and practise explaining "
                "concepts with accurate examples and reasoning."
            )

        return {
            "subject": subject,
            "overall_knowledge_score": overall_score,
            "overall_rating": self._rating(overall_score),
            "topic_ratings": topic_ratings,
            "questions": question_results,
            "overall_summary": (
                "This score estimates answer development and detected "
                "subject vocabulary. It does not establish correctness."
            ),
            "recommendations": recommendations,
            "assessment_type": "Rule-based heuristic; not official grading",
            "limitations": [
                "No reference answers or factual correctness checking.",
                "OCR errors can affect every score.",
                "Question splitting depends on recognizable numbering.",
                "Topic ratings are based on matched terms, not verified "
                "conceptual understanding.",
                "The score is not a calibrated probability or exam mark.",
            ],
        }
