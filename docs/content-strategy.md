# Estrategia de Contenido — Matriz de Fuentes de Verdad

> **Sprint 9** · Business Starter  
> Última actualización: Abril 2026

Este documento define **dónde vive cada tipo de contenido** y **por qué vive ahí**. Antes de añadir datos a cualquier archivo, consulta esta matriz.

---

## 1. Las tres capas de contenido

```
globalConfig          →  Identidad del negocio, configuración operacional
src/data/             →  Contenido curado que cambia con el negocio
Módulos (faq/gallery/blog)  →  Contenido dinámico o editorial
```

| Capa | Archivo(s) | ¿Quién lo edita? | ¿Con qué frecuencia? |
|------|-----------|------------------|----------------------|
| **Config** | `src/config/business-config.ts` | Desarrollador al adaptar el starter | Una vez (setup inicial) |
| **Data estática** | `src/data/*.ts` | Desarrollador o dueño del negocio | Ocasionalmente |
| **Módulos** | `src/data/faq.ts`, `gallery.ts`, `blog-posts.ts` | Operador del negocio | Frecuentemente |

---

## 2. Matriz por tipo de dato

### Identidad

| Campo | Fuente de verdad | Archivo | Notas |
|-------|-----------------|---------|-------|
| Nombre del negocio | `globalConfig` | `business-config.ts → identity.name` | Referenciado en `homeSections` y SEO sin duplicar |
| Slug | `globalConfig` | `business-config.ts → identity.slug` | URL-safe, usado en rutas y og:url |
| Tagline | `globalConfig` | `business-config.ts → identity.tagline` | Hero section lo lee desde `homeSections.props` |
| Descripción larga | `globalConfig` | `business-config.ts → identity.description` | Usada en About y og:description fallback |
| Descripción corta | `globalConfig` | `business-config.ts → identity.shortDescription` | Hero subtitle, meta tags |
| Logo | `globalConfig` | `business-config.ts → identity.logo.url` | `public/images/logo.png` |
| Cover image | `globalConfig` | `business-config.ts → identity.coverImageUrl` | og:image fallback |

> **Regla:** Nunca escribir el nombre del negocio hardcodeado en un componente. Siempre leer `globalConfig.identity.name`.

---

### Navegación

| Campo | Fuente de verdad | Archivo | Notas |
|-------|-----------------|---------|-------|
| Links del header | `globalConfig` | `business-config.ts → navigation.main` | `headerNav` en `config/navigation.ts` los proyecta |
| Links del footer | `globalConfig` | `business-config.ts → navigation.main` | `footerNav` filtra la segunda mitad |
| Ítems de módulos de página | `globalConfig` | `business-config.ts → modules.pages.*` | `navigation.ts` los filtra por `enabled: true`; orden = orden de declaración en `pageModules` |
| Orden de ítems | `globalConfig` | `business-config.ts → navigation.main[].order` | No reordenar en componentes |

> **Regla:** `Header.astro` y `Footer.astro` importan `headerNav` / `footerNav` desde `@/config`. Nunca construir arrays de links dentro de un componente.

---

### SEO Defaults

| Campo | Fuente de verdad | Archivo | Notas |
|-------|-----------------|---------|-------|
| Plantilla de título | `globalConfig` | `business-config.ts → seoDefaults.titleTemplate` | Ej.: `"%s · Café La Esquina"` |
| Descripción meta default | `globalConfig` | `business-config.ts → seoDefaults.defaultDescription` | Fallback cuando la página no define la suya |
| og:image default | `globalConfig` | `business-config.ts → seoDefaults.ogImage` | Usa `identity.coverImageUrl` como valor base |
| Twitter card type | `globalConfig` | `business-config.ts → seoDefaults.twitterCard` | `"summary_large_image"` por defecto |

> **Regla:** `MainLayout.astro` es el único lugar que lee `seoDefaults`. Las páginas pasan sus props propias (`title`, `description`, `ogImage`) como parámetros al layout; el layout aplica los fallbacks.

---

### Catálogo (Productos y Categorías)

| Campo | Fuente de verdad | Archivo | Notas |
|-------|-----------------|---------|-------|
| Lista de categorías | `src/data` | `data/categories.ts` | `Category[]` tipado |
| Lista de productos | `src/data` | `data/products.ts` | `Product[]` con `money: { amount, currency }` |
| Disponibilidad | `src/data` | `data/products.ts → product.isAvailable` | `undefined` = disponible por retrocompat |
| Tags / badges | `src/data` | `data/products.ts → product.tags` / `product.badge` | No hardcodear en `ProductCard` |

**Acceso:** Siempre vía `src/services/catalog.service.ts`, nunca importando `data/products.ts` directamente desde una página.

```
página → catalog.service.ts → data/products.ts
```

