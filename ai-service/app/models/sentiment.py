from transformers import pipeline


class SentimentModel:
    def __init__(self, model_name: str):
        self.pipeline = pipeline("sentiment-analysis", model=model_name)

    def analyze(self, text: str) -> dict:
        result = self.pipeline(text[:5000], truncation=True, max_length=512)[0]
        return {
            "label": result["label"].lower(),
            "score": round(float(result["score"]), 3),
        }
