import type { NavItem, FooterSection } from '@/types';
import { globalConfig } from './business-config';
import { isModuleEnabled } from './secondary-modules';

// Elementos de navegación de módulos secundarios — solo incluidos cuando el módulo está activo.
// Las hrefs y labels están aquí porque son propiedades de rutas, no de contenido.
const secondaryNavItems: NavItem[] = [
  ...(isModuleEnabled('faq')     ? [{ label: 'FAQ',     href: '/faq'     }] : []),
  ...(isModuleEnabled('gallery') ? [{ label: 'Galería', href: '/gallery' }] : []),
  ...(isModuleEnabled('blog')    ? [{ label: 'Blog',    href: '/blog'    }] : []),
];

// Los ítems estáticos vienen de globalConfig; los secundarios se insertan antes
// de 'Nosotros' y 'Contacto' para mantener el orden lógico de navegación.
const [staticBefore, staticAfter] = (() => {
  const main = globalConfig.navigation.main;
  const splitAt = main.findIndex((item) => item.href === '/about');
  return splitAt === -1
    ? [main, [] as NavItem[]]
    : [main.slice(0, splitAt), main.slice(splitAt)];
})();

export const headerNav: NavItem[] = [
  ...staticBefore,
  ...secondaryNavItems,
  ...staticAfter,
];

export const footerNav: FooterSection[] = [
  {
    title: 'Navegación',
    links: headerNav,
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacidad', href: '/privacidad' },
      { label: 'Términos',   href: '/terminos'   },
    ],
  },
];
