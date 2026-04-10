/**
 * Configuración de marca visual.
 *
 * Solo contiene los valores que varían por negocio.
 * Los tokens estructurales del sistema (spacing, radius, shadows, etc.)
 * se definen en src/styles/tokens.css y no se sobreescriben aquí.
 */
export const themeConfig = {
  colors: {
    /** Color principal de marca: botones, headings, íconos activos. */
    primary:   '#6F4E37',
    /** Color de fondo de secciones destacadas (hero, encabezados). */
    secondary: '#F5E6D3',
    /** Color de acento: badges, CTAs secundarios, highlights. */
    accent:    '#D4A574',
  },
  fonts: {
    /** Fuente para títulos y encabezados. */
    heading: "'Inter', system-ui, sans-serif",
    /** Fuente para cuerpo de texto. */
    body:    "'Inter', system-ui, sans-serif",
  },
};
