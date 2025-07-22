"use client";

import type { AuthState } from "@/utils/models";

import { useState } from "react";
import { apiFetch } from "@/utils/api";
import { INAT_NETWORKS_JWT_TOKEN_KEY } from "@/lib/constants";

const setStoredToken = (token: string): void => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(INAT_NETWORKS_JWT_TOKEN_KEY, token);
};

const removeStoredToken = (): void => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(INAT_NETWORKS_JWT_TOKEN_KEY);
};

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  const login = async (
    username: string,
    password: string
  ): Promise<{ success: true } | { success: false; error: string }> => {
    try {
      const response = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        if (data.token) setStoredToken(data.token);
        setAuthState({
          user: { username: data.user.username, role: data.user.role },
          isAuthenticated: true,
        });
        return { success: true };
      } else {
        return { success: false, error: data.error || "Login failed" };
      }
    } catch {
      return { success: false, error: "Network error" };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      removeStoredToken();
      setAuthState({
        user: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return { login, logout, authState };
}
