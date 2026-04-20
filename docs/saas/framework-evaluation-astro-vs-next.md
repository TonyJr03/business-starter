# Evaluación de Framework: Astro vs Next.js

**Versión:** 1.0  
**Fecha:** Abril 2026  
**Sprint:** S12.5 — Evaluación arquitectónica SaaS  
**Estado:** Decisión tomada

---

## 1. Contexto real del proyecto

### Stack actual

```
Astro 6.1       → framework principal (output: 'static' + SSR por página)
React 19        → solo para componentes interactivos en islas
Tailwind CSS 4  → estilos
Supabase        → base de datos, auth, RLS
@supabase/ssr   → auth server-side con cookies HTTP
Node adapter    → SSR en dev; Vercel en producción
TypeScript      → strict, path alias @/
```

### Estado del repositorio (Sprint 12)

| Capa | Estado |
|---|---|
| Páginas públicas | 10 páginas, prerendizadas estáticamente (SSG) |
| Admin | 2 páginas SSR (`prerender = false`): login, logout endpoint |
| Admin dashboard | 1 página SSR: `/admin/index.astro` |
| Middleware | Centralizado, protege `/admin/*` — `src/middleware/index.ts` |
| Auth | `@supabase/ssr` + cookies; `getUser()` valida token contra servidor |
| Servicios | `catalog.service.ts`, `promotions.service.ts`, `blog.service.ts` — patrón consistente |
| Persistencia | Mappers en `src/lib/persistence/`: `category.mapper.ts`, `product.mapper.ts`, `promotion.mapper.ts` |
| Tipos | Sistema tipado completo en `src/types/` — sin Zod en runtime |
| Config | `globalConfig` unificado — 1 negocio hardcodeado, multi-tenant pendiente |

### Qué viene en el roadmap inmediato

- S13: CRUDs admin (catálogo, promociones, ajustes del negocio)
- S14: Multi-tenant real (path-based `/negocios/[slug]`)
- S15+: Directorio público, superadmin panel

### Qué requerirá el SaaS maduro

- Resolución de tenant en **cada request** (middleware crítico)
- Admin completamente interactivo (forms, tablas, filtros, uploads)
- Panel superadmin con vistas globales
- SSR para contenido dinámico por negocio
- SEO por negocio (meta tags distintos por tenant)
- Posiblemente React Server Components para dashboards complejos

---

## 2. Comparación técnica: dimensión por dimensión

### 2.1 Multi-tenant routing

**Astro:**
- `src/pages/negocios/[slug]/catalog.astro` — parámetro dinámico nativo.
- El middleware de Astro (`src/middleware/index.ts`) tiene acceso completo a `Request`, headers y cookies — suficiente para extraer slug de path o de hostname (subdominios futuros).
- `Astro.locals` para propagar el tenant resuelto a las páginas.
- **Limitación real**: en Astro `output: 'static'`, las rutas con `[slug]` dinámico requieren `getStaticPaths()` para SSG, o `prerender = false` para SSR. Para un directorio con N negocios desconocidos en build time, todas las rutas del negocio deben ser SSR.

**Next.js:**
- `app/negocios/[slug]/catalog/page.tsx` — misma estructura conceptual.
- Middleware de Next.js (`middleware.ts`) tiene el mismo acceso a `Request` y headers.
- `headers()` / `cookies()` de `next/headers` accesibles desde Server Components.
- La resolución de tenant en el middleware es idéntica en concepto; Next.js tiene más documentación y ejemplos SaaS publicados.
- **Ventaja real**: el modelo de React Server Components permite pasar el tenant resuelto como prop directamente en el árbol de componentes, sin `locals`.

**Veredicto**: Empate funcional para el MVP path-based. Next.js tiene ligera ventaja cuando se llegue a subdominios (más ejemplos documentados), pero la diferencia no es bloqueante.

---

### 2.2 Autenticación SSR

**Astro (estado actual):**
- `@supabase/ssr` instalado y funcionando.
- `createSupabaseServerClient(cookies, request)` — integración limpia.
- `getUser()` valida el token contra el servidor de Supabase (no solo lee la cookie).
- Middleware en `src/middleware/index.ts` protege todas las rutas `/admin/*`.
- **Ya funciona en producción.** No es hipotético.

**Next.js:**
- `@supabase/ssr` también soporta Next.js (misma librería, distinta integración).
- Se integra con `cookies()` del App Router o con `getServerSideProps` del Pages Router.
- La migración de `createSupabaseServerClient` a Next.js es cambiar la API de cookies (`AstroCookies` → `ReadonlyRequestCookies` de `next/headers`).
- El middleware de Next.js (`middleware.ts`) haría lo mismo que `src/middleware/index.ts`.

