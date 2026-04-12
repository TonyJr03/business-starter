// ─── Base ────────────────────────────────────────────────────────────────────

interface SectionBase {
  /** Whether this section is rendered on the Home page. */
  enabled: boolean;
  /** Ascending render order (1 = topmost). */
  order: number;
}

// ─── Per-section props ────────────────────────────────────────────────────────

export interface HeroSectionProps {
  title: string;
  tagline?: string;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  align?: 'center' | 'left';
  bg?: 'secondary' | 'primary' | 'surface' | 'default';
  size?: 'sm' | 'md' | 'lg';
}

/** Display props only — feature items are injected at render time from src/data. */
export interface HighlightsSectionProps {
  title?: string;
  subtitle?: string;
  columns?: 2 | 3 | 4;
  bg?: 'default' | 'surface' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

/** Placeholder — component not yet built. */
export interface PromotionsSectionProps {
  title?: string;
  subtitle?: string;
  bg?: 'default' | 'surface' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

/** Placeholder — component not yet built. */
export interface TestimonialsSectionProps {
  title?: string;
  subtitle?: string;
  bg?: 'default' | 'surface' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export interface WhatsappCtaSectionProps {
  title: string;
  subtitle?: string;
  buttonLabel?: string;
  /** Pre-filled WhatsApp message. Interpolated at config creation time. */
  message?: string;
  bg?: 'default' | 'surface' | 'secondary' | 'primary';
  size?: 'sm' | 'md' | 'lg';
}

/** Placeholder — component not yet built. */
export interface LocationSectionProps {
  title?: string;
  bg?: 'default' | 'surface' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

/** Display props only — openingHours array is injected at render time from businessConfig. */
export interface HoursSectionProps {
  title?: string;
  bg?: 'default' | 'surface' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

// ─── Discriminated union ──────────────────────────────────────────────────────

/**
 * A single Home section entry: identity, visibility, render order and display props.
 * The `id` field is the discriminant — TypeScript narrows `props` automatically.
 */
export type HomeSectionEntry =
  | (SectionBase & { id: 'hero';         props: HeroSectionProps })
  | (SectionBase & { id: 'highlights';   props: HighlightsSectionProps })
  | (SectionBase & { id: 'promotions';   props: PromotionsSectionProps })
  | (SectionBase & { id: 'testimonials'; props: TestimonialsSectionProps })
  | (SectionBase & { id: 'whatsapp_cta'; props: WhatsappCtaSectionProps })
  | (SectionBase & { id: 'location';     props: LocationSectionProps })
  | (SectionBase & { id: 'hours';        props: HoursSectionProps });

/** Union of all valid section IDs — derived from the entry type, never duplicated. */
export type HomeSectionId = HomeSectionEntry['id'];
