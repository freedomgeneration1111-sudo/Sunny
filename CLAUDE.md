# CLAUDE.md

This is a pointer file, not a duplicate. **Read `AGENTS.md` in full before doing anything in this repo.** It's the real operating manual — business context, stack, the deployment-target table, the doc index, and 20+ sections of hard-won rules. This file exists only because Claude Code auto-loads `CLAUDE.md` at session start, while `AGENTS.md` (the cross-tool convention this project actually uses) has to be read deliberately — and that step has been getting skipped.

Do not let content drift between the two files. If something needs to change, change it in `AGENTS.md` and leave this file as the pointer it is.

## The one fact worth repeating here

`AGENTS.md` calls this "the #1 documented failure mode," so it gets a second copy as a safety net in case this file is all that loads: **two wrangler configs exist and are not interchangeable.** `wrangler.jsonc` → `dfw-event-web` (legacy, no backend, do not deploy here). `wrangler.staging.jsonc` → `focus-lab-public-staging`, bound to the real live domain `focuslabproductions.com` — "staging" is a legacy name, treat it as production. Deploy only via `npm run public:staging:deploy` (it rebuilds from source first), never a bare `wrangler deploy`.

Everything else — business rules, the doc index, testing commands, reporting conventions — lives in `AGENTS.md`. Go read it now.
