import type { User } from '../types/User';
import { supabase } from './supabaseClient';

async function getCurrentUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const metadata = data.user.user_metadata as { nombre?: string } | null;
  return {
    id: data.user.id,
    email: data.user.email ?? '',
    nombre: metadata?.nombre,
  };
}

/**
 * El saldo se calcula en Supabase mediante la función `get_saldo` (ver
 * supabase/schema.sql), nunca se acumula de forma independiente en el
 * móvil, para que siempre coincida con la fuente central de datos.
 */
async function getBalance(): Promise<number> {
  const { data, error } = await supabase.rpc('get_saldo');
  if (error) throw error;
  return Number(data) || 0;
}

export const userService = {
  getCurrentUser,
  getBalance,
};
