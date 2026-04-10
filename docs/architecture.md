# Arquitectura del Proyecto — Business Starter

## Propósito

Business Starter es un starter modular para sitios web de negocios locales. La arquitectura está diseñada para ser **reutilizable entre proyectos**, **extensible por módulos** y **personalizable por negocio mediante configuración**, sin tocar el núcleo técnico.

---

## Estructura de `src/`

```
src/
├── layouts/          → Layouts de página completos (Astro)
├── pages/            → Rutas del sitio (file-based routing de Astro)
├── components/
│   ├── ui/           → Primitivas de UI genéricas (sin lógica de negocio)
│   ├── common/       → Componentes compartidos que conocen el sistema de diseño
│   ├── sections/     → Secciones de página completas, activables/desactivables
│   ├── catalog/      → Módulo catálogo: cards, grids, filtros
│   ├── cart/         → Módulo carrito (fase 2)
│   ├── whatsapp/     → Integración WhatsApp: CTA, botón flotante, mensajes
│   ├── admin/        → Panel administrativo (fase 2)
│   └── checkout/     → Flujo de pedido (fase 2)
├── config/           → Configuración centralizada del negocio
├── data/
│   └── mock/         → Datos de prueba tipados para desarrollo sin Supabase
├── types/            → Interfaces y tipos TypeScript del dominio
├── lib/
│   ├── utils/        → Helpers genéricos (classnames, formateo, etc.)
│   ├── supabase/     → Cliente Supabase configurado
│   ├── whatsapp/     → Generación de URLs y mensajes WhatsApp
│   └── cart/         → Lógica de estado del carrito (fase 2)
├── services/         → Capa de acceso a datos (abstrae mock vs. Supabase)
├── styles/           → Estilos globales e importación de Tailwind
├── middleware/        → Middleware de Astro (autenticación, headers, etc.)
└── content/          → Astro Content Collections (blog, FAQ — fase 2)
```

---

## Descripción de cada carpeta

### `src/layouts/`
Layouts de Astro que envuelven páginas completas. Manejan `<head>`, SEO, estructura global y providers.

- **Naming:** PascalCase → `MainLayout.astro`, `AdminLayout.astro`
- Solo van layouts aquí, nunca componentes de contenido
- Reciben props mínimas: `title`, `description` (SEO)
- Los CSS vars del tema se inyectan aquí desde `themeConfig`

**Archivos actuales:**
- `MainLayout.astro` — layout principal del sitio público

---

### `src/pages/`
Páginas de Astro. El file-based routing mapea esta carpeta a URLs directamente.

- **Naming:** kebab-case → `index.astro`, `nosotros.astro`, `menu.astro`
- Solo orquestación: importar layouts y secciones, sin lógica de negocio en el template
- Las subcarpetas crean rutas anidadas: `pages/admin/` → `/admin/...`
- La carga de datos (`getStaticProps` style) va al frontmatter `---`

**Páginas actuales:**
- `index.astro` — Home
- `nosotros.astro` — Sobre nosotros
- `menu.astro` — Catálogo / Menú
- `ofertas.astro` — Promociones
- `contacto.astro` — Contacto

---

### `src/components/ui/`
Primitivas de UI genéricas y reutilizables. No tienen lógica de negocio ni conocen el dominio.

- **Naming:** PascalCase → `Button.astro`, `Badge.astro`, `Card.astro`
- Funcionan exclusivamente con props
- Sin imports de `@/config`, `@/services` ni `@/types` de dominio
- Los colores se referencian via CSS vars (`var(--color-primary)`)

**Ejemplos:** `Button`, `Badge`, `Card`, `Spinner`, `Divider`, `Avatar`

---

### `src/components/common/`
Componentes compartidos que sí conocen el sistema de diseño del proyecto, pero no tienen lógica de módulo ni dependencias de servicios.

- **Naming:** PascalCase → `SectionHeader.astro`, `EmptyState.astro`
- Pueden usar CSS vars del sistema de diseño
- No importan desde `@/config` ni `@/services`

**Ejemplos:** `SectionHeader`, `EmptyState`, `PageHeader`, `LoadingState`

---

### `src/components/sections/`
Secciones completas del sitio público. Cada una representa un bloque visual independiente de una página.

- **Naming:** PascalCase descriptivo → `HeroSection.astro`, `FeaturedProductsSection.astro`
- Pueden importar desde `@/config` y recibir datos vía props
- Diseñadas para ser activables/desactivables desde pages
- Son los bloques que el archivo de config ordena y controla

**Ejemplos:** `HeroSection`, `FeaturedProducts`, `PromotionsBanner`, `WhatsAppCTA`, `OpeningHours`, `LocationSection`, `TestimonialsSection`

---

### `src/components/catalog/`
Componentes específicos del módulo catálogo. Solo se usan cuando `modulesConfig.catalog === true`.

**Ejemplos:** `ProductCard`, `ProductGrid`, `CategoryFilter`, `ProductDetail`

---

### `src/components/whatsapp/`
Componentes de integración WhatsApp. Botón flotante, CTAs, generador de mensaje de pedido.

**Ejemplos:** `WhatsAppButton`, `WhatsAppFab`, `OrderMessagePreview`

---

### `src/config/`
Configuración centralizada del negocio. Es la fuente de verdad para el sitio estático. Se personaliza por cliente.

- Todo se exporta desde `index.ts` (barrel)
- Cada archivo tiene una sola responsabilidad
- Nunca importar desde `@/services` ni `@/data` aquí

