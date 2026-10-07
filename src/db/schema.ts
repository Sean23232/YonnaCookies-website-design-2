import { date, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { OrderItemSnapshot } from "../lib/types";

/**
 * Customer order requests.
 * The public website can only INSERT (through POST /api/orders).
 * Reading and updating is only possible through the /api/admin/* routes,
 * which require the owner's signed-in session.
 */
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  customerName: text("customer_name").notNull(),
  phone: text("phone"),
  instagram: text("instagram"),
  email: text("email"),
  pickupDate: date("pickup_date", { mode: "string" }).notNull(),
  pickupTime: text("pickup_time"),
  occasion: text("occasion"),
  notes: text("notes"),
  items: jsonb("items").$type<OrderItemSnapshot[]>().notNull(),
  totalCents: integer("total_cents").notNull(),
  status: text("status").notNull().default("new"),
});

export type OrderRow = typeof orders.$inferSelect;
