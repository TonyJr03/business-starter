# Módulos — Guía de arquitectura y activación

> Sprint 9.5 · Abril 2026

El sistema usa una **arquitectura de módulos unificada**. Todos los módulos — tanto los que generan páginas como los que componen la home — viven bajo `globalConfig.modules` sin distinción entre "core" y "secundario".

---

## Tipos de módulo

### Módulos de página (`modules.pages`)

Cada ruta del sitio (excepto Home) es un módulo de página activable. Viven en `globalConfig.modules.pages` y controlan:

- Si la ruta está activa (`enabled`)
- La ruta pública (`path`)
- El label de navegación (`navLabel`)
- Textos de CTA opcionales (`cta`)
- Título y subtítulo opcionales de página (`title`, `subtitle`)

| Módulo | Ruta | Por defecto |
|--------|------|-------------|
| `catalog` | `/catalog` | `enabled: true` |
| `promotions` | `/promotions` | `enabled: true` |
| `about` | `/about` | `enabled: true` |
| `contact` | `/contact` | `enabled: true` |
| `faq` | `/faq` | `enabled: false` |
| `gallery` | `/gallery` | `enabled: false` |
| `blog` | `/blog` | `enabled: false` |

> **Home (`/`) es la única ruta fija.** No está en `modules.pages` y siempre se genera.

---

### Módulos de sección (`modules.sections`)

Bloques que componen la página de inicio. Viven en `globalConfig.modules.sections` y controlan:

- Si el bloque aparece (`enabled`)
- El orden de aparición (`order`)
- Props visuales (título, fondo, tamaño, CTAs)

| Módulo | Descripción | Por defecto |
|--------|-------------|-------------|
| `hero` | Banner principal | `enabled: true` |
| `highlights` | Propuesta de valor | `enabled: true` |
| `hours` | Horarios de atención | `enabled: true` |
| `whatsapp_cta` | CTA de WhatsApp | `enabled: true` |
| `promotions` | Bloque de ofertas | `enabled: false` |
| `testimonials` | Testimonios de clientes | `enabled: false` |
| `location` | Mapa de ubicación | `enabled: false` |

---

### Feature flags (`modules.features`)

Funcionalidades transversales sin ruta propia:

| Flag | Descripción | Por defecto |
|------|-------------|-------------|
| `cart` | Carrito de compras | `false` |
| `whatsappOrdering` | Flujo de pedido por WhatsApp | `false` |

---

## Activar un módulo de página

Edita `src/config/business-config.ts`, campo `pageModules`:

```ts
const pageModules: PageModulesConfig = {
  faq: {
    enabled:  true,           // ← cambiar a true
    path:     '/faq',
    navLabel: 'FAQ',
    title:    'Preguntas Frecuentes',
    subtitle: 'Todo lo que necesitas saber antes de visitarnos.',
    cta: {
      title:       '¿No encontraste lo que buscabas?',
      subtitle:    'Escríbenos directamente.',
      buttonLabel: 'Preguntar por WhatsApp',
      message:     `Hola ${identity.name}, tengo una pregunta.`,
    },
  },
  // ...
};
```

Al compilar, el módulo activado:
- Aparece **automáticamente** en el menú de navegación (header y footer).
- Genera su ruta estática.

Con `enabled: false`, la página muestra el componente `<ModuleDisabled />` (UI tipo 404), sin redireccionamientos.

> **Antes de activar** FAQ, galería o blog, asegúrate de que su archivo de datos tiene contenido real: `src/data/faq.ts`, `src/data/gallery.ts` o `src/data/blog-posts.ts`.

---

## Comportamiento cuando un módulo de página está desactivado

| Módulo | Comportamiento | Rutas de detalle |
|--------|---------------|-----------------|
| `catalog` | Muestra `<ModuleDisabled />` | No aplica |
| `promotions` | Muestra `<ModuleDisabled />` | No aplica |
| `about` | Muestra `<ModuleDisabled />` | No aplica |
| `contact` | Muestra `<ModuleDisabled />` | No aplica |
| `faq` | Muestra `<ModuleDisabled />` | No aplica |
| `gallery` | Muestra `<ModuleDisabled />` | No aplica |
| `blog` | Muestra `<ModuleDisabled />` | `getStaticPaths()` devuelve `[]` → 404 nativo del host |

---

## Activar un módulo de sección (home)

Las secciones de la home se configuran en `modules.sections` dentro de `business-config.ts`:

