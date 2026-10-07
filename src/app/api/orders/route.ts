import { after } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { site } from "@/data/site";
import { addDays, earliestPickupDate, todayInTimezone } from "@/lib/dates";
import { notifyOwnerOfOrder } from "@/lib/notify";
import { OrderItemsError, snapshotItems } from "@/lib/order-items";
import { buildOrderFormSchema, orderRequestSchema } from "@/lib/order-schema";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import type { OrderSummary } from "@/lib/types";

export const dynamic = "force-dynamic";

function fail(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

/**
 * Public endpoint: the website can only CREATE orders here.
 * Everything is validated again on the server, and the total is recomputed
 * from the menu prices (never trusted from the browser).
 */
export async function POST(request: Request) {
  if (!rateLimit(`orders:${clientIp(request)}`, 15, 60 * 60 * 1000)) {
    return fail("You've sent a lot of orders recently. Please wait a bit or DM me on Instagram.", 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("That request didn't look right. Please try again.");
  }

  const parsed = orderRequestSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Your order looks incomplete. Please check your cart and try again.");
  }
  const { customer, items, website } = parsed.data;

  // Honeypot: pretend it worked so bots don't learn anything.
  if (website) return Response.json({ ok: true }, { status: 201 });

  const { timezone, leadDays, customOccasion } = site.ordering;
  const form = buildOrderFormSchema({
    minDate: earliestPickupDate(timezone, leadDays),
    maxDate: addDays(todayInTimezone(timezone), 365),
    requireNotes: items.length === 0,
  }).safeParse(customer);

  if (!form.success) {
    return fail(form.error.issues[0]?.message ?? "Please check your details and try again.");
  }
  const details = form.data;

  if (items.length === 0 && details.occasion !== customOccasion) {
    return fail("Your cart is empty. Add some cookies first!");
  }

  let snapshot: ReturnType<typeof snapshotItems>;
  try {
    snapshot = snapshotItems(items);
  } catch (error) {
    if (error instanceof OrderItemsError) return fail(error.message);
    throw error;
  }

  const instagram = details.instagram ? `@${details.instagram.replace(/^@/, "")}` : null;

  try {
    const [row] = await db
      .insert(orders)
      .values({
        customerName: details.name,
        phone: details.phone || null,
        instagram,
        email: details.email || null,
        pickupDate: details.pickupDate,
        pickupTime: details.pickupTime,
        occasion: details.occasion,
        notes: details.notes || null,
        items: snapshot.items,
        totalCents: snapshot.totalCents,
      })
      .returning({ id: orders.id });

    const order: OrderSummary = {
      id: row.id,
      name: details.name,
      phone: details.phone || undefined,
      instagram: instagram ?? undefined,
      email: details.email || undefined,
      pickupDate: details.pickupDate,
      pickupTime: details.pickupTime,
      occasion: details.occasion,
      notes: details.notes || undefined,
      items: snapshot.items,
      totalCents: snapshot.totalCents,
    };

    // Runs after the response is sent; failures are logged, never thrown.
    after(() => notifyOwnerOfOrder(order));

    return Response.json({ ok: true, order }, { status: 201 });
  } catch (error) {
    console.error("[orders] Could not save order:", error);
    return fail("We couldn't save your order just now. Your cart is safe, so please try again.", 500);
  }
}
