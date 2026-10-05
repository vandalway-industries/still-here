---
updated: 2026-10-05
read_by: Phase 0's G0 (files each section as one bead with `bd create --acceptance` verbatim); T0, the test-author session (one test file per name below, named with the real bead id); every Worker before it starts a bead; the critic (rule 1 and rule 8: the original text); `/goal`'s final audit
relations:
  derived_from: ../../PRD.md
---

# Acceptance — per bead, machine-checkable

One section per bead, grouped by phase. Each section is the bead's acceptance field, verbatim.
(Diane, 2026-10-03)

**Conventions.**
- **Labels.** Beads carry a letter prefix that nothing else in the pack uses: G and T (Phase 0),
  DS (Phase 1), E (Phase 2), S (Phase 3), X (Phase 4), RC (Phase 5), V (Phase 6), L (Phase 7),
  N (Phase 8). "PRD R12" is a requirement; "D4" is a stage-10 decision; "I-11" is an interview
  answer; "research 4" is a file in `garage/research/`.
- `<id>` in a file name is the bead id `bd create` returns. G0 records every id in
  `docs/bead-map.md`; T0 names every file with it. That is how the STRICT gate finds a bead's tests
  (`tests/unit/*<id>*.test.ts`, `e2e/specs/*<id>*.spec.ts`).
- Unit tests run with `node --test` (Node 24 strips the types). Browser specs run from `e2e/` with
  `npx playwright test`, in Chromium, WebKit and Firefox unless a line names an engine, at 390×844
  and 1440×900 unless a line names a size, against `scripts/serve-pages.mjs` on port 5320 unless a
  line says staging (`STAGING_URL`, read from the uncommitted `.env.staging`) or production
  (`https://isitstillhere.com`, `https://vandalwayind.com`).
- A bead with a screen carries both lines, and its specs include its walk from `WALKS.md`
  (`e2e/specs/<id>-walk.spec.ts`), written with role and visible-text locators only. A walk step
  that a browser cannot perform is played by the substitute `WALKS.md` § Substitute evidence names,
  and is reported as "played (substitute)"; there is no third way to pass a step.
- Every numbered item is its own box when the bead is closed. "Verbatim" means byte for byte,
  punctuation and capitals included. Fixed strings are in `CONTENT_SEEDS.md` § Fixed strings.
- "(after C2)" marks an item checked only once C2's approval is recorded in `CHECKPOINTS.md`.
  Until then the bead stays open with every other box flipped, and its phase may be set `held`
  (`PLAN.md` § Build method); when C2 lands, the critic runs the blind pick and the bead closes.

## Phase 0 — Promote, gates, records filed

### G0 — promote, gates, beads filed (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-promote.test.ts` passes
1. The repository root holds README.md, AGENTS.md and the agent-file symlink to it that factory §2 requires, PROJECT.md, PRD.md, PLAN.md, SESSION_STATUS.md, DESIGN.md, `garage/`, `docs/archive/`, `assets/`, `e2e/specs/`, `tests/unit/`, `.beads/`, `.bd-gate`, and the landing-gate hook installed as factory §6 describes.
2. AGENTS.md carries the in-universe working rules itself, as `CONTENT_SEEDS.md` § AGENTS.md rules gives them (written from inside the company; nothing about how the company's story is produced, and no pointer to any file outside the repository); the push block `bd init` appends is absent.
3. `.git/hooks/pre-commit` exports `PII_PUBLIC=1` and runs the factory PII gate on staged files (the refusal itself was proved in a scratch clone and is quoted in the close notes).
4. `git config user.email` (repository-local) ends in `@users.noreply.github.com`; `git log --format=%ae` shows only that address.
5. The default branch is `main`; the remote is `vandalway-industries/still-here`, private, reached over SSH.
6. `assets/` equals `garage/assets/` file for file (same hashes), plus `assets/brand/vandalway-industries-logo.png`.
7. Every section of `garage/pack/ACCEPTANCE.md` is a bead whose acceptance field equals that section byte for byte (the equality test runs in this file); every bead's owner address is `<character>@vandalway.example`.
8. `.beads/` contains no issue labelled `record`.
9. `~/projects/factory/scripts/docs-sync-check.sh .` reports clean.

### G1 — scaffold and the local Pages server (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-serve-pages.test.ts` passes
1. `package.json` pins every dependency exactly; `npm ci` succeeds from the lockfile; `docs/licences.md` lists each dependency with its licence.
2. `npm run build` writes `site/` and nothing outside it; `site/` is in `.gitignore`.
3. `scripts/serve-pages.mjs site 5320` answers research 3's table: `/index` 200 (index.html), `/index.html` 200, `/index/` 404, a folder without its slash 301 to the slash, a missing path 404 with `site/404.html` as the body (a stub until E0).
4. `e2e/playwright.config.ts` defines Chromium, WebKit and Firefox projects and starts the server above as its `webServer`; `npx playwright --version` reports 1.59.1; all three browsers are installed.
5. `.bd-gate` names `lock_tag = specs-v1`, `unit_test_dirs = tests/unit`, `unit_test_cmd = node --test`, `pw_cmd = npx playwright test`; `~/bin/bd-gate-selftest.sh` passes.
6. `tools/okf/okf_validate.py` is vendored from the OKF toolkit 0.3.3 with its MIT `LICENSE` beside it, and `python3 tools/okf/okf_validate.py --help` runs.

### G2 — record seeds filed (owner: diane)
- [ ] CODE PASS — `tests/unit/<id>-seeds.test.ts` passes
1. Every seed listed in `CONTENT_SEEDS.md` § Records with "P0" exists at its path with its id in the file, its text verbatim from the brand dossier, dated per D12 (Monday 2026-09-28 to Friday 2026-10-02).
2. `company/staff/staff.yaml` lists exactly the twelve staff ids (clive, diane, martin, jules, petra, susan, lucas, graham, len, adrian, bev, malcolm) with names and roles matching `company/tracker/TRACKER.md` § People; `company/staff/customers.yaml` lists eileen (Eileen Webb, municipal archivist).
3. `company/inventory/inventory.yaml` holds exactly stapler-01 present, chair-01 present, lucas unknown, adrian unknown, bench-01 absent.
4. `bd import` of `company/tracker/tracker.jsonl` into a throwaway database (`--db` in a temporary directory) creates 55 issues with their statuses, labels and external refs sh-001…sh-055; the repository's `.beads/` is unchanged by the test.
5. `company/tracker/tracker.jsonl` validates against `company/tracker/schema.json` (stable `external_ref`, opener by character id, absolute ISO dates, the `record` label on every issue); sh-051 and sh-054 carry ISSUE-001 and ISSUE-002 verbatim, and sh-051's comments keep the `bug` → `market-education` → `bug` label history.
6. `tests/fixtures/continuity-hashes.json` is the file Clive handed over at C1 (`CONTENT_SEEDS.md` § Continuity fixture), copied unchanged; it parses, has a `salt` and the lists `confidential` and `unknown-to-staff`. No two- or three-word phrase of any file under `company/`, hashed by that section's rule, matches the `confidential` list. The phrases themselves are never in the repository and the run never sees them.

### T0 — tests written first and locked (owner: diane)
- [ ] CODE PASS — `tests/unit/<id>-specs.test.ts` passes
1. Every test file named in this document exists, named with its real bead id.
2. Every walk spec in `WALKS.md` exists as `e2e/specs/<id>-walk.spec.ts` for its bead and uses no `getByTestId`, no `focus()` call and no `page.evaluate` that clicks; each substitute step calls the helper named for it in `WALKS.md` § Substitute evidence.
3. The full run is red for every bead after Phase 0, and green for G0, G1, G2 and this bead.
4. The commit is tagged `specs-v1`.

## Phase 1 — Design system and golden candidates

### DS1 — tokens and fonts (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-tokens.test.ts` passes
1. `src/css/tokens.css` and `src/js/tokens.js` are generated from `DESIGN.md`'s front matter; every colour, type, spacing and radius token appears once as `--sh-*` (CSS) and once as a named export (JS); no hex literal appears anywhere in `src/` outside those two files (`vandalwayind/` is exempt; the manifest's colours are written by the build from `src/js/tokens.js`).
2. `src/fonts/` holds static instances of Inter, Inter Tight, JetBrains Mono and Cormorant Garamond as WOFF2 and as TTF (the TTFs for the certificate faces), each with its OFL licence; `npx -y @google/design.md@0.3.0 lint DESIGN.md` reports 0 errors.
3. Contrast, computed: graphite on canvas ≥ 16.8:1; graphite-muted on canvas ≥ 7:1 and on surface ≥ 7:1; verification green on canvas between 3.0:1 and 4.49:1 and therefore used only for large text and marks (sh-047); graphite on verification green ≥ 4.5:1; on-primary on graphite ≥ 16.8:1.
4. Cormorant Garamond's TTF covers Latin, Latin Extended and Cyrillic; its cmap is recorded in `src/fonts/coverage.json` for PRD R11's check. A name in a script the certificate face lacks (Greek included) is drawn as an image, as emoji and CJK names are; no second face ships (C2, Decision 1).

