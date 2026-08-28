/**
 * Configuración central de Supabase.
 *
 * Los valores reales viven en un archivo `.env` en la raíz del proyecto
 * (NO se sube a git). Copia `.env.example` a `.env` y coloca ahí:
 *
 *   EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
 *   EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
 *
 * Ambos valores se obtienen en el dashboard de Supabase:
 * Project Settings > API. La anon key es pública por diseño (Supabase
 * la protege con Row Level Security en la base de datos), por eso Expo
 * la expone en el bundle del cliente sin problema.
 *
 * Tras crear o modificar el archivo .env es necesario reiniciar
 * `npx expo start` (recarga completa) para que tome los nuevos valores.
 */
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (__DEV__ && (!SUPABASE_URL || !SUPABASE_ANON_KEY)) {
  console.warn(
    '[Supabase] Faltan EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY. ' +
      'Crea un archivo .env en la raíz del proyecto (ver .env.example) y reinicia expo start.'
  );
}
