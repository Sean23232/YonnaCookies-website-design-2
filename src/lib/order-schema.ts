import { z } from "zod";
import { site } from "../data/site";
import { formatPickupDate } from "./dates";
import { MAX_LINE_QUANTITY } from "./pricing";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const INSTAGRAM_RE = /^@?[A-Za-z0-9._]{1,30}$/;

type FormOptions = {
  /** Earliest allowed pickup date (YYYY-MM-DD). */
  minDate: string;
  /** Latest allowed pickup date (YYYY-MM-DD). */
  maxDate?: string;
  /** Require notes (used for custom orders with an empty cart). */
  requireNotes?: boolean;
};

/**
 * The customer details form. Shared by the browser form and the server API
 * so both enforce identical rules. All fields are plain strings (use "" for
 * "not provided") which keeps react-hook-form happy.
 */
export function buildOrderFormSchema({ minDate, maxDate, requireNotes = false }: FormOptions) {
  return z
    .object({
      name: z
        .string()
        .trim()
        .min(2, "Please enter your name")
        .max(80, "That name is a little long, please shorten it"),
      phone: z
        .string()
        .trim()
        .max(30, "That phone number looks too long")
        .refine((value) => {
          if (value === "") return true;
          const digits = value.replace(/\D/g, "").length;
          return digits >= 7 && digits <= 15 && /^[+\d\s().-]+$/.test(value);
        }, "Please enter a valid phone number"),
      instagram: z
        .string()
        .trim()
        .refine(
          (value) => value === "" || INSTAGRAM_RE.test(value),
          "Instagram handles use letters, numbers, periods and underscores",
        ),
      email: z
        .string()
        .trim()
        .max(120, "That email looks too long")
        .refine((value) => value === "" || EMAIL_RE.test(value), "Please enter a valid email address"),
      pickupDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a pickup date")
        .refine(
          (value) => value >= minDate,
          `Pickup must be on or after ${formatPickupDate(minDate)}`,
        )
        .refine((value) => !maxDate || value <= maxDate, "Please choose a date within the next year"),
      pickupTime: z
        .string()
        .refine(
          (value) => (site.ordering.pickupWindows as readonly string[]).includes(value),
          "Please choose a pickup time window",
        ),
      occasion: z
        .string()
        .refine(
          (value) => (site.ordering.occasions as readonly string[]).includes(value),
          "Please choose an occasion",
        ),
      notes: z
        .string()
        .trim()
        .max(1000, "Notes can be up to 1,000 characters")
        .refine(
          (value) => !requireNotes || value.length >= 10,
          "Tell me a little about your custom order (a sentence or two is perfect)",
        ),
    })
    .superRefine((value, ctx) => {
      if (value.phone === "" && value.instagram === "") {
        ctx.addIssue({
          code: "custom",
          path: ["phone"],
          message: "Add a phone number or Instagram handle so I can reach you",
        });
      }
    });
}

export type OrderFormValues = z.infer<ReturnType<typeof buildOrderFormSchema>>;

const flavorIdSchema = z.string().min(1).max(64);

export const cartItemSchema = z.discriminatedUnion("kind", [
  z.object({
    id: z.string().min(1).max(64),
    kind: z.literal("single"),
    flavorId: flavorIdSchema,
    quantity: z.number().int().min(1).max(MAX_LINE_QUANTITY),
  }),
  z.object({
    id: z.string().min(1).max(64),
    kind: z.literal("box"),
    size: z.union([z.literal(6), z.literal(12)]),
    flavors: z.record(flavorIdSchema, z.number().int().min(0).max(12)),
    quantity: z.number().int().min(1).max(MAX_LINE_QUANTITY),
  }),
]);

export const cartItemsSchema = z.array(cartItemSchema).max(30);

export const orderRequestSchema = z.object({
  customer: z.unknown(),
  items: cartItemsSchema,
  /** Honeypot. Real people never fill this in. */
  website: z.string().optional(),
});
