import type { NavItem, FooterSection } from '@/types';

export const headerNav: NavItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Menú', href: '/menu' },
  { label: 'Ofertas', href: '/ofertas' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Contacto', href: '/contacto' },
];

export const footerNav: FooterSection[] = [
  {
    title: 'Navegación',
    links: [
      { label: 'Inicio', href: '/' },
      { label: 'Menú', href: '/menu' },
      { label: 'Ofertas', href: '/ofertas' },
      { label: 'Nosotros', href: '/nosotros' },
      { label: 'Contacto', href: '/contacto' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacidad', href: '/privacidad' },
      { label: 'Términos', href: '/terminos' },
    ],
  },
];
