# Checklist — Nuevo Cliente

> Tiempo estimado: **30–60 min** para demo funcional  
> Archivo de trabajo principal: `src/config/business-config.ts`

---

## FASE 0 — Datos que pedir al cliente antes de empezar

Recopila esto en una llamada o formulario antes de tocar código.

### Identidad (obligatorio)
- [ ] Nombre comercial del negocio
- [ ] Frase corta de marca / tagline (ej.: "El mejor café de La Habana")
- [ ] Descripción larga (3–5 frases para la página About)
- [ ] Descripción corta (1 frase para footer y meta tags)

### Contacto (obligatorio)
- [ ] Número de WhatsApp con código de país (ej.: `+5350123456`)
- [ ] Teléfono fijo (opcional)
- [ ] Email de contacto (opcional)

### Ubicación
- [ ] Ciudad y país
- [ ] Calle / esquina (opcional pero recomendado)
- [ ] Municipio o barrio (opcional)

### Horarios
- [ ] Horario por día (lunes–domingo), o rango semanal
- [ ] Días cerrados

### Redes sociales
- [ ] Instagram (URL completa)
- [ ] Facebook (URL completa)
- [ ] Otras (TikTok, Telegram, YouTube — opcionales)

### Visual / Branding
- [ ] Color principal de marca (hex)
- [ ] Color secundario / de fondo (hex)
- [ ] Color de acento (hex)
- [ ] Logo en formato SVG o PNG con fondo transparente
- [ ] Foto de portada (1200×630 px mínimo, formato WebP o JPEG)

### Catálogo
- [ ] Lista de categorías (nombre, orden)
- [ ] Lista de productos por categoría (nombre, precio, descripción breve)
- [ ] Indicar cuáles son "destacados" (máx. 3–5)
- [ ] Indicar si alguno está agotado al arrancar

### Módulos opcionales
- [ ] ¿Tiene promociones activas? → Si / No + detalle
- [ ] ¿Quiere página FAQ? → Si / No + preguntas
- [ ] ¿Quiere galería de fotos? → Si / No + imágenes
- [ ] ¿Quiere blog? → Si / No + artículos iniciales

---

## FASE 1 — Configurar identidad y contacto

> Archivo: `src/config/business-config.ts` — bloque `identity`

- [ ] Reemplazar `name` con el nombre comercial real
- [ ] Reemplazar `slug` con versión kebab-case del nombre (ej.: `panaderia-el-pan`)
- [ ] Reemplazar `tagline` con la frase de marca del cliente
- [ ] Reemplazar `description` (texto largo para About y SEO)
- [ ] Reemplazar `shortDescription` (1 frase para footer y meta tags cortos)
- [ ] Actualizar `logo.url` → `/brands/{slug}/logo/logo.svg`
- [ ] Actualizar `logo.alt` → nombre del negocio
- [ ] Actualizar `coverImageUrl` → `/brands/{slug}/hero/cover.webp`

> Archivo: `src/config/business-config.ts` — bloque `contact`

- [ ] Reemplazar `whatsapp` → número real en formato E.164 (ej.: `+5350123456`)
- [ ] Reemplazar `phone` → teléfono fijo (o eliminar la línea si no aplica)
- [ ] Reemplazar `email` → email real (o eliminar la línea si no aplica)

---

## FASE 2 — Ubicación, horarios y redes

> Archivo: `src/config/business-config.ts` — bloques `location`, `hours`, `social`

- [ ] Actualizar `location.city`, `location.country`
- [ ] Actualizar `location.street` y `location.municipality` (dejar `undefined` si no aplica)
- [ ] Reemplazar el array `hours[]` con el horario real día a día
  - Para días cerrados: `isClosed: true` (sin valores de `open`/`close`)
- [ ] Reemplazar `social.instagram` con la URL real (o eliminar la key si no tiene)
- [ ] Reemplazar `social.facebook` con la URL real (o eliminar la key si no tiene)
- [ ] Añadir otras redes si aplica (`tiktok`, `telegram`, `youtube`)

---

## FASE 3 — Branding y colores

> Archivo: `src/config/business-config.ts` — bloque `branding.colors`

