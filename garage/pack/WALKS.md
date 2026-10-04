---
updated: 2026-10-03
read_by: T0, the test-author session (each walk becomes `e2e/specs/<id>-walk.spec.ts` for the bead named beside it, written with role and visible-text locators only); the critic, who plays each walk by hand in a real browser before a GUI verdict (critic rule 7); Clive at C4 (the phone checklist) and at launch (W-DoD)
relations:
  derived_from: ../HANDOFF.md
---

# Played-as-a-person walks

From the audit's W1–W8 (`garage/HANDOFF.md` § Walks), refined by the stage-10 decisions and the
blind read (`BLIND_READ.md`). Written from the visitor's seat. A walk is a bar: if a step cannot be
done as written, the unit fails "unplayed" at that step, whatever the specs say. Start each walk
from a fresh browser context unless it says otherwise. Sizes: 390×844 (phone) and 1440×900
(desktop), both, unless stated. Engines: Chromium and WebKit; Firefox where the bead's acceptance
says so. Exact strings are in `CONTENT_SEEDS.md` § Fixed strings. (Jules, 2026-10-03)

How a walk spec is written: it finds things the way a person does (`getByRole`, `getByText`,
`getByLabel`), types with the keyboard, clicks what is visible, and asserts what is on screen.
No test ids, no `element.focus()`, no clicks through `page.evaluate`. Where a step says "I see",
the spec asserts visibility; where it says "I hear", it asserts the live region's text.

## Substitute evidence

A few steps ask for something outside the page: an operating-system dialog, a mail program, a
file viewer. A browser under automation cannot do those. Each such step is played by exactly the
substitute below, through the named helper in `e2e/helpers/`, and the critic reports it as
"played (substitute)". A step marked † has no automated substitute and is played by Clive on the
phone checklist instead; until he has, it is reported "awaiting phone", never "played".

| Step | What a person does | What the critic does instead | Helper |
|---|---|---|---|
| W1.6, W1.7, W6.4 | opens the downloaded PDF or PNG and looks at it | saves the download; renders page 1 of the PDF with pdf.js in Chromium at 150 dpi and screenshots it; opens the PNG in a tab and screenshots it; checks `/FontFile2` and the footer string in the PDF; looks at both screenshots | `openDownload()` |
| W3.4 | clears the site's data in the browser's settings | Chromium: DevTools Protocol `Storage.clearDataForOrigin` with every storage type; WebKit: a new context (empty storage) at the same origin | `clearSiteData()` |
| W6.1–2 | installs the site and opens it from the home screen | Chromium: `Page.getInstallabilityErrors` returns none, the service worker controls the page, and the manifest's `start_url` opens offline in the same context; the real install and Home Screen launch are phone checklist item 8 † | `checkInstallable()` |
| W7.3 | sends mail and sees it bounce | asserts the link is `mailto:webmaster@vandalwayind.com`; resolves vandalwayind.com's MX at a public resolver and asserts it is exactly `0 .` (RFC 7505: delivery fails at the sender at once); a real send is phone checklist item 9 † | `checkNullMx()` |
| W2.7 | scans a printed QR code with a phone camera | decodes the QR code with jsQR from the exported PNG and from the pdf.js render of the PDF, then opens the decoded URL; the camera scan is phone checklist item 6 † | `decodeQr()` |
| W7.2 | waits and reloads | waits with `page.waitForTimeout` in the spec (allowed only here), reloading with cache revalidation as a browser does | — |

## W1 — the ritual (E0, E2, E4; on staging in L5; on production in N3)

1. I open the home page. I see "Is it still here?", one text box, **Check presence** and ten
   examples underneath, starting with Car keys and ending with A lighthouse. On the phone the box
   is on screen without scrolling.
2. I press **Check presence** with the box empty. Nothing is issued; a sentence under the box tells
   me to name an object. I press Enter in the empty box: the same.
3. I tap "Folding chair". The box now reads "Folding chair" and the cursor is in it; I can still
   edit it. I type " " and delete it again.
4. I press Enter. The check starts: the button and the box stop answering, and so do the examples.
   A green mark stays perfectly still. "Establishing here." appears, then "Comparing here with
   here.", then "No actionable elsewhere detected.", each there long enough to read. I can tell the
   check is running.
5. Four to five seconds after I pressed, the form is replaced by **STILL HERE.**, "Folding chair"
   exactly as I typed it, a date and time such as "3 October 2026, 05:52:00", "Jurisdiction of
   here:" with my time zone, an identifier starting "SH-", and "Kept in Your Presence Portfolio on
   this device." I can tell the check has finished. I see Download PDF, Download PNG, Copy
   certificate link and Check another. The address still reads the home page.
