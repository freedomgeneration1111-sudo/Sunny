# Hero / header logo lockup overlap — read-only audit

**Date:** 2026-08-28
**Branch:** `feat/check-availability-google-calendar`
**Status:** STEP 1 (audit) complete. No code changed. Awaiting review before any fix.
**Scope:** homepage (`/`) header logo lockup + hero heading block spacing only.

---

## 1. Symptoms reported

1. **"DFW" tag text sits on top of the camera‑lens icon.** The orange
   `DFW WEDDINGS + EVENTS` eyebrow overlaps the logo mark (the camera/shutter
   graphic) instead of clearing it — low contrast, reads as visual noise.
2. **Tagline block crowds the hero heading.** The lockup's `— PRODUCTIONS —`
   line and its warm underline streak sit only a few pixels above
   `One event. One crew. Zero handoffs.`, so the nav lockup and hero copy read
   as one crowded stack instead of two layers.

Both reproduced. **Both are the same root cause.**

---

## 2. Components / files involved

| Concern | File |
|---|---|
| Header bar, logo lockup wrapper, expanded/compact state | `components/layout/Header.tsx` (lines 110‑141) |
| Decorative flare wrapper injected only over the hero | `components/brand/HeroLogoFlare.tsx` |
| The logo `<Image>` itself | `components/brand/BrandLogo.tsx` |
| Flare geometry (burst + underline streak) | `app/redesign.css` (`.hero-flare*`, lines 16‑121) |
| Hero heading block, eyebrow, top/bottom padding | `components/sections/HomeHero.tsx` (lines 29‑53) |
| Logo art (expanded lockup, viewBox `0 0 1400 470`) | `public/brand/focus-lab-expanded-dark.svg` |
| Logo art (compact lockup, mobile, viewBox `0 20 1250 350`) | `public/brand/focus-lab-compact-dark.svg` |

There is **no literal "DFW" string in any logo SVG** — the SVGs contain only the
mark, `Focus Lab`, and `PRODUCTIONS`. The "DFW" the user sees over the lens is
the hero eyebrow `<p>DFW Weddings + Events</p>` (`HomeHero.tsx:34`), rendered
uppercase, colliding with the mark from behind because the lockup is oversized
and overflowing downward into the hero copy.

---

## 3. Root cause

### 3a. The logo image is not height‑constrained in the hero ("expanded") state

`Header.tsx` sizes the logo by **height only** so the expanded→compact resize can
animate. The desktop slot is a `<span>` with a definite height:

```
<span class="hidden md:block … h-[121px] lg:h-[129px] xl:h-[138px]">
  <HeroLogoFlare lockup="expanded">        {/* only in hero/expanded state */}
    <BrandLogo mode="expanded" fit="height" />   {/* <Image class="h-full w-auto"> */}
  </HeroLogoFlare>
</span>
```

`BrandLogo` with `fit="height"` renders `<Image className="h-full w-auto">`
(`BrandLogo.tsx:56`). `h-full` = `height: 100%`, which only works if the parent
has a **definite** height.

`HeroLogoFlare` inserts an intermediate wrapper between the fixed‑height slot and
the image:

```jsx
<span className="relative block">   {/* HeroLogoFlare.tsx:48 — no height */}
  {children}
  <span className="hero-flare">…</span>
</span>
```

That `span.relative.block` has **no height**. So the chain is:

```
span  h-[138px]  (definite)
└─ span.relative.block   (HeroLogoFlare — INDEFINITE height)
   └─ img  h-full  →  height:100% of indefinite  →  resolves to "auto"
```

With `height` effectively `auto` and `w-auto`, the only thing bounding the image
is Tailwind Preflight's `img { max-width: 100% }`. The image therefore fills the
wrapper's **width** (~693px at 1366w) and takes its natural aspect ratio
(1400 / 470 ≈ 2.98) for height → **~233px tall inside a 138px slot**, a ~95px
overflow. The wrapper is `overflow: visible`, so the bottom of the lockup art —
`— PRODUCTIONS —` and the flare streak — paints ~90px below the header and down
onto the hero.

Measured (`getBoundingClientRect`, CSS px):

| Viewport | Logo `<img>` box | Intended slot | Overflow |
|---|---|---|---|
| 1366 × 768 | top 1 → **bottom 234** (233 tall, 693 wide) | 138 tall | **+95 px** |
| 1440 × 768 | top 1 → **bottom 259** (257 tall, 767 wide) | 138 tall | **+119 px** |
| 390 × 844 (compact lockup) | 80 tall in a 53px slot | 53 tall | +27 px |

The flare (`.hero-flare { inset: 0 }` of that same wrapper) is positioned in
percentages of the wrapper box, so the underline streak (`top: 84%`) is also
dragged down to ~196px — right onto the eyebrow. Fixing the image height fixes
the flare placement for free.

