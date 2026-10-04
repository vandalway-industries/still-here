---
updated: 2026-10-03
read_by: the Diff Auditor (stage 3, reads ## Organized against BRAINDUMP.md); the Interviewer (stage 4); the Explorer (stage 6); research agents (stage 7, read ## Questions ### For research); the handoff author (stage 8)
relations:
  derived_from: BRAINDUMP.md
---

# STILL HERE — BRAINSTORM

> **Shared file.** Petra drafts the organization; Clive red-pens it. The Diff Audit runs on Petra's
> draft BEFORE red-pen. After red-pen, Clive's version is the baseline. Unmarked additions are
> forgery — every added passage carries `Sources:` naming the file it came from. This is a
> divergence room: no scoping, no v1 talk, no PRD.

## Organized

Sources: `BRAINDUMP.md` (as of 2026-10-02). Regrouped only; every passage is verbatim, in the order
it appears within each group. Group headers and contradiction notes are mine. (Petra, 2026-10-02)

### The product (Petra, 2026-10-02)

Here is the vision. A visitor comes to us with an object. Any object: a folding chair, a stapler, a
beloved municipal bench. They type its name, they press Check, and they receive a certificate
confirming that it is still here. An unnecessarily official certificate. I want "unnecessarily" in
the brief. Nobody has ever complained that a certificate was too official.

The website has to look trustworthy and expensive. Precise language. Immaculate certificates. No one
should ever get the feeling that we are guessing.

### The ritual (Petra, 2026-10-02)

The ritual. I have started calling it the ritual.

1. The visitor types an object's name, or picks one of our examples, such as "Folding chair."
2. They press **Check presence**.
3. A short, staged verification sequence: "Establishing here." "Comparing here with here." "No
   actionable elsewhere detected."
4. The result: **STILL HERE.** It repeats the name they gave us, with a timestamp and a certificate
   identifier.
5. They can download the certificate, beautifully, or check another object.

### The certificate footer (Petra, 2026-10-02)

The certificate footer. Diane insists on: "Confirms successful completion of this form. No physical
inspection occurred." I have registered my position that this undersells the experience.

> It tells them what the button did. It stays. (via Diane, 2026-10-02)

[CONTRADICTION] Clive: the footer "undersells the experience"; Diane: "It stays." Both kept; resolution is the author's. (Petra, 2026-10-02)

### Platform and first release (Petra, 2026-10-02)

> Platform, for whoever builds this: static HTML, CSS and JavaScript, served by GitHub Pages from the
> project's repository, on a custom domain. The domain is not chosen yet. The verification sequence
> and the certificate are generated in the visitor's browser. No application server, no shared
> database. Before launch it is staged on our internal network only; the repository goes public at
> launch. The publishing workflow is set during build preparation. No analytics script anywhere; server logs only, so the privacy page can say so.
> (via Jules, 2026-10-02)

> First release, proposed: authored verification text, no accounts, no tracking hardware, no live AI
> dependency. Open, for Diane's questions: certificate format, whether anything is stored in the
> browser, the animations, the exact timings. Accounts or a shared database would be a separate
> backend decision, not a feature. (via Jules, 2026-10-02)

### Accounts (Petra, 2026-10-02)

I would like to keep enterprise accounts in view.

> Accounts for what. (via Diane, 2026-10-02)

[CONTRADICTION] Clive: "keep enterprise accounts in view"; Jules: accounts "would be a separate backend decision, not a feature"; Diane: "Accounts for what." All kept. (Petra, 2026-10-02)

### The inventory, and its boundary (Petra, 2026-10-02)

> The staff inventory is a different thing. It lives in my spreadsheet. It has present, absent and
> unknown, because some things are absent and some people are unknown. The website does not read it.
> (via Bev, 2026-10-02)

> The public product always says STILL HERE. Do not wire it to the inventory. Do not let it become an
> inventory service. (via Diane, 2026-10-02)

### The company (Petra, 2026-10-02)

For the record, because Malcolm keeps asking: Vandalway Industries acquired my 49%. Diane retained
51%. I think of it as a change in stakeholder proximity. MONOvision is also a Vandalway company; its
owner is listed as Jorge Procanto. Whether Jorge owns any part of Vandalway, or of us, has not been
established, and I have decided it is not a question I need answered.

The Vandalway thesis, which I would like etched into something: we productize what people were
already doing for free. Closing an eye: MONOvision has made the eyelid an optical platform. Being
somewhere: WHERE-r-YOU, Jules's previous product, returns "here." And remaining. Remaining is us.
STILL HERE certifies continued presence.

> Without checking it. (via Diane, 2026-10-02)

### Unfinished (Petra, 2026-10-02)

And remaining is, I am increasingly convinced, the most underrated…

## Diff audit

<!-- Stage 3. Dated. Three lists: DROPPED / ADDED / PROMOTED, each instance quoted. Empty = pass. -->

### 2026-10-02 (20:30) — Petra's first draft, before Clive's red pen (Bev, 2026-10-02)

Original: `BRAINDUMP.md`, `updated: 2026-10-02`. Draft: `## Organized` above. I laid them side by
side and checked every passage character for character, both directions. Clive's body text is 16
passages, 44 lines. All 44 are in the draft, byte for byte, none changed, none twice. The draft has
12 lines he did not write; every one carries Petra's mark (the `Sources:` paragraph's mark sits on
its second line). Within each group, his order is kept.

