# Inventario de Migración: Astro → Next.js

**Versión:** 1.0  
**Fecha:** Abril 2026  
**Sprint:** S12.5 — Evaluación arquitectónica SaaS  
**Estado:** Referencia para planificación

---

## Resumen ejecutivo

| Categoría | Archivos | Esfuerzo |
|---|---|---|
| ✅ Reutilizable sin cambios | ~40 archivos | 0 días |
| 🔧 Reutilizable con adaptación leve | ~8 archivos | 0.5 días |
| 🔁 Reescritura necesaria | ~38 archivos `.astro` | 2–3 días |
| 🗑️ Deprecable / sin equivalencia | 3 archivos | 0 días |

**Total estimado: 3–5 días** para un desarrollador que conoce el repo y Next.js App Router.

El coste real de la migración es bajo porque **el 70% del valor del proyecto (tipos, servicios, lógica de negocio, persistencia, config, datos) es TypeScript puro sin dependencias de Astro**.

---

## ✅ Categoría 1 — Reutilizable sin cambios

No tocar. Mover el archivo tal cual al nuevo proyecto.

### Base de datos

| Archivo | Por qué no cambia |
|---|---|
| `supabase/migrations/*.sql` | SQL puro, independiente del framework |
| `supabase/seed.sql` | SQL puro |
| `supabase/config.toml` | Configuración del CLI de Supabase |
| `supabase/snippets/` | SQL de referencia |

### Tipos (`src/types/`)

Todos los tipos son TypeScript puro. Cero imports de `astro`.

| Archivo | Contenido |
|---|---|
| `src/types/business-config.ts` | `BusinessGlobalConfig`, sub-interfaces, validators |
| `src/types/catalog.ts` | `Product`, `Category`, `Money`, `ProductTag`, etc. |
| `src/types/promotion.ts` | `Promotion`, `PromotionStatus`, `DiscountType`, etc. |
| `src/types/content.ts` | `ContentFeature`, `AboutContent` |
| `src/types/testimonial.ts` | `Testimonial` |
| `src/types/navigation.ts` | `NavItem` |
| `src/types/page-modules.ts` | `PageModuleId`, `PageModuleConfig`, `PageModulesConfig` |
| `src/types/section-modules.ts` | `SectionModuleId`, `SectionModuleEntry` (alias de home sections) |
| `src/types/index.ts` | Barrel de re-exports |

### Configuración (`src/config/`)

La config no usa nada de Astro — solo tipos propios.

| Archivo | Contenido |
|---|---|
| `src/config/business-config.ts` | `globalConfig` — fuente de verdad única del negocio |
| `src/config/navigation.ts` | `headerNav` derivado de `modules.pages` |
| `src/config/index.ts` | Barrel de re-exports |

> ⚠️ `src/config/home-sections.ts` y `src/config/secondary-modules.ts` también son portables, pero se revisan en la categoría 2 por un detalle menor.

### Datos (`src/data/`)

Datos editoriales, TypeScript puro.

| Archivo | Contenido |
|---|---|
| `src/data/products.ts` | `products: Product[]` |
| `src/data/categories.ts` | `categories: Category[]` |
| `src/data/promotions.ts` | `promotions: Promotion[]` |
| `src/data/blog-posts.ts` | `blogPosts: BlogPost[]` |
| `src/data/faq.ts` | `faqItems: FaqItem[]` |
| `src/data/gallery.ts` | `galleryItems: GalleryItem[]` |
| `src/data/testimonials.ts` | `testimonials: Testimonial[]` |
| `src/data/highlights.ts` | `homeFeatures: ContentFeature[]` |
| `src/data/about-content.ts` | `aboutContent: AboutContent` |
| `src/data/index.ts` | Barrel de re-exports |

### Servicios (`src/services/`)

TypeScript puro — usan Supabase Client directamente, sin APIs de Astro.

| Archivo | Contenido |
|---|---|
| `src/services/catalog.service.ts` | `getProducts`, `getCategories`, `getProductBySlug`, etc. |
| `src/services/promotions.service.ts` | `getPromotions`, `getActivePromotions`, etc. |
| `src/services/blog.service.ts` | `getPosts`, `getPostBySlug` |
| `src/services/business.service.ts` | `getBusinessSettings`, `settingsFromConfig` |

### Persistencia (`src/lib/persistence/`)

Mappers de DB → dominio. Cero dependencias de framework.

| Archivo | Contenido |
|---|---|
| `src/lib/persistence/product.mapper.ts` | `ProductRow`, `rowToProduct()` |
| `src/lib/persistence/category.mapper.ts` | `CategoryRow`, `rowToCategory()` |
| `src/lib/persistence/promotion.mapper.ts` | `PromotionRow`, `rowToPromotion()` |
| `src/lib/persistence/business.mapper.ts` | `BusinessSettingsRow`, `rowToBusinessSettings()` |
| `src/lib/persistence/index.ts` | Barrel |