### DS2 — the mark and icons (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-icons.test.ts` passes
1. `src/brand/mark.svg` draws the green brackets and dot as paths and circles only, in the verification-green token; rendered at 512 px it differs from the same region of `assets/still-here-logo-horizontal.png`, scaled, in fewer than 3% of pixels.
2. `site/favicon.svg`, `site/favicon.ico` (16, 32), `site/apple-touch-icon.png` (180), `site/icons/icon-192.png`, `site/icons/icon-512.png` and `site/icons/maskable-512.png` exist at those sizes; the maskable icon keeps the mark inside the central 80% safe zone.

### DS3 — image derivatives (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-derivatives.test.ts` passes
1. Every placement row in `ASSET_MANIFEST.md` has its derivatives under `src/images/` at 1x and 2x widths as listed, each ≤ 250 KB.
2. No derivative carries a `caBX`, `iTXt`, `tEXt`, `zTXt` or `eXIf` chunk (PNG) or APP1/APP13 segment (JPEG): web copies carry no metadata (D21).
3. `assets/` originals are byte-identical to `garage/assets/` (their credentials kept, D21).

### DS4 — the certificate drawing and its candidate (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-certificate-svg.test.ts` passes
- [ ] BROWSER PASS — `e2e/specs/<id>-certificate-candidate.spec.ts` green in Chromium and WebKit
1. `src/js/certificate/draw.js` returns an SVG of viewBox `0 0 1100 850` built only from the elements in PRD R9; a walk of the tree finds no other element and no `style` attribute or element. (The PNG exporter adds a `<style>` with the inlined faces to a serialized copy only, PRD R14; the drawn SVG never carries one.)
2. The SVG contains the footer text node verbatim: "Confirms successful completion of this form. No physical inspection occurred."
3. The "STILL HERE." heading is drawn with explicit per-glyph x positions; the period's left edge clears the E's right edge by at least 0.12 em.
4. The QR code is drawn as `rect` or `path` elements in graphite and decodes (jsQR) from a 300-dpi render to the link passed in.
5. The seal, guilloche border and both signatures are paths; the signatures were converted from an OFL script face at build time and no script font is loaded at runtime. The seal is a green rosette with its ring text in graphite on paper; no text in the SVG smaller than 24 units is drawn in green.
6. `garage/pack/exemplars/candidates/certificate.png` (3,300 × 2,550) and `certificate.pdf` exist for "Folding chair" at 2026-10-03T10:52:00Z in America/Chicago, identifier `SH-00PP-9AGR-1GTB`, printing local 05:52:00 and "Recorded 2026-10-03 10:52:00 UTC".

### DS5 — home and leadership candidates (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-candidates.test.ts` passes
- [ ] BROWSER PASS — `e2e/specs/<id>-home-leadership-candidate.spec.ts` green in Chromium and WebKit
1. `/` renders "Is it still here?", the input, **Check presence** and the ten examples, with the chair from the hero on the right at 1440 and above at 390; zero console errors.
2. `/leadership` renders twelve cards in PRD R26's order with the names, titles and bios from `CONTENT_SEEDS.md` § Leadership.
3. Every computed colour on both pages is one of `DESIGN.md`'s colours; every font family is one of its four.
4. `candidates/home-390.png`, `candidates/home-1440.png` and `candidates/leadership-1440.png` exist, full page.

