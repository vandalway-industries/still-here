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

**Branch:** `main` · **HEAD:** see `git log -1` (tests locked at `specs-v3`; `specs-v4` is being cut by the test author) · **Phase:** 6 held; C2 and C3 answered, their product changes in

### Current state

Clive's C2 and C3 answers are in the product, and so are his follow-ups. Nothing was
ticked and no bead was closed: the test author is re-tagging `specs-v4`, and the re-runs come after.
The internal copy of vandalwayind.com was taken down and put back by its two scripts with the
counter fixes in.

### What changed

- Home: the band reads "Every Friday, it is still here." Leadership: Lucas's card reads "Lucas",
  with "Intern" beneath. His staff file and the tracker still say "Lucas the Intern".
- The certificate: the guilloche is 0.7 units. Folding chair's PDF, cropped and rendered back,
  differs from its PNG by 0.61% in Chromium and 0.20% in WebKit (it was 0.65% and 1.00%). The
  specimen was rendered again into `candidates/` and `certificate-golden.png` for Clive's second
  look. Against the approved golden, only the guilloche band changed.
- Long names step down in size and stay between "This certifies that" and the name rule, on
  three lines at most. Text names stop at 30. Names drawn as images may go down to about 24 units
  of ink, which Clive allowed, and their lines are set solid. 80 × 椅 and 80 × 🪑 now fit in three
  lines in both engines. Each name image is placed on the PDF's own pixel grid. The PDF of 80 × 椅
  now differs from its PNG by 0.56% in Chromium (it was 1.45%) and 0.19% in WebKit.
- The hero's crop box in the manifest is now the build's, (1044,110)-(1656,875).
- The second-floor printer (`s07`) is on careers, next to the stapler, at 400 and 800 wide, with
  no metadata.
- The three failure sentences were already in the approved words. I took out the "draft" comments.
- The counter skips NUL bytes at the start of a log line. The undo empties the log, and at Caddy's
  next write the log gets a run of NULs at the front; I saw it on the server. The install now
  writes the day it started counting into the served page: "times since October 5, 2026." Undo
  and install at 22:49 UTC, `deploy/deploy-log.md` runs 14 and 15. All 11 other blocks were
  byte-identical, the ten other sites answered as before, and the other routes hashed the same.
- Tests, against whatever was on disk at `specs-v3`, from a private copy at two workers: the DS4,
  E3 and E4 specs 24/24 in Chromium and WebKit. S2, S6 and DS5 specs green; the only skips are the
  specs' own engine limits. V1 to V4 with VANDALWAY_INTERNAL_URL set: 12 passed and 4 failed, all
  four W7 step 3 (`queryMx ENODATA`, waiting on L3). The 8 skips are engine limits. `npm run build`
  is fine, and `npm run check:links` finds 19 pages and 0 broken. The whole unit suite: 225 tests,
  183 pass, 28 fail, 14 skipped. That is the same set of failures as HEAD, apart from two. The
  portfolio's identifier landed a second late under the running clock, which is C2 test change 4.
  The specs-v1 lock fails because the test author's files are changing.

### What's next

1. `specs-v4` is tagged. The PM re-runs the affected beads.
2. V1's blind pick and the certificate golden's second look go to Clive.
3. Phase 7, once Phase 6's items clear.

### Waiting on Clive

- A second look at the certificate golden with the thicker guilloche.
- Whether the code gets a licence before the repository goes public (the C3 packet, § 7).
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
- Caddy on the production server keeps one deleted, empty log file open until it next
  restarts (the 12:10 problem above). It is harmless and goes away on Caddy's next restart.
- The printer photograph has dated sticky notes and a sticker on it. Clive says both stay.
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
- 2026-10-05 — RC7: the C3 packet is out; the bead held on a test item. (Martin, 2026-10-05)
- 2026-10-05 — Phase 5 built: RC1–RC6 closed, the C3 packet out, RC7 and RC8 held on test items; Phase 6 active. (Martin, 2026-10-05)
- 2026-10-05 — RC7 and RC8 closed as product fixes: the copy in `src/content/`, the `test` and `e2e` scripts; Phase 5's exit gate met. (Martin, 2026-10-05)
- 2026-10-05 — Phase 6 built and served internally: V3 closed; V1 on C2, V2 on a test item, V4 on L3's null MX. (Martin, 2026-10-05)
- 2026-10-05 — C2 and C3 product changes in; the internal copy redeployed with the counter fixes; Decision 6 open for image-drawn names. (Martin, 2026-10-05)
- 2026-10-05 — Names drawn as images fit three lines in the name zone, and their PDF matches the PNG. (Martin, 2026-10-05)
