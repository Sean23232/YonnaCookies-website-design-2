"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label: string;
  /** Disable the + button without changing max (e.g. box is full). */
  disableIncrease?: boolean;
  size?: "sm" | "md";
};

export function QuantityStepper({
  value,
  onChange,
  min = 0,
  max = 99,
  label,
  disableIncrease,
  size = "md",
}: QuantityStepperProps) {
  const dim = size === "sm" ? "h-9 w-9" : "h-11 w-11";
  const btn = cn(
    dim,
    "grid place-items-center rounded-full bg-blush text-cocoa transition hover:bg-petal/70 active:scale-95 disabled:opacity-40 disabled:hover:bg-blush",
  );

  return (
    <div className="inline-flex items-center gap-2" role="group" aria-label={label}>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`Decrease ${label}`}
      >
        <Minus className="h-4 w-4" aria-hidden />
      </button>
      <span className="min-w-8 text-center text-lg font-bold tabular-nums text-cocoa" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max || disableIncrease}
        aria-label={`Increase ${label}`}
      >
        <Plus className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
