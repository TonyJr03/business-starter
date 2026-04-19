import type { AstroCookies } from 'astro';
import type { Session, User } from '@supabase/supabase-js';
import { createSupabaseServerClient } from '@/lib/supabase/server';

/** Verifica si las variables de entorno de Supabase están disponibles. */
function hasEnv(): boolean {
  return Boolean(
    import.meta.env.PUBLIC_SUPABASE_URL &&
      import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

/**
 * Obtiene la sesión activa desde el contexto del servidor.
 *
 * Devuelve null si no hay sesión o Supabase no está configurado.
 * Nota: getSession() lee el token desde las cookies sin validarlo con el servidor.
 * Para verificar autenticidad del token, preferir getUser().
 */
export async function getSession(
  cookies: AstroCookies,
  request: Request,
): Promise<Session | null> {
  if (!hasEnv()) return null;

  const supabase = createSupabaseServerClient(cookies, request);
  const { data, error } = await supabase.auth.getSession();
  if (error) return null;

  return data.session;
}

/**
 * Obtiene el usuario autenticado, validando el token contra el servidor de Supabase.
 *
 * Más seguro que getSession() porque detecta tokens manipulados o revocados.
 * Usar este helper para cualquier operación sensible (middleware, datos privados).
 */
export async function getUser(
  cookies: AstroCookies,
  request: Request,
): Promise<User | null> {
  if (!hasEnv()) return null;

  const supabase = createSupabaseServerClient(cookies, request);
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;

  return data.user;
}

/**
 * Indica si el request actual tiene una sesión autenticada válida.
 *
 * Equivalente semántico a getUser() !== null.
 * Útil para guards de middleware y comprobaciones rápidas de acceso.
 */
export async function isAuthenticated(
  cookies: AstroCookies,
  request: Request,
): Promise<boolean> {
  const user = await getUser(cookies, request);
  return user !== null;
}

/**
 * Cierra la sesión del usuario en el servidor e invalida el token en Supabase.
 *
 * Llamar siempre antes de redirigir al login en los endpoints de logout.
 * Si Supabase no está configurado, no hace nada (modo local/mock seguro).
 */
export async function signOut(
  cookies: AstroCookies,
  request: Request,
): Promise<void> {
  if (!hasEnv()) return;

  const supabase = createSupabaseServerClient(cookies, request);
  await supabase.auth.signOut();
}
