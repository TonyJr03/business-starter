-- =============================================================================
-- Seed inicial: datos demo de Café La Esquina
-- Fecha: 2026-04-19
--
-- IMPORTANTE: estos son datos de demostración pensados para desarrollo local.
-- Reemplazar con los datos reales del cliente antes de lanzar a producción.
--
-- Esquema de UUIDs fijos (todos válidos en hexadecimal):
--   Businesses:  10000000-0000-0000-0000-000000000001
--   Categories:  20000000-0000-0000-0000-00000000000X (X = 1,2,3)
--   Products:    30000000-0000-0000-0000-00000000000X (X = 1-10)
--   Promotions:  40000000-0000-0000-0000-00000000000X (X = 1-4)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Limpiar en orden inverso al de dependencias (seguro en entorno de dev)
-- ---------------------------------------------------------------------------
TRUNCATE promotions, products, categories, businesses RESTART IDENTITY CASCADE;


-- =============================================================================
-- 1. Business: Café La Esquina
-- =============================================================================
INSERT INTO businesses (id, slug, name) VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    'cafe-la-esquina',
    'Café La Esquina'
  );


-- =============================================================================
-- 2. Categorías
-- Equivalentes a src/data/categories.ts
-- =============================================================================
INSERT INTO categories
  (id, business_id, slug, name, description, sort_order, is_active)
VALUES
  (
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'cafes',
    'Cafés',
    'Café cubano, espresso, americano y más.',
    1, true
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    'bebidas-frias',
    'Bebidas frías',
    'Jugos, batidos y refrescos naturales.',
    2, true
  ),
  (
    '20000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000001',
    'bocados',
    'Bocados',
    'Pastelitos, snacks y algo para acompañar.',
    3, true
  );


-- =============================================================================
-- 3. Productos
-- Equivalentes a src/data/products.ts
-- money_currency = 'CUP' en todos (mercado Cuba)
-- =============================================================================
INSERT INTO products
  (id, business_id, category_id, slug, name, description,
   money_amount, money_currency, is_available, is_featured, badge, sort_order)
VALUES

  -- ── Cafés ────────────────────────────────────────────────────────────────
  (
    '30000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'cafe-cubano', 'Café Cubano',
    'Nuestro café cubano tradicional, fuerte y aromático.',
    25.00, 'CUP', true, true, 'popular', 1
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'cortadito', 'Cortadito',
    'Café cubano con un toque de leche suave.',
    30.00, 'CUP', true, true, NULL, 2
  ),
  (
    '30000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'cafe-con-leche', 'Café con Leche',
    'La combinación perfecta para comenzar el día.',
    40.00, 'CUP', true, false, NULL, 3
  ),
  (
    '30000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'espresso-doble', 'Espresso Doble',
    'Concentrado e intenso, para los que no se conforman con poco.',
    45.00, 'CUP', true, false, 'new', 4
  ),

  -- ── Bebidas frías ─────────────────────────────────────────────────────────
  (
    '30000000-0000-0000-0000-000000000005',
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000002',
    'jugo-guayaba', 'Jugo de Guayaba',
    'Natural, fresco y bien cubano.',
    35.00, 'CUP', true, true, 'new', 1
  ),
  (
    '30000000-0000-0000-0000-000000000006',
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000002',
    'batido-mango', 'Batido de Mango',
    'Cremoso y dulce, hecho con mango fresco.',
    50.00, 'CUP', true, false, NULL, 2
  ),
  (
    '30000000-0000-0000-0000-000000000007',
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000002',
    'agua-de-coco', 'Agua de Coco',
    'Refrescante y natural, directo del coco.',
    40.00, 'CUP', true, false, NULL, 3
  ),

  -- ── Bocados ───────────────────────────────────────────────────────────────
  (
    '30000000-0000-0000-0000-000000000008',
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000003',
    'pastelito-guayaba', 'Pastelito de Guayaba',
    'Hojaldrado y relleno de guayaba, igual que en casa.',
    20.00, 'CUP', true, true, 'popular', 1
  ),
  (
    '30000000-0000-0000-0000-000000000009',
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000003',
    'tostada-mantequilla', 'Tostada con Mantequilla',
    'Pan tostado, crujiente y bien untado.',
    15.00, 'CUP', false, false, NULL, 2
  ),
  (
    '30000000-0000-0000-0000-000000000010',
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000003',
    'croqueta-jamon', 'Croqueta de Jamón',
    'Crujiente por fuera, cremosa por dentro. Perfecta para acompañar el café.',
    25.00, 'CUP', true, false, NULL, 3
  );


-- =============================================================================
-- 4. Promociones
-- Equivalentes a src/data/promotions.ts
--
-- category_ids y product_ids usan los UUIDs definidos arriba.
-- =============================================================================
INSERT INTO promotions
  (id, business_id, title, description, status, discount_label,
   starts_at, ends_at, rules, product_ids, category_ids, sort_order)
VALUES

  -- promo-1: Desayuno Completo (active)
  (
    '40000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'Desayuno Completo',
    'Café cubano + tostada + jugo del día por un precio especial. Disponible de lunes a viernes de 8:00 a 11:00.',
    'active',
    '20% OFF',
    '2026-04-01 00:00:00+00',
    '2026-04-30 23:59:59+00',
    '[{"type":"percentage","value":20,"description":"Descuento del 20% en el combo de desayuno completo."}]',
    NULL,
    NULL,
    1
  ),

  -- promo-2: Happy Hour del Café (active, aplica a categoría Cafés)
  (
    '40000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    'Happy Hour del Café',
    'Todos los cafés a mitad de precio de 3:00 PM a 5:00 PM.',
    'active',
    '50% OFF',
    '2026-04-01 00:00:00+00',
    '2026-04-30 23:59:59+00',
    '[{"type":"percentage","value":50,"categoryIds":["20000000-0000-0000-0000-000000000001"],"description":"Mitad de precio en todos los cafés durante happy hour."}]',
    NULL,
    '["20000000-0000-0000-0000-000000000001"]',
    2
  ),

  -- promo-3: Combo Amigos (active, aplica a productos Café Cubano + Pastelito)
  (
    '40000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000001',
    'Combo Amigos',
    'Dos cafés cubanos + dos pastelitos de guayaba por un precio especial. Ideal para compartir.',
    'active',
    'Combo',
    NULL,
    NULL,
    '[{"type":"combo","minItems":4,"productIds":["30000000-0000-0000-0000-000000000001","30000000-0000-0000-0000-000000000008"],"description":"Precio especial al pedir 2 cafés cubanos y 2 pastelitos de guayaba."}]',
    '["30000000-0000-0000-0000-000000000001","30000000-0000-0000-0000-000000000008"]',
    NULL,
    3
  ),

  -- promo-4: Tarde de Batidos (paused, aplica a categoría Bebidas frías)
  (
    '40000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000001',
    'Tarde de Batidos',
    'Lleva dos batidos y paga uno. De 2:00 PM a 6:00 PM, de martes a jueves.',
    'paused',
    '2×1',
    '2026-04-15 00:00:00+00',
    '2026-05-15 23:59:59+00',
    '[{"type":"bogo","minItems":2,"categoryIds":["20000000-0000-0000-0000-000000000002"],"description":"Segundo batido gratis al comprar el primero en el horario indicado."}]',
    NULL,
    '["20000000-0000-0000-0000-000000000002"]',
    4
  );