- [ ] Actualizar `primary` → color principal hex (botones, headings, íconos)
- [ ] Actualizar `secondary` → color de fondo de secciones destacadas (hero, encabezados)
- [ ] Actualizar `accent` → color de acento (badges, highlights)
- [ ] Revisar `footerBg`, `footerText`, `footerTextMuted`, `footerBorder` (opcionales; los defaults son neutros oscuros)
- [ ] Si el cliente tiene fuentes específicas, actualizar `branding.typography.heading` y `.body`

> Verificación rápida:
- [ ] Correr `npm run dev` y abrir `http://localhost:4321` — confirmar que los colores se aplican

---

## FASE 4 — Textos de home y CTAs

> Archivo: `src/config/business-config.ts` — bloque `modules.homeSections`

- [ ] Revisar `homeSections[hero].props.primaryCta` — label y href correctos
- [ ] Revisar `homeSections[hero].props.secondaryCta` — label y href correctos
- [ ] Revisar `homeSections[whatsapp_cta].props` — título, subtítulo, mensaje de WhatsApp

> Archivo: `src/config/business-config.ts` — bloque `pages`

- [ ] Actualizar `pages.catalog.cta.message` con el nombre real del negocio (ya usa `identity.name`, solo verificar que la frase tenga sentido)
- [ ] Actualizar `pages.promotions.cta.message` (idem)
- [ ] Actualizar `pages.about.cta.message` (idem)
- [ ] Revisar `pages.promotions.emptyMessage` — el texto que aparece si no hay promociones activas

---

## FASE 5 — Catálogo de productos

> Archivos: `src/data/categories.ts` y `src/data/products.ts`

### Categorías (`src/data/categories.ts`)
- [ ] Borrar todas las entradas demo
- [ ] Añadir una entrada por categoría real:
  ```ts
  { id: 'cat-1', name: 'Cafés', slug: 'cafes', sortOrder: 1, isActive: true }
  ```
- [ ] `slug` debe ser kebab-case, sin tildes, único por categoría

### Productos (`src/data/products.ts`)
- [ ] Borrar todos los productos demo
- [ ] Añadir un producto por ítem real:
  ```ts
  {
    id: 'prod-1',
    categoryId: 'cat-1',           // coincide con el id de la categoría
    name: 'Café Cubano',
    slug: 'cafe-cubano',            // kebab-case único
    description: '...',
    money: { amount: 25, currency: 'CUP' },
    isAvailable: true,
    isFeatured: false,              // true en máx. 3-5 productos
    sortOrder: 1,
  }
  ```
- [ ] Verificar que `categoryId` de cada producto coincide con un `id` de `categories.ts`
- [ ] Marcar `isFeatured: true` en los 3–5 productos más relevantes
- [ ] Marcar `isAvailable: false` en los que estén agotados al arrancar

---

## FASE 6 — Promociones

> Archivo: `src/data/promotions.ts`

Si el cliente **no tiene promociones activas**:
- [ ] Vaciar el array `promotions: []`
- [ ] Verificar que `/promotions` muestra el `emptyMessage` configurado en la Fase 4

Si el cliente **tiene promociones**:
- [ ] Borrar las promociones demo
- [ ] Añadir cada promoción con `status` explícito:
  ```ts
  {
    id: 'promo-1',
    title: 'Nombre de la oferta',
    description: 'Descripción breve visible al cliente.',
    discountLabel: '20% OFF',       // texto libre del badge
    status: 'active',               // active | upcoming | paused | expired
    startsAt: '2026-04-01',         // YYYY-MM-DD (opcional)
    endsAt:   '2026-04-30',         // YYYY-MM-DD (opcional)
    rules: [{ type: 'percentage', value: 20, description: '...' }],
  }
  ```
- [ ] Si no hay fechas definidas, poner solo `status: 'active'`

---

## FASE 7 — Módulos opcionales

> Archivo: `src/config/business-config.ts` — bloque `modules.secondary`

