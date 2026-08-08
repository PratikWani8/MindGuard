import api, { USE_MOCKS, delay } from "./api";
import {
  wellbeingStatus,
  wellbeingScore,
  aiInsightOfDay,
  detectedThemes,
  emotionDistribution,
  commonTriggers,
} from "../data/mockData";

export async function fetchWellbeingStatus() {
  if (USE_MOCKS) {
    await delay(500);
    return { ...wellbeingStatus, score: wellbeingScore };
  }
  const { data } = await api.get("/insights/status");
  return data;
}

export async function fetchDailyInsight() {
  if (USE_MOCKS) {
    await delay(450);
    return aiInsightOfDay;
  }
  const { data } = await api.get("/insights/today");
  return data;
}

export async function fetchThemesAndEmotions() {
  if (USE_MOCKS) {
    await delay(500);
    return { themes: detectedThemes, emotions: emotionDistribution, triggers: commonTriggers };
  }
  const { data } = await api.get("/insights/patterns");
  return data;
}
