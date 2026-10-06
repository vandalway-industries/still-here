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

**Branch:** `main` · **HEAD:** see `git log -1` (tests locked at `specs-v6`) · **Phase:** 7 active, entry not met; Phases 2, 4 and 6 held

### Current state

The held beads were re-run at `specs-v6`, twice each, from a private copy of HEAD 3f4803e. Four
closed through the gate: DS1, E3, S2 and X6. Phases 1 and 3 are done. Seven beads are still open.
E2, E4 and E7 hold Phase 2, X4 holds Phase 4, and V1, V2 and V4 hold Phase 6. Phase 7 is the
active row, but it cannot start until those three phases reach their gates.

### What changed

- The internal copy of vandalwayind.com was taken down and put back with the page's e-mail links
  as in the golden. The undo ran at 03:43 UTC and the install straight after
  (`deploy/deploy-log.md` runs 16 and 17). `caddy validate` passed before each reload. All 11
  other blocks were byte-identical and the network's other routes hashed the same. The ten other
  sites answered as before. Served: one `mailto:`, to webmaster@vandalwayind.com, and
  `Last-Modified` 1997-08-22. The page is the repository's except for its counter line, which now
  reads "times since October 6, 2026.", because the counting started again.
- The re-run: `npm ci` and a build in the copy, served on a free port, two workers. Each bead's
  unit tests ran twice. Its browser specs ran twice in all six projects, the internal-copy ones
  with VANDALWAY_INTERNAL_URL set. The two full browser runs each came to 200 passed, 16 failed
  and 30 skipped. Every skip is an engine limit or E2 item 14's labelled human pick.
- Closed: DS1 (unit 4/4 twice), E3 (certificate spec 36/36 twice, then in the gate), S2 (10
  passed twice, then in the gate) and X6 (see the next point). E2 item 14, E3 item 7 and S2 item
  4 were flipped on the critic's blind picks of 2026-10-05, which passed.
- X4 and X6 ran wrong with STAGING_URL set. With it set, the offline helper aborts every request
  instead of stopping a server. WebKit refuses that ("Blocked by Web Inspector") and Firefox's
  service worker goes around it, so we were red there in both runs. I ran their specs twice more
  without it, so that each test stops its own server from the copy. X6 was green in both of those
  runs and then in the gate. X4's tests 3 and 4 were green in all six projects both times, so
  those items are flipped. L5 will meet the same staging branch when it plays W6 on staging.
- The STRICT gate refused E2. Its own run of the timing spec went red once in Chromium: line 1
  held 631.6 ms against 983, with the load average at 12 to 15. My two runs were green in all six
  projects. E2's boxes are all flipped.

### What's next

1. The critic's fresh blind pick of the 1997 page against its golden (V1 item 4).
2. The PM decides on the new reds: E4 test 7, X4's W6 at chromium-390, V2's network red, and the
   offline helper's staging branch.
3. E2's gate run and E7's WebKit test on a quiet machine. L3's null MX for V4. Then Phase 7.

### Waiting on Clive

- A second look at the certificate golden with the thicker guilloche.
- Whether the code gets a licence before the repository goes public (the C3 packet, § 7).
- The Pages verification TXT value for isitstillhere.com, any time before L3.

### Surprises / debt

- New reds, reported and not fixed. E4 test 7 at webkit-390, once: "Preparing PNG…" showed, then
  the button was gone before its `aria-disabled` check. X4's W6.1 at chromium-390, once: the
  service worker was not ready within 15 s. V2's spec in Chromium, once: `ERR_NETWORK_CHANGED`
  on this workstation.
- E7 test 1–2 in WebKit ran out of its 30 s in both runs while taking the pdf.js render-back
  screenshot. W7 step 3 still waits on L3 (`queryMx ENODATA`).
- A correction to the record: commit 1df6811's message says the `s07` bead was "filed from C3
  and closed". The gate had in fact refused it then. It closed later, at 2ce6cd5, through the
  gate at `specs-v5`.
- The load average sat between 10 and 15 the whole session. A file search left running on this
  computer since 17:27 kept part of it busy. I left it alone.
- The X6 unit test needs a git work tree, because test 4 reads `git ls-files`. In the copy it
  fails for that reason only, so it was run in the clean work tree at the same HEAD.
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
