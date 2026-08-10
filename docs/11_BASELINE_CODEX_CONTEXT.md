# 11 — Codex Phase-0 Technical Baseline

This file records the Phase-0 implementation baseline supplied by Codex. Treat these as existing repo facts to preserve while carrying out the visual redesign. They are not invitations to redo baseline engineering.

## Phase-0 status

Phase 0 completed without redesign, appearance, copy, routing, branding, or business-strategy changes. No commit was created at that point.

## Repo-local skills verified

The untracked `.agents/` directory contains six readable repo-local skills registered by `skills-lock.json`:

- Cloudflare platform
- Cloudflare web performance
- Cloudflare Workers best practices
- Wrangler CLI
- Vercel React best practices
- Web design guidelines

The Cloudflare-authored skills are relevant to Cloudflare/performance implementation work. Neither `.agents/` nor `skills-lock.json` was modified, replaced, or reinstalled during Phase 0. Preserve that constraint unless explicitly instructed otherwise.

## Deployment target verified

The checked-in deployment target is **Cloudflare Workers Static Assets**. `wrangler.jsonc` points `assets.directory` at `out/` and has no Worker entry point.

The README still describes Cloudflare Pages. That wording is stale relative to the checked-in Wrangler configuration and remains documentation technical debt. Do not migrate deployment merely to make the README true; update documentation when appropriate.

Wrangler version observed in Phase 0: `4.120.0`.

## Phase-0 files changed

The following baseline changes already exist and should not be casually reverted during design implementation:

### `AGENTS.md`

Contains rules for:

- framework and build commands;
- Workers Static Assets deployment target;
- source-of-truth rules;
- accessibility and responsive requirements;
- media/proxy and business-truth rules;
- team-member marketing restriction;
- component-reuse requirement;
- required quality gates;
- Git and installed-skill safety rules.

### `.gitignore`

Ignores Playwright results/report output and TypeScript incremental metadata.

### `eslint.config.mjs`

Narrowly ignores generated `next-env.d.ts`.

Reason: Next.js generates and rewrites `next-env.d.ts`; the TypeScript ESLint preset rejects the generated triple-slash reference. Editing the generated file is not durable, and globally disabling the rule would hide legitimate application errors. Preserve the narrow generated-file exclusion unless framework behavior changes.

### `package.json` / `package-lock.json`

- adds `npm test`;
- adds `@playwright/test` 1.62.1;
- lockfile records the matching test-runner dependency.

### `playwright.config.ts`

Provides:

- Desktop Chrome and Pixel 5 projects;
- development web server;
- serialized execution for reliability;
- optional system-Chromium override for constrained environments.

### `tests/smoke.spec.ts`

Provides the minimal baseline smoke suite.

## Tests established

Four tests run under both desktop and mobile projects, producing eight cases:

1. important public routes return successfully and render the page shell;
2. homepage loads and exposes its primary heading;
3. rendered internal navigation links return successful responses;
4. Check Availability renders and advances from step one to step two;
5. desktop Chrome and Pixel 5 viewport coverage is included;
6. basic horizontal-overflow smoke assertion is included.

Phase-0 result: **8 passed**.

## Commands verified in Phase 0

- `npm run typecheck` — passed
- `npm run lint` — passed
- Playwright smoke tests — 8 passed
- `npm run build` — passed
  - compiled successfully
  - generated 11 static pages
  - exported expected routes to `out/`
- `npx wrangler --version` — `4.120.0`

The local test run used:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/snap/bin/chromium npm test
```

The baseline machine did not have Playwright's managed Chromium binary. Its download failed because of filesystem pressure, so the configuration supports an optional existing-browser override while retaining normal managed-browser behavior for CI.

## Known baseline issues that are NOT redesign scope by default

### Disk pressure

The baseline machine was effectively full, with only about 160 MB available. This blocked download of Playwright's approximately 184 MB Chromium package. Temporary unsuccessful-download/test artifacts were removed.

### Dependency audit

`npm audit` reported three high-severity findings through the existing dependency tree involving:

- Next.js;
- bundled PostCSS;
- Sharp/libvips.

The automatic npm resolution proposed Next.js 16.3.0, which is a major migration. Phase 0 deliberately did **not** perform that unrelated upgrade. Do not turn this visual redesign into an unapproved framework migration. If security remediation becomes separately authorized, handle it as its own scoped task.

### README deployment wording

README says Cloudflare Pages while `wrangler.jsonc` configures Workers Static Assets. Treat Wrangler as deployment source of truth.

### Development-only Next warning

Playwright produced a development-only warning about `127.0.0.1` requests to Next development assets. It did not affect the static production export.

## Redesign preservation rule

The redesign may refactor visual/component code substantially, but the implementation should finish with the established baseline still green or with any deliberate changes explicitly explained. At minimum rerun:

- typecheck;
- lint;
- desktop/mobile smoke tests;
- production build/static export.

Do not modify `.agents/` or `skills-lock.json` as part of ordinary redesign work.
