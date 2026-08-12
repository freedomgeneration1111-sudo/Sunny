# 02 — Architecture & Content Hierarchy

> **Superseded model:** this document previously specified a hub-and-spoke
> homepage whose event cards navigated out to separate pages. That model is no
> longer the target. See `docs/12_ONE_ANCHOR_DECISION.md` for the decision
> record, and `docs/reference/Focuslab-One-Anchor-Wireframe.html` for the
> structural reference.

## The architecture in one sentence

**The homepage is the complete customer journey. The supporting routes are a
knowledge layer.**

A visitor should be able to arrive, understand Focus Lab, identify their event,
explore the relevant services, build a plan, see pricing, ask a question, and
reach Check Availability **without leaving the homepage**.

## Canonical routes

| Route | Role |
|---|---|
| `/` | **Primary conversion surface.** The whole journey. |
| `/weddings` | Knowledge layer — Complete DFW Wedding Planning Guide |
| `/south-asian-weddings` | Knowledge layer — Complete Shaadi Planning Guide |
| `/events/parties` | Knowledge layer — Party & Celebration Planning Guide |
| `/events/corporate` | Knowledge layer — Corporate Event & AV Planning Guide |
| `/guides` | Index of focused single-topic checklists |
| `/guides/<slug>` | Six focused checklists |
| `/services/photo-video` | Capability page |
| `/services/entertainment-production` | Capability page |
| `/pricing` | Secondary shareable/searchable pricing surface |
| `/check-availability` | Inquiry flow → CRM |
| `/about` | Approach |
| `/work` | Buildable but publication-gated and `noindex` |

Supporting routes stay **real, crawlable pages**. Never redirect them to
homepage fragments — homepage anchors are for UX, supporting pages are for
depth, search, and sharing.

`/parties` and `/corporate` were re-export duplicates of the `/events/*` routes
and have been deleted. `public/_redirects` 301s them to the canonical paths.
Every indexable route now declares a self-referencing `alternates.canonical`.

## Homepage anchor contract

The homepage section order is a structural contract, mirrored by the header nav
and asserted in `tests/redesign-baseline.spec.ts`:

```
#hero → #trust-strip → #paths → #weddings → #shaadi → #parties
→ #corporate → #why-one-crew → #capabilities → #pricing-menu
→ #how-it-works → #cta
```

`#questions` (FAQ) sits between `#how-it-works` and `#cta`.

The four cards in `#paths` are the customer's mental map. They are **in-page
anchor links** that scroll to the substantial sections below. They must never
navigate to another route.

## Primary navigation

Weddings · Shaadi · Parties · Corporate · Pricing → homepage anchors
(`#weddings`, `#shaadi`, `#parties`, `#corporate`, `#pricing-menu`). From any
other route the same links resolve to `/#anchor`.

Guides → `/guides` (real route). Check Availability → `/check-availability`.
`Work` appears only when `workPublished === true`.

## Section rhythm

Each event section owns a distinct layout so the page does not read as one
repeated card grid:

| Section | Rhythm |
|---|---|
| `#weddings` | Horizontal ceremony→reception timeline spine |
| `#shaadi` | Event-sequence rail (examples, never a required order) + continuity argument |
| `#parties` | Duration-first — the three time blocks are the largest elements |
| `#corporate` | Stacked job-to-be-done rows; deliberately not wedding-shaped |

Section themes alternate `default` / `alt` / `dark` / `brand` so the page
breathes.

## Sources of truth

| Concern | Source |
|---|---|
| Service inventory | `lib/plan.ts` — **the only place a service is defined** |
| Prices | `docs/06_DEV_PRICING_DATA.json` → `lib/pricing.ts` |
| Homepage event section copy | `lib/content/eventSections.ts` |
| Knowledge-layer guides | `lib/content/planningGuides.ts` |
| Focused checklists | `lib/content/guides.ts` |
| Shared FAQs | `lib/content/commercial.ts` |
| Media + provenance | `lib/media.ts`, `docs/07_IMAGE_ASSET_MANIFEST.json` |
| Business identity + toggles | `lib/config.ts` |

Adding or removing a service is **one entry in `lib/plan.ts` plus one price in
`docs/06`**. No component may hardcode a service or a price.

## Draft content

Much of the current service inventory and copy is first-draft development
content created so the design could be evaluated. Draft plan items carry
`draft: true` and render a visible `Draft` badge. Pricing remains
`development_only`, and `lib/pricing.ts` throws if a production build is
attempted before it is approved.

A separate offer/pricing sprint replaces the draft inventory with the real one.

## Global commercial page rhythm

1. Recognition / hero
2. Relevance
3. Differentiation
4. Offer architecture
5. Price / decision support
6. Risk reduction / process / FAQ
7. Action

Authentic proof can be inserted between 4 and 5 when available. The page must
remain complete without fake proof.

## Knowledge-layer page shape

Rendered by `components/sections/PlanningGuidePage.tsx`:

hero → intro + reading time + contents nav → 7–8 numbered chapters
(prose, cards, checklists, contextual plan items) → related focused guides →
FAQ → CTA → link back to the matching homepage anchor.

Guides are print-friendly via a `@media print` block in `app/redesign.css`
(chrome hidden, black on white, checklist items kept whole). There is
deliberately no PDF pipeline.

## Check Availability

Step 1: event type, date, venue/city
Step 2: services, guest count, optional budget/context
Step 3: name, email, phone, preferred contact method, optional note

Plan selections carry in via `?interest=<planItemId>` and remain editable. No
technical-production interrogation before basic lead capture.
