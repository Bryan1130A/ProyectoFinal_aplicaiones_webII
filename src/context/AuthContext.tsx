import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import type { LoginRequest } from '../types/Auth';
import type { User } from '../types/User';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { setUnauthorizedHandler } from '../services/api';
import { saveUser, getUser } from '../utils/storage';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
      setIsAuthenticated(false);
    });
  }, []);

  useEffect(() => {
    (async () => {
      const alreadyAuthenticated = await authService.isAuthenticated();
      if (alreadyAuthenticated) {
        const storedUser = await getUser();
        setUser(storedUser);
        setIsAuthenticated(true);
      }
      setIsInitializing(false);
    })();
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    const response = await authService.login(credentials);
    let resolvedUser: User = {
      email: response.email ?? credentials.email,
      nombre: response.nombre,
      rol: response.rol,
    };

    const remoteUser = await userService.getCurrentUser();
    if (remoteUser) {
      resolvedUser = remoteUser;
    }

    await saveUser(resolvedUser);
    setUser(resolvedUser);
    setIsAuthenticated(true);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated, isInitializing, login, logout }),
    [user, isAuthenticated, isInitializing, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}
