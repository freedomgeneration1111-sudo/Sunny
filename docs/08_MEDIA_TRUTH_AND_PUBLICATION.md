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

This is a local preview workflow, not publication. The public custom domain currently serves the same HTML as `focus-lab-public-staging.freedomgeneration1111.workers.dev` (verified 2026-09-28), while that custom-domain attachment is not declared in either checked-in Wrangler configuration. No deployment is performed by the preview scripts.

## Immutable CMS release runner

Operator-OS owns release records and server-side orchestration. Sunny's runner only accepts one immutable release assigned to its exact Cloudflare build UUID:

```bash
# Cloudflare Workers Builds build command
npm run cms:release:build

# Cloudflare Workers Builds deploy command
npm run cms:release:deploy
```

Required secret/variable contract:

- `CMS_RUNNER_TOKEN`: Workers Builds secret matching Operator-OS `CMS_RUNNER_SECRET`.
- `OPERATOR_OS_API_URL`: Focus API origin, available to the build process only.
- `WORKERS_CI_BUILD_UUID` and `WORKERS_CI_COMMIT_SHA`: supplied by Cloudflare Workers Builds; the latter is recorded as the actual Sunny source SHA.
- `CMS_DEPLOY_HOOK_URL`: stored only on Operator-OS, never in this repository's public build environment.

The build command claims the queued release whose recorded hook UUID equals `WORKERS_CI_BUILD_UUID`, writes `.cms-release/snapshot.json`, and runs `npm run build` with `FOCUS_CMS_SNAPSHOT_PATH` and publication stage `production`. The existing `next.config.ts` adapter strictly validates the snapshot schema, complete pricing inventory, and SHA-256 integrity. Claim retries are bounded to cover the hook-response race and can never fall through to a later release.

The deploy command reads `.cms-release/operation.json`, reports `deploying`, and runs the checked-in `wrangler.staging.jsonc` target. It sets `WRANGLER_OUTPUT_FILE_PATH` and reads NDJSON for the exact Worker version and target metadata rather than scraping console prose. For rollback operations it runs the installed Wrangler 4.120 form:

```bash
npx wrangler rollback <recorded-version-id> --config wrangler.staging.jsonc --message "CMS rollback <release-id>" --yes
```

Build/deploy failures are reported to Operator-OS and leave the prior live pointer unchanged. A successful deployment's final callback is retried idempotently; if every callback attempt fails, the operation intentionally remains `deploying` and blocks another release rather than falsely reporting a failed deployment when the public Worker may already have changed. Runner unit tests stub all commands and network calls; no test deploys or rolls back remotely.

Local simulated runner verification:

```bash
npx vitest run --config vitest.config.mts scripts/focus-cms-release.test.mts
```

## Indexing and the custom hostname

`operations/src/public-site.ts` now removes `X-Robots-Tag` only when the request hostname is explicitly present in `PUBLIC_SITE_PRODUCTION_HOSTNAMES` and absent from `PUBLIC_SITE_REVIEW_HOSTNAMES`. Review and unknown hosts receive `X-Robots-Tag: noindex, nofollow`; overlap also fails safe to noindex. `wrangler.staging.jsonc` declares:

- production: `focuslabproductions.com`
- review: `focus-lab-public-staging.freedomgeneration1111.workers.dev`

Workers.dev can therefore stay non-indexable while the same Worker serves the explicit production hostname without a blanket noindex response header. The release build also sets `NEXT_PUBLIC_PUBLICATION_STAGE=production`; ordinary `public:staging:build` remains a review/noindex build.

Read-only inspection on 2026-09-28 established that both hostnames returned `200`, byte-identical HTML, and no current `X-Robots-Tag`; the active `focus-lab-public-staging` version was `75917371-275b-4304-a9cd-c3010bf92923`. The source-controlled Worker had been poised to add blanket noindex on its next deploy; the explicit hostname rule prevents that future regression. The custom-domain attachment itself remains external to both Wrangler files. `dfw-event-web` was absent from the authenticated account and remains a legacy/orphaned config target.

Wrangler 4.120 has no command that reveals Workers Builds Git repository/branch or deploy hooks, and an authenticated dashboard browser was unavailable. Before enabling publication, manually verify the existing Workers Builds project (if any), repository, branch, commands, deploy hook, and custom-domain attachment. Then configure the Operator-OS CMS D1 binding/migrations, `CMS_ENABLED`, hook secret, runner secret, and build variables. Do not rename `focus-lab-public-staging`, create a second deployment path, or attach DNS as part of that verification.
