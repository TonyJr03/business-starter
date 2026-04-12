import type { SecondaryModuleId, SecondaryModulesConfig } from '@/types/secondary-modules';

/**
 * Configuración de módulos secundarios.
 *
 * Cada entrada controla si un módulo se renderiza (`enabled`) y lleva
 * el texto de visualización (título / subtítulo) usado por el componente de sección del módulo.
 *
 * Uso:
 * - Establece `enabled: true` para activar un módulo en todo el sitio.
 * - Anula `title` / `subtitle` para que coincidan con tu voz de marca.
 * - Usa `isModuleEnabled(id)` en componentes y páginas para verificaciones de protección.
 *
 * Las secciones FAQ, Gallery y Blog están deshabilitadas por defecto;
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
 * Devuelve `true` cuando el módulo secundario dado está habilitado en la configuración.
 *
 * @example
 * if (isModuleEnabled('faq')) { ... }
 */
export function isModuleEnabled(moduleId: SecondaryModuleId): boolean {
  return secondaryModules[moduleId]?.enabled ?? false;
}
