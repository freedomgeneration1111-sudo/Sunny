# Repository Working Agreement

## Project and commands

- This is a Next.js 15 App Router site using React 19, TypeScript, Tailwind CSS 4, and a static export.
- Use Node.js 20 or newer; the repository is currently tested with Node.js 22.
- Install dependencies with `npm install` (use `npm ci` in CI).
- Run local development with `npm run dev`.
- Run the required gates with `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`.
- `npm run build` writes the deployable static site to `out/`; do not use `next start` as the deployment runtime.

## Cloudflare deployment

- The checked-in `wrangler.jsonc` is the deployment configuration source of truth.
- The current target is Cloudflare Workers Static Assets: Wrangler serves the generated `out/` directory with no Worker script.
- Keep `output: "export"`, `trailingSlash: true`, and unoptimized Next images unless the hosting architecture is deliberately changed and all routes are retested.
- Use the official repo-local Cloudflare skills in `.agents/skills/` for Cloudflare work. Consult current official Cloudflare documentation and the installed Wrangler schema rather than relying on memory.
- Do not deploy, change Cloudflare resources, or modify production settings without explicit user authorization.

## Brand SVGs

- Run `npm run check:svg` after touching anything in `public/brand/` or `LOGOS/`. It is also the first step of `npm test`.
- The check compares each file's declared `viewBox` against its real `getBBox()` extent and fails on clipping, on any element outside the stated bounds, and on a `<line>` crossing a text path (the strike-through case). Both bugs it guards were invisible in source review and only appeared on screen.
- `LOGOS/FocusLab Logo Guide.png` is the approved visual authority. Check a lockup against it before assuming an element is stray — the guide shows `— PRODUCTIONS —` with symmetric dashes on *both* sides in the primary and stacked versions, and a vertical divider in the horizontal version.

## Public architecture

- **The homepage is the complete customer journey**; the supporting routes are a knowledge layer. See `docs/02_ARCHITECTURE_AND_CONTENT_HIERARCHY.md` and the decision record in `docs/12_ONE_ANCHOR_DECISION.md`.
- The homepage anchor order is a structural contract asserted by `tests/redesign-baseline.spec.ts`. The four `#paths` cards scroll to sections; they must never navigate to another route.
- `docs/reference/Focuslab-One-Anchor-Wireframe.html` is the structural UX reference only — not a visual, copy, or pricing authority.

## Sources of truth

- `lib/plan.ts` is the **only** place a service is defined. Adding or removing one is a single entry there plus a price in `docs/06_DEV_PRICING_DATA.json`. No component may hardcode a service or a price.
- `lib/config.ts` is the source of truth for business name, contact details, service area, social links, and the development-label toggle. Do not duplicate these values in components.
- `lib/content/*.ts` is the source of truth for page copy. `eventSections.ts` drives the homepage, `planningGuides.ts` the knowledge layer, `guides.ts` the focused checklists.
- Draft business content invented for layout review carries `draft: true` and renders a visible `Draft` badge. Never quietly promote draft content to verified truth.
- `lib/media.ts` is the source of truth for media metadata, intended use, alt text, aspect ratio, and replacement status.
- `public/images/` contains runtime image assets. `LOGOS/` is source/legacy collateral and is not served by the site unless deliberately moved into the runtime asset system.
- `next.config.ts` and `wrangler.jsonc` are authoritative for build and deployment behavior. Keep README deployment instructions consistent with them.
- Prefer official framework and platform documentation for technical decisions. Record material architecture changes in repository documentation.

## Product truth and media safety

- Indexing is stage-based, not blanket. Review builds (`NEXT_PUBLIC_PUBLICATION_STAGE=review`) apply global `noindex, nofollow`, and the staging facade also sends `X-Robots-Tag`. Production-capable commercial routes must NOT carry a permanent route-level robots block. Unpublished or private surfaces — `/work`, `/chat-preview`, `/conversation` — stay explicitly noindexed.
- Every indexable route declares a self-referencing `alternates.canonical`. Do not create a second route that renders the same page; use `public/_redirects` if a path must be preserved.
- Never present proxy or AI imagery as real company work. Media in `lib/media.ts` must carry an accurate truth class: `ai-brand`, `authentic-approved`, `authentic-pending`, or `development-placeholder`.
- Do not disable development labels while proxy assets, missing assets, or unverified claims remain.
- Do not fabricate experience, awards, testimonials, client names, event counts, response times, pricing, cultural expertise, or other business claims.
- Do not create public individual team-member marketing, names, biographies, portraits, or experience claims without explicit, verified source material and approval. Keep the team treatment role-based or marked as pending until then.

## UI architecture, accessibility, and responsive behavior

- Reuse or extend shared components instead of duplicating hero, CTA, gallery, card, form-control, or page-section structures across routes.
- Keep content/data separate from presentation. Avoid hardcoding business data or page copy in reusable components.
- Preserve semantic landmarks, heading order, keyboard access, visible focus, meaningful labels, useful alternative text, and reduced-motion behavior.
- Interactive controls must work by keyboard and touch. Do not rely on hover alone. Maintain adequate target sizes and color contrast.
- Design mobile-first and verify both mobile and desktop layouts. Prevent horizontal overflow, fixed-control obstruction, layout shifts, and unusable line lengths.
- When changing responsive behavior, test at least a representative phone viewport and a representative desktop viewport.

## Quality gates

- Before handoff, run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`.
- Add or update focused tests for changed behavior. Keep the Playwright smoke suite fast and deterministic.
- A production build must continue to export every public route into `out/` with working trailing-slash navigation.
- Do not bypass failures with broad ignores, disabled rules, skipped tests, or `ignoreDuringBuilds` settings. Use narrow framework-supported configuration only when generated files require it, and document why.

## Git and file safety

- Preserve user changes and unrelated untracked files. Inspect before editing and never overwrite work you did not create.
- Do not run destructive Git commands such as `git reset --hard`, force checkout, clean, rebase, or force-push without explicit authorization.
- Do not commit, tag, push, deploy, or open a pull request unless explicitly requested.
- Keep the `sonnet-prototype-v1` tag intact as the pre-redesign checkpoint.
- Do not modify, replace, reinstall, or delete `.agents/skills/` or `skills-lock.json` unless explicitly requested.
