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
  {
    question: "Can I book just one service?",
    answer:
      "Yes. Take photo only, DJ only, or any combination that fits your event. Booking more than one service simply means they are planned on the same timeline.",
  },
  {
    question: "Are the prices on your pricing page final?",
    answer:
      "The pricing menu shows what each service costs to start. Your quote is prepared around your actual date, venue, hours, and the services you want, so the final number can differ.",
  },
  {
    question: "Which languages can you support?",
    answer:
      "Our team can communicate in English, Urdu, Hindi, and Punjabi. Tell us what language support would be useful for your event and we will plan around it.",
  },
  {
    question: "Do you handle multi-event celebrations?",
    answer:
      "Yes. Multi-event celebrations are quoted around the schedule your family is planning — however many events that is, in whatever order they happen.",
  },
  {
    question: "How far ahead should we get in touch?",
    answer:
      "Earlier is easier, especially for peak Saturdays and holiday weekends. If your date is soon, ask anyway — we will tell you honestly whether we can cover it.",
  },
  {
    question: "Do you travel outside Dallas–Fort Worth?",
    answer:
      "Often, yes. Travel outside the metroplex is quoted with the event, so include the location when you get in touch.",
  },
];

export const pricingFaqs: readonly FAQ[] = [
  {
    question: "Is the price I see what I pay?",
    answer:
      "It is the starting point. Services marked “From” move with hours, venue, travel, and crew. Services with a flat price are the price shown for that time block.",
  },
  {
    question: "Why do some services say Custom Quote?",
    answer:
      "Larger production, multi-event celebrations, and unusual venues vary too much to carry one number honestly. Tell us what you are planning and we will put a real figure to it.",
  },
  {
    question: "Can I combine services from different categories?",
    answer:
      "Yes, and it is common. Photo from one category and DJ from another are planned together on one timeline rather than quoted as separate bookings.",
  },
  {
    question: "How do I get an actual quote?",
    answer:
      "Send us your date, venue or city, and the services you have in mind through Check Availability. Our team prepares the quote and confirms the details with you.",
  },
  {
    question: "Do you require a deposit?",
    answer:
      "A date is held once a signed agreement and deposit are in place. The specifics are confirmed with your quote.",
  },
];


export const commercialPages = {
  photoVideo: {
    hero: { eyebrow: "Photo + Video", title: "Coverage that follows the story.", body: "Choose photography, film, or both, planned around your event timeline.", media: media.photoVideoHero, variant: "split", inquiryEvent: "" },
    sections: [
      { id: "selector", kind: "packages", eyebrow: "Choose the medium", title: "Photo, video, or both.", body: "Start with how you want to remember the event. Hours and crew come next.", planItemIds: ["photography", "videography", "photo-video"] },
      { id: "coverage", kind: "cards", eyebrow: "Coverage ladder", title: "Match time to the story you want covered.", body: "Coverage length is a starting point. What it includes is confirmed with your quote.", theme: "alt", items: [
        { title: "Focused", body: "Protect a concentrated set of moments within one event window.", meta: "6-hour frame" },
        { title: "Fuller", body: "Include more context around preparation, program, and celebration.", meta: "8-hour frame" },
        { title: "Extended", body: "Create room for longer sequences and additional transitions.", meta: "10-hour frame" },
      ] },
      { id: "scaling", kind: "checklist", eyebrow: "Crew + deliverable scaling", title: "What makes coverage grow.", body: "Distance between spaces, moments happening at once, event length, and what you want afterward all affect the crew we send.", items: [
        { title: "Concurrent moments", body: "Separate locations or things happening at the same time may need more coverage." },
        { title: "Event geography", body: "Travel between spaces affects timing and crew." },
        { title: "What you want afterward", body: "Tell us what you actually want, and we will tell you what is realistic." },
      ] },
      { id: "combined", kind: "editorial", eyebrow: "Why combined coverage helps", title: "One timeline makes the key moments easier.", body: "When photo and film are planned together, each knows where the other needs to be.", theme: "dark", media: media.photoVideoDetail },
      { id: "options", kind: "cards", eyebrow: "Optional conversations", title: "Add only what serves the story.", body: "Sessions and short-form content are quoted around what you want them for.", items: [
        { title: "Portrait or pre-event session", body: "Booked separately from event-day coverage." },
        { title: "Social-first content", body: "Tell us the format and how quickly you want it." },
      ] },
      { id: "pricing", kind: "pricing-bridge", eyebrow: "Pricing", title: "See where photo and video pricing starts.", body: "Browse the full menu, then send us your event details for a quote." },
    ], faqs: commonFaqs, cta: { title: "Tell us which moments need coverage.", body: "Share the event, date, city, and whether photo, video, or both matter most." },
  },
  production: {
    hero: { eyebrow: "Entertainment + Production", title: "Energy in the room. Control behind the scenes.", body: "DJ/MC, sound, lighting, and enhancement planning for weddings, parties, and professional events.", media: media.productionHero, variant: "fullBleed", inquiryEvent: "" },
    sections: [
      { id: "foundation", kind: "editorial", eyebrow: "The foundation", title: "Start with clear sound, good hosting, and what the room is for.", body: "Start with the event type and how long it runs. Venue, guest count, and program shape the rest.", media: media.productionEffects },
      { id: "selector", kind: "cards", eyebrow: "Choose the event path", title: "One equipment list does not suit every room.", body: "Weddings, parties, and professional events start from different timing and audience needs.", theme: "alt", items: [
        { title: "Wedding", body: "Connect ceremony, reception, hosting, and key cues." },
        { title: "Party", body: "Start with time, crowd, and the energy the room needs." },
        { title: "Corporate + community", body: "Separate entertainment from stage, AV, and documentation." },
      ] },
      { id: "core", kind: "packages", eyebrow: "Where to start", title: "Pick a starting point for the room.", body: "These are the most common places to begin. Larger or more technical setups are quoted individually.", planItemIds: ["wedding-dj-core", "wedding-dj-ceremony", "party-4h", "corporate-dj"] },
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
