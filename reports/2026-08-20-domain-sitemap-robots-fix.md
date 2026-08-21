# Domain / Sitemap / Robots.txt Fix — 2026-08-20

Repo: `Sunny-ops`. Commit: `58f9a9a` on branch `feat/check-availability-google-calendar` (not yet pushed). Deployed live to `focuslabproductions.com` (Worker `focus-lab-public-staging`).

## 1. Every occurrence of "gofocuslab" found in the repo

Case-insensitive search across the whole repo (excluding `node_modules`, `.next`, `out`):

| File | Line | Context | In scope of this fix? |
|---|---|---|---|
| `app/layout.tsx` | 16 | `metadataBase: new URL("https://gofocuslab.com")` | **Yes — fixed** |
| `docs/staff-authentication.md` | 8, 63, 75-78, 85, 91 | Describes a *future, unimplemented* `staff.gofocuslab.com` / `api.gofocuslab.com` Cloudflare Access topology | No — see below |
| `docs/operations-foundation.md` | 224 | One sentence referencing the same future `staff.gofocuslab.com` topology | No — see below |

**Only one live code occurrence.** The two docs files describe a staff-subdomain Access architecture that was explicitly never built (`docs/operations-foundation.md:224`: *"No Access application, domain, or production resource was created"*). They're planning documents, not config that generates output — changing the placeholder subdomain name there wasn't part of this task's scope (canonical URL / sitemap / robots.txt) and touching them isn't required for any of the three reported bugs. Flagging for your call: worth a follow-up doc edit whenever that Access work actually happens, since `gofocuslab.com` was never registered/live to begin with.

## 2. Shape of the domain problem

**Best case — a single source.** `metadataBase` in `app/layout.tsx` was the *only* place an absolute URL was hardcoded. Every page's `alternates.canonical` (checked all 15 route files) sets a **relative** path like `/about/` — Next.js resolves those against `metadataBase` automatically, and there's no separate `openGraph`/`twitter`/JSON-LD block anywhere hardcoding a second URL. So one fix propagates everywhere. No maintainability risk found on this axis.

## 3. Domain fix

- Added `siteUrl: "https://focuslabproductions.com"` to `lib/config.ts` — the same file that already held `businessName`, `shortStatement`, etc. (existing single-source-of-config pattern).
- `app/layout.tsx`: `metadataBase: new URL(config.siteUrl)`.
- `app/sitemap.ts` and `app/robots.ts` (new, see below) both import `config.siteUrl` too, so there's now exactly one string to ever change again.

## 4. Sitemap

No `app/sitemap.ts` existed before this — confirmed via search, so it was "missing entirely," not "built but not exported." Created `app/sitemap.ts` as a Next.js metadata route:

- Lists all 13 indexable static routes + all 6 guide slugs (pulled from `lib/content/guides.ts`, so new guides are picked up automatically).
- Deliberately **excludes** `/work`, `/chat-preview`, `/conversation` — each already carries `robots:{index:false,follow:false}` in its own `metadata` export, so they're not real public routes.
- Needed `export const dynamic = "force-static"` to satisfy `output:"export"` (Next.js requires this explicitly for metadata-route generators in static export mode — the first build attempt failed without it; see below).

`app/robots.ts` (also new) generates `robots.txt` with `Allow: /` and a `Sitemap:` line pointing at `config.siteUrl + /sitemap.xml`.

## 5. HEAD/GET robots.txt bug — root cause was NOT the Worker

