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

**Branch:** `main` · **HEAD:** see `git log -1` (T0 at `d8d6ab3`, tag `specs-v1`) · **Phase:** 0 — Promote, gates, records filed

### Current state

G0, G1, G2 and T0 are closed. Every test the acceptance pack names is written and locked at the
tag `specs-v1`: 50 unit files and 49 browser specs under their bead ids, and a walk spec for every
walk in `garage/pack/WALKS.md`, each assigned to its bead in `docs/bead-map.md` § Walks. The walk
steps live in `e2e/helpers/walks.ts` and find things by role and visible text only. Phase 0's tests
pass; every later bead's tests fail, as they should until the bead is built. Nothing of the website
is built beyond two placeholder pages.

### What changed

- T0 (`still-here-64t`) closed: `tests/unit/still-here-64t-specs.test.ts` 5/5.
- G0, G1, G2 and T0 run together: 26/26.
- The full unit run: 220 tests, 51 pass, 157 fail, 12 skipped. Phase 0 is green (26); the 49
  later-bead files hold the other 25 passes and every failure, each of them with at least one.
- Browser specs, Chromium only (the full six-project run is the close gate's): 131 tests, 101
  failed, 27 skipped, 3 passed. The skipped ones need staging, the internal copy of
  vandalwayind.com or production, and say so.
- The run is recorded in `tests/fixtures/specs-v1-baseline.json`.

### What's next

1. The Phase 0 exit-gate review.
2. Phase 1: DS1 (tokens and fonts) first.

### Waiting on Clive

- The Pages verification TXT value for isitstillhere.com, any time before L3.

### Surprises / debt

- Staging, internal-copy and production specs skip while `STAGING_URL`, `VANDALWAY_INTERNAL_URL`
  or production are missing, and a run of only skipped tests exits 0. Whoever closes L1, L5, V2–V4
  or N1–N3 runs them with those set and checks nothing was skipped.
- vandalwayind.com already answers with somebody's parked page; the production specs check the
  page is ours before they run.
- X5 needs `@axe-core/playwright`. It is not installed yet, because every package needs its row
  in `docs/licences.md`; X5 adds both.
- Cormorant Garamond may not cover Greek, which DS1 item 4 requires. DS1 will find out.
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
