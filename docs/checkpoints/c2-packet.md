---
updated: 2026-10-04
read_by: Clive, at C2; the run, to know what waits on his answer; the critic, for which goldens are approved
relations:
  derived_from: ../../garage/pack/CHECKPOINTS.md
---

# C2 — goldens: the packet for Clive

Clive, this is C2. Phase 1 has drawn the five golden candidates, and each one is linked below. For
each, approve it or red-pen it. Approved candidates become the goldens that the later styling steps,
V1's finish and every critic blind pick are measured against. A red-pen says what to change, and the
candidate is redrawn.

The build does not wait for you. Phase 2 starts now on everything that does not depend on your
answer. The steps marked **[after C2]** stay open until your answer is recorded. (Jules, 2026-10-04)

The four C2 questions from `garage/pack/CHECKPOINTS.md` are repeated under every candidate, and the
one that matters most for that candidate is marked. The check symbol is already decided (I-12), so
it is not asked again.

## The candidates

### 1. The certificate — Folding chair

- [certificate.png](../../garage/pack/exemplars/candidates/certificate.png), 3,300 × 2,550
- [certificate.pdf](../../garage/pack/exemplars/candidates/certificate.pdf), one page

Specimen: "Folding chair", issued 2026-10-03T10:52:00Z, shown in America/Chicago. The QR code
encodes Folding chair's own identifier.

Questions:

- Is it trustworthy and expensive?
- Is the certificate's top language right, and whose signatures? **(the main one here)**
- Do the examples read right as shown?
- Does the 1997 page read as found?

Please check:

- **Signatures.** Clive's is drawn from the WindSong face and Diane's from the Petemoss face. Both
  are converted to paths ahead of time by a generation script we run by hand (it reproduces the
  same paths every time), and the faces are never shipped. Say whether the
  hands suit the people, and whether these are the right two signers.
- **The seal.** Its ring text is in graphite.
- **The guilloche border.**
- **The period after STILL HERE.** Its space comes to about 0.15 em, and the bar is 0.12 em. If
  the gap looks too wide to you, red-pen it.
- **The seed lines as set.** The top language and the body lines come from `CONTENT_SEEDS.md`,
  word for word. A red-pen on a line goes to the line.
- The PDF should match the PNG. If one looks right to you and the other doesn't, tell us which.

### 2. Home at 390

- [home-390.png](../../garage/pack/exemplars/candidates/home-390.png), 390 wide

Questions:

- Is it trustworthy and expensive?
- Is the certificate's top language right, and whose signatures?
- Do the examples read right as shown? **(the main one here)**
- Does the 1997 page read as found?

Please check:

- The ten example chips and their order. At this width they wrap below the input.
- The "Examples" label above the chips. This label is drafted and is not in the seeds.
- The chair crop above the heading. It uses the crop box under **Decisions**, item 3.

### 3. Home at 1440

- [home-1440.png](../../garage/pack/exemplars/candidates/home-1440.png), 1440 wide

Questions:

- Is it trustworthy and expensive? **(the main one here)**
- Is the certificate's top language right, and whose signatures?
- Do the examples read right as shown?
- Does the 1997 page read as found?

Please check:

- The chips, with the drafted "Examples" label above them, as at 390.
- The chair in the right column. This crop shows the whole "ASSET 001 / FOLDING CHAIR" callout
  (**Decisions**, item 3).

### 4. Leadership at 1440

- [leadership-1440.png](../../garage/pack/exemplars/candidates/leadership-1440.png), 1440 wide

Questions:

- Is it trustworthy and expensive? **(the main one here)**
- Is the certificate's top language right, and whose signatures?
- Do the examples read right as shown?
- Does the 1997 page read as found?

Please check:

- The intro line, which is drafted and is not in the seeds: "The people who make STILL HERE, and
  who remain."
- Lucas's card. It reads "Lucas the Intern", the name in the staff record. The seed table has
  "Lucas". You decide which is right (**Decisions**, item 2).
- The other cards: names, titles and lines as the seeds and the staff record give them.

### 5. Vandalway Industries, 1997

- [vandalway-1997.png](../../garage/pack/exemplars/candidates/vandalway-1997.png), 1024 wide

Questions:

