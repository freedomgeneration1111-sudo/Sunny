# Focus Lab Staff Application — Development User Guide

Status: internal development prototype. Authentication, messaging synchronization, and deployment are not production-ready.

## Daily development flow

1. Start the local Worker and staff app with the commands in `docs/operations-foundation.md`.
2. Enter the local provisional API token and choose a synthetic responder. This is development access, not a production login.
3. Review Inbox; use workflow, assignment, and bounded search filters.
4. Open an inquiry and assign yourself or another responder when appropriate.
5. Review Scheduling. “Clear” is internal decision support, never a customer availability promise.
6. Add plain-text Internal Notes. They are never customer messages.
7. Deliberately choose Available for Live Chat in Status. Assignment alone never changes presence.
8. Check aggregate chat state. Chat shows provider configuration and metadata only; no provider is synchronized.
9. Update internal workflow state as work progresses. This creates audit history but sends no customer notification.
10. Choose Not Available before ending deliberate live coverage, then end the development session.

## Offline and failure behavior

The app shell may remain visible offline, but edits are not queued. A change is shown as saved only after Worker confirmation, and recoverable note errors retain entered text. A browser may incidentally keep a request pending until connectivity returns; staff must not treat that as supported offline synchronization. Never place tokens in source or client build variables.
