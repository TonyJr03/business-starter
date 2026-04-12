import type { SecondaryModuleId, SecondaryModulesConfig } from '@/types/secondary-modules';

/**
 * Secondary modules configuration.
 *
 * Each entry controls whether a module is rendered (`enabled`) and carries
 * the display copy (title / subtitle) used by the module's section component.
 *
 * Usage:
 * - Set `enabled: true` to activate a module site-wide.
 * - Override `title` / `subtitle` to match your brand voice.
 * - Use `isModuleEnabled(id)` in components and pages for guard checks.
 *
 * Les secciones FAQ, Gallery y Blog están deshabilitadas por defecto;
 * actívalas cuando el contenido esté listo.
 */
export const secondaryModules: SecondaryModulesConfig = {
  faq: {
    enabled: false,
    title: 'Preguntas Frecuentes',
    subtitle: 'Todo lo que necesitas saber antes de visitarnos.',
  },

  gallery: {
    enabled: false,
    title: 'Galería',
    subtitle: 'Conoce nuestro espacio y nuestras creaciones.',
  },

  blog: {
    enabled: false,
    title: 'Blog',
    subtitle: 'Noticias, recetas y artículos de interés.',
  },
};

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Returns `true` when the given secondary module is enabled in config.
 *
 * @example
 * if (isModuleEnabled('faq')) { ... }
 */
export function isModuleEnabled(moduleId: SecondaryModuleId): boolean {
  return secondaryModules[moduleId]?.enabled ?? false;
}
