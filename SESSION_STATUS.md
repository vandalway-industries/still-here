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

Phase 0 is closed. In Phase 1, DS2, DS3, DS4 and DS5 are closed; DS1 stays open on two items for
C2; DS6 (the 1997 page) is being built in its own worktree; DS7 (the C2 packet) comes last. Three
of the four golden candidates are on disk in `garage/pack/exemplars/candidates/`: the certificate
(PNG and PDF), home at 390 and 1440, and leadership at 1440.

### What changed

- DS2 (`still-here-jw0`) closed. The mark is drawn as four bracket paths and one circle measured
  from the logo (`src/js/mark.js`); `scripts/brand.mjs` writes `src/brand/mark.svg` and
  `src/favicon.svg` on every build; `scripts/icons.mjs` rendered the ICO (16, 32), the touch icon
  and the three manifest icons. Test 2/2.
- DS3 (`still-here-aac`) closed. `scripts/derivatives.py` made 58 WebP files and the Open Graph
  JPEG under `src/images/`, none over 250 KB (the largest 247 KB) and none carrying metadata.
  Test 3/3. The hero is cropped wider than the manifest's box, which cut through the "ASSET 001"
  callout; that box goes to C2.
- DS4 (`still-here-sp7`) closed. `src/js/certificate/draw.js` draws the certificate; the QR code
  comes from our own encoder (`qr.js`); the two signatures are paths converted from two OFL script
  faces kept in `scripts/signature-faces/` and never shipped. jsPDF 4.2.1 and svg2pdf.js 2.8.1 are
  now exact-pinned dev dependencies, with rows in `docs/licences.md`. Unit 8/8; browser 4/4 in
  Chromium and WebKit.
- DS5 (`still-here-9uk`) closed. `/` and `/leadership` are built as static pages with the shared
  header and footer written into each (E0 makes them the shell). Unit 4/4; browser 12/12 in
  Chromium and WebKit.
- Phase 0 unit files still pass, 26/26.

### What's next

1. DS6 lands from its worktree; then DS7, the C2 packet.
2. The C2 packet carries: DS1's two items; the hero crop box (DS3); Lucas's name on his card
   (DS5): the seed table says "Lucas", the staff record and the browser spec say "Lucas the
   Intern", and the card shows the staff record's; and the candidates themselves.

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
