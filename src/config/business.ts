import type { BusinessConfig } from '@/types';
import { globalConfig } from './business-config';

/**
 * Wrapper de compatibilidad — forma heredada de `BusinessConfig`.
 *
 * Todos los datos viven en `src/config/business-config.ts` (globalConfig).
 * Este objeto los proyecta a la interfaz plana que consumen los componentes
 * y páginas existentes, eliminando cualquier duplicación.
 *
 * Para adaptar el starter a un nuevo negocio, edita únicamente
 * `src/config/business-config.ts`.
 */
export const businessConfig: BusinessConfig = {
  // ─── Identidad ─────────────────────────────────────────────────────────────
  name:             globalConfig.identity.name,
  slug:             globalConfig.identity.slug ?? '',
  tagline:          globalConfig.identity.tagline,
  description:      globalConfig.identity.description,
  shortDescription: globalConfig.identity.shortDescription ?? '',
  logo:             globalConfig.identity.logo,
  coverImageUrl:    globalConfig.identity.coverImageUrl,

  // ─── Contacto ──────────────────────────────────────────────────────────────
  contact: {
    whatsappNumber: globalConfig.contact.whatsapp,
    phone:          globalConfig.contact.phone,
    email:          globalConfig.contact.email,
  },

  // ─── Ubicación ─────────────────────────────────────────────────────────────
  address: {
    street:       globalConfig.location.street       ?? '',
    municipality: globalConfig.location.municipality ?? '',
    city:         globalConfig.location.city,
    country:      globalConfig.location.country,
  },

  // ─── Redes sociales ────────────────────────────────────────────────────────
  socialLinks: globalConfig.social,

  // ─── Horarios ──────────────────────────────────────────────────────────────
  openingHours: globalConfig.hours,

  // ─── Módulos activos ───────────────────────────────────────────────────────
  activeModules: {
    ...globalConfig.modules.core,
    faq:     globalConfig.modules.secondary.faq.enabled,
    gallery: globalConfig.modules.secondary.gallery.enabled,
    blog:    globalConfig.modules.secondary.blog.enabled,
  },
};