- Is it trustworthy and expensive?
- Is the certificate's top language right, and whose signatures?
- Do the examples read right as shown?
- Does the 1997 page read as found? **(the main one here)**

Please check:

- Whether it reads like a page someone found on an old server: the period GIFs, the
  under-construction sign, the counter, and the e-mail link to webmaster@vandalwayind.com.
- The guestbook page is built, but this screenshot does not show it.
- It was drawn against five pages archived from 1997 (`garage/pack/exemplars/1997/`). See **Calls
  made under a rule**, item 1.

## Decisions

These three need your call. Each option lists what it changes.

1. **Greek in the certificate face (DS1, item 4).** DS1 asks for Cormorant Garamond to cover Latin,
   Latin Extended, Greek and Cyrillic. No official release of the face has a Greek alphabet. We
   checked Google Fonts (9710da1e) and the foundry's v4.002 and v3.609, and the only Greek
   characters in any of them are Δ, Ω, μ and π. DS1 stays open until you choose:
   - **a. Drop Greek from the certificate face's requirement.** The acceptance item and its locked
     test (`tests/unit/still-here-hlw-tokens.test.ts`, test 4, the three Greek ranges) lose Greek,
     and your red-pen approves that test change. A name in Greek is drawn in the fallback face.
   - **b. Use a named OFL face for Greek only.** We add that face and its licence. Test 4 then
     checks the pair of faces rather than Cormorant alone, which is a test change your red-pen
     approves. Test 2 currently allows only the four families, so it needs the same change.
   - **c. Accept the gap in the name layout.** The requirement stays as it is. A Greek name prints
     in whatever face the layout falls back to, and the limitation is written down where users
     can see it. DS1 item 4 cannot pass as written, so the acceptance item is reworded.
2. **Lucas's display name (DS5).** The leadership seed table in `CONTENT_SEEDS.md` says "Lucas".
   The staff record `company/staff/staff.yaml` and the company records say "Lucas the Intern". The
   card shows the staff record's name, and the browser spec takes its names from that record.
   - **"Lucas the Intern"**: nothing changes. The seed table is corrected to match the record.
   - **"Lucas"**: the leadership card changes. Either the staff record and the records that use the
     name change with it, or the card stops showing the staff record's name. In the second case the
     browser spec (`e2e/specs/still-here-9uk-home-leadership-candidate.spec.ts`) needs a re-tag,
     and your red-pen approves it.
3. **The hero crop box (DS3).** In `ASSET_MANIFEST.md`, the box for `still-here-hero-chair.png` is
   (1008,162) → (1550,834). That box cuts through the "ASSET 001 / FOLDING CHAIR" callout. The
   build uses (1044,110) → (1656,875) instead, which is the same 4:5 ratio and gives the same 440
   and 542 output widths.
   - **Keep the build's box.** The manifest is updated to match. Both home candidates stay as
     shown.
   - **Name a different box.** The derivatives and both home candidates are made again from your
     box.

## Test changes for your red-pen

Under the re-tag rule, your red-pen on a test change is your approval of it. A separate test-author
session then applies it and re-tags. No builder edits a locked test.

1. **specs-v2 (shown for your information; already recorded).** On 2026-10-04, before any builder
   ran, the Phase 0 gate review found eighteen assertions that were looser than their acceptance
   items. The tests were tightened and re-tagged `specs-v2`, and `.bd-gate` now locks at
   `specs-v2`. No acceptance text changed. `CHECKPOINTS.md` § Record lists all eighteen items and
   the test each one tightened (DS3.2, DS4.5, DS4.6, DS7.1, E2.10, E3.4, S3.2, S5.2, X4.3, X4.4,
   X5.2, X6.1, V2.1–2, V3.2, L3.3, L4.4, N1.3, N2.3). G1's item 5 still names `specs-v1`. That
   wording is out of date, because the re-tag rule replaced it.
2. **DS1's linter check (for your approval).** The file is `tests/unit/still-here-hlw-tokens.test.ts`,
   test 2, the last assertion. It currently matches the linter's output against `/\b0 errors?\b/i`.
   Version 0.3.0 of `@google/design.md` prints JSON instead, a summary with `"errors": 0`, and
   exits 0. The text "0 errors" never appears, so the assertion fails on a clean `DESIGN.md`. The
   change: parse the JSON output and assert `summary.errors === 0`. The exit-status assertion
   above it stays. DS1 item 2's wording ("reports 0 errors") does not change.

