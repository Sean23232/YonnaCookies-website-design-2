import { desc } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { isAdminRequest } from "@/lib/admin-auth";
import type { AdminOrder, OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

/** Owner only: newest orders first. */
export async function GET() {
  if (!(await isAdminRequest())) {
    return Response.json({ error: "Not signed in" }, { status: 401 });
  }

  const rows = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(500);
  const data: AdminOrder[] = rows.map((row) => ({
    id: row.id,
    createdAt: row.createdAt.toISOString(),
    customerName: row.customerName,
    phone: row.phone,
    instagram: row.instagram,
    email: row.email,
    pickupDate: row.pickupDate,
    pickupTime: row.pickupTime,
    occasion: row.occasion,
    notes: row.notes,
    items: row.items,
    totalCents: row.totalCents,
    status: row.status as OrderStatus,
  }));

  return Response.json({ orders: data });
}
