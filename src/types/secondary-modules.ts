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