| Archivo | Contenido |
|---------|-----------|
| `site.ts` | `BusinessInfo`: nombre, contacto, horarios, redes, ubicación |
| `modules.ts` | `ModulesConfig`: qué módulos están activos |
| `navigation.ts` | `headerNav`, `footerNav` |
| `theme.ts` | Colores, tipografías (aplicados como CSS vars en el layout) |
| `index.ts` | Re-exporta todo |

---

### `src/data/mock/`
Datos de desarrollo tipados, sin conexión a base de datos. Se usan mientras no hay integración con Supabase.

- **Naming:** `products.ts`, `categories.ts`, `promotions.ts`
- Exportar arrays tipados usando los tipos de `@/types`
- No usar directamente en components — consumir a través de `@/services`

---

### `src/types/`
Definiciones de tipos TypeScript del dominio. Sin lógica, solo interfaces y tipos.

- Exportar todo desde `index.ts`
- Un archivo por entidad de dominio

| Archivo | Contenido |
|---------|-----------|
| `business.ts` | `BusinessInfo`, `OpeningHours`, `SocialLinks` |
| `catalog.ts` | `Product`, `Category`, `ProductBadge` |
| `promotion.ts` | `Promotion` |
| `navigation.ts` | `NavItem`, `FooterSection` |
| `modules.ts` | `ModulesConfig` |

---

### `src/lib/`
Utilidades puras, helpers y clientes externos. Sin componentes UI ni lógica de presentación.

- Funciones puras sin efectos secundarios de UI
- Subcarpetas por dominio

| Subcarpeta | Contenido |
|-----------|-----------|
| `utils/` | Helpers genéricos: `cn()` para classnames |
| `supabase/` | Cliente Supabase singleton |
| `whatsapp/` | Generación de URLs y mensajes para WhatsApp |
| `cart/` | Lógica de estado del carrito (fase 2) |

---

### `src/services/`
Capa de acceso a datos. Abstrae la fuente (mock o Supabase). Las pages y sections consumen servicios, nunca datos directamente.

- **Naming:** `products.ts`, `promotions.ts`, `business.ts`
- Funciones `async` que hoy devuelven datos mock y mañana consultarán Supabase
- El contrato (firma de funciones) no cambia al migrar a Supabase

---

### `src/styles/`
Estilos globales e importación de Tailwind.

- `global.css` — importa Tailwind, define estilos base del documento
- Los tokens de color se aplican como CSS vars en `MainLayout.astro` desde `themeConfig`

---

### `src/middleware/`
Middleware de Astro para interceptar requests/responses.

**Uso futuro:** autenticación, protección de rutas `/admin/*`, headers de seguridad.

---

### `src/content/`
Astro Content Collections para contenido tipado (blog, FAQ).

**Uso futuro:** requiere `config.ts` con `defineCollection()` de Astro.

---

## Convenciones de naming

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Componentes Astro | PascalCase | `ProductCard.astro` |
| Componentes React | PascalCase | `CartDrawer.tsx` |
| Páginas Astro | kebab-case | `nosotros.astro` |
| Archivos de datos/lib | camelCase | `products.ts` |
| Archivos de config | camelCase | `site.ts` |
| Carpetas | kebab-case | `components/catalog/` |
| Funciones | camelCase | `generateWhatsAppUrl()` |
| Tipos e Interfaces | PascalCase | `Product`, `BusinessInfo` |
| Constantes exportadas | camelCase | `siteConfig`, `modulesConfig` |
| Variables de entorno | UPPER_SNAKE_CASE | `PUBLIC_SUPABASE_URL` |

---

## Dónde va cada tipo de componente

```
¿Es genérico, sin lógica de negocio, funciona solo con props?
  → components/ui/

¿Es compartido entre secciones y conoce el sistema de diseño del proyecto?
  → components/common/

¿Es una sección completa de página con estructura visual propia?
  → components/sections/

¿Pertenece exclusivamente al módulo catálogo?
  → components/catalog/

¿Es una integración de WhatsApp?
  → components/whatsapp/

¿Es parte del panel administrativo (fase 2)?
  → components/admin/
```

---

## Flujo de datos

```
src/config/              → configuración estática del negocio (fuente de verdad)
src/data/mock/           → datos de prueba tipados durante desarrollo
src/lib/supabase/        → cliente de base de datos (producción)
        ↓
src/services/            → abstracción de datos (mock → Supabase sin cambiar contrato)
        ↓
src/pages/               → carga datos en frontmatter, los pasa a secciones
        ↓
src/components/sections/ → reciben datos vía props, componen la UI de página
        ↓
src/components/ui/       → primitivas sin estado, puramente visuales
```

---

## Activación de módulos

Los módulos se controlan desde `src/config/modules.ts`. El patrón en pages:

```astro
---
import { modulesConfig } from '@/config';
---

{modulesConfig.catalog && <CatalogSection />}
{modulesConfig.promotions && <PromotionsSection />}
```

---

## Variables de entorno

Las variables de entorno necesarias van en `.env` (nunca en el repositorio):

```
PUBLIC_SUPABASE_URL=        # URL del proyecto Supabase
PUBLIC_SUPABASE_ANON_KEY=   # Clave anónima pública de Supabase
```

Variables `PUBLIC_` son accesibles en el cliente. Variables sin prefijo solo en servidor/SSR.
