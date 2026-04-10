import type { Promotion } from '@/types';

export const mockPromotions: Promotion[] = [
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
    description: 'Dos cafés cubanos + dos pastelitos de guayaba por un precio especial.',
    discountLabel: 'Combo',
    isActive: false,
  },
];
