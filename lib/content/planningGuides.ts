/**
 * The knowledge layer: long-form planning guides for the four event paths.
 *
 * The homepage is where a customer shops. These pages are where they learn —
 * genuinely useful planning material that earns search traffic and stands on
 * its own even for someone who never books anything.
 *
 * Services and prices are never written here; chapters reference `PlanItemId`s
 * so `lib/plan.ts` stays the only inventory.
 */
import type { MediaAsset } from "@/lib/media";
import { media } from "@/lib/media";
import type { PlanItemId } from "@/lib/plan";
import type { EventAnchor } from "@/lib/content/eventSections";
import type { FAQ } from "@/lib/content/commercial";

export type GuideChapter = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  paragraphs?: readonly string[];
  cards?: readonly { title: string; body: string }[];
  checklist?: readonly string[];
  checklistTitle?: string;
  planItemIds?: readonly PlanItemId[];
  media?: MediaAsset;
  theme?: "default" | "alt" | "dark";
};

export type PlanningGuide = {
  slug: string;
  homeAnchor: EventAnchor;
  inquiryEvent: string;
  hero: { eyebrow: string; title: string; body: string; media: MediaAsset };
  /**
   * These pages are a commercial landing page first and a planning resource
   * second. Someone arriving from search sees what Focus Lab covers, why
   * booking together helps, and where pricing is — before the guide begins.
   */
  commercial: {
    title: string;
    body: string;
    capabilities: readonly string[];
    pricing: { href: string; label: string };
  };
  intro: string;
  readingTime: string;
  chapters: readonly GuideChapter[];
  relatedGuides: readonly string[];
  faqs: readonly FAQ[];
  cta: { title: string; body: string };
};

const venueApproval =
  "Every effect below is subject to venue approval and safe operating conditions. Ask before you promise it to anyone.";

/* ────────────────────────────── Weddings ────────────────────────────── */

