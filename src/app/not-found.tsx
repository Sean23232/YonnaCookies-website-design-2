import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { Sparkle } from "@/components/ui/decor";
import { Logo } from "@/components/ui/logo";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main id="main" className="relative grid min-h-dvh place-items-center overflow-hidden px-6 py-16 text-center">
      <div aria-hidden className="crumbs absolute inset-0 opacity-70" />
      <div className="relative max-w-lg">
        <Logo href="/" className="mb-10" />
        <div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-blush text-6xl shadow-soft" aria-hidden>
          🍪
        </div>
        <p className="mt-6 flex items-center justify-center gap-2 font-script text-2xl text-berry">
          <Sparkle className="h-4 w-4" /> 404
        </p>
        <h1 className="mt-1 text-4xl font-bold sm:text-5xl">Oops, this cookie crumbled 🍪</h1>
        <p className="mt-4 text-lg">We couldn&apos;t find the page you were looking for, but the fresh cookies are right this way.</p>
        <Link href="/" className={buttonClasses({ size: "lg", className: "mt-8" })}>
          Back home
        </Link>
      </div>
    </main>
  );
}
