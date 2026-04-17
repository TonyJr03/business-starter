# Contratos de contenido por página

> Última actualización: Abril 2026

Este documento define qué datos necesita cada página, de dónde los obtiene y qué ocurre cuando un dato no está disponible. Es la referencia obligada antes de añadir, quitar o mover contenido de cualquier página.

**Leyenda de fuentes:**

| Símbolo | Fuente |
|---------|--------|
| `CFG` | `globalConfig` en `src/config/business-config.ts` |
| `DATA` | `src/data/*.ts` (arrays de contenido curado) |
| `SVC` | `src/services/*.ts` (capa de servicio sobre DATA) |
| `PROP` | Prop recibida desde la sección de configuración (`homeSections.props`) |

---

## `/` — Home

> Ruta implementada en `src/pages/index.astro`  
> Orçuestada por `HomeSectionRenderer.astro` + `home-section-registry.ts`

La home no tiene contenido fijo. Renderiza la lista de **`homeSections` activas y ordenadas** definidas en `globalConfig.modules.homeSections`. Cada sección tiene contrato propio.

### Sección `hero` — Hero principal

| Campo | Req. | Fuente | Consumidor | Fallback |
|-------|:----:|--------|------------|---------|
| `tagline` | ✓ | `CFG` → `identity.tagline` vía `PROP` | `HeroSection.astro` | — |
| `title` | ✓ | `CFG` → `identity.name` vía `PROP` | `HeroSection.astro` | — |
| `subtitle` | ✓ | `CFG` → `identity.shortDescription` vía `PROP` | `HeroSection.astro` | — |
| `primaryCta.label` | ✓ | `CFG` → `homeSections[hero].props.primaryCta` | `HeroSection.astro` | — |
| `primaryCta.href` | ✓ | `CFG` → `homeSections[hero].props.primaryCta` | `HeroSection.astro` | — |
| `secondaryCta.label` | — | `CFG` → `homeSections[hero].props.secondaryCta` | `HeroSection.astro` | No se renderiza el botón secundario |
| `secondaryCta.href` | — | `CFG` → `homeSections[hero].props.secondaryCta` | `HeroSection.astro` | No se renderiza el botón secundario |
| `bg` | — | `CFG` → `homeSections[hero].props.bg` | `HeroSection.astro` | `'default'` |
| `size` | — | `CFG` → `homeSections[hero].props.size` | `HeroSection.astro` | `'md'` |

### Sección `highlights` — Propuesta de valor

| Campo | Req. | Fuente | Consumidor | Fallback |
|-------|:----:|--------|------------|---------|
| `title` | ✓ | `CFG` → `homeSections[highlights].props.title` | `FeatureSection.astro` | — |
| `subtitle` | — | `CFG` → `homeSections[highlights].props.subtitle` | `FeatureSection.astro` | No se renderiza el subtítulo |
| `items[]` | ✓ | `DATA` → `data/business-info.ts` → `homeFeatures` | `FeatureSection.astro` | Array vacío → sección renderiza sin ítems |
| `items[].icon` | — | `DATA` → `homeFeatures[n].icon` | `FeatureSection.astro` | No se renderiza el símbolo |
| `items[].title` | ✓ | `DATA` → `homeFeatures[n].title` | `FeatureSection.astro` | — |
| `items[].description` | ✓ | `DATA` → `homeFeatures[n].description` | `FeatureSection.astro` | — |
| `columns` | — | `CFG` → `homeSections[highlights].props.columns` | `FeatureSection.astro` | `3` |

### Sección `hours` — Horarios

| Campo | Req. | Fuente | Consumidor | Fallback |
|-------|:----:|--------|------------|---------|
| `title` | ✓ | `CFG` → `homeSections[hours].props.title` | `OpeningHoursSection.astro` | — |
| `hours[]` | ✓ | `CFG` → `globalConfig.hours` | `OpeningHoursSection.astro` | Si array vacío, la sección no se renderiza (guarda en renderer) |
| `hours[n].open` | ✓ | `CFG` → `hours[n].open` | `OpeningHoursSection.astro` | — |
| `hours[n].close` | — | `CFG` → `hours[n].close` | `OpeningHoursSection.astro` | No se muestra hora de cierre |
| `hours[n].closed` | — | `CFG` → `hours[n].closed` | `OpeningHoursSection.astro` | `false` (día abierto) |

