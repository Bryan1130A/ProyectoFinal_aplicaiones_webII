import type { LoginRequest, RegisterRequest, RegisterResult } from '../types/Auth';
import { supabase } from './supabaseClient';

async function login({ email, password }: LoginRequest): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

async function register({ nombre, email, password }: RegisterRequest): Promise<RegisterResult> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nombre } },
  });
  if (error) throw error;
  return { needsEmailConfirmation: !data.session };
}

async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

async function isAuthenticated(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
}

export const authService = {
  login,
  register,
  logout,
  isAuthenticated,
};
