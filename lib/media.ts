export type MediaStatus = "proxy" | "real" | "needed";

export type MediaAsset = {
  id: string;
  src: string;
  alt: string;
  purpose: string;
  status: MediaStatus;
  aspectRatio?: string;
};

/**
 * All 22 assets from sunnylab_proxy_image_manifest.md v0.1, generated via
 * Grok/GPT image tools. Every entry is `status: "proxy"` until real or
 * staged company work replaces it — see the manifest's replacement
 * priority list before swapping any of these out.
 */
export const media = {
  heroReception: {
    id: "01",
    src: "/images/hero-south-asian-reception-wide.jpg",
    alt: "Couple entering a wedding reception as guests turn toward them, warm amber light",
    purpose: "Homepage hero",
    status: "proxy",
    aspectRatio: "16/9",
  },
  eventCardSouthAsian: {
    id: "02",
    src: "/images/event-card-south-asian.jpg",
    alt: "South Asian wedding arrival with family and dhol energy",
    purpose: "Event chooser — South Asian Weddings",
    status: "proxy",
    aspectRatio: "4/5",
  },
  eventCardWedding: {
    id: "03",
    src: "/images/event-card-wedding.jpg",
    alt: "Couple portrait at a modern venue during blue hour",
    purpose: "Event chooser — Weddings",
    status: "proxy",
    aspectRatio: "4/5",
  },
  eventCardParty: {
    id: "04",
    src: "/images/event-card-party.jpg",
    alt: "Guests dancing at a private milestone party",
    purpose: "Event chooser — Parties",
    status: "proxy",
    aspectRatio: "4/5",
  },
  eventCardCorporate: {
    id: "05",
    src: "/images/event-card-corporate.jpg",
    alt: "Adults socializing at a corporate celebration",
    purpose: "Event chooser — Corporate",
    status: "proxy",
    aspectRatio: "4/5",
  },
  featuredFamilyEmotion: {
    id: "06",
    src: "/images/featured-family-emotion.jpg",
    alt: "Quiet family moment adjusting the couple's clothing before a ceremony",
    purpose: "Featured work — emotional proof",
    status: "proxy",
    aspectRatio: "3/2",
  },
  featuredDancefloorWide: {
    id: "07",
    src: "/images/featured-dancefloor-wide.jpg",
    alt: "Packed dance floor at peak energy",
    purpose: "Featured work — party energy",
    status: "proxy",
    aspectRatio: "3/2",
  },
  featuredRoomLighting: {
    id: "08",
    src: "/images/featured-room-lighting.jpg",
    alt: "Wide view of a ballroom with uplighting and stage design prepared for a reception",
    purpose: "Featured work — lighting & production",
    status: "proxy",
    aspectRatio: "16/9",
  },
  featuredDjAction: {
    id: "09",
    src: "/images/featured-dj-action.jpg",
    // NOTE: generated result is a dancefloor/crowd moment rather than a
    // DJ-focused shot per the manifest brief — usable as general party
    // energy, weak as the dedicated DJ & MC services image. Candidate
    // for regeneration before this becomes a real promo asset.
    alt: "Crowd dancing at a reception",
    purpose: "Services — DJ & MC (brief mismatch, see note)",
    status: "proxy",
    aspectRatio: "4/5",
  },
  featuredFilmmakerBts: {
    id: "10",
    src: "/images/featured-filmmaker-bts.jpg",
    alt: "Camera and lighting rig set up facing a reception stage, crew visible in soft focus",
    purpose: "Services — Film; About — crew competence",
    status: "proxy",
    aspectRatio: "3/2",
  },
  socialContentVertical: {
    id: "11",
    src: "/images/social-content-vertical.jpg",
    alt: "Content creator filming a vertical short-form moment at a reception",
    purpose: "Social-ready content block",
    status: "proxy",
    aspectRatio: "9/16",
  },
  processCoordination: {
    id: "12",
    src: "/images/process-coordination.jpg",
    alt: "Small event crew reviewing a run-of-show before guests arrive",
    purpose: "Process / About — production intelligence",
    status: "proxy",
    aspectRatio: "3/2",
  },
  saMehndiColor: {
    id: "13",
    src: "/images/sa-mehndi-color.jpg",
    alt: "Mehndi celebration with family gathered closely, marigold and jade textiles",
    purpose: "South Asian Weddings — multi-day",
    status: "proxy",
    aspectRatio: "4/5",
  },
  saCeremonyWide: {
    id: "14",
    src: "/images/sa-ceremony-wide.jpg",
    alt: "Wide documentary frame of a South Asian wedding ceremony",
    purpose: "South Asian Weddings — ceremony",
    status: "proxy",
    aspectRatio: "16/9",
  },
  saEntranceReaction: {
    id: "15",
    src: "/images/sa-entrance-reaction.jpg",
    alt: "Wedding entrance moment with both the couple and family reactions in frame",
    purpose: "South Asian Weddings — timing & cues",
    status: "proxy",
    aspectRatio: "3/2",
  },
  saGenerations: {
    id: "16",
    src: "/images/sa-generations.jpg",
    alt: "Three generations of a family sharing a candid moment",
    purpose: "South Asian Weddings — family",
    status: "proxy",
    aspectRatio: "4/5",
  },
  partyBirthdayWide: {
    id: "17",
    src: "/images/party-birthday-wide.jpg",
    alt: "Host laughing with friends near a dance floor at a milestone party",
    purpose: "Parties — hero/gallery",
    status: "proxy",
    aspectRatio: "16/9",
  },
  partyMcCrowd: {
    id: "18",
    src: "/images/party-mc-crowd.jpg",
    alt: "MC speaking to an engaged crowd with a wireless microphone",
    purpose: "Parties — MC section",
    status: "proxy",
    aspectRatio: "3/2",
  },
  weddingCoupleNight: {
    id: "19",
    src: "/images/wedding-couple-night.jpg",
    alt: "Couple portrait at night outside a modern venue",
    purpose: "General Weddings — hero/gallery",
    status: "proxy",
    aspectRatio: "16/9",
  },
  detailHandsTexture: {
    id: "20",
    src: "/images/detail-hands-texture.jpg",
    alt: "Close detail of hands, fabric and jewelry during a wedding",
    purpose: "Work — detail example",
    status: "proxy",
    aspectRatio: "4/5",
  },
  corporateStageWide: {
    id: "21",
    src: "/images/corporate-stage-wide.jpg",
    alt: "Corporate gala stage with presenter and audience tables",
    purpose: "Corporate page",
    status: "proxy",
    aspectRatio: "16/9",
  },
  cueFrameAbstractBg: {
    id: "22",
    src: "/images/cue-frame-abstract-bg.png",
    alt: "",
    purpose: "Abstract divider background",
    status: "proxy",
    aspectRatio: "16/9",
  },
} satisfies Record<string, MediaAsset>;

/**
 * Team portraits do not exist in the manifest or either asset zip — there
 * is no individually-shot headshot in the delivered set. Rather than pair
 * invented names with a photo that was never meant to represent a real
 * person, About-page team slots are registered as `status: "needed"` so
 * they render the spec's own ASSET NEEDED treatment until Sunny supplies
 * real portraits.
 */
export const teamPortraitPlaceholder: MediaAsset = {
  id: "team-portrait",
  src: "",
  alt: "Team portrait pending",
  purpose: "About — team block",
  status: "needed",
  aspectRatio: "4/5",
};
