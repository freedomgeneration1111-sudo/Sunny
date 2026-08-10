# Focus Lab Productions — Website Redesign Master Handoff

> Consolidated single-file version of the Codex redesign package. Individual files remain canonical for editing.


---

## FILE: 00_README_CODEX_HANDOFF.md

# Focus Lab Productions — Website Redesign Handoff v1

**Purpose:** canonical design/content contract for implementation in the existing Focus Lab website repository.

**Status:** design architecture locked for implementation prototype. Final customer pricing and authentic portfolio media remain replaceable content dependencies.

## How Codex should use this package

1. Inspect the existing repository, current framework, build scripts, component conventions, routing, tests, and the approved logo/style-system assets already produced for Focus Lab Productions.
2. Do **not** replatform the application or replace the approved visual identity unless a repository-level technical blocker makes that unavoidable.
3. Treat `01_CANONICAL_DECISIONS.md` as the product source of truth for this redesign.
4. Treat `02_SITE_ARCHITECTURE.md` as the routing/navigation contract.
5. Treat `03_PAGE_CONTENT_WIREFRAMES.md` and `04_COPY_DECK.md` as the content/layout contract.
6. Build reusable UI from `05_COMPONENT_CONTRACTS.md`; do not hard-code each page as a bespoke composition.
7. Load pricing from `06_DEV_PRICING_DATA.json`. These values exist for design/prototyping only and must be replaceable centrally.
8. Enforce media truth rules in `07_MEDIA_AND_PROOF_POLICY.md`.
9. Implement behavior and quality gates from `08_RESPONSIVE_ACCESSIBILITY_ANALYTICS.md` and `09_ACCEPTANCE_CRITERIA.md`.
10. Use `10_CODEX_EXECUTION_PROMPT.md` as the task prompt for the coding agent.

## Non-negotiable principle

The website is a **conversion system organized around the buyer's event**, not a catalog of internal departments.

Primary sequence:

**Recognition → relevance → differentiation → proof → price → risk reduction → action**

The visitor should quickly understand:

- what Focus Lab Productions does;
- whether Focus Lab serves their event type;
- why coordinated services are valuable;
- what pricing roughly looks like;
- why they can trust the operating model;
- how to check availability.

## Package map

| File | Purpose |
|---|---|
| `01_CANONICAL_DECISIONS.md` | locked decisions, superseded assumptions, unresolved dependencies |
| `02_SITE_ARCHITECTURE.md` | routes, navigation, conversion journeys, publishing gates |
| `03_PAGE_CONTENT_WIREFRAMES.md` | section order and lo-fi structure for every launch page |
| `04_COPY_DECK.md` | working production copy for the redesign |
| `05_COMPONENT_CONTRACTS.md` | reusable component/API contracts |
| `06_DEV_PRICING_DATA.json` | centralized development-only pricing values |
| `07_MEDIA_AND_PROOF_POLICY.md` | authentic/proxy media rules and portfolio gates |
| `08_RESPONSIVE_ACCESSIBILITY_ANALYTICS.md` | responsive, interaction, a11y, SEO, analytics rules |
| `09_ACCEPTANCE_CRITERIA.md` | definition of done and QA gates |
| `10_CODEX_EXECUTION_PROMPT.md` | ready-to-paste coding-agent instruction |
| `11_HANDOFF_CHECKLIST.md` | human pre-merge / pre-client-review checklist |

## Important implementation boundaries

- Do not invent team members, testimonials, clients, venues, awards, years-in-business claims, or partner logos.
- Do not present AI/development proxy imagery as Focus Lab client work.
- Do not invent final prices. The supplied values are clearly marked DEV and must remain data-driven.
- Do not create a public team page.
- Do not imply Focus Lab can run multiple simultaneous events at scale.
- Do not dilute the brand into "we do everything." Use event-first navigation and two coherent capability families.
- Do not build a generic reusable multi-tenant event-business platform. Build Focus Lab specifically.
- Preserve the current repository's established technical architecture unless separately authorized.


---

## FILE: 01_CANONICAL_DECISIONS.md

# 01 — Canonical Decisions

## Product identity

- **Company:** Focus Lab Productions
- **Market:** Dallas–Fort Worth, Texas
- **Primary launch wedge:** South Asian / Desi and fusion-event cultural fluency, while remaining clearly available for general weddings, parties, private celebrations, and selected corporate/community work.
- **Positioning territory:** **One Crew, Zero Handoffs.**
- **Core value:** complementary event services can be planned from one shared event plan with one accountable coordinating crew.
- **Operating reality:** approximately one event at a time. Copy must not imply a large multi-event production enterprise.
- **Languages available for client communication:** English, Urdu, Hindi, Punjabi.

## Buyer architecture

### Locked

Navigation is **event-type first**.

Pricing logic beneath the navigation is **service/module based**.

This lets a wedding, party, South Asian celebration, and corporate buyer enter through familiar language while the quote/CRM layer can assemble reusable services.

### Launch event entrances

1. Weddings
2. South Asian Weddings
3. Parties & Celebrations
4. Corporate & Community

### Launch capability families

1. **Photo + Video** — photography, videography, social/rapid-turn content where operationally available.
2. **Entertainment + Production** — DJ/MC, sound, lighting, booths, atmosphere effects, and relevant production enhancements.

Do not expose a flat top-level navigation containing every individual service.

## Conversion architecture

### Primary CTA

**Check Availability**

This is the common conversion endpoint across event and service pages.

### Secondary CTA vocabulary

Use contextual actions such as:

- See the Work
- Explore Pricing
- See Wedding Options
- Build Your Event

Avoid vague CTA copy such as `Learn More` when a more specific action exists.

## Pricing posture

- Focus Lab should be more transparent than inquiry-only competitors.
- Standardized/predictable services can show exact or starting prices.
- Standard weddings/photo/video can show understandable starting prices or package anchors.
- Multi-day South Asian work and technically complex production use **starting investment + custom proposal**.
- Final public pricing is a customer decision after review of this design.
- During web development, use centralized development values based on the competitive middle of the market evidence.
- All development values must be clearly represented in source code as non-final and editable in one place.

## Brand and visual system

A logo and style system have already been approved in the Logo Evaluation thread.

**This redesign package does not authorize Codex to redesign the logo, recolor the brand, choose a new type system, or invent alternate visual direction.**

Implementation rule:

1. discover the approved brand assets/tokens in the repository or handoff assets;
2. wire components to those tokens;
3. if a required brand asset is missing, use a clearly labeled temporary placeholder and report the missing dependency rather than recreating the brand.

Legacy architecture documents contain earlier UI tokens, but the approved Logo Evaluation output is authoritative when they differ.

## Team / credibility

- No public team page.
- Do not market individual team-member names.
- About content should sell approach, cultural fluency, coordination, experience, and accountability rather than personalities.
- Do not fabricate proof to compensate for the no-team-page decision.

## Portfolio / proof

- Authentic Focus Lab media is currently limited.
- Development proxy imagery may be used in prototype/staging only when it is impossible to confuse it with actual client work.
- Public portfolio modules only render approved authentic work.
- Reviews only render when real, attributable, approved reviews exist.
- Partner/venue logos only render with a real relationship and permission/appropriate usage.

## Technical boundary

The development environment / tech stack is being established separately.

This package defines **experience, content, data and component behavior**, not a replatforming decision.

Codex must inspect and use the existing repo before implementation.

The marketing-site-to-CRM seam should remain a clean lead-capture payload to the configured webhook/API endpoint.

## Explicitly superseded assumptions

The following older ideas are superseded for this redesign:

- a public named-team/headshot architecture;
- a launch `Resources` hub without enough original content to justify it;
- a generic `/services` page as a major destination;
- a generic `/packages` page separate from pricing logic;
- treating every service as an equal top-navigation item;
- copy implying final pricing is unknown in principle — the **architecture** is now known; only Focus Lab's final selected values are pending.

## Open dependencies that must not block the prototype

- final customer-approved public prices;
- final approved real media inventory;
- real reviews/testimonials;
- verified NAP/phone/text/contact details if not already present in repo;
- exact production availability for individual enhancements when operations finalize.

Prototype around these with data/content gates; do not invent them.


---

