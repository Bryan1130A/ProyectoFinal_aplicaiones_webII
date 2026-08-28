import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import type { LoginRequest, RegisterRequest, RegisterResult } from '../types/Auth';
import type { User } from '../types/User';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { supabase } from '../services/supabaseClient';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<RegisterResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const syncUser = useCallback(async (hasSession: boolean) => {
    if (!hasSession) {
      setUser(null);
      setIsAuthenticated(false);
      return;
    }
    const currentUser = await userService.getCurrentUser();
    setUser(currentUser);
    setIsAuthenticated(!!currentUser);
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      await syncUser(!!data.session);
      setIsInitializing(false);
    })();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      syncUser(!!session);
    });

    return () => subscription.subscription.unsubscribe();
  }, [syncUser]);

  const login = useCallback(async (credentials: LoginRequest) => {
    await authService.login(credentials);
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    return authService.register(data);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated, isInitializing, login, register, logout }),
    [user, isAuthenticated, isInitializing, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}
