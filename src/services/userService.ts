import { ENDPOINTS } from '../config/api.config';
import type { Balance, User } from '../types/User';
import { api } from './api';
import { decodeJwtPayload } from '../utils/jwt';
import { getToken } from '../utils/storage';

/**
 * Intenta obtener el usuario desde /usuarios/me. Si el backend aún no expone
 * ese endpoint, se cae a leer el email/rol directamente del JWT guardado.
 */
async function getCurrentUser(): Promise<User | null> {
  try {
    const { data } = await api.get<User>(ENDPOINTS.currentUser);
    return data;
  } catch {
    const token = await getToken();
    if (!token) return null;
    const payload = decodeJwtPayload(token);
    if (!payload) return null;
    return {
      email: (payload.email as string) ?? (payload.sub as string) ?? '',
      nombre: payload.nombre as string | undefined,
      rol: (payload.rol as string) ?? (payload.role as string) ?? '',
    };
  }
}

async function getBalance(): Promise<number> {
  const { data } = await api.get<Balance | number>(ENDPOINTS.balance);
  if (typeof data === 'number') return data;
  return data.saldo;
}

export const userService = {
  getCurrentUser,
  getBalance,
};
