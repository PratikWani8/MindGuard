from transformers import pipeline


TARGETS = ("anxiety", "stress", "sadness", "anger", "joy")


class EmotionModel:
    """
    Maps a general emotion classifier into MindGuard's stable response schema.
    The mapping is intentionally approximate and is not a clinical assessment.
    """

    def __init__(self, model_name: str):
        self.pipeline = pipeline(
            "text-classification",
            model=model_name,
            top_k=None,
        )

    def analyze(self, text: str) -> dict:
        raw = self.pipeline(text[:5000], truncation=True, max_length=512)
        scores = {k: 0.0 for k in TARGETS}

        # Transformers can return [[...]] or [...]
        items = raw[0] if raw and isinstance(raw[0], list) else raw
        for item in items:
            label = str(item["label"]).lower()
            value = float(item["score"])
            if label in {"anxiety", "fear"}:
                scores["anxiety"] = max(scores["anxiety"], value)
            elif label in {"stress", "disgust"}:
                scores["stress"] = max(scores["stress"], value)
            elif label in {"sadness"}:
                scores["sadness"] = max(scores["sadness"], value)
            elif label in {"anger"}:
                scores["anger"] = max(scores["anger"], value)
            elif label in {"joy", "happiness"}:
                scores["joy"] = max(scores["joy"], value)

        return {k: round(v, 3) for k, v in scores.items()}
