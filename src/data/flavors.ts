import type { Flavor } from "../lib/types";

/**
 * ✏️ EDIT ME – the cookie menu.
 *
 * To add a flavor: copy one block, give it a unique `id` (lowercase, dashes),
 * drop its photo in `public/images/cookies/` and point `image` at it.
 * No photo yet? Leave `image` out and a pretty placeholder is shown.
 * Set `available: false` to hide it from ordering (shows "Sold out").
 *
 * Note: the Box Builder automatically includes every available flavor.
 */
export const flavors: Flavor[] = [
  {
    id: "strawberry",
    name: "Strawberry",
    description: "Soft, pink and fruity, with a sweet strawberry flavor in every bite.",
    image: "/images/cookies/strawberry.jpg",
    imageAlt: "Pink homemade strawberry cookies on parchment paper",
    accent: "#F4B8C5",
    available: true,
    badge: "Sweet & Fruity",
  },
  {
    id: "red-velvet",
    name: "Red Velvet",
    description: "Rich, soft and velvety, packed with melty white chocolate chips.",
    image: "/images/cookies/red-velvet.jpg",
    imageAlt: "Deep red velvet cookies with white chocolate chips",
    accent: "#C0405A",
    available: true,
  },
  {
    id: "cookies-and-cream",
    name: "Cookies & Cream",
    description: "Loaded with cookie pieces and finished with a white chocolate drizzle.",
    image: "/images/cookies/cookies-and-cream.jpg",
    imageAlt: "Cookies and cream cookies drizzled with white chocolate on a paper plate",
    accent: "#8B7466",
    available: true,
  },
  {
    id: "cookie-monster",
    name: "Cookie Monster",
    description: "A bright teal cookie stuffed with cookie chunks and chocolate pieces.",
    image: "/images/cookies/cookie-monster.jpg",
    imageAlt: "Bright teal Cookie Monster cookies with cookie chunks",
    accent: "#2FB5AA",
    available: true,
    badge: "Bright & Bold",
  },
];

export const availableFlavors = flavors.filter((flavor) => flavor.available);

export function getFlavor(id: string): Flavor | undefined {
  return flavors.find((flavor) => flavor.id === id);
}
