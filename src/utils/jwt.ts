interface JwtPayload {
  sub?: string;
  email?: string;
  rol?: string;
  role?: string;
  nombre?: string;
  [key: string]: unknown;
}

const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

// Decodificador base64 manual: Hermes (motor JS de React Native) no expone
// atob/btoa de forma nativa, así que no se puede depender de ellos aquí.
function base64Decode(input: string): string {
  const clean = input.replace(/[^A-Za-z0-9+/]/g, '');
  let output = '';
  let buffer = 0;
  let bits = 0;

  for (const char of clean) {
    const value = BASE64_CHARS.indexOf(char);
    if (value === -1) continue;
    buffer = (buffer << 6) | value;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      output += String.fromCharCode((buffer >> bits) & 0xff);
    }
  }

  try {
    return decodeURIComponent(
      output
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
  } catch {
    return output;
  }
}

/**
 * Decodifica el payload de un JWT (sin verificar la firma; eso lo hace el backend).
 * Se usa como respaldo para mostrar datos del usuario (email/rol) si el backend
 * no expone un endpoint /usuarios/me.
 */
export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = base64Decode(base64);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}
