// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  // En Astro 6, output: 'static' (default) es el equivalente al antiguo 'hybrid':
  // las páginas públicas se prerenderizan estáticamente, mientras que las páginas
  // admin usan SSR bajo demanda declarando:
  //   export const prerender = false;
  output: 'static',

  // Adaptador Node.js para servir las páginas SSR en desarrollo local y builds.
  // Para despliegue en Vercel, reemplazar con @astrojs/vercel.
  adapter: node({ mode: 'standalone' }),

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],
});