## FILE: 02_SITE_ARCHITECTURE.md

# 02 — Site Architecture

## Canonical launch routes

| Priority | Route | Page | Primary job |
|---|---|---|---|
| P0 | `/` | Home | explain, differentiate, route, convert |
| P0 | `/weddings` | Weddings | convert general/fusion wedding buyers |
| P0 | `/south-asian-weddings` | South Asian Weddings | demonstrate cultural fluency and multi-event competence |
| P0 | `/events/parties` | Parties & Celebrations | convert birthday/shower/anniversary/private-event buyers |
| P0 | `/events/corporate` | Corporate & Community | convert company/nonprofit/community/cultural-event buyers |
| P0 | `/services/photo-video` | Photo + Video | explain capture/coverage options and bundles |
| P0 | `/services/entertainment-production` | Entertainment + Production | explain DJ/MC/sound/lighting/effects architecture |
| P0 | `/pricing` | Pricing | qualify, anchor, let buyer compose likely scope |
| P1* | `/work` | Work | authentic visual proof; gated until enough approved media exists |
| P1 | `/about` | About / Our Approach | credibility without team personalities |
| P0 | `/check-availability` | Check Availability | progressive lead capture |

`*` The page may be built during development but hidden from primary navigation and `noindex`/unpublished until media gate passes.

## Utility routes

- `/privacy`
- `/terms` when required
- `/thank-you` after successful lead submission
- 404 / not-found

## Redirect mapping for older prototype routes

If existing routes exist, preserve SEO/user continuity with redirects:

- `/events/weddings` → `/weddings`
- `/events/south-asian-weddings` → `/south-asian-weddings`
- `/services` → appropriate service chooser or homepage capability section
- `/packages` → `/pricing`
- `/resources` → remove from nav; redirect only if currently public and indexed

Do not create redirects blindly; inspect current live/indexed state first.

## Desktop navigation

**Logo** | Weddings | South Asian Weddings | Events ▾ | Services ▾ | Work* | Pricing | **Check Availability**

Events dropdown:

- Parties & Celebrations
- Corporate & Community

Services dropdown:

- Photo + Video
- Entertainment + Production

`Work` only appears once portfolio publication gate is satisfied.

`About` belongs in footer and contextual trust links, not the primary nav.

## Mobile navigation

Collapsed nav with the same information architecture. Keep **Check Availability** as the dominant action.

Optional mobile sticky action rail after first meaningful scroll:

- Call — only when verified phone exists
- Text — only when verified SMS-capable number exists
- Check Date — always

Do not show empty/dead actions.

## Footer architecture

### Events
- Weddings
- South Asian Weddings
- Parties & Celebrations
- Corporate & Community

### Services
- Photo + Video
- Entertainment + Production
- Pricing

### Company
- Our Approach
- Work (when published)
- Check Availability

### Utility
- Privacy
- Terms if required
- Social links only when real/active

## Conversion journeys

### A — South Asian wedding

Search/referral/social → South Asian Weddings → event-sequence/cultural-fluency proof → relevant services → pricing anchor → FAQ → Check Availability.

### B — General/fusion wedding

Home/Weddings → coordinated-crew value → wedding service combinations → pricing → proof → Check Availability.

### C — Party/private celebration

Parties → time-block clarity → DJ/entertainment base → enhancements → price → Check Availability.

### D — Corporate/community

Corporate → professionalism/logistics → entertainment vs production paths → half-day/full-day/custom logic → Check Availability.

### E — Photo/video-only

Search/social → Photo + Video → work → coverage options → bundle advantage → Check Availability.

### F — Pricing-first

Search/direct → Pricing → select event type → explore package/module anchors → build likely scope → Check Availability with selections prefilled.

## Publishing gates

### Work page

Publish only when:

- authentic approved Focus Lab images/videos exist in sufficient quantity to create a convincing page;
- each asset has event/type metadata and alt text;
- no AI/development proxy is represented as client work.

Recommended practical threshold for nav prominence: at least **3 distinct approved event stories or 12+ strong authentic assets**. This is a design gate, not a claim about market best practice.

### Reviews

Render review module only if at least one real approved review exists. Prefer 3+ before using a dedicated section.

### Venue/partner logos

Render only for real relationships with appropriate permission/context.


---

## FILE: 03_PAGE_CONTENT_WIREFRAMES.md

# 03 — Page Content Hierarchy & Lo-Fi Wireframes

## Global page rhythm

Every commercial page should follow a version of:

**recognize me → show relevance → explain difference → prove it → make price understandable → reduce risk → ask for action**

Avoid repeating the homepage verbatim. Each page earns its route by resolving a different buyer intent.

---

# Home `/`

## Purpose

State what Focus Lab is, differentiate the operating model, route visitors by event type, preview proof/pricing, and convert.

## Section hierarchy

1. Header/navigation
2. Hero
3. Credibility strip
4. Event chooser
5. Why One Crew
6. Capability band
7. Work preview — gated
8. Pricing preview
9. Process
10. Reviews — gated
11. FAQ
12. Final CTA
13. Footer

## Lo-fi

```text
┌──────────────────────────────────────────────────────────────┐
│ LOGO  Weddings  South Asian  Events  Services  Work Price   │
│                                      [CHECK AVAILABILITY]    │
├──────────────────────────────────────────────────────────────┤
│ DFW WEDDINGS + EVENTS          | HERO EVENT MEDIA            │
│ ONE EVENT. ONE CREW.           |                             │
│ ZERO HANDOFFS.                 |                             │
│ support copy                   |                             │
│ [CHECK AVAILABILITY]  Work →   |                             │
├──────────────────────────────────────────────────────────────┤
│ SOUTH ASIAN EXPERIENCE | 4 LANGUAGES | DFW | MULTI-SERVICE  │
├──────────────────────────────────────────────────────────────┤
│                    WHAT ARE YOU PLANNING?                    │
│ [South Asian] [Wedding] [Party] [Corporate]                 │
├──────────────────────────────────────────────────────────────┤
│ WHY ONE CREW?                                                │
│ fragmented vendor diagram  →  one shared plan               │
│ fewer handoffs | shared timing | clear accountability        │
├──────────────────────────────────────────────────────────────┤
│ PHOTO | FILM | DJ+MC | SOUND+LIGHTING | EFFECTS             │
├──────────────────────────────────────────────────────────────┤
│ WORK / EVENT STORY PREVIEW — AUTHENTIC MEDIA ONLY            │
├──────────────────────────────────────────────────────────────┤
│ KNOW THE RANGE BEFORE WE TALK                                │
│ [DJ] [Photo] [Video] [Photo+Video]                           │
│ [EXPLORE PRICING / BUILD YOUR EVENT]                         │
├──────────────────────────────────────────────────────────────┤
│ HOW IT WORKS: Tell us → Build the plan → One crew executes   │
├──────────────────────────────────────────────────────────────┤
│ REAL REVIEWS — ONLY WHEN AVAILABLE                           │
├──────────────────────────────────────────────────────────────┤
│ FAQ                                                          │
├──────────────────────────────────────────────────────────────┤
│ YOUR DATE IS THE FIRST THING WE NEED. [CHECK AVAILABILITY]   │
└──────────────────────────────────────────────────────────────┘
```

---

# Weddings `/weddings`

## Purpose

Convert couples who want wedding entertainment/media without the coordination burden of multiple disconnected vendors.

## Section hierarchy

1. Wedding-specific hero
2. Value/proof strip
3. "One plan" wedding coordination section
4. Choose what you need — entertainment, photo/video, or combined
5. Wedding entertainment collections preview
6. Photo/video coverage preview
7. Enhancements preview
8. Authentic wedding work — gated
9. Pricing anchor / link to builder
10. Process
11. FAQ
12. Check Availability CTA

## Lo-fi

```text
[HERO: DFW WEDDINGS]
Photo, film, DJ and production — working from one plan.
[CHECK DATE]

[ONE WEDDING PLAN]
Timeline/cue example + benefits

[CHOOSE YOUR PATH]
Entertainment | Photo+Video | Combine them

[COLLECTIONS]
Essentials | Signature | Production

[MEDIA COVERAGE]
6h | 8h | 10h / Full-day concepts

[ENHANCEMENTS]
Uplighting | Booth | Clouds | Sparks | Monogram ...

[REAL WORK]

[PRICE ANCHOR + BUILDER]

[PROCESS]
[FAQ]
[FINAL CTA]
```

