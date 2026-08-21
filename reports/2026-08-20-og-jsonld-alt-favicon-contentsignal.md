# Site Audit Fix: OG Tags, JSON-LD, Alt Text, Favicons, Content-Signal — 2026-08-20

Commit `8c82f32` on `feat/check-availability-google-calendar` (not pushed yet). Deployed live to `focuslabproductions.com`.

## Part A — Open Graph + Twitter Cards (was: missing on all 19 pages)

Added `lib/seo.ts`'s `socialMetadata(title, description, image?)` to every page's metadata export — reuses each page's existing title/description verbatim, no new copy written.

- **Image logic**: pages with their own hero photo (weddings, asian-weddings, events/corporate, events/parties, services/photo-video, services/entertainment-production) use that image as `og:image`/`twitter:image`. Everything else (home, about, pricing, privacy, terms, check-availability, guides index, all 6 guide slugs) falls back to a new sitewide default.
- **Sitewide default image**: `public/images/og-default.jpg`, a clean 1200×630 JPEG crop of the existing `weddings-hero-01.webp` photo. I deliberately did **not** use the homepage's own `media.homeHero` image (`hero-wedding-desktop-poster.webp`) — viewed it directly and it has a burned-in watermark reading "Focus Lab **Production**" (missing the "s" — inconsistent with the real business name "Focus Lab Production**s**"), plus a second burned-in caption line. Not something to put in front of every social share.
- **Live verified** on home, `/pricing/`, and a guide page — see below.

## Part B — Structured data (was: zero JSON-LD anywhere)

`lib/jsonld.ts`:
- **`localBusinessJsonLd()`** — injected once in `app/layout.tsx`, present on every page. Only fields backed by real `config.ts` data: `name`, `description`, `url`, `image` (brand mark), `areaServed`, `knowsLanguage`. **`telephone`, `email`, and `sameAs` are deliberately omitted** — `config.contact.phone`, `config.contact.email`, and `config.social.{instagram,tiktok}` are all empty strings in `config.ts` today (nothing to point to; not fabricated).
- **`serviceJsonLd()`** — added only to `/services/photo-video/` and `/services/entertainment-production/`, the two pages that are genuinely service listings. Did *not* add it to the weddings/asian-weddings/corporate/parties "planning guide" pages — that content is informational, not a service listing, so forcing `Service` schema onto it wouldn't fit.
- **Validated against `validator.schema.org`** (real HTTP validation, not eyeballed): both the `LocalBusiness` block and a `Service` block came back **0 errors, 0 warnings**.

## Part C — Image alt text (was: 64 images "missing" alt text)

Real finding: **zero images anywhere on the site are missing the `alt` attribute outright** — verified by grepping every built page's `<img>` tags for `alt=` presence. Every one of the "missing" 64 was actually `alt=""`, which some SEO audit tools (and this one, evidently) bucket together with truly-missing.

Split into two real categories:

**Genuinely decorative, left as `alt=""`** (verified, not just assumed): the `BrandLogo` component's header/footer appearances. Confirmed correct because (a) it's already marked `aria-hidden="true"`, and (b) it's always paired with real visible text — `aria-label="Focus Lab Productions home"` on the header's logo link, and the literal business name printed in the footer copyright line right next to it. A screen reader user loses nothing.

**A real bug, fixed**: three components — `PageHero`'s `fullBleed` variant, `CinematicHeroMedia`, and `MobileHeroPoster` — hardcoded `alt=""` even though the `MediaAsset`/hero-candidate objects passed into them already carried real alt text (or, in the hero-candidates' case, a `label` field). This is why big, prominent hero photos across `weddings`, `asian-weddings`, `events/corporate`, `events/parties`, `services/photo-video`, `services/entertainment-production`, and the homepage's rotating hero were all silently losing their alt text — the data existed, the wiring didn't use it.
- Fixed `PageHero.tsx` to use `media.alt` (one line) — this alone fixed all 6 `fullBleed` pages at once, since they all route through the same component.
- For the homepage's 3 rotating hero photos (desktop `CinematicHeroMedia` + mobile `MobileHeroPoster`), the existing `label` field (e.g. "Dance and guest energy") **wasn't trustworthy enough to reuse as alt text** — I viewed all 6 source images (3 desktop crops + 3 mobile crops) directly and found `label` mismatched what's actually in the photo more than once (e.g. "Dance and guest energy" was actually two girls in formal gowns twirling on a runway at a decorated stage — not a dance floor). Added a proper `alt` field to `DesktopHeroCandidate`/`MobileHeroCandidate` in `lib/media.ts` with descriptions written from what I actually saw, and wired those in instead.

