// ─── Secondary Module IDs ──────────────────────────────────────────────────────

/**
 * Union of all supported secondary module identifiers.
 * Add new modules here to extend the system.
 */
export type SecondaryModuleId = 'faq' | 'gallery' | 'blog';

// ─── Content types ────────────────────────────────────────────────────────────

/** A single FAQ entry with a question and its answer. */
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  /** Optional grouping label (e.g. "Pedidos", "Horarios"). */
  category?: string;
}

/** A single image in the gallery. */
export interface GalleryItem {
  id: string;
  /** Absolute URL or root-relative path to the image. */
  src: string;
  /** Required accessible description of the image. */
  alt: string;
  /** Optional caption rendered below the image. */
  caption?: string;
  /** Optional grouping label (e.g. "Espacio", "Productos"). */
  category?: string;
}

/** A single blog post. */
export interface BlogPost {
  /** URL-safe unique identifier used to generate the post route. */
  slug: string;
  title: string;
  /** One-sentence description shown in listings and meta tags. */
  summary: string;
  /** Post body rendered as an ordered list of paragraphs. */
  body: string[];
  /** ISO 8601 date string (YYYY-MM-DD). */
  publishedAt: string;
  author?: string;
  tags?: string[];
}

// ─── Per-module config ─────────────────────────────────────────────────────────

/** Configuration shared by every secondary module. */
export interface SecondaryModuleConfig {
  /** Whether this module is active and should be rendered. */
  enabled: boolean;
  /** Optional heading for the module's main section. */
  title?: string;
  /** Optional supporting copy shown below the title. */
  subtitle?: string;
}

// ─── Full map ─────────────────────────────────────────────────────────────────

/**
 * Record of every secondary module, keyed by SecondaryModuleId.
 * Type-safe: adding a new ID to the union forces a matching entry here.
 */
export type SecondaryModulesConfig = Record<SecondaryModuleId, SecondaryModuleConfig>;
