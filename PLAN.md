---
updated: 2026-10-06
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
- Phase 7 is held at C4. L1–L4 are closed; the C4 packet is with Clive; L5 waits on its question 9.

**Next:**
- Clive: the phone checklist, the packet's § 6, sign-off, the public switch. Then Phase 8 (N1–N3).

**Later:**
- L1–L5 to the C4 launch packet (staging, phone checklist); Phase 8 after Clive's public switch.

## Phase map

| # | Phase | Status | Exit gate |
|---|---|---|---|
| 0 | Promote, gates, records filed | done | G0 G1 G2 T0 closed; `specs-v1` tagged red |
| 1 | Design system, golden candidates | done | DS1–DS7 closed; C2 packet out |
| 2 | The shell, the ritual and the certificate | done | E0–E7 closed; W1 W2 W3 W8 and W4.1–2 played |
| 3 | The company website | done | S2–S9 closed; W4 W5 played |
| 4 | Extras | done | X1–X6 closed; W6 played |
| 5 | The records in full | done (C3 packet out) | RC1–RC8 closed; W9 played locally; C3 packet out |
| 6 | vandalwayind.com (internal) | done | V1–V4 closed; W7 played internally |
| 7 | Staging and the launch packet | active (at C4; L5 on question 9) | L1–L5 closed; C4 packet out |
| 8 | Launch | pending | N1–N3 closed; W-DoD on production |

## Active phase

**Phase 7 — Staging and the launch packet.** Entered 2026-10-06; held at C4 the same day. L1–L4
closed; the C4 packet (`docs/checkpoints/c4-packet.md`) is with Clive; L5 waits on the packet's
question 9 (the walk helpers on a networked server). Phase 8 starts on Clive's public switch.

## Build method

The builder–critic loop (factory README §3b), as it applies here.

- **Orchestrator:** `/goal`, compiled from this pack with the instruction "take the phases as given;
  do not re-plan." It reads `SESSION_STATUS.md`, this file, `PRD.md`, `garage/HANDOFF.md` and
  `garage/pack/` at entry. Its final audit grades against `PRD.md` and `garage/pack/ACCEPTANCE.md`,
  never against a builder's summary.
- **Builder:** a Worker sub-agent per bead, editing only the files the bead names, two fix attempts
  per verification failure, then it reports and stops.
- **Critic:** a fresh-context sub-agent with no write tools, briefed with
  the factory's critic prompt (`templates/prompts/critic.md` in the factory) (rules 1–9, including rule 8's scope-reduction
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
Deterministic only: the bead gate's self-test (`bd-gate-selftest.sh`) output; the factory's docs-sync check (`scripts/docs-sync-check.sh .` in the factory) clean; the PII gate at the public tier passes on the tree; G0/G1/G2's unit tests; the red run at `specs-v1`. No screen yet.

#### Budget
No cap (I-07). Expected about 60 orchestrator turns, reported in the C2 packet.

#### Exit gate
- [x] G0, G1, G2 and T0 closed through the STRICT gate; `specs-v1` exists and every later bead's tests are red; the repository is pushed (or the push is the only thing waiting on the organization). Evidence: the four beads closed with full notes; Phase 0 unit files 26/26; all 49 later-bead unit files red on an independent re-run; `specs-v1` (d8d6ab3) and `specs-v2` (b0bd978) on origin.

#### Result

Passed 2026-10-04. The gate review mapped all 296 acceptance items to assertions: none missing, 18 weak. The test author tightened the 18 and re-tagged `specs-v2` before any builder ran (recorded in `garage/pack/CHECKPOINTS.md`). One stop on the way: the public-tier PII gate flagged two literal strings in the pack (our webmaster address on the 1997 domain and GitHub's SSH host); the hook allows exactly those two, documented in `AGENTS.md`. (Jules, 2026-10-04)

### Phase 1 — Design system and golden candidates

#### Entry criteria
- [x] Phase 0 exit gate. Evidence: Phase 0 closed at its exit gate (changelog, 2026-10-04).

#### Steps
- [x] DS1: tokens from `DESIGN.md` generated into `src/css/tokens.css` and `src/js/tokens.js`; Inter, Inter Tight, JetBrains Mono and Cormorant Garamond static instances self-hosted (WOFF2 for the page, TTF for the PDF), OFL licences beside them; every colour pairing checked against WCAG 2.2.
  Evidence (2026-10-06): `still-here-hlw` closed through the gate at `specs-v6`; `tests/unit/still-here-hlw-tokens.test.ts` 4/4 in two runs from a private snapshot of HEAD 3f4803e (item 4 as reworded by C2 Decision 1: Greek drawn as an image, no second face), and again in the gate.
- [x] DS2: the STILL HERE mark redrawn as SVG from `assets/still-here-logo-horizontal.png`; favicon, apple-touch-icon 180, manifest icons 192 and 512 (maskable). Evidence: `still-here-jw0` closed; `tests/unit/still-here-jw0-icons.test.ts` 2/2; the mark drawn by `scripts/brand.mjs`, rasters by `scripts/icons.mjs`.
- [x] DS3: image derivatives for every placement in `garage/pack/ASSET_MANIFEST.md`, 1x and 2x, ≤ 250 KB each, metadata stripped (D21), committed under `src/images/`. Evidence: `still-here-aac` closed; `tests/unit/still-here-aac-derivatives.test.ts` 3/3; 58 WebP and the Open Graph JPEG made by `scripts/derivatives.py`, largest 247 KB. The hero's crop box moved to keep the whole callout (C2 item).
  C2 and C3 (2026-10-05, not ticked here): the manifest's hero box is the build's (1044,110)-(1656,875) (Decision 3); `s07` placed on careers beside the stapler (C3), `s07-printer-400.webp` 33 KB and `-800.webp` 107 KB from `scripts/derivatives.py`, VP8 chunk only. DS3 unit and S6 unit and spec green; `npm run check:links` 19 pages, 0 broken.
- [x] DS4: the certificate drawing module (layout, seal, guilloche border, signatures as paths, QR code, footer) inside the svg2pdf subset; a specimen "Folding chair" certificate rendered to `garage/pack/exemplars/candidates/certificate.png` and `.pdf`. Evidence: `still-here-sp7` closed; `tests/unit/still-here-sp7-certificate-svg.test.ts` 8/8; `e2e/specs/still-here-sp7-certificate-candidate.spec.ts` 4/4 in Chromium and WebKit at 1440 and 390; the PDF made with jsPDF 4.2.1 + svg2pdf.js 2.8.1 and rendered back with pdf.js. Reading of DS4 item 5 (factory §3b rule 12): "converted at build time" is met by `scripts/certificate-glyphs.mjs`, a generation step run ahead of the build that reproduces byte-identical paths; `npm run build` does not run it. Wiring it into the build is filed as its own bead.
  C2 Decision 5 (2026-10-05, not ticked here): the guilloche stroke is 0.7 units (was 0.45). The specimen re-rendered by `scripts/certificate-candidate.mjs`, copied to `candidates/certificate.png`/`.pdf` and `certificate-golden.png` for Clive's second look; against the approved golden only the guilloche band differs. DS4 spec green in Chromium and WebKit.
- [x] DS5: home (390 and 1440) and leadership (1440) built as static pages with drafted copy from `garage/pack/CONTENT_SEEDS.md`; screenshots to `candidates/`. Evidence: `still-here-9uk` closed; `tests/unit/still-here-9uk-candidates.test.ts` 4/4; `e2e/specs/still-here-9uk-home-leadership-candidate.spec.ts` 12/12 in Chromium and WebKit at 1440 and 390; screenshots by `scripts/page-candidates.mjs`.
  C2 red-pens (2026-10-05, not ticked here): home's band reads "Every Friday, it is still here."; Lucas's card reads "Lucas" with "Intern" beneath (the staff file and tracker keep "Lucas the Intern"). S2 and DS5 specs green.
- [x] DS6: the 1997 page in full with its period GIFs and the guestbook page, built in `vandalwayind/`; research 6's archived pages fetched as raw HTML into `garage/pack/exemplars/1997/`; screenshot to `candidates/`. Evidence: merged 8ef592c; `tests/unit/still-here-azk-vandalway-markup.test.ts` 4/4; candidate spec 4/4 in Chromium and WebKit; five archived pages, none refused (contact details withheld, recorded in `SOURCES.md`); DS6 closed.
- [x] DS7: the C2 packet (`docs/checkpoints/c2-packet.md`): each candidate, the C2 questions from `garage/pack/CHECKPOINTS.md`, the turns used. Evidence: `still-here-9xd` closed; `tests/unit/still-here-9xd-c2-packet.test.ts` 2/2; five candidate sections, three decisions, two test changes for red-pen, two calls made under a rule; turns Phase 0 61, Phase 1 22.

#### Bar
Exemplars: the hero and logo PNGs (palette, register, mark); `DESIGN.md`; research 6's archived pages for the 1997 page (or, if the archive refuses, research 6's element table). Deterministic first: token contrast, the derivative and metadata checks, the svg2pdf element allow-list, the 1997 markup checks. No blind pick yet: the goldens are what C2 creates. Candidates are judged by Clive.

