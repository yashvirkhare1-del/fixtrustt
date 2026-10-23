import { describe, expect, it } from "vitest";
import { demoOffers } from "@/lib/offers";

describe("Promotion safeguards", () => {
  it("keeps every promotion illustrative rather than a live discount", () => {
    expect(demoOffers).toHaveLength(4);
    expect(demoOffers.every((offer) => offer.demo === true)).toBe(true);
  });
  it("does not configure validated coupons or applied discounts", () => {
    for (const offer of demoOffers) {
      expect(offer).not.toHaveProperty("couponCode");
      expect(offer).not.toHaveProperty("discountAmount");
      expect(offer).not.toHaveProperty("paymentAction");
    }
  });
});