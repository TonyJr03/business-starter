# Módulos secundarios — Guía de activación y extensión

> Sprint 6 · Abril 2026

Los módulos secundarios (FAQ, Galería, Blog) son secciones opcionales del sitio controladas por **feature flags** en tiempo de compilación. Se activan o desactivan editando un único archivo de configuración, sin tocar páginas ni componentes.

---

## Archivos involucrados

| Archivo | Rol |
|---|---|
| `src/types/secondary-modules.ts` | Tipos TypeScript: `SecondaryModuleId`, `SecondaryModuleConfig`, `SecondaryModulesConfig`, `FaqItem`, `GalleryItem`, `BlogPost` |
| `src/config/secondary-modules.ts` | Objeto de configuración `secondaryModules` + helper `isModuleEnabled()` |
| `src/config/navigation.ts` | Lee los flags para incluir/excluir enlaces en header y footer |
| `src/data/faq.ts` | Preguntas/respuestas demo tipadas como `FaqItem[]` |
| `src/data/gallery.ts` | Imágenes demo tipadas como `GalleryItem[]` |
| `src/data/blog-posts.ts` | Artículos demo tipados como `BlogPost[]` |
| `src/services/blog.ts` | `getPosts()` y `getPostBySlug()` — capa de servicio para el blog |
| `src/components/sections/FaqSection.astro` | Acordeón de preguntas frecuentes (sin JS, nativo) |
| `src/components/sections/GalleryGrid.astro` | Grid responsivo de imágenes |
| `src/components/sections/BlogPostCard.astro` | Card de vista previa de artículo |
| `src/pages/faq.astro` | Página `/faq` |
| `src/pages/gallery.astro` | Página `/gallery` |
| `src/pages/blog/index.astro` | Listado `/blog` |
| `src/pages/blog/[slug].astro` | Detalle `/blog/[slug]` |

---

## Activar un módulo

Edita `src/config/secondary-modules.ts` y cambia `enabled` a `true` en el módulo deseado:

```ts
// src/config/secondary-modules.ts
export const secondaryModules: SecondaryModulesConfig = {
  faq: {
    enabled: true,           // ← activar
    title: 'Preguntas Frecuentes',
    subtitle: 'Todo lo que necesitas saber antes de visitarnos.',
  },
  gallery: { enabled: false, ... },
  blog:    { enabled: false, ... },
};
```

Al compilar (`npm run build`), el módulo activado:
- Aparece en el menú de navegación (header y footer).
- Genera su ruta estática (`/faq`, `/gallery`, `/blog` y `/blog/[slug]`).

Con `enabled: false`, la ruta sigue existiendo pero redirige inmediatamente a `/` mediante `<meta http-equiv="refresh">` (compatible con builds estáticos sin SSR). Las rutas `/blog/[slug]` directamente no se generan (Astro devuelve 404 nativo del host).

---

## Personalizar título y subtítulo

Cada módulo acepta `title` y `subtitle` opcionales que se muestran en el encabezado de su página:

```ts
blog: {
  enabled: true,
  title: 'Nuestro Blog',
  subtitle: 'Historias, recetas y novedades de Café La Esquina.',
},
```

---

## Usar el helper `isModuleEnabled`

```ts
import { isModuleEnabled } from '@/config';

if (isModuleEnabled('blog')) {
  // lógica solo cuando el blog está activo
}
```

O en un componente Astro:

```astro
---
import { isModuleEnabled } from '@/config';
const blogEnabled = isModuleEnabled('blog');
---

{blogEnabled && <a href="/blog">Blog</a>}
```

---

## Comportamiento por módulo cuando está desactivado

| Módulo | Página desactivada | Rutas de detalle |
|---|---|---|
| FAQ | Redirige a `/` (meta refresh) | No aplica |
| Galería | Redirige a `/` (meta refresh) | No aplica |
| Blog | Redirige a `/` (meta refresh) | No se generan (getStaticPaths devuelve []) |

---

## Reemplazar datos demo por contenido real

### FAQ
Edita `src/data/faq.ts`. Cada entrada sigue la interfaz `FaqItem`:

```ts
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string; // agrupación opcional
}
```

### Galería
Edita `src/data/gallery.ts`. Reemplaza las URLs de Picsum por rutas reales (ej. `/images/galeria/foto-1.webp`). La interfaz `GalleryItem` exige `alt` para accesibilidad:

```ts
export interface GalleryItem {
  id: string;
  src: string;   // URL o ruta root-relativa
  alt: string;   // obligatorio
  caption?: string;
  category?: string;
}
```

### Blog
Edita `src/data/blog-posts.ts`. Cada artículo sigue `BlogPost`:

```ts
export interface BlogPost {
  slug: string;        // URL-safe, único (ej. 'mi-primer-articulo')
  title: string;
  summary: string;
  body: string[];      // párrafos ordenados
  publishedAt: string; // YYYY-MM-DD
  author?: string;
  tags?: string[];
}
```

El servicio `src/services/blog.ts` ordena los artículos por `publishedAt` descendente automáticamente.

---

## Añadir un módulo nuevo

1. **Tipo**: añade el ID a la unión `SecondaryModuleId` en `src/types/secondary-modules.ts`:
   ```ts
   export type SecondaryModuleId = 'faq' | 'gallery' | 'blog' | 'events';
   ```
   TypeScript forzará que agregues `events` en el objeto `secondaryModules` — no compilará si falta.

2. **Config**: añade la entrada en `src/config/secondary-modules.ts`:
   ```ts
   events: {
     enabled: false,
     title: 'Eventos',
     subtitle: 'Próximos eventos en Café La Esquina.',
   },
   ```

3. **Navegación**: añade el item en `src/config/navigation.ts`:
   ```ts
   ...(isModuleEnabled('events') ? [{ label: 'Eventos', href: '/events' }] : []),
   ```

4. **Datos, componentes y página**: sigue el mismo patrón de `faq.ts` / `FaqSection.astro` / `faq.astro`.

---

## Decisiones de diseño

- **Build-time, no runtime**: los flags se evalúan al compilar. No hay lógica condicional en el servidor ni en el cliente.
- **`Record<SecondaryModuleId, …>`**: garantiza cobertura exhaustiva — agregar un ID sin su entrada es error de TypeScript.
- **Redirección estática**: `<meta http-equiv="refresh">` funciona en sites 100% estáticos sin adaptador SSR.
- **Capa de servicio para blog**: `src/services/blog.ts` desacopla las páginas de la fuente de datos, facilitando la migración a Supabase o un CMS en el futuro.
