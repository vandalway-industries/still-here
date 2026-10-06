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

**Branch:** `main` · **HEAD:** see `git log -1` (tests locked at `specs-v12`) · **Phase:** 8, launched; the final audit passed

### Current state

STILL HERE is live at https://isitstillhere.com (GitHub Pages, HTTPS enforced) and Vandalway's page
at https://vandalwayind.com (the production server, HTTPS, counting since its go-live on 6 October
2026). The repository is public. 52 of 54 beads are closed. L5 and N3 stay open as exclusions Clive
approved at launch: their walks never came out green in one run on this workstation's network.

### What changed

- C4 signed off: the phone checklist passed on staging; § 6 answered and applied (`specs-v9`); the
  repository made public by Clive.
- N1 closed: Pages from Actions, the domain, DNS, the certificate (the domain re-added once with
  Clive's word), HTTPS enforced; the production spec 18/18.
- N2 closed: vandalwayind.com's DNS and its public block by `deploy/vandalwayind-public-install.sh`
  with its undo; go-live reset the internal copy's 793 loads to 0; W7 on production 4/4.
- N3: its checks pass against production; Clive's production phone re-check passed; W-DoD never
  green in one run (network drops, GitHub's 429), excluded by Clive.
- Re-tags `specs-v10` to `specs-v12`, each approved: X6 reads a host without Caddy's placeholder;
  G0 expects public after C4; W9's helper follows the README's links and waits for the address.

### What's next

1. Nothing else in v1. L5 and N3 can be closed by a gate run from a steadier network.

### Waiting on Clive

- Nothing.

### Surprises / debt

- The workstation's network drops during long browser runs (`ERR_NETWORK_CHANGED`, "Network is
  unreachable"). It is why L5 and N3 are open. A run from a steadier network can close them.
- GitHub answers 429 when the W9 walk visits the repository many times in an hour.
- Each deploy to `main` moves `security.txt`'s `Expires` a year from that deploy; `PROJECT.md`
  gives the renewal as of launch, and the reminder workflow reads the live file.
- N3's test 7 (the final audit recorded) matches the exit gate's own wording, so it is green before
  any audit; for the next packet.
- Staging's `/build.txt` must equal HEAD for L1's test 2: put the last commit's build on staging.
- `bd` commands run with the owner's address as `GIT_AUTHOR_EMAIL` and `BEADS_ACTOR` on that one
  command only. Never export them.
- This computer's clock steps back about 1.16 s every 32 s.

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
- 2026-10-06 — L3, L4 and V4 closed at specs-v8; Phase 6 done; W1–W9 walked on staging; the C4 packet is out and the run waits on Clive. (Martin, 2026-10-06)
- 2026-10-06 — C4's questions answered and applied (specs-v9); L5 waits on a quiet-network gate run; the phone checklist and the switch are Clive's. (Martin, 2026-10-06)
- 2026-10-06 — Launched: both sites live; N1 and N2 closed; L5 and N3 excluded by Clive; the final audit in its second round. (Martin, 2026-10-06)
- 2026-10-06 — The final audit passed; v1 is done, with L5 and N3 item 4 excluded by Clive. (Martin, 2026-10-06)
