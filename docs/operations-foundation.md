# Focus Lab Operations Foundation

Status: operations workstream review draft. This document distinguishes implemented code from future decisions; it does not describe production resources as already provisioned.

## Architecture

```text
Static Next.js website (Cloudflare Workers Static Assets)
        |
        | HTTPS, explicit public feature gate
        v
Separate Cloudflare Worker: Focus Lab Operations API
        |
        +-- D1: contacts, inquiries, events, scheduling state
        +-- D1: responders, expiring presence heartbeats
        +-- D1: assignments, notes, activities, conversations
        +-- provider-neutral messaging destination adapter
        +-- protected seam for a future staff CRM/PWA
```

The public website remains a Next.js static export. It does not gain SSR or a Node server. The operations Worker has its own `operations/wrangler.jsonc`; the existing root `wrangler.jsonc` remains the public static-assets deployment source of truth. No remote Worker, D1 database, secret, route, or DNS record was created in this phase.

## Implementation status

### Implemented

- Reproducible D1 schema and synthetic development seed.
- Public inquiry persistence API with strict runtime validation, length limits, normalized email, stable server IDs, idempotency, and transactional batch writes.
- Contacts, inquiries, event opportunities, requested services, responders, assignments, internal notes, provider-neutral conversations, activity history, and expiring presence tables.
- Pure scheduling assessment supporting date-only, timed, single-day, multi-day, non-blocking, cancelled/declined, and configurable-capacity records.
- Public chat-status endpoint and protected presence heartbeat.
- Protected internal inquiry list/search, detail, workflow, note, assignment, capacity-blocking, conflict, activity, and conversation-read capabilities.
- Static-site inquiry client gated by explicit public configuration. Disabled mode still says nothing was sent; enabled mode reports success only after the Worker persists the inquiry.
- Integration-ready `LiveChatAction` component. It is deliberately not inserted into the visual header on this branch.
- No-PII analytics seams for inquiry and chat interactions.
- Worker-runtime/D1 integration tests and scheduling unit tests.

### Scaffolded

- `MessagingProvider` supports a verified HTTPS shared destination and provider-specific URL construction without making WhatsApp part of the CRM domain.
- Bearer-token protection creates a fail-closed development seam for internal routes.
- `conversations` stores provider and external thread identifiers for future send/receive adapters.

### Deferred

- Production staff identity, sessions, authorization roles, audit actor verification, and account lifecycle.
- Provider account selection and inbound/outbound messaging webhooks.
- Email, calendar, notifications, quote generation, payment, and booking adapters.
- Internal CRM/PWA UI. An unsecured static `/admin` or `/crm` route was intentionally not created.
- Rate limiting, bot mitigation, retention/deletion automation, data export, backups, and formal incident procedures.
- Remote infrastructure provisioning and deployment.

### Business decision required

No code in this foundation defines deposits, cancellation terms, taxes, travel, overtime, payment schedules, quote expiration, response guarantees, turnaround, crew allocation, event buffers, minimum hours, working hours, automatic acceptance, discounts, or final prices. Event capacity defaults to development value `1` but is configuration, not permanent policy.

## Domain and schema

- `contacts`: private customer identity and contact methods. At least email or phone is required; the current website supplies email.
- `inquiries`: source/channel, internal workflow, budget context, customer note, and unique idempotency key.
- `events`: desired date/range, optional times, family, location, guest count, scheduling state, and explicit `blocks_capacity`.
- `inquiry_services`: zero or more requested capabilities copied from the existing form/planner.
- `responders`: private internal responder records; never returned by public endpoints.
- `assignments`: optional many-to-many internal assignment.
- `internal_notes`: separate from customer-visible communication.
- `activities`: append-only history for important inquiry/event state changes.
- `conversations`: provider-neutral conversation metadata; message bodies are not implemented.
- `responder_presence`: explicit availability heartbeat and expiry, not generic phone connectivity.

IDs use `crypto.randomUUID()` with entity prefixes. Timestamps are server-created ISO-8601 UTC text. Foreign keys and common date/state/contact lookup indexes are defined in `0001_operations_foundation.sql`.

## Inquiry lifecycle

`POST /v1/inquiries` accepts the existing website fields. A valid `Idempotency-Key` and server-verified Turnstile token are mandatory. An offscreen, non-focusable honeypot rejects obvious bots, and a Cloudflare Worker rate-limit binding allows 10 attempts per IP-derived hashed key per 60 seconds per Cloudflare location. The limiter is intentionally a permissive abuse-control layer rather than billing-grade accounting. The Worker validates and normalizes input, reuses a contact by normalized email when one exists, creates a non-capacity-blocking event opportunity, creates the inquiry/services/activity in a D1 batch, and returns `received_for_review`. The response explicitly says that receipt is not an availability confirmation.

