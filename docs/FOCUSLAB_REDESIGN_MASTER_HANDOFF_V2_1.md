# FOCUS LAB PRODUCTIONS — REDESIGN MASTER HANDOFF v2.1

This consolidated file mirrors the authoritative modular handoff files. JSON configuration/manifests are embedded at the end for agent convenience.


---

# Focus Lab Productions — Codex Redesign Handoff v2.1

**Purpose:** implementation-aware design/art-direction contract for evolving the existing Sonnet prototype into the approved Focus Lab Productions website.

**This is not a rebuild brief.** Codex has already verified that the existing Next.js/React/Tailwind/static-export foundation is suitable. Preserve the working technical foundation and replace the weak/repetitive visual layer with a reusable design system.

## Current verified implementation baseline

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- static export
- Cloudflare Workers Static Assets deployment via Wrangler
- responsive mobile-first implementation
- separated page-content modules
- central typed media registry
- working navigation
- working gallery/filter interactions
- working client-side multi-step inquiry flow
- baseline typecheck/lint/build passing
- Playwright desktop + Pixel 5 smoke coverage established

## Design source of truth

1. `01_CANONICAL_DECISIONS.md`
2. `02_ARCHITECTURE_AND_CONTENT_HIERARCHY.md`
3. `03_VISUAL_SYSTEM_SPEC.md`
4. `04_COMPONENT_SYSTEM.md`
5. `05_PAGE_ART_DIRECTION.md`
6. `06_DEV_PRICING_DATA.json`
7. `07_IMAGE_ASSET_MANIFEST.json`
8. `08_MEDIA_TRUTH_AND_PUBLICATION.md`
9. `09_RESPONSIVE_INTERACTION_REQUIREMENTS.md`
10. `10_CODEX_EXECUTION_PROMPT.md`
11. existing repository technical conventions and repo-local skills

The approved canonical logo/vector/style artifacts from the Logo Evaluation thread remain the visual brand authority. **They are present in the repository root under `/LOGOS`.** Treat `/LOGOS` as the canonical immutable source-asset directory. This package defines how that identity is applied to the website; it does not redesign the identity.

Do not rename, overwrite, redraw, regenerate, or reinterpret the source logo files. If web-optimized derivatives are required, create them in the normal public/application asset location (for example `/public/brand/`) and retain `/LOGOS` unchanged.

## Core implementation principle

Convert repeated page-level Tailwind compositions into shared primitives and section components. Page modules should largely supply content/data/variants rather than duplicate layout classes.

## Core experience principle

**Recognition → relevance → differentiation → price/proof → risk reduction → action**

The first viewport must communicate:

- DFW weddings and events;
- photo/film + entertainment/production capability;
- One Crew, Zero Handoffs;
- Check Availability.

## Image principle

Design layout first. Every important image receives an asset ID and composition brief before generation. AI imagery is aspirational brand/editorial imagery only; it is never client proof.


## Phase-0 preservation rule

Codex already established a passing technical baseline before redesign work. The redesign must preserve the Phase-0 infrastructure changes and quality gates unless a change is deliberately required and documented. In particular, do not casually revert `AGENTS.md`, the Playwright baseline, the narrow `next-env.d.ts` ESLint ignore, the static-export/Workers configuration, or the optional system-Chromium test override. See `11_BASELINE_CODEX_CONTEXT.md`.


---

# 01 — Canonical Decisions

## Business / positioning

- Company: **Focus Lab Productions**
- Market: Dallas–Fort Worth
- Positioning territory: **One Crew, Zero Handoffs.**
- Buyer entry: event-type first.
- Capability logic underneath: modular services.
- Strong South Asian / Desi cultural competence without presenting the company as South-Asian-only.
- No public team-member marketing or team page.
- Do not imply large multi-event-at-once capacity.
- Primary CTA: **Check Availability**.

## Launch information architecture

Primary buyer entrances:

1. Weddings
2. South Asian Weddings
3. Parties & Celebrations
4. Corporate & Community

Capability families:

1. Photo + Video
2. Entertainment + Production

Supporting destinations:

- Pricing
- About / Our Approach
- Check Availability
- Work — built but publication-gated until authentic approved media exists in sufficient quality/quantity

## Pricing

- Use centralized development-only market-middle values during implementation.
- Final customer prices are not a design dependency.
- Standardized services: visible exact/starting values.
- Multi-day South Asian and complex technical production: starting investment + custom scope.
- No price value may be duplicated as hard-coded prose when it can be supplied from config/data.

## Evolutionary redesign

Do not restart from scratch.

Preserve the verified working foundation:

- Next.js 15 App Router / React 19 / TypeScript
- Tailwind CSS 4
- static export
- Cloudflare Workers Static Assets via Wrangler
- page-content modules
- typed media registry
- working navigation/interactions
- working multi-step inquiry UI

The redesign target is the weak visual layer: repeated direct Tailwind class compositions for heroes, headings, buttons, containers, cards, CTA bands and page structures.

## AI imagery decision

The customer wants photorealistic AI-generated imagery as the principal visual layer.

Use AI assets for:

- heroes;
- event-category cards;
- service/editorial visual moments;
- atmospheric production imagery;
- CTA backgrounds where useful.

Do **not** use AI images as:

- portfolio proof;
- case studies;
- testimonials;
- named client events;
- venue/partner evidence;
- "Our Work" gallery content.

### Consequence for public launch

Until authentic approved Focus Lab media exists:

- `/work` remains unpublished / out of primary navigation;
- homepage and inner-page proof galleries do not render;
- AI brand imagery remains integrated into editorial layout rather than grouped into a pseudo-portfolio.

This is preferable to labeling an AI gallery with a disclaimer.

## Brand assets

The approved canonical vector/logo source files are already in the repository root at **`/LOGOS`**.

Treat `/LOGOS` as authoritative and immutable source material:

- inspect and use the correct supplied variant for light/dark/header/footer/favicon contexts;
- do not redraw, regenerate, approximate, rename, overwrite, or modify the originals;
- create optimized web derivatives elsewhere (for example `/public/brand/`) when needed;
- derive favicons/social/header assets from the canonical vectors rather than approximating the logo with CSS or text;
- if variant intent is genuinely ambiguous, report the mapping question rather than inventing a new identity.

The approved style system from the Logo Evaluation work remains authoritative. Do not invent a new logo, palette or font system.


---

# 02 — Architecture & Content Hierarchy

## Canonical routes

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
- `/work` — buildable but publication-gated

Preserve existing working routes when equivalent; if canonical route names replace old ones, add redirects rather than breaking continuity.

