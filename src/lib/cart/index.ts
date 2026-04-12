/**
 * Módulo de carrito — Fase 2.
 *
 * Aquí irá la lógica de estado del carrito de compra.
 * Se implementará con nanostores para compartir estado entre
 * componentes Astro y React sin prop drilling.
 *
 * Operaciones planeadas:
 * - addItem(product, quantity)
 * - removeItem(productId)
 * - updateQuantity(productId, quantity)
 * - clearCart()
 * - getCartTotal()
 * - buildWhatsAppOrderUrl()
 */

export type CartItem = {
  productId: string;
  name: string;
  /** Precio con divisa — campo canónico del dominio (reemplaza price: number). */
  money: { amount: number; currency: string };
  quantity: number;
  imageUrl?: string;
};

export type CartState = {
  items: CartItem[];
};
