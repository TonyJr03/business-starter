import type { Category } from '@/types';

export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Cafés',
    slug: 'cafes',
    description: 'Café cubano, espresso, americano y más.',
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 'cat-2',
    name: 'Bebidas frías',
    slug: 'bebidas-frias',
    description: 'Jugos, batidos y refrescos naturales.',
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 'cat-3',
    name: 'Bocados',
    slug: 'bocados',
    description: 'Pastelitos, snacks y algo para acompañar.',
    sortOrder: 3,
    isActive: true,
  },
];
