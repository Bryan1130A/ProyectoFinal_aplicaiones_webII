import { AxiosError } from 'axios';

/**
 * Traduce errores de red/HTTP a mensajes comprensibles para el usuario final,
 * sin exponer detalles técnicos como respuesta principal.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (!error.response) {
      return 'No se pudo conectar con el servidor. Verifica tu conexión y que el backend esté encendido.';
    }

    const status = error.response.status;
    const backendMessage =
      (error.response.data as { message?: string; error?: string } | undefined)?.message ??
      (error.response.data as { message?: string; error?: string } | undefined)?.error;

    switch (status) {
      case 400:
        return backendMessage ?? 'Los datos enviados no son válidos.';
      case 401:
        return 'Credenciales incorrectas o sesión expirada.';
      case 403:
        return 'No tienes permisos para realizar esta acción.';
      case 404:
        return 'No se encontró la información solicitada.';
      case 500:
        return 'Ocurrió un error en el servidor. Intenta de nuevo más tarde.';
      default:
        return backendMessage ?? 'Ocurrió un error inesperado.';
    }
  }

  return 'Ocurrió un error inesperado.';
}
