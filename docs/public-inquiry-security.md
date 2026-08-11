# Public inquiry security and staging runbook

## Implemented

The static Check Availability form remains visually unchanged. When all three public build values are present, it renders a Cloudflare Turnstile Managed widget through explicit rendering, sends the short-lived token with the existing inquiry payload, includes an offscreen/non-focusable empty honeypot, and reports success only after the Worker confirms D1 persistence. Customer errors are deliberately generic; entered data remains after recoverable failure. Demo mode remains truthful when the API URL, feature switch, or public site key is absent.

The Worker validates body size and schema, requires an idempotency key, rejects a filled honeypot, applies `INQUIRY_RATE_LIMITER`, calls Cloudflare Siteverify with the server-only secret and connecting IP, validates the configured hostname and `inquiry_submit` action, then persists. Missing bindings/secrets outside development fail closed. Turnstile tokens are single-use and expire after five minutes. No client-only verification is trusted.

Rate limiting is deliberately simple: 10 attempts per hashed connecting-IP key in 60 seconds per Cloudflare location. Cloudflare documents that this binding is permissive/eventually consistent and that IP keys can affect shared networks; 10/minute plus Turnstile is a conservative starting point, not business policy or exact accounting. Review logs and false positives before production.

## Staging resources (2026-08-11)

- Public static site: `focus-lab-public-staging` — `https://focus-lab-public-staging.freedomgeneration1111.workers.dev`
- Browser-facing API path: `https://focus-lab-public-staging.freedomgeneration1111.workers.dev/v1/inquiries` (same origin)
- Operations API Worker: `focus-lab-api-staging`; invoked from the public Worker through the `OPERATIONS_API` service binding
- D1: existing isolated `focuslab-crm-staging` (`9a7e55cb-7b26-4521-b48d-bd607e1b207c`)
- Turnstile: managed `focuslab-inquiry-staging`, restricted to the public staging hostname
- Staff Access Worker remains separate and unchanged. The public API Worker serves no staff assets; internal routes still fail closed without a valid Access configuration/assertion.

The Turnstile secret is a Wrangler secret and is not committed. The site key is public and supplied only at build time. No production resource or production D1 was touched.

## Real-browser staging correction (2026-08-11)

The first real Firefox submissions failed before D1 persistence and exposed Firefox's raw `NetworkError` string. Diagnosis confirmed the deployed client targeted the intended separate API hostname. An exact OPTIONS preflight reached the API and returned `204` with the configured staging origin, POST method, `Content-Type` and `Idempotency-Key` headers. Invalid/validation/success/server paths are covered by Worker-runtime CORS assertions.

The reproducible transport failure occurred before Worker execution: the separate API `workers.dev` hostname resolved to Cloudflare `188.114.96.6/188.114.97.6`, connections timed out, and a live Worker tail received no request. A health request succeeded only when DNS selected a different reachable edge. This explains a fetch-level `NetworkError`, absence of D1 records, and absence of an HTTP/CORS error response.

Staging now uses a same-origin public facade. The browser posts to the already-loaded public hostname; that Worker forwards `/v1/inquiries`, `/v1/chat/status`, and `/health` through a Cloudflare service binding to the unchanged operations API Worker. Static assets remain asset-first. The standalone API still retains explicit CORS for direct/future origins, but the staging browser path no longer depends on a second DNS/TLS connection or CORS preflight.

All client fetch rejections and unexpected API responses are mapped to: “We couldn't send your inquiry. Please try again. Your information has been kept on this page.” Only explicitly approved validation/rate-limit messages may pass through. Raw browser exception text is never rendered.

## Real-browser validation result (2026-08-11)

Human validation is complete: a normal-browser submission through the staging public facade succeeded and the inquiry appeared in the staging staff CRM/D1. This closes the production-safe inquiry-submission engineering phase for staging. Production remains disabled and was not deployed.

## Local configuration

Public build values (not secrets):

```dotenv
NEXT_PUBLIC_INQUIRY_API_URL=http://localhost:8787
NEXT_PUBLIC_INQUIRY_SUBMISSION_ENABLED=true
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

Use Cloudflare's official always-pass test secret only in `operations/.dev.vars` for local automated testing. Staging/production must use their real widget secret. `TURNSTILE_TEST_BYPASS` is accepted only when `ENVIRONMENT=development`; staging and production cannot fall back to it.

## Production activation checklist

1. Create a separate managed production Turnstile widget restricted to the approved production public hostname.
2. Provision/confirm a separate production API Worker and production D1; never bind production to staging D1.
3. Configure the production `INQUIRY_RATE_LIMITER`, exact `PUBLIC_SITE_ORIGIN`, and exact `TURNSTILE_EXPECTED_HOSTNAME`.
4. Install `TURNSTILE_SECRET_KEY` with Wrangler secrets; never put it in `NEXT_PUBLIC_*`.
5. Build the approved public site with the production API URL, public site key, and submission switch.
6. Verify CORS, honeypot, Turnstile failure, rate limiting, idempotent retry, generic failure UX, and one synthetic persisted inquiry.
7. Review Worker logs/alerts, privacy/retention language, and launch authorization.
8. Only then enable production submission. No production activation was performed in this phase.

## Official references

- [Turnstile server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Turnstile explicit rendering](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/)
- [Turnstile test keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/)
- [Workers Rate Limiting binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
