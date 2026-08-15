export type MediaTruth = "ai-brand" | "authentic";

/**
 * The homepage hero rotation.
 *
 * The player alternates between these clips: each plays once at normal speed,
 * holds on a still frame for `holdMs`, then hands over to the next.
 *
 * The wedding clip is the client's own submission and carries a burned-in
 * watermark and subtitle. It is deliberately left as supplied — see the
 * hero-video report — rather than cropped or hidden.
 *
 * The mehndi clip ends on a half-second sparkle transition, so it pauses at
 * 7.3s rather than on its literal last frame. The wedding clip ends on usable
 * content and needs no such override.
 *
 * Seeking to arbitrary points is unreliable in the wedding encodes (sparse
 * keyframes); seeking to zero, which is all the rotation does, is dependable.
 */
export const heroClips = [
  {
    desktop: "/video/hero-wedding-03-desktop.mp4",
    mobile: "/video/hero-wedding-03-mobile.mp4",
    poster: "/images/hero/hero-wedding-desktop-poster.webp",
    posterMobile: "/images/hero/hero-wedding-mobile-poster.webp",
  },
  {
    desktop: "/video/hero-mehndi-desktop.mp4",
    mobile: "/video/hero-mehndi-mobile.mp4",
    poster: "/images/hero/hero-mehndi-desktop-poster.webp",
    posterMobile: "/images/hero/hero-mehndi-mobile-poster.webp",
    holdAtSeconds: 7.3,
  },
] as const;

export const heroVideo = {
  truth: "authentic" as MediaTruth,
  holdMs: 20_000,
} as const;
export type MediaAsset = { id: string; src: string; alt: string; purpose: string; truth: MediaTruth; desktopAspect: string; mobileAspect: string; objectPosition?: string; priority?: "P0" | "P1" | "P2" };
const generated = (id: string, src: string, alt: string, purpose: string, desktopAspect = "16/9", mobileAspect = "4/5", objectPosition = "center", priority: "P0" | "P1" | "P2" = "P1"): MediaAsset => ({ id, src, alt, purpose, truth: "ai-brand", desktopAspect, mobileAspect, objectPosition, priority });

export const media = {
  homeHero: generated("HOME-HERO-01", "/images/hero/hero-wedding-desktop-poster.webp", "A bride in a red lehenga on her wedding day", "Home hero", "16/10", "4/5", "center", "P0"),
  eventSouthAsian: generated("HOME-EVENT-SA-01", "/images/generated/home-event-sa-01.webp", "A South Asian couple celebrates with family at a reception", "South Asian event path", "4/5", "4/5", "center", "P0"),
  eventWedding: generated("HOME-EVENT-WEDDING-01", "/images/generated/home-event-wedding-01.webp", "A couple shares a joyful moment on the dance floor", "Wedding event path", "4/5", "4/5", "center", "P0"),
  eventParty: generated("HOME-EVENT-PARTY-01", "/images/generated/home-event-party-01.webp", "Friends dance together at a private celebration", "Party event path", "4/5", "4/5", "center", "P0"),
  eventCorporate: generated("HOME-EVENT-CORP-01", "/images/generated/home-event-corp-01.webp", "An audience watches a program at a professional event", "Corporate event path", "4/5", "4/5", "center", "P0"),
  capture: generated("HOME-CAPTURE-01", "/images/generated/home-capture-01.webp", "Close-up of a professional camera lens against warm gold bokeh", "Photo and video capability", "3/2", "4/3"),
  production: generated("HOME-PRODUCTION-01", "/images/generated/home-production-01.webp", "Hands on a DJ mixing console under purple stage lighting", "Entertainment and production capability", "3/2", "4/3"),
  weddingsHero: generated("WEDDINGS-HERO-01", "/images/generated/weddings-hero-01.webp", "A newly married couple celebrates in front of their guests", "Weddings hero", "16/9", "4/5", "center right", "P0"),
  weddingCoordination: generated("WEDDINGS-COORDINATION-01", "/images/generated/weddings-coordination-01.webp", "An emcee cues a couple's entrance as guests look on", "Wedding coordination", "3/2", "4/3"),
  southAsianHero: generated("SA-HERO-01", "/images/generated/south-asian-hero-01.webp", "A South Asian couple celebrates with family at their reception", "South Asian weddings hero", "16/9", "4/5", "center right", "P0"),
  southAsianBaraat: generated("SA-BARAAT-01", "/images/generated/sa-baraat-01.webp", "A groom and family dance together during a baraat", "South Asian event sequence", "3/2", "4/5"),
  southAsianMehndi: generated("SA-MEHNDI-01", "/images/generated/sa-mehndi-01.webp", "Family gathers as henna is applied during a mehndi celebration", "South Asian event sequence", "3/2", "4/5"),
  southAsianReception: generated("SA-RECEPTION-01", "/images/generated/sa-reception-01.webp", "A South Asian couple and family celebrate on the dance floor", "South Asian production", "16/10", "4/5"),
  partyHero: generated("PARTY-HERO-01", "/images/generated/party-hero-01.webp", "Friends dance together at a polished private celebration", "Parties hero", "16/9", "4/5", "center right", "P0"),
  corporateHero: generated("CORP-HERO-01", "/images/generated/corporate-hero-01.webp", "A presenter addresses an engaged audience at a professional event", "Corporate hero", "16/9", "4/5", "center right", "P0"),
  photoVideoHero: generated("PHOTO-VIDEO-HERO-01", "/images/generated/photo-video-hero-01.webp", "A cinema camera on a tripod at an event venue", "Photo video hero", "16/9", "4/5", "center right", "P0"),
  photoVideoDetail: generated("PHOTO-VIDEO-DETAIL-01", "/images/generated/photo-video-detail-01.webp", "One guest fastens a delicate bracelet on another guest's wrist", "Photo video detail", "3/2", "4/3"),
  productionHero: generated("PRODUCTION-HERO-01", "/images/generated/production-hero-01.webp", "An ornate draped stage with a chandelier and candlelight", "Production hero", "16/9", "4/5", "center right", "P0"),
  productionEffects: generated("PRODUCTION-EFFECTS-01", "/images/generated/production-effects-01.webp", "A couple dances between low clouds and controlled cold-spark effects", "Production effects", "3/2", "4/5"),
} as const;
