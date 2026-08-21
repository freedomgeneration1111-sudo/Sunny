# Production staff authentication and authorization

Status: code foundation implemented. **Updated 2026-08-21:** the Cloudflare dashboard resources described below (Access self-hosted application, custom domain) are now configured and deployed — `staff.focuslabproductions.com` is live, Access-protected, and verified working end-to-end (unauthenticated requests 302 to the configured team-domain login). Real staff mappings remain a per-person administrative process (§ "Approved tester mapping").

## Architecture and trust boundaries

```text
staff.focuslabproductions.com (Cloudflare Access self-hosted application)
  -> explicit per-user identity allow policy
  -> Cf-Access-Jwt-Assertion
  -> same Worker serves static PWA and /v1/internal/*
  -> Worker verifies RS256 signature, issuer, AUD and expiry via rotating Access JWKS
  -> D1 maps stable Access subject / verified email to an active responder and role
  -> explicit permission check
  -> CRM mutation and authenticated audit actor
```

Cloudflare Access authenticates who the person is. D1 authorizes whether that identity is active Focus Lab staff and what application operations are permitted. Merely reaching an Access-protected hostname is not trusted. The Worker validates `Cf-Access-Jwt-Assertion` independently, following Cloudflare's current [JWT validation guidance](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/). Plain email headers and unsigned token decoding are never authentication.

For the current small trusted staff group, the approved policy is Cloudflare Access with an exact per-user email allowlist, Google or email OTP authentication, D1 active-user and role authorization, and a 24-hour session. Independent MFA is deferred. Its absence is not a blocker for staging or initial production. Stronger authentication can later be scoped to privileged admin or destructive operations after those operations exist and their risk is reviewed.

Access signing keys rotate. `jose` remote JWKS resolution reads `<team-domain>/cdn-cgi/access/certs`, selects by `kid`, and refreshes keys when required; the endpoint itself is served through Cloudflare. Configuration supplies the exact HTTPS issuer/team domain and immutable application AUD.

## Implemented in code

- RS256 signature, exact issuer, expected audience, expiry, subject, and email validation.
- D1 migration `0002_staff_access_identity.sql`: unique Access subject, unique normalized verified email, and `admin | manager | responder` role.
- First successful match by pre-authorized verified email binds the stable Access subject; subsequent access resolves by subject.
- Unknown, inactive, unmapped, malformed, expired, wrong-issuer, and wrong-AUD identities fail closed.
- `GET /v1/internal/me` returns the minimal current staff context.
- All meaningful mutations derive their actor from authentication; request bodies cannot select an audit actor.
- Same-origin staff assets and internal API from one Worker. Static assets are served only on configured `STAFF_HOSTNAME` values; the public API hostname does not expose the staff shell.
- Development bearer authentication runs only when both `ENVIRONMENT=development` and `STAFF_AUTH_MODE=development` are explicit.
- Any non-development runtime defaults to Access and does not accept the legacy bearer token.

## Permission matrix

| Capability | Responder | Manager | Admin |
|---|---:|---:|---:|
| Read CRM, schedule, conversations, responder status | Yes | Yes | Yes |
| Add internal notes and update normal workflow | Yes | Yes | Yes |
| Assign or unassign self | Yes | Yes | Yes |
| Assign or unassign another responder | No | Yes | Yes |
| Change capacity-blocking state | No | Yes | Yes |
| Change own live-chat presence | Yes | Yes | Yes |
| Future staff administration | No | No | Reserved |

No destructive staff-administration UI or endpoint is implemented. Assignment never changes presence.

## Environment configuration

Local checked-in Wrangler values are explicitly development-only. Local secrets remain in ignored `operations/.dev.vars`:

```dotenv
INTERNAL_API_TOKEN=local-only-random-value
```

Staging and production must configure non-secret variables independently:

```text
ENVIRONMENT=staging | production
STAFF_AUTH_MODE=access
STAFF_HOSTNAME=staff.focuslabproductions.com,focus-lab-operations-staging.freedomgeneration1111.workers.dev
ACCESS_TEAM_DOMAIN=https://<team-name>.cloudflareaccess.com
ACCESS_AUD=<Access application AUD tag>
```

`ACCESS_TEAM_DOMAIN` and `ACCESS_AUD` are identifiers, not credentials, but must be exact. Do not place service tokens or private credentials in Vite variables. The staff production client uses same-origin requests with Access cookies and never asks staff to paste a token.

## Same-origin decision: adopted, within each Worker

**Corrected 2026-08-21 to match what's actually deployed** (the original draft of this section described a single Worker owning two custom domains — that was never what got built; see git history if the earlier text is needed).

The real topology is **two separate Workers**, each independently same-origin, not one Worker gated by hostname across two domains:

