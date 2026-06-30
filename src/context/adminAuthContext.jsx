"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { adminLogin as apiLogin, adminLogout as apiLogout } from "@/utils/backendApi/adminApi";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    const savedUser = localStorage.getItem("admin_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("admin_user");
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await apiLogin(email, password);
    if (res.success && res.data) {
      const { token: accessToken, user: userData } = res.data;
      localStorage.setItem("admin_token", accessToken);
      localStorage.setItem("admin_user", JSON.stringify(userData));
      setToken(accessToken);
      setUser(userData);
      return { success: true };
    }
    throw new Error(res.message || "Login failed");
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      // ignore
    }
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!token }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be inside AdminAuthProvider");
  return ctx;
};

export default AdminAuthContext;
