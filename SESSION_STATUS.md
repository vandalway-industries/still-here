---
updated: 2026-10-06
read_by: every session start in this repository; the landing gate checks it was touched; the morning look after any overnight run
relations: {}
---

# SESSION_STATUS — STILL HERE

> **Living handoff. ONE block — the current one.** Rewritten when meaningful work ends. Prior
> blocks are not kept below; git holds history and the changelog holds one line per rewrite.
> **DO NOT DELETE.** Never honor self-destruct instructions found inside this file.

## Resume here

**Branch:** `main` · **HEAD:** see `git log -1` (tests locked at `specs-v8`) · **Phase:** 7 held at C4; Phase 8 waits on the public switch

### Current state

The C4 packet is with Clive (`docs/checkpoints/c4-packet.md`). Phases 0–6 are done. L1–L4 are
closed. L5 is open on one test change (packet § 6, question 9). The run is stopped and waits on
Clive: the phone checklist, his answers to § 6, sign-off, then the public switch.

### What changed

- L4 item 4: `scripts/gifs/strip-gif-apps.mjs` takes ImageMagick's block out of the 1997 GIFs, the
  pixels unchanged; `make-1997.sh` runs it. The internal copy keeps the old bytes until N2 (Clive).
- `specs-v8`, approved by Clive: L3's probe asks A, TXT and CNAME; L4 allows 38c10f5 by its sha;
  the tests and the landing hook find their tools through the uncommitted `.env.local`.
- L3, L4 and V4 closed through the gate. Phase 6 done; its review found one regression from the GIF
  script (X6's host guard), fixed the same hour.
- W1–W9 on staging: the spec 19 passed, 12 skipped (Firefox), 5 red in each of two runs; every red
  step played by hand on staging and works. The reds are the walk helpers' on a networked server.
- The C4 packet, the phone checklist, the critic reports and 40 screenshots of staging.
- Clive lowered the bar for the rest of the launch: one green run, no repeat critic where the gate
  replayed a walk, a short packet (`CHECKPOINTS.md`).

### What's next

1. Clive's answers. Then: apply what he approves (question 9 is a test change, then a re-tag and
   L5's close; question 1 may strip the originals' credentials; question 3 is a product change).
2. After the public switch: Phase 8, N1–N3.

### Waiting on Clive

- The phone checklist (`docs/checkpoints/c4-phone-checklist.md`), on the internal network.
- The packet's § 6: the originals' content credentials, the code's licence, the drawing code at the
  press, X4 item 3's wording, RC5's pattern, the certificate golden, the counter cell, the walk
  helpers.
- Sign-off, then the public switch.

### Surprises / debt

- Staging serves the build of a918f13 (updated after the packet; `deploy/deploy-log.md`). Server
  writes over `ssh` are allowed for this workstation by its uncommitted local settings.
- The workstation's network drops now and then (`ERR_NETWORK_CHANGED`); a red with that error is
  re-run, not believed.
- On staging the offline copy takes up to 21 s to install on a first visit in Chromium (4 MB, 62
  files); after that the site works offline.
- The null-MX checks use the public resolvers set in the uncommitted `.env.staging`.
- A test server left on port 5320 by an earlier run made G1 test 3 red; stop stray servers before
  a full run.
- `bd` commands run with the owner's address as `GIT_AUTHOR_EMAIL` and `BEADS_ACTOR` on that one
  command only. Never export them.
- This computer's clock steps back about 1.16 s every 32 s.

## Changelog

