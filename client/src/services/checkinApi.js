import api, { USE_MOCKS, delay } from "./api";
import { moodTrend7d, moodTrend30d } from "../data/mockData";

export async function submitCheckin(payload) {
  if (USE_MOCKS) {
    await delay(900);
    return { id: "chk_" + Date.now(), ...payload, submittedAt: new Date().toISOString() };
  }
  const { data } = await api.post("/checkins", payload);
  return data;
}

export async function fetchTodayCheckin() {
  if (USE_MOCKS) {
    await delay(300);
    return null; // null => user hasn't checked in today yet
  }
  const { data } = await api.get("/checkins/today");
  return data;
}

export async function fetchMoodTrend(range = "7d") {
  if (USE_MOCKS) {
    await delay(500);
    return range === "30d" ? moodTrend30d : moodTrend7d;
  }
  const { data } = await api.get(`/checkins/trend`, { params: { range } });
  return data;
}