**DROPPED** — body text: None. File furniture not carried into the draft:
- Frontmatter: `updated: 2026-10-02` / `read_by: the Organizer (stage 2) as its only input; the Diff Auditor (stage 3) as the original; CLIVE whenever he wants to know what he actually said` / `relations: {}`
- Title: `# STILL HERE — BRAINDUMP`
- The file-rules block, lines 9–13, opening `> **Human-authoritative. Append-only by conversation.**`
- The charter block, lines 15–22, opening `> **Property of Idea Bank.**`
- The date heading `## 2026-10-02` (the draft's `Sources:` line says "as of 2026-10-02")
- `## Changelog`, its instruction comment, the template comment, and the line `- 2026-10-02 — Rewritten in my own words. Everything that was here is still here; Diane checked (CLIVE: "update the braindump to whatever you want").`

**ADDED** — 11 lines marked `(Petra, 2026-10-02)`: the `Sources:` paragraph, 8 group headers, 2
`[CONTRADICTION]` notes. Counted, not listed. Unmarked additions: None.

**PROMOTED** — None. Every hedge is still there in his words: "The domain is not chosen yet."
"The publishing workflow is set during build preparation." "First release, proposed:" "Open, for
Diane's questions:" "has not been established". The header `Platform and first release` names
Jules's proposal; his word "proposed" sits right under it. No header or note decides anything the
dump leaves open.

Checked as well:
- `[CONTRADICTION]` quotes match the dump. Footer note: "undersells the experience" and "It
  stays." are both exact. Accounts note: "keep enterprise accounts in view" and "Accounts for
  what." are exact. Jules's line reads "Accounts or a shared database would be a separate backend
  decision, not a feature."; the note quotes from "would be" and drops "or a shared database".
  Diane's line is a question; the note lists it as one of three sides.
- Every `(via …)` note sits directly under the line it answers: Diane's "Without checking it."
  under the thesis, "It tells them what the button did. It stays." under the footer, "Accounts for
  what." under enterprise accounts.
- One move to look at: in the dump, my inventory note follows "Accounts for what." directly. In the
  draft it opens its own group, with a header and the accounts note between them. Its words are
  unchanged.

## Questions

### For the author
<!-- Clive can answer now. One at a time in conversation; answered here with the answer. -->

**Q1. What does a visitor see when they type something we know is not here?** ("Adrian Vale,"
"Memorial bench," "Lucas," "My car keys.") (Diane, 2026-10-02)

Answer (Clive, 2026-10-02): The chair certificate. Always. Every object gets the same certificate as
the folding chair; there are no exceptions and no tells. It can become more sophisticated later.

Branch kept open, not chosen (Diane, 2026-10-02): a short list of things that are actually here.
That list already exists as Bev's staff inventory, which the website does not read (BRAINDUMP,
Bev and Diane). If the product ever consults it, that is where it would come from. ISSUE-001 stays
open "for the advertised part."

**Q2. One page, or a company website?** (Diane, 2026-10-02)

