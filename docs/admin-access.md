# Acceso al panel administrativo

Documentación operativa para el panel admin implementado en Sprint 12.

## 1. Crear usuario admin en Supabase

### Opción A: Via dashboard de Supabase (recomendado)

1. Accede a [supabase.com](https://supabase.com) y entra a tu proyecto.
2. Ve a **Authentication** → **Users**.
3. Haz clic en **+ Add user** → **Create new user**.
4. Rellena:
   - **Email**: `admin@tudominio.com` (o el email que prefieras)
   - **Password**: una contraseña segura
   - Marca **Auto send invitation email** (opcional) o deja sin marcar si prefieres no enviar emails todavía.
5. Haz clic en **Create user**.

El usuario quedará disponible inmediatamente para login.

### Opción B: Via SQL (si prefieres la línea de comandos)

```sql
-- Ejecuta esto en SQL Editor de Supabase
-- Reemplaza valores según corresponda
SELECT auth.create_user(
  email => 'admin@tudominio.com',
  password => 'tu-contraseña-segura',
  email_confirm => true
);
```

## 2. Iniciar sesión en el panel admin

1. Navega a `http://localhost:3000/admin/login` (en desarrollo) o `/admin/login` en producción.
2. Ingresa el **email y contraseña** del usuario que creaste.
3. Si las credenciales son correctas → te redirige a `/admin` (dashboard).
4. El dashboard muestra:
   - Tu email autenticado en el header derecho
   - Accesos rápidos a futuras secciones (Catálogo, Promociones, Ajustes)
   - Botón **Cerrar sesión** en el header.

### Mensajes de error

| Mensaje | Causa | Solución |
|---|---|---|
| "Correo o contraseña incorrectos" | Credenciales inválidas | Verifica que el usuario existe en Supabase y que la contraseña es correcta |
| "Por favor, completa todos los campos" | Email o password vacíos | Completa ambos campos |
| "Red error" o sin respuesta | Supabase no configurado o variables de entorno faltantes | Ver sección [Troubleshooting](#troubleshooting) |

## 3. Cómo funciona la protección de rutas

El middleware centralizado (`src/middleware/index.ts`) protege automáticamente todas las rutas bajo `/admin`:

```
┌─────────────────────────────────────┐
│ Request a /admin/login o /admin/*   │
└──────────────────┬──────────────────┘
                   │
        ┌──────────▼──────────┐
        │ ¿Hay sesión activa? │
        └──────┬──────────┬───┘
               │          │
            SÍ │          │ NO
               │          │
        ┌──────▼─┐  ┌─────▼──────────┐
        │ /admin │  │ /admin/login   │
        │ (✓)    │  │    ↓           │
        └────────┘  │ ¿Es /login?    │
                    │ SÍ: muestra    │
                    │ NO: redirige → │
                    │ /admin/login   │
                    └────────────────┘
```

**Reglas:**
- ✓ Usuario **no autenticado** en `/admin/login` → muestra el formulario
- ✓ Usuario **autenticado** en `/admin/*` → acceso permitido
- ✗ Usuario **no autenticado** en `/admin/*` → `302 /admin/login`
- ✗ Usuario **autenticado** en `/admin/login` → `302 /admin` (evita ciclos)

**Caché de páginas admin:**
Todas las respuestas de `/admin/*` incluyen `Cache-Control: no-store` para evitar que el navegador cachee contenido protegido tras el logout.

## 4. Alcance Sprint 12 vs Sprint 13+

### ✅ Implementado (Sprint 12)

- **Auth**
  - Login con email/password vía Supabase Auth
  - Sesión persistente por cookies HTTP
  - Logout funcional
  - Tokens de sesión no exponen secrets al cliente

- **Rutas protegidas**
  - Middleware centralizado para `/admin/*`
  - Redireccionamiento automático a login si no hay sesión
  - Prevención de ciclos (usuario autenticado no ve login)

- **Layout admin**
  - Sidebar con navegación
  - Header con usuario y botón logout
  - Estructura reutilizable para CRUDs
  - Separación visual clara del sitio público

- **Dashboard**
  - Página inicial tras login
  - Bienvenida con email del usuario
  - Accesos rápidos (placeholder) a Catálogo, Promociones, Ajustes

### ❌ No implementado (Sprint 13+)

- **CRUDs completos** (crear, editar, eliminar categorías, productos, promociones)
- **Roles y permisos** (solo hay un usuario, sin control granular de acceso)
- **Recuperación de contraseña** (reset vía email)
- **Invitaciones de usuarios** (agregar admins desde el panel)
- **Auditoría** (historial de cambios, quién hizo qué)
- **Multiusuario** (validaciones de concurrencia, locks)

## 5. Troubleshooting

### Error: "Red error" o la página carga infinitamente

**Causa:** Supabase no está configurado (variables de entorno faltantes).

**Solución:**
1. Verifica que tienes un archivo `.env.local` en la raíz con:
   ```
   PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJxxxx...
   ```
2. Obtén estos valores del dashboard de Supabase:
   - URL: **Project Settings** → **API**
   - Publishable Key: Mismo lugar, marcado como `anon` o `public`
3. Reinicia el servidor de desarrollo (`npm run dev`)

### Error: "Sesión no persiste entre requests"

**Causa:** Las cookies de sesión no se están guardando o el servidor no las lee.

**Solución:**
1. Asegúrate de que **no estás usando localhost:3000** con un proxy que bloquee cookies
2. En desarrollo local, comprueba que el navegador tiene habilitadas las cookies de terceros (si usa separación de dominios)
3. Reinicia el servidor: `npm run dev`

### Error: "El botón de logout no funciona"

**Causa:** El formulario POST no está siendo procesado correctamente, o Supabase no responde.

**Solución:**
1. Abre la consola del navegador (F12 → Network) y haz clic en "Cerrar sesión"
2. Verifica que el POST a `/admin/logout` devuelve un redirect `302` a `/admin/login`
3. Si falla, comprueba que Supabase tiene conexión (repite el troubleshooting anterior)

### Error: "Tras logout, el botón atrás muestra la página admin"

**Esto no debería pasar.** Si ocurre:

1. Vacía la caché del navegador: Ctrl+Shift+Supr (Windows) o Cmd+Shift+Supr (Mac)
2. Usa Ctrl+F5 en lugar de F5 (reload "duro")
3. Si persiste, revisa que el middleware está inyectando `Cache-Control: no-store`:
   - F12 → Network → selecciona un request a `/admin/dashboard`
   - Verifica que el header `Cache-Control` aparece con valor `no-store`

### Error: "Usuario creado en Supabase pero no puedo logearme"

**Causa:** El usuario no está confirmado o hay desincronización.

**Solución:**
1. En Supabase **Authentication** → **Users**, haz clic en el usuario
2. Verifica que tiene un **email confirmado** (✓ checkmark o timestamp)
3. Si está en rojo o vacío, haz clic en **Resend Email** (si está habilitada la confirmación por email)
4. O crea un nuevo usuario directamente desde el dashboard sin requerir confirmación de email

## 6. Variables de entorno requeridas

```bash
# Variables públicas — accesibles en el cliente y servidor.
PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJxxxx...

# Para deploy en producción (ej. Vercel):
# Define estas variables en el panel de entorno del host.
```

## 7. Flujo de sesión (técnico)

Si necesitas entender el flujo internamente:

1. **Login (POST /admin/login)**
   - Cliente envía `email` + `password` en formulario
   - Servidor crea `SupabaseServerClient` con cookies
   - Supabase devuelve tokens (access + refresh)
   - Los tokens se guardan en cookies HTTP mediante `createServerClient` (patrón `@supabase/ssr`)
   - Respuesta redirige a `/admin`

2. **Request autenticado (GET /admin/dashboard)**
   - Middleware llama `getUser(cookies, request)`
   - `getUser()` crea `SupabaseServerClient` que lee cookies del request
   - Supabase valida el token contra el servidor
   - Si válido → acceso permitido; si no → redirige a login

3. **Logout (POST /admin/logout)**
   - Servidor llama `signOut(cookies, request)`
   - Supabase invalida el token y borra las cookies vía `setAll()`
   - Respuesta redirige a `/admin/login`
   - Próximo acceso a `/admin/*` → `getUser()` devuelve `null` → middleware redirige

**Claves de seguridad:**
- Tokens nunca se exponen al JavaScript del cliente (están en cookies HTTP-only en Supabase)
- El refresh token se rota automáticamente por Supabase
- Cada request valida la sesión contra el servidor (no confía solo en el cliente)

## 8. Recursos

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Astro SSR Guide](https://docs.astro.build/es/guides/server-side-rendering/)
- [Supabase + Astro Integration](https://supabase.com/docs/guides/auth/auth-helpers/astro)
