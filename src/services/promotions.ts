import type { Promotion } from '@/types';
import { promotions } from '@/data';

/**
 * Capa de servicios para promociones.
 *
 * Actualmente devuelve datos locales tipados.
 * En el futuro consultará Supabase sin cambiar el contrato de las funciones.
 */

export async function getPromotions(onlyActive = true): Promise<Promotion[]> {
  if (!onlyActive) return promotions;
  return promotions.filter((p) => p.isActive);
}

export async function getPromotionById(id: string): Promise<Promotion | undefined> {
  return promotions.find((p) => p.id === id);
}
