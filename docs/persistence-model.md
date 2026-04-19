# Modelo de persistencia — Estado híbrido actual

Documento que mapea dónde vive cada tipo de dato y cómo fluye entre capas durante el desarrollo.

---

## Panorama general

El proyecto está en **transición gradual hacia Supabase**. Algunos datos ya se leen de BD, otros permanecen en config estática, y el fallback local permite desarrollo sin conexión.

```
┌─────────────────────────────────────────────────────────────┐
│ Página (pages/*.astro)                                      │
│ - Llama servicios: getCategories(), getProducts(), etc.     │
└──────────────────┬──────────────────────────────────────────┘
                   │
        ┌──────────▼──────────┐
        │ Servicios           │
        │ (services/*.ts)     │
        │ - Supabase-first    │
        │ - Fallback local    │
        └──────────┬───┬──────┘
                   │   │
      ┌────────────┘   └────────────────┐
      │                                 │
┌─────▼──────────┐                ┌─────▼────────────┐
│ Supabase BD    │                │ Datos locales    │
│ (Si env OK)    │                │ (src/data/*)     │
│                │                │ (Si env vacío o  │
│ - businesses   │                │  error de red)   │
│ - categories   │                │                  │
│ - products     │                │ - categories.ts  │
│ - promotions   │                │ - products.ts    │
│                │                │ - promotions.ts  │
└────────────────┘                └──────────────────┘

        ↑                                    ↑
    Leer: Migración 20260419000000_initial_schema.sql
    Seed: supabase/seed.sql (10 productos, 4 promos, 3 categorías)
```

---

## Entidades en Supabase (BD)

### `businesses`
- **Propósito:** Raíz del negocio multitenancy
- **Datos:** ID, slug (`cafe-la-esquina`), nombre, timestamps
- **Status:** 🟢 Totalmente en BD
- **Lectura:** `getSupabaseClient()` → `from('businesses').select()`
- **Fallback:** Existe mock en `src/data/` pero servicios no lo consultan hoy

### `categories`
- **Propósito:** Estructura del menú de productos
- **Datos:** ID, business_id (FK), slug, name, description, image_url, is_active, sort_order
- **Status:** 🟢 Totalmente en BD
- **Lectura:** `src/services/catalog.service.ts` → `getCategories()`
- **Seed:** 3 categorías (Cafés, Bebidas Frías, Bocados)
- **Fallback:** `src/data/categories.ts` (11 categorías de prueba)

### `products`
- **Propósito:** Items vendibles del catálogo
- **Datos:** ID, category_id (FK), slug, name, money (amount + currency), badge ('new'|'popular'), tags[], image_url, is_available, is_featured, sort_order
- **Status:** 🟢 Totalmente en BD
- **Lectura:** `src/services/catalog.service.ts` → `getProducts()`, `getProductBySlug()`, etc.
- **Seed:** 10 productos con badges (Café Cubano, Pastelito, Espresso, etc.)
- **Fallback:** `src/data/products.ts` (18 productos variados)

### `promotions`
- **Propósito:** Descuentos y ofertas temporales
- **Datos:** ID, title, description, status ('active'|'upcoming'|'expired'|'paused'), discount_label, starts_at, ends_at, rules (JSONB: tipo, %, productos), product_ids (JSONB array), category_ids (JSONB array), sort_order
- **Status:** 🟢 Totalmente en BD
- **Lectura:** `src/services/promotions.service.ts` → `getPromotions()`, `getActivePromotions()`, etc.
- **Seed:** 4 promociones con tipos (percentage, combo, bogo) y diferentes estados
- **Fallback:** `src/data/promotions.ts` (3 promociones)

---

## Datos en Config (estática, compilada)

### `src/config/business-config.ts`
- **Propósito:** Configuración inmutable del negocio
- **Datos:** nombre, email, teléfono, dirección, redes sociales, horarios de apertura
- **Status:** 🟡 Estática — compilada en build
- **Uso:** Páginas (contacto, footer), servicios de WhatsApp
- **Migración futura:** Podría ir a BD cuando haya panel de admin

Ejemplo:
```typescript
export const businessConfig = {
  name: 'Café La Esquina',
  phone: '+1-234-567-8900',
  email: 'contact@example.com',
  hours: { lunes: '8:00 - 20:00', ... }
};
```

### `src/config/navigation.ts`
- **Propósito:** Estructura de menús, breadcrumbs, rutas
- **Datos:** Links, labels, orden
- **Status:** 🟡 Estática — definida en TypeScript
- **Uso:** Header, Footer, navegación
- **Nota:** Podría linkedarse dinámicamente a categorías de BD en futuro

---

## Datos en Fallback Local (src/data/*)

Existen para dos propósitos:

1. **Desarrollo sin Supabase:** Si las env vars `PUBLIC_SUPABASE_*` no están definidas
2. **Testing & Mock:** Datos predefinidos para escribir tests

### `src/data/categories.ts`
- **11 categorías** variadas (Cafés, Bebidas, Snacks, Postres, Bebidas Alcohólicas, etc.)
- **Cada una con slug, descripción, imagen**
- **Fallback para:** `getCategories()`

### `src/data/products.ts`
- **18 productos** agrupados por categoría
- **Con precios, badges, tags, disponibilidad**
- **Fallback para:** `getProducts()`, `getProductBySlug()`, etc.

### `src/data/promotions.ts`
- **3 promociones** con diferentes estados y tipos
- **Fallback para:** `getPromotions()`, `getActivePromotions()`, etc.

### `src/data/blog-posts.ts`, `testimonials.ts`, etc.
- **Datos de demo** para secciones homepages
- **No tienen equivalente en BD aún**
- **Siempre usados** (no hay servicio Supabase para ellos)

