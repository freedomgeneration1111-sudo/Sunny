# Production staff authentication and authorization

Status: code foundation implemented; Cloudflare dashboard resources and real staff mappings are not configured or deployed.

## Architecture and trust boundaries

```text
staff.gofocuslab.com (Cloudflare Access self-hosted application)
  -> Independent MFA and explicit identity allow policy
  -> Cf-Access-Jwt-Assertion
  -> same Worker serves static PWA and /v1/internal/*
  -> Worker verifies RS256 signature, issuer, AUD and expiry via rotating Access JWKS
  -> D1 maps stable Access subject / verified email to an active responder and role
  -> explicit permission check
  -> CRM mutation and authenticated audit actor
```

Cloudflare Access authenticates who the person is. D1 authorizes whether that identity is active Focus Lab staff and what application operations are permitted. Merely reaching an Access-protected hostname is not trusted. The Worker validates `Cf-Access-Jwt-Assertion` independently, following Cloudflare's current [JWT validation guidance](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/). Plain email headers and unsigned token decoding are never authentication.

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
STAFF_HOSTNAME=staff-staging.gofocuslab.com | staff.gofocuslab.com
ACCESS_TEAM_DOMAIN=https://<team-name>.cloudflareaccess.com
ACCESS_AUD=<Access application AUD tag>
```

`ACCESS_TEAM_DOMAIN` and `ACCESS_AUD` are identifiers, not credentials, but must be exact. Do not place service tokens or private credentials in Vite variables. The staff production client uses same-origin requests with Access cookies and never asks staff to paste a token.

## Same-origin decision: adopted

Cloudflare [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/) supports a Worker plus static assets as one deployment and `run_worker_first` routing for `/v1/*`. A custom domain invokes the same Worker for all hostname paths, as described in [Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/). Therefore the intended topology is:

```text
staff.gofocuslab.com/                  -> staff PWA assets
staff.gofocuslab.com/v1/internal/*     -> protected internal API
api.gofocuslab.com/v1/inquiries        -> public API
api.gofocuslab.com/v1/chat/status      -> public status API
```

The same operations Worker may own both custom domains; hostname gating prevents staff assets from being served on `api.gofocuslab.com`. Access protects `staff.gofocuslab.com/*`. The Worker still validates Access JWTs on every internal API request. This avoids cross-origin cookie/CORS ambiguity for installed PWAs without creating a second backend.

## Cloudflare dashboard configuration required

1. Create a Zero Trust **Self-hosted** Access application for `staff.gofocuslab.com/*`.
2. Attach only explicit approved staff identities or a narrowly maintained Access group. Do not use an everyone/public allow rule.
3. Copy the Application Audience (AUD) tag into the Worker environment configuration.
4. Set the exact team domain issuer, including `https://` and no trailing slash.
5. Enable Independent MFA at the organization level, then require it for this application. Current supported methods include TOTP, biometrics/passkeys, and WebAuthn security keys. Prefer biometrics/passkeys or security keys; retain TOTP as recovery fallback. See [Independent MFA](https://developers.cloudflare.com/cloudflare-one/access-controls/access-settings/independent-mfa/).
6. For initial review, use an 8-hour application/policy session and require Independent MFA on every new Access login. This is a security recommendation for review, not an implemented business policy.
7. Add `staff.gofocuslab.com` and `api.gofocuslab.com` as Worker custom domains only after staging review. Do not use `workers.dev` for production.
8. Create real D1 responder mappings through a controlled administrative process before granting Access policy membership.
9. Revoke test tokens/sessions after staging exercises.

MFA is not configured merely because this document exists.

## Session expiration and reauthentication

Access controls application-cookie lifetime. The PWA sends same-origin requests with credentials. A Worker `401` clears the application session in memory and presents “Sign in again”; it does not retry endlessly. The link starts the Access login flow with a return URL. Unsaved note text remains only in the mounted component's memory until the auth boundary replaces the workspace; sensitive drafts are never persisted indefinitely.

Cloudflare documents application and global tokens separately in [Session management](https://developers.cloudflare.com/cloudflare-one/access-controls/access-settings/session-management/). User logout uses `/cdn-cgi/access/logout`; Cloudflare notes that end-user logout is account-wide and previously issued tokens stop being accepted shortly after logout.

## Revocation, lost device, and offboarding

For a lost phone, stolen laptop, compromised account, departure, or temporary suspension:

1. Remove/disable the person in the Access allow policy or identity provider and revoke the user session in Zero Trust.
2. Set the corresponding D1 responder `active=0`; the Worker then denies even a still-valid cryptographic assertion.
3. If appropriate, explicitly clear responder presence and review recent activity/audit records.
4. Remove compromised Independent MFA authenticators and require re-enrollment.
5. Rotate secrets only if the person actually possessed a secret; normal staff PWA users do not receive Worker secrets.
6. Preserve and review audit history according to the future retention policy.

There is no MDM or remote-wipe capability in this project.

## Service worker and private-data safety

The service worker caches only the app shell, manifest, approved mark, and hashed frontend assets. It bypasses `/v1/*`, `/cdn-cgi/access/*`, cross-origin requests, mutations, non-success responses, and authentication redirects. Navigations are network-first with only the static shell as offline fallback. CRM API responses, customer data, Access pages, and auth errors are not cached.

Offline mode is shell-only. No CRM data is deliberately persisted, no mutations are queued, and “Saved” appears only after server confirmation.

## Manual Android PWA validation

Use a staging Access application and synthetic D1 data only:

1. In Chrome, visit the staging staff hostname and complete IdP plus Independent MFA.
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

- Access application, policies, MFA, custom domains, and real staff mappings do not yet exist.
- Real-device installed-PWA behavior remains unverified.
- Staff administration/offboarding is currently a database/dashboard procedure.
- Authorization is role-based but not scoped by assigned inquiry; responders can read the operational inbox by design. Revisit if the team grows.
- Device posture and managed-device requirements are deferred.
- Privacy retention, monitoring, incident response, and backup policy remain unresolved.
