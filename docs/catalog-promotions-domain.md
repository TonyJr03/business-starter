# Dominio: Catálogo y Promociones

Contrato tipado del dominio de catálogo y promociones del proyecto **business-starter**.
Este documento refleja el estado actual de los tipos definidos en `src/types/` y los
servicios en `src/services/`.

---

## Entidades

### `Money`

Valor monetario con divisa explícita. Campo canónico de precio — reemplaza `price: number`.

```ts
interface Money {
  amount:   number;  // ej. 25.00
  currency: string;  // ISO 4217 — ej. 'CUP', 'USD', 'EUR'
}
```

| Campo      | Requerido | Notas                            |
|------------|:---------:|----------------------------------|
| `amount`   | ✓         | Número positivo                  |
| `currency` | ✓         | Código ISO 4217 de 3 letras      |

---

### `Category`

Agrupa productos bajo un criterio común (sección de menú, tipo de servicio, etc.).

```ts
interface Category {
  id:          string;   // 'cat-1'
  name:        string;   // 'Cafés'
  slug:        string;   // 'cafes'  →  /catalog#cafes
  description?: string;
  imageUrl?:   string;
  sortOrder?:  number;   // ausente → 0 (al final)
  isActive?:   boolean;  // ausente → true
}
```

**Reglas de dominio:**
- `isActive` ausente se interpreta como `true` — una categoría nueva es visible por defecto.
- `sortOrder` ausente equivale a `0` en los servicios.
- El `slug` se usa como ancla de URL (`/catalog#cafes`) y como parámetro de filtro.

---

### `Product`

Ítem individual del catálogo: plato, bebida, servicio, artículo, etc.

```ts
interface Product {
  // ── Campos mínimos ──────────────────────────────────────────────────────
  id:          string;       // 'prod-1'
  categoryId:  string;       // → Category.id
  name:        string;       // 'Café Cubano'
  slug:        string;       // 'cafe-cubano'
  description: string;
  money:       Money;        // precio canónico con divisa

  // ── Campos opcionales ────────────────────────────────────────────────
  imageUrl?:   string;
  gallery?:    string[];
  tags?:       ProductTag[];
  badge?:      ProductBadge; // 'new' | 'popular' | 'offer'
  variants?:   ProductVariant[];
  isAvailable?: boolean;     // ausente → true
  isFeatured?:  boolean;     // ausente → false
  sortOrder?:   number;      // ausente → 0
}
```

**Reglas de dominio:**
- `isAvailable` ausente se interpreta como `true`. Usar siempre `isProductAvailable(product)` del servicio para evitar errores de `!undefined`.
- `isFeatured` ausente es `false`. Los destacados aparecen en la sección hero del catálogo.
- Un producto no disponible muestra badge "Agotado", precio atenuado y sin CTA.

---

### `ProductTag`

Etiqueta personalizable para clasificar productos con criterios propios del negocio.

```ts
interface ProductTag {
  id:     string;   // identificador único
  label:  string;   // 'Vegano', 'Sin gluten', 'Especial temporada'
  color?: string;   // color CSS opcional — ej. '#4ade80'
}
```

---

### `ProductVariant`

Presentación alternativa del mismo producto (tamaño, volumen, sabor).

```ts
interface ProductVariant {
  id:              string;
  name:            string;   // 'Grande', '500 ml', 'Sin azúcar'
  price?:          Money;    // precio absoluto → ignora priceModifier
  priceModifier?:  number;   // recargo (+) o descuento (-) relativo al base
  isAvailable:     boolean;
  sortOrder?:      number;
}
```

**Prioridad de precio:** `price` (absoluto) tiene precedencia sobre `priceModifier`.

---

### `Promotion`

Oferta especial, campaña de descuento o bundle del negocio.

```ts
interface Promotion {
  // ── Campos mínimos ──────────────────────────────────────────────────────
  id:          string;
  title:       string;       // 'Desayuno Completo'
  description: string;

  // ── Campos opcionales ────────────────────────────────────────────────
  imageUrl?:      string;
  discountLabel?: string;    // '20% OFF', '2×1', 'Combo'
  status?:        PromotionStatus;
  isActive?:      boolean;   // campo heredado — ver retrocompat
  startsAt?:      string;    // ISO 8601 — '2026-04-01'
  endsAt?:        string;    // ISO 8601 — '2026-04-30'
  rules?:         PromotionRule[];
  productIds?:    string[];  // → Product.id[]
  categoryIds?:   string[];  // → Category.id[]
  sortOrder?:     number;
}
```

---

### `PromotionRule`

Define la condición de activación y el tipo de beneficio.

```ts
interface PromotionRule {
  type:         DiscountType;
  value?:       number;      // 0–100 para 'percentage'; monto para 'fixed'
  minItems?:    number;      // cantidad mínima para activar
  productIds?:  string[];
  categoryIds?: string[];
  maxUses?:     number;      // límite de usos totales
  description?: string;      // texto legible
}

type DiscountType = 'percentage' | 'fixed' | 'bogo' | 'combo' | 'custom';
```

