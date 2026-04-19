import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

// Variables de entorno públicas requeridas para conectar con Supabase.
// Prefijo PUBLIC_ para que Astro las exponga al cliente y al servidor.
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
const supabasePublishableKey = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY as string | undefined;

/**
 * Indica si las variables de entorno de Supabase están presentes y no vacías.
 * Usar este helper antes de llamar a getSupabaseClient() para evitar errores
 * en entornos locales que operan con datos mock.
 */
export function hasSupabaseEnv(): boolean {
  return Boolean(supabaseUrl && supabasePublishableKey);
}

/**
 * Devuelve un cliente de Supabase singleton si las variables de entorno están
 * disponibles, o null en caso contrario.
 *
 * El fallback null permite que los servicios continúen usando datos locales
 * (mock) sin lanzar excepciones cuando Supabase no está configurado.
 *
 * En producción (Vercel) las variables deben estar definidas en el panel de
 * entorno del proyecto.
 */
let _client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!hasSupabaseEnv()) return null;

  // Reutiliza el cliente ya creado para evitar múltiples instancias.
  if (!_client) {
    _client = createClient(supabaseUrl!, supabasePublishableKey!);
  }

  return _client;
}

/**
 * Crea un cliente de Supabase para uso en el navegador (componentes React, scripts client-side).
 *
 * A diferencia de getSupabaseClient(), este cliente usa @supabase/ssr y almacena
 * la sesión en cookies (en lugar de localStorage), de modo que el servidor puede
 * leerla en cada request y validar la autenticación.
 *
 * IMPORTANTE: Solo invocar desde código que se ejecuta en el browser.
 * Para uso en servidor/middleware, usar createSupabaseServerClient() de @/lib/supabase/server.
 *
 * Devuelve null si las variables de entorno no están configuradas.
 */
export function getSupabaseBrowserClient() {
  if (!hasSupabaseEnv()) return null;
  return createBrowserClient(supabaseUrl!, supabasePublishableKey!);
}
