export type MovementType = 'DEPOSITO' | 'RETIRO';

export interface Movement {
  id: number;
  tipo: MovementType;
  monto: number;
  fecha: string;
  descripcion: string;
}

export interface CreateMovementRequest {
  tipo: MovementType;
  monto: number;
  descripcion: string;
}

export type UpdateMovementRequest = CreateMovementRequest;
