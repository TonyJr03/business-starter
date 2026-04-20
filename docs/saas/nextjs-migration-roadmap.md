# Roadmap de Migración: Astro → Next.js

**Versión:** 1.0  
**Fecha:** Abril 2026  
**Sprint:** S12.5 — Evaluación arquitectónica SaaS  
**Estado:** Plan aprobado — ejecutar en S14

---

## Cuándo ejecutar este plan

**Inicio:** Al arrancar S14, después de finalizar S13 (CRUDs básicos en Astro).  
**Duración estimada:** 3–5 días de desarrollo.  
**Condición de entrada:** S13 completado y en producción estable.

---

## 1. Principios de migración

1. **Un repositorio, dos fases.** La migración ocurre en un proyecto nuevo (`business-starter-next`). El repo Astro permanece intacto hasta que Next.js esté en producción y verificado.

2. **El core no se toca.** Tipos, servicios, config, data y mappers se copian tal cual. No se reescriben ni se "mejoran" durante la migración.

3. **La migración es una refactorización de capa de presentación.** La lógica de negocio ya existe y está probada. Solo cambia el framework de renderizado.

4. **Migrar por superficie, no por archivo.** Una superficie (sitio público, admin, plataforma) debe quedar completamente funcional antes de pasar a la siguiente.

5. **Sin big bang.** Si la migración se atasca, se puede volver al repo Astro sin perder trabajo — el core es el mismo en ambos.

6. **Deuda no acumulada.** No se migra código que ya era problemático en Astro esperando "arreglarlo después en Next.js". Si algo necesita refactoring, se hace antes de migrar o en un sprint separado.

---

## 2. Riesgos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| CSS vars por tenant no funcionan igual en Next.js | Media | Medio | `TenantThemeProvider` definido en arquitectura objetivo — probar en Fase 1 |
| Cookies de Supabase no persisten correctamente con `next/headers` | Media | Alto | Probar login/logout completo antes de migrar páginas |
| `cache()` de React no memoiza entre layout y página | Baja | Medio | Verificar con logs que hay 1 sola query por request |
| Diferencias de comportamiento en SSR (hidratación) | Baja | Bajo | Revisar páginas con estado cliente post-migración |
| Pérdida de funcionalidad en módulos del negocio (`enabled` flags) | Baja | Alto | Test explícito: activar/desactivar módulo y verificar 404 |
| Vercel deployment diferente entre Astro y Next.js | Baja | Bajo | Crear nuevo proyecto Vercel — no reutilizar el de Astro |
| Regresiones en SEO (meta tags, og:image) | Media | Medio | Revisar `<head>` de 3 páginas clave antes de dar por terminada la fase |

---

## 3. Qué puede convivir y qué no

### Puede convivir temporalmente

| Elemento | Cómo convive |
|---|---|
| Repositorio Astro | Se congela en el estado de S13 y sirve como referencia |
| Supabase (DB, auth, RLS) | Exactamente el mismo — ambos proyectos usan la misma instancia |
| Variables de entorno | Los mismos valores; solo cambia el prefijo (`PUBLIC_` → `NEXT_PUBLIC_`) |
| DNS / dominio | En desarrollo, no hay conflicto. En producción, el swap es atómico en Vercel |

### No puede convivir (no tiene sentido intentarlo)

| Elemento | Razón |
|---|---|
| Astro + Next.js en el mismo proceso | Son servidores distintos |
| Rutas híbridas (algunas en Astro, otras en Next.js) | Sin reverse proxy configurado, no hay forma de enrutar entre los dos |
| Migraciones SQL nuevas en ambos repos | El schema de DB es compartido. Las migraciones solo se escriben en uno y se aplican al mismo Supabase |

---

## 4. Fases de migración

---

### Fase M1 — Bootstrap del proyecto Next.js

**Objetivo:** Tener un proyecto Next.js funcional con la configuración base.  
**Duración:** 2–3 horas  
**Prerequisito:** Node ≥ 22, pnpm/npm instalado

#### Pasos

1. **Crear el proyecto**
   ```bash
   npx create-next-app@latest business-starter-next \
     --typescript --tailwind --eslint --app --src-dir=false
   ```

2. **Configurar `tsconfig.json`** — añadir path alias:
   ```json
   { "compilerOptions": { "baseUrl": ".", "paths": { "@/*": ["./*"] } } }
   ```

3. **Copiar el core sin modificar:**
   ```
   types/          ← src/types/
   config/         ← src/config/
   data/           ← src/data/
   services/       ← src/services/
   lib/persistence/← src/lib/persistence/
   styles/         ← src/styles/ (renombrar global.css → globals.css)
   supabase/       ← supabase/
   ```

4. **Instalar dependencias del core:**
   ```bash
   npm install @supabase/supabase-js @supabase/ssr clsx tailwind-merge lucide-react zod
   ```

