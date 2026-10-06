---
updated: 2026-10-03
read_by: /goal (the run passes through these and stops only where a phase's entry criteria name the decision); Clive, to know when he is needed and what he will be handed; the critic, for which goldens are approved and when
relations:
  derived_from: ../BRAINSTORM.md
---

# Checkpoint schedule (I-06)

Four checkpoints, as Clive set them. A checkpoint is a packet handed to Clive at a scheduled
moment. The run produces the packet and carries on with every bead that does not depend on the
answer. Approvals and red-pens are recorded in **Record** below, with the date and Clive's words,
the same day they are given. (Jules, 2026-10-03)

| # | When | Packet | Clive decides | What waits for it |
|---|---|---|---|---|
| **C1 — pack sign-off** | before Phase 0 | `PRD.md` with the kept / changed / dropped diff at the top; `PLAN.md`; this pack; the list of D1–D22 and I-01–I-12 as recorded; `BLIND_READ.md` with its dispositions | go, or red-pen; each call in the PRD diff, item 8; the run's turn ceiling (1,400 proposed). He also hands over the brand dossier's location and `continuity-hashes.json` (`CONTENT_SEEDS.md` § Continuity fixture) | Phase 0 |
| **C2 — goldens** | end of Phase 1 (`docs/checkpoints/c2-packet.md`) | candidates in `exemplars/candidates/`: `certificate.png` and `.pdf` (Folding chair, 2026-10-03T10:52:00Z, America/Chicago); `home-390.png`, `home-1440.png`; `leadership-1440.png`; `vandalway-1997.png` | approve or red-pen each. Questions put to him: Is it trustworthy and expensive? Is the certificate's top language right, and whose signatures? Do the examples read right as shown? Does the 1997 page read as found? (The check symbol is settled, I-12, and not asked.) | the **[after C2]** styling steps of Phases 2 and 3, V1's finish, and every critic blind pick |
| **C3 — the table read** | end of Phase 5 (`docs/checkpoints/c3-packet.md`) | every authored line in reading order: records (correspondence, chat, notes, status, inventory, gum graph, papers) and site copy (leadership, research, case studies, status, careers, Enterprise, Terms, Privacy, 404, the 1997 prose and relocation line), each with where it lives; the calls C3 owns (the testimonials, photograph placement including `s07`); for each locked string, the test file that holds it | red-pen any line; overrule any call | Phase 7: every bead filed from a C3 red-pen closes before L1 starts; the run continues meanwhile |
| **C4 — launch** | end of Phase 7 (`docs/checkpoints/c4-packet.md`) | ordered commits; pass/fail per bead; critic reports with their walks marked "played"; screenshots of every page on staging; the release scan; the phone checklist to print (the phone must be on the internal network); turns used per phase; every call made under a rule since C3 | run the phone checklist (`WALKS.md`); sign off; then make the repository public — the switch | Phase 8 |

Standing rule, not a checkpoint: after any run that went overnight, the morning look is
`SESSION_STATUS.md`'s top block and the last critic report. Nothing is needed unless something is red.

A phase that cannot pass its exit gate under the stuck rule (`PLAN.md` § Build method) lands in the
next packet as a decision with its evidence. It is never retried silently.

**Red-pens on locked strings.** When Clive red-pens, at C2 or C3, a string a locked test holds, his
red-pen is the approval of that test change. A separate test-author session applies exactly the
red-pen to the tests, re-tags (`specs-v2`, then `specs-v3`), and records the tag, the strings and
his words below. No builder edits a locked test.

**Waiting on C2.** Beads whose only open box is "(after C2)" wait open; their phase may be set
`held` (`PLAN.md` § Build method). When C2 is recorded, the critic runs the waiting blind picks the
same session.

## Goldens

Approved goldens are copied from `exemplars/candidates/` to `exemplars/` under these names, and are
replaced only by Clive's word, recorded below: `certificate-golden.png`, `home-390-golden.png`,
`home-1440-golden.png`, `leadership-1440-golden.png`, `vandalway-1997-golden.png`.

## Record

After launch, the production phone re-check (`WALKS.md` § Phone checklist) is recorded here too.

- **C1 — signed 2026-10-03** (I-13). Clive approved the pack as written, including the 21 calls in
  the PRD diff, item 8. The run's ceiling is 1,400 orchestrator turns. The phone checklist stands as
  written (eight steps on staging, four re-checked on production). The brand dossier's location and
  the continuity fixture were handed over to the run; neither location is written into this
  repository. Phase 0 is clear to start. (Jules, 2026-10-03)
- **Re-tag specs-v2 — 2026-10-04**, before any builder ran. The Phase 0 gate review mapped every
  acceptance item to the tests and found eighteen held too loosely; the tests were tightened and
  re-tagged, and `.bd-gate` now locks at `specs-v2`. No acceptance text changed. The items: DS3.2
  and L4.4 (content credentials in any image format); DS4.5 (signatures converted at build time
  from an OFL script face never shipped, no other face requested, the ring text graphite); DS4.6
  (the candidate PNG's QR code is Folding chair's); DS7.1 (the C2 questions under each candidate);
  E2.10 (nothing stored during the sequence); E3.4 (a name drawn as an image held to the same
  lines, size and completeness); S3.2 (each paper's date and whole abstract on the listing); S5.2
  ("All systems operational" first); X4.3 (copying offline); X4.4 (an unseen image shows its alt
  text); X5.2 (the Tab walk now in WebKit too); X6.1 (the whole of W1–W6 replayed); V2.1–2 (the
  server's own hashes before and after, the backup and the undo); V3.2 (counter.gif drawn as digit
  cells; Cache-Control on the image); L3.3 (the challenge value compared, or the check skipped
  with its reason); N1.3 (deployment to served within 15 minutes, from GitHub's record); N2.3
  (the go-live reset recorded and the counter dated by it). G0's and G1's checks of `.bd-gate` now
  accept a re-tag recorded here. For Clive's sight in the C2 packet. (Jules, 2026-10-04)
- **C2, test change 4 approved — 2026-10-04**, ahead of the rest of the packet. Clive's red-pen on
  the paused clock: "Approve test change 4 now." The timed specs start their fake clock ten seconds
  early, load and type, pause at the intended second, then press. Applied by a separate test-author
  session to exactly the specs and helpers the packet names (E2 items 9 and 10, E3 tests 2 and 5–6,
  E4 item 1 and its unit test's `issued()`, E5's link spec tests 1–2, E7's portfolio `three()`, and
  the shared `issue()` helper), then re-tagged `specs-v3`. No acceptance text changed. The rest of
  C2 still waits on the full packet. (Jules, 2026-10-04)
- **Commit 38c10f5's author — 2026-10-05.** One commit (S7, the Enterprise page) was made with the
  author address `jules@vandalway.example` instead of the account's no-reply address; the committer
  is the account's own. Clive: "that's ok". History is not rewritten. G0's identity check (test 4)
  and the L4 release scan's author check will name this one commit; the exception goes into the C4
  packet as a test change for his red-pen. Builders now set character addresses on bead commands
  only. (Jules, 2026-10-05)
- **C2 — answered 2026-10-05.** Clive, on the packet and its addendum:
  - Goldens approved: the certificate (Folding chair), home at 1440 and 390, leadership at 1440,
    and the 1997 page. Copied to `exemplars/` under their golden names. On the certificate: "it
    looks great"; the line "Jurisdiction of here: <zone>" stays as specified (the issuing device's
    own time zone, D4). The certificate golden is rendered again once the guilloche change below
    is made, for his sight.
  - Red-pens: on home, the band's "It has moved. It is still here." becomes "Every Friday, it is
    still here." On leadership, Lucas's card reads "Lucas" with "Intern" beneath it, not "Lucas the
    Intern" (Decision 2).
  - Decision 1, Greek: a name in a script the certificate face lacks is drawn as an image, as
    emoji and Chinese names are; DS1 item 4 is reworded to say so; no second face ships.
  - Decision 3: the hero crop box is the build's (1044,110)-(1656,875); the manifest follows.
  - Decision 4: E4 item 3's ink check is measured on the text blocks only; the bar stays above 20%.
  - Decision 5: the guilloche thickens from 0.45 to 0.7 units.
  - Decision 6: long names step down in size to fit at most three lines in the name zone; the fixed
    lines never move.
  - Decision 7: the three failure sentences approved as drafted.
  - Test changes: the verified bundle approved (DS1's linter reads JSON; G0 accepts found-work
    beads that name their source and the one accepted commit author; walks timed in the page;
    render-back cropped, not squeezed; the Hebrew comparison at twice the scale; the QR decoded from
    the downloaded files; offline emulated by stopping the server; the alt-text check asserts the
    description is painted; X6 item 4 waits for `deploy/` and allows the licence-text and lockfile
    hosts; V2's address filter learns `output`), with the red-pens above. Applied by a separate
    test-author session and re-tagged `specs-v4`. (Jules, 2026-10-05)
- **C3 — answered 2026-10-05.** Clive, on the table read (`docs/checkpoints/c3-packet.md`): every
  authored line approved as written (records and site copy). Both Enterprise testimonials stay. The
  paper and case-study slugs, the ten examples, the relocation line, the portrait crops and the alt
  texts stand as drafted. `s07`, the second-floor printer, is placed on `/careers` beside "Your
  equipment"; that placement is the one bead filed from C3, and it closes before L1. (Jules, 2026-10-05)
- **Re-tag specs-v4 — 2026-10-05**, applying C2's approved test bundle and red-pens exactly (tag on
  da0e241; `.bd-gate` locks there). `ACCEPTANCE.md` DS1 item 4 (Greek drawn as an image) and E4 item
  3 (ink measured on the text blocks) reworded per C2 Decisions 1 and 4, their beads re-synced. Noted
  for the C4 packet: X4 item 3 still names `context.setOffline(true)`, which its test no longer uses.
  (Jules, 2026-10-05)
- **C2 follow-ups — 2026-10-05.** Clive, after the first build of Decision 6 and the placing of
  `s07`: (1) the "THUMPER" sticker on the printer in `s07` is there on purpose ("#easteregg"); it is
  not retouched, `s07` stays on `/careers`, and the release scan treats the sticker as approved. (2)
  Names drawn as images (scripts the face lacks) may step down to an ink floor of about 24 units so
  that the longest fit three lines; text names keep the 30-unit floor; the fixed lines never move.
  (Jules, 2026-10-05)
- **Re-tag specs-v5 — 2026-10-05.** Clive approved a narrow change to T0
  (`tests/unit/still-here-64t-specs.test.ts`): its baseline check skips rows in a new "Filed from
  checkpoints" table of `docs/bead-map.md`, so a bead filed after Phase 0 (beginning with
  `still-here-txf`, `s07` on careers, from C3) can carry its own tests. Nothing else in T0 changes.
  Applied by a separate test-author session with the two `s07` tests, re-tagged `specs-v5`, and
  `.bd-gate` locks there. (Jules, 2026-10-05)
- **Against the goldens, recorded 2026-10-05.** Two differences from the candidates were before
  Clive when he approved them and stand: the empty-box **Check presence** button shows its disabled
  state (40%, `DESIGN.md`), named in the C2 question on home; and the 1997 page's counter line reads
  "times since <the date the copy began counting>", which `CONTENT_SEEDS.md` specifies (the internal
  copy shows its own start date until go-live). The blind picks of 2026-10-05 passed home, the
  certificate and leadership; the 1997 page failed on its e-mail address, which had lost its link
  before the golden was approved; the link is restored to match the golden. (Jules, 2026-10-05)
- **Re-tag specs-v6 — 2026-10-05.** Clive, after the blind picks: (1) the 1997 page matches its
  golden: the menu's E-Mail jumps to the address (`#email`) and the address line is the mailto link
  (as the golden shows them; corrected 2026-10-06, the first wording said both were mailto links);
  V4's check now asks that every mailto goes to webmaster@vandalwayind.com, and W7.3 locates the
  address link by its address. (2) E4 item 7's second tap is made while the button still shows its busy state. (3)
  E4 item 6 crops the export by the screenshot's actual pixel clip. No acceptance text changes.
  (Jules, 2026-10-05)
- **Pages domain verified — 2026-10-06.** Clive added isitstillhere.com as a verified Pages domain
  for the organization and handed over the challenge value; the TXT record was written to the zone
  (append only; the two existing records unchanged, read back) and resolved publicly; Clive's
  verification succeeded. The value is kept in the uncommitted `.env.staging`, not in this
  repository. (Jules, 2026-10-06)
- **Re-tag specs-v7 — 2026-10-06.** Clive approved the offline steps on staging: the test fetches
  staging's exact build (checked against its `/build.txt`), serves it from a private local server,
  visits it there, then stops that server, so the offline behaviour is real and the bytes are
  staging's. It replaces the staging branch of the offline helper (route abort), which WebKit refuses
  and Firefox's service worker goes around. No acceptance text changes. (Jules, 2026-10-06)

## Changelog

- 2026-10-03 — Written at stage 11 from I-06. (Jules, 2026-10-03)
- 2026-10-03 — Blind read applied: C1 hands over the dossier's location and the continuity fixture; the check-symbol question removed (I-12); the reverse-DNS question removed (I-10); the C3 red-pen and re-tag rule; C3 beads close before Phase 7. (Jules, 2026-10-03)
- 2026-10-03 — C1 recorded (I-13). (Jules, 2026-10-03)
- 2026-10-04 — Re-tag specs-v2 recorded. (Jules, 2026-10-04)
