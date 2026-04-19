# Supabase – Configuración y flujo de trabajo local

Guía práctica para levantar Supabase en local, aplicar el esquema y cargar datos de prueba.

---

## Requisitos previos

| Herramienta | Versión mínima | Instalación |
|---|---|---|
| Docker Desktop | Cualquier versión estable | [docker.com](https://www.docker.com/products/docker-desktop/) |
| Supabase CLI | ≥ 2.0 | `npm install -g supabase` |
| Node.js | ≥ 18 | [nodejs.org](https://nodejs.org/) |

Docker debe estar corriendo antes de ejecutar cualquier comando de Supabase CLI.

---

## Variables de entorno

Copia el archivo de ejemplo y rellena los valores locales:

```bash
cp .env.example .env
```

Las claves locales por defecto son siempre las mismas en cualquier instancia local de Supabase CLI:

```env
PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
PUBLIC_SUPABASE_PUBLISHABLE_KEY=<anon-key del output de supabase start>
```

La `anon key` aparece en la terminal cada vez que ejecutas `supabase start`. También puedes consultarla en cualquier momento con:

```bash
npx supabase status
```

---

## Arrancar Supabase local

```bash
npx supabase start
```

Levanta los contenedores Docker (API, base de datos, Studio). El primer arranque tarda más porque descarga las imágenes. Los siguientes son inmediatos.

Una vez activo, el dashboard está disponible en: **http://127.0.0.1:54323**

---

## Aplicar migraciones

Las migraciones se aplican automáticamente al hacer `db reset` (ver más abajo). Para aplicarlas sobre una instancia ya activa sin borrar datos:

```bash
npx supabase db push
```

Los archivos de migración están en `supabase/migrations/`. Se ejecutan en orden alfabético por nombre de archivo.

---

## Cargar el seed

El seed con datos de demostración (Café La Esquina) se carga automáticamente junto con las migraciones al hacer `db reset`. Para cargarlo manualmente en una base ya activa:

```bash
npx supabase db reset --seed-only
```

El archivo de seed está en `supabase/seed.sql`.

---

## Resetear la base local

Borra todos los datos, re-aplica las migraciones desde cero y carga el seed:

```bash
npx supabase db reset
```

Usar esto cuando:
- Cambian las migraciones
- Quieres volver a un estado limpio de desarrollo
- El seed falló a medias

---

## Comprobar que la app lee de Supabase

Arranca el servidor de desarrollo con las variables de entorno configuradas:

```bash
npx astro dev
```

Señales de que la app está leyendo de Supabase y no del fallback:

1. **Sin errores en consola** relacionados con las variables `PUBLIC_SUPABASE_*`.
2. Los datos mostrados coinciden con el seed (Café La Esquina, 10 productos en 3 categorías, 4 promociones).
3. Si editas un registro directamente en el dashboard (`http://127.0.0.1:54323`) y recargas la página, el cambio se refleja.

Para confirmar qué fuente está activa, abre el archivo `src/lib/supabase/client.ts` y añade temporalmente un log:

```typescript
// Solo para debug – eliminar antes de commit
console.log('[supabase] env present:', hasSupabaseEnv());
```

---

## Comportamiento del fallback

Cuando `PUBLIC_SUPABASE_URL` o `PUBLIC_SUPABASE_PUBLISHABLE_KEY` están vacías o ausentes:

- `hasSupabaseEnv()` devuelve `false`.
- `getSupabaseClient()` devuelve `null`.
- Los servicios (`catalog.service.ts`, `promotions.service.ts`) detectan el `null` y caen automáticamente a los datos mock definidos en `src/data/`.
- La app funciona completamente sin necesidad de Docker ni conexión de red.

Este modo es útil para:
- Desarrollo UI sin backend.
- CI/CD que no requiera base de datos.
- Despliegues de preview donde Supabase no está conectado.

Para forzar el fallback intencionalmente, deja `.env` vacío o elimina las dos variables `PUBLIC_SUPABASE_*`.
