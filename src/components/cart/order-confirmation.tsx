"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { InstagramIcon } from "@/components/ui/icons";
import { OrderLines } from "@/components/cart/order-lines";
import { Confetti } from "@/components/cart/confetti";
import { Button, buttonClasses } from "@/components/ui/button";
import { site } from "@/data/site";
import { formatPickupDate } from "@/lib/dates";
import { formatOrderText } from "@/lib/order-text";
import type { OrderSummary } from "@/lib/types";
import { toast } from "@/store/toast";

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers / non-secure contexts.
    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(area);
      return ok;
    } catch {
      return false;
    }
  }
}

export function OrderConfirmation({ order, onDone }: { order: OrderSummary; onDone: () => void }) {
  const [copied, setCopied] = useState(false);
  const firstName = order.name.trim().split(/\s+/)[0] ?? order.name;

  const copy = async () => {
    const ok = await copyText(formatOrderText(order));
    if (ok) {
      setCopied(true);
      toast({ title: "Order copied!", description: "Paste it into your Instagram DM." });
      setTimeout(() => setCopied(false), 2500);
    } else {
      toast({ title: "Couldn't copy", description: "Please copy your order summary manually.", variant: "error" });
    }
  };

  return (
    <div className="space-y-5 pt-1 text-center">
      <Confetti />
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blush text-3xl" aria-hidden>
        🍪
      </div>
      <div>
        <h3 className="text-2xl font-bold sm:text-3xl">Thank you, {firstName}!</h3>
        <p className="mt-2 text-lg">
          Your order request is in 🍪 I&apos;ll reach out to confirm soon.
        </p>
      </div>

      <div className="rounded-2xl bg-cream p-4 text-left text-sm">
        <p>
          <span className="font-bold text-cocoa">Pickup:</span> {formatPickupDate(order.pickupDate)} · {order.pickupTime}
        </p>
        <p>
          <span className="font-bold text-cocoa">Occasion:</span> {order.occasion}
        </p>
        {order.id ? (
          <p>
            <span className="font-bold text-cocoa">Order #</span>
            {order.id.slice(0, 8).toUpperCase()}
          </p>
        ) : null}
      </div>

      <div className="text-left">
        <OrderLines items={order.items} totalCents={order.totalCents} />
        <p className="mt-3 text-sm">{site.ordering.paymentNote}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button variant="secondary" size="lg" onClick={copy}>
          {copied ? <Check className="h-5 w-5" aria-hidden /> : <Copy className="h-5 w-5" aria-hidden />}
          {copied ? "Copied!" : "Copy my order"}
        </Button>
        <a
          href={site.instagram.dmUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses({ size: "lg" })}
        >
          <InstagramIcon className="h-5 w-5" /> Message on Instagram
        </a>
      </div>
      <p className="text-sm">
        Instagram can&apos;t pre-fill messages, so tap <strong className="text-cocoa">Copy my order</strong> first, then
        paste it into the DM.
      </p>
      <Button variant="ghost" onClick={onDone}>
        Back to the cookies
      </Button>
    </div>
  );
}
