import type { NavItem, FooterSection } from '@/types';
import { globalConfig } from './business-config';

// La navegación se deriva de `modules.pages`, filtrada por `enabled` y en
// el orden de declaración definido en business-config.ts → `pageModules`.
// Home es la única ruta fija; se antepone siempre.
const pageNavItems: NavItem[] = Object.values(globalConfig.modules.pages)
  .filter((m) => m.enabled)
  .map((m) => ({ label: m.navLabel, href: m.path }));

export const headerNav: NavItem[] = [
  { label: 'Inicio', href: '/' },
  ...pageNavItems,
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
