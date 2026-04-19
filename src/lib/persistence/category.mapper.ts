import type { Category } from '@/types';

// ─── Tipo de fila SQL ─────────────────────────────────────────────────────────
// Representa la forma exacta devuelta por Supabase antes de mapear al dominio.

export interface CategoryRow {
  id: string;
  business_id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
}

/** Campos necesarios para INSERT (Supabase genera id y business_id). */
export type CategoryInsertRow = Omit<CategoryRow, 'id' | 'business_id'>;

// ─── Lectura: fila → dominio ──────────────────────────────────────────────────

export function rowToCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? undefined,
    imageUrl: row.image_url ?? undefined,
    sortOrder: row.sort_order,
    isActive: row.is_active,
  };
}

// ─── Escritura: dominio → fila ────────────────────────────────────────────────
// Reservado para operaciones CRUD (sprint futuro).
// Implementar aquí: categoryToInsertRow(), categoryToUpdateRow()