An inquiry record does not consume capacity. A protected staff workflow must explicitly set the associated event's `blocks_capacity` field. No email or notification is claimed or sent.

## Scheduling model

`assessScheduling()` is internal decision support. It excludes records that do not block capacity and cancelled/declined events. It checks inclusive date-range overlap; when both records have complete times on the same single day it checks half-open time overlap, so adjacent windows do not overlap. Missing date returns `review_required`; overlapping records with incomplete time precision return `potential_conflict`. Definite overlaps are compared with `CONCURRENT_EVENT_CAPACITY`.

No setup/teardown buffer, operating-hours assumption, or public availability promise is present.

## Live chat and presence states

```text
verified destination absent                         -> unavailable
verified destination present + no current heartbeat -> async / Send us a DM
verified destination present + >=1 current heartbeat -> live / Live Chat
```

Both `live` and `async` resolve to the same configured shared destination. A responder must deliberately report `available: true`; an online phone is not sufficient. Heartbeats expire after `PRESENCE_TIMEOUT_SECONDS` (development default 120 seconds). Sending `available: false` immediately removes that responder from the live count.

`POST /v1/internal/presence/heartbeat` requires an internal bearer token and an existing active responder. When the secret is absent, comparison fails closed. This token is provisional development protection, not a finished staff authentication system.

## Security and privacy baseline

- Strict public schemas reject unexpected fields and oversized bodies.
- All SQL values use prepared statement bindings.
- Internal endpoints fail closed and public APIs do not return notes, assignments, staff, or activity history.
- Token comparisons hash both values and use constant-time comparison.
- Logs contain route/error information but not customer payloads or freeform messages.
- Analytics events contain state/reason only, never names, email, phone, venue, or notes.
- Secrets belong in `operations/.dev.vars` locally and Wrangler secrets remotely; never use `NEXT_PUBLIC_*` for secrets.
- CORS origins are explicit configuration.

Before production, complete the inquiry activation checklist below and decide privacy notice and consent text, retention/deletion rules, backup recovery exercises, secret rotation, monitoring/alerts, and legal access controls. No compliance certification is claimed.

## Configuration

Public browser build (`.env.local`, never secret):

```dotenv
NEXT_PUBLIC_INQUIRY_API_URL=http://localhost:8787
NEXT_PUBLIC_INQUIRY_SUBMISSION_ENABLED=true
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<public-site-key>
```

Worker non-secret vars in `operations/wrangler.jsonc`:

- `PUBLIC_SITE_ORIGIN`: comma-separated exact allowed origins.
- `CONCURRENT_EVENT_CAPACITY`: positive integer, development default `1`.
- `PRESENCE_TIMEOUT_SECONDS`: positive seconds, development default `120`.
- `TURNSTILE_EXPECTED_HOSTNAME`: exact public hostname accepted from Siteverify.
- `INQUIRY_RATE_LIMITER`: Worker binding configured for 10 attempts per 60 seconds.

Worker secrets/provider configuration in `operations/.dev.vars` locally or Wrangler secrets/config in a future environment:

- `INTERNAL_API_TOKEN`: provisional internal protection; required for protected operations.
- `MESSAGING_PROVIDER`: provider adapter identifier.
- `MESSAGING_DESTINATION_URL`: verified HTTPS shared business destination. If missing/invalid, chat is unavailable.
- `TURNSTILE_SECRET_KEY`: server-only widget secret used by Siteverify; required outside the explicitly isolated development test mode.

The final production split between secret and non-secret provider settings should be decided with the selected provider. Never place a credential in `NEXT_PUBLIC_*`.

## Local development

From repository root:

```bash
npm install
cp operations/.dev.vars.example operations/.dev.vars
npm run ops:types
npm run ops:db:reset
npm run ops:dev
```

In a second terminal:

```bash
NEXT_PUBLIC_INQUIRY_API_URL=http://localhost:8787 \
NEXT_PUBLIC_INQUIRY_SUBMISSION_ENABLED=true \
npm run dev
```

Useful database commands:

```bash
npm run ops:db:migrate
npm run ops:db:seed
npm run ops:db:inspect
```

