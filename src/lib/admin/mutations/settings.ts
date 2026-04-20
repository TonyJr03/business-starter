import { z } from 'zod';
import { ok, fail } from '../response';
import { rowToBusinessSettings } from '@/lib/persistence';
import type { AdminContext } from '../guard';
import type { MutationResult } from '../response';
import type { BusinessSettings } from '@/lib/persistence';

// ─── Esquema de validación ────────────────────────────────────────────────────

/**
 * Campos editables desde el panel de ajustes.
 *
 * Excluidos deliberadamente en S13:
 *   · hours  → gestión de horarios requiere UI más elaborada (S14+)
 *   · slug   → no editable desde admin (cambiaría URLs y referencias)
 *
 * Redes sociales: campos individuales que se componen en el objeto JSONB.
 */
export const settingsUpdateSchema = z.object({
  name:             z.string().min(1, 'El nombre es obligatorio').max(200),
  shortDescription: z.string().max(300).optional(),
  whatsapp:         z.string().max(30).optional(),
  phone:            z.string().max(30).optional(),
  // Email: acepta string vacío (formulario vacío) o un email válido
  email:            z.union([z.string().email('Email inválido'), z.literal('')]).optional(),
  address:          z.string().max(300).optional(),
  city:             z.string().max(100).optional(),
  country:          z.string().max(100).optional(),
  // Redes sociales como campos individuales (se ensamblan en JSONB)
  socialInstagram:  z.string().max(200).optional(),
  socialFacebook:   z.string().max(200).optional(),
  socialTelegram:   z.string().max(200).optional(),
  socialTwitter:    z.string().max(200).optional(),
  socialYoutube:    z.string().max(200).optional(),
});

export type SettingsUpdateInput = z.infer<typeof settingsUpdateSchema>;

// ─── Mutación ─────────────────────────────────────────────────────────────────

/**
 * Actualiza los ajustes básicos del negocio.
 *
 * El objeto social se reemplaza completo: campos con valor se incluyen,
 * campos vacíos se excluyen (null en DB si no hay ninguno).
 * El campo hours NO se modifica — se preserva el valor existente en DB.
 */
export async function updateSettings(
  ctx: AdminContext,
  input: SettingsUpdateInput,
): Promise<MutationResult<BusinessSettings>> {
  // Ensambla el objeto social solo con los campos que tienen valor
  const social: Record<string, string> = {};
  if (input.socialInstagram) social.instagram = input.socialInstagram;
  if (input.socialFacebook)  social.facebook  = input.socialFacebook;
  if (input.socialTelegram)  social.telegram  = input.socialTelegram;
  if (input.socialTwitter)   social.twitter   = input.socialTwitter;
  if (input.socialYoutube)   social.youtube   = input.socialYoutube;

  const { data, error } = await ctx.supabase
    .from('businesses')
    .update({
      name:              input.name,
      short_description: input.shortDescription ?? null,
      whatsapp:          input.whatsapp          ?? null,
      phone:             input.phone             ?? null,
      email:             input.email || null,           // '' → null
      address:           input.address           ?? null,
      city:              input.city              ?? null,
      country:           input.country           ?? null,
      social:            Object.keys(social).length > 0 ? social : null,
      // hours: no incluido — se preserva el valor existente en DB
    })
    .eq('id', ctx.businessId)
    .select()
    .single();

  if (error) return fail(error.message);
  if (!data)  return fail('Negocio no encontrado');

  return ok(rowToBusinessSettings(data));
}
