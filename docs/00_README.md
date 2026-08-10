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
