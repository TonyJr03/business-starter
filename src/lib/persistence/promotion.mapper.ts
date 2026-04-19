import type { Promotion, PromotionStatus, PromotionRule } from '@/types';

// ─── Tipo de fila SQL ─────────────────────────────────────────────────────────
// Representa la forma exacta devuelta por Supabase antes de mapear al dominio.

export interface PromotionRow {
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

/** Campos necesarios para INSERT (Supabase genera id y business_id). */
export type PromotionInsertRow = Omit<PromotionRow, 'id' | 'business_id'>;

// ─── Lectura: fila → dominio ──────────────────────────────────────────────────

export function rowToPromotion(row: PromotionRow): Promotion {
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

// ─── Escritura: dominio → fila ────────────────────────────────────────────────
// Reservado para operaciones CRUD (sprint futuro).
// Implementar aquí: promotionToInsertRow(), promotionToUpdateRow()
