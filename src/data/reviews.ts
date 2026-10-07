export type Review = {
  id: string;
  name: string;
  text: string;
  rating: 1 | 2 | 3 | 4 | 5;
  /** Shown as a small "Sample" tag. Set to false once it's a real review. */
  isPlaceholder: boolean;
};

/**
 * ✏️ EDIT ME – customer reviews.
 *
 * ⚠️ The three entries below are PLACEHOLDERS (clearly tagged "Sample" on the
 * site). Replace them with real reviews from customers (with their OK), then
 * set `isPlaceholder: false`.
 *
 * Leave the array empty ([]) to hide the whole Reviews section.
 */
export const reviews: Review[] = [
  {
    id: "sample-1",
    name: "Sample reviewer",
    text: "Replace me with a real review. Short and sweet works best!",
    rating: 5,
    isPlaceholder: true,
  },
  {
    id: "sample-2",
    name: "Sample reviewer",
    text: "Replace me with a real review. Mention a flavor you loved!",
    rating: 5,
    isPlaceholder: true,
  },
  {
    id: "sample-3",
    name: "Sample reviewer",
    text: "Replace me with a real review. Tell us how pickup went!",
    rating: 5,
    isPlaceholder: true,
  },
];
