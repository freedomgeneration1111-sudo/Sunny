export type MediaTruth =
  | "ai-brand"
  | "authentic-approved"
  | "authentic-pending"
  | "development-placeholder";

/**
 * Approved prior-work candidates for desktop hero comparison. Source names and
 * exact edit ranges are retained as provenance; they are not location claims.
 */
export type DesktopHeroCandidate = {
  id: string;
  label: string;
  alt: string;
  mp4: string;
  webm: string;
  poster: string;
  truth: "authentic-approved";
  source: { filename: string; start: string; end: string };
  playbackRate?: number;
  desktopFocal: {
    scale: number;
    translateXPercent: number;
    translateYPercent?: number;
    objectPosition?: string;
    originXPercent: number;
  };
};

export const desktopHeroCandidates = [
  {
    id: "flp-v002",
    label: "Wedding couple portrait",
    alt: "A smiling couple in red and white wedding attire embrace beneath warm lights",
    mp4: "/video/approved/focuslab-desktop-hero-flp-v002.mp4",
    webm: "/video/approved/focuslab-desktop-hero-flp-v002.webm",
    poster: "/images/hero/approved/focuslab-desktop-hero-flp-v002-poster.jpg",
    truth: "authentic-approved",
    source: { filename: "couple.mp4", start: "00:00:00.250", end: "00:00:04.750" },
    playbackRate: 0.5,
    desktopFocal: {
      scale: 1.11,
      translateXPercent: 16,
      translateYPercent: 4,
      objectPosition: "center top",
      originXPercent: 0,
    },
  },
] as const satisfies readonly DesktopHeroCandidate[];

/**
 * Authentic mobile hero stills, pulled from the same approved desktop video
 * candidates above (same `id`s, so a still can be traced back to its source
 * clip). Mobile doesn't play video, so these rotate as static frames instead.
 * Empty while the sole desktop candidate (flp-v002) has no mobile still of
 * its own — CinematicHeroMedia falls back to the desktop poster on mobile.
 */
export type MobileHeroCandidate = {
  id: string;
  label: string;
  alt: string;
  src: string;
  truth: "authentic-approved";
  source: { filename: string; timestamp: string };
};

export const mobileHeroCandidates = [] as const satisfies readonly MobileHeroCandidate[];
export type MediaAsset = {
  id: string;
  src: string;
  alt: string;
  purpose: string;
  truth: MediaTruth;
  desktopAspect: string;
  mobileAspect: string;
  objectPosition?: string;
  priority?: "P0" | "P1" | "P2";
  source?: {
    candidateId: string;
    master: string;
    transformation: string;
  };
};

const generated = (
  id: string,
  src: string,
  alt: string,
  purpose: string,
  desktopAspect = "16/9",
  mobileAspect = "4/5",
  objectPosition = "center",
  priority: "P0" | "P1" | "P2" = "P1",
): MediaAsset => ({
  id,
  src,
  alt,
  purpose,
  truth: "ai-brand",
  desktopAspect,
  mobileAspect,
  objectPosition,
  priority,
});

const authentic = (
  id: string,
  src: string,
  alt: string,
  purpose: string,
  desktopAspect: string,
  mobileAspect: string,
  objectPosition: string,
  priority: "P0" | "P1" | "P2",
  source: NonNullable<MediaAsset["source"]>,
): MediaAsset => ({
  id,
  src,
  alt,
  purpose,
  truth: "authentic-approved",
  desktopAspect,
  mobileAspect,
  objectPosition,
  priority,
  source,
});