---

# South Asian Weddings `/south-asian-weddings`

## Purpose

Demonstrate that Focus Lab understands the structure, energy, logistics, music and multi-event nature of South Asian celebrations without implying every family follows the same traditions.

## Section hierarchy

1. Hero
2. Cultural fluency strip
3. Celebration sequence visual
4. "Built around your events, not a generic ritual checklist"
5. Entertainment/production modules
6. Photo/video coverage architecture
7. Single Event / Wedding Day + Reception / Full Celebration pricing model
8. Authentic South Asian work — gated
9. Languages/communication
10. Process for multi-event planning
11. FAQ
12. Check Availability CTA

## Lo-fi

```text
[HERO]
A crew that understands the celebration, not just the schedule.
[CHECK DATE]

[CULTURAL FLUENCY]
Pakistani | Indian | Punjabi | fusion context
English | Urdu | Hindi | Punjabi communication

[YOUR CELEBRATION, EVENT BY EVENT]
Engagement/Roka | Haldi | Mehndi | Sangeet | Baraat | Ceremony | Reception
"Your outline may include some, all, or different events."

[ENTERTAINMENT + PRODUCTION]
DJ/MC | dhol/baraat where requested | lighting | sound | effects | advanced production custom

[PHOTO + VIDEO]
Single event | wedding day | multi-day story

[PRICING]
Starting investment + custom proposal

[WORK]
[PLANNING PROCESS]
[FAQ]
[FINAL CTA]
```

---

# Parties & Celebrations `/events/parties`

## Purpose

Sell straightforward private-event entertainment/media with simple duration-based decision making.

## Section hierarchy

1. Hero
2. Event-type examples: birthdays, showers, anniversaries, engagements, private parties
3. Time-block selector 3h / 4h / 5h
4. What the DJ/MC base includes
5. Add atmosphere / visual enhancements
6. Optional photo/video
7. Pricing and overtime clarity
8. Work — gated
9. FAQ
10. Check Availability

## Lo-fi

```text
[HERO]
Bring the energy. Skip the vendor juggling.

[WHAT ARE YOU CELEBRATING?]
Birthday | Shower | Anniversary | Engagement | Private event

[CHOOSE YOUR TIME]
3h | 4h | 5h

[BASE INCLUDES]
DJ/MC | sound | microphones | basic dance lighting | planning

[ADD THE LOOK]
Uplighting | 360 booth | clouds | sparks | monogram

[ADD PHOTO/VIDEO]

[PRICE + OVERTIME]
[FAQ]
[CHECK DATE]
```

---

# Corporate & Community `/events/corporate`

## Purpose

Present a professional, non-wedding-specific path for company, nonprofit, community and cultural organization events.

## Section hierarchy

1. Hero
2. Two-path chooser: Entertainment / Production & Media
3. Event examples
4. Entertainment block pricing
5. Production/media half-day/full-day/custom framework
6. Reliability/logistics checklist
7. Relevant work — gated
8. Inquiry requirements
9. FAQ
10. Check Availability

```text
[HERO]
One event plan for the room, the sound and the content.

[WHAT DO YOU NEED?]
Entertainment | Production + Media

[EVENTS]
Company gatherings | galas | cultural events | community events | activations

[ENTERTAINMENT]
Hourly/block structure

[PRODUCTION + MEDIA]
Half-day | Full-day | Custom

[LOGISTICS]
Venue | schedule | load-in | microphones | screens | rooms | COI/insurance if applicable

[WORK]
[FAQ]
[CHECK AVAILABILITY]
```

---

# Photo + Video `/services/photo-video`

## Purpose

Convert photo-only, video-only and combined-media buyers and show a clear coverage ladder.

## Section hierarchy

1. Hero
2. Best authentic media immediately — gated/placeholder in staging
3. Toggle: Photography / Videography / Both
4. Coverage tiers
5. Deliverables and crew scaling
6. Why combined coverage helps
7. Optional engagement/bridal/social content
8. Full event story/gallery — gated
9. Pricing
10. FAQ
11. Check Availability

```text
[HERO]
One story. Captured in stills and motion.

[MEDIA]

[TOGGLE]
Photo | Video | Both

[COVERAGE]
6h | 8h | 10h/full day

[WHAT CHANGES BY TIER]
hours | crew | deliverables | sessions | albums/prints where offered

[WHY BUNDLE]
shared timeline + coordinated coverage + visible bundle value

[WORK]
[PRICE]
[FAQ]
[CHECK DATE]
```

---

# Entertainment + Production `/services/entertainment-production`

## Purpose

Explain the base entertainment package and show how atmosphere/production enhancements stack onto it.

## Section hierarchy

1. Hero
2. DJ/MC + sound foundation
3. Wedding vs Party vs Corporate selector
4. Core package/timing architecture
5. Enhancement grid
6. Production/custom boundary
7. Venue/safety note for effects
8. Work — gated
9. Pricing
10. FAQ
11. Check Availability

```text
[HERO]
Make the room feel as good as the moment.

[THE FOUNDATION]
DJ/MC | sound | microphones | dance lighting | planning

[EVENT MODE]
Wedding | Party | Corporate

[BUILD THE ATMOSPHERE]
Uplighting | monogram | booth/360 | clouds | cold sparks | advanced lighting

[CUSTOM PRODUCTION]
LED/stage/live sound/complex venues → scoped proposal

[VENUE APPROVAL]
Effects depend on venue rules and safe operation

[WORK]
[PRICE]
[FAQ]
[CHECK DATE]
```

---

# Pricing `/pricing`

## Purpose

Reduce uncertainty, qualify leads, and demonstrate transparency without pretending every event is identical.

## Section hierarchy

1. Hero
2. Transparency explanation
3. Event-type tabs
4. Relevant package/time-block cards
5. Build Your Event selector
6. Estimated starting range
7. Custom-quote boundary
8. What changes price
9. FAQ
10. Check Availability with selections carried into form

```text
[HERO]
Know the range before we talk.

[TABS]
Wedding | South Asian | Party | Corporate | Photo/Video

[PACKAGE / BASE CARDS]

[BUILD YOUR EVENT]
□ DJ/MC
□ Photo
□ Video
□ Ceremony audio
□ Uplighting
□ Booth / 360
□ Clouds
□ Cold sparks
...

[ESTIMATE]
Development mode: displays centralized DEV values
Public mode: displays customer-approved values

[COMPLEX EVENT?]
Starting investment + scope variables + custom proposal

[FAQ]
[CHECK DATE WITH PREFILL]
```

---

# Work `/work`

## Purpose

Show authentic proof through event stories rather than a random image dump.

## Publishing rule

Build the route/component now. Keep it out of nav/unpublished until authentic-media gate passes.

## Section hierarchy

1. Hero
2. Filter by event type
3. Featured event stories
4. Gallery
5. Optional video reels
6. CTA

Do not include AI proxy imagery in public Work content.

---

# About / Our Approach `/about`

## Purpose

Build credibility without a personality-led team page.

## Section hierarchy

1. Hero
2. The operating philosophy: one shared event plan
3. Cultural fluency / languages
4. Experience framing without unverifiable numerical claims
5. How collaboration works with planners/venues/other vendors
6. Service area / travel note
7. CTA

```text
[HERO]
Built around the event, not around separate departments.

[ONE PLAN]
How the crew coordinates

[CULTURAL FLUENCY]
South Asian experience + languages

[HOW WE WORK WITH OTHERS]
Planners | venues | caterers | other vendors

[SERVICE AREA]
DFW; travel outside core area may affect quote

[CHECK DATE]
```

---

# Check Availability `/check-availability`

## Purpose

Capture a qualified lead with minimal friction.

## Progressive form

### Step 1 — The event

- event type
- date
- venue/city

### Step 2 — What you need

- service selection cards
- guest count
- optional budget range
- optional event notes for multi-event celebrations

### Step 3 — Contact

- name
- email
- phone
- preferred contact method
- optional note
- consent/privacy language as required

