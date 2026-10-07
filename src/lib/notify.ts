import { formatOrderText } from "./order-text";
import type { OrderSummary } from "./types";

/**
 * Emails My'onna when a new order arrives (via Resend, https://resend.com).
 *
 * To turn this on, set these environment variables:
 *   RESEND_API_KEY  – your Resend API key
 *   OWNER_EMAIL     – where order emails should be delivered
 *   RESEND_FROM     – (optional) e.g. "YonnaCookies_ <orders@yourdomain.com>"
 *
 * If they are missing this does nothing (it only logs), and it never throws,
 * so a notification problem can never stop a customer from ordering.
 * The key is only ever read on the server.
 */
export async function notifyOwnerOfOrder(order: OrderSummary): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.OWNER_EMAIL;

  if (!apiKey || !to) {
    console.info(
      `[orders] Order ${order.id ?? ""} saved. Email notifications are off (set RESEND_API_KEY and OWNER_EMAIL to enable).`,
    );
    return;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.RESEND_FROM ?? "YonnaCookies_ <onboarding@resend.dev>",
        to: [to],
        subject: `New cookie order from ${order.name}`,
        text: formatOrderText(order),
        ...(order.email ? { reply_to: order.email } : {}),
      }),
    });
    if (!response.ok) {
      console.error(`[orders] Email notification failed (${response.status}): ${await response.text()}`);
    }
  } catch (error) {
    console.error("[orders] Email notification error:", error);
  }
}