Answer (Clive, 2026-10-02): A company website. The ritual is the home page; around it, the company:
leadership (the whole staff), research (Petra's papers), case studies, status, careers, and legal
(Terms of Presence, Privacy).

**Q3. Download the certificate as what?** (Diane, 2026-10-02)

Answer (Clive, 2026-10-02): Both a PDF and an image (PNG), drawn once as a single vector certificate in
the visitor's browser and exported to each, so the two can never differ.

**Q4. The footer dispute: what is on the certificate?** (Diane, 2026-10-02)

Answer (Clive, 2026-10-02): Both. Clive's language takes the top of the certificate (the "This
certifies that…" heading, the seal, the signatures); Diane's footer stays at the bottom, in small
type, as written: "Confirms successful completion of this form. No physical inspection occurred."
Resolves the footer [CONTRADICTION] in ## Organized.

**Q5. How long does the verification sequence take?** (Diane, 2026-10-02)

Answer (Clive, 2026-10-02): Ceremonial, about 4–5 seconds. Each of the three lines holds long enough
to read, under a calm indicator that never actually moves. Identical for every object (Q1). With
reduced motion requested, the same three lines appear in order without animation.

**Q6. Does the site remember anything?** (Diane, 2026-10-02)

Answer (Clive, 2026-10-02): Yes, on the visitor's device only. Their browser keeps a list of their
past certificates ("Your Presence Portfolio"), each re-downloadable. We never receive it; the privacy
page says so. Clearing browser data clears the portfolio.

Research note (Diane, 2026-10-03, from `research/5-browser-storage.md`): Safari deletes a site's
stored data after 7 days of Safari use with no click, tap or keypress on that site; Home Screen web
apps are exempt; Chrome and Firefox delete nothing on a timer. The portfolio is therefore best-effort,
and the privacy page sentence must say so. Petra's recommended remedy is a question for Clive (Q13).

**Q7. Does the certificate identifier mean anything?** (Diane, 2026-10-02)

Answer (Clive, 2026-10-02): Yes. A "Verify a certificate" page recomputes the identifier from the
object name and timestamp and confirms the issue ("Issued by STILL HERE for 'Memorial bench' on …").
An identifier that does not check out gets: "We could not locate this certificate. The object,
however, is still here." The identifier is a checksum made in the browser: it catches typos and
casual edits, and it can be forged by anyone who reads the code. The legal page says so.

**Q8. The accounts dispute: enterprise accounts or not?** (Diane, 2026-10-02)

Answer (Clive, 2026-10-02): No accounts. Clive gets an Enterprise page instead: bulk certification for
municipalities and "the civic rest sector," testimonials, and no form. It collects nothing. Its call
to action: "Enterprise clients: please remain where you are. A representative will be in touch."
Resolves the accounts [CONTRADICTION] in ## Organized; the site stays static.

**Q9. Where does a visitor find the company's internal records?** (Diane, 2026-10-02)

Answer (Clive, 2026-10-02): In the public repository, not on the site. The site shows only what a
company would publish (research, case studies, status, careers, enterprise). The internal records
(issue tracker, correspondence, chat, inventory, gum graph, status notes) live in the repository for
anyone who opens the source.

**Q10. Which example objects sit under the input box?** (Diane, 2026-10-02)

Answer (Clive, 2026-10-03): Everyday things (car keys, phone, wallet, glasses), with a few exotic items
among them. "Folding chair" stays, as named in the braindump.

Exotic items, chosen (Clive, 2026-10-03, from Diane's draft, grand piano struck): the Moon, a
hot-air balloon, an emotional-support peacock, a time capsule (contents unknown), a lighthouse.

**Q11. What does the status page show?** (Diane, 2026-10-03)

Answer (Clive, 2026-10-03): "All systems operational," always, plus an incident history written from
the company's records ("Unexpected concentration of elsewhere on floor three"; "Scheduled relocation
of the flagship research asset (Fridays)"; "Investigating reports of a bench"). Nothing is measured
live; the history is authored content.

**Q12. How much of the wider company does the site acknowledge?** (Diane, 2026-10-03)

Answer (Clive, 2026-10-03): "A Vandalway Industries company" in the footer links to Vandalway's own
website: a one-page site from the 1990s, never updated.

The page's only photo: `assets/s09-sunday-market-1997.png`, a low-resolution 1997 snapshot from a
Sunday market, uncaptioned. (Clive, 2026-10-03)

Open (Diane, 2026-10-03):
- Research note (Diane, 2026-10-03, from `research/1-domain.md`, re-checked by registry lookup):
  vandalway.com belongs to an unrelated party (registered 2018). The footer must not link there.
  Petra recommends the 1990s page live at a path on our own domain, as most 1996 small businesses did.

**Q13. Safari forgets the portfolio after a week. Add a certificate link?** (Diane, 2026-10-03)

Answer (Clive, 2026-10-03): Yes. Every certificate gets a link that carries the object's name and time
after the `#`, so it can be reopened and redrawn at any time without storage, and that part never
reaches the server or its logs. A "Copy certificate link" button sits beside the downloads.

Domains, proposed by Clive (2026-10-03), registry lookup shows no registration record for each (not
proof of availability; nothing purchased): isitstillhere.com for STILL HERE; vandalwayind.com,
vandalwayvandalway.com and vandalways.com for Vandalway's page.

Domains, chosen and purchased (Clive, 2026-10-03; registrar setup pending): **isitstillhere.com** for STILL HERE (served by
GitHub Pages at launch; the home page asks "Is it still here?") and **vandalwayind.com** for
Vandalway's 1990s page (served from our own server, not Pages: Pages allows one custom domain per
repository). Supersedes Petra's path-on-our-domain recommendation for the 1990s page. DNS not yet set.

**Q14. What does Vandalway's 1997 page look like?** (Diane, 2026-10-03)

Answer (Clive, 2026-10-03): Built in-house, and it shows: an under-construction sign, a "best viewed
in Netscape" badge, an animated email icon, and a guestbook broken since 1999.

**Q15.** Answered off the record. (Diane, 2026-10-03)

**Q16. MONOvision on the site?** (Diane, 2026-10-03) — Answer (Clive, 2026-10-03): Not mentioned.

**Q17. WHERE-r-YOU in Jules's bio?** (Diane, 2026-10-03) — Answer (Clive, 2026-10-03): Yes, as his
previous work ("Previously created WHERE-r-YOU"); no ownership claim.

**Q18. Certificate identifier scheme?** (Diane, 2026-10-03) — Answer (Clive, 2026-10-03): The
identifier carries its own date (research 4, Branch B). Verify needs only identifier and name and
states the issue date. Records dated before 2026 quote no identifiers.

**Q19. Which of Jules's additions ride along?** (Diane, 2026-10-03) — Answer (Clive, 2026-10-03): All
four. A QR code inside the certificate; reopening and verifying are one page; the 404 reads "We could
not locate this page. The page, however, is still here." (Exploration 4). `presence.json`
(Exploration 1). `security.txt` with its required expiry (Exploration 13). Installable and offline
(Exploration 17). The published-key signature waits (Exploration 6).

**Q20. Which branches that bend earlier answers are taken?** (Diane, 2026-10-03) — Answer (Clive,
2026-10-03): All but the scheduled Friday test (Exploration 14, declined). Taken: a live hit counter
on the 1990s page, built from that server's own access log (Exploration 9; supersedes R6's frozen
counter); a relocation line on the 1990s page explaining why a 1997 page sits on a 2026 domain
(Exploration 10); the visitor's time zone printed on the certificate (Exploration 15; certificates
now differ by visitor, not by object); a real mailbox (Exploration 12; see Q22).

