import { useEffect, useState } from "react";
import { api, saveToken, clearToken, getToken } from "@/services/apiClient";

interface User {
  id: string;
  email: string;
  created_at?: string;
  [key: string]: unknown;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(true);

  // Check authentication when app loads
  useEffect(() => {
    const token = getToken();

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get<{ user: User }>("/api/auth/me")
      .then((data) => {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      })
      .catch(() => {
        clearToken();
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // SIGN UP
  const signUp = async (email: string, password: string) => {
    try {
      const data = await api.post<{ token: string; user: User }>(
        "/api/auth/signup",
        { email, password }
      );

      saveToken(data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      return { error: null };
    } catch (err) {
      return { error: { message: err.message || "Signup failed" } };
    }
  };

  // SIGN IN
  const signIn = async (email: string, password: string) => {
    try {
      const data = await api.post<{ token: string; user: User }>(
        "/api/auth/login",
        { email, password }
      );

      console.log(data);

      saveToken(data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      return { error: null };
    } catch (err) {
      return { error: { message: err.message || "Login failed" } };
    }
  };

  // SIGN OUT
  const signOut = () => {
    clearToken();
    localStorage.removeItem("user");
    setUser(null);
  };

  return {
    user,
    session: user ? { user } : null,
    loading,
    signUp,
    signIn,
    signOut,
  };
}