### DS6 — the 1997 page candidate (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-vandalway-markup.test.ts` passes
- [ ] BROWSER PASS — `e2e/specs/<id>-vandalway-candidate.spec.ts` green in Chromium and WebKit
1. `vandalwayind/index.html`'s first line is `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">`; `document.compatMode === "BackCompat"`.
2. Every element of PRD R42 is present, checked one by one by the test; zero `SCRIPT`, `BLINK`, `MARQUEE`, `FRAME`, `IFRAME`, `EMBED`, `BGSOUND` elements; "MONOvision" absent (case-insensitive).
3. Every image is a GIF except `s09`, which is a JPEG 200–410 px wide with no caption element or text beside it; the email icon GIF is animated (more than one frame); the Netscape badge is a GIF drawn by `scripts/gifs/`.
4. The telephone number matches `555-01\d\d`; the hours name a time zone.
5. The guestbook link's target is `/cgi-bin/guestbook.html` and that file exists in `vandalwayind/`.
6. `garage/pack/exemplars/1997/` holds research 6's archived pages as raw HTML with `SOURCES.md` (URL, capture date, fetch date), or `SOURCES.md` records which fetches the archive refused.
7. `candidates/vandalway-1997.png` exists at 1024 wide, full page, from Chromium.

### DS7 — the C2 packet (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-c2-packet.test.ts` passes
1. `docs/checkpoints/c2-packet.md` links every candidate file and lists, for each, the questions in `CHECKPOINTS.md` § C2.
2. It reports turns used in Phases 0 and 1.

## Phase 2 — The shell, the ritual and the certificate

