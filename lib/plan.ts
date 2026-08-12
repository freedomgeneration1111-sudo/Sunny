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
  "corporate-dj": {
    id: "corporate-dj",
    label: "Corporate DJ / Entertainment",
    category: "Corporate",
    detail: "Hourly entertainment starting point",
    priceKey: "corporateDjHourly",
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
} as const satisfies Record<string, PlanItem>;

export type PlanItemId = keyof typeof planItems;

export function isPlanItemId(value: string): value is PlanItemId {
  return value in planItems;
}
