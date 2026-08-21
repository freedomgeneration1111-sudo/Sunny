> **Archived 2026-08-21 — superseded.** This was pre-work investigation
> grounding ADR-0002 (conversation reply preferences/continuity). ADR-0002
> shipped (see `reports/2026-08-19-adr-0002-implementation-report.md`) and the contradictions
> flagged below (stale `native-web-chat.md` runbook, self-contradictory
> "deferred"/"unmounted" chat-trigger language, the two inconsistent
> offline-label definitions) were all resolved as part of that work. Kept
> for historical reference only.

# Messaging System Audit Findings

**Type:** Read-only investigation (no code changes made).
**Purpose:** Ground truth for the upcoming ADR unifying Live Chat and the offline "Send us a Message" form into one conversation system.
**Repos audited:** `operator-os` (backend/CRM Worker + D1 + staff PWA, at `/home/moses/projects/operator-os`) and `Sunny-ops` (public marketing site, this repo, at `/home/moses/projects/Sunny-ops`).
**Method:** Two independent read-only audits, one per repo, each verifying claims against actual code (migrations, Worker route handlers, React components) rather than docs or naming conventions. Every claim below is either sourced to a specific file/line, or marked NOT FOUND with a note on what was searched.

---

## Part 1 — operator-os (backend/CRM repo)

### A. D1 schema — conversation model

**1. Does a `contact → conversation → messages` model already exist?**

Yes. Defined across three migrations:

- `contacts` (`migrations/0001_operations_foundation.sql:3-10`) — customer identity (`full_name`, `email`, `phone`, `preferred_contact`).
- `conversations` (`migrations/0001_operations_foundation.sql:69-81`, extended by `migrations/0003_native_web_chat.sql:1-13`) — one row per conversation, FK to `contacts`, optional FK to `inquiries`/`events`.
- `conversation_messages` (`migrations/0003_native_web_chat.sql:15-28`) — one row per message, FK to `conversations`, ordered by `sequence`, unique on `(conversation_id, client_message_id)` and `(conversation_id, sequence)`.
- Supporting tables: `conversation_reads` (per-responder read position), `conversation_activity` (audit trail), `conversation_resume_tokens` and `conversation_notifications` (email continuity, `migrations/0005_customer_email_continuity.sql`), `push_deliveries`/`push_subscriptions` (`migrations/0004_staff_web_push.sql`).
- `migrations/0006_business_neutral_inquiries.sql` is a full-table-rebuild migration (SQLite copy/drop/recreate) that preserves all of the above unchanged; it only touches `inquiries`, and adds `consulting_details`/`intake_submissions`.

**2. Is there already a `source` field on the conversation record? What values are actually used?**

No column literally named `source` on `conversations`. The closest analog is `provider TEXT NOT NULL` (`migrations/0001_operations_foundation.sql:74`). In code, the only value ever inserted is the literal string `"native_web"`, in `src/native-chat.ts:33`:

```ts
await env.DB.prepare(
  `INSERT INTO conversations (id,contact_id,provider,channel_state,public_resume_token_hash,created_at,updated_at) VALUES (?,?,?,?,?,?,?)`
).bind(conversationId, contact.id, "native_web", "open", tokenHash, now, now).run();
```

No other `INSERT INTO conversations` exists anywhere in `src/`. The column has no `CHECK` constraint restricting values (unlike `channel_state`), so it's schema-open but code-closed to `"native_web"` — external-channel providers (WhatsApp, etc.) are referenced only in comments/docs, never inserted.

Separately, `inquiries.source_channel TEXT NOT NULL` (a **different table**, `migrations/0001_operations_foundation.sql:26-35`) is a free-text field (no CHECK constraint), defaulted in `src/inquiry-adapters.ts:20,31` to `"website"` or `"consulting_intake"`, overridable by a client-supplied `source` in the request body (`src/contracts.ts:23,66`). This is an inquiry-level field, not a conversation-level one — do not conflate the two when designing a unified `source` field.

**3. Is there a `status` field? What drives transitions?**

`conversations.channel_state TEXT NOT NULL DEFAULT 'open' CHECK (channel_state IN ('open','closed','pending'))` (`migrations/0001_operations_foundation.sql:75`).

Every `UPDATE conversations` statement in `src/` was checked:
- `src/chat-durable.ts:17` — updates `updated_at`, `last_message_at`, `last_customer_message_at` only.
- `src/native-chat.ts:82` — updates `assigned_responder_id`, `updated_at` only (assignment PATCH handler).