5. **Verificar que el proyecto compila:**
   ```bash
   npm run build
   ```

#### Criterio de salida
- `npm run build` sin errores TypeScript.
- Los imports `@/types`, `@/services`, `@/config` resuelven correctamente.

---

### Fase M2 — Integración con Supabase y Auth

**Objetivo:** Auth SSR funcionando con Supabase y cookies HTTP, equivalente al estado actual de S12.  
**Duración:** 2–3 horas

#### Pasos

1. **Crear `lib/supabase/server.ts`** con `next/headers`:
   ```typescript
   import { createServerClient } from '@supabase/ssr';
   import { cookies } from 'next/headers';

   export function createSupabaseServerClient() {
     const cookieStore = cookies();
     return createServerClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
       { cookies: { getAll: () => cookieStore.getAll(),
                    setAll: (cs) => cs.forEach(c => cookieStore.set(c.name, c.value, c.options)) } },
     );
   }
   ```

2. **Crear `lib/supabase/client.ts`** — cambiar prefijo de env vars.

3. **Crear `lib/auth/index.ts`** — eliminar parámetros `cookies` y `request`:
   ```typescript
   export async function getUser() {
     const supabase = createSupabaseServerClient();
     const { data, error } = await supabase.auth.getUser();
     return error ? null : data.user;
   }
   ```

4. **Crear `lib/tenant/index.ts`** con `cache()` de React.

5. **Crear `.env.local`** con las variables `NEXT_PUBLIC_*`.

6. **Test de integración:** Escribir un Server Component temporal que llame a `getUser()` y muestre el resultado. Verificar que funciona antes de continuar.

#### Criterio de salida
- `getUser()` devuelve `null` sin sesión y un `User` con sesión activa.
- `resolveBusinessBySlug('cafe-la-esquina')` devuelve el negocio desde Supabase.
- La cookie de sesión persiste entre requests.

---

### Fase M3 — Middleware y estructura base de rutas

**Objetivo:** Middleware de auth funcionando. Estructura de carpetas `app/` creada.  
**Duración:** 1–2 horas

#### Pasos

1. **Crear `middleware.ts`** en la raíz:
   - Extrae `slug` del path para rutas `/negocios/[slug]/admin/*`.
   - Redirige a login si no hay sesión.
   - Añade header `x-tenant-slug`.

2. **Crear la estructura de carpetas vacía:**
   ```
   app/
   ├── layout.tsx                     # Root layout
   ├── not-found.tsx
   ├── (platform)/page.tsx            # Directorio público (placeholder)
   ├── negocios/[slug]/
   │   ├── layout.tsx                 # Resolver de tenant
   │   ├── page.tsx                   # Placeholder
   │   └── (admin)/
   │       ├── layout.tsx             # Guard de auth
   │       ├── admin/page.tsx         # Dashboard (placeholder)
   │       └── login/page.tsx         # Login (placeholder)
   ```

3. **Root `app/layout.tsx`** — importar `globals.css`, definir `<html lang="es">`.

4. **`app/negocios/[slug]/layout.tsx`** — resolver tenant + `notFound()` si no existe.

5. **`app/negocios/[slug]/(admin)/layout.tsx`** — guard de auth.

6. **Verificar rutas:** Abrir `/negocios/cafe-la-esquina` → placeholder visible. Abrir `/negocios/inexistente` → 404. Abrir `/negocios/cafe-la-esquina/admin` sin sesión → redirige a login.

#### Criterio de salida
- La resolución de tenant funciona: negocio existente carga, negocio inexistente da 404.
- La protección de `/admin` redirige correctamente al login.
- No hay errores en consola de servidor.

---

### Fase M4 — Login, logout y admin dashboard

**Objetivo:** El flujo completo de autenticación del admin de negocio funciona.  
**Duración:** 2–3 horas

#### Pasos

1. **Crear `actions/auth.ts`** con Server Actions `login()` y `logout()`.

2. **Migrar `src/pages/admin/login.astro`** → `app/negocios/[slug]/login/page.tsx`:
   - Formulario con `action={login.bind(null, slug)}`.
   - Mostrar error si `login()` devuelve `{ error }`.
   - Redirigir a `/negocios/[slug]/admin` tras login exitoso.

3. **Eliminar el endpoint de logout** — reemplazado por Server Action en el layout admin.

4. **Migrar `src/pages/admin/index.astro`** → `app/negocios/[slug]/admin/page.tsx`:
   - Mismo dashboard placeholder con email del usuario y 3 cards.

5. **Migrar `AdminLayout.astro`** → `app/negocios/[slug]/(admin)/layout.tsx` + `components/admin/AdminSidebar.tsx`.

