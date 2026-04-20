# Arquitectura Objetivo en Next.js

**Versión:** 1.0  
**Fecha:** Abril 2026  
**Sprint:** S12.5 — Evaluación arquitectónica SaaS  
**Estado:** Propuesta validada — referencia para S14

---

## Principios de diseño

1. **App Router exclusivamente.** Sin Pages Router. El App Router es el modelo recomendado para proyectos nuevos en Next.js 14+.
2. **Server Components por defecto.** Solo añadir `'use client'` donde haya interactividad real (formularios controlados, estado local, eventos del browser).
3. **El tenant siempre en el árbol de layout.** La resolución del negocio ocurre una sola vez, en el layout de ruta, y se propaga por props o por `cache()` de React.
4. **Sin over-engineering.** La estructura debe poder implementarse en 3–5 días. No hay monorepos, no hay microfrontends.
5. **Portabilidad del core.** Tipos, servicios, mappers y config se mueven sin tocar.

---

## 1. Estructura de carpetas

```
business-starter-next/
├── app/
│   ├── layout.tsx                        # Root layout: <html>, fuentes globales
│   ├── not-found.tsx                     # 404 global
│   │
│   ├── (platform)/                       # Route group: plataforma central
│   │   ├── page.tsx                      # Directorio público → /
│   │   └── layout.tsx                    # Layout del directorio (sin sidebar)
│   │
│   ├── negocios/
│   │   └── [slug]/                       # Tenant dinámico
│   │       ├── layout.tsx                # ★ Resolver de tenant + layout público
│   │       ├── page.tsx                  # Home del negocio
│   │       ├── catalog/
│   │       │   └── page.tsx
│   │       ├── promotions/
│   │       │   └── page.tsx
│   │       ├── about/
│   │       │   └── page.tsx
│   │       ├── contact/
│   │       │   └── page.tsx
│   │       ├── faq/
│   │       │   └── page.tsx
│   │       ├── gallery/
│   │       │   └── page.tsx
│   │       ├── blog/
│   │       │   ├── page.tsx
│   │       │   └── [post]/
│   │       │       └── page.tsx
│   │       │
│   │       └── (admin)/                  # Route group: admin del negocio
│   │           ├── layout.tsx            # ★ Guard de auth + layout admin
│   │           ├── admin/
│   │           │   ├── page.tsx          # Dashboard
│   │           │   ├── catalog/
│   │           │   │   └── page.tsx
│   │           │   ├── promotions/
│   │           │   │   └── page.tsx
│   │           │   └── settings/
│   │           │       └── page.tsx
│   │           └── login/
│   │               └── page.tsx          # Fuera del guard — ruta pública del admin
│   │
│   └── (superadmin)/                     # Route group: panel del operador (S14+)
│       ├── layout.tsx                    # Guard superadmin
│       └── superadmin/
│           ├── page.tsx                  # Dashboard global
│           └── businesses/
│               ├── page.tsx
│               └── [id]/
│                   └── page.tsx
│
├── actions/                              # Server Actions (mutaciones)
│   ├── auth.ts                           # login(), logout()
│   ├── catalog.ts                        # createProduct(), updateProduct(), etc.
│   └── promotions.ts
│
├── components/
│   ├── ui/                               # Primitivos: Button, Badge, Card, Input
│   ├── common/                           # Header, Footer, SectionHeader
│   ├── catalog/                          # ProductCard, PromotionCard, CategoryNav
│   ├── sections/                         # HeroSection, FeatureSection, FaqSection, etc.
│   ├── admin/                            # AdminSidebar, DataTable, etc.
│   └── providers/                        # ThemeProvider (CSS vars por tenant)
│
├── lib/
│   ├── supabase/
│   │   ├── server.ts                     # createSupabaseServerClient() — next/headers
│   │   └── client.ts                     # getBrowserClient() — browser only
│   ├── auth/
│   │   └── index.ts                      # getUser(), isAuthenticated() — next/headers
│   ├── tenant/
│   │   └── index.ts                      # ★ resolveBusinessBySlug() — cache()
│   ├── persistence/                      # Mappers (sin cambios desde Astro)
│   │   ├── product.mapper.ts
│   │   ├── category.mapper.ts
│   │   ├── promotion.mapper.ts
│   │   └── business.mapper.ts
│   └── whatsapp/
│       └── index.ts                      # getWhatsAppUrl(whatsapp, message?)
│
├── services/                             # Sin cambios desde Astro
│   ├── catalog.service.ts
│   ├── promotions.service.ts
│   ├── blog.service.ts
│   └── business.service.ts
│
├── types/                                # Sin cambios desde Astro
│   ├── business-config.ts
│   ├── catalog.ts
│   ├── promotion.ts
│   ├── content.ts
│   ├── navigation.ts
│   ├── page-modules.ts
│   ├── section-modules.ts
│   ├── testimonial.ts
│   └── index.ts
│
├── config/                               # Sin cambios desde Astro
│   ├── business-config.ts                # globalConfig — usado como fallback estático
│   ├── navigation.ts
│   └── index.ts
│
├── data/                                 # Sin cambios desde Astro
│   ├── products.ts
│   ├── categories.ts
│   ├── promotions.ts
│   ├── blog-posts.ts
│   ├── faq.ts
│   ├── gallery.ts
│   ├── testimonials.ts
│   ├── highlights.ts
│   ├── about-content.ts
│   └── index.ts
│
├── styles/
│   ├── globals.css                       # Mismo contenido que global.css actual
│   └── tokens.css                        # Mismo contenido que tokens.css actual
│
├── middleware.ts                         # Auth guard + tenant header
├── next.config.ts
└── tsconfig.json                         # paths: @/* → src/* equivalente
```

