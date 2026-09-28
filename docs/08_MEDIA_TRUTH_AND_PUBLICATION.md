# 08 — Media Truth & Publication Rules

## Asset classes

Every registry item must carry a truth/provenance class.

Recommended values:

- `ai-brand` — generated editorial/brand imagery
- `authentic-approved` — genuine Focus Lab work cleared for public use
- `authentic-pending` — genuine material awaiting approval
- `development-placeholder` — temporary block/wireframe asset

## Allowed use by class

### `ai-brand`
Allowed:
- hero
- event chooser
- service/editorial section
- atmospheric CTA

Forbidden:
- Work/Portfolio gallery
- case study
- testimonial pairing
- named event
- client/venue proof

### `authentic-approved`
Allowed anywhere appropriate, including proof modules.

### `authentic-pending`
Staging/admin only.

### `development-placeholder`
Development only.

## Public Work gate

`workPublished` must remain false until there is enough authentic approved media to create a deliberate, quality-controlled proof page.

Minimum gate should be qualitative, not merely a raw image count. Suggested review criteria:

- at least 3 coherent event stories or equivalent bodies of work;
- consistent quality;
- permission/rights resolved;
- no misleading mixed provenance;
- enough landscape/portrait/video variety for responsive storytelling.

## AI disclosure

Do not present AI brand imagery as documentary evidence. The site need not plaster every hero with an intrusive badge if the context is clearly editorial rather than proof, but internal metadata must always preserve provenance and any legally/ethically required disclosure should be implemented consistently.

## SEO / alt text

Alt text describes what is visible and useful to the user; it must not say "Focus Lab photographed..." for AI assets.


## Build-time CMS snapshots

Pricing and common/pricing FAQs can be supplied by an immutable Operator-OS snapshot at build time. Normal builds keep using `lib/content/servicePricing.json` and `lib/content/faqs.json`. An explicit snapshot build is strict:

```bash
FOCUS_CMS_SNAPSHOT_PATH=artifacts/focus-cms-snapshot.json npm run build
```

`next.config.ts` reads the local file, validates schema version 1 and the complete stable pricing-key inventory, recomputes its SHA-256 integrity hash, and fails the build on any mismatch. It embeds only the public content and revision IDs; no CMS URL, credential, Access token, or draft-fetch endpoint is added to the browser bundle. All pricing cards, dormant quote calculations, homepage/service common FAQs, and pricing FAQs use the same adapter.

Local end-to-end preview:

```bash
# Operator-OS terminals: apply CMS migrations and run wrangler dev.
OPERATOR_OS_TOKEN=<local-token> OPERATOR_OS_RESPONDER_ID=<manager-id> npm run cms:initialize -- --api http://127.0.0.1:8787
# Save a draft in the staff Website area, then:
OPERATOR_OS_TOKEN=<local-token> OPERATOR_OS_RESPONDER_ID=<manager-id> npm run cms:export -- --api http://127.0.0.1:8787 --out artifacts/focus-cms-snapshot.json
FOCUS_CMS_SNAPSHOT_PATH=artifacts/focus-cms-snapshot.json npm run build
npx serve out
```

This is a local preview workflow, not publication. The public custom domain currently serves the same HTML as `focus-lab-public-staging.freedomgeneration1111.workers.dev` (verified 2026-09-28), while that custom-domain attachment is not declared in either checked-in Wrangler configuration. No deployment is performed by the CMS scripts.
