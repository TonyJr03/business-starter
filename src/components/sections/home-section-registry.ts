import type { HomeSectionId } from '@/types';

// ─── Metadata ─────────────────────────────────────────────────────────────────

export interface SectionMeta {
  /** Human-readable label (dev tooling, logs). */
  label: string;
  /**
   * True when the section requires live runtime data beyond its config props
   * (e.g. homeFeatures array, openingHours from businessConfig, DB records).
   * Used by HomeSectionRenderer to decide whether to inject it.
   */
  needsRuntimeData: boolean;
  /**
   * False when the underlying component is not yet implemented.
   * HomeSectionRenderer skips these sections silently in production.
   */
  implemented: boolean;
}

// ─── Registry ─────────────────────────────────────────────────────────────────

/**
 * Central section registry for the Home page.
 *
 * Typed as `Record<HomeSectionId, SectionMeta>` so TypeScript enforces
 * exhaustiveness: adding a new section ID to `HomeSectionId` without a
 * matching entry here is a **compile error**.
 *
 * Rendering dispatch lives in `HomeSectionRenderer.astro`; this file is
 * pure data and has no Astro or component dependencies.
 */
export const SECTION_REGISTRY: Record<HomeSectionId, SectionMeta> = {
  hero: {
    label: 'Hero',
    needsRuntimeData: false,
    implemented: true,
  },
  highlights: {
    label: 'Highlights',
    needsRuntimeData: true,   // needs homeFeatures[]
    implemented: true,
  },
  promotions: {
    label: 'Promotions',
    needsRuntimeData: true,   // needs promotions[] (future)
    implemented: false,
  },
  testimonials: {
    label: 'Testimonials',
    needsRuntimeData: true,   // needs testimonials[] (future)
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
    needsRuntimeData: true,   // needs openingHours[] from businessConfig
    implemented: true,
  },
};

// ─── Guards & helpers ─────────────────────────────────────────────────────────

/**
 * Type guard — narrows an unknown string to `HomeSectionId`.
 * Use to safely handle values from dynamic sources (CMS, DB, query strings).
 */
export function isRegisteredSection(id: string): id is HomeSectionId {
  return Object.prototype.hasOwnProperty.call(SECTION_REGISTRY, id);
}

/**
 * Returns the metadata for a section, or `undefined` for unrecognised IDs.
 * Prefer the typed `SECTION_REGISTRY[id]` lookup when `id` is already
 * narrowed to `HomeSectionId`.
 */
export function getSectionMeta(id: string): SectionMeta | undefined {
  return isRegisteredSection(id) ? SECTION_REGISTRY[id] : undefined;
}