## Primary navigation

Desktop:

- Weddings
- South Asian Weddings
- Events ▾
  - Parties & Celebrations
  - Corporate & Community
- Services ▾
  - Photo + Video
  - Entertainment + Production
- Pricing
- **Check Availability**

`Work` appears only when `workPublished === true`.

`About` belongs in footer/contextual links rather than occupying high-value primary-nav space.

## Global commercial page rhythm

1. Recognition / hero
2. Relevance
3. Differentiation
4. Offer architecture
5. Price / decision support
6. Risk reduction / process / FAQ
7. Action

Authentic proof can be inserted between 4 and 5 when available. The page must remain complete without fake proof.

## Home

1. Header
2. Hero — DFW + One Crew / Zero Handoffs + CTA
3. Credibility strip — factual only
4. Event chooser — 4 buyer paths
5. Why One Crew — coordination explanation
6. Capability system — Photo/Film + Entertainment/Production
7. Pricing preview — market-median DEV values
8. How it works — 3 steps
9. FAQ
10. Final CTA
11. Footer

When authentic work is available, insert a Work/Event Story section after capabilities.

## Weddings

1. Wedding hero
2. One wedding plan / coordinated timeline
3. Choose your path: entertainment / media / both
4. Wedding entertainment collections
5. Photo/video coverage architecture
6. Enhancements
7. Pricing anchor + builder CTA
8. Process
9. FAQ
10. Final CTA

## South Asian Weddings

1. Hero
2. Cultural fluency / languages
3. Event-sequence model
4. "Built around your events, not a generic ritual checklist"
5. Entertainment + production modules
6. Photo/video coverage architecture
7. Single Event / Wedding Day + Reception / Full Celebration pricing model
8. Multi-event planning process
9. FAQ
10. CTA

## Parties & Celebrations

1. Hero
2. Event examples
3. 3h / 4h / 5h choice
4. Base inclusions
5. Enhancements
6. Optional photo/video
7. Overtime/pricing clarity
8. FAQ
9. CTA

## Corporate & Community

1. Hero
2. Entertainment vs Production/Media chooser
3. Event examples
4. Entertainment block pricing
5. Half-day / full-day / custom production framework
6. Logistics/reliability checklist
7. Inquiry requirements
8. FAQ
9. CTA

## Photo + Video

1. Hero
2. Photo / Video / Both selector
3. Coverage ladder
4. Crew/deliverable scaling
5. Why combined coverage helps
6. Optional sessions / social content
7. Pricing
8. FAQ
9. CTA

## Entertainment + Production

1. Hero
2. DJ/MC + sound foundation
3. Wedding / Party / Corporate selector
4. Core packages/time blocks
5. Enhancement grid
6. Custom-production boundary
7. Venue/safety note
8. Pricing
9. FAQ
10. CTA

## Pricing

1. Hero
2. Transparency principle
3. One complete visible pricing menu, grouped as Sound & Hosting, Photo + Video, and Enhancements
4. Package/time-block cards with no tabbed or hidden categories
5. Add-to-Plan controls
6. Development subtotal with custom-scope items kept separate
7. Custom-scope bridge
8. What changes price
9. FAQ
10. Check Availability with prefilled selections

## About / Our Approach

1. Hero
2. One shared event plan
3. Cultural fluency + languages
4. Experience framing without unsupported numbers
5. How Focus Lab works with planners/venues/vendors
6. Service area/travel
7. CTA

## Check Availability

Step 1: event type, date, venue/city

Step 2: services, guest count, optional budget/context

Step 3: name, email, phone, preferred contact method, optional note

No technical-production interrogation before basic lead capture.


---

# 03 — Visual System Specification

## Canonical logo assets

Source vectors live at repo-root `/LOGOS`. These files are approved brand source assets, not design references to reinterpret. Use them directly or derive optimized web copies elsewhere. Preserve originals unchanged.

## Intent

The website should feel:

- modern;
- cinematic;
- energetic;
- premium but approachable;
- culturally literate;
- operationally confident;
- cleaner than a typical wedding-industry template.

Avoid luxury clichés, ornate wedding-template decoration, fake opulence, overuse of gradients, glassmorphism, script fonts, excessive animation, and dense service-icon walls.

## Brand token mapping

The approved Logo Evaluation output is authoritative for exact brand colors and font families. Implement semantic tokens and map the approved values into them.

Required semantic color roles:

```text
--color-canvas
--color-canvas-alt
--color-surface
--color-surface-elevated
--color-ink
--color-ink-muted
--color-border
--color-brand-primary
--color-brand-primary-hover
--color-brand-accent
--color-on-brand
--color-focus
--color-success
--color-error
```

Never sprinkle raw brand hex values through page classes.

## Layout tokens

Recommended structural defaults unless the approved style system specifies otherwise:

```text
content-max: 1240px
reading-max: 760px
mobile gutter: 20px
tablet gutter: 32px
desktop gutter: 40px
section-y-mobile: 72px
section-y-tablet: 88px
section-y-desktop: 112–128px
header-height-mobile: ~68px
header-height-desktop: ~80px
```

Use the existing Tailwind system, but create a small semantic layer rather than repeating arbitrary paddings on every page.

## Spacing scale

Prefer a coherent 4px-based scale:

`4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128`

Section composition should use a small subset consistently.

## Typography hierarchy

Use approved font families. Define semantic text styles/components rather than arbitrary page classes.

Suggested responsive scale:

- Display / home H1: `clamp(3rem, 6vw, 5.5rem)`; tight leading ~0.95–1.02
- Page H1: `clamp(2.6rem, 5vw, 4.6rem)`
- Section H2: `clamp(2rem, 3.4vw, 3.4rem)`
- H3/card title: `1.25–1.75rem`
- Lead: `1.125–1.35rem`
- Body: `1rem–1.125rem`
- Small/eyebrow: `0.75–0.875rem`, tracked, uppercase only where the approved style supports it

Rules:

- one H1 per page;
- headlines are short enough to remain intentional on mobile;
- body line length generally 55–75 characters;
- never use tiny gray text as a crutch for fitting content.

## Shape system

Recommended defaults when the approved style system does not already define them:

- controls: 10–12px radius
- cards: 16–20px radius
- major media: 20–28px radius
- pills: full radius
- borders: 1px, subtle

Use shadows sparingly; prefer contrast, border and composition to floating-card clutter.

## Button system

### Primary

- filled brand-primary
- high contrast
- minimum 48px touch height, ~52px desktop
- used for Check Availability / Build Your Event

### Secondary

- border or quiet surface treatment
- visually subordinate but clearly interactive

