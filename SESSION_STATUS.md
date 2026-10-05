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

**Branch:** `main` · **HEAD:** see `git log -1` (tests locked at `specs-v3`) · **Phase:** 3 — The company website

### Current state

Phases 1 and 2 are held awaiting C2. Phase 3 is built: S3 to S9 are closed through the gate, and
S2 (leadership) is held open only on its C2 blind pick. Every page the PRD lists is now built; no
page carries `sh-placeholder` any more. The build writes `/research/` and
each paper from `company/research/`, and `/status` from `company/status/status-updates.xml`, and
reads nothing else under `company/`.

### What changed

- The five held Phase 2 beads were re-run at `specs-v3`, the paused clock, on 2026-10-05: two full
  runs in six projects at two workers, against HEAD 2e1da15 served from a private copy on its own
  port. Another builder's uncommitted work in the tree was not in the copy.
- E5 (`still-here-wlr`) is closed through the gate. Link spec: 6/6 in Chromium at both sizes and 4
  passed, 2 skipped elsewhere, in both runs; unit 3/3.
- E3 (`still-here-3xf`) BROWSER PASS flipped: certificate spec 30/30 in both runs. Open on item 4
  (C2 Decision 6) and item 7 (after C2).
- E2 (`still-here-3a3`) item 10 flipped. BROWSER PASS is held: timing items 5 (WebKit spread
  210 ms against 200) and 6 (an indicator sample race) were red once in run 1, under a load
  average of about 10, and green in run 2. The W1 walk in WebKit went over 5,600 ms once (C2 test
  change 5). Item 14 waits on C2.
- E4 (`still-here-cq5`) item 1 flipped. The rest is held on C2 items exactly as before: unit test 3 and
  item 3 at 9.8% (Decision 4), item 4 at 3.01% / 3.29% (test change 6), item 6 at 390
  (0.585, test change 7), and its W1.6–7 walk in WebKit at 5,767 and 5,637 ms (test change 5).
- E7 (`still-here-c29`) is unchanged. Spec test 1–2 in WebKit ran out of its 30 s in run 1, under
  load; it was green in run 2. Every identifier now matches.
- This computer's clock still steps back 1.14–1.19 s about every 31 s: 59 steps were logged during
  the runs. No red was put down to a step.

### What's next

1. The Phase 3 critic review: W4 (each sub-walk) and W5 by hand.
2. Before C4, re-run E2's timing spec and E7's portfolio spec on a quiet machine (load low, no
   other Playwright runs). If both are green twice, E2 BROWSER PASS (less W1, C2 test change 5)
   and E7 items 1–2 and BROWSER PASS can flip, and E7 can close.
3. When Clive answers C2, his words go into `garage/pack/CHECKPOINTS.md` § Record that day;
   approved candidates are copied to their golden names; the critic runs the waiting blind picks;
   any test change he red-pens goes to a test-author session and a re-tag.

### Waiting on Clive

- The Pages verification TXT value for isitstillhere.com, any time before L3.

### Surprises / debt

- Staging, internal-copy and production specs skip while `STAGING_URL`, `VANDALWAY_INTERNAL_URL`,
  `PAGES_CHALLENGE` or production are missing, and a run of only skipped tests exits 0. The
  zero-skip close rule in `PLAN.md` covers it.
- vandalwayind.com already answers with somebody's parked page; the production specs check the
  page is ours before they run.
- X5 needs `@axe-core/playwright`. It is not installed yet, because every package needs its row
  in `docs/licences.md`; X5 adds both.
- Cormorant Garamond does not cover Greek (DS1 item 4).
- svg2pdf.js reads only the first value of a text element's x list, so a heading with explicit
  glyph positions is one tspan per glyph. WebKit resolved `document.fonts.ready` before the
  certificate's faces had loaded when the certificate was the first thing to use them; the home
  page now preloads and loads both Cormorant faces itself.
- The candidate scripts (`scripts/certificate-candidate.mjs`, `scripts/page-candidates.mjs`) and
  the glyph converter (`scripts/certificate-glyphs.mjs`, which needs `uv`) are run by hand.
- The full unit run (`node --test 'tests/unit/**/*.test.ts'`) takes about two minutes: 220 tests,
  51 pass, 157 fail, 12 skipped, every failure in a bead not yet built. One earlier full run had
  G2's `.beads/` check fail because a bead comment was still being written out to
  `.beads/issues.jsonl` while the run went on; the next run passed. Change no bead mid-run.
- `bd` records a bead's owner from the git author address, so `bd` commands are run with the
  owner's address as `GIT_AUTHOR_EMAIL` and `BEADS_ACTOR`, set on that one command only. Never
  export them: a `git commit` in the same shell takes the address as its author.

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
