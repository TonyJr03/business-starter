/**
 * ContentFeature — ítem de un bloque de características / propuesta de valor.
 *
 * Diseñado para bloques tipo "¿Por qué elegirnos?" en la home o secciones
 * de valores. Compatible estructuralmente con FeatureItem del componente
 * FeatureSection.astro.
 */
export interface ContentFeature {
  icon?: string;
  title: string;
  description: string;
}

/**
 * AboutContent — bloque de contenido narrativo para la página "Nosotros" / About.
 */
export interface AboutContent {
  /** Párrafos de la historia del negocio. */
  story: string[];
  /** Declaración de misión o propuesta de valor en una frase. */
  mission?: string;
  /** Diferenciadores clave del negocio. */
  differentiators?: ContentFeature[];
}
