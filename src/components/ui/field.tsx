import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const base = cn(
  "w-full rounded-2xl border-2 border-petal/70 bg-card px-4 text-base text-cocoa",
  "placeholder:text-mocha/60 transition focus:border-berry focus:outline-none focus:ring-4 focus:ring-petal/40",
  "aria-[invalid=true]:border-berry",
);

export const inputClasses = cn("h-12", base);
export const textareaClasses = cn("min-h-28 py-3", base);

type FieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
};

export function Field({ label, htmlFor, error, hint, required, children, className }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-bold text-cocoa">
        {label}
        {required ? (
          <span className="text-berry" aria-hidden>
            {" "}
            *
          </span>
        ) : null}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${htmlFor}-hint`} className="mt-1.5 text-sm">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 text-sm font-bold text-berry">
          {error}
        </p>
      ) : null}
    </div>
  );
}
