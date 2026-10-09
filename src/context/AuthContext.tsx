import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import * as authApi from "../api/auth.api";
import { tokenStore } from "../api/client";
import type { LoginInput, RegisterInput, User } from "../types";
interface AuthContextValue { user: User | null; loading: boolean; login: (input: LoginInput) => Promise<void>; register: (input: RegisterInput) => Promise<void>; logout: () => void; }
export const AuthContext = createContext<AuthContextValue | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null); const [loading, setLoading] = useState(true);
  useEffect(() => { if (!tokenStore.get()) { setLoading(false); return; } let cancelled = false; authApi.fetchMe().then((u) => { if (!cancelled) setUser(u); }).catch(() => { tokenStore.clear(); if (!cancelled) setUser(null); }).finally(() => { if (!cancelled) setLoading(false); }); return () => { cancelled = true; }; }, []);
  const acceptSession = useCallback((result: { token: string; user: User }) => { if (!result.token || !result.user.id) throw new Error("The server returned an invalid session"); tokenStore.set(result.token); setUser(result.user); }, []);
  const login = useCallback(async (input: LoginInput) => acceptSession(await authApi.login(input)), [acceptSession]);
  const register = useCallback(async (input: RegisterInput) => acceptSession(await authApi.register(input)), [acceptSession]);
  const logout = useCallback(() => { tokenStore.clear(); setUser(null); }, []);
  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