### Success

- submit to configured lead endpoint
- show thank-you state/page
- analytics success event
- preserve retry/fallback behavior on failure

Do not force users to know technical production details before speaking to Focus Lab.


---

## FILE: 04_COPY_DECK.md

# 04 — Working Copy Deck

This is **working production copy** for the redesign. Codex should wire it into content/config rather than hard-code it deep inside components where practical.

Do not introduce unsupported factual claims while polishing.

---

# Global

## Primary CTA

**Check Availability**

## Supporting positioning

**One Crew, Zero Handoffs.**

## Short company descriptor

**DFW event media, entertainment and production for weddings and celebrations.**

---

# Home

## Hero

**Eyebrow:** DFW WEDDINGS + EVENTS

# One event. One crew. Zero handoffs.

Photography, film, DJ/MC, sound, lighting and event production coordinated around one shared plan for weddings and celebrations across Dallas–Fort Worth.

**Primary:** Check Availability  
**Secondary:** See the Work

## Credibility strip

- South Asian event experience
- English · Urdu · Hindi · Punjabi
- Serving Dallas–Fort Worth
- Photo · Film · Entertainment · Production

## Event chooser

# What are you planning?

### South Asian Weddings
Multi-event celebrations deserve a crew that understands the flow, the energy and the cultural context.

### Weddings
Photo, film, music and production built around one wedding plan.

### Parties & Celebrations
Birthdays, engagements, anniversaries, showers and private events without the vendor shuffle.

### Corporate & Community
Entertainment, media and production for company, nonprofit, community and cultural events.

## Why One Crew

**Eyebrow:** WHY ONE CREW

# Cameras, music and cues shouldn't meet for the first time at your entrance.

When photo, video, entertainment and production are planned separately, the client or planner becomes the connection point. Focus Lab's model is different: the services you choose work from one shared event plan.

### Fewer handoffs
Less information gets lost between vendors.

### Shared timing
Entrances, speeches, dances and production cues can be planned together.

### Clear accountability
You know who is coordinating the pieces you hired us to handle.

## Capabilities

# Start with what you need. Combine what works better together.

**Photo** · **Film** · **DJ + MC** · **Sound + Lighting** · **Effects + Experiences**

You do not have to book everything from Focus Lab. The advantage is that you can combine complementary services when coordination makes the event easier and the result stronger.

## Work

**Eyebrow:** THE WORK

# Culture in motion.

Real Focus Lab event stories will live here as the portfolio grows.

> Public production note: remove this fallback sentence once authentic work modules are published. Do not substitute AI proxy images as claimed work.

## Pricing

**Eyebrow:** PRICING

# Know the range before we talk.

Straightforward services get straightforward pricing. Complex events get useful starting points and a proposal built around the real scope.

**CTA:** Explore Pricing & Build Your Event

## Process

# From first message to final cue.

### 01 — Tell us the event
Share the date, location, event type and what matters most.

### 02 — Build the plan
Choose the services, coverage and enhancements that fit the event.

### 03 — One crew executes it
The services you book work from the same plan instead of separate assumptions.

## FAQ

### Can we book only one service?
Yes. Focus Lab can provide an individual service or combine complementary services when that makes sense for your event.

### Do you handle multi-day South Asian weddings?
Yes. Multi-event celebrations are scoped from your event outline rather than forced into a generic single-day package.

### Can you work with our planner or other vendors?
Yes. The one-crew model applies to the services you hire Focus Lab to provide; we can still coordinate with your planner, venue and other vendors.

### Do you travel outside Dallas–Fort Worth?
Yes, depending on the event. Travel beyond the core DFW service area may affect the quote.

### What languages can you communicate in?
English, Urdu, Hindi and Punjabi.

### How does pricing work?
Standardized services can use published prices or starting prices. Multi-day, technically complex or unusually scoped events receive a custom proposal with a useful starting point whenever possible.

## Final CTA

# Your date is the first thing we need.

Tell us what you're planning and we'll start with availability.

**Check Availability**

---

# Weddings

## Hero

**Eyebrow:** DFW WEDDINGS

# Photo, film, DJ and production — working from one plan.

Book only what you need, or combine services so the people capturing the moment and the people running the room are working from the same wedding plan.

**Check Availability**

## Coordination section

# A wedding has enough moving parts already.

The ceremony, entrances, speeches, first dance and open dance floor all depend on timing. When your selected Focus Lab services share the same plan, fewer details have to be repeated and fewer assumptions have to be reconciled on the wedding day.

## Choose your path

### Entertainment
DJ/MC, sound, microphones and dance-floor energy, with production enhancements available.

### Photo + Video
Coverage built around the hours, crew and deliverables your wedding needs.

### Combine them
Create one coordinated content + atmosphere plan instead of managing separate Focus Lab workflows.

## Pricing bridge

# Start with a clear baseline. Build from there.

Wedding entertainment, photography and videography each follow a different market pricing logic, so the site shows the structure honestly instead of forcing everything into one package ladder.

**Explore Wedding Pricing**

---

# South Asian Weddings

## Hero

**Eyebrow:** SOUTH ASIAN WEDDINGS · DFW

# A crew that understands the celebration, not just the schedule.

From intimate pre-wedding events to the baraat, ceremony and reception, Focus Lab can build photo, film, DJ and production around the events your family is actually planning.

**Check Availability**

## Cultural fluency

# Your celebration is not a generic six-hour wedding.

South Asian weddings can be one event, several events, multiple venues or multiple days. We scope the work from your real celebration rather than assuming every family follows the same sequence.

Examples may include engagement or Roka, Haldi, Mehndi, Sangeet, Baraat, ceremony and reception — or a different combination entirely.

## Entertainment

# Music, MC and production with cultural context.

Bollywood, Bhangra, Punjabi, Pakistani, Indian and fusion programming can require a different understanding of pacing, family participation and event flow than a standard reception playlist. Relevant options can also include dhol or mobile-baraat support, lighting and visual effects when requested and operationally appropriate.

## Communication

# Clear communication across generations.

Focus Lab can communicate in English, Urdu, Hindi and Punjabi.

## Pricing

# Useful starting points. A proposal built around your events.

A single event can be priced differently from a wedding day plus reception or a full multi-day celebration. Tell us the events, venues and coverage you need; we will build the scope around that outline.

**See South Asian Pricing**

---

# Parties & Celebrations

## Hero

**Eyebrow:** PARTIES + CELEBRATIONS

# Bring the energy. Skip the vendor juggling.

DJ/MC, sound, lighting, photo/video and visual enhancements for birthdays, showers, anniversaries, engagements and private events across DFW.

**Check Availability**

## Time-block section

# Start with the time you need.

Private celebrations are easier to understand when the base is simple: choose the event duration, then add the production or media that matters to you.

### 3 Hours
A compact celebration window.

### 4 Hours
A strong default for many private events.

### 5 Hours
More room for dinner, formal moments and a longer dance floor.

## Enhancements

# Add the atmosphere, not the clutter.

Uplighting, 360/photo-booth options, monograms, dancing-on-clouds effects, cold sparks and other enhancements can be layered onto the base event when venue rules and scope allow.

---

# Corporate & Community

## Hero

**Eyebrow:** CORPORATE + COMMUNITY EVENTS

# One event plan for the room, the sound and the content.

Entertainment, event media and production for company gatherings, galas, cultural events, community organizations and selected activations across DFW.

**Check Availability**

## Path chooser

### Entertainment
DJ/MC and event sound sold in clear blocks or scoped for the event.

### Production + Media
Photo/video and technical production use half-day, full-day or custom scope depending on crew, rooms, equipment and deliverables.

## Reliability

# The questions professional events actually need answered.

Venue access, load-in timing, microphones, screens, rooms, cueing, power, insurance requirements and the event schedule all affect execution. Focus Lab scopes those details before the event rather than discovering them at showtime.

---

# Photo + Video

## Hero

**Eyebrow:** PHOTO + VIDEO

# One story. Captured in stills and motion.

Choose photography, videography or both, with coverage scaled by hours, crew and deliverables rather than vague package names.

**Check Availability**

## Both

# When photo and video share the same plan, they can spend less time working around each other.

