import type { User } from '../types/User';
import { supabase } from './supabaseClient';

/**
 * Refresca el perfil (incluye el saldo) directamente desde Postgres.
 * El saldo vive en `usuarios.saldo` y lo mantienen al día las funciones
 * crear_movimiento/editar_movimiento/eliminar_movimiento (ver schema.sql),
 * nunca se recalcula de forma independiente en el móvil.
 */
async function getUser(usuarioId: number): Promise<User | null> {
  const { data, error } = await supabase.rpc('obtener_usuario', { p_usuario_id: usuarioId });
  if (error) throw error;
  return ((data as User[] | null)?.[0]) ?? null;
}

export const userService = {
  getUser,
};
