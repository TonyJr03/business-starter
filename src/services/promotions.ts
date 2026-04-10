import type { Promotion } from '@/types';
import { mockPromotions } from '@/data';

/**
 * Capa de servicios para promociones.
 *
 * Actualmente devuelve datos mock.
 * En el futuro consultará Supabase sin cambiar el contrato de las funciones.
 */

export async function getPromotions(onlyActive = true): Promise<Promotion[]> {
  if (!onlyActive) return mockPromotions;
  return mockPromotions.filter((p) => p.isActive);
}

export async function getPromotionById(id: string): Promise<Promotion | undefined> {
  return mockPromotions.find((p) => p.id === id);
}