### Sección `whatsapp_cta` — CTA WhatsApp

| Campo | Req. | Fuente | Consumidor | Fallback |
|-------|:----:|--------|------------|---------|
| `title` | ✓ | `CFG` → `homeSections[whatsapp_cta].props.title` | `CtaWhatsappSection.astro` | — |
| `subtitle` | — | `CFG` → `homeSections[whatsapp_cta].props.subtitle` | `CtaWhatsappSection.astro` | No se renderiza |
| `buttonLabel` | ✓ | `CFG` → `homeSections[whatsapp_cta].props.buttonLabel` | `CtaWhatsappSection.astro` | — |
| `message` | ✓ | `CFG` → `homeSections[whatsapp_cta].props.message` | `CtaWhatsappSection.astro` + `lib/whatsapp` | — |
| `contact.whatsapp` | ✓ | `CFG` → `contact.whatsapp` | Renderer (guarda) | Sección no se renderiza si no hay número |

### Secciones `promotions` y `testimonials`

Configuradas en `homeSections` pero **no implementadas aún** (`implemented: false` en `home-section-registry.ts`). El renderer las omite silenciosamente sin error.

### SEO de la Home

| Campo | Fuente | Fallback |
|-------|--------|---------|
| `<title>` | `${identity.name} · ${identity.tagline}` (standaloneTitle) | — |
| `description` | `CFG` → `seoDefaults.defaultDescription` | `''` |
| `og:image` | `CFG` → `seoDefaults.ogImage` (→ `identity.coverImageUrl`) | Vacío (sin og:image) |

---

## `/catalog` — Catálogo

> Ruta: `src/pages/catalog.astro`  
> Feature flag: `globalConfig.modules.core.catalog`

### Campos requeridos

| Campo | Fuente | Consumidor | Notas |
|-------|--------|------------|-------|
| `modules.core.catalog` | `CFG` | `catalog.astro` | `false` → se muestra mensaje "no disponible" |
| `categories[]` | `SVC` → `catalog.service.getCategories()` | `CategoryNav.astro` | Array vacío → nav oculta |
| `products[]` | `SVC` → `catalog.service.getProducts()` | `ProductCard.astro` | Array vacío → mensaje "sin productos" |
| `identity.name` | `CFG` | URL de WhatsApp del pedido | Usado en el mensaje pre-escrito |
| `contact.whatsapp` | `CFG` | botón "Pedir" en `ProductCard` | Si ausente, botón no se renderiza |

### Campos opcionales

| Campo | Fuente | Consumidor | Fallback |
|-------|--------|------------|---------|
| `featuredProducts[]` | `SVC` → `getFeaturedProducts()` | Sección "Destacados" | Sin destacados → sección oculta (guarda `length > 0`) |
| `product.badge` | `DATA` → `products.ts` | `ProductCard.astro` | Sin badge |
| `product.isAvailable` | `DATA` → `products.ts` | `ProductCard.astro` | `undefined` → disponible |
| `product.isFeatured` | `DATA` → `products.ts` | `getFeaturedProducts()` | `undefined` → no destacado |
| `product.description` | `DATA` → `products.ts` | `ProductCard.astro` | No se renderiza descripción |
| `product.imageUrl` | `DATA` → `products.ts` | `ProductCard.astro` | Sin imagen (solo texto) |
| `category.description` | `DATA` → `categories.ts` | `CategoryNav.astro` | No se renderiza |
| `category.imageUrl` | `DATA` → `categories.ts` | `CategoryNav.astro` | Sin imagen en nav |
| `seoDefaults.defaultDescription` | `CFG` | `<meta description>` de la página | `''` |

### Contrato de `ProductCard.astro`

| Prop | Req. | Tipo | Fallback |
|------|:----:|------|---------|
| `product` | ✓ | `Product` | — |
| `orderHref` | — | `string` | Botón "Pedir" no renderizado |

### SEO

| Campo | Valor | Fuente |
|-------|-------|--------|
| `<title>` | `"Catálogo · {titleTemplate}"` | `CFG → seoDefaults.titleTemplate` |
| `description` | `"Explora el catálogo completo de {name}. {defaultDescription}"` | `CFG` |

---

