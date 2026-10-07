import { describe, expect, it } from "vitest";
import { pricing } from "../data/pricing";
import {
  boxCents,
  boxSavingsCents,
  boxesTotalCents,
  cartCookieCount,
  cartSubtotalCents,
  countFlavors,
  formatPrice,
  isBoxComplete,
  lineTotalCents,
  perCookieCents,
  perCookieLabel,
  singleCents,
  singlesTotalCents,
  surpriseFill,
  toCents,
} from "./pricing";
import type { CartItem } from "./types";

describe("toCents", () => {
  it("is exact despite floating point noise", () => {
    expect(toCents(0.1 + 0.2)).toBe(30);
    expect(toCents(2.5)).toBe(250);
    expect(toCents(19.99)).toBe(1999);
  });
});

describe("singles", () => {
  it("multiplies the single price by quantity", () => {
    expect(singlesTotalCents(1)).toBe(toCents(pricing.singleCookie));
    expect(singlesTotalCents(7)).toBe(7 * singleCents());
  });

  it("rejects invalid quantities", () => {
    expect(() => singlesTotalCents(0)).toThrow();
    expect(() => singlesTotalCents(-2)).toThrow();
    expect(() => singlesTotalCents(1.5)).toThrow();
  });
});

describe("boxes", () => {
  it("uses the fixed box and dozen prices", () => {
    expect(boxCents(6)).toBe(toCents(pricing.boxes[6]));
    expect(boxCents(12)).toBe(toCents(pricing.boxes[12]));
    expect(boxesTotalCents(12, 3)).toBe(3 * boxCents(12));
  });

  it("calculates per-cookie prices to the cent", () => {
    expect(perCookieCents(6)).toBe(Math.round(boxCents(6) / 6));
    expect(perCookieCents(12)).toBe(Math.round(boxCents(12) / 12));
  });

  it("labels inexact per-cookie prices with 'about'", () => {
    // 2500 cents / 12 is not a whole number of cents.
    if (boxCents(12) % 12 !== 0) {
      expect(perCookieLabel(12)).toMatch(/^about \$\d+\.\d{2} each$/);
    }
  });

  it("never reports negative savings", () => {
    expect(boxSavingsCents(6)).toBeGreaterThanOrEqual(0);
    expect(boxSavingsCents(12)).toBeGreaterThanOrEqual(0);
  });
});

describe("cart totals", () => {
  const items: CartItem[] = [
    { id: "a", kind: "single", flavorId: "strawberry", quantity: 2 },
    { id: "b", kind: "box", size: 6, flavors: { strawberry: 3, "red-velvet": 3 }, quantity: 1 },
    { id: "c", kind: "box", size: 12, flavors: { "cookie-monster": 12 }, quantity: 2 },
  ];

  it("sums line items with no tax or fees", () => {
    expect(lineTotalCents(items[0])).toBe(2 * singleCents());
    expect(cartSubtotalCents(items)).toBe(2 * singleCents() + boxCents(6) + 2 * boxCents(12));
  });

  it("returns 0 for an empty cart", () => {
    expect(cartSubtotalCents([])).toBe(0);
  });

  it("counts cookies, treating boxes as their size", () => {
    expect(cartCookieCount(items)).toBe(2 + 6 + 24);
  });
});

describe("box builder rules", () => {
  it("is complete only when the total is exactly the box size", () => {
    expect(isBoxComplete({ a: 3, b: 3 }, 6)).toBe(true);
    expect(isBoxComplete({ a: 3, b: 2 }, 6)).toBe(false);
    expect(isBoxComplete({ a: 4, b: 3 }, 6)).toBe(false);
    expect(isBoxComplete({ a: 6, b: 6 }, 12)).toBe(true);
  });

  it("surprise fill always produces exactly the box size", () => {
    const ids = ["a", "b", "c", "d"];
    for (const size of [6, 12] as const) {
      for (let run = 0; run < 50; run += 1) {
        const counts = surpriseFill(size, ids);
        expect(countFlavors(counts)).toBe(size);
        expect(Object.keys(counts).sort()).toEqual(ids);
      }
    }
  });

  it("surprise fill handles extreme random values", () => {
    expect(countFlavors(surpriseFill(6, ["a", "b"], () => 0.9999999))).toBe(6);
    expect(countFlavors(surpriseFill(6, ["a", "b"], () => 0))).toBe(6);
  });
});

describe("formatPrice", () => {
  it("drops decimals for whole dollars only", () => {
    expect(formatPrice(300)).toBe("$3");
    expect(formatPrice(1500)).toBe("$15");
    expect(formatPrice(250)).toBe("$2.50");
    expect(formatPrice(208)).toBe("$2.08");
    expect(formatPrice(5)).toBe("$0.05");
    expect(formatPrice(0)).toBe("$0");
  });
});