#### Budget
No cap (I-07). Expected about 120 orchestrator turns.

#### Exit gate
- [x] DS1–DS7 closed through the gate; the C2 packet is out. (Approval itself is C2; the run continues into Phase 2.) Evidence: DS1 closed 2026-10-06, DS2–DS7 closed 2026-10-04; `docs/checkpoints/c2-packet.md`; C2 answered 2026-10-05.

#### Result

### Phase 2 — The shell, the ritual and the certificate

#### Entry criteria
- [x] Phase 1 exit gate. Steps marked **[after C2]** start only when C2's approval is recorded in `garage/pack/CHECKPOINTS.md`. Evidence: Phase 1's exit gate met 2026-10-06; C2 recorded 2026-10-05.

#### Steps
- [x] E0: the site shell (header, the eight-item menu, the three-link footer, CSP and Open Graph meta, the link checker) and a page for every path of PRD R24, built or a marked placeholder; the real 404 page. Evidence: `still-here-lsz` closed through the gate; the shell is included at build time from `src/_shell/` (a page without its three markers fails the build); `tests/unit/still-here-lsz-links.test.ts` 6/6; shell and walk specs 124 passed, 2 skipped (the walk is Chromium and WebKit only) in six projects; W4.1–2 played in Chromium and WebKit at 390 and 1440; `npm run check:links` 19 pages, 0 broken; DS2–DS7 and X3 tests still green.
- [x] E1: identifier module (Branch B, mod 37 per I-12, canonicalization, decoder) shared by the site and the records check. Evidence: `still-here-yw2` closed through the gate; `src/js/identifier.js` (canonicalize, makeIdentifier, parseIdentifier), imported by `src/js/home.js`; `tests/unit/still-here-yw2-identifier.test.ts` 6/6 (seven vectors, 3,000 random identifiers with every substitution and swap rejected, the decoder cases, one alphabet holder); the DS4 specimen recomputes to SH-00PP-9AGR-1GTB.
- [x] E2: the ritual on `/`: input rules (D5), examples (Q10), the sequence and its timing (Q5), reduced motion, the result, Check another, the pre-2026 clock. **[after C2]** styled to the home golden.
  Evidence (2026-10-04): unit 4/4; items 1-9 and 11-13 green in six projects in two full runs (84 and 82 of 86 run passed); W1 and W8 played in Chromium and WebKit; open on item 10 (C2 test change) and item 14 (C2 golden).
  Re-run at `specs-v3` (2026-10-05), against HEAD 2e1da15 served from a private copy, two full runs in six projects at two workers: item 10 flipped (ritual spec 10 passed, 1 skipped, in every project, both runs); unit 4/4 both runs. BROWSER PASS held: timing items 5 (WebKit spread 210 ms against 200) and 6 (an indicator sample taken between the result and the certificate) each red once in run 1 under load average about 10, green in run 2, so re-run on a quiet machine before C4; the W1 walk in WebKit went over 5,600 ms once (5,654 ms; C2 test change 5); item 14 waits on C2.
  Re-run at `specs-v6` (2026-10-06), a private snapshot of HEAD 3f4803e, two runs at two workers in six projects: ritual 10 passed + 1 HUMAN-JUDGED skip, timing 3/3, in every project both runs; walk 2/2 in Chromium and WebKit at both sizes both runs (W1.1–5, W1.8–10, W8.1–2 played); unit 4/4 twice. BROWSER PASS flipped, and item 14 on the critic's blind pick of 2026-10-05 (PASS). The STRICT gate refused the close: in its own run (default workers, load average 12–15) timing test 5 went red once in Chromium (line 1 held 631.6 ms against 983). Open on a quiet-machine gate run.
  Closed (2026-10-06): `still-here-3a3` through the gate. Quiet-machine re-run (2026-10-06), a private snapshot of HEAD 973717a, one worker, load below 3 at the start of each run, two runs in six projects: ritual, timing and walk 86 passed, 10 skipped (the HUMAN-JUDGED test; the walks are Chromium and WebKit only), 0 failed, both runs (loads 2.92→1.56 and 1.61→0.94); unit 4/4. The gate's own run at three workers: ritual 60 + 6 skipped, timing 18/18, walk 8 + 4 skipped.
