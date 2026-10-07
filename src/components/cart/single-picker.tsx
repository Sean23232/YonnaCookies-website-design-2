"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CookieImage } from "@/components/ui/cookie-image";
import { Modal } from "@/components/ui/modal";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { getFlavor } from "@/data/flavors";
import { MAX_LINE_QUANTITY, formatPrice, perCookieLabel, singleCents, singlesTotalCents } from "@/lib/pricing";
import type { Flavor } from "@/lib/types";
import { useCart } from "@/store/cart";
import { toast } from "@/store/toast";
import { useUI } from "@/store/ui";

/** Small selector that opens from a flavor card: how many singles? */
export function SinglePicker() {
  const flavorId = useUI((state) => state.singleFlavorId);
  const closeSingle = useUI((state) => state.closeSingle);
  const openBox = useUI((state) => state.openBox);
  const addSingle = useCart((state) => state.addSingle);

  const current = flavorId ? (getFlavor(flavorId) ?? null) : null;
  const [lastFlavor, setLastFlavor] = useState<Flavor | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [wasOpen, setWasOpen] = useState(false);

  // Keep showing the flavor during the exit animation and reset the stepper on open.
  if (current && current !== lastFlavor) setLastFlavor(current);
  const isOpen = current !== null;
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) setQuantity(1);
  }
  const flavor = current ?? lastFlavor;

  const add = () => {
    if (!flavor) return;
    addSingle(flavor.id, quantity);
    toast({ title: "Added!", description: `${quantity} × ${flavor.name} cookie${quantity === 1 ? "" : "s"}` });
    closeSingle();
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => !open && closeSingle()}
      title={flavor ? `Add ${flavor.name}` : "Add cookies"}
      description="Single cookies, baked fresh."
      footer={
        flavor ? (
          <Button fullWidth size="lg" onClick={add}>
            Add to Order · {formatPrice(singlesTotalCents(quantity))}
          </Button>
        ) : undefined
      }
    >
      {flavor ? (
        <div className="space-y-5 pt-1">
          <CookieImage
            src={flavor.image}
            alt={flavor.imageAlt ?? `${flavor.name} cookie`}
            sizes="(min-width: 640px) 32rem, 100vw"
            className="aspect-[16/10] w-full rounded-2xl"
          />
          <p>{flavor.description}</p>
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-blush/60 p-4">
            <div>
              <p className="font-bold text-cocoa">How many?</p>
              <p className="text-sm">{formatPrice(singleCents())} each</p>
            </div>
            <QuantityStepper
              value={quantity}
              min={1}
              max={MAX_LINE_QUANTITY}
              onChange={setQuantity}
              label={`${flavor.name} cookies`}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              closeSingle();
              openBox(6);
            }}
            className="w-full rounded-2xl border-2 border-dashed border-petal px-4 py-3 text-left text-sm transition hover:bg-blush/50"
          >
            <span className="font-bold text-cocoa">Want a better deal?</span> Build a Box of 6 for{" "}
            <span className="font-bold text-berry">{perCookieLabel(6)}</span> and mix your flavors →
          </button>
        </div>
      ) : null}
    </Modal>
  );
}
