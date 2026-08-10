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
