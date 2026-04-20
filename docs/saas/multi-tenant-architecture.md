# Arquitectura Multi-Tenant — Decisión y Diseño

**Versión:** 1.0  
**Fecha:** Abril 2026  
**Sprint:** S12.5 — Evaluación arquitectónica SaaS  
**Estado:** Decisión tomada

---

## Resumen ejecutivo

Para el MVP de la plataforma, **se recomienda routing basado en path** (`/negocios/[slug]`), con una migración a subdominio planificada para Fase 2 arquitectónica (cuando Vercel Pro esté activo).

Esta decisión equilibra:
- Coste operativo inmediato (Vercel Hobby es gratuito)
- Velocidad de desarrollo (sin configuración de DNS)
- Migración clara cuando llegue el momento

**Referencia de producto:** Ver [`docs/saas/saas-product-vision.md`](./saas-product-vision.md) sección 7 para el roadmap integrado producto + arquitectura.

---

## 1. Las tres estrategias de tenancy

### 1.1 Path-based — `/negocios/[slug]`

```
plataforma.com/negocios/cafe-la-esquina
plataforma.com/negocios/cafe-la-esquina/catalog
plataforma.com/negocios/cafe-la-esquina/admin
```

**Cómo funciona:**
El slug del tenant vive en la ruta URL. El framework lo lee como un parámetro dinámico (`params.slug`). No requiere configuración DNS especial.

| | |
|---|---|
| ✅ Funciona en Vercel Hobby (gratuito) | ✅ Sin configuración DNS |
| ✅ Más simple de implementar | ✅ Localhost sin configuración |
| ✅ Funciona con SSG y SSR sin cambios | ✅ Compatible con Astro hoy mismo |
| ❌ URLs más largas | ❌ Menos "profesional" que subdominios |
| ❌ No permite dominio raíz por negocio | ❌ Todos los negocios comparten el mismo origen |

---

### 1.2 Subdomain-based — `[slug].plataforma.com`

```
cafe-la-esquina.plataforma.com
cafe-la-esquina.plataforma.com/catalog
cafe-la-esquina.plataforma.com/admin
```

**Cómo funciona:**
El slug está en el hostname. El servidor (middleware) lo extrae del header `Host`. Requiere DNS wildcard (`*.plataforma.com`) y soporte del hosting para wildcard domains.

| | |
|---|---|
| ✅ URLs limpias y profesionales | ✅ Aislamiento de origen (cookies, localStorage) |
| ✅ Preparado para custom domains | ✅ Cada negocio "siente" que tiene su propio sitio |
| ❌ Requiere Vercel Pro ($20/mes) | ❌ Wildcard DNS en el registrador |
| ❌ Localhost requiere configuración (ej: `/etc/hosts`) | ❌ HTTPS wildcard (gestionado por Vercel Pro) |
| ❌ Más complejo de desarrollar y testear | |

---

### 1.3 Custom domains — `cafelaesquina.com`

```
cafelaesquina.com            → apunta a plataforma.com
cafelaesquina.com/catalog    → misma app, tenant resuelto por hostname
```

**Cómo funciona:**
El dueño del negocio apunta su DNS a la plataforma. El servidor identifica el tenant por la tabla `business_domains` en la base de datos.

| | |
|---|---|
| ✅ Máxima profesionalidad para el negocio | ✅ SEO propio del negocio |
| ❌ Requiere Vercel Pro + API de dominios | ❌ Certificados SSL por dominio |
| ❌ Complejidad de provisionamiento alto | ❌ Solo tiene sentido después de subdominios |

---

## 2. Recomendación concreta por fase

### MVP — Path-based ✅ RECOMENDADO

**Usar `/negocios/[slug]` como estrategia inicial.**

**Razones:**
1. Vercel Hobby es gratuito y suficiente para validar el producto.
2. Cero configuración DNS — se puede desplegar hoy.
3. El código de identificación de tenant es idéntico al de subdominios en la base de datos — solo cambia dónde se lee el slug.
4. La migración a subdominio es un cambio de routing, no de datos ni lógica de negocio.

**Estructura de URLs del MVP:**

```
plataforma.com/                          → Directorio público
plataforma.com/negocios/[slug]           → Home del negocio
plataforma.com/negocios/[slug]/catalog   → Catálogo
plataforma.com/negocios/[slug]/admin     → Panel del negocio
```

**Equivalencia con el roadmap de producto** ([ver `saas-product-vision.md`](./saas-product-vision.md)):
- MVP arquitectónico (path-based) = MVP de producto (S12-S13): directorio público, sitios individuales, admin básico.

