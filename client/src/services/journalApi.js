import api, { USE_MOCKS, delay } from "./api";
import { journals } from "../data/mockData";

export async function fetchJournals() {
  if (USE_MOCKS) {
    await delay(500);
    return journals;
  }
  const { data } = await api.get("/journals");
  return data;
}

export async function fetchJournalById(id) {
  if (USE_MOCKS) {
    await delay(400);
    return journals.find((j) => j.id === id) || null;
  }
  const { data } = await api.get(`/journals/${id}`);
  return data;
}

export async function createJournal(payload) {
  if (USE_MOCKS) {
    await delay(700);
    return { id: "j_" + Date.now(), analyzed: false, date: new Date().toISOString().slice(0, 10), ...payload };
  }
  const { data } = await api.post("/journals", payload);
  return data;
}

export async function analyzeJournal(id) {
  if (USE_MOCKS) {
    await delay(1400);
    const found = journals.find((j) => j.id === id);
    return found || journals[0];
  }
  const { data } = await api.post(`/journals/${id}/analyze`);
  return data;
}
