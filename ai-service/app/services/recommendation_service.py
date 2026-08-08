def generate_recommendations(
    mood=None,
    stress=None,
    sleep_hours=None,
    energy=None,
    focus=None,
    emotions=None,
    trends=None,
) -> list[str]:
    recommendations = []

    if stress is not None and stress >= 7:
        recommendations += [
            "Try a short paced-breathing or grounding exercise.",
            "Break the next task into a small, realistic step and take a brief recovery break.",
        ]
    if sleep_hours is not None and sleep_hours < 6:
        recommendations += [
            "Aim for a consistent sleep and wake schedule.",
            "Consider reducing late-night screen exposure and using a relaxing wind-down activity.",
        ]
    if energy is not None and energy <= 3:
        recommendations += [
            "Take a brief movement or hydration break.",
            "Give yourself permission to schedule a reasonable recovery period.",
        ]
    if focus is not None and focus <= 3:
        recommendations.append("Try a short focused work block with fewer distractions.")
    if mood is not None and mood <= 2:
        recommendations.append("Consider talking with someone you trust about how you have been feeling.")

    if trends:
        if trends.get("stressTrend") == "increasing":
            recommendations.append("Your recent stress trend is increasing; consider reviewing workload and recovery time.")
        if trends.get("sleepTrend") == "declining":
            recommendations.append("Your recent sleep trend is declining; prioritize a consistent rest routine.")

    if not recommendations:
        recommendations = [
            "Keep checking in with yourself and maintain routines that support rest, connection, and recovery.",
            "If something has been weighing on you, consider discussing it with a trusted person.",
        ]

    # Stable ordering and no duplicates.
    return list(dict.fromkeys(recommendations))[:6]