---

## 2. Separación de superficies

### 2.1 Plataforma central — `app/(platform)/`

El route group `(platform)` no añade segmento a la URL. `app/(platform)/page.tsx` resuelve en `/`.

```
/                → Directorio público: lista de todos los negocios activos
/(platform)/     → Route group, sin segmento en URL
```

**Características:**
- Server Component puro: fetcha todos los negocios activos de Supabase.
- Sin Header del negocio — tiene su propio layout con navegación de la plataforma.
- Sin tenant — no hay resolución de slug.

---

### 2.2 Sitio público del negocio — `app/negocios/[slug]/`

Todas las rutas públicas del negocio viven bajo `app/negocios/[slug]/`. El `layout.tsx` de este directorio es el punto donde se resuelve el tenant.

```
/negocios/cafe-la-esquina/            → Home del negocio
/negocios/cafe-la-esquina/catalog     → Catálogo
/negocios/cafe-la-esquina/promotions  → Promociones
/negocios/cafe-la-esquina/about       → Nosotros
/negocios/cafe-la-esquina/contact     → Contacto
/negocios/cafe-la-esquina/faq         → FAQ
/negocios/cafe-la-esquina/gallery     → Galería
/negocios/cafe-la-esquina/blog        → Blog
/negocios/cafe-la-esquina/blog/[post] → Artículo
```

**Características:**
- Header y Footer del negocio (con colores de marca del tenant).
- CSS vars de branding inyectadas por un `ThemeProvider` del layout.
- Módulos inactivos → redirigen a 404 dentro del layout.

---

### 2.3 Panel admin del negocio — `app/negocios/[slug]/(admin)/`

El route group `(admin)` agrupa las rutas del panel sin añadir `/admin` al URL antes del `admin/`:

```
/negocios/cafe-la-esquina/admin           → Dashboard
/negocios/cafe-la-esquina/admin/catalog   → Gestión de catálogo
/negocios/cafe-la-esquina/admin/promotions→ Gestión de promociones
/negocios/cafe-la-esquina/admin/settings  → Ajustes del negocio
/negocios/cafe-la-esquina/login           → Login del admin (fuera del guard)
```

> El login vive en `(admin)/login/` pero **fuera** del layout que tiene el guard, para que sea accesible sin sesión. Ver sección 5.

