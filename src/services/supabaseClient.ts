import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../config/supabase.config';

// El login es propio (tabla `usuarios`, no Supabase Auth), así que no se
// usa el módulo `auth` del cliente: toda la lectura/escritura pasa por
// funciones RPC (ver supabase/schema.sql).
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
