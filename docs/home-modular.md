# Home modular — Guía de configuración

La página principal (`src/pages/index.astro`) renderiza sus secciones de forma
completamente dinámica: lee un arreglo de configuración, filtra las secciones
habilitadas, las ordena y las despacha a través de un renderer central.
**Ningún componente aparece importado directamente en `index.astro`.**

---

## Archivos involucrados

| Archivo | Rol |
|---|---|
| `src/types/home-sections.ts` | Tipos: `HomeSectionEntry`, `HomeSectionId`, props por sección |
| `src/config/home-sections.ts` | Config: arreglo `homeSections` con orden, enabled y props |
| `src/components/sections/home-section-registry.ts` | Registro con metadatos (`implemented`, `needsRuntimeData`) |
| `src/components/sections/HomeSectionRenderer.astro` | Dispatcher: despacha la sección correcta e inyecta datos de runtime |
| `src/pages/index.astro` | Página: filtra, ordena y renderiza con `<HomeSectionRenderer>` |

---

## Cómo activar o desactivar una sección

Abre `src/config/home-sections.ts` y cambia el campo `enabled`:

```ts
{
  id: 'hours',
  enabled: false,   // ← false = oculta, true = visible
  order: 5,
  props: { title: 'Horarios' },
},
```

No hay que tocar ningún otro archivo.

---

## Cómo cambiar el orden

Modifica el campo `order` en `src/config/home-sections.ts`.
El orden es **ascendente** (1 = arriba del todo). Se permiten saltos numéricos.

```ts
// Antes: hero=1, highlights=2, hours=5
// Para subir 'hours' al segundo lugar:
{ id: 'hero',       order: 1, ... },
{ id: 'hours',      order: 2, ... },   // ← subió
{ id: 'highlights', order: 3, ... },
```

---

## Cómo agregar una nueva sección

Sigue los cuatro pasos en orden:

### 1 — Definir el tipo en `src/types/home-sections.ts`

Añade la interfaz de props y extiende la unión discriminada:

```ts
// Props de la nueva sección
export interface GallerySectionProps {
  title?: string;
  bg?:    'default' | 'surface' | 'secondary';
  size?:  'sm' | 'md' | 'lg';
}

// Añadir rama a HomeSectionEntry
export type HomeSectionEntry =
  | ...
  | (SectionBase & { id: 'gallery'; props: GallerySectionProps });
```

TypeScript exigirá que completes los pasos 2 y 3 — no compilará si no lo haces.

### 2 — Registrar en `src/components/sections/home-section-registry.ts`

```ts
export const SECTION_REGISTRY: Record<HomeSectionId, SectionMeta> = {
  ...
  gallery: {
    label: 'Galería',
    needsRuntimeData: false,
    implemented: true,        // false mientras el componente no exista
  },
};
```

### 3 — Añadir la entrada en `src/config/home-sections.ts`

```ts
{
  id: 'gallery',
  enabled: true,
  order: 4,
  props: {
    title: 'Nuestra galería',
    bg: 'surface',
    size: 'md',
  },
},
```

### 4 — Despachar en `src/components/sections/HomeSectionRenderer.astro`

Importa el componente y añade la rama de renderizado:

```astro
---
import GallerySection from './GallerySection.astro';
...
---

{!skip && section.id === 'gallery' && (
  <GallerySection {...section.props} />
)}
```

---

## Guardas de negocio

Algunas secciones tienen condiciones adicionales en el renderer (más allá de
`enabled`). Estas guardas evitan errores cuando la configuración del negocio no
cuenta con los datos necesarios:

| Sección | Guarda |
|---|---|
| `hours` | `businessConfig.openingHours.length > 0` |
| `whatsapp_cta` | `businessConfig.contact.whatsappNumber` |

Si una guarda no se cumple, la sección se omite silenciosamente aunque esté
`enabled: true`.

---

## Secciones reservadas (no implementadas)

Las siguientes secciones están tipadas y registradas, pero sus componentes
aún no existen. Figuran como `enabled: false` e `implemented: false`.
Para activarlas, completa el paso 4 y cambia ambos flags.

- `promotions`
- `testimonials`
- `location`
