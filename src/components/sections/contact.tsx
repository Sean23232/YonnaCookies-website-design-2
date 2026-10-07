import { Mail, MapPin, Phone } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { Scallop } from "@/components/ui/decor";
import { InstagramIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { looksLikeRealPhone, site } from "@/data/site";

export function Contact() {
  const { email, phone, pickupLocation } = site.contact;
  const items = [
    {
      icon: InstagramIcon,
      label: "Instagram",
      value: site.instagram.handle,
      href: site.instagram.dmUrl,
      external: true,
    },
    { icon: Mail, label: "Email", value: email, href: `mailto:${email}`, external: false },
    {
      icon: Phone,
      label: "Phone",
      value: phone,
      href: looksLikeRealPhone(phone) ? `tel:${phone.replace(/[^\d+]/g, "")}` : undefined,
      external: false,
    },
    { icon: MapPin, label: "Pickup", value: pickupLocation, href: undefined, external: false },
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative bg-blush py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="contact-title"
          eyebrow="say hi"
          title="Get in Touch"
          subtitle="Questions, custom ideas or flavor requests? I'd love to hear from you."
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const content = (
              <>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blush text-berry">
                  <item.icon className="h-6 w-6" />
                </span>
                <span className="mt-4 block text-sm font-bold uppercase tracking-wide text-mocha">{item.label}</span>
                <span className="mt-1 block break-words font-bold text-cocoa">{item.value}</span>
              </>
            );
            return (
              <li key={item.label}>
                <Reveal delay={index * 0.07} className="h-full">
                  {item.href ? (
                    <a
                      href={item.href}
                      {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="block h-full rounded-3xl bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lift motion-reduce:hover:translate-y-0"
                    >
                      {content}
                    </a>
                  ) : (
                    <div className="h-full rounded-3xl bg-card p-6 shadow-soft">{content}</div>
                  )}
                </Reveal>
              </li>
            );
          })}
        </ul>
        <Reveal className="mt-10 text-center">
          <a href={site.instagram.dmUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses({ size: "lg" })}>
            <InstagramIcon className="h-5 w-5" /> DM {site.instagram.handle}
          </a>
        </Reveal>
      </div>
      <Scallop color="var(--color-blush)" />
    </section>
  );
}
