# Panel Administrativo CRUD — Sprint 13

Documentación operativa del panel administrativo para gestionar contenido del negocio. Implementado en Astro con Supabase, sin dependencias de componentes UI complejos ni uploads de archivos.

## Resumen

El panel admin permite gestionar de forma básica y funcional:

- **Categorías** de productos (crear, editar, eliminar)
- **Productos** con precios y atributos simples (crear, editar, eliminar)
- **Promociones** con reglas simples de descuento (crear, editar, eliminar)
- **Ajustes del negocio**: contacto, ubicación, redes sociales (editar solo)

**Versión**: Sprint 13 (básico y funcional)  
**Migración**: Completamente movible a Next.js en Sprint 14+  
**Autenticación**: Supabase Auth (email/password)

---

## Rutas del Panel

### Dashboard y Navegación

| Ruta | Descripción |
|---|---|
| `/admin` | Dashboard (acceso rápido a secciones) |
| `/admin/login` | Login (email/password, Supabase) |
| `/admin/logout` | Cierra sesión |

### Catálogo

| Ruta | Acción | Método |
|---|---|---|
| `/admin/catalog` | Hub: acceso a categorías y productos | GET |
| `/admin/catalog/categories` | Listar categorías | GET |
| `/admin/catalog/categories/new` | Crear categoría | GET/POST |
| `/admin/catalog/categories/:id` | Editar/eliminar categoría | GET/POST |
| `/admin/catalog/products` | Listar productos | GET |
| `/admin/catalog/products/new` | Crear producto | GET/POST |
| `/admin/catalog/products/:id` | Editar/eliminar producto | GET/POST |

### Promociones

| Ruta | Acción | Método |
|---|---|---|
| `/admin/promotions` | Listar promociones | GET |
| `/admin/promotions/new` | Crear promoción | GET/POST |
| `/admin/promotions/:id` | Editar/eliminar promoción | GET/POST |

### Ajustes

| Ruta | Acción | Método |
|---|---|---|
| `/admin/settings` | Editar ajustes del negocio | GET/POST |

---

## Funcionalidades por Sección

### 1. Categorías

**GET `/admin/catalog/categories`** — Listar
- Tabla con nombre, slug, descripción, orden, estado activo
- Badges de estado (Activa / Inactiva)
- Enlaces para editar
- Feedback: `?created=1`, `?updated=1`, `?deleted=1`

**GET/POST `/admin/catalog/categories/new`** — Crear
- Campos: nombre (obligatorio), descripción, orden, ¿Activa?
- Validaciones: nombre único (slug), máx 100 caracteres
- Slug: auto-generado desde el nombre
- Al guardar → redirige a listado con `?created=1`

**GET/POST `/admin/catalog/categories/:id`** — Editar/Eliminar
- Pre-poblado con datos actuales
- Slug mostrado como readonly
- Botón "Guardar cambios" → `?updated=1`
- Zona de peligro: botón "Eliminar" → confirma y redirige con `?deleted=1`
- Restricción: no se puede eliminar si tiene productos asociados (mensaje claro)

**Limitaciones**:
- Sin soporte para subir imágenes de categoría (S14+)
- Sin búsqueda ni paginación
- Sin drag & drop para reordenar

---

### 2. Productos

**GET `/admin/catalog/products`** — Listar
- Tabla: nombre, categoría (JOIN), precio + divisa, estado, featured, orden
- Badges para estado (Disponible/Agotado) y featured
- Enlaces para editar
- Feedback: `?created=1`, `?updated=1`, `?deleted=1`

**GET/POST `/admin/catalog/products/new`** — Crear
- Campos:
  - Nombre (obligatorio, máx 200 caracteres)
  - Descripción (máx 1000 caracteres)
  - Categoría (select con categorías activas del negocio)
  - Precio (número ≥ 0)
  - Divisa (default: CUP, 3 caracteres)
  - ¿Disponible? (checkbox)
  - ¿Destacado? (checkbox)
  - Badge: New / Popular / Offer (opcional)
  - Orden (número ≥ 0)
