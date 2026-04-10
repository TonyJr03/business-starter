import type { BusinessInfo } from '@/types';

export const siteConfig: BusinessInfo = {
  name: 'Café La Esquina',
  slug: 'cafe-la-esquina',
  description:
    'Café La Esquina es un rincón acogedor en el corazón de La Habana donde el aroma del café recién hecho te da la bienvenida. Ofrecemos los mejores cafés cubanos, bebidas artesanales y una selección de bocados para disfrutar en un ambiente tranquilo y familiar.',
  shortDescription: 'Tu cafetería de confianza en La Habana. Café cubano, ambiente acogedor y los mejores sabores.',
  whatsappNumber: '+5350000000',
  phone: '+5372000000',
  email: 'contacto@cafelaesquina.cu',
  address: 'Calle 23 esquina a L, Vedado',
  municipality: 'Plaza de la Revolución',
  city: 'La Habana',
  logoUrl: '/images/logo.png',
  coverImageUrl: '/images/cover.jpg',
  socialLinks: {
    instagram: 'https://instagram.com/cafelaesquina',
    facebook: 'https://facebook.com/cafelaesquina',
  },
  openingHours: [
    { day: 'Lunes', open: '08:00', close: '22:00', isClosed: false },
    { day: 'Martes', open: '08:00', close: '22:00', isClosed: false },
    { day: 'Miércoles', open: '08:00', close: '22:00', isClosed: false },
    { day: 'Jueves', open: '08:00', close: '22:00', isClosed: false },
    { day: 'Viernes', open: '08:00', close: '22:00', isClosed: false },
    { day: 'Sábado', open: '08:00', close: '22:00', isClosed: false },
    { day: 'Domingo', open: '09:00', close: '18:00', isClosed: false },
  ],
};
