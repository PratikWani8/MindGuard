import re


def validate_text(text: str, max_length: int) -> str:
    text = (text or "").strip()
    if not text:
        raise ValueError("text must not be empty")
    if len(text) > max_length:
        raise ValueError(f"text exceeds maximum length of {max_length} characters")
    return text


def extract_topics(text: str) -> list[str]:
    lowered = text.lower()
    rules = {
        "academic pressure": ["exam", "exams", "study", "college", "assignment", "grades", "academic"],
        "work pressure": ["work", "job", "deadline", "boss", "office", "workload"],
        "sleep concerns": ["sleep", "insomnia", "tired", "awake", "bed"],
        "relationships": ["friend", "family", "relationship", "partner", "breakup"],
        "financial pressure": ["money", "rent", "debt", "financial", "fees"],
        "loneliness": ["lonely", "alone", "isolated"],
    }
    found = []
    for topic, words in rules.items():
        if any(re.search(rf"\b{re.escape(w)}\b", lowered) for w in words):
            found.append(topic)
    return found[:5]