---

### Fase 2 arquitectónica — Subdomain-based (cuando Vercel Pro esté activo)

Una vez que la plataforma tenga ingresos o justifique el coste ($20/mes), migrar a:

```
[slug].plataforma.com           → Home del negocio
[slug].plataforma.com/catalog   → Catálogo
[slug].plataforma.com/admin     → Panel del negocio
```

El cambio es únicamente en:
1. Cómo el middleware extrae el `slug` (de `params` → de `hostname`).
2. La configuración del dominio en Vercel y el registrador DNS.
3. Los links internos y el directorio público.

Los datos, la lógica de negocio y los componentes **no cambian**.

**Equivalencia con el roadmap de producto:**
- Fase 2 arquitectónica (subdomain-based) = Fase 2 de producto: estadísticas básicas, upload de imágenes. No es un cambio de capacidades del negocio, es una optimización de URLs y experiencia.

---

### Fase 5 arquitectónica — Custom domains (producto maduro, opcional)

Disponible como opción premium para negocios que ya tienen dominio propio. Requiere:
- Vercel Pro con la API de dominios.
- Tabla `business_domains` en Supabase.
- Lógica en middleware para resolver tenant por hostname exacto antes de intentar por slug.

**Equivalencia con el roadmap de producto:**
- Fase 5 arquitectónica (custom domains) = Fase 5 de producto: el negocio puede usar `cafelaesquina.com` como dominio propio. Requiere plan Pro mínimo.

---

## 3. Cómo se identifica el tenant

El tenant es siempre un `business_id` (UUID) o `slug` (string único). Toda la resolución empieza en el **middleware**.

### 3.1 Flujo de resolución (MVP — path-based)

```
Request: GET /negocios/cafe-la-esquina/catalog

1. Middleware intercepta la request
2. Extrae slug = "cafe-la-esquina" de la ruta
3. Busca en Supabase: SELECT * FROM businesses WHERE slug = 'cafe-la-esquina' AND is_active = true
4. Si no existe → 404
5. Si existe → inyecta business en locals (Astro context)
6. La página recibe el tenant desde locals, no hace nueva consulta
```

### 3.2 Flujo de resolución (Fase 2 — subdomain-based)

```
Request: GET /catalog (Host: cafe-la-esquina.plataforma.com)

1. Middleware intercepta la request
2. Extrae slug = "cafe-la-esquina" del header Host
3. Resto del flujo idéntico
```

### 3.3 Implementación en Astro (middleware)

```typescript
// src/middleware/index.ts

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = new URL(context.request.url);

  // MVP: slug desde path
  const match = pathname.match(/^\/negocios\/([^\/]+)/);
  const slug = match?.[1];

  // Fase 2: slug desde hostname
  // const host = context.request.headers.get('host') ?? '';
  // const slug = host.split('.')[0]; // cafe-la-esquina.plataforma.com → cafe-la-esquina

  if (slug) {
    const business = await resolveBusinessBySlug(slug);
    if (!business) return new Response(null, { status: 404 });
    context.locals.business = business;
    context.locals.businessId = business.id;
  }

  return next();
});
```

> El comentario de Fase 2 ya está en el código. El día de la migración se comenta una línea y se descomenta la otra.

### 3.4 En el frontend (páginas Astro)

```typescript
// src/pages/negocios/[slug]/catalog.astro
const { business } = Astro.locals;
// Ya no se lee de globalConfig. Se lee del tenant resuelto por middleware.
const products = await getProducts({ businessId: business.id });
```

### 3.5 En la base de datos (Supabase)

Todas las tablas con datos de negocio tienen una columna `business_id` como FK:

```sql
-- Todas las tablas de negocio siguen este patrón
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  -- ... resto de columnas
);
```

**Row-Level Security (RLS) en Supabase:**

```sql
-- El admin de negocio solo puede ver y editar sus propios datos
CREATE POLICY "business_admin_products" ON products
  FOR ALL
  USING (business_id = auth.jwt() ->> 'business_id');
  -- El JWT del usuario incluye su business_id como claim custom
```

Esto significa que **aunque alguien obtenga un token válido de otro negocio, no puede acceder a datos ajenos**. La seguridad no depende solo del routing.

---

## 4. Relación entre `businesses.slug` y rutas públicas

El `slug` es el identificador público del tenant. Es:

- **Único** a nivel de plataforma (constraint en DB).
- **Inmutable** una vez creado (cambiar el slug rompería URLs indexadas y links compartidos).
- **URL-safe**: solo minúsculas, números y guiones (`[a-z0-9-]+`).