Before the fix, there was **no `public/robots.txt` and no `app/robots.ts`** in the repo at all — confirmed by search. Yet `GET /robots.txt` on the live domain returned `200` with an unrelated "AI content-signals" policy document (Cloudflare's own zone-level default robots.txt / AI Crawl Control feature), while `HEAD /robots.txt` correctly 404'd.

Diagnostic proof this wasn't a Worker asset-serving bug:
- `operations/src/public-site.ts` has no robots.txt-specific code — every non-API path goes straight to `env.ASSETS.fetch(request)` uniformly.
- Tested `HEAD` vs `GET` on `favicon.svg` and `/` (homepage) — **both matched (200/200)** on the live site before any fix. So Workers Static Assets handles HEAD correctly for real files.
- The old `GET /robots.txt` response was missing the `X-Robots-Tag` header our Worker adds to every response it actually handles (`public-site.ts:13`); the old `HEAD /robots.txt` response *had* that header. That means `GET` was being intercepted and answered by Cloudflare **before it ever reached our Worker**, while `HEAD` correctly reached the Worker → `ASSETS.fetch` → genuine 404 (because the file genuinely didn't exist).

**Fix**: shipping a real `robots.txt` (via `app/robots.ts`) gives the origin a real file, so both GET and HEAD now hit our own Worker/assets and match. Confirmed live post-deploy — see verification below. (Cloudflare's synthetic content-signals response yields to an origin-provided robots.txt, as hoped.)

No other static route showed the GET/HEAD mismatch (spot-checked `/pricing/` post-fix too) — this was specific to the one path with no origin file.

## 6. Build freshness — real, pre-existing risk, treated as blocking for this deploy

Checked `package.json` directly:

```
"public:staging:build": "NEXT_PUBLIC_PUBLICATION_STAGE=review next build",
"public:staging:deploy": "wrangler deploy --config wrangler.staging.jsonc",
```

**These are two independent scripts. `public:staging:deploy` does not build first** — no `pre`-hook, no chaining, confirmed by reading the file (not assumed). There's also no CI workflow in `.github/` — everything here is run manually, locally. This means it's entirely possible to run `deploy` alone and ship whatever `./out` happens to contain from an earlier, possibly-stale build.

This is exactly the domain that matters here — `focuslabproductions.com` (the real live domain, confirmed via Cloudflare's Workers custom-domains API) is served directly by `focus-lab-public-staging`, i.e., "staging" is the live site right now, not a safe sandbox.

**Handled for this deploy**: I ran `npm run public:staging:build` myself before deploying, and confirmed via `grep -rIl "gofocuslab" out/` (0 matches) and by inspecting `out/sitemap.xml`, `out/robots.txt`, and canonical tags in `out/*/index.html` directly, that the shipped build actually contains today's fix — not inferred, checked.

**Not fixed, flagged as a follow-up**: nothing prevents this from happening again on the next deploy. Recommend either chaining a `predeploy`/`prepublic:staging:deploy` npm script, or folding build into the deploy script itself, so a bare `deploy` can never ship stale output.

## 7. Live verification (fetched directly, not assumed)

```
$ curl -s https://focuslabproductions.com/ | grep -o 'rel="canonical"[^>]*'
rel="canonical" href="https://focuslabproductions.com/"/

$ curl -s -o /dev/null -w "%{http_code}\n" https://focuslabproductions.com/sitemap.xml
200

$ curl -s https://focuslabproductions.com/robots.txt
User-Agent: *
Allow: /

Sitemap: https://focuslabproductions.com/sitemap.xml

$ curl -s -I -o /dev/null -w "%{http_code}\n" https://focuslabproductions.com/robots.txt
200

$ curl -s -o /dev/null -w "%{http_code}\n" https://focuslabproductions.com/robots.txt
200
```

`sitemap.xml` content (fetched live):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>https://focuslabproductions.com/</loc></url>
<url><loc>https://focuslabproductions.com/about/</loc></url>
<url><loc>https://focuslabproductions.com/asian-weddings/</loc></url>
<url><loc>https://focuslabproductions.com/check-availability/</loc></url>
<url><loc>https://focuslabproductions.com/events/corporate/</loc></url>
<url><loc>https://focuslabproductions.com/events/parties/</loc></url>
<url><loc>https://focuslabproductions.com/guides/</loc></url>
<url><loc>https://focuslabproductions.com/pricing/</loc></url>
<url><loc>https://focuslabproductions.com/privacy/</loc></url>
<url><loc>https://focuslabproductions.com/services/entertainment-production/</loc></url>
<url><loc>https://focuslabproductions.com/services/photo-video/</loc></url>
<url><loc>https://focuslabproductions.com/terms/</loc></url>
<url><loc>https://focuslabproductions.com/weddings/</loc></url>
<url><loc>https://focuslabproductions.com/guides/wedding-day-coordination-checklist/</loc></url>
<url><loc>https://focuslabproductions.com/guides/asian-wedding-week-timeline/</loc></url>
<url><loc>https://focuslabproductions.com/guides/mehndi-baraat-valima-venue-checklist/</loc></url>
<url><loc>https://focuslabproductions.com/guides/corporate-av-checklist/</loc></url>
<url><loc>https://focuslabproductions.com/guides/photo-video-coverage-map/</loc></url>
<url><loc>https://focuslabproductions.com/guides/enhancements-venue-approval/</loc></url>
</urlset>
```

Also spot-checked `/pricing/` GET/HEAD (200/200) to confirm the robots.txt fix didn't paper over anything and other routes were never actually broken.

## What's not done

- Not pushed to `origin` yet (commit `58f9a9a` is local only).
- Docs mentioning `gofocuslab.com` for a *hypothetical* future staff/API subdomain topology left untouched — see §1.
- Deploy-freshness gap (§6) — the actual npm script wiring — left as a flagged follow-up, not fixed, since it wasn't one of the three reported bugs and touches the deploy pipeline rather than the site itself.