**Características:**
- Layout separado del sitio público: AdminSidebar + header interno.
- Sin Header/Footer del negocio.
- Páginas son principalmente Client Components (`'use client'`) por la interactividad de los CRUDs.

---

### 2.4 Panel superadmin — `app/(superadmin)/` (S14+)

```
/superadmin                       → Dashboard global
/superadmin/businesses            → Lista de todos los negocios
/superadmin/businesses/[id]       → Configurar negocio
```

Route group con su propio layout y guard de rol superadmin. No se cruza con el admin de negocio.

---

## 3. Manejo del tenant

El tenant se resuelve **una sola vez por request**, en el layout de `app/negocios/[slug]/layout.tsx`, usando el `cache()` de React para evitar consultas duplicadas en el árbol.

### `lib/tenant/index.ts`

```typescript
import { cache } from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { rowToBusinessSettings } from '@/lib/persistence';
import type { BusinessSettings } from '@/lib/persistence/business.mapper';

/**
 * Resuelve el negocio por slug. Memoizado por request (React cache).
 * Devuelve null si no existe o está inactivo.
 */
export const resolveBusinessBySlug = cache(
  async (slug: string): Promise<BusinessSettings | null> => {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !data) return null;
    return rowToBusinessSettings(data);
  },
);
```

### `app/negocios/[slug]/layout.tsx`

```typescript
import { notFound } from 'next/navigation';
import { resolveBusinessBySlug } from '@/lib/tenant';
import { MainLayout } from '@/components/common/MainLayout';

interface Props {
  children: React.ReactNode;
  params: { slug: string };
}

export default async function BusinessLayout({ children, params }: Props) {
  const business = await resolveBusinessBySlug(params.slug);
  if (!business) notFound();

  return (
    <MainLayout business={business}>
      {children}
    </MainLayout>
  );
}
```

### En las páginas del negocio

Las páginas reciben el slug como `params` y llaman a `resolveBusinessBySlug` — gracias a `cache()`, el resultado ya está memoizado y no genera una nueva consulta a DB:

```typescript
// app/negocios/[slug]/catalog/page.tsx
import { resolveBusinessBySlug } from '@/lib/tenant';
import { getProducts } from '@/services/catalog.service';

export default async function CatalogPage({ params }: { params: { slug: string } }) {
  const business = await resolveBusinessBySlug(params.slug); // hit de caché — 0 queries
  const products = await getProducts({ businessId: business!.id });
  // ...
}
```

### Migración a subdominios (Fase 2)

En Fase 2, el slug se extrae del hostname en el middleware y se pasa como header personalizado. El resto del código no cambia:

```typescript
// middleware.ts — Fase 2
const hostname = request.headers.get('host') ?? '';
const slug = hostname.split('.')[0]; // cafe-la-esquina.plataforma.com → cafe-la-esquina
const response = NextResponse.next();
response.headers.set('x-tenant-slug', slug);
return response;

// lib/tenant/index.ts — Fase 2
import { headers } from 'next/headers';
const slug = headers().get('x-tenant-slug') ?? '';
```

La interfaz de `resolveBusinessBySlug(slug)` no cambia. Solo cambia la fuente del slug.

---

## 4. Integración con Supabase

### `lib/supabase/server.ts` (adaptado de Astro)

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );
}
```

**Cambios vs Astro:** Se eliminan los parámetros `cookies` y `request` — `next/headers` los proporciona internamente. La lógica es idéntica.

### `lib/supabase/client.ts` (adaptado de Astro)

```typescript
// Cambio mínimo: import.meta.env → process.env, prefijo PUBLIC_ → NEXT_PUBLIC_
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
```

### Variables de entorno

| Astro | Next.js |
|---|---|
| `PUBLIC_SUPABASE_URL` | `NEXT_PUBLIC_SUPABASE_URL` |
| `PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |

Solo cambia el prefijo. El valor es el mismo.

---

## 5. Autenticación

### `lib/auth/index.ts` (adaptado de Astro)

