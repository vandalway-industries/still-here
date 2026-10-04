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

**Branch:** `main` · **HEAD:** see `git log -1` (T0 at `d8d6ab3`; tests re-tagged `specs-v2`) · **Phase:** 1 — Design system, golden candidates

### Current state

G0, G1, G2 and T0 are closed. Every test the acceptance pack names is written and locked at the
tag `specs-v1`: 50 unit files and 49 browser specs under their bead ids, and a walk spec for every
walk in `garage/pack/WALKS.md`, each assigned to its bead in `docs/bead-map.md` § Walks. The walk
steps live in `e2e/helpers/walks.ts` and find things by role and visible text only. Phase 0's tests
pass; every later bead's tests fail, as they should until the bead is built. Nothing of the website
is built beyond two placeholder pages.

### What changed

- DS1 (`still-here-hlw`) is built and stays open on two items it cannot pass as written.
  `scripts/tokens.mjs` writes `src/css/tokens.css` and `src/js/tokens.js` from `DESIGN.md`'s front
  matter on every build; `scripts/fonts.py` cut the six static faces (Inter 400, Inter Tight 600
  and 700, JetBrains Mono 500, Cormorant Garamond 500 and 600) as TTF and WOFF2 into `src/fonts/`
  with each family's OFL and `coverage.json`. Its test: items 1 and 3 pass; items 2 and 4 fail.
- Item 4: Cormorant Garamond has no Greek. Only Δ, Ω, μ and π are in it, in the Google Fonts
  copy and in the foundry's own releases 3.609 and 4.002. Cyrillic, Latin and Latin Extended are
  all there. No other face was put in its place. This goes to the C2 packet as a decision.
- Item 2: the linter reports `"errors": 0` and exits 0, but version 0.3.0 always answers in JSON
  (even with `--format=text`), and the test looks for the words "0 errors". Every font check in
  the test passes. The test needs a re-tag; it goes in the C2 packet.

- The Phase 0 gate review found eighteen acceptance items held too loosely by the tests. They are
  tightened and re-tagged `specs-v2`; `.bd-gate` locks there. The list is in
  `garage/pack/CHECKPOINTS.md` § Record and goes in the C2 packet. Every tightened test still fails
  until its bead is built. G0's and G1's `.bd-gate` checks accept a recorded re-tag.
- The Tab walk (X5 item 2) runs in WebKit too: Linux WebKit moves Tab through links.
- `PLAN.md` § Build method: beads that need staging, the internal copy or production close only
  from a run with that set and nothing skipped.

- T0 (`still-here-64t`) closed: `tests/unit/still-here-64t-specs.test.ts` 5/5.
- G0, G1, G2 and T0 run together: 26/26.
- The full unit run: 220 tests, 51 pass, 157 fail, 12 skipped. Phase 0 is green (26); the 49
  later-bead files hold the other 25 passes and every failure, each of them with at least one.
- Browser specs, Chromium only (the full six-project run is the close gate's): 131 tests, 101
  failed, 27 skipped, 3 passed. The skipped ones need staging, the internal copy of
  vandalwayind.com or production, and say so.
- The run is recorded in `tests/fixtures/specs-v1-baseline.json`.

### What's next

1. The C2 packet carries DS1's two items: Greek for the certificate face, and the linter test's
   re-tag. DS1 closes when both are settled.
2. DS2–DS6, on the tokens and faces DS1 has written.

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
- Cormorant Garamond does not cover Greek (DS1 item 4). See What changed.
- The full unit run (`node --test 'tests/unit/**/*.test.ts'`) takes about two minutes: 220 tests,
  51 pass, 157 fail, 12 skipped, every failure in a bead not yet built. One earlier full run had
  G2's `.beads/` check fail because a bead comment was still being written out to
  `.beads/issues.jsonl` while the run went on; the next run passed. Change no bead mid-run.
- `bd` records a bead's owner from the git author address, so beads are filed and updated with the
  owner's address as `GIT_AUTHOR_EMAIL` and `BEADS_ACTOR`.

## Changelog

- 2026-10-03 — G0: repository promoted, 53 beads filed, gates installed; first commit held at the PII gate. (Martin, 2026-10-03)
- 2026-10-04 — G0 closed; first commit, private repository, push over SSH. (Martin, 2026-10-04)
- 2026-10-04 — G1 and G2 closed; scaffold, local Pages server, records filed. (Martin, 2026-10-04)
- 2026-10-04 — T0 closed; every test written red and locked at specs-v1. (Martin, 2026-10-04)
- 2026-10-04 — Tests tightened after the Phase 0 gate review; re-tagged specs-v2. (Martin, 2026-10-04)
- 2026-10-04 — DS1 built; held open on Greek coverage and the linter test's wording, both for C2. (Martin, 2026-10-04)