**Veredicto**: Empate. La lógica de auth no cambia; solo el adaptador de cookies. **El auth actual en Astro no es una deuda técnica — es una implementación limpia y directamente portable.**

---

### 2.3 Panel de administración

**Astro:**
- Las páginas `.astro` son excelentes para estructura (layouts, sidebar, headers).
- Los formularios interactivos requieren componentes React como "islas" (`client:load`).
- En el estado actual: `AdminLayout.astro` + `AdminSidebar.astro` — sin React todavía en el admin. Funciona bien para páginas de solo lectura.
- **Limitación real**: un CRUD completo (tabla de productos con filtros, edición inline, upload de imágenes) necesita React en casi toda la página. En Astro eso significa que la página admin es esencialmente un shell `.astro` que monta un componente React grande — el formato híbrido pierde valor y añade fricción.
- Ejemplo concreto: la tabla de productos del admin con paginación, búsqueda, y modal de edición es más natural en un componente React completo que en una isla dentro de un `.astro`.

**Next.js:**
- Las páginas del App Router son React Server Components por defecto.
- Las partes interactivas del panel son Client Components (`'use client'`).
- El modelo mental es más coherente para un admin 100% dinámico: todo es React, Server Components para fetching, Client Components para interactividad.
- Formularios con Server Actions (`'use server'`) simplifican CRUDs sin endpoints API separados.
- **Ventaja real**: para el panel admin S13+ (CRUDs, uploads, filtros, estado complejo), Next.js App Router es más natural y productivo que Astro + islas de React.

**Veredicto**: **Next.js es mejor para el panel admin.** Cuanto más complejo sea el CRUD, más relevante se vuelve esta diferencia. En el estado actual de S12 es imperceptible; en S13-S14 con CRUDs reales, será significativa.

---

### 2.4 Rutas dinámicas y API

**Astro:**
- Rutas de API en `src/pages/api/[...].ts` — funcionan bien para endpoints simples.
- Sin Server Actions — los formularios hacen POST a endpoints de API.
- Para el patrón actual (leer datos en frontmatter, renderizar HTML), es ideal.

**Next.js:**
- Route Handlers (`app/api/.../route.ts`) equivalentes a los endpoints de Astro.
- Server Actions para mutaciones desde formularios sin endpoint intermedio.
- La distinción Server Component / Client Component introduce overhead mental pero habilita patrones más potentes.

**Veredicto**: Empate para APIs REST. Next.js tiene ventaja clara en mutaciones (Server Actions vs endpoints manuales).

---

### 2.5 Developer Experience (DX)

**Astro (estado actual del repo):**
- Curva de aprendizaje ya superada — hay 10 páginas funcionales, layouts, middleware, auth, servicios, y tipos.
- El equipo (o el desarrollador principal) conoce la estructura del proyecto.
- El sistema de tipos funciona bien: `Astro.locals`, `Astro.props`, `AstroCookies`.
- Hot reload es rápido.
- **Costo de reescritura**: todas las páginas `.astro` deberían reescribirse.

**Next.js:**
- El App Router es más complejo de entender inicialmente (Server vs Client Components, el árbol de layout, el contexto de `cookies()`).
- La documentación de Supabase para Next.js App Router es abundante.
- TypeScript support es excelente.
- Mejor ecosistema de componentes admin ready: shadcn/ui, Tremor, etc.
- **Costo de migración**: sustancial pero no inmenso (ver sección 3).

**Veredicto**: Astro tiene ventaja de inercia y conocimiento actual. Next.js tiene ventaja de ecosistema para el admin. La DX de Next.js App Router tiene más fricción inicial pero más potencia a largo plazo.

---

### 2.6 Rendimiento (Performance)

**Astro:**
- Arquitectura de islas: por defecto, cero JavaScript al cliente en páginas sin islas.
- Las páginas públicas del negocio son HTML puro con CSS — ideal para conexiones lentas (mercado cubano).
- El admin con islas React tiene overhead de hidratación solo donde es necesario.

**Next.js:**
- Partial Prerendering (PPR) en desarrollo activo — puede lograr tiempos de carga similares.
- Los Server Components no envían JavaScript al cliente.
- Pero la misma página admin en Next.js enviará más JS que en Astro por defecto.
- Las páginas públicas con solo Server Components son muy ligeras también.

