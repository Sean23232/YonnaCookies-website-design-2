/**
 * ✏️ EDIT ME – contact details, links and ordering rules.
 *
 * ⚠️ Anything marked PLACEHOLDER below is NOT real contact info yet.
 * Replace it with My'onna's real details before sharing the site widely.
 */
export const site = {
  name: "YonnaCookies_",
  ownerName: "My'onna",
  tagline: "Homemade cookies, baked fresh with love 🍪",
  description:
    "Homemade cookies by YonnaCookies_ in strawberry, red velvet, cookies & cream, and Cookie Monster. Order fresh, student-friendly cookies.",
  bio: "I've always wanted to turn something I enjoy into something of my own. Every cookie is homemade, fresh, and made with care. Whether you're grabbing a treat for yourself, sharing with friends and family, or ordering for a special occasion, I'm so excited to share my cookies with you.",
  goal: "My goal is to keep growing, with more flavors and a bigger menu as the business grows. Tell me what you'd love to see next!",

  instagram: {
    handle: "@yonnacookies_",
    url: "https://www.instagram.com/yonnacookies_",
    // Instagram can't prefill a message, which is why the order screen
    // also has a "Copy my order" button.
    dmUrl: "https://ig.me/m/yonnacookies_",
  },

  contact: {
    // PLACEHOLDER – replace with the real email
    email: "hello@yonnacookies.com",
    // PLACEHOLDER – replace with a real number, e.g. "(555) 123-4567"
    phone: "Add phone number",
    // PLACEHOLDER – replace with the pickup area, e.g. "Downtown Atlanta, GA"
    pickupLocation: "Pickup location: add area",
  },

  ordering: {
    /** Minimum days between ordering and pickup. */
    leadDays: 2,
    /** Her timezone (IANA name). Used to work out "today" for the date picker. */
    timezone: "America/New_York",
    pickupWindows: [
      "Morning (9am – 12pm)",
      "Afternoon (12pm – 4pm)",
      "Evening (4pm – 8pm)",
      "Flexible – any time works",
    ],
    occasions: [
      "Just a treat",
      "Birthday",
      "Graduation",
      "Gift",
      "Party",
      "Special occasion",
      "Other",
    ],
    customOccasion: "Special occasion",
    paymentNote: "Payment is arranged at pickup or after I confirm your order.",
    largeOrderNote: "Need a large order? Order a few days ahead.",
  },

  credit: { label: "Website by Web Designs Lab" },
} as const;

/** True when a contact value is still a placeholder (so we don't link to it). */
export function looksLikeRealPhone(value: string): boolean {
  return value.replace(/\D/g, "").length >= 7;
}
