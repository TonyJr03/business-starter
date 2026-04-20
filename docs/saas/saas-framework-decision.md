# Decisión Ejecutiva: Framework SaaS

**Fecha:** 20 de abril de 2026  
**Sprint:** S12.5 — Evaluación arquitectónica  
**Estado:** APROBADO — cerrado

---

## La decisión

**Migrar a Next.js. En S14.**

Continuamos con Astro en S12 y S13. Al inicio de S14, el proyecto se migra a Next.js App Router. Esta decisión no está abierta a revisión durante S12 y S13.

---

## Por qué Next.js, no seguir con Astro

Astro es correcto para un sitio de contenido con un admin mínimo. Este proyecto ya no es eso.

El plan SaaS requiere:
- Panel admin con CRUDs complejos y múltiples formularios (rutas dinámicas, mutaciones server-side, feedback inmediato).
- Autenticación SSR confiable y composable como primitiva de la arquitectura.
- Multi-tenancy escalable: path-based ahora, subdominios después.
- Superficie de superadmin independiente con sus propias reglas de acceso.

Astro puede hacer todas estas cosas. Con parches, adaptadores, workarounds y restricciones que van en contra del modelo del framework. Cada sprint en esa dirección acumula deuda en la capa de presentación.

Next.js App Router resuelve estos requisitos de forma nativa: React Server Components, Server Actions, middleware con acceso a cookies, route groups para separar superficies. No hay ningún punto del roadmap SaaS que choque con su modelo.

El 70% del proyecto (tipos, servicios, configuración, datos, persistencia, base de datos) se porta sin modificaciones. El coste real de la migración es la capa de presentación: 38 archivos `.astro` reescritos en JSX. Estimado: 3–5 días.

---

## Por qué no migrar en S12 o S13

S12 y S13 construyen los CRUDs base del admin. Son trabajo de producto, no de infraestructura. Migrar el framework mientras se desarrollan funcionalidades nuevas multiplica la superficie de error y hace imposible aislar las causas cuando algo falla.

La secuencia correcta es:
1. Terminar S13 con los CRUDs funcionando en Astro.
2. Congelar el repo Astro. Tag `v0-astro-s13`.
3. Arrancar S14 en Next.js con el core portado y los CRUDs como primer test de validación.

---

## Cuándo conviene hacerlo: trigger de migración

La migración inicia cuando se cumplan **las dos condiciones**:

1. **S13 está en producción y estable** — catálogo, promociones y ajustes del negocio funcionan sin bugs críticos abiertos.
2. **Se va a desarrollar funcionalidad que requiere múltiples rutas admin nuevas** — si el siguiente sprint es de contenido o ajustes menores, se puede posponer sin coste.

Si al inicio de S14 ambas condiciones se cumplen: migrar antes de escribir código nuevo.

---

## Riesgos que asumimos

| Riesgo | Decisión |
|---|---|
| S12 y S13 se construyen en Astro sabiendo que se va a migrar | Aceptado. El core no cambia. La presentación se reescribe de todos modos. |
| La migración puede extenderse más de 5 días si hay blockers en auth o CSS vars | Aceptado. Existe un plan de rollback: el repo Astro permanece intacto hasta que Next.js esté en producción. |
| Vercel Pro puede ser necesario para subdominios en Fase 2 arquitectónica | Aceptado y documentado. No es un bloqueador para MVP. |
| El equipo aprende Next.js App Router durante la migración | Aceptado. La arquitectura objetivo está completamente documentada. No se improvisa. |

**Riesgo que no se acepta:** Iniciar el panel superadmin o la migración a subdominios en Astro. Esas superficies se construyen en Next.js o no se construyen.

---

## Qué mantiene el roadmap y qué cambia

### No cambia

- El modelo de multi-tenancy: path-based MVP (`/negocios/[slug]`), subdominios en Fase 2.
- Los sprints S12 y S13: se ejecutan tal como estaban planificados, en Astro.
- La base de datos: mismo schema Supabase, mismas migraciones, mismo RLS.
- Los servicios, tipos y config: se portan sin modificación.
- El plan de fases del producto: Fase 1 MVP, Fase 2 subdominios, etc.

### Cambia

- S14 arranca con la migración a Next.js en vez de funcionalidad nueva.
- El repo activo pasa de `business-starter` (Astro) a `business-starter-next` (Next.js).
- El stack de la capa de presentación: Astro components → React Server Components + Client Components.

---

## Qué hacemos inmediatamente después de esta decisión

**Nada distinto a lo planificado.**

La próxima acción es continuar con S12: construir los CRUDs base del panel admin en Astro. Esta decisión no cambia ese trabajo.

Lo que sí se hace ahora:
1. Guardar este documento como referencia. No reabre la discusión de framework en S12 o S13.
2. Al planificar S14, incluir la migración como primer ítem — estimado 3–5 días — antes de cualquier funcionalidad nueva.
3. Archivar los documentos de esta evaluación en `docs/saas/` como referencia permanente.

---

## Documentos de soporte de esta decisión

Toda la evaluación está documentada. Si alguien pregunta por qué se tomó esta decisión, los documentos responden:

| Documento | Qué responde |
|---|---|
| [`saas-product-vision.md`](./saas-product-vision.md) | Qué es la plataforma, quiénes son los actores, fases del producto |
| [`multi-tenant-architecture.md`](./multi-tenant-architecture.md) | Por qué path-based en MVP y cuándo subdominos |
| [`framework-evaluation-astro-vs-next.md`](./framework-evaluation-astro-vs-next.md) | Comparativa técnica detallada de los dos frameworks |
| [`nextjs-migration-inventory.md`](./nextjs-migration-inventory.md) | Cuánto cuesta la migración, archivo por archivo |
| [`nextjs-target-architecture.md`](./nextjs-target-architecture.md) | Cómo queda el proyecto en Next.js |
| [`nextjs-migration-roadmap.md`](./nextjs-migration-roadmap.md) | Cómo ejecutar la migración, paso a paso |