**No code path anywhere updates `channel_state`.** Every conversation is inserted as `'open'` and stays `'open'` forever in current code. It is selected and returned by `GET /v1/internal/conversations` (`src/staff-api.ts:106-113`) and `GET /v1/internal/conversations/{id}` (`src/native-chat.ts:95`), but the staff UI (`staff-app/src/views/ChatView.tsx`) never reads or displays it. **`channel_state` is a dead/unused status column today.**

The status field that does have live transition logic is `inquiries.workflow_state` (`new|reviewing|qualified|quoted|won|lost|archived`, driven by `PATCH /v1/internal/inquiries/{id}/workflow` in `src/crm.ts`) — but that belongs to `inquiries`, not `conversations`.

**4. Is there a field for reply-channel preference (email/SMS/call)?**

There is `contacts.preferred_contact TEXT CHECK (preferred_contact IN ('email','phone','messaging') OR preferred_contact IS NULL)` — but it lives on **`contacts`**, not on `conversations` or `conversation_messages`. It is:
- Set from the public inquiry form (`preferredContact` in `src/contracts.ts:56`, mapped through `src/inquiry-adapters.ts:19,30`).
- Hardcoded to `"email"` when a native-chat conversation starts (`src/native-chat.ts:31`).
- Displayed read-only in the staff Inquiry Detail view (`staff-app/src/views/InquiryDetailView.tsx:20`).

Searched `src/*.ts` and `staff-app/src/**/*` for `sms`, `twilio`, `voice call`, `phone call` — no matches. **No code anywhere reads `preferred_contact` to select a reply channel.** All staff replies go through one path: D1 message + WebSocket broadcast, with Resend email as an automatic fallback — never SMS or voice. **Confirmed absent:** no reply-channel-preference field exists on the conversation/message tables; the one preference field that does exist (`contacts.preferred_contact`) is not wired to any reply-routing logic.

### B. Live chat transport — how does a message actually reach staff?

**1. End-to-end trace, and the "messaging app" claim.**

Customer submits via `POST /v1/chat/conversations` → `startNativeConversation()` (`src/native-chat.ts:25-36`), which creates `contacts`/`conversations` rows and calls `persistThroughRoom()` (`src/native-chat.ts:105`), which POSTs to the `ChatRoom` Durable Object (`CHAT_ROOMS` binding, `src/chat-durable.ts:8-23`). `ChatRoom.persist()` (`src/chat-durable.ts:15`):

1. Inserts the message into `conversation_messages`, updates `conversations`, inserts `conversation_activity` — all in one `env.DB.batch([...])`.
2. Broadcasts the persisted message to connected customer/staff WebSockets on that room (`this.broadcast(...)`).
3. Only after persistence, POSTs a non-PII event to the `StaffChatHub` Durable Object:

```ts
const hub = this.env.CHAT_STAFF_HUB;
if (hub) await hub.getByName("staff-events").fetch("https://staff-hub/event", {
  method: "POST",
  ...
  body: JSON.stringify({
    id: `message:${id}`,
    type: sequence === 1 ? "conversation:new" : "message:new",
    conversationId, sequence,
    senderKind: payload.senderKind,
    assignedResponderId: conversation?.assigned_responder_id ?? null,
    createdAt: now,
  }),
});
```
(`src/chat-durable.ts:19`)

`StaffChatHub.deliver()` (`src/chat-durable.ts:28`) does exactly two things with that event, both native to the platform:
- Sends the event over any currently-connected authenticated staff WebSocket whose `responderId` is a target (`socket.send(payload)`).
- Calls `dispatchPushEvent(this.env, event)` (`src/push.ts:79`), which sends a **standards-based Web Push notification** (VAPID, via the `web-push` npm package) to registered staff device subscriptions in `push_subscriptions`:

```ts
const response = await send(
  { endpoint: row.endpoint, keys: { p256dh: row.p256dh, auth: row.auth } },
  JSON.stringify(payload),
  { vapidDetails: { subject: env.VAPID_SUBJECT!, publicKey: env.VAPID_PUBLIC_KEY!, privateKey: env.VAPID_PRIVATE_KEY! }, ... }
);
```
(`src/push.ts:92-95`)

**This refutes the prior claim ("routes directly to the team's phone via a messaging app, no AI involved") as a description of current code.** There is no Telegram/WhatsApp/Signal/SMS integration in the live-chat delivery path. Delivery is: (a) same-origin authenticated WebSocket to the staff PWA while foregrounded, and (b) standards-based Web Push to the staff PWA (installable to a phone home screen) while backgrounded. No AI is involved either way, so that part of the claim holds; the "messaging app" part does not — it's the operator's own PWA, not a third-party messenger.

