import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { loginRequest, registerRequest, fetchCurrentUser, logoutRequest } from "../services/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("mindguard_token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetchCurrentUser()
      .then(setUser)
      .catch(() => localStorage.removeItem("mindguard_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (credentials) => {
    const { token, user: u } = await loginRequest(credentials);
    localStorage.setItem("mindguard_token", token);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (payload) => {
    const { token, user: u } = await registerRequest(payload);
    localStorage.setItem("mindguard_token", token);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    logoutRequest();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
