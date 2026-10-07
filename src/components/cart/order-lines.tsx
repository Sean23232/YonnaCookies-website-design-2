import { formatPrice } from "@/lib/pricing";
import type { OrderItemSnapshot } from "@/lib/types";

/** Read-only list of order lines with a total. */
export function OrderLines({ items, totalCents }: { items: OrderItemSnapshot[]; totalCents: number }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl bg-blush/60 p-4 text-sm">
        <p className="font-bold text-cocoa">Custom order request</p>
        <p className="mt-1">Tell me what you have in mind in the notes and I&apos;ll follow up with details and a price.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-blush/60 p-4">
      <ul className="divide-y divide-petal/50">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-start justify-between gap-3 py-2.5">
            <div className="min-w-0">
              <p className="font-bold text-cocoa">
                {item.quantity} × {item.label}
              </p>
              {item.kind === "box" ? (
                <p className="text-sm">
                  {item.flavors.map((flavor) => `${flavor.count} ${flavor.name}`).join(", ")}
                </p>
              ) : null}
            </div>
            <span className="shrink-0 font-bold text-cocoa">{formatPrice(item.lineCents)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex items-center justify-between border-t border-petal/70 pt-3 text-lg font-bold text-cocoa">
        <span>Total</span>
        <span>{formatPrice(totalCents)}</span>
      </div>
    </div>
  );
}
