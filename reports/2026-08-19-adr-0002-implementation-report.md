# ADR-0002 Implementation Report: Conversation Reply Preferences & Continuity

**Implements:** `ADR-0002-conversation-reply-preferences.md`
**Repos touched:** `operator-os` (backend/D1/staff PWA), `Sunny-ops` (public site)
**Status:** Code complete, verified locally. Not deployed to staging.

---

## Pre-work findings (confirm-only investigation, required before implementation)

1. **Boolean column convention**: this D1 schema never uses `BOOLEAN`. The existing convention (`responders.active`, `responder_presence.available`, `push_subscriptions.enabled`) is `INTEGER NOT NULL DEFAULT 0|1 CHECK (col IN (0,1))`. Migration 0007 follows this, not the ADR's literal `BOOLEAN` sketch.
2. **Resume-token TTL: none exists.** Checked `migrations/0005_customer_email_continuity.sql` (`conversation_resume_tokens` has no `expires_at` column) and `src/resume-tokens.ts` (`resolveConversationResumeToken` checks only existence + `revoked_at IS NULL`, no age check anywhere). This differed from what the ADR assumed. **Decision (confirmed with Moses):** the `localStorage`-persisted token has no client-side expiry either — resume is attempted whenever a stored token exists, and the server's live existence/revocation check is the only source of truth. No new backend field, no client-side age math.
3. **`CHAT_RATE_LIMITER` middleware: already applied.** `src/native-chat.ts` calls `enforceChatRateLimit()` in `startNativeConversation`, the message-POST branch of `publicConversationRoute`, and `publicResumeConversation`. Confirm-only, per the ADR's non-goals — no changes made.

**Additional finding beyond the three confirm-only items:** the execution prompt assumed `NativeChatPanel.tsx`'s reconnect "should mostly already work... verify rather than assume." It didn't, for the async drawer. Before this change, the component only reconnected an in-memory session while `mode==="live"` (WebSocket + `?resume=` query param). There was no code path resuming an async-only conversation on drawer reopen — that endpoint (`GET /v1/chat/resume`) was previously only used by the separate `/conversation/` page reached via the emailed resume link. Real new code was written for this, reusing that existing endpoint and the existing message-reconciliation helper.

---

## Part 1 — operator-os (backend)