**Q21. When are the company records written?** (Diane, 2026-10-03) — Answer (Clive, 2026-10-03): The
issue tracker now; everything else during the build.

**Q22. What happens when someone emails us?** (Diane, 2026-10-03) — Answer (Clive, 2026-10-03): A
real address that answers at once in Martin's voice ("Your message has reached us. No one will read
it.") and keeps nothing. Applies to both domains.

**Q23. Priorities as drafted?** (Diane, 2026-10-03) — Answer (Clive, 2026-10-03): Not reordered.
Finish it today, as autonomously as possible; Clive reviews where needed.

**Q24. Real iPhone test?** (Diane, 2026-10-03) — Answer (Clive, 2026-10-03): Yes, a five-minute test
on his phone against staging, from a checklist.
- New assets: the 1990s Vandalway page (period-accurate: hit counter, under-construction banner,
  "best viewed in" badge), and the Sunday-market photo as described above.

### For research
<!-- Nobody in the room can answer. These become the research brief. -->

(Diane, 2026-10-03, from the interview)

- R1. Domain: candidate names for STILL HERE and their availability; whether Vandalway's 1990s page
  lives at its own domain or a path on ours.
- R2. Certificate export in the browser: drawing once as SVG and exporting both PDF and PNG with
  matching type (embedded fonts) on desktop and mobile browsers. Which libraries, and what fidelity
  on mobile Safari.
- R3. GitHub Pages with a custom domain and HTTPS; how the internal staging copy mirrors it; Actions
  versus branch publishing.
- R4. Certificate identifier: a short, human-readable scheme with a check that catches typos, made
  from object name and timestamp in the browser.
- R5. Browser storage for the Presence Portfolio: how long each major browser keeps a site's local
  storage without a visit (reported: Safari may clear it after a period of no interaction; unverified).
- R6. Period-accurate 1990s web conventions for Vandalway's page (what a 1997 small-business page
  actually looked like), so it reads as found, not as parody.

### Build-pack interview (stage 10) (Diane, 2026-10-03)

Proposed defaults D1–D22, from the build-readiness audit's open list. Each stands unless Clive
strikes it; once accepted, each becomes an I-nn. (Diane, 2026-10-03)

