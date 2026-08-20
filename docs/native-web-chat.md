# Native Focus Lab web chat

## Status

Core native web chat and the integrated public-site experience passed physical desktop and iPhone validation on 2026-08-12: bidirectional realtime delivery, rapid ordered messages without observed duplicates, reconnect/history recovery, mobile staff open/reply, foreground notification audio, live public chat, async message completion, desktop header placement, mobile menu/drawer/keyboard behavior, and preservation of Check Availability as the primary CTA all passed. Android-specific validation is deferred and is not a blocker. Production is not deployed.

## Architecture

```text
Public browser                         Access-protected staff PWA
      |                                              |
      +-- same-origin HTTP/WebSocket ----------------+
                         |
                Operations Worker
                  |             |
       ChatRoom Durable Object  StaffChatHub Durable Object
                  |             |
                  +------ D1 ---+
```

D1 is the durable source of truth for contacts, conversations, ordered messages, assignment, per-responder read position, and audit activity. A named `ChatRoom` Durable Object serializes writes for one conversation, assigns sequence numbers, persists before acknowledging, and then fans the saved message out to connected browser clients. It uses Cloudflare's hibernating WebSocket API, so idle sockets do not require an always-running process. A singleton `StaffChatHub` sends non-PII event notifications to authenticated staff sockets.

Official Cloudflare guidance recommends the hibernation API for Durable Object WebSocket servers and SQLite storage for new Durable Object namespaces. The configuration uses declarative Durable Object `exports`, not the legacy migration array.

## Lifecycle and identity

A visitor starts a conversation with a name, verified-format email, optional phone, a bounded message, and a reply-channel preference (email/SMS/call — see ADR-0002). The Worker creates a contact and `native_web` conversation, returns a 256-bit resume token once, and stores only its SHA-256 hash. The token permits that browser to read/send only that conversation; it is kept in `localStorage` by the integration component, so it survives a closed browser/tab, and the component attempts to resume an existing conversation on mount before offering a fresh form. No customer account is required, and no client-side expiry is enforced — the token remains valid until the backend explicitly revokes it (today, only as a side effect of a failed email-continuity notification). Email continuity (a one-time resume link sent when a customer isn't connected to receive a staff reply) is implemented; SMS/voice continuity is not.

Messages have server IDs, server timestamps, per-conversation sequence numbers, and a `(conversation_id, client_message_id)` uniqueness constraint. A retry with the same client ID returns the existing message. The Durable Object broadcasts only after D1 persistence. This is practical at current scale; it is not a claim of generalized exactly-once distributed delivery. Reconnect reloads D1 history before continuing.

Staff identity comes only from the existing Access JWT plus D1 authorization boundary. Staff replies record the authenticated responder ID. Assignment changes are audited. Public responses never contain internal staff identity, presence lists, assignments, or activity.

## Live/async presence

`GET /v1/chat/status` now describes the native channel even when no external messaging provider exists. `live` requires at least one active responder with an unexpired, available D1 heartbeat. Otherwise the interface says `Send us a Message` and accepts asynchronous messages without a response-time promise.

## Notifications

Foreground staff sessions keep one authenticated event WebSocket. A new unassigned customer conversation alerts current D1-confirmed available responders; an assigned conversation targets its assignee. Customer-origin events only are eligible for a chime. The first message uses a three-note Web Audio chime, later messages use one short note, event IDs are deduplicated in memory, and staff can persistently disable sound. Audio is initialized only after normal interaction/browser permission allows it. There is no repeating alarm.

The service worker contains a provider-neutral `push`/`notificationclick` handler that accepts only event type and conversation ID and shows generic, non-PII OS text. Push subscription storage, permission onboarding, VAPID/application-server keys, and delivery fan-out are implemented and operational (`src/push.ts`, `push_subscriptions` table) — background/closed-PWA delivery to the staff PWA works via standards-based Web Push, dispatched by the `StaffChatHub` Durable Object alongside the live WebSocket fan-out. No third-party messaging app is involved in this path.

## Security and abuse baseline

- Public bodies are strict, normalized, and bounded to 2,000 message characters.
- A hidden honeypot is rejected.
- `CHAT_RATE_LIMITER` allows 30 start/message attempts per connecting IP per 60 seconds per Cloudflare location; this is a development safety value to review with staging evidence, not a business guarantee.
- Resume tokens are never returned by internal APIs or stored in plaintext.
- Staff routes independently validate Access and D1 roles.
- Customer-facing failures are generic.
- Chat content is not placed in analytics, console logs, push payloads, or cache storage.
- The service worker bypasses every `/v1/` request, so CRM/chat API data is never cached.

Turnstile is not duplicated into the native chat form yet (it is mounted and public today — see "Public integration behavior" — the honeypot and `CHAT_RATE_LIMITER` are its only current bot defenses). Adding Turnstile here remains a deliberate non-goal until reconsidered: if it is, review whether the inquiry widget token can be reused safely or create a chat-specific managed widget/action; Siteverify must remain server-side if enabled.

## Staging topology

The central real-time backend is `focus-lab-api-staging` (repo: `operator-os`), bound to `focuslab-crm-staging`. The public facade (repo: this repo, `focus-lab-public-staging`, `operations/src/public-site.ts`) forwards `/v1/chat/*` through its `OPERATIONS_API` service binding. The staff console facade (repo: `operator-os`) forwards detailed/internal chat and staff event sockets through its `CHAT_API` binding, preserving same-origin browser behavior while the central Worker owns both Durable Object namespaces. Public and staff static Workers do not expose each other's shells.

Required staging sequence (commands run from each repo's own root — this repo for the public facade, `operator-os` for the API and staff console):

```bash
# In operator-os:
npm run staff:build:focus:staging
npm run focus:staging:migrate
npm run focus:staging:deploy:api
npm run focus:staging:deploy:console

# In this repo (public site facade):
npm run public:staging:build
npm run public:staging:deploy
```

## Accepted physical validation

Desktop and physical iPhone staff/public chat, customer-to-staff and staff-to-customer realtime delivery, rapid ordering, duplicate behavior, refresh/reconnect history, mobile open/reply, foreground chimes, async completion, public header/menu integration, and mobile drawer behavior are accepted. Do not reopen the core transport or public integration without regression evidence. Android validation remains deferred.

## Public integration behavior

A single shared public chat provider supplies desktop-header and mobile-menu triggers and one drawer/socket lifecycle. The opened mode snapshots server-confirmed presence. Live mode keeps realtime history and reply continuity. Async mode persists through the same CRM model but ends in a clear received state that tells the customer they may leave; it does not imply an active waiting room. Check Availability remains the dominant structured-inquiry CTA.

## Deferred

Turnstile chat widget decision, retention/deletion policy, external channel adapters, typing indicators, attachments, delivery/read receipts, and production resources are deferred. No response-time guarantee is introduced.

Public visual insertion, Web Push subscriptions/delivery, and durable cross-session customer continuity — previously listed here — are no longer deferred: the chat trigger is live in the header/mobile-menu/teaser (see "Public integration behavior"), Web Push delivery to the staff PWA is implemented (see "Notifications"), and reconnection now persists the resume token in `localStorage` so a closed-and-reopened browser resumes an existing conversation rather than starting a new one (see ADR-0002).

## Official references

- [Cloudflare Durable Objects WebSockets](https://developers.cloudflare.com/durable-objects/best-practices/websockets/)
- [Hibernating WebSocket example](https://developers.cloudflare.com/durable-objects/examples/websocket-hibernation-server/)
- [Durable Object class exports](https://developers.cloudflare.com/durable-objects/reference/durable-objects-migrations/)
