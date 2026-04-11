import type { NavItem, FooterSection } from '@/types';

export const headerNav: NavItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Menú', href: '/menu' },
  { label: 'Ofertas', href: '/promotions' },
  { label: 'Nosotros', href: '/about' },
  { label: 'Contacto', href: '/contact' },
];

export const footerNav: FooterSection[] = [
  {
    title: 'Navegación',
    links: [
      { label: 'Inicio', href: '/' },
      { label: 'Menú', href: '/menu' },
      { label: 'Ofertas', href: '/promotions' },
      { label: 'Nosotros', href: '/about' },
      { label: 'Contacto', href: '/contact' },
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
