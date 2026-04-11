import type { Promotion } from '@/types';

/**
 * promotions — promociones y ofertas especiales del negocio.
 *
 * Fuente canónica de datos de promociones.
 * Los servicios de promociones consumen este array a través del barrel @/data.
 */
export const promotions: Promotion[] = [
  {
    id: 'promo-1',
    title: 'Desayuno Completo',
    description:
      'Café cubano + tostada + jugo del día por un precio especial. Disponible de lunes a viernes de 8:00 a 11:00.',
    discountLabel: '20% OFF',
    startsAt: '2026-04-01',
    endsAt: '2026-04-30',
    isActive: true,
  },
  {
    id: 'promo-2',
    title: 'Happy Hour del Café',
    description: 'Todos los cafés a mitad de precio de 3:00 PM a 5:00 PM.',
    discountLabel: '50% OFF',
    startsAt: '2026-04-01',
    endsAt: '2026-04-30',
    isActive: true,
  },
  {
    id: 'promo-3',
    title: 'Combo Amigos',
    description:
      'Dos cafés cubanos + dos pastelitos de guayaba por un precio especial. Ideal para compartir.',
    discountLabel: 'Combo',
    isActive: true,
  },
  {
    id: 'promo-4',
    title: 'Tarde de Batidos',
    description:
      'Lleva dos batidos y paga uno. De 2:00 PM a 6:00 PM, de martes a jueves.',
    discountLabel: '2×1',
    startsAt: '2026-04-15',
    endsAt: '2026-05-15',
    isActive: false,
  },
];