> **Regla:** Si Supabase sustituye los datos mock, solo cambia el service. Las páginas no se tocan.

---

### Promociones

| Campo | Fuente de verdad | Archivo | Notas |
|-------|-----------------|---------|-------|
| Lista de promociones | `src/data` | `data/promotions.ts` | `Promotion[]` con `status` explícito |
| Estado calculado | `src/services` | `promotions.service.ts → getPromotionStatus()` | Prioridad: `status` → fechas → `isActive` |
| Productos/categorías vinculados | `src/data` | `data/promotions.ts → productIds / categoryIds` | IDs que referencian `data/products.ts` |

> **Regla:** `PromotionCard.astro` recibe el estado ya resuelto como prop. No calcula estados internamente.

---

### FAQ

| Campo | Fuente de verdad | Archivo | Notas |
|-------|-----------------|---------|-------|
| Preguntas y respuestas | `src/data` | `data/faq.ts` | `FaqItem[]` |
| Título de la sección | `globalConfig` | `business-config.ts → modules.pages.faq.title` | |
| Subtítulo de la sección | `globalConfig` | `business-config.ts → modules.pages.faq.subtitle` | |
| Flag de habilitación | `globalConfig` | `business-config.ts → modules.pages.faq.enabled` | Controla ruta y nav |

> **Regla:** El módulo FAQ se activa/desactiva en **config**, pero su contenido (preguntas) vive en **data**. Son responsabilidades distintas.

---

### Blog

| Campo | Fuente de verdad | Archivo | Notas |
|-------|-----------------|---------|-------|
| Posts | `src/data` | `data/blog-posts.ts` | `BlogPost[]` con `slug`, `publishedAt`, `tags` |
| Acceso | `src/services` | `services/blog.service.ts → getPosts() / getPostBySlug()` | Capa service obligatoria |
| Título del módulo | `globalConfig` | `business-config.ts → modules.pages.blog.title` | |
| Flag de habilitación | `globalConfig` | `business-config.ts → modules.pages.blog.enabled` | |

> **Regla:** `blog-posts.ts` es contenido editorial; puede crecer a decenas de entradas. Cuando se migre a CMS o Supabase, solo se actualiza `services/blog.ts`.

---

### Textos de CTA

| Campo | Fuente de verdad | Archivo | Notas |
|-------|-----------------|---------|-------|
| CTA principal del Hero | `globalConfig` | `business-config.ts → modules.sections[hero].props.primaryCta` | Label + href |
| CTA secundario del Hero | `globalConfig` | `business-config.ts → modules.sections[hero].props.secondaryCta` | |
| CTA WhatsApp de la Home | `globalConfig` | `business-config.ts → modules.sections[whatsapp_cta].props` | title, subtitle, buttonLabel, message |
| CTA WhatsApp de `/catalog` | `globalConfig` | `business-config.ts → modules.pages.catalog.cta` | title, subtitle, buttonLabel, message |
| CTA WhatsApp de `/promotions` | `globalConfig` | `business-config.ts → modules.pages.promotions.cta` | |
| CTA WhatsApp de `/about` | `globalConfig` | `business-config.ts → modules.pages.about.cta` | |
| CTA WhatsApp de `/faq` | `globalConfig` | `business-config.ts → modules.pages.faq.cta` | Opcional; si `undefined`, el CTA no se renderiza |
| Headings de página (H1) | `globalConfig` | `business-config.ts → pages.{catalog\|promotions}.heading` | catalog y promotions |
| Mensaje "sin promociones" | `globalConfig` | `business-config.ts → pages.promotions.emptyMessage` | |

> **Regla:** Los textos de botones y secciones CTA visibles al cliente final viven en `globalConfig.pages.*` (por página) o en `homeSections.props` (para secciones de la home). Los componentes UI como `Button.astro` no definen labels propios.

---

### Contacto

| Campo | Fuente de verdad | Archivo | Notas |
|-------|-----------------|---------|-------|
| WhatsApp (número) | `globalConfig` | `business-config.ts → contact.whatsapp` | Formato E.164 sin `+` |
| Teléfono | `globalConfig` | `business-config.ts → contact.phone` | Opcional |
| Email | `globalConfig` | `business-config.ts → contact.email` | Opcional |
| Mensaje de contacto default | `globalConfig` | `business-config.ts → contact.defaultMessage` | Usado por `lib/whatsapp/index.ts` |

> **Regla:** `lib/whatsapp/index.ts` es el único lugar que construye URLs de WhatsApp. Las páginas y componentes llaman a `getWhatsAppUrl()`, no construyen la URL manualmente.

---

### Horarios