**Why only the hero state is affected:** the compact/scrolled header and every
non‑home route render `<BrandLogo>` *directly* inside the fixed‑height span with
**no `HeroLogoFlare` wrapper**, so `h-full` resolves against a definite height
and the logo is sized correctly. The bug is isolated to the one code path where
`HeroLogoFlare`'s height‑less wrapper is in the chain.

### 3b. The eyebrow→heading gap is intrinsically tight, and short viewports remove the safety margin

- `HomeHero.tsx:37` — the `<h1>` has `mt-5` (20px). That is the *entire* gap
  between the eyebrow's baseline area and a display heading set at
  `clamp(3.35rem, 7vw, 6.9rem)` with `leading-[.88]`. Measured gap
  eyebrow‑bottom → h1‑top is **20px at every breakpoint** — too tight for type
  this large even before any overlap.
- `HomeHero.tsx:31` — the hero content container is
  `min-h-[100svh] … items-end` with large asymmetric padding
  (`pt-32 sm:pt-40 md:pt-44 xl:pt-48` ≈ 128–192px top). On a tall viewport the
  content sits low and clears the oversized lockup. On a **short desktop
  viewport (≤ ~800px tall — i.e. the most common laptop, 1366×768)** the content
  block is taller than the space between the padding boxes, so it pins to the top
  and rides up **under the fixed header, into the lockup's overflow zone.**

Combined effect, measured:

| Viewport | header bottom | eyebrow top | h1 top | logo `<img>` bottom | eyebrow top − logo bottom |
|---|---|---|---|---|---|
| 1366 × 900 | 141 | 348 | 384 | 234 | +114 (clear) |
| 1366 × 768 | 141 | 216 | 252 | 234 | **−18 (overlap)** |
| 1366 × 720 | 141 | 192 | 228 | 234 | **−42 (overlap; logo bottom is 6px past the h1 top)** |
| 1440 × 768 | 141 | 202 | 238 | 259 | **−57 (overlap; "DFW" sits over the lens mark; logo bottom 21px into the h1)** |
| 768 × 1024 | 129 | 598 | 634 | 159 | +439 (clear — tablet unaffected) |
| 390 × 844 | 105 | 375 | 411 | 106 | +269 (clear — mobile unaffected) |

---

## 4. Breakpoint verdict

| Width | Height | Reproduces? | Notes |
|---|---|---|---|
| 1366 | 900 | No | Content sits low enough to clear the oversized lockup. |
| **1366** | **768** | **Yes** | Streak/`PRODUCTIONS` overlap the eyebrow; h1 crowded. Classic laptop res. |
| **1366** | **720** | **Yes** | Worse — lockup art reaches the h1. |
| **1440** | **768** | **Yes** | Worst — orange "DFW" eyebrow renders directly over the lens mark. |
| 768 | any | No | Hero content is ~440px below the lockup. |
| 390 | any | No | Hero content is ~270px below the lockup. Logo still oversized in the DOM (80px in a 53px slot) but nothing collides with it. |

**It is not "desktop vs mobile" — it is viewport *height*.** The bug appears at
desktop widths whenever the usable viewport height is roughly ≤ 800px, which is
the single most common laptop configuration. Tablet and phone widths are clear
because the hero heading falls far below the header there.

---

## 5. Screenshots (in this folder)

Before — requested breakpoints (tall viewport, bug not visible):
- `2026-08-28-before-1366w-h900-viewport.png` + `…-1366w-lockup-crop.png`
- `2026-08-28-before-768w-viewport.png` + `…-768w-lockup-crop.png`
- `2026-08-28-before-390w-viewport.png` + `…-390w-lockup-crop.png`

Before — short viewport, bug visible:
- `2026-08-28-before-1366w-h768-overlap.png` — streak + `PRODUCTIONS` touch the eyebrow, h1 crowded.
- `2026-08-28-before-1366w-h720-overlap.png` — lockup art reaches the heading.
- `2026-08-28-before-1440w-h768-overlap.png` — orange "DFW" eyebrow sits on the lens mark.

Live production (`focuslabproductions.com`) was also checked at 1366/768/390 and
runs the same component code and the same `mt-5` / `items-end` hero — the 1366×768
case shows the same crowding there.

---

## 6. Proposed fix direction (NOT yet applied — for review)

1. **Constrain the logo image height in the hero state.** Give `HeroLogoFlare`'s
   wrapper `<span>` a definite height so the child `img h-full` has something to
   resolve against — e.g. render it as `className="relative block h-full"` (and
   make sure the slot `<span>` in `Header.tsx` establishes the height, which it
   already does). This alone removes the ~95px overflow *and* re‑anchors the
   flare streak. No change to the SVG, the mark, or the compact/scrolled path.
2. **Open the eyebrow→heading gap** on `HomeHero.tsx` — bump the `<h1>` `mt-5`
   to ~`mt-7`/`mt-8` (28–32px) so the two layers read as distinct, per the
   spacing scale.
3. **Give the hero content top‑padding breathing room on short viewports** so the
   copy can't ride up under the header even if a future lockup change regresses —
   e.g. ensure `pt-*` at the `lg`/`xl` step accounts for the expanded header
   height (~140px) plus a gap, or cap how far `items-end` can pull the block up.