| Tipo         | `value`     | Descripción                                     |
|--------------|:-----------:|-------------------------------------------------|
| `percentage` | 0 – 100     | Descuento porcentual sobre el precio base       |
| `fixed`      | monto       | Descuento en monto fijo (en divisa del negocio) |
| `bogo`       | —           | Compra uno y lleva otro                         |
| `combo`      | —           | Precio especial por conjunto de productos       |
| `custom`     | —           | Lógica propia; descripción en `description`     |

---

## Estados de promoción

### `PromotionStatus`

```ts
type PromotionStatus = 'upcoming' | 'active' | 'expired' | 'paused';
```

| Estado     | Badge UI         | Contenido atenuado | CTA activo | Descripción                              |
|------------|:----------------:|:------------------:|:----------:|------------------------------------------|
| `active`   | success · Vigente    | no             | sí         | En curso, dentro del rango de fechas     |
| `upcoming` | info · Próximamente  | no             | no         | Aún no comenzó (`startsAt` en el futuro) |
| `paused`   | warning · En pausa   | sí             | no         | Temporalmente suspendida                 |
| `expired`  | default · Finalizada | sí             | no         | Fuera de rango o explícitamente cerrada  |

### Algoritmo de resolución (`getPromotionStatus`)

Ubicación: `src/services/promotions.service.ts`

```
1. Si promotion.status está definido → se usa directamente (prioridad máxima)
2. Si startsAt > hoy               → 'upcoming'
3. Si endsAt < hoy                 → 'expired'
4. Si isActive === false            → 'paused'  (retrocompat)
5. Default                         → 'active'
```

La comprobación de fechas normaliza a inicio del día UTC para evitar desfases de zona horaria.

---

## Reglas de dominio del catálogo

### Disponibilidad de producto

```ts
// ✓ Correcto
import { isProductAvailable } from '@/services/catalog.service';
const available = isProductAvailable(product); // isAvailable ?? true

// ✗ Evitar — bug si isAvailable es undefined
const available = !product.isAvailable; // !undefined === true → falso positivo
```

### Destacados

Un producto aparece en la sección “Destacados” del catálogo si `isFeatured === true` **y** `isAvailable !== false`. El servicio `getFeaturedProducts()` aplica ambos filtros.

### Vigencia de promoción

```ts
import { isPromotionActive } from '@/services/promotions.service';
// Guard rápido — no necesita el tipo PromotionStatus
if (isPromotionActive(promo)) { ... }
```

---

## Relaciones entre entidades

```
Category 1 ──────────── * Product
     id ──────────────── categoryId

Promotion * ──────────── * Product      (via Promotion.productIds[])
Promotion * ──────────── * Category     (via Promotion.categoryIds[])
PromotionRule * ──────── * Product      (via PromotionRule.productIds[])
PromotionRule * ──────── * Category     (via PromotionRule.categoryIds[])
Product 1 ──────────── * ProductVariant
```

Las relaciones son por referencia de ID — no hay joins en el modelo local.
Al migrar a Supabase se traducen a foreign keys o tablas de unión.

---

## Servicios disponibles

### `src/services/catalog.service.ts`

| Función                              | Retorno              | Descripción                              |
|--------------------------------------|----------------------|------------------------------------------|
| `getCategories()`                    | `Category[]`         | Activas, ordenadas por sortOrder         |
| `getProducts(filters?)`              | `Product[]`          | Con filtros `ProductFilters`             |
| `getFeaturedProducts()`              | `Product[]`          | Disponibles + destacados                 |
| `getProductsByCategory(categoryId)`  | `Product[]`          | Disponibles de una categoría             |
| `getProductBySlug(slug)`             | `Product \| undefined` | Búsqueda por slug                      |
| `isProductAvailable(product)`        | `boolean`            | Regla: `isAvailable ?? true`             |

```ts
interface ProductFilters {
  categoryId?:    string;
  onlyAvailable?: boolean;  // por defecto: true
  onlyFeatured?:  boolean;
}
```

### `src/services/promotions.service.ts`

| Función                              | Retorno                | Descripción                              |
|--------------------------------------|------------------------|------------------------------------------|
| `getPromotions()`                    | `Promotion[]`          | Todas, sin filtrar                       |
| `getActivePromotions(now?)`          | `Promotion[]`          | Solo estado `'active'`                   |
| `getPromotionById(id)`               | `Promotion \| undefined` | Búsqueda por id                        |
| `getPromotionStatus(promotion, now?)`| `PromotionStatus`      | Resuelve estado de ciclo de vida         |
| `isPromotionActive(promotion, now?)` | `boolean`              | Guard rápido de vigencia                 |

---

## Guía de extensión para otros tipos de negocio

El naming del dominio es **intencionalmente neutral**: `Category`, `Product`, `Promotion`
funcionan igual para una cafetería, una tienda de ropa, un taller mecánico o un estudio
de tatuajes. Para adaptar:

### 1. Cambiar el vocabulario sin tocar el tipo

Renombrar en la UI (componentes, i18n), no en los tipos TypeScript:

