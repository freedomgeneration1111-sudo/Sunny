export type MediaTruth = "ai-brand" | "authentic-approved" | "authentic-pending" | "development-placeholder";
export type MediaAsset = { id: string; src: string; alt: string; purpose: string; truth: MediaTruth; desktopAspect: string; mobileAspect: string; objectPosition?: string; priority?: "P0" | "P1" | "P2" };
const placeholder = (id: string, src: string, alt: string, purpose: string, desktopAspect = "16/9", mobileAspect = "4/5", objectPosition = "center"): MediaAsset => ({ id, src, alt, purpose, truth: "development-placeholder", desktopAspect, mobileAspect, objectPosition });
const generated = (id: string, src: string, alt: string, purpose: string, desktopAspect = "16/9", mobileAspect = "4/5", objectPosition = "center", priority: "P0" | "P1" | "P2" = "P1"): MediaAsset => ({ id, src, alt, purpose, truth: "ai-brand", desktopAspect, mobileAspect, objectPosition, priority });

export const media = {
  homeHero: generated("HOME-HERO-01", "/images/generated/home-hero-01.webp", "A couple and their guests celebrate together at a warmly lit reception", "Home hero", "16/10", "4/5", "72% center", "P0"),
  eventSouthAsian: generated("HOME-EVENT-SA-01", "/images/generated/home-event-sa-01.webp", "A South Asian couple celebrates with family at a reception", "South Asian event path", "4/5", "4/5", "center", "P0"),
  eventWedding: generated("HOME-EVENT-WEDDING-01", "/images/generated/home-event-wedding-01.webp", "A couple shares a joyful moment on the dance floor", "Wedding event path", "4/5", "4/5", "center", "P0"),
  eventParty: generated("HOME-EVENT-PARTY-01", "/images/generated/home-event-party-01.webp", "Friends dance together at a private celebration", "Party event path", "4/5", "4/5", "center", "P0"),
  eventCorporate: generated("HOME-EVENT-CORP-01", "/images/generated/home-event-corp-01.webp", "An audience watches a program at a professional event", "Corporate event path", "4/5", "4/5", "center", "P0"),
  capture: generated("HOME-CAPTURE-01", "/images/generated/home-capture-01.webp", "A photographer documents a candid family moment", "Photo and video capability", "3/2", "4/3"),
  production: generated("HOME-PRODUCTION-01", "/images/generated/home-production-01.webp", "A reception room prepared with coordinated sound and lighting", "Entertainment and production capability", "3/2", "4/3"),
  weddingsHero: generated("WEDDINGS-HERO-01", "/images/generated/weddings-hero-01.webp", "A newly married couple celebrates in front of their guests", "Weddings hero", "16/9", "4/5", "center right", "P0"),
  weddingCoordination: generated("WEDDINGS-COORDINATION-01", "/images/generated/weddings-coordination-01.webp", "An emcee cues a couple's entrance as guests look on", "Wedding coordination", "3/2", "4/3"),
  southAsianHero: generated("SA-HERO-01", "/images/generated/south-asian-hero-01.webp", "A South Asian couple celebrates with family at their reception", "South Asian weddings hero", "16/9", "4/5", "center right", "P0"),
  southAsianBaraat: generated("SA-BARAAT-01", "/images/generated/sa-baraat-01.webp", "A groom and family dance together during a baraat", "South Asian event sequence", "3/2", "4/5"),
  southAsianMehndi: generated("SA-MEHNDI-01", "/images/generated/sa-mehndi-01.webp", "Family gathers as henna is applied during a mehndi celebration", "South Asian event sequence", "3/2", "4/5"),
  southAsianReception: generated("SA-RECEPTION-01", "/images/generated/sa-reception-01.webp", "A South Asian couple and family celebrate on the dance floor", "South Asian production", "16/10", "4/5"),
  partyHero: generated("PARTY-HERO-01", "/images/generated/party-hero-01.webp", "Friends dance together at a polished private celebration", "Parties hero", "16/9", "4/5", "center right", "P0"),
  corporateHero: generated("CORP-HERO-01", "/images/generated/corporate-hero-01.webp", "A presenter addresses an engaged audience at a professional event", "Corporate hero", "16/9", "4/5", "center right", "P0"),
  photoVideoHero: generated("PHOTO-VIDEO-HERO-01", "/images/generated/photo-video-hero-01.webp", "A photographer and videographer document an event together", "Photo video hero", "16/9", "4/5", "center right", "P0"),
  photoVideoDetail: generated("PHOTO-VIDEO-DETAIL-01", "/images/generated/photo-video-detail-01.webp", "One guest fastens a delicate bracelet on another guest's wrist", "Photo video detail", "3/2", "4/3"),
  productionHero: generated("PRODUCTION-HERO-01", "/images/generated/production-hero-01.webp", "Guests dance beneath coordinated event lighting", "Production hero", "16/9", "4/5", "center right", "P0"),
  productionEffects: generated("PRODUCTION-EFFECTS-01", "/images/generated/production-effects-01.webp", "A couple dances between low clouds and controlled cold-spark effects", "Production effects", "3/2", "4/5"),
  heroReception: placeholder("legacy-hero", "/images/hero-south-asian-reception-wide.jpg", "Reception", "Legacy"),
  featuredFamilyEmotion: placeholder("legacy-family", "/images/featured-family-emotion.jpg", "Family moment", "Legacy"),
  featuredDancefloorWide: placeholder("legacy-dance", "/images/featured-dancefloor-wide.jpg", "Dance floor", "Legacy"),
  featuredRoomLighting: placeholder("legacy-lighting", "/images/featured-room-lighting.jpg", "Room lighting", "Legacy"),
  featuredFilmmakerBts: placeholder("legacy-film", "/images/featured-filmmaker-bts.jpg", "Film equipment", "Legacy"),
  socialContentVertical: placeholder("legacy-social", "/images/social-content-vertical.jpg", "Vertical filming", "Legacy"),
  processCoordination: placeholder("legacy-process", "/images/process-coordination.jpg", "Event planning", "Legacy"),
  saMehndiColor: placeholder("legacy-mehndi", "/images/sa-mehndi-color.jpg", "Mehndi", "Legacy"),
  saCeremonyWide: placeholder("legacy-sa-ceremony", "/images/sa-ceremony-wide.jpg", "Ceremony", "Legacy"),
  saEntranceReaction: placeholder("legacy-sa-entrance", "/images/sa-entrance-reaction.jpg", "Entrance", "Legacy"),
  saGenerations: placeholder("legacy-sa-family", "/images/sa-generations.jpg", "Family", "Legacy"),
  partyBirthdayWide: placeholder("legacy-party", "/images/party-birthday-wide.jpg", "Party", "Legacy"),
  partyMcCrowd: placeholder("legacy-mc", "/images/party-mc-crowd.jpg", "MC", "Legacy"),
  weddingCoupleNight: placeholder("legacy-wedding", "/images/wedding-couple-night.jpg", "Couple", "Legacy"),
  detailHandsTexture: placeholder("legacy-detail", "/images/detail-hands-texture.jpg", "Detail", "Legacy"),
  corporateStageWide: placeholder("legacy-corporate", "/images/corporate-stage-wide.jpg", "Stage", "Legacy"),
} as const;

export const teamPortraitPlaceholder: MediaAsset = placeholder("team-needed", "/brand/focus-lab-mark.svg", "", "Team asset", "4/5", "4/5");
