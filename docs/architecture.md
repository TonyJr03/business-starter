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
│   ├── common/       → Componentes compartidos: Header, Footer, SectionHeader, etc.
│   ├── ui/           → Primitivas de UI genéricas (sin lógica de negocio)
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

- **Naming:** kebab-case → `index.astro`, `about.astro`, `catalog.astro`
- Solo orquestación: importar layouts y secciones, sin lógica de negocio en el template
- Las subcarpetas crean rutas anidadas: `pages/admin/` → `/admin/...`
- La carga de datos (`getStaticProps` style) va al frontmatter `---`

**Páginas actuales:**
- `index.astro` — Home (secciones configurables vía `homeSections`)
- `about.astro` — Sobre el negocio
- `catalog.astro` — Catálogo de productos
- `promotions.astro` — Promociones y ofertas
- `contact.astro` — Contacto
- `faq.astro` — Preguntas frecuentes
- `gallery.astro` — Galería
- `blog/index.astro` — Listado de posts
- `blog/[slug].astro` — Post individual
- `styleguide.astro` — Guía de estilos (desarrollo)

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
Componentes compartidos entre secciones que conocen el sistema de diseño del proyecto, pero no tienen lógica de módulo ni dependencias de servicios.

- **Naming:** PascalCase → `SectionHeader.astro`, `Header.astro`, `Footer.astro`
- Pueden usar CSS vars del sistema de diseño
- Pueden importar desde `@/config` (sin `@/services`)

**Ejemplos:** `Header`, `Footer`, `SectionHeader`, `EmptyState`, `PageHeader`, `LoadingState`

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
|---------|----------|
| `business-config.ts` | `globalConfig`: fuente de verdad única del negocio. Define `pageModules` (7 módulos de página) y `sectionModules` (7 secciones de home). Valida la config al arranque con `assertValidBusinessConfig()` |
| `navigation.ts` | `headerNav`/`footerNav`: derivados 100% de `modules.pages` (solo módulos con `enabled: true`, en orden de declaración) |
| `index.ts` | Re-exporta `globalConfig`, `headerNav`, `footerNav` |

---

### `src/data/`
Datos de muestra tipados para la demo del starter (el negocio de ejemplo: Café La Esquina).
Sin conexión a base de datos. Los servicios consumen este directorio; las páginas y componentes **no** lo importan directamente.

- **Naming:** `products.ts`, `categories.ts`, `promotions.ts`, etc.
- Exportar arrays tipados usando los tipos de `@/types`
- Consumir siempre a través de `@/services`, nunca directamente en components o pages
- El barrel `index.ts` re-exporta todo

**Archivos actuales:** `highlights.ts`, `about-content.ts`, `blog-posts.ts`, `faq.ts`, `gallery.ts`, `categories.ts`, `products.ts`, `promotions.ts`, `testimonials.ts`

---

### `src/types/`
Definiciones de tipos TypeScript del dominio. Sin lógica, solo interfaces y tipos.

- Exportar todo desde `index.ts`
- Un archivo por entidad de dominio

| Archivo | Contenido |
|---------|----------|
| `business-config.ts` | `BusinessGlobalConfig` y sus sub-interfaces (Sprint 7) |
| `catalog.ts` | `Money`, `Category`, `Product`, `ProductTag`, `ProductVariant`, `ProductBadge` (Sprint 8) |
| `promotion.ts` | `Promotion`, `PromotionStatus`, `PromotionRule`, `DiscountType` (Sprint 8) |
| `page-modules.ts` | `PageModuleId`, `PageModuleConfig`, `PageModulesConfig` |
| `section-modules.ts` | `SectionModuleId`, `SectionModuleEntry` y props por sección |
| `navigation.ts` | `NavItem` |
| `secondary-modules.ts` | `FaqItem`, `GalleryItem`, `BlogPost` (solo tipos de contenido editorial) |
| `content.ts` | `ContentFeature`, `AboutContent` |
| `testimonial.ts` | `Testimonial` |

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

- **Naming:** `catalog.service.ts`, `promotions.service.ts`, `blog.service.ts`
- Funciones `async` que hoy devuelven datos de `src/data/` y mañana consultarán Supabase
- El contrato (firma de funciones + tipos de retorno) **no cambia** al migrar a Supabase
- Los helpers de dominio (`isProductAvailable`, `isPromotionActive`, `getPromotionStatus`) viven aquí

**Servicios actuales:**

| Archivo | Funciones principales |
|---|---|
| `catalog.service.ts` | `getCategories`, `getProducts`, `getFeaturedProducts`, `getProductsByCategory`, `getProductBySlug`, `isProductAvailable` |
| `promotions.service.ts` | `getPromotions`, `getActivePromotions`, `getPromotionById`, `getPromotionStatus`, `isPromotionActive` |
| `blog.service.ts` | `getPosts`, `getPostBySlug` |

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
| Páginas Astro | kebab-case | `catalog.astro`, `about.astro` |
| Archivos de datos/lib | camelCase | `products.ts` |
| Archivos de config | camelCase | `business-config.ts` |
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
src/config/              → configuración estática del negocio (fuente de verdad única)
src/data/                → datos de muestra tipados (demo business)
src/lib/supabase/        → cliente de base de datos (producción futura)
        ↓
src/services/            → abstracción de datos + reglas de dominio (mock → Supabase sin romper contrato)
        ↓
src/pages/               → carga datos via servicios en frontmatter, orquesta secciones
        ↓
src/components/sections/ → reciben datos vía props, componen la UI de página
        ↓
src/components/ui/       → primitivas sin estado, puramente visuales
```

---

## Activación de módulos

Los módulos se controlan desde `src/config/business-config.ts` (`globalConfig.modules`). El patrón en pages:

```astro
---
import { globalConfig } from '@/config';
const { modules } = globalConfig;
---

{modules.pages.catalog.enabled && <CatalogSection />}
{modules.pages.faq.enabled && <FaqSection />}
```

Todos los módulos de página siguen el mismo patrón — no hay distinción entre "core" y "secundario".
**Home (`/`) es la única ruta fija**; el resto son módulos de página activables en `modules.pages`.
Cuando un módulo está desactivado, la página muestra `<ModuleDisabled />` en lugar de redirigir.

---

## Variables de entorno

Las variables de entorno necesarias van en `.env` (nunca en el repositorio):

```
PUBLIC_SUPABASE_URL=        # URL del proyecto Supabase
PUBLIC_SUPABASE_ANON_KEY=   # Clave anónima pública de Supabase
```

Variables `PUBLIC_` son accesibles en el cliente. Variables sin prefijo solo en servidor/SSR.
