/**
 * Wrapper de compatibilidad — proyecta los módulos secundarios desde globalConfig.
 *
 * Para activar/desactivar un módulo o cambiar su título, edita
 * `src/config/business-config.ts` → `modules.secondary`.
 */
import type { SecondaryModuleId, SecondaryModulesConfig } from '@/types/secondary-modules';
import { globalConfig } from './business-config';

/** Módulos secundarios extraídos directamente del config global. */
export const secondaryModules: SecondaryModulesConfig = globalConfig.modules.secondary;

// ─── Helper ────────────────────────────────────────────────────────────────────────────

/**
 * Devuelve `true` cuando el módulo secundario dado está habilitado en la configuración.
 *
 * @example
 * if (isModuleEnabled('faq')) { ... }
 */
export function isModuleEnabled(moduleId: SecondaryModuleId): boolean {
  return globalConfig.modules.secondary[moduleId]?.enabled ?? false;
}
