import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../types/User';

const USER_KEY = '@banco_movil/usuario';

/**
 * Esta base no usa Supabase Auth (login 100% propio contra la tabla
 * `usuarios`), así que no hay un JWT de sesión que Supabase persista solo:
 * guardamos el usuario autenticado nosotros mismos.
 */
export async function saveUser(user: User): Promise<void> {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getStoredUser(): Promise<User | null> {
  const raw = await AsyncStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}

export async function clearStoredUser(): Promise<void> {
  await AsyncStorage.removeItem(USER_KEY);
}
