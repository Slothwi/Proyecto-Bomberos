import { createContext, useCallback, useMemo, useState, type ReactNode } from "react";
import * as api from "../lib/api";
import type { RegisterPayload, Session, SessionUser } from "../lib/api";

export interface AuthContextValue {
  session: Session | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<Session>;
  register: (payload: RegisterPayload) => Promise<{ message: string; user: SessionUser }>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => api.getSession());

  const login = useCallback(async (email: string, password: string) => {
    const next = await api.login(email, password);
    setSession(next);
    return next;
  }, []);

  const register = useCallback((payload: RegisterPayload) => api.register(payload), []);

  const logout = useCallback(() => {
    api.logout();
    setSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ session, isAuthenticated: session !== null, login, register, logout }),
    [session, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
