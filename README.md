> **⚠ Deployment note (2026-08-19):** the "Cloudflare Workers Static Assets"
> section below is out of date and describes the wrong deploy target
> (`wrangler.jsonc` / `dfw-event-web` is a legacy, backend-less Worker — not
> where this site is actually reviewed). See `AGENTS.md` §3 for current,
> accurate deployment facts before deploying anything.

# Focus Lab Productions — Website Prototype

Next.js 15 static-export prototype for Focus Lab Productions, an event media,
entertainment, and production company serving Dallas–Fort Worth.

## Prototype safeguards

- The site is live and intentionally indexable (2026-08-20): no sitewide `noindex`/`X-Robots-Tag` block. Individual unpublished/private surfaces such as `/work`, `/chat-preview`, and `/conversation` still carry their own route-level `noindex` in `metadata`. A build-time global-noindex mechanism still exists (`NEXT_PUBLIC_PUBLICATION_STAGE=review` in `app/layout.tsx`) for a genuine future pre-launch review build, but nothing in the current scripts sets it.
- The generated photography is classified as `ai-brand` in `lib/media.ts`.
  It is brand-supporting imagery, never portfolio, client, testimonial, or
  case-study proof. Exact prompts and source filenames are preserved in
  `docs/07_IMAGE_ASSET_MANIFEST.json`.
- Work stays unpublished until authentic, approved project media exists.
- Pricing is development data and remains visibly labeled until approved.
- Inquiry submission is demo-only unless the public operations API and
  Turnstile configuration are explicitly enabled.
- Contact and social routes are hidden until verified in `lib/config.ts`.
- Development labels must remain enabled while any asset, price, claim, or
  public route is still pending verification.

## Requirements and local development

- Node.js 20 or newer (currently tested on Node.js 22)
- npm

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # TypeScript
npm run lint       # ESLint
npm test           # public Playwright + operations + staff tests
npm run build      # static export to out/
```

`npm run build` produces the entire public site in `out/`. There is no
application server or `next start` deployment step.

## Cloudflare Workers Static Assets

`wrangler.jsonc` is the deployment source of truth. It points the top-level
Workers Static Assets project at `./out` and intentionally has no Worker
script. The production workflow is:

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npx wrangler deploy
```

Do not deploy without explicit authorization. Keep `output: "export"`,
`trailingSlash: true`, and unoptimized Next images unless the hosting
architecture is deliberately changed and every route is retested.

## Sources of truth

## Public architecture

The homepage is the complete customer journey — a visitor can identify their
event, explore services, build a plan, see pricing, and reach Check Availability
without leaving `/`. The supporting routes (`/weddings`,
`/asian-weddings`, `/events/*`, `/guides/*`) are a **knowledge layer**:
substantial planning guides for depth, search, and sharing.

See `docs/02_ARCHITECTURE_AND_CONTENT_HIERARCHY.md` for the anchor contract and
`docs/12_ONE_ANCHOR_DECISION.md` for why the earlier hub-and-spoke model was
replaced.

| Concern | Source |
|---|---|
| Business identity, service area, contacts, publication toggles | `lib/config.ts` |
| Service inventory (the only place a service is defined) | `lib/plan.ts` |
| Homepage event section copy | `lib/content/eventSections.ts` |
| Knowledge-layer planning guides | `lib/content/planningGuides.ts` |
| Focused checklists | `lib/content/guides.ts` |
| Shared FAQs | `lib/content/commercial.ts` |
| Prices and approval state | `docs/06_DEV_PRICING_DATA.json` and `lib/pricing.ts` |
| Structural UX reference (not visual/pricing authority) | `docs/reference/Focuslab-One-Anchor-Wireframe.html` |
| Media paths, alt text, crop intent, and truth class | `lib/media.ts` |
| Generated-image prompts and provenance | `docs/07_IMAGE_ASSET_MANIFEST.json` |
| Cloudflare deployment | `wrangler.jsonc` |

Runtime images live under `public/images/`; generated brand assets are grouped
under `public/images/generated/`. Legacy proxy imagery remains available only
for unpublished or legacy component paths and retains its development status.

## Publishing real work or media

1. Add an approved file under `public/images/`.
2. Register it in `lib/media.ts` with accurate alt text, use, crop metadata,
   and an `authentic-approved` truth class.
3. Replace only the intended `ai-brand`, `authentic-pending`, or
   `development-placeholder` slot.
4. Retest the mobile and desktop crop and all quality gates.
5. Enable work/contact/pricing publication flags only after the underlying
   facts and routes are approved.

Do not fabricate team identities, biographies, experience, awards,
testimonials, clients, event counts, response times, prices, or service claims.
