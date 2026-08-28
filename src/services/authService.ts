import type { LoginRequest, RegisterRequest } from '../types/Auth';
import type { User } from '../types/User';
import { supabase } from './supabaseClient';
import { clearStoredUser, getStoredUser, saveUser } from '../utils/storage';

async function login({ email, password }: LoginRequest): Promise<User> {
  const { data, error } = await supabase.rpc('login_usuario', {
    p_email: email,
    p_password: password,
  });
  if (error) throw error;

  const user = (data as User[] | null)?.[0];
  if (!user) throw new Error('Correo o contraseña incorrectos.');

  await saveUser(user);
  return user;
}

async function register({ nombre, email, password }: RegisterRequest): Promise<User> {
  const { data, error } = await supabase.rpc('registrar_usuario', {
    p_nombre: nombre,
    p_email: email,
    p_password: password,
  });
  if (error) throw error;

  const user = (data as User[] | null)?.[0];
  if (!user) throw new Error('No se pudo completar el registro.');

  await saveUser(user);
  return user;
}

async function logout(): Promise<void> {
  await clearStoredUser();
}

async function getSessionUser(): Promise<User | null> {
  return getStoredUser();
}

export const authService = {
  login,
  register,
  logout,
  getSessionUser,
};
