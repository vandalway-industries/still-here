---
updated: 2026-10-03
read_by: PLAN.md's author at the PLAN gate; the build-readiness auditor; `/goal` at BUILD entry (with HANDOFF.md + PLAN.md); any agent asked "is this in scope?"; the critic, when it checks a unit for scope reduction (critic rule 8)
relations:
  derived_from: garage/HANDOFF.md
---

# STILL HERE — PRD

> **Stable intent: what & why.** Changes rarely and deliberately. Execution order lives in
> `PLAN.md`; granular work in beads. Authored at the PLAN gate from `garage/HANDOFF.md`, the
> interview (`garage/BRAINSTORM.md` Q1–Q24), the stage-10 decisions (D1–D22, I-01–I-08) and the
> tracker's settled acceptance lines — the first and only place scope enters. Every claim here
> means what it says. Where a line could be read two ways, the narrower reading is wrong.
> (Diane, 2026-10-03)

### Diff against HANDOFF

Read this first at sign-off (C1). Kept, changed with the reason, dropped with the reason. Nothing
the interview decided is narrowed anywhere below except where this list says so. (Diane, 2026-10-03)

**Kept, as decided** — every Settled line, every Addition, every priority in its confirmed order
(Q23), I-01 to I-12, and D1 to D22 as accepted (I-05). Specifically: the ritual and its three
lines (BRAINDUMP); the identical certificate for every object (Q1); 4–5 seconds under an indicator
that never moves (Q5); the ten examples (Q10); Clive's top, Diane's footer verbatim (Q4); one SVG
exported to PDF and PNG (Q3); the identifier with its own date and the Verify page (Q7, Q18); the
certificate link after the `#` (Q13); the company website (Q2); no accounts and the Enterprise page
(Q8); the device-only portfolio (Q6); "All systems operational" with an authored history (Q11);
the records in the repository, not on the site (Q9); the footer acknowledgement and the 1997 page
at vandalwayind.com (Q12, Q14, Q16, Q17); QR code, reopening is verifying, the 404 sentence,
`presence.json`, `security.txt`, installable and offline (Q19); the live hit counter, the
relocation line, the visitor's time zone (Q20); the issue tracker as written (Q21); the phone test
(Q24); static hosting, internal staging, Pages from the site folder only, no analytics, and a
privacy page that tells the truth about every log (BRAINDUMP platform note; research 3, 5;
Exploration 8).

**Changed, and why**
1. Leadership shows **twelve** portraits, not thirteen (HANDOFF Priority 2 said "all thirteen").
   D1: the staff are `p01`–`p11` and `p13`; Eileen is a customer and appears in the case studies
   and on Enterprise.
2. Mail is **refused at launch** on both domains by a null MX (I-03). Q22's auto-reply in Martin's
   voice becomes its own work item once a provider is chosen. Walk W7's "I get Martin's reply"
   step therefore reads "my mail program reports at once that it could not be delivered."