| # | Item | Proposed default |
|---|---|---|
| D1 | Leadership page: 12 or 13 | **12**, the staff (`p01`–`p11`, `p13`). Eileen is a customer; she appears in the case studies. |
| D2 | Certificate link format | `/c/#<identifier>.<name, base64url>.<time zone>`; the identifier carries the time (Q18). |
| D3 | Verify: future or malformed identifier | Future: "This certificate has not been issued yet. The object, however, is still here." Malformed: the Q7 mismatch sentence. |
| D4 | Time zone on the certificate | The visitor's own zone, labelled "Jurisdiction of here: America/Chicago" (example). |
| D5 | Input limits | Up to 80 characters; empty or whitespace-only keeps the button disabled; all text rendered as text, never markup. |
| D6 | Paper | US Letter, landscape; the PNG matches its proportions. |
| D7 | Typeface and palette | Headlines and UI: Inter Tight / Inter. Labels: JetBrains Mono (the hero's "ASSET 001" register). Certificate: Cormorant Garamond. Palette from the hero: warm white, graphite, verification green. All free fonts, self-hosted. |
| D8 | Page paths | `/` `/leadership` `/research` `/case-studies` `/status` `/careers` `/enterprise` `/verify` `/portfolio` `/c/` `/legal/terms` `/legal/privacy`. |
| D9 | `presence.json` | `/api/v1/presence.json`, returns `{"status":"STILL HERE"}`. |
| D10 | security.txt Contact | GitHub's private vulnerability reporting for the repository: a real channel that someone reads. |
| D11 | Records source | The sample week, staff list, inventory and gum-graph seeds are filed into `company/` from the brand dossier, minus anything marked confidential. |
| D12 | Sample week dates | Monday 2026-09-28 to Friday 2026-10-02 (as the tracker already dates it). |
| D13 | Records formats | Correspondence and chat: Markdown. Tracker: JSONL for `bd import` (+ Markdown). Inventory: YAML, plus Bev's legacy XML. Status records: XML. Gum graph: an Open Knowledge Format bundle that passes its validator. |
| D14 | What OKF stands for | Open Knowledge Format. Susan uses the real thing. |
| D15 | Careers postings | Three: Senior Presence Engineer; Customer Support Contractor (six weeks); Director of Elsewhere (on hold). |
| D16 | Research papers | Three by Petra: *Here, There, and Emerging Elsewhere* (abstract and contents of 86 pages; "full text available to Enterprise clients"), plus two short papers of 2–4 pages. |
| D17 | 1997 page over HTTPS | Yes. Browsers warn on plain HTTP; the page looks 1997 either way. |
| D18 | "Best viewed in Netscape" | A small period GIF badge, drawn in code (Q14 says badge; Clive built it). |
| D19 | Guestbook | The link leads to a period "Guestbook temporarily unavailable" page dated 1999. |
| D20 | Fictional phone number | 555-0100 to 555-0199, the range reserved for fiction. |
| D21 | Image provenance | Originals in `assets/` keep their embedded content credentials. Web copies are resized, which invalidates them, so web copies carry none. |
| D22 | Hit counter | Counts page loads in the server's own access log, refreshed every ten minutes as period digits; the log is kept 7 days; the privacy note says so. |

- **I-01** Repository owner (Diane, 2026-10-03) — Clive: a `vandalway-industries` organization on
  GitHub (`vandalway-industries/still-here`). Clive creates the organization in the browser.
- **I-02** Outward actions the build may take unattended (Diane, 2026-10-03) — Clive: all three.
  Create the private repository and push (commits under the GitHub no-reply address); set DNS for
  both domains through the registrar's API after a zone snapshot; add vandalwayind.com to the web
  server (Caddyfile backed up, validated before reload, no other site touched).
- **I-03** Mail at launch (Diane, 2026-10-03) — Clive: refuse mail at launch (null MX on both
  domains); Martin's auto-reply (Q22) follows as its own work item once a provider is chosen.
- **I-04** "Finished today" (Diane, 2026-10-03) — Clive: built and staged today; launch after his
  sign-off (golden screenshots, the records table read, the phone test). The public switch may land
  tomorrow if HTTPS for the custom domain takes its time.
- **I-05** Proposed defaults (Diane, 2026-10-03) — Clive: D1–D22 accepted as written (D12 as
  amended to 2026-09-28 – 2026-10-02).
- **I-06** Checkpoints (Diane, 2026-10-03) — Clive: four. (1) Pack sign-off. (2) Golden screenshots of
  the certificate, home, leadership and the 1997 page, approved before the rest is styled. (3) The
  records table read. (4) The launch packet and the phone test, then the public switch.
- **I-07** Phase budget (Diane, 2026-10-03) — Clive: no caps; each phase runs until its checks pass.
  (Jules's note: a phase still reports at a checkpoint rather than looping silently on a failure it
  cannot fix; the run as a whole carries a turn ceiling as a safety, not a target.)
- **I-08** Real product names in technical records (Diane, 2026-10-03) — Clive: yes; browsers,
  hosts and libraries are named as technical facts. No logos, no endorsement.
- **I-09** The customer in the case studies (Diane, 2026-10-03) — Clive: named. The case studies use
  her name, and the records show nobody asked her first.
- **I-10** The production server's reverse record (Diane, 2026-10-03) — Clive: accepted as it is.
- **I-11** Further production-server changes (Diane, 2026-10-03) — Clive: authorized with guardrails.
  A new internal-network serve port only, never an existing route or another site; a timer for the
  counter; files under `/srv`; the Node runtime if absent. Every change is scripted in `deploy/` with
  a matching undo script and validated before reload.
- **I-12** Identifier check symbol (Diane, 2026-10-03) — Clive: Crockford's published check symbol,
  odd final characters included. Not revisited at the golden checkpoint.
- **I-13** C1, pack sign-off (Diane, 2026-10-03) — Clive: approved as written, including the 21
  calls in PRD diff item 8; run ceiling 1,400 turns; the phone checklist as written (eight steps on
  staging, four re-checked on production).

## Exploration

<!-- Stage 6. Combinations, white space, technical convergence. Deadends get documented conclusions, not assumptions. -->

### 2026-10-03 — Exploration (Jules, 2026-10-03)

Diane asked me to look at this the way I look at a return value: what it already does, and what it
could do without changing the answer. Every answer in `## Questions` stands. Where an idea would
bend one, I say which, and it is a branch, not a recommendation. Live checks were run today; each
cites what I looked at. Anything without a source is labeled as mine.

#### 1. The public API is a file, and the host already enforces Q1

A static file at a path such as `/api/v1/presence.json` reading `{"status": "STILL HERE"}` is a
complete presence API. I checked how GitHub Pages treats such a request (2026-10-03, against
`pages.github.com`): `/?object=Lucas` and `/index.html?object=Adrian%20Vale` returned the same 14,446
bytes, byte-identical to `/`, and a JSON file (`/versions.json?object=Lucas`) came back `200`,
`content-type: application/json`, `access-control-allow-origin: *`. Any query string is accepted,
ignored, and answered identically, and any other website's code may read the answer. Q1's "no
exceptions and no tells" would then hold at the level of the content delivery network, not only in
our JavaScript. The status page's "All systems operational" (Q11) can be a second file in the same
folder and the incident history a third, so the page and its machine-readable copy share one source.
Sources: Q1, Q11, R3 §3; live `curl` of pages.github.com, 2026-10-03. The API file is my speculation.

#### 2. `where()` as a vendored dependency

"Establishing here" and "Comparing here with here" are, implemented honestly, two calls to one
function and one equality check. WHERE-r-YOU's function returns "here." If that function lives in
the STILL HERE repository as a small, separately versioned, separately licensed module credited to
its previous product, the company thesis (being somewhere, then remaining) is visible in the
dependency graph, and the second step of the ritual is literally `where() === where()`. The code
does exactly what the screen says. Nobody needs to be told.
Sources: BRAINDUMP (the thesis; the ritual, step 3). The module is my speculation.

#### 3. The records carry identifiers that verify on the live site

R4's test vectors already include `Memorial bench` at 2026-10-03T10:52:01Z → `SH-00PP-9AHN-M3JT`
(Branch B). If the support correspondence in the repository quotes a real identifier like that one,
a reader who finds the email in the source can paste it into the public Verify page and watch it
check out. The records and the product then corroborate each other across the boundary Q9 draws:
the site never shows the records, but the records point at something the site will confirm. The
same holds for identifiers in the issue tracker, the inventory, or the status notes. Stable
identifiers become the thread a reader pulls.
Sources: Q7, Q9, R4 (test vectors). The cross-reference is my speculation.

#### 4. Reopening is verifying

Q7's Verify page and Q13's certificate link recompute the same thing from the same two fields. They
can be one action: opening a certificate link redraws the certificate and confirms it in the same
motion, so "Verify a certificate" and "reopen a certificate" are one page reached two ways. A QR code
drawn inside the certificate's SVG would carry that link into both the PDF and the PNG (Q3: drawn
once, exported to each) and onto paper. Scanning a printed certificate reopens and verifies it, and
the name and time still travel only after the `#`, never to a server or its logs. The custom 404
that Pages supports can borrow Q7's sentence: "We could not locate this page. The page, however, is
still here."
Sources: Q3, Q7, Q13, R3 §3 (custom 404), R5 (fragments are not sent to the server). The merge, the
QR code and the 404 sentence are my speculation.

