"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Scallop } from "@/components/ui/decor";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { pricing, pricingCards } from "@/data/pricing";
import { boxCents, boxSavingsCents, formatPrice, perCookieLabel, singleCents } from "@/lib/pricing";
import { cn, scrollToSection } from "@/lib/utils";
import { useUI } from "@/store/ui";

export function PricingSection() {
  const openBox = useUI((state) => state.openBox);

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="relative bg-blush py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="pricing-title"
          eyebrow="sweet deals"
          title="Pick Your Box"
          subtitle={pricing.studentNote}
        />

        <ul className="grid items-stretch gap-6 md:grid-cols-3">
          {pricingCards.map((card, index) => {
            const isBox = card.size !== 1;
            const price = isBox ? boxCents(card.size as 6 | 12) : singleCents();
            const featured = card.tag === "Most Popular";
            const savings = isBox ? boxSavingsCents(card.size as 6 | 12) : 0;
            return (
              <li key={card.id} className={cn(featured && "md:-my-3")}>
                <Reveal delay={index * 0.1} className="h-full">
                  <article
                    className={cn(
                      "relative flex h-full flex-col rounded-3xl bg-card p-7 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift motion-reduce:hover:translate-y-0",
                      featured && "ring-4 ring-berry/70",
                    )}
                  >
                    {card.tag ? (
                      <span
                        className={cn(
                          "absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1 text-sm font-bold",
                          featured ? "bg-berry text-white" : "bg-butter text-cocoa",
                        )}
                      >
                        {card.tag}
                      </span>
                    ) : null}
                    <h3 className="text-2xl font-bold">{card.title}</h3>
                    <p className="mt-4 flex items-baseline gap-2">
                      <span className="font-heading text-5xl font-bold text-cocoa">{formatPrice(price)}</span>
                      {isBox ? (
                        <span className="text-sm font-bold">{perCookieLabel(card.size as 6 | 12)}</span>
                      ) : (
                        <span className="text-sm font-bold">each</span>
                      )}
                    </p>
                    <p className="mt-3 flex-1 leading-relaxed">{card.description}</p>
                    <ul className="mt-5 space-y-2 text-sm font-semibold text-cocoa">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-berry" aria-hidden />
                        {isBox ? `${card.size} cookies, any flavor mix` : "Pick any flavor"}
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-berry" aria-hidden />
                        Baked fresh for your pickup
                      </li>
                      {savings > 0 ? (
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-berry" aria-hidden />
                          Save {formatPrice(savings)} vs. singles
                        </li>
                      ) : null}
                    </ul>
                    <Button
                      className="mt-7"
                      fullWidth
                      variant={featured ? "primary" : "secondary"}
                      onClick={() => (isBox ? openBox(card.size as 6 | 12) : scrollToSection("menu"))}
                      aria-label={`Choose ${card.title}`}
                    >
                      Choose
                    </Button>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>

        <Reveal className="mt-12 text-center">
          <p className="text-lg font-semibold text-cocoa">{pricing.occasionNote}</p>
        </Reveal>
      </div>
      <Scallop color="var(--color-blush)" />
    </section>
  );
}
