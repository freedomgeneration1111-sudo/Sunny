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
