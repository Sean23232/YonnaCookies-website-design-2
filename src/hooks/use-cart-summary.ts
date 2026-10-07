"use client";

import { useMemo } from "react";
import { cartItemCount, cartSubtotalCents } from "@/lib/pricing";
import { useCart } from "@/store/cart";

/** Cart numbers that are safe to render during SSR/hydration (zero until loaded). */
export function useCartSummary() {
  const items = useCart((state) => state.items);
  const hydrated = useCart((state) => state.hydrated);

  return useMemo(() => {
    const visible = hydrated ? items : [];
    return {
      hydrated,
      items: visible,
      count: cartItemCount(visible),
      subtotalCents: cartSubtotalCents(visible),
    };
  }, [items, hydrated]);
}
