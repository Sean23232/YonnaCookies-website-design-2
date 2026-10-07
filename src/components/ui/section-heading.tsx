import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  id?: string;
};

export function SectionHeading({ eyebrow, title, subtitle, align = "center", id }: SectionHeadingProps) {
  return (
    <Reveal className={cn("mb-10 max-w-2xl sm:mb-14", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <p className="font-script text-2xl leading-none text-berry" aria-hidden>
          {eyebrow}
        </p>
      ) : null}
      <h2 id={id} className="mt-2 text-3xl font-bold sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle ? <p className="mt-4 text-lg leading-relaxed">{subtitle}</p> : null}
    </Reveal>
  );
}
