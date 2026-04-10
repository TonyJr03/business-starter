import { defineMiddleware } from 'astro/middleware';

/**
 * Middleware principal de la aplicación.
 *
 * Uso futuro:
 * - Verificación de sesión para rutas /admin/*
 * - Redirecciones globales
 * - Headers de seguridad personalizados
 */
export const onRequest = defineMiddleware(async (_context, next) => {
  return next();
});
