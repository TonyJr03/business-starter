import { defineMiddleware } from 'astro/middleware';
import { getUser } from '@/lib/auth';

// Ruta de login — punto de entrada público de la zona admin.
const LOGIN_PATH = '/admin/login';

// Prefijo que identifica todas las rutas protegidas.
const ADMIN_PREFIX = '/admin';

/**
 * Middleware principal de la aplicación.
 *
 * Protección centralizada de rutas /admin/*:
 * - Usuario no autenticado intentando acceder a /admin/*  → redirige a /admin/login
 * - Usuario autenticado intentando acceder a /admin/login → redirige a /admin
 * - Rutas públicas: sin intervención
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = new URL(context.request.url);

  // Solo intervenir en rutas bajo /admin.
  if (!pathname.startsWith(ADMIN_PREFIX)) {
    return next();
  }

  const usuario = await getUser(context.cookies, context.request);
  const estaAutenticado = usuario !== null;

  if (!estaAutenticado) {
    // Ruta admin sin sesión → login.
    if (pathname !== LOGIN_PATH) {
      return context.redirect(LOGIN_PATH);
    }
    // En /admin/login sin sesión → mostrar el formulario con normalidad.
    return next();
  }

  // Ruta admin con sesión → evitar que vuelva al login innecesariamente.
  if (pathname === LOGIN_PATH) {
    return context.redirect(ADMIN_PREFIX);
  }

  // Ruta admin con sesión → acceso permitido.
  return next();
});
