---
updated: 2026-10-05
read_by: every session start in BUILD (after SESSION_STATUS.md); `/goal` at BUILD entry; the landing gate's truth-pass at every session end; scripts/docs-sync-check.sh
relations:
  tracks: PRD.md
---

# STILL HERE — PLAN

> **Living execution plan: how & when.** Exists only while actively executing. Checkboxes are
> written at plan time and checked only with evidence (a test name, a sha, an observed result).
> All nine phases are planned to v1's definition of done: the public launch (I-04, I-06). A
> checkpoint packet is something the run passes through, not a place it stops, unless the next
> phase's entry criteria name the decision. (Jules, 2026-10-03)

## Now / Next / Later

**Now:**
- Phase 0: G0, G1, G2 and T0 closed; `specs-v1` tagged with every later bead red. Next: the
  Phase 0 exit-gate review.

**Next:**
- Phase 1: the design system and the four golden candidates, then the C2 packet.

**Later:**
- Phases 2–7 to the C4 launch packet (staging, phone checklist); Phase 8 after Clive's public switch.

## Phase map

| # | Phase | Status | Exit gate |
|---|---|---|---|
| 0 | Promote, gates, records filed | done | G0 G1 G2 T0 closed; `specs-v1` tagged red |
| 1 | Design system, golden candidates | held (awaiting C2) | DS1–DS7 closed; C2 packet out |
| 2 | The shell, the ritual and the certificate | held (awaiting C2) | E0–E7 closed; W1 W2 W3 W8 and W4.1–2 played |
| 3 | The company website | held (awaiting C2) | S2–S9 closed; W4 W5 played |
| 4 | Extras | active | X1–X6 closed; W6 played |
| 5 | The records in full | active | RC1–RC8 closed; W9 played locally; C3 packet out |
| 6 | vandalwayind.com (internal) | pending | V1–V4 closed; W7 played internally |
| 7 | Staging and the launch packet | pending | L1–L5 closed; C4 packet out |
| 8 | Launch | pending | N1–N3 closed; W-DoD on production |

## Active phase

