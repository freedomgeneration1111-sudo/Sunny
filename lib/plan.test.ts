import { describe, expect, it } from "vitest";
import { config } from "@/lib/config";
import {
  buildPlanInquiryHref,
  customQuoteCount,
  isPlanItemId,
  planItemIds,
  planItems,
  planSubtotal,
} from "@/lib/plan";
import { formatPrice, isCustomQuote, servicePricing } from "@/lib/pricing";

describe("service inventory", () => {
  it("prices every service it offers", () => {
    for (const id of planItemIds) {
      const priceKey = planItems[id].priceKey;
      expect(priceKey, `${id} should carry a price key`).toBeTruthy();
      expect(servicePricing.values[priceKey!], `${priceKey} should exist in the pricing menu`).toBeTruthy();
    }
  });

  it("renders each pricing mode the way customers read it", () => {
    expect(formatPrice("party3h")).toBe("$675");
    expect(formatPrice("weddingDjCore")).toBe("From $1,700");
    expect(formatPrice("corporateDjHourly")).toBe("$175/hour");
    expect(formatPrice("saFullCelebration")).toBe("Custom Quote");
  });

  it("never shows a figure for a custom-quote service", () => {
    for (const key of Object.keys(servicePricing.values) as (keyof typeof servicePricing.values)[]) {
      if (isCustomQuote(key)) {
        expect(formatPrice(key)).toBe("Custom Quote");
      }
    }
  });

  it("keeps plan item ids stable so saved selections stay valid", () => {
    // These ids are carried in URLs and session storage. Renaming one silently
    // breaks any link a customer or the team already has.
    for (const id of ["wedding-dj-core", "sa-full-celebration", "party-4h", "corporate-av-basic"]) {
      expect(isPlanItemId(id), `${id} should remain a valid plan item`).toBe(true);
    }
  });
});

describe("quote builder capability (dormant)", () => {
  it("is switched off for the public site", () => {
    expect(config.quoteBuilderEnabled).toBe(false);
  });

  it("still totals services that carry a set price", () => {
    expect(planSubtotal(["party-3h", "party-4h"])).toBe(675 + 900);
    expect(planSubtotal([])).toBe(0);
  });

  it("still leaves custom-quote services out of the total", () => {
    // sa-full-celebration is a Custom Quote service, so it must not add a figure.
    expect(planSubtotal(["party-3h", "sa-full-celebration"])).toBe(675);
    expect(customQuoteCount(["sa-full-celebration", "party-3h"])).toBe(1);
    expect(customQuoteCount(["party-3h", "party-4h"])).toBe(0);
  });

  it("still carries a selection into the existing inquiry flow", () => {
    expect(buildPlanInquiryHref([])).toBe("/check-availability");
    expect(buildPlanInquiryHref(["wedding-dj-core", "photography"])).toBe(
      "/check-availability?interest=wedding-dj-core&interest=photography",
    );
  });
});
