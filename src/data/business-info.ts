import type { ContentFeature, AboutContent } from '@/types';
import { businessConfig } from '@/config';

/**
 * homeFeatures — propuesta de valor para la sección de características del Home.
 * Personaliza estos ítems para cada negocio.
 */
export const homeFeatures: ContentFeature[] = [
  {
    icon: '✨',
    title: 'Calidad artesanal',
    description:
      'Cada producto elaborado con los mejores ingredientes locales y con el cuidado de siempre.',
  },
  {
    icon: '📍',
    title: businessConfig.address.city,
    description: `Encuéntranos en ${businessConfig.address.street}, ${businessConfig.address.municipality}.`,
  },
  {
    icon: '🕐',
    title: 'Abierto toda la semana',
    description: 'Horario extendido para que disfrutes cuando lo necesites.',
  },
];

/**
 * aboutContent — contenido narrativo de la página "Nosotros".
 */
export const aboutContent: AboutContent = {
  story: [
    'Café La Esquina nació en 2018 de la mano de dos amigos habaneros con un sueño sencillo: crear un espacio donde el café de verdad tuviera el protagonismo que merece. Lo que empezó como un pequeño local en el Vedado se convirtió rápidamente en el punto de encuentro favorito del barrio.',
    'Trabajamos con granos de café cubano de primera calidad, tostados de forma artesanal para preservar cada matiz de sabor. Nuestro equipo está formado por personas apasionadas por la buena atención y el ambiente tranquilo, donde cada visita se siente como en casa.',
    'Hoy seguimos fieles a esa misma filosofía: café de calidad, trato cercano y un rincón acogedor en el corazón de La Habana.',
  ],
};