#### Criterio de salida
- Login con credenciales válidas → redirige al dashboard.
- Login con credenciales inválidas → muestra error amigable.
- Logout → redirige a login, la sesión se invalida.
- Botón "atrás" tras logout → no muestra contenido protegido (`Cache-Control: no-store`).
- El sidebar muestra el ítem activo correctamente.

---

### Fase M5 — Sitio público base (layout + home)

**Objetivo:** El sitio público del negocio renderiza con branding correcto.  
**Duración:** 3–4 horas

#### Pasos

1. **Migrar `MainLayout.astro`** → `components/common/MainLayout.tsx` + `TenantThemeProvider`.

2. **Migrar componentes comunes:**
   - `Header.astro` → `Header.tsx` (Client Component — `usePathname`)
   - `Footer.astro` → `Footer.tsx` (Server Component)
   - `SectionHeader.astro` → `SectionHeader.tsx`
   - `ModuleDisabled.astro` → `ModuleDisabled.tsx`

3. **Migrar componentes UI primitivos:**
   - `Button`, `Badge`, `Card`, `Input`, `Textarea`, `Section` → todos a `.tsx`

4. **Migrar `src/pages/index.astro`** → `app/negocios/[slug]/page.tsx`:
   - Misma lógica: filtrar y ordenar secciones activas, renderizar `HomeSectionRenderer`.

5. **Migrar secciones de la home:**
   - `HeroSection`, `FeatureSection`, `OpeningHoursSection`, `CtaWhatsappSection` → `.tsx`
   - `HomeSectionRenderer.astro` → `HomeSectionRenderer.tsx` (dispatcher condicional)

6. **Verificar CSS vars:** Abrir la home en dev. Los colores de marca del negocio deben aplicarse correctamente.

#### Criterio de salida
- La home del negocio carga con los colores de marca correctos.
- Header con navegación funcional (link activo correcto al navegar).
- Footer con datos del negocio.
- Las secciones de la home habilitadas en config se renderizan; las deshabilitadas no aparecen.
- Sin JavaScript innecesario enviado al cliente (verificar con DevTools → Network).

---

### Fase M6 — Páginas de módulos públicos

**Objetivo:** Todas las páginas del sitio público del negocio funcionan.  
**Duración:** 3–4 horas

Migrar en este orden (de menor a mayor complejidad):

| Página | Componentes a migrar | Complejidad |
|---|---|---|
| `/about` | `about-content.ts` ya existe | Trivial |
| `/contact` | Sin componentes especiales | Trivial |
| `/faq` | `FaqSection.astro` (posible acordeón Client) | Baja |
| `/gallery` | `GalleryGrid.astro` | Baja |
| `/promotions` | `PromotionCard.astro` | Baja |
| `/catalog` | `ProductCard.astro`, `CategoryNav.astro` | Media |
| `/blog` | `BlogPostCard.astro` | Baja |
| `/blog/[post]` | Página de detalle | Baja |

**Para cada página:**
1. Crear `app/negocios/[slug]/[modulo]/page.tsx`.
2. Copiar la lógica del frontmatter `.astro` al async Server Component.
3. Reescribir el template de `.astro` a JSX.
4. Verificar que el módulo desactivado devuelve 404.

#### Criterio de salida
- Las 8 rutas de módulos cargan correctamente.
- Un módulo desactivado (`enabled: false`) devuelve 404, no una página vacía.
- La navegación del Header solo muestra los módulos activos.
- Los metadatos SEO (`<title>`, `description`, `og:image`) están correctos en cada página.

---

### Fase M7 — Panel admin con CRUDs (migración de S13)

**Objetivo:** Los CRUDs del panel admin construidos en S13 funcionan en Next.js.  
**Duración:** 2–3 horas (asumiendo que la lógica ya existe de S13)

#### Pasos

1. **Migrar `admin/catalog/page.tsx`** — tabla de productos + formulario de edición.
2. **Migrar `admin/promotions/page.tsx`** — tabla de promociones.
3. **Migrar `admin/settings/page.tsx`** — formulario de ajustes del negocio.
4. **Migrar Server Actions de mutación** desde endpoints Astro a `actions/catalog.ts` y `actions/promotions.ts`.
5. **Verificar RLS:** Confirmar que un usuario admin no puede acceder a datos de otro negocio.

#### Criterio de salida
- CRUD de catálogo funciona: crear, editar, eliminar producto.
- CRUD de promociones funciona.
- Ajustes del negocio se guardan en Supabase.
- RLS verificado: acceso cruzado entre negocios da error 403/vacío.

---

### Fase M8 — Directorio público y plataforma central (nuevo — S14)

**Objetivo:** La página raíz `/` muestra el directorio de todos los negocios activos.  
**Duración:** 2–3 horas (código nuevo, no migración)

#### Pasos

