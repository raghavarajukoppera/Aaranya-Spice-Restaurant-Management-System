"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Role, User } from "@/lib/types";
import { verifyLogin } from "@/lib/auth";

interface AuthContextValue {
  user: User | null;
  isHydrated: boolean;
  login: (username: string, password: string, expectedRole?: Role) => User | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "aaranya_spice_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore corrupted storage
    }
    setIsHydrated(true);
  }, []);

  const login = useCallback((username: string, password: string, expectedRole?: Role) => {
    const matched = verifyLogin(username, password, expectedRole);
    if (matched) {
      setUser(matched);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(matched));
    }
    return matched;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isHydrated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
