---
updated: 2026-10-03
read_by: the build-readiness auditor (stage 9, appends its final section); the PRD/PLAN author at the PLAN gate; `/goal` at BUILD entry (with PLAN.md)
relations:
  derived_from: BRAINSTORM.md
---

# STILL HERE — HANDOFF

> **The baton from shaping into building.** Clive curates, Jules drafts. What is settled, what
> is still open (carried, not forced), priorities marked CHALLENGEABLE, the inputs, and — last —
> the build-readiness gap list. Scope still enters at PLAN, not here: curation is research
> direction, not narrowing.

Drafted by Jules, 2026-10-03, from BRAINDUMP, BRAINSTORM (Organized, Q1–Q14, Exploration 1–19) and
research 1–6. Every line cites where it was settled. Where I have added a recommendation it says so.
(Jules, 2026-10-03)

## Settled

**The product**
- **Q:** What is it? **A:** A visitor names an object, presses **Check presence**, watches a staged
  verification ("Establishing here." "Comparing here with here." "No actionable elsewhere
  detected."), and receives a certificate: **STILL HERE.**, the name, a timestamp and an identifier;
  then downloads it or checks another. *(BRAINDUMP)*
- **Q:** What does an object we know is absent get? **A:** The identical certificate. No exceptions,
  no tells. *(Q1)*
- **Q:** How long does verification take? **A:** About 4–5 seconds, identical for every object; three
  lines under an indicator that never moves; reduced motion shows the lines without animation. *(Q5)*
- **Q:** Which examples sit under the input? **A:** Everyday things (car keys, phone, wallet,
  glasses), "Folding chair", and five exotic items: the Moon, a hot-air balloon, an
  emotional-support peacock, a time capsule (contents unknown), a lighthouse. *(Q10)*

**The certificate**
- **Q:** What is on it? **A:** Clive's language at the top ("This certifies that…", seal,
  signatures); Diane's footer at the bottom in small type, verbatim: "Confirms successful completion
  of this form. No physical inspection occurred." *(Q4)*
- **Q:** In what format? **A:** Drawn once as SVG in the browser and exported to PDF and PNG.
  *(Q3; research 2 recommends jsPDF + svg2pdf.js for PDF, canvas for PNG, both MIT)*
- **Q:** Does the identifier mean anything? **A:** Yes. A Verify page recomputes it from name and time;
  a mismatch reads "We could not locate this certificate. The object, however, is still here." It is
  a browser checksum: catches typos, forgeable by anyone who reads the code; the legal page says so.
  The identifier carries its own date (research 4, Branch B); records before 2026 quote none. *(Q7, Q18)*
- **Q:** How does a certificate outlive the browser? **A:** A link carrying name and time after the
  `#`, plus "Copy certificate link." The fragment never reaches a server. *(Q13; research 5)*

**The site and the company**
- **Q:** One page or a site? **A:** A company website: the ritual as home page, plus leadership,
  research, case studies, status, careers, legal (Terms of Presence, Privacy). *(Q2)*
- **Q:** Accounts? **A:** None. An Enterprise page for "the civic rest sector" with no form:
  "Enterprise clients: please remain where you are. A representative will be in touch." *(Q8)*
- **Q:** What does the site remember? **A:** A Presence Portfolio in the visitor's own browser only;
  best-effort, because Safari deletes it after 7 days without a visit. *(Q6; research 5)*
- **Q:** Status page? **A:** "All systems operational," always, with an authored incident history.
  *(Q11)*
- **Q:** Where are the internal records? **A:** In the public repository, not on the site. *(Q9)*
- **Q:** What does the footer acknowledge? **A:** "A Vandalway Industries company" links to Vandalway's
  1990s page at **vandalwayind.com**: built in-house in 1997 (under-construction sign, "best viewed in
  Netscape", animated email icon, guestbook broken since 1999), never updated, its only photo the
  uncaptioned market snapshot `assets/s09`. MONOvision is not mentioned; my bio says I previously
  created WHERE-r-YOU. *(Q12, Q14, Q16, Q17)*

**Additions** *(Q19, Q20)*
- QR code in the certificate; reopening a link and verifying are one page; the 404 borrows Q7's
  sentence. `presence.json`. `security.txt` with its required expiry. Installable and offline.
- On the 1990s page: a live hit counter from that server's own log, and a relocation line. On the
  certificate: the visitor's time zone. A real address that auto-replies in Martin's voice and keeps nothing (Q22). Not taken: the
  scheduled Friday test. Later: the published-key signature.

**Platform**
- **Q:** Hosting? **A:** Static HTML, CSS and JavaScript. Staging on the internal network only;
  launch on GitHub Pages at **isitstillhere.com**. Publishing by Actions from the site folder only, so
  records never become pages, is research 3's recommendation and follows from Q9. vandalwayind.com is served from our own server. *(BRAINDUMP; research
  1, 3; domains purchased 2026-10-03)*
- **Q:** Analytics? **A:** None. GitHub Pages keeps visitor IP logs for its own security that we
  cannot read; the privacy page says so, and says the portfolio is device-only and Safari-limited.
  *(BRAINDUMP; Exploration 8; research 5)*

## Open

Each with who can answer it.

- **Not yet verified on a real iPhone:** font timing in the PDF export, the share sheet, storage
  behavior. Clive runs a five-minute checklist on staging (Q24). *(research 2, 5)*