## Part D — Favicon fallbacks (was: `/favicon.ico`, `/apple-touch-icon.png`, `/site.webmanifest` all 404)

Rendered from the existing `public/brand/favicon.svg` mark via `rsvg-convert` + ImageMagick:
- `favicon.ico` — multi-resolution (16×16, 32×32, 48×48)
- `apple-touch-icon.png` — 180×180
- `icon-512.png` — 512×512, referenced by the manifest (not requested explicitly, but cheap and expected by manifest validators/Lighthouse)
- `site.webmanifest` — minimal: name, icon list, theme/background color, `display: "browser"`. No service worker, no install prompts, no PWA scaffolding — this is the marketing site, not the staff ops app.

Wired into `app/layout.tsx`'s `metadata.icons`/`metadata.manifest`.

## Part E — robots.txt Content-Signal syntax bug

Was two separate non-standard lines (`search: yes` / `ai-input: yes`) that don't match the real spec and signal nothing to any crawler. Fixed to the correct single-line form:

```
Content-Signal: search=yes, ai-input=yes
```

`ai-train` still deliberately left unset, per the existing comment's reasoning (separate decision about third-party model training, not indexability) — untouched.

## Deploy verification (live, fetched — not assumed)

Deployed via `npm run public:staging:deploy` only (rebuilds from source first, per the earlier deploy-freshness fix — this was also a real-world confirmation that pipeline still works).

```
$ curl -s https://focuslabproductions.com/ | grep -o '<meta property="og:[^>]*>\|<meta name="twitter:[^>]*>'
<meta property="og:title" content="Focus Lab Productions — DFW Weddings &amp; Events"/>
<meta property="og:description" content="Photo, video, DJ/MC, sound, lighting and production for weddings, Asian wedding celebrations, parties and corporate events across Dallas–Fort Worth."/>
<meta property="og:image" content="https://focuslabproductions.com/images/og-default.jpg"/>
<meta property="og:type" content="website"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="Focus Lab Productions — DFW Weddings &amp; Events"/>
<meta name="twitter:description" content="..."/>
<meta name="twitter:image" content="https://focuslabproductions.com/images/og-default.jpg"/>

# /pricing/ and a guide page ("Wedding-Day Coordination Checklist") confirmed too —
# og:title, og:image, twitter:card all present and correct on both.

$ curl -s https://focuslabproductions.com/ | grep -oP '(?<=application/ld\+json">).*?(?=</script>)'
{"@context":"https://schema.org","@type":"LocalBusiness","name":"Focus Lab Productions", ...}

$ curl -s -o /dev/null -w "%{http_code}\n" https://focuslabproductions.com/favicon.ico
200
$ curl -s -o /dev/null -w "%{http_code}\n" https://focuslabproductions.com/apple-touch-icon.png
200
$ curl -s -o /dev/null -w "%{http_code}\n" https://focuslabproductions.com/site.webmanifest
200

$ curl -s https://focuslabproductions.com/robots.txt
User-Agent: *
Allow: /

# Content Signals Policy ...
Content-Signal: search=yes, ai-input=yes

Sitemap: https://focuslabproductions.com/sitemap.xml
```

Also spot-checked alt text live on the homepage: hero photos now carry real descriptions (`"Two young girls in formal gowns twirl down a flower-decorated wedding stage runway"`, etc.), logo images remain `alt=""` as intended.

## Not done / flagged

- Not pushed to `origin` yet (commit `8c82f32` is local only).
- Page-specific OG images (weddings, asian-weddings, corporate, parties, photo-video, production) are used as-is from `public/images/generated/*.webp` — not converted to JPEG like the sitewide default was. WebP OG-image support is decent across modern crawlers (Facebook, Twitter/X, LinkedIn, Slack all handle it), but if a specific platform in your audience doesn't render it, converting those six the same way the default was is a quick follow-up.
