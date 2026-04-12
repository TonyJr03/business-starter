/**
 * Wrapper de compatibilidad — proyecta branding desde globalConfig.
 *
 * MainLayout ya no importa este módulo; lee `globalConfig.branding` directamente.
 * Este wrapper se mantiene para consumidores externos que puedan necesitar la
 * forma plana de `themeConfig` (p. ej. scripts de generación de tokens, tests).
 *
 * Para cambiar colores o tipografías, edita
 * `src/config/business-config.ts` → `branding`.
 *
 * Los tokens estructurales del sistema (spacing, radius, shadows, etc.)
 * se definen en src/styles/tokens.css y no se sobreescriben aquí.
 */
import { globalConfig } from './business-config';

const { colors, typography } = globalConfig.branding;

export const themeConfig = {
  colors: {
    primary:         colors?.primary         ?? '#6F4E37',
    secondary:       colors?.secondary       ?? '#F5E6D3',
    accent:          colors?.accent          ?? '#D4A574',
    footerBg:        colors?.footerBg        ?? '#111827',
    footerText:      colors?.footerText      ?? '#FFFFFF',
    footerTextMuted: colors?.footerTextMuted ?? '#9CA3AF',
    footerBorder:    colors?.footerBorder    ?? '#1F2937',
  },
  fonts: {
    heading: typography?.heading ?? "'Inter', system-ui, sans-serif",
    body:    typography?.body    ?? "'Inter', system-ui, sans-serif",
  },
};
