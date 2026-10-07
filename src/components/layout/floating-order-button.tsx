"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Cookie, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useCartSummary } from "@/hooks/use-cart-summary";
import { formatPrice } from "@/lib/pricing";
import { scrollToSection } from "@/lib/utils";
import { useUI } from "@/store/ui";

/** Mobile-only pill that appears once you scroll past the hero. */
export function FloatingOrderButton() {
  const [visible, setVisible] = useState(false);
  const { count, subtotalCents } = useCartSummary();
  const setCartOpen = useUI((state) => state.setCartOpen);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:hidden"
        >
          <button
            type="button"
            onClick={() => (count > 0 ? setCartOpen(true) : scrollToSection("menu"))}
            className="pointer-events-auto inline-flex h-14 items-center gap-2 rounded-full bg-berry px-7 text-lg font-bold text-white shadow-lift transition active:scale-95"
          >
            {count > 0 ? (
              <>
                <ShoppingBag className="h-5 w-5" aria-hidden /> View order · {count} · {formatPrice(subtotalCents)}
              </>
            ) : (
              <>
                <Cookie className="h-5 w-5" aria-hidden /> Order Now
              </>
            )}
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