Combined coverage gives both sides the same timeline and priorities while giving you one coordinated media plan.

## Coverage

### 6 Hours
Focused coverage for the most important portion of the day.

### 8 Hours
A strong full-wedding baseline for preparation through major reception moments.

### 10 Hours / Full Day
Longer storytelling, additional transitions and more complete event coverage.

Final inclusions depend on the selected photo/video tier and customer-approved pricing.

---

# Entertainment + Production

## Hero

**Eyebrow:** ENTERTAINMENT + PRODUCTION

# Make the room feel as good as the moment.

Start with DJ/MC, sound and the core event plan. Then add lighting, booths and visual effects where they improve the experience.

**Check Availability**

## Foundation

# The base should already feel complete.

Wedding and party entertainment should not require a dozen small add-ons just to become functional. The core offer centers on DJ/MC, appropriate sound, microphones, basic dance lighting and planning; enhancements are for changing the experience, not fixing a deliberately incomplete base.

## Enhancements

- Uplighting
- Monogram / gobo
- Photo booth / 360 booth
- Dancing on clouds
- Cold sparks / sparkulars
- Advanced lighting
- Dhol / baraat support where requested
- LED wall / staging / complex production by custom scope

## Venue note

Visual effects and advanced production depend on venue rules, safe operating conditions, load-in, power and other technical constraints.

---

# Pricing

## Hero

**Eyebrow:** PRICING

# Know the range before we talk.

You should not have to submit a form just to learn whether an event company is remotely in range. Focus Lab uses clear prices or starting points where the scope is predictable and custom proposals where the event genuinely requires one.

## Framework

### Exact / simple pricing
Best for standardized enhancements, overtime, simple party blocks and other predictable items.

### Starting package pricing
Best for weddings, DJ/MC, photography, videography and combinations with recognizable scope.

### Starting investment + custom proposal
Best for multi-day South Asian celebrations, advanced production, multi-room corporate work and unusual technical requirements.

## Custom quote bridge

# Custom does not mean secret.

For complex events, we still want to show a credible starting point and explain what changes the price: events, locations, hours, crew, production and deliverables.

---

# About / Our Approach

## Hero

**Eyebrow:** OUR APPROACH

# Built around the event, not around separate departments.

Focus Lab Productions brings complementary event services together around a shared plan while staying flexible enough to provide only the services a client actually needs.

## Cultural fluency

# Experience matters most when it changes how you work.

Focus Lab's South Asian event experience informs how we think about multi-event celebrations, family participation, music, timing and communication. The company is not limited to South Asian events, but cultural fluency is a meaningful part of how we serve DFW.

## Working with others

# One crew does not mean "only our crew."

We can coordinate the Focus Lab services you book while working alongside your planner, venue, caterer and other vendors.

---

# Check Availability

## Hero

# Is your date open?

Tell us the basics first. We can work out the technical details after we know what you're planning.

### Step 1
**Your event** — type, date, venue/city.

### Step 2
**What you need** — services, guest count and optional context.

### Step 3
**How to reach you** — contact details and preferred method.

**Submit:** Check Availability


---

## FILE: 05_COMPONENT_CONTRACTS.md

# 05 — Component Contracts

Build these as reusable primitives/sections consistent with the existing repo conventions.

## 1. `SiteHeader`

**Responsibilities**
- logo link to home
- desktop navigation + two dropdown groups
- mobile navigation
- dominant `Check Availability` CTA
- hide Work link when `workPublished=false`

**Required data**
- nav items
- brand asset reference
- publication flags

**Behavior**
- keyboard navigable
- escape closes dropdown/menu
- focus managed correctly on mobile open/close
- no layout jump when sticky state changes

---

## 2. `PageHero`

**Props/content**
- eyebrow
- h1
- body
- primary CTA
- optional secondary CTA
- media
- theme/background token

**Variants**
- home split hero
- event/service hero
- text-first pricing/form hero

**Rules**
- exactly one H1
- media must have source/proof classification
- CTA hierarchy comes from approved style system

---

## 3. `CredibilityStrip`

Short factual trust statements only.

Do not insert awards/review counts/years/clients unless verified.

---

## 4. `EventChooser`

**Items**
- South Asian Weddings
- Weddings
- Parties & Celebrations
- Corporate & Community

**Each card**
- title
- short body
- href
- image/media slot
- image truth classification

**Responsive**
- 4-up desktop when space allows
- 2-up tablet
- stacked mobile

---

## 5. `WhyOneCrew`

Visual comparison of fragmented-vendor coordination vs one shared Focus Lab plan.

Must remain understandable without animation.

Content pillars:
- fewer handoffs
- shared timing
- clear accountability

---

## 6. `CapabilityBand`

Compact labels:
- Photo
- Film
- DJ + MC
- Sound + Lighting
- Effects + Experiences

Not a giant services menu.

---

## 7. `MediaStoryGrid`

**Data requirement**
Every media item has:
- id
- src
- alt
- event type
- caption optional
- `proofStatus`: `proxy-dev | authentic-approved | authentic-pending`
- optional event story id

**Public behavior**
Only `authentic-approved` may render in Work/portfolio proof contexts.

---

## 8. `PackageCards`

Reusable for wedding entertainment, media tiers, party blocks, corporate blocks.

**Props**
- package id
- label
- optional badge
- price reference id
- duration
- inclusions
- exclusions/notes
- CTA
- `priceMode`: `exact | starting | custom-anchor`

**Rules**
- pricing comes from data/config only
- do not write dollar amounts inside component JSX/template
- customer can change data without component redesign

---

## 9. `EnhancementGrid`

Items such as uplighting, booth, 360, monogram, clouds, sparks.

Each item may include:
- image/icon
- label
- concise benefit
- price id
- venue/safety note where relevant
- availability flag

Advanced production items can display `Custom scope` instead of a fixed price.

---

## 10. `PricingPreview`

Homepage compact pricing anchors.

Shows no more than 4 high-signal cards at once.

Recommended DEV preview set:
- Wedding DJ
- Wedding Photography
- Wedding Videography
- Photo + Video

---

## 11. `PricingConfigurator`

**Goal**
Help the visitor understand likely scope, not promise an automatically binding quote.

**Inputs**
- event type
- base package/time block
- optional services
- enhancements
- duration/additional hours when applicable

**Outputs**
- estimated starting total or range
- explanation of what remains custom
- CTA to Check Availability with selected items serialized/prefilled

**Important**
For custom-scope South Asian/corporate/advanced production, do not fabricate arithmetic precision. Switch to starting-anchor + scope-variable messaging.

---

## 12. `ProcessSteps`

Three steps only:
1. Tell us the event
2. Build the plan
3. One crew executes it

---

## 13. `ReviewSection`

**Render gate:** approved real reviews only.

Review schema:
- quote
- first name or approved attribution
- event type
- optional event date/year
- source/platform optional
- approval flag

If no approved reviews exist, component does not render; do not show placeholders publicly.

---

## 14. `FAQAccordion`

- semantic buttons
- keyboard accessible
- content can be expanded without JS-only crawl dependency where possible
- deep-linking optional

---

## 15. `FinalCTA`

Headline + short copy + one dominant CTA.

Do not put multiple equally weighted primary actions in the same module.

---

## 16. `ProgressiveLeadForm`

### Step 1 — event
- eventType
- eventDate
- venueOrCity

### Step 2 — scope
- services[]
- guestCount
- budgetRange optional
- eventOutline optional

### Step 3 — contact
- name
- email
- phone
- preferredContact
- note optional
- consent fields as required

### Hidden/context fields
- sourcePage
- selectedPricingItems[]
- campaign params / UTM
- timestamp
- referrer when allowed

### Submission
Use existing repo's configured API/webhook seam.

On success: thank-you route/state + analytics.
On failure: preserve entered values, show useful error, permit retry and configured fallback.

---

## 17. `MobileActionRail`

Conditional actions:
- call
- text
- check date

Only render call/text if verified contact config exists.

---

## 18. `SiteFooter`

Four groups: Events, Services, Company, Utility.

Uses publication flags and real social/contact config.


---

## FILE: 07_MEDIA_AND_PROOF_POLICY.md

# 07 — Media & Proof Policy

## Why this exists