#### 5. Every shared link previews as the same certificate

Because the fragment never reaches the server (R5, citing MDN), a link-preview service fetching a
certificate link receives exactly the page everyone receives. Its title, description and preview
image are therefore identical for every object anyone ever certifies. The preview image can be the
folding chair's certificate: a link for "My car keys" posted anywhere unfurls as the chair. That is
Q1 again, enforced by HTTP itself, at no cost.
Sources: Q1, Q13, R5 (source 11, MDN URI fragment). The choice of preview image is my speculation.

#### 6. Signed with a key we published (branch alongside Q7's checksum)

Ed25519 signing is in every major browser's Web Crypto: Chrome 137, Firefox 129, Safari 17
(MDN browser-compat-data, `api/SubtleCrypto.json`, fetched 2026-10-03). A certificate could carry a
real digital signature over name, time and identifier, made in the visitor's browser with a private
key that sits, in plain view, in the public repository. Verification would be genuine mathematics;
forgery would be available to anyone who reads the code, which is what Q7 already promises the
legal page will say. This does not contradict Q7; it adds a field. Costs, stated plainly: a
signature is 64 bytes, about 103 Crockford symbols, far past R4's "under about 16 characters," so it
would live in the QR code or the link rather than on the face of the certificate; and
`crypto.subtle` needs a secure context, which R3 already carries for staging.
Sources: Q7, R3 §4, R4; https://raw.githubusercontent.com/mdn/browser-compat-data/main/api/SubtleCrypto.json.
The signature length is my arithmetic; the design is my speculation.

#### 7. The only independent record of our presence is a public log

When Pages provisions HTTPS for isitstillhere.com it requests the certificate from Let's Encrypt
(R3 §2), and "Let's Encrypt submits all certificates we issue to CT logs"
(https://letsencrypt.org/docs/ct-logs/). Certificate Transparency is, in its specification's first
sentence, "an experimental protocol for publicly logging the existence of Transport Layer Security
(TLS) certificates" (RFC 6962, https://www.rfc-editor.org/rfc/rfc6962.html). Every renewal adds an
entry: a third party with no interest in us, recording that our certificate continues to exist.
Research could cite it; the status page could link to it as independent verification. I could not
confirm a lookup for our domains today: crt.sh answered 502, and with DNS not yet set (Q13) no
certificate has been issued. Unverified until after launch.
Sources: R3 §2, Q13; the two URLs above. The use on the site is my speculation.

#### 8. We do not have server logs either

The platform note says "server logs only, so the privacy page can say so." On GitHub Pages the logs
are GitHub's, not ours. GitHub's documentation: "When a GitHub Pages site is visited, the visitor's
IP address is logged and stored for security purposes"
(https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages). I found no
GitHub documentation of any way for a site owner to read those logs or a visitor count; a
long-running community thread (https://github.com/orgs/community/discussions/31474, last edited
2024-09-13 by its author) says there is "still no way." Not found is not impossible. If it holds,
the privacy page can say something stronger than planned (we see no visits at all) and must say
something it did not plan (our host logs addresses for security, under its own privacy statement).
The only server whose logs we would hold is the one serving vandalwayind.com (Q13).
Sources: BRAINDUMP platform note; Q13; the two URLs above.

#### 9. A hit counter that tells the truth (branch; bends R6 and arguably Q12)

Following from 8: vandalwayind.com, on our own server, is the one place in the enterprise where a
real measurement exists. A counter image regenerated from that server's access log, worded as R6
found them ("This page has been visited [n] times since <date>"), would be no script and would
collect nothing the server does not already keep, yet it would make the parent company's 1990s page
the only thing we own that reports a true number. It contradicts R6's recommendation (a frozen
counter, to match "never updated"), and a moving counter is arguably the page updating, against
Q12. Recorded as a branch; the frozen counter is the recommendation in force.
Sources: Q12, R6 (hit counter), BRAINDUMP platform note. The idea is my speculation.