export const weddingGuide: PlanningGuide = {
  slug: "weddings",
  homeAnchor: "weddings",
  inquiryEvent: "Wedding",
  hero: {
    eyebrow: "Complete DFW Wedding Planning Guide",
    title: "Plan the day as a sequence, not a shopping list.",
    body: "How to build a wedding timeline that survives contact with a real venue — and how media, sound, and lighting decisions follow from it.",
    media: media.weddingsHero,
  },
  commercial: {
    title: "Focus Lab covers weddings across Dallas–Fort Worth.",
    body: "Photo, video, DJ and MC, ceremony sound, lighting and effects — book one or several. When you book more than one, they are planned on a single timeline instead of four separate ones.",
    capabilities: [
      "DJ and MC for the ceremony, reception, or both",
      "Ceremony sound so vows and readings carry",
      "Photography and film, together or on their own",
      "Uplighting, monogram, and dance-floor effects",
      "Photo and 360 booths for guests",
    ],
    pricing: { href: "/pricing#pricing-weddings", label: "See Wedding Pricing" },
  },
  intro:
    "Most wedding-day problems are not vendor problems. They are timeline problems that nobody noticed until the room was full. This guide works through the day in the order it actually happens, and flags the decisions that quietly determine whether everything else runs smoothly.",
  readingTime: "About 12 minutes",
  chapters: [
    {
      id: "build-backwards",
      eyebrow: "Chapter 01",
      title: "Build the timeline backwards from the moment that matters most.",
      body: "Pick the one moment you would protect at the cost of everything else — usually the ceremony, sometimes the portraits, occasionally the send-off. Place it first, then work outward in both directions.",
      paragraphs: [
        "Forward-built timelines accumulate optimism. Every block gets the time it deserves on paper, and by the time you reach the end, the day is twenty minutes over before anyone has arrived. Backward-built timelines force the compromises to surface while they are still cheap to make.",
        "Once that moment is fixed, the two questions that reshape everything else are when the venue lets you in and when it makes you leave. Those are rarely negotiable and almost always tighter than couples expect.",
      ],
      checklistTitle: "Fix these before anything else moves",
      checklist: [
        "Venue access time for setup — not the ceremony time, the door time",
        "Hard end time, and what the overtime charge is after it",
        "Sunset time on your date, if any portraits are outdoors",
        "Whether the ceremony and reception share a room, and how long a flip takes",
        "Who is authorized to approve a timeline change on the day",
        "Whether any religious or cultural timing is fixed and cannot move",
      ],
      media: media.weddingCoordination,
    },
    {
      id: "ceremony",
      eyebrow: "Chapter 02",
      title: "The ceremony is an audio problem before it is anything else.",
      body: "Guests forgive a lot, but not being unable to hear the vows. Outdoor ceremonies, high ceilings, and soft-spoken officiants are three common reasons people leave a wedding saying they missed the important part.",
      theme: "alt",
      paragraphs: [
        "A single microphone on the officiant covers the officiant. It does not reliably cover two people speaking quietly toward each other. If the vows matter to you as a recording, that is a separate decision from whether the back row can hear them live.",
        "Wind is the variable people underestimate outdoors. It is not just noise — it moves sound away from where you expected it to go.",
      ],
      cards: [
        { title: "Processional cue", body: "Someone has to start the music at the right instant, watching the actual door — not a clock." },
        { title: "Officiant amplification", body: "Lapel or handheld, with a plan for what happens if it fails mid-ceremony." },
        { title: "Reading and vow coverage", body: "Readers move around. Decide whether they come to a mic or a mic goes to them." },
        { title: "Recessional energy", body: "The song that plays as you walk back out sets the tone for the next two hours." },
      ],
      planItemIds: ["ceremony-sound", "wedding-dj-ceremony"],
    },
    {
      id: "the-gap",
      eyebrow: "Chapter 03",
      title: "Cocktail hour carries more than it looks like it does.",
      body: "For guests, cocktail hour is the first unstructured time of the day. For everyone working the event, it is a room flip, a portrait session, and a soundcheck happening simultaneously in different places.",
      paragraphs: [
        "A common problem here is assuming these can all run at full speed at once. Portraits take longer than the schedule says because families are hard to gather. Room flips take longer because vendors are waiting on each other.",
        "Decide in advance which of the three is allowed to run long, and what gets shortened when it does.",
      ],
      checklistTitle: "Decide before the day",
      checklist: [
        "Who gathers family members for portraits, by name, and how they are found",
        "Whether the couple attends cocktail hour or uses it entirely for photos",
        "Where guests physically go while the room is flipped",
        "Whether there is sound in the cocktail space, or only in the main room",
        "What gets cut first if this block runs fifteen minutes long",
      ],
    },
    {
      id: "reception",
      eyebrow: "Chapter 04",
      title: "A reception is really about five transitions.",
      body: "Grand entrance, first dance, dinner release, toasts, and open dancing. Most of the evening sits between them. Each transition is a handoff where music, microphone, lighting, and camera all have to agree on what happens next.",
      theme: "dark",
      cards: [
        { title: "Grand entrance", body: "Names, order, and where each person waits. Then straight into the next planned thing — dead air here is hard to recover from." },
        { title: "First dance", body: "Decide whether it follows the entrance immediately or comes after dinner. Both work; ambiguity does not." },
        { title: "Dinner release", body: "Table-by-table or open. This is a coordination decision with catering, not a music decision." },
        { title: "Toasts", body: "A frequent overrun. Someone should gather speakers before the block starts." },
        { title: "Open dancing", body: "The first ten minutes tend to set the tone for how the rest of the night dances." },
      ],
      planItemIds: ["wedding-dj-core", "wedding-production"],
    },
    {
      id: "speeches",
      eyebrow: "Chapter 05",
      title: "Give the person holding the microphone a confirmed list.",
      body: "Names get mispronounced when nobody writes them down phonetically. It is avoidable, and families remember it.",
      theme: "alt",
      checklistTitle: "Send this ahead of the day",
      checklist: [
        "Every name to be announced, spelled phonetically where pronunciation could be unclear",
        "The relationship of each speaker to the couple, said out loud correctly",
        "Speaker order, and a firm time limit each person has actually been told about",
        "Who is not to be announced or acknowledged, if that applies",
        "Any surprise moments, and who is in on them",
        "Correct titles and honorifics where they matter to the family",
      ],
    },
    {
      id: "coverage",
      eyebrow: "Chapter 06",
      title: "What coverage hours actually buy.",
      body: "Hours are a planning frame, not a promise about crew size or deliverables. Six hours starting at the ceremony is a very different day from six hours starting with getting ready.",
      paragraphs: [
        "The useful question is not how many hours, but which moments must be covered and which can be missed. Work out the earliest and latest thing you would regret not having, and the number falls out of that.",
        "Photo and video want different things from the same moment. Photo wants a clean angle and a fraction of a second; video wants continuity and usable audio. Planning them together is how you avoid one standing in the other's shot.",
      ],
      cards: [
        { title: "Focused coverage", body: "A tighter story around the most important window of the day." },
        { title: "Fuller day", body: "Room for preparation, portraits, ceremony, and reception context." },
        { title: "Extended story", body: "For longer sequences, more transitions, or a second location." },
      ],
      planItemIds: ["photography", "videography", "photo-video", "engagement-session"],
    },
    {
      id: "enhancements",
      eyebrow: "Chapter 07",
      title: "Enhancements, and the venue conversation they require.",
      body: venueApproval,
      theme: "alt",
      paragraphs: [
        "Cold sparks, low clouds, and haze all interact with fire detection, ceiling height, flooring, and insurance. A venue that says yes in an email may still say no on the day if conditions changed.",
        "Ask early, get it in writing, and have a fallback you would actually be happy with.",
      ],
      checklistTitle: "Ask the venue directly",
      checklist: [
        "Are cold sparks permitted, and is a permit or fire watch required?",
        "Is the dance floor surface suitable for a low-cloud effect?",
        "Will haze or fog trigger the detection system?",
        "What are the power limits, and which circuits are available?",
        "Is rigging permitted, and who is allowed to do it?",
        "What is the noise limit, and is it enforced by a meter or by a person?",
      ],
      planItemIds: ["clouds", "cold-sparks", "uplighting", "monogram", "digital-booth"],
    },
    {
      id: "run-of-show",
      eyebrow: "Chapter 08",
      title: "The run-of-show checklist.",
      body: "One page. Everyone working the event has it. If something is not on it, it is not going to happen on cue.",
      theme: "dark",
      checklistTitle: "Your one-page run of show",
      checklist: [
        "Every block with a start time, an owner, and a duration",
        "Names and phonetic spellings for every announcement",
        "Song selections for each cued moment, and the do-not-play list",
        "Who makes the call when something runs long",
        "Vendor arrival, load-in, and departure times",
        "Meal times for working crew, if the venue requires them scheduled",
        "Emergency contacts who are not the couple",
        "The one thing that must happen even if everything else is cut",
      ],
    },
  ],
  relatedGuides: ["wedding-day-coordination-checklist", "photo-video-coverage-map", "enhancements-venue-approval"],
  faqs: [
    { question: "How far ahead should we lock the timeline?", answer: "An early version is useful, but the one that matters is confirmed after the venue walkthrough and final guest count. Expect it to change at least once." },
    { question: "Do we need ceremony sound if the space is small?", answer: "Small rooms still defeat quiet speakers, and outdoor spaces defeat almost everyone. The honest test is whether someone in the back row could hear a normal speaking voice with guests present." },
    { question: "Can we choose only some of these services?", answer: "Yes. Everything is modular. Add what belongs on your day and leave the rest out of the conversation." },
  ],
  cta: {
    title: "Bring the useful context into one inquiry.",
    body: "Start with the date, the venue or city, and the moments you already know matter. Exact scope comes next.",
  },
};

