import { ENDPOINTS } from '../config/api.config';
import type { LoginRequest, LoginResponse } from '../types/Auth';
import { api } from './api';
import { clearSession, getToken, saveToken } from '../utils/storage';

async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>(ENDPOINTS.login, credentials);
  await saveToken(data.token);
  return data;
}

async function logout(): Promise<void> {
  await clearSession();
}

async function isAuthenticated(): Promise<boolean> {
  const token = await getToken();
  return !!token;
}

export const authService = {
  login,
  logout,
  getToken,
  isAuthenticated,
};
