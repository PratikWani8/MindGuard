import numpy as np


def _trend(values: list[float], higher_is_better: bool = True) -> str:
    if len(values) < 2:
        return "insufficient_data"
    x = np.arange(len(values), dtype=float)
    slope = float(np.polyfit(x, np.asarray(values, dtype=float), 1)[0])
    mean = max(abs(float(np.mean(values))), 1.0)
    relative = slope / mean

    if abs(relative) < 0.06:
        return "stable"
    improving = slope > 0 if higher_is_better else slope < 0
    return "improving" if improving else ("declining" if higher_is_better else "increasing")


def analyze_trends(checkins: list[dict]) -> dict:
    if len(checkins) < 2:
        return {
            "moodTrend": "insufficient_data",
            "stressTrend": "insufficient_data",
            "sleepTrend": "insufficient_data",
            "energyTrend": "insufficient_data",
            "focusTrend": "insufficient_data",
            "pattern": "insufficient_data",
            "confidence": 0.0,
            "supportLevel": "stable",
            "signals": ["At least two check-ins are needed for a trend."],
        }

    mood = [float(x["mood"]) for x in checkins]
    stress = [float(x["stressLevel"]) for x in checkins]
    sleep = [float(x["sleepHours"]) for x in checkins]
    energy = [float(x["energyLevel"]) for x in checkins]
    focus = [float(x["focusLevel"]) for x in checkins]

    mood_t = _trend(mood, True)
    stress_t = _trend(stress, False)
    sleep_t = _trend(sleep, True)
    energy_t = _trend(energy, True)
    focus_t = _trend(focus, True)

    recent = checkins[-1]
    previous = checkins[-2]
    sudden = (
        abs(recent["stressLevel"] - previous["stressLevel"]) >= 3
        or abs(recent["mood"] - previous["mood"]) >= 2
        or abs(recent["sleepHours"] - previous["sleepHours"]) >= 2
    )

    if stress_t == "increasing" and sleep_t == "declining":
        pattern = "increasing_stress"
    elif mood_t == "declining" and energy_t == "declining":
        pattern = "declining_wellbeing_signals"
    elif sudden:
        pattern = "sudden_change"
    elif any(t == "improving" for t in [mood_t, sleep_t, energy_t, focus_t]) and stress_t != "increasing":
        pattern = "improving"
    else:
        pattern = "mixed_or_stable"

    points = 0
    signals = []
    if stress_t == "increasing":
        points += 2; signals.append("increasing stress trend")
    if mood_t == "declining":
        points += 2; signals.append("declining mood trend")
    if sleep_t == "declining":
        points += 2; signals.append("declining sleep trend")
    if sudden:
        points += 2; signals.append("sudden change in recent check-in")

    if points >= 5:
        support = "elevated"
    elif points >= 2:
        support = "needs_attention"
    else:
        support = "stable"

    confidence = min(0.95, 0.55 + 0.04 * len(checkins) + 0.04 * points)

    return {
        "moodTrend": mood_t,
        "stressTrend": stress_t,
        "sleepTrend": sleep_t,
        "energyTrend": energy_t,
        "focusTrend": focus_t,
        "pattern": pattern,
        "confidence": round(confidence, 2),
        "supportLevel": support,
        "signals": signals,
    }
