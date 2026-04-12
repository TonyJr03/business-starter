import type { Product, Category } from '@/types';
import { categories, menuItems } from '@/data';

/**
 * Capa de servicios para productos y categorías.
 *
 * Actualmente devuelve datos locales tipados.
 * En el futuro consultará Supabase sin cambiar el contrato de las funciones.
 *
 * Los campos isActive, isAvailable, isFeatured y sortOrder son opcionales en
 * el tipo; aquí se aplican los valores por defecto del dominio:
 *   isActive    → true   (se muestra si no se indica lo contrario)
 *   isAvailable → true   (disponible salvo que se marque explícitamente false)
 *   isFeatured  → false  (no destacado por defecto)
 *   sortOrder   → 0      (al final si no se especifica posición)
 */

export async function getCategories(): Promise<Category[]> {
  return categories
    .filter((c) => c.isActive ?? true)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

export async function getProducts(options?: {
  categoryId?: string;
  onlyFeatured?: boolean;
  onlyAvailable?: boolean;
}): Promise<Product[]> {
  let results = [...menuItems];

  if (options?.onlyAvailable !== false) {
    results = results.filter((p) => p.isAvailable ?? true);
  }

  if (options?.categoryId) {
    results = results.filter((p) => p.categoryId === options.categoryId);
  }

  if (options?.onlyFeatured) {
    results = results.filter((p) => p.isFeatured ?? false);
  }

  return results.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return menuItems.find((p) => p.slug === slug);
}
