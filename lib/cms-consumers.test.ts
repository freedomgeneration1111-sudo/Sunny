import { afterEach, describe, expect, it, vi } from "vitest";
import staticPricing from "@/lib/content/servicePricing.json";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("CMS-managed pricing and FAQ consumers", () => {
  it("keeps checked-in labels and FAQs when no snapshot is configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_FOCUS_CMS_CONTENT_JSON", "");
    const [{ planItemLabel }, { commonFaqs, pricingFaqs }] = await Promise.all([
      import("@/lib/plan"),
      import("@/lib/content/commercial"),
    ]);

    expect(planItemLabel("party-3h")).toBe("3-Hour Party");
    expect(commonFaqs[0]?.question).toBe("Can I book just one service?");
    expect(pricingFaqs[0]?.question).toBe("Is the price I see what I pay?");
  });

  it("uses one snapshot label in cards, dormant planning, and inquiry carryover", async () => {
    const pricing = structuredClone(staticPricing);
    pricing.values.party3h.label = "3-Hour Party Preview";
    vi.stubEnv("NEXT_PUBLIC_FOCUS_CMS_CONTENT_JSON", JSON.stringify({
      pricing,
      faqs: {
        schemaVersion: 1,
        common: [{ id: "common_preview", question: "CMS Common FAQ Preview", answer: "Common answer." }],
        pricing: [{ id: "pricing_preview", question: "CMS Pricing FAQ Preview", answer: "Pricing answer." }],
      },
      revisionIds: { pricing: "pricing_preview", faqs: "faqs_preview" },
    }));

    const [{ planItemLabel, planItemLabels }, { commonFaqs, pricingFaqs }] = await Promise.all([
      import("@/lib/plan"),
      import("@/lib/content/commercial"),
    ]);

    expect(planItemLabel("party-3h")).toBe("3-Hour Party Preview");
    expect(planItemLabels(["party-3h", "party-4h"])).toEqual(["3-Hour Party Preview", "4-Hour Party"]);
    expect(commonFaqs).toEqual([{ question: "CMS Common FAQ Preview", answer: "Common answer." }]);
    expect(pricingFaqs).toEqual([{ question: "CMS Pricing FAQ Preview", answer: "Pricing answer." }]);
  });
});
