export const hero = {
  eyebrow: "Dallas–Fort Worth Event Media + Entertainment",
  h1: "Your event. Full volume.",
  subhead:
    "Photography, film, DJ & MC, lighting and fast social content for DFW weddings, South Asian celebrations, parties and events.",
  primaryCta: "Check Availability",
  secondaryCta: "See Our Work",
  microcopy: "Tell us the date and what you're planning. We'll help you shape the right crew.",
};

export const credibility = {
  items: ["South Asian Event Experience", "DFW", "Photo · Film · DJ · Production"],
};

export const eventChooser: Array<{
  title: string;
  body: string;
  linkLabel: string;
  href: string;
  mediaKey: "eventCardSouthAsian" | "eventCardWedding" | "eventCardParty" | "eventCardCorporate";
}> = [
  {
    title: "South Asian Weddings",
    body: "Culture, timing and family all matter. A team that understands the flow of the celebration can anticipate the moments instead of waiting to be told.",
    linkLabel: "Explore South Asian Weddings",
    href: "/south-asian-weddings",
    mediaKey: "eventCardSouthAsian",
  },
  {
    title: "Weddings",
    body: "Beautiful coverage. A room that feels alive. Build the media and entertainment team around the kind of wedding you actually want to experience.",
    linkLabel: "Explore Weddings",
    href: "/weddings",
    mediaKey: "eventCardWedding",
  },
  {
    title: "Parties & Milestones",
    body: "Give people a reason to stay on the dance floor. DJ, MC, sound, lighting, photography and social-ready content for birthdays, engagements, anniversaries, graduations and private celebrations.",
    linkLabel: "Explore Parties",
    href: "/parties",
    mediaKey: "eventCardParty",
  },
  {
    title: "Corporate & Organizations",
    body: "Professional does not have to feel flat. Media, entertainment and event production for company celebrations, community events, galas and organization gatherings.",
    linkLabel: "Explore Corporate",
    href: "/corporate",
    mediaKey: "eventCardCorporate",
  },
];

export const servicesIntro = {
  eyebrow: "What We Do",
  h2: "One event. Five ways to make it hit.",
  body: "Start with one service or build a coordinated team. The goal is not to sell you everything. It is to put the right people in the room for your event.",
  cta: "Check Availability",
};

export const services = [
  { title: "DJ & MC", body: "Music, pacing and a room that keeps moving." },
  { title: "Photography", body: "Editorial portraits, real reactions and the moments between them." },
  { title: "Film", body: "Cinematic coverage built around movement, sound and story." },
  { title: "Lighting & Effects", body: "Shape the room, focus the energy and make key moments land." },
  {
    title: "Social Content",
    body: "Vertical clips and fast-turnaround highlights made for the way people share now.",
  },
];

export const featuredWork = {
  eyebrow: "The Work",
  h2: "Culture in motion.",
  body: "The best event photographs do more than look polished. They show energy, people, timing, scale and the small moments that would otherwise disappear.",
  filters: ["All", "South Asian", "Weddings", "Parties", "Production"] as const,
  cta: "See Our Work",
  note: "Prototype note: all gallery media is proxy imagery until replaced by real/staged work.",
  items: [
    { mediaKey: "featuredFamilyEmotion", category: "South Asian" },
    { mediaKey: "featuredDancefloorWide", category: "Parties" },
    { mediaKey: "featuredRoomLighting", category: "Production" },
    { mediaKey: "saMehndiColor", category: "South Asian" },
    { mediaKey: "weddingCoupleNight", category: "Weddings" },
    { mediaKey: "processCoordination", category: "Production" },
  ] as const,
};

export const packagesPreview = {
  eyebrow: "Start Where You Are",
  h2: "Build around the event, not a package name.",
  body: "Some clients need a photographer. Some need a DJ. Some need a multi-day team working from the same plan. We'll start with what matters and build from there.",
  columns: [
    { title: "Weddings", body: "Photo, film, entertainment and production options for one-day and multi-day celebrations." },
    { title: "Parties", body: "DJ-led packages with optional photography, video, lighting and social content." },
    { title: "Custom Production", body: "For events that need several disciplines working together." },
  ],
  cta: "Check Availability",
  note: "Pricing and package details are being finalized for the launch market.",
};

export const process = {
  eyebrow: "How It Works",
  steps: [
    { number: "01", title: "Tell us the event", body: "Share the date, location, type of celebration and what you already know you need." },
    { number: "02", title: "Build the plan", body: "We match the right services and people to the event instead of forcing everything into one template." },
    { number: "03", title: "Show up & celebrate", body: "You live the event. The crew handles the work." },
  ],
};

export const socialContent = {
  eyebrow: "While It Still Feels Like Last Night",
  h2: "Your gallery can take time. Your first post shouldn't.",
  body: "Fast vertical content gives you something polished to share while the energy is still fresh — without replacing the photography and film you will keep.",
  cta: "Ask About Social Content",
};

export const proof = {
  eyebrow: "Real Client Stories",
  h2: "Proof belongs to the people who hired us.",
  body: "Real testimonials will replace this section as approved client material is collected.",
};

export const finalCta = {
  h2: "Tell us the date. We'll take it from there.",
  body: "Wedding, party, corporate event or something in between — send the basics and we'll talk through the right next step.",
  primaryCta: "Check Availability",
};