| Campo | Fuente de verdad | Archivo | Notas |
|-------|-----------------|---------|-------|
| Horario por día | `globalConfig` | `business-config.ts → hours` | Objeto `{ [day]: DayHours }` |
| Título sección horarios | `globalConfig` | `business-config.ts → modules.sections[hours].props.title` | |

> **Regla:** `OpeningHoursSection.astro` lee `globalConfig.hours` directamente. Si un día está cerrado, `DayHours.closed = true`; no escribir `"Cerrado"` hardcodeado en el componente.

---

### Redes Sociales

| Campo | Fuente de verdad | Archivo | Notas |
|-------|-----------------|---------|-------|
| Instagram | `globalConfig` | `business-config.ts → social.instagram` | URL completa |
| Facebook | `globalConfig` | `business-config.ts → social.facebook` | URL completa |
| Twitter / X | `globalConfig` | `business-config.ts → social.twitter` | URL completa |
| TikTok | `globalConfig` | `business-config.ts → social.tiktok` | Opcional |
| YouTube | `globalConfig` | `business-config.ts → social.youtube` | Opcional |

> **Regla:** `Footer.astro` itera `globalConfig.social` para renderizar íconos. No hay lista fija de redes en el componente; si una key es `undefined`, no se renderiza.

---

### Galería

| Campo | Fuente de verdad | Archivo | Notas |
|-------|-----------------|---------|-------|
| Imágenes | `src/data` | `data/gallery.ts` | `GalleryItem[]` con `src`, `alt`, `caption?` |
| Título del módulo | `globalConfig` | `business-config.ts → modules.pages.gallery.title` | |
| Flag de habilitación | `globalConfig` | `business-config.ts → modules.pages.gallery.enabled` | |

---

## 3. Qué NO debe hardcodearse en páginas o componentes

| ❌ Nunca en páginas/componentes | ✅ Dónde va en cambio |
|--------------------------------|----------------------|
| Nombre del negocio como string literal | `globalConfig.identity.name` |
| Número de WhatsApp | `globalConfig.contact.whatsapp` |
| Horarios como texto fijo | `globalConfig.hours` |
| Links de navegación como arrays inline | `headerNav` / `footerNav` desde `@/config` |
| Título de página sin usar `titleTemplate` | `MainLayout` con prop `title` |
| URLs de redes sociales | `globalConfig.social.*` |
| Condición `if (module === 'faq')` | `globalConfig.modules.pages.faq.enabled` |
| Arrays de productos/categorías inline | `catalog.service.ts` |
| Cálculo de estado de promoción | `getPromotionStatus()` del service |
| CTA o heading hardcodeado en página | `globalConfig.pages.{catalog|promotions|about}.*` |
| Descripción de la empresa | `globalConfig.identity.description` |
| Ciudad / dirección | `globalConfig.location.*` |

---

## 4. Cuándo usar `config` vs `data`

### Usa `globalConfig` cuando…

- El dato **define quién es el negocio** (nombre, logo, colores, contacto).
- El dato **controla el comportamiento** del sistema (feature flags, módulos habilitados, orden de secciones).
- El dato **no cambia entre sesiones** de la app; solo cambia al adaptar el starter a un nuevo cliente.
- El dato es **referenciado por el layout** o la infraestructura (SEO, CSS vars, navegación).

### Usa `src/data/` cuando…

- El dato es **contenido curado** (productos, categorías, FAQ, posts, galería).
- El dato **crece con el tiempo** (más productos, más posts) sin afectar la configuración del negocio.
- El dato puede **moverse a una DB o CMS** en el futuro sin que cambien las páginas.
- El dato tiene **su propio ciclo de vida** independiente del setup inicial.

### Usa `src/services/` cuando…

- Una página necesita **consultar, filtrar o transformar** datos de `src/data/`.
- La lógica de obtención puede **cambiar de fuente** (mock → Supabase → API externa).
- Hay **reglas de negocio** que aplicar sobre los datos brutos (estado de promoción, disponibilidad de producto).

### Diagrama de decisión

```
¿Es configuración del negocio (quién es)?
  └─ SÍ → globalConfig (business-config.ts)

¿Es contenido que un operador edita con frecuencia?
  └─ SÍ → src/data/*.ts  →  acceso vía src/services/*.ts

¿Es lógica de consulta o transformación?
  └─ SÍ → src/services/*.ts

¿Es un componente UI reutilizable?
  └─ SÍ → props del componente (no data interna fija)
```

---

## 5. Cómo versionar cambios de contenido

### Cambios en `globalConfig` (setup del negocio)

1. Editar **solo** `src/config/business-config.ts`.
2. Verificar que `validateBusinessConfig(globalConfig)` no arroja errores (ejecutar build).
3. Commit con mensaje: `config: update [campo] — [razón]`  
   Ejemplo: `config: update identity.name — rebranding a "Café Central"`

### Cambios en `src/data/` (contenido)

