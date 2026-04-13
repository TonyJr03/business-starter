import type { Promotion, PromotionStatus } from '@/types';
import { promotions } from '@/data';

/**
 * Servicio de promociones — lectura y resolución de estado.
 *
 * Contrato estable: las firmas de estas funciones no cambian al migrar
 * la fuente de datos de local a Supabase. Solo se reemplaza el cuerpo.
 */

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

// ─── Lectura ──────────────────────────────────────────────────────────────────

/**
 * Devuelve todas las promociones sin filtrar.
 */
export async function getPromotions(): Promise<Promotion[]> {
  return promotions;
}

/**
 * Devuelve solo las promociones cuyo estado resuelto es 'active'.
 *
 * @param now - Fecha de referencia. Por defecto: Date actual.
 */
export async function getActivePromotions(now: Date = new Date()): Promise<Promotion[]> {
  return promotions.filter((p) => getPromotionStatus(p, now) === 'active');
}

/**
 * Busca una promoción por su id.
 * Devuelve undefined si no existe.
 */
export async function getPromotionById(id: string): Promise<Promotion | undefined> {
  return promotions.find((p) => p.id === id);
}
