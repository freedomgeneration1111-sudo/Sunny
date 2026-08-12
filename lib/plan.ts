import type { PricingKey } from "@/lib/pricing";

export type PlanCategory =
  | "Wedding"
  | "South Asian"
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
  /**
   * Draft inventory invented to make the redesign coherent. Real offer scope
   * and pricing are decided in a later sprint; the UI must keep these visibly
   * provisional. Adding or removing a service happens here and in
   * docs/06_DEV_PRICING_DATA.json — nowhere else.
   */
  draft?: true;
};

export const planItems = {
  "wedding-dj-core": {
    id: "wedding-dj-core",
    label: "Wedding DJ/MC",
    category: "Wedding",
    detail: "Reception entertainment starting point",
    priceKey: "weddingDjCore",
  },
  "wedding-dj-ceremony": {
    id: "wedding-dj-ceremony",
    label: "Ceremony + Reception DJ/MC",
    category: "Wedding",
    detail: "A connected ceremony and reception starting point",
    priceKey: "weddingDjCeremonyReception",
  },
  "wedding-production": {
    id: "wedding-production",
    label: "DJ + Substantial Production",
    category: "Wedding",
    detail: "For events that need a larger production conversation",
    priceKey: "weddingProductionEnhanced",
  },
  "ceremony-sound": {
    id: "ceremony-sound",
    label: "Ceremony Sound System",
    category: "Wedding",
    detail: "Vows, officiant, and readings heard from the back row",
    priceKey: "ceremonySound",
    draft: true,
  },
  "sa-single-event": {
    id: "sa-single-event",
    label: "Single Celebration Coverage",
    category: "South Asian",
    detail: "One celebration in the week — Mehndi, Sangeet, Haldi, or similar",
    priceKey: "saSingleEvent",
    draft: true,
  },
  "sa-wedding-reception": {
    id: "sa-wedding-reception",
    label: "Wedding Day + Reception",
    category: "South Asian",
    detail: "The ceremony day and the reception on one connected plan",
    priceKey: "saWeddingReception",
    draft: true,
  },
  "sa-full-celebration": {
    id: "sa-full-celebration",
    label: "Full Celebration Week",
    category: "South Asian",
    detail: "Every event your family is planning, scoped together",
    priceKey: "saFullCelebration",
    draft: true,
  },
  "sa-baraat": {
    id: "sa-baraat",
    label: "Baraat Procession Sound",
    category: "South Asian",
    detail: "Mobile sound for a procession that moves outdoors",
    priceKey: "saBaraat",
    draft: true,
  },
  "south-asian-media": {
    id: "south-asian-media",
    label: "South Asian Celebration Media",
    category: "South Asian",
    detail: "Development anchor for custom multi-event scoping",
    priceKey: "southAsianMediaDevelopmentAnchor",
  },
  "party-3h": {
    id: "party-3h",
    label: "3-Hour Party",
    category: "Party",
    detail: "Compact entertainment time block",
    priceKey: "party3h",
  },
  "party-4h": {
    id: "party-4h",
    label: "4-Hour Party",
    category: "Party",
    detail: "Balanced entertainment time block",
    priceKey: "party4h",
  },
  "party-5h": {
    id: "party-5h",
    label: "5-Hour Party",
    category: "Party",
    detail: "Extended entertainment time block",
    priceKey: "party5h",
  },
  "party-photography": {
    id: "party-photography",
    label: "Celebration Photography",
    category: "Party",
    detail: "Photo coverage sized to a shorter celebration",
    priceKey: "partyPhotography",
    draft: true,
  },
  "party-highlight-video": {
    id: "party-highlight-video",
    label: "Social Highlight Video",
    category: "Party",
    detail: "A short edit shaped for phones and sharing",
    priceKey: "partyHighlightVideo",
    draft: true,
  },
  "corporate-dj": {
    id: "corporate-dj",
    label: "Corporate DJ / Entertainment",
    category: "Corporate",
    detail: "Hourly entertainment starting point",
    priceKey: "corporateDjHourly",
  },
  "corporate-av-basic": {
    id: "corporate-av-basic",
    label: "Meeting AV Package",
    category: "Corporate",
    detail: "Microphones, playback, and a display the back row can read",
    priceKey: "corporateAvBasic",
    draft: true,
  },
  "corporate-half-day": {
    id: "corporate-half-day",
    label: "Corporate Production Half-Day",
    category: "Corporate",
    detail: "Development-only custom scope anchor",
    priceKey: "corporateProductionHalfDay",
  },
  "corporate-full-day": {
    id: "corporate-full-day",
    label: "Corporate Production Full-Day",
    category: "Corporate",
    detail: "Development-only custom scope anchor",
    priceKey: "corporateProductionFullDay",
  },
  "corporate-media": {
    id: "corporate-media",
    label: "Corporate Photo + Video",
    category: "Corporate",
    detail: "Documentation you can actually use afterward",
    priceKey: "corporateMedia",
    draft: true,
  },
  "corporate-livestream": {
    id: "corporate-livestream",
    label: "Livestream + Hybrid Capture",
    category: "Corporate",
    detail: "For rooms with an audience that is not in the room",
    priceKey: "corporateLivestream",
    draft: true,
  },
  photography: {
    id: "photography",
    label: "Wedding Photography",
    category: "Media",
    detail: "Photography coverage starting point",
    priceKey: "weddingPhotography",
  },
  videography: {
    id: "videography",
    label: "Wedding Videography",
    category: "Media",
    detail: "Filmmaking coverage starting point",
    priceKey: "weddingVideography",
  },
  "photo-video": {
    id: "photo-video",
    label: "Photo + Video",
    category: "Media",
    detail: "Coordinated media coverage starting point",
    priceKey: "photoVideoBundle",
  },
  "engagement-session": {
    id: "engagement-session",
    label: "Engagement / Portrait Session",
    category: "Media",
    detail: "A relaxed session before the event week begins",
    priceKey: "engagementSession",
    draft: true,
  },
  "social-content": {
    id: "social-content",
    label: "Same-Week Social Content",
    category: "Media",
    detail: "Short vertical edits while the event still feels current",
    priceKey: "socialContent",
    draft: true,
  },
  "digital-booth": {
    id: "digital-booth",
    label: "Digital / Open-Air Booth",
    category: "Enhancement",
    detail: "Guest photo experience",
    priceKey: "digitalPhotoBooth",
  },
  "booth-360": {
    id: "booth-360",
    label: "360 Booth",
    category: "Enhancement",
    detail: "Short-form guest video experience",
    priceKey: "booth360",
  },
  clouds: {
    id: "clouds",
    label: "Dancing on Clouds",
    category: "Enhancement",
    detail: "Venue-dependent first-dance effect",
    priceKey: "dancingOnClouds",
  },
  "cold-sparks": {
    id: "cold-sparks",
    label: "Cold Sparks",
    category: "Enhancement",
    detail: "Venue approval and safe conditions required",
    priceKey: "coldSparks",
  },
  uplighting: {
    id: "uplighting",
    label: "Room Uplighting",
    category: "Enhancement",
    detail: "Colour on the walls so the room reads as one space",
    priceKey: "uplighting",
    draft: true,
  },
  monogram: {
    id: "monogram",
    label: "Custom Monogram Projection",
    category: "Enhancement",
    detail: "A projected name or motif on the floor or wall",
    priceKey: "monogram",
    draft: true,
  },
  "led-wall": {
    id: "led-wall",
    label: "LED Wall",
    category: "Enhancement",
    detail: "Venue power, rigging, and sightlines are always scoped first",
    priceKey: "ledWall",
    draft: true,
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
