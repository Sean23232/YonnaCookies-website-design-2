import { site } from "../data/site";
import { formatPickupDate } from "./dates";
import { formatPrice } from "./pricing";
import type { OrderItemSnapshot, OrderSummary } from "./types";

export function describeItemLine(item: OrderItemSnapshot): string {
  if (item.kind === "single") {
    return `${item.quantity} × ${item.label} (${formatPrice(item.lineCents)})`;
  }
  const mix = item.flavors.map((flavor) => `${flavor.count} ${flavor.name}`).join(", ");
  return `${item.quantity} × ${item.label}: ${mix} (${formatPrice(item.lineCents)})`;
}

/** A neat plain-text order summary, ready to paste into an Instagram DM. */
export function formatOrderText(order: OrderSummary): string {
  const lines: string[] = [`🍪 ${site.name} order request`, ""];
  lines.push(`Name: ${order.name}`);
  if (order.phone) lines.push(`Phone: ${order.phone}`);
  if (order.instagram) lines.push(`Instagram: ${order.instagram.startsWith("@") ? order.instagram : `@${order.instagram}`}`);
  if (order.email) lines.push(`Email: ${order.email}`);
  lines.push(`Pickup: ${formatPickupDate(order.pickupDate)}, ${order.pickupTime}`);
  lines.push(`Occasion: ${order.occasion}`, "");

  if (order.items.length === 0) {
    lines.push("Order: custom order request (see notes)");
  } else {
    lines.push("Order:");
    for (const item of order.items) lines.push(`• ${describeItemLine(item)}`);
    lines.push("", `Total: ${formatPrice(order.totalCents)}`);
  }

  if (order.notes) lines.push("", `Notes: ${order.notes}`);
  if (order.id) lines.push("", `Order #${order.id.slice(0, 8).toUpperCase()}`);
  return lines.join("\n");
}