```ts
const sectionModules: SectionModuleEntry[] = [
  {
    id: 'testimonials',
    enabled: true,   // ← activar
    order: 4,
    props: {
      title: 'Lo que dicen nuestros clientes',
      bg: 'surface',
      size: 'md',
    },
  },
  // ...
];
```

> **Importante:** El componente de la sección debe estar implementado en `HomeSectionRenderer.astro`
> y registrado en `section-module-registry.ts`. Las secciones con `implemented: false` se omiten
> silenciosamente sin error.

---

## Patrón de guardia en páginas

El patrón estándar que usa cada página de módulo:

```astro
---
import { globalConfig } from '@/config';
import ModuleDisabled from '@/components/common/ModuleDisabled.astro';

const { modules } = globalConfig;
const faqModule = modules.pages.faq;
---

<MainLayout ...>
  {!faqModule.enabled ? <ModuleDisabled /> : <>
    <!-- contenido de la página -->
  </>}
</MainLayout>
```

---

## Navegación — derivada automáticamente

`src/config/navigation.ts` deriva `headerNav` y `footerNav` **100% de `modules.pages`**:

- Solo los módulos con `enabled: true` aparecen en el menú.
- El orden en el menú sigue el orden de declaración de `pageModules`.
- Home (`/`) siempre aparece primero — está fuera de `modules.pages`.

**No hay que tocar `navigation.ts`** para activar o desactivar módulos.

---

## Archivos involucrados

| Archivo | Rol |
|---------|-----|
| `src/config/business-config.ts` | `pageModules` y `sectionModules` — fuente de verdad de módulos |
| `src/types/page-modules.ts` | `PageModuleId`, `PageModuleConfig`, `PageModulesConfig` |
| `src/types/section-modules.ts` | `SectionModuleId`, `SectionModuleEntry` y props por sección |
| `src/config/navigation.ts` | Deriva `headerNav`/`footerNav` de `modules.pages` |
| `src/components/common/ModuleDisabled.astro` | UI mostrada cuando un módulo de página está desactivado |
| `src/components/sections/HomeSectionRenderer.astro` | Dispatcher de secciones de la home |
| `src/components/sections/section-module-registry.ts` | Registro de secciones implementadas |
| `src/data/faq.ts` | Preguntas/respuestas: `FaqItem[]` |
| `src/data/gallery.ts` | Imágenes: `GalleryItem[]` |
| `src/data/blog-posts.ts` | Artículos: `BlogPost[]` |
| `src/services/blog.service.ts` | `getPosts()`, `getPostBySlug()` |

---

## Añadir un módulo de página nuevo

1. **Tipo**: añade el ID a `PageModuleId` en `src/types/page-modules.ts`:
   ```ts
   export type PageModuleId = 'catalog' | 'promotions' | 'about' | 'contact' | 'faq' | 'gallery' | 'blog' | 'events';
   ```
   TypeScript forzará que la entrada exista en `pageModules` — no compilará si falta.

2. **Config**: añade la entrada en `pageModules` dentro de `business-config.ts`:
   ```ts
   events: {
     enabled: false,
     path:     '/events',
     navLabel: 'Eventos',
     title:    'Próximos eventos',
     subtitle: 'Actividades especiales en Café La Esquina.',
   },
   ```

3. **Página**: crea `src/pages/events.astro` siguiendo el patrón de guardia estándar.

4. **Datos y componentes**: sigue el mismo patrón de `faq.ts` / `FaqSection.astro` / `faq.astro`.

---

## Decisiones de diseño

- **Sin distinción "core vs secundario"**: todos los módulos de página son equivalentes. La diferencia entre unos y otros está solo en el valor por defecto de `enabled`.
- **Build-time**: los flags se evalúan al compilar. No hay lógica condicional en el servidor ni en el cliente.
- **`ModuleDisabled` en lugar de redirect**: las páginas desactivadas muestran un componente de UI consistente, sin `<meta http-equiv="refresh">`. Compatible con builds 100% estáticos.
- **Exhaustividad TypeScript**: `PageModulesConfig = Record<PageModuleId, PageModuleConfig>` garantiza que agregar un ID sin su entrada produce error de compilación.
- **Validación de arranque**: `assertValidBusinessConfig(globalConfig)` se ejecuta al cargar `business-config.ts`; el build falla inmediatamente con errores claros si la config está mal formada.
