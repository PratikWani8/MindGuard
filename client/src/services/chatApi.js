import api, { USE_MOCKS, delay } from "./api";

const mockReplies = [
  {
    text:
      "Looking at your recent check-ins, stress has been climbing for about four days alongside less sleep. That combination often makes concentration harder — a short breathing break before study sessions can help interrupt the spiral.",
    sources: ["MindGuard Wellness Library — Stress & Sleep", "APA — Stress effects on the body"],
  },
  {
    text:
      "Here's a short breathing exercise you can try right now: inhale for 4 seconds, hold for 7, exhale slowly for 8. Repeat this four times. It activates your parasympathetic nervous system and can lower physical stress within minutes.",
    sources: ["MindGuard Wellness Library — Breathing techniques"],
  },
  {
    text:
      "A healthier study routine usually balances focused blocks with real recovery. Try 45 minutes of focused work, then a 10-minute break away from your desk. Protect at least 7 hours for sleep — it's one of the strongest predictors of next-day focus in your recent entries.",
    sources: ["MindGuard Wellness Library — Study & focus habits"],
  },
];

export async function sendChatMessage(message, history = []) {
  if (USE_MOCKS) {
    await delay(1200);
    const reply = mockReplies[history.length % mockReplies.length];
    return { role: "assistant", ...reply, id: "m_" + Date.now() };
  }
  const { data } = await api.post("/chat", { message, history });
  return data;
}
