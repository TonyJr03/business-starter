import type { Category, Product } from '@/types';
import { categories, menuItems } from '@/data';

/**
 * Servicio de catálogo — lectura de categorías y productos.
 *
 * Contrato estable: las firmas de estas funciones no cambian al migrar
 * la fuente de datos de local a Supabase. Solo se reemplaza el cuerpo.
 *
 * Valores por defecto del dominio para campos opcionales:
 *   isActive    → true   (visible si no se especifica lo contrario)
 *   isAvailable → true   (disponible salvo marca explícita)
 *   isFeatured  → false  (no destacado por defecto)
 *   sortOrder   → 0      (al final del listado)
 */

// ─── Filtros ─────────────────────────────────────────────────────────────────

/** Opciones de filtrado para getProducts(). */
export interface ProductFilters {
  /** Devuelve solo productos de esta categoría. */
  categoryId?: string;
  /** Si es false, incluye productos no disponibles. Por defecto: true. */
  onlyAvailable?: boolean;
  /** Devuelve solo productos marcados como destacados. */
  onlyFeatured?: boolean;
}

// ─── Categorías ───────────────────────────────────────────────────────────────

/**
 * Devuelve todas las categorías activas, ordenadas por sortOrder.
 */
export async function getCategories(): Promise<Category[]> {
  return categories
    .filter((c) => c.isActive ?? true)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

// ─── Productos ────────────────────────────────────────────────────────────────

/**
 * Devuelve productos aplicando los filtros indicados.
 * Si no se pasan filtros, devuelve todos los disponibles ordenados.
 */
export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  let results = [...menuItems];

  if (filters?.onlyAvailable !== false) {
    results = results.filter((p) => p.isAvailable ?? true);
  }

  if (filters?.categoryId) {
    results = results.filter((p) => p.categoryId === filters.categoryId);
  }

  if (filters?.onlyFeatured) {
    results = results.filter((p) => p.isFeatured ?? false);
  }

  return results.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

/**
 * Devuelve productos destacados y disponibles, ordenados por sortOrder.
 * Equivale a getProducts({ onlyFeatured: true, onlyAvailable: true }).
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  return getProducts({ onlyFeatured: true, onlyAvailable: true });
}

/**
 * Devuelve todos los productos disponibles de una categoría concreta.
 */
export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  return getProducts({ categoryId, onlyAvailable: true });
}

/**
 * Busca un producto por su slug.
 * Devuelve undefined si no existe.
 */
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return menuItems.find((p) => p.slug === slug);
}
