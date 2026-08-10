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
