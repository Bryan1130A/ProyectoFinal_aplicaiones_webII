const KNOWN_MESSAGES: Array<{ match: string; friendly: string }> = [
  { match: 'Invalid login credentials', friendly: 'Correo o contraseña incorrectos.' },
  { match: 'User already registered', friendly: 'Ya existe una cuenta con este correo.' },
  {
    match: 'Email not confirmed',
    friendly: 'Debes confirmar tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.',
  },
  { match: 'Password should be at least', friendly: 'La contraseña es demasiado corta.' },
  { match: 'JWT expired', friendly: 'Tu sesión expiró. Inicia sesión de nuevo.' },
  { match: 'row-level security', friendly: 'No tienes permisos para realizar esta acción.' },
];

/**
 * Traduce errores de Supabase (Auth/Postgrest) y de red a mensajes
 * comprensibles para el usuario final, sin exponer detalles técnicos.
 */
export function getErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  if (!message) return 'Ocurrió un error inesperado.';

  if (/network request failed|fetch failed|failed to fetch/i.test(message)) {
    return 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
  }

  const known = KNOWN_MESSAGES.find((entry) => message.includes(entry.match));
  if (known) return known.friendly;

  return message;
}
