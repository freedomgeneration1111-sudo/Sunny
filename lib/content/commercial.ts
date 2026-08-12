import type { MediaAsset } from "@/lib/media";
import { media } from "@/lib/media";
import type { PlanItemId } from "@/lib/plan";

export type FAQ = { question: string; answer: string };
export type ContentItem = { title: string; body: string; meta?: string };
export type CommercialSection = {
  id: string;
  kind: "editorial" | "cards" | "timeline" | "packages" | "checklist" | "pricing-bridge";
  eyebrow?: string;
  title: string;
  body: string;
  items?: readonly ContentItem[];
  planItemIds?: readonly PlanItemId[];
  media?: MediaAsset;
  secondaryMedia?: MediaAsset;
  theme?: "default" | "alt" | "dark";
};
export type CommercialPageContent = {
  hero: { eyebrow: string; title: string; body: string; media?: MediaAsset; variant?: "split" | "fullBleed" | "textLed"; inquiryEvent?: string };
  sections: readonly CommercialSection[];
  faqs: readonly FAQ[];
  cta: { title: string; body: string; event?: string };
};

export const commonFaqs: readonly FAQ[] = [
  { question: "Can we choose only the services we need?", answer: "Yes. Start with an event path, then choose media, entertainment, production, or a coordinated combination. The plan is modular by design." },
  { question: "Are the prices shown final?", answer: "No. This review build uses provisional development anchors. Focus Lab must confirm scope and customer-approved pricing before any agreement." },
  { question: "Which languages can support planning and hosting?", answer: "The verified language capabilities currently listed are English, Urdu, Hindi, and Punjabi. Exact hosting needs should still be confirmed for the event." },
];
const process: readonly ContentItem[] = [
  { title: "Share the event", body: "Start with the date, city, event type, and moments that matter." },
  { title: "Build the scope", body: "Choose useful pieces, then resolve venue, timing, crew, and technical details." },
  { title: "Confirm one plan", body: "Selected services move forward from the same event information and timeline." },
];