### FAQ
- [ ] Si el cliente tiene FAQ: cambiar `faq.enabled: true`
- [ ] Actualizar `faq.title` y `faq.subtitle`
- [ ] Editar `src/data/faq.ts` — borrar preguntas demo y añadir las reales
  - Cada `FaqItem` necesita: `id`, `question`, `answer`
  - `category` es opcional pero mejora la presentación

### Galería
- [ ] Si el cliente tiene fotos: cambiar `gallery.enabled: true`
- [ ] Actualizar `gallery.title` y `gallery.subtitle`
- [ ] Subir imágenes a `public/brands/{slug}/gallery/` (WebP, 800×600 px)
- [ ] Editar `src/data/gallery.ts` — reemplazar URLs de Picsum por las rutas reales:
  ```ts
  { id: 'gal-1', src: '/brands/{slug}/gallery/espacio-01.webp', alt: '...', caption: '...' }
  ```

### Blog
- [ ] Si el cliente tiene artículos iniciales: cambiar `blog.enabled: true`
- [ ] Actualizar `blog.title` y `blog.subtitle`
- [ ] Editar `src/data/blog-posts.ts` — añadir posts con `slug`, `title`, `summary`, `publishedAt`, `body[]`

### Módulos core desactivados
- [ ] Si el cliente **no quiere** página de promociones: `modules.core.promotions: false`
- [ ] Si el cliente **no quiere** catálogo: `modules.core.catalog: false`

---

## FASE 8 — Assets: logo y fotos

> Carpeta de trabajo: `public/brands/{slug}/`

### Logo
- [ ] Crear carpeta `public/brands/{slug}/logo/`
- [ ] Subir el archivo de logo como `logo.svg` (preferido) o `logo.png`
- [ ] Verificar que la ruta coincide con `identity.logo.url` en `business-config.ts`
- [ ] Confirmar que el logo se ve en header y footer

