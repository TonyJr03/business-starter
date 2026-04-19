import type { BusinessSocial, DayHours } from '@/types';

// ─── Tipo de fila SQL ─────────────────────────────────────────────────────────
// Representa la forma exacta devuelta por Supabase para businesses
// después de la migración 20260419000001.

export interface BusinessSettingsRow {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  whatsapp: string | null;
  phone: string | null;
  email: string | null;
  /** Dirección legible: calle + municipio (ciudad y país van en city/country). */
  address: string | null;
  city: string | null;
  country: string | null;
  /** JSONB → BusinessSocial: { instagram?, facebook?, telegram?, … } */
  social: BusinessSocial | null;
  /** JSONB → DayHours[]: [{ day, open, close, isClosed }, …] */
  hours: DayHours[] | null;
}

/** Campos necesarios para INSERT (Supabase genera id). */
export type BusinessSettingsInsertRow = Omit<BusinessSettingsRow, 'id'>;

// ─── Tipo de dominio ──────────────────────────────────────────────────────────

/**
 * Settings básicos del negocio leídos de la BD.
 * Subconjunto de `BusinessGlobalConfig` orientado a la persistencia:
 * no incluye branding, módulos ni navegación (gestión de código, no de datos).
 */
export interface BusinessSettings {
  /** UUID de la fila en DB. Vacío ('') cuando el fallback viene de globalConfig. */
  id: string;
  /** Slug único del negocio (ej. 'cafe-la-esquina'). */
  slug: string;
  /** Nombre comercial visible en la UI. */
  name: string;
  /** Descripción breve de una línea para footer y meta tags. */
  shortDescription?: string;
  /** WhatsApp en formato E.164 (ej. '+5350000000'). Campo de contacto primario. */
  whatsapp?: string;
  /** Teléfono adicional en formato E.164. */
  phone?: string;
  /** Email de contacto público. */
  email?: string;
  /** Dirección legible: calle + municipio. */
  address?: string;
  /** Ciudad donde opera el negocio. */
  city?: string;
  /** País donde opera el negocio. */
  country?: string;
  /** Redes sociales: { instagram?, facebook?, telegram?, … } */
  social?: BusinessSocial;
  /** Horario semanal: array de DayHours. */
  hours?: DayHours[];
}

// ─── Lectura: fila → dominio ──────────────────────────────────────────────────

export function rowToBusinessSettings(row: BusinessSettingsRow): BusinessSettings {
  return {
    id:               row.id,
    slug:             row.slug,
    name:             row.name,
    shortDescription: row.short_description ?? undefined,
    whatsapp:         row.whatsapp ?? undefined,
    phone:            row.phone ?? undefined,
    email:            row.email ?? undefined,
    address:          row.address ?? undefined,
    city:             row.city ?? undefined,
    country:          row.country ?? undefined,
    social:           row.social ?? undefined,
    hours:            row.hours ?? undefined,
  };
}

// ─── Escritura: dominio → fila ────────────────────────────────────────────────
// Reservado para operaciones CRUD del panel de administración (sprint futuro).
// Implementar aquí: businessSettingsToUpdateRow()
