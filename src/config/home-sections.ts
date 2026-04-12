/**
 * Wrapper de compatibilidad — re-exporta las home sections desde globalConfig.
 *
 * Para editar el orden, visibilidad o props de cada sección, modifica
 * `src/config/business-config.ts` → `modules.homeSections`.
 */
import { globalConfig } from './business-config';

export const homeSections = globalConfig.modules.homeSections;

// Exportación auxiliar tipada para componentes que la necesiten
export type { HomeSectionEntry } from '@/types/home-sections';

// ─── Archivo congelado — no añadir datos aquí ────────────────────────────────
// Bloque vacío conservado para que el linter no marque el archivo como vacío.
const _homeSections = [
] as const;
void _homeSections; // evita advertencia de variable no usada
