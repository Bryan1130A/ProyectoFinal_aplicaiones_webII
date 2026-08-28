import { ENDPOINTS } from '../config/api.config';
import type { CreateMovementRequest, Movement, UpdateMovementRequest } from '../types/Movement';
import { api } from './api';

async function getMovements(): Promise<Movement[]> {
  const { data } = await api.get<Movement[]>(ENDPOINTS.movements);
  return data;
}

async function getMovementById(id: number): Promise<Movement> {
  const { data } = await api.get<Movement>(ENDPOINTS.movementById(id));
  return data;
}

async function createMovement(payload: CreateMovementRequest): Promise<Movement> {
  const { data } = await api.post<Movement>(ENDPOINTS.movements, payload);
  return data;
}

async function updateMovement(id: number, payload: UpdateMovementRequest): Promise<Movement> {
  const { data } = await api.put<Movement>(ENDPOINTS.movementById(id), payload);
  return data;
}

async function deleteMovement(id: number): Promise<void> {
  await api.delete(ENDPOINTS.movementById(id));
}

export const movementService = {
  getMovements,
  getMovementById,
  createMovement,
  updateMovement,
  deleteMovement,
};
