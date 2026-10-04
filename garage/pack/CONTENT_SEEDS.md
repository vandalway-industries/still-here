---
updated: 2026-10-03
read_by: every Worker that writes a string a visitor or a reader will see (before writing it); G2 (files the seeds); Phase 5 (writes the records in full); T0 (copies the fixed strings into the tests); the critic (checks "verbatim" against this file); Clive at C2 and C3 (the drafts)
relations:
  derived_from: ../HANDOFF.md
---

# Content seeds — where every authored text comes from

Three kinds of text. **Fixed strings** were decided and are copied, never retyped. **Drafts** are
the first cut of everything taste decides; the loop builds with them, and Clive approves or
red-pens them at the named checkpoint. **Records** are the company's documents, filed from the
brand dossier in Phase 0 and written in full in Phase 5. Comedy, voice and brand are never
looped on (factory §3b rule 6): one pass, then the table read. (Jules, 2026-10-03)

**The brand dossier** is the company's working dossier. It is not kept in this repository. Clive
hands the run its location at C1, together with the continuity fixture (§ Continuity fixture);
`ENV_PREFLIGHT.md` checks both are readable before G2. Phase 0 and Phase 5 read only these sections of it: "The
company and its product", "Cast and voices" (with "Relationship rules" and "Anchor dialogue"),
"First sample week: The Baseline Incident", "Inventory and gum graph seeds", "Visual and asset
direction". Nothing else in it is filed, quoted or paraphrased. G2's hash check enforces this.

## Fixed strings

| Where | Text, verbatim | Source |
|---|---|---|
| Home heading | Is it still here? | Q13 |
| Button | Check presence | BRAINDUMP |
| Sequence line 1 | Establishing here. | BRAINDUMP step 3 |
| Sequence line 2 | Comparing here with here. | BRAINDUMP step 3 |
| Sequence line 3 | No actionable elsewhere detected. | BRAINDUMP step 3 |
| Result heading | STILL HERE. | BRAINDUMP step 4 |
| Result actions | Download PDF · Download PNG · Copy certificate link · Check another | HANDOFF W1 |
| Certificate footer | Confirms successful completion of this form. No physical inspection occurred. | Q4 |
| Time-zone label | Jurisdiction of here: <IANA zone> | D4 |
| Reopen / verify confirmation | Issued by STILL HERE for '<name>' on <D Month YYYY> at <HH:MM:SS> (<zone>). | Q7; e.g. "Issued by STILL HERE for 'Folding chair' on 3 October 2026 at 05:52:00 (America/Chicago)." Verify by hand writes "(UTC)". |
| Not located (typo, mismatch, malformed) | We could not locate this certificate. The object, however, is still here. | Q7, D3 |
| Future-dated | This certificate has not been issued yet. The object, however, is still here. | D3 |
| 404 | We could not locate this page. The page, however, is still here. | Q19 |
| Enterprise call to action | Enterprise clients: please remain where you are. A representative will be in touch. | Q8 |
| Status constant | All systems operational | Q11 |
| Status titles | Unexpected concentration of elsewhere on floor three · Scheduled relocation of the flagship research asset (Fridays) · Investigating reports of a bench | Q11 |
| Footer acknowledgement | A Vandalway Industries company | Q12 |
| Jules's bio, required phrase | Previously created WHERE-r-YOU | Q17 |
| Research, long paper | Full text available to Enterprise clients. | D16 |
| `presence.json` body | `{"status":"STILL HERE"}` | D9 |
| Examples, in order | Car keys · Phone · Wallet · Glasses · Folding chair · The Moon · A hot-air balloon · An emotional-support peacock · A time capsule (contents unknown) · A lighthouse | Q10 (capitalized for display; the order and the words are fixed, the display wording is judged at C2) |
| Careers titles | Senior Presence Engineer · Customer Support Contractor (six weeks) · Director of Elsewhere (on hold) | D15 |
| Guestbook page title | Guestbook temporarily unavailable | D19 |

