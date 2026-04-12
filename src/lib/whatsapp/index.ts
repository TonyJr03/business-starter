import { globalConfig } from '@/config';

/**
 * Genera la URL base de WhatsApp para el número del negocio.
 * Opcionalmente incluye un mensaje preescrito.
 */
export function getWhatsAppUrl(message?: string): string {
  const number = globalConfig.contact.whatsapp.replace(/\D/g, '');
  const base = `https://wa.me/${number}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

/**
 * Genera un mensaje de pedido formateado para WhatsApp
 * a partir de una lista de ítems seleccionados.
 */
export function buildOrderMessage(
  items: Array<{ name: string; quantity: number; money: { amount: number; currency: string } }>,
): string {
  const lines = items.map(
    (item) => `• ${item.name} x${item.quantity} — ${item.money.amount * item.quantity} ${item.money.currency}`,
  );
  // Asume que todos los ítems comparten la misma divisa (primer ítem como referencia).
  const currency = items[0]?.money.currency ?? '';
  const total = items.reduce((sum, item) => sum + item.money.amount * item.quantity, 0);

  return [
    `Hola, quisiera hacer un pedido en ${globalConfig.identity.name}:`,
    '',
    ...lines,
    '',
    `Total estimado: ${total} ${currency}`,
    '',
    '¿Está disponible?',
  ].join('\n');
}
