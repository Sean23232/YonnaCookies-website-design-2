import { Cookie, Heart, Sparkles } from "lucide-react";
import { CookieImage } from "@/components/ui/cookie-image";
import { Scallop } from "@/components/ui/decor";
import { Reveal } from "@/components/ui/reveal";
import { ABOUT_IMAGE } from "@/data/images";
import { site } from "@/data/site";

const values = [
  { icon: Cookie, label: "Homemade" },
  { icon: Sparkles, label: "Fresh" },
  { icon: Heart, label: "Made with care" },
];

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative bg-blush py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 md:grid-cols-2 lg:gap-20 lg:px-8">
        <Reveal>
          <div className="relative mx-auto max-w-md">
            <div aria-hidden className="absolute -inset-3 rotate-3 rounded-[2.25rem] bg-petal/60" />
            <CookieImage
              src={ABOUT_IMAGE}
              alt={`A photo of ${site.ownerName} is coming soon`}
              sizes="(min-width: 768px) 40vw, 90vw"
              className="relative aspect-[4/5] rounded-[2rem] border-[6px] border-card shadow-lift"
            />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="font-script text-2xl text-berry" aria-hidden>
            hi, I&apos;m {site.ownerName}
          </p>
          <h2 id="about-title" className="mt-1 text-3xl font-bold sm:text-4xl lg:text-5xl">
            About {site.ownerName}
          </h2>
          <p className="mt-5 text-lg leading-relaxed">{site.bio}</p>
          <p className="mt-4 text-lg leading-relaxed">{site.goal}</p>
          <ul className="mt-8 flex flex-wrap gap-3">
            {values.map((value) => (
              <li
                key={value.label}
                className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2.5 font-bold text-cocoa shadow-soft"
              >
                <value.icon className="h-5 w-5 text-berry" aria-hidden />
                {value.label}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
      <Scallop color="var(--color-blush)" />
    </section>
  );
}