1. **Crear `app/(platform)/page.tsx`** — lista de negocios activos desde Supabase.
2. **Crear `app/(platform)/layout.tsx`** — layout del directorio (sin Header de negocio).
3. **Crear componente `BusinessCard.tsx`** — tarjeta de negocio en el directorio.
4. **Verificar que la ruta `/` no colisiona con `/negocios/[slug]`.**

#### Criterio de salida
- La raíz `/` muestra el listado de negocios activos.
- Clic en un negocio navega a `/negocios/[slug]`.
- Un negocio inactivo no aparece en el directorio.

---

### Fase M9 — Retire y swap de producción

**Objetivo:** Next.js en producción. Astro archivado.  
**Duración:** 1–2 horas

#### Pasos

1. **Crear nuevo proyecto en Vercel** para `business-starter-next`.
   - No reutilizar el proyecto Astro existente.
   - Configurar las variables de entorno `NEXT_PUBLIC_*`.

2. **Deploy a Vercel Preview.** Verificar en URL de preview:
   - Home de negocio
   - Login / logout admin
   - 3 páginas de módulos
   - Build sin warnings relevantes

3. **Swap de producción:**
   - Si hay dominio asignado al proyecto Astro: reasignarlo al proyecto Next.js desde el panel de Vercel.
   - Si no hay dominio: el proyecto Next.js es el nuevo "main".

4. **Archivar el repo Astro:**
   - Crear un tag `v0-astro-s13` en el repo Astro.
   - Marcar el repo como archivado en GitHub.
   - No eliminar — es la referencia histórica.

#### Criterio de salida
- El dominio de producción sirve la aplicación Next.js.
- Login/logout funciona en producción (cookies con dominio correcto).
- No hay errores 500 en los primeros 10 minutos de tráfico real.

---

## 5. Criterios de finalización de la migración

La migración se considera **completa** cuando:

- [ ] Todas las páginas del sitio público renderizan con el mismo contenido que en Astro.
- [ ] Login/logout admin funciona en producción.
- [ ] Los CRUDs del admin (S13) funcionan en Next.js.
- [ ] Los módulos desactivados devuelven 404.
- [ ] CSS vars de branding se aplican correctamente por tenant.
- [ ] SEO verificado: `<title>`, `description`, `og:image` correctos en 5 páginas clave.
- [ ] RLS verificado: un admin de un negocio no puede ver datos de otro.
- [ ] `npm run build` sin errores TypeScript.
- [ ] El directorio público `/` funciona (si S14 está en scope).
- [ ] El repo Astro está etiquetado y archivado.

---

## 6. Orden de trabajo resumido

```
M1 — Bootstrap (2–3h)          [config, core, dependencias]
M2 — Supabase + Auth (2–3h)    [lib/supabase, lib/auth, lib/tenant]
M3 — Middleware + rutas (1–2h) [middleware.ts, estructura app/]
M4 — Auth admin (2–3h)         [login, logout, dashboard, admin layout]
M5 — Sitio público base (3–4h) [MainLayout, Header, Footer, Home, secciones]
M6 — Módulos públicos (3–4h)   [catalog, promotions, about, faq, gallery, blog]
M7 — CRUDs admin (2–3h)        [migración de S13]
M8 — Directorio público (2–3h) [código nuevo — S14]
M9 — Swap a producción (1–2h)  [Vercel, DNS, archivar Astro]
────────────────────────────────────────────────────────
Total: ~18–27 horas ≈ 3–4 días
```

### Dependencias entre fases

```
M1 → M2 → M3 → M4 ──→ M7 → M9
              ↓
              M5 → M6 ─→ M9
                         ↑
              M8 ─────────
```

M4, M5 y M8 pueden paralelizarse parcialmente si hay más de un desarrollador. Para un solo desarrollador, el orden lineal es el más seguro.

---

## 7. Lo que NO forma parte de este plan

Las siguientes tareas **quedan fuera del scope de la migración** y se planifican en sprints propios:

| Tarea | Sprint sugerido |
|---|---|
| Onboarding de nuevos negocios en el panel superadmin | S15 |
| Migración a subdominios (`[slug].plataforma.com`) | S16 (Fase 2 arquitectónica) |
| Upload de imágenes desde el panel | S16 |
| Planes y facturación | S18+ |
| Panel superadmin completo | S15–S16 |

---

*Documentos relacionados:*
- *[`docs/saas/nextjs-target-architecture.md`](./nextjs-target-architecture.md) — Arquitectura objetivo detallada*
- *[`docs/saas/nextjs-migration-inventory.md`](./nextjs-migration-inventory.md) — Inventario de archivos y coste*
- *[`docs/saas/framework-evaluation-astro-vs-next.md`](./framework-evaluation-astro-vs-next.md) — Decisión de framework*
