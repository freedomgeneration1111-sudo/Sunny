# AGENTS.md — Focus Lab Productions

Operating rules for AI coding agents in this repo. Read this file fully before making changes. Everything in docs/ is reference material, loaded on demand — this file is the only required read.

## 1. Business

Focus Lab Productions — DFW event production (weddings, Asian/fusion weddings, corporate events, parties). Services: DJ/music, photography, videography, lighting, cold sparks/atmospherics, photo booth/360 booth. Position: "One Crew, Zero Handoffs." Broad DFW market — do not label the business as South Asian-only. Use "Asian weddings / fusion weddings / multicultural weddings," not "Shaadi," in customer-facing copy and nav.

## 2. Stack

Next.js 15, React 19, TypeScript, Tailwind CSS 4, App Router, static export, Cloudflare Workers. Before any build/deploy change: check `package.json`, both wrangler configs (§3), current branch, `git status`.

## 3. Deployment — read before touching. This is the #1 documented failure mode.

Two wrangler configs exist. They are NOT interchangeable and target different Workers:

| Config | Worker | Type | Backend binding |
|---|---|---|---|
| `wrangler.jsonc` | `dfw-event-web` | bare static assets, no Worker script | none — chat/API 404s here by construction |
| `wrangler.staging.jsonc` | `focus-lab-public-staging` | full Worker script (`operations/src/public-site.ts`) + static assets | `OPERATIONS_API` → `focus-lab-api-staging` (live chat/CRM backend) |

**`focus-lab-public-staging` is the real review/staging target** — this is what's reviewed at `focus-lab-public-staging.freedomgeneration1111.workers.dev`. Always deploy there via the established scripts, never a bare `wrangler deploy`:

```
npm run public:staging:build   # sets NEXT_PUBLIC_PUBLICATION_STAGE=review → noindex on
npm run public:staging:deploy  # wrangler deploy --config wrangler.staging.jsonc
```

`dfw-event-web` is a legacy/orphaned target with no backend wiring and no noindex protection. Do not deploy here unless explicitly instructed — confirm its intended purpose first if a task seems to call for it.

The chat/CRM backend Worker (`focus-lab-api-staging`) and its source live in a **separate repo**: `/home/moses/projects/operator-os`. This repo contains only the public-facing proxy/binding, not the backend itself. Do not attempt to build or modify the backend from inside this repo.

Custom domain `focuslabproductions.com`: as verified on 2026-09-28, it returns `200` and serves HTML byte-identical to `focus-lab-public-staging.freedomgeneration1111.workers.dev`. That custom-domain attachment is not represented in either checked-in Wrangler config, so treat it as live externally configured state and do not change or reattach it without explicit instruction. The staff domain remains Access-protected.

## 4. Highest-level rule

Preserve working behavior unless the task explicitly requires changing it. Narrow implementation over broad refactor. Don't revive discarded ideas. Don't implement roadmap items that aren't part of the current assignment.

## 5. Product scope

One-anchor homepage is the settled architecture — don't rebuild into a maze of pages. Individual service/pricing/guide/gallery/inquiry pages are fine where they serve a clear purpose. The MVP site ships independently of the future marketing system (§11); don't block on it.

## 6. Pricing

Published pricing is authoritative — present it confidently, no "pending verification" hedge language. Moses edits pricing directly later.

## 7. Quote builder

Built, intentionally disabled — too many pricing variables (hourly/starting-at/package/custom) to automate well without confusing customers. Don't expose it as the primary flow. Don't delete it. Current flow: published pricing + custom quotes from the team.

## 8. Media

AI-generated photorealistic imagery is acceptable for development-stage placeholders — never presented as real Focus Lab client photos. Real portfolio media replaces it progressively. Preserve the media truth/registry system (`lib/media.ts`, `truth` field: `"ai-brand"` vs `"authentic"`) — every generated asset gets `ai-brand`; swap to `authentic` only when replaced with real client work. Important subjects sit right/center-right in hero compositions, left side stays clear for headline copy. Desktop hero may use video; mobile may use stills where that performs better. Check both breakpoints before changing established crop/positioning.

## 9. Live chat / messaging

One shared customer-facing entry point. Label reflects real state: "Live Chat (No Bots)" when staff coverage is live, "Message Us (No Bots)" otherwise (async, routes to a contact form, same team/phone on the backend either way). No AI/bot involved anywhere in this flow — keep it that way, or update the copy honestly if that ever changes. Don't expose internal staff coordination to customers. Don't rebuild chat components that already exist — see §3 for where the backend actually lives.

## 10. CRM / operations

Evolving custom backend, intentionally kept compatible with future expansion, but its source lives outside this repo (§3). Don't turn an ordinary website task into a CRM/backend rewrite. When a task does touch shared data models/APIs/bindings: inspect what depends on it, make the smallest safe change, preserve backward compatibility, test the actual flow end-to-end — not just that it renders.

## 11. Future Market Penetration OS

A larger reusable multi-client marketing system is planned (market/opportunity intelligence, SEO/local-authority signals, funnel/CRM integration, eventually reusable across other small-business clients). Strategically important, **not in scope for ordinary website tasks**. Don't start building it just because strategy docs exist in the repo.

## 12. SEO and trust

No thin spam. Entity/service completeness, genuine local relevance (not dozens of near-identical city pages), real information gain over boilerplate, honest attribute signals (service combinations, language capability, coverage area, response expectations). Never invent trust signals — testimonials, reviews, star ratings, event history, awards, partnerships, or press coverage that don't exist. Backlinks come from real relationships (venues, vendors, chambers, cultural orgs, sponsorships), never spam outreach or fabricated authority.

## 13. Scope discipline

