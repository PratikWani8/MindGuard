import os


SAFETY_RESPONSE = (
    "I’m really sorry you’re dealing with this. You deserve immediate human support. "
    "Please contact your local emergency service or a crisis service in your area now, "
    "and if possible tell a trusted person nearby what is happening. "
    "If you are in immediate danger, move to a safer place and stay with another person. "
    "I’m an AI wellness assistant, so I can’t provide emergency care."
)


class ChatService:
    def __init__(self, rag_service):
        self.rag = rag_service

    def _local_response(self, message: str, contexts: list[dict]) -> str:
        if contexts:
            return (
                "Here is a grounded starting point from the MindGuard knowledge base: "
                + contexts[0]["text"][:900]
                + "\n\nI’m an AI wellness assistant, not a therapist or doctor. "
                "For personal or persistent concerns, consider speaking with a qualified professional or someone you trust."
            )
        return (
            "It sounds like this is weighing on you. A small next step could be to pause, "
            "take a few slow breaths, and identify one thing you can control right now. "
            "If these concerns persist or feel difficult to manage, consider talking with someone you trust "
            "or a qualified mental-health professional. I’m an AI wellness assistant, not a therapist or doctor."
        )

    def _llm_response(self, message: str, contexts: list[dict]) -> str | None:
        provider = os.getenv("AI_PROVIDER", "local").lower()
        api_key = os.getenv("LLM_API_KEY", "")
        model = os.getenv("LLM_MODEL", "")
        if provider != "openai" or not api_key or not model:
            return None

        try:
            from openai import OpenAI
            client = OpenAI(api_key=api_key)
            context = "\n\n".join(
                f"[{c['title']}] {c['text']}" for c in contexts
            )
            prompt = f"""
You are MindGuard, an AI mental wellness support assistant.
Be empathetic, concise, non-judgmental, non-diagnostic, and transparent that you are AI.
Do not claim to be a therapist or doctor. Do not invent sources.
Use only the supplied knowledge context for factual educational claims.

Knowledge context:
{context or "No relevant knowledge-base context was retrieved."}

User:
{message}
"""
            response = client.chat.completions.create(
                model=model,
                temperature=0.2,
                messages=[
                    {"role": "system", "content": prompt},
                    {"role": "user", "content": message},
                ],
            )
            return response.choices[0].message.content
        except Exception:
            return None

    def respond(self, message: str, conversation: list[dict], safety: dict) -> dict:
        if safety["high_risk"]:
            return {
                "answer": SAFETY_RESPONSE,
                "sources": [],
                "safetyCategory": safety["category"],
            }

        contexts = self.rag.retrieve(message)
        answer = self._llm_response(message, contexts) or self._local_response(message, contexts)

        return {
            "answer": answer,
            "sources": [
                {"title": c["title"], "source": c["source"]}
                for c in contexts
            ],
            "safetyCategory": "wellness",
        }
