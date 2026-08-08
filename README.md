# Sunny Lab — Prototype Website

Visual prototype for the FocusLab event-media build. Placeholder brand name
only — see **Rename procedure** below.

## ⚠️ Prototype status

- **Form is not connected.** `/check-availability` is client-side only and
  transmits nothing anywhere. Do not treat submissions as real leads.
- **All photography is AI-generated proxy imagery**, watermarked with a
  `PROXY · REPLACE` corner badge. None of it is real company work.
- **The About page team section has no real people in it.** Six role slots
  show `ASSET NEEDED` placeholders (Name/Specialty/Experience all marked
  "pending") instead of invented names, bios, or photos — see
  `components/sections/TeamSlot.tsx` if you want to understand why before
  changing it.
- `noindex, nofollow` is set in `app/layout.tsx`. Don't remove it before
  this is a real, verified public site.

## Requirements

- Node.js 20+ (built and tested on Node 22)
- npm

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run build      # production build + static export to /out
```

`npm run build` writes the deployable site to `out/`. There is no `next start`
step for deployment — Cloudflare Pages serves the `out/` folder as static
files directly.

## Deploying to Cloudflare Pages

1. Push this project to a GitHub or GitLab repo (Cloudflare Pages connects
   to Git — there's no drag-and-drop for a project this size once it's past
   a single upload).
2. In Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**.
3. Framework preset: **Next.js (Static HTML Export)**. This matters — it's
   what makes Cloudflare apply the right routing/build assumptions for a
   `next build` + `output: 'export'` project instead of treating it as a
   generic static site.
4. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
5. Deploy. You'll get a `*.pages.dev` subdomain immediately; a custom domain
   can be attached afterward under the project's **Custom domains** tab.

**Trailing slashes:** `next.config.ts` sets `trailingSlash: true`, which
makes every route build as `route/index.html` instead of `route.html`. This
was a real bug, not a precaution — the first build without it 404'd on
`/about/` when served from a plain static file server, because Next's
default output doesn't match how most static hosts resolve folder URLs.
Confirmed fixed by re-serving and re-testing every route. Leave this
setting alone unless you're deliberately changing the URL structure.

## Where things live

| What | Where |
|---|---|
| Brand name, tagline, phone, email, social links, dev-label toggle | `lib/config.ts` |
| Image registry (all 22 proxy assets + team-portrait placeholders) | `lib/media.ts` |
| Page copy, per route | `lib/content/*.ts` |
| Actual images | `public/images/` |
| Shared design system (Cue Frame mark, proxy badges, header/footer) | `components/brand/`, `components/layout/`, `components/media/` |

## Swapping in a real image

1. Drop the real file in `public/images/`.
2. In `lib/media.ts`, find the matching entry and change `status: "proxy"`
   to `status: "real"` — the badge disappears automatically, no template
   changes needed.
3. For the About page team slots, replace the `teamPortraitPlaceholder`
   usage in `components/sections/TeamSlot.tsx` with real per-person data
   once Sunny provides it, and flip each `status: "needed"` to `"real"`.

## Turning off development labels

Every `PROXY · REPLACE` / `ASSET NEEDED` badge and every dashed-underline
text flag (like "50+ Combined Years" on the homepage) is controlled by one
switch: `showDevelopmentLabels` in `lib/config.ts`. Set it to `false` to
preview the site clean. **Don't ship it `false` while any asset is still
`proxy`/`needed` or any copy is still unverified** — the whole point of the
flag is that it's the only thing standing between "obviously a prototype"
and "looks like a real, evidenced business."

## Rename procedure (Sunny Lab → real name)

1. Update `businessName` in `lib/config.ts`. Every component reads from
   here — nothing is hardcoded.
2. Update `phone`, `phoneDisplay`, `smsPhone`, `email` in the same file —
   these are currently placeholder values (555 exchange, `.test` domain) on
   purpose, so nothing routes anywhere real by accident.
3. Re-run the trademark check on the new name before this goes anywhere
   public. That's what took FocusLab out.

## Known gaps / next-pass items

- `featured-dj-action.jpg` renders as a dancefloor/crowd moment rather than
  a DJ-focused shot — usable as general party energy, weak as the dedicated
  DJ & MC page image. Candidate for regeneration.
- Footer's "Privacy" link (present in the copy doc) has no route — left as
  unlinked text since the build prompt's route list doesn't include one.
- About page's rental-equipment-transparency paragraph is held back per its
  own note ("only if Sunny is comfortable") — not built yet either way.
- `/weddings` and `/corporate` are built (copy was ready), even though the
  build prompt marks them optional.
