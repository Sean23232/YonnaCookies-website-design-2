"use client";

import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Scallop, Sparkle } from "@/components/ui/decor";
import { Reveal } from "@/components/ui/reveal";
import { site } from "@/data/site";
import { useUI } from "@/store/ui";

export function CustomOrders() {
  const openCheckout = useUI((state) => state.openCheckout);

  return (
    <section id="custom" aria-labelledby="custom-title" className="relative bg-cream pb-20 sm:pb-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-petal/70 via-blush to-butter p-8 text-center shadow-soft sm:p-14">
            <Sparkle className="motion-safe-anim absolute left-6 top-6 h-7 w-7 animate-float text-berry/60" />
            <Sparkle className="motion-safe-anim absolute bottom-8 right-8 h-9 w-9 animate-float-slow text-caramel" />
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-card text-berry shadow-soft">
              <Gift className="h-8 w-8" aria-hidden />
            </span>
            <p className="mt-5 font-script text-2xl text-berry" aria-hidden>
              special occasions
            </p>
            <h2 id="custom-title" className="mt-1 text-3xl font-bold sm:text-4xl">
              Birthdays, grad parties, gifts, and events
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-cocoa">
              Planning something sweet? Tell me about it and we&apos;ll make it special.
            </p>
            <Button size="lg" className="mt-8" onClick={() => openCheckout(true)}>
              Request a Custom Order
            </Button>
            <p className="mt-5 text-sm font-bold text-cocoa">{site.ordering.largeOrderNote}</p>
          </div>
        </Reveal>
      </div>
      <Scallop color="var(--color-cream)" />
    </section>
  );
}
