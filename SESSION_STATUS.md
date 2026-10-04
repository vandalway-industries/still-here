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

**Branch:** `main` · **HEAD:** see `git log -1` (G1 at `6934d93`, G2 at `f8e7f89`) · **Phase:** 0 — Promote, gates, records filed

### Current state

G0, G1 and G2 are closed. The repository builds (`npm run build` writes `site/` and nothing else)
and the local Pages server answers on port 5320 the way GitHub Pages does. Playwright 1.59.1 is
pinned with Chromium, WebKit and Firefox installed; the walk-substitute helpers are in
`e2e/helpers/`. The sample week's records are filed in `company/`, verbatim and dated Monday
2026-09-28 to Friday 2026-10-02, with the staff list, the inventory and the gum graph seed. The
tracker validates against `company/tracker/schema.json` and loads 55 issues into a throwaway
database; our own `.beads/` is untouched. The continuity check finds nothing. Nothing of the
website is built beyond two placeholder pages.

### What changed

- G1 (`still-here-2d9`) closed: `tests/unit/still-here-2d9-serve-pages.test.ts` 6/6.
- G2 (`still-here-540`) closed: `tests/unit/still-here-540-seeds.test.ts` 6/6.
- Unit suite 21/21. PII tree scan at the public tier clean. Drift check clean.

### What's next

1. T0 (`still-here-64t`): every test written red, tagged `specs-v1`.
2. Phase 1: DS1 (tokens and fonts) first.

### Waiting on Clive

- The Pages verification TXT value for isitstillhere.com, any time before L3.

### Surprises / debt

- Playwright 1.59.1 wanted a WebKit build we did not have; the one on disk belonged to another
  version. Installed it with Firefox. The G1 test now checks each engine's executable.
- The tracker schema check found two closed issues (sh-031, sh-053) whose last update came before
  their closing. Their `updated_at` now equals `closed_at`. ISSUE-001's quotation marks in sh-051
  now match the record.
- `checkInstallable()` and `checkNullMx()` are written but have nothing to check yet: the first
  waits for the offline work (X4), the second for the null MX record on vandalwayind.com.
- `bd` records a bead's owner from the git author address, so beads are filed and updated with the
  owner's address as `GIT_AUTHOR_EMAIL` and `BEADS_ACTOR`.

## Changelog

- 2026-10-03 — G0: repository promoted, 53 beads filed, gates installed; first commit held at the PII gate. (Martin, 2026-10-03)
- 2026-10-04 — G0 closed; first commit, private repository, push over SSH. (Martin, 2026-10-04)
- 2026-10-04 — G1 and G2 closed; scaffold, local Pages server, records filed. (Martin, 2026-10-04)