3. **G0's bead check versus work found during the build (for your approval).** The file is
   `tests/unit/still-here-agb-promote.test.ts`, test 7. It asserts that every bead is an
   `ACCEPTANCE.md` section ("beads exist that are not ACCEPTANCE sections"). Our working rule says
   work found during the build is filed as a bead, so any such bead turns G0 red. Until you decide,
   found work goes into `PLAN.md` as a step under the phase that owns it. The change: test 7 checks
   that every `ACCEPTANCE.md` section has its bead, and that every other bead names the bead it was
   found from. Neither side's wording in `ACCEPTANCE.md` changes.

## Calls made under a rule

These were decided under existing rules. They are listed so you know about them; nothing here needs
an answer.

1. **The archived 1997 pages are not byte-for-byte copies.** Five pages were fetched from the
   archive into `garage/pack/exemplars/1997/`, and none was refused. Third-party contact details
   were withheld so that they do not travel with this repository and so that the public-tier
   personal-data check passes: every e-mail address became `withheld@example.invalid`, every
   telephone and fax number `[number withheld]`, and one street address `[street withheld]`. Two
   pages, `joys.html` and `sunfresh-foods.html`, were served as ISO-8859-1 and are stored
   transcoded to UTF-8 with the same characters. Nothing else was edited.
   `garage/pack/exemplars/1997/SOURCES.md` records all of this.
2. **Two exact allowances in the personal-data check.** The whole-tree scan allows exactly two
   literals beyond its defaults. One is our own webmaster address on the 1997 domain,
   `webmaster@vandalwayind.com`, which the 1997 page's e-mail link requires. The other is GitHub's
   SSH host, `git@github.com`. Both are exact strings, not patterns. `AGENTS.md` records them in
   the scan command.

## Addendum — found while building the ritual and the certificate (2026-10-04)

The packet went out before Phase 2. Building the ritual (E2), the certificate for each issue (E3) and
its exports (E4) raised the items below. Each test change was measured twice, once by the builder and
once by a separate reviewer who reproduced it; where they disagreed, the reviewer's number is the one
given here.

**Test changes for your red-pen**

4. **A paused clock for the timed specs.** The specs for E2 (items 9 and 10), E3 (tests 2, 5 and 6)
   E4 (item 1, and `issued()` in its unit test) E5 (`e2e/specs/still-here-wlr-link.spec.ts` tests 1–2; Firefox issued at 10:52:02 where the spec expects 10:52:00) and E7 (`e2e/specs/still-here-c29-portfolio.spec.ts`, its `three()` helper) start a fake clock that keeps running while the
   page loads. A slow first load in Firefox (about 2 s; a 40-byte page takes 1.2 s there too) pushes
   the press into the next second. Our identifier then, correctly, records that next second. The
   change: set the clock ten seconds early, load and type, pause it at the intended second, then
   press. Measured install-to-press when warm: Chromium 135–337 ms, WebKit 196–249 ms, Firefox
   230–298 ms.
5. **Walk timing.** W1.5 and W8.2 time the sequence with the test machine's wall clock. On our
   build machine that clock has been stepping back about 1.16 s every 32 s. The change: time from the keypress to the result's arrival inside the
   page, which also removes a 5.6 s overshoot seen when three browsers run at once. In the page the result arrives at 4.61–4.65 s, inside your four to five.
6. **E4 item 4, the render-back comparison.** The helper rounds 1650.0000000000002 up to 1651 px
   and squeezes it into 1650, which costs about 3%. The change: round, or crop.
7. **E4 item 6 at phone width.** At 390 the Hebrew name is 40 × 21 px on screen, so a single pixel
   decides the comparison (0.585 against 0.6). The rendering is right: שולחן, right to left, the
   same glyphs and placement. The change: compare at twice the scale.

8. **E3 item 5, decoding the QR code.** The spec decodes a picture of the on-screen certificate. The
   promise in the PRD is about the files people keep. The change: decode the exported PNG and the
   rendered PDF at the longest name. (Done by hand at review: both decode in both engines; pdf.js in
   WebKit needs 200 dpi rather than 150.)

