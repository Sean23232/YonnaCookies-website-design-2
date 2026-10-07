"use client";

import { ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CookieImage } from "@/components/ui/cookie-image";
import { Modal } from "@/components/ui/modal";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { BOX_IMAGE } from "@/data/images";
import { getFlavor } from "@/data/flavors";
import { pricing } from "@/data/pricing";
import { site } from "@/data/site";
import { useCartSummary } from "@/hooks/use-cart-summary";
import { snapshotItem } from "@/lib/order-items";
import { MAX_LINE_QUANTITY, formatPrice } from "@/lib/pricing";
import { scrollToSection } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";

export function CartDrawer() {
  const open = useUI((state) => state.cartOpen);
  const setOpen = useUI((state) => state.setCartOpen);
  const openCheckout = useUI((state) => state.openCheckout);
  const { items, subtotalCents, count } = useCartSummary();
  const setQuantity = useCart((state) => state.setQuantity);
  const remove = useCart((state) => state.remove);

  const browse = () => {
    setOpen(false);
    setTimeout(() => scrollToSection("menu"), 250);
  };

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      variant="drawer"
      title="Your Order"
      description={count > 0 ? `${count} item${count === 1 ? "" : "s"} in your cart` : undefined}
      footer={
        items.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-lg font-bold text-cocoa">
              <span>Subtotal</span>
              <span>{formatPrice(subtotalCents)}</span>
            </div>
            <p className="text-sm">{site.ordering.paymentNote}</p>
            <Button fullWidth size="lg" onClick={() => openCheckout(false)}>
              Checkout
            </Button>
            <Button fullWidth variant="ghost" size="sm" onClick={browse}>
              Keep browsing
            </Button>
          </div>
        ) : undefined
      }
    >
      {items.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center py-12 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-blush text-rose">
            <ShoppingBag className="h-9 w-9" aria-hidden />
          </span>
          <h3 className="mt-5 text-xl font-bold">Your cart is empty</h3>
          <p className="mt-2 max-w-xs">No cookies here yet, but they&apos;re baked fresh and waiting for you 🍪</p>
          <Button className="mt-6" onClick={browse}>
            See the menu
          </Button>
          <p className="mt-4 text-sm">{pricing.studentNote}</p>
        </div>
      ) : (
        <ul className="space-y-3 pt-1">
          {items.map((item) => {
            const snapshot = snapshotItem(item);
            if (!snapshot) return null;
            const flavor = item.kind === "single" ? getFlavor(item.flavorId) : undefined;
            return (
              <li key={item.id} className="flex gap-3 rounded-2xl bg-cream p-3">
                <CookieImage
                  src={flavor?.image ?? BOX_IMAGE}
                  alt={flavor?.imageAlt ?? "A box of homemade cookies"}
                  sizes="80px"
                  className="h-20 w-20 shrink-0 rounded-xl"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-cocoa">{snapshot.label}</p>
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      aria-label={`Remove ${snapshot.label} from cart`}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-mocha transition hover:bg-blush hover:text-berry"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                  {item.kind === "box" ? (
                    <p className="text-sm leading-snug">
                      {snapshot.flavors.map((f) => `${f.count} ${f.name}`).join(", ")}
                    </p>
                  ) : null}
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <QuantityStepper
                      size="sm"
                      min={1}
                      max={MAX_LINE_QUANTITY}
                      value={item.quantity}
                      onChange={(quantity) => setQuantity(item.id, quantity)}
                      label={`${snapshot.label} quantity`}
                    />
                    <span className="font-bold text-cocoa">{formatPrice(snapshot.lineCents)}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Modal>
  );
}