**Veredicto**: **Astro gana en páginas públicas** (cero JS por defecto). Para el contexto cubano (conexiones lentas, móviles básicos), esto es relevante. Next.js puede alcanzar rendimiento similar con disciplina, pero requiere más esfuerzo consciente.

---

### 2.7 Escalabilidad del proyecto

**Astro:**
- Excelente para sitios content-heavy con interactividad moderada.
- A medida que el panel admin crece, la fricción aumenta: más islas, más coordinación de estado entre islas, más endpoints manuales para mutaciones.
- La limitación no es el número de negocios — es la complejidad del panel admin.

**Next.js:**
- Escala mejor hacia aplicaciones web completas con mucha interactividad.
- El modelo RSC + Server Actions crece bien con CRUDs complejos.
- Para el superadmin con vistas de todos los negocios, métricas, gestión de usuarios — Next.js es más adecuado.

**Veredicto**: **Next.js escala mejor** hacia la visión SaaS completa (S14+). Astro escala bien para el sitio público; empieza a mostrar costura en admins complejos.

---

### 2.8 Complejidad de migración

Esto no es hipotético — hay que contar lo que existe en el repo:

| Qué migrar | Complejidad | Notas |
|---|---|---|
| 10 páginas públicas `.astro` → `.tsx` | Media | Reescribir sintaxis, misma lógica |
| `MainLayout.astro` → `layout.tsx` | Baja | Estructura directamente equivalente |
| `AdminLayout.astro` → `layout.tsx` | Baja | Igual |
| `src/middleware/index.ts` → `middleware.ts` | Baja | Misma lógica, distintas APIs de cookies |
| `src/lib/auth/index.ts` | Baja | Cambiar `AstroCookies` → `next/headers` |
| `src/lib/supabase/server.ts` | Baja | Adaptar API de cookies |
| `src/services/*.service.ts` | **Ninguna** | TypeScript puro, 100% portable |
| `src/lib/persistence/` mappers | **Ninguna** | TypeScript puro, 100% portable |
| `src/types/` | **Ninguna** | TypeScript puro, 100% portable |
| `src/data/` | **Ninguna** | TypeScript puro, 100% portable |
| `src/config/` | **Ninguna** | TypeScript puro, 100% portable |
| `src/components/ui/` (Button, Badge, etc.) | Muy baja | Ya son `.astro` simples → `.tsx` |
| `src/components/catalog/` (ProductCard, etc.) | Baja | Reescribir sintaxis |
| Supabase schema, migrations, seed | **Ninguna** | Completamente independiente del framework |

**Lo que NO se migra: 70% del proyecto.** Servicios, tipos, persistencia, config, data — todo es TypeScript puro y no tiene dependencia de Astro.

**Lo que SÍ se reescribe: 30%.** Las páginas `.astro`, los layouts, el middleware y los adapters de Supabase.

**Esfuerzo estimado de migración limpia**: 3-5 días de desarrollo para alguien que conoce el repo.

---

## 3. Encaje por superficie del sistema

### 3.1 Sitio público del negocio (catálogo, promotions, about, faq, gallery, blog)

| Criterio | Astro | Next.js |
|---|---|---|
| Rendimiento (0 JS por defecto) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ (con disciplina) |
| SEO dinámico por negocio | ✅ Funciona | ✅ Funciona |
| Páginas estáticas (SSG) | ✅ Nativo | ✅ Nativo |
| Páginas SSR (contenido en DB) | ✅ `prerender = false` | ✅ Por defecto |
| Velocidad de desarrollo | ✅ Ya desarrollado | Requiere reescritura |
| Conexiones lentas (Cuba) | ✅ Ideal | ✅ Aceptable |

**Ganador en superficie pública: Astro.** Ya está hecho, funciona, y es más eficiente para páginas content-heavy.

---

### 3.2 Panel de administración (admin por negocio, S13+)

| Criterio | Astro | Next.js |
|---|---|---|
| Auth SSR con cookies | ✅ Funciona ya | ✅ Equivalente |
| CRUDs interactivos (tablas, forms, modales) | ⚠️ Islas de React, más fricción | ✅ RSC + Client Components natural |
| Formularios de mutación | ⚠️ Endpoints API manuales | ✅ Server Actions directos |
| Upload de imágenes | ⚠️ Necesita isla React + endpoint | ✅ Integrado |
| Estado compartido entre secciones | ⚠️ Context cross-island problemático | ✅ Zustand/Context natural |
| Librerías UI admin (shadcn/ui, Tremor) | ⚠️ Se puede pero no es el caso de uso | ✅ Es exactamente el caso de uso |

