import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import type { AstroCookies } from 'astro';

/**
 * Crea un cliente de Supabase para uso exclusivo en el servidor:
 * middleware, páginas SSR y endpoints de API.
 *
 * La sesión se persiste mediante cookies HTTP, lo que permite al servidor
 * leer y renovar el token en cada request sin exponer el refresh token al cliente.
 *
 * @param cookies - Objeto AstroCookies del contexto de request (Astro.cookies o context.cookies)
 * @param request - Request HTTP entrante, necesario para leer las cookies del header
 */
export function createSupabaseServerClient(cookies: AstroCookies, request: Request) {
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL as string;
  const supabaseKey = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY as string;

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      // Lee todas las cookies del header entrante.
      // Se filtra con type guard para garantizar que value siempre sea string,
      // ya que parseCookieHeader devuelve value?: string | undefined pero
      // GetAllCookies exige { name: string; value: string }[].
      getAll() {
        return parseCookieHeader(request.headers.get('Cookie') ?? '').filter(
          (c): c is { name: string; value: string } => c.value !== undefined,
        );
      },
      // Escribe las cookies de sesión en la respuesta mediante AstroCookies.
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          // Se castea porque CookieOptions de @supabase/ssr es compatible
          // con AstroCookieSetOptions de Astro en tiempo de ejecución.
          cookies.set(name, value, options as Parameters<typeof cookies.set>[2]);
        });
      },
    },
  });
}
