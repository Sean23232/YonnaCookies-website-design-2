import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "soft" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-berry text-white shadow-soft hover:bg-berry-dark hover:shadow-lift",
  secondary: "border-2 border-petal bg-card text-cocoa hover:bg-blush",
  soft: "bg-blush text-cocoa hover:bg-petal/60",
  ghost: "text-cocoa hover:bg-blush",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-base",
  lg: "h-14 px-8 text-lg",
};

type StyleOptions = { variant?: Variant; size?: Size; fullWidth?: boolean; className?: string };

/** Pill button styles. Use directly on <a> tags, or via <Button>. */
export function buttonClasses({ variant = "primary", size = "md", fullWidth, className }: StyleOptions = {}) {
  return cn(
    "inline-flex select-none items-center justify-center gap-2 rounded-full font-bold transition duration-200 ease-out",
    "hover:-translate-y-0.5 active:translate-y-0 motion-reduce:hover:translate-y-0",
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className,
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & StyleOptions;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, fullWidth, className, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...props}
    />
  );
});
