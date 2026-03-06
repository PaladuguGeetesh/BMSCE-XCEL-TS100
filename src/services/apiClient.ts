// Core API helper - reads JWT from localStorage, no Supabase at all

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const TOKEN_KEY = "expense_tracker_token";

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || "API request failed");
  }

  return data as T;
}

export const api = {
  get:    <T>(endpoint: string)                => apiFetch<T>(endpoint),
  post:   <T>(endpoint: string, body: unknown) => apiFetch<T>(endpoint, { method: "POST",   body: JSON.stringify(body) }),
  put:    <T>(endpoint: string, body: unknown) => apiFetch<T>(endpoint, { method: "PUT",    body: JSON.stringify(body) }),
  delete: <T>(endpoint: string)                => apiFetch<T>(endpoint, { method: "DELETE" }),
};