```typescript
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { User } from '@supabase/supabase-js';

export async function getUser(): Promise<User | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getUser()) !== null;
}
```

**Cambio vs Astro:** Sin parámetros — la firma se simplifica porque `next/headers` ya está disponible dentro de `createSupabaseServerClient()`.

### Middleware — `middleware.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Resolver tenant para rutas de negocio (MVP path-based)
  const tenantMatch = pathname.match(/^\/negocios\/([^\/]+)/);
  if (tenantMatch) {
    const slug = tenantMatch[1];
    // Pasar slug como header para uso en RSC sin parámetro extra
    const response = NextResponse.next();
    response.headers.set('x-tenant-slug', slug);
    // Guard de admin
    if (pathname.includes('/admin') && !pathname.includes('/login')) {
      const supabase = createSupabaseServerClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.redirect(
          new URL(`/negocios/${slug}/login`, request.url),
        );
      }
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/negocios/:slug*', '/superadmin/:path*'],
};
```

### Flujo de login / logout

**Login:** Server Action en `actions/auth.ts`

```typescript
'use server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function login(slug: string, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: 'Credenciales inválidas.' };
  redirect(`/negocios/${slug}/admin`);
}

export async function logout(slug: string) {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect(`/negocios/${slug}/login`);
}
```

**Login page:** Usa el Server Action directamente en el `<form action={}>`. Sin endpoint de API separado.

### Layout guard del admin

```typescript
// app/negocios/[slug]/(admin)/layout.tsx
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';

export default async function AdminLayout({ children, params }: Props) {
  const user = await getUser();
  if (!user) redirect(`/negocios/${params.slug}/login`);

  return (
    <div className="admin-shell">
      <AdminSidebar slug={params.slug} />
      <main>{children}</main>
    </div>
  );
}
```

---

## 6. Layouts y Route Groups

```
app/
├── layout.tsx                    # Root: <html lang="es">, fuentes, globals.css
│
├── (platform)/
│   └── layout.tsx                # Layout directorio: sin Header de negocio
│
└── negocios/[slug]/
    ├── layout.tsx                # ★ Resolver tenant, inyectar branding, Header + Footer público
    │
    └── (admin)/
        ├── layout.tsx            # ★ Guard de auth, AdminSidebar, sin Header público
        └── login/
            └── page.tsx          # Fuera del layout (admin) → accesible sin auth
```

### CSS vars por tenant (ThemeProvider)

`MainLayout.astro` actualmente inyecta vars CSS con `define:vars`. En Next.js, como los layouts son Server Components, se usa un componente liviano para aplicar el estilo inline:

```typescript
// components/providers/TenantThemeProvider.tsx
'use client';
import type { BusinessBranding } from '@/types';

export function TenantThemeProvider({
  branding,
  children,
}: {
  branding: BusinessBranding;
  children: React.ReactNode;
}) {
  const vars = {
    '--color-primary':   branding.colors?.primary   ?? '#6F4E37',
    '--color-secondary': branding.colors?.secondary ?? '#F5E6D3',
    '--color-accent':    branding.colors?.accent     ?? '#D4A574',
  } as React.CSSProperties;

  return (
    <div style={vars} data-theme={branding.themeKey ?? 'default'}>
      {children}
    </div>
  );
}
```

El layout de `[slug]` lo instancia así:

```typescript
// app/negocios/[slug]/layout.tsx (simplificado)
<TenantThemeProvider branding={business.branding ?? globalConfig.branding}>
  <Header nav={nav} />
  {children}
  <Footer business={business} />