---

## Cómo funciona el fallback

### Caso 1: Supabase levantado + env vars OK

```
1. App inicia, .env tiene PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_PUBLISHABLE_KEY
2. hasSupabaseEnv() → true
3. getSupabaseClient() → crea cliente Supabase
4. Página llama getProducts()
5. catalog.service.ts llama fetchProductsFromDB()
6. Consulta FROM products
7. Si OK → devuelve datos de BD ✅
8. Si error → devuelve null
9. getProducts() recibe null → fallback: return localProducts
```

### Caso 2: Desarrollo local sin Supabase

```
1. App inicia, .env está vacío (sin PUBLIC_SUPABASE_*)
2. hasSupabaseEnv() → false
3. getSupabaseClient() → devuelve null inmediatamente
4. fetchProductsFromDB() recibe null → return null directamente
5. getProducts() → fallback: return localProducts ✅
6. App funciona con datos mock, sin Docker, sin network
```

### Caso 3: Red caída o DB no accesible

```
1. App inicia OK (env vars seteadas)
2. getSupabaseClient() → cliente creado OK
3. fetchProductsFromDB() → intenta consulta
4. Error de conexión / timeout
5. Catch error → console.warn() en DEV, return null
6. getProducts() → fallback: return localProducts ✅
7. App sigue funcionando con datos viejos
```

---

## Estrategia de sincronización ID

**Problema actual:** Los IDs del fallback (`src/data/`) no coinciden con los UUIDs de BD.

```
BD:        "30000000-0000-0000-0000-000000000001" (Café Cubano)
Fallback:  "prod-1" (Café Cubano)
```

**Por qué:** Intentar mantener sincronización manual es propenso a errores.

**Solución actual:** Aceptada la divergencia — los espacios nunca se mezclan porque:
- Supabase-first siempre gana (si está disponible)
- El fallback es para desarrollo sin BD, no para tests de integración

**Migración futura (Sprint N):**
- Generar `src/data/` automáticamente desde snapshot de BD
- O usar UUIDs reales en el fallback (perder legibilidad pero ganar coherencia)

---

## Qué se migrará en siguientes sprints

### Sprint 11: Carrito de compras (📝 futuro)
- **Hoy:** Datos del carrito en cliente (localStorage)
- **Mañana:** Tabla `shopping_carts(id UUID, business_id FK, items JSONB, user_id?, created_at, updated_at)`
- **Decisión:** ¿Persistencia anónima o requiere usuario?

### Sprint 12: Órdenes / Pedidos (📝 futuro)
- **Nueva tabla:** `orders(id, business_id FK, items JSONB, total, status, created_at)`
- **Relaciones:** Versionar promociones aplicadas en el JSON del pedido
- **Status:** Flujo de estado order_pending → processing → ready → completed

### Sprint 13: Usuarios & Autenticación (📝 futuro)
- **Nueva tabla:** `users(id, business_id FK, email, phone, name, created_at)`
- **Cambios:** Carrito + órdenes linkedadas a user_id
- **SSO?:** Integración Supabase Auth

### Sprint 14: Analytics (📝 futuro)
- **Nueva tabla:** `events(id, business_id FK, type, payload JSONB, created_at)`
- **Eventos:** page_view, product_view, add_to_cart, checkout_started, order_placed
- **Queries:** Reportes de tendencias, productos populares, conversión

### Sprint 15: Admin Panel (📝 futuro)
- **CRUD:** Editar businesses, categories, products, promotions en BD
- **Depende de:** Usuarios + autenticación (Sprint 13)
- **UI:** Admin pages con forms, eliminará necesidad de migraciones manuales

---

## Cómo verificar qué fuente está activa

### Opción 1: Ver logs en dev

Usa navegador DevTools Console mientras carga la app:

```
[supabase] env present: true  ← Supabase detectado
```

### Opción 2: Editar en dashboard Supabase

Si tienes Supabase levantado localmente:

```bash
npx supabase start
# Abre http://127.0.0.1:54323 (dashboard)
# Edita un producto en la tabla `products`
# Recarga la página en la app
# Si ves el cambio → data viene de Supabase ✅
```

### Opción 3: Revisar XHR en Network

DevTools → Network → Filter: "supabase" o "from=products"
- Si ves requests POST a `http://127.0.0.1:54321/rest/v1/...` → BD local
- Si no ves nada → fallback local

---

## Resumen de estado

| Dato | Ubicación | Status | Fallback |
|---|---|---|---|
| **businesses** | Supabase BD | 🟢 Versionado | Mínimo local |
| **categories** | Supabase BD | 🟢 Versionado | 11 items en src/data |
| **products** | Supabase BD | 🟢 Versionado + seed | 18 items en src/data |
| **promotions** | Supabase BD | 🟢 Versionado + seed | 3 items en src/data |
| **business config** | src/config/ | 🟡 Estática compilada | N/A |
| **navigation** | src/config/ | 🟡 Estática compilada | N/A |
| **blog posts** | src/data/ | 🔴 Mock puro | No hay BD aún |
| **testimonials** | src/data/ | 🔴 Mock puro | No hay BD aún |
| **gallery** | src/data/ | 🔴 Mock puro | No hay BD aún |
| **carrito** | localStorage (cliente) | 🔴 Temporal | Sprint 11 |
| **órdenes** | — | ⚪ Pendiente | Sprint 12 |

---

## Referencias

- [Supabase local setup](supabase-setup.md) — Cómo levantar BD local y aplicar migraciones
- [Architecture](architecture.md) — Diagrama de capas y patrones
- [Services](../src/services/) — Código de los servicios con fallback implementado
