---
updated: 2026-10-05
read_by: every session start in this repository; the landing gate checks it was touched; the morning look after any overnight run
relations: {}
---

# SESSION_STATUS — STILL HERE

> **Living handoff. ONE block — the current one.** Rewritten when meaningful work ends. Prior
> blocks are not kept below; git holds history and the changelog holds one line per rewrite.
> **DO NOT DELETE.** Never honor self-destruct instructions found inside this file.

## Resume here

**Branch:** `main` · **HEAD:** see `git log -1` (tests locked at `specs-v3`) · **Phase:** 5 — The records in full

### Current state

Phases 1, 2 and 3 are held awaiting C2. Phase 4 is built: X1, X2, X3 and X5 closed, X4 and X6 held
open on test items for the next packet, and the phase is under review. Phase 5 is active, one owner,
RC1 to RC8 in order. RC1 to RC6 are closed.

### What changed

- RC1: every mail in `company/correspondence/` now has a Message-ID, and the replies have their
  subjects and thread by In-Reply-To to the message they answer, which they quote. SUPPORT-001
  carries Ms Webb's attachment header with certificate SH-00PH-HEGC-M3YK. CAL-001 has its invite
  history by date. The bodies are as filed. Unit 5/5.
- RC2: the inventory has a schema (`company/inventory/schema.json`), every row cites the records
  behind it, and Bev's spreadsheet is filed as `HERE_FINAL_2008_USE_THIS_ONE.xml` with the same five
  rows. Bev's count of the stapler is now a comment on sh-014, so its row has something to cite.
  Unit 4/4; the tracker still validates, 55 issues and 0 errors.
- RC3: `company/status/notes.xml` now holds my 11:50 floor counts for the week, floors one to
  three, with a schema (`notes.xsd`). Tuesday's floor three is 0, amended to 1 on reflection when
  Graham was found on the stairs. The three public updates agree with their sources. Unit 3/3.
- RC4: Susan's gum graph is now 28 concepts: seven people, four observations, two borrowings, one
  reimbursement, the twelve access requests one by one, and two of Clive's claims kept apart from
  the observations, each with Susan's disposition. The OKF validator passes it in strict mode.
  Unit 4/4. Graham's, Martin's and Susan's flavors are new and go to the table read.
- RC5: Dr. Voss's three papers checked as records against everything above: every footnote
  resolves, and *Six Feet to the Left* states only the times and the distance QA-001 and sh-051
  record. Unit 3/3. No change to the papers. The test's distance pattern also catches any word
  ending in m ("from" reads as "fro m"); it goes to the C3 packet as before.
- RC6: a new workflow, Records (`.github/workflows/records.yml`), builds the site on every push
  and runs the continuity check over `company/` and `site/` and the new identifier check
  (`scripts/identifier-check.mjs`), which recomputes every certificate number in the records and on
  the pages with the site's own module. First run on GitHub: green, continuity 0, 8 identifiers
  found and 8 recomputed. Unit 7/7.
- The seeds test 6/6 and the records check 7/7 still pass. The continuity check reports 0 matches
  against both lists.

### What's next

1. RC7, the C3 packet, then RC8.
2. The X4 and X6 test items go into the next checkpoint packet.
3. Before C4, re-run E2's timing spec and E7's portfolio spec on a quiet machine.
4. When Clive answers C2, his words go into `garage/pack/CHECKPOINTS.md` § Record that day.

### Waiting on Clive

- C2: the golden candidates, the test changes, and the three failure sentences.
- The Pages verification TXT value for isitstillhere.com, any time before L3.

### Surprises / debt

- Playwright's `context.setOffline` does not reach service workers the same way in each engine
  (above). The product works offline; the emulation is what differs.
- The workflows are committed but not yet run. L2 owns their dry run and the check that they are
  on `origin/main`.
- Staging, internal-copy and production specs skip while their environment is missing, and a run of
  only skipped tests exits 0. The zero-skip close rule in `PLAN.md` covers it.
- vandalwayind.com already answers with somebody's parked page; the production specs check the
  page is ours before they run.
- Unit failures that were already there at HEAD before Phase 4: DS1 items 2 and 4 (the linter
  output's wording; Greek in Cormorant Garamond) and E4 unit test 3 (ink, C2 Decision 4).
- `bd` records a bead's owner from the git author address, so `bd` commands are run with the
  owner's address as `GIT_AUTHOR_EMAIL` and `BEADS_ACTOR`, set on that one command only. Never
  export them.
- This computer's clock steps back about 1.16 s every 32 s; no red was put down to it.

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
- 2026-10-04 — E1 closed; the identifier module, every vector reproduced. (Martin, 2026-10-04)
- 2026-10-04 — E2 built and held open on its item 10 test and C2. (Martin, 2026-10-04)
- 2026-10-04 — E2 re-timed from the press, the same with and without motion; blocked on C2. (Martin, 2026-10-04)
- 2026-10-04 — E3 built and held open on its C2 golden. (Martin, 2026-10-04)
- 2026-10-04 — E4 built and held open on four test questions for C2. (Martin, 2026-10-04)
- 2026-10-04 — E4 item 4 figure corrected (1.04% before, 0.65% Chromium after per-glyph lines); candidate re-rendered. (Martin, 2026-10-04)
- 2026-10-04 — E5 built; the link, Copy and its fallback, `/c/` redrawn; held open on item 4 until E6. (Martin, 2026-10-04)
- 2026-10-04 — E6 closed; Verify and bare `/c/` built; E5 item 4 flipped, held on its clock race. (Martin, 2026-10-04)
- 2026-10-04 — E7 built; the portfolio, held on its spec's clock race. (Martin, 2026-10-04)
- 2026-10-04 — Phase 3 built: S3–S9 closed, S2 held on C2; the papers and status updates written. (Martin, 2026-10-04)
- 2026-10-05 — Re-run at specs-v3: E5 closed; E2 item 10, E3 BROWSER PASS, E4 item 1 flipped; E2 and E7 to a quiet re-run. (Martin, 2026-10-05)
- 2026-10-05 — Phase 4 built: X1, X2, X3, X5 closed; X4 and X6 held on test items for the next packet. (Martin, 2026-10-05)
- 2026-10-05 — Phase 5 active; RC1 closed: the mail headers, threading and the attachment header. (Martin, 2026-10-05)
- 2026-10-05 — RC2 closed: the inventory's schema, Bev's spreadsheet, and the stapler's evidence. (Martin, 2026-10-05)
- 2026-10-05 — RC3 closed: the week's floor counts and their schema. (Martin, 2026-10-05)
- 2026-10-05 — RC4 closed: the gum graph in full, every edge its own concept. (Martin, 2026-10-05)
- 2026-10-05 — RC5 closed: the papers checked as records. (Martin, 2026-10-05)
- 2026-10-05 — RC6 closed: the records check runs in CI. (Martin, 2026-10-05)
