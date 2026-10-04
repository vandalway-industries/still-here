---
updated: 2026-10-03
read_by: Clive at C1 (every disposition that made a product call is listed in the PRD diff, item 8); the C4 packet's author (to confirm each fix held); anyone asking why a pack line reads as it does
relations:
  derived_from: ../../PRD.md
---

# Blind read — findings and dispositions

Stage 11b. A reader who had never seen the project read the finished pack (`PRD.md`, `PLAN.md`,
`garage/HANDOFF.md`, `garage/pack/`) twice, as a first-time visitor and as whoever consumes what
the product puts out, and listed every action, state, transition, edge case or promise with no
home. The findings are filed below verbatim, as received. Under each is its disposition: **FIXED**
(where the pack changed), **PRODUCT CALL** (awaiting Clive), or **ACCEPTED AS-IS** (why). Four
findings were put to Clive as product calls and answered the same day (I-09 to I-12 in
`garage/BRAINSTORM.md`); they are marked FIXED with the answer cited. (Jules, 2026-10-03)

**Counts:** FIXED 51 · PRODUCT CALL 0 (four answered: I-09, I-10, I-11, I-12) · ACCEPTED AS-IS 0.
Dispositions that are my calls rather than Clive's answers are each one line in the PRD diff,
item 8, for him to overrule at C1.

## Findings

1. W-DoD needs every step marked "played" by the critic in a browser, but some steps need actions outside the browser that the critic cannot perform. W6.1–2 accepts the install prompt and opens the installed app. W7.3 opens a mail program, sends a message and waits for the bounce. W3.4 clears site data from the browser's settings. W1.6 opens the downloaded PDF to look at its typeface, which headless Chromium cannot display. Nothing says how these steps are played or what replaces them, so under the rubric each one fails as "unplayed". Home: garage/pack/WALKS.md W-DoD, W1.6, W3.4, W6.1–2, W7.3; garage/pack/CRITIC_RUBRIC.md § Order of checks 3; garage/pack/ACCEPTANCE.md N3.4, V4 BROWSER PASS, L5.1. BLOCKS-DoD.

   **FIXED** — `WALKS.md` § Substitute evidence names one substitute and helper per step (pdf.js render, CDP clear-site-data, installability check, null-MX lookup, jsQR decode); steps with no substitute are † phone-checklist items reported "awaiting phone"; `CRITIC_RUBRIC.md` check 3 and `ACCEPTANCE.md` Conventions, T0.2, L5.1, N3.4 updated.

2. The counter rule does not say what happens to reloads. Only GET `/` with status 200 is counted, and every page file's Last-Modified is fixed to 1997. A browser reload therefore asks the server whether the page changed and gets a 304 (or is served from cache with no request at all). Neither of those is counted, so W7.2's "reload twice … gone up by at least three" fails as written. Home: PRD.md R43, R44; garage/pack/ACCEPTANCE.md V3.2, V3.4, V4.1; garage/pack/WALKS.md W7.2. BLOCKS-DoD.

   **FIXED** — the counter counts GET `/` or `/index.html` answered 200 or 304, and the page and counter image are sent `Cache-Control: no-cache` so every load reaches the server (`PRD.md` R44 and diff item 5; `ACCEPTANCE.md` V3.2).

3. The PRD and PLAN set the counter bar at "at least n+3 within six minutes of three loads". The PRD's own R44 (decision D22) refreshes the counter every ten minutes, so the bar the final audit grades against cannot be met. The other files disagree too: V3.4 says eleven minutes and W7.2 says ten. Waiting exactly ten minutes against a ten-minute timer can also miss the tick. Home: PRD.md § Acceptance criteria (NEEDS-BAR bullet), R44; PLAN.md Phase 6 Bar; garage/pack/ACCEPTANCE.md V3.4; garage/pack/WALKS.md W7.2. BLOCKS-DoD.

   **FIXED** — one bar everywhere: at least n+3 within eleven minutes of the third load (one timer period plus a minute): `PRD.md` § Acceptance criteria and diff item 5, `PLAN.md` Phase 6 Bar, `ACCEPTANCE.md` V3.4, `WALKS.md` W7.2.

4. Goal 5 promises "do all of 1–3 with no network". That includes the PNG download, copying the link, reopening `/c/`, Verify by hand and re-downloading from the portfolio. R37, X4 and W6 only cover the ritual, the PDF download and the portfolio list. Offline `/c/`, `/verify`, PNG and re-download have no acceptance line and no walk step. Home: PRD.md Goals 5, R37; garage/pack/ACCEPTANCE.md X4; garage/pack/WALKS.md W6. BLOCKS-DoD.

   **FIXED** — `PRD.md` R37 now names every Goals 1–3 action offline; `ACCEPTANCE.md` X4.2–4 precache every page and test each action; `WALKS.md` W6 steps 4–7 play them.

