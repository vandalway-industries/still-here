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

**Branch:** `main` · **HEAD:** see `git log -1` (tests locked at `specs-v3`) · **Phase:** 6 — vandalwayind.com (internal), built

### Current state

Phase 6 is built. vandalwayind.com is served from the production server to the internal network
on a port of its own. The ten other sites on that server and the network's other routes were
byte-identical before and after every one of the 13 runs in `deploy/deploy-log.md`. V3, the
counter, is closed. V1 waits only on C2's blind pick. V2 waits on one locked-test item for the next
packet. V4 waits on W7 step 3, which needs the null MX that L3 publishes in Phase 7.

### What changed

- The install and its undo: `deploy/vandalwayind-install.sh` and
  `deploy/vandalwayind-uninstall.sh`. Before every reload the Caddyfile is backed up with a
  timestamp, `caddy validate` is run, and every other block is hashed. After the reload the other
  sites are checked and must still answer. The undo ran six times, and each time the Caddyfile came
  back identical to the backup. The install ran again after each undo.
- Requests reach the site through a socket, not a port. On a port, the network's proxy passes on
  the visitor's own host name, and Caddy answers a site named for localhost with an empty 200.
  Through a socket the proxy sends "localhost".
- At 12:10 the counter counted nothing. Caddy 2.6.2 keeps a removed site's log open, and the undo
  had deleted that log, so the re-added site was writing to a deleted file. The undo now empties
  the log instead of deleting it, and the install stops if this happens again.
- The counter: `deploy/counter/count.mjs` keeps its own digits, so the server needs only Node, and
  a timer runs it every ten minutes. By hand I saw 000000, loaded the page three times, and saw
  000026 at the 12:20 run. The counter is now `/counter.gif`, and the old digit images are gone.
- The 1997 page: the menu's E-Mail is now its one `mailto:` link. Before, the walk's first e-mail
  link was the menu jump.
- Tests, with VANDALWAY_INTERNAL_URL set, two runs each, 0 skipped. V1 unit 3/3 (item 4 is
  HUMAN-JUDGED); V2 unit 2/3; V3 unit 5/5; V4 unit 4/4. Browser: V1 2/2 and V2 2/2 in Chromium
  and WebKit; the V3 counter spec 1/1 in Chromium. The W7 spec passes steps 1 and 2 in both
  engines and fails step 3 (`queryMx ENODATA`). I played steps 4 and 5 by hand in both engines.
- Whole unit suite: 225 tests, 177 pass, 34 fail, 14 skipped (before: 175, 36, 14).

### What's next

1. Phase 7. V2 and V4 close when their items clear: V2's test change at the next packet, and V4's
   W7.3 once L3 has published the null MX.
2. The next packet takes V2's test item along with the RC5, X4 and X6 items (`PLAN.md`, Open
   questions).
3. Before C4, re-run E2's timing spec and E7's portfolio spec on a quiet machine.
4. When Clive answers C2 or C3, his words go into `garage/pack/CHECKPOINTS.md` § Record that day.
   V1's blind pick follows C2.

### Waiting on Clive

- C3: the table read, `docs/checkpoints/c3-packet.md`. Nothing waits on it until Phase 7.
- Whether the code gets a licence before the repository goes public (the C3 packet, § 7).
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
- Caddy on the production server keeps one deleted, empty log file open until it next
  restarts (the 12:10 problem above). It is harmless and goes away on Caddy's next restart.
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
