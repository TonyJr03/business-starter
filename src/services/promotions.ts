import type { Promotion, PromotionStatus } from '@/types';
import { promotions } from '@/data';

/**
 * Capa de servicios para promociones.
 *
 * Actualmente devuelve datos locales tipados.
 * En el futuro consultará Supabase sin cambiar el contrato de las funciones.
 */

/**
 * Resuelve el estado de ciclo de vida de una promoción en un momento dado.
 *
 * Prioridad:
 *  1. `promo.status` explícito en el dato → se usa directamente.
 *  2. Derivado de startsAt / endsAt comparado con `today`.
 *  3. Retrocompat: `isActive === false` → 'paused'; si falta → 'active'.
 *
 * @param promo  - Objeto Promotion tipado.
 * @param today  - Fecha de referencia (por defecto: ahora). Útil en tests.
 */
export function resolvePromotionStatus(
  promo: Promotion,
  today: Date = new Date(),
): PromotionStatus {
  // 1. Estado explícito declarado en el dato
  if (promo.status) return promo.status;

  // 2. Derivar por fechas (normalizar a inicio del día)
  const dayStart = new Date(today);
  dayStart.setHours(0, 0, 0, 0);

  const starts = promo.startsAt ? new Date(promo.startsAt) : null;
  const ends   = promo.endsAt   ? new Date(promo.endsAt)   : null;

  if (starts && starts > dayStart) return 'upcoming';
  if (ends   && ends   < dayStart) return 'expired';

  // 3. Retrocompat con el campo booleano heredado
  if (promo.isActive === false) return 'paused';

  return 'active';
}

export async function getPromotions(onlyActive = true): Promise<Promotion[]> {
  if (!onlyActive) return promotions;
  return promotions.filter((p) => resolvePromotionStatus(p) === 'active');
}

export async function getPromotionById(id: string): Promise<Promotion | undefined> {
  return promotions.find((p) => p.id === id);
}
