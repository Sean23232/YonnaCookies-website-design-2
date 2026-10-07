"use client";

import { motion } from "framer-motion";
import { Cookie } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { CookieImage } from "@/components/ui/cookie-image";
import { Sparkle, Sprinkles } from "@/components/ui/decor";
import { HERO_IMAGES } from "@/data/images";
import { site } from "@/data/site";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

function RotatingBadge() {
  return (
    <div
      role="img"
      aria-label="Baked fresh, homemade, made with care"
      className="relative grid h-28 w-28 place-items-center rounded-full bg-card shadow-lift sm:h-32 sm:w-32"
    >
      <svg viewBox="0 0 120 120" aria-hidden className="motion-safe-anim absolute inset-0 animate-spin-slow">
        <defs>
          <path id="badge-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
        </defs>
        <text fontSize="9.5" fontWeight="700" fill="#5C3B2E" textLength="272" lengthAdjust="spacing">
          <textPath href="#badge-circle">Baked fresh • Homemade • Made with care • </textPath>
        </text>
      </svg>
      <Cookie className="h-9 w-9 text-berry" aria-hidden />
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden">
      <div aria-hidden className="crumbs absolute inset-0 opacity-70" />
      <Sprinkles />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-8 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8 lg:pb-28 lg:pt-14">
        <div>
          <motion.p
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="inline-flex items-center gap-2 font-script text-2xl text-berry"
          >
            <Sparkle className="h-4 w-4" /> fresh baked
          </motion.p>
          <motion.h1
            id="hero-title"
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-2 text-[2.9rem] font-bold leading-[1.04] sm:text-6xl lg:text-7xl"
          >
            Fresh. Homemade.{" "}
            <span className="text-berry">Made with love.</span>
          </motion.h1>
          <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show" className="mt-6 max-w-xl space-y-2 text-lg sm:text-xl">
            <p className="font-bold text-cocoa">{site.tagline}</p>
            <p>Strawberry, Red Velvet, Cookies &amp; Cream, and Cookie Monster.</p>
          </motion.div>
          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show" className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#menu" className={buttonClasses({ size: "lg" })}>
              Order Now
            </a>
            <a href="#how-to-order" className={buttonClasses({ size: "lg", variant: "secondary" })}>
              See How to Order
            </a>
          </motion.div>
          <motion.ul
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-cocoa"
          >
            <li>🍪 Homemade</li>
            <li aria-hidden>•</li>
            <li>🌸 Fresh batches</li>
            <li aria-hidden>•</li>
            <li>💛 Student-friendly prices</li>
          </motion.ul>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto aspect-square w-full max-w-md sm:max-w-lg"
        >
          <div className="absolute right-0 top-0 w-[68%] rotate-3 overflow-hidden rounded-[2rem] border-[6px] border-card shadow-lift">
            <CookieImage
              src={HERO_IMAGES.main}
              alt="Four flavors of homemade cookies laid out on parchment paper"
              sizes="(min-width: 1024px) 28vw, 60vw"
              className="aspect-[4/5]"
              priority
            />
          </div>
          <div className="absolute left-0 top-[36%] w-[46%] -rotate-6 overflow-hidden rounded-[1.75rem] border-[6px] border-card shadow-lift">
            <CookieImage
              src={HERO_IMAGES.left}
              alt="Cookies and cream cookies drizzled with white chocolate"
              sizes="(min-width: 1024px) 20vw, 40vw"
              className="aspect-square"
            />
          </div>
          <div className="absolute bottom-0 right-[8%] w-[42%] rotate-6 overflow-hidden rounded-[1.75rem] border-[6px] border-card shadow-lift">
            <CookieImage
              src={HERO_IMAGES.right}
              alt="Soft red velvet cookies with white chocolate chips"
              sizes="(min-width: 1024px) 18vw, 36vw"
              className="aspect-square"
            />
          </div>
          <div className="absolute left-[2%] top-0">
            <RotatingBadge />
          </div>
          <Sparkle className="motion-safe-anim absolute right-[-2%] top-[52%] h-8 w-8 animate-float text-caramel" />
          <Sparkle className="motion-safe-anim absolute bottom-[10%] left-[8%] h-6 w-6 animate-float-slow text-rose" />
        </motion.div>
      </div>
    </section>
  );
}
