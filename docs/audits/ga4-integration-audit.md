# GA4 Integration Audit — G-9T3S01EDXH

Date: 2026-09-07
Branch: feat/check-availability-google-calendar

## 1. Router / root layout

- Single root layout: `app/layout.tsx` (App Router). Confirmed via `find app -iname "layout*"` — it is the only `layout.tsx` in the tree.
- `app/` top-level structure has no route groups (`(group)`) or parallel routes (`@slot`) — just plain route directories (`services`, `about`, `asian-weddings`, `work`, `weddings`, `terms`, `pricing`, `chat-preview`, `conversation`, `privacy`, `guides`, `check-availability`, `events`, plus nested `services/entertainment-production`, `services/photo-video`, `guides/[slug]`, `events/corporate`, `events/parties`).
- **Conclusion: every route inherits from `app/layout.tsx`.** No additional root layouts to worry about.

## 2. Next.js version / @next/third-parties

- `package.json`: `"next": "^15.5.23"` — well above the 14.3 minimum for `@next/third-parties`.
- `@next/third-parties` is **not currently a dependency** (no match in `package.json` or `package-lock.json`).
- **Important environment detail found during audit**: `next.config.ts` sets `output: "export"` (static export) with `trailingSlash: true` and `images.unoptimized: true`. The site is built to static HTML and served from Cloudflare Workers Static Assets (per `AGENTS.md` §3) — there is no Next.js server/edge runtime in production.
  - `@next/third-parties/google`'s `GoogleAnalytics` component renders client-side `next/script` tags and does not require SSR/Middleware/Image Optimization, so it is compatible with `output: "export"`.

## 3. Existing GA/gtag references

- Grepped the repo (excluding `node_modules`, `.git`, `.next`) for `gtag`, `G-[A-Z0-9]{6,}`, `GoogleAnalytics`, `googletagmanager`.
- No matches other than incidental substring hits in `package-lock.json` (dependency names like `@rolldown/binding-*`, unrelated) and CSS class names containing `bg-`/`border-` (false positives from the regex, not GA-related).
- **Conclusion: no existing GA4/gtag implementation anywhere in the codebase.**

## 4. Content-Security-Policy

- Grepped `next.config.ts`, any `middleware.ts` (none exists), any `_headers` file (none exists), both wrangler configs (`wrangler.jsonc`, `wrangler.staging.jsonc`), and the whole repo for `Content-Security-Policy`.
- **No CSP is defined anywhere in this repo.** No middleware, no `_headers` file, no CSP meta tag, no CSP set in wrangler config or the Worker script.
- **Conclusion: nothing blocks `googletagmanager.com` / `google-analytics.com`** — there's no policy to update.

## Stop-condition check

| Condition | Result |
|---|---|
| (a) More than one root layout that wouldn't inherit the tag | Not found — single root layout |
| (b) Existing GA/gtag implementation | Not found |
| (c) CSP that doesn't already allow googletagmanager.com/google-analytics.com | Not found — no CSP exists at all |

**None of the stop conditions were met. Proceeding to Step 2 (implementation).**

## Implementation

- Installed `@next/third-parties` (resolved `^16.3.4`) as a dependency in `package.json`/`package-lock.json`.
- `app/layout.tsx`: imported `GoogleAnalytics` from `@next/third-parties/google` and rendered `<GoogleAnalytics gaId="G-9T3S01EDXH" />` as a sibling after the closing `</PublicChatProvider>`, inside `<body>`, once at root layout level (no page-level files touched).
- Confirmed with a local `npm run build` that the static export (`output: "export"`) compiles cleanly with this component — `@next/third-parties` renders client-side `next/script` tags and has no dependency on Middleware/Image Optimization/SSR, so it's compatible with this repo's static-export + Cloudflare Workers Static Assets setup.
- Grepped the exported `out/` HTML: `G-9T3S01EDXH` and the `googletagmanager.com/gtag/js?id=G-9T3S01EDXH` preload tag are present in both `out/index.html` and `out/pricing/index.html`, confirming sitewide inheritance from the single root layout.

## Deployment

Per user confirmation, deployed via `npm run public:staging:deploy` (rebuilds from source, then `wrangler deploy --config wrangler.staging.jsonc`) to `focus-lab-public-staging` — the real live target bound to `focuslabproductions.com` (per AGENTS.md §3).

- Deployed Worker Version ID: `75917371-275b-4304-a9cd-c3010bf92923`
- Verification URL used: `https://focus-lab-public-staging.freedomgeneration1111.workers.dev`

## Step 3 — Verification evidence (Playwright, live deployment)

Ran a Playwright script (Chromium, `ignoreHTTPSErrors: true`, `waitUntil: 'networkidle'`) against the live deployment, checking both the homepage and an inner route (`/pricing/`).

```
=== ROUTE: / ===
HTTP status: 200
gtag.js network requests: [
  "https://www.googletagmanager.com/gtag/js?id=G-9T3S01EDXH"
]
window.dataLayer: [
  { "0": "js", "1": "2026-09-07T17:12:43.117Z", "gtm.uniqueEventId": 3 },
  { "0": "config", "1": "G-9T3S01EDXH" },
  { "event": "gtm.dom", "gtm.uniqueEventId": 12 },
  { "event": "gtm.load", "gtm.uniqueEventId": 13 }
]

=== ROUTE: /pricing/ ===
HTTP status: 200
gtag.js network requests: [
  "https://www.googletagmanager.com/gtag/js?id=G-9T3S01EDXH"
]
window.dataLayer: [
  { "0": "js", "1": "2026-09-07T17:13:03.862Z", "gtm.uniqueEventId": 3 },
  { "0": "config", "1": "G-9T3S01EDXH" },
  { "event": "gtm.dom", "gtm.uniqueEventId": 12 },
  { "event": "gtm.load", "gtm.uniqueEventId": 13 }
]
```

Both routes: (a) fired the expected `googletagmanager.com/gtag/js?id=G-9T3S01EDXH` network request, (b) populated `window.dataLayer` with a `config` entry for `G-9T3S01EDXH`, confirming the root-layout tag applies sitewide, not per-page.
