# Guía de adaptación — cómo configurar un negocio nuevo

Esta guía cubre todo lo necesario para transformar el starter en el sitio web de
un negocio real. No es necesario tocar componentes ni layouts: **toda la
personalización vive en los archivos de `src/config/` y `src/data/`**.

---

## Índice

1. [Archivos que se editan](#1-archivos-que-se-editan)
2. [Campos mínimos obligatorios](#2-campos-mínimos-obligatorios)
3. [Datos de negocio: identidad, contacto, ubicación, horarios](#3-datos-de-negocio)
4. [Branding y colores](#4-branding-y-colores)
5. [Cómo activar y desactivar módulos](#5-módulos--activar-y-desactivar)
6. [Cómo cambiar el orden de la home](#6-orden-de-la-home)
7. [Cómo actualizar catálogo, ofertas y contacto](#7-catálogo-ofertas-y-contacto)
8. [Contenido secundario: FAQ, galería, blog](#8-contenido-secundario)
9. [Checklist de lanzamiento](#9-checklist-de-lanzamiento)
10. [Errores comunes a evitar](#10-errores-comunes-a-evitar)

---

## 1. Archivos que se editan

El sistema tiene una única fuente de verdad, más archivos de contenido separados.

### Configuración global (editar SIEMPRE)

| Archivo | Qué controla |
|---|---|
| `src/config/business-config.ts` | Todo: identidad, contacto, branding, módulos, SEO |

### Contenido del negocio (editar según el proyecto)

| Archivo | Qué controla |
|---|---|
| `src/data/categories.ts` | Categorías del catálogo |
| `src/data/products.ts` | Productos con precios, disponibilidad, badges |
| `src/data/promotions.ts` | Ofertas y descuentos con fechas |
| `src/data/business-info.ts` | Features del home + historia de la página Nosotros |
| `src/data/faq.ts` | Preguntas frecuentes (si el módulo FAQ está activo) |
| `src/data/gallery.ts` | Imágenes de galería (si el módulo Galería está activo) |
| `src/data/blog-posts.ts` | Artículos de blog (si el módulo Blog está activo) |
| `src/data/testimonials.ts` | Testimonios de clientes |

### Archivos que **NO** hay que tocar

- `src/layouts/` — los layouts leen la config automáticamente
- `src/components/` — los componentes son genéricos
- `src/types/` — las interfaces del contrato tipado
- `src/lib/` — helpers internos
- `src/styles/` — el sistema de diseño base (solo tocar si se crea una skin)

---

## 2. Campos mínimos obligatorios

Antes de arrancar el servidor o hacer build, estos campos **deben** estar
completos en `src/config/business-config.ts`. El helper
`assertValidBusinessConfig()` lanza un error en tiempo de ejecución si alguno
falta o está mal formateado.

```ts
// En src/config/business-config.ts

const identity = {
  name:             'Nombre del negocio',      // requerido — aparece en header, title, OG
  tagline:          'Frase corta de marca',    // requerido — hero y título de home
  description:      'Descripción completa.',   // requerido — meta description y About
  shortDescription: 'Una línea.',              // recomendado — footer y hero subtitle
};

contact: {
  whatsapp: '+53XXXXXXXXX',  // requerido — formato E.164 (código de país + número)
},

location: {
  city:    'Ciudad',   // requerido
  country: 'País',     // requerido
},

hours: [
  { day: 'Lunes', open: '09:00', close: '20:00', isClosed: false },
  // ... un objeto por cada día de la semana
],

seoDefaults: {
  titleTemplate:      '%s | Nombre del negocio',  // el %s es el título de cada página
  defaultDescription: 'Descripción para SEO.',
},
```

> **Formato del número WhatsApp:** debe seguir E.164: `+` + código de país + número,
> sin espacios ni guiones. Ejemplo: `'+5350123456'`, `'+34612345678'`.

---

## 3. Datos de negocio

Toda la información del negocio vive en el bloque superior de
`src/config/business-config.ts`. Edita cada sección:

### Identidad

```ts
const identity: BusinessIdentity = {
  name:             'Mi Negocio',
  slug:             'mi-negocio',            // para URLs internas futuras
  legalName:        'Mi Negocio S.L.',       // opcional — razón social
  tagline:          'Tagline corto',
  description:      'Descripción larga...',
  shortDescription: 'Una línea para el footer.',
  logo: {
    url: '/images/logo.png',   // rutas en /public/
    alt: 'Logo de Mi Negocio',
  },
  coverImageUrl: '/images/cover.jpg',  // og:image por defecto
};
```

### Contacto

```ts
contact: {
  whatsapp: '+34612345678',
  phone:    '+34912345678',   // opcional — enlace tel:
  email:    'hola@minegocio.es', // opcional
},
```

### Ubicación

```ts
location: {
  street:       'Calle Mayor 10',     // opcional — aparece en página Contacto
  municipality: 'Centro',             // opcional — barrio o municipio
  city:         'Madrid',             // requerido
  country:      'España',             // requerido
  mapUrl:       'https://maps.google.com/...', // opcional — iframe embed
},
```

### Horarios

Un objeto por cada día. Si el negocio no abre ese día, pon `isClosed: true`
(los campos `open` y `close` se ignoran en ese caso):

```ts
hours: [
  { day: 'Lunes',  open: '09:00', close: '20:00', isClosed: false },
  { day: 'Martes', open: '09:00', close: '20:00', isClosed: false },
  // ...
  { day: 'Domingo', open: '00:00', close: '00:00', isClosed: true },
],
```

### Redes sociales

Solo incluye las plataformas que el negocio usa. Las que no estén definidas no
aparecen en el footer ni en la página de Contacto:

```ts
social: {
  instagram: 'https://instagram.com/minegocio',
  facebook:  'https://facebook.com/minegocio',
  tiktok:    'https://tiktok.com/@minegocio',
  telegram:  'https://t.me/minegocio',
  // twitter, youtube... añade los que necesites
},
```

---

## 4. Branding y colores

Los colores y tipografías se definen en el bloque `branding` de
`business-config.ts`. MainLayout los inyecta como CSS custom properties en
`:root`, sobreescribiendo los defaults del sistema de diseño.

```ts
branding: {
  themeKey: 'default',   // para futuras skins CSS — ver src/styles/tokens.css
  colors: {
    primary:         '#1D4ED8',  // botones, headings, íconos activos
    secondary:       '#EFF6FF',  // fondo de hero y secciones destacadas
    accent:          '#60A5FA',  // badges, CTAs secundarios
    footerBg:        '#0F172A',  // fondo del footer
    footerText:      '#FFFFFF',  // texto en negrita del footer
    footerTextMuted: '#94A3B8',  // texto secundario del footer
    footerBorder:    '#1E293B',  // línea separadora del footer
  },
  typography: {
    heading: "'Playfair Display', Georgia, serif",
    body:    "'Inter', system-ui, sans-serif",
  },
},
```

> **Nota sobre skins:** Si necesitas un esquema visual radicalmente diferente
> (modo oscuro, paleta festiva, etc.), crea un selector `[data-theme="nombre"]`
> en `src/styles/tokens.css` y establece `branding.themeKey: 'nombre'`. El
> atributo `data-theme` se inyecta automáticamente en la etiqueta `<html>`.

---

## 5. Módulos — activar y desactivar

### Módulos funcionales (`modules.core`)

Controlan si las páginas de catálogo y promociones están activas:

```ts
modules: {
  core: {
    catalog:          true,   // página /catalog con productos
    promotions:       true,   // página /promotions con ofertas
    cart:             false,  // carrito de compras (fase 2)
    whatsappOrdering: false,  // flujo de pedido por WhatsApp (fase 2)
    testimonials:     false,  // sección de testimonios (pendiente)
  },
```

Cuando `catalog: false`, la página `/catalog` muestra un mensaje de “no disponible”
en lugar del catálogo. Lo mismo aplica a `promotions`.

### Módulos secundarios (`modules.secondary`)

FAQ, galería y blog son opcionales. Para activarlos:

```ts
secondary: {
  faq: {
    enabled:  true,                               // ← cambiar a true
    title:    'Preguntas Frecuentes',
    subtitle: 'Todo lo que necesitas saber.',
  },
  gallery: {
    enabled: false,
    title:   'Galería',
    subtitle:'Conoce nuestro espacio.',
  },
  blog: {
    enabled: false,
    title:   'Blog',
    subtitle:'Artículos e historias.',
  },
},
```

Al activar un módulo secundario con `enabled: true`, su enlace aparece
**automáticamente** en el `<header>` y en el `<footer>`. No hace falta tocar
los archivos de navegación.

> **Antes de activar** un módulo secundario, asegúrate de que su archivo de
> datos tiene contenido real: `src/data/faq.ts`, `src/data/gallery.ts` o
> `src/data/blog-posts.ts`.

---

## 6. Orden de la home

Las secciones de la home se configuran en el array `homeSections` dentro de
`business-config.ts`, **antes** del bloque `export const globalConfig`.

Cada entrada tiene:
- `id` — identifica la sección (no cambiar)
- `enabled` — `true` para mostrarla, `false` para ocultarla
- `order` — número ascendente que define el orden de aparición
- `props` — textos y opciones visuales (título, subtítulo, fondo, tamaño)

**Ejemplo: mover "Horarios" antes de "CTA WhatsApp" e inhabilitar "Testimonios":**

```ts
// Antes
{ id: 'testimonials', enabled: false, order: 4, ... },
{ id: 'hours',        enabled: true,  order: 5, ... },
{ id: 'whatsapp_cta', enabled: true,  order: 6, ... },

// Después — intercambiar order de hours y whatsapp_cta
{ id: 'testimonials', enabled: false, order: 4, ... },
{ id: 'whatsapp_cta', enabled: true,  order: 5, ... },
{ id: 'hours',        enabled: true,  order: 6, ... },
```

**Secciones disponibles:**

| id | Descripción | Estado |
|---|---|---|
| `hero` | Banner principal con CTAs | Implementada |
| `highlights` | 3 características del negocio | Implementada |
| `promotions` | Bloque de ofertas | Reservada (próximo sprint) |
| `testimonials` | Reseñas de clientes | Reservada (próximo sprint) |
| `hours` | Horarios de atención | Implementada |
| `whatsapp_cta` | Llamada a la acción de WhatsApp | Implementada |
| `location` | Mapa de ubicación | Reservada (próximo sprint) |

> Las secciones "Reservadas" se pueden dejar con `enabled: false` sin problema; no
> producen errores aunque sus componentes aún no estén implementados.

---

## 7. Catálogo, ofertas y contacto

### Catálogo

**Categorías** — `src/data/categories.ts`

```ts
export const categories: Category[] = [
  {
    id:          'cat-1',          // único, usado en products.ts para relacionar
    name:        'Cafés',
    slug:        'cafes',          // aparece en la URL del anchor (#cafes)
    description: 'Descripción de la categoría.',
    sortOrder:   1,                // orden de aparición en la página
    isActive:    true,
  },
  // ... una entrada por categoría
];
```

**Productos** — `src/data/products.ts`

```ts
{
  id:          'prod-1',
  categoryId:  'cat-1',        // debe coincidir con un id de categories
  name:        'Nombre del producto',
  slug:        'nombre-producto',
  description: 'Descripción corta.',
  price:       150,            // en la moneda local (número sin símbolo)
  isAvailable: true,           // false = "No disponible" pero visible
  isFeatured:  true,           // aparece en la sección "Destacados"
  badge:       'popular',      // opcional: 'popular' | 'new' | 'offer'
  imageUrl:    '/images/catalog/producto.webp', // opcional
  sortOrder:   1,
},
```

### Ofertas / Promociones

`src/data/promotions.ts`

```ts
{
  id:            'promo-1',
  title:         'Nombre de la oferta',
  description:   'Descripción detallada de la promoción.',
  discountLabel: '20% OFF',      // texto libre: '2×1', 'Promo', '50% OFF', etc.
  startsAt:      '2026-05-01',   // opcional — formato YYYY-MM-DD
  endsAt:        '2026-05-31',   // opcional
  isActive:      true,
},
```

- Si no se definen `startsAt` / `endsAt`, la promo no muestra rango de fechas.
- `isActive: false` hace que la promo aparezca con estado "Expirada".
- Las fechas se calculan en `build-time` con la zona horaria del servidor;
  para negocios en Cuba usar `timeZone: 'America/Havana'` (ya configurado).

### Contacto

La página `/contact` no tiene datos propios: los toma directamente de
`globalConfig.contact`, `globalConfig.location`, `globalConfig.social` y
`globalConfig.hours`. Actualizar esos bloques en `business-config.ts` es
suficiente; la página refleja los cambios automáticamente.

---

## 8. Contenido secundario

### Features del home (`src/data/business-info.ts`)

El array `homeFeatures` controla los tres íconos de la sección "¿Por qué
elegirnos?". Edita los textos para que reflejen la propuesta de valor real:

```ts
export const homeFeatures: ContentFeature[] = [
  { icon: '⭐', title: 'Ventaja 1', description: 'Descripción breve.' },
  { icon: '📍', title: 'Ubicación', description: 'Dónde nos encontramos.' },
  { icon: '🕐', title: 'Horario',   description: 'Cuándo estamos abiertos.' },
];
```

### Historia de Nosotros (`src/data/business-info.ts`)

El objeto `aboutContent` alimenta la página `/about`:

```ts
export const aboutContent: AboutContent = {
  story: [
    'Primer párrafo de la historia del negocio.',
    'Segundo párrafo.',
  ],
  mission: 'Declaración de misión.',
  differentiators: [
    { icon: '🏆', title: 'Diferenciador 1', description: '...' },
  ],
};
```

### FAQ (`src/data/faq.ts`)

Solo relevante cuando `modules.secondary.faq.enabled: true`. Reemplaza las
preguntas demo con las reales del negocio. El campo `category` agrupa las
preguntas en secciones dentro de la página:

```ts
{ id: 'faq-1', category: 'Pedidos', question: '¿...?', answer: '...' },
```

### Galería (`src/data/gallery.ts`)

Solo relevante cuando `modules.secondary.gallery.enabled: true`. Reemplaza las
URLs de placeholder de picsum.photos con rutas reales en `/public/images/`:

```ts
{ id: 'gal-1', src: '/images/galeria/foto-1.webp', alt: 'Descripción accesible', caption: 'Pie de foto opcional' },
```

Dimensiones recomendadas: **800 × 600 px**, formato WebP para mejor rendimiento.

---

## 9. Checklist de lanzamiento

Usa esta lista antes de entregar o publicar el sitio.

### Identidad y contacto
- [ ] `identity.name` actualizado (no dice "Café La Esquina")
- [ ] `identity.tagline` y `identity.description` escritos para el cliente
- [ ] `identity.shortDescription` — máximo 2 líneas
- [ ] `identity.logo.url` apunta a un archivo real en `/public/`
- [ ] `identity.coverImageUrl` apunta a una imagen real (og:image)
- [ ] `contact.whatsapp` con número real en formato E.164
- [ ] `contact.phone` y `contact.email` actualizados (o eliminados si no aplican)
- [ ] `location` con dirección real
- [ ] `hours` con horarios reales (días cerrados con `isClosed: true`)
- [ ] `social` con solo las redes que el negocio usa activamente

### SEO
- [ ] `seoDefaults.titleTemplate` incluye el nombre real del negocio
- [ ] `seoDefaults.defaultDescription` — entre 120 y 160 caracteres
- [ ] `seoDefaults.ogImage` apunta a una imagen real (1200 × 630 px ideal)

### Branding
- [ ] `branding.colors.primary` es el color de marca del cliente
- [ ] `branding.colors.secondary` funciona como fondo de sección (contraste suficiente)
- [ ] Footer se ve correctamente con los colores de footer definidos

### Módulos
- [ ] Módulos de `core` activados/desactivados según lo acordado con el cliente
- [ ] Módulos secundarios (FAQ, galería, blog) con `enabled: false` si no tienen contenido

### Contenido
- [ ] `categories.ts` y `products.ts` con productos reales (no demo de Café La Esquina)
- [ ] `promotions.ts` con ofertas reales o vacío si no hay (array `[]`)
- [ ] `business-info.ts` con features y aboutContent reales
- [ ] Imágenes en `/public/images/` (logo, cover, productos, galería)
- [ ] Placeholders de picsum.photos eliminados de galería (si el módulo está activo)

### Técnico
- [ ] `astro build` corre sin errores ni warnings
- [ ] Variables de entorno de Supabase configuradas (si se usa backend real)
- [ ] Favicon real en `/public/favicon.svg`
- [ ] Página `/styleguide` protegida o eliminada antes de producción

---

## 10. Errores comunes a evitar

### ❌ Editar archivos que no son de configuración para cambiar datos

Los componentes como `Header.astro`, `Footer.astro` o `MainLayout.astro`
leen la config automáticamente. No hardcodear textos en ellos; siempre actualizar
`business-config.ts` o los archivos de `src/data/`.

---

### ❌ Número de WhatsApp en formato incorrecto

```ts
// ❌ Incorrecto
whatsapp: '5350000000'     // falta el +
whatsapp: '+53 5000 0000'  // tiene espacios
whatsapp: '+53-5000-0000'  // tiene guiones

// ✅ Correcto
whatsapp: '+5350000000'
```

El validador `assertValidBusinessConfig()` detecta este error. Si el número
está mal, los enlaces de WhatsApp no funcionarán.

---

### ❌ `categoryId` en productos que no coincide con ninguna categoría

```ts
// ❌ Incorrecto — 'cat-bebidas' no existe en categories
{ id: 'prod-5', categoryId: 'cat-bebidas', ... }

// ✅ Correcto — usar el id exacto definido en categories.ts
{ id: 'prod-5', categoryId: 'cat-2', ... }
```

Los productos con `categoryId` inexistente no aparecerán en el catálogo.

---

### ❌ Activar un módulo secundario sin contenido

Si se activa `faq: { enabled: true }` pero `faqItems` está vacío, la página
`/faq` cargará pero mostrará una lista en blanco. Siempre añadir contenido real
**antes** de activar el módulo.

---

### ❌ Cambiar `order` de secciones del home sin reordenar todos

Si dos secciones tienen el mismo `order`, el resultado es indeterminado. Usar
siempre números únicos y ascendentes. Los saltos están permitidos (1, 3, 10...)
pero no los duplicados.

---

### ❌ Imágenes referenciadas que no existen en `/public/`

Cualquier ruta de imagen en `identity.logo.url`, `identity.coverImageUrl` o en
los datos de menú y galería debe existir físicamente en `/public/`. Una imagen
rota no produce error de build pero sí una mala experiencia de usuario y penaliza
el SEO.

---

### ❌ Dejar contenido demo en producción

Revisar que no quede ningún texto del ejemplo "Café La Esquina":
- nombres de negocio, teléfonos y emails demo
- imágenes de picsum.photos en la galería
- testimonios, productos o precios de ejemplo
- la página `/styleguide` accesible públicamente