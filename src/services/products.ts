import type { Product, Category } from '@/types';
import { categories, menuItems } from '@/data';

/**
 * Capa de servicios para productos y categorías.
 *
 * Actualmente devuelve datos locales tipados.
 * En el futuro consultará Supabase sin cambiar el contrato de las funciones.
 */

export async function getCategories(): Promise<Category[]> {
  return categories.filter((c) => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getProducts(options?: {
  categoryId?: string;
  onlyFeatured?: boolean;
  onlyAvailable?: boolean;
}): Promise<Product[]> {
  let results = [...menuItems];

  if (options?.onlyAvailable !== false) {
    results = results.filter((p) => p.isAvailable);
  }

  if (options?.categoryId) {
    results = results.filter((p) => p.categoryId === options.categoryId);
  }

  if (options?.onlyFeatured) {
    results = results.filter((p) => p.isFeatured);
  }

  return results.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return menuItems.find((p) => p.slug === slug);
}
