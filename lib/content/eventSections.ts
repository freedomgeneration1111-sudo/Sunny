/**
 * Content for the four event sections of the one-anchor homepage.
 *
 * The homepage is the customer journey: a visitor identifies their event here
 * and shops it here. The matching routes (/weddings, /south-asian-weddings,
 * /events/parties, /events/corporate) are the knowledge layer — the same
 * subject at greater depth.
 *
 * Services and prices are never written here. Sections reference
 * `PlanItemId`s, and `lib/plan.ts` remains the only service inventory.
 *
 * Copy in this file is FIRST-DRAFT development content written to establish
 * shape and rhythm. It is expected to be rewritten in the content sprint.
 */
import type { MediaAsset } from "@/lib/media";
import { media } from "@/lib/media";
import type { PlanItemId } from "@/lib/plan";

export type EventAnchor = "weddings" | "shaadi" | "parties" | "corporate";

export type EventPathCard = {
  anchor: EventAnchor;
  title: string;
  body: string;
  asset: MediaAsset;
};

/** The mental map at the top of the page. These scroll; they never navigate away. */
export const eventPathCards: readonly EventPathCard[] = [
  {
    anchor: "weddings",
    title: "Weddings",
    body: "One wedding day, one timeline, every cue connected.",
    asset: media.eventWedding,
  },
  {
    anchor: "shaadi",
    title: "Shaadi Celebrations",
    body: "Multi-event celebrations planned around your family's sequence.",
    asset: media.eventSouthAsian,
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
    body: "Rooms that have a job to do, and an audience to reach.",
    asset: media.eventCorporate,
  },
];

export type PlanGroup = { title: string; note?: string; ids: readonly PlanItemId[] };

/* ── Weddings — a ceremony→reception spine ─────────────────────────── */

export const weddingsSection = {
  anchor: "weddings" as const,
  eyebrow: "Single-day weddings",
  title: "The day runs on cues, not on vendors.",
  lead: "Entrances, vows, toasts, portraits, and the first song all depend on someone knowing what happens next. When the same crew holds the timeline, the transitions stop being a risk.",
  media: media.weddingsHero,
  detailMedia: media.weddingCoordination,
  moments: [
    { label: "Getting ready", note: "Quiet coverage while the room is still calm. Nothing is staged yet." },
    { label: "Ceremony", note: "Vows heard from the back row. Processional and recessional cued, not guessed." },
    { label: "Cocktail hour", note: "Room flips, portraits, and the first real chance for guests to talk." },
    { label: "Reception", note: "Entrance, dinner, toasts, dances — each one a handoff between music, mic, and camera." },
    { label: "Last dance", note: "How the night ends is a decision, not an accident. Send-off or final song." },
  ],
  planGroups: [
    { title: "Entertainment + hosting", ids: ["wedding-dj-core", "wedding-dj-ceremony", "wedding-production", "ceremony-sound"] },
    { title: "Photo + video", ids: ["photography", "videography", "photo-video"] },
    { title: "Worth considering", note: "Every effect is subject to venue approval.", ids: ["digital-booth", "clouds", "uplighting", "cold-sparks"] },
  ] satisfies readonly PlanGroup[],
  guide: { href: "/weddings", label: "Read the complete DFW wedding planning guide" },
};

/* ── Shaadi — a sequence rail, explicitly not a required order ──────── */

