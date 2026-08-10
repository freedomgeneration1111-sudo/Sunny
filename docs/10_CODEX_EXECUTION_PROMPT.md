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
