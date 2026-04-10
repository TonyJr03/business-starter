import type { BusinessConfig } from '@/types';

/**
 * Configuración central del negocio.
 *
 * Este objeto es la fuente de verdad para toda la información del negocio:
 * identidad, contacto, horarios, módulos activos e integración visual.
 *
 * Para adaptar el starter a un nuevo cliente, ajusta únicamente este archivo
 * (y src/config/theme.ts para los colores y tipografías).
 *
 * Nomenclatura neutral: los campos no hacen referencia a ningún tipo de
 * negocio en particular para garantizar reutilización entre sectores.
 */
export const businessConfig: BusinessConfig = {
  // ─── Identidad ─────────────────────────────────────────────────────────────
  name: 'Café La Esquina',
  slug: 'cafe-la-esquina',
  tagline: 'El rincón del buen café habanero',
  description:
    'Café La Esquina es un rincón acogedor en el corazón de La Habana donde el aroma del café recién hecho te da la bienvenida. Ofrecemos los mejores cafés cubanos, bebidas artesanales y una selección de bocados para disfrutar en un ambiente tranquilo y familiar.',
  shortDescription: 'Tu cafetería de confianza en La Habana. Café cubano, ambiente acogedor y los mejores sabores.',

  // ─── Logo ──────────────────────────────────────────────────────────────────
  logo: {
    url: '/images/logo.png',
    alt: 'Café La Esquina',
  },
  coverImageUrl: '/images/cover.jpg',

  // ─── Contacto ──────────────────────────────────────────────────────────────
  contact: {
    whatsappNumber: '+5350000000',
    phone: '+5372000000',
    email: 'contacto@cafelaesquina.cu',
  },

  // ─── Ubicación ─────────────────────────────────────────────────────────────
  address: {
    street: 'Calle 23 esquina a L, Vedado',
    municipality: 'Plaza de la Revolución',
    city: 'La Habana',
    country: 'Cuba',
  },

  // ─── Redes sociales ────────────────────────────────────────────────────────
  socialLinks: {
    instagram: 'https://instagram.com/cafelaesquina',
    facebook: 'https://facebook.com/cafelaesquina',
  },

  // ─── Horarios ──────────────────────────────────────────────────────────────
  openingHours: [
    { day: 'Lunes',     open: '08:00', close: '22:00', isClosed: false },
    { day: 'Martes',    open: '08:00', close: '22:00', isClosed: false },
    { day: 'Miércoles', open: '08:00', close: '22:00', isClosed: false },
    { day: 'Jueves',    open: '08:00', close: '22:00', isClosed: false },
    { day: 'Viernes',   open: '08:00', close: '22:00', isClosed: false },
    { day: 'Sábado',    open: '08:00', close: '22:00', isClosed: false },
    { day: 'Domingo',   open: '09:00', close: '18:00', isClosed: false },
  ],

  // ─── Módulos activos ───────────────────────────────────────────────────────
  activeModules: {
    catalog: true,
    promotions: true,
    cart: false,
    whatsappOrdering: false,
    testimonials: false,
    faq: false,
    gallery: false,
    blog: false,
  },
};