## `/promotions` — Promociones y Ofertas

> Ruta: `src/pages/promotions.astro`  
> Feature flag: `globalConfig.modules.core.promotions`

### Campos requeridos

| Campo | Fuente | Consumidor | Notas |
|-------|--------|------------|-------|
| `modules.core.promotions` | `CFG` | `promotions.astro` | `false` → mensaje "no disponible" |
| `promotions[]` | `SVC` → `promotions.service.getPromotions()` | `PromotionCard.astro` | Array vacío → "Pronto tendremos novedades" |
| `identity.name` | `CFG` | Mensaje de WhatsApp | Usado en texto pre-escrito |

### Campos opcionales

| Campo | Fuente | Consumidor | Fallback |
|-------|--------|------------|---------|
| `contact.whatsapp` | `CFG` | Botón de oferta en `PromotionCard` | Sin botón de pedido |
| `promotion.status` | `DATA` → `promotions.ts` | `promotions.service.getPromotionStatus()` | Calculado por fechas → `isActive` retrocompat |
| `promotion.startsAt` | `DATA` → `promotions.ts` | Rango de fechas + cálculo de estado | Sin fecha de inicio |
| `promotion.endsAt` | `DATA` → `promotions.ts` | Rango de fechas + cálculo de estado | Sin fecha de cierre |
| `promotion.discountLabel` | `DATA` → `promotions.ts` | `PromotionCard.astro` | Sin etiqueta de descuento |
| `promotion.imageUrl` | `DATA` → `promotions.ts` | `PromotionCard.astro` | Sin imagen |
| `promotion.productIds[]` | `DATA` → `promotions.ts` | Lógica de vinculación | Sin productos vinculados |
| `promotion.categoryIds[]` | `DATA` → `promotions.ts` | Lógica de vinculación | Sin categorías vinculadas |

### Estados resueltos por el servicio

El estado de cada promoción es calculado por `getPromotionStatus(promo, now)` antes de pasarse a `PromotionCard`. El componente nunca calcula el estado internamente.

| Estado | Descripción visual | Visible para el cliente |
|--------|--------------------|------------------------|
| `active` | Badge verde "Activa" | Sí |
| `upcoming` | Badge azul "Próximamente" | Sí |
| `paused` | Badge amarillo "Pausada" | Sí (atenuada) |
| `expired` | Badge gris "Expirada" | Sí (atenuada, sin CTA) |

### SEO

| Campo | Valor | Fuente |
|-------|-------|--------|
| `<title>` | `"Promociones · {titleTemplate}"` | `CFG` |
| `description` | Incluye conteo de ofertas activas dinámicamente | Calculado en `promotions.astro` |

---

## `/about` — Sobre Nosotros

> Ruta: `src/pages/about.astro`  
> Siempre visible (sin feature flag)

### Campos requeridos

| Campo | Fuente | Consumidor | Notas |
|-------|--------|------------|-------|
| `identity.name` | `CFG` | `about.astro` | Título del `<meta description>` y hero |
| `location.city` | `CFG` | `<meta description>` | Construcción de la descripción SEO |
| `aboutContent.story[]` | `DATA` → `data/business-info.ts` | Bloque de historia | Array de párrafos; mínimo 1 recomendado |

### Campos opcionales

| Campo | Fuente | Consumidor | Fallback |
|-------|--------|------------|---------|
| `aboutContent.mission` | `DATA` → `data/business-info.ts` | Bloque cita de misión | Sección de misión no renderizada |
| `aboutContent.differentiators[]` | `DATA` → `data/business-info.ts` | Grid de diferenciadores | Sección completa no renderizada |
| `differentiator.icon` | `DATA` | `about.astro` card | Sin ícono |
| `differentiator.title` | `DATA` | `about.astro` card | — |
| `differentiator.description` | `DATA` | `about.astro` card | — |
| `hours` | `CFG` → `globalConfig.hours` | `OpeningHoursSection.astro` | Sección de horarios no renderizada si array vacío |
| `contact.whatsapp` | `CFG` | `CtaWhatsappSection.astro` | Sección CTA no renderizada |
| `identity.coverImageUrl` | `CFG` | OG image fallback | Sin og:image |

### SEO

