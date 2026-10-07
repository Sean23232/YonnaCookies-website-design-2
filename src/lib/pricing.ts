import { pricing } from "../data/pricing";
import type { BoxSize, CartItem, FlavorCounts } from "./types";

/** Maximum quantity for a single cart line. */
export const MAX_LINE_QUANTITY = 50;
export const BOX_SIZES: BoxSize[] = [6, 12];

/** Dollars -> whole cents, safe against floating point noise (0.1 + 0.2). */
export function toCents(dollars: number): number {
  return Math.round(dollars * 100);
}

function assertQuantity(quantity: number): void {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Quantity must be a whole number of at least 1");
  }
}

export function singleCents(): number {
  return toCents(pricing.singleCookie);
}

export function boxCents(size: BoxSize): number {
  return toCents(pricing.boxes[size]);
}

export function singlesTotalCents(quantity: number): number {
  assertQuantity(quantity);
  return singleCents() * quantity;
}

export function boxesTotalCents(size: BoxSize, quantity = 1): number {
  assertQuantity(quantity);
  return boxCents(size) * quantity;
}

/** Per-cookie price (cents, rounded) for a box. */
export function perCookieCents(size: BoxSize): number {
  return Math.round(boxCents(size) / size);
}

/** e.g. "$2.50 each" or "about $2.08 each". */
export function perCookieLabel(size: BoxSize): string {
  const exact = boxCents(size) % size === 0;
  return `${exact ? "" : "about "}${formatPrice(perCookieCents(size))} each`;
}

/** How much a box saves compared with buying the same number of singles. */
export function boxSavingsCents(size: BoxSize): number {
  return Math.max(0, singleCents() * size - boxCents(size));
}

export function lineTotalCents(item: CartItem): number {
  return item.kind === "single"
    ? singlesTotalCents(item.quantity)
    : boxesTotalCents(item.size, item.quantity);
}

/** Subtotal = sum of line items. No tax or fees. */
export function cartSubtotalCents(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + lineTotalCents(item), 0);
}

export function countFlavors(counts: FlavorCounts): number {
  return Object.values(counts).reduce((sum, count) => sum + count, 0);
}

/** Total number of cookies in the cart (boxes count as their size). */
export function cartCookieCount(items: CartItem[]): number {
  return items.reduce(
    (sum, item) =>
      sum + (item.kind === "single" ? item.quantity : item.size * item.quantity),
    0,
  );
}

/** Number of cart lines' quantities (what the navbar badge shows). */
export function cartItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function isBoxComplete(counts: FlavorCounts, size: BoxSize): boolean {
  const values = Object.values(counts);
  return (
    values.every((count) => Number.isInteger(count) && count >= 0) &&
    countFlavors(counts) === size
  );
}

/** Randomly fills a box of `size` cookies across the given flavors. */
export function surpriseFill(
  size: BoxSize,
  flavorIds: string[],
  random: () => number = Math.random,
): FlavorCounts {
  const counts: FlavorCounts = Object.fromEntries(flavorIds.map((id) => [id, 0]));
  if (flavorIds.length === 0) return counts;
  for (let i = 0; i < size; i += 1) {
    const index = Math.min(flavorIds.length - 1, Math.floor(random() * flavorIds.length));
    counts[flavorIds[index]] += 1;
  }
  return counts;
}

/** "$3", "$15", "$2.50". Whole dollars drop the decimals. */
export function formatPrice(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const remainder = abs % 100;
  return remainder === 0
    ? `${sign}$${dollars}`
    : `${sign}$${dollars}.${String(remainder).padStart(2, "0")}`;
}
