---
updated: 2026-10-04
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

- S2 (`still-here-tul`): each leadership card carries the person's id. Unit 3/3 (one skipped,
  after C2); the leadership spec and its walk 10 passed, 2 skipped, in two runs. Held on C2.
- S3 (`still-here-3yo`): Petra's three papers are in `company/research/` (the long one's
  contents add up to 86 pages; the two short ones are 1,214 and 963 words with footnotes);
  `/research/` lists them with covers drawn in code. Unit 4/4; spec and walk 28 passed, 2 skipped.
- S4 (`still-here-r4r`): three case studies of Ms Webb's register and the Memorial bench, quoting
  only what she wrote to us. Unit 4/4; spec and walk 28 passed, 2 skipped, two runs.
- S5 (`still-here-z4r`): I wrote STATUS-002 and STATUS-003 and the schema for the updates file;
  the status page is made from it. Unit 3/3; spec and walk 10 passed, 2 skipped, two runs.
- S6 (`still-here-skd`), S7 (`still-here-5ki`), S8 (`still-here-hng`), S9 (`still-here-eg4`):
  careers, Enterprise, Terms of Presence and Privacy. No form on careers or Enterprise. Unit 3/3,
  4/4, 2/2, 2/2; each spec and walk 10 passed, 2 skipped, two runs.
- Regressions after S9: Phase 0 to 2 unit files all as before except G0 test 4, which is red
  because one commit (the Enterprise one) carries a staff address as its author; that is being
  put right separately. The E0 and DS5 specs: 136 passed, 8 skipped.
- Browser runs used a private copy of the build on its own port (`STAGING_URL` pointed at it),
  because another session's local server on 5320 stopped mid-run once and refused three WebKit
  tests.

### What's next

1. The Phase 3 critic review: W4 (each sub-walk) and W5 by hand. E2 to E5 and E7 re-run after the paused-clock re-tag (`specs-v3`). Before the next
   browser run, check this computer's clock is steady: a 75 s watch of `Date.now()` against
   `performance.now()` should show no jump.
2. When Clive answers C2, his words go into `garage/pack/CHECKPOINTS.md` § Record that day;
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
