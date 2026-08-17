/**
 * Content for the four event sections of the homepage.
 *
 * These sections explain what Focus Lab can handle for each kind of event and
 * point at the pricing menu. They deliberately do not reproduce the service
 * catalog — `/pricing` is the single place a customer sees every service and
 * price, and each section links straight to its category there.
 */
import type { MediaAsset } from "@/lib/media";
import { media } from "@/lib/media";

export type EventAnchor = "weddings" | "asian-weddings" | "parties" | "corporate";

export type EventPathCard = {
  anchor: EventAnchor;
  title: string;
  body: string;
  asset: MediaAsset;
};

/** Slugs from `lib/content/guides.ts`, surfaced contextually rather than in bulk. */
export type GuideLinkSlug = string;

export const eventPathCards: readonly EventPathCard[] = [
  {
    anchor: "weddings",
    title: "Weddings",
    body: "One wedding day, planned on one timeline.",
    asset: media.eventWedding,
  },
  {
    anchor: "asian-weddings",
    title: "Asian Wedding Celebrations",
    body: "Multi-event celebrations, built around your family's schedule.",
    asset: media.eventAsianWedding,
  },
  {
    anchor: "parties",
    title: "Parties & Celebrations",
    body: "Birthdays, showers, anniversaries, graduations, reunions.",
    asset: media.eventParty,
  },
  {
    anchor: "corporate",
    title: "Corporate & Community",
    body: "Programs with something to accomplish and an audience to reach.",
    asset: media.eventCorporate,
  },
];

/* ── Weddings ──────────────────────────────────────────────────────── */

export const weddingsSection = {
  anchor: "weddings" as const,
  eyebrow: "Weddings",
  title: "One timeline keeps the whole day moving.",
  lead: "Entrances, vows, toasts, portraits, and the first song all depend on someone knowing what happens next. When media, music, and production work from the same plan, there are fewer handoffs to manage.",
  media: media.weddingsHero,
  detailMedia: media.weddingCoordination,
  moments: [
    { label: "Getting ready", note: "Quiet coverage while the room is still calm." },
    { label: "Ceremony", note: "Vows heard from the back row, with the processional cued." },
    { label: "Cocktail hour", note: "Room flips, portraits, and the first chance for guests to talk." },
    { label: "Reception", note: "Entrance, dinner, toasts, and dances, each one a handoff." },
    { label: "Last dance", note: "How the night ends is a decision, not an accident." },
  ],
  capabilities: [
    "DJ and MC for the ceremony, reception, or both",
    "Ceremony sound so vows and readings carry",
    "Photography and film, together or on their own",
    "Uplighting, monogram, and dance-floor effects",
    "Photo and 360 booths for guests",
  ],
  pricing: { href: "/pricing#pricing-weddings", label: "See Wedding Pricing" },
  guides: ["wedding-day-coordination-checklist", "photo-video-coverage-map"] as readonly GuideLinkSlug[],
  guide: { href: "/weddings", label: "Read the wedding planning guide" },
};

/* ── Asian Weddings ────────────────────────────────────────────────── */

export const asianWeddingsSection = {
  anchor: "asian-weddings" as const,
  eyebrow: "Asian Wedding Celebrations",
  title: "Built around your family's celebrations.",
  lead: "No two celebrations use the same sequence. Some families plan three events, some plan seven, and the names, order, and emphasis change between regions, faiths, and generations. We start from what you are actually planning.",
  media: media.asianWeddingHero,
  languages: ["English", "Urdu", "Hindi", "Punjabi"],
  sequenceNote: "Common examples, not a required order. Tell us which of these you are planning, and which you are not.",
  sequence: [
    { label: "Mehndi", note: "Color, seated guests, and long stretches of music with no formal program." },
    { label: "Sangeet", note: "Performances and rehearsed sets that need someone watching the cues." },
    { label: "Baraat", note: "Outdoors and moving, which makes sound the main thing to solve." },
    { label: "Nikah / Ceremony", note: "Quiet coverage, clear amplification, and respect for how the space is used." },
    { label: "Reception", note: "The largest room, the longest program, the most transitions." },
    { label: "Valima", note: "Often a different venue, a different guest list, and a different tone." },
  ],
  continuity: {
    title: "Shared planning carries between events.",
    body: "Names, timing, venue details, and family preferences move from one event to the next, so the same ground is not covered twice.",
    points: [
      { title: "Names learned once", body: "Pronunciations, family roles, and who to ask carry forward rather than being collected again." },
      { title: "One media story", body: "Coverage across events is framed and graded as one body of work." },
      { title: "Venues already understood", body: "Power, load-in, and room details are known before the next event." },
      { title: "Timing that compounds", body: "What ran long at one event informs the plan for the next." },
    ],
  },
  editorialMedia: [media.asianWeddingMehndi, media.asianWeddingBaraat],
  capabilities: [
    "Coverage for a single celebration or the whole week",
    "Photo and video across multiple events",
    "Baraat procession sound that travels outdoors",
    "DJ, MC, and performance playback with cue sheets",
    "Lighting and production sized to each room",
  ],
  pricing: { href: "/pricing#pricing-asian-weddings", label: "See Asian Wedding Pricing" },
  guides: ["asian-wedding-week-timeline", "mehndi-baraat-valima-venue-checklist"] as readonly GuideLinkSlug[],
  guide: { href: "/asian-weddings", label: "Read the Asian wedding planning guide" },
};