**Interface strings.** Decided at C1 as calls (PRD diff item 8), shown at C2 or C3, and locked in the
tests at `specs-v1`; a red-pen changes them through the re-tag rule in `CHECKPOINTS.md`.

| Where | Text, verbatim |
|---|---|
| Under the home heading | Name an object. We will confirm its presence. |
| Empty input | Name an object to check its presence. |
| Result, portfolio line | Kept in Your Presence Portfolio on this device. (the last four words link to `/portfolio`) |
| Clock before 2026 | Your device's clock reads earlier than 1 January 2026, a moment our records cannot express. The object, however, is still here. |
| Export in progress | Preparing PDF… · Preparing PNG… |
| Export failed | The file could not be prepared. Your certificate is still here: try again, or copy its link. |
| Copy confirmation | Certificate link copied. |
| Clipboard refused | Copy this link to keep the certificate: |
| Long-name counter (from 61 code points) | <n> / 80 |
| `/c/` and Verify, after a mismatch or a future date | Verify a certificate · Check an object |
| Verify labels and button | Certificate identifier · Object name · Verify |
| Verify with an empty field | Enter the certificate identifier and the object's name. |
| Portfolio heading | Your Presence Portfolio |
| Portfolio empty | Nothing has been certified on this device yet. Everything you certify here stays here. |
| Portfolio entry actions | Open · Download PDF · Download PNG |
| 404 link | Return home |

**Dates and times.** English, whatever the browser's locale; day, month name, year; 24-hour clock,
zero-padded. Result screen: "3 October 2026, 05:52:00". Confirmation sentence: "on 3 October 2026
at 05:52:00 (America/Chicago)". Portfolio: "3 October 2026, 05:52 · America/Chicago". The
certificate's date line is written out in words (below).

**Download filenames.** `STILL-HERE-<slug>-<identifier body>.<pdf|png>`. Slug: the canonical name,
decomposed (NFKD), combining marks removed, lower-cased, every run of characters outside `a–z` and
`0–9` replaced by one hyphen, hyphens trimmed from both ends, cut to 40 characters at the last hyphen
inside the limit (or at 40 if there is none); `object` when nothing is left. Identifier body: the 11
symbols between `SH-` and the check symbol, hyphens removed.

## Identifier vectors

Published (research 4), the bar for E1: `Folding chair` 2026-10-03T10:52:00Z → `SH-00PP-9AGR-1GTB`;
`folding  CHAIR ` same instant → `SH-00PP-9AGR-1GTB`; `Memorial bench` 2026-10-03T10:52:01Z →
`SH-00PP-9AHN-M3JT`; `The Moon` 2026-10-03T10:52:00Z → `SH-00PP-9AG8-3CK2`.

Construction, as the published vectors fix it: seconds since 2026-01-01T00:00:00Z as 7 Crockford
symbols; the 4 hash symbols are the first 20 bits of SHA-256(canonical name + `|` + the 7 time
symbols), most significant first; the check symbol is the 11-symbol body's value mod 37 from
`0123456789ABCDEFGHJKMNPQRSTVWXYZ*~$=U`.