### Documentación (`docs/`)

No requiere migración.

| Directorio | Estado |
|---|---|
| `docs/saas/` | Se crea en S12.5, framework-agnóstico |
| `docs/architecture.md` | Necesita actualización post-migración, no bloquea |
| `docs/*.md` | Todos portables |

---

## 🔧 Categoría 2 — Reutilizable con adaptación leve

La lógica es correcta, pero hay una o dos líneas que dependen de Astro y deben reemplazarse por el equivalente de Next.js.

### `src/lib/supabase/server.ts`

**Problema:** Usa `AstroCookies` de `astro`.

```typescript
// ACTUAL (Astro)
import type { AstroCookies } from 'astro';
export function createSupabaseServerClient(cookies: AstroCookies, request: Request) { ... }

// ADAPTADO (Next.js App Router)
import { cookies } from 'next/headers';
export function createSupabaseServerClient() {
  const cookieStore = cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(cs) { cs.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); },
    },
  });
}
```

**Esfuerzo:** 15 minutos. La lógica de Supabase no cambia — solo el origen de las cookies.

---

### `src/lib/auth/index.ts`

**Problema:** Firma `getUser(cookies, request)` depende de `AstroCookies`.

```typescript
// ACTUAL (Astro)
export async function getUser(cookies: AstroCookies, request: Request): Promise<User | null>

// ADAPTADO (Next.js)
export async function getUser(): Promise<User | null>  // lee cookies() internamente
```

**Esfuerzo:** 20 minutos. La lógica de validación de Supabase es idéntica.

---

### `src/lib/supabase/client.ts`

**Problema:** Lee `import.meta.env` (Vite/Astro). En Next.js se usa `process.env`.

```typescript
// ACTUAL (Astro/Vite)
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;

// ADAPTADO (Next.js)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
```

**Esfuerzo:** 5 minutos. Cambiar los nombres de las env vars (`PUBLIC_` → `NEXT_PUBLIC_`).

---

### `src/lib/whatsapp/index.ts`

**Problema:** Importa `globalConfig` directamente. En multi-tenant deberá recibir el tenant como parámetro. No es un problema de framework, pero es el momento de corregirlo.

```typescript
// ACTUAL (singleton)
export function getWhatsAppUrl(message?: string): string {
  const number = globalConfig.contact.whatsapp.replace(/\D/g, '');

// ADAPTADO (multi-tenant)
export function getWhatsAppUrl(whatsapp: string, message?: string): string {
  const number = whatsapp.replace(/\D/g, '');
```

**Esfuerzo:** 15 minutos + actualizar llamadas.

---

### `src/config/home-sections.ts` y `src/config/secondary-modules.ts`

**Problema:** Sin problema de framework. El compat shim de `secondary-modules.ts` es código que ya no tiene sentido en la nueva arquitectura multi-tenant (S14+).

**Acción:** Mover a Next.js sin cambios; refactorizar en S14 cuando se construya el resolver de tenant dinámico.

---

### `src/styles/tokens.css` y `src/styles/global.css`

**Problema:** CSS puro, totalmente portable. En Next.js se importan desde el root layout (`app/layout.tsx`).

**Esfuerzo:** 5 minutos (cambiar el import de `@/styles/global.css` al nuevo layout root).

---

### `src/components/sections/section-module-registry.ts`

**Problema:** TypeScript puro, ningún import de Astro. Portable directamente.

**Acción:** Mover tal cual.

---

## 🔁 Categoría 3 — Reescritura necesaria

Estos archivos usan sintaxis `.astro` o APIs específicas de Astro (`Astro.props`, `Astro.locals`, `Astro.cookies`, `frontmatter`). Necesitan reescribirse en React/TSX.

La reescritura es **mecánica**: la lógica ya existe, solo cambia el lenguaje de plantilla.

### Páginas públicas (`src/pages/`)

| Archivo Astro | Equivalente Next.js | Complejidad |
|---|---|---|
| `src/pages/index.astro` | `app/negocios/[slug]/page.tsx` | Baja — lee config + data |
| `src/pages/catalog.astro` | `app/negocios/[slug]/catalog/page.tsx` | Baja |
| `src/pages/promotions.astro` | `app/negocios/[slug]/promotions/page.tsx` | Baja |
| `src/pages/about.astro` | `app/negocios/[slug]/about/page.tsx` | Baja |
| `src/pages/contact.astro` | `app/negocios/[slug]/contact/page.tsx` | Baja |
| `src/pages/faq.astro` | `app/negocios/[slug]/faq/page.tsx` | Baja |
| `src/pages/gallery.astro` | `app/negocios/[slug]/gallery/page.tsx` | Baja |
| `src/pages/blog/index.astro` | `app/negocios/[slug]/blog/page.tsx` | Baja |
| `src/pages/blog/[slug].astro` | `app/negocios/[slug]/blog/[post]/page.tsx` | Baja |
| `src/pages/404.astro` | `app/not-found.tsx` | Trivial |
| `src/pages/styleguide.astro` | `app/styleguide/page.tsx` (dev only) | Baja |