**Decisions**

4. **E4 item 3's wording.** "Ink differs by more than 20% from a no-font render" is measured over
   the whole certificate, where about 80% of the ink is guilloche, QR code and seal. The same
   certificate measures 9.8% in Chromium and 21.0% in WebKit. Inside the text it measures 32.0% and
   46.8%. The faces are applied. Options: measure the text blocks only (recommended), or keep the
   wording and accept that it can fail in Chromium.
5. **The guilloche's thickness.** Its stroke is 0.45 units, finer than one pixel in the PDF at 150
   dpi, so the PDF and the PNG draw it differently. After we placed every letter from the face's own
   measurements, the PDF matches the PNG to 0.65% in Chromium and 1.00% in WebKit, against a 1% bar.
   At 0.7 units WebKit measured 0.20%. Measured again at the Phase 2 review, WebKit is 1.003%, over the bar,
   so keeping the hairline means E4 item 4 (and PRD R15) fails in WebKit as written. Options: thicken
   it to 0.7 units (recommended), or keep the hairline and change the bar.
6. **Four-line names on the certificate.** In the current layout a name set on four lines prints over
   "This certifies that" until it cannot be read, and its fourth line drops below the name rule onto
   "was, at the moment recorded below" (80 × 椅 and 80 × 🪑, both named in E3 item 4). E3 item 4 is
   held open on this decision. Moving the fixed lines for every name
   is a design call for the certificate golden.

7. **Three failure sentences we do not have yet.** Found at the review; each needs words from you.
   (a) If the certificate drawing cannot load mid-ritual, the page stays in its running state with
   no message (it should say something and give the box back). (b) If a valid certificate link
   cannot be drawn, `/c/` says "We could not locate this certificate", which is untrue. (c) If the
   browser refuses storage, the result still says "Kept in Your Presence Portfolio on this device."
   Our drafts, for your red-pen:
   - (a) "This check could not be completed. Nothing was issued and nothing was kept. Please try
     again." The box comes back, empty and focused.
   - (b) "This certificate could not be drawn on this device. Its link is still valid."
   - (c) "This device did not let us keep a copy. The certificate is still yours: download it or
     copy its link." (shown in place of the "Kept in Your Presence Portfolio" line)

**For your sight**

- The certificate candidate above was rendered again on 2026-10-04 after the per-letter placement;
  the drawing is otherwise unchanged.
- Names with characters the certificate face does not have (emoji, Chinese, and so on) are drawn by
  the browser as one image per line, about 600 dpi, as the PRD allows.
- With the box empty, **Check presence** shows the disabled state from `DESIGN.md` (40% strength).
  That changes the look of the home candidate at rest.
- The ritual's timing is fixed from the press: lines at 1.2 s and 3.2 s, the result at 4.6 s, each
  line held at least a second, the same with or without motion.

## Turns used

These are counted from the build run's log:

- Phase 0: 61 orchestrator turns, including the day's pre-flight and the planning of the run.
- Phase 1: 22 orchestrator turns, up to and including this packet.

Phase 1's plan expected about 120 turns. The run's ceiling, set at C1, is 1,400 orchestrator turns.

## How to answer

Answer however suits you: approve, red-pen, or a mix, one candidate at a time. Each approval and
red-pen is recorded in `garage/pack/CHECKPOINTS.md` § Record the same day, with the date and your
words.

- An approved candidate is copied from `exemplars/candidates/` to `exemplars/` under its golden
  name: `certificate-golden.png`, `home-390-golden.png`, `home-1440-golden.png`,
  `leadership-1440-golden.png` or `vandalway-1997-golden.png`. A golden is replaced only on your
  word.
- A red-pen on a candidate becomes a bead, and the candidate is redrawn for your next look.
- A red-pen on a string that a locked test holds is your approval of that test change, as above.
- When your answer is recorded, the critic runs the blind picks that were waiting on it, in the
  same session.

## Changelog

- 2026-10-04: Written at the end of Phase 1 (DS7). (Jules, 2026-10-04)
- 2026-10-04 — Addendum: what building the ritual and the certificate raised; the certificate candidate rendered again. (Jules, 2026-10-04)