- Validaciones Zod: categoria UUID válido, precio ≥ 0
- Validación: categoría debe existir y pertenecer al negocio
- Slug: auto-generado desde el nombre
- Al guardar → redirige con `?created=1`
- Requerimiento: debe existir al menos una categoría activa para crear

**GET/POST `/admin/catalog/products/:id`** — Editar/Eliminar
- Pre-poblado con datos actuales
- Slug mostrado como readonly
- Cambio de categoría validado (debe existir en el negocio)
- Botón "Guardar cambios" → `?updated=1`
- Zona de peligro: botón "Eliminar" → confirma y redirige con `?deleted=1`

**Limitaciones**:
- Sin soporte para subir imágenes o galería (S14+)
- Sin tags editables (quedan en null, S14+)
- Sin variantes
- Sin búsqueda ni paginación

---

### 3. Promociones

**GET `/admin/promotions`** — Listar
- Tabla: título, descripción breve, estado (badge coloreado), etiqueta descuento, fechas, orden
- Badges de estado:
  - **Activa** (verde): `status = 'active'`
  - **Próxima** (azul): `status = 'upcoming'`
  - **Pausada** (gris): `status = 'paused'`
  - **Expirada** (rojo): `status = 'expired'`
- Fechas formateadas (YYYY-MM-DD HH:mm)
- Enlaces para editar
- Feedback: `?created=1`, `?updated=1`, `?deleted=1`

**GET/POST `/admin/promotions/new`** — Crear
- Campos:
  - Título (obligatorio, máx 200 caracteres)
  - Descripción (máx 1000 caracteres)
  - Estado: active / upcoming / paused / expired (default: active)
  - Etiqueta descuento (máx 50 caracteres, ej. "20% OFF")
  - Fecha de inicio (datetime-local, opcional)
  - Fecha de fin (datetime-local, opcional)
  - Orden (número ≥ 0)
  - **Regla de descuento** (fieldset, opcional):
    - Tipo: percentage / fixed / bogo / combo / custom (default: sin regla)
    - Valor: número (relevante solo para % y monto fijo)
    - Descripción: texto libre (ej. "20% en el segundo café")
- Validaciones Zod:
  - Título obligatorio
  - Si ambas fechas presentes: `startsAt < endsAt`
- Al guardar → redirige con `?created=1`

**GET/POST `/admin/promotions/:id`** — Editar/Eliminar
- Pre-poblado con datos actuales
- Regla existente (si hay): popula desde `rules[0]`
- Botón "Guardar cambios" → `?updated=1`
- Zona de peligro: botón "Eliminar" → confirma y redirige con `?deleted=1`

**Limitaciones**:
- Una sola regla por promoción (S13). Múltiples reglas: S14+
- Sin soporte para vincular productos/categorías específicas (S14+)
- Sin imágenes de promoción
- Sin búsqueda ni paginación
- Sin validación de fechas contra "ahora" (clock skew)

---

### 4. Ajustes del Negocio

**GET/POST `/admin/settings`** — Editar
- Página única (no hay listado)
- Secciones:
  1. **Información general**
     - Nombre (obligatorio, máx 200 caracteres)
     - Descripción breve (máx 300 caracteres)
  2. **Contacto**
     - WhatsApp (máx 30 caracteres)
     - Teléfono (máx 30 caracteres)
     - Email (validación email si presente)
  3. **Ubicación**
     - Dirección (máx 300 caracteres)
     - Ciudad (máx 100 caracteres)
     - País (máx 100 caracteres)
  4. **Redes sociales**
     - Instagram, Facebook, Telegram, Twitter/X, YouTube (máx 200 caracteres cada una)

- Validaciones:
  - Nombre es obligatorio
  - Email: validación de formato si tiene valor
  - Campos con string vacío → null en BD
