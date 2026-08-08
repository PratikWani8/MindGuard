const base = () => (process.env.AI_SERVICE_URL || "http://localhost:8000").replace(/\/$/, "");

async function post(path, payload) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(`${base()}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    const text = await response.text();
    let data = {};
    try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
    if (!response.ok) {
      const err = new Error(data.message || `AI service returned ${response.status}`);
      err.statusCode = 502;
      throw err;
    }
    return data;
  } finally {
    clearTimeout(timeout);
  }
}

export const analyzeJournal = (payload) => post("/api/v1/analyze/journal", payload);
export const analyzeCheckIn = (payload) => post("/api/v1/analyze/checkin", payload);
export const chatWithAI = (payload) => post("/api/v1/chat", payload);