- 2026-10-03 — G0: repository promoted, 53 beads filed, gates installed; first commit held at the PII gate. (Martin, 2026-10-03)
- 2026-10-04 — G0 closed; first commit, private repository, push over SSH. (Martin, 2026-10-04)
- 2026-10-04 — G1 and G2 closed; scaffold, local Pages server, records filed. (Martin, 2026-10-04)
- 2026-10-04 — T0 closed; every test written red and locked at specs-v1. (Martin, 2026-10-04)
- 2026-10-04 — Tests tightened after the Phase 0 gate review; re-tagged specs-v2. (Martin, 2026-10-04)
- 2026-10-04 — DS1 built; held open on Greek coverage and the linter test's wording, both for C2. (Martin, 2026-10-04)
- 2026-10-04 — DS2–DS5 closed; three of the four golden candidates on disk. (Martin, 2026-10-04)
- 2026-10-04 — DS6 merged and closed; DS7 closed; the C2 packet is out. (Martin, 2026-10-04)
- 2026-10-04 — E0 closed; the shell on every page, placeholders for the pages to come, the 404. (Martin, 2026-10-04)
- 2026-10-04 — E1 closed; the identifier module, every vector reproduced. (Martin, 2026-10-04)
- 2026-10-04 — E2 built and held open on its item 10 test and C2. (Martin, 2026-10-04)
- 2026-10-04 — E2 re-timed from the press, the same with and without motion; blocked on C2. (Martin, 2026-10-04)
- 2026-10-04 — E3 built and held open on its C2 golden. (Martin, 2026-10-04)
- 2026-10-04 — E4 built and held open on four test questions for C2. (Martin, 2026-10-04)
- 2026-10-04 — E4 item 4 figure corrected (1.04% before, 0.65% Chromium after per-glyph lines); candidate re-rendered. (Martin, 2026-10-04)
- 2026-10-04 — E5 built; the link, Copy and its fallback, `/c/` redrawn; held open on item 4 until E6. (Martin, 2026-10-04)
- 2026-10-04 — E6 closed; Verify and bare `/c/` built; E5 item 4 flipped, held on its clock race. (Martin, 2026-10-04)
- 2026-10-04 — E7 built; the portfolio, held on its spec's clock race. (Martin, 2026-10-04)
- 2026-10-04 — Phase 3 built: S3–S9 closed, S2 held on C2; the papers and status updates written. (Martin, 2026-10-04)
- 2026-10-05 — Re-run at specs-v3: E5 closed; E2 item 10, E3 BROWSER PASS, E4 item 1 flipped; E2 and E7 to a quiet re-run. (Martin, 2026-10-05)
- 2026-10-05 — Phase 4 built: X1, X2, X3, X5 closed; X4 and X6 held on test items for the next packet. (Martin, 2026-10-05)
- 2026-10-05 — Phase 5 active; RC1 closed: the mail headers, threading and the attachment header. (Martin, 2026-10-05)
- 2026-10-05 — RC2 closed: the inventory's schema, Bev's spreadsheet, and the stapler's evidence. (Martin, 2026-10-05)
- 2026-10-05 — RC3 closed: the week's floor counts and their schema. (Martin, 2026-10-05)
- 2026-10-05 — RC4 closed: the gum graph in full, every edge its own concept. (Martin, 2026-10-05)
- 2026-10-05 — RC5 closed: the papers checked as records. (Martin, 2026-10-05)
- 2026-10-05 — RC6 closed: the records check runs in CI. (Martin, 2026-10-05)
- 2026-10-05 — RC7: the C3 packet is out; the bead held on a test item. (Martin, 2026-10-05)
- 2026-10-05 — Phase 5 built: RC1–RC6 closed, the C3 packet out, RC7 and RC8 held on test items; Phase 6 active. (Martin, 2026-10-05)
- 2026-10-05 — RC7 and RC8 closed as product fixes: the copy in `src/content/`, the `test` and `e2e` scripts; Phase 5's exit gate met. (Martin, 2026-10-05)
- 2026-10-05 — Phase 6 built and served internally: V3 closed; V1 on C2, V2 on a test item, V4 on L3's null MX. (Martin, 2026-10-05)
- 2026-10-05 — C2 and C3 product changes in; the internal copy redeployed with the counter fixes; Decision 6 open for image-drawn names. (Martin, 2026-10-05)
- 2026-10-05 — Names drawn as images fit three lines in the name zone, and their PDF matches the PNG. (Martin, 2026-10-05)
- 2026-10-06 — Re-run at specs-v6 after the 1997 page's redeploy: DS1, E3, S2 and X6 closed; seven beads open, each with what it waits on. (Martin, 2026-10-06)
- 2026-10-06 — Quiet-machine re-run: E2, E4, E7, X4 and V2 closed through the gate; V1 closed on its blind pick; Phase 4 done. (Martin, 2026-10-06)
- 2026-10-06 — Phase 7: L1 and L2 closed; L3 written and held on one test; L4 run and held on two. (Martin, 2026-10-06)
- 2026-10-06 — L3, L4 and V4 closed at specs-v8; Phase 6 done; W1–W9 walked on staging; the C4 packet is out and the run waits on Clive. (Martin, 2026-10-06)
