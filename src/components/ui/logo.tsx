import { Cookie } from "lucide-react";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

/** Text logo with a little cookie icon. */
export function Logo({
  className,
  href = "#top",
  tone = "dark",
}: {
  className?: string;
  href?: string;
  tone?: "dark" | "light";
}) {
  return (
    <a
      href={href}
      aria-label={`${site.name} home`}
      className={cn("inline-flex items-center gap-2", tone === "dark" ? "text-cocoa" : "text-cream", className)}
    >
      <span className="grid h-9 w-9 place-items-center rounded-full bg-petal/80 text-cocoa">
        <Cookie className="h-5 w-5" aria-hidden />
      </span>
      <span className="font-heading text-lg font-bold tracking-tight sm:text-xl">{site.name}</span>
    </a>
  );
}
