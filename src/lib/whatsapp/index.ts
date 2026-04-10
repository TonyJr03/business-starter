import { businessConfig } from '@/config';

/**
 * Genera la URL base de WhatsApp para el número del negocio.
 * Opcionalmente incluye un mensaje preescrito.
 */
export function getWhatsAppUrl(message?: string): string {
  const number = businessConfig.contact.whatsappNumber.replace(/\D/g, '');
  const base = `https://wa.me/${number}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

/**
 * Genera un mensaje de pedido formateado para WhatsApp
 * a partir de una lista de ítems seleccionados.
 */
export function buildOrderMessage(
  items: Array<{ name: string; quantity: number; price: number }>,
): string {
  const lines = items.map(
    (item) => `• ${item.name} x${item.quantity} — $${item.price * item.quantity}`,
  );
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return [
    `Hola, quisiera hacer un pedido en ${businessConfig.name}:`,
    '',
    ...lines,
    '',
    `Total estimado: $${total}`,
    '',
    '¿Está disponible?',
  ].join('\n');
}