### E0 — the site shell and placeholder pages (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-links.test.ts` passes
- [ ] BROWSER PASS — `e2e/specs/<id>-shell.spec.ts` and `e2e/specs/<id>-walk.spec.ts` (W4 steps 1–2) green
1. Every page in PRD R24 exists in `site/`, either built or as a placeholder carrying `<meta name="sh-placeholder" content="true">`, its page heading and the shell; every one has the header (mark and wordmark linking to `/`) and the footer.
2. The menu holds exactly these eight, in order: Verify, Portfolio, Leadership, Research, Case studies, Status, Careers, Enterprise. The footer holds exactly Terms of Presence, Privacy and "A Vandalway Industries company" (linking to `https://vandalwayind.com/`). Sub-pages are reached from `/research/` and `/case-studies/`; `/c/` and the 404 are reached by link only. At 390 the menu opens and closes by its button and by Escape, and focus returns to the button.
3. The link checker over `site/` finds zero broken internal links; our links use `/research/` and `/case-studies/`.
4. Every page has the same Content-Security-Policy meta tag (`default-src 'self'`; images also `data:` and `blob:`), and the same Open Graph tags, whose image is the hero derivative.
5. No URL anywhere in `site/`, `vandalwayind/` or `company/` has the host `vandalway.com` or `www.vandalway.com` (a mention of the name as someone else's, as in sh-045, is not a link); zero "MONOvision" in `site/` and `vandalwayind/`.
6. `site/404.html` carries the fixed 404 sentence and a "Return home" link (X3 proves the status on each server).

### E1 — the identifier (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-identifier.test.ts` passes
1. `src/js/identifier.js` reproduces the four vectors of PRD R18 and the derived vectors of `CONTENT_SEEDS.md` § Identifier vectors exactly.
2. Canonicalization: NFC, trim, collapse internal whitespace, lower-case; "Café" composed and decomposed give one identifier.
3. Over 3,000 random identifiers: 0 single substitutions and 0 adjacent swaps pass the check.
4. The decoder accepts lower case, reads `i`/`l` as 1 and `o` as 0, ignores hyphens, accepts the identifier with or without its `SH-` prefix; it returns the issue time from the first seven symbols.
5. The same module file is imported by the site and by the records check (RC6); the alphabet string `0123456789ABCDEFGHJKMNPQRSTVWXYZ` occurs in exactly one file under `src/`, `scripts/` and `deploy/` (`src/js/identifier.js`).

### E2 — the ritual (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-input-rules.test.ts` passes
- [ ] BROWSER PASS — `e2e/specs/<id>-ritual.spec.ts`, `e2e/specs/<id>-timing.spec.ts` and `e2e/specs/<id>-walk.spec.ts` (W1 steps 1–5 and 8–10, W8) green
1. Ten example chips, in Q10's order, text equal (case-insensitive) to PRD R2; tapping one fills the input and the input stays editable.
2. Empty or whitespace-only: the button reports `aria-disabled="true"`; pressing it or Enter shows the empty-input sentence verbatim and issues nothing. Enter in a filled input starts the check exactly as the button does.
3. An 81st code point is not accepted; pasting 100 code points keeps the first 80.
4. `<script>alert(1)</script> & "x"` appears as literal text in the result and the certificate, and no dialog opens.
5. After a press, a second press does nothing; the three lines appear verbatim in order; each is visible ≥ 1,000 ms before the next; the certificate is visible 4,000–5,000 ms after the press; across ten names the spread is ≤ 200 ms.
6. The indicator's bounding box and computed `transform` are identical in samples every 250 ms from press to result.
7. Reduced motion (`emulateMedia({ reducedMotion: 'reduce' })`): `document.getAnimations().length === 0` throughout; the lines appear in order; the timing in item 5 holds.
8. The lines are inside an `aria-live="polite"` region; focus moves to the result heading when it appears.
9. No tells: for the fourteen names of PRD R7, the sequence DOM is identical.
10. During the sequence the input and the example chips are inert (`aria-disabled`, not editable). The identifier encodes the second of the press. Leaving mid-sequence (reload, Back, the mark, a menu link) issues nothing and saves nothing to the portfolio; the certificate is saved only when the result appears.
11. After the result the address stays `/` and no history entry is added; a reload shows an empty home page; the result replaces the form, and the result carries the sentence "Kept in Your Presence Portfolio on this device." with a link to `/portfolio`.
12. Check another empties the input, restores the form and puts focus in the input.
13. With the clock set to 2025-12-31T23:00:00Z (`page.clock`), the sequence runs identically and then shows the pre-2026 sentence verbatim; no certificate is drawn or saved.
14. (after C2) Critic blind pick of the result screen against `exemplars/home-390-golden.png` and `home-1440-golden.png`: PASS.

### E3 — the certificate for each issue (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-certificate-data.test.ts` passes
- [ ] BROWSER PASS — `e2e/specs/<id>-certificate.spec.ts` green
1. No tells: for the fourteen names of PRD R7, the SVG with the name, date, zone, UTC line, identifier and QR groups removed is byte-identical to Folding chair's.
2. Time zones: contexts with `timezoneId` `Europe/Brussels`, `America/Chicago` and `Pacific/Chatham` each print "Jurisdiction of here: <that zone>" and a local time that agrees with it.
3. The UTC line equals the time decoded from the identifier, which is what `/verify` states (E6 item 2); a certificate issued at 23:30 in America/Chicago shows the local date in its date line and the next day's UTC date in its UTC line, and both are true (sh-009).
4. Name layout: an 80-code-point name, a single 60-character word (broken at grapheme boundaries, no hyphen added), 80 × "椅" and 80 × "🪑" each print in full within the name box on at most four lines, size ≥ 30 user units, no glyph under the seal (sh-032).
5. The QR code decodes to `<origin>/c/#<fragment>` exactly, for "Folding chair" and for an 80-code-point name of four-byte characters.
6. The result screen shows the date and time as "3 October 2026, 05:52:00" (day, month name, year; 24-hour, zero-padded; English whatever the browser's locale) beside "Jurisdiction of here: <zone>".
7. (after C2) Critic blind pick of the exported PNG against `exemplars/certificate-golden.png`: PASS.

### E4 — PDF and PNG (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-export.test.ts` passes
- [ ] BROWSER PASS — `e2e/specs/<id>-export.spec.ts` and `e2e/specs/<id>-walk.spec.ts` (W1 steps 6–7) green in Chromium and WebKit; Firefox for the download events
1. Download PDF fires a download named `STILL-HERE-<slug>-<11 symbols>.pdf`; Download PNG the same with `.png`. The slug follows PRD R16's rule: "Folding chair" → `folding-chair`; "Café au lait!" → `cafe-au-lait`; "שולחן", "椅子" and "🪑" → `object`; a 100-letter name → 40 characters at most. Two different objects never share a name.
2. The PDF is US Letter landscape (792 × 612 pt); it contains `/FontFile2` for Cormorant Garamond, Inter Tight and JetBrains Mono under their registered names; its extracted text contains the footer string verbatim.
3. The PNG is 3,300 × 2,550; measured on the text blocks only (each `<text>` element's bounding box), its ink-pixel count differs from a render with the faces withheld (fallback) by more than 20% (C2, Decision 4).
4. The PDF rendered by pdf.js at 150 dpi and the PNG scaled to 150 dpi differ in at most 1% of pixels.
5. After export the canvas is 0 × 0; no canvas ever exceeds 16,777,216 pixels.
6. "שולחן", "كرسي", "椅子" and "🪑 chair" export without missing glyphs (pixel check against the on-screen render of the same block); "Café" stays vector text.
7. While a file is prepared its button reads "Preparing PDF…" or "Preparing PNG…" and is `aria-disabled`; a second tap does nothing. With the font request blocked (uncached), the button returns and the export-failure sentence appears verbatim in graphite; nothing else on the page changes.

### E5 — the certificate link (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-link.test.ts` passes
- [ ] BROWSER PASS — `e2e/specs/<id>-link.spec.ts` green
1. The link is `/c/#<identifier>.<base64url of the name as typed>.<IANA zone>` (D2); three vectors round-trip exactly: "Folding  chair " (spaces kept as typed), "🪑 chair", and `A & B #1`.
2. Redrawing from the link yields an SVG byte-identical to the one issued.
3. Copy certificate link (Chromium, clipboard permission granted) writes exactly the link and shows the confirmation sentence; with the permission denied, the link appears selected in a read-only field under the clipboard-refused sentence.
4. During W1 and W2 no request URL in the network log contains the name, its base64url form, or the identifier (fragment never sent).

### E6 — reopen and verify (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-verify.test.ts` passes
- [ ] BROWSER PASS — `e2e/specs/<id>-verify.spec.ts` and `e2e/specs/<id>-walk.spec.ts` (W2 steps 1–6) green
1. `/c/#<valid link>` redraws the certificate and states "Issued by STILL HERE for '<name>' on 3 October 2026 at 05:52:00 (America/Chicago)." (the link's own zone, in E3 item 6's format) from a context in any other zone; beneath it: Download PDF, Download PNG, Copy certificate link, Check another (to `/`). Opening a link does not add it to that device's portfolio.
2. `/verify` with each published vector and its name states "Issued by STILL HERE for '<name>' on <date> at <time> (UTC)."; Enter in either field submits.
3. Order of judgment: a malformed identifier or link, then a wrong name or typo, each give the mismatch sentence verbatim; only an identifier whose hash matches the name is then judged for the future. A future identifier with a wrong name gets the mismatch sentence. A name over 80 code points gets the mismatch sentence.
4. An identifier dated more than five minutes after the viewer's clock (with the right name) gives the future sentence verbatim; one dated four minutes after verifies.
5. Every single substitution and adjacent swap of each published vector gives the mismatch sentence.
6. `/verify` accepts lower case, `o` for zero, and the identifier with or without `SH-`; with either field empty, Verify is `aria-disabled` and pressing it shows the empty-verify sentence verbatim.
7. A mismatch or future result draws no certificate; it shows the sentence and two links, "Verify a certificate" (`/verify`) and "Check an object" (`/`). `/c/` with no fragment shows the Verify form exactly as `/verify` does.

### E7 — Your Presence Portfolio (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-portfolio.test.ts` passes
- [ ] BROWSER PASS — `e2e/specs/<id>-portfolio.spec.ts` and `e2e/specs/<id>-walk.spec.ts` (W3) green
1. Three checks, close the page, reopen `/portfolio`: three entries, newest first, each with name, date as "3 October 2026, 05:52 · America/Chicago", and identifier.
2. Each entry has Open (to its `/c/` link), Download PDF and Download PNG; the re-downloaded identifier matches.
3. Storage holds name, time, zone and identifier only (no file data); the key is `stillhere.portfolio.v1`.
4. After clearing site data (W3 step 4's substitute) the page shows the empty-portfolio sentence verbatim.
5. With the stored value set to `{not json`, `/`, `/portfolio` and `/verify` load with zero console errors and the portfolio shows the empty sentence; the next issue replaces the value.
6. No call to `navigator.storage.persist` anywhere in `site/`.

## Phase 3 — The company website

### S2 — leadership (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-leadership.test.ts` passes
- [ ] BROWSER PASS — `e2e/specs/<id>-leadership.spec.ts` and `e2e/specs/<id>-walk.spec.ts` (W4.leadership) green
1. Exactly twelve cards, by id and portrait: clive p01, diane p02, martin p03, jules p04, petra p05, susan p06, lucas p07, graham p08, len p09, adrian p10, bev p11, malcolm p13; `p12` absent; the placeholder meta is gone.
2. Each card has a name, a title, alt text describing the photograph, and a bio of two or three sentences and 20–60 words.
3. Jules's bio contains "Previously created WHERE-r-YOU" and no word from {owns, owner, founded, founder, acquired} in the same sentence.
4. (after C2) Critic blind pick at 1440 against `exemplars/leadership-1440-golden.png`: PASS.

### S3 — research, with the papers written (owner: petra)
- [ ] CODE PASS — `tests/unit/<id>-research.test.ts` passes
- [ ] BROWSER PASS — `e2e/specs/<id>-research.spec.ts` and `e2e/specs/<id>-walk.spec.ts` (W4.research) green
1. `company/research/` holds the three papers of PRD R27 as Markdown with front matter (title, author, date, pages, abstract), written in this bead: RESEARCH-001's abstract verbatim from the brand dossier and its contents list summing to 86 pages; each short paper 900–2,000 words with numbered sections and footnotes.
2. `/research/` lists exactly three papers by Dr. Petra Voss, each with title, author, date, abstract and a cover drawn in code (SVG, no photograph); "Full text available to Enterprise clients." verbatim on the long paper's page.
3. Each paper's page renders every section of its source file.
4. The build reads `company/research/` and `company/status/status-updates.xml` and no other path under `company/` (checked by the build's own read log).

### S4 — case studies (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-case-studies.test.ts` passes
- [ ] BROWSER PASS — `e2e/specs/<id>-case-studies.spec.ts` and `e2e/specs/<id>-walk.spec.ts` (W4.case-studies) green
1. `/case-studies/` lists exactly three, one per sh-026 vertical, each with its own page.
2. All three concern Eileen Webb, municipal archivist, her register and `bench-01`, and name her (I-09); none contradicts SUPPORT-001/002 or sh-025 (bench removed in April; certified from the office makes no difference).
3. Photographs: `b1`, `b2`, `b3-wide` and `p12-eileen` each appear at least once, with alt text.
4. No case study claims her permission or a quotation from her beyond the records (I-09: nobody asked).

### S5 — status, with its updates written (owner: martin)
- [ ] CODE PASS — `tests/unit/<id>-status.test.ts` passes
- [ ] BROWSER PASS — `e2e/specs/<id>-status.spec.ts` and `e2e/specs/<id>-walk.spec.ts` (W4.status) green
1. `company/status/status-updates.xml` holds STATUS-001 (verbatim from the dossier), STATUS-002 and STATUS-003 (written in this bead from QA-001 and SUPPORT-001/002), and validates against `company/status/status-updates.xsd`.
2. "All systems operational" is present at the top.
3. The three Q11 titles are present verbatim, each with its date and its record id, in the XML's order.
4. The page makes zero requests except same-origin static files; it is generated from the XML at build (changing a title in the XML and rebuilding changes the page).

### S6 — careers (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-careers.test.ts` passes
- [ ] BROWSER PASS — `e2e/specs/<id>-careers.spec.ts` and `e2e/specs/<id>-walk.spec.ts` (W4.careers) green
1. Exactly three postings with these titles: Senior Presence Engineer; Customer Support Contractor (six weeks); Director of Elsewhere (on hold).
2. Zero `form`, `input`, `textarea` and `select` elements; no `mailto:` link.
3. The photographs listed for careers in `ASSET_MANIFEST.md` appear with alt text.

### S7 — enterprise (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-enterprise.test.ts` passes
- [ ] BROWSER PASS — `e2e/specs/<id>-enterprise.spec.ts` and `e2e/specs/<id>-walk.spec.ts` (W5) green
1. The call to action verbatim: "Enterprise clients: please remain where you are. A representative will be in touch."
2. Zero `form`, `input`, `textarea` and `select` elements.
3. Each testimonial's text occurs verbatim in a record under `company/` (SUPPORT-001, sh-025) and is attributed "Eileen Webb, Municipal Archivist".
4. Photographs `s08`, `b3-wide-courthouse`, `p12-eileen-courthouse` appear with alt text.

### S8 — Terms of Presence (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-terms.test.ts` passes
- [ ] BROWSER PASS — `e2e/specs/<id>-terms.spec.ts` green
1. Each required sentence in `CONTENT_SEEDS.md` § Terms is present verbatim.
2. The page title is "Terms of Presence".

### S9 — Privacy (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-privacy.test.ts` passes
- [ ] BROWSER PASS — `e2e/specs/<id>-privacy.spec.ts` green
1. Each of the eight required sentences in `CONTENT_SEEDS.md` § Privacy is present verbatim, and the test lists, beside each, the test that proves it: 1 → X6 network log; 2 → the page links GitHub's documentation that states the logging (Exploration 8's URL) and X6 shows no request to any origin of ours but the site itself; 3 → E7 storage key and X6; 4 → the page links WebKit's tracking-prevention page (research 5, source 2) and E7 item 4; 5 → E5 item 4 and L1 item 5; 6 → X6 and E5 item 4 (no zone in any request); 7 → V3 items 1 and 5; 8 → L3 item 3.
2. A sentence about another company's behaviour (2, 4) is proved by citing that company's own documentation, linked on the page; the critic checks the link opens that page and that it says what the sentence says.

## Phase 4 — Extras

### X1 — presence.json (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-presence.test.ts` passes
- [ ] BROWSER PASS — `e2e/specs/<id>-presence.spec.ts` green
1. GET `/api/v1/presence.json`, and the same with `?object=Lucas` and `?object=Adrian%20Vale`, return 200, `application/json`, byte-identical bodies that parse to `{"status":"STILL HERE"}`.
2. The local server and staging send `access-control-allow-origin: *` (production in N3).

### X2 — security.txt (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-security-txt.test.ts` passes
1. `site/.well-known/security.txt` has `Contact: https://github.com/vandalway-industries/still-here/security/advisories/new` and `Expires:` set by the build to no more than 365 days after the build date, in RFC 3339.
2. Served as `text/plain` by the local server.
3. `npm run check:security-txt` fails when `Expires` is fewer than 30 days away; the Pages workflow runs it before upload.

### X3 — the 404 on every server (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-not-found.test.ts` passes
- [ ] BROWSER PASS — `e2e/specs/<id>-not-found.spec.ts` and `e2e/specs/<id>-walk.spec.ts` (W4.404) green
1. GET `/no-such-page` returns status 404 with "We could not locate this page. The page, however, is still here." and a working "Return home" link.
2. GET `/company/tracker/TRACKER.md` and `/README.md` return 404.

### X4 — installable and offline (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-offline.test.ts` passes
- [ ] BROWSER PASS — `e2e/specs/<id>-offline.spec.ts` and `e2e/specs/<id>-walk.spec.ts` (W6) green; installability in Chromium only
1. `site/manifest.webmanifest` names the icons of DS2, `display: standalone`, colours from the tokens; Chromium's `Page.getInstallabilityErrors` returns none.
2. The service worker precaches every HTML page of PRD R24, the 404, all CSS, JS and fonts, the export libraries, the icons and the home chair image; other images are cached when first shown.
3. After one visit, `context.setOffline(true)`: the ritual, Download PDF, Download PNG, Copy certificate link, reopening a `/c/` link, Verify by hand, and the portfolio's list, Open and re-download each work.
4. Offline, a page never visited still opens (precached); an image never shown displays its alt text; an unknown path shows the cached 404 page.
5. Deploy build N, load, deploy build N+1: the page reports N+1's build id (`/build.txt` and a `data-build` attribute) by its second navigation.
6. The service worker's caches hold only same-origin URLs; the cache name carries the build id.

### X5 — accessibility (owner: diane)
- [ ] CODE PASS — `tests/unit/<id>-a11y-static.test.ts` passes
- [ ] BROWSER PASS — `e2e/specs/<id>-a11y.spec.ts` green
1. axe-core reports 0 serious and 0 critical findings on every page of PRD R24, at 390 and 1440.
2. Tab order reaches every control on every page; each shows a visible focus indicator with ≥ 3:1 contrast against its surroundings (sh-028).
3. No text smaller than 24px (18.66px bold) is set in verification green, on any page or in the certificate SVG (sh-047).
4. The verification lines and the result are announced (live region present; result heading focused after issue).

### X6 — network, privacy and weight guards (owner: diane)
- [ ] CODE PASS — `tests/unit/<id>-guards.test.ts` passes
- [ ] BROWSER PASS — `e2e/specs/<id>-guards.spec.ts` green
1. Over walks W1–W6, every request is same-origin.
2. `site/` contains no `<script src>`, `<link href>` or `url(` pointing at another host, no `form` with an `action`, no private key and no signing code; the only workflow with a `schedule:` trigger is `.github/workflows/security-txt-reminder.yml` (L2 item 4).
3. First load of each page of PRD R24 transfers ≤ 1.5 MB to the `load` event, service-worker precache excluded.
4. Grep of the repository (excluding `garage/` and `assets/`): no IPv4 address other than 127.0.0.1 and GitHub Pages' four, no hostname other than isitstillhere.com, vandalwayind.com, github.com and its subdomains, the RFC 2606 `.example` names, and the hosts of cited documentation; no staging hostname; no internal-network domain.
5. No page in `site/` carries the `sh-placeholder` meta.

## Phase 5 — The records in full

### RC1 — correspondence, chat, notes, calendar (owner: martin)
- [ ] CODE PASS — `tests/unit/<id>-correspondence.test.ts` passes
1. Every id in `CONTENT_SEEDS.md` § Records with format "Markdown" exists in full at its path, with `From`, `To`, `Date` (ISO 8601 with offset), `Subject` and `Message-ID` headers for mail, addresses `<id>@vandalway.example` for staff and Vandalway and `eileen.webb@municipal.example` for the customer.
2. CHAT-001 holds Len's fifteen messages, in order, verbatim, timestamped 2026-09-29 from 11:42.
3. Every `In-Reply-To` and every record id cited in any record resolves to a file.
4. Every record's date falls within 2026-09-28 – 2026-10-02 unless the list gives another date.
5. SUPPORT-001 carries the header `X-Attachment: STILL-HERE-memorial-bench-00PHHEGCM3Y.pdf (certificate SH-00PH-HEGC-M3YK)`.

### RC2 — the inventory (owner: bev)
- [ ] CODE PASS — `tests/unit/<id>-inventory.test.ts` passes
1. `company/inventory/inventory.yaml` validates against `company/inventory/schema.json`.
2. `company/inventory/HERE_FINAL_2008_USE_THIS_ONE.xml` is SpreadsheetML 2003 and parses to the same set of entities and statuses as the YAML.
3. Each entity carries its evidence as record ids that resolve; no field states anything its author does not know (no field for where anyone works).
4. Nothing under `site/` or `src/` reads either file (grep and the build's read log).

### RC3 — status records (owner: martin)
- [ ] CODE PASS — `tests/unit/<id>-status-records.test.ts` passes
1. `company/status/notes.xml` holds INC-001 and the 11:50 floor counts for 2026-09-28 – 2026-10-02 per `CONTENT_SEEDS.md`, and validates against `company/status/notes.xsd`; the status page never reads it.
2. Tuesday 2026-09-29's floor-three count is recorded as 0 at 11:50 and amended to 1 "on reflection", matching sh-014.
3. STATUS-001–003 (written in S5) agree with INC-001, QA-001 and SUPPORT-001/002 on every time and fact.

### RC4 — the gum graph (owner: susan)
- [ ] CODE PASS — `tests/unit/<id>-gum-graph.test.ts` passes
1. `company/gum-graph/` passes `tools/okf/okf_validate.py --strict` (the OKF v0.1 validator, vendored in G1).
2. One concept per person in the graph; every edge is its own concept of a stated type (`observation`, `borrowing`, `reimbursement`, `access-request`), with observer, date and evidence.
3. No concept of type `observation` states an interpretation; claims by others are concepts of type `claim` with their claimant and Susan's disposition.
4. The twelve access requests of sh-008 are present, dated, each declined.

### RC5 — the papers as records (owner: diane)
- [ ] CODE PASS — `tests/unit/<id>-papers.test.ts` passes
1. Every footnote and citation in the three papers (written in S3) resolves to a record in this repository or to one of the other two papers.
2. *On the Directionality of Here* has a §3 of that title (sh-030 cites it); *Six Feet to the Left* agrees with QA-001 and sh-051 on every time and distance.
3. After `npm run build`, each `site/research/<slug>.html` contains every section heading of its source.

### RC6 — continuity and identifiers (owner: diane)
- [ ] CODE PASS — `tests/unit/<id>-continuity.test.ts` passes
1. Every `SH-` identifier under `company/` recomputes from its record's object name and time with `src/js/identifier.js`; at least these are found: CERT-001's `SH-00PK-EEC2-0EPR` and SUPPORT-001's `SH-00PH-HEGC-M3YK`. A scan that finds fewer than two fails.
2. No record dated before 2026-01-01 matches `SH-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z*~$=]{4}`.
3. Every ownership share stated in `company/` or `site/` is the correct one: Diane's is 51%, Vandalway's is 49%; no other share appears.
4. No staff-authored record states where Lucas works now: no two- or three-word phrase in `company/` or `site/`, hashed by `CONTENT_SEEDS.md` § Continuity fixture's rule, matches the fixture's `unknown-to-staff` list.
5. Every message by `adrian` after 2022-12-16 is automated (begins "Automatic reply:" or "Calendar:").
6. `.beads/` holds no issue labelled `record`; `company/tracker/tracker.jsonl` holds only `record` issues.
7. No record shows Eileen Webb being asked for, or giving, permission for the case studies (I-09).

### RC7 — the C3 packet (owner: diane)
- [ ] CODE PASS — `tests/unit/<id>-c3-packet.test.ts` passes
1. `docs/checkpoints/c3-packet.md` lists every HUMAN-JUDGED item of PRD § Acceptance criteria assigned to C3, each with the file and line or page where it lives.
2. Every authored text file under `company/` and every page's copy source under `src/content/` is linked from it.
3. It lists the calls C3 judges (testimonials, photograph placement including `s07`) and, for each locked string a red-pen could change, the test file that holds it.

### RC8 — the repository as a reader finds it (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-readme.test.ts` passes
- [ ] BROWSER PASS — `e2e/specs/<id>-walk.spec.ts` (W9, on the local checkout's rendered Markdown) green
1. `README.md` is the company's, in the company's voice: what STILL HERE is; how to run it (`npm ci`, `npm run build`, `npm run serve`) and test it (`npm test`, `npm run e2e`); a map of the repository: `src/` and `site/` (the website), `vandalwayind/` (Vandalway's page), `company/` (the company's records), `PRD.md`, `PLAN.md`, `DESIGN.md` and `garage/` (the product team's working documents), `deploy/`, `tests/`, `e2e/`; the licence of the code and of the fonts.
2. `company/README.md` lists every record set with its folder, format and schema file (tracker, correspondence, chat, notes, calendar, certificates, status, inventory, gum graph, research, staff) and how to load the tracker with `bd import`.
3. Every relative link in both READMEs resolves.
4. Neither README explains how the company or its story was made; the names grep and the PII gate pass on both.

## Phase 6 — vandalwayind.com, built and served internally

### V1 — the page, finished (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-vandalway-final.test.ts` passes
- [ ] BROWSER PASS — `e2e/specs/<id>-vandalway.spec.ts` green in Chromium and WebKit
1. DS6's checks all pass on the finished page, with C2's red-pen applied (listed in `CHECKPOINTS.md`).
2. `vandalwayind/cgi-bin/guestbook.html` is a period page titled "Guestbook temporarily unavailable", dated March 2, 1999 on the page.
3. The relocation line is present and is the only sentence on the page that refers to the move.
4. (after C2) Critic blind pick against `exemplars/vandalway-1997-golden.png`: PASS.

### V2 — served on the production server, internally (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-caddy-config.test.ts` passes
- [ ] BROWSER PASS — `e2e/specs/<id>-vandalway-internal.spec.ts` green against `VANDALWAY_INTERNAL_URL` (uncommitted)
1. `deploy/caddy/vandalwayind.caddy` binds to localhost only and serves `/srv/vandalwayind/` with `file_server`; the internal network's HTTPS reaches it on a new port of its own; no existing route and no other site is changed (I-11).
2. Every change is made by a script in `deploy/` with a matching undo script (`deploy/vandalwayind-install.sh` / `deploy/vandalwayind-uninstall.sh`); the deploy log shows: Caddyfile backed up with a timestamp, `caddy validate` passed, reload done, every other site block byte-identical before and after; the undo script was run once on the server and the server returned to its backed-up state, then the install re-run (I-11).
3. `/cgi-bin/guestbook.html` answers 200; POST to any path answers 405.

### V3 — the counter (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-counter.test.ts` passes
- [ ] BROWSER PASS — `e2e/specs/<id>-counter.spec.ts` green against `VANDALWAY_INTERNAL_URL`
1. The site's access log is JSON, written to its own file, rolled with seven days kept (`roll_keep_for 168h`).
2. `deploy/counter/count.mjs` adds to a running-total file every GET for `/` or `/index.html` answered 200 or 304 since its last run (HEAD and the counter image excluded), and writes `counter.gif` as period odometer digits. The HTML and `counter.gif` are served with `Cache-Control: no-cache`, so every load and reload reaches the server.
3. A systemd timer runs it every ten minutes, installed and removable by the scripts of V2 item 2 (I-11); `systemctl list-timers` shows it; Node is present on the server or installed by the script.
4. Note n on a first load; load the page twice more; within eleven minutes of the third load, a reload shows at least n+3.
5. The running-total file holds a number and a timestamp and nothing else.

### V4 — HTTP-layer truth (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-vandalway-http.test.ts` passes
- [ ] BROWSER PASS — `e2e/specs/<id>-walk.spec.ts` (W7, internal copy) green
1. `index.html` and every image except `counter.gif` carry `Last-Modified` equal to the page's "Last Updated" date (1997-08-22); `cgi-bin/guestbook.html` carries its own date (1999-03-02); `counter.gif` carries the time it was last written.
2. The served page renders in quirks mode in Chromium and WebKit.
3. The `mailto:` link's address is `webmaster@vandalwayind.com`.

## Phase 7 — Staging and the launch packet

### L1 — staging (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-staging-config.test.ts` passes
- [ ] BROWSER PASS — `e2e/specs/<id>-staging.spec.ts` green against `STAGING_URL`
1. `window.isSecureContext === true` on staging.
2. Staging's `/build.txt` equals `git rev-parse HEAD` of the deploy.
3. Research 3's URL table answers on staging as G1's local server does.
4. `presence.json` carries `access-control-allow-origin: *` on staging.
5. During W2 on staging, the staging access log (kept one day) contains no object name, base64url name or identifier.
6. The staging hostname occurs in no tracked file (grep of `git ls-files`).
7. Staging is installed and removed by `deploy/staging-install.sh` and `deploy/staging-uninstall.sh` on a new internal-network port of its own (I-11); the undo ran once and the install re-ran, as in V2.

### L2 — the workflows (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-workflow.test.ts` passes
1. `.github/workflows/pages.yml` triggers on push to `main` and `workflow_dispatch`, uses exactly `actions/configure-pages@v6.0.0`, `actions/upload-pages-artifact@v5.0.0` (path `site`, `include-hidden-files: true`) and `actions/deploy-pages@v5.0.1`, deploys through the `github-pages` environment, and has no `schedule:`.
2. Its job runs `npm ci`, `npm run build` and `npm run check:security-txt`, writes `GITHUB_SHA` to `site/build.txt`, and is skipped when the repository is private.
3. Both workflow files were pushed over SSH and are present on `main`.
4. `.github/workflows/security-txt-reminder.yml` runs on a weekly `schedule:` and `workflow_dispatch`, has `permissions: { contents: read, issues: write }` and nothing else, never checks out for writing, commits nothing and deploys nothing; when the published `Expires` is 30 days away or less and no open issue titled "Renew security.txt" exists, it opens one, assigned to the account in the repository variable `RENEWAL_ASSIGNEE` (set in N1; never written in a file). A dry run with a fabricated near date opens and then closes a test issue.

### L3 — DNS, before launch (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-dns-prep.test.ts` passes
1. A zone snapshot of each domain was taken before the first write; the snapshot ids are in the deploy log.
2. A validation dry run passed before each write.
3. `dig` at a public resolver returns, for isitstillhere.com and vandalwayind.com: `MX 0 .`, TXT `v=spf1 -all`, and `_dmarc` TXT `v=DMARC1; p=reject`; and `_github-pages-challenge-vandalway-industries.isitstillhere.com` TXT equals the value Clive handed over.
4. Every other record in each zone equals the snapshot; no wildcard record exists.

### L4 — the release scan (owner: diane)
- [ ] CODE PASS — `tests/unit/<id>-release-scan.test.ts` passes
1. `PII_PUBLIC=1 ~/projects/factory/scripts/pii-gate.sh --tree .` exits 0.
2. The same strings checked over every blob in `git log --all` find nothing.
3. Every author and committer email in `git log --all --format='%ae%n%ce'` is the repository's no-reply address (or `noreply@github.com` for commits GitHub itself makes); every author and committer name is the account's own.
4. No image under `site/` or `vandalwayind/` carries metadata (DS3's chunk check).
5. Grep of the whole tree finds none of the names from outside the company listed in the public-tier denylist.

### L5 — staging walked; the C4 packet (owner: diane)
- [ ] CODE PASS — `tests/unit/<id>-c4-packet.test.ts` passes
- [ ] BROWSER PASS — `e2e/specs/<id>-walk.spec.ts` (W1–W9 on staging) green
1. W1–W9 pass on staging in Chromium and WebKit at both sizes, played by the critic, each step marked "played" or "played (substitute)".
2. Every bead filed from C3's red-pens is closed.
3. `docs/checkpoints/c4-packet.md` holds: the ordered commits; pass/fail per bead; the critic reports; screenshots of every page; the phone checklist to print (with the note that the phone must be on the internal network); turns used per phase; the queue of calls made under a rule since C3.

## Phase 8 — Launch

### N1 — isitstillhere.com live (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-pages-api.test.ts` passes
- [ ] BROWSER PASS — `e2e/specs/<id>-production.spec.ts` green against `https://isitstillhere.com`
1. Private vulnerability reporting reads enabled on the repository before the first Pages deploy; the repository variable `RENEWAL_ASSIGNEE` is set.
2. The Pages API (`GET /repos/vandalway-industries/still-here/pages`) reports `build_type: workflow`, `cname: isitstillhere.com`, `https_enforced: true` and `protected_domain_state: verified`.
3. `https://isitstillhere.com/build.txt` equals the deployed commit within 15 minutes of the deploy.
4. `http://isitstillhere.com/` answers 301 to `https://`; `www` and the apex redirect one way; the certificate covers both names.
5. Research 3's URL table answers on production as on staging; the 404 sentence; records paths 404.
6. The artifact's file list equals the `site/` tree of that commit.

### N2 — vandalwayind.com live (owner: jules)
- [ ] CODE PASS — `tests/unit/<id>-vandalway-dns.test.ts` passes
- [ ] BROWSER PASS — `e2e/specs/<id>-walk.spec.ts` (W7 on production) green against `https://vandalwayind.com`
1. A records point at the production server (its reverse record accepted as it is, I-10); `www` redirects to the apex; Caddy's public block was added by a `deploy/` script with its undo script and the same backup-validate-reload procedure as V2, and no other block changed.
2. `http://vandalwayind.com/` answers 301 to `https://`; the certificate is valid; quirks mode holds; `Last-Modified` per V4.
3. At go-live the running total is reset to 0 and the counter line's date is set to the go-live date by the deploy script; `index.html`'s file time is then set back to 1997-08-22 so `Last-Modified` stays 1997. Loads made during internal testing are not carried over.
4. The counter moves per V3 item 4 on production.

### N3 — after launch (owner: diane)
- [ ] CODE PASS — `tests/unit/<id>-post-launch.test.ts` passes
- [ ] BROWSER PASS — `e2e/specs/<id>-walk.spec.ts` (W-DoD on production) green
1. Production `security.txt` is 200 `text/plain` with `Expires` ≤ 365 days ahead.
2. Production `presence.json` meets X1 item 1. Its `access-control-allow-origin: *` header is checked; if Pages does not send it, the finding is recorded in `PLAN.md` Phase 8 Result and `PRD.md` R34 is amended to state what production sends (static hosting allows no other fix), and this item is flipped on that record.
3. Every `SH-` identifier in `company/` verifies on the production `/verify` page.
4. W-DoD completes on production in Chromium and WebKit, every step played by the critic or by its named substitute.
5. Clive's production phone re-check (`WALKS.md` § Phone checklist, production items) is recorded in `CHECKPOINTS.md`.
6. `PROJECT.md` records the `security.txt` renewal date (its `Expires` minus 30 days) and its owner, Martin (sh-011), and names the reminder workflow of L2 item 4.
7. `/goal`'s final audit passes against `PRD.md`, with the result recorded in `PLAN.md` Phase 8.

## Changelog

- 2026-10-03 — Written at stage 11: 52 beads across nine phases. (Diane, 2026-10-03)
- 2026-10-03 — Blind read applied (`BLIND_READ.md`): Phase 1 beads renamed DS1–DS7 and Phase 5 beads RC1–RC8; the shell moved to Phase 2 as E0 with placeholder pages (S1 retired); paper and status texts written in Phase 3; RC8 (the repository) added; substitutes for unplayable steps; I-09–I-12 applied. 53 beads. (Diane, 2026-10-03)
- 2026-10-05 — C2 answered: DS1 item 4 says a name in a script the certificate face lacks, Greek included, is drawn as an image and no second face ships (Decision 1); E4 item 3's ink comparison is measured on the text blocks only, the bar unchanged (Decision 4). (Diane, 2026-10-05)