/* ── Parties ───────────────────────────────────────────────────────── */

export const partiesSection = {
  anchor: "parties" as const,
  eyebrow: "Parties & Celebrations",
  title: "Choose the time block that fits the celebration.",
  lead: "Most celebrations do not need a wedding-sized plan. They need the right amount of time, someone reading the room, and a couple of good decisions about what gets remembered.",
  media: media.partyHero,
  occasions: [
    "Birthdays",
    "Milestone birthdays",
    "Baby and bridal showers",
    "Anniversaries",
    "Graduations",
    "Retirements",
    "Engagement parties",
    "Family reunions",
    "Holiday parties",
  ],
  durations: [
    { label: "3 hours", note: "A focused celebration with one clear centerpiece." },
    { label: "4 hours", note: "The most common length. Room to eat, speak, and dance." },
    { label: "5 hours", note: "For a longer night where the dancing builds late." },
  ],
  capabilities: [
    "DJ and MC who read the room rather than run a playlist",
    "Announcements handled so speeches do not drift",
    "Photography sized to a shorter celebration",
    "Short highlight video made for sharing",
    "Uplighting, monogram, and photo booths",
  ],
  pricing: { href: "/pricing#pricing-parties", label: "See Party Pricing" },
  guides: ["enhancements-venue-approval"] as readonly GuideLinkSlug[],
  guide: { href: "/events/parties", label: "Read the party planning guide" },
};

/* ── Corporate ─────────────────────────────────────────────────────── */

export const corporateSection = {
  anchor: "corporate" as const,
  eyebrow: "Corporate & Community",
  title: "Built around what the event needs to accomplish.",
  lead: "A sales kickoff, a gala, a community festival, and an all-hands are four different problems. Start from what the room owes its audience, then choose what serves it.",
  media: media.corporateHero,
  jobs: [
    {
      code: "01",
      title: "Entertainment",
      body: "Music and hosting for receptions, galas, holiday parties, and community events where the room needs energy and a clear voice.",
    },
    {
      code: "02",
      title: "Microphones and audio",
      body: "Podium, lapel, handheld, and panel microphones, with enough channels and spare batteries that a presenter moving around is not a problem.",
    },
    {
      code: "03",
      title: "Screens and playback",
      body: "Displays the back row can read, video that plays with its audio routed properly, and adapters for whatever people actually bring.",
    },
    {
      code: "04",
      title: "Production and AV",
      body: "Staging, lighting, and sightlines for half-day and full-day programs, plus LED walls where the room and power allow.",
    },
    {
      code: "05",
      title: "Recording and media",
      body: "Photography and video that produce something usable afterward, for recruiting, reporting, sponsors, or next year's promotion.",
    },
    {
      code: "06",
      title: "Combined production",
      body: "Multi-room programs, hybrid audiences, and technically unusual venues, where entertainment, AV, and media are planned as one.",
    },
  ],
  logistics: {
    title: "What we confirm before a professional event.",
    items: [
      "Room dimensions, ceiling height, and where the audience sits",
      "Load-in access, elevator or dock availability, and the setup window",
      "Available power, and whether anything needs to be run to it",
      "Who is presenting, from where, and whether they move",
      "Rehearsal window, run-of-show owner, and who can approve changes",
      "Insurance, COI, and venue documentation requirements",
    ],
  },
  pricing: { href: "/pricing#pricing-corporate", label: "See Corporate Pricing" },
  guides: ["corporate-av-checklist"] as readonly GuideLinkSlug[],
  guide: { href: "/events/corporate", label: "Read the corporate event guide" },
};
