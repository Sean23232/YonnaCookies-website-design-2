"use client";

import { Cookie, ListChecks, Package, Send } from "lucide-react";
import { Button, buttonClasses } from "@/components/ui/button";
import { InstagramIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { site } from "@/data/site";
import { useCartSummary } from "@/hooks/use-cart-summary";
import { scrollToSection } from "@/lib/utils";
import { useUI } from "@/store/ui";

const steps = [
  { icon: ListChecks, title: "Pick your flavors", text: "Browse the menu and choose the cookies you love." },
  { icon: Package, title: "Choose your size", text: "Grab singles, a box of 6, or a dozen." },
  {
    icon: Send,
    title: "Send your order request",
    text: `Use the order form, or just DM ${site.instagram.handle}.`,
  },
  { icon: Cookie, title: "Pick up your fresh cookies 🍪", text: "I'll confirm your pickup time. Then enjoy!" },
];

export function HowToOrder() {
  const openCheckout = useUI((state) => state.openCheckout);
  const { count } = useCartSummary();

  return (
    <section id="how-to-order" aria-labelledby="how-title" className="relative bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="how-title"
          eyebrow="easy peasy"
          title="How to Order"
          subtitle="Four simple steps from craving to cookie."
        />

        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title}>
              <Reveal delay={index * 0.08} className="h-full">
                <div className="relative h-full rounded-3xl bg-card p-6 pt-9 shadow-soft">
                  <span
                    aria-hidden
                    className="absolute -top-4 left-6 grid h-9 w-9 place-items-center rounded-full bg-berry font-heading text-lg font-bold text-white shadow-soft"
                  >
                    {index + 1}
                  </span>
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-blush text-berry">
                    <step.icon className="h-7 w-7" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-xl font-bold">
                    <span className="sr-only">Step {index + 1}: </span>
                    {step.title}
                  </h3>
                  <p className="mt-2 leading-relaxed">{step.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            onClick={() => (count > 0 ? openCheckout(false) : scrollToSection("menu"))}
          >
            {count > 0 ? "Send my order request" : "Start my order"}
          </Button>
          <a
            href={site.instagram.dmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses({ size: "lg", variant: "secondary" })}
          >
            <InstagramIcon className="h-5 w-5" /> Order through Instagram DM
          </a>
        </Reveal>
      </div>
    </section>
  );
}
