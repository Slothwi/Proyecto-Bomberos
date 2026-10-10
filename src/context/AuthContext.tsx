import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import * as api from "../lib/api";
import { AUTH_EXPIRED_EVENT } from "../lib/api";
import type { RegisterPayload, Session, UsuarioRow } from "../lib/api";

export interface AuthContextValue {
  session: Session | null;
  isAuthenticated: boolean;
  expiredTick: number;
  login: (email: string, password: string) => Promise<Session>;
  register: (payload: RegisterPayload) => Promise<{ message: string; user: UsuarioRow }>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => api.getSession());
  const [expiredTick, setExpiredTick] = useState(0);

  useEffect(() => {
    const onExpired = () => {
      setSession(null);
      setExpiredTick((t) => t + 1);
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
  }, []);

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
    () => ({ session, isAuthenticated: session !== null, expiredTick, login, register, logout }),
    [session, expiredTick, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