- Cargas desde DB (fallback a globalConfig si no hay data)
- Al guardar → redirige con `?updated=1`

**Limitaciones**:
- `hours` (horarios) no editables (S14+)
- `slug` no editable (cambiaría URLs)
- No se editan branding, módulos ni navegación (gestionados por código)

---

## Seguridad

### Autenticación
- Middleware `/admin/*` requiere sesión activa
- Sin sesión → redirige a `/admin/login`
- `requireAdmin()` valida usuario + negocio en cada página SSR

### Aislamiento de Datos (RLS)
- Todas las operaciones incluyen `.eq('business_id', ctx.businessId)`
- Un usuario NO puede editar/eliminar data de otro negocio
- Supabase RLS enfuerza esto en la BD

### Validación
- **Zod** valida tipos, rangos, formatos (email, URL, etc.)
- **Referencias**: `createProduct()` valida que categoría existe
- **Fechas**: `promotionCreateSchema` valida `startsAt < endsAt`
- **Errores**: mensajes amigables sin exponer detalles de BD

### Errores Amigables
Todas las mutaciones devuelven mensajes genéricos:
- "No se pudo crear la categoría. Por favor, intenta de nuevo."
- "La categoría seleccionada no existe." (para referencias inválidas)
- "No se puede eliminar: la categoría tiene productos asociados." (FK constraints)

---

## Cómo Probar Manualmente

### Preparativos
1. Base de datos Supabase con tablas de negocio (ver `supabase/migrations/`)
2. Usuario autenticado en Supabase Auth
3. Aplicación corriendo: `npm run dev` (Astro + Node adapter)

### Test: Crear Categoría

```bash
# 1. Navega a /admin/catalog/categories/new
# 2. Rellena:
#    - Nombre: "Bebidas Calientes"
#    - Descripción: "Café, té y chocolate"
#    - Orden: 1
#    - ¿Activa?: checked
# 3. Haz clic en "Crear categoría"
# 4. Verifica:
#    - Redirige a /admin/catalog/categories?created=1
#    - Banner verde: "Categoría creada exitosamente"
#    - Nueva categoría aparece en la tabla
#    - Slug: "bebidas-calientes" (auto-generado)
```

### Test: Crear Producto

```bash
# 1. Navega a /admin/catalog/products/new
# 2. Rellena:
#    - Nombre: "Café Espresso Doble"
#    - Descripción: "Doble espresso, intenso y equilibrado"
#    - Categoría: "Bebidas Calientes" (selector)
#    - Precio: 5.50
#    - Divisa: CUP
#    - ¿Disponible?: checked
#    - ¿Destacado?: checked
#    - Badge: "popular"
#    - Orden: 1
# 3. Haz clic en "Crear producto"
# 4. Verifica:
#    - Redirige a /admin/catalog/products?created=1
#    - Nuevo producto en tabla con categoría enlazada
#    - Slug: "cafe-espresso-doble"
```

### Test: Editar Producto

```bash
# 1. En /admin/catalog/products, haz clic en el producto
# 2. Cambia: Nombre → "Café Espresso Premium"
# 3. Guarda
# 4. Verifica:
#    - Redirige con ?updated=1
#    - Slug NO cambió (sigue siendo "cafe-espresso-doble")
#    - Nombre actualizado en la tabla
```

### Test: Validaciones

```bash
# Prueba 1: Categoría con nombre duplicado
# 1. Intenta crear otra "Bebidas Calientes"
# 2. Error esperado: "Ya existe una categoría con ese nombre." (en campo nombre)

# Prueba 2: Producto sin categoría
# 1. Intenta crear producto sin seleccionar categoría
# 2. Error esperado: validación Zod mostrará error

# Prueba 3: Categoría sin activas
# 1. Desactiva todas las categorías
# 2. Intenta crear producto
# 3. Botón "Crear producto" aparece deshabilitado

# Prueba 4: Eliminar categoría con productos
# 1. Crea producto en categoría
# 2. Intenta eliminar la categoría
# 3. Error esperado: "No se puede eliminar: la categoría tiene productos asociados."
```

