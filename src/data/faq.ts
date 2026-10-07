import { site } from "./site";

export type FaqItem = { question: string; answer: string };

/**
 * ✏️ EDIT ME – frequently asked questions.
 * Items marked CONFIRM are sensible defaults My'onna should double-check.
 */
export const faqs: FaqItem[] = [
  {
    question: "How do I order?",
    answer: `Pick your cookies in the menu or build a box, then send your order request through the website. You can also DM me on Instagram (${site.instagram.handle}). I'll reach out to confirm your order.`,
  },
  {
    question: "How far ahead should I order?",
    // CONFIRM: matches `ordering.leadDays` in site.ts
    answer: `Please order at least ${site.ordering.leadDays} days ahead so everything is baked fresh. For big orders or events, give me a few extra days if you can.`,
  },
  {
    question: "Do you do custom orders?",
    answer:
      "Yes! Birthdays, grad parties, gifts and events are all welcome. Tap “Request a Custom Order”, tell me what you have in mind, and I'll get back to you.",
  },
  {
    question: "Where is pickup?",
    // CONFIRM: update `contact.pickupLocation` in site.ts
    answer: `${site.contact.pickupLocation}. I'll share the exact pickup details when I confirm your order.`,
  },
  {
    question: "What payment methods do you accept?",
    // CONFIRM: add the payment apps she accepts
    answer: `${site.ordering.paymentNote} I'll let you know which payment methods work when I confirm.`,
  },
  {
    question: "Do you make other flavors?",
    answer:
      "Right now the menu is Strawberry, Red Velvet, Cookies & Cream, and Cookie Monster, with more flavors on the way. Have a request? Send it in with a custom order or DM me!",
  },
];
