/**
 * Traduce errores de Postgres/PostgREST (RPC) y de red a mensajes
 * comprensibles para el usuario final. Las funciones RPC (ver
 * supabase/schema.sql) ya lanzan `raise exception` con texto en español
 * pensado para mostrarse tal cual (ej. "Saldo insuficiente"), así que la
 * mayoría de los casos solo necesitan pasar el mensaje tal como llega.
 */
export function getErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  if (!message) return 'Ocurrió un error inesperado.';

  if (/network request failed|fetch failed|failed to fetch/i.test(message)) {
    return 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
  }

  if (/row-level security/i.test(message)) {
    return 'No tienes permisos para realizar esta acción.';
  }

  return message;
}
