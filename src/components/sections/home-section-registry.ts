import type { HomeSectionId } from '@/types';

// ─── Metadata ─────────────────────────────────────────────────────────────────

export interface SectionMeta {
  /** Etiqueta legible para herramientas de desarrollo y logs. */
  label: string;
  /**
   * `true` si la sección necesita datos en tiempo de render más allá de sus props de config
   * (p. ej. array homeFeatures, openingHours de businessConfig, registros de BD).
   * HomeSectionRenderer lo usa para decidir qué inyectar.
   */
  needsRuntimeData: boolean;
  /**
   * `false` cuando el componente asociado aún no está implementado.
   * HomeSectionRenderer omite estas secciones silenciosamente.
   */
  implemented: boolean;
}

// ─── Registry ─────────────────────────────────────────────────────────────────

/**
 * Registro central de secciones de la Home.
 *
 * Tipado como `Record<HomeSectionId, SectionMeta>` para que TypeScript
 * garantice exhaustividad: añadir un nuevo ID a `HomeSectionId` sin
 * una entrada aquí es un **error de compilación**.
 *
 * El despacho de renderizado vive en `HomeSectionRenderer.astro`;
 * este archivo es datos puros sin dependencias de Astro ni componentes.
 */
export const SECTION_REGISTRY: Record<HomeSectionId, SectionMeta> = {
  hero: {
    label: 'Hero',
    needsRuntimeData: false,
    implemented: true,
  },
  highlights: {
    label: 'Highlights',
    needsRuntimeData: true,   // requiere homeFeatures[]
    implemented: true,
  },
  promotions: {
    label: 'Promotions',
    needsRuntimeData: true,   // requiere promotions[] (futuro)
    implemented: false,
  },
  testimonials: {
    label: 'Testimonials',
    needsRuntimeData: true,   // requiere testimonials[] (futuro)
    implemented: false,
  },
  whatsapp_cta: {
    label: 'WhatsApp CTA',
    needsRuntimeData: false,
    implemented: true,
  },
  location: {
    label: 'Location',
    needsRuntimeData: false,
    implemented: false,
  },
  hours: {
    label: 'Opening Hours',
    needsRuntimeData: true,   // requiere openingHours[] de businessConfig
    implemented: true,
  },
};

// ─── Guards & helpers ─────────────────────────────────────────────────────────

/**
 * Type guard — estrecha un string desconocido a `HomeSectionId`.
 * Úsalo para manejar valores de fuentes dinámicas (CMS, BD, query strings).
 */
export function isRegisteredSection(id: string): id is HomeSectionId {
  return Object.prototype.hasOwnProperty.call(SECTION_REGISTRY, id);
}

/**
 * Devuelve los metadatos de una sección, o `undefined` para IDs no reconocidos.
 * Prefiere el acceso tipado `SECTION_REGISTRY[id]` cuando `id` ya está
 * estrechado a `HomeSectionId`.
 */
export function getSectionMeta(id: string): SectionMeta | undefined {
  return isRegisteredSection(id) ? SECTION_REGISTRY[id] : undefined;
}