export const commercialPages = {
  weddings: {
    hero: { eyebrow: "DFW Weddings", title: "One wedding plan. Every cue connected.", body: "Bring photo, film, DJ/MC, and production into one coordinated plan—or choose only the pieces your wedding needs.", media: media.weddingsHero, variant: "fullBleed", inquiryEvent: "Wedding" },
    sections: [
      { id: "one-plan", kind: "editorial", eyebrow: "One shared timeline", title: "Your key moments should not compete for attention.", body: "Entrances, toasts, portraits, dances, and room transitions work better when each selected service follows the same event plan.", media: media.weddingCoordination },
      { id: "choose-path", kind: "cards", eyebrow: "Choose your path", title: "Begin with the experience—not a package name.", body: "Choose entertainment, media, or a coordinated combination. Staffing and deliverables remain custom until the event details are known.", theme: "alt", items: [
        { title: "Entertainment + Production", body: "DJ/MC, sound, lighting, and venue-aware enhancements.", meta: "Energy + room" },
        { title: "Photo + Video", body: "Photography, filmmaking, or combined coverage around the timeline.", meta: "Story + memory" },
        { title: "One coordinated combination", body: "Bring selected capabilities together where shared planning genuinely helps.", meta: "One plan" },
      ] },
      { id: "entertainment", kind: "packages", eyebrow: "Wedding entertainment", title: "Start with the room you need to run.", body: "Compare development anchors, then confirm ceremony needs, venue conditions, guest count, and timing.", planItemIds: ["wedding-dj-core", "wedding-dj-ceremony", "wedding-production"] },
      { id: "coverage", kind: "cards", eyebrow: "Coverage architecture", title: "Scale coverage to the shape of the day.", body: "Hours are a planning frame—not a promise of crew count or deliverables.", theme: "dark", items: [
        { title: "Focused coverage", body: "A tighter story around the most important event window.", meta: "6-hour frame" },
        { title: "Fuller day", body: "More room for preparation, portraits, ceremony, and reception context.", meta: "8-hour frame" },
        { title: "Extended story", body: "For longer sequences or more transitions to protect.", meta: "10-hour frame" },
      ] },
      { id: "media", kind: "packages", eyebrow: "Photo + video", title: "Choose how the day should be remembered.", body: "Add photography, filmmaking, or coordinated coverage to the plan.", planItemIds: ["photography", "videography", "photo-video"] },
      { id: "enhancements", kind: "packages", eyebrow: "Enhancements", title: "Add impact where it earns its place.", body: "Every effect remains subject to venue approval and safe operating conditions.", theme: "alt", planItemIds: ["digital-booth", "booth-360", "clouds", "cold-sparks"] },
      { id: "pricing", kind: "pricing-bridge", eyebrow: "Decision support", title: "Build a useful starting point, not a fake final quote.", body: "Carry selected services into the pricing planner, then into availability with context intact." },
      { id: "process", kind: "timeline", eyebrow: "The process", title: "Three steps. One event plan.", body: "Start with what you know. Resolve complexity when it becomes relevant.", items: process },
    ], faqs: commonFaqs, cta: { title: "Tell us the date. Shape the wedding from there.", body: "Share the basics and any plan items you are already considering.", event: "Wedding" },
  },
  southAsian: {
    hero: { eyebrow: "South Asian Weddings · DFW", title: "Built around your events—not a generic ritual checklist.", body: "Culturally fluent planning for contemporary Pakistani, Indian, and fusion celebrations across Dallas–Fort Worth.", media: media.southAsianHero, variant: "fullBleed", inquiryEvent: "South Asian Wedding" },
    sections: [
      { id: "fluency", kind: "editorial", eyebrow: "Cultural fluency", title: "The room should not have to stop and translate itself.", body: "English, Urdu, Hindi, and Punjabi capabilities can support family conversations, announcements, and planning without turning culture into a template.", media: media.southAsianMehndi },
      { id: "sequence", kind: "timeline", eyebrow: "Event-sequence model", title: "Plan the sequence before assigning services.", body: "Map the actual celebrations, venues, and transitions first. Then shape sound, hosting, production, and coverage for each one.", theme: "alt", media: media.southAsianBaraat, secondaryMedia: media.southAsianReception, items: [
        { title: "Arrival + procession", body: "Clarify movement, sound, family cues, and venue boundaries." },
        { title: "Pre-wedding celebration", body: "Give the mehndi or sangeet its own pace, color, and energy." },
        { title: "Ceremony", body: "Protect family context and moments that require restraint." },
        { title: "Reception", body: "Coordinate entrances, hosting, lighting, music, and coverage." },
      ] },
      { id: "events", kind: "cards", eyebrow: "Not a ritual template", title: "Your events define the plan.", body: "A single celebration, wedding day plus reception, and multi-event weekend require different conversations.", items: [
        { title: "Single event", body: "Scope one room, one timeline, and the services that support it." },
        { title: "Wedding day + reception", body: "Connect formal moments and reception energy without assuming one setup." },
        { title: "Full celebration", body: "Map multiple events and venues before estimating crew or production." },
      ] },
      { id: "production", kind: "packages", eyebrow: "Entertainment + production", title: "Build the sound and room around each event.", body: "Processions, live performers, and complex venues remain custom.", theme: "dark", planItemIds: ["wedding-dj-core", "wedding-dj-ceremony", "wedding-production", "clouds", "cold-sparks"] },
      { id: "media", kind: "packages", eyebrow: "Photo + video", title: "Keep continuity without making every event look the same.", body: "Scale coverage by event while preserving one overall story and shared family context.", planItemIds: ["photography", "videography", "photo-video", "south-asian-media"] },
      { id: "process", kind: "timeline", eyebrow: "Multi-event planning", title: "One sequence at a time.", body: "Resolve the event map before promising crew, setup, travel, or deliverables.", theme: "alt", items: process },
    ], faqs: [...commonFaqs, { question: "Do you assume every South Asian wedding has the same events?", answer: "No. Planning should reflect the celebrations and traditions you actually choose, including fusion or family-specific formats." }], cta: { title: "Start with the events you are actually planning.", body: "Share dates, venues if known, and which celebrations need coverage or production.", event: "South Asian Wedding" },
  },
  parties: {
    hero: { eyebrow: "Parties & Celebrations", title: "A private event that feels like your crowd.", body: "Choose a clear entertainment time block, then add only the media or production pieces that improve the room.", media: media.partyHero, variant: "split", inquiryEvent: "Party / Celebration" },
    sections: [
      { id: "examples", kind: "cards", eyebrow: "Celebration paths", title: "Start with the occasion and the people in the room.", body: "The event shapes the tone; guest count, venue, and timing shape the technical plan.", items: [
        { title: "Birthdays + milestones", body: "Music, hosting, and optional coverage shaped to the guest mix." },
        { title: "Engagements + anniversaries", body: "Move naturally between family moments and the dance floor." },
        { title: "Community celebrations", body: "Clarify announcements, program timing, sound, and room flow." },
      ] },
      { id: "duration", kind: "packages", eyebrow: "Choose a time block", title: "Three clear starting points.", body: "Values derive from the development-only hourly anchor. Overtime and inclusions still require confirmation.", theme: "dark", planItemIds: ["party-3h", "party-4h", "party-5h"] },
      { id: "scope", kind: "checklist", eyebrow: "Base scope", title: "Confirm what the event actually needs.", body: "Package inclusions are not customer-approved, so the plan surfaces decisions instead of inventing them.", items: [
        { title: "Room + guest count", body: "Size the sound conversation to the venue and audience." },
        { title: "Hosting + announcements", body: "Clarify how much MC structure the event needs." },
        { title: "Access + timing", body: "Account for load-in, setup, event time, and teardown." },
        { title: "Music direction", body: "Share priorities and the mix of people in the room." },
      ] },
      { id: "enhancements", kind: "packages", eyebrow: "Enhancements", title: "Add the pieces guests can use or feel.", body: "Booths and atmospheric effects remain modular, venue-dependent choices.", theme: "alt", planItemIds: ["digital-booth", "booth-360", "clouds", "cold-sparks"] },
      { id: "media", kind: "packages", eyebrow: "Optional media", title: "Keep the celebration without overscoping it.", body: "Photography, video, or coordinated coverage can be added after the event shape is clear.", planItemIds: ["photography", "videography", "photo-video"] },
      { id: "pricing", kind: "pricing-bridge", eyebrow: "Overtime + pricing clarity", title: "Time is visible. Undefined scope stays custom.", body: "The planner carries a time block and enhancements forward without inventing overtime rules or discounts." },
    ], faqs: commonFaqs, cta: { title: "Bring the date. Start shaping the energy.", body: "Share the occasion, city, guest count, and any starting plan items.", event: "Party / Celebration" },
  },
  corporate: {
    hero: { eyebrow: "Corporate & Community", title: "Professional production without the generic conference feel.", body: "Separate entertainment from media and technical production, then coordinate the pieces that belong together.", media: media.corporateHero, variant: "split", inquiryEvent: "Corporate / Community" },
    sections: [
      { id: "chooser", kind: "cards", eyebrow: "Choose the job", title: "What does the room need to accomplish?", body: "A social event, stage program, documentation brief, and multi-room production are different jobs.", items: [
        { title: "Entertainment", body: "Music and hosting appropriate to the event purpose and audience." },
        { title: "Production + AV", body: "Sound, staging, lighting, or room support scoped to the brief." },
        { title: "Photo + Video", body: "Document people, program moments, and useful post-event content." },
      ] },
      { id: "examples", kind: "cards", eyebrow: "Event examples", title: "Purpose changes the plan.", body: "Focus the inquiry on the job instead of forcing every organization event into one package.", theme: "alt", items: [
        { title: "Company celebrations", body: "Entertainment and coverage with an employee-centered tone." },
        { title: "Galas + fundraisers", body: "Program clarity, room energy, and documentation working together." },
        { title: "Community events", body: "Accessible hosting, reliable sound, and flexible audience flow." },
      ] },
      { id: "entertainment", kind: "packages", eyebrow: "Entertainment", title: "Use the hourly anchor as a starting point.", body: "Length, hosting, venue, audience, and production needs determine final scope.", planItemIds: ["corporate-dj"] },
      { id: "production", kind: "packages", eyebrow: "Production framework", title: "Half-day, full-day, or custom.", body: "Development anchors are for planning review only. Technical scope remains decisive.", theme: "dark", planItemIds: ["corporate-half-day", "corporate-full-day"] },
      { id: "logistics", kind: "checklist", eyebrow: "Reliability checklist", title: "Surface constraints early.", body: "A useful production conversation begins with the room, run of show, and operating requirements.", items: [
        { title: "Venue + load-in", body: "Access windows, docks, elevators, and setup limitations." },
        { title: "Program + rooms", body: "Run of show, presentation areas, breakouts, and audience movement." },
        { title: "Power + rigging", body: "Known venue rules, technical constraints, and approvals." },
        { title: "Insurance + documentation", body: "Share COI or vendor-documentation needs before final scope." },
      ] },
      { id: "inquiry", kind: "pricing-bridge", eyebrow: "Inquiry requirements", title: "You do not need a finished technical brief to start.", body: "Begin with date, city, purpose, estimated attendance, and known program needs." },
    ], faqs: commonFaqs, cta: { title: "Tell us what the room needs to do.", body: "Start with purpose, date, location, audience, and known production needs.", event: "Corporate / Community" },
  },
  photoVideo: {
    hero: { eyebrow: "Photo + Video", title: "Coverage that follows the story—not competing shot lists.", body: "Choose photography, filmmaking, or coordinated coverage built around the event timeline.", media: media.photoVideoHero, variant: "split", inquiryEvent: "" },
    sections: [
      { id: "selector", kind: "packages", eyebrow: "Choose the medium", title: "Photo, video, or both.", body: "Start with how you want to remember the event. Hours, crew, and deliverables come next.", planItemIds: ["photography", "videography", "photo-video"] },
      { id: "coverage", kind: "cards", eyebrow: "Coverage ladder", title: "Match time to the story you want covered.", body: "Coverage windows frame the conversation without promising a crew or deliverable list.", theme: "alt", items: [
        { title: "Focused", body: "Protect a concentrated set of moments within one event window.", meta: "6-hour frame" },
        { title: "Fuller", body: "Include more context around preparation, program, and celebration.", meta: "8-hour frame" },
        { title: "Extended", body: "Create room for longer sequences and additional transitions.", meta: "10-hour frame" },
      ] },
      { id: "scaling", kind: "checklist", eyebrow: "Crew + deliverable scaling", title: "Scope grows for a reason.", body: "Venue geography, simultaneous moments, length, and requested outputs determine whether coverage scales.", items: [
        { title: "Concurrent moments", body: "Separate locations or simultaneous priorities may require more coverage." },
        { title: "Event geography", body: "Travel between spaces affects time and crew planning." },
        { title: "Deliverable direction", body: "Clarify outputs before promising volume or turnaround." },
      ] },
      { id: "combined", kind: "editorial", eyebrow: "Why combined coverage helps", title: "One timeline can reduce friction around key moments.", body: "A coordinated plan clarifies where each camera needs to be without inventing unsupported promises.", theme: "dark", media: media.photoVideoDetail },
      { id: "options", kind: "cards", eyebrow: "Optional conversations", title: "Add only what serves the story.", body: "Separate sessions and social-first content remain custom until purpose, timing, and deliverables are verified.", items: [
        { title: "Portrait or pre-event session", body: "Scope separately from event-day coverage." },
        { title: "Social-first content", body: "Define format and turnaround before treating it as an inclusion." },
      ] },
      { id: "pricing", kind: "pricing-bridge", eyebrow: "Pricing", title: "Use starting anchors to choose a direction.", body: "The planner carries the selected media path into availability for exact scoping." },
    ], faqs: commonFaqs, cta: { title: "Tell us which moments need coverage.", body: "Share the event, date, city, and whether photo, video, or both matter most." },
  },
  production: {
    hero: { eyebrow: "Entertainment + Production", title: "Energy in the room. Control behind the scenes.", body: "DJ/MC, sound, lighting, and enhancement planning for weddings, parties, and professional events.", media: media.productionHero, variant: "fullBleed", inquiryEvent: "" },
    sections: [
      { id: "foundation", kind: "editorial", eyebrow: "The foundation", title: "Start with clear sound, useful hosting, and the room's purpose.", body: "Choose event type and time first. Venue, guest count, program, and complexity determine exact scope.", media: media.productionEffects },
      { id: "selector", kind: "cards", eyebrow: "Choose the event path", title: "The same equipment list should not define every room.", body: "Wedding, party, and professional event plans begin with different timing and audience needs.", theme: "alt", items: [
        { title: "Wedding", body: "Connect ceremony, reception, hosting, and key cues." },
        { title: "Party", body: "Start with time, crowd, and the energy the room needs." },
        { title: "Corporate + community", body: "Separate entertainment from stage, AV, and documentation." },
      ] },
      { id: "core", kind: "packages", eyebrow: "Core starting points", title: "Choose a foundation, then resolve exact scope.", body: "Current anchors keep decisions visible while technical combinations stay custom.", planItemIds: ["wedding-dj-core", "wedding-dj-ceremony", "party-4h", "corporate-dj"] },
      { id: "enhancements", kind: "packages", eyebrow: "Enhancement grid", title: "Impact without a wall of effects.", body: "Select individually. Venue permission and safe operating conditions always win.", theme: "dark", planItemIds: ["digital-booth", "booth-360", "clouds", "cold-sparks"] },
      { id: "custom", kind: "checklist", eyebrow: "Custom-production boundary", title: "Some rooms need a technical conversation, not a card.", body: "Advanced production stays custom when equipment, crew, venue, or conditions cannot be standardized.", items: [
        { title: "Advanced staging + LED", body: "Custom design and venue review required." },
        { title: "Live performers + live sound", body: "Inputs, monitoring, rehearsal, and crew change scope." },
        { title: "Multi-room production", body: "Signal, staffing, and run-of-show require exact planning." },
        { title: "Restrictive venues", body: "Power, rigging, effects, and load-in rules may change the solution." },
      ] },
      { id: "pricing", kind: "pricing-bridge", eyebrow: "Pricing", title: "Add what is known. Bring unknowns into scope.", body: "The planner carries selected foundations and enhancements into availability.", theme: "alt" },
    ], faqs: commonFaqs, cta: { title: "Start with the room—not an equipment list.", body: "Share purpose, venue or city, audience, and production pieces you are considering." },
  },
} as const satisfies Record<string, CommercialPageContent>;