| File | Change |
|---|---|
| `migrations/0007_conversation_reply_preferences.sql` | New. Adds `reply_email` (default 1), `reply_sms` (default 0), `reply_call` (default 0) to `conversations`, matching the existing boolean convention. |
| `src/native-chat.ts` | `startSchema` gains `replyEmail`/`replySms`/`replyCall` booleans + a `superRefine` enforcing: at least one selected; SMS/call require a phone number. `startNativeConversation` persists the three columns and fires the backup ops-notification email via `ctx.waitUntil()` after the D1 write succeeds. `conversationDetail()`'s query now selects the three columns too. |
| `src/ops-notify.ts` | New. `sendOpsNotification()` — Resend-based operational email to a new `OPS_NOTIFY_EMAIL` address, following the exact pattern of the existing `ResendCustomerNotificationEmailProvider`. Degrades silently (logs a warning, never throws to the customer) when `RESEND_API_KEY`/`CUSTOMER_EMAIL_FROM`/`OPS_NOTIFY_EMAIL` aren't configured. |
| `src/index.ts` | Threaded `ctx: ExecutionContext` through `fetch` → `route()` → `startNativeConversation()` (the only place it's newly needed). |
| `src/staff-api.ts` | `conversations()` list query now selects `reply_email`/`reply_sms`/`reply_call`. |
| `staff-app/src/lib/types.ts` | `Conversation` type extended with the three fields (flows into `ConversationDetail` automatically via intersection). |
| `staff-app/src/views/ChatView.tsx` | Conversation list item shows a "Prefers: Email + Text" badge (reusing the existing `badge neutral` style). Detail header adds `tel:`/`sms:` links when `reply_call`/`reply_sms` are set and a phone number exists — same bare-link pattern as the existing Inquiry Detail page, no automated send/receive implied. |
| `src/messaging.ts` | The dead `resolveChatStatus()` `"Send us a DM"` label (only ever shown on the internal status dashboard, never to a customer) is now commented as explicitly legacy/non-customer-facing, to avoid confusion with the real label in `native-chat.ts`. |
| `secrets.d.ts` | Added `OPS_NOTIFY_EMAIL?: string` next to `CUSTOMER_EMAIL_FROM` in both `Env` declarations. Not added to any `secrets.required` list — see Deploy Prerequisites below. |
| `test/native-chat.test.ts` | New test: persists reply preferences correctly on default and custom submission; server rejects "no method selected" and "SMS/call without phone" with 422. |
| `test/ops-notify.test.ts` | New. Unit tests: skips silently when unconfigured; sends correctly formatted Resend request when configured; throws (for the caller to catch/log) when Resend rejects. |
| `test/api.test.ts` | One assertion updated: migration count 6 → 7 (mechanical consequence of the new migration file). |

---

## Part 2 — Sunny-ops (public site)

| File | Change |
|---|---|
| `components/operations/NativeChatPanel.tsx` | Added a reply-preference checkbox fieldset ("Reply by email" / "Reply by text message" / "Reply by phone call", email pre-checked) to the async-mode form, under the Phone field. Client-side validation mirrors the server rules, with an inline error reusing the existing error-paragraph pattern. Chat-start session storage moved from `sessionStorage` to `localStorage`; on mount, a stored session now triggers a real resume attempt against `GET /v1/chat/resume` — on success the transcript renders and further replies work regardless of current live/async status; on failure (expired/revoked/network error) the stored token is cleared and a fresh form is shown silently, no error surfaced. Async-mode disclaimer copy changed from "No response time is promised" to "we'll get back to you using the method you selected." |
| `app/globals.css` | Added minimal styling for the new checkbox fieldset, matching the existing drawer's design tokens. |
| `docs/native-web-chat.md` | Removed the self-contradictory "deferred"/"unmounted chat seam" language (the trigger is live in the header/mobile-menu/teaser). Corrected the stale staging runbook to the real scripts/paths across both repos. Corrected the stale claim that Web Push wasn't operational (it is, via VAPID). Updated the reconnection description to reflect `localStorage` + no client-side TTL. |
| `tests/native-chat-preview.spec.ts`, `tests/public-chat-integration.spec.ts` | One-line locator fix: `getByLabel("Email")` → `getByLabel("Email", {exact: true})`. Needed because the new "Reply by email" checkbox's accessible name also substring-matches "Email" under Playwright's default fuzzy `getByLabel` matching. |
| `tests/chat-reply-preferences.spec.ts` | New. 5 end-to-end tests: default submission sends `replyEmail:true` only; blocks submission with no method selected; blocks SMS/call without a phone number then succeeds once filled; reopening the site with a stored conversation resumes it instead of starting fresh; an invalid/revoked stored token falls back silently to a clean form. |

---

## Verification performed

- **Typecheck**: clean in both repos (`npm run typecheck`, `npm run staff:typecheck`).
- **Lint**: clean in both repos (`npm run lint`, `npm run staff:lint`).
- **Backend tests**: 138/138 passing (`npm run test:operations` in `operator-os`), including new coverage for reply-preference validation/persistence and the ops-notification email.
- **Frontend tests**: full chat/inquiry/smoke Playwright suite green on desktop and mobile viewports, including 5 new reply-preference/reconnection tests (23 tests total across the affected spec files, run together to check for interaction effects).
- **Manual UI check**: screenshotted the updated drawer on desktop and mobile against a running dev server — checkbox group renders correctly, styling matches the existing drawer.

**One pre-existing, unrelated test failure left alone** (not caused by this work): `staff-app/src/lib/business-profile.test.ts` has 2 failing tests, caused by an uncommitted `availability` capability already added to `business-profiles.mts` before this task started, with no matching test update. Confirmed via `git diff` that this file was already modified prior to any of today's changes.

---

## Deploy prerequisites (not code — operational steps)

- `OPS_NOTIFY_EMAIL`, `RESEND_API_KEY`, and `CUSTOMER_EMAIL_FROM` need to be provisioned as staging secrets before the backup notification email can actually send. None of the three are currently in `deployments/focus-lab/api.staging.jsonc`'s `secrets.required` — `RESEND_API_KEY`/`CUSTOMER_EMAIL_FROM` were already absent before this work (confirmed in the original audit), so this isn't a new gap, just one that now has a second feature depending on it.
- Until those are provisioned, the code path degrades gracefully: the backup email is silently skipped (logged, not thrown), and staff still get the existing Web Push + WebSocket notification.

## Explicit non-goals honored (per the ADR)

No SMS/voice sending integration. No Cloudflare Queues. No changes to `channel_state`, `contacts.preferred_contact`, or the `/v1/inquiries` flow. No new CAPTCHA/Turnstile on the chat form. No pre-conversation anonymous visitor ID generation.