### Test: Promociones

```bash
# 1. Navega a /admin/promotions/new
# 2. Rellena:
#    - Título: "Miércoles de Descuento"
#    - Descripción: "20% de descuento todos los miércoles"
#    - Estado: "active"
#    - Etiqueta descuento: "20% OFF"
#    - Fecha inicio: 2026-04-21 00:00 (mañana)
#    - Fecha fin: 2026-05-21 23:59 (un mes después)
#    - Regla tipo: "percentage"
#    - Regla valor: 20
#    - Regla descripción: "20% en toda la tienda"
# 3. Guarda
# 4. Verifica:
#    - Redirige con ?created=1
#    - Aparece en listado con badge "Próxima" (porque inicio > ahora)
#    - Fechas formateadas correctamente

# Prueba: Fechas inversas
# 1. Intenta crear promoción con:
#    - Fecha inicio: 2026-05-21
#    - Fecha fin: 2026-04-21 (antes que inicio)
# 2. Error esperado: "La fecha de inicio debe ser anterior a la fecha de fin"
```

### Test: Ajustes del Negocio

```bash
# 1. Navega a /admin/settings
# 2. Rellena:
#    - Nombre: "Café La Esquina"
#    - Descripción: "Especialistas en café de tercera ola"
#    - WhatsApp: +5353456789
#    - Email: hola@cafelaesquina.cu
#    - Dirección: Calle Principal 123, Centro
#    - País: Cuba
#    - Instagram: https://instagram.com/cafelaesquina
# 3. Guarda
# 4. Verifica:
#    - Redirige con ?updated=1
#    - Banner verde: "Ajustes guardados correctamente"
#    - En próxima carga, valores se mantienen
```

### Test: RLS y Seguridad

```bash
# Nota: requiere múltiples usuarios/negocios
# 1. Crea usuario A, negocios A1 y A2
# 2. Crea usuario B, negocio B1
# 3. Con usuario A, crea categoría en A1
# 4. Intenta acceder a /admin con B (debe ver B1, no A1/A2)
# 5. Con Dev Tools: intenta cambiar request a crear en A1 → falla (RLS)
```

---

## Estructura de Datos

### Entidades en DB

**categories**
```sql
id UUID PRIMARY KEY
business_id UUID (FK, RLS)
slug VARCHAR UNIQUE (business_id, slug)
name VARCHAR NOT NULL
description TEXT
image_url TEXT (NULL, S14+)
sort_order INT
is_active BOOL
created_at TIMESTAMP
updated_at TIMESTAMP
```

**products**
```sql
id UUID PRIMARY KEY
business_id UUID (FK, RLS)
category_id UUID (FK)
slug VARCHAR UNIQUE (business_id, slug)
name VARCHAR NOT NULL
description TEXT
money_amount DECIMAL
money_currency VARCHAR (default CUP)
is_available BOOL
is_featured BOOL
badge VARCHAR (new|popular|offer, NULL)
tags JSON (NULL, S14+)
image_url TEXT (NULL, S14+)
sort_order INT
created_at TIMESTAMP
updated_at TIMESTAMP
```

**promotions**
```sql
id UUID PRIMARY KEY
business_id UUID (FK, RLS)
title VARCHAR NOT NULL
description TEXT
status VARCHAR (upcoming|active|expired|paused)
discount_label VARCHAR
image_url TEXT (NULL, S14+)
starts_at TIMESTAMP
ends_at TIMESTAMP
rules JSON (array of PromotionRule)
product_ids JSON (NULL, S14+)
category_ids JSON (NULL, S14+)
sort_order INT
created_at TIMESTAMP
updated_at TIMESTAMP
```

