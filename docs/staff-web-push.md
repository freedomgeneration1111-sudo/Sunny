# Staff Web Push

## Physical validation

Staff Web Push was accepted on 2026-08-12 after physical staging validation:

- Desktop Firefox: deliberate opt-in, server-generated test notification, background customer push, notification click to the correct conversation, and foreground duplicate suppression passed.
- Installed Android staff PWA: deliberate opt-in, server-generated test notification, background customer push, and notification click to the correct conversation passed.
- Physical iPhone Web Push validation is deferred until the device is available and is not a blocker.

The core Web Push phase is closed unless later testing reveals a regression.

## Scope and architecture

Staff Web Push is an alerting convenience layered after the accepted native chat persistence and realtime path. D1 conversations, unread state, history recovery, and foreground chimes remain authoritative.

- The Access-protected staff Worker owns subscription registration, removal, status, and foreground activity leases.
- The native chat API Worker owns push routing because it receives the authoritative post-persistence customer event.
- Both isolated staging Workers share the same D1 database.
- Each browser/Home Screen installation is a separate subscription associated with the authenticated responder. Responders may register multiple devices.
- Delivery runs through the Durable Object execution context after message persistence. Push failure cannot roll back or reject the customer message.

## Routing

- New unassigned chat with confirmed-live responders: notify those available responders.
- Assigned conversation: notify only the assigned responder, regardless of general availability.
- Unassigned async message with nobody live: notify active managers/admins. If none exist, fall back to active responders.
- Responder-authored messages, read changes, internal notes, presence heartbeats, and replayed message IDs do not create push alerts.

Each event/device pair has one delivery-ledger row. A replay cannot send a second push. HTTP 404 and 410 responses disable the dead subscription; other failures are recorded without indefinite retry.

## VAPID and payload privacy

Staging uses its own VAPID key pair. `VAPID_PRIVATE_KEY` is a secret on the native chat API Worker only. The shared public key is exposed to the authenticated staff client through `/v1/internal/push/config`; no private value is returned or committed. `VAPID_SUBJECT` identifies the staging staff application.

Lock-screen payloads contain only notification type, conversation ID, generic title/body, safe internal route, and unread-conversation badge count. They do not contain customer name, phone, email, message body, or event details.

## Foreground duplication and badges

An enabled device reports a 45-second foreground lease, refreshed every 30 seconds only while the document is both visible and focused. Visibility change, blur, and page hide immediately clear the lease. A connected WebSocket does not classify a hidden tab as foreground. The server excludes a truly active device from push while its existing realtime chime handles the event. Other routed devices may still receive push. If lifecycle reporting fails, unread state and conversation history remain authoritative.

Where supported, the app badge is the count of conversations containing unread customer work, not the raw number of message events. Badge APIs are feature-detected and never required.

## iPhone behavior

iPhone/iPad Web Push requires iOS/iPadOS 16.4 or later and an installed Home Screen web app. Permission is requested only from the deliberate **Enable notifications** button in Focus Lab Operations. A normal Safari tab is not treated as equivalent to the installed PWA. Tapping a notification opens `/#/chat?conversation=...`; if Access has expired, normal Access authentication occurs before the staff app resumes the route.

## Staff control and staging diagnostics

The opt-in control is in **Status → Notifications**, as the first Status card on desktop and mobile. The source component is named SettingsView.tsx, but the user-facing navigation label is **Status**.

The card never disappears. It reports **Not Enabled**, **Enabled**, **Blocked**, **Unsupported**, or **Error**, and always provides a next action. In staging, the expanded diagnostics show secure-context state, required browser APIs, permission, active service-worker/version state, browser subscription state, VAPID configuration, authenticated registration result, D1 registration state/count, foreground lease, and last delivery success/failure.

After subscription succeeds, **Send test notification** calls the authenticated staff endpoint, which uses the existing service binding to reach the API Worker that owns the private VAPID key. The API Worker sends a real standards-based Web Push payload to that device; the page does not construct a local notification.

## Service-worker cache boundary

The service worker continues to cache only the app shell and static assets. `/v1/` internal APIs, Cloudflare Access paths, CRM payloads, and Access responses are never cached. Navigation is network-first with `no-store`, retaining only the existing shell fallback.

## Staging provisioning and deployment

Use one generated public/private pair for both staging Workers. Never commit or print the private key.

1. Apply `operations/migrations/0004_staff_web_push.sql` through the checked-in D1 migration command.
2. Set `VAPID_PUBLIC_KEY` on `focus-lab-operations-staging`.
3. Set `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, and `VAPID_SUBJECT` on `focus-lab-api-staging`.
4. Deploy the API Worker, then the staff Worker. Do not deploy production.

Rotating the VAPID key pair invalidates existing browser subscriptions and requires staff to enable notifications again.
