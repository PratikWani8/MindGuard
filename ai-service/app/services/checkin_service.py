from app.models.risk import RiskFeatures, classify_support_level
from app.services.recommendation_service import generate_recommendations


def wellbeing_score(mood, stress, energy, sleep_hours, sleep_quality, focus) -> float:
    # Explainable, non-clinical index normalized to 0-100.
    mood_n = (mood - 1) / 4 * 100
    stress_n = (10 - stress) / 9 * 100
    energy_n = (energy - 1) / 9 * 100
    sleep_duration_n = min(max(sleep_hours / 8, 0), 1) * 100
    sleep_quality_n = (sleep_quality - 1) / 4 * 100
    focus_n = (focus - 1) / 9 * 100

    score = (
        0.22 * mood_n
        + 0.22 * stress_n
        + 0.15 * energy_n
        + 0.15 * sleep_duration_n
        + 0.11 * sleep_quality_n
        + 0.15 * focus_n
    )
    return round(max(0, min(100, score)), 1)


def analyze_checkin(data, safety_signal=False):
    score = wellbeing_score(
        data.mood, data.stressLevel, data.energyLevel,
        data.sleepHours, data.sleepQuality, data.focusLevel
    )

    support = classify_support_level(RiskFeatures(
        mood=data.mood,
        stress=data.stressLevel,
        sleep_hours=data.sleepHours,
        energy=data.energyLevel,
        focus=data.focusLevel,
        explicit_high_risk=safety_signal,
    ))

    mood_indicator = "low" if data.mood <= 2 else "moderate" if data.mood <= 3 else "positive"
    stress_indicator = "high" if data.stressLevel >= 7 else "moderate" if data.stressLevel >= 4 else "low"
    sleep_indicator = "low" if data.sleepHours < 6 or data.sleepQuality <= 2 else "adequate"

    recommendations = generate_recommendations(
        mood=data.mood,
        stress=data.stressLevel,
        sleep_hours=data.sleepHours,
        energy=data.energyLevel,
        focus=data.focusLevel,
    )

    return {
        "wellbeingScore": score,
        "scoreExplanation": "A transparent, non-clinical index combining mood, stress, energy, sleep duration/quality, and focus. Higher values indicate more favorable self-reported wellbeing signals.",
        "moodIndicator": mood_indicator,
        "stressIndicator": stress_indicator,
        "sleepIndicator": sleep_indicator,
        "supportLevel": support["supportLevel"],
        "supportConfidence": support["confidence"],
        "signals": support["signals"],
        "recommendations": recommendations,
    }
