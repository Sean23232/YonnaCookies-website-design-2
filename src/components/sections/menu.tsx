"use client";

import { Button } from "@/components/ui/button";
import { CookieImage } from "@/components/ui/cookie-image";
import { Scallop } from "@/components/ui/decor";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { flavors } from "@/data/flavors";
import { formatPrice, singleCents } from "@/lib/pricing";
import { useUI } from "@/store/ui";

export function MenuSection() {
  const openSingle = useUI((state) => state.openSingle);

  return (
    <section id="menu" aria-labelledby="menu-title" className="relative bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="menu-title"
          eyebrow="baked fresh"
          title="Our Cookies"
          subtitle="Four homemade flavors, each one soft, generous and made with care."
        />

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {flavors.map((flavor, index) => (
            <li key={flavor.id}>
              <Reveal delay={index * 0.08} className="h-full">
                <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-card shadow-soft transition duration-300 hover:-translate-y-1.5 hover:shadow-lift motion-reduce:hover:translate-y-0">
                  <div className="relative">
                    <CookieImage
                      src={flavor.image}
                      alt={flavor.imageAlt ?? `${flavor.name} cookies`}
                      sizes="(min-width: 1024px) 24vw, (min-width: 640px) 46vw, 92vw"
                      className="aspect-[4/5]"
                      imgClassName="transition duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100"
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-caramel/35 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100"
                    />
                    {flavor.badge ? (
                      <span className="absolute left-3 top-3 rounded-full bg-butter px-3 py-1 text-xs font-bold text-cocoa shadow-soft">
                        {flavor.badge}
                      </span>
                    ) : null}
                    <span
                      aria-hidden
                      className="absolute bottom-3 right-3 h-3 w-3 rounded-full ring-4 ring-card/80"
                      style={{ background: flavor.accent }}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-2xl font-bold">{flavor.name}</h3>
                    <p className="mt-2 flex-1 leading-relaxed">{flavor.description}</p>
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <p className="text-sm">
                        From <span className="text-xl font-bold text-cocoa">{formatPrice(singleCents())}</span>
                      </p>
                      {flavor.available ? (
                        <Button size="sm" onClick={() => openSingle(flavor.id)} aria-label={`Add ${flavor.name} to order`}>
                          Add to Order
                        </Button>
                      ) : (
                        <Button size="sm" variant="soft" disabled>
                          Sold out
                        </Button>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
      <Scallop color="var(--color-cream)" />
    </section>
  );
}
