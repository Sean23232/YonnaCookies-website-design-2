"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { buttonClasses } from "@/components/ui/button";
import { CookieImage } from "@/components/ui/cookie-image";
import { InstagramIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { gallery } from "@/data/gallery";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

function Lightbox({ index, onChange }: { index: number | null; onChange: (index: number | null) => void }) {
  const open = index !== null;
  const [last, setLast] = useState(0);
  if (index !== null && index !== last) setLast(index);
  const current = index ?? last;
  const count = gallery.length;

  const go = useCallback(
    (delta: number) => onChange((current + delta + count) % count),
    [current, count, onChange],
  );

  // Keyboard arrows (Esc is handled by the dialog).
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  const image = gallery[current];

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onChange(null)}>
      <AnimatePresence>
        {open && image ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-cocoa/90 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <motion.div
                className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 p-4"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
              >
                <Dialog.Title className="sr-only">
                  Photo {current + 1} of {count}: {image.alt}
                </Dialog.Title>
                <Dialog.Close
                  aria-label="Close photo viewer"
                  className="absolute right-4 top-4 z-10 grid h-12 w-12 place-items-center rounded-full bg-card text-cocoa shadow-lift"
                >
                  <X className="h-6 w-6" aria-hidden />
                </Dialog.Close>

                <motion.div
                  key={current}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.5}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -60) go(1);
                    else if (info.offset.x > 60) go(-1);
                  }}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative h-[68dvh] w-full max-w-4xl cursor-grab touch-pan-y active:cursor-grabbing"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1024px) 56rem, 100vw"
                    draggable={false}
                    className="select-none rounded-3xl object-contain"
                  />
                </motion.div>

                <p className="max-w-xl text-center text-sm text-cream" aria-live="polite">
                  {image.alt} · {current + 1} / {count}
                </p>

                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous photo"
                  className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-card/95 text-cocoa shadow-lift transition hover:bg-card sm:left-6"
                >
                  <ChevronLeft className="h-6 w-6" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next photo"
                  className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-card/95 text-cocoa shadow-lift transition hover:bg-card sm:right-6"
                >
                  <ChevronRight className="h-6 w-6" aria-hidden />
                </button>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}

export function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="relative bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="gallery-title"
          eyebrow="fresh from the oven"
          title="Gallery"
          subtitle="A peek at what's coming out of the kitchen."
        />

        <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {gallery.map((image, index) => (
            <li key={image.src} className={cn(index === 0 && "col-span-2 row-span-2")}>
              <Reveal delay={(index % 3) * 0.07} className="h-full">
                <button
                  type="button"
                  onClick={() => setSelected(index)}
                  aria-label={`Enlarge photo: ${image.alt}`}
                  className="group relative block h-full w-full overflow-hidden rounded-3xl shadow-soft"
                >
                  <CookieImage
                    src={image.src}
                    alt={image.alt}
                    sizes={index === 0 ? "(min-width: 768px) 44vw, 92vw" : "(min-width: 768px) 22vw, 46vw"}
                    className={cn("w-full", index === 0 ? "aspect-square" : "aspect-square")}
                    imgClassName="transition duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-caramel/45 to-transparent opacity-0 transition duration-300 group-hover:opacity-100"
                  />
                </button>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-10 text-center">
          <a
            href={site.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses({ size: "lg" })}
          >
            <InstagramIcon className="h-5 w-5" /> Follow {site.instagram.handle} on Instagram
          </a>
        </Reveal>
      </div>

      <Lightbox index={selected} onChange={setSelected} />
    </section>
  );
}