| Campo | Valor | Fuente |
|-------|-------|--------|
| `<title>` | `"Nuestra Historia · {titleTemplate}"` |硬codedado en página + `CFG` template |
| `description` | `"Conoce la historia... de {name}, tu cafetería en {city}."` | Construido en `about.astro` |

---

## `/contact` — Contacto

> Ruta: `src/pages/contact.astro`  
> Siempre visible (sin feature flag)

### Campos requeridos

| Campo | Fuente | Consumidor | Notas |
|-------|--------|------------|-------|
| `identity.name` | `CFG` | Mensaje de WhatsApp | Texto pre-escrito del enlace |
| `location.city` | `CFG` | `<meta description>` | Aparece en la descripción SEO |

### Campos opcionales

| Campo | Fuente | Consumidor | Fallback |
|-------|--------|------------|---------|
| `contact.whatsapp` | `CFG` | Botón WhatsApp prominente | Bloque CTA de WhatsApp no renderizado |
| `contact.phone` | `CFG` | Tarjeta de info de contacto | No se muestra |
| `contact.email` | `CFG` | Tarjeta de info de contacto | No se muestra |
| `location.street` | `CFG` | `<meta description>` y tarjeta de ubicación | Omitido de descripción y tarjeta |
| `location.municipality` | `CFG` | Tarjeta de ubicación | Omitido |
| `location.mapUrl` | `CFG` | Enlace "Ver en mapa" | Enlace no renderizado |
| `hours` | `CFG` → `globalConfig.hours` | `OpeningHoursSection.astro` | Sección de horarios omitida si array vacío |
| `social.instagram` | `CFG` | Tarjeta de redes sociales | Red no renderizada |
| `social.facebook` | `CFG` | Tarjeta de redes sociales | Red no renderizada |
| `social.*` | `CFG` | Tarjeta de redes sociales | Cada key `undefined` → omitida |

### Nota sobre el formulario de contacto

La página tiene un formulario HTML (campos nombre, teléfono, mensaje) renderizado como UI estática. **No tiene backend activo en MVP** — el formulario es visual, la conversión real ocurre vía WhatsApp. No requiere campos de config propios.

### SEO

| Campo | Valor | Fuente |
|-------|-------|--------|
| `<title>` | `"Contacto · {titleTemplate}"` | `CFG` |
| `description` | `"Contáctanos en {street ?? city}, {city}."` | Construido en `contact.astro` |

---

## `/faq` — Preguntas Frecuentes *(módulo secundario)*

> Ruta: `src/pages/faq.astro`  
> Feature flag: `globalConfig.modules.secondary.faq.enabled`  
> Si deshabilitado: redirect `meta refresh` a `/` + mensaje "Página no disponible"

### Campos requeridos

| Campo | Fuente | Consumidor | Notas |
|-------|--------|------------|-------|
| `modules.secondary.faq.enabled` | `CFG` | Guard en `faq.astro` | `false` → redirect a `/` |
| `faqItems[]` | `DATA` → `data/faq.ts` | `FaqSection.astro` | Array vacío → sección vacía sin error |
| `faqItems[n].question` | `DATA` | `FaqSection.astro` | — |
| `faqItems[n].answer` | `DATA` | `FaqSection.astro` | — |

### Campos opcionales

| Campo | Fuente | Consumidor | Fallback |
|-------|--------|------------|---------|
| `modules.secondary.faq.title` | `CFG` | H1 de la página | `'Preguntas Frecuentes'` (literal en `faq.astro`) |
| `modules.secondary.faq.subtitle` | `CFG` | Subtítulo del hero | No se renderiza el subtítulo |
| `faqItems[n].id` | `DATA` | Anchor/categoría | Generado si no viene |
| `faqItems[n].category` | `DATA` | Agrupación visual | Sin agrupación |
| `contact.whatsapp` | `CFG` | `CtaWhatsappSection` al final | Sección CTA no renderizada |
| `identity.name` | `CFG` | Mensaje de WhatsApp del CTA | Usado en texto pre-escrito |

### SEO

| Campo | Valor | Fuente |
|-------|-------|--------|
| `<title>` | `"Preguntas Frecuentes · {titleTemplate}"` | `CFG` |
| `description` | `"Resolvemos tus dudas sobre {name}: pedidos, horarios, menú y más."` | Construido en `faq.astro` |

---

