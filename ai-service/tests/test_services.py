from app.models.risk import RiskFeatures, classify_support_level
from app.services.recommendation_service import generate_recommendations
from app.services.trend_service import analyze_trends
from app.utils.safety import classify_safety


def test_support_classifier_is_transparent():
    result = classify_support_level(RiskFeatures(stress=9, sleep_hours=4, mood=2))
    assert result["supportLevel"] in {"elevated", "urgent_support"}
    assert result["signals"]


def test_recommendations():
    result = generate_recommendations(stress=8, sleep_hours=5, energy=2)
    assert len(result) >= 2


def test_safety_classifier():
    result = classify_safety("I am having a difficult day.")
    assert not result["high_risk"]


def test_trend_insufficient_data():
    result = analyze_trends([])
    assert result["pattern"] == "insufficient_data"