### Páginas admin (`src/pages/admin/`)

| Archivo Astro | Equivalente Next.js | Complejidad | Notas |
|---|---|---|---|
| `src/pages/admin/login.astro` | `app/negocios/[slug]/admin/login/page.tsx` | Media | Formulario POST → Server Action |
| `src/pages/admin/logout.astro` | Server Action en `actions/auth.ts` | Baja | No necesita página, solo acción |
| `src/pages/admin/index.astro` | `app/negocios/[slug]/admin/page.tsx` | Baja | Dashboard estático |

### Layouts (`src/layouts/`)

| Archivo Astro | Equivalente Next.js | Complejidad | Notas |
|---|---|---|---|
| `src/layouts/MainLayout.astro` | `app/negocios/[slug]/layout.tsx` | Media | Inyección de CSS vars por tenant requiere solución diferente |
| `src/layouts/AdminLayout.astro` | `app/negocios/[slug]/admin/layout.tsx` | Baja | Estructura shell + sidebar |

> **Nota sobre CSS vars por tenant:** `MainLayout.astro` actualmente inyecta vars CSS con `define:vars`. En Next.js, esto se hace con un componente `<style>` inline en el RSC del layout o con un `ThemeProvider` Client Component. No es complejo, pero requiere pensar la solución.

### Middleware (`src/middleware/index.ts`)

| Archivo | Equivalente Next.js | Complejidad | Notas |
|---|---|---|---|
| `src/middleware/index.ts` | `middleware.ts` (raíz del proyecto) | Baja | `NextRequest` / `NextResponse` en lugar de `context` de Astro |

La lógica de redirección admin es idéntica. El API cambia ligeramente:

```typescript
// ACTUAL (Astro)
export const onRequest = defineMiddleware(async (context, next) => {
  const usuario = await getUser(context.cookies, context.request);
  if (!estaAutenticado) return context.redirect(LOGIN_PATH);

// NEXT.JS
export async function middleware(request: NextRequest) {
  const usuario = await getUser(); // lee cookies internamente
  if (!estaAutenticado) return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
```

### Componentes UI (`src/components/ui/`)

| Archivo Astro | Equivalente Next.js | Complejidad | Notas |
|---|---|---|---|
| `Button.astro` | `Button.tsx` | Trivial | Props idénticas, sintaxis cambia |
| `Badge.astro` | `Badge.tsx` | Trivial | Igual |
| `Card.astro` | `Card.tsx` | Trivial | Igual |
| `Input.astro` | `Input.tsx` | Trivial | Igual |
| `Textarea.astro` | `Textarea.tsx` | Trivial | Igual |
| `Section.astro` | `Section.tsx` | Trivial | Igual |

> En Next.js App Router, estos componentes pueden ser Server Components por defecto — sin `'use client'` a menos que tengan estado o event handlers.

### Componentes comunes (`src/components/common/`)

| Archivo Astro | Equivalente Next.js | Complejidad | Notas |
|---|---|---|---|
| `Header.astro` | `Header.tsx` | Baja | Nav activa requiere `'use client'` o `usePathname()` |
| `Footer.astro` | `Footer.tsx` | Trivial | Estático, Server Component |
| `SectionHeader.astro` | `SectionHeader.tsx` | Trivial | Igual |
| `ModuleDisabled.astro` | `ModuleDisabled.tsx` | Trivial | Igual |

### Componentes de catálogo (`src/components/catalog/`)

| Archivo Astro | Equivalente Next.js | Complejidad | Notas |
|---|---|---|---|
| `ProductCard.astro` | `ProductCard.tsx` | Baja | Server Component; lógica de badge/disponibilidad idéntica |
| `PromotionCard.astro` | `PromotionCard.tsx` | Baja | Igual |
| `CategoryNav.astro` | `CategoryNav.tsx` | Baja | Posiblemente `'use client'` para active state |

### Componentes de secciones (`src/components/sections/`)

