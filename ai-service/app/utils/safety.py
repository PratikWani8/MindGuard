import re


# Deliberately broad detection for routing to human support.
# This is a safety gate, not a diagnosis or prediction model.
HIGH_RISK_PATTERNS = [
    r"\bkill myself\b",
    r"\bsuicid(?:e|al)\b",
    r"\bend my life\b",
    r"\btake my own life\b",
    r"\bhurt myself\b",
    r"\bself[- ]harm\b",
    r"\bwant to die\b",
    r"\bdo not want to live\b",
    r"\bcan't go on\b",
    r"\bcannot go on\b",
]

IMMEDIATE_DANGER_PATTERNS = [
    r"\babout to\b.*\bkill myself\b",
    r"\bgoing to\b.*\bkill myself\b",
    r"\bhave a plan\b.*\bsuicide\b",
    r"\btonight\b.*\bsuicide\b",
]


def classify_safety(text: str) -> dict:
    normalized = re.sub(r"\s+", " ", text.lower()).strip()
    high_risk = any(re.search(p, normalized) for p in HIGH_RISK_PATTERNS)
    immediate = any(re.search(p, normalized) for p in IMMEDIATE_DANGER_PATTERNS)
    return {
        "category": "immediate_danger" if immediate else ("high_risk" if high_risk else "wellness"),
        "high_risk": high_risk,
        "immediate_danger": immediate,
    }