**Phase 4 — Extras.** Phases 1, 2 and 3 are held awaiting C2. Phase 2: E0, E1, E5 and E6 closed;
E2, E3, E4 and E7 built and held on C2 items (E2 and E7 also wait on a quiet-machine re-run before
C4). Phase 3: S3–S9 closed; S2 waits on the leadership golden. Tests are locked at `specs-v3` (Clive
approved test change 4 ahead of the packet). Phase 4: X1, X2, X3 and X5 closed; X4 and X6 built and
held open on test items for the next checkpoint packet (Playwright's offline emulation in WebKit and
Firefox; X6 item 4's precondition and licence-text hosts), and Phase 4 is under review.

**Phase 5 — The records in full** is active, one owner, RC1 → RC8 in order. RC1 to RC6 closed. Next move:
RC7, the C3 packet.

## Build method

The builder–critic loop (factory README §3b), as it applies here.

- **Orchestrator:** `/goal`, compiled from this pack with the instruction "take the phases as given;
  do not re-plan." It reads `SESSION_STATUS.md`, this file, `PRD.md`, `garage/HANDOFF.md` and
  `garage/pack/` at entry. Its final audit grades against `PRD.md` and `garage/pack/ACCEPTANCE.md`,
  never against a builder's summary.
- **Builder:** a Worker sub-agent per bead, editing only the files the bead names, two fix attempts
  per verification failure, then it reports and stops.
- **Critic:** a fresh-context sub-agent with no write tools, briefed with
  `~/projects/factory/templates/prompts/critic.md` (rules 1–9, including rule 8's scope-reduction
  scan and rule 9's four levels) and then `garage/pack/CRITIC_RUBRIC.md`. **The constant exception
  applies:** the presence result is a constant by specification (Q1, sh-013). A critic must not
  report the ritual's result, the status page's "All systems operational", or `presence.json` as
  HOLLOW: the acceptance text names those constants as the required behaviour (critic rule 9's
  exception). Everything around them is still checked at four levels.
- **Deterministic before judgment:** the locked tests (unit with `node --test`, browser with
  Playwright in Chromium, WebKit and Firefox), the build, the link checker, axe, the weight and
  metadata checks, the OKF validator, `caddy validate`. Then the walk, played in a real browser,
  with the named substitutes of `garage/pack/WALKS.md` § Substitute evidence for steps outside the
  browser. Then the blind pick against an approved golden. Nothing visual is judged before C2.
- **Tests are written first and locked.** T0 (Phase 0) writes every test file named in
  `ACCEPTANCE.md`, red, and tags `specs-v1`. A builder never edits a locked test. A test that must
  change goes into the next checkpoint packet as a re-tag item; its bead waits and the run moves on.
  A red-pen Clive gives at C2 or C3 on a locked string is itself the approval of that test change:
  a separate test-author session applies exactly the red-pen, re-tags (`specs-v2`, …), and the
  re-tag is recorded in `garage/pack/CHECKPOINTS.md`.
- **Walk specs act as a person:** role and visible-text locators only, never test ids, never direct
  focus calls. The critic also plays each walk by hand in the browser before a GUI bead's verdict.
- **Waiting on C2.** A bead whose only unflipped box is "(after C2)" stays open. When every other
  bead of its phase is closed, the phase is set `held` ("awaiting C2") and the next phase becomes
  `active`. When C2's approval is recorded, the critic runs every waiting blind pick, the beads
  close, and each held phase goes to `done`.
- **Sequencing.** Phase 0 strictly in order. Phase 1: DS1 first (tokens), then DS2–DS6 in parallel
  worktrees, then DS7. Phase 2 is one owner, in order E0 → E1 → E2 → E3 → E4 → E5 → E6 → E7: the
  shell must exist for the walks, and the identifier, the link, Verify and the certificate are one
  coupled system. Phase 3: S2–S9 fan out in worktrees (independent pages, shared shell from E0).
  Phase 4: X1–X3 parallel, then X4, then X5–X6. Phase 5 is one owner, in order: twelve voices and
  their continuity are a coupled system. Phase 6 may run in its own worktree beside Phase 5 (no
  shared files); every command on the production server is single-owner. Phases 7 and 8 are
  strictly sequential.
- **Outward actions the run may take unattended** (I-02, I-11): create the private repository under
  the organization and push over SSH (commits under the GitHub no-reply address); write DNS for
  both domains through the registrar's API after a zone snapshot and a validation dry run; add
  sites to the production server's Caddy (Caddyfile backed up, `caddy validate` before every
  reload, no other site block touched); and, under I-11's guardrails, add a new internal-network
  serve port (never an existing route or another site), a systemd timer for the counter, files
  under `/srv`, and the Node runtime if absent. Every server change is a script in `deploy/` with a
  matching undo script, validated before any reload, and each undo script is run once and the
  install re-run before its bead closes. Nothing else outward.
- **Budget (I-07):** no per-phase caps; each phase runs until its exit gate passes. Phase estimates
  sum to 1,050 orchestrator turns. The run as a whole carries a ceiling of **1,400 orchestrator
  turns** as a safety, not a target (my number; Clive may change it at C1). **At the ceiling** the
  run starts no new bead, lets any running Worker return its receipt, writes
  `docs/checkpoints/ceiling-packet.md` (what is done, what is open, the turns per phase) and
  `SESSION_STATUS.md`, and stops. **Stuck rule:** when the same check fails after the Worker's two
  attempts and one further attempt with a fresh Worker, or the critic fails a unit twice on the
  same deciding difference, the bead is set `blocked` with the evidence, the item goes into the
  next checkpoint packet as a decision, and the run continues with every bead that does not depend
  on it. No silent loops.
- **Closing a bead:** every acceptance box flipped with evidence (`bd update --acceptance`), then
  `bd close` through the STRICT gate with notes naming the test files and counts, the walk for GUI
  beads (each step "played" or "played (substitute)"), and the GENERALIZE line. A bead whose specs
  depend on `STAGING_URL`, `VANDALWAY_INTERNAL_URL`, `PAGES_CHALLENGE` or production (V2–V4, L1,
  L3, L5, N1–N3) closes only from a run with that environment set and 0 skipped in its spec and
  unit files; the labelled HUMAN-JUDGED (after C2) skips are exempt. A run of only skipped tests
  exits 0, so the close notes give the skip count.
- **Decisions made during BUILD** are written into `PRD.md`, this file or `DESIGN.md` before the
  session lands (factory §3b rule 12), and every `garage/pack/ACCEPTANCE.md` edit re-syncs the
  bead's acceptance field in the same commit.

## Checkpoints

Four, per I-06, listed in full with their packets in `garage/pack/CHECKPOINTS.md`.

| # | When | Clive decides | Blocks |
|---|---|---|---|
| C1 | before Phase 0 | pack sign-off; the calls in the PRD diff, item 8; hands over the dossier's location and the continuity fixture | Phase 0 |
| C2 | end of Phase 1 | approve or red-pen the golden candidates: certificate, home, leadership, 1997 page | the styling steps of Phases 2, 3 and 6 and every blind pick |
| C3 | end of Phase 5 | the table read of every authored line, records and site copy | Phase 7 entry (C3's beads close first) |
| C4 | end of Phase 7 | the launch packet and the phone checklist; then the public switch | Phase 8 |

Standing rule: after any run that went overnight, `SESSION_STATUS.md`'s top block and the last
critic report are the morning look. Nothing is needed from Clive unless something is red.

### Where the run stops for Clive's hands

From the audit's list, mapped to the moment each is needed. Everything else is the run's.

| Hand | When | What the run does meanwhile |
|---|---|---|
| Hand over the brand dossier's location and `continuity-hashes.json` | C1 | nothing; G2 needs both |
| Create the `vandalway-industries` organization in the browser (I-01) | before G0 pushes | G0 commits locally; the push waits |
| In the organization's settings, add isitstillhere.com as a verified Pages domain and paste the `_github-pages-challenge-vandalway-industries` TXT value into the session | any time before L3; at C1 if convenient | L3 writes every other record; the TXT waits |
| C2 golden approvals | end of Phase 1 | Phase 2's engine steps; waiting beads per "Waiting on C2" |
| C3 table read | end of Phase 5 | Phase 6 continues |
| The phone test against staging, from `garage/pack/WALKS.md` § Phone checklist, with the phone on the internal network (Q24) | C4 | nothing further until C4 |
| Make the repository public — the switch (I-04) | after C4 sign-off | Phase 8 starts when the repository reads public |
| The two-minute phone re-check on production | after N1 and N2 | N3's other items |
| Mail provider (Q22, I-03) | out of this milestone | null MX stands |

## Phases

### Phase 0 — Promote, gates, records filed

#### Entry criteria
- [x] C1: Clive signs off `PRD.md`, this plan and `garage/pack/` (recorded in `garage/pack/CHECKPOINTS.md`). Evidence: I-13; CHECKPOINTS.md § Record.
- [x] The brand dossier's location and the continuity fixture are in hand, and `garage/pack/ENV_PREFLIGHT.md` is re-run on the day; any changed line becomes a step here. Evidence: pre-flight re-run 2026-10-03; changed lines: the organization exists; Node v18.19.1 already on the production server (V2 installs nothing); isitstillhere.com has no A record (N1 writes it); Playwright 1.59.1 needed WebKit revision 2272 (installed in G1).

#### Steps
- [x] G0: `git init -b main` in this folder; repository-local `user.email` set to the account's GitHub no-reply address before the first commit (I-02); promote skeleton per the factory README §2 (README, AGENTS.md carrying the company's working rules from `garage/pack/CONTENT_SEEDS.md` § AGENTS.md rules, the agent-file symlink factory §2 requires beside it, SESSION_STATUS, `docs/archive/`, `assets/` copied from `garage/assets/` plus the parent logo into `assets/brand/`); stop-gate and the PII pre-commit hook with `PII_PUBLIC=1` installed; `.bd-gate` (STRICT); `bd init` (push block stripped); `.gitignore`. Evidence: commit bb2b7fe; `tests/unit/still-here-agb-promote.test.ts` tests 1–4 and 6 pass; tree scan at the public tier clean.
- [x] G0: `gh repo create vandalway-industries/still-here --private` once the organization exists; push over SSH (the token lacks the `workflow` scope). Evidence: `gh repo view` reads PRIVATE; `main` pushed over SSH at bb2b7fe; test 5 passes.
- [x] G0: file every bead in `garage/pack/ACCEPTANCE.md` with `--acceptance` verbatim, by the character listed as its owner (owner address `<id>@vandalway.example`); `docs/bead-map.md`; the bead-versus-ACCEPTANCE equality test. Evidence: 53 beads; `tests/unit/still-here-agb-promote.test.ts` tests 7 and 8 pass.
- [x] G1: scaffold (`package.json` with exact pins, `scripts/build.mjs`, `scripts/serve-pages.mjs` reproducing research 3's URL table on port 5320, `e2e/playwright.config.ts` with Chromium, WebKit and Firefox, `e2e/helpers/` for the walk substitutes); install Firefox for Playwright; vendor the OKF validator. Evidence: commit 6934d93; `tests/unit/still-here-2d9-serve-pages.test.ts` 6/6; Firefox and the WebKit revision Playwright 1.59.1 expects installed; G1 closed.
- [x] G2: file the record seeds into `company/` per `garage/pack/CONTENT_SEEDS.md` § Records (D11–D13); copy the continuity fixture into `tests/fixtures/`; validate the tracker by `bd import` into a throwaway database; the tracker never enters `.beads/`. Evidence: commit f8e7f89; `tests/unit/still-here-540-seeds.test.ts` 6/6 (throwaway import: 55 issues; `.beads/` unchanged); continuity check 0 matches; G2 closed.
- [x] T0: a separate test-author session writes every test file named in `ACCEPTANCE.md`, named with the real bead ids; the full run is red except Phase 0's; commit; tag `specs-v1`. Evidence: commit d8d6ab3, tag `specs-v1`; 50 unit files and 49 browser specs, the walk-to-bead table in `docs/bead-map.md` § Walks; `tests/unit/still-here-64t-specs.test.ts` 5/5; G0, G1, G2 and T0 together 26/26; every later bead's unit file red, every later bead's spec red or skipped for want of staging, the internal copy or production (Chromium run; `tests/fixtures/specs-v1-baseline.json`); T0 closed.

#### Bar
Deterministic only: `~/bin/bd-gate-selftest.sh` output; `~/projects/factory/scripts/docs-sync-check.sh .` clean; the PII gate at the public tier passes on the tree; G0/G1/G2's unit tests; the red run at `specs-v1`. No screen yet.

#### Budget
No cap (I-07). Expected about 60 orchestrator turns, reported in the C2 packet.

#### Exit gate
- [x] G0, G1, G2 and T0 closed through the STRICT gate; `specs-v1` exists and every later bead's tests are red; the repository is pushed (or the push is the only thing waiting on the organization). Evidence: the four beads closed with full notes; Phase 0 unit files 26/26; all 49 later-bead unit files red on an independent re-run; `specs-v1` (d8d6ab3) and `specs-v2` (b0bd978) on origin.

#### Result

Passed 2026-10-04. The gate review mapped all 296 acceptance items to assertions: none missing, 18 weak. The test author tightened the 18 and re-tagged `specs-v2` before any builder ran (recorded in `garage/pack/CHECKPOINTS.md`). One stop on the way: the public-tier PII gate flagged two literal strings in the pack (our webmaster address on the 1997 domain and GitHub's SSH host); the hook allows exactly those two, documented in `AGENTS.md`. (Jules, 2026-10-04)

### Phase 1 — Design system and golden candidates

#### Entry criteria
- [ ] Phase 0 exit gate.

#### Steps
- [ ] DS1: tokens from `DESIGN.md` generated into `src/css/tokens.css` and `src/js/tokens.js`; Inter, Inter Tight, JetBrains Mono and Cormorant Garamond static instances self-hosted (WOFF2 for the page, TTF for the PDF), OFL licences beside them; every colour pairing checked against WCAG 2.2.
- [x] DS2: the STILL HERE mark redrawn as SVG from `assets/still-here-logo-horizontal.png`; favicon, apple-touch-icon 180, manifest icons 192 and 512 (maskable). Evidence: `still-here-jw0` closed; `tests/unit/still-here-jw0-icons.test.ts` 2/2; the mark drawn by `scripts/brand.mjs`, rasters by `scripts/icons.mjs`.
- [x] DS3: image derivatives for every placement in `garage/pack/ASSET_MANIFEST.md`, 1x and 2x, ≤ 250 KB each, metadata stripped (D21), committed under `src/images/`. Evidence: `still-here-aac` closed; `tests/unit/still-here-aac-derivatives.test.ts` 3/3; 58 WebP and the Open Graph JPEG made by `scripts/derivatives.py`, largest 247 KB. The hero's crop box moved to keep the whole callout (C2 item).
- [x] DS4: the certificate drawing module (layout, seal, guilloche border, signatures as paths, QR code, footer) inside the svg2pdf subset; a specimen "Folding chair" certificate rendered to `garage/pack/exemplars/candidates/certificate.png` and `.pdf`. Evidence: `still-here-sp7` closed; `tests/unit/still-here-sp7-certificate-svg.test.ts` 8/8; `e2e/specs/still-here-sp7-certificate-candidate.spec.ts` 4/4 in Chromium and WebKit at 1440 and 390; the PDF made with jsPDF 4.2.1 + svg2pdf.js 2.8.1 and rendered back with pdf.js. Reading of DS4 item 5 (factory §3b rule 12): "converted at build time" is met by `scripts/certificate-glyphs.mjs`, a generation step run ahead of the build that reproduces byte-identical paths; `npm run build` does not run it. Wiring it into the build is filed as its own bead.
- [x] DS5: home (390 and 1440) and leadership (1440) built as static pages with drafted copy from `garage/pack/CONTENT_SEEDS.md`; screenshots to `candidates/`. Evidence: `still-here-9uk` closed; `tests/unit/still-here-9uk-candidates.test.ts` 4/4; `e2e/specs/still-here-9uk-home-leadership-candidate.spec.ts` 12/12 in Chromium and WebKit at 1440 and 390; screenshots by `scripts/page-candidates.mjs`.
- [x] DS6: the 1997 page in full with its period GIFs and the guestbook page, built in `vandalwayind/`; research 6's archived pages fetched as raw HTML into `garage/pack/exemplars/1997/`; screenshot to `candidates/`. Evidence: merged 8ef592c; `tests/unit/still-here-azk-vandalway-markup.test.ts` 4/4; candidate spec 4/4 in Chromium and WebKit; five archived pages, none refused (contact details withheld, recorded in `SOURCES.md`); DS6 closed.
- [x] DS7: the C2 packet (`docs/checkpoints/c2-packet.md`): each candidate, the C2 questions from `garage/pack/CHECKPOINTS.md`, the turns used. Evidence: `still-here-9xd` closed; `tests/unit/still-here-9xd-c2-packet.test.ts` 2/2; five candidate sections, three decisions, two test changes for red-pen, two calls made under a rule; turns Phase 0 61, Phase 1 22.

#### Bar
Exemplars: the hero and logo PNGs (palette, register, mark); `DESIGN.md`; research 6's archived pages for the 1997 page (or, if the archive refuses, research 6's element table). Deterministic first: token contrast, the derivative and metadata checks, the svg2pdf element allow-list, the 1997 markup checks. No blind pick yet: the goldens are what C2 creates. Candidates are judged by Clive.

#### Budget
No cap (I-07). Expected about 120 orchestrator turns.

#### Exit gate
- [ ] DS1–DS7 closed through the gate; the C2 packet is out. (Approval itself is C2; the run continues into Phase 2.)

#### Result

### Phase 2 — The shell, the ritual and the certificate

#### Entry criteria
- [ ] Phase 1 exit gate. Steps marked **[after C2]** start only when C2's approval is recorded in `garage/pack/CHECKPOINTS.md`.

#### Steps
- [x] E0: the site shell (header, the eight-item menu, the three-link footer, CSP and Open Graph meta, the link checker) and a page for every path of PRD R24, built or a marked placeholder; the real 404 page. Evidence: `still-here-lsz` closed through the gate; the shell is included at build time from `src/_shell/` (a page without its three markers fails the build); `tests/unit/still-here-lsz-links.test.ts` 6/6; shell and walk specs 124 passed, 2 skipped (the walk is Chromium and WebKit only) in six projects; W4.1–2 played in Chromium and WebKit at 390 and 1440; `npm run check:links` 19 pages, 0 broken; DS2–DS7 and X3 tests still green.
- [x] E1: identifier module (Branch B, mod 37 per I-12, canonicalization, decoder) shared by the site and the records check. Evidence: `still-here-yw2` closed through the gate; `src/js/identifier.js` (canonicalize, makeIdentifier, parseIdentifier), imported by `src/js/home.js`; `tests/unit/still-here-yw2-identifier.test.ts` 6/6 (seven vectors, 3,000 random identifiers with every substitution and swap rejected, the decoder cases, one alphabet holder); the DS4 specimen recomputes to SH-00PP-9AGR-1GTB.
- [ ] E2: the ritual on `/`: input rules (D5), examples (Q10), the sequence and its timing (Q5), reduced motion, the result, Check another, the pre-2026 clock. **[after C2]** styled to the home golden.
  Evidence (2026-10-04): unit 4/4; items 1-9 and 11-13 green in six projects in two full runs (84 and 82 of 86 run passed); W1 and W8 played in Chromium and WebKit; open on item 10 (C2 test change) and item 14 (C2 golden).
  Re-run at `specs-v3` (2026-10-05), against HEAD 2e1da15 served from a private copy, two full runs in six projects at two workers: item 10 flipped (ritual spec 10 passed, 1 skipped, in every project, both runs); unit 4/4 both runs. BROWSER PASS held: timing items 5 (WebKit spread 210 ms against 200) and 6 (an indicator sample taken between the result and the certificate) each red once in run 1 under load average about 10, green in run 2, so re-run on a quiet machine before C4; the W1 walk in WebKit went over 5,600 ms once (5,654 ms; C2 test change 5); item 14 waits on C2.
- [ ] E3: the certificate per issue: name layout, time zone (D4), the UTC line, QR code with the link. **[after C2]** matched to the certificate golden.
  Evidence (2026-10-04): `still-here-3xf` items 1-3 and 5-6 flipped; item 4 unticked at the Phase 2 review (four-line names print over "This certifies that"; C2 Decision 6); held open on items 4 and 7; unit 6/6; certificate spec 29/30 with one worker and Firefox 20/20 repeated (misses are the press-second race of E2 item 10); names outside the certificate face are drawn by the browser, one image per line (diff item 8).
  Re-run at `specs-v3` (2026-10-05), against HEAD 2e1da15 served from a private copy, two full runs in six projects at two workers: BROWSER PASS flipped, the certificate spec 5/5 in each of six projects in both runs (30/30); unit 6 passed, 1 skipped, both runs. Open on item 4 (C2 Decision 6) and item 7 (after C2).
- [ ] E4: PDF and PNG exports, fonts embedded, name blocks outside the face, filenames, progress and failure, render-back.
  Evidence (2026-10-04): `still-here-cq5` items 2, 5 and 7 flipped. Held on item 3 (the PNG differs 9.8% from the no-font render; the DS4 candidate measures the same; bar 20%), item 4 (3.3% as the test scales a 1651-px pdf.js canvas; pixel for pixel it measured 1.04% Chromium / 1.01% WebKit, not the 0.17% first reported, and after every line was set glyph by glyph from the face's advances 0.65% / 1.00%; waits on the C2 re-tag and the WebKit guilloche decision), item 6 at 390 (IoU 0.585 vs 0.6), and item 1's Firefox press-second race. All four are test changes for C2. Unit 3/4; Download PDF and PNG work in Chromium, WebKit and Firefox.
  Re-run at `specs-v3` (2026-10-05), against HEAD 2e1da15 served from a private copy, two full runs in six projects at two workers: item 1 flipped (spec test 1 green in all six projects both runs; unit test 1 green both runs). Still held on the C2 items alone: unit test 3 and item 3 at 9.8% (Decision 4), item 4 at 3.01% Chromium and 3.29% WebKit (test change 6), item 6 at chromium-390, IoU 0.585 (test change 7), and the W1.6–7 walk in WebKit at 5,767 and 5,637 ms against 5,600 (test change 5). Export spec per run: chromium 3/1, chromium-390 2/2, webkit 3/1, webkit-390 3/1, firefox and firefox-390 1 passed, 3 skipped.
- [x] E5: the certificate link (D2) and Copy certificate link.
  Evidence (2026-10-04): `still-here-wlr` CODE PASS and items 1-4 flipped, held open on BROWSER PASS. Unit 3/3 (five runs). After E6, two full runs of the link spec in six projects: item 4 green everywhere both times; chromium and chromium-390 6/6 both runs; tests 1-2 missed in Firefox (3 per project per run) and once in WebKit, each because the issuing page pressed at :01 or :02 under the spec's running clock (measured from the failing SVGs). This is C2 test change 4, which this spec now needs too. `/c/#…` is redrawn byte for byte from the link.
  Re-run at `specs-v3` (2026-10-05), against HEAD 2e1da15 served from a private copy, two full runs in six projects at two workers: BROWSER PASS flipped and `still-here-wlr` closed through the gate. The link spec in both runs: chromium and chromium-390 6/6; firefox, firefox-390, webkit and webkit-390 4 passed, 2 skipped (Copy is Chromium only); unit 3/3 both runs; the gate's own run 28 passed, 8 skipped. W2 is played by E6's walk.
- [x] E6: `/c/` and `/verify`: reopening is verifying; the Verify cases in their order (Q7, D3); failure and empty states.
  Evidence: `still-here-xws` closed through the gate; `src/js/judge.js` (one order of judgment), `src/js/verify.js`, `src/js/certificate-page.js`; unit 7/7 twice (item 5's every substitution and swap); verify spec 6/6 in each of six projects and the W2 walk (steps 1-7, step 7 by decodeQr) in Chromium and WebKit at 1440 and 390, both green in two runs (40 passed, 2 skipped each) and again in the gate; `/verify` and bare `/c/` are no longer placeholders; `npm run check:links` 19 pages, 0 broken.
- [ ] E7: Your Presence Portfolio.
  Evidence (2026-10-04): `still-here-c29` CODE PASS and items 3-6 flipped, held open on BROWSER PASS and items 1-2. `/portfolio` (`src/js/portfolio.js`) reads the store the ritual writes, unchanged. Unit 4/4 twice. Portfolio spec plus the W3 walk, two runs in six projects: 19 and 20 passed, 2 skipped, 3 and 2 failed. W3 (steps 1-5, step 4 by clearSiteData) passed in Chromium and WebKit at 1440 and 390 both times. Every miss is spec test 1-2's first issue, 'Car keys', landing at 10:52:01 under the spec's running clock (stored SH-00PP-9AHB-518D, expected SH-00PP-9AGV-4P4X): C2 test change 4, which this spec needs too.
  Re-run at `specs-v3` (2026-10-05), against HEAD 2e1da15 served from a private copy, two full runs in six projects at two workers: every identifier now matches with the paused clock. Run 1: spec test 1–2 in WebKit ran out of its 30 s under load (every assertion through the last download had passed), the other five 3/3; run 2: 3/3 in all six. W3 walk green in Chromium and WebKit at both sizes in both runs. Items 1–2 and BROWSER PASS stay unflipped; re-run on a quiet machine before C4. Unit 4/4 both runs.
- [x] Walks W4.1–2, W1, W2, W3, W8 played by the critic in Chromium and WebKit at 390×844 and 1440×900. Evidence: Phase 2 exit review, 2026-10-04: every step played by hand (W2.7 and W3.4 by their substitutes) in both engines at both sizes, no stuck step; the locked walk specs' remaining reds are C2 test changes 4–5 or measured host clock steps.

#### Bar
Deterministic: the identifier vectors and the exhaustive test; timing and stillness; no tells; QR decode; render-back ≤ 1%; `/FontFile2`; the link and Verify vectors. Then the walks in a browser, with substitutes where `WALKS.md` names them. Then, after C2, the blind pick: the result screen against `exemplars/home-390-golden.png` and `home-1440-golden.png`, the exported PNG against `exemplars/certificate-golden.png`.

#### Budget
No cap (I-07). Expected about 220 orchestrator turns.

#### Exit gate
- [ ] E0–E7 closed through the gate (beads waiting only on C2's pick are handled by "Waiting on C2"); W4.1–2, W1, W2, W3, W8 played with no stuck step; critic PASS on each GUI bead.

#### Result

### Phase 3 — The company website

#### Entry criteria
- [ ] E0 and G2 closed (the shell and the record seeds exist). Styling steps **[after C2]**.

#### Steps
- [ ] S2 leadership · S3 research, with the three papers written into `company/research/` · S4 case studies (three pages, the customer named per I-09) · S5 status, with STATUS-002 and STATUS-003 written · S6 careers · S7 enterprise · S8 terms · S9 privacy — copy drafted from `garage/pack/CONTENT_SEEDS.md`, every required statement present, every placeholder replaced.
  - S2 (2026-10-04): `still-here-tul` CODE PASS, BROWSER PASS and items 1-3 flipped; held open on item 4 (after C2, the blind pick). Cards carry each person's id (14da7e0); unit 3/3 (1 skipped, after C2); leadership spec and W4.leadership walk 10 passed, 2 skipped, two runs in six projects.
  - S3 (2026-10-04): `still-here-3yo` closed through the gate. The three papers written into `company/research/` (Petra); `scripts/company-pages.mjs` builds `/research/` and each paper from them, covers drawn in SVG; the build reads only `company/research/` and `company/status/status-updates.xml`. Unit 4/4; research spec and W4.research walk 28 passed, 2 skipped in six projects (three clean runs; one run lost three WebKit tests to a shared local server stopping mid-run); RC5's unit file 3/3; continuity 0.
  - S4 (2026-10-04): `still-here-r4r` closed through the gate. Three studies of Eileen Webb's register and bench-01, quotations verbatim from sh-025 and SUPPORT-001 only, photographs b1, b2, b3-wide, p12-eileen. Unit 4/4; spec and W4.case-studies walk 28 passed, 2 skipped, two runs in six projects.
  - S5 (2026-10-04): `still-here-z4r` closed through the gate. STATUS-002 and STATUS-003 written by Martin, `status-updates.xsd` added; `/status` generated from the XML at build. Unit 3/3; spec and W4.status walk 10 passed, 2 skipped, two runs in six projects.
  - S6 (2026-10-04): `still-here-skd` closed through the gate. Three postings, "We will find you.", no form or mail link; s04, s06, m1-m3 placed. The manifest's s02 (research), s05 and s03 (status) placed in the same commit. Unit 3/3; spec and W4.careers walk 10 passed, 2 skipped, two runs in six projects.
  - S7 (2026-10-04): `still-here-5ki` closed through the gate. Bulk certification copy, two testimonials verbatim from SUPPORT-001 and sh-025, the call to action verbatim, no form; s08, b3-wide-courthouse, p12-eileen-courthouse. Unit 4/4; spec and W5 walk 10 passed, 2 skipped, two runs in six projects.
  - S8 (2026-10-04): `still-here-hng` closed through the gate. Terms of Presence with the four sentences verbatim. Unit 2/2; spec and W4.legal (Terms) walk 10 passed, 2 skipped, two runs in six projects.
  - S9 (2026-10-04): `still-here-eg4` closed through the gate. Privacy with the eight sentences verbatim and the host's and WebKit's own documentation linked (both fetched and read 2026-10-04). Unit 2/2; spec and W4.legal (Privacy) walk 10 passed, 2 skipped, two runs in six projects.
- [x] Walks W4 (with each page's sub-walk) and W5 played by the critic. Evidence: Phase 3 exit review, 2026-10-05: every sub-walk and W5 played by hand in Chromium and WebKit at 390×844 and 1440×900 (316 steps), no stuck step; S2–S9 specs two runs 116 passed, 0 failed.

#### Bar
Deterministic: the D8 path list by name; zero broken links; the exact strings (Enterprise sentence, status constant and titles, Jules's line, the footer link); zero form elements on Enterprise and Careers; each Terms and Privacy statement found with the test or citation that proves it. Then W4 and W5 in a browser. Then the blind pick for leadership against `exemplars/leadership-1440-golden.png`. Pages without a golden are judged on tokens and the walk; their taste goes to C3.

#### Budget
No cap (I-07). Expected about 160 orchestrator turns.

#### Exit gate
- [ ] S2–S9 closed through the gate; W4 and W5 played with no stuck step.

#### Result

### Phase 4 — Extras

#### Entry criteria
- [ ] Phase 3 exit gate.

#### Steps
- [x] X1 `presence.json` · X2 `security.txt` and its CI expiry check · X3 the 404 on every server.
  X1, X2 and X3 closed through the gate 2026-10-05 (commit dbaaac8): unit 2/2, 3/3, 1/1 on two runs
  (staging skips); presence spec 6/6 and the 404 spec and walk 16 passed, 2 skipped, on two runs.
- [ ] X4 manifest and service worker; everything in Goals 1–3 offline; build N+1 served by the second navigation.
  Built (commit dbaaac8). The unit test passes 4/4. Chromium is green at both sizes on two runs.
  Firefox passes test 3 but not test 4: its service worker still reaches the network under
  `setOffline`. In WebKit every request fails under `setOffline`, so tests 3, 4 and W6.8 fail. With
  the server actually stopped, all three engines work offline. Held for a test change in the next
  packet.
- [x] X5 accessibility across every page (axe, keyboard, focus, live region). Closed 2026-10-05:
  unit 2/2; spec 18/18 in six projects on two runs (axe 0 serious/critical on 19 pages).
- [ ] X6 the guards: no external request, no analytics, fragment never sent, CSP holds, page weight, no placeholder left.
  Items 2, 3 and 5 green on two runs, and item 1 in Chromium. Item 1 in WebKit stops at W6.8 (the
  same emulation). Item 4 needs `deploy/` (Phase 6). Its scan also finds scripts.sil.org, inside the
  verbatim OFL texts, and opencollective.com, core-js's funding URL in `package-lock.json`. Held
  for the next packet.
- [ ] Walk W6 played; the 404 sub-walk of W4 played. W4.404 played in Chromium and WebKit at both
  sizes. W6.1–7 played in Chromium at both sizes (1–2 with the `checkInstallable()` substitute).
  W6.8 in WebKit is held on the emulation item above.

#### Bar
Deterministic: each X bead's specs, axe at zero serious or critical, the weight budget, the network log. Then W6 in Chromium (installability with its substitute) and the offline steps in WebKit.

#### Budget
No cap (I-07). Expected about 100 orchestrator turns.

#### Exit gate
- [ ] X1–X6 closed through the gate; W6 played with no stuck step.

#### Result

### Phase 5 — The records in full

#### Entry criteria
- [x] G2, E1, S3 and S5 closed (identifiers are checked with the shipped module; the papers and status updates exist). Evidence: `bd show` reads closed for still-here-540, still-here-yw2, still-here-3yo and still-here-z4r (2026-10-05).

#### Steps
- [x] RC1 correspondence, chat, notes and calendar in full · RC2 the inventory (YAML and Bev's XML) · RC3 status records (internal notes; the public updates cross-checked) · RC4 the gum graph as an OKF bundle · RC5 the papers checked as records.
  Evidence: RC1 closed — every mail with Message-ID, subject and threading, SUPPORT-001's attachment header, CAL-001's invite history; `tests/unit/still-here-7i1-correspondence.test.ts` 5/5; continuity 0. RC2 closed — `company/inventory/schema.json`, every row citing record ids, Bev's SpreadsheetML `HERE_FINAL_2008_USE_THIS_ONE.xml` with the same five ids and statuses; `tests/unit/still-here-8je-inventory.test.ts` 4/4. RC3 closed — the 11:50 floor counts for the week in `company/status/notes.xml` with `notes.xsd`, Tuesday's floor three 0 amended to 1 on reflection; STATUS-001–003 checked against their sources; `tests/unit/still-here-1t0-status-records.test.ts` 3/3. RC4 closed — `company/gum-graph/` as 28 concepts (7 people, 4 observations, 2 borrowings, 1 reimbursement, 12 access requests, 2 claims); OKF validator `--strict` conformant; `tests/unit/still-here-17d-gum-graph.test.ts` 4/4. RC5 closed — every footnote resolves, §3 present, Six Feet's times and distance are QA-001's and sh-051's; `tests/unit/still-here-zhf-papers.test.ts` 3/3 (its distance pattern is overbroad, a C3 packet item).
- [x] RC6 the continuity and identifier checks in CI across `company/` and `site/`. Evidence: `scripts/identifier-check.mjs` (imports `src/js/identifier.js`) and `.github/workflows/records.yml`, commit c8852b8; Actions run 37302871955 green: continuity 0 over `company/` and `site/`, identifiers 8 found, 8 recompute; `tests/unit/still-here-62x-continuity.test.ts` 7/7.
- [ ] RC7 the C3 packet: every HUMAN-JUDGED line, records and site copy, laid out for a table read in reading order, with the record ids, pages and locked test files each line lives in.
- [ ] RC8 `README.md` and `company/README.md`; walk W9 played on the local checkout.

#### Bar
Deterministic: schema validation of every format; YAML and XML inventories round-trip to the same set; the OKF validator in strict mode; every cited id resolves; every identifier recomputes, at least the two named; the continuity assertions. Voice is never looped on (§3b rule 6): one authoring pass per record set, then C3.

#### Budget
No cap (I-07). Expected about 150 orchestrator turns.

#### Exit gate
- [ ] RC1–RC8 closed through the gate; W9 played locally; the C3 packet is out.

#### Result

### Phase 6 — vandalwayind.com, built and served internally

#### Entry criteria
- [ ] DS6 closed. Styling past the candidate waits on C2's verdict on the 1997 page.

#### Steps
- [ ] V1: the page finished per R42 and the C2 red-pen; the guestbook page; all period assets.
- [ ] V2: `deploy/vandalwayind-install.sh` and its undo: files under `/srv/vandalwayind/`; a Caddy site bound to localhost; a new internal-network HTTPS port of its own (I-11); Caddyfile backed up, `caddy validate` before reload, no other site block changed; undo run once, install re-run.
- [ ] V3: the counter: this site's own access log (JSON, seven-day retention), a running-total file, the page and image sent `no-cache`, a ten-minute systemd timer, the digit image, Node installed if absent — all by the V2 scripts.
- [ ] V4: `Last-Modified` per file (1997 page, 1999 guestbook, counter's own time), POST refused, quirks mode on the served copy, HTTP→HTTPS ready for Phase 8.
- [ ] Walk W7 played on the internal copy.

#### Bar
Deterministic: the markup checks; the served headers; the counter showing at least n+3 within eleven minutes of three loads; `caddy validate`; the undo-then-install round trip. Then W7. Then the blind pick against `exemplars/vandalway-1997-golden.png`; "reads as found, not as parody" is HUMAN-JUDGED at C2 and C3.

#### Budget
No cap (I-07). Expected about 80 orchestrator turns.

#### Exit gate
- [ ] V1–V4 closed through the gate; W7 played on the internal copy with no stuck step.

#### Result

### Phase 7 — Staging and the launch packet

#### Entry criteria
- [ ] Phases 2, 3, 4, 5 and 6 at their exit gates (or `held` awaiting C2 with C2 since recorded); every bead filed from C3's red-pens closed.

#### Steps
- [ ] L1: staging for isitstillhere by `deploy/staging-install.sh` and its undo: Caddy on localhost with Pages-equivalent rules and the `presence.json` header, a new internal-network HTTPS port of its own (I-11); rsync of `site/`; `/build.txt` check; research 3's URL table on staging.
- [ ] L2: `.github/workflows/pages.yml` (Actions from `site/` only, pinned versions, `include-hidden-files: true`, skipped while private, no `schedule:`) and `.github/workflows/security-txt-reminder.yml` (weekly; opens an issue, nothing else).
- [ ] L3: zone snapshots of both domains; validation dry run; then null MX, SPF and DMARC on both, and the Pages verification TXT once Clive has handed its value over. Nothing else changes.
- [ ] L4: the release scan: PII gate at the public tier over the tree and the whole history; every author and committer email; PNG metadata on `site/`; the names grep.
- [ ] L5: W1–W9 on staging; the phone checklist printed for Clive; the C4 packet.

#### Bar
Deterministic: staging specs; the URL table; DNS read-back equals the intended records and the snapshot holds everything else unchanged; the release scan clean. Then W1–W9 on staging. The phone test is Clive's (HUMAN-JUDGED, C4).

#### Budget
No cap (I-07). Expected about 100 orchestrator turns.

#### Exit gate
- [ ] L1–L5 closed through the gate; the C4 packet is out.

#### Result

### Phase 8 — Launch

#### Entry criteria
- [ ] C4 signed off and the repository reads public (`gh repo view --json visibility`).
- [ ] The Pages verification TXT resolves and the organization shows the domain verified.

#### Steps
- [ ] N1: private vulnerability reporting enabled and `RENEWAL_ASSIGNEE` set first; then Pages source set to GitHub Actions; `github-pages` environment limited to `main`; deploy; custom domain set; apex A and AAAA and `www` CNAME written; wait for the certificate (up to 24 hours, polled); HTTPS enforced; the production smoke.
- [ ] N2: vandalwayind.com's A record (reverse record accepted as it is, I-10); the public Caddy site block by a `deploy/` script with its undo; certificate issued; the counter reset and dated at go-live; W7 on production.
- [ ] N3: the live record check against production Verify; `security.txt` and `presence.json` on production; Clive's production phone re-check recorded; W-DoD on production; `/goal`'s final audit against `PRD.md`.

#### Bar
Deterministic: the production smoke (build id, URL table, 301s, `https_enforced`, headers); the live identifier check. Then W-DoD in a browser on production, played by the critic. This is v1's definition of done.

#### Budget
No cap (I-07). Expected about 60 orchestrator turns, plus waiting on DNS and certificates, which is time, not turns.

#### Exit gate
- [ ] N1–N3 closed through the gate; W-DoD complete on production; the final audit passes against `PRD.md`.

#### Result

## Deliberately not doing

- The scheduled Friday test; the published-key signature; mail auto-reply before a provider exists;
  a Share button; accounts; analytics; reading the inventory from the site; example rotation;
  `where()` as a module; the Certificate Transparency link; Wallet passes; credentials on
  certificates. Reasons in the PRD's diff.
- Rewriting the 55-issue tracker. It was written at Q21 and is filed as it stands; Phase 5 adds
  comments only where a later record requires one.

## Open questions

- **Mail provider for Q22** — out of this milestone (I-03). Blocks nothing in v1.
- **Found during the build** — Work found by a review, kept here until C2 decides how found work is filed (the G0 bead check;
C2 packet, test change 3). Each item names the phase that picks it up. (Jules, 2026-10-04)
  - [x] Phase 4 (X6, the guards): `npm run build` regenerates the certificate's signature paths (today
  `scripts/certificate-glyphs.mjs` is run by hand; its output is byte-identical), and the
  `tokens.css` header comment written by `scripts/tokens.mjs` names every generated colour source
  (`src/brand/mark.svg` and `src/favicon.svg` carry the green too). Found at the Phase 1 critic
  review. Done 2026-10-05 (commit dbaaac8). The build converts the glyphs again whenever the
  SHA-256 of their inputs (the script and every face) differs from the one stamped in both outputs.
  The header now names `src/js/tokens.js`, `src/brand/mark.svg` and `src/favicon.svg`.
  - [ ] Phase 4 (X6): the three failure sentences in the C2 packet's addendum, decision 7, once Clive
    red-pens them: the stuck running state when the certificate drawing cannot load
    (`src/js/home.js`), the false "could not locate" when a valid link cannot be drawn
    (`src/js/certificate-page.js`), and the "Kept…" line when storage is refused (`src/js/home.js`).
    Found at the Phase 2 review. The three paths are built with the drafted sentences (commit
    dbaaac8): the box comes back empty and focused, `/c/` says the link is still valid, and the
    not-kept line replaces "Kept…". The wording still waits on Clive's red-pen at C2.
  - [ ] Next packet (X4, X6): offline in WebKit and Firefox emulated by stopping or blocking the
    server rather than `context.setOffline`; X6 item 4 to allow the licence texts' and the
    lockfile's funding hosts (or cite them), its `deploy/` precondition met at Phase 6. Found at
    the Phase 4 build, 2026-10-05.

## Retro — process notes (append-only)

| Date | Phase | Note |
|------|-------|------|
| 2026-10-03 | PLAN | Pack assembled the same day as the interview. Nothing built yet. The audit lists the tracker as missing; it is on disk now (`company/tracker/`, 55 issues), and the pack treats it as filed. (Bev, 2026-10-03) |
| 2026-10-03 | PLAN | A reader who had never seen the pack found 51 holes, eleven of them blocking the definition of done. Three were ordering: walks that needed pages from a later phase. (Bev, 2026-10-03) |

**Disposition at review:** accepted

## Changelog

- 2026-10-03 — Authored at the PLAN gate (stage 11), from the build-pack interview (D1–D22, I-01–I-08). Nine phases to the public launch. (Jules, 2026-10-03)
- 2026-10-03 — PRD wording: "creative reference" is now "the brand dossier", located by the run, not the repository. (Jules, 2026-10-03)
- 2026-10-03 — Blind read applied (`garage/pack/BLIND_READ.md`): the shell moves to Phase 2 (E0); papers and status updates are written in Phase 3; RC8 and W9 added; beads relabelled DS and RC; the "Waiting on C2" and red-pen re-tag rules; the ceiling raised to 1,400 with its stop; I-09–I-12 applied (the reverse-DNS question closed; server changes beyond Caddy authorized with undo scripts). The brand dossier's location is handed to the run by Clive at C1, with the continuity fixture. (Jules, 2026-10-03)
- 2026-10-03 — Wording only: the 1997 page is described as "built in-house" throughout the pack. (Jules, 2026-10-03)
- 2026-10-03 — C1 signed by Clive (I-13): pack approved; ceiling 1,400; phone checklist as written. (Jules, 2026-10-03)
- 2026-10-03 — G0: 53 beads filed and mapped in `docs/bead-map.md`; C1 recorded in `garage/pack/CHECKPOINTS.md`. (Jules, 2026-10-03)
- 2026-10-04 — G0: first commit bb2b7fe, private repository created and pushed over SSH; G0 closed. (Jules, 2026-10-04)
- 2026-10-04 — G1 and G2 closed: scaffold, local Pages server, browser config and walk substitutes (6934d93); the sample week's records, staff, inventory, gum graph seed, tracker schema and the continuity check (f8e7f89). (Jules, 2026-10-04)
- 2026-10-04 — T0 closed: every test written red and locked at `specs-v1` (d8d6ab3); walk owners recorded in `docs/bead-map.md`. (Jules, 2026-10-04)
- 2026-10-04 — The zero-skip close rule for beads that need staging, the internal copy or production; tests re-tagged `specs-v2` after the Phase 0 gate review (recorded in `garage/pack/CHECKPOINTS.md`). (Jules, 2026-10-04)
- 2026-10-04 — Phase 0 closed at its exit gate; Phase 1 active. (Jules, 2026-10-04)
- 2026-10-04 — DS1 built (tokens generated by the build, six static faces with their OFL and coverage); held open: Cormorant Garamond has no Greek (item 4) and the linter test expects text the linter does not print (item 2). Both go to the C2 packet. (Jules, 2026-10-04)
- 2026-10-04 — DS2–DS5 closed: the mark and icons; the photograph derivatives; the certificate drawing with its Folding chair PNG and PDF (jsPDF 4.2.1 and svg2pdf.js 2.8.1 added, exact pins); home and leadership with their candidates. Three items for the C2 packet: the hero crop box, Lucas's display name, and the certificate candidate itself. (Jules, 2026-10-04)
- 2026-10-04 — Phase 1 held awaiting C2 (critic review: DS2–DS7 pass; DS1 open on C2 Decision 1 and a test change). Phase 2 active. DS4 item 5's "build time" reading recorded. (Jules, 2026-10-04)
- 2026-10-04 — E0 closed: the shared shell, every R24 page built or a marked placeholder, the 404 page, one CSP and Open Graph set (og:image now `hero-og-1200.jpg`), the link checker. Next: E1. (Jules, 2026-10-04)
- 2026-10-04 — E1 closed: the identifier module, shared by the site and the records check; every vector reproduces. Next: E2. (Jules, 2026-10-04)
- 2026-10-04 — E2 built (the ritual on `/`), held open: item 10's press-second test is a re-tag item, and item 14 waits on C2. (Jules, 2026-10-04)
- 2026-10-04 — E2 re-timed: every step set from the press (1.2 s, 3.2 s, result 4.6 s), the same with and without motion; bead blocked on C2. (Jules, 2026-10-04)
- 2026-10-04 — E3 built: the certificate per issue, names outside the face drawn as images; held open on item 7 (C2). (Jules, 2026-10-04)
- 2026-10-04 — E4 built: Download PDF and PNG, fonts embedded, progress and failure; held open on four test questions for C2. (Jules, 2026-10-04)
- 2026-10-04 — E4 item 4 measured pixel for pixel: 1.04% / 1.01% (not 0.17%); every certificate line now set glyph by glyph, 0.65% Chromium, 1.00% WebKit; candidate re-rendered. Item 4 still waits on C2. (Jules, 2026-10-04)
- 2026-10-04 — E5 built: the certificate link, Copy certificate link with its refused fallback, and `/c/#…` redrawn byte for byte; held open on item 4 until E6's Verify form. (Jules, 2026-10-04)
- 2026-10-04 — E6 closed: `/c/` and `/verify`, one judgment in Verify's order; E5 item 4 flipped, E5 held on its spec's press-second race (C2 test change 4). (Jules, 2026-10-04)
- 2026-10-04 — E7 built: Your Presence Portfolio; held open on its spec's press-second race (C2 test change 4). (Jules, 2026-10-04)
- 2026-10-04 — Phase 2 held awaiting C2 after the critic's review; Phase 3 active. E3 item 4 unticked. Clive's early approval of test change 4 recorded. (Jules, 2026-10-04)
- 2026-10-05 — Re-run at specs-v3: E5 closed; E2 item 10, E3 BROWSER PASS and E4 item 1 flipped; E2 and E7 to re-run on a quiet machine before C4. (Jules, 2026-10-05)
- 2026-10-05 — Phase 3 held awaiting C2 (S2's leadership golden only) after the critic's review; Phase 4 active. (Jules, 2026-10-05)
- 2026-10-05 — Phase 4: X1, X2, X3, X5 closed; X4 and X6 built and held on test items for the next packet; the glyph and tokens-header items done; the failure sentences built as drafts. (Jules, 2026-10-05)
