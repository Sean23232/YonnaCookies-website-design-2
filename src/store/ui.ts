import { create } from "zustand";
import type { BoxSize } from "../lib/types";

type UIState = {
  cartOpen: boolean;
  menuOpen: boolean;
  boxSize: BoxSize | null;
  singleFlavorId: string | null;
  checkoutOpen: boolean;
  /** True when opened from "Request a Custom Order". */
  checkoutCustom: boolean;
  setCartOpen: (open: boolean) => void;
  setMenuOpen: (open: boolean) => void;
  openBox: (size: BoxSize) => void;
  closeBox: () => void;
  openSingle: (flavorId: string) => void;
  closeSingle: () => void;
  openCheckout: (custom?: boolean) => void;
  closeCheckout: () => void;
};

export const useUI = create<UIState>()((set) => ({
  cartOpen: false,
  menuOpen: false,
  boxSize: null,
  singleFlavorId: null,
  checkoutOpen: false,
  checkoutCustom: false,
  setCartOpen: (open) => set({ cartOpen: open }),
  setMenuOpen: (open) => set({ menuOpen: open }),
  openBox: (size) => set({ boxSize: size }),
  closeBox: () => set({ boxSize: null }),
  openSingle: (flavorId) => set({ singleFlavorId: flavorId }),
  closeSingle: () => set({ singleFlavorId: null }),
  openCheckout: (custom = false) =>
    set({ checkoutOpen: true, checkoutCustom: custom, cartOpen: false, menuOpen: false }),
  closeCheckout: () => set({ checkoutOpen: false }),
}));
