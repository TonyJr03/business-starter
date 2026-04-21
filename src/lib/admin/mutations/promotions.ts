import { z } from 'zod';
import { ok, fail } from '../response';
import { rowToPromotion } from '@/lib/persistence';
import type { AdminContext } from '../guard';
import type { MutationResult } from '../response';
import type { Promotion } from '@/types';

// ─── Esquemas de validación ───────────────────────────────────────────────────

export const promotionCreateSchema = z.object({
  title:         z.string().min(1, 'El título es obligatorio').max(200),
  description:   z.string().max(1000).optional(),
  status:        z.enum(['upcoming', 'active', 'expired', 'paused']).default('active'),
  discountLabel: z.string().max(50).optional(),
  /**
   * Fechas opcionales en formato ISO 8601 o datetime-local (YYYY-MM-DDTHH:mm).
   * Se almacenan directamente en la columna TIMESTAMPTZ de Supabase.
   */
  startsAt:      z.string().optional(),
  endsAt:        z.string().optional(),
  sortOrder:     z.coerce.number().int().min(0).default(0),
  /**
   * Regla simple opcional. Se almacena como rules: [PromotionRule] en JSONB.
   * El panel admin solo gestiona una regla a la vez (S13). Múltiples reglas: S14+.
   */
  ruleType:        z.enum(['percentage', 'fixed', 'bogo', 'combo', 'custom']).optional(),
  ruleValue:       z.coerce.number().min(0).optional(),
  ruleDescription: z.string().max(300).optional(),
}).refine(
  (data) => {
    // Si ambas fechas están presentes, startsAt debe ser < endsAt
    if (data.startsAt && data.endsAt) {
      return new Date(data.startsAt) < new Date(data.endsAt);
    }
    return true;
  },
  {
    message: 'La fecha de inicio debe ser anterior a la fecha de fin',
    path: ['startsAt'],
  },
);

export const promotionUpdateSchema = promotionCreateSchema.partial();

export type PromotionCreateInput = z.infer<typeof promotionCreateSchema>;
export type PromotionUpdateInput = z.infer<typeof promotionUpdateSchema>;

// ─── Mutaciones ───────────────────────────────────────────────────────────────

// ─── Helper: compone PromotionRule[] desde los campos simples del formulario ──
function buildRules(input: PromotionCreateInput | PromotionUpdateInput) {
  if (!input.ruleType) return null;
  return [{
    type:        input.ruleType,
    value:       input.ruleValue       ?? undefined,
    description: input.ruleDescription ?? undefined,
  }];
}

/**
 * Crea una promoción nueva para el negocio del contexto.
 * product_ids y category_ids quedan en null hasta S14+ (builder visual).
 *
 * Validación:
 *   - Schema Zod valida que startsAt < endsAt si ambas están presentes.
 */
export async function createPromotion(
  ctx: AdminContext,
  input: PromotionCreateInput,
): Promise<MutationResult<Promotion>> {
  const { data, error } = await ctx.supabase
    .from('promotions')
    .insert({
      business_id:    ctx.businessId,
      title:          input.title,
      description:    input.description ?? null,
      status:         input.status,
      discount_label: input.discountLabel ?? null,
      image_url:      null,
      starts_at:      input.startsAt ?? null,
      ends_at:        input.endsAt ?? null,
      rules:          buildRules(input),
      product_ids:    null,
      category_ids:   null,
      sort_order:     input.sortOrder,
    })
    .select()
    .single();

  if (error) {
    return fail('No se pudo crear la promoción. Por favor, intenta de nuevo.');
  }

  return ok(rowToPromotion(data));
}

/**
 * Actualiza los campos indicados de una promoción existente.
 *
 * RLS: el .eq('business_id', ctx.businessId) garantiza que solo se actualiza
 * si la promoción pertenece al negocio autenticado.
 */
export async function updatePromotion(
  ctx: AdminContext,
  id: string,
  input: PromotionUpdateInput,
): Promise<MutationResult<Promotion>> {
  const patch: Record<string, unknown> = {};
  if (input.title         !== undefined) patch.title          = input.title;
  if (input.description   !== undefined) patch.description    = input.description;
  if (input.status        !== undefined) patch.status         = input.status;
  if (input.discountLabel !== undefined) patch.discount_label = input.discountLabel ?? null;
  if (input.startsAt      !== undefined) patch.starts_at      = input.startsAt ?? null;
  if (input.endsAt        !== undefined) patch.ends_at        = input.endsAt ?? null;
  if (input.sortOrder     !== undefined) patch.sort_order     = input.sortOrder;
  // Siempre actualiza rules cuando viene el tipo (incluyendo borrado con ruleType vacío)
  if (input.ruleType !== undefined || input.ruleDescription !== undefined || input.ruleValue !== undefined) {
    patch.rules = buildRules(input);
  }

  const { data, error } = await ctx.supabase
    .from('promotions')
    .update(patch)
    .eq('id', id)
    .eq('business_id', ctx.businessId) // RLS: solo el negocio propietario
    .select()
    .single();

  if (error) {
    return fail('No se pudo actualizar la promoción. Por favor, intenta de nuevo.');
  }
  if (!data)  return fail('Promoción no encontrada');

  return ok(rowToPromotion(data));
}

/**
 * Elimina una promoción por ID.
 *
 * RLS: el .eq('business_id', ctx.businessId) garantiza que solo se elimina
 * si la promoción pertenece al negocio autenticado.
 */
export async function deletePromotion(
  ctx: AdminContext,
  id: string,
): Promise<MutationResult<{ id: string }>> {
  const { error } = await ctx.supabase
    .from('promotions')
    .delete()
    .eq('id', id)
    .eq('business_id', ctx.businessId); // RLS: solo el negocio propietario

  if (error) {
    return fail('No se pudo eliminar la promoción. Por favor, intenta de nuevo.');
  }

  return ok({ id });
}