## `/gallery` — Galería *(módulo secundario)*

> Ruta: `src/pages/gallery.astro`  
> Feature flag: `globalConfig.modules.secondary.gallery.enabled`  
> Si deshabilitado: redirect `meta refresh` a `/` + mensaje "Página no disponible"

### Campos requeridos

| Campo | Fuente | Consumidor | Notas |
|-------|--------|------------|-------|
| `modules.secondary.gallery.enabled` | `CFG` | Guard en `gallery.astro` | `false` → redirect a `/` |
| `galleryItems[]` | `DATA` → `data/gallery.ts` | `GalleryGrid.astro` | Array vacío → grid vacío sin error |
| `galleryItems[n].src` | `DATA` | `GalleryGrid.astro` | — (imagen rota si falta) |
| `galleryItems[n].alt` | `DATA` | `GalleryGrid.astro` | `''` (accesibilidad degradada) |

### Campos opcionales

| Campo | Fuente | Consumidor | Fallback |
|-------|--------|------------|---------|
| `modules.secondary.gallery.title` | `CFG` | H1 de la página | `'Galería'` (literal en `gallery.astro`) |
| `modules.secondary.gallery.subtitle` | `CFG` | Subtítulo del hero | No se renderiza |
| `galleryItems[n].caption` | `DATA` | `GalleryGrid.astro` | Sin pie de foto |
| `galleryItems[n].category` | `DATA` | Filtros de galería (futuro) | Sin categoría |
| `columns` | `PROP` en `GalleryGrid` | `GalleryGrid.astro` | `3` |

### Ruta de imágenes

Las imágenes de galería deben estar en `public/brands/{slug}/gallery/` y referenciarse como `/brands/{slug}/gallery/{nombre}.webp`. Ver [public/brands/README.md](../public/brands/README.md).

### SEO

| Campo | Valor | Fuente |
|-------|-------|--------|
| `<title>` | `"Galería · {titleTemplate}"` | `CFG` |
| `description` | `"Conoce el espacio, los productos... de {name} a través de nuestra galería."` | Construido en `gallery.astro` |

---

## `/blog` — Blog *(módulo secundario)*

> Ruta: `src/pages/blog/index.astro`  
> Feature flag: `globalConfig.modules.secondary.blog.enabled`  
> Si deshabilitado: redirect `meta refresh` a `/` + mensaje "Página no disponible"

### Campos requeridos

| Campo | Fuente | Consumidor | Notas |
|-------|--------|------------|-------|
| `modules.secondary.blog.enabled` | `CFG` | Guard en `blog/index.astro` | `false` → redirect a `/`; también omite `getStaticPaths` en `[slug].astro` |
| `posts[]` | `SVC` → `services/blog.getPosts()` | `BlogPostCard.astro` | Array vacío → "No hay artículos publicados" |
| `post.title` | `DATA` → `data/blog-posts.ts` | `BlogPostCard.astro` | — |
| `post.slug` | `DATA` | `getStaticPaths()` + links | — |
| `post.summary` | `DATA` | `BlogPostCard.astro` | — |
| `post.publishedAt` | `DATA` | `BlogPostCard.astro` + `[slug].astro` | — |

### Campos opcionales (índice)

| Campo | Fuente | Consumidor | Fallback |
|-------|--------|------------|---------|
| `modules.secondary.blog.title` | `CFG` | H1 del índice | `'Blog'` (literal en `blog/index.astro`) |
| `modules.secondary.blog.subtitle` | `CFG` | Subtítulo del hero | No se renderiza |
| `post.coverImageUrl` | `DATA` | `BlogPostCard.astro` | Sin imagen de portada |
| `post.tags[]` | `DATA` | `BlogPostCard.astro` | Sin etiquetas |
| `post.author` | `DATA` | `BlogPostCard.astro` | Sin autor |
| `post.readingTimeMinutes` | `DATA` | `BlogPostCard.astro` | Sin tiempo de lectura |

### SEO (índice)

| Campo | Valor | Fuente |
|-------|-------|--------|
| `<title>` | `"Blog · {titleTemplate}"` | `CFG` |
| `description` | `"Artículos, recetas y novedades de {name}."` | Construido en `blog/index.astro` |

---

## `/blog/[slug]` — Artículo individual *(módulo secundario)*

