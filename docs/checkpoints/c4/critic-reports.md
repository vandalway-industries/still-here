# Critic reports, Phases 0–7

Every phase was reviewed at its exit by a critic who had not built it, working from
`garage/pack/CRITIC_RUBRIC.md`: the locked tests first, then the build and guards, then each walk
played by hand in a real browser, then strings, the blind pick against an approved golden where one
exists, a scope-reduction scan and the four levels (exists, substantive, wired, data flows). A walk
step is reported "played", "played (substitute)" (a step outside the browser, played by exactly the
substitute in `WALKS.md`), or "awaiting phone" (a † step only Clive's phone can play). (Diane,
2026-10-06)

## Phase 0 — promote, gates, records filed (2026-10-04)

**Approved with follow-ups.** G0, G1, G2 and T0 closed; Phase 0 unit files 26/26; every later bead's
unit file red, as written, with counts equal to the locked baseline. 296 numbered acceptance items
mapped one by one: none missing, 18 weakly checked. The 18 were tightened before work began and the
tests re-tagged `specs-v2` (recorded in `CHECKPOINTS.md`).

## Phase 1 — design system and the golden candidates (2026-10-04)

**Approved with follow-ups.** Build clean; Phase 0 units 26/26; Phase 1 units 23/25 (DS1's two red
items were both questions for C2, and both reasons were checked true); Phase 1 browser specs 20
passed, 0 failed; linter 0 errors; locked tests unchanged; personal-data scan clean. DS2–DS7 PASS at
all four levels, no scope reduction. Held for C2, which approved the four goldens on 2026-10-05.

## Phase 2 — the shell, the ritual and the certificate (2026-10-04, re-checked 2026-10-06)

**Approved with follow-ups**, then closed bead by bead after C2.

| Bead | Verdict | Walk |
|---|---|---|
| E0 the shell | PASS | W4.1–2 played (pointer and keyboard), Chromium and WebKit, 390 and 1440 |
| E1 the identifier | PASS (no screen) | every vector reproduced |
| E2 the ritual | PASS after C2's paused clock and a quiet-machine run | W1 and W8 played by hand, both motion settings, Chromium and WebKit |
| E3 the certificate | PASS after C2 | hand-played 80 emoji, 80 CJK characters and "Café" in both engines |
| E4 PDF and PNG | PASS after C2 | W1.6–7 played (substitute: the downloaded files opened) |
| E5 the link | PASS | W2.1–3 played twice, Chromium and WebKit, 390 and 1440 |
| E6 reopen and verify | PASS | W2.1–7 played; W2.7 played (substitute: the QR code decoded from the PNG and the PDF) |
| E7 the portfolio | PASS after C2's paused clock and a quiet-machine run | W3 played (step 4 with the site's data cleared) |

## Phase 3 — the company website (2026-10-05)

**Approved.** S3–S9 PASS; S2 PASS on items 1–3, item 4 waited for the leadership golden and passed
its blind pick after C2. W4 (every sub-walk) and W5 played by hand in Chromium and WebKit at 390 and
1440: 316 steps, none stuck.

## Phase 4 — extras (2026-10-05)

**Rejected, then fixed and approved bead by bead.** X1, X2, X3 and X5 PASS. The critic found one real
product defect the locked test had missed: WebKit painted no description for an image it had never
loaded while offline. Fixed (66c049d) and re-checked on screenshots. X4 and X6 then waited on test
changes the critic proved were the test's fault (the browser's offline switch does not reach the
service worker the same way in every engine). Those changes came in at `specs-v4`; X4 and X6 closed.
W6 played with the server stopped, three engines, both sizes.

## Phase 5 — the records in full (2026-10-05)

**Approved.** Every one of the 28 seeded records present by name; the records' formats validated
strictly; the continuity check 0 hits; identifiers 8/8; the tracker 55 issues; the YAML and XML
inventories equal; 84 cited ids resolve; the site byte for byte unchanged by the phase. W9 played,
4 of 4 steps on the local copy (step 4 is N3's, on production). Ownership (51% Diane, 49%
Vandalway) and what the team does not yet know about Lucas both hold.

## Phase 6 — vandalwayind.com, internal (2026-10-06)

**V4 PASS; the exit approved with follow-ups.** The four V unit files: 15 pass, 1 skip by design (V1
item 4, the blind pick, which passed at C2). W7 played by hand in Chromium and WebKit at 390 and
1440: steps 1, 2, 4 and 5 played; step 3 played (substitute): the link is exactly
`mailto:webmaster@vandalwayind.com` and the domain's mail record is `0 .` at both public
resolvers; the real send that bounces is phone checklist item 9 (awaiting phone). The counter rose
from 643 to 665 within 628 seconds of three loads (the bar is n+3 within eleven minutes). Every
header as V4 says; POST, PUT and DELETE refused. The follow-ups (one guard tripped by the GIF
script, a test server left on the shared port, the mail check's resolver) were done the same hour.

## Phase 7 — staging (2026-10-06)

L1–L4 were closed through the gate on their tests (no screens of their own). For L5 there is no
separate critic, by Clive's decision of 2026-10-06 to drop the repeats for the rest of the launch.
W1–W9 were walked on staging by the spec twice; every step it reported red was then played by hand
on staging and works. The table is in the C4 packet, § 2. W7 is credited from Phase 6's walks of the
same internal copy, above.