/* ──────────────────────── Shaadi celebrations ───────────────────────── */

export const shaadiGuide: PlanningGuide = {
  slug: "south-asian-weddings",
  homeAnchor: "shaadi",
  inquiryEvent: "South Asian Wedding",
  hero: {
    eyebrow: "Complete Shaadi Planning Guide",
    title: "Plan the week your family is actually having.",
    body: "How to map a multi-event celebration, and how entertainment, production, and media planning changes from one event to the next.",
    media: media.southAsianHero,
  },
  commercial: {
    title: "Focus Lab covers Shaadi celebrations across Dallas–Fort Worth.",
    body: "One celebration or the whole week. Our team communicates in English, Urdu, Hindi and Punjabi, and shared planning carries names, timing and family preferences from one event to the next.",
    capabilities: [
      "Coverage for a single celebration or the whole week",
      "Photo and video across multiple events",
      "Baraat procession sound that travels outdoors",
      "DJ, MC, and performance playback with cue sheets",
      "Lighting and production sized to each room",
    ],
    pricing: { href: "/pricing#pricing-shaadi", label: "See Shaadi Pricing" },
  },
  intro:
    "There is no universal South Asian wedding. Sequence, naming, emphasis, and formality vary between regions, faiths, families, and generations — and a plan that assumes otherwise will be wrong somewhere. This guide starts from the events you are planning and works outward.",
  readingTime: "About 14 minutes",
  chapters: [
    {
      id: "map-events",
      eyebrow: "Chapter 01",
      title: "Map the events before you scope anything.",
      body: "Write one row per celebration. Not one row for the wedding — one row per event. This single move prevents most of the confusion that follows.",
      paragraphs: [
        "Some families plan three events, some plan seven or more. Some run across a weekend, others across two weeks and two cities. The number is not the point; knowing it precisely is.",
        "Mehndi, Sangeet, Haldi, Baraat, Nikah, Reception, and Valima are common examples. They are not a required order, they are not all present at every celebration, and the names your family uses take precedence over any list.",
      ],
      checklistTitle: "For every event in the week",
      checklist: [
        "The name your family uses for it",
        "Date, venue, address, and which room or entrance",
        "Guest arrival, family arrival, formal start, and hard end",
        "Approximate guest count — these often differ wildly between events",
        "Whether it is indoors, outdoors, or moves between the two",
        "Which services that specific event needs",
      ],
      media: media.southAsianMehndi,
    },
    {
      id: "different-rooms",
      eyebrow: "Chapter 02",
      title: "Every event is a different technical problem.",
      body: "A Mehndi with seated guests and continuous music has almost nothing in common with a reception program full of cued transitions — except that the same crew should understand both.",
      theme: "dark",
      cards: [
        { title: "Seated, continuous events", body: "Long stretches with no formal program. The work is reading energy and sustaining it, not hitting cues." },
        { title: "Performance events", body: "Rehearsed sets, ordered lineups, and tracks that must start on an exact beat. Cue sheets are mandatory." },
        { title: "Processional events", body: "Movement, outdoors, no fixed power. Sound has to travel with people." },
        { title: "Ceremony events", body: "Quiet, respectful coverage and clean amplification. The wrong lens or the wrong angle is noticed here." },
        { title: "Formal programs", body: "The largest room, most transitions, most announcements, and the most opportunity for a timeline to slip." },
      ],
    },
    {
      id: "music-performance",
      eyebrow: "Chapter 03",
      title: "Performances need a rehearsal plan, not just a playlist.",
      body: "Family performances are frequently the emotional center of a Sangeet — and a frequent source of technical trouble, because the tracks often arrive late and go untested on the actual system.",
      theme: "alt",
      checklistTitle: "Collect these early",
      checklist: [
        "Every performance track as a file, not a streaming link",
        "The exact edit or version, where multiple versions exist",
        "Performance order, and who introduces each one",
        "Whether performers need microphones or only playback",
        "A rehearsal window in the venue, if one is possible at all",
        "Who is responsible for gathering performers before their slot",
        "The do-not-play list, agreed by whoever actually gets to decide it",
      ],
      planItemIds: ["sa-single-event", "sa-wedding-reception"],
    },
    {
      id: "baraat",
      eyebrow: "Chapter 04",
      title: "The Baraat is often the hardest sound problem of the week.",
      body: "It is outdoors, it moves, it has no fixed power, and it is loud by design. Everything that makes it joyful makes it technically demanding.",
      paragraphs: [
        "Sound has to travel with the procession, carry over a crowd celebrating at full volume, and cope with the weather. Battery capacity, rather than speaker size, is often the limiting factor.",
        "It also needs a route agreed with the venue ahead of time — including where it starts, where it ends, and what happens if it runs long while guests wait inside.",
      ],
      checklistTitle: "Confirm with the venue",
      checklist: [
        "The permitted route, start point, and end point",
        "Whether amplified sound is allowed outdoors, and until what time",
        "Noise ordinances if any part is on a public street",
        "Whether horses, vehicles, or live percussion require separate approval",
        "Weather contingency, and who decides to trigger it",
        "How long the venue will hold the next event if this one runs over",
      ],
      planItemIds: ["sa-baraat"],
      media: media.southAsianBaraat,
    },
    {
      id: "media-continuity",
      eyebrow: "Chapter 05",
      title: "Media continuity is why one crew across events matters.",
      body: "Coverage spread across separate vendors produces separate bodies of work — different framing instincts, different color, and no shared sense of who the important people are.",
      theme: "alt",
      paragraphs: [
        "A crew that was at the Mehndi already knows the grandmother who should be in every family frame, the uncle who runs the schedule, and the cousin who is actually organizing the performances. By the reception, nothing is being learned for the second time.",
        "It also means the week edits together as one story rather than as a set of unrelated galleries.",
      ],
      planItemIds: ["south-asian-media", "sa-full-celebration", "social-content"],
    },
    {
      id: "venue-changes",
      eyebrow: "Chapter 06",
      title: "The handoffs between events are where plans break.",
      body: "Multi-event weeks rarely fail during an event. They fail in the gap between two of them, when travel, resets, and wardrobe all compete for the same ninety minutes.",
      theme: "dark",
      checklistTitle: "Plan every gap explicitly",
      checklist: [
        "Travel time between venues at that time of day, not the optimistic time",
        "Parking, load-in access, and whether a dock or elevator is shared",
        "Wardrobe, hair, and makeup windows for the family",
        "Portrait windows that need daylight, and when daylight ends",
        "Equipment reset time, or whether a second set is required",
        "Who can approve a delay when it affects the next event",
      ],
    },
    {
      id: "family-coordination",
      eyebrow: "Chapter 07",
      title: "Language, names, and who actually decides.",
      body: "Planning conversations often involve more people than the couple, and the person who answers emails is not always the person who makes decisions.",
      checklistTitle: "Establish early",
      checklist: [
        "Preferred languages for announcements, and for planning conversations",
        "Names and phonetic pronunciations for every person to be announced",
        "Correct honorifics and family titles where they matter",
        "Who has final say on timing changes, per event",
        "Traditions that need quiet, specific positioning, or advance warning",
        "Any moment where photography or video is not welcome",
      ],
    },
    {
      id: "shaadi-checklist",
      eyebrow: "Chapter 08",
      title: "The Shaadi-week checklist.",
      body: "One document covering every event, shared with everyone working the week.",
      theme: "alt",
      checklistTitle: "Before the week begins",
      checklist: [
        "A single page per event with venue, timing, and services",
        "Every performance track collected and tested",
        "Phonetic name list for all announcements at all events",
        "Baraat route and weather contingency confirmed in writing",
        "Travel and reset time between every consecutive pair of events",
        "Decision-maker named for each event",
        "Do-not-play and do-not-photograph lists circulated",
        "A fallback for the one thing most likely to run long",
      ],
    },
  ],
  relatedGuides: ["shaadi-week-timeline", "mehndi-baraat-valima-venue-checklist", "photo-video-coverage-map"],
  faqs: [
    { question: "Do you assume a particular sequence of events?", answer: "No. We start from the events your family is planning and use the names your family uses. Any list we publish is a set of common examples, not a template." },
    { question: "Can we book only some events in the week?", answer: "Yes. Single events, the wedding day and reception together, or the full week are all normal starting points. Multi-event celebrations are quoted individually." },
    { question: "Which languages can support hosting and planning?", answer: "Our team can communicate in English, Urdu, Hindi, and Punjabi. Tell us which events would benefit from language support and we will plan for it." },
  ],
  cta: {
    title: "Start with the events you know about.",
    body: "Even a partial list is enough. Share what is confirmed and we will work through the rest together.",
  },
};