### Text action

- label + directional arrow
- used for contextual navigation

No page-local one-off button styling.

## Hero system

Create 3 variants only:

### `split`
Best for Home and pages where copy needs clear negative space independent of the photograph.

Desktop: ~45/55 or 50/50 copy/media.
Mobile: media can lead or follow depending on first-screen comprehension; default to image first only if headline remains visible without excessive scroll.

### `fullBleed`
Best for selective event/service pages when an image has intentional negative space for copy.

Requires asset-specific overlay-safe zone and separate mobile crop metadata.

### `textLed`
Pricing, About, Check Availability. Minimal decorative media or none.

Do not create a unique hero composition for every route.

## Section rhythm

Alternate between:

- clean canvas text-led sections;
- image-led editorial moments;
- structured decision components (cards/tabs/pricing);
- strong brand CTA bands.

Avoid stacking five card grids in a row.

## Cards

Cards are decision tools, not decoration.

Use clear variants:

- event card — image + category + short promise + arrow
- package card — title + price + inclusions + CTA
- enhancement card — visual/icon + concise label + optional price
- process card — numbered text, minimal chrome

## Image art direction

Photography should feel like high-end documentary/editorial event coverage:

- believable skin texture and lighting;
- real human interaction;
- candid energy over staged catalog poses;
- rich but natural color;
- controlled highlights;
- premium venues without implying a specific partner;
- cultural details accurate enough to feel intentional;
- diverse DFW audience across the site;
- no uncanny hands/faces/jewelry/text artifacts;
- no impossible lighting rigs, fire/spark safety violations, or venue-specific fake signage.

Use brand orange as an occasional environmental echo (lighting glow, florals, textile accent, DJ lighting), not a global orange filter.

## Motion

- 150–250ms interaction transitions
- subtle image scale/overlay on hover only where useful
- no scroll-jacking
- no autoplay audio
- respect `prefers-reduced-motion`
- important meaning cannot depend on animation


---

# 04 — Reusable Component System

The existing prototype repeats Tailwind classes directly. The redesign should turn that visual logic into primitives and sections.

## Foundation primitives

### `Container`

Responsibilities:
- max width + responsive gutters
- optional reading-width variant

Variants:
- `wide`
- `content`
- `reading`

### `Section`

Responsibilities:
- vertical rhythm
- semantic background/theme
- optional divider

Variants:
- `default`
- `alt`
- `dark/brand` when approved palette supports it
- `compact`

### `Stack` / `Cluster` / `Grid`

Use only if aligned with repo conventions; goal is consistent layout behavior, not abstraction for its own sake.

## Typography primitives

- `Eyebrow`
- `DisplayHeading`
- `SectionHeading`
- `Lead`
- `BodyCopy`

These can be components or Tailwind component classes/CVA variants. The important requirement is centralized hierarchy.

## Controls

- `Button` with primary/secondary/text variants
- `IconButton`
- `Field`
- `Select`
- `CheckboxCard` / `ChoiceCard`
- `FormStep`
- visible focus states

## Structural sections

### `SiteHeader`
- desktop nav/dropdowns
- mobile menu
- primary CTA
- `Work` publication flag

### `PageHero`
Props:
- `variant: split | fullBleed | textLed`
- eyebrow
- title
- body
- primary/secondary CTA
- media asset reference
- mobile crop/position supplied by registry
- theme

### `CredibilityStrip`
Factual claims only.

### `EventChooser`
4 event cards; image composition comes from manifest.

### `WhyOneCrew`
Static-first coordination visualization; clear without motion.

### `CapabilitySplit`
Prefer two large capability families over a five-column service catalog:
- Photo + Video
- Entertainment + Production

Individual sub-capabilities can appear as compact labels beneath each family.

### `PackageCards`
Data-driven pricing/package cards.

### `CoverageSelector`
6h/8h/10h or analogous coverage structure.

### `EventDurationSelector`
3h/4h/5h for parties.

### `EnhancementGrid`
Uplighting, booth/360, clouds, sparks, monogram etc. Avoid excessive decorative cards.

### `PricingConfigurator`
- event-type context
- service selections
- current DEV/customer-approved pricing config
- starting-range language
- carry selected context into inquiry form

### `ProcessSteps`
3 steps; responsive horizontal/vertical.

### `FAQAccordion`
Accessible buttons/regions; deep-link optional.

### `FinalCTA`
Strong high-contrast band; optional editorial background asset with safe overlay zone.

### `ProgressiveLeadForm`
Reuse the existing working flow where sound. Restyle rather than rewriting behavior unless needed.

### `MobileActionRail`
Optional sticky bottom actions:
- Call (only verified number)
- Text (only verified number)
- Check Date

Must not cover content/form controls and should collapse appropriately during keyboard input.

## Proof components — gated

### `EventStoryGrid`
### `ReviewQuote`
### `PortfolioGallery`

These are authentic-proof components only. Do not feed AI brand assets to them.


---

# 05 — Page Art Direction & Image Composition

This document describes page-level visual composition. Exact image prompts are intentionally deferred until the composition is approved; the canonical asset IDs live in `07_IMAGE_ASSET_MANIFEST.json`.

## Home

### Hero

**Preferred layout:** split hero on desktop; tightly composed stacked layout on mobile.

Copy side:
- eyebrow: DFW Weddings + Events
- strong multiline H1: One event. One crew. Zero handoffs.
- concise supporting copy
- primary CTA + quiet text action

Media side:
- `HOME-HERO-01`
- cinematic reception moment with people, movement and production atmosphere
- should communicate celebration + coordination rather than a posed portrait
- desktop subject bias right/center-right so split composition feels directional
- mobile crop must preserve the emotional human moment

### Credibility strip

No imagery. Crisp factual rhythm.

### Event chooser

Four image cards using:
- `HOME-EVENT-SA-01`
- `HOME-EVENT-WEDDING-01`
- `HOME-EVENT-PARTY-01`
- `HOME-EVENT-CORP-01`

Use consistent 4:5 image geometry. Desktop may be 4-up; tablet 2x2; mobile stacked or 2-column only if labels remain readable.

### Why One Crew

No photograph. Use diagram/typographic composition so the differentiation remains cognitive, not decorative.

### Capabilities

Two large editorial blocks, not five small boxes:

1. Photo + Video — optional `HOME-CAPTURE-01`
2. Entertainment + Production — optional `HOME-PRODUCTION-01`

On narrow screens, alternate image/text order cautiously; maintain clear section titles.

### Pricing / Process / FAQ

Primarily typographic/interactive. Do not dilute decision areas with background photographs.