A vestigial third-party-messaging concept does exist: `src/messaging.ts` (`MessagingProvider`, `MESSAGING_PROVIDER`/`MESSAGING_DESTINATION_URL` env vars) and `resolveChatStatus()`. Its only caller is `src/staff-api.ts:28-37`, inside `operationsStatus()` for `GET /v1/internal/status` — it only affects a `messaging: { configured, provider }` display field on the internal staff status dashboard. It is **never** called from the public `/v1/chat/status` route (that uses the separate, D1-only `nativeChatStatus()` in `src/native-chat.ts:18-23`) and never participates in message delivery. **This adapter concept exists in code but is dead for the actual chat/notification path** — flagged as a discrepancy: `docs/operations-foundation.md` describes it as the original "shared destination" chat design, while `docs/native-web-chat.md` describes the newer native-D1 chat that has since replaced it as the live transport.

**2. Does live chat write to D1, or bypass it?**

Writes to D1 entirely, and D1 is authoritative — written before any broadcast (`src/chat-durable.ts:15-19`: `env.DB.batch([...])` runs, then `this.broadcast(...)`, then the staff-hub POST). **No bypass path exists.** The conversation model is not aspirational for live chat — it is live chat's actual, sole storage.

### C. The offline/contact form endpoint — does it currently do anything?

**1/2/3. No separate "Send us a Message" contact-form endpoint exists — it is not a distinct backend feature.**

Searched `src/*.ts`, `openapi.yaml`, and route dispatch in `src/index.ts` for a distinct contact/message route. The only three public POST-capable endpoints are:

- `POST /v1/inquiries` — the structured "Check Availability"/event-inquiry form (`src/index.ts:28` → `publicInquiry()` → `createFocusInquiry` in `src/inquiry-adapters.ts`; strict schema in `src/contracts.ts:8-43`; persists `contacts`/`events`/`inquiries`/`inquiry_services`/`activities` in a D1 batch; no email is sent).
- `POST /v1/chat/conversations` — native chat start (`src/index.ts:32` → `startNativeConversation` in `src/native-chat.ts:25`).
- `POST /v1/chat/conversations/{id}/messages` — native chat reply (`src/index.ts:34` → `publicConversationRoute` in `src/native-chat.ts:38-51`).

**"Send us a Message" is not a separate form — it is literally the button label the native chat channel shows when no responder is currently live**, computed by `nativeChatStatus()`:

```ts
return { state: live ? "live" : "async", label: live ? "Live Chat" : "Send us a Message", destinationUrl: null, checkedAt: now };
```
(`src/native-chat.ts:22`)

The frontend calls `GET /v1/chat/status` to decide which label to show, then both "Live Chat" and "Send us a Message" submit through the **exact same** `POST /v1/chat/conversations` endpoint and land in the **exact same** `conversations`/`conversation_messages` tables — the only difference is a UI label and (per `docs/native-web-chat.md`) whether the widget promises a response time. **There is no separate "offline contact form" backend in this repo distinct from native chat.**