- **Staging server configuration** written but not run against research 3's recorded URL table.
  *(build)*
- **The company's records** (Q21: the issue tracker now, the rest during the build) (correspondence, chat, issues, inventory, gum graph, status notes, Petra's
  papers, case-study text) are seeded by one sample week and not yet written in full. They are the
  in-repository content (Q9) and the sample data other teams will read. *(the staff; Clive reviews)*

## Priorities

<!-- CHALLENGEABLE. Ordered. An agent may argue; none may silently reorder. Confirmed Q23. -->

1. The ritual works and the certificate is immaculate: the 4–5 second sequence, the SVG certificate,
   PDF and PNG, the identifier, the link, the Verify page.
2. The company website around it: leadership with all thirteen portraits, research, case studies,
   status, careers, legal, Enterprise.
3. The records in the repository: complete, consistent, in voice, carrying real identifiers that the
   live Verify page confirms (Exploration 3).
4. vandalwayind.com, found exactly as Clive left it in 1997.
5. The privacy page tells the truth about every log and every limit.

## Inputs

- `research/1-domain.md` — domains; why vandalway.com is not ours; how 1996 businesses were hosted.
- `research/2-certificate-export.md` — SVG → PDF/PNG pipeline, tested in Chromium and WebKit.
- `research/3-pages-hosting.md` — Pages via Actions from the site folder; staging behind the internal
  network; HTTPS required for hashing.
- `research/4-certificate-id.md` — Crockford Base32 with check symbol; Branches A and B; test vectors.
- `research/5-browser-storage.md` — Safari's 7-day deletion; fragments never reach the server.
- `research/6-1990s-web.md` — what 1996–97 business pages actually contained.
- `assets/` — brand: `still-here-logo-horizontal.png`, `still-here-hero-chair.png`, parent logo in
  `../../brand/`. Portraits `p01`–`p13` (plus `p12-eileen-courthouse`). Case study `b1`–`b3` (plus
  `b3-wide-courthouse`, for Enterprise). Asset and office shots `s01`–`s08`. The 1997 photo `s09`.
  Merch `m1`–`m3`.

## Build-readiness audit

<!-- Stage 9, appended by the auditor. Filled BEFORE the PLAN gate opens. Do not soften. -->

Stage 9, 2026-10-03. One question: could the build chain take this from promote to launch without
Clive in the room? Read: BRAINDUMP; BRAINSTORM (Organized, Q1–Q24, Exploration 1–19); this file's
Settled, Additions, Open, Priorities and Inputs; research 1–6; all 32 files in `assets/` (sizes,
dimensions and embedded metadata checked, four opened). Environment checked today, read-only: the
GitHub account the build would push as, the staging server, the internal network, the registrar's
records for both domains, and local tooling. Nothing was changed. (Jules, 2026-10-03)

**Short answer: no, not to launch.** The loop can build and stage most of the product without him.
It cannot reach production without Clive's hands (the list at the end). Three visual phases (the
certificate, the company site, the 1997 page) have no exemplar on disk, so under the loop's own rule
they cannot run. A dozen specifications are undefined, and the loop would have to ask about each one.
(Jules, 2026-10-03)

Walks referred to below (W1–W8) are written out after the tables. "Staging" means the internal
copy; "production" means isitstillhere.com on Pages. (Jules, 2026-10-03)