| Negocio          | `Category`   | `Product`    |
|------------------|--------------|--------------|
| Restaurante       | Sección      | Plato        |
| Tienda de ropa    | Colección    | Artículo     |
| Estudio de tatuajes | Estilo    | Diseño       |
| Taller mecánico   | Servicio     | Trabajo      |

### 2. Añadir campos de industria sin romper el contrato

Extender mediante `tags?: ProductTag[]` para metadatos semánticos sin tocar el tipo base:

```ts
// Restaurante
tags: [{ id: 'vegan', label: 'Vegano' }, { id: 'spicy', label: 'Picante' }]

// Tienda de ropa
tags: [{ id: 'size-M', label: 'Talla M' }, { id: 'cotton', label: '100% algodón' }]
```

### 3. Variantes para SKUs múltiples

```ts
// Cafetería — tamaños
variants: [
  { id: 'v-small',  name: 'Pequeño', price: { amount: 25, currency: 'CUP' }, isAvailable: true },
  { id: 'v-large',  name: 'Grande',  price: { amount: 40, currency: 'CUP' }, isAvailable: true },
]

// Tienda de ropa — tallas
variants: [
  { id: 'v-S', name: 'S', isAvailable: true },
  { id: 'v-M', name: 'M', isAvailable: true },
  { id: 'v-L', name: 'L', isAvailable: false },
]
```

### 4. Extender `DiscountType` para reglas de negocio propias

Usando `'custom'` con `description` detallada mientras no se necesita lógica automática:

```ts
rules: [{
  type: 'custom',
  description: 'Descuento del 15% para clientes con tarjeta de fidelización.',
}]
```

Cuando la lógica se vuelva recurrente, añadir un nuevo valor a `DiscountType` y
un handler en el servicio.

### 5. Migrar a Supabase sin romper páginas

Las firmas de los servicios son el contrato estable. Para migrar:

```ts
// catalog.service.ts — solo cambia el cuerpo
export async function getCategories(): Promise<Category[]> {
  // Antes:
  // return categories.filter(...).sort(...);

  // Después:
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  return data ?? [];
}
```

Las páginas (`catalog.astro`, `promotions.astro`) no necesitan ningún cambio.

---

## Ejemplos rápidos

### Producto mínimo válido

```ts
const product: Product = {
  id: 'prod-99',
  categoryId: 'cat-1',
  name: 'Café Negro',
  slug: 'cafe-negro',
  description: 'El clásico.',
  money: { amount: 20, currency: 'CUP' },
};
// isAvailable → true (ausente = disponible)
// isFeatured  → false (ausente = no destacado)
```

### Producto con todas las opciones

```ts
const product: Product = {
  id: 'prod-99',
  categoryId: 'cat-1',
  name: 'Café Especial',
  slug: 'cafe-especial',
  description: 'Blend exclusivo de la casa.',
  money: { amount: 60, currency: 'CUP' },
  imageUrl: '/images/cafe-especial.webp',
  badge: 'new',
  tags: [{ id: 'organic', label: 'Orgánico', color: '#4ade80' }],
  variants: [
    { id: 'v-solo',   name: 'Solo',        isAvailable: true,  sortOrder: 1 },
    { id: 'v-doble',  name: 'Doble',       isAvailable: true,  priceModifier: 15, sortOrder: 2 },
    { id: 'v-cortado', name: 'Con leche',  isAvailable: false, sortOrder: 3 },
  ],
  isAvailable: true,
  isFeatured: true,
  sortOrder: 1,
};
```

### Promoción con estado automático por fechas

```ts
const promo: Promotion = {
  id: 'promo-99',
  title: 'Semana del Café',
  description: 'Todos los cafés a mitad de precio.',
  discountLabel: '50% OFF',
  // sin status explícito → se deriva de las fechas
  startsAt: '2026-05-01',
  endsAt: '2026-05-07',
  categoryIds: ['cat-1'],
  rules: [{ type: 'percentage', value: 50, categoryIds: ['cat-1'] }],
};

// Hoy: 2026-04-12 → 'upcoming'
// Hoy: 2026-05-03 → 'active'
// Hoy: 2026-05-10 → 'expired'
```

### Promoción con estado explícito

```ts
const promo: Promotion = {
  id: 'promo-100',
  title: 'Oferta Suspendida',
  description: 'Temporalmente fuera de servicio.',
  status: 'paused', // prioridad sobre startsAt/endsAt
  startsAt: '2026-04-01',
  endsAt: '2026-04-30',
};
```

### Consultar desde una página Astro

```ts
import { getCategories, getProducts, isProductAvailable } from '@/services/catalog.service';
import { getActivePromotions, getPromotionStatus } from '@/services/promotions.service';

// Catálogo completo (incluye no-disponibles para mostrar badge Agotado)
const categories = await getCategories();
const allProducts = await getProducts({ onlyAvailable: false });

// Solo destacados disponibles
const featured = await getFeaturedProducts();

// Promociones activas ahora mismo
const activePromos = await getActivePromotions();

// Estado individual
const status = getPromotionStatus(promo); // 'active' | 'upcoming' | 'paused' | 'expired'
```