Focus Lab has substantial event experience but currently limited reusable historical portfolio media. The website must never compensate for that gap by blurring the line between development imagery and actual work.

## Asset truth states

Every image/video intended for the redesign should carry one of these states in metadata/config:

### `proxy-dev`
AI-generated, stock-like development proxy, staged mock content not attributable to a real Focus Lab client, or any asset whose provenance makes it unsuitable as proof.

Allowed:
- local development
- internal screenshots
- staging prototypes when clearly controlled

Not allowed:
- public Work/Portfolio claims
- testimonial pairings
- "our weddings" proof language
- case studies

### `authentic-pending`
Real Focus Lab-related media that has not yet completed approval/permission/quality review.

Allowed:
- internal content workflow

Not allowed publicly until approved.

### `authentic-approved`
Real Focus Lab work approved for website use.

Allowed:
- portfolio
- homepage Work preview
- event/service-page proof
- case studies
- social proof context

## Public rendering rules

1. Portfolio and case-study components filter to `authentic-approved` only.
2. Proxy media can still be used as **generic atmosphere design media** only if the production deployment makes its non-portfolio status unmistakable and the customer explicitly approves that usage. Default public behavior should be to replace it before launch.
3. Never attach client names, venues, dates or testimonial text to proxy media.
4. Never imply a venue is a partner because an image depicts it or resembles it.
5. Do not fabricate review stars, review counts, awards, "trusted by" rows, press logos or venue badges.

## Portfolio architecture

Prefer event stories over a random masonry dump.

Event story fields:
- title
- event type
- city/venue only if approved
- date/year optional
- services provided
- short context
- hero media
- gallery
- video/reel optional
- testimonial optional and separately approved

## Publication gate

Build `/work` in development, but hide it from primary navigation until there is enough approved content to make the page credible.

Recommended design threshold:
- 3 distinct event stories **or**
- 12+ strong authentic approved assets with enough event diversity for a coherent gallery.

This threshold is a project design decision, not a market statistic.

## Media performance

- use responsive image generation supported by current repo/framework
- preserve aspect ratio to avoid layout shift
- lazy-load below-the-fold media
- do not lazy-load the primary LCP image unnecessarily
- poster images for videos
- no autoplay with sound
- respect `prefers-reduced-motion`
- compress video aggressively; short loops must not dominate mobile data budgets

## Alt text

Describe the meaningful scene; do not keyword-stuff.

Decorative imagery uses empty alt where semantically appropriate.


---

## FILE: 08_RESPONSIVE_ACCESSIBILITY_ANALYTICS.md

# 08 — Responsive, Accessibility, SEO & Analytics

## Responsive behavior

Use the existing repo's breakpoint/token system. The requirements below describe behavior, not a mandatory pixel framework.

### Mobile

- hero becomes single-column; media and copy order chosen for strongest first-screen comprehension
- event cards stack vertically or 2-up only if card readability remains strong
- no tiny four-column pricing grids
- pricing cards can use horizontal snap/scroll only when each card is fully readable and accessible
- Why One Crew diagram simplifies to stacked comparison
- builder inputs become large touch targets
- sticky mobile action rail may appear after meaningful scroll; never cover form submit or cookie/consent controls
- nav is concise and the primary CTA remains obvious

### Tablet

- 2-column event/service cards
- split hero where space permits
- pricing can be 2-up
- avoid awkward orphan sections created by desktop assumptions

### Desktop

- use spacious editorial composition
- max content width should follow approved style system/current repo
- hero may split copy/media
- event chooser can become 4-up
- pricing preview can become 4-up

## Interaction rules

- motion supports hierarchy, never carries meaning alone
- honor `prefers-reduced-motion`
- no scroll-jacking
- no cursor gimmicks that interfere with usability
- no auto-advancing carousel requiring the user to chase content
- dropdown menus and accordions work by keyboard
- persistent CTAs cannot obscure content

## Accessibility

Target WCAG 2.1 AA or the repository's newer stated requirement if stricter.

Required:
- semantic header/nav/main/footer landmarks
- one H1 per page
- heading levels do not skip hierarchy
- buttons for actions, anchors for navigation
- visible focus states
- color contrast that passes AA
- form labels remain programmatically associated; placeholder is not the label
- inline field errors identify the field and recovery action
- keyboard-only operation across nav, pricing builder, accordions and lead form
- meaningful alt text
- `lang="en"` unless localized page routing later changes it
- reduced-motion support

## Performance / Core Web Vitals targets

At 75th percentile field-equivalent testing target:
- LCP ≤ 2.5 s
- INP ≤ 200 ms
- CLS ≤ 0.1

Implementation priorities:
- reserve media dimensions
- optimize above-the-fold assets
- defer noncritical scripts
- avoid third-party bloat
- use server-rendered/static content where the existing framework makes that appropriate
- keep pricing content crawlable; do not hide all useful numbers behind client-only JS

## SEO page intent

### Home
Title direction: `Focus Lab Productions | DFW Weddings, DJ, Photo & Video`

### Weddings
`DFW Wedding DJ, Photography & Video | Focus Lab Productions`

### South Asian Weddings
`South Asian Wedding DJ, Photo & Video DFW | Focus Lab Productions`

### Parties
`DFW Party DJ & Event Services | Focus Lab Productions`

### Corporate
`DFW Corporate Event Entertainment & Production | Focus Lab Productions`

### Photo + Video
`DFW Wedding & Event Photo + Video | Focus Lab Productions`

### Entertainment + Production
`DFW DJ, Lighting & Event Production | Focus Lab Productions`

### Pricing
`DFW Event DJ, Photo & Video Pricing | Focus Lab Productions`

Do not mechanically force titles if final copy/keyword research later gives a better verified target.

## Structured data

Use only schemas supported by actual business data.

- Organization
- LocalBusiness only when verified NAP/service-area data is available and the implementation is semantically appropriate
- BreadcrumbList for inner pages
- WebSite as appropriate

Do not mark fake reviews or fake aggregate ratings.

## Internal linking

Every event page links to:
- relevant service family/families
- pricing
- check availability
- relevant work stories when published

Every service page links back to:
- wedding/event contexts
- pricing
- check availability

Pricing selections deep-link/prefill Check Availability.

## Analytics event contract

Use the existing analytics stack. Emit stable event names:

- `cta_check_availability_click`
- `event_type_select`
- `service_path_select`
- `pricing_tab_select`
- `pricing_builder_change`
- `pricing_estimate_view`
- `lead_form_start`
- `lead_form_step_complete`
- `lead_submit_success`
- `lead_submit_failure`
- `phone_click`
- `text_click`
- `work_media_open`

Suggested parameters:
- `source_page`
- `event_type`
- `service_ids`
- `pricing_mode`
- `step`
- `utm_source`, `utm_medium`, `utm_campaign` when available

Do not send sensitive free-text notes or unnecessary PII into analytics.


---

## FILE: 09_ACCEPTANCE_CRITERIA.md

# 09 — Acceptance Criteria / Definition of Done

## A. Source-of-truth compliance

- [ ] Company name is Focus Lab Productions everywhere.
- [ ] No public team page or named-team marketing introduced.
- [ ] Event-first navigation is implemented.
- [ ] Two service families are implemented: Photo + Video; Entertainment + Production.
- [ ] Primary conversion CTA is Check Availability.
- [ ] No copy implies large multi-event operating capacity.
- [ ] No fabricated proof/clients/venues/reviews/awards.

## B. Pricing

- [ ] Every displayed price is loaded from a centralized data/config layer.
- [ ] Development values are unmistakably marked non-final in code/content source.
- [ ] No dollar amount critical to pricing is duplicated as an unmanaged hard-coded string across pages.
- [ ] South Asian/corporate/advanced-production custom-scope logic does not produce false arithmetic precision.
- [ ] Pricing selections can pass context into the lead form.
- [ ] Swapping the development pricing JSON/config changes all relevant displays without component edits.

## C. Media truth

- [ ] Media items carry proof/provenance state.
- [ ] Public portfolio filters to authentic-approved only.
- [ ] Work nav/page publication gate exists.
- [ ] Proxy imagery is not paired with client/testimonial/case-study claims.

## D. Content architecture

