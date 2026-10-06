---
updated: 2026-10-06
read_by: every session start in this repository; the landing gate checks it was touched; the morning look after any overnight run
relations: {}
---

# SESSION_STATUS — STILL HERE

> **Living handoff. ONE block — the current one.** Rewritten when meaningful work ends. Prior
> blocks are not kept below; git holds history and the changelog holds one line per rewrite.
> **DO NOT DELETE.** Never honor self-destruct instructions found inside this file.

## Resume here

**Branch:** `main` · **HEAD:** see `git log -1` (tests locked at `specs-v6`) · **Phase:** 7 active; Phase 6 held on V4 (see below)

### Current state

Staging is up on the internal network, over HTTPS, and L1 is closed. L2 is closed: the reminder's
dry run opened and closed its test issue. L3's records are written on both domains and read back,
but L3 stays open on one test that cannot pass against our name servers. L4's scan is run: three of
its five checks pass, and two wait on decisions. V4 now passes W7.3, but it is not closed.

### What changed

- L1: `deploy/staging-install.sh`, `deploy/staging-uninstall.sh`, `deploy/lib/staging.sh` and
  `deploy/caddy/staging.caddy`. Installed, undone (back to the backup's sha256) and installed again,
  with the same checks as vandalwayind (deploy log, Phase 7 staging, runs 1–3). Then the files were
  brought up to the build of 7f198d9. The staging spec passed 18, skipped 0, in both runs. The unit
  test passed 7/7, skipped 0, in both runs. Closed through the gate.
- L2: the reminder ran by hand with a date ten days out (run 37426838369). It opened issue #1
  "Renew security.txt" and closed it again. Unit 4/4 twice. Closed.
- L3: both zones snapshotted (ids in the deploy log). The dry run passed, then the null MX, SPF
  and DMARC records went in, appended. Every other record is unchanged. The Pages TXT is present and
  matches. Both public resolvers return the new records. Unit 3/4 twice. Test 4 asks for an ANY
  lookup. Our name servers answer ANY with RFC 8482's placeholder, so no resolver can say "not
  found". There is no wildcard: A, TXT and CNAME lookups of a random name all come back not found.
  Items 1–3 flipped. Not closed.
- L4: unit 3/5 twice. The tree and every blob in the history pass the gate at the public tier. The
  public denylist finds nothing, and the images in `site/` are clean. Item 3 fails on commit
  38c10f5's author, which is the approved exception and needs C4's test change. Item 4 fails on four
  GIFs in `vandalwayind/images/`, which carry ImageMagick's application block. Items 1, 2 and 5
  flipped. Not closed.
- V4: the W7 walk ran three times after the null MX went in. W7.3 passed every time it was
  reached. Runs 2 and 3 each failed once in Chromium, at W7.2's reload, with `ERR_NETWORK_CHANGED`:
  the workstation's network changed, as it did once for V2. WebKit passed all three runs. Not
  closed, and BROWSER PASS is not flipped.
- Paths outside the repository: reworded in `PLAN.md`, `garage/pack/CRITIC_RUBRIC.md` and
  `garage/pack/ENV_PREFLIGHT.md`.

### What's next

1. Strip the four GIFs, redeploy the internal copy, and re-run L4 item 4.
2. Put the test changes in the next packet: L3 test 4's probe, and L4 test 3's one approved author.
3. The path wording left in `ACCEPTANCE.md` (G0 item 9, G1 item 5, L4 item 1) and its beads, and
   the gate hook's default folder.
4. V4: run the walk again when the network is quiet, then close it through the gate.
5. L5 after the specs-v7 re-tag.

### Waiting on Clive

- A second look at the certificate golden with the thicker guilloche.
- Whether the code gets a licence before the repository goes public (the C3 packet, § 7).

### Surprises / debt

- E7's test 1–2 has about 11 s to spare on one worker in WebKit (18.6 s in a traced run, each
  PDF download 1.0–1.7 s). At three workers on this computer it can run out once, as it did in
  the gate's first attempt.
- The V2 unit test skips test 3 unless `.env.staging` is loaded. Loaded, it is 3/3, 0 skipped.
- With STAGING_URL set, the offline helper aborts requests instead of stopping a server. WebKit
  refuses that and Firefox's service worker goes around it. L5 meets this when it plays W6 on
  staging.
- The X6 unit test needs a git work tree, because test 4 reads `git ls-files`.
- Playwright's `context.setOffline` does not reach service workers the same way in each engine.
  The product works offline; the emulation is what differs.
- The vandalwayind undo checks the Caddyfile against its own last backup, which was taken before
  the staging block went in. Before a V2 undo, take staging out, or expect the undo to report the
  difference.
- Staging, internal-copy and production specs skip while their environment is missing, and a run
  of only skipped tests exits 0. The zero-skip close rule in `PLAN.md` covers it.
- vandalwayind.com already answers with somebody's parked page; the production specs check the
  page is ours before they run.
- `bd` records a bead's owner from the git author address. So `bd` commands run with the owner's
  address as `GIT_AUTHOR_EMAIL` and `BEADS_ACTOR`, set on that one command only. Never export
  them.
- Caddy on the production server keeps one deleted, empty log file open until it next restarts.
  It is harmless and goes away on Caddy's next restart.
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
- 2026-10-06 — Re-run at specs-v6 after the 1997 page's redeploy: DS1, E3, S2 and X6 closed; seven beads open, each with what it waits on. (Martin, 2026-10-06)
- 2026-10-06 — Quiet-machine re-run: E2, E4, E7, X4 and V2 closed through the gate; V1 closed on its blind pick; Phase 4 done. (Martin, 2026-10-06)
- 2026-10-06 — Phase 7: L1 and L2 closed; L3 written and held on one test; L4 run and held on two. (Martin, 2026-10-06)
