import { servicePricing } from "@/lib/pricing";
import type { PricingKey } from "@/lib/pricing";

export type PlanCategory =
  | "Wedding"
  | "Asian Wedding"
  | "Party"
  | "Corporate"
  | "Media"
  | "Enhancement";

export type PlanItem = {
  id: string;
  label: string;
  category: PlanCategory;
  detail: string;
  priceKey?: PricingKey;
};

export const planItems = {
  "wedding-dj-core": {
    id: "wedding-dj-core",
    label: "Wedding DJ/MC",
    category: "Wedding",
    detail: "Music and hosting for the reception",
    priceKey: "weddingDjCore",
  },
  "wedding-dj-ceremony": {
    id: "wedding-dj-ceremony",
    label: "Ceremony + Reception DJ/MC",
    category: "Wedding",
    detail: "Ceremony and reception on one timeline",
    priceKey: "weddingDjCeremonyReception",
  },
  "wedding-production": {
    id: "wedding-production",
    label: "DJ + Full Production",
    category: "Wedding",
    detail: "For events that need a larger sound and lighting setup",
    priceKey: "weddingProductionEnhanced",
  },
  "ceremony-sound": {
    id: "ceremony-sound",
    label: "Ceremony Sound System",
    category: "Wedding",
    detail: "Vows, officiant, and readings heard from the back row",
    priceKey: "ceremonySound",
  },
  "sa-single-event": {
    id: "sa-single-event",
    label: "Single Celebration Coverage",
    category: "Asian Wedding",
    detail: "One celebration — Mehndi, Sangeet, Haldi, or another event",
    priceKey: "saSingleEvent",
  },
  "sa-wedding-reception": {
    id: "sa-wedding-reception",
    label: "Wedding Day + Reception",
    category: "Asian Wedding",
    detail: "The ceremony day and the reception on one connected plan",
    priceKey: "saWeddingReception",
  },
  "sa-full-celebration": {
    id: "sa-full-celebration",
    label: "Full Celebration Week",
    category: "Asian Wedding",
    detail: "Every event your family is planning, quoted together",
    priceKey: "saFullCelebration",
  },
  "sa-baraat": {
    id: "sa-baraat",
    label: "Baraat Procession Sound",
    category: "Asian Wedding",
    detail: "Mobile sound for a procession that moves outdoors",
    priceKey: "saBaraat",
  },
  "south-asian-media": {
    id: "south-asian-media",
    label: "Asian Wedding Photo + Video",
    category: "Asian Wedding",
    detail: "Photo and video across a multi-event celebration",
    priceKey: "southAsianCelebrationMedia",
  },
  "party-3h": {
    id: "party-3h",
    label: "3-Hour Party",
    category: "Party",
    detail: "A shorter celebration",
    priceKey: "party3h",
  },
  "party-4h": {
    id: "party-4h",
    label: "4-Hour Party",
    category: "Party",
    detail: "The most common length",
    priceKey: "party4h",
  },
  "party-5h": {
    id: "party-5h",
    label: "5-Hour Party",
    category: "Party",
    detail: "A longer night",
    priceKey: "party5h",
  },
  "party-photography": {
    id: "party-photography",
    label: "Celebration Photography",
    category: "Party",
    detail: "Photo coverage sized to a shorter celebration",
    priceKey: "partyPhotography",
  },
  "party-highlight-video": {
    id: "party-highlight-video",
    label: "Social Highlight Video",
    category: "Party",
    detail: "A short edit shaped for phones and sharing",
    priceKey: "partyHighlightVideo",
  },
  "corporate-dj": {
    id: "corporate-dj",
    label: "Corporate DJ / Entertainment",
    category: "Corporate",
    detail: "Music and hosting, billed by the hour",
    priceKey: "corporateDjHourly",
  },
  "corporate-av-basic": {
    id: "corporate-av-basic",
    label: "Meeting AV Package",
    category: "Corporate",
    detail: "Microphones, playback, and a display the back row can read",
    priceKey: "corporateAvBasic",
  },
  "corporate-half-day": {
    id: "corporate-half-day",
    label: "Half-Day Production",
    category: "Corporate",
    detail: "Sound, lighting, and AV for a half-day program",
    priceKey: "corporateProductionHalfDay",
  },
  "corporate-full-day": {
    id: "corporate-full-day",
    label: "Full-Day Production",
    category: "Corporate",
    detail: "Sound, lighting, and AV for a full-day program",
    priceKey: "corporateProductionFullDay",
  },
  "corporate-media": {
    id: "corporate-media",
    label: "Corporate Photo + Video",
    category: "Corporate",
    detail: "Documentation you can actually use afterward",
    priceKey: "corporateMedia",
  },
  "corporate-livestream": {
    id: "corporate-livestream",
    label: "Livestream + Hybrid Capture",
    category: "Corporate",
    detail: "For programs with an audience joining remotely",
    priceKey: "corporateLivestream",
  },
  photography: {
    id: "photography",
    label: "Wedding Photography",
    category: "Media",
    detail: "Photography coverage for the wedding day",
    priceKey: "weddingPhotography",
  },
  videography: {
    id: "videography",
    label: "Wedding Videography",
    category: "Media",
    detail: "Film coverage for the wedding day",
    priceKey: "weddingVideography",
  },
  "photo-video": {
    id: "photo-video",
    label: "Photo + Video",
    category: "Media",
    detail: "Photography and film planned together",
    priceKey: "photoVideoBundle",
  },
  "engagement-session": {
    id: "engagement-session",
    label: "Engagement / Portrait Session",
    category: "Media",
    detail: "A relaxed session before the event week begins",
    priceKey: "engagementSession",
  },
  "social-content": {
    id: "social-content",
    label: "Same-Week Social Content",
    category: "Media",
    detail: "Short vertical edits while the event still feels current",
    priceKey: "socialContent",
  },
  "digital-booth": {
    id: "digital-booth",
    label: "Digital / Open-Air Booth",
    category: "Enhancement",
    detail: "A photo station for guests",
    priceKey: "digitalPhotoBooth",
  },
  "booth-360": {
    id: "booth-360",
    label: "360 Booth",
    category: "Enhancement",
    detail: "Short spinning videos guests can share",
    priceKey: "booth360",
  },
  clouds: {
    id: "clouds",
    label: "Dancing on Clouds",
    category: "Enhancement",
    detail: "A low cloud effect for the first dance",
    priceKey: "dancingOnClouds",
  },
  "cold-sparks": {
    id: "cold-sparks",
    label: "Cold Sparks",
    category: "Enhancement",
    detail: "Indoor-safe sparks for entrances and first dances",
    priceKey: "coldSparks",
  },
  uplighting: {
    id: "uplighting",
    label: "Room Uplighting",
    category: "Enhancement",
    detail: "Color on the walls so the room reads as one space",
    priceKey: "uplighting",
  },
  monogram: {
    id: "monogram",
    label: "Custom Monogram Projection",
    category: "Enhancement",
    detail: "A projected name or motif on the floor or wall",
    priceKey: "monogram",
  },
  "led-wall": {
    id: "led-wall",
    label: "LED Wall",
    category: "Enhancement",
    detail: "Sized to your room, power, and sightlines",
    priceKey: "ledWall",
  },
} as const satisfies Record<string, PlanItem>;