3. Page paths are D8's list. `/research` and `/case-studies` are folders, because each holds three
   pages (D16's three papers; the three case studies); our links use `/research/` and
   `/case-studies/`, and the bare paths answer one same-site 301, which is how Pages answers a
   folder (research 3 §3). Six sub-pages are added under those two paths.
4. Staging uses **Caddy**, not research 3's nginx: the server runs Caddy and has no nginx (audit).
   It is reached over the internal network's HTTPS on its own port, so no existing route on that
   server is replaced (audit, "Staging does not match the server").
5. Hit counter: refreshed every ten minutes (D22), not every five (audit proposal). Because the log
   is kept seven days (D22), the counter keeps a running total in one file; the total survives
   rotation and is the only thing kept beyond the seven days. It counts GET `/` answered 200 or 304,
   and the page is sent with `Cache-Control: no-cache`, so a reload reaches the server and counts.
   The bar: three loads show at least n+3 within eleven minutes (one timer period plus a minute).
6. Long names: sh-032's 200-character case becomes the 80-character maximum (D5).
7. iOS rows (PDF font timing, saving, storage, scanning a printed QR code) move to Clive's phone
   checklist at C4; Linux WebKit is not iOS (audit). CI decodes the QR code from the exported PNG
   and PDF instead.
8. **My calls, for Clive to overrule at C1** — each is a gap the interview did not close and the
   loop would otherwise have asked about:
   - **Verify by hand** (identifier and name, no link) states the issue moment in UTC. The
     certificate face carries the same UTC moment in small print, so the face and Verify always
     share a date (sh-009's acceptance). Reopening a link states the issuer's zone, as the face does.
   - **Reduced motion keeps the 4–5 second pacing** (sh-029 banked it; Q5 says "the same three
     lines appear in order"). Only the animation goes.
   - **Names outside the certificate face** (Hebrew, Arabic, emoji, CJK; sh-033 banked "coverage
     beyond Latin"): when every character is in the certificate face the name is vector text in
     both files; otherwise the name block is drawn by the visitor's browser and placed in the PDF
     as a 600-dpi image in the same position as in the PNG. The name is never altered or refused
     for its script.
   - **Download filenames** are `STILL-HERE-<name slug>-<identifier body>.pdf` / `.png`, e.g.
     `STILL-HERE-folding-chair-00PP9AGR1GT.pdf` (sh-023: different objects, different names; no
     `*` from a check symbol in a filename). The slug is ASCII, at most 40 characters, `object`
     when a name has no Latin letters or digits (rule in `CONTENT_SEEDS.md`).
   - **"Future"** in D3 means more than five minutes ahead of the viewer's clock, so a link opened
     on a second device with a slow clock is not called unissued.
   - **Enterprise testimonials** are verbatim customer sentences already on file (SUPPORT-001,
     sh-025), attributed to "Eileen Webb, Municipal Archivist". Nothing is invented as a quote.
   - **Placement of the office and asset photographs** (`s01`–`s08`, `m1`–`m3`), which no answer
     placed: listed in `garage/pack/ASSET_MANIFEST.md`, judged at C3.
   - **During the sequence** the input and examples are inert; the identifier encodes the second of
     the press; the certificate is saved only when the result appears; leaving mid-sequence
     issues and saves nothing.
   - **After the result** the address stays `/` with no history entry; the result replaces the
     form; a reload shows an empty home page (the certificate is in the portfolio and its link).
   - **Enter** in a filled input starts the check; Enter in either Verify field submits.
   - **The result says where it is kept:** "Kept in Your Presence Portfolio on this device.",
     linked to `/portfolio`.
   - **`/c/` offers** Download PDF, Download PNG, Copy certificate link and Check another; each
     portfolio entry offers Open, Download PDF and Download PNG.
   - **`/c/` and Verify on failure** draw no certificate: the sentence, then "Verify a
     certificate" and "Check an object". Bare `/c/` shows the Verify form. Opening someone's link
     never adds it to this device's portfolio.
   - **Verify judges in order:** malformed, then wrong name or typo (both the not-located
     sentence), then future. `SH-` is optional; an empty field gets "Enter the certificate
     identifier and the object's name."
   - **Exports show progress** ("Preparing PDF…"), ignore a second tap, and on failure say "The file
     could not be prepared. Your certificate is still here: try again, or copy its link." in
     graphite.
   - **A word longer than the line** breaks at grapheme boundaries with no hyphen; a name may take
     four lines at the 30-unit floor.
   - **Dates and times** are English, day month year, 24-hour, whatever the browser's locale
     (formats in `CONTENT_SEEDS.md`).
   - **A clock before 2026-01-01** runs the sequence and then says the records cannot express that
     moment; no certificate is issued, because Branch B cannot encode it.
   - **Offline**, every HTML page is precached, an image never seen shows its description, and an
     unknown path shows the cached 404.
   - **The counter starts at go-live:** N2 resets the total to 0, writes the go-live date into the
     counter line, and sets the file time back to 1997.
   - **The menu** is eight items (Verify, Portfolio, Leadership, Research, Case studies, Status,
     Careers, Enterprise); **the footer** is three (Terms of Presence, Privacy, "A Vandalway
     Industries company").
   - **Steps a browser cannot perform** (opening a downloaded file, clearing site data, installing,
     sending mail, scanning paper) are played by named substitutes in `garage/pack/WALKS.md`, and
     the ones with no substitute are on Clive's phone checklist; none passes silently.
   - **The continuity fixture** (hashed phrases for the two continuity checks) is supplied by
     Clive at C1 with the brand dossier's location; the run never sees the phrases.
   - **A bead waiting only on C2's blind pick** stays open, its phase is set `held`, and the run
     moves on; when C2 lands the picks run and the beads close.
   - **A red-pen at C2 or C3 on a locked string** is itself the approval of the test change: a
     separate test-author session applies it and re-tags, recorded in `CHECKPOINTS.md`.
   - **The security.txt reminder:** one scheduled workflow opens an issue (never commits) 30 days
     before `Expires`, assigned to the account named in a repository variable. GitHub disables
     scheduled workflows after 60 days with no repository activity, so the date in `PROJECT.md`
     stays the backstop.
   - **The run's turn ceiling is 1,400** (the phase estimates sum to 1,050). At the ceiling the run
     starts no new bead, lets any running Worker return, writes `docs/checkpoints/ceiling-packet.md`
     and `SESSION_STATUS.md`, and stops.
   - **Clive re-checks four phone items on production** after launch (two minutes), because the C4
     test runs on staging over the internal network.
9. The launch is two phases, not one: Phase 7 ends in the C4 packet; Phase 8 runs after Clive makes
   the repository public, because Pages on our plan needs a public repository (research 3 §1) and
   the switch is his (I-04, I-06). vandalwayind.com is built and served internally in Phase 6 and
   gets its public DNS record in Phase 8, after his sign-off.
10. Firefox joins Chromium and WebKit in the local test engines (the audit found it missing).
11. Sequencing after the blind read (`garage/pack/BLIND_READ.md`): the site shell and placeholder
    pages are built in Phase 2, before the ritual, so the menu exists for Phase 2's walks; the
    papers and the status updates are written in Phase 3 by the pages that show them; Phase 5
    checks them as records.
12. The customer is named in the case studies: Eileen Webb (I-09). The production server's reverse
    record is accepted as it is (I-10). The production-server changes beyond Caddy are authorized
    with guardrails (I-11). The check symbol stays Crockford's mod 37 (I-12).

**Added** (recommendations in the audit or the tracker, now requirements; each is cheap and each is
named): WCAG 2.2 AA with axe at zero serious or critical findings (sh-027, audit); the page-weight
bar (audit); a published build id at `/build.txt` on staging and production ("doing is not
serving"); a Content-Security-Policy meta tag (research 3 §3: Pages sets no headers); SPF `-all`
and a DMARC reject record beside each null MX, so refusing mail is complete; Open Graph tags whose
image is the hero photograph, identical on every page; a screen-reader step on the phone checklist
(sh-027 asks for one); careers postings collect nothing (Q8's rule applied to Q2's careers page).

**Dropped, with the reason** — none of these was decided in; each is stated so nobody builds it:
- The scheduled Friday test (Exploration 14): declined at Q20. The only scheduled workflow is the
  security.txt reminder (item 8), which writes no record and commits nothing.
- The published-key signature (Exploration 6): waits, per Q19.
- Martin's mail auto-reply at launch: after launch, per I-03.
- A Share button (Web Share API): never settled. The iOS share sheet is reached from the
  downloaded file, which the phone checklist tests.
- `where()` as a vendored module (Exploration 2), the certificate as the link-preview image
  (Exploration 5; the hero photograph is used instead), the Certificate Transparency link
  (Exploration 7): not taken at Q19 or Q20.
- Rotating example objects (sh-040): not on Q10's list.
- Apple Wallet passes and C2PA credentials on certificates (Explorations 18, 19): deadends.

## Problem

People already remain where they are. Nobody certifies it. STILL HERE™ does: a visitor names an
object, presses **Check presence**, and receives an unnecessarily official certificate that it is
still here (BRAINDUMP). The product the company has today prints a certificate whose PDF loses its
typeface (sh-003), whose time has no zone (sh-009), whose identifier means nothing (sh-018), and
which is gone when the tab closes (sh-022). The company around the product has no website a
customer or a shareholder can point at (sh-019, sh-020).

## Goals

v1 is done when a person can do this, on the public internet, with nothing faked:

1. Open **isitstillhere.com** on a phone or a computer, name any object or tap an example, press
   **Check presence**, watch three lines over four to five seconds, and receive the certificate:
   **STILL HERE.**, the name as given, the time with their own time zone, an identifier, a QR code.
2. Download it as a PDF and as a PNG that show the certificate's own typefaces; copy its link;
   reopen the link anywhere and see the same certificate confirmed; verify it by hand from the
   identifier and the name; scan the printed QR code and land on the same confirmation.
3. Come back on the same device and find it in **Your Presence Portfolio**.
4. Read the company: leadership (twelve), research (three papers), three case studies, status,
   careers, Enterprise, Terms of Presence, Privacy; follow "A Vandalway Industries company" to
   **vandalwayind.com** and find a 1997 page with a counter that tells the truth.
5. Install it and do all of 1–3 with no network.
6. Open the public repository and find the company's records: tracker, correspondence, chat,
   inventory, status records, the gum graph, Petra's papers. Every identifier quoted in them
   verifies on the live Verify page.

Measured by the acceptance criteria below and the walks in `garage/pack/WALKS.md`. The certificate
says what it is: "Confirms successful completion of this form. No physical inspection occurred."

## Non-goals

This does not include:
- **Accounts** of any kind, enterprise or personal, and no shared database (Q8). The site is static.
- **Analytics** or any tracking script, pixel, or third-party request, anywhere on either domain
  (BRAINDUMP; settled).
- **A real inventory service.** The public product never reads Bev's inventory and never answers
  anything but STILL HERE (BRAINDUMP, Bev and Diane; Q1). The inventory is a record in the
  repository, nothing more.
- **The Friday bot** (Exploration 14): no automated record entries; the only scheduled workflow is
  the security.txt reminder, which opens an issue and nothing else.
- **The published-key signature** (Exploration 6): no private key and no signing code in `site/`.
- **Mail auto-reply at launch** (I-03): both domains refuse mail with a null MX until a provider is
  chosen as a separate work item.
- A dark theme (the certificate is paper and the site matches it); a Share button; per-entry
  delete or a clear control in the portfolio (clearing the browser's site
  data clears it, Q6); example rotation; WHERE-r-YOU's own product; MONOvision anywhere on either
  site (Q16).
- Any statement, on the site or in a record written by staff, of where Lucas now works. The
  receipts are the only evidence and stay that way.

## Users

- **A visitor with an object**, on a phone more often than not (sh-039: half the download emails
  come from phones). Wants the certificate, wants to keep it, wants nothing asked of them.
- **The civic rest sector**: municipal archivists with registers and auditors (sh-025). They print.
- **Whoever opens the repository**: readers, and programs that read the records as data. They
  find the internal records the site never shows (Q9), through the READMEs (R57, W9).
- **Vandalway** (Malcolm): reads the site as a portfolio company's site, and is not given numbers
  (sh-035).
- **The staff**, who appear on the leadership page and in every record.

## Requirements

### Must have

#### The ritual (Priority 1)

- [ ] **R1** Home page `/` asks "Is it still here?" (Q13) above one text input and the button
  **Check presence** (BRAINDUMP).
- [ ] **R2** Exactly ten examples sit under the input, in Q10's order: Car keys · Phone · Wallet ·
  Glasses · Folding chair · The Moon · A hot-air balloon · An emotional-support peacock · A time
  capsule (contents unknown) · A lighthouse. Tapping one fills the input and leaves it editable.
  No "grand piano". (Q10; exact display wording judged at C2.)
- [ ] **R3** Input rules (D5): at most 80 Unicode code points after NFC normalization, enforced in
  the input and in links; empty or whitespace-only keeps the button disabled, and pressing it or
  Enter on an empty input shows a sentence telling the visitor to name an object; every name is
  rendered as text, never as markup, in the DOM, SVG, PDF and PNG.
- [ ] **R4** Pressing **Check presence**, or Enter in a filled input, disables a second press, makes
  the input and examples inert, and starts the sequence: "Establishing
  here." · "Comparing here with here." · "No actionable elsewhere detected." — in that order, for
  every object, each visible at least 1,000 ms before the next, the certificate visible 4,000–5,000
  ms after the press and within ±100 ms across ten names, under an indicator whose position and
  transform never change (Q5, sh-049). Lines are announced through `aria-live="polite"`. The
  identifier encodes the second of the press; leaving before the result issues and saves nothing.
- [ ] **R5** Reduced motion: no animation and no transition runs; the same three lines appear in
  order at the same pacing (Q5; my call, diff item 8).
- [ ] **R6** The result shows **STILL HERE.**, the name as typed, the local time with the visitor's
  IANA time zone labelled "Jurisdiction of here: <zone>" (D4), and the identifier; then **Download
  PDF**, **Download PNG**, **Copy certificate link**, **Check another**, and "Kept in Your Presence
  Portfolio on this device." The result replaces the form; the address stays `/`. Check another
  restores the form, empty, with the cursor in it (W1). A clock before 2026-01-01 gets the
  pre-2026 sentence instead of a certificate (`CONTENT_SEEDS.md` § Interface strings).
- [ ] **R7** No tells (Q1): for "Adrian Vale", "Memorial bench", "Lucas", "My car keys" and all ten
  examples, the certificate SVG with the name, time, zone, identifier and QR fields masked is
  byte-identical to Folding chair's, and the sequence DOM is identical. The check consults
  nothing (sh-013).

#### The certificate (Priority 1)

- [ ] **R8** One SVG certificate, US Letter landscape (D6), drawn in the visitor's browser (Q3).
  Clive's language at the top ("This certifies that…", the seal, two signatures); the footer in
  small type at the bottom, verbatim: "Confirms successful completion of this form. No physical
  inspection occurred." (Q4). Typefaces per D7: Cormorant Garamond for the certificate text,
  Inter Tight for the wordmark, JetBrains Mono for the identifier.
- [ ] **R9** The certificate uses only SVG that svg2pdf.js draws: `svg`, `g`, `path`, `rect`,
  `circle`, `line`, `polyline`, `text`, `tspan`, `image` (for diff item 8's name block only), solid
  fills and strokes, explicit transforms. No filters, masks, gradients, `textPath`, `foreignObject`
  or CSS inside the drawn SVG (research 2); the PNG exporter adds its font `<style>` to a
  serialized copy only. The "STILL HERE." heading's glyph positions are set
  explicitly so the period clears the E identically in both files (sh-010).
- [ ] **R10** Long names shrink to a 30-unit floor, then wrap to up to four centered lines (a word
  wider than the line breaks at a grapheme boundary, no hyphen), with nothing under the seal; an 80-code-point name and a single 60-character word print in full and
  legibly at 100% in both files (sh-032, D5).
- [ ] **R11** Names whose characters are all in the certificate face are vector text in the PDF;
  others follow diff item 8. "Café" typed composed and decomposed prints identically and yields the
  same identifier (sh-033).
- [ ] **R12** The face carries the issue moment in UTC in small print beside the identifier (diff
  item 8).
- [ ] **R13** A QR code drawn as SVG rects or paths inside the certificate encodes the certificate
  link exactly (Q19), in graphite on warm white unless green passes the same scan test (sh-044). It
  decodes from the exported PNG and from the PDF rendered back, including at the maximum name length.
- [ ] **R14** **PDF**: jsPDF 4.2.1 + svg2pdf.js 2.8.1, TrueType faces registered before conversion and
  embedded (`/FontFile2` under the registered family), Letter landscape (research 2; sh-003, sh-024).
  **PNG**: the same SVG with its fonts inlined, drawn to a canvas at 300 dpi (3,300 × 2,550, under
  iOS's 16,777,216-pixel cap), exported with `toBlob`, the canvas released to 0 × 0 afterwards;
  fonts are confirmed loaded (`document.fonts.load`, `img.decode()`) before drawing (research 2).
- [ ] **R15** The PDF rendered back with pdf.js at 150 dpi differs from the PNG at 150 dpi in at most
  1% of pixels (research 2's render-back; HANDOFF NEEDS-BAR).
- [ ] **R16** Filenames per diff item 8 and `CONTENT_SEEDS.md` § Download filenames; two different
  objects never share a filename (sh-023). Exports show progress and a stated failure (diff item 8).

#### The identifier (Priority 1)

- [ ] **R17** Branch B (research 4; Q18): `SH-` + 7 Crockford Base32 symbols of seconds since
  2026-01-01T00:00:00Z + 4 symbols from the first 20 bits of SHA-256(canonical name + `|` + those
  7 symbols) + one Crockford mod-37 check symbol over the 11-symbol body, printed as `SH-XXXX-XXXX-XXXX`. Canonical name: NFC, trim,
  collapse internal whitespace, lower-case. Hashing via `crypto.subtle.digest`.
- [ ] **R18** The four published vectors reproduce exactly: `Folding chair` 2026-10-03T10:52:00Z →
  `SH-00PP-9AGR-1GTB`; `folding  CHAIR ` at the same instant → the same; `Memorial bench`
  10:52:01Z → `SH-00PP-9AHN-M3JT`; `The Moon` 10:52:00Z → `SH-00PP-9AG8-3CK2`.
- [ ] **R19** Over 3,000 random identifiers, 0 single substitutions and 0 adjacent swaps go
  undetected. The decoder accepts lower case, reads `i` and `l` as `1` and `o` as `0`, ignores
  hyphens.

#### Link, Verify, portfolio (Priority 1)

- [ ] **R20** The certificate link is `/c/#<identifier>.<name as typed, UTF-8, base64url>.<IANA
  zone>` (D2). Redrawing from it yields the same SVG. It never reaches a server or its logs (Q13).
  **Copy certificate link** writes exactly the link and shows a visible confirmation; where the
  clipboard is refused, the link is shown selected in a field instead.
- [ ] **R21** Reopening is verifying (Q19): `/c/#…` redraws the certificate and states "Issued by
  STILL HERE for '<name>' on <date> at <time> (<zone>)." in the link's zone, from any viewer's
  zone, and offers Download PDF, Download PNG, Copy certificate link and Check another. Bare `/c/`
  shows the Verify form; opening a link adds nothing to the viewer's portfolio.
- [ ] **R22** `/verify` takes an identifier and a name and, on a match, states the issue in UTC
  (diff item 8). A mismatch, a typo, or a malformed identifier or link gets "We could not locate
  this certificate. The object, however, is still here." (Q7, D3). An identifier dated more than
  five minutes in the viewer's future gets "This certificate has not been issued yet. The object,
  however, is still here." (D3), judged only after the name matches. `SH-` is optional. A failure
  draws no certificate and links to Verify and home. Every single substitution and adjacent swap
  of each published vector is rejected with the Q7 sentence (sh-018).
- [ ] **R23** **Your Presence Portfolio** at `/portfolio` lists, newest first, every certificate
  issued on this device, from `localStorage` only, storing name, time, zone and identifier (not
  files); each entry has Open, Download PDF and Download PNG; the re-downloaded identifier matches. An empty or
  cleared portfolio says so in a sentence. A corrupt stored value never breaks any page.
  `navigator.storage.persist()` is not called (Q6, research 5, sh-022).

#### The company website (Priority 2)

- [ ] **R24** Pages, by path (D8 plus diff item 3): `/` · `/leadership` · `/research/` (with
  `/research/competitive-landscape`, `/research/directionality-of-here`,
  `/research/six-feet-to-the-left`) · `/case-studies/` (with `/case-studies/municipal-infrastructure`,
  `/case-studies/public-seating`, `/case-studies/civic-rest-sector`) · `/status` · `/careers` ·
  `/enterprise` · `/verify` · `/portfolio` · `/c/` · `/legal/terms` · `/legal/privacy`, and the 404.
  The paper and case-study slugs are drafts the C3 table read may rename; the count may not change.
- [ ] **R25** Every page carries the header (logo home, menu) and the footer with "A Vandalway
  Industries company" linking to `https://vandalwayind.com/` (Q12, D17). No URL in either site or the
  records has the host `vandalway.com`; a mention of the name as someone else's (sh-045) is not a
  link (research 1).
  A link checker finds zero broken internal links.
- [ ] **R26** **Leadership** shows exactly twelve people, by id and portrait (D1): `clive` p01,
  `diane` p02, `martin` p03, `jules` p04, `petra` p05, `susan` p06, `lucas` p07, `graham` p08,
  `len` p09, `adrian` p10, `bev` p11, `malcolm` p13 — each with name, title, alt text and a short
  bio. Jules's bio contains "Previously created WHERE-r-YOU" with no ownership wording (Q17).
- [ ] **R27** **Research**: three papers by Dr. Petra Voss (D16): *Competitive Landscape: Here,
  There, and Emerging Elsewhere* (abstract verbatim from RESEARCH-001, contents of 86 pages, "Full
  text available to Enterprise clients."), and two short papers of 2–4 pages in full. Each has
  title, author, date, abstract and a cover drawn in code.
- [ ] **R28** **Case studies**: three pages for the one customer and the one register, built on
  `bench-01` and consistent with SUPPORT-001/002 and sh-025, the three verticals of sh-026 as their
  subjects, photographs `b1`, `b2`, `b3-wide`, `p12-eileen`; the customer is named, Eileen Webb (I-09).
- [ ] **R29** **Status**: "All systems operational" always, then the incident history with the
  three Q11 titles verbatim — "Unexpected concentration of elsewhere on floor three"; "Scheduled
  relocation of the flagship research asset (Fridays)"; "Investigating reports of a bench" — each
  with its date and record id, rendered from `company/status/status-updates.xml`. Nothing is
  measured live (Q11).
- [ ] **R30** **Careers**: three postings (D15) — Senior Presence Engineer; Customer Support
  Contractor (six weeks); Director of Elsewhere (on hold) — and no form, input or application
  address that collects anything.
- [ ] **R31** **Enterprise**: bulk certification for municipalities and the civic rest sector,
  testimonials (diff item 8), photographs `s08`, `b3-wide-courthouse`, `p12-eileen-courthouse`, and
  the call to action verbatim: "Enterprise clients: please remain where you are. A representative
  will be in touch." Zero `form`, `input`, `textarea` or `select` elements (Q8).
- [ ] **R32** **Terms of Presence** state, each as a findable sentence: the footer sentence (Q4);
  the identifier is a checksum made in the browser that catches typos and casual edits and can be
  forged by anyone who reads the code (Q7); a certificate link contains the object's name (research
  5); every object receives the same certificate (Q1).
- [ ] **R33** **Privacy** states, each as a findable sentence tied to the test that proves it (a
  sentence about another company's behaviour is proved by linking that company's own documentation
  on the page): no
  analytics script anywhere; our host, GitHub Pages, logs visitors' IP addresses for its own
  security and we cannot read those logs; the portfolio stays on the visitor's device and we never
  receive it; Safari may clear it if STILL HERE is not used within seven days of browsing;
  clearing site data clears it; the name and time in a certificate link sit after the `#` and
  never reach a server or its logs; the time zone is read in the browser and never sent; the
  server for vandalwayind.com keeps an access log for its counter for seven days and keeps only a
  running total after that; mail to either domain is refused and nothing is received (research 5;
  Exploration 8; D22; I-03; sh-021).

#### Extras (Q19)

- [ ] **R34** `/api/v1/presence.json` returns `{"status":"STILL HERE"}` with and without any query
  string, byte-identical, `application/json`, and `access-control-allow-origin: *` on staging and
  production (D9, sh-034).
- [ ] **R35** `/.well-known/security.txt` (RFC 9116) with `Contact:` the repository's GitHub private
  vulnerability reporting URL (D10) and `Expires:` no more than 365 days after the build date;
  served as `text/plain`; the upload step sets `include-hidden-files: true`; CI fails when
  `Expires` is fewer than 30 days away (sh-011). Private vulnerability reporting is enabled on the
  repository at launch, before the first Pages deploy. `PROJECT.md` names the renewal date and its
  owner, Martin (sh-011); a scheduled reminder workflow opens an issue 30 days before `Expires`
  and does nothing else (diff item 8).
- [ ] **R36** A missing path returns status 404 and "We could not locate this page. The page,
  however, is still here." with a way home, on staging and production (Q19, sh-041).
- [ ] **R37** Installable and offline (Q19, Exploration 17): a web app manifest, icons at 180, 192
  and 512 (maskable) plus a favicon, and a service worker; after one visit, with the network off,
  everything in Goals 1–3 works: the ritual, both downloads, copying and reopening a link, Verify by
  hand, and the portfolio with its re-downloads; every page opens. After deploying build N+1, a client that
  loaded build N shows N+1's build id by its second navigation.

#### The records in the repository (Priority 3)

- [ ] **R38** The sample week, staff list, inventory and gum-graph seeds are filed into `company/`
  from the brand dossier, minus anything marked confidential (D11), dated Monday 2026-09-28 to
  Friday 2026-10-02 (D12), in D13's formats: correspondence and chat in Markdown; tracker in JSONL
  for `bd import` plus Markdown (already written: 55 issues, Q21); inventory in YAML plus Bev's
  legacy XML; status records in XML; the gum graph as an Open Knowledge Format bundle that passes
  its validator (D14).
- [ ] **R39** Written in full in Phase 5, by name (the list is `garage/pack/CONTENT_SEEDS.md`
  § Records): MAIL-001–006, EXP-001, SUPPORT-001–002, CHAT-001, FAC-001, INC-001, STATUS-001–003,
  CAL-001, RESEARCH-001 and the two short papers, NOTE-001, QA-001, CERT-001, the floor counts for
  the sample week, the inventory's five entities, the gum graph's people and edges.
- [ ] **R40** Every record id cited anywhere resolves to a file; every `SH-` identifier in the records
  recomputes from its record's name and time with the code `site/` ships (CI), and again on the
  live Verify page after launch; at least CERT-001 and SUPPORT-001 quote one; no record dated before
  2026-01-01 quotes one (Q18).
- [ ] **R41** Continuity holds and is tested: every stated share is the right one (Diane 51%,
  Vandalway 49%);
  no record written by staff states where Lucas now works; Adrian has no messages after
  2022-12-16 other than automated ones; the in-repository tracker never mixes with the build's own
  issues; the site never reads the inventory; no record shows anyone asking Eileen Webb about the
  case studies (I-09).
- [ ] **R57** The repository explains itself to a reader, in the company's voice: `README.md` (what
  STILL HERE is, how to run and test it, a map of the repository) and `company/README.md` (every
  record set with its format and schema); `AGENTS.md` carries the company's working rules itself
  (W9).

#### vandalwayind.com (Priority 4)

- [ ] **R42** One long page in HTML 3.2 (period doctype, quirks mode in Chromium and WebKit, upper-case
  tags), built in-house in 1997 (Q14): tiled background GIF over `BGCOLOR`; centred logo GIF with
  `WIDTH`/`HEIGHT`; a "Welcome to…" paragraph; `<HR>` between sections; a bracketed text menu;
  telephone hours with a time zone and a number in 555-0100–555-0199 (D20); a `mailto:`; an
  under-construction sign; "best viewed in Netscape" as a small GIF badge drawn in code (D18); an
  animated email icon; a guestbook link to `/cgi-bin/guestbook.html`, a "Guestbook temporarily
  unavailable" page dated 1999 (D19); the counter; a 1997 "Last Updated" line; an in-house credit; a copyright range; the
  relocation line (Q20); `s09` as an uncaptioned JPEG 200–410 px wide (Q12). Zero `<script>`,
  `BLINK`, `MARQUEE`, frames or MIDI (research 6: avoid stacking). MONOvision appears nowhere.
- [ ] **R43** Served over HTTPS from our production server by Caddy (D17); `http://` answers 301 to
  `https://`; `Last-Modified` is 1997-08-22 (the "Last Updated" line) for the page and its images,
  1999-03-02 for the guestbook page, and the write time for the counter image (Q12, Q20); nothing
  accepts a POST.
- [ ] **R44** The counter counts page loads in that server's own access log (GET `/` or `/index.html`
  answered 200 or 304; HEAD and the counter image excluded; the page sent with `Cache-Control:
  no-cache`), refreshed every ten minutes as period digits; the log is kept seven days; the page
  states the date counting began, which is the go-live date (D22, diff item 5).
- [ ] **R45** Adding the site to the shared server never interrupts the other sites: the Caddyfile is
  backed up and `caddy validate` passes before every reload, and no other site block changes (I-02).
  Beyond Caddy, only what I-11 authorizes: a new internal-network serve port (never an existing
  route or another site), a timer for the counter, files under `/srv`, and Node if absent; every
  change is a script in `deploy/` with a matching undo script.

#### Platform, privacy and launch (Priority 5 and the platform)

- [ ] **R46** `site/` is the only published folder; it holds only static files; Pages publishes it with
  GitHub Actions (`actions/configure-pages` v6.0.0, `actions/upload-pages-artifact` v5.0.0,
  `actions/deploy-pages` v5.0.1), and the artifact's file list equals the `site/` tree. Any records
  path and `/README.md` answer 404 on staging and production (Q9, research 3 §1, sh-042).
- [ ] **R47** No request leaves for any origin other than our own, on any page; no `<script src>` to an
  external host; no `form` with an `action` (settled; Q8).
- [ ] **R48** Staging is the same `site/` on the internal network over HTTPS (`isSecureContext`
  true); its hostname is never committed; its `/build.txt` equals the commit just deployed;
  research 3's URL table answers the same on staging and production.
- [ ] **R49** Production: after a deploy, `https://isitstillhere.com/build.txt` equals the deployed
  commit within 15 minutes; `http://` answers 301 to `https://`; `www` and the apex redirect one way;
  the certificate covers both names; Pages reports `https_enforced: true` (research 3 §2).
- [ ] **R50** Both domains: null MX (`MX 0 .`), SPF `v=spf1 -all`, DMARC `p=reject` (I-03, diff
  "Added"); a zone snapshot is taken before any DNS write; no wildcard records (research 3 §2).
- [ ] **R51** The repository is `vandalway-industries/still-here` (I-01); every commit's author and
  committer use the GitHub no-reply address (I-02), checked over the whole history before the switch; the default branch is `main` everywhere it is named (the workflow
  trigger, the `github-pages` environment rule, the repository setting).
- [ ] **R52** Names from outside the company stay out: the PII gate at the public tier
  (`PII_PUBLIC=1`) on every commit and over the whole history before the public switch; web images
  carry no embedded metadata (D21); originals in `assets/` keep theirs (D21).
- [ ] **R53** Accessibility: WCAG 2.2 AA on every isitstillhere.com page — axe reports 0 serious or
  critical; every control is reachable and visibly focused by keyboard (3:1 focus indicator,
  sh-028); verification green is never small text (sh-047). The 1997 page is exempt by design.
- [ ] **R54** Weight: every image derivative at 1x and 2x is at most 250 KB; first load of any page
  transfers at most 1.5 MB, measured to the `load` event, service-worker precache excluded.

### Should have

- [ ] **R55** The Pages workflow's job is skipped, not failed, while the repository is private, so the
  history shows no red deploys before launch.
- [ ] **R56** `deploy/` holds every server-side file (Caddy snippets, counter script and timer, each
  install script and its undo) so the server can be rebuilt from the repository. The only hostnames
  in it are the two public domains; no address, staging hostname or internal-network name.

### Could have

- Nothing. Every item the interview took is a Must; everything it declined is under Non-goals.

## Acceptance criteria

Release level. Per-bead criteria are in `garage/pack/ACCEPTANCE.md`; every `CODE PASS` names its
test file. HUMAN-JUDGED items are named with the checkpoint that judges them.

- **The launch walk** (`garage/pack/WALKS.md` W-DoD = W1 → W9 on production) completes in a browser,
  run by the critic, with every step doable as written. Clive's phone checklist (C4) passes on
  staging before the switch.
- **Deterministic, from the audit's HAS-BAR table, all green on staging and production:** the four
  identifier vectors and the exhaustive error test (R18–R19); canonicalization; the three lines
  verbatim and in order (R4); no tells (R7); the ten examples (R2); the footer string in the SVG
  and in the PDF's extracted text (R8); the mismatch sentence (R22); the 404 (R36); the status
  constant and three titles with zero non-same-origin requests (R29); the Enterprise sentence and
  zero form elements (R31); static only and no external requests (R46–R47); the fragment never in
  any request URL or the staging log (R20); the artifact equals `site/` and records answer 404
  (R46); research 3's URL table (R48); no link to `vandalway.com` (R25); the footer link on every page
  (R25); no MONOvision (R42); Jules's line (R26); no pre-2026 identifiers (R40); PDF `/FontFile2`,
  PNG ink-pixel difference from a fallback render, canvas cap and release (R14); the 1997 markup
  checks (R42); no `schedule:` trigger other than the security.txt reminder, and no private key or
  signing code (Non-goals).
- **Deterministic, from the audit's NEEDS-BAR bars, now defined:** timing and stillness (R4–R5); input
  rules (R3); QR decode at maximum length (R13); render-back ≤ 1% (R15); link vectors with spaces,
  emoji and a name containing `&` and `#` (R20); Verify's four vectors — valid, typo, future,
  malformed — each with its exact sentence (R22); time zones `Europe/Brussels`, `America/Chicago`,
  `Pacific/Chatham` each printed (R6); portfolio order, corruption and empty state (R23); installable,
  offline W1, and build N+1 served by the second navigation (R37); `presence.json` (R34);
  `security.txt` (R35); counter shows at least n+3 within eleven minutes of three loads (R44);
  `Last-Modified` 1997 (R43); staging and production build ids (R48–R49); records formats, schema
  and validator (R38); identifiers in records verify (R40); continuity assertions (R41); axe and
  keyboard (R53); weight (R54); the PII gate and PNG metadata (R52).
- **HUMAN-JUDGED, and where:** "trustworthy and expensive", typefaces and palette in use, the
  certificate's top language, seal and signatures, whether 4–5 s feels ceremonial — **C2**, on the golden candidates of the certificate, home,
  leadership and the 1997 page. Leadership titles and bios, research text, case studies and
  testimonials, careers, status wording beyond the three titles, Terms and Privacy prose, the 1997
  prose and the relocation line, every record's voice and continuity, the examples' wording,
  portrait crops, photograph placement — **C3**, the table read. Whether it is ready to go public —
  **C4**, with the phone checklist.

## Inputs ready

- **Exemplars and goldens:** `garage/pack/exemplars/README.md` explains the flow. On disk now: the
  brand references `garage/assets/still-here-hero-chair.png` and
  `garage/assets/still-here-logo-horizontal.png` (canon for palette, mark and register). **Goldens do
  not exist yet**: Phase 1 produces candidates of the certificate, home (390 and 1440), leadership
  (1440) and the 1997 page into `garage/pack/exemplars/candidates/`; Clive approves them at C2 and
  they are saved as `garage/pack/exemplars/*-golden.png`. The 1997 references (research 6's
  archived pages, raw HTML) are fetched into `garage/pack/exemplars/1997/` in Phase 1.
- **Asset manifest:** `garage/pack/ASSET_MANIFEST.md` — every file in `garage/assets/` and the parent
  logo, where it is used, canon or placeholder, derivative sizes, the D21 provenance rule.
- **Content seeds:** `garage/pack/CONTENT_SEEDS.md` — the source of every authored text, the drafts
  for C2 and C3, and the enumerated record set.
- **Environment pre-flight:** `garage/pack/ENV_PREFLIGHT.md` (checked 2026-10-03).
- **Critic rubric:** `garage/pack/CRITIC_RUBRIC.md`. **Checkpoints:** `garage/pack/CHECKPOINTS.md`.
- **Acceptance per bead:** `garage/pack/ACCEPTANCE.md`. **Walks:** `garage/pack/WALKS.md`.
- **Design authority:** `DESIGN.md` (tokens measured from the hero and the logo; D7 typography).
- **What we take from the references:**
  - `garage/research/1-domain.md`: vandalway.com belongs to someone else, so nothing links there
    (R25); small 1990s businesses lived at paths on other people's servers, which the relocation
    line rests on (R42).
  - `garage/research/2-certificate-export.md`: jsPDF 4.2.1 + svg2pdf.js 2.8.1 for the PDF, the
    native canvas route for the PNG (R14); TrueType only, registered before conversion (R14);
    "carefully curated SVG" becomes the element allow-list (R9); the safe font pattern and canvas
    release (R14); the pdf.js render-back check (R15); iOS stays a device test (C4).
  - `garage/research/3-pages-hosting.md`: Actions from `site/` only, so records never become pages
    (R46); the pinned action versions (R46); `include-hidden-files` for `.well-known` (R35); the
    observed URL table, reproduced on staging and smoke-tested on both (R48); verify the domain
    before adding it, no wildcard records, HTTPS after DNS (R49–R50, Phase 8 order); staging over
    HTTPS because `crypto.subtle` needs it, and its name kept out of the repository (R48); custom
    headers are impossible on Pages, so CSP is a meta tag (Added).
  - `garage/research/4-certificate-id.md`: Crockford Base32, mod-37 check, Branch B, the four
    vectors, the exhaustive error test (R17–R19); the check symbol stays mod 37, odd final
    characters included (I-12).
  - `garage/research/5-browser-storage.md`: Safari's seven-day rule and its exact privacy sentence
    (R33); no `persist()` (R23); fragments never reach the server (R20); never add an outbound
    redirect hop (R47); store what redraws, not files (R23).
  - `garage/research/6-1990s-web.md`: the element list and its proportions (R42); counters worded
    with a start date (R44); the badge and the sign fit only because Clive built it himself (Q14,
    R42); avoid stacking (R42); quirks mode verified in Chromium and WebKit (R42); images in the
    200–410-pixel range (R42).
- **Played walks per GUI milestone** (`garage/pack/WALKS.md`; steps outside the browser have named
  substitutes there): Phase 2 — W4 steps 1–2 on the shell, W1 the ritual, W2 reopen and verify, W3
  portfolio, W8 reduced motion; Phase 3 — W4 the company (with one sub-walk per
  page), W5 Enterprise; Phase 4 — W6 offline, W4.404; Phase 5 — W9 the repository (local);
  Phase 6 — W7 1997 (internal copy); Phase 7 — W1–W9 on staging and the phone checklist; Phase 8 —
  W-DoD on production and the production phone re-check.

## Dependencies

- **None on another project.** No code, data or decision from another repository is needed.
- **Operational:** the production server that will serve vandalwayind.com already serves other
  public sites (audit). R45 governs every change to it. Its address and the staging hostname live
  in local, uncommitted configuration only.
- **External services, named as technical facts (I-08):** GitHub (repository, Actions, Pages,
  private vulnerability reporting), the registrar's DNS API, Let's Encrypt (through Pages and
  Caddy).

## Open questions

- **Mail provider for Q22's auto-reply** — out of this milestone (I-03). Decided when a provider is
  chosen; until then R50 stands.

## Changelog

- 2026-10-03 — Authored at the PLAN gate from `garage/HANDOFF.md`, BRAINSTORM Q1–Q24, D1–D22 and I-01–I-08, and the tracker's settled acceptance lines. Diff at the top. (Diane, 2026-10-03)
- 2026-10-03 — Blind read applied (`garage/pack/BLIND_READ.md`, 51 findings): new calls in diff item 8, changed items 5, 11, 12; I-09–I-12 applied; R57 added; the reverse-DNS question closed by I-10. (Diane, 2026-10-03)
- 2026-10-03 — Wording only: the 1997 page is described as "built in-house" throughout the pack. (Diane, 2026-10-03)
- 2026-10-03 — C1 signed by Clive (I-13): pack approved; ceiling 1,400; phone checklist as written. (Diane, 2026-10-03)
