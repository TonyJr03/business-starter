// ─── Primitivos compartidos ──────────────────────────────────────────────────

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tiktok?: string;
  telegram?: string;
}

export interface OpeningHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

// ─── BusinessInfo (legado — usado por siteConfig) ────────────────────────────

export interface BusinessInfo {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  whatsappNumber: string;
  phone?: string;
  email?: string;
  address: string;
  municipality: string;
  city: string;
  logoUrl?: string;
  coverImageUrl?: string;
  socialLinks: SocialLinks;
  openingHours: OpeningHours[];
}

// ─── BusinessConfig (nuevo — fuente de verdad unificada) ─────────────────────

export interface Logo {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface ContactInfo {
  whatsappNumber: string;
  phone?: string;
  email?: string;
}

export interface AddressInfo {
  street: string;
  municipality: string;
  city: string;
  country?: string;
}

/**
 * Módulos activables/desactivables por negocio.
 * Controla qué secciones y funcionalidades se renderizan.
 */
export interface ActiveModules {
  catalog: boolean;
  promotions: boolean;
  cart: boolean;
  whatsappOrdering: boolean;
  testimonials: boolean;
  faq: boolean;
  gallery: boolean;
  blog: boolean;
}

/**
 * Configuración completa de un negocio.
 * Diseñado para ser neutral de dominio y reutilizable
 * entre distintos tipos de negocios locales.
 */
export interface BusinessConfig {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  shortDescription: string;
  logo?: Logo;
  coverImageUrl?: string;
  contact: ContactInfo;
  address: AddressInfo;
  socialLinks: SocialLinks;
  openingHours: OpeningHours[];
  activeModules: ActiveModules;
}
