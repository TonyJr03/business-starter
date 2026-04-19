import type { Promotion, PromotionStatus, PromotionRule } from '@/types';
import { promotions as localPromotions } from '@/data';
import { getSupabaseClient } from '@/lib/supabase/client';

/**
 * Servicio de promociones — lectura y resolución de estado.
 *
 * Estrategia de fuente de datos:
 *   1. Supabase (si las env vars están presentes y la consulta tiene éxito)
 *   2. Datos locales como fallback (sin env, fallo de red, BD vacía)
 *
 * Contrato estable: las firmas públicas no cambian al migrar la fuente.
 */

// ─── Tipo de fila SQL ─────────────────────────────────────────────────────────

interface PromotionRow {
  id: string;
  business_id: string;
  title: string;
  description: string | null;
  status: PromotionStatus;
  discount_label: string | null;
  image_url: string | null;
  starts_at: string | null;
  ends_at: string | null;
  rules: PromotionRule[] | null;
  product_ids: string[] | null;
  category_ids: string[] | null;
  sort_order: number;
}

// ─── Mapeador SQL → Dominio ───────────────────────────────────────────────────

function rowToPromotion(row: PromotionRow): Promotion {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    status: row.status,
    discountLabel: row.discount_label ?? undefined,
    imageUrl: row.image_url ?? undefined,
    startsAt: row.starts_at ?? undefined,
    endsAt: row.ends_at ?? undefined,
    rules: row.rules ?? undefined,
    productIds: row.product_ids ?? undefined,
    categoryIds: row.category_ids ?? undefined,
    sortOrder: row.sort_order,
  };
}

// ─── Lector privado de Supabase ───────────────────────────────────────────────
// Devuelve null si Supabase no está disponible o la consulta falla,
// lo que activa el fallback a datos locales.

async function fetchPromotionsFromDB(): Promise<Promotion[] | null> {
  const db = getSupabaseClient();
  if (!db) return null;

  const { data, error } = await db
    .from('promotions')
    .select('*')
    .order('sort_order');

  if (error) {
    if (import.meta.env.DEV) {
      console.warn('[promotions.service] Error al leer promociones de Supabase:', error.message);
    }
    return null;
  }

  if (!data || data.length === 0) return null;

  return (data as PromotionRow[]).map(rowToPromotion);
}

// ─── Estado ───────────────────────────────────────────────────────────────────

/**
 * Resuelve el estado de ciclo de vida de una promoción en un momento dado.
 *
 * Prioridad de resolución:
 *  1. `promotion.status` explícito en el dato → se usa directamente.
 *  2. Derivado de startsAt / endsAt comparado con `now` (inicio del día).
 *  3. Retrocompat: `isActive === false` → 'paused'; ausente → 'active'.
 *
 * @param promotion - Objeto Promotion tipado.
 * @param now       - Fecha de referencia. Por defecto: Date actual. Útil en tests.
 */
export function getPromotionStatus(
  promotion: Promotion,
  now: Date = new Date(),
): PromotionStatus {
  // 1. Estado explícito en el dato
  if (promotion.status) return promotion.status;

  // 2. Derivar por fechas (normalizar a inicio del día)
  const dayStart = new Date(now);
  dayStart.setHours(0, 0, 0, 0);

  const starts = promotion.startsAt ? new Date(promotion.startsAt) : null;
  const ends   = promotion.endsAt   ? new Date(promotion.endsAt)   : null;

  if (starts && starts > dayStart) return 'upcoming';
  if (ends   && ends   < dayStart) return 'expired';

  // 3. Retrocompat con el campo booleano heredado
  if (promotion.isActive === false) return 'paused';

  return 'active';
}

// ─── API pública ──────────────────────────────────────────────────────────────

/**
 * Devuelve todas las promociones sin filtrar.
 * Fuente: Supabase → fallback local.
 */
export async function getPromotions(): Promise<Promotion[]> {
  return (await fetchPromotionsFromDB()) ?? localPromotions;
}

/**
 * Devuelve solo las promociones cuyo estado resuelto es 'active'.
 * Fuente: Supabase → fallback local.
 *
 * @param now - Fecha de referencia. Por defecto: Date actual.
 */
export async function getActivePromotions(now: Date = new Date()): Promise<Promotion[]> {
  const all = await getPromotions();
  return all.filter((p) => getPromotionStatus(p, now) === 'active');
}

/**
 * Busca una promoción por su id.
 * Devuelve undefined si no existe.
 * Fuente: Supabase → fallback local.
 */
export async function getPromotionById(id: string): Promise<Promotion | undefined> {
  const all = await getPromotions();
  return all.find((p) => p.id === id);
}

// ─── Helpers de dominio ───────────────────────────────────────────────────────

/**
 * Devuelve true si la promoción está activa en el momento indicado.
 * Equivale a `getPromotionStatus(promotion, now) === 'active'`.
 *
 * Útil como guard rápido sin necesitar el tipo PromotionStatus completo.
 *
 * @param promotion - Objeto Promotion tipado.
 * @param now       - Fecha de referencia. Por defecto: Date actual.
 */
export function isPromotionActive(promotion: Promotion, now: Date = new Date()): boolean {
  return getPromotionStatus(promotion, now) === 'active';
}
