import type { Category, Product, Money, ProductTag } from '@/types';
import { categories as localCategories, products as localProducts } from '@/data';
import { getSupabaseClient } from '@/lib/supabase/client';

/**
 * Servicio de catálogo — lectura de categorías y productos.
 *
 * Estrategia de fuente de datos:
 *   1. Supabase (si las env vars están presentes y la consulta tiene éxito)
 *   2. Datos locales como fallback (sin env, fallo de red, BD vacía)
 *
 * Contrato estable: las firmas públicas no cambian al migrar la fuente.
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

// ─── Tipos de fila SQL ────────────────────────────────────────────────────────
// Representan la forma exacta que devuelve Supabase antes de mapear al dominio.

interface CategoryRow {
  id: string;
  business_id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
}

interface ProductRow {
  id: string;
  business_id: string;
  category_id: string;
  slug: string;
  name: string;
  description: string | null;
  money_amount: number;
  money_currency: string;
  is_available: boolean;
  is_featured: boolean;
  badge: string | null;
  tags: ProductTag[] | null;
  image_url: string | null;
  sort_order: number;
}

// ─── Mapeadores SQL → Dominio ─────────────────────────────────────────────────

function rowToCategory(row: CategoryRow): Category {
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

function rowToProduct(row: ProductRow): Product {
  const money: Money = {
    amount: Number(row.money_amount),
    currency: row.money_currency,
  };

  return {
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? '',
    money,
    badge: row.badge ? (row.badge as any) : undefined,
    imageUrl: row.image_url ?? undefined,
    tags: row.tags ?? undefined,
    isAvailable: row.is_available,
    isFeatured: row.is_featured,
    sortOrder: row.sort_order,
  };
}

// ─── Lectores privados de Supabase ────────────────────────────────────────────
// Devuelven null si Supabase no está disponible o falla la consulta,
// lo que activa el fallback a datos locales en cada función pública.

async function fetchCategoriesFromDB(): Promise<Category[] | null> {
  const db = getSupabaseClient();
  if (!db) return null;

  const { data, error } = await db
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  if (error) {
    if (import.meta.env.DEV) {
      console.warn('[catalog.service] Error al leer categorías de Supabase:', error.message);
    }
    return null;
  }

  if (!data || data.length === 0) return null;

  return (data as CategoryRow[]).map(rowToCategory);
}

async function fetchProductsFromDB(filters?: ProductFilters): Promise<Product[] | null> {
  const db = getSupabaseClient();
  if (!db) return null;

  let query = db.from('products').select('*').order('sort_order');

  if (filters?.onlyAvailable !== false) {
    query = query.eq('is_available', true);
  }

  if (filters?.categoryId) {
    query = query.eq('category_id', filters.categoryId);
  }

  if (filters?.onlyFeatured) {
    query = query.eq('is_featured', true);
  }

  const { data, error } = await query;

  if (error) {
    if (import.meta.env.DEV) {
      console.warn('[catalog.service] Error al leer productos de Supabase:', error.message);
    }
    return null;
  }

  if (!data || data.length === 0) return null;

  return (data as ProductRow[]).map(rowToProduct);
}

async function fetchProductBySlugFromDB(slug: string): Promise<Product | null> {
  const db = getSupabaseClient();
  if (!db) return null;

  const { data, error } = await db
    .from('products')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    if (import.meta.env.DEV) {
      console.warn('[catalog.service] Error al buscar producto por slug en Supabase:', error.message);
    }
    return null;
  }

  if (!data) return null;

  return rowToProduct(data as ProductRow);
}

// ─── Fallback local: categorías ───────────────────────────────────────────────

function getLocalCategories(): Category[] {
  return localCategories
    .filter((c) => c.isActive ?? true)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

// ─── Fallback local: productos ────────────────────────────────────────────────

function getLocalProducts(filters?: ProductFilters): Product[] {
  let results = [...localProducts];

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

// ─── API pública ──────────────────────────────────────────────────────────────

/**
 * Devuelve todas las categorías activas, ordenadas por sortOrder.
 * Fuente: Supabase → fallback local.
 */
export async function getCategories(): Promise<Category[]> {
  return (await fetchCategoriesFromDB()) ?? getLocalCategories();
}

/**
 * Devuelve productos aplicando los filtros indicados.
 * Si no se pasan filtros, devuelve todos los disponibles ordenados.
 * Fuente: Supabase → fallback local.
 */
export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  return (await fetchProductsFromDB(filters)) ?? getLocalProducts(filters);
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
 * Fuente: Supabase → fallback local.
 */
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return (await fetchProductBySlugFromDB(slug)) ?? localProducts.find((p) => p.slug === slug);
}

// ─── Helpers de dominio ───────────────────────────────────────────────────────

/**
 * Regla de dominio: un producto está disponible si `isAvailable` es true
 * o si el campo está ausente (undefined). La ausencia significa "disponible".
 *
 * Usar este helper en lugar de acceder a `product.isAvailable` directamente
 * para evitar el bug de `!undefined === true`.
 */
export function isProductAvailable(product: Product): boolean {
  return product.isAvailable ?? true;
}
