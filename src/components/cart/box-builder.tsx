"use client";

import { Shuffle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CookieImage } from "@/components/ui/cookie-image";
import { Modal } from "@/components/ui/modal";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { availableFlavors } from "@/data/flavors";
import {
  boxCents,
  boxSavingsCents,
  countFlavors,
  formatPrice,
  isBoxComplete,
  perCookieLabel,
  surpriseFill,
} from "@/lib/pricing";
import type { BoxSize, FlavorCounts } from "@/lib/types";
import { useCart } from "@/store/cart";
import { toast } from "@/store/toast";
import { useUI } from "@/store/ui";

/** Pick exactly 6 or 12 cookies, then add the box at its fixed price. */
export function BoxBuilder() {
  const size = useUI((state) => state.boxSize);
  const closeBox = useUI((state) => state.closeBox);
  const addBox = useCart((state) => state.addBox);

  const [counts, setCounts] = useState<FlavorCounts>({});
  const [lastSize, setLastSize] = useState<BoxSize>(6);
  const [wasOpen, setWasOpen] = useState(false);

  const isOpen = size !== null;
  if (size && size !== lastSize) setLastSize(size);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) setCounts({});
  }
  const boxSize: BoxSize = size ?? lastSize;

  const total = countFlavors(counts);
  const complete = isBoxComplete(counts, boxSize);
  const remaining = boxSize - total;
  const savings = boxSavingsCents(boxSize);
  const title = boxSize === 12 ? "Build Your Dozen" : `Build Your Box of ${boxSize}`;

  const set = (id: string, value: number) => setCounts((prev) => ({ ...prev, [id]: value }));

  const add = () => {
    if (!complete) return;
    addBox(boxSize, counts);
    toast({ title: "Added!", description: `${boxSize === 12 ? "Dozen" : `Box of ${boxSize}`} is in your cart` });
    closeBox();
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => !open && closeBox()}
      title={title}
      description={`${formatPrice(boxCents(boxSize))} · ${perCookieLabel(boxSize)}${savings > 0 ? ` · save ${formatPrice(savings)}` : ""}`}
      footer={
        <div className="space-y-2">
          <Button fullWidth size="lg" disabled={!complete} onClick={add}>
            Add to Order · {formatPrice(boxCents(boxSize))}
          </Button>
          <p className="text-center text-sm" aria-live="polite">
            {complete
              ? "Your box is ready to go! 🍪"
              : `Choose ${remaining} more cookie${remaining === 1 ? "" : "s"} to complete your box.`}
          </p>
        </div>
      }
    >
      <div className="space-y-4 pt-1">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm font-bold text-cocoa">
            <span>
              {total} of {boxSize} chosen
            </span>
            <button
              type="button"
              onClick={() => setCounts({})}
              disabled={total === 0}
              className="text-berry underline-offset-2 hover:underline disabled:opacity-40"
            >
              Start over
            </button>
          </div>
          <div
            role="progressbar"
            aria-label="Box progress"
            aria-valuemin={0}
            aria-valuemax={boxSize}
            aria-valuenow={total}
            className="h-3 overflow-hidden rounded-full bg-blush"
          >
            <div
              className="h-full rounded-full bg-berry transition-all duration-300"
              style={{ width: `${Math.min(100, (total / boxSize) * 100)}%` }}
            />
          </div>
        </div>

        <Button
          variant="soft"
          fullWidth
          onClick={() =>
            setCounts(
              surpriseFill(
                boxSize,
                availableFlavors.map((flavor) => flavor.id),
              ),
            )
          }
        >
          <Shuffle className="h-4 w-4" aria-hidden /> Surprise me
        </Button>

        <ul className="space-y-2">
          {availableFlavors.map((flavor) => (
            <li key={flavor.id} className="flex items-center gap-3 rounded-2xl bg-cream p-2.5 pr-3">
              <CookieImage
                src={flavor.image}
                alt={flavor.imageAlt ?? flavor.name}
                sizes="64px"
                className="h-16 w-16 shrink-0 rounded-xl"
              />
              <div className="min-w-0 flex-1">
                <p className="font-bold leading-tight text-cocoa">{flavor.name}</p>
              </div>
              <QuantityStepper
                size="sm"
                value={counts[flavor.id] ?? 0}
                onChange={(value) => set(flavor.id, value)}
                max={boxSize}
                disableIncrease={total >= boxSize}
                label={flavor.name}
              />
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}