`ops:db:reset` only removes `operations/.wrangler/state`, then reapplies checked-in migrations and synthetic seed. It never addresses a remote database.

## Tests

```bash
npm run test:operations
npm run typecheck
npm run lint
npm test
npm run build
```

Worker tests run inside the Cloudflare Workers runtime with an isolated D1 binding. The standard `npm test` runs both public Playwright tests and operations tests.

## Proposed deployment boundary (not performed)

Provision a dedicated D1 database and deploy the operations Worker independently of the static website. Configure the public-site origin, secrets, provider destination, and Worker route; run remote migrations deliberately; then build the website with the API URL and submission gate enabled. Staging should use separate Worker/D1 resources and synthetic data. The root static-assets Worker must remain independent.

## Next engineering phase

Choose production staff identity and role authorization first. Then add rate limiting/abuse controls, privacy/retention decisions, provider webhook verification, calendar adapter contracts, operational observability, and a separately deployed authenticated CRM/PWA. Do not build a public static admin route.


## Staff application

`operations/staff-app/` is a separate React 19, TypeScript, and Vite phone-first PWA. Hash routing avoids static-host rewrite requirements. It consumes protected Worker APIs and does not duplicate CRM/scheduling rules or create a public admin route. Views include Inbox, Inquiry Detail, Schedule, Chat, Search, and Status.

Development authentication accepts the provisional bearer credential only at runtime and keeps it in `sessionStorage`. Production bootstraps automatically from a validated Cloudflare Access assertion and active D1 staff mapping; it never offers the development bearer path. Responder availability is deliberate: enabling sends an immediate heartbeat, repeats at one third of the server timeout (clamped to 15–60 seconds), prevents duplicate timers, resumes after reconnect/visibility restoration, and explicitly sends unavailable when disabled. Server expiry remains authoritative.

The manifest and service worker cache only the application shell. Offline CRM mutations are not queued: the app shows disconnection when the browser reports it, disables writes, preserves recoverable input, and reports saved only after Worker success. WebKit may incidentally retain an in-flight request until connectivity returns; this is not supported offline synchronization. Internal-note idempotency is deferred unless deliberate retry or queue behavior is introduced later. Mobile uses bottom navigation; desktop uses a sidebar.

### Staff local development

Terminal 1:

```bash
cp operations/.dev.vars.example operations/.dev.vars
npm run ops:db:reset
npm run ops:dev
```

Terminal 2:

```bash
cp operations/staff-app/.env.example operations/staff-app/.env.local
npm run staff:dev
```

Enter the same local `INTERNAL_API_TOKEN` at runtime and choose a synthetic responder. Run staff gates with `npm run staff:typecheck`, `npm run staff:lint`, `npm run staff:test`, `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/snap/bin/chromium npm run test:staff:e2e`, and `npm run staff:build`.

### Staff deployment proposal (not performed)

Deploy `operations/staff-app/dist/` to a private, separately named Cloudflare static target. Place approved identity/authorization in front of the app and protected Worker routes. Use separate development, staging, and production origins and D1 databases. Do not publish it on the marketing domain.

### Abuse-protection launch gate

The public inquiry API now has strict validation, size limits, idempotency, explicit CORS, a honeypot, mandatory server-side Turnstile Siteverify, and a Worker rate-limit binding. After a real-browser transport failure on the separate staging `workers.dev` API hostname, the staging browser path was changed to same-origin: `focus-lab-public-staging` forwards public API paths to `focus-lab-api-staging` through a Cloudflare service binding. The standalone API retains explicit CORS, while the browser no longer needs a second DNS/TLS connection or preflight. Staging resources are isolated in `focus-lab-api-staging`, `focus-lab-public-staging`, the existing `focuslab-crm-staging` D1 database, and the `focuslab-inquiry-staging` managed widget. Production submission remains disabled until a separate production widget/API/D1 are provisioned, exact production origins and hostname validation are configured, secrets are installed, monitoring is reviewed, a synthetic end-to-end submission is verified, and launch approval is explicit. The staff Access/PWA validation is accepted; delayed-connectivity availability display remains a low-priority UX issue to watch and does not change D1 authority.

## Production staff authentication phase

The implemented production identity boundary and required Cloudflare configuration are documented in [staff-authentication.md](./staff-authentication.md). Cloudflare Access authenticates identity; D1 active state and roles authorize application actions. Same-origin staff assets and `/v1/internal/*` are adopted for the future `staff.gofocuslab.com` topology. No Access application, domain, or production resource was created.
