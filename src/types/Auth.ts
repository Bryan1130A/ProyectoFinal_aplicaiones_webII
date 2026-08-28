export interface LoginRequest {
  email: string;
  password: string;
}

// Respuesta conceptual indicada por el backend: { token, rol }.
// nombre/email son opcionales por si el backend decide incluirlos más adelante.
export interface LoginResponse {
  token: string;
  rol: string;
  nombre?: string;
  email?: string;
}
