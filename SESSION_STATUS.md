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

**Branch:** `main` · **HEAD:** see `git log -1` (tests locked at `specs-v2`) · **Phase:** 2 — The shell, the ritual and the certificate

### Current state

Phase 1 is held awaiting C2 (DS1 open on its two C2 items; DS2 to DS7 closed; the C2 packet is out
at `docs/checkpoints/c2-packet.md`). Phase 2 is active and E0, the shell, is closed. Every page the
PRD lists answers: home and leadership as built, the 404 for real, and the rest as placeholders
marked `sh-placeholder` that say they are being prepared. E1 is next.

### What changed

- E0 (`still-here-lsz`) closed. The header, menu, footer, Content-Security-Policy and Open Graph
  tags live once, in `src/_shell/`, and the build includes them into every page; a page without
  the markers stops the build. The 404 carries the fixed sentence and Return home. The Open Graph
  picture is now `src/images/hero-og-1200.jpg` (renamed from `og-1200.jpg`; `scripts/derivatives.py`
  writes the new name). The link checker is `npm run check:links` after `npm run build`. The menu
  button reads "Menu" and "Close menu". Short pages keep the footer at the bottom of the window.
- Checked: E0 unit 6/6; shell and walk specs 124 passed, 2 skipped (the walk runs in Chromium and
  WebKit only); W4.1–2 played; G0, G1, G2, T0, DS2 to DS7 and X3 unit tests pass; the DS4, DS5,
  DS6 and X3 specs pass; DS1 still fails only its two C2 items, as before; 19 pages, 0 broken links.
  In a browser at 390 and 1440 the only console error is the 404 page reporting its own 404.

### What's next

1. E1, the identifier, then E2 to E7 in order.
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
- 2026-10-04 — E0 closed; the shell on every page, placeholders for the pages to come, the 404. (Martin, 2026-10-04)
