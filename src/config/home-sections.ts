import type { HomeSectionEntry } from '@/types/home-sections';
import { businessConfig } from './business';

/**
 * Home page sections configuration.
 *
 * Each entry controls visibility (`enabled`), stacking order (`order`),
 * and static display props for a section component.
 *
 * Rules:
 * - Set `enabled: false` to hide a section without removing it.
 * - Change `order` values to reorder sections (ascending, gaps allowed).
 * - Runtime data (feature items, openingHours) is injected by the page;
 *   only display-level props live here.
 *
 * Sections with IDs 'promotions', 'testimonials', 'location' are included
 * for future use — their components are not built yet.
 */
export const homeSections: HomeSectionEntry[] = [
  {
    id: 'hero',
    enabled: true,
    order: 1,
    props: {
      tagline: businessConfig.tagline,
      title: businessConfig.name,
      subtitle: businessConfig.shortDescription,
      primaryCta: { label: 'Ver Menú', href: '/menu' },
      secondaryCta: { label: 'Contáctanos', href: '/contact' },
      bg: 'secondary',
      size: 'lg',
    },
  },
  {
    id: 'highlights',
    enabled: true,
    order: 2,
    props: {
      title: '¿Por qué elegirnos?',
      subtitle: businessConfig.description,
      columns: 3,
      bg: 'surface',
      size: 'md',
    },
  },
  {
    id: 'promotions',
    enabled: false,
    order: 3,
    props: {
      title: 'Ofertas especiales',
      bg: 'default',
      size: 'md',
    },
  },
  {
    id: 'testimonials',
    enabled: false,
    order: 4,
    props: {
      title: 'Lo que dicen nuestros clientes',
      bg: 'surface',
      size: 'md',
    },
  },
  {
    id: 'hours',
    enabled: true,
    order: 5,
    props: {
      title: 'Horarios',
      bg: 'default',
      size: 'md',
    },
  },
  {
    id: 'whatsapp_cta',
    enabled: true,
    order: 6,
    props: {
      title: '¿Listo para ordenar?',
      subtitle: 'Escríbenos directamente por WhatsApp y te atendemos al momento.',
      buttonLabel: 'Escribir ahora',
      message: `Hola ${businessConfig.name}, me gustaría hacer una consulta.`,
      bg: 'secondary',
      size: 'md',
    },
  },
  {
    id: 'location',
    enabled: false,
    order: 7,
    props: {
      title: 'Dónde encontrarnos',
      bg: 'surface',
      size: 'md',
    },
  },
];
