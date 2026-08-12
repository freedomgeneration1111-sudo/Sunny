# 12 — Decision Record: One-Anchor Homepage

**Date:** 2026-08-12 · **Status:** Accepted · **Branch:** `feat/one-anchor-home`

## Decision

**The one-anchor homepage is the target architecture.** The homepage is the
complete customer journey. The supporting routes are a knowledge layer.

## Why this record exists

A forensic review on 2026-08-12 found that the redesign on this branch had been
built to a **hub-and-spoke** model: four event cards on the homepage that
navigated out to separate event pages. Only 2 of the 12 intended homepage
anchors existed, and `#weddings`, `#shaadi`, `#parties`, and `#corporate` were
absent entirely.

This was not an implementation error. Two authorities disagreed:

- **`docs/02_ARCHITECTURE_AND_CONTENT_HIERARCHY.md`** (committed) specified a
  multi-page hub, and the implementation matched it section for section.
- **`Focuslab-One-Anchor-Wireframe.html`** (the actual product intent) was
  **never committed**. It sat untracked in a different worktree
  (`/home/moses/projects/Sunny/docs/example wireframe/`) and was invisible to
  anyone working on this branch.

The embedded master handoff contained zero occurrences of "one-anchor",
"Add to Plan", or any anchor id. The previous agent built the only spec it
could see.

## What changed as a result

1. The wireframe is now committed at
   `docs/reference/Focuslab-One-Anchor-Wireframe.html`. It is the **structural
   UX reference only** — not a visual, copy, or pricing authority. Its low-fi
   cards are deliberately not reproduced; the cinematic Focus Lab visual
   language governs appearance.
2. `docs/02` has been rewritten to describe the one-anchor architecture and
   carries a superseded-model warning at the top.
3. `tests/redesign-baseline.spec.ts` now asserts the full 12-anchor contract and
   that `#paths` cards scroll rather than navigate — so a future regression to
   hub-and-spoke fails the suite rather than passing review.

## Consequences

- The homepage carries the four substantial event sections. Event cards scroll;
  they do not navigate away.
- `/weddings`, `/south-asian-weddings`, `/events/parties`, `/events/corporate`
  became long-form planning guides rather than thin service landing pages. They
  stay real, crawlable, canonical pages — homepage anchors are for UX, these are
  for depth and search.
- The full pricing menu lives on the homepage with no tabs. `/pricing` remains a
  secondary shareable surface on the same component and the same data.
- The service inventory expanded from 17 to 32 items so each event section is
  shoppable. Most additions are **draft** content for layout review, badged as
  such, pending the offer/pricing sprint.

## What was explicitly preserved

The validated operations stack was not touched: native WebSocket chat transport,
Durable Objects, Web Push, staff PWA, D1 CRM, Cloudflare Access, server-confirmed
Live Chat / Send us a Message semantics, the public inquiry security path, and
the `/work` publication gate. Add-to-Plan continues to feed the established CRM
inquiry route — there is no second form or backend.

## Not settled by this record

- Real service inventory and pricing (separate sprint).
- Whether `main` should fast-forward to the operations foundation, and whether
  `origin/main` should advance 25 commits (PM decision).
- Copy and imagery review, page by page.
