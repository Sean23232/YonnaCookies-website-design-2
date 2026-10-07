import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { sanitizeCartItems } from "../lib/order-items";
import { MAX_LINE_QUANTITY } from "../lib/pricing";
import { makeId } from "../lib/utils";
import type { BoxSize, CartItem, FlavorCounts } from "../lib/types";

type CartState = {
  items: CartItem[];
  /** True once localStorage has been read (avoids hydration mismatches). */
  hydrated: boolean;
  addSingle: (flavorId: string, quantity: number) => void;
  addBox: (size: BoxSize, flavors: FlavorCounts, quantity?: number) => void;
  setQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

function boxSignature(size: BoxSize, flavors: FlavorCounts): string {
  const parts = Object.entries(flavors)
    .filter(([, count]) => count > 0)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([id, count]) => `${id}:${count}`);
  return `${size}|${parts.join(",")}`;
}

const clamp = (value: number) => Math.max(1, Math.min(MAX_LINE_QUANTITY, Math.floor(value)));

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      hydrated: false,

      addSingle: (flavorId, quantity) =>
        set((state) => {
          const existing = state.items.find(
            (item) => item.kind === "single" && item.flavorId === flavorId,
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === existing.id ? { ...item, quantity: clamp(item.quantity + quantity) } : item,
              ),
            };
          }
          const line: CartItem = { id: makeId(), kind: "single", flavorId, quantity: clamp(quantity) };
          return { items: [...state.items, line] };
        }),

      addBox: (size, flavors, quantity = 1) =>
        set((state) => {
          const cleaned = Object.fromEntries(
            Object.entries(flavors).filter(([, count]) => count > 0),
          );
          const signature = boxSignature(size, cleaned);
          const existing = state.items.find(
            (item) => item.kind === "box" && boxSignature(item.size, item.flavors) === signature,
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === existing.id ? { ...item, quantity: clamp(item.quantity + quantity) } : item,
              ),
            };
          }
          const line: CartItem = {
            id: makeId(),
            kind: "box",
            size,
            flavors: cleaned,
            quantity: clamp(quantity),
          };
          return { items: [...state.items, line] };
        }),

      setQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity < 1
              ? state.items.filter((item) => item.id !== id)
              : state.items.map((item) =>
                  item.id === id ? { ...item, quantity: clamp(quantity) } : item,
                ),
        })),

      remove: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),

      clear: () => set({ items: [] }),
    }),
    {
      name: "yonnacookies-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({ items: state.items }),
      merge: (persisted, current) => ({
        ...current,
        items: sanitizeCartItems((persisted as { items?: unknown } | undefined)?.items),
      }),
    },
  ),
);
