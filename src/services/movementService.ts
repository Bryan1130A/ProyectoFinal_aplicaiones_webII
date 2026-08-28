import type { CreateMovementRequest, Movement, UpdateMovementRequest } from '../types/Movement';
import { supabase } from './supabaseClient';

async function getMovements(usuarioId: number): Promise<Movement[]> {
  const { data, error } = await supabase.rpc('obtener_movimientos', { p_usuario_id: usuarioId });
  if (error) throw error;
  return (data ?? []) as Movement[];
}

async function getMovementById(id: number, usuarioId: number): Promise<Movement> {
  const { data, error } = await supabase.rpc('obtener_movimiento', {
    p_movimiento_id: id,
    p_usuario_id: usuarioId,
  });
  if (error) throw error;
  const movement = data as Movement | null;
  if (!movement) throw new Error('Movimiento no encontrado');
  return movement;
}

async function createMovement(usuarioId: number, payload: CreateMovementRequest): Promise<Movement> {
  const { data, error } = await supabase.rpc('crear_movimiento', {
    p_usuario_id: usuarioId,
    p_tipo: payload.tipo,
    p_monto: payload.monto,
    p_descripcion: payload.descripcion,
  });
  if (error) throw error;
  return data as Movement;
}

async function updateMovement(
  id: number,
  usuarioId: number,
  payload: UpdateMovementRequest
): Promise<Movement> {
  const { data, error } = await supabase.rpc('editar_movimiento', {
    p_movimiento_id: id,
    p_usuario_id: usuarioId,
    p_tipo: payload.tipo,
    p_monto: payload.monto,
    p_descripcion: payload.descripcion,
  });
  if (error) throw error;
  return data as Movement;
}

async function deleteMovement(id: number, usuarioId: number): Promise<void> {
  const { error } = await supabase.rpc('eliminar_movimiento', {
    p_movimiento_id: id,
    p_usuario_id: usuarioId,
  });
  if (error) throw error;
}

export const movementService = {
  getMovements,
  getMovementById,
  createMovement,
  updateMovement,
  deleteMovement,
};