6. I tap Download PDF. The button says it is preparing, then a file named like
   `STILL-HERE-folding-chair-….pdf` arrives. I open it: it is a landscape certificate in the
   certificate's own serif type, with the seal, two signatures, a QR code, and at the bottom
   "Confirms successful completion of this form. No physical inspection occurred." (substitute:
   `openDownload()`)
7. I tap Download PNG. A `.png` with the same name stem arrives and shows the same certificate.
   (substitute: `openDownload()`)
8. I tap Check another. The form is back, the box is empty and the cursor is in it.
9. I type `<script>alert(1)</script> & "x"` and check it. No dialog appears; the certificate shows
   exactly those characters.
10. Nothing on any screen of this walk was a dead end: from the result I can open the menu and go
    to any page, and the mark takes me home to an empty form.

## W2 — reopen and verify (E5, E6)

1. I check "Folding chair" and tap Copy certificate link. I see that the link was copied.
2. I open a new private window in a different time zone and paste the link. The same certificate
   draws, with the original time and "Jurisdiction of here:" naming the original zone, and above it
   "Issued by STILL HERE for 'Folding chair' on …". Under it I can download it, copy its link or
   check another object.
3. I change one character of the identifier in the address bar and press Enter. I see "We could not
   locate this certificate. The object, however, is still here." and no certificate, with links to
   Verify and to check an object.
4. I open Verify from the menu. I type the identifier in lower case, with an `o` where it has a zero
   and without the "SH-", and type the name "folding chair". I press Enter. It confirms, stating the
   date and time in UTC.
5. I type `SH-01MR-P6G7-6TA1` and the name "A time capsule (contents unknown)". I see "This
   certificate has not been issued yet. The object, however, is still here."
6. I type nonsense ("hello") as the identifier. I see the not-located sentence. I empty both boxes
   and press Verify: a sentence tells me to enter both.
7. I scan the QR code on the printed PNG with a phone camera; the same confirmation opens.
   (substitute: `decodeQr()`; † phone checklist item 6)

## W3 — portfolio (E7)

1. I check three objects: "Car keys", "The Moon", "My car keys".
2. I close the tab, open the site again and choose Portfolio from the menu. "Your Presence
   Portfolio" lists all three, newest first, each with its date and identifier.
3. I tap Download PDF beside "The Moon"; the identifier in the file matches the one in the list. I
   tap Open beside it: its certificate draws.
4. I clear the site's data and reload Portfolio. It tells me in a sentence that it is empty; it does
   not vanish or break. (substitute: `clearSiteData()`)
5. I open the certificate link I copied in W2: it still draws, with nothing stored, and the
   portfolio stays empty.

## W4 — the company (E0, S2–S9, X3)

1. From home I open the menu. I see Verify, Portfolio, Leadership, Research, Case studies, Status,
   Careers and Enterprise. Each one opens its page, and the mark at the top left brings me home from
   each. The footer on every page shows Terms of Presence, Privacy and "A Vandalway Industries
   company".
2. I tap "A Vandalway Industries company". I leave for vandalwayind.com (locally and on staging,
   the spec checks the link's target instead of leaving).

Sub-walks, one per page bead:

- **W4.leadership (S2).** I open Leadership and see twelve people, each with a photograph, a name,
  a title and a few sentences. Jules's says he previously created WHERE-r-YOU. I can get home.
- **W4.research (S3).** I open Research and see three papers by Dr. Petra Voss, each with a cover. I
  open the long one: its abstract and an 86-page contents list, and a line saying the full text is
  available to Enterprise clients. I open each short paper and can read it to the end. I can get
  back to Research and home.
- **W4.case-studies (S4).** I open Case studies and see three. I open each one: Eileen Webb, the same
  register, the same bench that is no longer there, photographs of the place. I can get back.
- **W4.status (S5).** I open Status and see "All systems operational" at the top, then three
  incidents, each with a date and a record number, including "Unexpected concentration of elsewhere
  on floor three".
- **W4.careers (S6).** I open Careers and see three postings. There is nowhere to type and nothing to
  send.
- **W4.legal (S8, S9).** I open Terms of Presence and Privacy from the footer and can read each to the
  end. Privacy tells me what my browser keeps, what our host logs (with a link to the host's own
  page saying so), and that mail is refused.
- **W4.404 (X3).** I type a wrong address. I see "We could not locate this page. The page, however,
  is still here." and "Return home", which works.

## W5 — Enterprise (S7)

1. I open Enterprise and read it: bulk certification, the civic rest sector, photographs of benches,
   testimonials from Eileen Webb, municipal archivist.
2. I look for a form. There is none: no box, no button that sends anything.
3. I reach "Enterprise clients: please remain where you are. A representative will be in touch."
   I have nowhere to type anything. I can get home.

## W6 — offline (X4)

1. (Chromium) I open the site once. The browser can install it. (substitute: `checkInstallable()`;
   † phone checklist item 8)
2. I turn the network off and open the site's start address. It opens.
3. I check "Wallet" and see the whole sequence and the certificate.
4. I download the PDF and the PNG; both open with the certificate's type. (substitute:
   `openDownload()`)
