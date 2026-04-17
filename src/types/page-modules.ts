import type { PageCtaCopy } from './business-config';

// ─── IDs de Módulos de Página ─────────────────────────────────────────────────

/**
 * Identificadores de todos los módulos de página del starter.
 * Cada ID corresponde a una ruta (excepto Home, que es siempre fija).
 * Añade nuevos módulos aquí para extender el sistema.
 */
export type PageModuleId =
  | 'catalog'
  | 'promotions'
  | 'about'
  | 'contact'
  | 'faq'
  | 'gallery'
  | 'blog';

// ─── Configuración de Módulo de Página ────────────────────────────────────────

/**
 * Configuración compartida por todos los módulos de página.
 *
 * Controla:
 * - Si la página está activa (`enabled`)
 * - La ruta URL canónica (`path`)
 * - La etiqueta en la navegación (`navLabel`)
 * - Textos de encabezado opcionales (`title`, `subtitle`)
 * - Bloque CTA de WhatsApp opcional al final de la página (`cta`)
 *
 * Los campos de contenido específicos por página (ej. `featuredTitle` en catálogo,
 * `emptyMessage` en promociones) se mantienen en `globalConfig.pages.*`.
 */
export interface PageModuleConfig {
  /** Si esta página está activa y debe ser accesible/visible. */
  enabled: boolean;
  /** Ruta URL canónica de la página (ej. '/catalog'). */
  path: string;
  /** Etiqueta del enlace en la navegación principal. */
  navLabel: string;
  /** Encabezado principal de la página (opcional). */
  title?: string;
  /** Texto de apoyo bajo el título (opcional). */
  subtitle?: string;
  /** Bloque CTA de WhatsApp al final de la página (opcional). */
  cta?: PageCtaCopy;
}

/** Mapa completo de todos los módulos de página, indexado por PageModuleId. */
export type PageModulesConfig = Record<PageModuleId, PageModuleConfig>;
