export const workHero = {
  eyebrow: "Selected Work",
  h1: "Look for the moment before the moment.",
  subhead:
    "Great event work is not only the hero portrait. It is anticipation, timing, reaction, movement, atmosphere and the people around the frame.",
};

export const galleryIntro = {
  body: "Browse weddings, South Asian celebrations, parties and production. The prototype uses clearly marked proxy media; every public-facing image will be replaced by real or staged work before promotion.",
  filters: ["All", "South Asian", "Weddings", "Parties", "DJ & Production", "Film"] as const,
};

export const whatToLookFor = [
  { title: "People", body: "Expressions that feel observed, not manufactured." },
  { title: "Motion", body: "Entrances, dance floors and transitions that still have energy in a still frame." },
  { title: "Atmosphere", body: "Lighting and room design that support the people instead of overpowering them." },
  { title: "Scale", body: "Wide images that prove we understand the whole room, not only the couple." },
  { title: "Detail", body: "The quiet pieces that give the bigger event texture." },
];

export const workFinalCta = {
  h2: "Like the way we see events?",
  cta: "Check Availability",
};

export const workGalleryItems: Array<{
  mediaKey:
    | "heroReception"
    | "featuredFamilyEmotion"
    | "featuredDancefloorWide"
    | "featuredRoomLighting"
    | "featuredFilmmakerBts"
    | "saMehndiColor"
    | "saCeremonyWide"
    | "saEntranceReaction"
    | "saGenerations"
    | "weddingCoupleNight"
    | "detailHandsTexture"
    | "partyMcCrowd"
    | "corporateStageWide"
    | "processCoordination"
    | "socialContentVertical";
  category: (typeof galleryIntro.filters)[number];
}> = [
  { mediaKey: "heroReception", category: "South Asian" },
  { mediaKey: "saCeremonyWide", category: "South Asian" },
  { mediaKey: "saMehndiColor", category: "South Asian" },
  { mediaKey: "saEntranceReaction", category: "South Asian" },
  { mediaKey: "saGenerations", category: "South Asian" },
  { mediaKey: "weddingCoupleNight", category: "Weddings" },
  { mediaKey: "detailHandsTexture", category: "Weddings" },
  { mediaKey: "featuredFamilyEmotion", category: "Weddings" },
  { mediaKey: "featuredDancefloorWide", category: "Parties" },
  { mediaKey: "partyMcCrowd", category: "Parties" },
  { mediaKey: "featuredRoomLighting", category: "DJ & Production" },
  { mediaKey: "processCoordination", category: "DJ & Production" },
  { mediaKey: "corporateStageWide", category: "DJ & Production" },
  { mediaKey: "featuredFilmmakerBts", category: "Film" },
  { mediaKey: "socialContentVertical", category: "Film" },
];