**Ganador en panel admin: Next.js.** Para el S13+ (CRUDs reales), la diferencia es sustancial en productividad.

---

### 3.3 Plataforma SaaS central (directorio público, superadmin, onboarding)

| Criterio | Astro | Next.js |
|---|---|---|
| Directorio público de negocios (listado) | ✅ Perfecto | ✅ Equivalente |
| Panel superadmin (vistas globales, métricas) | ⚠️ Misma fricción que admin | ✅ Más natural |
| Onboarding flow (wizard multi-paso) | ⚠️ Difícil sin React full-page | ✅ Client Components natural |
| Resolución de tenant por middleware | ✅ Funciona ya | ✅ Equivalente |
| APIs internas (backend para frontend) | ✅ API routes funcionan | ✅ Route Handlers equivalentes |

**Ganador en plataforma central: Next.js** para el superadmin; empate para el directorio público.

---

## 4. Recomendación final

### La situación concreta

El proyecto está en un punto de inflexión:

- **Lo que existe funciona bien** — el sitio público, los tipos, los servicios, la auth, los mappers. No es código desechable.
- **Lo que viene necesita más** — los CRUDs del admin (S13) y la arquitectura multi-tenant (S14) son donde la fricción de Astro empieza a sentirse.
- **El 70% del valor del proyecto (lógica) es portable sin cambios.**

---

### Recomendación: **Migrar a Next.js — pero no ahora**

#### Por qué migrar eventualmente

1. El panel admin (S13+) es un caso de uso para el que Next.js App Router + Server Actions es claramente superior. Cuantos más CRUDs se construyan en Astro, más deuda se acumula.
2. La visión SaaS completa (superadmin, onboarding, planes) es una aplicación web compleja — el modelo RSC de Next.js escala mejor.
3. El 70% del proyecto migra con cero cambios. El esfuerzo real es de 3-5 días.
4. Next.js es el estándar de facto para SaaS con React en 2026. El ecosistema (shadcn/ui, auth libraries, ejemplos multi-tenant) es más rico.

#### Por qué NO migrar ahora

1. **S13 ya está planificado sobre Astro.** Iniciar la migración en paralelo con el desarrollo de CRUDs genera conflicto y duplicación.
2. El auth actual funciona perfectamente y no es deuda técnica — se puede portar limpiamente cuando llegue el momento.
3. Migrar antes de validar que hay N negocios en la plataforma introduce riesgo sin retorno claro.
4. El sitio público en Astro es más eficiente para el contexto cubano (0 JS por defecto). Si el sitio público y el admin corren juntos en Next.js, hay que ser más disciplinado para no degradar el performance público.

---

### Cuándo migrar

```
Condición de migración: cuando se vaya a iniciar el panel de superadmin (S14/S15).
```

El momento correcto es **antes de construir el superadmin**, que es completamente nuevo y no tiene nada que migrar. Ese sprint sería el natural para migrar el admin de negocio existente (pocas páginas) y arrancar el superadmin ya en Next.js.

Si se decide migrar antes, el **punto de corte recomendado es al finalizar S13** — después de tener los CRUDs básicos, pero antes de construir el directorio público multi-tenant y el superadmin.

---

### Síntesis

| Dimensión | Mejor opción | Cuándo importa |
|---|---|---|
| Sitio público (performance) | Astro | Siempre |
| Panel admin (productividad) | Next.js | S13+ |
| Multi-tenant routing | Empate | S14 |
| Auth SSR | Empate | Ya |
| Escalabilidad SaaS | Next.js | S15+ |
| Ecosistema admin UI | Next.js | S13+ |
| Migración de lógica | Sin coste | Cualquier sprint |
| Migración de páginas | 3-5 días | Elegir ventana |

---

### Decisión

```
Sprint S12-S13:  Continuar en Astro
Sprint S14:      Migrar a Next.js antes de construir multi-tenant + superadmin
Sprint S15+:     Construir directamente en Next.js
```

Esta decisión está documentada en el roadmap integrado de [`docs/saas/saas-product-vision.md`](./saas-product-vision.md).

---

*Documentos relacionados:*
- *[`docs/saas/saas-product-vision.md`](./saas-product-vision.md) — Visión de producto y roadmap*
- *[`docs/saas/multi-tenant-architecture.md`](./multi-tenant-architecture.md) — Estrategia multi-tenant*
