/**
 * Tipo de resultado unificado para todas las mutaciones del panel admin.
 *
 * Patrón Result<T, E>: fuerza al consumidor a manejar explícitamente
 * tanto el camino feliz como el de error, sin excepciones no controladas.
 *
 * Uso típico en una página SSR:
 *   const result = await createCategory(ctx, input);
 *   if (!result.ok) { // mostrar result.error }
 *   else { // redirigir con result.data.id }
 */

export type MutationSuccess<T> = {
  ok: true;
  data: T;
};

export type MutationError = {
  ok: false;
  /** Mensaje legible para mostrar en la UI. */
  error: string;
  /** Campo específico con error, para resaltar en el formulario. */
  field?: string;
};

export type MutationResult<T> = MutationSuccess<T> | MutationError;

// ─── Helpers constructores ────────────────────────────────────────────────────

/** Construye un resultado exitoso. */
export function ok<T>(data: T): MutationSuccess<T> {
  return { ok: true, data };
}

/** Construye un resultado de error. */
export function fail(error: string, field?: string): MutationError {
  return { ok: false, error, field };
}

/** Type guard: detecta si el resultado es un error. */
export function isMutationError(
  result: MutationResult<unknown>,
): result is MutationError {
  return !result.ok;
}