Confirm nav‑link wrapping (the `Asian Weddings` item already wraps to two lines
at 1366–1440 — pre‑existing, out of scope here but note it) and button layout at
every breakpoint after the fix. Re‑screenshot at 1366/768/390 **and** at
1366×768 / 1440×768, append before/after here.

---

## 7. Fix applied — STEP 2 (2026-08-28)

Two changes, both minimal and confined to the expanded‑hero path:

### `components/brand/HeroLogoFlare.tsx` (line 48)

```diff
- <span className="relative block">
+ <span className="relative block h-full w-fit">
```

`h-full` makes this wrapper re‑export the height of the header's logo slot — the
`<span class="… h-[121px] lg:h-[129px] xl:h-[138px]">` in `Header.tsx`. **No
magic number**: it inherits whatever that slot class resolves to, so the two stay
in sync if the slot height ever changes. This restores the percentage chain for
*both* consumers:

- the child `<img class="h-full">` (`BrandLogo`) now resolves `height: 100%`
  against a definite height → renders at the intended slot height (138px at `xl`,
  not 233px), width following the 2.98 aspect ratio (~411px);
- `.hero-flare { inset: 0 }` now covers a correctly‑sized box, so the burst and
  the underline streak land where `PLACEMENT` intends (streak `top: 84%` of
  ~138px, i.e. just under `— PRODUCTIONS —`, not 196px down on the eyebrow).

`w-fit` shrink‑wraps the wrapper to the now‑sized artwork so the flare's
horizontal placement percentages stay anchored to the logo rather than to the
full width the block would otherwise take in the nav row — this matches how the
compact/scrolled path already behaves (image sizes the slot, nothing stretches).

The compact/scrolled header and all non‑home routes render `<BrandLogo>` directly
(no `HeroLogoFlare`), so they are untouched.

### `components/sections/HomeHero.tsx` (line 37)

```diff
- <h1 … className="mt-5 max-w-[10ch] font-display …">
+ <h1 … className="mt-8 max-w-[10ch] font-display …">
```

Eyebrow → heading gap goes from 20px to 32px — a defensive buffer for the
`clamp(3.35rem, 7vw, 6.9rem)` heading, applied regardless of the primary fix.
`min-h-[100svh]` / `items-end` / the `pt-*` scale on line 31 were left as‑is.

### Verification (dev server on :3000, Playwright, deviceScaleFactor 2)

Logo `<img>` box and clearance to the hero copy, before → after:

| Viewport | logo img h (before → after) | eyebrow top − logo bottom (before → after) | eyebrow → h1 gap |
|---|---|---|---|
| 1366 × 768 | 233 → **138** | −18 → **+65** | 20 → **32** |
| 1366 × 720 | 233 → **138** | −42 → **+53** | 20 → **32** |
| 1440 × 768 | 257 → **138** | −57 → **+53** | 20 → **32** |
| 1366 × 900 | 233 → **138** | +114 → **+197** | 20 → **32** |
| 768 × 1024 | 156 → **121** | clear → **clear** | 20 → **32** |
| 390 × 844 | 80 → **53** (fits 53px slot) | clear → **clear** | 20 → **32** |

Visual confirmation on the after‑screenshots:

- **(a) "DFW" no longer touches the lens mark** — at 1440×768 (the worst prior
  case) the orange eyebrow now sits ~53px below the logo art, fully on the dark
  panel.
- **(b) The underline streak no longer overlaps "One event."** — it sits directly
  beneath `— PRODUCTIONS —`, inside the header zone; the heading starts well clear.
- **(c) Flare position looks right, not just non‑overlapping** — burst off the
  mark's upper‑right, streak centred under the wordmark, both scaled to the logo.
- No regression at the previously‑clean 1366×900 / 768 / 390. Logo is now the
  intended size at *every* viewport (it was oversized everywhere before, merely
  hidden by low content on tall screens).
- Side effect, positive: with the logo at its intended width the `Asian Weddings`
  nav item no longer wraps to two lines at 1366–1440. Buttons unchanged.

Checks: `npm run typecheck` ✅ `npm run lint` ✅
`playwright test tests/header-hero.spec.ts` — the 3 header‑state tests (expanded↔
compact transition, mobile nav, reduced‑motion) pass. One unrelated test
(`desktop hero slows V002 … rotates…`) fails on `scale(1.08)` vs `scale(1.11)`;
that is a pre‑existing mismatch between uncommitted WIP in `lib/media.ts` /
`components/media/*` and the (also‑modified) spec file — nothing to do with this
change, which touches neither.

**Before screenshots:** `2026-08-28-before-*` (see §5).
**After screenshots:** `2026-08-28-after-1366w-h768.png`, `…-1366w-h720.png`,
`…-1440w-h768.png`, `…-1366w-h900.png`, `…-768w.png`, `…-390w.png`.