Derived, computed 2026-10-03 with a reimplementation that reproduces all four published vectors
(E1 must agree, or this line is wrong and is corrected in the same commit):
`A time capsule (contents unknown)` 2027-10-03T10:52:00Z → `SH-01MR-P6G7-6TA1` (the future case
for W2 step 5, until 2027-10-03); `Folding chair` 2026-10-02T09:01:00Z → `SH-00PK-EEC2-0EPR`
(CERT-001); `Memorial bench` 2026-10-01T15:40:00Z → `SH-00PH-HEGC-M3YK` (the certificate Eileen
Webb received, quoted in SUPPORT-001's attachment header).

The check symbol is Crockford's mod 37, odd final characters (`* ~ $ = U`) included (I-12).

**Records that quote identifiers** (RC6 finds at least these): CERT-001 (`SH-00PK-EEC2-0EPR`) and
SUPPORT-001 (`SH-00PH-HEGC-M3YK`). A Phase 5 author may quote more; each must recompute.

## Drafts judged at C2

**The certificate** (Clive's register at the top, Diane's at the foot; Q4). Lines in order:
1. Wordmark "STILL HERE™" with the mark; beneath it, small: "A Vandalway Industries company".
2. "CERTIFICATE OF CONTINUED PRESENCE"
3. "This certifies that"
4. The name, as typed.
5. "was, at the moment recorded below, confirmed to be"
6. "STILL HERE."
7. "Issued on the third day of October, two thousand twenty-six, at 05:52:00" (the local date and
   time written out in words, in the issuer's zone; 10:52:00Z is 05:52:00 in America/Chicago).
8. "Jurisdiction of here: America/Chicago"
9. Identifier block: "Certificate SH-00PP-9AGR-1GTB" · "Recorded 2026-10-03 10:52:00 UTC".
10. Seal (lower right): a green rosette; around it, in graphite on paper, the ring text "STILL HERE ·
    OFFICE OF CONTINUED PRESENCE · STILL HERE ·" (green is never small text, sh-047).
11. Two signatures over: "Clive Standish, Founder" and "Diane, Quality Assurance".
12. QR code (lower left) with, beneath it, small: "Verify at isitstillhere.com/verify".
13. Footer: the fixed string.

**Home.** The interface strings above. A short band below the ritual, beside `s01`: "ASSET 001 · FOLDING CHAIR ·
STATUS: STILL HERE" as a label, then: "Our flagship research asset has been certified every
Friday since records began. It has moved. It is still here."

**Leadership** (titles from `company/tracker/TRACKER.md` § People; bios are first cuts in the
company's voice, from the cast table, two or three sentences and 20–60 words each; all twelve
judged at C2 on the golden, finished at C3):

| id | Name | Title | Bio seed |
|---|---|---|---|
| clive | Clive Standish | Founder | Founded STILL HERE to give remaining the recognition it has always deserved. He believes nobody has ever complained that a certificate was too official, and he has not yet been proved wrong. |
| diane | Diane | Quality Assurance | Diane holds 51% of STILL HERE and leads quality assurance. She has read the source, approved it, and moves the test chair every Friday to make sure it still does what it says. |
| martin | Martin Bell | Customer Support | Martin joined in 2014 on a six-week contract and remains the company's longest successful retention. He answers every message in the support inbox, courteously and completely. |
| jules | Jules Mercer | Developer | Previously created WHERE-r-YOU. Jules writes the presence check, which returns exactly what it promises, and documents it so precisely that it has never once surprised anyone. |
| petra | Dr. Petra Voss | Director of Positional Research | Dr. Voss is the author of the company's research on here, there and the emerging elsewhere. Meetings with her remain provisional; her papers, with their footnotes, do not. |
| susan | Susan Pritt | Accounting | Susan reconciles every purchase, every receipt and every stick of gum the company buys. Her attachments are available on request, and frequently without one. |
| lucas | Lucas | Intern | Lucas runs lunch logistics for the office. He is currently exploring a more distributed model of presence, and his receipts are always enthusiastic. |
| graham | Graham Pike | Facilities | Graham keeps the building, the third-floor microwave and the right to a hot lunch in working order. He tests every repair thoroughly, usually at 11:45. |
| len | Len | Head of Internal Communications | Len keeps everyone in the company informed, one message at a time. No announcement is too small for him to send, and few are sent only once. |
| adrian | Adrian Vale | VP of Presence | Adrian leads Presence across the company and accepts every meeting he is invited to. He is camera optional, and his calendar has never declined a thing. |
| bev | Bev | Office Manager | Bev is the founding office manager. She knows where everything is, who has it, and exactly why the second-floor printer is the way it is. |
| malcolm | Malcolm Venn | Vandalway Liaison | Malcolm represents Vandalway Industries' 49% of STILL HERE. He brings the portfolio's keen interest in movement on the stillness roadmap to every conversation. |

Adrian's "Camera optional" is the company's line; Bev's NOTE-001 disputes it in the records. Lucas's
line is Clive's (sh-054). Nothing here says where Lucas works.

**The 1997 page** (Q14; research 6's element list; D17–D22; built in-house, so the sign and
the badge belong). Order, top to bottom: logo GIF; "Welcome to Vandalway Industries!" and two
paragraphs of earnest company prose about productizing what people already do; `<HR>`; bracketed
menu "[ About Us ] [ Our Companies ] [ Guestbook ] [ E-Mail ]" (anchors on the same page, and the
guestbook link to `/cgi-bin/guestbook.html`); `<HR>`; an "Our Companies" paragraph naming no company (Q16 rules MONOvision out;
STILL HERE did not exist in 1997 on this page's own terms — the paragraph says new ventures are
"coming soon"); the Sunday-market photograph, no caption; `<HR>`; "Call us toll-free! ( M-F 9a-5p
Central ) 1-800-555-0142"; "E-mail: webmaster@vandalwayind.com" with the animated icon; the under-construction
sign; the Netscape badge; the counter line "This page has been visited [counter] times since
<the date counting began, written as Month D, YYYY>."; the relocation line; "Last Updated August
22, 1997"; "Page built in-house by Clive S."; "Copyright © 1996-1997 Vandalway Industries".
Relocation line, draft: "This page has moved to its own address. Please update your bookmarks." —
one sentence, explaining the move and nothing else (Exploration 10). The date counting began is
the go-live date, written by N2's deploy script, which resets the running total to 0 and sets the
file time back to 1997-08-22; the internal copy shows its own start date until then. Guestbook
page: "Guestbook temporarily unavailable", "Our guestbook is being upgraded. Please check back
soon!", "Last modified March 2, 1999", served with that date. All prose judged at C2 (layout)
and C3 (words).

## Drafts judged at C3

- **Research** (D16; the papers are written in S3, Phase 3): *Competitive Landscape: Here, There, and Emerging Elsewhere* — abstract
  verbatim from RESEARCH-001, contents of 86 pages, dated 2026-10-01 (the day it was attached to
  CAL-001's cancellation). Short paper 1: *On the Directionality of Here* — cited as forthcoming
  in sh-030 with a §3 of that name; published 2026-09-14; 2–4 pages. Short paper 2: *Six Feet to
  the Left: A Note on Displacement Within Here* — the Friday test of 2026-10-02 and why it does not,
  by itself, evidence the defect (sh-051, Petra's comment); published 2026-10-02. Covers drawn in
  code: institutional typography and a chart so flat it looks unfinished (the brand dossier's
  brief).
- **Case studies** (sh-026's three verticals, verbatim as subjects): "Municipal infrastructure:
  securing the continuity of a civic asset register" · "Public seating: certifying a city's
  commitment to rest" · "The civic rest sector: presence as a public service". All three are the
  same archivist, register and bench (Diane: "These are the same customer."). Facts to keep: 214
  items of street furniture; 38 certified by 2026-05-11, several from the office; the bench
  removed in April; certified anyway. The customer is named, Eileen Webb, municipal archivist
  (I-09); Clive published them without asking her, and no record shows anyone asked.
- **Enterprise**: bulk certification "for municipalities and the civic rest sector"; testimonials,
  verbatim from records, attributed "— Eileen Webb, Municipal Archivist": "The certificate came through
  beautifully." (SUPPORT-001) and "We have certified 38 so far." (sh-025, 2026-05-11).
- **Status** (written in S5, Phase 3): STILL HERE's public updates, in `company/status/status-updates.xml`:
  STATUS-001, 2026-09-29 12:10 — "Unexpected concentration of elsewhere on floor three", body:
  "All systems operational. We are investigating reports of an unexpected concentration of
  elsewhere on floor three." (verbatim); STATUS-002, 2026-10-02 09:00 — "Scheduled relocation of
  the flagship research asset (Fridays)", body drafted from QA-001; STATUS-003, 2026-10-02 09:40 —
  "Investigating reports of a bench", body drafted from SUPPORT-001/002. Martin writes the bodies
  (sh-036).
- **Careers**: each posting a short description and requirements in the company's voice; the
  application line drafted as "We will find you." (nothing collected, Q8). Photographs per
  `ASSET_MANIFEST.md`.
- **Terms of Presence**, required sentences (each verbatim in the page; prose around them is
  Diane's, judged at C3):
  1. "Every certificate confirms successful completion of this form. No physical inspection occurred."
  2. "Every object receives the same certificate."
  3. "The certificate identifier is a checksum calculated in your browser. It catches typing errors and casual edits. Anyone who reads our code can produce a valid one."
  4. "A certificate link contains the name of the object it certifies."
- **Privacy**, required sentences:
  1. "This site runs no analytics and loads nothing from any other website."
  2. "Our host, GitHub Pages, logs visitors' IP addresses for its own security. We cannot read those logs."
  3. "Your Presence Portfolio is kept in your browser on your device. We never receive it."
  4. "Safari may clear it if you do not use STILL HERE within seven days of browsing. Clearing your browser's data for this site clears it too."
  5. "The object's name and time in a certificate link come after the # and are never sent to any server or written to any log."
  6. "Your time zone is read by your browser to print on your certificate and is never sent anywhere."
  7. "The server for vandalwayind.com keeps an access log for its hit counter. The log is deleted after seven days; only the running total is kept."
  8. "Mail sent to isitstillhere.com or vandalwayind.com is refused. Nothing is received."

## Records

Paths under `company/`. "P0" = filed verbatim in Phase 0 (G2) from the brand dossier's
sample week; "P3" = written in Phase 3 by the page that shows it (S3, S5); "P5" = written in full
in Phase 5. Times are UTC instants as `tracker.jsonl` writes
them (ISSUE-001 is 09:27Z in both). Addresses: staff and Vandalway `<id>@vandalway.example`; the
customer `eileen.webb@municipal.example`. The tracker already holds several of these as issues
(cross-referenced); the files below are the documents themselves.

| Id | Path | Format | When (UTC) | Author → to | Phase | Tracker |
|---|---|---|---|---|---|---|
| MAIL-001 | correspondence/MAIL-001.md | Markdown mail | 2026-09-28 09:05 | malcolm → clive, diane | P0, headers P5 | sh-020 |
| MAIL-002 | correspondence/MAIL-002.md | Markdown mail | 2026-09-28 09:18 | clive → malcolm, diane | P0, headers P5 | — |
| ISSUE-001 | tracker (sh-051) | JSONL + Markdown | 2026-09-28 09:27 | diane | written | sh-051 |
| CHAT-001 | chat/general-2026-09-29.md | Markdown chat | 2026-09-29 11:42 | len, fifteen messages | P0 | sh-014 |
| FAC-001 | notes/FAC-001.md | Markdown note | 2026-09-29 11:44 | graham | P0 | sh-053 |
| INC-001 | status/notes.xml | XML | 2026-09-29 11:45 | martin | P0 | sh-053 |
| STATUS-001 | status/status-updates.xml | XML | 2026-09-29 12:10 | martin (public) | P0 | sh-053 |
| EXP-001 | correspondence/EXP-001.md | Markdown mail | 2026-09-30 10:16 | lucas → martin | P0, headers P5 | sh-048 |
| MAIL-003 | correspondence/MAIL-003.md | Markdown mail | 2026-09-30 10:31 | susan → lucas, martin | P0, headers P5 | sh-048 |
| ISSUE-002 | tracker (sh-054) | JSONL + Markdown | 2026-09-30 11:03 | martin | written | sh-054 |
| CAL-001 | calendar/CAL-001.md | Markdown | 2026-09-28 – 2026-10-01 | petra | P0 | sh-052 |
| RESEARCH-001 | research/competitive-landscape.md | Markdown + front matter | 2026-10-01 | petra | P0 abstract, P3 contents (S3) | sh-052 |
| MAIL-004 | correspondence/MAIL-004.md | Markdown mail | 2026-10-01 15:02 | susan → clive | P0, headers P5 | sh-008 |
| NOTE-001 | notes/NOTE-001.md | Markdown note | 2026-10-01 15:20 | bev | P0 | sh-007 |
| QA-001 | notes/QA-001.md | Markdown note | 2026-10-02 09:00 | diane | P0 | sh-051 |
| CERT-001 | certificates/CERT-001.json | JSON fixture | 2026-10-02 09:01 | public product | P0 (identifier `SH-00PK-EEC2-0EPR`) | sh-051 |
| SUPPORT-001 | correspondence/SUPPORT-001.md | Markdown mail | 2026-10-02 09:14 | eileen → martin | P0, headers P5 (incl. the attachment header quoting `SH-00PH-HEGC-M3YK`) | sh-025 |
| SUPPORT-002 | correspondence/SUPPORT-002.md | Markdown mail | 2026-10-02 09:32 | martin → eileen | P0, headers P5 | sh-025 |
| STATUS-002 | status/status-updates.xml | XML | 2026-10-02 09:00 | martin (public) | P3 (S5) | sh-051 |
| STATUS-003 | status/status-updates.xml | XML | 2026-10-02 09:40 | martin (public) | P3 (S5) | sh-025 |
| MAIL-005 | correspondence/MAIL-005.md | Markdown mail | 2026-10-02 16:00 | clive → malcolm | P0, headers P5 | sh-020 |
| MAIL-006 | correspondence/MAIL-006.md | Markdown mail | 2026-10-02 16:04 | diane → same thread | P0, headers P5 | sh-020 |
| Floor counts | status/notes.xml | XML | 2026-09-28 – 2026-10-02, 11:50 each day | martin | P5 | sh-014 |
| Directionality | research/directionality-of-here.md | Markdown + front matter | 2026-09-14 | petra | P3 (S3) | sh-030 |
| Six feet | research/six-feet-to-the-left.md | Markdown + front matter | 2026-10-02 | petra | P3 (S3) | sh-051 |
| Staff | staff/staff.yaml, staff/customers.yaml | YAML | — | bev | P0 | People |
| Inventory | inventory/inventory.yaml, inventory/HERE_FINAL_2008_USE_THIS_ONE.xml | YAML, SpreadsheetML 2003 | as of 2026-10-02 | bev | P0 YAML, P5 XML | sh-054 |
| Gum graph | gum-graph/ | OKF v0.1 bundle | as of 2026-10-01 | susan | P0 seed, P5 full | sh-008 |

Floor counts (Martin, 11:50 daily; P5 writes the other floors): Tuesday 2026-09-29, floor three:
0, amended to 1 "on reflection" (Graham, found on the stairs; sh-014). Martin's other figures are
his to author; none may contradict sh-014 or sh-053.

**Inventory seed** (as of 2026-10-02; recorded status only, with evidence):
stapler-01 present · chair-01 present (moved six feet to the left 2026-10-02 09:00; QA-001) ·
lucas unknown (last seen here 2026-09-08 11:20, leaving on the lunch run; receipts since: sh-048,
EXP-001) · adrian unknown (NOTE-001; sh-007) · bench-01 absent (removed in April per the
customer; SUPPORT-001). The brand dossier's "story truth" column is **not** filed: a record
holds only what its author knows.

**Gum graph seed** (Susan's, observation kept apart from inference): people as concepts; Diane
and Jules observed with the same unspecified sugar-free gum (an observation, recorded by Susan;
"Matching flavor is an observation. Your interpretation is not reimbursable."); Clive's twelve
access requests, each declined (sh-008); Lucas's unresolved gum reimbursement, pending flavor
disclosure (MAIL-003). Flavors not yet established are authored in Phase 5 and judged at C3.

**Continuity** (enforced by RC6, held by every author): ownership 51% Diane, 49% Vandalway; no
record by staff states where Lucas works now; Adrian sends nothing after the 2022 holiday party
(2022-12-16) except automatic replies and calendar acceptances; Martin's restored record is a
restored staff record and inbox, not a second Martin; Diane and Jules stay ambiguous; Eileen is the
one actual customer, named in the case studies, and nobody asked her first (I-09); Malcolm
represents the 49%, not the controlling vote; MONOvision is not on either site.

## Continuity fixture

`tests/fixtures/continuity-hashes.json` lets the tests catch two kinds of text without the
repository, or the run, ever holding the phrases themselves. **Clive supplies it at C1**, with the
brand dossier's location; the run copies it unchanged in G2 and never edits it.

- Shape: `{"salt": "<32 hex characters>", "confidential": ["<hex>", …], "unknown-to-staff": ["<hex>", …]}`.
- `confidential`: two- and three-word phrases that must never appear in the company's records.
  `unknown-to-staff`: phrases that would state a fact no member of staff knows (where Lucas works now).
- Normalization of a phrase, and of the text it is checked against: Unicode NFC; lower case;
  every character other than a letter, a digit or an apostrophe becomes a space; runs of spaces
  collapse; the text is then read as overlapping two- and three-word phrases.
- Hash: hexadecimal SHA-256 of the salt, one newline, then the normalized phrase, UTF-8.
- One line of Python builds a hash: `hashlib.sha256((salt + "\n" + phrase).encode()).hexdigest()`.

## AGENTS.md rules

The working rules G0 writes into the repository's `AGENTS.md`, in the company's own words. They
replace any pointer to a file outside the repository.

- Everything in this repository is written by Vandalway Industries' STILL HERE team, about the
  product they make. Product copy, records, plans and beads speak as the company and its people.
- Each file has an author of record: `PRD.md` Diane; `PLAN.md` Jules, its Retro Bev; `DESIGN.md`
  Jules; `SESSION_STATUS.md` Martin; `PROJECT.md` Malcolm; `garage/BRAINDUMP.md` Clive;
  `garage/BRAINSTORM.md` Petra. Marks read `(Name, YYYY-MM-DD)`, with the date from `date +%F`.
  Beads are filed by the character who owns them, `<id>@vandalway.example`.
- Records keep each character's voice and knowledge: people know only what the records show they
  know. Ownership is 51% Diane, 49% Vandalway. A character's claim is not a fact about the
  software; documentation says what the code does.
- The voice may be the company's; the facts may not be invented. A status note that says the tests
  pass means they passed. Real deployments, test results and approvals are never fabricated.
  Commits keep their real author; in-story history lives in `company/`, never in git identities.
- No name of anyone outside the company appears anywhere in the repository.
- The company is Vandalway, spelled with a w.

## Changelog

- 2026-10-03 — Written at stage 11: fixed strings, identifier vectors (two derived), drafts for C2 and C3, the enumerated record set. (Jules, 2026-10-03)
- 2026-10-03 — Blind read applied: interface strings, date and filename rules, a third derived vector and the records that quote identifiers, the certificate's times corrected, the seal's text in graphite, bios lengthened to 20–60 words, papers and status updates written in Phase 3, the customer named (I-09), mod 37 kept (I-12), the continuity fixture and the AGENTS.md rules. (Jules, 2026-10-03)
