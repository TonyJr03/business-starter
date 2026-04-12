import type { NavItem, FooterSection } from '@/types';
import { isModuleEnabled } from './secondary-modules';

// Elementos de navegación de módulos secundarios — solo incluidos cuando el módulo está activo.
const secondaryNavItems: NavItem[] = [
  ...(isModuleEnabled('faq')     ? [{ label: 'FAQ',     href: '/faq'     }] : []),
  ...(isModuleEnabled('gallery') ? [{ label: 'Galería', href: '/gallery' }] : []),
  ...(isModuleEnabled('blog')    ? [{ label: 'Blog',    href: '/blog'    }] : []),
];

export const headerNav: NavItem[] = [
  { label: 'Inicio',       href: '/'           },
  { label: 'Menú',         href: '/menu'        },
  { label: 'Promociones',  href: '/promotions'  },
  ...secondaryNavItems,
  { label: 'Nosotros',     href: '/about'       },
  { label: 'Contacto',     href: '/contact'     },
];

export const footerNav: FooterSection[] = [
  {
    title: 'Navegación',
    links: [
      { label: 'Inicio',       href: '/'          },
      { label: 'Menú',         href: '/menu'       },
      { label: 'Promociones',  href: '/promotions' },
      ...secondaryNavItems,
      { label: 'Nosotros',     href: '/about'      },
      { label: 'Contacto',     href: '/contact'    },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacidad', href: '/privacidad' },
      { label: 'Términos',   href: '/terminos'   },
    ],
  },
];
