"use client";

import { motion } from "framer-motion";
import { Menu, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, buttonClasses } from "@/components/ui/button";
import { InstagramIcon } from "@/components/ui/icons";
import { Logo } from "@/components/ui/logo";
import { Modal } from "@/components/ui/modal";
import { NAV_LINKS } from "@/data/nav";
import { site } from "@/data/site";
import { useActiveSection } from "@/hooks/use-active-section";
import { useCartSummary } from "@/hooks/use-cart-summary";
import { cn, scrollToSection } from "@/lib/utils";
import { useUI } from "@/store/ui";



export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(NAV_LINKS.map((link) => link.id));
  const { count } = useCartSummary();
  const menuOpen = useUI((state) => state.menuOpen);
  const setMenuOpen = useUI((state) => state.setMenuOpen);
  const setCartOpen = useUI((state) => state.setCartOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (id: string) => {
    setMenuOpen(false);
    setTimeout(() => scrollToSection(id), 280);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-cream/80 backdrop-blur-md transition-shadow duration-300",
        scrolled ? "border-petal/40 shadow-soft" : "border-transparent",
      )}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        <Logo />

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                aria-current={active === link.id ? "true" : undefined}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-bold text-mocha transition hover:bg-blush hover:text-cocoa",
                  active === link.id && "bg-blush text-cocoa",
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="hidden sm:block">
            <a href="#menu" className={buttonClasses({ size: "sm" })}>
              Order Now
            </a>
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
            className="relative grid h-11 w-11 place-items-center rounded-full text-cocoa transition hover:bg-blush"
          >
            <ShoppingBag className="h-6 w-6" aria-hidden />
            {count > 0 ? (
              <motion.span
                key={count}
                initial={{ scale: 1.6 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 18 }}
                className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-berry px-1 text-xs font-bold text-white"
              >
                {count}
              </motion.span>
            ) : null}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="grid h-11 w-11 place-items-center rounded-full text-cocoa transition hover:bg-blush lg:hidden"
          >
            <Menu className="h-6 w-6" aria-hidden />
          </button>
        </div>
      </nav>

      <Modal open={menuOpen} onOpenChange={setMenuOpen} variant="fullscreen" title="Menu">
        <nav aria-label="Mobile" className="flex h-full flex-col justify-between gap-8 pt-4">
          <ul className="space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={(event) => {
                    event.preventDefault();
                    goTo(link.id);
                  }}
                  className="block rounded-2xl px-4 py-3 font-heading text-3xl font-bold text-cocoa transition hover:bg-blush"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="space-y-3">
            <Button size="lg" fullWidth onClick={() => goTo("menu")}>
              Order Now
            </Button>
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses({ variant: "secondary", size: "lg", fullWidth: true })}
            >
              <InstagramIcon className="h-5 w-5" /> {site.instagram.handle}
            </a>
          </div>
        </nav>
      </Modal>
    </header>
  );
}