```text
focuslabproductions.com/               -> public marketing site (Worker: focus-lab-public-staging)
focuslabproductions.com/v1/*           -> proxied via OPERATIONS_API service binding, same origin

staff.focuslabproductions.com/         -> staff PWA assets (Worker: focus-lab-operations-staging)
staff.focuslabproductions.com/v1/internal/* -> protected internal API, same Worker
```

`focus-lab-operations-staging` (the staff Worker) uses Cloudflare [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/) with `run_worker_first: true`, so its own hostname gate (`isStaffAssetHost`) runs before any staff asset is served — this part of the original design is real and in effect, just scoped to one Worker rather than shared across two custom domains on a single Worker. `focus-lab-public-staging` (the public site) is a distinct Worker with its own `OPERATIONS_API` service binding to the backend (`focus-lab-api-staging`); it never serves staff assets and has no hostname-gating logic of its own to bypass. Both Workers reach the same backend D1/CRM, just through separate service bindings (`OPERATIONS_API` vs `CHAT_API`) — see `docs/native-web-chat.md`'s "Staging topology" section for the full binding map.

This still achieves the original goal (no cross-origin cookie/CORS ambiguity for the installed staff PWA, Access protecting only the staff surface) — it's just implemented as two same-origin Workers instead of one hostname-gated Worker.

## Cloudflare dashboard configuration required

**Status 2026-08-21: complete for `staff.focuslabproductions.com`.** The checklist below is kept as a record of what was done and as the template for any future re-provisioning (e.g. a production-separate Access app).

1. Create a Zero Trust **Self-hosted** Access application for `staff.focuslabproductions.com/*`.
2. Attach only explicit approved staff identities or a narrowly maintained Access group. Do not use an everyone/public allow rule.
3. Copy the Application Audience (AUD) tag into the Worker environment configuration.
4. Set the exact team domain issuer, including `https://` and no trailing slash.
5. Allow Google authentication where it is already configured, or enable Access email one-time PIN (OTP) as the low-friction fallback. Restrict application access with exact per-user email entries, regardless of login method.
6. Use a 24-hour application/policy session for staging and initial production. Exercise reauthentication through explicit session revocation rather than shortening normal user sessions.
7. `staff.focuslabproductions.com` is attached as a Worker custom domain (2026-08-21); the `workers.dev` route (`focus-lab-operations-staging.freedomgeneration1111.workers.dev`) is kept live alongside it during the transition, not disabled.
8. Create real D1 responder mappings through a controlled administrative process before granting Access policy membership.
9. Revoke test tokens/sessions after staging exercises.

Cloudflare Independent MFA is intentionally deferred and is not a staging or initial-production blocker. Stronger authentication may later be required specifically for privileged admin or destructive operations if their risk warrants it.

## Session expiration and reauthentication

Access controls application-cookie lifetime. The PWA sends same-origin requests with credentials. A Worker `401` clears the application session in memory and presents “Sign in again”; it does not retry endlessly. The link starts the Access login flow with a return URL. Unsaved note text remains only in the mounted component's memory until the auth boundary replaces the workspace; sensitive drafts are never persisted indefinitely.