</TenantThemeProvider>
```

> En el MVP, `branding` viene de `globalConfig` (igual que hoy). Cuando sea multi-tenant real, vendrá de la fila en DB.

---

## 7. Estrategia para componentes compartidos

### Server Components por defecto

Todo componente que solo recibe props y renderiza HTML es un Server Component. No necesita `'use client'`:

```typescript
// components/catalog/ProductCard.tsx — Server Component
export function ProductCard({ product }: { product: Product }) {
  return <div>...</div>; // sin hooks, sin eventos → Server Component
}
```

### Client Components solo donde hay interactividad

| Componente | Tipo | Razón |
|---|---|---|
| `Button.tsx` | Server | Solo renderiza `<button>`, sin estado |
| `Badge.tsx` | Server | Estático |
| `ProductCard.tsx` | Server | Estático |
| `Header.tsx` | **Client** | `usePathname()` para marcar enlace activo |
| `AdminSidebar.tsx` | **Client** | `usePathname()` para marcar enlace activo |
| `FaqSection.tsx` | **Client** | Acordeón interactivo (open/close) |
| `CategoryNav.tsx` | **Client** | Filtro activo por categoría |
| `TenantThemeProvider.tsx` | **Client** | Inyecta `style` dinámico |
| Formularios de admin | **Client** | Estado controlado, validación |

### Convención de carpetas

```
components/
├── ui/           # Primitivos — casi todos Server
├── common/       # Header (Client), Footer (Server), SectionHeader (Server)
├── catalog/      # ProductCard (Server), CategoryNav (Client)
├── sections/     # Mayormente Server; FaqSection es Client
├── admin/        # Mayormente Client (CRUDs interactivos)
└── providers/    # Todos Client (ThemeProvider, etc.)
```

### Path alias en Next.js

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

El alias `@/` funciona igual que en Astro. Todos los imports del proyecto se mantienen sin cambios.

---

## 8. Estrategia para módulos del negocio

El sistema actual usa `modules.pages[id].enabled` para decidir si una página está activa. En Next.js este patrón se mantiene, pero la validación ocurre en el layout del negocio.

### Guard de módulo en el layout

```typescript
// app/negocios/[slug]/layout.tsx
export default async function BusinessLayout({ children, params, ...props }) {
  const business = await resolveBusinessBySlug(params.slug);
  if (!business) notFound();

  // Obtener módulos activos del negocio (DB en multi-tenant, globalConfig en MVP)
  const modules = await getBusinessModules(business.id);

  // Pasar módulos a un contexto ligero para que Header construya la nav
  return (
    <TenantThemeProvider branding={...}>
      <ModuleGuard modules={modules} pathname={/* server-side */}>
        <Header nav={buildNav(modules)} />
        {children}
        <Footer />
      </ModuleGuard>
    </TenantThemeProvider>
  );
}
```

### Dentro de cada página de módulo

```typescript
// app/negocios/[slug]/catalog/page.tsx
import { resolveBusinessBySlug } from '@/lib/tenant';
import { getBusinessModules } from '@/services/business.service';
import { notFound } from 'next/navigation';

