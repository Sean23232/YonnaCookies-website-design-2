import { getFlavor } from "../data/flavors";
import { cartItemSchema } from "./order-schema";
import {
  boxCents,
  cartSubtotalCents,
  countFlavors,
  lineTotalCents,
  singleCents,
} from "./pricing";
import type { CartItem, OrderItemSnapshot } from "./types";

export function boxLabel(size: number): string {
  return size === 12 ? "Dozen (12)" : `Box of ${size}`;
}

/**
 * Turns a cart line into a frozen, readable snapshot.
 * Returns null when the line refers to unknown/unavailable flavors or a
 * box that doesn't add up to its size.
 */
export function snapshotItem(item: CartItem): OrderItemSnapshot | null {
  if (item.kind === "single") {
    const flavor = getFlavor(item.flavorId);
    if (!flavor || !flavor.available) return null;
    return {
      kind: "single",
      label: `${flavor.name} cookie`,
      quantity: item.quantity,
      unitCents: singleCents(),
      lineCents: lineTotalCents(item),
      flavors: [{ name: flavor.name, count: item.quantity }],
    };
  }

  if (countFlavors(item.flavors) !== item.size) return null;
  const flavors: { name: string; count: number }[] = [];
  for (const [id, count] of Object.entries(item.flavors)) {
    if (count === 0) continue;
    const flavor = getFlavor(id);
    if (!flavor || !flavor.available) return null;
    flavors.push({ name: flavor.name, count });
  }
  return {
    kind: "box",
    label: boxLabel(item.size),
    quantity: item.quantity,
    unitCents: boxCents(item.size),
    lineCents: lineTotalCents(item),
    flavors,
  };
}

export class OrderItemsError extends Error {}

/** Server-side: validates every line and recomputes the total from scratch. */
export function snapshotItems(items: CartItem[]): {
  items: OrderItemSnapshot[];
  totalCents: number;
} {
  const snapshots: OrderItemSnapshot[] = [];
  for (const item of items) {
    const snapshot = snapshotItem(item);
    if (!snapshot) {
      throw new OrderItemsError(
        "Something in your order is no longer available. Please review your cart.",
      );
    }
    snapshots.push(snapshot);
  }
  return { items: snapshots, totalCents: cartSubtotalCents(items) };
}

/** Drops anything stale or tampered with from a persisted cart. */
export function sanitizeCartItems(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  const clean: CartItem[] = [];
  for (const entry of raw) {
    const parsed = cartItemSchema.safeParse(entry);
    if (parsed.success && snapshotItem(parsed.data)) clean.push(parsed.data);
  }
  return clean;
}