- [ ] All canonical routes exist or are intentionally gated.
- [ ] Each page follows the documented section hierarchy.
- [ ] Each page has one H1.
- [ ] CTA copy is action-specific; vague `Learn More` links are avoided.
- [ ] About page focuses on approach/cultural fluency, not people profiles.

## E. Responsive

- [ ] Hero/event/pricing/form layouts are intentionally designed for mobile, not merely squeezed desktop layouts.
- [ ] No horizontal overflow at supported widths except intentional accessible scroll regions.
- [ ] Sticky mobile CTA does not cover interactive content.
- [ ] All tap targets are comfortably usable.

## F. Accessibility

- [ ] axe or equivalent automated scan has no serious/critical violations.
- [ ] Full keyboard path tested.
- [ ] Focus order is logical.
- [ ] Color contrast meets AA.
- [ ] Form labels/errors are accessible.
- [ ] Reduced motion preference is honored.
- [ ] Media has appropriate alt/empty-alt behavior.

## G. Performance

- [ ] LCP target ≤ 2.5 s in representative test conditions.
- [ ] INP target ≤ 200 ms.
- [ ] CLS target ≤ 0.1.
- [ ] Primary hero media is appropriately optimized.
- [ ] Below-fold media is lazy-loaded.
- [ ] No autoplay audio.
- [ ] Third-party scripts are minimized/deferred.

## H. Lead capture

- [ ] 3-step form implemented.
- [ ] Progressively captured data survives forward/back navigation.
- [ ] Submission uses current configured lead API/webhook.
- [ ] Failure state preserves entered data and supports retry.
- [ ] Success state is clear and tracked.
- [ ] Pricing/event selections prefill form context.
- [ ] PII is not leaked into analytics.

## I. SEO

- [ ] unique title/meta description per indexable page
- [ ] canonical tags as appropriate
- [ ] sitemap excludes unpublished/noindex Work route
- [ ] structured data contains only verified information
- [ ] internal links connect event pages, services, pricing and conversion
- [ ] old public routes redirect where justified after repo/live inspection

## J. Regression / build

- [ ] existing automated tests remain green
- [ ] new critical UI/data behaviors have tests where repo conventions support them
- [ ] production build succeeds without warnings caused by redesign
- [ ] no secrets added to client bundle
- [ ] no unapproved framework/CMS migration introduced

## Client-review readiness gate

The redesign is ready to show Sunny/customer when:

1. the complete IA and pages are functional;
2. the approved logo/style system is applied;
3. development pricing is visually realistic but clearly controlled from one config;
4. proxy imagery is clearly a prototype concern and not represented as work;
5. mobile/desktop both feel designed;
6. lead form works end-to-end in the development/staging environment.

Final public launch still requires customer-approved pricing and media/proof review.


---

## FILE: 10_CODEX_EXECUTION_PROMPT.md

# 10 — Codex Execution Prompt

You are implementing the **Focus Lab Productions website redesign** in the existing repository.

Do not treat this as a greenfield brand exercise. Market research, positioning, service architecture, pricing architecture, logo and style direction have already been decided. Your job is to implement the attached redesign contract faithfully, identify repo conflicts, and produce a polished responsive prototype without independently reinventing strategy.

## First action: inspect before editing

Inspect:

- framework/runtime/package manager;
- current routing;
- existing page/component structure;
- current CSS/design-token system;
- approved Focus Lab logo/vector/style assets;
- data/content configuration;
- current forms/API/webhook integration;
- analytics;
- tests/CI;
- current media assets and their provenance.

Summarize only material conflicts between the repo and the handoff before making structural changes. Do not replatform unless explicitly authorized.

## Source-of-truth order

1. repository-level technical constraints already intentionally established;
2. `01_CANONICAL_DECISIONS.md` for product/website decisions;
3. `02_SITE_ARCHITECTURE.md` for routes/navigation;
4. `03_PAGE_CONTENT_WIREFRAMES.md` for hierarchy/layout;
5. `04_COPY_DECK.md` for working copy;
6. `05_COMPONENT_CONTRACTS.md` for reusable UI behavior;
7. `06_DEV_PRICING_DATA.json` for development pricing;
8. `07_MEDIA_AND_PROOF_POLICY.md` for asset truth;
9. `08_RESPONSIVE_ACCESSIBILITY_ANALYTICS.md` and `09_ACCEPTANCE_CRITERIA.md` for quality gates.

## Non-negotiable constraints

- Company name: Focus Lab Productions.
- Positioning: One Crew, Zero Handoffs.
- Navigation is event-type first.
- No public team page or individual team-member marketing.
- Do not fabricate testimonials, partners, venues, clients, awards or portfolio history.
- AI/development proxy imagery must never be represented as actual Focus Lab work.
- Pricing values are development placeholders and must come from one centralized configuration/data layer.
- Do not imply Focus Lab is a large company capable of multiple simultaneous events.
- Use the already-approved logo/style system; do not design a new identity.
- Build Focus Lab specifically; do not turn the effort into a generic multi-tenant product.

## Implementation phases

### Phase 1 — foundation

- map current repo to canonical routes;
- implement centralized content/pricing/publication config;
- wire approved brand tokens/assets;
- implement header/footer/navigation;
- implement media proof-state model.

### Phase 2 — reusable sections

Build/test:
- PageHero
- CredibilityStrip
- EventChooser
- WhyOneCrew
- CapabilityBand
- PackageCards
- EnhancementGrid
- PricingPreview
- PricingConfigurator
- MediaStoryGrid
- ProcessSteps
- FAQAccordion
- FinalCTA
- ProgressiveLeadForm
- MobileActionRail

Use current repo naming conventions when they differ, but preserve behavior/contracts.

### Phase 3 — pages

Implement:
- `/`
- `/weddings`
- `/south-asian-weddings`
- `/events/parties`
- `/events/corporate`
- `/services/photo-video`
- `/services/entertainment-production`
- `/pricing`
- `/about`
- `/check-availability`
- `/work` built but publication-gated until authentic media threshold is met.

### Phase 4 — conversion/data

- pricing selections feed Check Availability context;
- lead form posts through existing endpoint;
- success/failure states;
- analytics events;
- verified call/text actions only.

### Phase 5 — quality

Run:
- tests/lint/typecheck/build according to repo;
- responsive review at representative mobile/tablet/desktop widths;
- accessibility scan + keyboard review;
- performance review, especially hero/media/pricing interaction;
- route/meta/schema review;
- content truth/proxy-media audit.

## Design intent

The site should feel confident, modern, energetic and culturally literate without becoming visually noisy or "wedding-template" generic.

The page should reveal information in this order:

**Recognition → relevance → differentiation → proof → price → risk reduction → action.**

The visitor should understand within the first viewport:

- DFW weddings/events;
- coordinated photo/film/entertainment/production;
- One Crew, Zero Handoffs;
- Check Availability.

Do not solve a weak hierarchy with more decoration.

## Deliverables back to PM

1. implementation summary;
2. route/component map;
3. screenshots or local preview instructions according to repo workflow;
4. list of unresolved content dependencies only (final prices, missing approved logo asset, verified contact details, authentic media, reviews, etc.);
5. test/build results;
6. any deliberate deviation from this handoff with reason.


---

## FILE: 11_HANDOFF_CHECKLIST.md

# 11 — Handoff Checklist

## Before giving package to Codex

- [ ] Place/copy the approved logo SVGs and style-guide/token outputs from the Logo Evaluation thread into the repo or a clearly named handoff asset directory.
- [ ] Confirm Codex is pointed at the correct website repo/branch.
- [ ] Ensure the current dev-tech decisions from the Market Penetration OS work are present in the repo or companion technical handoff.
- [ ] Include this entire redesign package in the repo under something like `/docs/redesign/` or attach it to the task context.

## Before first Sunny/customer review

- [ ] Replace any broken/missing brand assets.
- [ ] Ensure every shown price comes from DEV config and can be changed live/centrally.
- [ ] Confirm prototype imagery is not labeled as Focus Lab work.
- [ ] Confirm no fake reviews/partners/venue claims are present.
- [ ] Test Check Availability end-to-end.
- [ ] Review mobile first screen on common phone width.
- [ ] Review desktop homepage and every route.
- [ ] Prepare a short list of pricing decisions for Sunny rather than asking him to redesign the site.