Classify every task (content / visual / layout / media / SEO / CRM / deployment / bug fix) before starting. Don't expand into neighboring categories. "Move the hero video" ≠ "redesign the hero." "Fix a deployment" ≠ "upgrade packages." "Rename a nav item" ≠ "rewrite unrelated copy."

## 14. Git safety

Multiple machines and agents work this repo. Before editing: check branch, `git status`, fetch remote, check for divergence. Never assume your working copy is the newest. No destructive reset/checkout to "clean up." No force-push without explicit instruction. Clear, specific commit messages.

If `main` is behind the active working lineage: check whether it's a clean fast-forward (`main` has zero unique commits). If so it's normally safe to execute directly; if not, stop and ask rather than merge/rebase blind.

## 15. Deployment safety

Verify repo/branch/diff before deploying. Run the repo's own build/validation scripts — never invent deploy commands. Deploy only via the established scripts for the target you actually mean to hit (§3). **Verify the live result after deploying** — curl the URL, check noindex headers, screenshot if it's a visual change. A deploy isn't done until it's confirmed live at the correct URL, not just "built successfully."

## 16. Responsive QA

Every customer-facing visual change gets checked at both desktop and mobile — hero cropping/subject position, text overlap, nav, CTA visibility, pricing tables, chat controls, overflow, load performance. Checked at one viewport = not done.

## 17. Preserve existing systems

Before adding another content source, media registry, API, CTA component, or deploy path: search for the existing equivalent first. Reuse over duplicate — duplicate systems are how the deployment confusion in §3 happened in the first place.

## 18. Documentation map — what to actually read

This file is the only required read. Everything below is reference material — load the specific file relevant to the task at hand. Don't read all of docs/ by default; combined it's roughly 80,000+ tokens.

**Current / trustworthy:**
- `docs/00_README.md` — design/art-direction contract
- `docs/01_CANONICAL_DECISIONS.md` — business/positioning decisions
- `docs/02_ARCHITECTURE_AND_CONTENT_HIERARCHY.md` — current except IA specifics, superseded there by `12_ONE_ANCHOR_DECISION.md`
- `docs/03_VISUAL_SYSTEM_SPEC.md` — logo/brand asset source of truth
- `docs/04_COMPONENT_SYSTEM.md`, `docs/05_PAGE_ART_DIRECTION.md`, `docs/08_MEDIA_TRUTH_AND_PUBLICATION.md`, `docs/09_RESPONSIVE_INTERACTION_REQUIREMENTS.md` — current
- `docs/12_ONE_ANCHOR_DECISION.md` — current, settled IA decision
- `docs/native-web-chat.md`, `docs/operations-foundation.md` — most accurate deployment/chat-backend detail in the repo; §3 above is the condensed version. Note: `native-web-chat.md`'s staging sequence references scripts/configs that live in the separate `operator-os` repo, not here.
- `docs/public-inquiry-security.md`, `docs/customer-email-continuity.md`, `docs/staff-web-push.md` — current
- `docs/staff-authentication.md`, `docs/staff-user-guide.md` — current, explicitly not-yet-production
- `docs/Focus_Lab_Master_Offer_and_Pricing_Decision_Source_2026-08-13.md` — current, pricing detail behind §6
- `operations/README.md` — short but load-bearing: confirms the backend/CRM source lives in `/home/moses/projects/operator-os`, not here
- `public/brand/README.md` — current

**Stale — don't rely on for deployment mechanics:**
- `docs/10_CODEX_EXECUTION_PROMPT.md`, `docs/11_BASELINE_CODEX_CONTEXT.md`, `docs/CODEBASE_BEGINNERS_GUIDE.md` — accurate for what they cover, but predate the staging Worker/chat feature. Use §3, not these, for deployment facts.
- `README.md` (repo root) — describes an old Cloudflare Pages git-integration flow that no longer applies. Use §3.

Two full-mirror handoff docs (`V2_1` and `v1_ARCHIVE`) were archived to `docs/archive/` on 2026-08-19 — full duplicates of the modular files above, superseded, not part of this map.

## 19. Keeping this file honest — required, not optional

- If you discover this file is wrong, incomplete, or led you to a mistake — like the deployment-target confusion §3 exists because of — fix the underlying issue **and** correct this file in the same session/commit. Don't leave it broken for the next agent.
- One source of truth per topic. If you're tempted to create a doc that mirrors an existing one "for convenience," don't — extend the canonical one, or generate a derived view via script rather than hand-maintaining a second copy that will drift.
- When a doc becomes superseded: move it to `docs/archive/` and drop it from §18. Don't leave it in place with a "see the newer file" note — that's how multiple files ended up in exactly that ambiguous state.
- Major strategic decisions settled elsewhere (planning sessions, ChatGPT, etc.) get reflected here only when they change coding behavior. This file is not a project diary.
- At the start of any large or ambiguous task, spot-check that §3's deployment facts still match repo reality before trusting them — configs and bindings change.

## 20. Definition of done

Requested behavior implemented; unrelated behavior intact; typecheck/build/lint pass; both breakpoints checked; no accidental unrelated diff; deployed to the correct target (§3) and verified live, not just built; limitations reported plainly. Writing code isn't done — verify the result.

## 21. Reporting

Concise and concrete: what changed, files touched, tests/build run, deployment status (which Worker, version ID), anything needing human review. Don't bury unresolved problems in narrative. If something couldn't be verified, say so explicitly.

## 22. Priority when instructions conflict

1. Current explicit user instruction
2. Current repo implementation and production reality (verify, don't assume)
3. This file
4. docs/ reference material (§18)
5. Older plans / experimental / abandoned code

A newer explicit decision supersedes an older strategy document. Historical files don't silently override current direction.
