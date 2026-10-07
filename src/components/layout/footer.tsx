import { buttonClasses } from "@/components/ui/button";
import { InstagramIcon } from "@/components/ui/icons";
import { Logo } from "@/components/ui/logo";
import { site } from "@/data/site";
import { NAV_LINKS } from "@/data/nav";

export function Footer() {
  return (
    <footer className="bg-cocoa pb-28 pt-20 text-cream lg:pb-10">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <Logo tone="light" />
          <p className="mt-4 max-w-sm text-cream/85">{site.tagline}</p>
          <a
            href={site.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses({ variant: "secondary", className: "mt-5" })}
          >
            <InstagramIcon className="h-5 w-5" /> {site.instagram.handle}
          </a>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-heading text-lg font-bold text-cream">Quick links</h2>
          <ul className="mt-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`} className="text-cream/85 underline-offset-4 hover:text-white hover:underline">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-heading text-lg font-bold text-cream">Pickup</h2>
          <p className="mt-4 text-cream/85">{site.contact.pickupLocation}</p>
          <p className="mt-2 text-cream/85">{site.ordering.paymentNote}</p>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-6xl flex-col gap-2 border-t border-cream/20 px-4 pt-6 text-sm text-cream/80 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} {site.name}</p>
        <p>{site.credit.label}</p>
      </div>
    </footer>
  );
}
