import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? '';

/**
 * Cliente de Supabase singleton.
 * Requiere las variables de entorno PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_ANON_KEY.
 *
 * Durante desarrollo con datos mock estas variables pueden estar vacías.
 * En producción deben estar configuradas en el entorno de despliegue (Vercel).
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
