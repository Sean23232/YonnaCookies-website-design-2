import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/** Four-point sparkle. Purely decorative. */
export function Sparkle({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("h-6 w-6", className)} style={style} fill="currentColor">
      <path d="M12 0c.8 6.4 3.2 10.4 12 12-8.8 1.6-11.2 5.6-12 12-.8-6.4-3.2-10.4-12-12C8.8 10.4 11.2 6.4 12 0z" />
    </svg>
  );
}

const SPRINKLES = [
  { top: "6%", left: "8%", color: "#F4B8C5", rot: "25deg", w: 22, delay: "0s" },
  { top: "14%", left: "88%", color: "#2FB5AA", rot: "-40deg", w: 18, delay: "1s" },
  { top: "48%", left: "2%", color: "#D9A066", rot: "70deg", w: 20, delay: "2s" },
  { top: "82%", left: "14%", color: "#E58CA2", rot: "-20deg", w: 24, delay: "0.5s" },
  { top: "90%", left: "78%", color: "#F4B8C5", rot: "50deg", w: 18, delay: "1.5s" },
  { top: "62%", left: "94%", color: "#D9A066", rot: "-65deg", w: 22, delay: "2.5s" },
];

/** Floating decorative sprinkles. Hidden from assistive tech. */
export function Sprinkles({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {SPRINKLES.map((sprinkle, index) => (
        <span
          key={index}
          className="motion-safe-anim absolute block animate-float rounded-full"
          style={
            {
              top: sprinkle.top,
              left: sprinkle.left,
              width: sprinkle.w,
              height: 7,
              background: sprinkle.color,
              "--r": sprinkle.rot,
              animationDelay: sprinkle.delay,
              transform: `rotate(${sprinkle.rot})`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** Soft scalloped edge. Place inside a `relative` section; it hangs below it. */
export function Scallop({ color, className }: { color: string; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-x-0 top-full z-10 h-5", className)}
      style={{
        background: `radial-gradient(circle at 50% 0, ${color} 0 19px, transparent 20px) 0 0 / 40px 20px repeat-x`,
      }}
    />
  );
}