1. Editar el archivo de data correspondiente.
2. Respetar el tipo TypeScript del array (el compilador avisa si falta un campo requerido).
3. Commit con mensaje: `data: add/update/remove [entidad] — [razón]`  
   Ejemplo: `data: add product espresso-doble — temporada alta`

### Cambios en servicios (`src/services/`)

Solo cuando cambia la **lógica** de consulta, no el contenido. Estos cambios deben ir acompañados de una revisión de las páginas que consumen el servicio.

### Migraciones de contenido (mock → Supabase)

1. Reemplazar el cuerpo de las funciones en `src/services/*.service.ts` por llamadas a Supabase.
2. Los tipos (`Product`, `Category`, etc.) y las páginas **no cambian**.
3. Commit con mensaje: `feat(service): migrate [entity] to Supabase`

---

## 6. Errores comunes

### ❌ Duplicar el nombre del negocio

```ts
// ❌ MAL — "Café La Esquina" hardcodeado en tres componentes
<h1>Café La Esquina</h1>
<meta name="og:site_name" content="Café La Esquina" />
<footer>© 2026 Café La Esquina</footer>

// ✅ BIEN
import { globalConfig } from '@/config';
const { name } = globalConfig.identity;
```

---

### ❌ Importar data directamente desde una página

```ts
// ❌ MAL — la página acopla su lógica a la fuente de datos
import { products } from '@/data/products';
const featured = products.filter(p => p.featured);

// ✅ BIEN — el service centraliza la lógica
import { getFeaturedProducts } from '@/services/catalog.service';
const featured = getFeaturedProducts();
```

---

### ❌ Calcular estado de promoción en el componente

```ts
// ❌ MAL — lógica duplicada en componente
const isActive = promotion.startDate < new Date() && new Date() < promotion.endDate;

// ✅ BIEN — el service resuelve el estado
import { getPromotionStatus } from '@/services/promotions.service';
const status = getPromotionStatus(promotion);
```

---

### ❌ Construir la URL de WhatsApp manualmente

```ts
// ❌ MAL
const url = `https://wa.me/5355550000?text=Hola`;

// ✅ BIEN
import { getWhatsAppUrl } from '@/lib/whatsapp';
const url = getWhatsAppUrl({ message: globalConfig.contact.defaultMessage });
```

---

### ❌ Definir navegación dentro de un componente

```ts
// ❌ MAL — si se añade una página, hay que editar el componente
const navItems = [
  { label: 'Inicio', href: '/' },
  { label: 'Catálogo', href: '/catalog' },
];

// ✅ BIEN
import { headerNav } from '@/config';
```

---

### ❌ Activar/desactivar módulos con booleanos locales

```ts
// ❌ MAL — el flag no está sincronizado con el resto del sistema
const showFaq = true;

// ✅ BIEN
import { isModuleEnabled } from '@/config';
const showFaq = isModuleEnabled('faq');
```

---

### ❌ Textos de CTA hardcodeados en componentes de sección

```astro
<!-- ❌ MAL -->
<Button>Ver catálogo</Button>

<!-- ✅ BIEN — el texto viene de la config de la sección -->
<Button>{props.primaryCta.label}</Button>
```

---

## 7. Referencia rápida — Dónde buscar cada dato

```
¿Nombre, logo, tagline?          → globalConfig.identity
¿Colores, tipografía?            → globalConfig.branding
¿WhatsApp, teléfono, email?      → globalConfig.contact
¿Ciudad, dirección?              → globalConfig.location
¿Horarios?                       → globalConfig.hours
¿Redes sociales?                 → globalConfig.social
¿Links de nav?                   → headerNav / footerNav (desde @/config)
¿Módulo activo?                  → isModuleEnabled(id) (desde @/config)
¿Secciones del home?             → homeSections (desde @/config)
¿SEO título/descripción?         → globalConfig.seoDefaults
¿Headings y CTAs de página?      → globalConfig.pages.{catalog|promotions|about}
¿CTA del módulo FAQ?             → globalConfig.modules.pages.faq.cta
¿Productos?                      → catalog.service.ts
¿Categorías?                     → catalog.service.ts
¿Promociones?                    → promotions.service.ts
¿FAQ items?                      → data/faq.ts
¿Galería?                        → data/gallery.ts
¿Blog posts?                     → services/blog.service.ts
¿Propuesta de valor (features)?  → data/highlights.ts → homeFeatures
¿Historia del negocio (about)?   → data/about-content.ts → aboutContent
¿Testimonios?                    → data/testimonials.ts
```

---

*Para entender la arquitectura general del sistema, ver [architecture.md](./architecture.md).*  
*Para el dominio de catálogo y promociones, ver [catalog-promotions-domain.md](./catalog-promotions-domain.md).*
