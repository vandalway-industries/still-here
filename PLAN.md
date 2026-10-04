---
updated: 2026-10-04
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
| 2 | The shell, the ritual and the certificate | active | E0–E7 closed; W1 W2 W3 W8 and W4.1–2 played |
| 3 | The company website | pending | S2–S9 closed; W4 W5 played |
| 4 | Extras | pending | X1–X6 closed; W6 played |
| 5 | The records in full | pending | RC1–RC8 closed; W9 played locally; C3 packet out |
| 6 | vandalwayind.com (internal) | pending | V1–V4 closed; W7 played internally |
| 7 | Staging and the launch packet | pending | L1–L5 closed; C4 packet out |
| 8 | Launch | pending | N1–N3 closed; W-DoD on production |

## Active phase

**Phase 2 — The shell, the ritual and the certificate.** Phase 1 is held awaiting C2: DS2–DS7
closed and the C2 packet is out; DS1 waits on two C2 items (Greek in the certificate face, and the
linter-output test change). E0 (the shell) and E1 (the identifier) are closed. E2 (the ritual) is built and blocked on C2: item 10's locked test lets the page clock run from its install, so the press can land in the next second and fake time can pass 3.5 s before the stored-count check (a re-tag item for the next packet); W1.5 and W8.2 time with the test machine's own clock, which steps back about 1.17 s every 31 s here, and they fail only inside those steps. Item 14 waits on C2. Work that needs Greek in the certificate face
waits on C2's Decision 1.

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
- [ ] E3: the certificate per issue: name layout, time zone (D4), the UTC line, QR code with the link. **[after C2]** matched to the certificate golden.
- [ ] E4: PDF and PNG exports, fonts embedded, name blocks outside the face, filenames, progress and failure, render-back.
- [ ] E5: the certificate link (D2) and Copy certificate link.
- [ ] E6: `/c/` and `/verify`: reopening is verifying; the Verify cases in their order (Q7, D3); failure and empty states.
- [ ] E7: Your Presence Portfolio.
- [ ] Walks W4.1–2, W1, W2, W3, W8 played by the critic in Chromium and WebKit at 390×844 and 1440×900.

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
- [ ] Walks W4 (with each page's sub-walk) and W5 played by the critic.

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
- [ ] X1 `presence.json` · X2 `security.txt` and its CI expiry check · X3 the 404 on every server.
- [ ] X4 manifest and service worker; everything in Goals 1–3 offline; build N+1 served by the second navigation.
- [ ] X5 accessibility across every page (axe, keyboard, focus, live region).
- [ ] X6 the guards: no external request, no analytics, fragment never sent, CSP holds, page weight, no placeholder left.
- [ ] Walk W6 played; the 404 sub-walk of W4 played.

#### Bar
Deterministic: each X bead's specs, axe at zero serious or critical, the weight budget, the network log. Then W6 in Chromium (installability with its substitute) and the offline steps in WebKit.

#### Budget
No cap (I-07). Expected about 100 orchestrator turns.

#### Exit gate
- [ ] X1–X6 closed through the gate; W6 played with no stuck step.

#### Result

### Phase 5 — The records in full

#### Entry criteria
- [ ] G2, E1, S3 and S5 closed (identifiers are checked with the shipped module; the papers and status updates exist).

#### Steps
- [ ] RC1 correspondence, chat, notes and calendar in full · RC2 the inventory (YAML and Bev's XML) · RC3 status records (internal notes; the public updates cross-checked) · RC4 the gum graph as an OKF bundle · RC5 the papers checked as records.
- [ ] RC6 the continuity and identifier checks in CI across `company/` and `site/`.
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
  - [ ] Phase 4 (X6, the guards): `npm run build` regenerates the certificate's signature paths (today
  `scripts/certificate-glyphs.mjs` is run by hand; its output is byte-identical), and the
  `tokens.css` header comment written by `scripts/tokens.mjs` names every generated colour source
  (`src/brand/mark.svg` and `src/favicon.svg` carry the green too). Found at the Phase 1 critic
  review.

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
