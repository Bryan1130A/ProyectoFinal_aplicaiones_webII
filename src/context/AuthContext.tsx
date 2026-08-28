import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import type { LoginRequest, RegisterRequest } from '../types/Auth';
import type { User } from '../types/User';
import { authService } from '../services/authService';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    (async () => {
      const storedUser = await authService.getSessionUser();
      setUser(storedUser);
      setIsInitializing(false);
    })();
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    const loggedInUser = await authService.login(credentials);
    setUser(loggedInUser);
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const newUser = await authService.register(data);
    setUser(newUser);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const refreshUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, isInitializing, login, register, logout, refreshUser }),
    [user, isInitializing, login, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}