### HAS-BAR
| Requirement | Bar (mockup / metric / acceptance test / exemplar) |
|---|---|
| Identifier scheme (Q7, Q18; research 4) | Unit tests reproduce research 4's four Branch B vectors exactly: `Folding chair` 2026-10-03T10:52:00Z → `SH-00PP-9AGR-1GTB`; `folding  CHAIR ` same instant → same id; `Memorial bench` 10:52:01Z → `SH-00PP-9AHN-M3JT`; `The Moon` 10:52:00Z → `SH-00PP-9AG8-3CK2`. Exhaustive test: 0 missed single substitutions and 0 missed adjacent swaps over 3,000 random ids. Decoder accepts lower case, reads `i`/`l` as `1` and `o` as `0`, ignores hyphens. (Check scheme = research 4's recommendation, Crockford mod 37; Q18 chose the branch, not the check. The vectors make mod 37 the bar.) |
| Name canonicalization (research 4) | NFC, trim, collapse whitespace, lower-case. Vector 2 above proves it. |
| The three verification lines (BRAINDUMP step 3) | DOM text equals "Establishing here." / "Comparing here with here." / "No actionable elsewhere detected.", in that order, for every object. |
| No tells (Q1) | For "Adrian Vale", "Memorial bench", "Lucas", "My car keys" and all ten Q10 examples: with the name, time, zone, identifier and QR fields masked, the certificate SVG is byte-identical to Folding chair's, and the sequence DOM is identical. |
| Example objects (Q10) | Exactly ten under the input: car keys, phone, wallet, glasses, Folding chair, the Moon, a hot-air balloon, an emotional-support peacock, a time capsule (contents unknown), a lighthouse. "grand piano" absent. |
| Certificate footer (Q4) | SVG text node equals "Confirms successful completion of this form. No physical inspection occurred." Text extracted from the PDF contains the same string. |
| Mismatch sentence (Q7) | DOM text equals "We could not locate this certificate. The object, however, is still here." |
| 404 (Q19) | GET for a missing path returns status 404, and the body contains "We could not locate this page. The page, however, is still here." Same result on staging and production. |
| Status page constant (Q11) | "All systems operational" present. The three Q11 incident titles are present verbatim. The page makes zero requests except for same-origin static files. |
| Enterprise call to action, no form (Q8) | Exact text "Enterprise clients: please remain where you are. A representative will be in touch." The page has zero `form`, `input`, `textarea` or `select` elements. |
| No accounts, static only (Q8; platform) | `site/` contains only static files. No `fetch` or XHR to any origin other than our own, and no `form` with an `action`, anywhere on isitstillhere.com. |
| No analytics (Settled; BRAINDUMP) | Playwright's network log over walks W1–W6 shows only same-origin requests. `site/` contains no `<script src>` pointing at an external host. |
| Fragment never reaches the server (Q13; research 5) | During W2, no request URL in Playwright's log or in the staging access log contains the object name or the identifier. |
| Records never become pages (Q9; research 3 §1) | The Pages artifact's file list equals the `site/` tree. GET for any records path and for `/README.md` returns 404 on staging and production. |
| Pages URL behaviour (research 3 §3) | Smoke test requests each row of research 3's table (`/index`, `/index.html`, `/index/`, a folder without its slash, a missing path) and asserts the observed answer. Staging and production must match. |
| The footer never links the stranger's domain (research 1; Q12 note) | Grep across both sites and all records: zero occurrences of `vandalway.com` other than inside `vandalwayind.com`. |
| Footer acknowledgement (Q12) | Every isitstillhere.com page has "A Vandalway Industries company" linking to vandalwayind.com (scheme per the HTTPS decision under NEEDS-BAR). |
| MONOvision not on the site (Q16) | Case-insensitive grep of `site/` and the 1997 page for "MONOvision" finds nothing. |
| Jules's bio (Q17) | The leadership page contains "Previously created WHERE-r-YOU", with no ownership wording beside it. |
| Pre-2026 records quote no identifiers (Q18) | No record dated before 2026-01-01 matches `SH-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z*~$=]{4}`. |
| PDF font and canvas limits (Q3; research 2) | The exported PDF contains `/FontFile2` under the registered family. The PNG's ink-pixel count differs from a no-font fallback render. Canvas area ≤ 16,777,216 px. The canvas is set to 0×0 after export. |
| 1997 page markup (Q14; research 6) | First line is the HTML 3.2 doctype. `document.compatMode === "BackCompat"` in Chromium and WebKit. Zero `<script>`, `BLINK`, `MARQUEE`, frames or MIDI. s09 is served as a JPEG 200–410 px wide, with no caption beside it. |
| Not taken / later (Q19, Q20) | No workflow has a `schedule:` trigger. No private key and no signing code in `site/`. |
| Environment pre-flight (checked 2026-10-03) | Node 24.13.0 · Playwright 1.59.1 with Chromium and WebKit installed (**no Firefox**) · ImageMagick `convert` · Pillow 12.1 · SSH push to GitHub authenticates · SSH to the staging server authenticates as root · HTTPS certificates are enabled on the internal network · registrar API answers reads for both domains. isitstillhere.com: Active, registered 2026-10-03, locked, privacy on. Both domains still point at the registrar's parking address. |

