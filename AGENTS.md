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

## Sources of truth

- `lib/config.ts` is the source of truth for business name, contact details, service area, social links, and the development-label toggle. Do not duplicate these values in components.
- `lib/content/*.ts` is the source of truth for page copy.
- `lib/media.ts` is the source of truth for media metadata, intended use, alt text, aspect ratio, and replacement status.
- `public/images/` contains runtime image assets. `LOGOS/` is source/legacy collateral and is not served by the site unless deliberately moved into the runtime asset system.
- `next.config.ts` and `wrangler.jsonc` are authoritative for build and deployment behavior. Keep README deployment instructions consistent with them.
- Prefer official framework and platform documentation for technical decisions. Record material architecture changes in repository documentation.

## Product truth and media safety

- The site is a prototype. Preserve `noindex, nofollow` until the business identity, claims, contact routes, imagery, and launch approval are verified.
- Never present proxy imagery as real company work. New or replacement media must have an accurate `proxy`, `needed`, or `real` status in `lib/media.ts`.
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
