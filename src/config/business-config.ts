/**
 * ════════════════════════════════════════════════════════════════════════════
 *  CONFIGURACIÓN GLOBAL DEL NEGOCIO — FUENTE DE VERDAD ÚNICA
 * ════════════════════════════════════════════════════════════════════════════
 *
 *  Para adaptar este starter a un nuevo negocio, edita ÚNICAMENTE este
 *  archivo. El resto del sistema lee todo desde `globalConfig`.
 *
 *  Bloques disponibles:
 *   · identity    → nombre, slug, tagline, descripción, logo
 *   · branding    → colores y tipografías de marca
 *   · contact     → WhatsApp, teléfono, email
 *   · location    → ciudad, país, calle, mapa
 *   · hours       → horarios por día de la semana
 *   · social      → redes sociales
 *   · navigation  → ítems de navegación principales (estáticos)
 *   · modules     → feature flags + home sections + módulos secundarios
 *   · seoDefaults → plantilla de título y descripción meta
 * ════════════════════════════════════════════════════════════════════════════
 */

import type {
  BusinessGlobalConfig,
  BusinessIdentity,
} from '@/types/business-config';
import type { HomeSectionEntry } from '@/types/home-sections';

// ─── Identity ────────────────────────────────────────────────────────────────
// Definida primero para poder referenciarla dentro de `homeSections`.

const identity: BusinessIdentity = {
  name: 'Café La Esquina',
  slug: 'cafe-la-esquina',
  tagline: 'El rincón del buen café habanero',
  description:
    'Café La Esquina es un rincón acogedor en el corazón de La Habana donde el aroma del café recién hecho te da la bienvenida. Ofrecemos los mejores cafés cubanos, bebidas artesanales y una selección de bocados para disfrutar en un ambiente tranquilo y familiar.',
  shortDescription:
    'Tu cafetería de confianza en La Habana. Café cubano, ambiente acogedor y los mejores sabores.',
  logo: {
    url: '/images/logo.png',
    alt: 'Café La Esquina',
  },
  coverImageUrl: '/images/cover.jpg',
};

// ─── Home sections ───────────────────────────────────────────────────────────
// Las props que dependen de `identity` (nombre, tagline, descripción) se
// referencian aquí para evitar duplicación.

const homeSections: HomeSectionEntry[] = [
  {
    id: 'hero',
    enabled: true,
    order: 1,
    props: {
      tagline: identity.tagline,
      title: identity.name,
      subtitle: identity.shortDescription,
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
      subtitle: identity.description,
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
      message: `Hola ${identity.name}, me gustaría hacer una consulta.`,
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

// ─── Config global ────────────────────────────────────────────────────────────

export const globalConfig: BusinessGlobalConfig = {
  // ── Identidad ─────────────────────────────────────────────────────────────
  identity,

  // ── Marca visual ──────────────────────────────────────────────────────────
  branding: {
    colors: {
      primary:         '#6F4E37',
      secondary:       '#F5E6D3',
      accent:          '#D4A574',
      footerBg:        '#111827',
      footerText:      '#FFFFFF',
      footerTextMuted: '#9CA3AF',
      footerBorder:    '#1F2937',
    },
    typography: {
      heading: "'Inter', system-ui, sans-serif",
      body:    "'Inter', system-ui, sans-serif",
    },
  },

  // ── Contacto ──────────────────────────────────────────────────────────────
  contact: {
    whatsapp: '+5350000000',
    phone:    '+5372000000',
    email:    'contacto@cafelaesquina.cu',
  },

  // ── Ubicación ─────────────────────────────────────────────────────────────
  location: {
    street:       'Calle 23 esquina a L, Vedado',
    municipality: 'Plaza de la Revolución',
    city:         'La Habana',
    country:      'Cuba',
  },

  // ── Horarios ──────────────────────────────────────────────────────────────
  hours: [
    { day: 'Lunes',     open: '08:00', close: '22:00', isClosed: false },
    { day: 'Martes',    open: '08:00', close: '22:00', isClosed: false },
    { day: 'Miércoles', open: '08:00', close: '22:00', isClosed: false },
    { day: 'Jueves',    open: '08:00', close: '22:00', isClosed: false },
    { day: 'Viernes',   open: '08:00', close: '22:00', isClosed: false },
    { day: 'Sábado',    open: '08:00', close: '22:00', isClosed: false },
    { day: 'Domingo',   open: '09:00', close: '18:00', isClosed: false },
  ],

  // ── Redes sociales ────────────────────────────────────────────────────────
  social: {
    instagram: 'https://instagram.com/cafelaesquina',
    facebook:  'https://facebook.com/cafelaesquina',
  },

  // ── Navegación principal (ítems estáticos) ────────────────────────────────
  // Los módulos secundarios (FAQ, Galería, Blog) se insertan automáticamente
  // por `config/navigation.ts` según su estado `enabled` en `modules.secondary`.
  navigation: {
    main: [
      { label: 'Inicio',      href: '/'          },
      { label: 'Menú',        href: '/menu'       },
      { label: 'Promociones', href: '/promotions' },
      { label: 'Nosotros',    href: '/about'      },
      { label: 'Contacto',    href: '/contact'    },
    ],
  },

  // ── Módulos ───────────────────────────────────────────────────────────────
  modules: {
    // Feature flags de módulos funcionales principales
    core: {
      catalog:          true,
      promotions:       true,
      cart:             false,
      whatsappOrdering: false,
      testimonials:     false,
    },

    // Secciones de la home: orden, visibilidad y props visuales
    homeSections,

    // Módulos secundarios: actívalos con `enabled: true` cuando el contenido esté listo
    secondary: {
      faq: {
        enabled:  false,
        title:    'Preguntas Frecuentes',
        subtitle: 'Todo lo que necesitas saber antes de visitarnos.',
      },
      gallery: {
        enabled:  false,
        title:    'Galería',
        subtitle: 'Conoce nuestro espacio y nuestras creaciones.',
      },
      blog: {
        enabled:  false,
        title:    'Blog',
        subtitle: 'Noticias, recetas y artículos de interés.',
      },
    },
  },

  // ── SEO ───────────────────────────────────────────────────────────────────
  seoDefaults: {
    titleTemplate:      `%s | ${identity.name}`,
    defaultDescription: identity.shortDescription ?? identity.description,
    ogImage:            identity.coverImageUrl,
  },
};