### Final CTA

Prefer brand-color surface with no image. If visual testing proves an image improves it, use `GLOBAL-CTA-01` with extremely simple composition and heavy safe zone.

## Weddings

Hero asset: `WEDDINGS-HERO-01`

Art direction:
- modern DFW wedding reception
- emotionally warm, not ultra-luxury fantasy
- couple + guests / dance-floor context rather than isolated bride portrait
- visible but tasteful sound/lighting atmosphere

Editorial secondary asset: `WEDDINGS-COORDINATION-01`
- a real-feeling moment where cues matter: entrance, first dance, toast, etc.
- supports "one plan" narrative

Enhancement section can use small crops/details from generated production assets but should not become a pseudo-gallery.

## South Asian Weddings

Hero asset: `SA-HERO-01`

Art direction:
- culturally specific and contemporary
- Pakistani/Indian/fusion visual language without mixing incompatible ritual details into one impossible scene
- energy and family context
- lighting/production visible but not dominant

Supporting assets:
- `SA-BARAAT-01` — mobile/processional energy
- `SA-MEHNDI-01` — colorful pre-wedding celebration, candid interaction
- `SA-RECEPTION-01` — elegant reception/dance-floor production moment

Use these to explain multi-event architecture; never caption them as actual Focus Lab events.

## Parties & Celebrations

Hero asset: `PARTY-HERO-01`

Art direction:
- adult birthday/engagement/private celebration with a believable 80–150 guest feel
- active DJ/dance-floor atmosphere
- broad audience representation
- avoid nightclub-only look; should still read as private event service

## Corporate & Community

Hero asset: `CORP-HERO-01`

Art direction:
- polished corporate/community event room
- audience + stage/sound/lighting context
- professional but energetic
- avoid fake corporate logos or legible brand signage

## Photo + Video

Hero asset: `PHOTO-VIDEO-HERO-01`

Art direction:
- media crew perspective implied through composition, but do not show a fake Focus Lab photographer as a team member
- compelling event moment with cinematic framing
- can include camera in foreground/over-shoulder only if believable

Secondary visual: `PHOTO-VIDEO-DETAIL-01`
- emotional close detail / couple/family candid
- demonstrates editorial photographic tone, not claimed deliverable

## Entertainment + Production

Hero asset: `PRODUCTION-HERO-01`

Art direction:
- DJ + dance floor + intelligent lighting / uplighting
- premium but technically plausible
- no unsafe sparks near guests or fabric
- no impossible LED/stage rigging

Secondary visual: `PRODUCTION-EFFECTS-01`
- cold sparks/clouds or lighting as an atmospheric example
- venue-safe-looking composition

## Pricing / About / Check Availability

Use text-led layouts. These pages do not need hero photographs merely for consistency.

The absence of an image is preferable to decorative clutter.


---

# 08 — Media Truth & Publication Rules

## Asset classes

Every registry item must carry a truth/provenance class.

Recommended values:

- `ai-brand` — generated editorial/brand imagery
- `authentic-approved` — genuine Focus Lab work cleared for public use
- `authentic-pending` — genuine material awaiting approval
- `development-placeholder` — temporary block/wireframe asset

## Allowed use by class

### `ai-brand`
Allowed:
- hero
- event chooser
- service/editorial section
- atmospheric CTA

Forbidden:
- Work/Portfolio gallery
- case study
- testimonial pairing
- named event
- client/venue proof

### `authentic-approved`
Allowed anywhere appropriate, including proof modules.

### `authentic-pending`
Staging/admin only.

### `development-placeholder`
Development only.

## Public Work gate

`workPublished` must remain false until there is enough authentic approved media to create a deliberate, quality-controlled proof page.

Minimum gate should be qualitative, not merely a raw image count. Suggested review criteria:

- at least 3 coherent event stories or equivalent bodies of work;
- consistent quality;
- permission/rights resolved;
- no misleading mixed provenance;
- enough landscape/portrait/video variety for responsive storytelling.

## AI disclosure

Do not present AI brand imagery as documentary evidence. The site need not plaster every hero with an intrusive badge if the context is clearly editorial rather than proof, but internal metadata must always preserve provenance and any legally/ethically required disclosure should be implemented consistently.

## SEO / alt text

Alt text describes what is visible and useful to the user; it must not say "Focus Lab photographed..." for AI assets.


---

# 09 — Responsive, Interaction & Quality Requirements

## Mobile-first composition

Design each major image with a mobile crop before generation approval.

Never rely on desktop negative space surviving a center crop.

Registry must support per-breakpoint object-position/crop metadata or separate source assets when necessary.

## Suggested breakpoint behavior

Use existing project/Tailwind breakpoints unless there is a strong reason to change them.

### Mobile
- single-column primary flow
- 20px-ish side gutters
- hero copy remains understandable before excessive scrolling
- event cards stacked or compact 2-column only when text legibility survives
- pricing cards horizontally scroll only if the interaction is obvious and keyboard-accessible; stacked is often safer
- sticky action rail may be used

### Tablet
- 2-column event grid
- split capability/editorial sections where space permits
- pricing grid 2-up

### Desktop
- container max ~1240px
- split/full-bleed hero variants
- event chooser 4-up
- pricing 3–4-up depending content
- generous section whitespace

## Navigation

- keyboard operable
- Escape closes menus
- focus management on mobile menu
- no hover-only access
- current-page state
- CTA visible without crowding

## Forms

Preserve existing working multi-step behavior when possible.

- labels always visible
- errors specific and associated with fields
- focus first invalid field after submit
- preserve user-entered state on recoverable error
- no fake success if no backend exists
- until submission backend is implemented, staging must clearly expose non-production state to testers rather than silently dropping leads

## Performance

Use repo-local `web-perf` and Cloudflare skills during implementation.

Design obligations:
- reserve image dimensions
- responsive image sizes
- primary hero/LCP asset optimized and not unnecessarily lazy-loaded
- below-fold assets lazy-loaded
- no giant video background as a default hero solution
- avoid layout shift from font/image loading

## Accessibility

- WCAG AA contrast target
- visible focus states
- semantic headings
- 44–48px minimum touch targets where practical
- `prefers-reduced-motion`
- no text embedded in AI images
- decorative images empty-alt when appropriate
- all interactive components keyboard accessible

## Analytics events

At minimum:
- `cta_check_availability`
- `cta_pricing`
- `event_path_select`
- `service_path_select`
- `pricing_tab_change`
- `pricing_item_toggle`
- `pricing_to_inquiry`
- `inquiry_step_complete`
- `inquiry_submit_success`
- `inquiry_submit_error`