| Archivo Astro | Equivalente Next.js | Complejidad | Notas |
|---|---|---|---|
| `HeroSection.astro` | `HeroSection.tsx` | Trivial | Estático |
| `FeatureSection.astro` | `FeatureSection.tsx` | Trivial | Estático |
| `FaqSection.astro` | `FaqSection.tsx` | Baja | Posible acordeón interactivo → `'use client'` |
| `GalleryGrid.astro` | `GalleryGrid.tsx` | Trivial | Estático |
| `BlogPostCard.astro` | `BlogPostCard.tsx` | Trivial | Estático |
| `CtaWhatsappSection.astro` | `CtaWhatsappSection.tsx` | Trivial | Estático |
| `OpeningHoursSection.astro` | `OpeningHoursSection.tsx` | Trivial | Estático |
| `HomeSectionRenderer.astro` | `HomeSectionRenderer.tsx` | Media | Dispatcher dinámico; `if/switch` sobre tipo de sección |

### Componentes admin (`src/components/admin/`)

| Archivo Astro | Equivalente Next.js | Complejidad | Notas |
|---|---|---|---|
| `AdminSidebar.astro` | `AdminSidebar.tsx` | Baja | Nav activa con `usePathname()` → `'use client'` |

---

## 🗑️ Categoría 4 — Deprecable / sin equivalencia directa

| Archivo | Razón |
|---|---|
| `astro.config.mjs` | Reemplazado por `next.config.ts` |
| `@astrojs/node` (adaptador) | No aplica en Next.js (Vercel o Node nativo) |
| `@astrojs/react` (integración) | No aplica en Next.js (React es nativo) |

Las integraciones de Astro no tienen costo de migración — simplemente desaparecen. `next.config.ts` es nuevo y trivial de escribir.

---

## Mapa de costo real

```
CAPA                     ARCHIVOS    ESFUERZO      NOTAS
─────────────────────────────────────────────────────────────────────
Supabase DB / migrations     5       0             Mover el directorio
Tipos (src/types/)           9       0             TypeScript puro
Config (src/config/)         5       0             TypeScript puro
Data (src/data/)            10       0             TypeScript puro
Servicios (src/services/)    4       0             TypeScript puro
Persistencia (lib/persist.)  5       0             TypeScript puro
Docs                        15+      0             Actualizar refs post-migración

Supabase server.ts           1      15 min         Cambiar AstroCookies → next/headers
Supabase client.ts           1       5 min         import.meta.env → process.env
Auth (lib/auth/)             1      20 min         Adaptar firma de getUser()
WhatsApp (lib/whatsapp/)     1      15 min         Preparar para multi-tenant
CSS (styles/)                2       5 min         Cambiar import en layout root

Páginas públicas            11       4–6 h          Reescritura mecánica de sintaxis
Páginas admin                3       2–3 h          + lógica de Server Actions
Layouts                      2       2–3 h          + solución CSS vars por tenant
Middleware                   1      30 min          Nueva API, misma lógica
Componentes UI               6       1 h            Trivial, cambio de sintaxis
Componentes comunes          4       1–2 h          Header requiere usePathname
Componentes catálogo         3       1 h            Mayormente estáticos
Componentes secciones        8       2–3 h          Mayormente estáticos
Componentes admin            1      30 min          usePathname para active state

Config Next.js               1      30 min          next.config.ts, tsconfig paths
─────────────────────────────────────────────────────────────────────
TOTAL ESTIMADO              ~98 archivos   3–5 días
```

---

## Lo que la migración NO incluye

Estas tareas se deben hacer de todos modos, en Astro o en Next.js, y **no son parte del coste de migración**:

- Construir multi-tenant real (`/negocios/[slug]`) → S14 de todos modos
- Construir CRUDs del admin (catálogo, promociones) → S13 en Astro, o en Next.js si se migra antes
- Construir el directorio público → S14+
- Construir el superadmin → S14+
- Añadir Supabase RLS real por tenant → S14
- Upload de imágenes → Fase 2

---

## Recomendación de punto de corte

**Migrar después de S13, antes de S14.**

En ese punto:
- Los CRUDs básicos de admin ya existen en Astro (S13).
- La migración de esos CRUDs a Next.js es mecánica — ya tienen su lógica definitiva.
- El multi-tenant (S14) empieza desde cero en Next.js.
- El superadmin (S14+) empieza directamente en Next.js.

**No hay nada que migrar en S14 que no sea el código de S12-S13.** Todo lo nuevo (multi-tenant, superadmin, directorio) se construye directamente en Next.js.

---

*Documentos relacionados:*
- *[`docs/saas/framework-evaluation-astro-vs-next.md`](./framework-evaluation-astro-vs-next.md) — Evaluación y decisión de framework*
- *[`docs/saas/saas-product-vision.md`](./saas-product-vision.md) — Roadmap de producto*
- *[`docs/saas/multi-tenant-architecture.md`](./multi-tenant-architecture.md) — Estrategia de tenancy*