- [x] E3: the certificate per issue: name layout, time zone (D4), the UTC line, QR code with the link. **[after C2]** matched to the certificate golden.
  Evidence (2026-10-04): `still-here-3xf` items 1-3 and 5-6 flipped; item 4 unticked at the Phase 2 review (four-line names print over "This certifies that"; C2 Decision 6); held open on items 4 and 7; unit 6/6; certificate spec 29/30 with one worker and Firefox 20/20 repeated (misses are the press-second race of E2 item 10); names outside the certificate face are drawn by the browser, one image per line (diff item 8).
  Re-run at `specs-v3` (2026-10-05), against HEAD 2e1da15 served from a private copy, two full runs in six projects at two workers: BROWSER PASS flipped, the certificate spec 5/5 in each of six projects in both runs (30/30); unit 6 passed, 1 skipped, both runs. Open on item 4 (C2 Decision 6) and item 7 (after C2).
  C2 Decision 6 (2026-10-05, not ticked here): `src/js/certificate/draw.js` steps a long name down in size, floor 30, to at most three lines inside the zone between "This certifies that" and the name rule; one-line names keep baseline 326. Text and Greek names fit (an 80-code-point Latin name: two lines at 38, ink y 270-349 in both engines). 80 × 椅 and 80 × 🪑 do not fit three lines at the 30-unit floor (their line ink is about 30 units, the zone 79); they keep the old placement and still print over the fixed lines. Open: a floor for image-drawn names. Certificate spec green in Chromium and WebKit at `specs-v3`.
  C2 follow-up (2026-10-05, not ticked here): names drawn as images step down to an ink floor (25.2 units by the browser's measure, which the test reads as at least 24) with their lines set solid. 80 × 椅 and 80 × 🪑 now print as three lines inside y 270-349 in Chromium and WebKit, and none reaches the fixed lines. The fallback to the old placement is gone. Text names keep the 30-unit floor. At `specs-v4`: E3 unit 6/6 twice (item 4: ink bands of at least 24 and no more than four lines), and the 3xf and cq5 specs 22 passed in Chromium and WebKit.
  Closed (2026-10-06): `still-here-3xf` through the gate at `specs-v6`. The certificate spec 36/36 in six projects in two runs from a private snapshot of HEAD 3f4803e and again in the gate; unit 6 passed + 1 HUMAN-JUDGED skip twice. Item 4 flipped on those runs, item 7 on the critic's blind pick of 2026-10-05 (PASS).
- [x] E4: PDF and PNG exports, fonts embedded, name blocks outside the face, filenames, progress and failure, render-back.
  Evidence (2026-10-04): `still-here-cq5` items 2, 5 and 7 flipped. Held on item 3 (the PNG differs 9.8% from the no-font render; the DS4 candidate measures the same; bar 20%), item 4 (3.3% as the test scales a 1651-px pdf.js canvas; pixel for pixel it measured 1.04% Chromium / 1.01% WebKit, not the 0.17% first reported, and after every line was set glyph by glyph from the face's advances 0.65% / 1.00%; waits on the C2 re-tag and the WebKit guilloche decision), item 6 at 390 (IoU 0.585 vs 0.6), and item 1's Firefox press-second race. All four are test changes for C2. Unit 3/4; Download PDF and PNG work in Chromium, WebKit and Firefox.
  Re-run at `specs-v3` (2026-10-05), against HEAD 2e1da15 served from a private copy, two full runs in six projects at two workers: item 1 flipped (spec test 1 green in all six projects both runs; unit test 1 green both runs). Still held on the C2 items alone: unit test 3 and item 3 at 9.8% (Decision 4), item 4 at 3.01% Chromium and 3.29% WebKit (test change 6), item 6 at chromium-390, IoU 0.585 (test change 7), and the W1.6–7 walk in WebKit at 5,767 and 5,637 ms against 5,600 (test change 5). Export spec per run: chromium 3/1, chromium-390 2/2, webkit 3/1, webkit-390 3/1, firefox and firefox-390 1 passed, 3 skipped.
  C2 Decision 5 (2026-10-05, not ticked here): render-back of Folding chair, cropped, before 0.45 → after 0.7: Chromium 0.65% → 0.61%, WebKit 1.00% → 0.20%. Long names, after: Latin 0.82% / 0.28%, Greek 0.68% / 0.25%, 🪑 0.99% / 0.19%, 椅 1.45% / 0.64% (Chromium over the bar while its layout is open, E3). Four TrueType faces embedded in every PDF. Export spec and walk green in Chromium and WebKit at `specs-v3`.
  C2 follow-up (2026-10-05, not ticked here): name images sit on a 2/3-unit grid (one PDF pixel at 150 dpi), so the PDF and the PNG sample them alike. Cropped render-back (Chromium / WebKit): 80 × 椅 0.56% / 0.19% (it was 1.45% / 0.64%), 🪑 0.55% / 0.19%, Greek 0.56% / 0.18%, Latin 0.81% / 0.28%, Folding chair 0.61% / 0.20%. Every PDF embeds four TrueType faces. The Folding chair golden is unchanged, pixel for pixel.
  Re-run at `specs-v6` (2026-10-06), two runs as for E2: unit 4/4 twice (CODE PASS and item 3 flipped); export tests 4 and 6 green in Chromium and WebKit at both sizes both runs (items 4 and 6 flipped); the W1.6–7 walk green in Chromium and WebKit at both sizes both runs. BROWSER PASS held: test 7 went red once at webkit-390 in run 2 ("Preparing PNG…" visible, then gone before its `aria-disabled` check). This is a new red, reported to the PM.
  Closed (2026-10-06): `still-here-cq5` through the gate; BROWSER PASS flipped. Quiet-machine re-run (2026-10-06), a private snapshot of HEAD 973717a, one worker, load below 3 at the start of each run, two runs in six projects: export and W1.6–7 walk 5/5 in Chromium and WebKit at both sizes, Firefox 1 passed + 4 skipped (download events only), 0 failed, both runs (loads 2.13→2.78 and 2.78→2.22); test 7 green at webkit-390 both times; unit 4/4. The gate's run: export 18 + 6 skipped, walk 4 + 2 skipped.
- [x] E5: the certificate link (D2) and Copy certificate link.
  Evidence (2026-10-04): `still-here-wlr` CODE PASS and items 1-4 flipped, held open on BROWSER PASS. Unit 3/3 (five runs). After E6, two full runs of the link spec in six projects: item 4 green everywhere both times; chromium and chromium-390 6/6 both runs; tests 1-2 missed in Firefox (3 per project per run) and once in WebKit, each because the issuing page pressed at :01 or :02 under the spec's running clock (measured from the failing SVGs). This is C2 test change 4, which this spec now needs too. `/c/#…` is redrawn byte for byte from the link.
  Re-run at `specs-v3` (2026-10-05), against HEAD 2e1da15 served from a private copy, two full runs in six projects at two workers: BROWSER PASS flipped and `still-here-wlr` closed through the gate. The link spec in both runs: chromium and chromium-390 6/6; firefox, firefox-390, webkit and webkit-390 4 passed, 2 skipped (Copy is Chromium only); unit 3/3 both runs; the gate's own run 28 passed, 8 skipped. W2 is played by E6's walk.
- [x] E6: `/c/` and `/verify`: reopening is verifying; the Verify cases in their order (Q7, D3); failure and empty states.
  Evidence: `still-here-xws` closed through the gate; `src/js/judge.js` (one order of judgment), `src/js/verify.js`, `src/js/certificate-page.js`; unit 7/7 twice (item 5's every substitution and swap); verify spec 6/6 in each of six projects and the W2 walk (steps 1-7, step 7 by decodeQr) in Chromium and WebKit at 1440 and 390, both green in two runs (40 passed, 2 skipped each) and again in the gate; `/verify` and bare `/c/` are no longer placeholders; `npm run check:links` 19 pages, 0 broken.
- [x] E7: Your Presence Portfolio.
  Evidence (2026-10-04): `still-here-c29` CODE PASS and items 3-6 flipped, held open on BROWSER PASS and items 1-2. `/portfolio` (`src/js/portfolio.js`) reads the store the ritual writes, unchanged. Unit 4/4 twice. Portfolio spec plus the W3 walk, two runs in six projects: 19 and 20 passed, 2 skipped, 3 and 2 failed. W3 (steps 1-5, step 4 by clearSiteData) passed in Chromium and WebKit at 1440 and 390 both times. Every miss is spec test 1-2's first issue, 'Car keys', landing at 10:52:01 under the spec's running clock (stored SH-00PP-9AHB-518D, expected SH-00PP-9AGV-4P4X): C2 test change 4, which this spec needs too.
  Re-run at `specs-v3` (2026-10-05), against HEAD 2e1da15 served from a private copy, two full runs in six projects at two workers: every identifier now matches with the paused clock. Run 1: spec test 1–2 in WebKit ran out of its 30 s under load (every assertion through the last download had passed), the other five 3/3; run 2: 3/3 in all six. W3 walk green in Chromium and WebKit at both sizes in both runs. Items 1–2 and BROWSER PASS stay unflipped; re-run on a quiet machine before C4. Unit 4/4 both runs.
  Re-run at `specs-v6` (2026-10-06), two runs as for E2: unit 4/4 twice; the W3 walk green in Chromium and WebKit at both sizes both runs; tests 4–5 green everywhere. Test 1–2 green in five projects but ran out of its 30 s in WebKit (1440) in both runs, at the pdf.js render-back screenshot. Items 1–2 and BROWSER PASS stay unflipped.
  Closed (2026-10-06): `still-here-c29` through the gate; items 1–2 and BROWSER PASS flipped. Quiet-machine re-run (2026-10-06), a private snapshot of HEAD 973717a, one worker, load below 3 at the start of each run, two runs in six projects: portfolio and W3 walk 4/4 in Chromium and WebKit at both sizes, Firefox 3 + 1 skipped, 0 failed, both runs (loads 2.92→2.75 and 2.75→2.26); test 1–2 took 19.8 s in WebKit, 17.8–18.6 s at webkit-390; unit 4/4. The gate's first attempt (three workers) ran out of the 30 s once in WebKit at a download; its second: portfolio 18/18, walk 4 + 2 skipped.
- [x] Walks W4.1–2, W1, W2, W3, W8 played by the critic in Chromium and WebKit at 390×844 and 1440×900. Evidence: Phase 2 exit review, 2026-10-04: every step played by hand (W2.7 and W3.4 by their substitutes) in both engines at both sizes, no stuck step; the locked walk specs' remaining reds are C2 test changes 4–5 or measured host clock steps.

#### Bar
Deterministic: the identifier vectors and the exhaustive test; timing and stillness; no tells; QR decode; render-back ≤ 1%; `/FontFile2`; the link and Verify vectors. Then the walks in a browser, with substitutes where `WALKS.md` names them. Then, after C2, the blind pick: the result screen against `exemplars/home-390-golden.png` and `home-1440-golden.png`, the exported PNG against `exemplars/certificate-golden.png`.

#### Budget
No cap (I-07). Expected about 220 orchestrator turns.

#### Exit gate
- [x] E0–E7 closed through the gate (beads waiting only on C2's pick are handled by "Waiting on C2"); W4.1–2, W1, W2, W3, W8 played with no stuck step; critic PASS on each GUI bead. Evidence: E0–E7 closed through the gate (E2, E4, E7 on 2026-10-06 after two quiet-machine runs each); walks played by the critic with no stuck step (Phase 2 review, 2026-10-04); critic PASS on every GUI bead at that review except E3 item 4, since resolved by C2 Decision 6, and E2.14 and E3.7 passed their blind picks (2026-10-05).

#### Result

### Phase 3 — The company website

#### Entry criteria
- [x] E0 and G2 closed (the shell and the record seeds exist). Styling steps **[after C2]**. Evidence: `still-here-lsz` and `still-here-540` closed (2026-10-04); C2 recorded 2026-10-05.

#### Steps
- [x] S2 leadership · S3 research, with the three papers written into `company/research/` · S4 case studies (three pages, the customer named per I-09) · S5 status, with STATUS-002 and STATUS-003 written · S6 careers · S7 enterprise · S8 terms · S9 privacy — copy drafted from `garage/pack/CONTENT_SEEDS.md`, every required statement present, every placeholder replaced.
  - S2 (2026-10-04): `still-here-tul` CODE PASS, BROWSER PASS and items 1-3 flipped; held open on item 4 (after C2, the blind pick). Cards carry each person's id (14da7e0); unit 3/3 (1 skipped, after C2); leadership spec and W4.leadership walk 10 passed, 2 skipped, two runs in six projects.
  - S2 (2026-10-06): `still-here-tul` closed through the gate at `specs-v6`. Item 4 flipped on the critic's blind pick of 2026-10-05 (PASS against `leadership-1440-golden.png`); leadership spec and W4.leadership walk 10 passed, 2 skipped (engine filter) in two runs from a private snapshot of HEAD 3f4803e, and 6 + 4 passed in the gate; unit 3 passed + 1 HUMAN-JUDGED skip twice.
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
- [x] S2–S9 closed through the gate; W4 and W5 played with no stuck step. Evidence: S3–S9 closed 2026-10-04, S2 closed 2026-10-06; Phase 3 exit review (2026-10-05), 316 steps played, no stuck step.

#### Result

### Phase 4 — Extras

#### Entry criteria
- [x] Phase 3 exit gate. Evidence: met 2026-10-06 (S2 closed).

#### Steps
- [x] X1 `presence.json` · X2 `security.txt` and its CI expiry check · X3 the 404 on every server.
  X1, X2 and X3 closed through the gate 2026-10-05 (commit dbaaac8): unit 2/2, 3/3, 1/1 on two runs
  (staging skips); presence spec 6/6 and the 404 spec and walk 16 passed, 2 skipped, on two runs.
- [x] X4 manifest and service worker; everything in Goals 1–3 offline; build N+1 served by the second navigation.
  Built (commit dbaaac8). The unit test passes 4/4. Chromium is green at both sizes on two runs.
  Firefox passes test 3 but not test 4: its service worker still reaches the network under
  `setOffline`. In WebKit every request fails under `setOffline`, so tests 3, 4 and W6.8 fail. With
  the server actually stopped, all three engines open pages and the 404 offline, but until
  2026-10-05 WebKit painted an unseen photograph as an empty box with no description. offline.js
  now lays the description over any photograph that fails, checked by eye with the server stopped
  in WebKit, Chromium and Firefox at 390 and 1440 on /leadership and /enterprise. Held for a test
  change in the next packet. (Jules, 2026-10-05)
  Re-run at `specs-v6` (2026-10-06), a private snapshot of HEAD 3f4803e. Two local runs at two
  workers in six projects with `STAGING_URL` unset, so the helper stops its own server: offline
  tests 3 and 4 green in all six projects both times, and items 3 and 4 are flipped. W6 was green
  in Chromium and WebKit at both sizes in run 1. In run 2 it went red at chromium-390, W6.1 (the
  service worker not ready within 15 s). Unit 4/4 twice. With `STAGING_URL` set, the helper takes
  its staging branch (`context.route` abort): WebKit refuses it and Firefox's service worker goes
  around it, red in both runs. BROWSER PASS is held.
  Closed (2026-10-06): `still-here-dzc` through the gate; BROWSER PASS flipped. Quiet-machine re-run (2026-10-06), a private snapshot of HEAD 973717a, local webServer with `STAGING_URL` unset, one worker, load below 3 at the start of each run, two runs in six projects: offline tests 3–4 and the W6 walk 3/3 in Chromium and WebKit at both sizes, Firefox 2 + 1 skipped, 0 failed, both runs (loads 2.98→1.81 and 1.81→1.95); unit 4/4. The gate's run (local): offline 12/12, walk 4 + 2 skipped. The staging branch above stays a PM decision for L5.
- [x] X5 accessibility across every page (axe, keyboard, focus, live region). Closed 2026-10-05:
  unit 2/2; spec 18/18 in six projects on two runs (axe 0 serious/critical on 19 pages).
- [x] X6 the guards: no external request, no analytics, fragment never sent, CSP holds, page weight, no placeholder left.
  Items 2, 3 and 5 green on two runs, and item 1 in Chromium. Item 1 in WebKit stops at W6.8 (the
  same emulation). Item 4 needs `deploy/` (Phase 6). Its scan also finds scripts.sil.org, inside the
  verbatim OFL texts, and opencollective.com, core-js's funding URL in `package-lock.json`. Held
  for the next packet.
  Closed (2026-10-06): `still-here-xoi` through the gate at `specs-v6`. Unit 3/3 twice in the clean work tree (test 4 reads `git ls-files`); guards spec 10 passed, 2 skipped (the walks are Chromium and WebKit) in two local runs, and again in the gate. With `STAGING_URL` set, test 1 is red in WebKit for the staging-branch reason under X4.
  C2 Decision 7 (2026-10-05, not ticked here): the three failure sentences in `src/js/home.js` and `src/js/result.js` are the packet's words exactly; their "draft, awaiting C2" comments are gone.
- [x] Walk W6 played; the 404 sub-walk of W4 played. W4.404 played in Chromium and WebKit at both
  sizes. W6.1–7 played in Chromium at both sizes (1–2 with the `checkInstallable()` substitute).
  W6.8 in WebKit is held on the emulation item above.
  At `specs-v6` (2026-10-06): W6 played whole in Chromium and WebKit at both sizes by the walk spec
  in local run 1; in run 2 W6.1 went red at chromium-390 (see X4).
  Quiet-machine re-run (2026-10-06): W6 played whole by the walk spec in Chromium and WebKit at 390 and 1440 in both local runs and in the gate, no stuck step (see X4).

#### Bar
Deterministic: each X bead's specs, axe at zero serious or critical, the weight budget, the network log. Then W6 in Chromium (installability with its substitute) and the offline steps in WebKit.

#### Budget
No cap (I-07). Expected about 100 orchestrator turns.

#### Exit gate
- [x] X1–X6 closed through the gate; W6 played with no stuck step.
  Evidence: X1, X2, X3, X5 closed 2026-10-05; X6 and X4 closed 2026-10-06; W6 as above.

#### Result

### Phase 5 — The records in full

#### Entry criteria
- [x] G2, E1, S3 and S5 closed (identifiers are checked with the shipped module; the papers and status updates exist). Evidence: `bd show` reads closed for still-here-540, still-here-yw2, still-here-3yo and still-here-z4r (2026-10-05).

#### Steps
- [x] RC1 correspondence, chat, notes and calendar in full · RC2 the inventory (YAML and Bev's XML) · RC3 status records (internal notes; the public updates cross-checked) · RC4 the gum graph as an OKF bundle · RC5 the papers checked as records.
  Evidence: RC1 closed — every mail with Message-ID, subject and threading, SUPPORT-001's attachment header, CAL-001's invite history; `tests/unit/still-here-7i1-correspondence.test.ts` 5/5; continuity 0. RC2 closed — `company/inventory/schema.json`, every row citing record ids, Bev's SpreadsheetML `HERE_FINAL_2008_USE_THIS_ONE.xml` with the same five ids and statuses; `tests/unit/still-here-8je-inventory.test.ts` 4/4. RC3 closed — the 11:50 floor counts for the week in `company/status/notes.xml` with `notes.xsd`, Tuesday's floor three 0 amended to 1 on reflection; STATUS-001–003 checked against their sources; `tests/unit/still-here-1t0-status-records.test.ts` 3/3. RC4 closed — `company/gum-graph/` as 28 concepts (7 people, 4 observations, 2 borrowings, 1 reimbursement, 12 access requests, 2 claims); OKF validator `--strict` conformant; `tests/unit/still-here-17d-gum-graph.test.ts` 4/4. RC5 closed — every footnote resolves, §3 present, Six Feet's times and distance are QA-001's and sh-051's; `tests/unit/still-here-zhf-papers.test.ts` 3/3 (its distance pattern is overbroad, a C3 packet item).
- [x] RC6 the continuity and identifier checks in CI across `company/` and `site/`. Evidence: `scripts/identifier-check.mjs` (imports `src/js/identifier.js`) and `.github/workflows/records.yml`, commit c8852b8; Actions run 37302871955 green: continuity 0 over `company/` and `site/`, identifiers 8 found, 8 recompute; `tests/unit/still-here-62x-continuity.test.ts` 7/7.
- [x] RC7 the C3 packet: every HUMAN-JUDGED line, records and site copy, laid out for a table read in reading order, with the record ids, pages and locked test files each line lives in.
  Evidence: closed. `docs/checkpoints/c3-packet.md` (16 PRD items placed, 57 company records and all 19 page copy sources under `src/content/` linked, 64 locked strings with the files that hold them, the testimonials and `s07` calls). Item 2 was a product item: every page's copy (title, description, everything in `<main>`) moved verbatim to `src/content/`, and `scripts/build.mjs` assembles each page from its template, its copy and the shell; `site/` built before and after is byte-identical (build id 11de8e1e97e74102 both times; only security.txt's clock-set Expires differs). `tests/unit/still-here-esz-c3-packet.test.ts` 3/3; S2–S9, E0 and DS5 specs 92/92 in Chromium and WebKit.
- [x] RC8 `README.md` and `company/README.md`; walk W9 played on the local checkout.
  Evidence: closed. Item 1 was a product item: `package.json` has `test` and `e2e` (`test:unit` and `test:e2e` kept as aliases), and the README says `npm test` and `npm run e2e`. `tests/unit/still-here-382-readme.test.ts` 4/4; `e2e/specs/still-here-382-walk.spec.ts` (W9 on the rendered Markdown) 2/2 in Chromium and WebKit, twice.

#### Bar
Deterministic: schema validation of every format; YAML and XML inventories round-trip to the same set; the OKF validator in strict mode; every cited id resolves; every identifier recomputes, at least the two named; the continuity assertions. Voice is never looped on (§3b rule 6): one authoring pass per record set, then C3.

#### Budget
No cap (I-07). Expected about 150 orchestrator turns.

#### Exit gate
- [x] RC1–RC8 closed through the gate; W9 played locally; the C3 packet is out. Evidence: `bd show` reads closed for RC1–RC8; W9 2/2 in Chromium and WebKit; `docs/checkpoints/c3-packet.md`.

#### Result

### Phase 6 — vandalwayind.com, built and served internally

#### Entry criteria
- [x] DS6 closed. Styling past the candidate waits on C2's verdict on the 1997 page. Evidence: `still-here-azk` closed (2026-10-04); C2 approved the 1997 golden 2026-10-05.

#### Steps
- [x] V1: the page finished per R42 and the C2 red-pen; the guestbook page; all period assets. Page, guestbook and period assets done (DS6 unit 4/4, V1 unit 3/3 + item 4 HUMAN-JUDGED, `still-here-bdd-vandalway.spec.ts` 2/2 Chromium and WebKit, two runs). The counter is now `/counter.gif`, drawn by `deploy/counter/count.mjs`. The menu's E-Mail is the page's one `mailto:`. The C2 red-pen is still to come.
  After the blind picks (`specs-v6`, 2026-10-06): the menu's E-Mail goes to `#email`, and the address is the page's one `mailto:` link, to webmaster@vandalwayind.com, as in the golden. Put on the internal copy by the undo and the install (`deploy/deploy-log.md` runs 16 and 17); the served page is the repository's apart from its counting date. V1 unit 3 passed + 1 HUMAN-JUDGED skip twice; the bdd spec green in Chromium and WebKit at both sizes in two runs. Item 4 waits on the critic's fresh blind pick.
  Closed (2026-10-06): `still-here-bdd` through the gate on the critic's fresh blind pick against `exemplars/vandalway-1997-golden.png`, PASS for the repository copy and the internal copy (only the counter line differs, approved); commit 89c41f1.
- [x] V2: `deploy/vandalwayind-install.sh` and its undo: files under `/srv/vandalwayind/`; a Caddy site bound to localhost; a new internal-network HTTPS port of its own (I-11); Caddyfile backed up, `caddy validate` before reload, no other site block changed; undo run once, install re-run. Done 2026-10-05: Install, undo and re-install, with the undo run six times, each back to the backup's sha256 (`deploy/deploy-log.md`, 13 runs). Ten other site blocks and the internal network's other routes byte-identical in every run. Site on loopback plus a socket; the internal network's new HTTPS port proxies to the socket, because a port target keeps the visitor's host name and a localhost site answers it with an empty 200.
  Phase 6's deferred counter fixes (2026-10-05, not ticked here), put on the server by the scripts at 22:49 UTC: the undo (back to the backup's sha256) then the install (`deploy/deploy-log.md` runs 14 and 15). `caddy validate` passed before each reload; all 11 other blocks byte-identical; the ten other sites answered after as before; the network's other routes hashed the same.
  The page's e-mail links (2026-10-06, 03:43 UTC): the undo (back to the backup's sha256) then the install, runs 16 and 17, with the same checks, all passing. At `specs-v6`: V2 unit 3/3 twice (CODE PASS flipped; every box now flipped); the internal spec 6/6 in run 2 and 5/6 in run 1 (Chromium `ERR_NETWORK_CHANGED`, a workstation network change). Not closed.
  Closed (2026-10-06): `still-here-d7l` through the gate. Quiet-machine re-run (2026-10-06), a private snapshot of HEAD 973717a, `VANDALWAY_INTERNAL_URL` set, one worker, load below 3 at the start of each run, two runs in six projects: the internal spec 1/1 in each project, 6 passed, 0 skipped, 0 failed, both runs (loads 2.84→2.60 and 2.60→2.57); unit 3/3, 0 skipped, twice. The gate's run: 6/6, 0 skipped.
- [x] V3: the counter: this site's own access log (JSON, seven-day retention), a running-total file, the page and image sent `no-cache`, a ten-minute systemd timer, the digit image, Node installed if absent — all by the V2 scripts. Unit 5/5 and the counter spec green twice, 0 skipped; by hand, n=0 then 000026 within four minutes of the third load (2026-10-05).
  Deferred fixes (2026-10-05, not ticked here): `count.mjs` skips leading NUL bytes before reading a line's JSON (the emptied log regains a NUL prefix at Caddy's next write; seen on the server); the install writes its counting start date into the served page, which now reads "times since October 5, 2026." with `Last-Modified` 1997-08-22. Counter spec green in Chromium and Chromium-390 with VANDALWAY_INTERNAL_URL set.
- [x] V4: `Last-Modified` per file (1997 page, 1999 guestbook, counter's own time), POST refused, quirks mode on the served copy, HTTP→HTTPS ready for Phase 8. Served headers, 405 and quirks mode done (V4 unit 4/4 twice; W7.1 in both engines). HTTP→HTTPS belongs to Phase 8's public block.
  Re-run after the redeploy (2026-10-05): V1 and V2 specs green in every engine they run in; W7 fails only step 3 (`queryMx ENODATA`, waits on L3) in Chromium, WebKit and both at 390. Skips are the specs' engine limits only.
  After L3's null MX (2026-10-06), three runs of the W7 walk: W7.3 passed in every project that reached it. Run 1, 4 passed and 2 Firefox skips (engine limit). Runs 2 and 3, in Chromium and WebKit at both sizes: 3 passed and 1 failed each, at W7.2's reload with `ERR_NETWORK_CHANGED` (a workstation network change, Chromium only, once at each size). WebKit was green in all three. Not closed: the walk is not yet green twice in a row in all four projects.
- [x] Walk W7 played on the internal copy. Steps 1, 2, 4 and 5 played, by hand and by the spec, in Chromium and WebKit. Step 3 was stuck until L3 wrote the null MX (2026-10-06); it now passes (played (substitute), `checkNullMx()`). At `specs-v6` (2026-10-06): the same, in Chromium, WebKit and both at 390, both runs; V4 unit 4/4 twice.
  Closed (2026-10-06): `still-here-aqv` through the gate at `specs-v8`. The W7 spec 4 passed in Chromium and WebKit at 1440 and 390, twice in a row (15.4 and 20.4 minutes) and a third time in the gate (19.7 minutes); the two skips per run are Firefox, outside the walk's engines. Unit 4/4, 0 skipped. The critic's fresh review played W7 by hand in both engines at both sizes: steps 1, 2, 4 and 5 played, step 3 played (substitute) with the MX `0 .` at both public resolvers; the counter rose from 643 to 665 within 628 seconds of three loads; every header as V4 says; POST, PUT and DELETE refused. V4 PASS. The real send that bounces is phone checklist item 9.

#### Bar
Deterministic: the markup checks; the served headers; the counter showing at least n+3 within eleven minutes of three loads; `caddy validate`; the undo-then-install round trip. Then W7. Then the blind pick against `exemplars/vandalway-1997-golden.png`; "reads as found, not as parody" is HUMAN-JUDGED at C2 and C3.

#### Budget
No cap (I-07). Expected about 80 orchestrator turns.

#### Exit gate
- [x] V1–V4 closed through the gate; W7 played on the internal copy with no stuck step. Evidence (2026-10-06): V1 `still-here-bdd`, V2 `still-here-d7l`, V3 `still-here-6t3`, V4 `still-here-aqv` closed; the exit review approved with follow-ups (below).

#### Result

Done 2026-10-06. vandalwayind.com is served on the internal network from the production server by `deploy/` scripts with an undo, its counter counts real loads, and W7 plays end to end. The exit review found one regression outside the phase: `scripts/gifs/strip-gif-apps.mjs` (L4's GIF fix, 16829da) tripped X6's host guard with a template string; fixed the same hour and the guard is green. Also from the review: the null-MX checks now run against the public resolvers WALKS names (the uncommitted environment), and a test server left running on port 5320 from an earlier run was stopped. The internal copy still serves the GIFs with ImageMagick's block, pixels the same; the stripped files ship at N2 (Clive, 2026-10-06).

### Phase 7 — Staging and the launch packet

#### Entry criteria
- [x] Phases 2, 3, 4, 5 and 6 at their exit gates (or `held` awaiting C2 with C2 since recorded); every bead filed from C3's red-pens closed. Evidence (2026-10-06): Phases 1–5 done; Phase 6 held only on V4's W7.3, which needs the null MX that L3 writes in this phase (recorded as a sequencing call: Phase 6's last item depends on Phase 7). C2 recorded; the one bead C3 filed (still-here-txf) closed.

#### Steps
- [x] L1: staging for isitstillhere by `deploy/staging-install.sh` and its undo: Caddy on localhost with Pages-equivalent rules and the `presence.json` header, a new internal-network HTTPS port of its own (I-11); rsync of `site/`; `/build.txt` check; research 3's URL table on staging.
  Closed (2026-10-06): `still-here-xg9` through the gate. Install, undo (back to the backup's sha256), install re-run (`deploy/deploy-log.md` § Phase 7 staging, runs 1–3): `caddy validate` passed, 12 other blocks byte-identical, the other sites answered as before, the other routes hashed the same; then `--update` to the build of 7f198d9. The staging spec 18 passed, 0 skipped, twice (six projects); unit 7/7, 0 skipped, twice, with `STAGING_URL` and a copy of staging's one-day log after W2. The staging address is in `.env.staging` only.
- [x] L2: `.github/workflows/pages.yml` (Actions from `site/` only, pinned versions, `include-hidden-files: true`, skipped while private, no `schedule:`) and `.github/workflows/security-txt-reminder.yml` (weekly; opens an issue, nothing else).
  Closed (2026-10-06): `still-here-6m0` through the gate. The reminder's dry run with a fabricated near date (run 37426838369): opened and closed issue #1 "Renew security.txt". The Pages job reads "skipped" on `main` while private. Unit 4/4, 0 skipped, twice. Pages' real deploy is N1's, after the public switch.
- [x] L3: zone snapshots of both domains; validation dry run; then null MX, SPF and DMARC on both, and the Pages verification TXT once Clive has handed its value over. Nothing else changes.
  Written (2026-10-06, `deploy/deploy-log.md` § L3): a snapshot of each zone (ids in the log), the dry run passed, `MX 0 .`, `v=spf1 -all` and `_dmarc` `v=DMARC1; p=reject` appended on both; read back, every other record unchanged; the Pages TXT present and equal to the value handed over; both public resolvers answer all of it. Items 1–3 flipped (unit 3/4, 0 skipped, twice). Not closed: test 4's wildcard probe uses an ANY query, which both domains' name servers answer with RFC 8482's HINFO, so no resolver can return "not found". The zone has no wildcard (A, TXT and CNAME probes: not found). The probe's change goes to the next packet.
  Closed (2026-10-06): `still-here-5v0` through the gate. Clive approved the probe change ahead of C4 (A, TXT and CNAME, each "not found"; `specs-v8`, 8ec9a6f, recorded in `CHECKPOINTS.md`). Unit 4/4, 0 skipped, twice.
- [x] L4: the release scan: PII gate at the public tier over the tree and the whole history; every author and committer email; PNG metadata on `site/`; the names grep.
  Run (2026-10-06), twice: the tree and every blob in the history pass the gate at the public tier; the public denylist finds nothing; `site/` images are clean. Items 1, 2 and 5 flipped (unit 3/5, 0 skipped, twice). Open on two: item 3, commit 38c10f5's in-story author (approved by Clive, a test change for C4); item 4, four GIFs in `vandalwayind/images/` carry ImageMagick's application block. The pack's paths outside the repository are reworded here, in `CRITIC_RUBRIC.md` and in `ENV_PREFLIGHT.md`; `ACCEPTANCE.md` (G0 item 9, G1 item 5, L4 item 1) and the gate hook's default wait for a decision.
  Closed (2026-10-06): `still-here-48f` through the gate. Item 4: `scripts/gifs/strip-gif-apps.mjs` takes ImageMagick's block out of the four GIFs, pixels, frames and delays unchanged (16829da), and `make-1997.sh` runs it. Item 3 and the paths: Clive approved, ahead of C4, the one exception for 38c10f5 by its full sha, and tools found through the uncommitted `.env.local` instead of paths (`ACCEPTANCE.md` G0 item 9, G1 item 5 and L4 item 1 reworded, beads re-synced; `specs-v8`). Unit 5/5, 0 skipped, twice.
- [ ] L5: W1–W9 on staging; the phone checklist printed for Clive; the C4 packet.
  Run (2026-10-06): the C4 packet is out (`docs/checkpoints/c4-packet.md`, unit 3/3 twice), with the phone checklist to print, the critic reports, 40 screenshots of staging and every call since C3. W1–W9 on staging (the build of 7f198d9; `src/` unchanged since): the spec 19 passed, 12 skipped (Firefox, by design) and 5 red in each of two runs; every red step played by hand on staging and works (packet § 2). The reds are the locked walk helpers' on a networked server; their change is C4 question 9. W7 credited from V4's walks (Clive, 2026-10-06). CODE PASS and items 2–3 flipped; open on item 1 and BROWSER PASS.

#### Bar
Deterministic: staging specs; the URL table; DNS read-back equals the intended records and the snapshot holds everything else unchanged; the release scan clean. Then W1–W9 on staging. The phone test is Clive's (HUMAN-JUDGED, C4).

#### Budget
No cap (I-07). Expected about 100 orchestrator turns.

#### Exit gate
- [ ] L1–L5 closed through the gate; the C4 packet is out. (2026-10-06: L1–L4 closed; the C4 packet is out; L5 open on C4 question 9.)

#### Result

Held at C4 (2026-10-06). Staging is up on the internal network and walked; DNS, the workflows and the release scan are done; the C4 packet is with Clive. Clive lowered the bar for the rest of the launch (one green run, no repeat critic where the gate replayed a walk, a short packet; `CHECKPOINTS.md`). The run waits on his phone checklist, his answers to the packet's § 6 and the public switch.

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
  - [x] Phase 4 (X6): the three failure sentences in the C2 packet's addendum, decision 7, once Clive
    red-pens them: the stuck running state when the certificate drawing cannot load
    (`src/js/home.js`), the false "could not locate" when a valid link cannot be drawn
    (`src/js/certificate-page.js`), and the "Kept…" line when storage is refused (`src/js/home.js`).
    Found at the Phase 2 review. The three paths are built with the drafted sentences (commit
    dbaaac8): the box comes back empty and focused, `/c/` says the link is still valid, and the
    not-kept line replaces "Kept…". The wording still waits on Clive's red-pen at C2. Approved as drafted at C2 (Decision 7, `CHECKPOINTS.md` § Record).
  - [x] Next packet (X4, X6): offline in WebKit and Firefox emulated by stopping or blocking the
    server rather than `context.setOffline`; X6 item 4 to allow the licence texts' and the
    lockfile's funding hosts (or cite them), its `deploy/` precondition met at Phase 6. Found at
    the Phase 4 build, 2026-10-05. Applied at `specs-v4` (C2's test bundle); X4 and X6 closed.
  - [ ] Next packet (RC5): RC5's distance pattern matches any word ending in "m" or "ft". Listed in
    `docs/checkpoints/c3-packet.md` § 7. Found at the Phase 5 build, 2026-10-05. RC7's and RC8's
    entries here were product items, not test items, and closed with their beads (2026-10-05).
  - [x] Next packet (V2): `tests/unit/still-here-d7l-caddy-config.test.ts` test 1's address filter
    lists directives but not `output`, so the access log's nested `output file <path> {` line reads
    as a site address. V3 test 1 requires that block (`roll_keep_for 168h` has no other Caddyfile
    form), so no valid snippet passes both. Proposed: add `output` to the filter. Found at the
    Phase 6 build, 2026-10-05. Applied at `specs-v4`; V2 closed.
  - [x] Phase 7 (L3): the null MX for vandalwayind.com, which W7.3 (V4's walk) checks on the
    internal copy. Found at the Phase 6 build, 2026-10-05. Written with L3; V4 closed 2026-10-06.
  - [x] Phase 7 (X6): `scripts/gifs/strip-gif-apps.mjs`'s main-module check was a `file://` template
    string, which X6's host guard reads as a host. Found by Phase 6's exit review, 2026-10-06; the
    check now compares paths (`fileURLToPath`), and X6's unit test is 3/3.
  - [ ] Phases 7 and 8 (L1, N2): Caddy 2.6.2 keeps a removed site's log file open across reloads.
    A `deploy/` undo for a logged site empties its log rather than deleting it, as
    `deploy/vandalwayind-uninstall.sh` does. Found at the Phase 6 build, 2026-10-05.

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
- 2026-10-05 — Phase 5 built: RC1–RC6 closed (the records in full, the records check in CI); the C3 packet out; RC7 and RC8 held on test items for the next packet; Phase 4 and Phase 5 held, Phase 6 active. (Jules, 2026-10-05)
- 2026-10-05 — RC7 and RC8 closed: they were product items, not test items. The pages' copy moved to `src/content/` with the built site unchanged, and `package.json` gained `test` and `e2e`. Phase 5's exit gate met; C3's table read is next. (Jules, 2026-10-05)
- 2026-10-05 — Phase 6 built and served internally: V3 closed; V1 waits on C2; V2 on a test item for the next packet; V4 on L3's null MX (W7.3). (Jules, 2026-10-05)
- 2026-10-05 — Phase 6 held after the critic's review (server matches the deploy log hash for hash; V2's test conflict confirmed); V2's step unticked (the bead is open). The run waits on C2 and C3 for Phase 7's entry. (Jules, 2026-10-05)
- 2026-10-06 — Re-run at specs-v6 after the internal copy's redeploy: DS1, E3, S2 and X6 closed; Phases 1 and 3 done; Phases 2, 4 and 6 held on E2's gate run, E4 test 7, E7 in WebKit, X4's W6, V1's re-pick, V2's network red and V4's null MX; Phase 7 active, entry not yet met. (Jules, 2026-10-06)
- 2026-10-06 — Quiet-machine re-run (one worker, load below 3): E2, E4, E7, X4 and V2 closed through the gate; V1 closed on its blind pick; Phase 4 done; Phase 2 to its exit review; Phase 6 held on V4 alone. (Jules, 2026-10-06)
- 2026-10-06 — Phase 2 done (critic review plus blind picks plus quiet-machine closes); Phase 7 entered. Phase 6's V4 waits on L3's null MX, so it follows L3 rather than preceding Phase 7. (Jules, 2026-10-06)
- 2026-10-06 — Phase 7: L1 (staging) and L2 closed; L3's DNS written, held on its ANY probe; L4 run, held on items 3 and 4; V4's W7.3 green, V4 held on a twice-green walk. (Jules, 2026-10-06)
- 2026-10-06 — Phase 6 done (V4 closed, W7 played by hand by the critic); L3 and L4 closed at `specs-v8`; X6's guard regression from the GIF script fixed; the found list brought up to date. (Jules, 2026-10-06)
- 2026-10-06 — Phase 7 held at C4: the packet is out; W1–W9 walked on staging, red steps played by hand; Clive lowered the bar for the rest of the launch. (Jules, 2026-10-06)
