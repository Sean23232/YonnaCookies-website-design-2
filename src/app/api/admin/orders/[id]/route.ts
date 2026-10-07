import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { isAdminRequest, isJsonRequest } from "@/lib/admin-auth";
import { ORDER_STATUSES } from "@/lib/types";

export const dynamic = "force-dynamic";

const bodySchema = z.object({ status: z.enum(ORDER_STATUSES) });
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Owner only: change an order's status. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) return Response.json({ error: "Not signed in" }, { status: 401 });
  if (!isJsonRequest(request)) return Response.json({ error: "Bad request" }, { status: 415 });

  const { id } = await params;
  if (!UUID_RE.test(id)) return Response.json({ error: "Order not found" }, { status: 404 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid status" }, { status: 400 });

  const updated = await db
    .update(orders)
    .set({ status: parsed.data.status })
    .where(eq(orders.id, id))
    .returning({ id: orders.id, status: orders.status });

  if (updated.length === 0) return Response.json({ error: "Order not found" }, { status: 404 });
  return Response.json({ ok: true, order: updated[0] });
}
