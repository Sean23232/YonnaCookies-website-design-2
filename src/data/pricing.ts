/**
 * ✏️ EDIT ME – prices (in dollars).
 * All maths is done in whole cents internally (see src/lib/pricing.ts),
 * so prices like 2.5 are handled exactly.
 */
export const pricing = {
  singleCookie: 3,
  boxes: {
    6: 15,
    12: 25,
  },
  studentNote: "Student-friendly prices 💛",
  occasionNote: "Perfect for treats, gifts, study snacks, and parties",
} as const;

export type PricingCard = {
  id: "single" | "box-6" | "dozen";
  title: string;
  description: string;
  /** 1 = singles, otherwise the box size. */
  size: 1 | 6 | 12;
  tag?: string;
};

export const pricingCards: PricingCard[] = [
  {
    id: "single",
    title: "Single",
    description: "One fresh cookie, just because. Mix and match as you like.",
    size: 1,
  },
  {
    id: "box-6",
    title: "Box of 6",
    description: "Pick any mix of your favorite flavors. Great for sharing.",
    size: 6,
    tag: "Most Popular",
  },
  {
    id: "dozen",
    title: "Dozen",
    description: "Twelve cookies for gifts, study groups and parties.",
    size: 12,
    tag: "Best Value",
  },
];