5. I copy its link, open the link: it redraws and confirms. I verify it by hand on Verify: it
   confirms.
6. I open Portfolio and see "Wallet"; I download it again from the list.
7. I open Leadership, which I never visited: the page opens; photographs I never saw show their
   descriptions. I type a wrong address: the 404 page.
8. (WebKit, no install) With the network off after one visit, steps 3–6 still work in the tab.

## W7 — 1997 (V1–V4 on the internal copy; N2 on production)

1. I open vandalwayind.com. A period page loads in one long column on a tiled background: the
   Vandalway logo, a welcome, rules between sections, a bracketed menu, telephone hours, an e-mail
   link, an under-construction sign, a small "best viewed in Netscape" badge, an animated e-mail
   icon, a photograph of a Sunday market with no caption, a hit counter with a date, a "Last
   Updated" line from 1997, a credit, a copyright line, and one line about the page having moved.
2. The counter shows a number, n. I reload twice. Within eleven minutes of my last reload, one more
   reload shows at least n+3.
3. I click the e-mail link and my mail program opens, addressed to webmaster@vandalwayind.com. If I
   send the message, my mail program reports at once that it could not be delivered (null MX;
   I-03). (substitute: `checkNullMx()`; † phone checklist item 9)
4. I click the guestbook link. I get a page from 1999 saying the guestbook is temporarily unavailable.
5. Nothing on the page explains itself except the relocation line. Nothing blinks or scrolls.

## W8 — reduced motion (E2)

1. With reduced motion turned on in the system, I run W1 steps 3–5.
2. I see the same three lines, in the same order, at the same pace, and nothing moves, fades or
   slides at any point. The result is the same.

## W9 — the repository (RC8; on github.com in N3)

1. I open the repository. Its README tells me, in the company's words, what STILL HERE is, how to
   run it and test it, and where everything is.
2. I follow the README to `company/`. Its README lists each record set with its format and schema.
3. I open the tracker, a correspondence file, the inventory and the gum graph from those links; each
   opens and reads as the company's own record.
4. I copy the identifier from CERT-001 and the name it certifies, paste them into the live Verify
   page, and it confirms (N3 only).
5. Every link I followed worked.

## W-DoD — the launch walk (N3)

On production, in Chromium and WebKit, at both sizes: W1, W2, W3, W4 with every sub-walk, W5, W6,
W7, W8, W9, in that order, in one session per engine except where a walk asks for a fresh context.
Every step marked "played" or "played (substitute)" by the critic; the † steps are covered by
Clive's production re-check. This walk is v1's definition of done.

## Phone checklist (Clive, his iPhone)

**At C4, on staging.** The phone must be connected to the internal network, as the workstation is;
the staging address is written in by hand on the printed packet. About five minutes. One line each;
tick or write what happened.

1. Open the staging address in Safari. Check "Folding chair". The three lines, then STILL HERE.
2. Tap Download PDF. It opens in the certificate's serif type, not a substitute (sh-003).
3. Tap Download PNG. From the image, use the share sheet to Save Image; it appears in Photos (sh-039).
4. Tap Copy certificate link. Paste it into Notes, tap it: the same certificate opens (Q13).
5. Close Safari completely. Reopen the staging address, open Portfolio: "Folding chair" is there (Q6).
6. Show the PNG on another screen or print it; scan its QR code with the camera: the confirmation opens (Q19).
7. Turn on VoiceOver; on the home page, check an object; VoiceOver reads the three lines and STILL
   HERE. Turn VoiceOver off (sh-027).
8. Add to Home Screen; turn on Airplane Mode; open it from the Home Screen; check "Wallet" and
   download the PDF (Exploration 17).
9. Send a one-line email to webmaster@vandalwayind.com; Mail reports it undeliverable within a minute.

**After launch, on production (N3), about two minutes, on any network:** items 1, 2, 4 and 6 again at
isitstillhere.com, plus item 9. The result is recorded in `CHECKPOINTS.md`.

## Changelog

- 2026-10-03 — Written at stage 11 from the audit's W1–W8, with W4 split per page, W7's mail step changed by I-03, W-DoD and the phone checklist added. (Jules, 2026-10-03)
- 2026-10-03 — Blind read applied: substitute evidence for steps outside the browser; W1 states the sequence, the result and the portfolio line; W2 states `/c/`'s actions and failures and Verify's empty state; W6 covers everything offline; W7's counter bar is eleven minutes; W9 (the repository) added; the phone checklist names its network and gains a production re-check. (Jules, 2026-10-03)
