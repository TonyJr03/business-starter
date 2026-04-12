// ─── IDs de Módulos Secundarios ────────────────────────────────────────────────────

/**
 * Unión de todos los identificadores de módulos secundarios soportados.
 * Añade nuevos módulos aquí para extender el sistema.
 */
export type SecondaryModuleId = 'faq' | 'gallery' | 'blog';

// ─── Tipos de contenido ────────────────────────────────────────────────────────────

/** Una entrada individual de FAQ con una pregunta y su respuesta. */
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  /** Etiqueta de agrupación opcional (ej. "Pedidos", "Horarios"). */
  category?: string;
}

/** Una imagen individual en la galería. */
export interface GalleryItem {
  id: string;
  /** URL absoluta o ruta relativa a la raíz de la imagen. */
  src: string;
  /** Descripción accesible obligatoria de la imagen. */
  alt: string;
  /** Pie de foto opcional renderizado bajo la imagen. */
  caption?: string;
  /** Etiqueta de agrupación opcional (ej. "Espacio", "Productos"). */
  category?: string;
}

/** Un artículo de blog individual. */
export interface BlogPost {
  /** Identificador único seguro para URL usado para generar la ruta del artículo. */
  slug: string;
  title: string;
  /** Descripción de una oración mostrada en listados y etiquetas meta. */
  summary: string;
  /** Cuerpo del artículo renderizado como una lista ordenada de párrafos. */
  body: string[];
  /** Cadena de fecha ISO 8601 (YYYY-MM-DD). */
  publishedAt: string;
  author?: string;
  tags?: string[];
}

// ─── Configuración por módulo ──────────────────────────────────────────────────────

/** Configuración compartida por cada módulo secundario. */
export interface SecondaryModuleConfig {
  /** Si este módulo está activo y debe ser renderizado. */
  enabled: boolean;
  /** Encabezado opcional para la sección principal del módulo. */
  title?: string;
  /** Texto de apoyo opcional mostrado bajo el título. */
  subtitle?: string;
}

// ─── Mapa completo ────────────────────────────────────────────────────────────────

/**
 * Registro de cada módulo secundario, indexado por SecondaryModuleId.
 * Type-safe: añadir un nuevo ID a la unión fuerza una entrada correspondiente aquí.
 */
export type SecondaryModulesConfig = Record<SecondaryModuleId, SecondaryModuleConfig>;