#### 10. The registry remembers when we arrived

Anyone who looks up vandalwayind.com will find it registered 2026-10-03, and the Wayback Machine's
first capture will be from 2026. A page from the 1990s on a domain born this week is a tell. The
period has its own answer: R6 found "WE'VE MOVED TO A NEW SITE!" and "Our gift boxes have been
relocated to: …" notices among 1998 pages, and R1 counted 13 of 16 small businesses living at a path
on someone else's server in 1996. A Vandalway page that once lived at a path on an internet
provider's server and was moved, intact and unedited, to its own domain explains the date without
explaining anything else. Branch: Q12 says "Nothing is explained anywhere," which may cover this
too; whether the page carries a relocation line is the author's call.
Sources: Q12, Q13 (domains purchased 2026-10-03), R1 (path count), R6 ("Where they lived").

#### 11. Period HTTP is now a warning (neutral note)

A 1990s page was served over plain `http://`. As of this month that has a visible cost: Google's
announcement says Chrome enables "Always Use Secure Connections" for public sites by default in
Chrome 154, October 2026, asking the user's permission before the first access to any public site
without HTTPS (https://security.googleblog.com/2025/10/https-by-default.html). An HTTP-only
vandalwayind.com would greet most Chrome visitors with an interstitial before the page. Served over
HTTPS, the page shows no tell of it: R6 confirmed HTML 3.2 renders in quirks mode in current
browsers, and nothing on the page needs to know the scheme. Conclusion: authenticity of transport and
an uninterrupted first view no longer coexist in Chrome.
Sources: R6 ("How it renders today"); the Google URL above.

#### 12. A company that declares it receives no mail

R6 found a visible `mailto:` on 9 of 13 period business pages, so Vandalway's page will want one.
RFC 7505 defines a "null MX" record (`MX 0 .`) declaring that a domain does not accept email, which
lets a mail system "report the delivery failure when the user sends the message, rather than hours
or days later" (https://www.rfc-editor.org/rfc/rfc7505.html). Set on both domains, it makes the
Enterprise call to action (Q8: "please remain where you are. A representative will be in touch")
and the 1990s page's address consistent with "collects nothing": you may write, and the mail system
will tell you at once that nobody received it. Branch: a real mailbox would collect messages, which
sits against Q8; a null MX keeps Q8 exact.
Sources: Q8, R6 (feature table); RFC 7505 URL above.

#### 13. security.txt, which is required to expire

RFC 9116 places `security.txt` at `/.well-known/security.txt`; `Contact` "MUST always be present,"
`Expires` "MUST always be present," and "It is RECOMMENDED that the value of this field be less than
a year into the future" (https://www.rfc-editor.org/rfc/rfc9116.html). A presence company publishing,
on a standards-required schedule, the date on which its own statement stops being valid has a
renewal ritual it did not have to invent. Contact can point at the repository's public issue tracker
rather than a mailbox (see 12). R3 notes `upload-pages-artifact` excludes dotfiles unless
`include-hidden-files` is set, so `.well-known/` must be included on purpose.
Sources: R3 §1; RFC 9116 URL above.

#### 14. The Friday test, scheduled, and the condition under which it stops

Q11's incident "Scheduled relocation of the flagship research asset (Fridays)" could be a real
scheduled workflow: every Friday it appends a dated QA entry to the records under its own automation
identity and redeploys. GitHub's documentation: scheduled workflows in public repositories are
automatically disabled when "no repository activity has occurred in 60 days"
(https://docs.github.com/en/actions/managing-workflow-runs-and-deployments/managing-workflow-runs/disabling-and-enabling-a-workflow).
The only automated movement in the company stops when nobody is here. Branch: Q11 calls the history
"authored content"; a timer-written entry is still authored text, but generated rather than written,
and that difference is the author's to rule on.
Sources: Q9, Q11; GitHub Docs URL above. The workflow is my speculation.

#### 15. Here has a time zone (branch; bends Q1)

The browser reports its IANA time zone without asking: `Intl.DateTimeFormat().resolvedOptions().timeZone`
defaults to "the runtime's default time zone," for example "Europe/Brussels"
(https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/resolvedOptions).
Printed as "Jurisdiction of here," it would be the nearest thing to a location the product ever
states, gathered without a permission prompt and never sent anywhere. It contradicts Q1 in one
respect: certificates would differ by visitor (not by object), which is a tell of a kind, and it
would have to enter the Q13 link to be redrawn. Recorded as a branch only.
Sources: Q1, Q13; MDN URL above.

#### 16. What a link may claim about time

A Q13 link carries the time after the `#`, and anyone can edit it. A link dated 1997, or 2099, will
recompute a valid checksum (Q7: forgeable by anyone who reads the code). One mechanical fact from R4
matters: Branch B counts seconds from 2026-01-01T00:00:00Z, so it **cannot represent any moment
before 2026**; Branch A (a hash of name and ISO timestamp) can represent any. Under Branch B, STILL
HERE is unable to certify anything before its own epoch, including a Sunday market in the 1990s. What
the Verify page says to a future-dated link (Q10's time capsule, contents unknown, is the natural
test) is a question for Diane, banked here, not answered.
Sources: Q7, Q10, Q13, R4 (Branch A, Branch B).

#### 17. Installed, it stays and works offline (extends Q6)

R5 documents the one Safari exemption from the seven-day deletion: the site added to the Home
Screen. A web app manifest and a service worker that caches the site would make STILL HERE
installable and able to run the whole ritual with no network connection, since nothing in it needs
one (BRAINDUMP platform note: generated in the visitor's browser). The portfolio would persist on
iOS, and the product would go on certifying presence while disconnected from everything. R5 also
records that Safari deletes service worker registrations under the same seven-day rule for sites
not installed, so for an ordinary tab this adds nothing. Q6 does not mention installation; this
extends it rather than contradicting it.
Sources: Q6, R5 (Safari section; option 4); BRAINDUMP platform note. Offline behavior is my
speculation, untested.

#### 18. Deadend: a Wallet pass made in the browser

A certificate as an Apple Wallet pass would sit beside boarding passes, which is the right company.
Apple's guide: passes "are cryptographically signed," with "a PKCS #7 detached signature of the
manifest file, using the private key associated with your signing certificate," whose pass type
identifier must match
(https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/PassKit_PG/Creating.html).
With no server, that private key would have to ship to every visitor's browser, which publishes an
Apple-issued credential. Conclusion: technically conceivable, and the opposite of idea 6, where the
published key is ours to publish. Whether Apple's terms permit it: not checked. Google Wallet: not
examined.
Sources: BRAINDUMP platform note; Apple URL above.

#### 19. Deadend, partly: content credentials on each certificate

A certificate carrying C2PA content credentials would certify the certificate. The browser library
`c2pa-web` is documented for reading and validating; adding signed manifests is described only for
the Node.js library, `c2pa-node` (https://github.com/contentauth/c2pa-js, fetched 2026-10-03).
Conclusion: certificates made in the visitor's browser cannot carry credentials with the documented
tools today; fixed images signed at build time (a specimen chair certificate, the preview image in
5) can. Not documented is not impossible.
Sources: Q3; the GitHub URL above.

#### How the surfaces hold each other up

| Surface | What it does for the others | Ideas |
|---|---|---|
| The public product (isitstillhere.com) | Returns the constant everywhere: page, API file, preview card, 404 | 1, 4, 5 |
| The company website around it (Q2) | Legal, research and status state the limits the product embodies: forgeable identifiers, a public key, no logs we can read | 6, 7, 8, 13 |
| The records in the repository (Q9) | Quote identifiers the live Verify page confirms; the Friday test writes itself into them | 3, 14 |
| Vandalway's page (vandalwayind.com) | The one place with real logs and a real date in a public registry; its period mailto bounces honestly | 9, 10, 11, 12 |
| The certificate link (Q13) | Is the Verify page; survives Safari; carries a QR code to paper; can claim any time | 4, 16, 17 |
| The records as data (Q9) | Stable identifiers shared by records, certificates and the API file let a program follow the same thread a person does | 1, 3 |

Sources: the ideas above. The arrangement is mine.

## Changelog

- 2026-10-02 — Born: Organizer ran on `BRAINDUMP.md` as of its `updated:` 2026-10-02. (Petra, 2026-10-02)
- 2026-10-02 — Diff audit on Petra's draft: DROPPED file furniture only, ADDED 11 marked lines and no unmarked ones, PROMOTED none. Ready for Clive's red pen. (Bev, 2026-10-02)
- 2026-10-03 — Interview (stage 4): Q1–Q12 answered by Clive; research brief R1–R6 banked. (Diane, 2026-10-03)
- 2026-10-03 — Exploration (stage 6): 19 ideas under `## Exploration`, two of them deadends, branches marked where an idea bends an answer; live checks cited. (Jules, 2026-10-03)
- 2026-10-03 — Q15–Q24 answered; branches taken per Q20. (Diane, 2026-10-03)
- 2026-10-03 — Stage 10: D1–D22 proposed and accepted; I-01–I-08 recorded. (Diane, 2026-10-03)