export const media = {
  homeHero: generated("HOME-HERO-01", "/images/hero/hero-wedding-desktop-poster.webp", "A bride in a red lehenga on her wedding day", "Home hero", "16/10", "4/5", "center", "P0"),
  eventAsianWedding: authentic(
    "HOME-EVENT-SA-01",
    "/images/authentic/focus-lab-asian-wedding-couple-001.webp",
    "A smiling couple in red and white wedding attire embrace beneath warm lights",
    "Asian wedding event path",
    "4/5",
    "4/5",
    "center",
    "P0",
    {
      candidateId: "FLP-P001",
      master: "artifacts/media-review/processed-master/stills/FLP-P001-master-retouched-full-srgb.tif",
      transformation: "461x576 portrait crop from the full-frame retouched master; no resampling",
    },
  ),
  eventWedding: authentic(
    "HOME-EVENT-WEDDING-01",
    "/images/authentic/focus-lab-wedding-bridal-portrait-001.webp",
    "A bride in an ornate red lehenga reclines with hands raised, showing mehndi and jewelry",
    "Wedding event path",
    "4/5",
    "4/5",
    "center",
    "P0",
    {
      candidateId: "FLP-P008",
      master: "artifacts/media-review/processed-master/stills/FLP-P008-master-crop-clean-srgb.tif",
      transformation: "461x576 portrait crop from the clean master; no resampling",
    },
  ),
  eventParty: authentic(
    "HOME-EVENT-PARTY-01",
    "/images/authentic/focus-lab-party-dance-floor-portrait-001.webp",
    "A guest in white sunglasses dances among a crowded reception floor",
    "Party event path",
    "4/5",
    "4/5",
    "center",
    "P0",
    {
      candidateId: "FLP-P018",
      master: "artifacts/media-review/processed-master/stills/FLP-P018-master-full-srgb.tif",
      transformation: "256x320 portrait crop from the full-frame master; no resampling",
    },
  ),
  eventCorporate: generated("HOME-EVENT-CORP-01", "/images/generated/home-event-corp-01.webp", "A speaker addresses a full seated audience from a lectern in a conference hall", "Corporate event path", "4/5", "4/5", "center", "P0"),
  capture: authentic(
    "HOME-CAPTURE-01",
    "/images/authentic/focus-lab-wedding-editorial-portrait-001.webp",
    "A bride in a full ball gown stands before a sunset-lit cathedral with the groom behind her",
    "Photo and video capability",
    "3/2",
    "4/3",
    "center",
    "P1",
    {
      candidateId: "FLP-P005",
      master: "artifacts/media-review/processed-master/stills/FLP-P005-master-crop-clean-srgb.tif",
      transformation: "864x576 landscape crop from the clean master; no resampling",
    },
  ),
  production: authentic(
    "HOME-PRODUCTION-01",
    "/images/authentic/focus-lab-event-mc-001.webp",
    "An event host speaking into a microphone beside a lectern",
    "Entertainment and production capability",
    "3/2",
    "4/3",
    "62% center",
    "P1",
    {
      candidateId: "FLP-P014",
      master: "artifacts/media-review/processed-master/stills/FLP-P014-master-full-srgb.tif",
      transformation: "1067x711 landscape crop from the full-frame master; no resampling",
    },
  ),
  weddingsHero: authentic(
    "WEDDINGS-HERO-01",
    "/images/authentic/focus-lab-wedding-architecture-couple-001.webp",
    "A bride and groom embrace on white architectural steps beneath a pale sky",
    "Weddings hero",
    "16/9",
    "4/5",
    "58% center",
    "P0",
    {
      candidateId: "FLP-P011",
      master: "artifacts/media-review/processed-master/stills/FLP-P011-master-crop-clean-srgb.tif",
      transformation: "884x497 landscape crop from the clean master; no resampling",
    },
  ),
  weddingCoordination: authentic(
    "WEDDINGS-COORDINATION-01",
    "/images/authentic/focus-lab-wedding-intimate-couple-001.webp",
    "A bride and groom dance together, her lehenga skirt flaring, outside an illuminated venue at night",
    "Wedding coordination",
    "3/2",
    "4/3",
    "center",
    "P1",
    {
      candidateId: "FLP-P004",
      master: "artifacts/media-review/processed-master/stills/FLP-P004-master-crop-clean-srgb.tif",
      transformation: "768x576 4:3 crop from the clean master; no resampling",
    },
  ),
  asianWeddingHero: authentic(
    "SA-HERO-01",
    "/images/authentic/focus-lab-asian-wedding-couple-landscape-001.webp",
    "A smiling couple in red and white wedding attire embrace beneath warm lights",
    "Asian weddings hero",
    "16/9",
    "4/5",
    "center",
    "P0",
    {
      candidateId: "FLP-P001",
      master: "artifacts/media-review/processed-master/stills/FLP-P001-master-retouched-full-srgb.tif",
      transformation: "Full 1024x576 retouched master converted to WebP; no crop or resampling",
    },
  ),
  asianWeddingBaraat: generated("SA-BARAAT-01", "/images/generated/sa-baraat-01.webp", "A dhol player leading a baraat procession at dusk", "Asian wedding event sequence", "3/2", "4/5"),
  asianWeddingMehndi: generated("SA-MEHNDI-01", "/images/generated/sa-mehndi-01.webp", "Henna being applied to a hand beside gold bangles in candlelight", "Asian wedding event sequence", "3/2", "4/5"),
  asianWeddingReception: generated("SA-RECEPTION-01", "/images/generated/sa-reception-01.webp", "An opulent reception hall with a chandelier and candlelit tables", "Asian wedding production", "16/10", "4/5"),
  partyHero: authentic(
    "PARTY-HERO-01",
    "/images/authentic/focus-lab-party-dance-floor-landscape-001.webp",
    "Guests dance together on a crowded reception floor",
    "Parties hero",
    "16/10",
    "4/5",
    "center",
    "P0",
    {
      candidateId: "FLP-P018",
      master: "artifacts/media-review/processed-master/stills/FLP-P018-master-full-srgb.tif",
      transformation: "512x320 landscape crop from the full-frame master; no resampling",
    },
  ),
  corporateHero: generated("CORP-HERO-01", "/images/generated/corporate-hero-01.webp", "An empty conference ballroom with a lit stage, lectern and screen", "Corporate hero", "16/9", "4/5", "center right", "P0"),
  photoVideoHero: authentic(
    "PHOTO-VIDEO-HERO-01",
    "/images/authentic/focus-lab-wedding-overhead-portrait-001.webp",
    "An overhead wedding portrait of a bride and groom on dark stone steps",
    "Photo video hero",
    "16/9",
    "4/5",
    "38% center",
    "P0",
    {
      candidateId: "FLP-P006",
      master: "artifacts/media-review/processed-master/stills/FLP-P006-master-crop-clean-srgb.tif",
      transformation: "884x497 landscape crop from the clean master; no resampling",
    },
  ),
  photoVideoDetail: generated("PHOTO-VIDEO-DETAIL-01", "/images/generated/photo-video-detail-01.webp", "A camera body, spare lens and memory cards on a dark surface", "Photo video detail", "3/2", "4/3"),
  productionHero: generated("PRODUCTION-HERO-01", "/images/generated/production-hero-01.webp", "An ornate draped stage with a chandelier and candlelight", "Production hero", "16/9", "4/5", "center right", "P0"),
  productionEffects: generated("PRODUCTION-EFFECTS-01", "/images/generated/production-effects-01.webp", "A dance floor filled with low haze cut by warm light beams", "Production effects", "3/2", "4/5"),
} as const;
