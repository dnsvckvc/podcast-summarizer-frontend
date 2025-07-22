import { INAT_NETWORKS_JWT_TOKEN_KEY, API_BASE_URL } from "@/lib/constants";

const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(INAT_NETWORKS_JWT_TOKEN_KEY);
};

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
};
