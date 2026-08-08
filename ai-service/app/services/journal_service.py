from app.config import get_settings
from app.models.risk import RiskFeatures, classify_support_level
from app.services.recommendation_service import generate_recommendations
from app.utils.safety import classify_safety
from app.utils.text import extract_topics, validate_text


def analyze_journal(text: str, sentiment_model, emotion_model) -> dict:
    settings = get_settings()
    text = validate_text(text, settings.max_text_length)

    sentiment = sentiment_model.analyze(text)
    emotions = emotion_model.analyze(text)
    safety = classify_safety(text)
    topics = extract_topics(text)

    stress_indicators = topics.copy()
    if emotions["anxiety"] >= 0.6:
        stress_indicators.append("anxiety-related language")
    if emotions["stress"] >= 0.6:
        stress_indicators.append("stress-related language")

    support = classify_support_level(RiskFeatures(
        negative_sentiment=sentiment["score"] if sentiment["label"] == "negative" else 0,
        anxiety=emotions["anxiety"],
        sadness=emotions["sadness"],
        explicit_high_risk=safety["high_risk"],
    ))

    insights = []
    if topics:
        insights.append(f"Recent text indicates themes related to {', '.join(topics[:2])}.")
    if emotions["stress"] >= 0.6 or emotions["anxiety"] >= 0.6:
        insights.append("The text contains elevated stress or anxiety-related language.")
    if not insights:
        insights.append("The text does not show a strong single stress theme in this analysis.")

    recommendations = generate_recommendations(
        stress=8 if emotions["stress"] >= 0.7 else 5 if emotions["stress"] >= 0.45 else 2,
        emotions=emotions,
    )

    return {
        "sentiment": sentiment,
        "emotions": emotions,
        "topics": topics,
        "stressIndicators": list(dict.fromkeys(stress_indicators))[:6],
        "supportLevel": support["supportLevel"],
        "supportConfidence": support["confidence"],
        "signals": support["signals"],
        "insights": insights,
        "recommendations": recommendations,
        "safetyCategory": safety["category"],
    }
