# public/brands — Estructura de assets por cliente

Cada negocio (cliente) tiene su propio directorio con slug como nombre.
El slug coincide con `globalConfig.identity.slug` en `src/config/business-config.ts`.

```
public/
└── brands/
    └── {business-slug}/          ← slug del negocio (ej. cafe-la-esquina)
        ├── logo/                  ← logotipo en todas sus variantes
        │   ├── logo.svg           ← versión preferida (vector, fondo transparente)
        │   ├── logo.png           ← PNG 2× (400×120 px mínimo, fondo transparente)
        │   └── logo-dark.svg      ← variante para fondos oscuros (opcional)
        ├── hero/                  ← imagen principal del negocio
        │   ├── cover.svg          ← placeholder SVG (reemplazar antes de producción)
        │   ├── cover.webp         ← versión optimizada para web (preferida en prod)
        │   └── cover.jpg          ← fallback JPEG (1200×630 px, ratio 1.91:1)
        └── gallery/               ← imágenes de la galería del negocio
            ├── espacio-01.webp
            ├── productos-01.webp
            └── ...
```

## Convención de nombres

| Tipo | Patrón | Ejemplo |
|------|--------|---------|
| Logo principal | `logo.{svg,png}` | `logo.svg` |
| Logo oscuro | `logo-dark.{svg,png}` | `logo-dark.svg` |
| Hero / cover | `cover.{webp,jpg,svg}` | `cover.webp` |
| Galería | `{categoría}-{número}.webp` | `espacio-01.webp` |
| Favicon | `favicon.{svg,ico}` → **público raíz** | `/favicon.svg` |

## Formatos recomendados

| Asset | Formato preferido | Alternativa |
|-------|------------------|-------------|
| Logo | SVG | PNG 2× |
| Hero (og:image) | WebP | JPEG |
| Galería | WebP | JPEG |
| Favicon | SVG | ICO |

## Rutas en código

Las rutas de assets se centralizan en **`src/config/business-config.ts`**:

```ts
logo: {
  url: '/brands/cafe-la-esquina/logo/logo.svg',
  alt: 'Café La Esquina',
},
coverImageUrl: '/brands/cafe-la-esquina/hero/cover.webp',
```

Los datos de galería (`src/data/gallery.ts`) usan la carpeta `gallery/`:

```ts
src: '/brands/cafe-la-esquina/gallery/espacio-01.webp',
```

## Adaptar a un nuevo negocio

1. Duplicar este directorio con el slug del nuevo cliente.
2. Reemplazar todos los assets placeholder.
3. Actualizar las rutas en `src/config/business-config.ts`.
4. Actualizar las rutas en `src/data/gallery.ts`.
