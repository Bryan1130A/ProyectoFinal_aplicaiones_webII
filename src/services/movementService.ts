import type { CreateMovementRequest, Movement, UpdateMovementRequest } from '../types/Movement';
import { supabase } from './supabaseClient';

const MOVEMENT_COLUMNS = 'id, tipo, monto, descripcion, fecha';

async function getMovements(): Promise<Movement[]> {
  const { data, error } = await supabase
    .from('movimientos')
    .select(MOVEMENT_COLUMNS)
    .order('fecha', { ascending: false });
  if (error) throw error;
  return data as Movement[];
}

async function getMovementById(id: number): Promise<Movement> {
  const { data, error } = await supabase
    .from('movimientos')
    .select(MOVEMENT_COLUMNS)
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as Movement;
}

async function createMovement(payload: CreateMovementRequest): Promise<Movement> {
  const { data, error } = await supabase
    .from('movimientos')
    .insert(payload)
    .select(MOVEMENT_COLUMNS)
    .single();
  if (error) throw error;
  return data as Movement;
}

async function updateMovement(id: number, payload: UpdateMovementRequest): Promise<Movement> {
  const { data, error } = await supabase
    .from('movimientos')
    .update(payload)
    .eq('id', id)
    .select(MOVEMENT_COLUMNS)
    .single();
  if (error) throw error;
  return data as Movement;
}

async function deleteMovement(id: number): Promise<void> {
  const { error } = await supabase.from('movimientos').delete().eq('id', id);
  if (error) throw error;
}

export const movementService = {
  getMovements,
  getMovementById,
  createMovement,
  updateMovement,
  deleteMovement,
};