/* ──────────────────── Parties & celebrations ────────────────────────── */

export const partyGuide: PlanningGuide = {
  slug: "events/parties",
  homeAnchor: "parties",
  inquiryEvent: "Party / Celebration",
  hero: {
    eyebrow: "Party & Celebration Planning Guide",
    title: "Smaller than a wedding. Same three decisions.",
    body: "How to plan a birthday, shower, anniversary, or graduation so the room actually works — without over-engineering it.",
    media: media.partyHero,
  },
  commercial: {
    title: "Focus Lab covers celebrations across Dallas–Fort Worth.",
    body: "Birthdays, showers, anniversaries, graduations and family celebrations. Choose a time block that fits the night, then add photo, video, or the extras that change how the room feels.",
    capabilities: [
      "DJ and MC who read the room rather than run a playlist",
      "Announcements handled so speeches do not drift",
      "Photography sized to a shorter celebration",
      "Short highlight video made for sharing",
      "Uplighting, monogram, and photo booths",
    ],
    pricing: { href: "/pricing#pricing-parties", label: "See Party Pricing" },
  },
  intro:
    "Celebrations go wrong in predictable ways: the music is the wrong volume for the room, nobody knows when the speeches happen, and the only photos are from three guests' phones. None of that needs a wedding-scale plan to fix.",
  readingTime: "About 8 minutes",
  chapters: [
    {
      id: "duration",
      eyebrow: "Chapter 01",
      title: "Start with how long the night runs.",
      body: "Almost everything else follows from how long the room stays alive. Three hours and five hours are genuinely different events, not the same event with more of it.",
      paragraphs: [
        "Three hours suits a focused celebration with one clear centerpiece — cake, a toast, a reveal — and guests who arrive together. Five hours suits a party where people drift in, eat, and the dancing builds late.",
        "The mistake is booking long and hoping energy sustains itself. A shorter event that ends while people still want more is better than a long one that empties out.",
      ],
      checklistTitle: "Work out your real duration",
      checklist: [
        "When guests actually arrive, versus the time on the invitation",
        "When food is served, and whether it stops the party or feeds it",
        "The one centerpiece moment, and roughly when it happens",
        "Whether children are present, and when they leave",
        "Venue hard-out time, and the overtime rate past it",
        "Setup and breakdown windows either side",
      ],
      planItemIds: ["party-3h", "party-4h", "party-5h"],
    },
    {
      id: "reading-the-room",
      eyebrow: "Chapter 02",
      title: "Somebody should be reading the room.",
      body: "A playlist cannot tell that the floor is thinning, that the guest of honour just arrived, or that the toast should happen now while everyone is still gathered.",
      theme: "alt",
      paragraphs: [
        "This is the actual difference between a speaker on a stand and someone hosting. It is not about volume or genre — it is about noticing and adjusting.",
        "Mixed-age parties are the hardest version of this. What fills the floor for one group empties it for another, and the transition has to be handled rather than endured.",
      ],
      cards: [
        { title: "Arrival", body: "Background level. Guests need to hear each other while the room fills." },
        { title: "The centerpiece", body: "Music down, attention up, and everyone actually in the room before it starts." },
        { title: "After food", body: "The riskiest transition. Energy either restarts here or the party quietly ends." },
        { title: "Late", body: "Whatever fills the floor with whoever is still there — not whatever was planned." },
      ],
    },
    {
      id: "announcements",
      eyebrow: "Chapter 03",
      title: "Decide who speaks, and when, in advance.",
      body: "Unplanned speeches are a common way for a celebration to lose twenty minutes and its momentum at the same time.",
      checklistTitle: "Before the day",
      checklist: [
        "Who is speaking, in what order, for how long",
        "Whether they have been told the time limit out loud",
        "Names and pronunciations for anyone being acknowledged",
        "Who gathers people before the speeches start",
        "Whether there is a surprise, and who is in on it",
        "What happens if the guest of honour arrives late",
      ],
    },
    {
      id: "music",
      eyebrow: "Chapter 04",
      title: "Requests, and the do-not-play list.",
      body: "The do-not-play list matters more than the request list. One wrong song at a family celebration is remembered far longer than ten right ones.",
      theme: "dark",
      paragraphs: [
        "Be specific about what is off-limits and why — a song, an artist, a genre, or anything explicit. It is not an unusual request and it is much easier to honour when it arrives before the event rather than during it.",
        "For requests, a short list of genuinely important songs works better than a long playlist. A hundred-song list is a constraint, not a preference.",
      ],
    },
    {
      id: "documentation",
      eyebrow: "Chapter 05",
      title: "Decide what you want to still have next week.",
      body: "Most celebrations are documented entirely by guests, which means the guest of honour appears in almost nothing and the group shot never happens.",
      theme: "alt",
      cards: [
        { title: "Photo coverage", body: "Sized to a shorter event. Enough for the moments and a real group photo." },
        { title: "Short-form video", body: "A vertical edit that is actually shareable while the event still feels current." },
        { title: "Guest-driven", body: "A booth produces volume and involvement, but it is not a substitute for coverage." },
      ],
      planItemIds: ["party-photography", "party-highlight-video", "digital-booth", "booth-360"],
    },
    {
      id: "lighting",
      eyebrow: "Chapter 06",
      title: "Lighting is usually the most cost-effective way to change a room.",
      body: venueApproval,
      paragraphs: [
        "Most venues default to bright, even, unflattering overhead light. Uplighting along the walls is often the highest-impact change available, and it usually costs less than people assume.",
        "Effects are a separate conversation. Anything that produces haze, sparks, or clouds needs venue sign-off before it is promised to anyone.",
      ],
      planItemIds: ["uplighting", "monogram", "clouds"],
    },
    {
      id: "venue-questions",
      eyebrow: "Chapter 07",
      title: "Ask the venue these before you book anything.",
      body: "Ten minutes of questions now prevents the most common day-of surprises.",
      theme: "dark",
      checklistTitle: "Venue questions",
      checklist: [
        "What time can we get in, and what time must we be out?",
        "Is there a noise limit, and is it enforced by a meter?",
        "Where is the power, and how many circuits are available?",
        "Is there a lift or a flight of stairs for load-in?",
        "Can we use haze, sparks, or a cloud effect?",
        "Is there an in-house sound system, and are we required to use it?",
        "Is parking available for crew vehicles?",
        "What happens if we run over — and what does it cost?",
      ],
    },
  ],
  relatedGuides: ["enhancements-venue-approval", "photo-video-coverage-map"],
  faqs: [
    { question: "Is there a minimum event size?", answer: "No. Time block and requirements matter far more than guest count. Small celebrations are entirely normal." },
    { question: "Can we extend on the night if it is going well?", answer: "Sometimes — it depends on the venue's hard-out time and on crew availability. It is much safer to agree the possibility and the rate in advance." },
    { question: "Do we need photo coverage if guests are taking pictures?", answer: "Guest photos rarely include the guest of honour and almost never include a group shot. If either matters to you, plan for it." },
  ],
  cta: {
    title: "Tell us the date and roughly how long.",
    body: "Duration and event type are enough to start. The details can follow.",
  },
};