---

# 11 — Codex Phase-0 Technical Baseline

This file records the Phase-0 implementation baseline supplied by Codex. Treat these as existing repo facts to preserve while carrying out the visual redesign. They are not invitations to redo baseline engineering.

## Phase-0 status

Phase 0 completed without redesign, appearance, copy, routing, branding, or business-strategy changes. No commit was created at that point.

## Repo-local skills verified

The untracked `.agents/` directory contains six readable repo-local skills registered by `skills-lock.json`:

- Cloudflare platform
- Cloudflare web performance
- Cloudflare Workers best practices
- Wrangler CLI
- Vercel React best practices
- Web design guidelines

The Cloudflare-authored skills are relevant to Cloudflare/performance implementation work. Neither `.agents/` nor `skills-lock.json` was modified, replaced, or reinstalled during Phase 0. Preserve that constraint unless explicitly instructed otherwise.

## Deployment target verified

The checked-in deployment target is **Cloudflare Workers Static Assets**. `wrangler.jsonc` points `assets.directory` at `out/` and has no Worker entry point.

The README still describes Cloudflare Pages. That wording is stale relative to the checked-in Wrangler configuration and remains documentation technical debt. Do not migrate deployment merely to make the README true; update documentation when appropriate.

Wrangler version observed in Phase 0: `4.120.0`.

## Phase-0 files changed

The following baseline changes already exist and should not be casually reverted during design implementation:

### `AGENTS.md`

Contains rules for:

- framework and build commands;
- Workers Static Assets deployment target;
- source-of-truth rules;
- accessibility and responsive requirements;
- media/proxy and business-truth rules;
- team-member marketing restriction;
- component-reuse requirement;
- required quality gates;
- Git and installed-skill safety rules.

### `.gitignore`

Ignores Playwright results/report output and TypeScript incremental metadata.

### `eslint.config.mjs`

Narrowly ignores generated `next-env.d.ts`.

Reason: Next.js generates and rewrites `next-env.d.ts`; the TypeScript ESLint preset rejects the generated triple-slash reference. Editing the generated file is not durable, and globally disabling the rule would hide legitimate application errors. Preserve the narrow generated-file exclusion unless framework behavior changes.

### `package.json` / `package-lock.json`

- adds `npm test`;
- adds `@playwright/test` 1.62.1;
- lockfile records the matching test-runner dependency.

### `playwright.config.ts`

Provides:

- Desktop Chrome and Pixel 5 projects;
- development web server;
- serialized execution for reliability;
- optional system-Chromium override for constrained environments.

### `tests/smoke.spec.ts`

Provides the minimal baseline smoke suite.

## Tests established

Four tests run under both desktop and mobile projects, producing eight cases:

1. important public routes return successfully and render the page shell;
2. homepage loads and exposes its primary heading;
3. rendered internal navigation links return successful responses;
4. Check Availability renders and advances from step one to step two;
5. desktop Chrome and Pixel 5 viewport coverage is included;
6. basic horizontal-overflow smoke assertion is included.

Phase-0 result: **8 passed**.

## Commands verified in Phase 0

- `npm run typecheck` — passed
- `npm run lint` — passed
- Playwright smoke tests — 8 passed
- `npm run build` — passed
  - compiled successfully
  - generated 11 static pages
  - exported expected routes to `out/`
- `npx wrangler --version` — `4.120.0`

