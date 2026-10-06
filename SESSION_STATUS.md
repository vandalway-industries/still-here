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

**Branch:** `main` · **HEAD:** see `git log -1` (tests locked at `specs-v6`) · **Phase:** 7 active, entry not met; Phase 2 at its exit review, Phase 6 held on V4

### Current state

The five beads that went red under load were re-run on a quiet machine, twice each, and all five
closed through the gate: E2, E4, E7, X4 and V2. V1 closed on the critic's fresh blind pick of the
1997 page. Phases 0, 1, 3, 4 and 5 are done. Every Phase 2 bead is closed, and the phase waits on
its exit review. Phase 6 waits on V4 alone, and V4 waits on the null MX that L3 writes. Phase 7 is
the active row.

### What changed

- Why the re-run: a file search covering the whole computer had held the load average at 10 to 15
  for seven hours. It was stopped at 00:36. Every red from the last re-run on these five beads was
  measured under that load.
- How: a private copy of HEAD 973717a, `npm ci` and a build, served on a free port. One worker.
  Before each run I waited for the one-minute load to drop below 3. X4 ran locally, with
  STAGING_URL unset, so each offline test stops its own server. V2 ran with
  VANDALWAY_INTERNAL_URL set.
- E2: ritual, timing and walk 86 passed, 10 skipped, 0 failed, in both runs (00:39–01:00). Then the
  gate's own run at three workers: ritual 60 + 6 skipped, timing 18/18, walk 8 + 4 skipped. Closed.
- E4: export and walk 5/5 in Chromium and WebKit at both sizes, both runs. Test 7 was green at
  webkit-390 both times. Firefox ran its download test, 1 passed + 4 skipped. BROWSER PASS flipped,
  and the gate passed. Closed.
- E7: portfolio and walk 4/4 in Chromium and WebKit at both sizes, both runs. Test 1–2 took 19.8 s
  in WebKit. Items 1–2 and BROWSER PASS flipped. The gate's first attempt ran out of time in
  WebKit once, at a download. Its second passed 18/18. Closed.
- X4: offline and the W6 walk 3/3 in Chromium and WebKit at both sizes, Firefox 2 + 1 skipped,
  both runs. W6.1 was green at chromium-390 every time. BROWSER PASS flipped, and the gate passed.
  Closed.
- V2: the internal spec 6 passed, 0 skipped, in both runs; unit 3/3, 0 skipped, twice. The gate
  passed 6/6. Closed.
- `PLAN.md`: E2, E4, E7, X4, W6, V1 and V2 ticked with this evidence. Phase 4 done. The drift
  check is clean.

### What's next

1. The Phase 2 exit review.
2. The PM decides on the offline helper's staging branch before L5 plays W6 on staging.
3. Phase 7: L1 first. L3's null MX lets V4 close, and that closes Phase 6.

### Waiting on Clive

- A second look at the certificate golden with the thicker guilloche.
- Whether the code gets a licence before the repository goes public (the C3 packet, § 7).

### Surprises / debt

- E7's test 1–2 has about 11 s to spare on one worker in WebKit (18.6 s in a traced run, each
  PDF download 1.0–1.7 s). At three workers on this computer it can run out once, as it did in
  the gate's first attempt.
- The V2 unit test skips test 3 unless `.env.staging` is loaded. Loaded, it is 3/3, 0 skipped.
- With STAGING_URL set, the offline helper aborts requests instead of stopping a server. WebKit
  refuses that and Firefox's service worker goes around it. L5 meets this when it plays W6 on
  staging.
- The X6 unit test needs a git work tree, because test 4 reads `git ls-files`.
- Playwright's `context.setOffline` does not reach service workers the same way in each engine.
  The product works offline; the emulation is what differs.
- The workflows are committed but not yet run. L2 owns their dry run.
- Staging, internal-copy and production specs skip while their environment is missing, and a run
  of only skipped tests exits 0. The zero-skip close rule in `PLAN.md` covers it.
- vandalwayind.com already answers with somebody's parked page; the production specs check the
  page is ours before they run.
- `bd` records a bead's owner from the git author address. So `bd` commands run with the owner's
  address as `GIT_AUTHOR_EMAIL` and `BEADS_ACTOR`, set on that one command only. Never export
  them.
- Caddy on the production server keeps one deleted, empty log file open until it next restarts.
  It is harmless and goes away on Caddy's next restart.
- The printer photograph has dated sticky notes and a sticker on it. Clive says both stay.
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