/* ──────────────────── Corporate & community ─────────────────────────── */

export const corporateGuide: PlanningGuide = {
  slug: "events/corporate",
  homeAnchor: "corporate",
  inquiryEvent: "Corporate / Community",
  hero: {
    eyebrow: "Corporate Event & AV Planning Guide",
    title: "Start from what the room owes its audience.",
    body: "A practical guide to microphones, playback, displays, staging, and documentation for professional and community events.",
    media: media.corporateHero,
  },
  commercial: {
    title: "Focus Lab covers corporate and community events across Dallas–Fort Worth.",
    body: "Microphones, playback, displays, staging, entertainment and documentation for meetings, galas, festivals and all-hands. Booked together, they are planned as one program rather than four deliveries.",
    capabilities: [
      "Microphones, playback, and displays the back row can read",
      "Staging, lighting, and sightlines for half- and full-day programs",
      "Photography and video you can use afterward",
      "Livestream and hybrid capture for remote audiences",
      "DJ and hosting for receptions, galas, and community events",
    ],
    pricing: { href: "/pricing#pricing-corporate", label: "See Corporate Pricing" },
  },
  intro:
    "Professional events are judged on whether people could hear, see, and follow. Everything else is secondary. This guide works through the technical decisions in the order they actually constrain each other.",
  readingTime: "About 11 minutes",
  chapters: [
    {
      id: "outcome",
      eyebrow: "Chapter 01",
      title: "Define the outcome before the equipment.",
      body: "A sales kickoff, an awards gala, a community festival, and an all-hands are four different problems that happen to rent similar gear.",
      cards: [
        { title: "Inform", body: "People must follow content precisely. Intelligibility and legibility dominate every other consideration." },
        { title: "Recognize", body: "Named individuals are called forward. Pronunciation, timing, and photography matter most." },
        { title: "Convene", body: "The point is people talking to each other. Sound must support conversation, not compete with it." },
        { title: "Broadcast", body: "The primary audience is not in the room. Capture quality becomes the deliverable." },
      ],
      checklistTitle: "Answer first",
      checklist: [
        "What must the audience know, feel, or do afterward?",
        "Who is the real audience — the room, or people watching later?",
        "What single failure would make the event unsuccessful?",
        "Who owns the run of show, and who can change it on the day?",
      ],
    },
    {
      id: "room",
      eyebrow: "Chapter 02",
      title: "The room shapes more than the budget does.",
      body: "Ceiling height, surface materials, and seating layout determine what is achievable before any equipment is chosen.",
      theme: "alt",
      paragraphs: [
        "Hard parallel surfaces produce reflections that reduce intelligibility no matter how much is spent on speakers. Long, narrow rooms need distributed sound rather than louder sound.",
        "Seating layout is the variable most often changed at the last minute and most likely to invalidate an AV plan. Confirm it, and confirm who is allowed to change it.",
      ],
      checklistTitle: "Confirm about the space",
      checklist: [
        "Room dimensions and ceiling height",
        "Seating layout — theatre, rounds, cabaret, or standing",
        "Where the furthest audience member sits from the presenter",
        "Surface materials: glass, concrete, carpet, drape",
        "Existing in-house AV, and whether its use is mandatory",
        "Natural light, and whether it can be controlled",
      ],
    },
    {
      id: "microphones",
      eyebrow: "Chapter 03",
      title: "Microphones: count them by person, not by podium.",
      body: "A frequent AV failure at professional events is a presenter who moves away from the only microphone in the room.",
      theme: "dark",
      cards: [
        { title: "Podium", body: "Reliable and predictable, but it pins the speaker to one spot." },
        { title: "Lapel", body: "Frees the presenter to move. Needs a battery plan and someone to fit it correctly." },
        { title: "Handheld", body: "Essential for Q&A. Someone has to physically carry it to the person asking." },
        { title: "Panel", body: "One per two people at minimum. Sharing across a panel never works as well as it looks on paper." },
      ],
      checklistTitle: "Plan for",
      checklist: [
        "How many people speak, and whether any speak simultaneously",
        "Whether presenters move, and how far",
        "Whether there is audience Q&A, and how the mic reaches them",
        "Spare batteries and a spare channel",
        "Who fits lapel mics, and when",
      ],
      planItemIds: ["corporate-av-basic"],
    },
    {
      id: "playback",
      eyebrow: "Chapter 04",
      title: "Playback and displays fail in boring, preventable ways.",
      body: "Wrong aspect ratio, unreadable font size, a video with no audio path, and a laptop that will not connect account for most on-the-day panic.",
      paragraphs: [
        "Collect final content the day before, not on the morning. Test every video with sound on the actual system — video audio routing is a frequent last-minute failure.",
        "Legibility has a simple test: display the smallest text on the slide and read it from the furthest seat. If you cannot, the audience cannot.",
      ],
      checklistTitle: "Test in advance",
      checklist: [
        "Aspect ratio and resolution of the display, matched to the decks",
        "Every video played through the actual system with audio",
        "Adapters for every device that will connect, including spares",
        "Who advances slides, and from where",
        "Whether presenters need confidence monitors",
        "A fallback if a presenter's laptop fails",
      ],
    },
    {
      id: "staging",
      eyebrow: "Chapter 05",
      title: "Staging and sightlines.",
      body: "If the back row cannot see the presenter's face, the event feels like a recording no matter how good the sound is.",
      theme: "alt",
      checklistTitle: "Check sightlines",
      checklist: [
        "Is the presenter raised, and by how much?",
        "Do screens obstruct any part of the audience's view?",
        "Are there structural columns, and who ends up behind them?",
        "Is there front lighting on the presenter's face, not just the screen?",
        "Where do presenters wait before going on?",
        "Is the route to the stage clear and safe in low light?",
      ],
      planItemIds: ["corporate-half-day", "corporate-full-day", "led-wall"],
    },
    {
      id: "documentation",
      eyebrow: "Chapter 06",
      title: "Decide what the event has to produce.",
      body: "Documentation is usually an afterthought and then urgently needed the following week for recruiting, reporting, or sponsors.",
      cards: [
        { title: "Photography", body: "Speakers, audience, and the room working. Usable for reporting and next year's promotion." },
        { title: "Video", body: "Full-session capture, a highlight edit, or both. Decide before, not after." },
        { title: "Livestream", body: "A different discipline from recording, with its own bandwidth and platform requirements." },
      ],
      planItemIds: ["corporate-media", "corporate-livestream", "social-content"],
    },
    {
      id: "load-in",
      eyebrow: "Chapter 07",
      title: "Load-in, rehearsal, and the run of show.",
      body: "The setup window is almost always shorter than it looks, because it is shared with catering, furniture, and the venue's own team.",
      theme: "dark",
      checklistTitle: "Confirm in writing",
      checklist: [
        "Dock or entrance access, and whether it is shared",
        "Lift dimensions, if anything must go upstairs",
        "Exact setup window, and who else is in the room during it",
        "Available power, circuits, and distance to them",
        "Rehearsal window, and which presenters will attend it",
        "Insurance and COI requirements, with the deadline",
        "Union or in-house labour requirements, if any",
        "Who holds the run of show and can approve changes",
      ],
    },
    {
      id: "corporate-checklist",
      eyebrow: "Chapter 08",
      title: "The pre-event checklist.",
      body: "Work through this a week out. Most items are cheap to fix then and expensive to fix on the day.",
      theme: "alt",
      checklistTitle: "One week before",
      checklist: [
        "Final seating layout confirmed and circulated",
        "All presentation content received and tested with audio",
        "Microphone count matched to the final speaker list",
        "Sightlines checked from the furthest and most obstructed seats",
        "Run of show distributed with a single named owner",
        "Rehearsal scheduled, with presenters actually confirmed",
        "COI submitted and acknowledged by the venue",
        "Contingency agreed for the most likely failure",
      ],
    },
  ],
  relatedGuides: ["corporate-av-checklist", "photo-video-coverage-map"],
  faqs: [
    { question: "Can you work with a venue's in-house AV team?", answer: "Yes, and often that is the right answer. What matters is agreeing early who owns which part of the signal chain and who is on site when." },
    { question: "How far in advance do you need presentation content?", answer: "The day before at the latest. Testing video audio through the actual system is the step that tends to catch problems early." },
    { question: "Do you provide livestreaming?", answer: "Hybrid and livestream capture is scoped individually — platform, bandwidth, and encoder requirements vary too much for a standard package." },
  ],
  cta: {
    title: "Start with the room and the date.",
    body: "Venue, audience size, and what the event has to achieve are enough for a useful first conversation.",
  },
};

export const planningGuides = {
  weddings: weddingGuide,
  southAsian: shaadiGuide,
  parties: partyGuide,
  corporate: corporateGuide,
} as const;