5. Two required Privacy sentences have no test that can prove them: sentence 2 ("GitHub Pages logs … We cannot read those logs.") and sentence 4 (Safari's seven-day clearing). R33 requires every sentence to be "tied to the test that proves it", but S9.1 maps only five tests to eight sentences. The rubric's cheat list fails "any statement on the Privacy or Terms page that no test proves". As written, S9 cannot pass the critic. Home: PRD.md R33; garage/pack/CONTENT_SEEDS.md § Drafts judged at C3 (Privacy 2, 4); garage/pack/ACCEPTANCE.md S9.1–2; garage/pack/CRITIC_RUBRIC.md § The cheat list. BLOCKS-DoD.

   **FIXED** — a statement about another company's behaviour is proved by linking that company's own documentation on the page (GitHub's Pages documentation; WebKit's tracking-prevention page), checked by the critic; `ACCEPTANCE.md` S9.1 maps all eight sentences to their proofs; `PRD.md` R33 and `CRITIC_RUBRIC.md` cheat list updated.

6. No bead creates `tests/fixtures/continuity-hashes.json`, which holds the salt, the `confidential` list and the `unknown-to-staff` list. G2.6 and R6.4 depend on it. Its source is the dossier's confidential section and the "story truth" about where Lucas works, and the pack says the run never files or reads that material ("Nothing else in it is filed, quoted or paraphrased"; the "story truth" column "is not filed"). R41's Lucas assertion therefore has no test that can be built. Home: garage/pack/ACCEPTANCE.md G2.6, R6.4, T0; garage/pack/CONTENT_SEEDS.md § brand dossier paragraph, § Inventory seed; PRD.md R41. BLOCKS-DoD.

   **FIXED** — Clive supplies the fixture at C1 with the dossier's location; `CONTENT_SEEDS.md` § Continuity fixture specifies its shape, normalization and hash so it can be made without the run; G2 copies it unchanged (`ACCEPTANCE.md` G2.6, RC6.4); `PLAN.md` hands table and Phase 0 entry; `ENV_PREFLIGHT.md` § Inputs handed over at C1.

7. Phase 2's walks need the header and menu, which are not built until Phase 3. W1.10 ("I can reach the menu"), W2.4 ("open Verify from the menu") and W3.2 ("choose Portfolio from the menu") are in E6's and E7's locked walk specs and in Phase 2's exit gate. The menu is S1, in Phase 3, and Phase 3 cannot start until E2 is closed. E6, E7 and the Phase 2 gate cannot close in order. Home: PLAN.md Phase 2 exit gate, Phase 3 entry criteria; garage/pack/ACCEPTANCE.md E6, E7 BROWSER PASS; garage/pack/WALKS.md W1.10, W2.4, W3.2. BLOCKS-DoD (phase gate).

   **FIXED** — the shell moved to Phase 2 as E0, first in the phase (`ACCEPTANCE.md` E0; `PLAN.md` Phase 2 steps and sequencing); S1 retired.

8. S1 has a circular dependency. S1 must close first in Phase 3, but S1.1–3 check the header, footer, menu and links on "every page in PRD R24". That list includes the S2–S9 pages and the 404, which X3 builds in Phase 4, and Phase 4 cannot start until S1 is closed. Nothing says S1 creates placeholder pages. Home: PLAN.md Build method (Sequencing), Phase 4 entry criteria; garage/pack/ACCEPTANCE.md S1.1–3, X3; PRD.md R24. BLOCKS-DoD (phase gate).

   **FIXED** — E0 creates every R24 page, built or as a marked placeholder, and the real 404 page; X6.5 fails if any placeholder remains; X3 now proves the 404 on each server; Phase 4's entry is Phase 3's exit gate.

9. Phase 3's pages need text that is only written in Phase 5. S3.2 needs RESEARCH-001's 86-page contents list (Phase 5). W4.research reads both short papers "to the end" (Phase 5). S5.2 and W4.status need STATUS-002 and STATUS-003 (Phase 5). As sequenced, Phase 3's exit gate cannot pass. Home: garage/pack/CONTENT_SEEDS.md § Records (RESEARCH-001, STATUS-002, STATUS-003, Directionality, Six feet: P5); garage/pack/ACCEPTANCE.md S3.2–3, S5.2; garage/pack/WALKS.md W4.research, W4.status; PLAN.md Phase 3 exit gate, Phase 5 entry criteria. BLOCKS-DoD (phase gate).

   **FIXED** — the papers are written in S3 and STATUS-002/003 in S5, in Phase 3 (`CONTENT_SEEDS.md` § Records marks them P3); Phase 5 checks them as records (RC3.3, RC5); Phase 5's entry requires S3 and S5.

10. R51's no-reply commit identity is checked only once, by G0.4. That test is written by G0's own Worker before the `specs-v1` lock, when the history holds one or two commits. Nothing later (the L4 release scan, the Phase 8 beads) checks author and committer emails across the whole history before the public switch. Home: PRD.md R51, R52; garage/pack/ACCEPTANCE.md G0.4, L4. BLOCKS-DoD.

    **FIXED** — `ACCEPTANCE.md` L4.3 checks every author and committer email and name over `git log --all` before C4; `PRD.md` R51 says so.

11. The checks on identifiers in the records pass if they find none. R6.1 and N3.3 assert "every SH- identifier under company/ …", but no line lists which records quote which identifiers (only CERT-001's `SH-00PK-EEC2-0EPR` is named). A scan that finds zero identifiers passes. Goal 6's "every identifier quoted … verifies" sets no minimum. Home: PRD.md Goals 6, R40; garage/pack/ACCEPTANCE.md R6.1, N3.3; garage/pack/CONTENT_SEEDS.md § Records. BLOCKS-DoD.

    **FIXED** — CERT-001 (`SH-00PK-EEC2-0EPR`) and SUPPORT-001 (`SH-00PH-HEGC-M3YK`, in its attachment header) are named; a scan finding fewer than two fails (`ACCEPTANCE.md` RC1.5, RC6.1; `CONTENT_SEEDS.md` § Identifier vectors; `PRD.md` R40).

12. Nothing says what the run does if Clive answers "no" to the reverse-DNS question at C4. N2 and W7 on production wait on that answer, and no other host is planned. On a "no", Goal 4 and W-DoD cannot be met, and every isitstillhere.com footer links to a registrar parking page indefinitely. Home: PRD.md Open questions, Goals 4; PLAN.md Phase 8 N2, Open questions; garage/pack/ACCEPTANCE.md N2.1. BLOCKS-DoD.

    **FIXED (I-10)** — Clive accepted the reverse record as it is. The open question is gone from `PRD.md` and `PLAN.md`; N2 no longer waits (`ACCEPTANCE.md` N2.1; `ENV_PREFLIGHT.md`).

13. Nothing says what happens during the 4–5 second sequence. It is not stated whether the input and example chips stay editable, or what an edit, a chip tap, a reload, Back or a click on the logo does mid-sequence. It is also not stated whether the certificate is issued and saved to the portfolio at the press or when the result appears, or which moment the identifier encodes. Home: PRD.md R4, R12, R23; garage/pack/WALKS.md W1.4; garage/pack/ACCEPTANCE.md E2.5. SURPRISES-USER.

    **FIXED** — input and chips are inert; the identifier encodes the second of the press; saved only at the result; leaving mid-sequence issues and saves nothing (`PRD.md` R4 and diff item 8; `ACCEPTANCE.md` E2.10; `DESIGN.md` Example chips; `WALKS.md` W1.4).

14. Nothing says what happens after the result appears. It is not stated whether the URL changes, or what a reload or Back shows: the result, a redraw from a link, or an empty home page. Nor is it stated whether the input and Check presence stay usable beside the result, or what a new press there does. Home: PRD.md R6; garage/pack/WALKS.md W1.5–8; garage/pack/ACCEPTANCE.md E2. SURPRISES-USER.

    **FIXED** — the address stays `/` with no history entry; the result replaces the form; a reload shows an empty home page; Check another restores the form (`PRD.md` R6 and diff item 8; `ACCEPTANCE.md` E2.11–12; `DESIGN.md` Result; `WALKS.md` W1.5, W1.8).

15. The spec only defines Enter on an empty input. Whether Enter in a filled box starts the check, and whether Enter submits on `/verify`, is not stated. Home: PRD.md R3, R4, R22; garage/pack/WALKS.md W1.2, W2.4. SURPRISES-USER.

    **FIXED** — Enter starts the check; Enter in either Verify field submits (`PRD.md` R4 and diff item 8; `ACCEPTANCE.md` E2.2, E6.2; `WALKS.md` W1.4, W2.4).

16. No line lists what `/c/` offers once it has redrawn and confirmed a certificate: Download PDF, Download PNG, Copy link, Check another, or none of these. W3.3 and E7.2 require re-downloading a portfolio entry, and nothing says where that button lives, on `/c/` or in the portfolio list. Home: PRD.md R21, R23; garage/pack/ACCEPTANCE.md E6.1, E7.2; garage/pack/WALKS.md W3.3. SURPRISES-USER.

    **FIXED** — `/c/` offers Download PDF, Download PNG, Copy certificate link and Check another; each portfolio entry offers Open, Download PDF and Download PNG (`PRD.md` R21, R23 and diff item 8; `ACCEPTANCE.md` E6.1, E7.2; `CONTENT_SEEDS.md` § Interface strings; `WALKS.md` W2.2, W3.3).

17. `/c/`'s failure and empty states are undefined. For a mismatched or future-dated link, nothing says whether a certificate is drawn beside the sentence, or what way onward is offered. Bare `/c/` with no fragment has no defined output. Nothing says whether opening a valid link on a second device adds it to that device's portfolio. Home: PRD.md R21–R23; garage/pack/ACCEPTANCE.md E6.1–4; garage/pack/WALKS.md W2.3, W3.5. SURPRISES-USER.

    **FIXED** — a failure draws no certificate and offers "Verify a certificate" and "Check an object"; bare `/c/` shows the Verify form; opening a link adds nothing to the portfolio (`PRD.md` R21–R22 and diff item 8; `ACCEPTANCE.md` E6.1, E6.7; `WALKS.md` W2.3, W3.5).

18. Several Verify cases are undefined. When a future-dated identifier comes with a wrong name, nothing says which sentence wins. Nothing says whether the `SH-` prefix is optional, or what empty fields produce. Home: PRD.md R22; garage/pack/ACCEPTANCE.md E6.3–6. SURPRISES-USER.

    **FIXED** — order of judgment: malformed, then name, then future (a future identifier with a wrong name is not located); `SH-` optional; an empty field gets its own sentence (`PRD.md` R22 and diff item 8; `ACCEPTANCE.md` E1.4, E6.3, E6.6; `CONTENT_SEEDS.md` § Interface strings).

19. `<name slug>` in the download filename has no rule for case, punctuation or length. Names with no Latin letters ("שולחן", "椅子", "🪑") would produce an empty slug under a naive rule. Home: PRD.md diff item 8 (Download filenames), R16; garage/pack/ACCEPTANCE.md E4.1. SURPRISES-USER.

    **FIXED** — the slug rule (NFKD, marks removed, lower case, non-alphanumerics to one hyphen, 40 characters, `object` if empty) is in `CONTENT_SEEDS.md` § Download filenames, with vectors in `ACCEPTANCE.md` E4.1; `PRD.md` R16 and diff item 8 point to it.

20. Nothing says what the visitor sees while a PDF or PNG is being generated, what a second tap does, or what happens if export fails (a font fetch fails, iOS runs out of memory). There is no error colour by design and no error copy exists. Home: PRD.md R6, R14; DESIGN.md § Components; garage/pack/CONTENT_SEEDS.md § Drafts. SURPRISES-USER.

    **FIXED** — "Preparing PDF…" / "Preparing PNG…", a second tap ignored, a stated failure sentence in graphite (`PRD.md` R16 and diff item 8; `ACCEPTANCE.md` E4.7; `DESIGN.md` Button; `CONTENT_SEEDS.md` § Interface strings).

21. R10 says a single 60-character word "prints in full" but gives no rule for breaking a word that has no spaces. Nothing says what happens when three lines at the 30-unit floor still overflow, for example 80 wide CJK or emoji characters. Home: PRD.md R10; DESIGN.md § Components (Certificate); garage/pack/ACCEPTANCE.md E3.4. SURPRISES-USER.

    **FIXED** — a word wider than the line breaks at a grapheme boundary with no hyphen; up to four lines at the 30-unit floor; tested with 80 × "椅" and 80 × "🪑" (`PRD.md` R10 and diff item 8; `ACCEPTANCE.md` E3.4; `DESIGN.md` Certificate).

22. Three date/time displays have no format or locale: the local time on the result screen, the "<date and time>" in the "Issued by …" sentence (which is checked verbatim) and the portfolio dates. Only the certificate's written-out line has a draft. Home: PRD.md R6, R21–R23; garage/pack/CONTENT_SEEDS.md § Fixed strings (Reopen / verify confirmation); garage/pack/ACCEPTANCE.md E6.1–2, E7.1. SURPRISES-USER.

    **FIXED** — English, day month year, 24-hour, regardless of locale, with an example for each display (`CONTENT_SEEDS.md` § Fixed strings and § Dates and times; `ACCEPTANCE.md` E3.6, E6.1–2, E7.1; `PRD.md` diff item 8).

23. Nothing says what the ritual does when the visitor's clock reads earlier than 2026-01-01. The identifier scheme (Branch B) cannot encode a moment before its epoch. Home: PRD.md R17; garage/BRAINSTORM.md Exploration 16. SURPRISES-USER.

    **FIXED** — the sequence runs, then a stated sentence; nothing is issued or saved (`PRD.md` R6 and diff item 8; `ACCEPTANCE.md` E2.13; `CONTENT_SEEDS.md` § Interface strings).

24. Nothing on the result screen tells the visitor that the certificate was kept on this device, or where to find it. Goal 3 depends on them finding "Portfolio" in the menu by themselves. Home: PRD.md Goals 3, R6, R23; garage/pack/WALKS.md W1.5. SURPRISES-USER.

    **FIXED** — "Kept in Your Presence Portfolio on this device.", linked (`PRD.md` R6 and diff item 8; `ACCEPTANCE.md` E2.11; `WALKS.md` W1.5).

25. Nothing says what an offline visitor sees on a page that was not precached (leadership, research, case studies) or on an unknown path. Home: PRD.md R37; garage/pack/ACCEPTANCE.md X4. SURPRISES-USER.

    **FIXED** — every HTML page is precached; an image never shown displays its alt text; an unknown path gets the cached 404 (`ACCEPTANCE.md` X4.2, X4.4; `WALKS.md` W6.7; `PRD.md` diff item 8).

26. Two counter details are undefined. Nothing says whether the running total from the internal copy (the critic's test loads) is reset when the public site goes live. No bead owns rewriting the "since <date>" text to the production start date while keeping Last-Modified at 1997. Home: garage/pack/CONTENT_SEEDS.md § The 1997 page (date counting began); garage/pack/ACCEPTANCE.md V3, N2.4; PRD.md R44, Goals 4. SURPRISES-USER.

    **FIXED** — N2's deploy script resets the total to 0, writes the go-live date and sets the file time back to 1997-08-22 (`ACCEPTANCE.md` N2.3; `CONTENT_SEEDS.md` § The 1997 page; `PRD.md` R44 and diff item 8).

27. V2, V3 and L1 need production-server changes that the plan does not authorize. They need `tailscale serve --https=<port>` changes, a systemd timer, files under `/srv/` and a Node runtime for `count.mjs` (ENV_PREFLIGHT never checks for Node on the server). PLAN's outward actions allow only Caddy site additions on that server ("Nothing else outward"). Home: PLAN.md Build method (Outward actions); garage/pack/ENV_PREFLIGHT.md § The production server; garage/pack/ACCEPTANCE.md V2, V3, L1. SURPRISES-USER.

    **FIXED (I-11)** — authorized with guardrails: a new internal-network serve port only, a timer, files under `/srv`, Node if absent; each change scripted in `deploy/` with an undo script, validated before reload, the undo run once before close (`PLAN.md` Outward actions, Phase 6–7 steps; `PRD.md` R45, R56; `ACCEPTANCE.md` V2.1–2, V3.3, L1.7, N2.1; `ENV_PREFLIGHT.md` Node and undo rows).

28. The two files disagree about where the brand dossier comes from. CONTENT_SEEDS says the run "is given its location when it starts"; PLAN's changelog says it is "located by the run". The hands table does not name who supplies it, and ENV_PREFLIGHT does not check it is reachable. G2 and Phase 5 depend on it. Home: garage/pack/CONTENT_SEEDS.md § brand dossier paragraph; PLAN.md Changelog, § Where the run stops for Clive's hands; garage/pack/ENV_PREFLIGHT.md. SURPRISES-USER.

    **FIXED** — Clive hands the location over at C1 (`CONTENT_SEEDS.md` dossier paragraph; `PLAN.md` hands table, Phase 0 entry, and a changelog line correcting the earlier one; `ENV_PREFLIGHT.md` § Inputs handed over at C1; `CHECKPOINTS.md` C1).

29. If Clive rejects `$`/`=` at C2 and the Damm fallback is chosen, nothing says what replaces R18's four published vectors, CERT-001's identifier, the derived vectors, R6.2's regex or E1's locked tests. E1 may already be built by then, because Phase 2's engine steps do not wait for C2. Home: PRD.md R18, Inputs ready (research 4 bullet); garage/pack/CHECKPOINTS.md C2; garage/pack/CONTENT_SEEDS.md § Identifier vectors; garage/pack/ACCEPTANCE.md E1, R6.2. SURPRISES-USER.

    **FIXED (I-12)** — Crockford's mod-37 check symbol stays, odd final characters included, and is not revisited at C2. The C2 question, the identifier-on-paper item in DS7 and the Damm fallback are removed (`PRD.md` Inputs ready and HUMAN-JUDGED list; `CHECKPOINTS.md` C2; `CONTENT_SEEDS.md` § Identifier vectors).

30. The "(after C2)" boxes (E2.10, E3.6, S2.4, V1.1, V1.4) cannot be ticked while C2 is open. Beads close only with every box ticked, yet Phase 2's gate accepts "NO BAR … recorded as such". Nothing says whether those beads close, stay open or are reopened after C2, or who runs the blind pick then. Home: garage/pack/ACCEPTANCE.md Conventions ("after C2"), E2.10, E3.6, S2.4, V1; PLAN.md Build method (Closing a bead), Phase 2 exit gate. SURPRISES-USER.

    **FIXED** — such beads stay open; their phase may be `held` ("awaiting C2") while the next phase runs; on C2 the critic runs the waiting picks and the beads close (`PLAN.md` Build method "Waiting on C2", Phase 2 exit gate; `ACCEPTANCE.md` Conventions; `CHECKPOINTS.md`; `PRD.md` diff item 8).

31. C3 red-pens "become beads and the run continues", but no phase owns those beads and nothing says whether they must close before L5/C4. Some red-pens would hit strings locked verbatim at `specs-v1`: the empty-input sentence, the empty-portfolio sentence, the copy confirmation and the Terms and Privacy sentences. Those can only be re-tagged through "the next checkpoint packet", which is C4, the launch sign-off itself. Home: PLAN.md Build method (Tests are written first and locked), Phase 7 entry criteria; garage/pack/CHECKPOINTS.md C3; garage/pack/CONTENT_SEEDS.md § Drafts judged at C2/C3. SURPRISES-USER.

    **FIXED** — C3's beads must close before Phase 7 (`PLAN.md` Phase 7 entry; `ACCEPTANCE.md` L5.2; `CHECKPOINTS.md` C3); a red-pen on a locked string is itself the approval of the test change, applied and re-tagged by a separate test-author session (`PLAN.md` Build method; `CHECKPOINTS.md`; `PRD.md` diff item 8); RC7 lists the test file for each locked string.

32. The repository visitor has no walk and no requirements, though Goal 6 and Users name them ("whoever opens the repository … programs that read the records as data"). Nothing says what README.md contains, how a reader finds `company/`, which format or schema each record set uses, or how in-universe records are told apart from PRD, PLAN and `garage/`, which also go public. G0.2's "in-universe rule" text is not in the pack, and it points at `../AGENTS.md`, which is outside the repository. Home: PRD.md Goals 6, Users, R38; garage/pack/ACCEPTANCE.md G0.1–2; garage/pack/WALKS.md (no section exists). SURPRISES-USER.

    **FIXED** — `PRD.md` R57; bead RC8 (`README.md` and `company/README.md` in the company's voice, the repository map telling records from working documents); walk W9; `AGENTS.md` carries the rules itself from `CONTENT_SEEDS.md` § AGENTS.md rules, with no outside pointer (`ACCEPTANCE.md` G0.2; `PLAN.md` G0 step).

33. The menu's contents disagree between files. S1.2 says the menu reaches every R24 page except `/c/`, which would include the six sub-pages, the legal pages and the 404. W4.1 lists eight menu items and puts Terms and Privacy in the footer. DESIGN's footer has "the four legal and company links", against W4.1's three. Home: garage/pack/ACCEPTANCE.md S1.2; garage/pack/WALKS.md W4.1; DESIGN.md § Layout. POLISH.

    **FIXED** — eight menu items and three footer links, stated identically in `ACCEPTANCE.md` E0.2, `WALKS.md` W4.1 and `DESIGN.md` § Layout.

34. The certificate draft has the wrong times. For Folding chair in America/Chicago it prints local "10:52:00" and "Recorded 2026-10-03 15:52:00 UTC" beside `SH-00PP-9AGR-1GTB`. That identifier encodes 10:52:00Z, which is 05:52:00 local. Building D4's candidate from the draft breaks E3.3 (the UTC line must equal the decoded time). Home: garage/pack/CONTENT_SEEDS.md § Drafts judged at C2 items 7, 9; garage/pack/ACCEPTANCE.md D4.6, E3.3; PRD.md R18. POLISH.

    **FIXED** — local 05:52:00 and "Recorded 2026-10-03 10:52:00 UTC" (`CONTENT_SEEDS.md` certificate items 7, 9; `ACCEPTANCE.md` DS4.6).

35. The leadership bio lengths disagree. S2.2 requires 20–80 words per bio, and DESIGN says two or three sentences. The seeds that D5 builds from are 7–19 words for Len, Adrian, Lucas, Jules, Diane and Graham. Home: garage/pack/ACCEPTANCE.md S2.2, D5.2; DESIGN.md § Components (Leadership card); garage/pack/CONTENT_SEEDS.md § Leadership. POLISH.

    **FIXED** — one rule, two or three sentences and 20–60 words; all twelve seeds rewritten to 23–33 words (`CONTENT_SEEDS.md` § Leadership; `ACCEPTANCE.md` S2.2; `DESIGN.md` Leadership card).

36. R6.3 requires every sentence that states an ownership share to state both "Diane 51% and Vandalway 49%". The seed bios each state one share: Diane "Holds 51% of STILL HERE", Malcolm "Vandalway Industries' 49%". Home: garage/pack/ACCEPTANCE.md R6.3; garage/pack/CONTENT_SEEDS.md § Leadership. POLISH.

    **FIXED** — the rule is that every stated share is the right one (Diane 51%, Vandalway 49%), not both in each sentence (`ACCEPTANCE.md` RC6.3; `PRD.md` R41).

37. R9 and D4.1 forbid CSS and any `style` element inside the certificate SVG. R14 makes the PNG from "the same SVG with its fonts inlined", which needs `@font-face` in a style element. Nothing says where the PNG's version departs from the drawn SVG. Home: PRD.md R9, R14; garage/pack/ACCEPTANCE.md D4.1, E4. POLISH.

    **FIXED** — the drawn SVG carries no style; the PNG exporter adds its font `<style>` to a serialized copy only (`PRD.md` R9; `ACCEPTANCE.md` DS4.1).

38. The seal's ring text is drafted in verification green at certificate scale. That conflicts with sh-047, R53 and X5.3: verification green is never small text. Home: garage/pack/CONTENT_SEEDS.md § Drafts judged at C2 item 10; DESIGN.md § Colors; PRD.md R53; garage/pack/ACCEPTANCE.md X5.3. POLISH.

    **FIXED** — the seal is a green rosette with its ring text in graphite on paper (`CONTENT_SEEDS.md` item 10; `DESIGN.md` Certificate; `ACCEPTANCE.md` DS4.5; X5.3 now covers the certificate SVG).

39. The guestbook page's dates and path are inconsistent. V1.2 dates it 1999, but R43 and V4.1 require every page file's Last-Modified to be the 1997 "Last Updated" date. V2.3 leaves the link target open between `/cgi-bin/guestbook.html` and `/guestbook`. Home: PRD.md R43; garage/pack/ACCEPTANCE.md V1.2, V2.3, V4.1. POLISH.

    **FIXED** — one path, `/cgi-bin/guestbook.html`; `Last-Modified` per file: 1997-08-22 for the page and its images, 1999-03-02 for the guestbook page, the write time for the counter (`PRD.md` R42–R43; `ACCEPTANCE.md` DS6.5, V1.2, V2.3, V4.1; `CONTENT_SEEDS.md` § The 1997 page).

40. The rubric checks "no hex outside src/css/tokens.css" in any file. D1.1 limits that rule to CSS files. The certificate SVG fills, the manifest colours and the HTML 3.2 `BGCOLOR` all need hex values. Home: garage/pack/CRITIC_RUBRIC.md § Order of checks 2; garage/pack/ACCEPTANCE.md D1.1, X4.1, D6. POLISH.

    **FIXED** — one rule in both places: no hex literal in `src/` outside the generated `src/css/tokens.css` and `src/js/tokens.js`; the certificate and the manifest read the latter; `vandalwayind/` is exempt (`ACCEPTANCE.md` DS1.1, X4.1; `CRITIC_RUBRIC.md` check 2; `DESIGN.md` Agent Prompt Guide).

41. Labels are reused with different meanings. "R1–R7" names the Phase 5 beads, PRD requirements R1–R56 and research questions R1–R6 (BRAINSTORM: "supersedes R6's frozen counter"). "D1–D7" names the Phase 1 beads and decisions D1–D22: E3.2's "(D4)" means the decision, while ASSET_MANIFEST's "(D6)" means the bead. Home: PLAN.md Phase map; garage/pack/ACCEPTANCE.md § Phase 1, § Phase 5; PRD.md § Requirements; garage/BRAINSTORM.md § For research. POLISH.

    **FIXED** — beads renamed DS1–DS7 and RC1–RC8 across every pack file; `ACCEPTANCE.md` Conventions states the label scheme (PRD R-numbers, decisions D-numbers, answers I-numbers, research files as "research N").

42. The expected turns per phase add up to 1,020 (60+120+200+150+100+150+80+100+60), above the 1,000-turn ceiling. Nothing says what the run does when it reaches the ceiling. Home: PLAN.md Build method (Budget), each phase's Budget. POLISH.

    **FIXED** — estimates now sum to 1,050; the ceiling is 1,400; at the ceiling the run starts no new bead, lets running Workers return, writes a ceiling packet and `SESSION_STATUS.md`, and stops (`PLAN.md` Build method; `PRD.md` diff item 8).

43. E1.5's "grep for the alphabet string finds one file" has no scope. The string also appears in CONTENT_SEEDS.md, so the test fails as written unless it is limited to some folders. Home: garage/pack/ACCEPTANCE.md E1.5; garage/pack/CONTENT_SEEDS.md § Identifier vectors. POLISH.

    **FIXED** — scoped to `src/`, `scripts/` and `deploy/` (`ACCEPTANCE.md` E1.5).

44. R56 says `deploy/` contains no hostname, but the public Caddy block for N2 must name vandalwayind.com. Which hostnames are barred is not stated. Home: PRD.md R56; garage/pack/ACCEPTANCE.md V2.1, N2.2. POLISH.

    **FIXED** — the two public domains are allowed; no address, staging hostname or internal-network name (`PRD.md` R56; `ACCEPTANCE.md` X6.4).

45. The case studies withhold the customer's name because sh-026's written permission is not on file. The records that go public carry her name and address (`eileen.webb@municipal.example`; `customers.yaml` lists "eileen"). No line says whether the permission rule also covers the repository. Home: PRD.md diff item 8 (case studies); garage/pack/CONTENT_SEEDS.md § Records (Addresses); garage/pack/ACCEPTANCE.md G2.2, R1.1. POLISH.

    **FIXED (I-09)** — the customer is named in the case studies and the records alike; Clive published them without asking her, and no record shows anyone asked. The withholding call is removed from the PRD (`PRD.md` R28, diff items 8 and 12; `ACCEPTANCE.md` S4.2, S4.4, S7.3, RC6.7; `CONTENT_SEEDS.md` case studies, Enterprise, Continuity).

46. The named owner of the security.txt renewal is Martin, an in-universe character. No real person, reminder or channel carries the renewal date after launch, and the CI expiry check only runs when someone pushes. Home: PRD.md R35; garage/pack/ACCEPTANCE.md X2.3, N3.5. POLISH.

    **FIXED** — Martin stays the named owner; added, as my call for C1, a weekly scheduled workflow that only opens an issue 30 days before `Expires`, assigned to the account in the repository variable `RENEWAL_ASSIGNEE` (the repository owner, set at launch; never in a file). It never commits. Stated limit: GitHub disables scheduled workflows after 60 days without repository activity (Exploration 14), so the date in `PROJECT.md` remains the backstop (`ACCEPTANCE.md` L2.4, N1.1, N3.6, X6.2; `PRD.md` R35, Non-goals, diff item 8).

47. W1 steps 6–10 (downloads, Check another, the script-tag name, no dead end) are outside E2's walk spec, which covers "W1 steps 1–5, W8". R6's "Check another empties the input and puts the cursor in it" has no acceptance item in any E bead and is first checked at L5. Home: garage/pack/ACCEPTANCE.md E2–E4 BROWSER PASS; PRD.md R6; garage/pack/WALKS.md W1.8. POLISH.

    **FIXED** — E2's walk covers W1 steps 1–5 and 8–10 and W8; E4's walk covers W1 steps 6–7; Check another is E2.12.

48. Several counts and paths are out of date. ASSET_MANIFEST says 30 of 32 files carry a C2PA manifest but names s07 as the only one without, which makes 31. HANDOFF's HUMAN-JUDGED table says four portraits break the house look; DESIGN and ASSET_MANIFEST name two. The parent logo is at `../brand/` in ASSET_MANIFEST and `../../brand/` in HANDOFF. Home: garage/pack/ASSET_MANIFEST.md § Rules, § The brand; garage/HANDOFF.md § HUMAN-JUDGED, § Inputs; DESIGN.md § Components. POLISH.

    **FIXED** — 31 of 32 carry a manifest, 30 naming the software; the four portraits named in `ASSET_MANIFEST.md` and `DESIGN.md`; the parent logo described as `brand/` beside the repository (HANDOFF's `../../brand/` is the same place seen from `garage/`, and stays).

49. The phone checklist runs only on staging, which is on the internal network. Nothing says Clive's iPhone must be on that network. The iOS and printed-QR promises of Goals 1–2 ("on the public internet") are never re-run on production, and W-DoD leaves out W2.7. Home: garage/pack/WALKS.md § Phone checklist, W-DoD; garage/pack/ENV_PREFLIGHT.md; PRD.md diff item 7, Goals 1–2. POLISH.

    **FIXED** — the checklist states the phone must be on the internal network; a two-minute production re-check (items 1, 2, 4, 6, 9) is recorded in N3.5; W-DoD includes W2.7 by its substitute (`WALKS.md`; `PLAN.md` hands table; `CHECKPOINTS.md` C4 and Record; `PRD.md` diff item 8).

50. `access-control-allow-origin: *` on production presence.json rests on a check of another Pages site, not ours. Pages cannot set headers, and no fallback is written if N3.2 finds the header missing. Home: PRD.md R34; garage/pack/ACCEPTANCE.md X1.2, N3.2; garage/HANDOFF.md § Unverified assumptions. POLISH.

    **FIXED** — if production does not send the header, the finding is recorded and `PRD.md` R34 is amended to state what production sends; static hosting allows no other fix (`ACCEPTANCE.md` N3.2).

51. Private vulnerability reporting is enabled at N3, after the site goes live at N1. Until then, security.txt's Contact URL leads nowhere. Home: PRD.md R35; garage/pack/ACCEPTANCE.md N1, N3.1. POLISH.

    **FIXED** — enabled first in N1, before the first Pages deploy (`ACCEPTANCE.md` N1.1; `PLAN.md` N1 step; `PRD.md` R35).

## Changelog

- 2026-10-03 — Filed the 51 findings verbatim with their dispositions; four answered by Clive as I-09 to I-12. (Jules, 2026-10-03)
