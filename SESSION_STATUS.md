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

Phase 1's work is done apart from DS1, which stays open on two items that went to C2. DS2 to DS7
are closed. All five golden candidates are on disk in `garage/pack/exemplars/candidates/`: the
certificate (PNG and PDF), home at 390 and 1440, leadership at 1440, and the 1997 page. The C2
packet is out at `docs/checkpoints/c2-packet.md`. The run carries on into Phase 2; the **[after
C2]** steps wait for Clive's answer.

### What changed

- DS6 merged (8ef592c) and closed: the 1997 page and its guestbook in `vandalwayind/`, five
  archived pages in `garage/pack/exemplars/1997/` with contact details withheld (`SOURCES.md`),
  and the `vandalway-1997.png` candidate. Unit 4/4; candidate spec 4/4 in Chromium and WebKit.
- DS7 (`still-here-9xd`) closed. The C2 packet links each candidate with the four C2 questions under
  it and the points to check, three decisions (Greek in the certificate face, Lucas's display name,
  the hero crop box), two test changes for red-pen (specs-v2 for sight; the DS1 linter assertion),
  two calls made under a rule, and the turns used (Phase 0 61, Phase 1 22, from the run's log).
  `tests/unit/still-here-9xd-c2-packet.test.ts` 2/2.

### What's next

1. Phase 2 (E0 onward) on everything that does not wait for C2.
2. When Clive answers, his words go into `garage/pack/CHECKPOINTS.md` § Record that day; approved
   candidates are copied to their golden names; the critic runs the waiting blind picks; any test
   change he red-pens goes to a test-author session and a re-tag.

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
- `bd` records a bead's owner from the git author address, so beads are filed and updated with the
  owner's address as `GIT_AUTHOR_EMAIL` and `BEADS_ACTOR`.

## Changelog

- 2026-10-03 — G0: repository promoted, 53 beads filed, gates installed; first commit held at the PII gate. (Martin, 2026-10-03)
- 2026-10-04 — G0 closed; first commit, private repository, push over SSH. (Martin, 2026-10-04)
- 2026-10-04 — G1 and G2 closed; scaffold, local Pages server, records filed. (Martin, 2026-10-04)
- 2026-10-04 — T0 closed; every test written red and locked at specs-v1. (Martin, 2026-10-04)
- 2026-10-04 — Tests tightened after the Phase 0 gate review; re-tagged specs-v2. (Martin, 2026-10-04)
- 2026-10-04 — DS1 built; held open on Greek coverage and the linter test's wording, both for C2. (Martin, 2026-10-04)
- 2026-10-04 — DS2–DS5 closed; three of the four golden candidates on disk. (Martin, 2026-10-04)
- 2026-10-04 — DS6 merged and closed; DS7 closed; the C2 packet is out. (Martin, 2026-10-04)