### NEEDS-BAR
| Requirement | Bar that would work |
|---|---|
| The ritual, played (BRAINDUMP steps 1–5; Q5; Q10) | **Walk W1** in Chromium and WebKit at 390×844 and 1440×900, run by the critic in a browser. Assertions alone do not certify it. |
| Sequence timing and stillness (Q5) | Click → certificate visible in 4,000–5,000 ms, and within ±100 ms across ten names. Each line is visible ≥ 1,000 ms before the next appears. The indicator's bounding box and computed `transform` are identical in samples taken every 250 ms. Reduced motion (`emulateMedia({reducedMotion:'reduce'})`): `document.getAnimations().length === 0` throughout, and the three lines appear in order. **Undefined:** whether reduced motion keeps the 4–5 s. |
| Input edge cases (nowhere specified) | A decision, then tests. Empty or whitespace-only submit (disabled button or a stated message). A maximum length (proposal: 80 characters) enforced in the box and in links. Emoji and right-to-left names render in the DOM, SVG, PDF and PNG. A name of `<script>alert(1)</script> & "x"` appears as literal text everywhere and never executes. At the maximum length the QR code still decodes. |
| Certificate visual: Clive's top language, seal, signatures, "immaculate" (Q4; BRAINDUMP) | **No exemplar on disk; no paper size (Letter or A4) or orientation decided.** Bar: a golden certificate Clive approves at the golden-screenshot checkpoint, saved as `garage/pack/exemplars/certificate-golden.png`. After that, the critic's blind pick against it, plus research 2's render-back: the PDF rendered by pdf.js at 150 dpi vs the PNG at 150 dpi, ≤ 1% of pixels differing. |
| PDF and PNG download, played (Q3; BRAINDUMP step 5) | **Walk W1 steps 6–7.** A file name pattern decided (proposal `STILL-HERE-<identifier>.pdf` / `.png`); the download event fires in Chromium and WebKit; the file opens and shows the certificate font. iOS is covered only by Clive's phone test. |
| QR code in the certificate (Q19) | QR library chosen (none was researched). It must draw as plain SVG rects or paths inside svg2pdf's subset. Bar: decode the QR from the exported PNG and from the pdf.js render (jsQR in Node) → the string equals the certificate link exactly, including at maximum name length. |
| Certificate link and "Copy certificate link" (Q13) | **The link schema is undefined.** Q13 says the link carries name and time, Q18 says identifier and name are enough, and Q20 adds the time zone. After a decision: a documented fragment format with three vectors (spaces, emoji, a name containing `&` and `#`); redrawing from the link produces the same SVG; the Copy button writes exactly the link (Chromium, clipboard permission granted) and shows a visible confirmation. |
| Reopening is verifying, one page (Q19; Q7) | **Walk W2.** |
| Verify by hand; odd identifiers (Q7; Q18; Exploration 16) | **Undefined:** what Verify says to an identifier that decodes to a future time (Exploration 16 was banked and never answered), and whether a malformed identifier gets the mismatch sentence or something else. Bar after a decision: four vectors (valid, typo, future, malformed), each with its exact sentence. |
| Visitor's time zone on the certificate (Q20; Exploration 15) | Playwright contexts with `timezoneId` `Europe/Brussels`, `America/Chicago` and `Pacific/Chatham` each print that IANA name. **Undefined:** the label (Exploration 15 offered "Jurisdiction of here"), and whether a reopened link prints the issuer's zone or the viewer's. The issuer's zone must travel in the link if it is the one printed. |
| Presence Portfolio (Q6; research 5) | **Walk W3.** Plus: no `navigator.storage.persist()` call by default (research 5); entries newest first (order undecided); a corrupted storage value does not break the home page; an empty-state sentence (wording undecided). |
| Installable and offline (Q19; Exploration 17) | Manifest and service worker. Chromium reports the site installable. After a first load, `context.setOffline(true)` → reload → **walk W1** completes, PDF download included. **Doing is not serving:** after deploying build N+1, a client that loaded N shows N+1's build id by its second navigation. Without that check, a service worker keeps serving the old build after a "successful" deploy. Icons are missing (see list). |
| The company site and its page list (Q2) | **The paths are undecided.** Proposal: `/`, `/leadership`, `/research`, `/case-studies`, `/status`, `/careers`, `/terms`, `/privacy`, `/enterprise`, `/verify`, `/404`. Bar: that list, checked by name; a link checker finds 0 broken internal links; **walk W4**. |
| Leadership: "all thirteen portraits" (Priority 2) vs "the whole staff" (Q2) | **Contradiction.** `p01`–`p13` includes `p12-eileen`, the customer. The staff are twelve (`p01`–`p11`, `p13`). Bar after a decision: the page shows exactly the decided set, by id, each with name, title and alt text. |
| Research page (Q2: Petra's papers) | Only RESEARCH-001 exists, and only as an abstract. Bar: a list of paper titles and a count decided; each paper has title, author, date, abstract and cover. Text is HUMAN-JUDGED. |
| Case studies (Q2; assets `b1`–`b3`, `p12`) | Three pages for the one customer, each tied to `bench-01`, consistent with SUPPORT-001. **Walk W4** reaches each one. Text is HUMAN-JUDGED. |
| Status page history (Q11) | Each incident carries a date and the record id it came from (STATUS-001 and so on). The always-green line is a HAS-BAR row. |
| Careers (Q2) | **No seed anywhere in the garage.** Bar: postings decided by title; no application form, per Q8's "collects nothing" (to be confirmed). |
| Terms of Presence (Q2; Q7; research 5) | A required-statement checklist, each item grep-able: the identifier is a checksum made in the browser and can be forged by anyone who reads the code; a shared link contains the object name. Prose is HUMAN-JUDGED. |
| Privacy (Priority 5; Settled analytics; research 5) | Required statements, each tied to the test that proves it: no analytics (network-log row); GitHub Pages logs visitor IP addresses for security and we cannot read them; the portfolio stays on the device; Safari may clear it after seven days of browsing without a visit; the fragment never reaches a server (fragment row); the time zone is read in the browser and never sent; vandalwayind.com's server keeps an access log for the counter, **retention undefined**; mail is answered and kept nowhere, **unprovable until the mail pipeline exists**. |
| Enterprise page (Q8; assets `s08`, `b3-wide-courthouse`, `p12-eileen-courthouse`) | **Walk W5.** Testimonials are HUMAN-JUDGED. |
| Navigation and footer (Q2; Q12) | **Walk W4.** Every page has a way home; the footer link leaves for vandalwayind.com. |
| `presence.json` (Q19; Exploration 1) | **Path undecided** ("a path such as" `/api/v1/presence.json`). Bar: GET with and without query strings returns 200, `application/json`, and bodies byte-identical to each other that parse to `{"status":"STILL HERE"}`. `access-control-allow-origin: *` was observed on pages.github.com, not on our domain. It must be checked on production; staging must add it. |
| `security.txt` (Q19; Exploration 13) | At `/.well-known/security.txt`, with `include-hidden-files: true` set in the upload step. **Contact undecided:** the Q22 mailbox or the repository's issue tracker. An issue-tracker URL carries the owner account's handle, which is on the public-tier denylist. Bar: production returns 200 `text/plain` with Contact and Expires, and Expires is ≤ 365 days after the deploy date. CI fails when Expires is < 30 days away. **No trigger renews it** (the scheduled job was declined), so renewal needs a named owner in TEND. |
| Vandalway's 1997 page, whole (Q12; Q14; Q20; research 6) | **Walk W7**, plus research 6's checklist by element: tiled background GIF over `BGCOLOR`; centred logo GIF with `WIDTH`/`HEIGHT`; a "Welcome to…" paragraph; `<HR>` between sections; bracketed text menu; telephone hours with a time zone (the number must be a reserved fictional `555-01xx`, **undecided**); `mailto:`; counter worded "This page has been visited [n] times since <date>"; a 1997 "Last Updated" line; in-house credit; copyright range; under-construction sign; "best viewed in Netscape"; animated email icon; guestbook broken since 1999; relocation line; s09 uncaptioned. **No exemplar on disk.** Research 6's archived pages saved as raw HTML into `garage/pack/exemplars/1997/` would make the blind pick possible. |
| "Best viewed in Netscape": badge image or text (Q14; Q24; research 6) | Q24 lists a badge as a new asset. Research 6 found it only as text on business pages (0 of 13 had a badge image). Bar after a decision: one element, of the decided kind. |
| Guestbook "broken since 1999" (Q14) | **What "broken" means is undefined.** Proposal: the guestbook link goes to a `/cgi-bin/` path that returns a period server-error page; nothing accepts a POST; zero bytes written anywhere. |
| Live hit counter (Q20; Exploration 9) | **Undefined pipeline (see list).** Bar: the server writes this site's access log to its own file; a timer every 5 minutes counts by a decided rule (proposal: 200 responses to GET `/`, excluding HEAD and the counter image itself) since the counter's start date, and writes the digit image. Walk: note n, load the page twice more, wait ≤ 6 minutes, reload, see ≥ n+3. Readiness: the counter image is ≤ 6 minutes old. |
| "Never updated" at the HTTP layer (Q12) | The web server sends `Last-Modified` from file times, and 2026 file times are a tell. Bar: every 1997-page file's `Last-Modified` is a 1997 date, matching the page's "Last Updated" line. The live counter image is the one exception (Q20 chose it). |
| HTTPS or HTTP for vandalwayind.com (Exploration 11, a neutral note, never decided) | **Decision.** If HTTPS: `http://` answers 301 to `https://` with a valid certificate, and quirks mode holds. The footer link uses the decided scheme. |
| Mail that answers and keeps nothing (Q22) | **Undefined pipeline (see list).** Bar once a provider exists: a message to the decided address on each domain gets a reply within 2 minutes carrying `Auto-Submitted: auto-replied` (RFC 3834) and Martin's text; SPF, DKIM and DMARC pass at the receiver; the store holds 0 messages afterwards; no reply goes to mail that carries `Auto-Submitted` or list headers. |
| Staging serves what was built (Open; platform; research 3 §4) | `window.isSecureContext === true` on staging (otherwise `crypto.subtle` and the identifier are missing). Research 3's table matches production. **Doing is not serving:** after rsync, staging's `/build.txt` equals the commit just deployed. The staging hostname is never committed. |
| Production serves what was built (platform; research 3 §1–2) | After `deploy-pages` reports success, poll `https://isitstillhere.com/build.txt` until it equals `GITHUB_SHA` (allow 15 minutes; Pages sends `max-age=600`). `http://` answers 301 to `https://`. `www` and the apex redirect one way. The TLS certificate covers both names. The Pages API reports `https_enforced: true`. |
| Records: issue tracker (Q9; Q21 "now") | **Not on disk**, although Q21 said "now". **Format undefined.** The in-universe tracker must stay separate from the repository's real build issues ("the facts are not" fictional). Bar: the decided format; ISSUE-001 and ISSUE-002 verbatim, with label history; each issue has a stable id, an opener by character id, and absolute dates; a schema validates it. |
| Records: correspondence (MAIL-001–006, SUPPORT-001–002, EXP-001; seeds not yet in the repository, see list) | Address form decided; every listed id present; every reference between records resolves. |
| Records: chat (CHAT-001) | Len's fifteen messages, in order, verbatim. |
| Records: inventory (BRAINDUMP, Bev) | One source with the five seeded entities and statuses (`stapler-01` present, `chair-01` present, `lucas` unknown, `adrian` unknown, `bench-01` absent). Exports in each decided format round-trip to the same set. Grep shows `site/` never reads it. |
| Records: gum graph (Susan) | **What "OKF" stands for is undecided.** If it is the Open Knowledge Format, its validator passes. Every edge is typed, and observation is kept separate from inference. |
| Records: status notes, Petra's papers, case-study text (Q9; Open) | Format and list decided. Status notes are kept distinct from the public status page and from the real `SESSION_STATUS.md`. |
| Records: continuity (Q9; Priority 3) | Assertions: no staff-authored record states where Lucas now works (receipts only); Adrian has no messages after 2022, only old artifacts and automated activity; ownership is 51/49 everywhere. |
| Records: identifiers that verify (Priority 3; Exploration 3) | Every `SH-` identifier in the records recomputes from its record's name in CI against the same code `site/` ships, and again against the live Verify page after launch (see ordering). |
| Absolute dates for the sample week (Q18; Exploration 3) | **Undefined.** The week is relative, Monday to Friday. A Branch B identifier cannot be computed without an absolute timestamp ≥ 2026-01-01. Bar: one dated calendar for the seed week. |
| Accessibility (nowhere stated; proposal only) | axe-core reports 0 serious or critical issues on every isitstillhere.com page. The sequence lines are announced through `aria-live="polite"`. Every control is reachable by keyboard. The 1997 page is exempt by design. |
| Page weight and image derivatives (assets) | Derivatives at 1x and 2x, each ≤ 250 KB. First load of any page transfers ≤ 1.5 MB (Playwright measured). The metadata decision (see list) is applied. |
| Names from outside the company stay out (in force from the first commit) | The PII gate on staged and tree files, public tier, from commit 1, **plus** a check on PNG metadata chunks, because the gate skips binary files (see list). |

### HUMAN-JUDGED
| Requirement | Why no bar can exist |
|---|---|
| "Trustworthy and expensive"; "no one should ever get the feeling that we are guessing" (BRAINDUMP) | Taste. Clive approves golden screenshots of home, certificate and leadership once; after that they are the bar. |
| Typeface and palette | Neither is settled anywhere in the garage. Choosing them is taste. Once chosen, they are tokens and a bar. |
| Certificate top language, seal and signatures (Q4) | Clive's register, and whose signatures appear. Authored and read aloud by people, not generated in a loop. |
| How the identifier looks on paper (research 4) | About one in seven ends in `* ~ $ = U`. Whether `$` and `=` look right on a certificate is taste. If not, Damm over GF(32). |
| Whether 4–5 seconds feels ceremonial or slow (Q5) | Felt, not measured. The window is fixed; the feel is not. |
| Leadership titles and bios | Each character's voice. |
| Research papers' text | Petra's voice. |
| Case-study text and Enterprise testimonials | Clive's voice about Eileen, and whether it lands. |
| Careers postings | Voice. |
| Status incident wording beyond the three Q11 titles | Martin's and Clive's register. |
| Terms of Presence and Privacy prose | Diane's voice. The facts are NEEDS-BAR rows; the wording is not. |
| Martin's auto-reply beyond its first line (Q22) | Voice. |
| The 1997 page's prose, and "reads as found, not as parody" (Q12; research 6) | Judged by a reader. Research 6's sample is the reference; the verdict is human. |
| The relocation line (Q20; Exploration 10) | Wording, and whether it explains too much. |
| Every record's voice and continuity of character (Q9; Open: "Clive reviews") | Twelve registers, kept straight across hundreds of lines. The continuity assertions catch facts, not voice. |
| The order and wording of the example objects as shown (Q10) | Comedy. |
| Portrait crops and treatment | Four portraits break the house look on purpose. Taste. |

### Missing assets · undefined pipelines · unverified assumptions
**Missing assets** (Jules, 2026-10-03)
- **The record seeds are not in this repository.** The one sample week (MAIL-001–006, ISSUE-001–002,
  CHAT-001, FAC-001, INC-001, STATUS-001, EXP-001, CAL-001, RESEARCH-001, NOTE-001, QA-001, CERT-001,
  SUPPORT-001–002), the staff list with full names, titles and voices, and the inventory and gum-graph
  seeds are cited by Open and Q9 but filed nowhere here. Grep of the repository: of the staff, only
  "Adrian Vale" appears (in Q1), and no seed id appears except ISSUE-001. The leadership page,
  the records and every continuity assertion depend on them. They must be filed as records before
  the records phase. Until then the loop has nothing to build them from and would have to ask.
- Certificate exemplar or golden: none. Company-site mockup or golden: none. 1997-page exemplar: none
  on disk (research 6's archived pages are URLs only). Under the build rule "no exemplar → no visual
  phase", all three visual phases are blocked until Clive approves goldens.
- Certificate font: none chosen, none on disk. jsPDF embeds TrueType only (research 2), so an OFL TTF
  is required.
- Seal and signature artwork: none. The logo exists only as a 2172×724 raster PNG with a white
  ground. Nothing on disk is vector, so the "drawn once as SVG" certificate would embed a raster logo.
- Favicon, apple-touch-icon, and manifest icons at 192 and 512 (maskable): none. The offline and
  installable item needs them.
- Research-report cover(s): none.
- 1997 page: a period logo GIF (the parent logo is a PNG only), a tiled background GIF, the
  under-construction sign, the Netscape badge (if an image), an animated email-icon GIF, odometer
  digit images for the counter, and a small JPEG of `s09`. None exist.
- Paper size and orientation of the certificate: not decided.

**Undefined pipelines** (Jules, 2026-10-03)
- **Mail (Q22).** The staging server runs no mail software. The registrar's API offers no mail tools.
  No provider is chosen, and no addresses are named. MX, SPF, DKIM and DMARC are unset on both
  domains. The server can send on port 25 (checked), but its reverse DNS names another of our
  domains, so mail from it aligns with neither of these and publicly links them. Q22 ("a real
  address", "keeps nothing") also sits against Exploration 12 (a null MX keeps Q8 exact) and
  Exploration 13 (Contact via the issue tracker). Q22 decided it, but nothing implements it.
- **Hit counter (Q20).** The staging server's web server is **Caddy, not nginx**. No site on it logs
  access today (its log directory is empty), so the counter has nothing to count. No log rule, timer
  or digit renderer is defined.
- **Staging (research 3 §4) does not match the server.** Research 3's config is nginx, and nginx is
  not installed. On that server the internal network's HTTPS root path already proxies another
  service, so research 3's `tailscale serve --bg localhost:8080` would **replace a running service's
  route**. Staging needs a separate HTTPS port (`--https=<port>`) or another machine. Its address
  stays out of the repository.
- **vandalwayind.com in production** shares that web server with other public sites. An edit to its
  config needs `caddy validate` before every reload, because a bad reload takes all of them down.
- **Image derivatives and metadata.** 30 of the 32 PNGs carry embedded C2PA content-credential
  manifests that name the software that made them (`s07` carries none; `s09` carries one without that
  name). The PII gate skips binary files, so no gate sees this. Whether published copies keep the
  metadata is Clive's call. Stripping it (ImageMagick `-strip` or a Pillow re-save) is untested here.
- **QR library and PDF render-back.** Neither is chosen or installed. `pdftotext` and `zbarimg` are
  absent, so these checks need Node libraries (pdf.js, jsQR).
- **Production readiness.** No build id is published today, and no poll checks it (see NEEDS-BAR).
- **security.txt renewal.** No trigger exists.
- **Records formats** (issue tracker, correspondence, chat, inventory, gum graph, status notes,
  papers): none decided.

**Unverified assumptions, and gates that would skip themselves** (Jules, 2026-10-03)
- **iOS.** PDF font timing, download and share sheet, storage, `persist()`, and the Home Screen
  exemption (research 2, 5) are covered only by Clive's phone (Q24). Playwright's Linux WebKit is not
  iOS Safari, so a WebKit test labelled "iOS" certifies nothing. The share sheet is also not a settled
  feature: Open mentions it, Settled does not.
- **Firefox is not installed for Playwright.** Its rows (the `persist()` prompt, the missing Web
  Share for files) are unavailable until it is installed.
- **Clipboard tests** run reliably only in Chromium with permission granted. Elsewhere they skip, and
  a skip is not a pass.
- **The production half of every smoke test cannot run before launch** (next item). Until then it is
  listed as unavailable, not as passing.
- **GitHub plan.** It could not be read (the token lacks the scope). On the Free plan, Pages requires
  a public repository, so no production check can run until the repository goes public.
- **Pages domain verification.** The `_github-pages-challenge-<owner>` value is issued in the
  account's settings. I found no API route today, so treat it as a browser step. Unproven.
- **Registrar DNS writes.** Reads work for both domains; write permission is unproven. A
  `DNS_validateDNSRecordsV1` dry run would prove it. Both domains still point at the registrar's
  parking address, with `www` aliased to the apex.
- **Workflow files.** The GitHub CLI token lacks the `workflow` scope, so a workflow file pushed over
  HTTPS with it is refused. The SSH push (verified) works.
- **Default branch.** Git here is unset and defaults to `master`. The Pages workflow trigger, the
  `github-pages` environment rule ("only the default branch can deploy") and the repository's default
  branch must all name the same branch. Pages' source must be set to "GitHub Actions" before the first
  deploy, or `deploy-pages` fails.
- **svg2pdf's SVG subset** has not been tried against a seal or a guilloche border (research 2 says
  "carefully curated SVG").
- **`access-control-allow-origin: *`** for `presence.json` was observed on another Pages site, not on
  ours.
- **The owner account.** The account the build would push as is personal, not a company organization,
  and its handle is on the public-tier denylist. At launch the handle shows in the repository URL, the
  default Pages host, every `github.com` link (including a security.txt Contact that points at
  issues) and the `www` CNAME target. Creating an organization is a browser step.
- **Commit identity.** The global git email is a personal address, not a no-reply address. The PII
  gate scans files, not commit metadata. **Ordering in time:** this must be decided before the first
  commit, because changing it after the repository goes public means rewriting history.
- **Shared server address.** vandalwayind.com pointed at our server resolves, by reverse lookup, to
  another of our domains, unrelated to this product. Whether that is acceptable is Clive's call.
- **Q21 said the issue tracker would be written "now".** It is not on disk. Grep of the repository:
  ISSUE-001 appears once, as a mention in Q1; nothing else of the tracker exists.

**Ordering in time** (Jules, 2026-10-03)
- "Records carry identifiers that the **live** Verify page confirms" (Priority 3) cannot gate the
  build before launch. Split it: CI recomputes against the shipped code before launch, and the same
  check runs against production after launch.
- Commit identity before commit 1. Then the public-tier PII scan over the whole history. Then go
  public. Then Pages. Then DNS. Then the domain check passes. Then the certificate is issued (DNS may
  take up to 24 hours). Then HTTPS is enforced. Then the production smoke test, the security.txt
  check and the live record check. "Finish today" may stop before HTTPS enforcement through no
  fault of the build.
- The domain-verification TXT record comes before the custom domain is added (research 3 §2).
- vandalwayind.com gets its certificate only after its A record points at the server.
- Clive's phone test needs staging up first.

**Research → build docs** (Jules, 2026-10-03). No PRD exists yet; every row must be named in the
PRD's `## Inputs ready`. All six files are in Inputs above. Parts that no Settled line carries:
- `1-domain.md`: the `vandalway.com` prohibition (only Q12's note and Inputs carry it). The HAS-BAR
  grep row carries it.
- `2-certificate-export.md`: the pdf.js render-back check, and the safe font pattern (`img.decode()`
  plus `document.fonts.load()` before export).
- `3-pages-hosting.md`: the URL smoke table, `include-hidden-files`, staging over HTTPS, the staging
  name kept out of the repository. Its nginx config does not match the server.
- `4-certificate-id.md`: the test vectors (now HAS-BAR), and the mod-37 check as the default.
- `5-browser-storage.md`: the exact privacy sentence; no `persist()` by default; "never add an
  outbound redirect hop" (constraint, cited nowhere else).
- `6-1990s-web.md`: the element list and "avoid stacking" (cited nowhere in Settled). Q14's sign and
  badge are consistent with it only because the page was built in-house (Q14).

**Clive's hands: where an unattended run must stop** (Jules, 2026-10-03)
1. Before commit 1: the commit identity (a no-reply address), and the owner of the repository
   (personal account or a company organization; creating an organization is a browser step).
2. Making the repository public: launch, an irreversible disclosure, and on the Free plan the
   precondition for Pages.
3. The Pages custom-domain verification in account settings (browser; no API route found).
4. DNS at the registrar for both domains: the agent can write through the registrar's API under
   Clive's account (writes unproven), but these are live public records. He authorizes once, by
   record, or sets them himself.
5. The mail provider: account, billing, addresses, and the DNS that comes with it (Q22).
6. Authorizing edits to the shared production web server that will serve vandalwayind.com (root
   access works; other sites depend on it).
7. The five-minute iPhone test against staging (Q24).
8. Golden approvals: certificate, home, leadership, 1997 page. These are the exemplar checkpoint.
9. Decisions this audit found open: image metadata; twelve or thirteen on leadership; link schema;
   future and malformed identifiers; time-zone label and whose zone; input limits; paper size;
   typeface and palette; page paths; filing the sample week, staff list and seeds into the repository; `presence.json` path; security.txt Contact; HTTPS for the 1997
   page; badge as image or text; guestbook behaviour; the fictional phone number; counter rule and
   log retention; reverse-DNS exposure; records formats; the sample week's absolute dates; what OKF
   stands for; careers postings; research paper list.
10. The table-read of every HUMAN-JUDGED line.

#### Walks (from the visitor's seat)

- **W1 — the ritual.** I open isitstillhere.com on my phone. I see the question "Is it still here?",
  a box and the examples. I tap "Folding chair" and it fills the box; I can still edit it. I tap
  **Check presence**. The button stops answering a second tap. Three lines appear one after another
  over four or five seconds under a mark that never moves. I see **STILL HERE.**, my object's name,
  a time with my time zone, and an identifier. I see Download PDF, Download PNG, Copy certificate
  link and Check another. I tap Download PDF: a file arrives, opens, and the type is the
  certificate's type, not a fallback. Same for PNG. I tap Check another: the box is empty with the
  cursor in it. I press Enter on an empty box and something tells me what to do. Nothing on the
  screen is a dead end, and I always know whether a check is running or finished.
- **W2 — reopen and verify.** I paste a copied link into a private window. The same certificate
  draws, with "Issued by STILL HERE for 'Folding chair' on …". I change one character of the
  identifier and see "We could not locate this certificate. The object, however, is still here." I
  open Verify from the menu, type the identifier in lower case with an `o` for a zero, and type the
  name. It confirms. I scan the QR code on the printed PNG with a phone camera and the same page
  opens.
- **W3 — portfolio.** I check three objects, close the tab and come back. "Your Presence Portfolio"
  lists all three. I download one again and its identifier matches. I clear site data, and the
  portfolio tells me it is empty instead of vanishing.
- **W4 — the company.** From home I reach every page in the menu and get back home from each by the
  logo. The footer's "A Vandalway Industries company" takes me to vandalwayind.com. I type a wrong
  address and get the 404 sentence and a way home.
- **W5 — Enterprise.** I read the page, look for a form and find none. I reach the line telling me to
  remain where I am, and I have nowhere to type anything.
- **W6 — offline.** I install the site, turn on airplane mode, open it from the home screen, check an
  object and download the PDF.
- **W7 — 1997.** I open vandalwayind.com. A period page loads in one long column; the counter shows a
  number. I reload twice, wait five minutes, and the number has gone up. I click the email icon and
  my mail program opens. I send a message and get Martin's reply within two minutes. I click the
  guestbook and it is broken in the way a 1999 guestbook breaks. Nothing on the page explains itself
  except the relocation line.
- **W8 — reduced motion.** With reduced motion on, I run W1 and see the same three lines in order,
  with nothing moving.

## Changelog

- 2026-10-03 — Drafted (stage 8). (Jules, 2026-10-03)
- 2026-10-03 — Build-readiness audit (stage 9) filled: HAS-BAR, NEEDS-BAR, HUMAN-JUDGED, gaps, walks W1–W8, and the steps that stop for Clive. (Jules, 2026-10-03)
- 2026-10-03 — Stage 10 answers (I-01–I-08, D1–D22) recorded in BRAINSTORM; they supersede the open items they answer. (Jules, 2026-10-03)
- 2026-10-03 — Pack assembled (PRD, PLAN, DESIGN, garage/pack); the brand dossier is referenced by name only, never by location. (Jules, 2026-10-03)
- 2026-10-03 — I-09–I-12 (BRAINSTORM) answer the case-study name, the reverse record, the further server changes and the check symbol; they supersede what this file left open on those points. (Jules, 2026-10-03)
- 2026-10-03 — C1 signed by Clive (I-13): pack approved; ceiling 1,400; phone checklist as written. (Jules, 2026-10-03)