(Note: `src/messaging.ts`'s `resolveChatStatus()` independently defines a similarly-named `"Send us a DM"` label for the legacy `MessagingProvider` status shown only on the internal `/v1/internal/status` dashboard — a second, inconsistent definition of the same UX concept, worth flagging.)

Note also: `/v1/inquiries` ("Check Availability") is a fully separate, working, D1-persisting endpoint — but it is not what `native-web-chat.md` or `staff-web-push.md` mean by "Send us a Message."

### D. Staff app / "CMS" — web and phone

**1. Native app, PWA, or plain web app?**

It is a **PWA**, not a native app:
- `staff-app/public/manifest.webmanifest`: `"display":"standalone"`, `"start_url":"/#/inbox"`, `"scope":"/"`, icons — a real installable web-app manifest.
- `staff-app/public/sw.js` and `staff-app/src/lib/service-worker-source.mts` — a real service worker (app-shell caching only).
- Stack: React 19 + Vite, hash-based routing — a plain SPA, not SSR.
- No Capacitor, no React Native, no `.podspec`/Android project files anywhere under `staff-app/`.
- Deployed as static assets bound into the same Worker via `assets.directory: "staff-app/dist"` with `run_worker_first: true` in `wrangler.jsonc:9-14` and `deployments/focus-lab/console.staging.jsonc:9`.

**2. Staff authentication — current state.**

Real, working code in `src/auth.ts`:
- Production/staging path (`authenticateStaff`, `src/auth.ts:25-36`): requires `Cf-Access-Jwt-Assertion` header, verifies RS256 signature via `jose`'s `createRemoteJWKSet` against `<ACCESS_TEAM_DOMAIN>/cdn-cgi/access/certs`, validates issuer/audience/expiry (`verifyAccessAssertion`, `src/auth.ts:38-49`), requires both `sub` and `email` claims. Genuine JWT verification, not a stub.
- Authorization: `resolveStaffIdentity()` (`src/auth.ts:51-61`) maps the verified Access subject/email to a D1 `responders` row, requires `active=1`, binds the Access `sub` to the responder on first login, returns a typed `StaffIdentity`. Permission checks are a real static role→permission map (`src/auth.ts:11-15`), enforced per-route (e.g. `requirePermission(actor,"assignment:manage")` in `src/native-chat.ts:80`).
- Development-only bypass (`authenticateDevelopment`, `src/auth.ts:63-73`): a shared bearer token (`INTERNAL_API_TOKEN`) compared with constant-time SHA-256 (`secureTokenMatches`, `src/auth.ts:78-80`), gated by `authenticateStaff`'s check that **both** `ENVIRONMENT=development` and `STAFF_AUTH_MODE=development` are set (`src/auth.ts:28`). Staging config (`wrangler.jsonc:112`, `deployments/focus-lab/api.staging.jsonc:21`) sets `STAFF_AUTH_MODE:"access"`, so this bypass cannot run there.

Nothing found that is a hardcoded/fake token or a TODO stub — this is real end-to-end, matching the docs' claims.

**3. Does the staff app render a conversation list from D1?**

Yes. `staff-app/src/views/ChatView.tsx:12` calls `client.conversations()` → `GET /v1/internal/conversations` (`staff-app/src/lib/api.ts:14`) → `src/staff-api.ts:106-114`, a direct D1 query joining `conversations`, `contacts`, `events`, with a computed `unread_count` subquery against `conversation_messages`/`conversation_reads`.

List item fields actually rendered (`staff-app/src/views/ChatView.tsx:24`):

```jsx
<button ...><div><h3>{item.full_name}</h3><p>{item.provider === "native_web" ? "Website chat" : humanize(item.provider)}</p></div>
<div>{Number(item.unread_count) > 0 ? <span className="badge warning">{item.unread_count} unread</span> : <span className="badge neutral">Read</span>}
<time dateTime={item.last_message_at ?? item.updated_at}>{formatDateTime(item.last_message_at ?? item.updated_at)}</time></div></button>
```

i.e.: customer full name, provider label ("Website chat" for `native_web`), unread badge/count, last-message/updated timestamp. `channel_state` is fetched by the query but is **not rendered anywhere** in this component.

**4. Reply interface — which channels actually work?**

Only one channel actually sends messages to a customer, and it is real: the "Send reply" form in `staff-app/src/views/ChatView.tsx:25` calls `client.reply(id, body)` (`staff-app/src/lib/api.ts:16`) → `POST /v1/internal/conversations/{id}/messages` → `src/native-chat.ts:74-77` → `persistThroughRoom()` → the same `ChatRoom` Durable Object used for customer messages → D1 persist + WebSocket broadcast. If the customer's socket is not connected, `chat-durable.ts:19` triggers `notifyCustomerOfAbsentReply()` (`src/customer-continuity.ts`), which sends a Resend transactional email with a resume link (see Section E).

So the working reply channels are: **in-app/WebSocket (always)** and **email (automatic fallback, not a separate staff action)**. No SMS or call-initiation code was found in `staff-app/src/**` — only `tel:`/`mailto:` links on the unrelated Inquiry Detail page, which just open the OS's own phone/mail app rather than sending anything through this system.

### E. Email infrastructure

**1. Is there an email-sending integration? What's it used for, how is it configured?**

Yes — Resend, via raw `fetch`, not an SDK (`package.json` has no `resend`/`nodemailer`/`sendgrid`/`postmark` package). `src/customer-email.ts:25-47` implements `ResendCustomerNotificationEmailProvider`:

```ts
const response = await this.fetcher("https://api.resend.com/emails", {
  method: "POST",
  headers: { Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json", "Idempotency-Key": message.idempotencyKey },
  body: JSON.stringify({ from: this.from, to: [message.to], subject: `${this.shortName} replied to your message`, text, html: emailHtml(...) }),
});
```

Used for exactly **one** purpose today: notifying an absent customer that a staff reply is waiting, with a one-time resume link (`src/customer-continuity.ts: notifyCustomerOfAbsentReply`, triggered only from `src/chat-durable.ts:19`). Not used for inquiry confirmations, staff notifications, or anything else — `docs/operations-foundation.md` explicitly states no email is sent for `/v1/inquiries`, and no other Resend call site exists in `src/`.

Configuration: `RESEND_API_KEY` and `CUSTOMER_EMAIL_FROM` (both required together — `src/customer-email.ts:20` throws `CustomerEmailConfigurationError` if either is missing), declared in `secrets.d.ts:20-21`. Neither appears in any committed `wrangler*.jsonc` `vars` block or in `secrets.required` for `deployments/focus-lab/api.staging.jsonc` (which only requires `VAPID_*` and `GOOGLE_CALENDAR_*`) — confirming these Resend credentials are **not yet provisioned on staging**. `CUSTOMER_CONVERSATION_ORIGIN` (fallback `PUBLIC_SITE_ORIGIN`) supplies the resume-link base URL (`src/customer-continuity.ts:39`).

**2. Is Cloudflare Queues used anywhere?**

**Not used.** `grep -rln "queue" wrangler.jsonc wrangler.public-staging.jsonc deployments/*/*.jsonc src/*.ts` returned nothing relevant. The only match for `Queue` in the repo is the Cloudflare-generated ambient type `interface Queue<Body = unknown>` in the auto-generated `worker-configuration.d.ts` (standard Wrangler type library) — never bound, never referenced from any handler. Confirmed unused.

### F. Secrets and environment conventions

Verbatim secret/env names, cross-checked across `secrets.d.ts`, `.dev.vars.example`, `wrangler.jsonc`, `wrangler.public-staging.jsonc`, `deployments/focus-lab/{api,console}.staging.jsonc`, and `env.SOMETHING` references in `src/`:

- `INTERNAL_API_TOKEN` — dev-only staff bearer auth.
- `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD` — Cloudflare Access config (non-secret identifiers).
- `MESSAGING_PROVIDER`, `MESSAGING_DESTINATION_URL` — legacy/vestigial third-party messaging destination config, display-only (see Section B).
- `TURNSTILE_SECRET_KEY`, `TURNSTILE_EXPECTED_HOSTNAME`, `TURNSTILE_TEST_BYPASS` — bot protection for `/v1/inquiries`.
- `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` — Web Push.
- `RESEND_API_KEY`, `CUSTOMER_EMAIL_FROM`, `CUSTOMER_CONVERSATION_ORIGIN` — email continuity.
- `GOOGLE_CALENDAR_SERVICE_ACCOUNT_KEY`, `GOOGLE_CALENDAR_ID` — the scheduling/availability system's naming convention (`src/availability-cache.ts:37`, `src/google-calendar.ts:17`). Confirms the naming style: `<PROVIDER>_<RESOURCE>_<CREDENTIAL_TYPE>`, e.g. `GOOGLE_CALENDAR_SERVICE_ACCOUNT_KEY`, `RESEND_API_KEY`, `VAPID_PRIVATE_KEY` — all `SCREAMING_SNAKE_CASE`, secrets never placed under any `NEXT_PUBLIC_*`/`VITE_*` prefix.
- `INQUIRY_RATE_LIMITER`, `CHAT_RATE_LIMITER`, `AVAILABILITY_RATE_LIMITER` — Workers Rate Limiting bindings (non-secret, `wrangler.jsonc:29-53`).
- Non-secret vars also present: `PUBLIC_SITE_ORIGIN`, `CONCURRENT_EVENT_CAPACITY`, `PRESENCE_TIMEOUT_SECONDS`, `ENVIRONMENT`, `STAFF_AUTH_MODE`, `STAFF_HOSTNAME`, `BUSINESS_TIMEZONE`, `AVAILABILITY_WINDOW_MONTHS`, `AVAILABILITY_CACHE_STALE_MINUTES`, `BUSINESS_PROFILE`, `DEPLOYMENT_KEY`, `PUBLIC_API_ENABLED`, `NATIVE_CHAT_BACKEND`, `VAPID_KEYSET_ID`.

### Cross-cutting doc/code discrepancy (operator-os)

`docs/native-web-chat.md`'s "Required staging sequence" (`npm run staff:build:staging`, `npm run ops:staging:migrate`, `npx wrangler deploy --config operations/wrangler.public-staging.jsonc`, `npm run ops:staging:deploy`, `npx wrangler deploy --config wrangler.staging.jsonc`) does not match any script or config path in this repo today. Actual `package.json` scripts are `staff:build:focus:staging`, `focus:staging:migrate`, `focus:staging:deploy:api`, `focus:staging:deploy:console` (and `moses:*` equivalents), targeting `deployments/focus-lab/api.staging.jsonc` / `deployments/focus-lab/console.staging.jsonc` — there is no `operations/` directory prefix and no `wrangler.staging.jsonc` file anywhere in this repo (`find . -iname "wrangler.staging.jsonc"` returns nothing). This is a consequence of the business-neutral extraction (`README.md`: "Focus staging uses `deployments/focus-lab/`") post-dating that doc. The doc's **architecture/behavior claims** (D1 model, DO transport, notification mechanics) were independently verified against code and hold up; its **staging runbook commands are stale**.

---

## Part 2 — Sunny-ops (public site repo)

### G. Offline form UI

**1. Component, fields, and submit handler.**

The "Send us a Message" UI is **not** `CheckAvailabilityForm.tsx` or `AvailabilityChecker.tsx` — those implement a separately-wired structured "Check Availability"/inquiry flow that POSTs to `/v1/inquiries` via `submitInquiry()` in `lib/operations-api.ts` (confirmed real fetch, `components/sections/CheckAvailabilityForm.tsx:70`).

The actual "Send us a Message" drawer is the async-mode branch of `PublicChatProvider` in `components/operations/NativeChatPanel.tsx` (line 25; JSX is a single unbroken line — relevant fragment):

```jsx
<form onSubmit={start}>
  <label>Name<input name="name" autoComplete="name" maxLength={120} required/></label>
  <label>Email<input name="email" type="email" inputMode="email" autoComplete="email" spellCheck={false} maxLength={254} required/></label>
  <label>Phone (optional)<input name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={40}/></label>
  <label>How can we help?<textarea name="message" autoComplete="off" maxLength={2000} required/></label>
  <label className="chat-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label>
  <button disabled={sending}>{sending ? "Sending…" : mode === "live" ? "Start Conversation" : "Send Message"}</button>
</form>
```

Exact current fields: **Name** (required), **Email** (required, `type="email"`), **Phone** (optional, `type="tel"`), **message** ("How can we help?", required textarea, `maxLength=2000`), plus a hidden/`aria-hidden` honeypot field named `website` (bot trap, not a real user field). No subject/company field exists.

This is **not** UI-shell-only. The submit handler `start` (`NativeChatPanel.tsx:23`) makes a real `fetch` POST:

```ts
async function start(event) {
  event.preventDefault(); setSending(true); setError("");
  const form = new FormData(formElement);
  const response = await fetch(`${apiBaseUrl}/v1/chat/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: form.get("name"), email: form.get("email"), phone: form.get("phone") || undefined,
      message: form.get("message"), website: form.get("website"), clientMessageId: crypto.randomUUID(),
    }),
  });
  const body = await response.json();
  if (!response.ok || !body.conversation || !body.message) throw new Error();
  sessionStorage.setItem(storageKey, JSON.stringify(body.conversation));
  setSession(body.conversation); setMessages([body.message]);
  if (mode === "async") setComplete(true);
  formElement.reset();
  // catch: setError("We couldn't send your message. Please try again. Your information is still on this page.");
}
```

`apiBaseUrl` defaults to `""` (relative). It is mounted with no override in `app/layout.tsx:29` (`<PublicChatProvider>`), so in production it depends on the same-origin facade Worker `operations/src/public-site.ts` (lines 1–18) forwarding `/v1/chat/conversations` etc. to the `OPERATIONS_API` service binding — confirmed: `path.startsWith("/v1/chat/conversations")` is forwarded. Client-side validation is limited to HTML `required`/`maxLength`/`type="email"` attributes; there is **no Turnstile widget** in this component (unlike `CheckAvailabilityForm.tsx`, which imports `TurnstileWidget`). No client-side gate/flag (like `inquirySubmissionEnabled`) exists for this chat-start form — it always attempts the POST when submitted.

**2. Copy match.**

Exact match found. `components/operations/NativeChatPanel.tsx:25`, inside the trailing `<small>`:

```jsx
<small>{mode === "live"
  ? "A responder is currently available. No response-time guarantee is implied."
  : "Send your message and continue with your day. No response time is promised."}</small>
