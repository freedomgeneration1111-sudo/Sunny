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