**businesses**
```sql
id UUID PRIMARY KEY
slug VARCHAR UNIQUE
name VARCHAR NOT NULL
short_description TEXT
whatsapp VARCHAR
phone VARCHAR
email VARCHAR
address TEXT
city VARCHAR
country VARCHAR
social JSON (instagram, facebook, telegram, twitter, youtube)
hours JSON (S14+)
created_at TIMESTAMP
updated_at TIMESTAMP
```

---

## Limitaciones Actuales (Sprint 13)

| Característica | Estado | Notas |
|---|---|---|
| CRUD básico | ✅ Implementado | Crear, leer, editar, eliminar sin UI complejas |
| Validación Zod | ✅ Implementado | Tipos, rangos, formatos |
| Seguridad RLS | ✅ Implementado | `business_id` en todas las operaciones |
| Autenticación | ✅ Supabase | Email/password |
| Slug auto-generado | ✅ Implementado | Desde nombre, no editable |
| Reglas de promoción | ✅ Simple (1 por promo) | Múltiples: S14+ |
| Imágenes | ❌ No | Upload: S14+ |
| Búsqueda | ❌ No | Full-text search: S14+ |
| Paginación | ❌ No | Infinity scroll/pagination: S14+ |
| Drag & drop | ❌ No | Reordenar: S14+ |
| Horarios | ❌ No | Gestión de `hours`: S14+ |
| Multi-idioma | ❌ No | Panel en español fijo |
| Audit log | ❌ No | Historial de cambios: S14+ |
| Roles/permisos | ❌ No | RBAC: S14+ |

---

## Qué Sigue (Sprint 14+)

### Próximas Funcionalidades
1. **Gestión de horarios** (`hours` editables)
2. **Upload de imágenes** para categorías y productos
3. **Múltiples reglas** por promoción
4. **Vincular productos/categorías** a promociones
5. **Búsqueda y filtros** en listados
6. **Paginación o infinite scroll**
7. **Audit log** de cambios
8. **Roles y permisos** (admin, moderador, viewer)

### Migración a Next.js
- Rutas `/admin/*` → App Router de Next.js
- Mutations en Server Actions
- Zod schemas reutilizables
- Supabase client SSR compatible
- Formularios con React hook form

---

## Referencia Rápida: Rutas y Métodos

```
GET  /admin                           → Dashboard
GET  /admin/login                     → Formulario login
POST /admin/login                     → Procesar login
GET  /admin/logout                    → Cerrar sesión

GET  /admin/catalog                   → Hub catálogo
GET  /admin/catalog/categories        → Listar
GET  /admin/catalog/categories/new    → Crear (form)
POST /admin/catalog/categories/new    → Crear (submit)
GET  /admin/catalog/categories/:id    → Editar/eliminar (form)
POST /admin/catalog/categories/:id    → Editar/eliminar (submit, _action=update/delete)

GET  /admin/catalog/products          → Listar
GET  /admin/catalog/products/new      → Crear (form)
POST /admin/catalog/products/new      → Crear (submit)
GET  /admin/catalog/products/:id      → Editar/eliminar (form)
POST /admin/catalog/products/:id      → Editar/eliminar (submit, _action=update/delete)

GET  /admin/promotions                → Listar
GET  /admin/promotions/new            → Crear (form)
POST /admin/promotions/new            → Crear (submit)
GET  /admin/promotions/:id            → Editar/eliminar (form)
POST /admin/promotions/:id            → Editar/eliminar (submit, _action=update/delete)

GET  /admin/settings                  → Editar ajustes (form)
POST /admin/settings                  → Editar ajustes (submit)
```

---

## Contacto y Soporte

**En caso de errores**:
1. Revisa la consola del navegador (DevTools)
2. Revisa los logs del servidor (terminal donde corre `npm run dev`)
3. Verifica que la BD Supabase está disponible
4. Prueba con una categoría diferente si el error es de referencias

**Stack técnico**:
- Astro 6.x + @astrojs/node (SSR)
- Supabase Auth + SDK
- Zod para validación
- Formularios HTML5 nativos (sin librerías)