The local test run used:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/snap/bin/chromium npm test
```

The baseline machine did not have Playwright's managed Chromium binary. Its download failed because of filesystem pressure, so the configuration supports an optional existing-browser override while retaining normal managed-browser behavior for CI.

## Known baseline issues that are NOT redesign scope by default

### Disk pressure

The baseline machine was effectively full, with only about 160 MB available. This blocked download of Playwright's approximately 184 MB Chromium package. Temporary unsuccessful-download/test artifacts were removed.

### Dependency audit

`npm audit` reported three high-severity findings through the existing dependency tree involving:

- Next.js;
- bundled PostCSS;
- Sharp/libvips.

The automatic npm resolution proposed Next.js 16.3.0, which is a major migration. Phase 0 deliberately did **not** perform that unrelated upgrade. Do not turn this visual redesign into an unapproved framework migration. If security remediation becomes separately authorized, handle it as its own scoped task.

### README deployment wording

README says Cloudflare Pages while `wrangler.jsonc` configures Workers Static Assets. Treat Wrangler as deployment source of truth.

### Development-only Next warning

Playwright produced a development-only warning about `127.0.0.1` requests to Next development assets. It did not affect the static production export.

## Redesign preservation rule

The redesign may refactor visual/component code substantially, but the implementation should finish with the established baseline still green or with any deliberate changes explicitly explained. At minimum rerun:

- typecheck;
- lint;
- desktop/mobile smoke tests;
- production build/static export.

Do not modify `.agents/` or `skills-lock.json` as part of ordinary redesign work.


---

# Focus Lab Productions — Codex Redesign Execution Prompt v2.1

Implement the approved Focus Lab Productions redesign by **evolving the existing prototype**, not rebuilding/replatforming it.

## Verified baseline to preserve

The repo has already been inspected and verified as a sound foundation:

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- static export
- Cloudflare Workers Static Assets via Wrangler
- responsive mobile-first pages
- separated page-content modules
- central typed media registry
- working navigation
- working gallery/filter interactions
- working client-side multi-step inquiry flow

Baseline quality gates were established: typecheck, lint, build and desktop/mobile Playwright smoke tests pass in the documented environment. Phase 0 also established `AGENTS.md`, Playwright config/tests, the narrow generated `next-env.d.ts` ESLint ignore, and test/deployment conventions. Preserve these unless the redesign genuinely requires a documented change.

The checked-in deployment source of truth is `wrangler.jsonc` targeting **Cloudflare Workers Static Assets** from `out/`; README's Pages wording is stale documentation.

Do not perform an unrelated framework migration, deployment migration, dependency-major upgrade, or greenfield rewrite.

## Repo-local skills

Use the existing repo-local skills where relevant:

Cloudflare:
- cloudflare
- workers-best-practices
- wrangler
- web-perf

Frontend/design:
- vercel-react-best-practices
- web-design-guidelines

Do not reinstall or replace those skills unless explicitly asked.

## Main redesign task

The weak layer is the repeated visual implementation: heroes, CTA bands, headings, buttons, containers, cards and page sections are too often encoded as page-local Tailwind compositions.

Refactor toward reusable design primitives and section components while preserving working content/data separation and behaviors.

Read and follow:

1. `01_CANONICAL_DECISIONS.md`
2. `02_ARCHITECTURE_AND_CONTENT_HIERARCHY.md`
3. `03_VISUAL_SYSTEM_SPEC.md`
4. `04_COMPONENT_SYSTEM.md`
5. `05_PAGE_ART_DIRECTION.md`
6. `06_DEV_PRICING_DATA.json`
7. `07_IMAGE_ASSET_MANIFEST.json`
8. `08_MEDIA_TRUTH_AND_PUBLICATION.md`
9. `09_RESPONSIVE_INTERACTION_REQUIREMENTS.md`
10. `11_BASELINE_CODEX_CONTEXT.md`

The approved canonical logo/vector source assets from the Logo Evaluation work are already present at repo-root **`/LOGOS`** and override older prototype branding. Treat `/LOGOS` as authoritative immutable source material. Do not modify or overwrite those originals. Create web-optimized derivatives in the application/public asset structure as needed. Inspect supplied variants and map them deliberately to header/footer/light/dark/favicon contexts. Do not invent a replacement identity.

## Image workflow — mandatory sequence

Do not generate all images first.

For each required asset:

1. implement the approved layout using a clearly labeled placeholder keyed to the canonical asset ID;
2. verify desktop and mobile composition;
3. adjust the asset brief/crop requirements if layout proves it necessary;
4. only after composition is stable, generate the photorealistic image with ImageGen;
5. preserve the final generation prompt/settings in the image manifest;
6. put the optimized asset in the repo;
7. update the typed media registry with provenance and crop metadata;
8. verify desktop/mobile screenshots and performance.

AI images are `ai-brand` assets only. Never feed them into Work/Portfolio/case-study/testimonial proof components.

## Public proof behavior

Until authentic approved Focus Lab work exists:

- `workPublished = false`;
- Work is absent from primary nav;
- proof/event-story/review sections do not render;
- the site still feels visually rich through editorial AI brand imagery in heroes/event/service sections.

## Pricing

Load all development pricing from `06_DEV_PRICING_DATA.json` or an equivalent centralized typed config derived from it. Do not scatter those numbers through JSX.

DEV pricing must be visually usable for the customer review but clearly marked in source/config as non-final.

## Inquiry form

Preserve the existing working multi-step UI where possible. Restyle/refactor without rewriting proven behavior unless required.

There is currently no real submission backend. Do not fake production submission success. Implement a clean adapter/interface for future submission and make staging/test behavior explicit.

## Required implementation outcome

- shared Container / Section / typography / Button / Hero / CTA / Card / Form primitives;
- canonical event/service page sections implemented as reusable variants;
- approved route/content hierarchy;
- responsive image/crop system driven by asset manifest/media registry;
- AI media provenance preserved;
- pricing configurator feeds inquiry context;
- no public team page;
- no fabricated proof;
- production-hardened navigation/a11y/metadata where in redesign scope;
- preserve static export + Workers Static Assets deployment.

## Quality gates

Run the repo's established:

- typecheck
- lint
- Playwright smoke tests (desktop + Pixel 5 or documented equivalent)
- production build/static export

Also review:

- keyboard navigation
- focus visibility
- 320/375/390-ish mobile widths
- tablet
- desktop
- horizontal overflow
- hero LCP/image sizing
- layout shift
- route metadata
- media truth audit

## Deliver back

1. concise implementation summary;
2. list of reusable primitives/components created or consolidated;
3. route/page changes;
4. image assets generated, with manifest IDs;
5. screenshots or preview instructions;
6. test/build results;
7. unresolved content dependencies only;
8. any deliberate deviation from the design handoff and why.


---

# Embedded file: `06_DEV_PRICING_DATA.json`

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


---

# Embedded file: `07_IMAGE_ASSET_MANIFEST.json`

```json
{
  "meta": {
    "company": "Focus Lab Productions",
    "purpose": "layout-first AI brand imagery manifest",
    "status": "briefs_approved_for_layout_placeholders_not_final_generation_prompts",
    "truthClass": "ai-brand",
    "rule": "Never use these assets as portfolio/client/testimonial/case-study proof. Final generation prompt must be stored on each asset after composition approval."
  },
  "assets": [
    {
      "id": "HOME-HERO-01",
      "page": "/",
      "section": "hero",
      "purpose": "primary emotional brand image",
      "priority": "P0",
      "desktopAspect": "16:10",
      "mobileAspect": "4:5",
      "subjectPlacementDesktop": "center-right",
      "negativeSpaceDesktop": "left third kept visually calm",
      "mobileCrop": "preserve primary human interaction and some production atmosphere",
      "content": "cinematic DFW wedding/event reception moment; couple/guests in active celebration; tasteful DJ/lighting atmosphere",
      "lighting": "warm cinematic practicals with realistic skin tones",
      "mood": "confident, alive, premium, candid",
      "culturalNotes": "inclusive/fusion-friendly, not culturally over-specific",
      "exclusions": [
        "legible brand signage",
        "fake venue logos",
        "posed catalog portrait",
        "unsafe sparks",
        "orange color wash",
        "uncanny hands/faces"
      ],
      "prompt": null
    },
    {
      "id": "HOME-EVENT-SA-01",
      "page": "/",
      "section": "event chooser",
      "purpose": "South Asian Weddings category card",
      "priority": "P0",
      "desktopAspect": "4:5",
      "mobileAspect": "4:5",
      "subjectPlacementDesktop": "center",
      "negativeSpaceDesktop": "lower text lives outside image",
      "mobileCrop": "same composition",
      "content": "contemporary South Asian celebration with family energy and culturally coherent attire/decor",
      "lighting": "warm festive indoor",
      "mood": "joyful, vivid, human",
      "culturalNotes": "avoid mixing incompatible ritual props; Pakistani/Indian/fusion readability is acceptable",
      "exclusions": [
        "text/signage",
        "stereotyped costume mashup",
        "portfolio caption context"
      ],
      "prompt": null
    },
    {
      "id": "HOME-EVENT-WEDDING-01",
      "page": "/",
      "section": "event chooser",
      "purpose": "general Weddings category card",
      "priority": "P0",
      "desktopAspect": "4:5",
      "mobileAspect": "4:5",
      "subjectPlacementDesktop": "center",
      "negativeSpaceDesktop": "none required",
      "mobileCrop": "same",
      "content": "modern DFW wedding reception candid with couple and guests",
      "lighting": "soft reception practicals",
      "mood": "romantic but energetic",
      "culturalNotes": "broad-market representation",
      "exclusions": [
        "ultra-luxury fantasy",
        "empty posed ballroom",
        "visible brand marks"
      ],
      "prompt": null
    },
    {
      "id": "HOME-EVENT-PARTY-01",
      "page": "/",
      "section": "event chooser",
      "purpose": "Parties category card",
      "priority": "P0",
      "desktopAspect": "4:5",
      "mobileAspect": "4:5",
      "subjectPlacementDesktop": "center",
      "negativeSpaceDesktop": "none required",
      "mobileCrop": "same",
      "content": "private birthday/engagement celebration dance-floor moment with DJ lighting",
      "lighting": "colorful but realistic",
      "mood": "social, upbeat, accessible",
      "culturalNotes": "diverse DFW guests",
      "exclusions": [
        "nightclub-only setting",
        "alcohol as focal point",
        "brand signage"
      ],
      "prompt": null
    },
    {
      "id": "HOME-EVENT-CORP-01",
      "page": "/",
      "section": "event chooser",
      "purpose": "Corporate & Community category card",
      "priority": "P0",
      "desktopAspect": "4:5",
      "mobileAspect": "4:5",
      "subjectPlacementDesktop": "center",
      "negativeSpaceDesktop": "none required",
      "mobileCrop": "same",
      "content": "professional gala/community event with stage/audience/production context",
      "lighting": "clean event lighting",
      "mood": "polished, credible, energetic",
      "culturalNotes": "diverse attendees",
      "exclusions": [
        "fake company logos",
        "conference-stock handshake clich\u00e9",
        "legible signage"
      ],
      "prompt": null
    },
    {
      "id": "HOME-CAPTURE-01",
      "page": "/",
      "section": "capabilities-photo-video",
      "purpose": "editorial visual for Photo + Video",
      "priority": "P1",
      "desktopAspect": "3:2",
      "mobileAspect": "4:3",
      "subjectPlacementDesktop": "center-left",
      "negativeSpaceDesktop": "right edge simple if overlay needed",
      "mobileCrop": "preserve emotional subject",
      "content": "cinematic candid event moment framed like premium documentary coverage",
      "lighting": "natural/cinematic",
      "mood": "intimate, observant",
      "culturalNotes": "not a claimed Focus Lab deliverable",
      "exclusions": [
        "photographer logo",
        "watermark",
        "fake camera UI"
      ],
      "prompt": null
    },
    {
      "id": "HOME-PRODUCTION-01",
      "page": "/",
      "section": "capabilities-production",
      "purpose": "editorial visual for Entertainment + Production",
      "priority": "P1",
      "desktopAspect": "3:2",
      "mobileAspect": "4:3",
      "subjectPlacementDesktop": "center-right",
      "negativeSpaceDesktop": "left moderate",
      "mobileCrop": "preserve DJ/dance energy",
      "content": "DJ booth, dance floor and tasteful lighting production at private event",
      "lighting": "controlled color with realistic fixtures",
      "mood": "high-energy, premium",
      "culturalNotes": "broad market",
      "exclusions": [
        "impossible rigging",
        "unsafe effects",
        "festival stadium scale"
      ],
      "prompt": null
    },
    {
      "id": "WEDDINGS-HERO-01",
      "page": "/weddings",
      "section": "hero",
      "purpose": "general wedding hero",
      "priority": "P0",
      "desktopAspect": "16:9",
      "mobileAspect": "4:5",
      "subjectPlacementDesktop": "right",
      "negativeSpaceDesktop": "left 35% calm for full-bleed variant; also works cropped in split",
      "mobileCrop": "couple + nearest guests",
      "content": "couple entering or first-dance moment with guests and coordinated reception atmosphere",
      "lighting": "warm, elegant, documentary",
      "mood": "emotional + energetic",
      "culturalNotes": "general/fusion-friendly",
      "exclusions": [
        "posed bridal editorial only",
        "fake venue logo",
        "excessive luxury props"
      ],
      "prompt": null
    },
    {
      "id": "WEDDINGS-COORDINATION-01",
      "page": "/weddings",
      "section": "one-plan",
      "purpose": "support cue/timeline narrative",
      "priority": "P1",
      "desktopAspect": "3:2",
      "mobileAspect": "4:3",
      "subjectPlacementDesktop": "center",
      "negativeSpaceDesktop": "none",
      "mobileCrop": "preserve speakers/couple/event cue",
      "content": "toast, entrance, or first dance where multiple event elements visibly converge",
      "lighting": "reception naturalism",
      "mood": "anticipation, coordination",
      "culturalNotes": "no vendor uniforms/logos",
      "exclusions": [
        "staged corporate team shot",
        "visible branding"
      ],
      "prompt": null
    },
    {
      "id": "SA-HERO-01",
      "page": "/south-asian-weddings",
      "section": "hero",
      "purpose": "flagship cultural hero",
      "priority": "P0",
      "desktopAspect": "16:9",
      "mobileAspect": "4:5",
      "subjectPlacementDesktop": "right-center",
      "negativeSpaceDesktop": "left safe zone",
      "mobileCrop": "preserve couple/family energy",
      "content": "contemporary South Asian wedding celebration with culturally coherent wardrobe/decor and family participation",
      "lighting": "rich warm event lighting",
      "mood": "joyful, cinematic, culturally fluent",
      "culturalNotes": "one coherent event context; do not cram haldi/mehndi/baraat/ceremony into one scene",
      "exclusions": [
        "ritual mashup",
        "costume inaccuracies",
        "text/signage",
        "unsafe effects"
      ],
      "prompt": null
    },
    {
      "id": "SA-BARAAT-01",
      "page": "/south-asian-weddings",
      "section": "event-sequence",
      "purpose": "processional energy example",
      "priority": "P1",
      "desktopAspect": "3:2",
      "mobileAspect": "4:5",
      "subjectPlacementDesktop": "center",
      "negativeSpaceDesktop": "none",
      "mobileCrop": "preserve dancing/processional motion",
      "content": "South Asian baraat/processional celebration with dhol-led energy where culturally coherent",
      "lighting": "daylight or evening practicals",
      "mood": "kinetic, communal",
      "culturalNotes": "avoid inventing a specific family's ritual claim",
      "exclusions": [
        "fake vendor logo",
        "unsafe traffic setting",
        "ritual mashup"
      ],
      "prompt": null
    },
    {
      "id": "SA-MEHNDI-01",
      "page": "/south-asian-weddings",
      "section": "event-sequence",
      "purpose": "pre-wedding celebration example",
      "priority": "P1",
      "desktopAspect": "3:2",
      "mobileAspect": "4:5",
      "subjectPlacementDesktop": "center",
      "negativeSpaceDesktop": "none",
      "mobileCrop": "preserve faces/hands naturally",
      "content": "colorful mehndi/sangeet-style celebration with candid family interaction",
      "lighting": "festive warm + jewel tones",
      "mood": "playful, intimate",
      "culturalNotes": "coherent d\u00e9cor/attire",
      "exclusions": [
        "close-up malformed henna hands",
        "generic Bollywood stage text",
        "logos"
      ],
      "prompt": null
    },
    {
      "id": "SA-RECEPTION-01",
      "page": "/south-asian-weddings",
      "section": "production",
      "purpose": "reception/production example",
      "priority": "P1",
      "desktopAspect": "16:10",
      "mobileAspect": "4:5",
      "subjectPlacementDesktop": "center-right",
      "negativeSpaceDesktop": "left moderate",
      "mobileCrop": "preserve dance-floor energy",
      "content": "South Asian/fusion reception with upscale lighting, packed dance floor and elegant stage ambience",
      "lighting": "controlled magenta/amber/neutral mix without clipping skin",
      "mood": "celebratory, premium",
      "culturalNotes": "modern DFW diaspora feel",
      "exclusions": [
        "festival-scale rig",
        "unsafe sparks",
        "fake signage"
      ],
      "prompt": null
    },
    {
      "id": "PARTY-HERO-01",
      "page": "/events/parties",
      "section": "hero",
      "purpose": "private celebrations hero",
      "priority": "P0",
      "desktopAspect": "16:9",
      "mobileAspect": "4:5",
      "subjectPlacementDesktop": "right-center",
      "negativeSpaceDesktop": "left safe zone",
      "mobileCrop": "preserve dancing group",
      "content": "80\u2013150 guest private party/engagement/birthday with DJ and dance floor",
      "lighting": "energetic practicals",
      "mood": "fun, social, polished",
      "culturalNotes": "diverse audience",
      "exclusions": [
        "nightclub branding",
        "alcohol focal point",
        "teen-only prom look"
      ],
      "prompt": null
    },
    {
      "id": "CORP-HERO-01",
      "page": "/events/corporate",
      "section": "hero",
      "purpose": "corporate/community hero",
      "priority": "P0",
      "desktopAspect": "16:9",
      "mobileAspect": "4:5",
      "subjectPlacementDesktop": "right",
      "negativeSpaceDesktop": "left safe zone",
      "mobileCrop": "stage + audience interaction",
      "content": "professional gala/company/community event with presenter/audience and visible sound/lighting environment",
      "lighting": "clean professional",
      "mood": "capable, polished",
      "culturalNotes": "diverse attendees",
      "exclusions": [
        "legible fake brand slides",
        "handshake stock photo",
        "wedding cues"
      ],
      "prompt": null
    },
    {
      "id": "PHOTO-VIDEO-HERO-01",
      "page": "/services/photo-video",
      "section": "hero",
      "purpose": "capture-services hero",
      "priority": "P0",
      "desktopAspect": "16:9",
      "mobileAspect": "4:5",
      "subjectPlacementDesktop": "right-center",
      "negativeSpaceDesktop": "left safe zone",
      "mobileCrop": "preserve emotional event subject",
      "content": "cinematic event moment with subtle over-shoulder camera/filmmaking context",
      "lighting": "natural/cinematic",
      "mood": "story-driven, intimate",
      "culturalNotes": "do not portray named team member",
      "exclusions": [
        "camera brand prominence",
        "fake Focus Lab uniform",
        "watermark"
      ],
      "prompt": null
    },
    {
      "id": "PHOTO-VIDEO-DETAIL-01",
      "page": "/services/photo-video",
      "section": "deliverables",
      "purpose": "editorial detail",
      "priority": "P1",
      "desktopAspect": "3:2",
      "mobileAspect": "4:3",
      "subjectPlacementDesktop": "center",
      "negativeSpaceDesktop": "none",
      "mobileCrop": "same",
      "content": "emotionally resonant candid detail from a wedding/event",
      "lighting": "soft and realistic",
      "mood": "timeless, human",
      "culturalNotes": "generic editorial example",
      "exclusions": [
        "album mockup with fake branding",
        "portfolio claim"
      ],
      "prompt": null
    },
    {
      "id": "PRODUCTION-HERO-01",
      "page": "/services/entertainment-production",
      "section": "hero",
      "purpose": "entertainment/production hero",
      "priority": "P0",
      "desktopAspect": "16:9",
      "mobileAspect": "4:5",
      "subjectPlacementDesktop": "right-center",
      "negativeSpaceDesktop": "left safe zone",
      "mobileCrop": "preserve DJ + crowd + lights",
      "content": "premium private-event DJ booth, packed dance floor, uplighting/intelligent lighting",
      "lighting": "dynamic but skin-safe",
      "mood": "high-energy, controlled",
      "culturalNotes": "works for weddings/parties",
      "exclusions": [
        "stadium concert scale",
        "unsafe truss",
        "laser into faces",
        "fake logos"
      ],
      "prompt": null
    },
    {
      "id": "PRODUCTION-EFFECTS-01",
      "page": "/services/entertainment-production",
      "section": "enhancements",
      "purpose": "atmospheric effects example",
      "priority": "P1",
      "desktopAspect": "3:2",
      "mobileAspect": "4:5",
      "subjectPlacementDesktop": "center",
      "negativeSpaceDesktop": "none",
      "mobileCrop": "preserve effect + people safely",
      "content": "first-dance clouds and/or cold-spark style visual effect in a venue-safe believable setup",
      "lighting": "elegant warm/cool contrast",
      "mood": "dramatic, romantic",
      "culturalNotes": "generic example",
      "exclusions": [
        "sparks touching fabric/guests",
        "smoke obscuring exits",
        "impossible effect geometry"
      ],
      "prompt": null
    },
    {
      "id": "GLOBAL-CTA-01",
      "page": "global",
      "section": "optional final CTA",
      "purpose": "optional atmospheric CTA background",
      "priority": "P2",
      "desktopAspect": "21:9",
      "mobileAspect": "4:5",
      "subjectPlacementDesktop": "far right",
      "negativeSpaceDesktop": "left 55% very calm",
      "mobileCrop": "abstracted lights/people; copy remains readable",
      "content": "soft defocused reception atmosphere with subtle human silhouettes",
      "lighting": "brand-compatible warm practicals",
      "mood": "anticipatory, elegant",
      "culturalNotes": "non-specific",
      "exclusions": [
        "recognizable fake venue",
        "busy faces behind text",
        "legible signage"
      ],
      "prompt": null
    }
  ]
}
```
