"use client";

import { useState, useCallback, useEffect } from "react";
import { loginUser } from "@/lib/api";
import { saveAuth, clearAuth, getSavedUser } from "@/lib/auth";
import type { LoginResponse } from "@/types/user";

interface AuthState {
  user: LoginResponse | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = getSavedUser();
    if (saved) setUser(saved);
  }, []);

  const login = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await loginUser(username, password);
        saveAuth(data);
        setUser(data);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Login failed");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
  }, []);

  return { user, isLoading, error, login, logout };
}