export type PlanItemId = keyof typeof planItems;

export function isPlanItemId(value: string): value is PlanItemId {
  return value in planItems;
}

export const planItemIds = Object.keys(planItems) as PlanItemId[];

export function planItemsByCategory(category: PlanCategory): PlanItemId[] {
  return planItemIds.filter((id) => planItems[id].category === category);
}

/* ── Quote-builder logic ──────────────────────────────────────────────
 * Dormant while `config.quoteBuilderEnabled` is false, but kept pure and
 * tested so the capability does not rot. `PlanProvider` is the only UI
 * consumer; these functions are what actually do the work.
 * ------------------------------------------------------------------- */

/** Sum the services that carry a set price. Custom-quote services are excluded. */
export function planSubtotal(ids: readonly PlanItemId[], prices = servicePricing.values) {
  return ids.reduce((total, id) => {
    const priceKey = planItems[id].priceKey;
    if (!priceKey) return total;
    const price = prices[priceKey];
    return price.mode === "custom" ? total : total + price.amount;
  }, 0);
}

/** How many selected services need a custom quote rather than a listed price. */
export function customQuoteCount(ids: readonly PlanItemId[], prices = servicePricing.values) {
  return ids.filter((id) => {
    const priceKey = planItems[id].priceKey;
    return priceKey ? prices[priceKey].mode === "custom" : true;
  }).length;
}

/** Carry a selection into the existing inquiry flow. */
export function buildPlanInquiryHref(ids: readonly PlanItemId[]) {
  const params = new URLSearchParams();
  ids.forEach((id) => params.append("interest", id));
  return `/check-availability${params.size ? `?${params.toString()}` : ""}`;
}
