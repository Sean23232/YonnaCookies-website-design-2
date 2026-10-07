import { BoxBuilder } from "@/components/cart/box-builder";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CheckoutModal } from "@/components/cart/checkout-modal";
import { SinglePicker } from "@/components/cart/single-picker";
import { Footer } from "@/components/layout/footer";
import { FloatingOrderButton } from "@/components/layout/floating-order-button";
import { Navbar } from "@/components/layout/navbar";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { CustomOrders } from "@/components/sections/custom-orders";
import { Faq } from "@/components/sections/faq";
import { Gallery } from "@/components/sections/gallery";
import { Hero } from "@/components/sections/hero";
import { HowToOrder } from "@/components/sections/how-to-order";
import { MenuSection } from "@/components/sections/menu";
import { PricingSection } from "@/components/sections/pricing";
import { Reviews } from "@/components/sections/reviews";
import { flavors } from "@/data/flavors";
import { site, looksLikeRealPhone } from "@/data/site";
import { singleCents } from "@/lib/pricing";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Local-business + Product structured data.
// Address / email / phone are only included once real values are filled in site.ts.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Bakery",
      "@id": `${baseUrl}/#business`,
      name: site.name,
      description: site.description,
      url: baseUrl,
      image: `${baseUrl}/images/cookies/assortment.jpg`,
      sameAs: [site.instagram.url],
      priceRange: "$",
      ...(looksLikeRealPhone(site.contact.phone) ? { telephone: site.contact.phone } : {}),
    },
    ...flavors.map((flavor) => ({
      "@type": "Product",
      name: `${flavor.name} Cookie`,
      description: flavor.description,
      ...(flavor.image ? { image: `${baseUrl}${flavor.image}` } : {}),
      brand: { "@type": "Brand", name: site.name },
      offers: {
        "@type": "Offer",
        price: (singleCents() / 100).toFixed(2),
        priceCurrency: "USD",
        url: `${baseUrl}/#menu`,
        availability: flavor.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      },
    })),
  ],
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <MenuSection />
        <PricingSection />
        <HowToOrder />
        <CustomOrders />
        <About />
        <Gallery />
        <Reviews />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <FloatingOrderButton />
      <CartDrawer />
      <SinglePicker />
      <BoxBuilder />
      <CheckoutModal />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