### Hero / og:image
- [ ] Crear carpeta `public/brands/{slug}/hero/`
- [ ] Subir imagen de portada como `cover.webp` (o `cover.jpg`)
- [ ] Verificar que la ruta coincide con `identity.coverImageUrl`
- [ ] Confirmar que aparece como og:image al compartir el link (usar [opengraph.xyz](https://www.opengraph.xyz) o similar)

### Galería (si el módulo está activo)
- [ ] Crear carpeta `public/brands/{slug}/gallery/`
- [ ] Subir imágenes optimizadas (WebP, máx. 300 KB por imagen, 800×600 px landscaping)
- [ ] Confirmar que las rutas en `data/gallery.ts` apuntan a los archivos reales
- [ ] Revisar que ninguna imagen da 404 en la página `/gallery`

### Favicon
- [ ] Reemplazar `public/favicon.svg` con el isotipo del cliente (o un ícono simple)
- [ ] Verificar que aparece en la pestaña del navegador

---

## FASE 9 — Textos institucionales (About)

> Archivo: `src/data/business-info.ts`

- [ ] Reemplazar `aboutContent.story[]` con los párrafos reales de la historia del negocio (mínimo 1, recomendado 2–3)
- [ ] Reemplazar `aboutContent.mission` con la declaración de misión real (opcional)
- [ ] Si el cliente tiene diferenciadores: añadir `aboutContent.differentiators[]`
- [ ] Actualizar `homeFeatures[]` — los 3 íconos + textos de la sección "¿Por qué elegirnos?"

---

## FASE 10 — QA antes de la demo

Abre `http://localhost:4321` y recorre esta lista página por página.

### Home `/`
- [ ] Nombre del negocio correcto en el Hero
- [ ] Tagline correcto
- [ ] Botones de CTA con labels y hrefs correctos
- [ ] Sección "¿Por qué elegirnos?" con textos reales
- [ ] Horarios correctos en la sección de horarios
- [ ] CTA de WhatsApp abre conversación real al hacer clic
- [ ] Sin textos del mock demo ("Café La Esquina", "La Habana") si el cliente es otro

### Header y Footer
- [ ] Logo visible y cargando desde la ruta correcta
- [ ] Ítems de navegación correctos (incluye módulos secundarios activos)
- [ ] Redes sociales en footer apuntan a las cuentas reales
- [ ] Sin links rotos en la navegación

### `/catalog`
- [ ] Categorías reales (sin "Cafés", "Bebidas frías", "Bocados" del demo)
- [ ] Productos reales con precios y divisas correctas
- [ ] Sección "Destacados" muestra los productos marcados `isFeatured: true`
- [ ] Botón "Hacer un pedido" abre WhatsApp con el número real
- [ ] Productos agotados muestran badge "Agotado" y nombre atenuado

### `/promotions`
- [ ] Promociones reales o mensaje "vacío" apropiado
- [ ] Botón de oferta abre WhatsApp con mensaje correcto

### `/about`
- [ ] Historia real del negocio
- [ ] Misión real (o sección oculta si no aplica)
- [ ] Dirección y horarios correctos en el bloque de contacto inferior

### `/contact`
- [ ] Enlace de WhatsApp con número real
- [ ] Dirección real
- [ ] Redes sociales correctas

### Módulos opcionales activos
- [ ] `/faq` → preguntas reales, CTA de WhatsApp funcional
- [ ] `/gallery` → imágenes reales cargando, sin 404
- [ ] `/blog` → posts iniciales, fechas correctas
- [ ] `/blog/{slug}` → artículo individual legible

### SEO y metadatos
- [ ] Abrir código fuente: `<title>` contiene el nombre del negocio real
- [ ] `<meta name="description">` no es texto del mock
- [ ] Favicon visible en la pestaña

### Responsive
- [ ] Revisar home, catálogo y contacto en móvil (DevTools, 375px)
- [ ] Header y navegación funcionales en mobile

---

## FASE 11 — Publicación

> Completar solo cuando el QA esté 100% limpio

### Build
- [ ] Ejecutar `npm run build` sin errores
- [ ] Si hay errores de TypeScript, corregirlos antes de continuar
- [ ] Ejecutar `npm run preview` y repetir el QA rápido desde la build de producción

### Variables de entorno (si aplica)
- [ ] Crear `.env` con `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_ANON_KEY` si Supabase está activo
- [ ] Configurar las mismas variables en el panel de Vercel / hosting

### Deploy
- [ ] Hacer push al repositorio del cliente (rama `main` o según acuerdo)
- [ ] Verificar que el hosting (Vercel, Netlify, etc.) lanza el build automáticamente
- [ ] Confirmar la URL de producción accesible en un navegador limpio (modo incógnito)
- [ ] Probar el botón de WhatsApp en la URL de producción (no localhost)
- [ ] Confirmar og:image en [opengraph.xyz](https://www.opengraph.xyz) con la URL de producción

### Post-entrega
- [ ] Compartir la URL al cliente para aprobación
- [ ] Documentar credenciales y accesos en un canal seguro
- [ ] Crear carpeta en el repositorio con los assets originales del cliente (`/assets-source/`)
- [ ] Dar de alta `email` de soporte si el cliente necesita soporte directo

---

## Referencia rápida — Un archivo por dato

| Dato | Archivo |
|------|---------|
| Nombre, tagline, colores, contacto, horarios, nav | `src/config/business-config.ts` |
| Textos de CTA y headings de página | `src/config/business-config.ts → pages` |
| Módulos activos (catálogo, promo, faq, gallery, blog) | `src/config/business-config.ts → modules` |
| Historia y misión (About) | `src/data/business-info.ts` |
| Propuesta de valor (home highlights) | `src/data/business-info.ts → homeFeatures` |
| Categorías del catálogo | `src/data/categories.ts` |
| Productos | `src/data/products.ts` |
| Promociones | `src/data/promotions.ts` |
| Preguntas frecuentes | `src/data/faq.ts` |
| Galería | `src/data/gallery.ts` |
| Blog | `src/data/blog-posts.ts` |
| Logo y hero | `public/brands/{slug}/logo/` y `public/brands/{slug}/hero/` |
| Imágenes de galería | `public/brands/{slug}/gallery/` |
| Favicon | `public/favicon.svg` |

---

*Ver también: [content-strategy.md](./content-strategy.md) · [page-content-contracts.md](./page-content-contracts.md) · [adapt-new-business.md](./adapt-new-business.md)*
