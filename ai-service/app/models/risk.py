from dataclasses import dataclass


@dataclass
class RiskFeatures:
    mood: float | None = None
    stress: float | None = None
    sleep_hours: float | None = None
    energy: float | None = None
    focus: float | None = None
    negative_sentiment: float = 0.0
    anxiety: float = 0.0
    sadness: float = 0.0
    sudden_change: bool = False
    declining_pattern: bool = False
    explicit_high_risk: bool = False


def classify_support_level(features: RiskFeatures) -> dict:
    """
    Transparent support triage. Not a clinical or diagnostic score.
    Higher points mean more signals warranting human support.
    """
    points = 0
    signals = []

    if features.explicit_high_risk:
        return {
            "supportLevel": "urgent_support",
            "confidence": 0.98,
            "signals": ["explicit high-risk language detected"],
        }

    if features.stress is not None and features.stress >= 8:
        points += 2
        signals.append("high stress")
    elif features.stress is not None and features.stress >= 6:
        points += 1
        signals.append("elevated stress")

    if features.mood is not None and features.mood <= 2:
        points += 2
        signals.append("low mood")
    elif features.mood is not None and features.mood <= 3:
        points += 1
        signals.append("reduced mood")

    if features.sleep_hours is not None and features.sleep_hours < 5:
        points += 2
        signals.append("low sleep duration")
    elif features.sleep_hours is not None and features.sleep_hours < 6:
        points += 1
        signals.append("reduced sleep duration")

    if features.energy is not None and features.energy <= 2:
        points += 1
        signals.append("low energy")

    if features.focus is not None and features.focus <= 2:
        points += 1
        signals.append("low focus")

    if features.negative_sentiment >= 0.75:
        points += 1
        signals.append("strongly negative sentiment")
    if features.anxiety >= 0.75:
        points += 1
        signals.append("strong anxiety-related language")
    if features.sadness >= 0.75:
        points += 1
        signals.append("strong sadness-related language")
    if features.sudden_change:
        points += 2
        signals.append("sudden change from recent baseline")
    if features.declining_pattern:
        points += 2
        signals.append("declining recent trend")

    if points >= 7:
        level = "urgent_support"
    elif points >= 5:
        level = "elevated"
    elif points >= 2:
        level = "needs_attention"
    else:
        level = "stable"

    confidence = min(0.98, 0.55 + 0.06 * min(points, 7))
    return {
        "supportLevel": level,
        "confidence": round(confidence, 2),
        "signals": signals,
    }
