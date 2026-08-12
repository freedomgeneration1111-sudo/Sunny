# Customer email continuity

## Scope and architecture

D1 remains the source of truth for customer conversations. A staff reply is persisted and broadcast before email notification work starts. Email is only a transactional alert that returns the customer to the existing conversation; it is not a second message store.

`CustomerNotificationEmailProvider` is the internal transport boundary. The initial implementation is `ResendCustomerNotificationEmailProvider`, which calls Resend's transactional send API. Conversation and chat code depend on the interface rather than on Resend response shapes or an SDK.

The flow is:

1. A responder reply is committed to D1 and broadcast through the existing chat Durable Object.
2. The Durable Object checks its accepted customer WebSockets.
3. If a customer socket is active, realtime delivery is sufficient and email is skipped.
4. If no customer socket is active and no uncleared notification exists, the Worker creates a notification record and a new resume capability, then attempts one email.
5. Provider failure is recorded but never rolls back or hides the staff reply.

This same Durable Object path covers asynchronous messages now and can cover a live-chat customer who supplied email and later disconnects without another transport design.

## Resume capability security

Resume capabilities use 32 cryptographically random bytes (256 bits), encoded as 64 hexadecimal characters. This extends the existing native-chat token design instead of adding a separate authentication system.

- Only SHA-256 hashes are stored in D1.
- Email tokens are scoped to one conversation and can be revoked independently.
- The public endpoint resolves the token before returning history and never accepts a sequential conversation identifier as authorization.
- Public history contains customer/responder message fields only. Contact details, assignments, activity records, and internal data are not returned.
- The resume page sends the capability in a request header, saves it in session storage, and immediately removes it from the visible URL. The page uses a `no-referrer` policy.
- Invalid, altered, missing, and revoked capabilities receive the same safe public failure.

The original browser resume token remains valid for its existing session. Issuing or revoking an email token does not overwrite it.

## D1 state

Migration `0005_customer_email_continuity.sql` adds only:

- `conversation_resume_tokens`: per-conversation hashed capabilities, timestamps, purpose, use, and revocation state.
- `conversation_notifications`: triggering message/sequence, provider, provider message ID, attempt/result, failure category, and clearance state.

No email body, raw capability, device fingerprint, or duplicated conversation history is stored.

An uncleared notification suppresses further emails for rapid responder follow-ups. Opening or using the conversation clears that state, making a later absent-customer reply eligible for one new notification. Failed sends are not retried indefinitely; the failure remains visible to staff and the stored conversation remains authoritative.

## Staff status

The Chat view adds one concise delivery status to its existing live diagnostic line:

- Customer active — delivered realtime.
- Customer absent — email notification pending.
- Email notification sent.
- Email notification failed — the reply remains safely stored.
- Customer resumed after the last email notification.

Responders continue to use the ordinary Send action; there is no manual email workflow.

## Staging Resend setup required

No Resend credentials or verified sending-domain configuration currently exists on the isolated staging Worker. Do not use or modify production DNS for this setup.

1. Create or use a Resend account.
2. Add a sending subdomain of a domain already controlled by Focus Lab, for example `notifications.<controlled-domain>`. Do not purchase a domain as part of this work.
3. Add the DKIM/SPF records Resend supplies and complete domain verification. Add a DMARC policy appropriate for that controlled domain if one is not already present.
4. Create a Resend API key restricted to sending mail from that domain.
5. Set these secrets on `focus-lab-api-staging` using the API Worker config:

   ```bash
   npx wrangler secret put RESEND_API_KEY --config operations/wrangler.public-staging.jsonc
   npx wrangler secret put CUSTOMER_EMAIL_FROM --config operations/wrangler.public-staging.jsonc
   ```

   Use a From value such as `Focus Lab Productions <replies@notifications.<controlled-domain>>` for `CUSTOMER_EMAIL_FROM`.

6. Redeploy only `focus-lab-api-staging`:

   ```bash
   npx wrangler deploy --config operations/wrangler.public-staging.jsonc
   ```

The public conversation origin is a non-secret staging variable. Staging credentials must not be reused for production, committed to the repository, printed in logs, or placed in the public/static Worker.

## Physical staging validation after setup

1. On a customer device, use **Send us a Message** with an email address you control, then close the page.
2. In Operations, open that conversation and send a reply.
3. Confirm the transactional email arrives and select **Continue conversation**.
4. Confirm the same Focus Lab conversation opens, the staff reply is visible, and the customer can reply.