export default async function CatalogPage({ params }: { params: { slug: string } }) {
  const business = await resolveBusinessBySlug(params.slug); // caché — sin query
  const modules = await getBusinessModules(business!.id);    // caché — sin query

  if (!modules.pages.catalog.enabled) notFound();

  // ... render
}
```

---

## 9. Mapeo del modelo actual a la nueva arquitectura

### Archivos que se mueven sin cambios (mover, no reescribir)

| Origen (Astro) | Destino (Next.js) |
|---|---|
| `src/types/` | `types/` |
| `src/config/` | `config/` |
| `src/data/` | `data/` |
| `src/services/` | `services/` |
| `src/lib/persistence/` | `lib/persistence/` |
| `src/styles/tokens.css` | `styles/tokens.css` |
| `src/styles/global.css` | `styles/globals.css` |
| `supabase/` | `supabase/` |

### Archivos que se adaptan (cambios mínimos)

| Origen (Astro) | Destino (Next.js) | Cambio |
|---|---|---|
| `src/lib/supabase/server.ts` | `lib/supabase/server.ts` | `AstroCookies` → `next/headers` |
| `src/lib/supabase/client.ts` | `lib/supabase/client.ts` | `import.meta.env` → `process.env` |
| `src/lib/auth/index.ts` | `lib/auth/index.ts` | Sin parámetros de cookies |
| `src/lib/whatsapp/index.ts` | `lib/whatsapp/index.ts` | Pasar `whatsapp` como param |
| `src/middleware/index.ts` | `middleware.ts` | `NextRequest/NextResponse` |

### Archivos que se reescriben (misma lógica, nueva sintaxis)

| Origen (Astro) | Destino (Next.js) | Tiempo |
|---|---|---|
| `src/layouts/MainLayout.astro` | `app/negocios/[slug]/layout.tsx` + `TenantThemeProvider` | 2h |
| `src/layouts/AdminLayout.astro` | `app/negocios/[slug]/(admin)/layout.tsx` | 1h |
| `src/pages/index.astro` | `app/negocios/[slug]/page.tsx` | 45 min |
| `src/pages/catalog.astro` | `app/negocios/[slug]/catalog/page.tsx` | 30 min |
| `src/pages/promotions.astro` | `app/negocios/[slug]/promotions/page.tsx` | 30 min |
| `src/pages/about.astro` | `app/negocios/[slug]/about/page.tsx` | 20 min |
| `src/pages/contact.astro` | `app/negocios/[slug]/contact/page.tsx` | 20 min |
| `src/pages/faq.astro` | `app/negocios/[slug]/faq/page.tsx` | 20 min |
| `src/pages/gallery.astro` | `app/negocios/[slug]/gallery/page.tsx` | 20 min |
| `src/pages/blog/index.astro` | `app/negocios/[slug]/blog/page.tsx` | 20 min |
| `src/pages/blog/[slug].astro` | `app/negocios/[slug]/blog/[post]/page.tsx` | 30 min |
| `src/pages/admin/login.astro` | `app/negocios/[slug]/login/page.tsx` + `actions/auth.ts` | 45 min |
| `src/pages/admin/index.astro` | `app/negocios/[slug]/admin/page.tsx` | 30 min |
| Todos los `.astro` components | `.tsx` equivalentes | ~4h total |

### Archivos nuevos (sin equivalente en Astro)

| Archivo | Propósito |
|---|---|
| `lib/tenant/index.ts` | `resolveBusinessBySlug()` con `cache()` |
| `components/providers/TenantThemeProvider.tsx` | CSS vars por tenant |
| `actions/auth.ts` | Server Actions de login/logout |
| `app/(platform)/page.tsx` | Directorio público (nuevo — S14) |
| `app/(superadmin)/` | Panel superadmin (nuevo — S14+) |
| `next.config.ts` | Configuración de Next.js |

---

## Diagrama de flujo por request

```
Request: GET /negocios/cafe-la-esquina/catalog

1. middleware.ts
   ├── Extrae slug = "cafe-la-esquina"
   ├── Añade header x-tenant-slug = "cafe-la-esquina"
   └── Continúa (no es ruta admin)

2. app/negocios/[slug]/layout.tsx
   ├── resolveBusinessBySlug("cafe-la-esquina")
   │   └── Query a Supabase: SELECT * FROM businesses WHERE slug = ?
   ├── business encontrado → continúa
   └── Renderiza: TenantThemeProvider > Header > {children} > Footer

3. app/negocios/[slug]/catalog/page.tsx
   ├── resolveBusinessBySlug("cafe-la-esquina") → HIT DE CACHÉ (0 queries)
   ├── getProducts({ businessId: business.id }) → Query Supabase
   └── Renderiza página de catálogo

4. Respuesta HTML al cliente
   └── CSS vars del tenant inyectadas por TenantThemeProvider
```

---

*Documentos relacionados:*
- *[`docs/saas/nextjs-migration-inventory.md`](./nextjs-migration-inventory.md) — Inventario detallado de archivos y coste de migración*
- *[`docs/saas/framework-evaluation-astro-vs-next.md`](./framework-evaluation-astro-vs-next.md) — Decisión de framework*
- *[`docs/saas/multi-tenant-architecture.md`](./multi-tenant-architecture.md) — Estrategia de tenancy*
