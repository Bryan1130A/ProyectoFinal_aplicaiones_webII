import axios from 'axios';
import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '../config/api.config';
import { clearSession, getToken } from '../utils/storage';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
});

// Se registra desde AuthContext para poder cerrar sesión y volver al Login
// automáticamente cuando el backend responde 401 (token inválido o expirado).
let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void): void {
  onUnauthorized = handler;
}

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      await clearSession();
      onUnauthorized?.();
    }
    return Promise.reject(error);
  }
);
