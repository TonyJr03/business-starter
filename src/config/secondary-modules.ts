/**
 * Compat shim — mantiene las exportaciones históricas mientras las páginas
 * migran al acceso directo a `globalConfig.modules.pages`.
 *
 * Para activar/desactivar cualquier módulo de página, edita
 * `src/config/business-config.ts` → `modules.pages`.
 *
 * @deprecated Usa `globalConfig.modules.pages[id]` directamente.
 */
import type { PageModuleId } from '@/types/page-modules';
import { globalConfig } from './business-config';

/**
 * Devuelve `true` cuando el módulo de página dado está habilitado.
 *
 * Acepta cualquier `PageModuleId` (catalog, promotions, about, contact,
 * faq, gallery, blog) en lugar de solo los módulos secundarios anteriores.
 *
 * @example
 * if (isModuleEnabled('faq')) { ... }
 * if (isModuleEnabled('catalog')) { ... }
 */
export function isModuleEnabled(moduleId: PageModuleId): boolean {
  return globalConfig.modules.pages[moduleId]?.enabled ?? false;
}

/**
 * Acceso agrupado a los módulos de página opcionales (faq, gallery, blog).
 *
 * @deprecated Accede directamente a `globalConfig.modules.pages.faq` etc.
 */
export const secondaryModules = {
  faq:     globalConfig.modules.pages.faq,
  gallery: globalConfig.modules.pages.gallery,
  blog:    globalConfig.modules.pages.blog,
} as const;
