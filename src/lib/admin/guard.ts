import type { AstroCookies } from 'astro';
import { getUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { globalConfig } from '@/config';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type SupabaseServerClient = ReturnType<typeof createSupabaseServerClient>;

/**
 * Contexto del admin: sesión resuelta + business_id listo para mutaciones.
 * Se obtiene llamando a requireAdmin() y se pasa a las funciones de mutación.
 */
export interface AdminContext {
  /** UUID del negocio actual. En multi-tenant futuro: viene del subdominio o JWT claim. */
  businessId: string;
  /** UUID del usuario autenticado en Supabase Auth. */
  userId: string;
  /** Email del usuario autenticado (para mostrar en la UI del panel). */
  userEmail: string;
  /** Cliente Supabase inicializado con la sesión activa del request entrante. */
  supabase: SupabaseServerClient;
}

export type RequireAdminResult =
  | { ok: true; ctx: AdminContext }
  | { ok: false; error: string };

// ─── Guard ────────────────────────────────────────────────────────────────────

/**
 * Valida la sesión admin y resuelve el contexto necesario para mutaciones.
 *
 * Retorna AdminContext si el usuario está autenticado y el negocio existe en DB.
 * Retorna un error si no hay sesión activa o el negocio no se encuentra.
 *
 * Nota: el middleware ya protege todas las rutas /admin/*, por lo que en
 * páginas SSR esta función casi siempre retorna ok: true. La comprobación
 * explícita protege los handlers POST directos y evita huecos si el
 * middleware se modifica en el futuro.
 *
 * Uso en páginas SSR:
 *   const result = await requireAdmin(Astro.cookies, Astro.request);
 *   if (!result.ok) return Astro.redirect('/admin/login');
 *   const { ctx } = result;
 */
export async function requireAdmin(
  cookies: AstroCookies,
  request: Request,
): Promise<RequireAdminResult> {
  const user = await getUser(cookies, request);
  if (!user) return { ok: false, error: 'No autenticado' };

  const supabase = createSupabaseServerClient(cookies, request);

  // Resuelve el business_id usando el slug de la configuración global.
  // En multi-tenant: el slug vendría del subdominio o de un claim en el JWT.
  const slug = globalConfig.identity.slug ?? '';

  const { data: business, error } = await supabase
    .from('businesses')
    .select('id')
    .eq('slug', slug)
    .single();

  if (error || !business) {
    return { ok: false, error: 'Negocio no encontrado en base de datos' };
  }

  return {
    ok: true,
    ctx: {
      businessId: business.id,
      userId: user.id,
      userEmail: user.email ?? '',
      supabase,
    },
  };
}
