---
updated: 2026-10-05
read_by: every session start in this repository; the landing gate checks it was touched; the morning look after any overnight run
relations: {}
---

# SESSION_STATUS — STILL HERE

> **Living handoff. ONE block — the current one.** Rewritten when meaningful work ends. Prior
> blocks are not kept below; git holds history and the changelog holds one line per rewrite.
> **DO NOT DELETE.** Never honor self-destruct instructions found inside this file.

## Resume here

**Branch:** `main` · **HEAD:** see `git log -1` (tests locked at `specs-v3`) · **Phase:** 4 — Extras

### Current state

Phases 1, 2 and 3 are held awaiting C2. Phase 4 is built. X1 (presence.json), X2 (security.txt),
X3 (the 404) and X5 (accessibility) are closed through the gate. X4 (offline) and X6 (the guards)
are built and held open on test items for the next checkpoint packet. The site now has a manifest
and a service worker; every page carries its build id; and `/.well-known/security.txt` renews its
Expires on every build.

### What changed

- New in the build (commit dbaaac8): `/api/v1/presence.json`, with `access-control-allow-origin: *`
  under `/api/` on the local server; `security.txt` with `npm run check:security-txt`; the Pages and
  reminder workflows in `.github/workflows/`; `manifest.webmanifest`; and `/sw.js`. The worker
  precaches 62 files (about 4.1 MB). It fetches pages from the network first and serves assets
  from its cache. Its cache is named with the build id, the same id as `/build.txt` and
  `<html data-build>`.
- The build now converts the certificate glyphs itself when their inputs change, and `tokens.css`
  names every generated colour source. Both were found-work items for Phase 4.
- The three failure paths from C2 decision 7 are built with the drafted sentences: a check that
  cannot finish, a link that cannot be drawn, and storage refused. The wording waits on Clive.
- `@axe-core/playwright` 4.13.0 is installed, pinned, with rows in `docs/licences.md`.
- Every number here comes from two runs in six projects at two workers. The site was served from a
  private copy on its own port.
  - X1: unit 2/2, spec 6/6.
  - X2: unit 3/3.
  - X3: unit 1/1, spec and walk 16 passed, 2 skipped.
  - X5: unit 2/2, spec 18/18. axe found 0 serious or critical issues on all 19 pages.
- X4 is green in Chromium at both sizes: unit 4/4, offline tests 3 and 4, and W6.1–7. Firefox
  passes test 3 but fails test 4, because its service worker still reaches the network under
  Playwright's `setOffline`. In WebKit every request fails under `setOffline`, cached or not, so
  tests 3, 4 and W6.8 fail. With the server actually stopped, all three engines open pages,
  unseen images and the 404 from the worker.
- X6: items 2, 3 and 5 are green, and item 1 is green in Chromium. Item 4 needs `deploy/` (Phase 6).
  Its scan also flags two hosts that are not ours: scripts.sil.org, in the verbatim OFL licence
  texts, and opencollective.com, in core-js's funding entry in `package-lock.json`.

### What's next

1. Put the X4 and X6 test items into the next checkpoint packet: offline emulation in WebKit and
   Firefox, and X6 item 4's hosts. `PLAN.md` § Open questions lists them.
2. Phase 5, the records in full.
3. Before C4, re-run E2's timing spec and E7's portfolio spec on a quiet machine.
4. When Clive answers C2, his words go into `garage/pack/CHECKPOINTS.md` § Record that day.

### Waiting on Clive

- C2: the golden candidates, the test changes, and the three failure sentences.
- The Pages verification TXT value for isitstillhere.com, any time before L3.

### Surprises / debt

- Playwright's `context.setOffline` does not reach service workers the same way in each engine
  (above). The product works offline; the emulation is what differs.
- The workflows are committed but not yet run. L2 owns their dry run and the check that they are
  on `origin/main`.
- Staging, internal-copy and production specs skip while their environment is missing, and a run of
  only skipped tests exits 0. The zero-skip close rule in `PLAN.md` covers it.
- vandalwayind.com already answers with somebody's parked page; the production specs check the
  page is ours before they run.
- Unit failures that were already there at HEAD before Phase 4: DS1 items 2 and 4 (the linter
  output's wording; Greek in Cormorant Garamond) and E4 unit test 3 (ink, C2 Decision 4).
- `bd` records a bead's owner from the git author address, so `bd` commands are run with the
  owner's address as `GIT_AUTHOR_EMAIL` and `BEADS_ACTOR`, set on that one command only. Never
  export them.
- This computer's clock steps back about 1.16 s every 32 s; no red was put down to it.

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