> Ruta: `src/pages/blog/[slug].astro`  
> Generación estática: `getStaticPaths()` produce una ruta por post  
> Si el módulo blog está desactivado: `getStaticPaths()` devuelve `[]` → 404 nativo del host

### Campos requeridos

| Campo | Fuente | Consumidor | Notas |
|-------|--------|------------|-------|
| `post.title` | `DATA` (vía `getStaticPaths`) | H1 + `<title>` | — |
| `post.slug` | `DATA` | `getStaticPaths` → params | — |
| `post.summary` | `DATA` | `<meta description>` + intro | — |
| `post.publishedAt` | `DATA` | `<time>` formateado | Formato `YYYY-MM-DD` (string ISO) |
| `post.body` | `DATA` | Bloque de contenido | — |

### Campos opcionales (detalle)

| Campo | Fuente | Consumidor | Fallback |
|-------|--------|------------|---------|
| `post.coverImageUrl` | `DATA` | Imagen de portada del artículo | Sin imagen |
| `post.tags[]` | `DATA` | Chips de etiquetas | Sin chips |
| `post.author` | `DATA` | Nombre del autor | Sin autor |
| `post.readingTimeMinutes` | `DATA` | Tiempo de lectura | Sin indicador |

### SEO

| Campo | Valor | Fuente |
|-------|-------|--------|
| `<title>` | `"{post.title} · {titleTemplate}"` | `CFG` template + `DATA` |
| `description` | `post.summary` | `DATA` |
| `og:image` | `post.coverImageUrl` ?? `seoDefaults.ogImage` | `DATA` / `CFG` |

---

## Campos globales presentes en todas las páginas

Estos campos son consumidos por `MainLayout.astro` en cada render, independientemente de la página:

| Campo | Fuente | Consumidor | Fallback |
|-------|--------|------------|---------|
| `seoDefaults.titleTemplate` | `CFG` | `<title>` (cuando no es `standaloneTitle`) | `"%s"` (solo el título de la página) |
| `seoDefaults.defaultDescription` | `CFG` | `<meta description>` fallback | `''` |
| `seoDefaults.ogImage` | `CFG` → `identity.coverImageUrl` | `og:image` y `twitter:image` fallback | Sin og:image |
| `branding.colors.*` | `CFG` | CSS custom properties vía `brandVars` | Valores de `tokens.css` |
| `branding.typography.*` | `CFG` | CSS custom properties | Fuentes del sistema |
| `branding.themeKey` | `CFG` | `data-theme` en `<html>` | `'default'` |
| `identity.name` | `CFG` | `<link rel="icon">` alt text | — |
| `/favicon.svg` | `public/` (raíz) | `<link rel="icon">` | Icono de browser por defecto |

---

## Errores de contenido más comunes

| Error | Síntoma | Solución |
|-------|---------|---------|
| `identity.name` vacío | Título de página vacío, mensaje de WA sin nombre | Siempre requerido en `business-config.ts` |
| `contact.whatsapp` no definido | Botones de pedido/contacto desaparecen sin aviso | Esperado: UI se adapta. Definir para habilitar conversión |
| `aboutContent.story` array vacío | Sección de historia vacía (sin error de build) | Proveer mínimo 1 párrafo en `data/business-info.ts` |
| `galleryItems[n].src` apuntando a imagen inexistente | Imagen rota (`<img>` con `alt` vacío) | Verificar que el archivo existe en `public/brands/{slug}/gallery/` |
| `modules.core.catalog = false` | Página `/catalog` con mensaje "no disponible" | Activar en `business-config.ts → modules.core.catalog` |
| `modules.secondary.faq.enabled = false` | Visitar `/faq` redirige a `/` | Activar flag del módulo |
| `promotion.status` no definido + sin fechas | `getPromotionStatus` cae al retrocompat `isActive` | Definir siempre `status` explícito en `data/promotions.ts` |
| `post.publishedAt` en formato incorrecto | Error de fecha en `[slug].astro` | Formato requerido: `"YYYY-MM-DD"` (string ISO sin hora) |

---

*Ver también: [content-strategy.md](./content-strategy.md) para la matriz de fuentes de verdad · [catalog-promotions-domain.md](./catalog-promotions-domain.md) para el dominio de catálogo.*