export const shaadiSection = {
  anchor: "shaadi" as const,
  eyebrow: "Shaadi celebrations",
  title: "Built around your events — not a generic ritual checklist.",
  lead: "No two celebrations use the same sequence. Some families plan three events, some plan seven, and the names, order, and emphasis change between regions, faiths, and generations. We start from what you are actually planning.",
  media: media.southAsianHero,
  sequenceNote:
    "Common examples, not a required order. Tell us which of these you are planning — and which you are not.",
  sequence: [
    { label: "Mehndi", note: "Colour, seated guests, and long stretches of music with no formal program." },
    { label: "Sangeet", note: "Performances, rehearsed sets, and cue sheets that need someone watching closely." },
    { label: "Baraat", note: "Outdoors, moving, and often the hardest sound problem of the week." },
    { label: "Nikah / Ceremony", note: "Quiet coverage, clear amplification, and respect for how the space is used." },
    { label: "Reception", note: "The largest room, the longest program, the most transitions." },
    { label: "Valima", note: "Often a different venue, a different guest list, and a different tone." },
  ],
  continuity: {
    title: "Why continuity across events matters.",
    body: "A crew that was at the Mehndi already knows the families, the names, the pronunciations, and who actually makes decisions. By the reception, nothing is being explained for the second time.",
    points: [
      { title: "Names learned once", body: "Pronunciations, family roles, and who to ask are carried between events rather than re-collected." },
      { title: "One media story", body: "Coverage across events is framed and graded as one body of work, not separate shoots." },
      { title: "Equipment already scoped", body: "Venue power, load-in, and room constraints are known before the next event, not discovered at it." },
      { title: "Timing that compounds", body: "What ran long at one event informs the plan for the next while there is still time to adjust." },
    ],
  },
  editorialMedia: [media.southAsianMehndi, media.southAsianBaraat],
  planGroups: [
    { title: "Start where your week starts", note: "Multi-event scope is always confirmed in conversation.", ids: ["sa-single-event", "sa-wedding-reception", "sa-full-celebration"] },
    { title: "Event-specific needs", ids: ["sa-baraat", "south-asian-media", "social-content"] },
  ] satisfies readonly PlanGroup[],
  guide: { href: "/south-asian-weddings", label: "Read the complete Shaadi planning guide" },
};

/* ── Parties — duration is the primary axis ─────────────────────────── */

export const partiesSection = {
  anchor: "parties" as const,
  eyebrow: "Parties & celebrations",
  title: "Start with how long the room stays alive.",
  lead: "Most celebrations do not need a wedding-sized plan. They need the right amount of time, someone reading the room, and a couple of good decisions about what gets remembered.",
  media: media.partyHero,
  occasions: [
    "Birthdays",
    "Milestone birthdays",
    "Baby & bridal showers",
    "Anniversaries",
    "Graduations",
    "Retirements",
    "Engagement parties",
    "Family reunions",
    "Holiday parties",
  ],
  durationNote: "Time blocks are the starting point. Overtime, setup, and travel are confirmed before anything is agreed.",
  durationIds: ["party-3h", "party-4h", "party-5h"] as readonly PlanItemId[],
  planGroups: [
    { title: "Keep something from the night", ids: ["party-photography", "party-highlight-video", "digital-booth", "booth-360"] },
    { title: "Change how the room feels", note: "Venue approval required for effects.", ids: ["uplighting", "monogram", "clouds"] },
  ] satisfies readonly PlanGroup[],
  guide: { href: "/events/parties", label: "Read the party & celebration planning guide" },
};

/* ── Corporate — organised by the job, deliberately not wedding-shaped ── */

export const corporateSection = {
  anchor: "corporate" as const,
  eyebrow: "Corporate & community",
  title: "Organised around the job the room has to do.",
  lead: "A sales kickoff, a gala, a community festival, and an all-hands are four different problems. Start from the outcome the room owes its audience, then choose the capability that serves it.",
  media: media.corporateHero,
  jobs: [
    {
      code: "01",
      title: "Entertainment",
      body: "Music and hosting for receptions, galas, holiday parties, and community events where the room needs energy and a clear voice.",
      ids: ["corporate-dj"] as readonly PlanItemId[],
    },
    {
      code: "02",
      title: "Production / AV",
      body: "Microphones, playback, displays, and staging for programs where people have to hear a presenter and read a slide from the back of the room.",
      ids: ["corporate-av-basic", "corporate-half-day", "corporate-full-day"] as readonly PlanItemId[],
    },
    {
      code: "03",
      title: "Media",
      body: "Photography and video that produce something usable afterward — for recruiting, reporting, sponsors, or next year's promotion.",
      ids: ["corporate-media", "social-content"] as readonly PlanItemId[],
    },
    {
      code: "04",
      title: "Combined / Custom",
      body: "Multi-room programs, hybrid audiences, and technically unusual venues, where entertainment, AV, and media have to be planned as one.",
      ids: ["corporate-livestream", "led-wall"] as readonly PlanItemId[],
    },
  ],
  logistics: {
    title: "What we confirm before a professional event.",
    items: [
      "Room dimensions, ceiling height, and where the audience actually sits",
      "Load-in access, elevator or dock availability, and setup window",
      "Available power, and whether anything needs to be run to it",
      "Who is presenting, from where, and whether they move",
      "Rehearsal window, run-of-show owner, and who can approve changes",
      "Insurance, COI, and venue documentation requirements",
    ],
  },
  guide: { href: "/events/corporate", label: "Read the corporate event & AV planning guide" },
};