```

The async-branch string is character-for-character `"Send your message and continue with your day. No response time is promised."` — `components/operations/NativeChatPanel.tsx`, line 25 (single-line JSX; last conditional expression before the closing `</section>`).

### H. Session / anonymous visitor handling

**1. Is there an anonymous visitor/session ID generated and stored client-side?**

**No generic anonymous visitor/session ID exists.** Searched `lib/`, `components/` for `localStorage`, `sessionStorage`, `document.cookie`, `crypto.randomUUID`, `visitor`/`anonymous` identifiers. Findings:

- `NativeChatPanel.tsx:12` (`storageKey = "focuslab.nativeChat.session.v1"`) and `:18/:23` — stores a **per-conversation** `{id, resumeToken}` pair in `sessionStorage`, but only *after* a chat/message conversation is started server-side. Nothing is generated on page load.
- `ConversationResume.tsx:7,17,24` — a second, separate `sessionStorage` key `focuslab.conversationResume.v1` for the email "Continue conversation" resume flow (`/conversation/` route), also per-conversation, not a site-wide visitor ID.
- `crypto.randomUUID()` appears in three places, none a persistent identity: `NativeChatPanel.tsx:23` (`clientMessageId` for chat-start idempotency), `:24` (`clientMessageId` per chat message), and `CheckAvailabilityForm.tsx:68` (`idempotencyKey.current ??= crypto.randomUUID()`, generated lazily inside the submit handler, one-shot per inquiry submission, never persisted/reused across page loads).
- `components/planning/PlanProvider.tsx:35/43/50` uses `sessionStorage` only for the "plan/quote builder" cart selections — unrelated to visitor identity.

No cookie-based or crypto-generated visitor ID is created on mount/page-load anywhere in the codebase, and nothing is attached to form submissions to identify a browser across separate forms/sessions.

**2. Does the live chat widget use a session/identity concept the offline form could reuse?**

Yes, but scoped narrowly: once a conversation is started via `POST /v1/chat/conversations`, the server-issued `{id, resumeToken}` pair becomes the widget's identity — stored in `sessionStorage` (`NativeChatPanel.tsx:23`), used to open the reconnect WebSocket (`:19`, `resume` query param) and to authenticate follow-up sends via header `X-Chat-Resume-Token` (`:24`). This resume token exists **only after** that specific conversation begins; it is not generated speculatively for anonymous visitors before they interact, and it is **not shared** with the offline `CheckAvailabilityForm` inquiry flow (which instead uses a one-shot, non-persisted idempotency key). A "durable anonymous conversation token" for reconnection would be new work — there is a narrow precedent (the resume-token pattern) but no reusable general mechanism today.

### I. Current button/label logic

**1. Live/offline switching logic and its data source.**

This is a **real API call**, not a manual toggle or hardcode. State is set from a `fetch` to `/v1/chat/status`, called unconditionally on mount with no feature-flag gate (`NativeChatPanel.tsx:18`):

```ts
useEffect(() => {
  const controller = new AbortController();
  fetch(`${apiBaseUrl}/v1/chat/status`, { signal: controller.signal, cache: "no-store" })
    .then(async (response) => { if (!response.ok) throw new Error(); return await response.json(); })
    .then((body) => { if (body.state) { setStatus(body.state); track(...); } })
    .catch(() => setStatus("unavailable"));
  ...
}, [apiBaseUrl]);
```

The button itself (`PublicChatTrigger`, line 28):

```jsx
export function PublicChatTrigger({ className = "", onOpen }) {
  const chat = useContext(ChatContext);
  if (!chat || chat.status === "unavailable") return null;
  return <button ...>
    {chat.status === "live" ? <span aria-hidden="true">● </span> : null}
    {chat.status === "live" ? "Live Chat (No Bots)" : "Message Us (No Bots)"}
  </button>;
}
```

So: `status === "unavailable"` → button renders `null` (nothing shown, in header, mobile menu, or the `ChatTeaser`); `status === "live"` → label "Live Chat (No Bots)"; `status === "async"` → label "Message Us (No Bots)". The underlying `live`/`async`/`unavailable` classification is computed entirely **server-side** by whatever answers `/v1/chat/status` (that logic lives in operator-os — see Part 1, Section C — `nativeChatStatus()` in `src/native-chat.ts:18-23`); the public site UI does not compute presence itself, it is a pure consumer of that endpoint's `state` field. No env var, constant, or manual config in this repo overrides this.

This trigger is actively mounted in the header (`components/layout/Header.tsx:168` desktop, `:231` mobile menu) and in `ChatTeaser.tsx:31` (delayed teaser bubble), all wrapped by `PublicChatProvider` in `app/layout.tsx:29`.

**Documentation contradiction to flag:** `docs/native-web-chat.md`'s own "Deferred" section states public visual insertion is "deferred," and its "Security and abuse baseline" section calls it "the unmounted chat seam." Both statements are contradicted by the same document's "Status"/"Public integration behavior" sections (claims header/mobile-menu integration "passed" validation) and by the actual code: the chat trigger **is** currently mounted in the live header/mobile-menu/teaser. Practically, this means the async "Send us a Message" POST endpoint is publicly reachable today with only a client-side honeypot field and **no Turnstile widget** in this component — worth confirming server-side abuse controls (rate limiting, Turnstile) actually cover `/v1/chat/conversations` in the operator-os backend, since the public-site code shows no such client-side protection for this specific form (unlike the inquiry form, which does render `TurnstileWidget`).

### Bonus: lib/operations-api.ts findings

`lib/operations-api.ts` is the public site's typed client for the operator-os backend Worker. It calls:

- **`POST {apiUrl}/v1/inquiries`** — `submitInquiryWithConfig()` (line 45), used by `CheckAvailabilityForm.tsx`'s `submit()`. Sends `Idempotency-Key` header and the full `InquirySubmission` body (event type, date, location, services, guests, budget, name, email, phone, contact, note, `turnstileToken`, `website` honeypot). Gated by `inquirySubmissionEnabled` (line 31), which requires `NEXT_PUBLIC_INQUIRY_SUBMISSION_ENABLED === "true"` **and** a non-empty `NEXT_PUBLIC_INQUIRY_API_URL` **and** a non-empty `NEXT_PUBLIC_TURNSTILE_SITE_KEY` — an explicit three-part launch gate, distinct from the chat trigger's unconditional always-attempt behavior.
- **`GET {apiUrl}/v1/chat/status`** — `getChatStatus()` (line 63). Only called by `LiveChatAction.tsx`, which is **not mounted anywhere** in the live UI (confirmed via repo-wide grep — an orphaned/unused "integration seam" component per its own comment). **Not** called by `NativeChatPanel.tsx`, which does its own separate raw `fetch` to the same endpoint (see Section I.1) rather than reusing `getChatStatus()`.
- **`GET {apiUrl}/v1/availability?date=...`** — `getAvailability()` (line 71), used by `AvailabilityChecker.tsx:29`. Designed to never throw — network failure, non-OK response, or misconfiguration all degrade to `{ ok: true, status: "unknown" }` rather than surfacing an error.
- No other endpoints (`/v1/chat/conversations*`, `/v1/chat/resume`) are called through `operations-api.ts` — those are called via raw `fetch` directly inside `NativeChatPanel.tsx` and `ConversationResume.tsx`, using relative same-origin paths (empty `apiBaseUrl`), not through this client module.

Relevance to C/I: the inquiry form has explicit, three-flag opt-in gating and Turnstile; the chat/presence system has no equivalent public-site-side feature flag — it always probes `/v1/chat/status` and shows/hides itself purely based on that live response, and its own POST endpoints (`/v1/chat/conversations`, `/v1/chat/resume`) are called outside `operations-api.ts` entirely, via two separate ad hoc `fetch`-based implementations rather than one shared client.

---

## Summary of contradictions flagged (for ADR authors)

1. **"Messaging app" claim is wrong for current code** (Part 1.B.1) — live chat notifies staff via Web Push + WebSocket to the staff PWA, not a third-party messaging app. A vestigial `MessagingProvider`/`MESSAGING_DESTINATION_URL` concept exists but only feeds an internal status dashboard field, never actual delivery.
2. **`docs/native-web-chat.md` staging runbook is stale** (Part 1, cross-cutting) — script names and config paths in the doc don't exist; actual paths reflect the later business-neutral `deployments/focus-lab/` extraction.
3. **`docs/native-web-chat.md` internally contradicts itself, and contradicts the code, on whether the chat trigger is mounted** (Part 2.I.1) — doc sections call it "deferred"/"unmounted" while other doc sections and the actual code show it live in the header/mobile menu/teaser today.
4. **Two independent, inconsistent definitions of the offline-mode label exist in operator-os** — `native-chat.ts` uses `"Send us a Message"`; `messaging.ts`'s dead `resolveChatStatus()` uses `"Send us a DM"` (Part 1.C.1).
5. **"Send us a Message" is not a distinct feature** — it is a label state of the same native chat conversation endpoint, not a separate contact-form backend (Part 1.C, confirmed from the public-site side in Part 2.G — both forms differ only in UI/copy, not in destination).
