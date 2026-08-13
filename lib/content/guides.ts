export type GuideSection = {
  title: string;
  body: string;
  items: readonly string[];
};

export type Guide = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  relatedEvent: string;
  sections: readonly GuideSection[];
};

export const guides = [
  {
    slug: "wedding-day-coordination-checklist",
    eyebrow: "Wedding Planning Guide",
    title: "Wedding-Day Coordination Checklist",
    description: "A practical checklist for aligning entrances, toasts, media coverage, music, and room transitions.",
    intro: "Use this checklist to turn a collection of vendors and moments into one readable event sequence. It is a planning aid—not a substitute for venue rules or a finalized run of show.",
    relatedEvent: "Wedding",
    sections: [
      { title: "Before the timeline is locked", body: "Resolve the decisions that affect every selected service.", items: ["Confirm venue access, load-in, event start, and hard end times.", "List the people authorized to approve timeline or room changes.", "Mark which moments require music, microphones, photo, video, or lighting cues.", "Share venue restrictions for power, sound, rigging, haze, clouds, or cold sparks."] },
      { title: "People and announcements", body: "Give the person holding the microphone a confirmed list of names and the running order.", items: ["Write names phonetically when pronunciation may be unclear.", "Confirm the entrance order and where each person waits.", "Name the person who will gather speakers before toasts.", "Decide how schedule changes will reach the couple and crew without interrupting guests."] },
      { title: "Key reception transitions", body: "Treat each transition as a shared cue rather than an isolated song or shot.", items: ["Grand entrance into the next planned moment.", "First dance and any parent or family dances.", "Toasts, blessing, dinner release, and open-dance transition.", "Cake, private last dance, send-off, or final announcement if used."] },
    ],
  },
  {
    slug: "shaadi-week-timeline",
    eyebrow: "South Asian Wedding Guide",
    title: "Shaadi-Week Timeline Framework",
    description: "Map a multi-event wedding week before assigning entertainment, production, and media coverage.",
    intro: "No two Shaadi weeks need the same sequence. Start with the celebrations your families are actually planning, then attach venues, access windows, people, and services to each one.",
    relatedEvent: "South Asian Wedding",
    sections: [
      { title: "Build the event map", body: "Create one row for every celebration rather than treating the week as a single long booking.", items: ["Event name and family-preferred terminology.", "Date, venue, address, and room or entrance location.", "Guest arrival, family arrival, formal start, and hard end.", "Selected media, sound, hosting, lighting, and enhancement needs."] },
      { title: "Mark the handoffs", body: "Multi-event plans often become unclear between venues or between daytime and evening programs.", items: ["Travel time and parking between locations.", "Wardrobe, hair and makeup, portraits, and family-photo windows.", "Equipment reset or second-room requirements.", "Who can approve a delay when it affects the next event."] },
      { title: "Protect family context", body: "Keep language, pronunciation, and family-specific traditions in the working plan.", items: ["Preferred languages for announcements and planning conversations.", "Names and phonetic pronunciations for key family members.", "Music requests, do-not-play notes, and performance tracks by event.", "Traditions that need quiet, specific positioning, or advance cueing."] },
    ],
  },
  {
    slug: "mehndi-baraat-valima-venue-checklist",
    eyebrow: "South Asian Wedding Guide",
    title: "Mehndi, Baraat & Valima Venue Checklist",
    description: "Questions to ask each venue when a wedding sequence moves across rooms, dates, or properties.",
    intro: "Venue conditions can change the production plan even when the guest list stays the same. Review each celebration independently and use the family’s chosen event terminology.",
    relatedEvent: "South Asian Wedding",
    sections: [
      { title: "Access and movement", body: "Confirm how people and equipment reach the actual event space.", items: ["Vendor access time, loading entrance, elevator, stairs, and parking.", "Baraat or arrival route, gathering point, weather alternative, and property boundaries.", "Room flip timing and whether guests must move between spaces.", "End-of-night strike window and any overtime or security requirements."] },
      { title: "Sound and power", body: "Do not assume ceremony, procession, and reception areas share the same technical conditions.", items: ["Indoor and outdoor sound limits or cutoff times.", "Available circuits and venue-approved power locations.", "House audio requirements and whether outside equipment may connect.", "Microphone needs for family remarks, officiants, performers, or program hosts."] },
      { title: "Lighting and effects", body: "Ask before committing to any enhancement.", items: ["Rules for uplighting, intelligent lighting, floor protection, and cable paths.", "Written approval requirements for low-lying clouds or cold sparks.", "Fire alarm, haze, sprinkler, ceiling-height, and exit-clearance restrictions.", "Required insurance, certificates, operators, or venue technicians."] },
    ],
  },
  {
    slug: "corporate-av-checklist",
    eyebrow: "Corporate & Community Guide",
    title: "Corporate AV Checklist",
    description: "A concise brief for sound, stage, presentations, audience flow, and technical ownership.",
    intro: "A useful AV brief starts with the program and room—not an equipment shopping list. Capture the decisions below before requesting exact production scope.",
    relatedEvent: "Corporate / Community",
    sections: [
      { title: "Program and audience", body: "Describe what people need to see, hear, and do.", items: ["Guest count, seating format, room dimensions, and overflow plan.", "Presenter count, panels, awards, performances, or audience questions.", "Program start, breaks, room resets, and hard end.", "Accessibility needs, assisted listening, captions, or language support to confirm."] },
      { title: "Playback and presentation", body: "Identify every source before show day.", items: ["Presentation computer ownership and backup file format.", "Slides, video playback, walk-on music, remote presenters, and internet dependency.", "Confidence monitor, timer, notes, or teleprompter needs.", "Person authorized to approve final files and last-minute replacements."] },
      { title: "Technical logistics", body: "Exact scope depends on venue infrastructure and access.", items: ["Load-in path, dock, parking, elevator, and security check-in.", "House AV exclusivity, patch fees, internet, power, rigging, and labor rules.", "Rehearsal or sound-check access and presenter arrival times.", "Who owns show calling and how changes reach stage, audio, lighting, and media teams."] },
    ],
  },
  {
    slug: "photo-video-coverage-map",
    eyebrow: "Photo + Video Guide",
    title: "Photo + Video Coverage Map",
    description: "Decide where coverage matters most before choosing hours, crew size, or deliverables.",
    intro: "Coverage works best when priorities are attached to time and place. Use this map to distinguish must-capture moments from optional context without creating competing shot lists.",
    relatedEvent: "Wedding",
    sections: [
      { title: "Map the day", body: "Place each meaningful block on one shared sequence.", items: ["Preparation locations and when people become camera-ready.", "First look, portraits, ceremony, room reveal, reception, and exit if planned.", "Travel between locations and any access or parking delay.", "Private or culturally sensitive moments that require permission or limited coverage."] },
      { title: "Name the priorities", body: "Give the team decisions, not an unranked list of hundreds of images.", items: ["People and relationships that must be represented.", "Details with personal, cultural, or memorial meaning.", "Moments that require both wide context and close reaction.", "Any restrictions on posting, sharing, or photographing particular guests."] },
      { title: "Coordinate photo and film", body: "Combined coverage needs positioning and timing decisions.", items: ["Primary angle and safe secondary positions for one-time moments.", "Audio sources for vows, speeches, performances, or interviews.", "Portrait blocks that preserve movement and do not consume the event.", "Deliverables and coverage boundaries to confirm before an agreement."] },
    ],
  },
  {
    slug: "enhancements-venue-approval",
    eyebrow: "Production Guide",
    title: "Enhancements & Venue Approval",
    description: "A safety-first approval checklist for booths, low-lying clouds, cold sparks, lighting, and custom production.",
    intro: "An effect on a menu is not the same as an effect your venue allows. Venue rules, room conditions, and written approval decide what actually happens.",
    relatedEvent: "Wedding",
    sections: [
      { title: "Ask the venue first", body: "Get the requirements in writing before treating an effect as part of the event.", items: ["Which enhancements are permitted in the contracted room.", "Required insurance, permits, operators, fire watch, or certificates.", "Ceiling, sprinkler, alarm, ventilation, flooring, and egress restrictions.", "Approval deadline and the venue contact with final authority."] },
      { title: "Confirm the operating area", body: "The effect must fit the room after guests, tables, and exits are considered.", items: ["Clear equipment placement and guest separation.", "Unobstructed exits, aisles, doors, and accessible paths.", "Power, cable protection, ventilation, and surface protection.", "A safe cancellation plan if room or venue conditions change."] },
      { title: "Set expectations", body: "Plan the effect without promising conditions nobody controls.", items: ["Exact duration and the moment it supports.", "Who gives the operating cue and who can cancel it.", "What happens if approval is withheld or conditions are unsafe.", "How it will be priced once the venue has confirmed."] },
    ],
  },
] as const satisfies readonly Guide[];

export type GuideSlug = (typeof guides)[number]["slug"];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