Cloudflare documents application and global tokens separately in [Session management](https://developers.cloudflare.com/cloudflare-one/access-controls/access-settings/session-management/). User logout uses `/cdn-cgi/access/logout`; Cloudflare notes that end-user logout is account-wide and previously issued tokens stop being accepted shortly after logout.

## Revocation, lost device, and offboarding

For a lost phone, stolen laptop, compromised account, departure, or temporary suspension:

1. Remove/disable the person in the Access allow policy or identity provider and revoke the user session in Zero Trust.
2. Set the corresponding D1 responder `active=0`; the Worker then denies even a still-valid cryptographic assertion.
3. If appropriate, explicitly clear responder presence and review recent activity/audit records.
4. Revoke the affected Google/identity-provider session where applicable and verify that the approved-email Access policy remains correct.
5. Rotate secrets only if the person actually possessed a secret; normal staff PWA users do not receive Worker secrets.
6. Preserve and review audit history according to the future retention policy.

There is no MDM or remote-wipe capability in this project.

## Service worker and private-data safety

The service worker caches only the app shell, manifest, approved mark, and hashed frontend assets. It bypasses `/v1/*`, `/cdn-cgi/access/*`, cross-origin requests, mutations, non-success responses, and authentication redirects. Navigations are network-first with only the static shell as offline fallback. CRM API responses, customer data, Access pages, and auth errors are not cached.

Offline mode is shell-only. No CRM data is deliberately persisted, no mutations are queued, and “Saved” appears only after server confirmation. A browser may keep a fetch pending and deliver it when connectivity returns; that incidental behavior is not supported offline synchronization and must not be described as a queue.

## Manual Android PWA validation

Use a staging Access application and synthetic D1 data only:

1. In Chrome, visit the staging staff hostname and authenticate with the configured Google or email OTP method.
2. Confirm `/v1/internal/me` loads the expected synthetic role automatically; no token field appears.
3. Install the PWA and launch it in standalone mode.
4. Read inbox/detail, add a synthetic note, and toggle presence; confirm authenticated audit identity.
5. Close and reopen the PWA; verify the valid Access session resumes without credential entry.
6. Background for longer than one heartbeat but shorter than Access expiry; foreground and verify heartbeat recovery.
7. Let the Access application session expire; confirm a clear sign-in-again screen without a request loop.
8. Complete reauthentication and verify operation resumes.
9. Visit `/cdn-cgi/access/logout`; confirm protected API calls stop and the PWA requests sign-in.
10. Revoke the test user in Zero Trust and mark D1 responder inactive; confirm access is denied after revocation propagation.
11. Test airplane mode: shell may open, private API data must not be available from Cache Storage, and writes must not claim success.

Record device model, Android version, Chrome version, install source, timestamps, and observed prompts.

## Manual iOS/iPadOS validation

Repeat the Android sequence using Safari “Add to Home Screen,” standalone launch, close/reopen, background/foreground, expiry, logout, revocation, and offline inspection. Record iOS/iPadOS and Safari versions. This behavior is **not proven** until tested on physical Apple hardware; browser emulation is not evidence of installed-PWA cookie/session behavior.

## Remaining threats and staging blockers

- Access application, exact-email policies, custom domains, and real staff mappings are not yet verified from this environment.
- Real-device installed-PWA behavior remains unverified.
- Staff administration/offboarding is currently a database/dashboard procedure.
- Authorization is role-based but not scoped by assigned inquiry; responders can read the operational inbox by design. Revisit if the team grows.
- Device posture and managed-device requirements are deferred.
- Privacy retention, monitoring, incident response, and backup policy remain unresolved.

## Phase 1B staging validation

Status as of 2026-08-11: the isolated Worker, D1 database, staff shell, and same-origin API are deployed behind Cloudflare Access. The exact-email policy and 24-hour session are user-confirmed. An unauthenticated edge check redirects both `/` and `/v1/internal/me` to the expected Access team domain and AUD. The first authenticated login and physical-device validation remain pending. No production resource or route was changed.

### Staging resources

| Resource | Value |
|---|---|
| Worker | `focus-lab-operations-staging` |
| Custom domain (live 2026-08-21) | `staff.focuslabproductions.com` |
| `workers.dev` hostname (still live, kept during transition) | `focus-lab-operations-staging.freedomgeneration1111.workers.dev` |
| D1 database | `focuslab-crm-staging` |
| D1 ID | `9a7e55cb-7b26-4521-b48d-bd607e1b207c` |
| Auth mode | `access` (no development-token fallback) |
| Access issuer | `https://freedomgeneration1111.cloudflareaccess.com` |
| Access AUD | `295ea7bd524addc2c13be76f041dc72e23fde3fd4a8c4d1c98ae456b8e160000` |
| Access session | 24 hours |
| Independent MFA | Deliberately deferred; not a blocker |
| Staff shell/API topology | Same origin: `/` and `/v1/internal/*` |

Migrations `0001_operations_foundation.sql` and `0002_staff_access_identity.sql` are applied. The database contains only the checked-in synthetic development records: one synthetic responder for each application role and six synthetic inquiries. The approved tester email is mapped only in remote staging D1 to the synthetic admin responder; it is not present in committed seed files. The stable Access subject remains unbound until the first successfully validated login.

### Required Cloudflare dashboard action

1. Open **Workers & Pages** in the Cloudflare dashboard.
2. Select **focus-lab-operations-staging**.
3. Open **Settings > Domains & Routes**.
4. On the `workers.dev` route, select **Enable Cloudflare Access**.
5. Select/manage the generated Access application. Confirm it targets the staging Worker only (including its `workers.dev` route), not another Worker or production hostname.
6. Create one **Allow** policy containing only the explicitly approved tester email. Do not use `Everyone`, a broad email domain, or a bypass policy.
7. Set the application and policy session duration to 24 hours. Test reauthentication through explicit Access session revocation; do not shorten the normal session merely for testing.
8. Select Google login if it is already configured, or configure email OTP under **Zero Trust > Integrations > Identity providers**. Independent MFA is deliberately not required.
9. Copy the staging application's **Application Audience (AUD) tag**.
10. Copy the Zero Trust team domain as an exact HTTPS issuer, for example `https://example.cloudflareaccess.com` with no trailing slash.
11. Return the exact AUD and issuer to the engineering setup process. They are identifiers, not secrets, but must be exact. Configure them as `ACCESS_AUD` and `ACCESS_TEAM_DOMAIN` in the staging Worker environment before exposing the staff shell.

Cloudflare's current Workers documentation identifies Worker-target Access as the safest direct protection for a Worker and permits Access protection on `workers.dev`. The Worker still validates the assertion independently; the Access edge policy is not the application authorization boundary.

Staging also proved that selective `assets.run_worker_first` patterns cannot enforce a hostname gate for ordinary static files: matching assets are served before the Worker runs. The configuration now uses `run_worker_first: true`, as Cloudflare documents for middleware/authentication checks, so every staff asset request reaches `isStaffAssetHost` before `env.ASSETS.fetch`. The exact staging hostname, issuer, and AUD are now deployed; Access intercepts unauthenticated shell and internal-API requests before they reach the Worker.

### Verified staging results

- Worker deployment version `675ad0ee-d9df-4c9b-b099-443a426c692e` is active at the staging `workers.dev` hostname.
- Unauthenticated `/` returns an Access `302` to the configured team-domain login using the expected AUD.
- Unauthenticated `/v1/internal/me` returns the same Access boundary, proving the same-origin internal API is covered.
- The Access application cookie advertises a 24-hour expiry.
- Development bearer authentication is disabled because the deployed environment is `staging` with `STAFF_AUTH_MODE=access`.
- Physical Android validation passed: Access login succeeded, the staff workspace loaded, `Test Responder C` loaded as the authenticated `admin`, the Status tab worked, “Available for live chat” persisted an authenticated heartbeat, and no errors were observed.
- During the physical Android session, a synthetic internal note and self-assignment persisted, and both audit activities attribute the authenticated responder as actor.
- “Messaging not configured” remains the correct truthful UI because no customer messaging transport exists.
- Desktop browser validation has not yet been performed.
- Physical iPhone Safari and installed Home Screen PWA validation passed: Access authentication carried into standalone mode, background/return worked, and force-close/reopen restored the session. During Airplane Mode, WebKit kept one note request pending until connectivity returned; D1 then stored one note and one correctly attributed activity. This is incidental browser delivery, not supported offline synchronization.
- Access revocation and D1 deactivation remain to be validated.
- Internal-note POSTs are not idempotent. Exactly-once protection is deferred unless a future retry mechanism or durable outbox is deliberately introduced.

### Approved tester mapping (not committed)

After the tester supplies the exact authenticated email, bind it to one synthetic staging responder with a remote D1 command. Start with the admin role for the complete validation flow, then use the synthetic manager/responder mappings for role tests. Never add the email to `operations/seeds/development.sql`.

The code first matches normalized `verified_email`, validates the active D1 role, and then binds the signed Access `sub` on first successful authentication. Confirm both `verified_email` and `access_subject` after first login without printing the JWT.

### Staging release order

1. Enable Access and the narrow allow policy while the shell is still hostname-gated.
2. Configure exact `ACCESS_TEAM_DOMAIN` and `ACCESS_AUD` for the staging Worker.
3. Add the approved tester email to staging D1.
4. Deploy the configuration whose `STAFF_HOSTNAME` is the exact staging hostname.
5. Verify unauthenticated requests stop at Access.
6. Authenticate on desktop and verify `/v1/internal/me`, CRM mutations, audit actor, role enforcement, presence, and logout/revocation.
7. Complete the physical Safari and installed iPhone PWA checklist below; do not mark physical-device validation passed from emulation alone.

### Physical iPhone validation record

Physical iPhone validation is complete for Safari authentication, Add to Home Screen, session transfer into standalone mode, 30–60 second background/return, and force-close/reopen. Airplane Mode testing showed that WebKit may retain an in-flight mutation until connectivity returns; the UI remained “Saving…” and only confirmed success after D1 persistence. No application queue, IndexedDB outbox, Background Sync, or supported offline-write behavior exists. Access revocation and explicit logout remain separate pending checks. Private CRM responses must not appear from Cache Storage.

### Android validation record

If physical Android hardware is available, repeat the sequence in Chrome and the installed PWA. Record Android and Chrome versions. Browser emulation is useful regression coverage but is not physical installed-PWA evidence.

### Rollback/delete staging resources

Before deletion, export only non-sensitive validation notes needed for review. Remove the staging Access application/policy, disable its `workers.dev` route, delete Worker `focus-lab-operations-staging`, and delete D1 database `focuslab-crm-staging`. Verify names and IDs before every destructive command. Never apply this cleanup procedure to a production-named resource.
