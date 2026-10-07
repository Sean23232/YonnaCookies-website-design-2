export type Flavor = {
  id: string;
  name: string;
  description: string;
  /** Path under /public. Leave undefined to show the cream-and-pink placeholder. */
  image?: string;
  imageAlt?: string;
  /** Accent colour used for small details on the card. */
  accent: string;
  available: boolean;
  badge?: string;
};

export type BoxSize = 6 | 12;
export type FlavorCounts = Record<string, number>;

export type SingleCartItem = {
  id: string;
  kind: "single";
  flavorId: string;
  quantity: number;
};

export type BoxCartItem = {
  id: string;
  kind: "box";
  size: BoxSize;
  flavors: FlavorCounts;
  quantity: number;
};

export type CartItem = SingleCartItem | BoxCartItem;

export const ORDER_STATUSES = [
  "new",
  "confirmed",
  "baking",
  "ready",
  "picked_up",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  new: "New",
  confirmed: "Confirmed",
  baking: "Baking",
  ready: "Ready",
  picked_up: "Picked up",
  cancelled: "Cancelled",
};

/** A frozen, human-readable copy of a cart line, stored with each order. */
export type OrderItemSnapshot = {
  kind: "single" | "box";
  label: string;
  quantity: number;
  unitCents: number;
  lineCents: number;
  flavors: { name: string; count: number }[];
};

export type OrderSummary = {
  id?: string;
  name: string;
  phone?: string;
  instagram?: string;
  email?: string;
  pickupDate: string;
  pickupTime: string;
  occasion: string;
  notes?: string;
  items: OrderItemSnapshot[];
  totalCents: number;
};

export type AdminOrder = {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string | null;
  instagram: string | null;
  email: string | null;
  pickupDate: string;
  pickupTime: string | null;
  occasion: string | null;
  notes: string | null;
  items: OrderItemSnapshot[];
  totalCents: number;
  status: OrderStatus;
};
