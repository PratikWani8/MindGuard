import api, { USE_MOCKS, delay } from "./api";
import { mockUser } from "../data/mockData";

export async function loginRequest({ email, password }) {
  if (USE_MOCKS) {
    await delay(700);
    if (!email || !password) throw new Error("Email and password are required.");
    return { token: "mock_token_" + Date.now(), user: { ...mockUser, email } };
  }
  const { data } = await api.post("/auth/login", { email, password });
  return data;
}

export async function registerRequest({ name, email, password, age }) {
  if (USE_MOCKS) {
    await delay(800);
    return { token: "mock_token_" + Date.now(), user: { ...mockUser, name, email, age } };
  }
  const { data } = await api.post("/auth/register", { name, email, password, age });
  return data;
}

export async function fetchCurrentUser() {
  if (USE_MOCKS) {
    await delay(300);
    return mockUser;
  }
  const { data } = await api.get("/users/me");
  return data;
}

export function logoutRequest() {
  localStorage.removeItem("mindguard_token");
}