```sql
ALTER TABLE businesses ADD CONSTRAINT slug_format
  CHECK (slug ~ '^[a-z0-9-]+$');

CREATE UNIQUE INDEX ON businesses(slug);
```

### Generación del slug al crear un negocio

```
"Café La Esquina" → "cafe-la-esquina"
"Librería Moderna" → "libreria-moderna"
"Tienda 24/7"     → "tienda-24-7"
```

El superadmin puede editarlo **antes** del primer despliegue público. Después se considera inmutable.

---

## 5. Qué cambia al migrar a subdominios o dominios custom

### Migración path → subdominio

| Qué cambia | Qué NO cambia |
|---|---|
| Cómo el middleware extrae el slug | Schema de base de datos |
| Configuración DNS (wildcard) | Lógica de negocio y servicios |
| Configuración Vercel (wildcard domain) | Componentes y páginas |
| Links internos (sin `/negocios/[slug]` prefix) | Tipos y contratos |
| Directorio público (hrefs de cada negocio) | RLS y seguridad en DB |

**Esfuerzo estimado:** 1-2 días de desarrollo + configuración DNS/Vercel.

---

### Migración subdominio → custom domain (opcional)

| Qué se añade | Qué NO cambia |
|---|---|
| Tabla `business_domains` en DB | Nada de lo anterior |
| Middleware: resolución por hostname exacto primero | |
| Panel del superadmin: asignar/remover dominio custom | |
| Vercel API: provisionamiento de dominios | |

**Esfuerzo estimado:** 3-5 días de desarrollo. Solo tiene sentido con Vercel Pro activo.

---

## 6. Seguridad multi-tenant

El riesgo principal en multi-tenant es la **filtración de datos entre tenants**. Las defensas son en capas:

### Capa 1 — Routing (primera línea)
El middleware valida que el tenant existe y está activo. Sin tenant válido, no hay respuesta.

### Capa 2 — Aplicación (servicios)
Todos los queries a Supabase incluyen `business_id` explícitamente:

```typescript
// Correcto: siempre filtrado por business_id
const products = await supabase
  .from('products')
  .select('*')
  .eq('business_id', businessId);

// Incorrecto: nunca hacer queries sin filtro de tenant
const products = await supabase.from('products').select('*');
```

### Capa 3 — Base de datos (última línea — RLS)
Las políticas RLS en Supabase garantizan que aunque falle la capa de aplicación, los datos de un tenant no son accesibles desde el JWT de otro.

### Capa 4 — Admin de negocio
El JWT del usuario admin incluye un `business_id` claim. El middleware del panel `/admin` valida que el `business_id` del JWT coincide con el tenant de la URL.

---

## 7. Riesgos por estrategia

| Riesgo | Path-based | Subdomain | Custom domain |
|---|---|---|---|
| Complejidad de setup inicial | Bajo | Medio | Alto |
| Coste de hosting | Gratuito | ~$20/mes | ~$20/mes + certificados |
| Riesgo de filtración de datos | Igual en todas — depende de RLS | Igual | Igual |
| SEO por negocio | Compartido en mismo origen | Orígenes separados | Mejor (dominio propio) |
| Testeo en local | Trivial | Requiere `/etc/hosts` | Complejo |
| Migración de URLs existentes | N/A | Redirección 301 necesaria | N/A |
| DNS propagation delays | No aplica | 24-48h por cambio | 24-48h por cambio |

---

## 8. Decisión final

```
MVP ahora:       path-based  →  /negocios/[slug]
Fase 2 (futuro): subdomain   →  [slug].plataforma.com
Fase 5 (futuro): custom      →  cafelaesquina.com (premium)
```

**El código del MVP debe estar escrito de forma que la migración a subdominios sea un cambio de una sola función en el middleware, no una refactorización.**

El principio de diseño clave es: **el slug siempre existe en `Astro.locals.business`. Cómo llega ahí es responsabilidad exclusiva del middleware.**

---

## Referencias cruzadas

- [`docs/saas/saas-product-vision.md`](./saas-product-vision.md) — Visión de producto y roadmap integrado (producto + arquitectura). Consulta la sección 7 para ver cómo el MVP arquitectónico (path-based) y las fases arquitectónicas (subdomain, custom domains) se alinean con las capacidades de producto.

*Este documento es la referencia técnica de arquitectura multi-tenant para el sprint S12.5. Complementa `saas-product-vision.md` con decisiones, trade-offs y detalles de implementación específicos de multi-tenancy.*