## Feedback requested from Sunny

The design review should focus on:

1. Does the site feel like Focus Lab?
2. Does the event-first structure match how he wants customers to approach the company?
3. Is the South Asian positioning strong enough without making the company appear South-Asian-only?
4. Which visual/content sections feel strongest or weakest?
5. Which services/enhancements are operationally ready to publish?
6. Replace the DEV prices with the prices he actually wants to publish.
7. Which authentic images/videos can be approved for launch?

Avoid reopening settled architecture casually unless customer feedback reveals a real problem.


---

## FILE: 12_SOURCE_PROVENANCE.md

# 12 — Source Provenance & Authority

This redesign handoff reconciles several layers of prior Focus Lab work. Use them with the following authority order.

## 1. Current founder/project decisions — highest product authority

Current project facts include:
- company name/DBA: Focus Lab Productions;
- DFW market;
- no public team page / no individual team-member marketing;
- approximately one-event-at-a-time operating capacity;
- English, Urdu, Hindi and Punjabi communication capability;
- South Asian cultural-event experience is a real wedge but the company is not South-Asian-only;
- development proxy imagery must not be represented as client work;
- current positioning territory: One Crew, Zero Handoffs.

These override older speculative website material.

## 2. Consolidated DFW market/pricing evidence — current research authority

Reference file:

`Focus_Lab_DFW_Market_Offer_Pricing_Evidence_Base_2026-08-10.md`

Key decisions carried into this handoff:
- hybrid event-first architecture;
- service/module-based pricing underneath;
- transparent or starting prices for standardized work;
- starting investment + custom scope for multi-day/technical work;
- 3/4/5-hour party structure;
- 6/8/10-hour photo/video coverage logic;
- standardized enhancement menu;
- South Asian work scoped by event outline rather than one generic wedding package.

The development pricing JSON in this package uses rounded competitive-middle values from that evidence for UI prototyping only.

## 3. Approved Logo Evaluation / style system — current visual authority

The approved canonical logo and style system from the Logo Evaluation & Refinement thread govern the redesign.

This package intentionally does not reproduce or reinterpret those brand assets because their exact final vector/style artifacts were not part of the source material bundled here. Codex should use the approved files supplied in the repo/handoff.

If older visual tokens conflict with the approved Logo Evaluation output, the approved newer style system wins.

## 4. Market Penetration OS / development setup — current technical authority

The current repository and development-environment decisions govern framework/tooling implementation.

This redesign package does not authorize a replatform or generic reusable multi-tenant rebuild.

## 5. `FocusLab_ADR_Vol_III_Website_Architecture.pdf` — useful older architecture reference, partially superseded

Still useful:
- event-first navigation principle;
- Check Availability conversion emphasis;
- progressive lead capture;
- accessibility/performance discipline;
- media truth concerns;
- reusable content/component thinking.

Superseded by newer decisions:
- public team/headshot proof requirements;
- generic `/services`, `/packages`, and `/resources` launch emphasis;
- any old pricing-finalization language that predates the consolidated market evidence;
- any visual tokens that differ from the subsequently approved Logo Evaluation style system.

## 6. `DFW Event Services Offers.txt`

This uploaded text is a pointer/summary noting that the consolidated customer-facing DOCX and project-source Markdown pricing evidence were created. It is not itself the underlying market evidence. Use the consolidated Markdown evidence base above for substantive pricing/offer decisions.

## Conflict rule

When sources disagree:

**current founder/project decision → current consolidated evidence → approved brand system/current repo → older ADR → exploratory research/brainstorming**.

Never silently average or blend contradictory old/new requirements.


---

## FILE: 06_DEV_PRICING_DATA.json

```json
{
  "meta": {
    "company": "Focus Lab Productions",
    "status": "development_only",
    "currency": "USD",
    "market": "Dallas-Fort Worth",
    "sourceBasis": "competitive-middle values from consolidated DFW market evidence, rounded for UI prototyping",
    "warning": "NOT CUSTOMER-APPROVED PUBLIC PRICING. Replace centrally after Sunny/customer pricing decision.",
    "version": "2026-08-10"
  },
  "values": {
    "weddingDjCore": {
      "amount": 1700,
      "mode": "starting",
      "label": "Wedding DJ/MC",
      "evidenceBand": [
        1400,
        2000
      ]
    },
    "weddingDjCeremonyReception": {
      "amount": 1900,
      "mode": "starting",
      "label": "Ceremony + Reception DJ/MC",
      "evidenceBand": [
        1800,
        2000
      ]
    },
    "weddingProductionEnhanced": {
      "amount": 4600,
      "mode": "starting",
      "label": "DJ + Substantial Production",
      "evidenceBand": [
        3500,
        5750
      ]
    },
    "partyDjHourly": {
      "amount": 225,
      "mode": "hourly",
      "label": "Private Event DJ/MC",
      "evidenceBand": [
        175,
        250
      ]
    },
    "party3h": {
      "amount": 675,
      "mode": "exact-dev",
      "derivedFrom": "partyDjHourly"
    },
    "party4h": {
      "amount": 900,
      "mode": "exact-dev",
      "derivedFrom": "partyDjHourly"
    },
    "party5h": {
      "amount": 1125,
      "mode": "exact-dev",
      "derivedFrom": "partyDjHourly"
    },
    "digitalPhotoBooth": {
      "amount": 775,
      "mode": "starting",
      "label": "Digital / Open-Air Booth",
      "evidenceBand": [
        650,
        900
      ]
    },
    "booth360": {
      "amount": 600,
      "mode": "starting",
      "label": "360 Booth",
      "evidenceBand": [
        500,
        700
      ]
    },
    "dancingOnClouds": {
      "amount": 525,
      "mode": "starting",
      "label": "Dancing on Clouds",
      "evidenceBand": [
        450,
        595
      ]
    },
    "coldSparks": {
      "amount": 575,
      "mode": "starting",
      "label": "Cold Sparks",
      "evidenceBand": [
        550,
        595
      ]
    },
    "weddingPhotography": {
      "amount": 3300,
      "mode": "starting",
      "label": "Wedding Photography",
      "evidenceBand": [
        2700,
        3900
      ]
    },
    "weddingVideography": {
      "amount": 2700,
      "mode": "starting",
      "label": "Wedding Videography",
      "evidenceBand": [
        2400,
        3000
      ]
    },
    "photoVideoBundle": {
      "amount": 5600,
      "mode": "starting",
      "label": "Photo + Video",
      "evidenceBand": [
        4700,
        6500
      ]
    },
    "southAsianMediaDevelopmentAnchor": {
      "amount": 7500,
      "mode": "custom-anchor-dev",
      "label": "South Asian Celebration Media",
      "evidenceBand": [
        6500,
        8500
      ],
      "note": "Broad competitive-middle anchor across single-to-multi-day media evidence; do not present as a universal package."
    },
    "corporateDjHourly": {
      "amount": 175,
      "mode": "starting-hourly",
      "label": "Corporate DJ/Entertainment",
      "evidenceBand": [
        150,
        175
      ],
      "confidence": "medium"
    },
    "corporateProductionHalfDay": {
      "amount": 1900,
      "mode": "custom-anchor-dev",
      "label": "Corporate Production Half-Day",
      "confidence": "low-market/high-vendor",
      "note": "Use for layout only until Focus Lab internal scope/pricing is set."
    },
    "corporateProductionFullDay": {
      "amount": 5000,
      "mode": "custom-anchor-dev",
      "label": "Corporate Production Full-Day",
      "evidenceBand": [
        4600,
        5500
      ],
      "confidence": "low-market/high-vendor"
    }
  },
  "customQuoteCategories": [
    "multi-day or multi-venue South Asian celebrations",
    "LED walls, stage design and advanced production",
    "large or technically unusual venues",
    "custom dance floors and large production builds",
    "complex live performers or live sound",
    "multi-room corporate AV",
    "destination/travel-heavy events",
    "unusual crew scaling or specialized insurance/COI requirements",
    "restrictive venue load-in, power, rigging or effects conditions",
    "unusual same-day or highly expedited media deliverables"
  ]
}

```
