---
updated: 2026-10-04
read_by: the staff; anyone reading the repository; the seed script that loads the tracker
relations: {}
---

# STILL HERE — Issue tracker

The company's issue tracker, kept since 2014: product defects, decisions, support requests,
facilities, finance, and staff matters, with every comment thread. `tracker.jsonl` beside this
file holds the same issues, one per line, for loading into the tracker; `schema.json` describes
each line.

Every issue carries the label `record`. These issues are the company's history. Nobody picks
them up as work. A `closed` issue is closed. A `deferred` issue waits on the new site
(sh-019) or on a question that has not been answered. Three issues are `open` on purpose:
sh-050, sh-051 and sh-054.

References such as "Q7" or "research 4" point to `garage/BRAINSTORM.md` and `garage/research/`.

## People

| ID | Name | Role |
| --- | --- | --- |
| clive | Clive Standish | Founder |
| diane | Diane | QA lead |
| martin | Martin Bell | Support contractor |
| jules | Jules Mercer | Developer |
| petra | Dr. Petra Voss | Director of Positional Research |
| susan | Susan Pritt | Accounting |
| lucas | Lucas the Intern | Intern |
| graham | Graham Pike | Facilities |
| len | Len | Head of Internal Communications |
| adrian | Adrian Vale | VP of Presence |
| bev | Bev | Office manager |
| malcolm | Malcolm Venn | Vandalway liaison |

Customers are not tracker users. Their messages appear as quoted by support.

## sh-001 · Relocation request: end of six-week contract

- **Type:** task · **Priority:** P2 · **Status:** closed
- **Labels:** `record` `staff` `relocation`
- **Opened by:** martin · **Assignee:** diane · **Opened:** 2014-05-16
- **Closed:** 2014-05-16 — Approved (Diane).

My six-week support contract concludes today. The handover notes for the support inbox are attached, along with the list of open customer questions (none) and the location of the spare key to the supply cupboard.

I would be grateful if my staff record and inbox could be closed at the end of the day, and if my final invoice could be paid to the address on file.

It has been a pleasure to support STILL HERE.

Martin Bell

**Comments**

**diane** · 2014-05-16

> Approved. Thank you, Martin.

**clive** · 2014-05-19

> Restored Martin's staff record and inbox from Friday's backup. Continuity of support is a core promise of this company.

**martin** · 2014-05-19

> Thank you. I appear to be here. I will continue to answer the inbox until this is clarified.

**diane** · 2014-05-19

> Clive, he is a person, not a mailbox.

**clive** · 2014-05-20

> A person whose presence we have successfully retained.

## sh-002 · Second-floor printer jams on every job

- **Type:** bug · **Priority:** P3 · **Status:** deferred
- **Labels:** `record` `facilities` `office`
- **Opened by:** bev · **Assignee:** bev · **Opened:** 2015-03-11

Second-floor printer. Jams on every job, including one-page jobs.

Do not call the vendor. It is not a vendor problem, and they charged us last time to say so. I know what is wrong with it.

Use the third-floor printer until further notice.

**Comments**

**clive** · 2015-03-12

> Could we describe it as a printer in a state of considered rest?

**bev** · 2015-03-12

> It is broken.

**diane** · 2017-08-02

> Still jamming. Bev, what is actually wrong with it?

**bev** · 2017-08-02

> Ask me in person. Not on a ticket.

**martin** · 2021-11-15

> Tried it today. It accepted the job and kept it.

**bev** · 2026-09-01

> Same reason as 2015. Still not a vendor problem.

## sh-003 · Certificate PDF opens in a substitute font in some PDF readers

- **Type:** bug · **Priority:** P2 · **Status:** deferred
- **Labels:** `record` `certificate` `pdf` `typography` `current-site`
- **Opened by:** diane · **Assignee:** jules · **Opened:** 2017-10-24

Steps: Check "Folding chair". Download the certificate PDF. Open it in three different PDF readers on machines that don't have the certificate typeface installed.

Expected: The certificate typeface, as on screen.

Actual: Two of the three show a substitute sans-serif. The heading reflows, and in one reader the seal overlaps the name.

As far as I can tell, the PDF names the typeface but doesn't embed it. A reader without it picks something else.

**Comments**

**clive** · 2017-10-25

> The typeface is part of the experience. Recipients should be encouraged to install it.

**diane** · 2017-10-25

> Recipients don't install fonts. They open the file.

**jules** · 2026-10-03

> Carried into the rebuild. Research 2 (certificate export) recommends drawing the certificate once as SVG and exporting the PDF with jsPDF 4.2.1 and svg2pdf.js 2.8.1. jsPDF accepts TrueType only, registered before conversion, and embeds it: the trial PDFs from Chromium 153 and from a Linux build of WebKit 26.6 both contained the embedded font (`/FontFile2`) under its registered name. Not yet tried on an iPhone (sh-039). The face itself has to be licensed for embedding (sh-024).

**diane** · 2026-10-03

> Acceptance: the PDF's document properties list the face as embedded, and it renders identically in three readers on machines without the font installed. Deferred until there is a PDF to test.

## sh-004 · Third-floor microwave: replace

- **Type:** chore · **Priority:** P1 · **Status:** closed
- **Labels:** `record` `facilities` `third-floor`
- **Opened by:** graham · **Assignee:** graham · **Opened:** 2018-02-13
- **Closed:** 2018-02-16 — Installed and tested (Graham); receipt and disposal slip reconciled (Susan).

Third-floor microwave has stopped heating. Light and turntable still work, which is why people keep trying it. Unplugged and tagged.

Requesting a replacement this week. Hot lunch is not a perk. Twelve people on this floor bring food that needs heating.

Quote attached: 1100 W, stainless, fits the existing shelf.

**Comments**

**susan** · 2018-02-14

> Approved against Facilities; cost center on the attached form. Please return the receipt and the old unit's disposal slip by 2018-02-28. Both, not either.

**clive** · 2018-02-14

> Could we position this as an investment in floor-three dwell time?

**graham** · 2018-02-16

> Installed. Tested with soup. Receipt and disposal slip are with Susan.

**susan** · 2018-02-16

> Both received, 2018-02-16. Thank you, Graham.

## sh-005 · Relocation request

- **Type:** task · **Priority:** P2 · **Status:** closed
- **Labels:** `record` `staff` `relocation`
- **Opened by:** martin · **Assignee:** diane · **Opened:** 2019-06-28
- **Closed:** 2019-06-28 — Approved (Diane).

This is my fourth relocation request. The first is sh-001. The second and third were sent by email on 2016-01-08 and 2017-09-29 and are attached for convenience.

I would like to relocate at the end of this month. I am flexible as to the destination. I have prepared a handover, again.

Kind regards,
Martin

**Comments**

**diane** · 2019-06-28

> Approved.

**bev** · 2019-06-28

> Fourth. I have all four letters in the spreadsheet.

**clive** · 2019-07-01

> Restored Martin's account and staff record from Sunday's backup. Our support function has never had an outage.

**martin** · 2019-07-01

> Thank you. I understand the backups run nightly. I have resumed answering the inbox.

## sh-006 · Messages from Internal Communications notify every member of staff

- **Type:** bug · **Priority:** P3 · **Status:** deferred
- **Labels:** `record` `internal-comms` `chat`
- **Opened by:** diane · **Assignee:** bev · **Opened:** 2021-03-09

Steps: Len posts in any channel.

Expected: People in that channel are notified.

Actual: Every member of staff is notified, including people who muted the channel and people on leave, because messages from the Head of Internal Communications are flagged as announcements.

Len posts one thought as several messages. Each one is an announcement. This morning: eleven.

**Comments**

**len** · 2021-03-09

> hi

**len** · 2021-03-09

> saw this

**len** · 2021-03-09

> is it

**len** · 2021-03-09

> about me

**len** · 2021-03-09

> *about my messages

**len** · 2021-03-09

> sorry

**clive** · 2021-03-10

> Len's role is communications. Notifications are communications working.

**diane** · 2021-03-10

> Then it's working eleven times a morning.

**bev** · 2021-03-10

> The announcement flag went on when Len got the title. Nobody asked for it. I can take it off if someone tells me to.

**clive** · 2021-03-11

> Leave it. Visibility matters.

**diane** · 2026-09-29

> Today, 11:42: fifteen messages, fifteen company-wide notifications, three minutes before the third floor was evacuated (sh-053).

**graham** · 2026-09-29

> Two people on three thought it was the fire alarm. It was not the fire alarm.

**len** · 2026-09-29

> sorry

**len** · 2026-09-29

> it was

**len** · 2026-09-29

> one question

**len** · 2026-09-29

> about the numbers

## sh-007 · Deactivate Adrian Vale's accounts

- **Type:** chore · **Priority:** P2 · **Status:** deferred
- **Labels:** `record` `staff` `accounts` `org-chart`
- **Opened by:** bev · **Assignee:** bev · **Opened:** 2023-01-04

Adrian Vale quit at the holiday party on 2022-12-16. He handed Clive the letter. I have a copy.

Please deactivate:
- email (currently auto-replying)
- chat
- calendar (currently auto-accepting invitations)
- payroll
- the org chart entry (VP of Presence)

He is not coming back. He said so.

**Comments**

**adrian** · 2023-01-04

> Automatic reply: I am out of the office until 3 January 2023 and will respond to your message on my return.

**clive** · 2023-01-09

> Adrian's position is under review. I'd rather not deactivate a vice president over the holidays.

**bev** · 2023-01-09

> The holidays are over. He handed you the letter.

**clive** · 2023-02-14

> Org chart updated: Adrian Vale, VP of Presence (camera optional).

**adrian** · 2024-11-05

> Calendar: Adrian Vale accepted "Quarterly presence review".

**malcolm** · 2025-06-10

> Please hold any change to the VP of Presence position until after the portfolio review. A vacancy at VP level is a reportable change.

**bev** · 2025-06-10

> It is a reportable change that happened in 2022.

**adrian** · 2026-09-28

> Automatic reply: I am out of the office until 3 January 2023 and will respond to your message on my return.

**bev** · 2026-10-01

> Adrian quit at the 2022 party. He handed you the letter beside the cheese. I put a copy in the spreadsheet. His status is not "camera optional."

## sh-008 · Access to the gum graph

- **Type:** task · **Priority:** P4 · **Status:** closed
- **Labels:** `record` `finance` `gum-graph` `access-request`
- **Opened by:** clive · **Assignee:** susan · **Opened:** 2024-03-18
- **Closed:** 2024-03-18 — Declined (Susan).

Requesting read access to Accounting's gum graph. As a founder, visibility into the organisation's consumption relationships is a matter of strategic hygiene.

This is my seventh request. The previous six were by email.

**Comments**

**susan** · 2024-03-18

> Clive,
>
> The gum graph records sugar-free gum bought on company accounts, who it was bought for, and who has borrowed from whom, so that each stick can be reconciled. "Strategic hygiene" is not an accounting purpose. Access is not granted.
>
> For convenience, I've reattached my replies to requests one through six.
>
> Susan

**clive** · 2024-09-02

> Request eight. Purpose: team cohesion metrics.

**susan** · 2024-09-02

> Not an accounting purpose. Declined, with the same attachments plus my reply to request seven.

**clive** · 2025-04-22

> Request nine. Purpose: board visibility.

**susan** · 2025-04-22

> No item before any board requires individual chewing relationships. Declined.

**clive** · 2025-12-08

> Request ten. I'm told there is a shared node.

**susan** · 2025-12-08

> Matching flavor is an observation. Your interpretation is not reimbursable. Declined.

**clive** · 2026-07-21

> Request eleven. As a shareholder of record, I have an interest in all of the company's relationships.

**susan** · 2026-07-21

> You sold your shares. The gum graph was not part of the sale. Declined; attachments for requests one through ten enclosed.

**susan** · 2026-10-01

> Request twelve arrived by email today (purpose: "potential enterprise mint synergies") and was answered there. Recording it here so the count is in one place: twelve requests, twelve declines.

## sh-009 · Certificate time has no time zone

- **Type:** bug · **Priority:** P2 · **Status:** deferred
- **Labels:** `record` `certificate` `time` `current-site`
- **Opened by:** diane · **Assignee:** jules · **Opened:** 2025-02-10

Steps: Check "Stapler" at 09:30 local time. Download the certificate.

Expected: 09:30, or any time with its zone printed beside it.

Actual: A different hour, and no zone. It's UTC. Nothing on the certificate says so.

A certificate whose only factual claim is a time should get the time right.

**Comments**

**clive** · 2025-02-11

> Presence is not bound to a time zone.

**diane** · 2025-02-11

> The certificate is.

**jules** · 2026-10-03

> Q20 takes the visitor's time zone onto the certificate. The browser reports its IANA zone without asking (`Intl.DateTimeFormat().resolvedOptions().timeZone`, e.g. "Europe/Brussels"), and nothing is sent anywhere. Three consequences:
>
> 1. The zone has to travel in the certificate link with the name and time, so a certificate reopened on a machine in another zone redraws with the zone it was issued in.
> 2. The identifier is unaffected. It encodes seconds since 2026-01-01T00:00:00Z, so the zone changes the face of the certificate, not its identity. Certificates now differ by visitor, not by object.
> 3. Near midnight the local date on the face and the UTC date inside the identifier differ. If Verify states the issue date from the identifier alone, it will disagree with the certificate for anyone a few hours from UTC. Verify should state the date in the zone carried by the link, when there is one.

**clive** · 2026-10-03

> I'd like the label to read "Jurisdiction of here."

**diane** · 2026-10-03

> The label is open. Acceptance: printed time and printed zone agree; reopening the link in another zone shows the original time and zone; a certificate issued at 23:30 local, in a zone behind UTC, shows the same date on its face and on Verify.

## sh-010 · "STILL HERE." heading: the period collides with the E

- **Type:** bug · **Priority:** P3 · **Status:** deferred
- **Labels:** `record` `certificate` `typography` `current-site`
- **Opened by:** diane · **Assignee:** jules · **Opened:** 2025-03-06

Steps: Download any certificate. Print at 100%.

Expected: "STILL HERE." with the period clear of the E.

Actual: The period touches the foot of the E at print size. On screen it's fine. On paper it reads as "STILL HERE" with a smudge.

Scan attached.

**Comments**

**clive** · 2025-03-07

> The period is the most important character on the certificate. It is the moment presence becomes final.

**diane** · 2025-03-07

> Then it should be legible.

**jules** · 2026-10-03

> For the rebuild: the certificate is drawn once as SVG and exported twice, the PDF through svg2pdf.js and the PNG through the browser's own SVG renderer (research 2). svg2pdf.js supports a limited part of SVG, and I haven't checked whether that path applies the font's kerning pairs the way the browser does. Until someone has, the heading's letter positions should be set explicitly in the SVG, so both exports put the period in the same place.

**diane** · 2026-10-03

> Acceptance: print the PDF and the PNG at 100% and overlay them; the period clears the E in both, by the same amount.

## sh-011 · No published way to report a security problem

- **Type:** task · **Priority:** P2 · **Status:** deferred
- **Labels:** `record` `security` `site` `support`
- **Opened by:** martin · **Assignee:** jules · **Opened:** 2025-04-15

A visitor wrote to the support address today asking where to report a security problem with the site. I thanked them and said I would find out. I have not been able to find out.

I would be grateful for an address, a page, or a person. I would prefer it were not me, but I recognise that my preferences have historically carried little weight.

**Comments**

**clive** · 2025-04-16

> We have no security problems. We have no moving parts.

**diane** · 2025-04-16

> Those are different statements.

**jules** · 2026-10-03

> Q19 takes `security.txt`. RFC 9116 puts it at `/.well-known/security.txt`; `Contact` and `Expires` must both be present, and the RFC recommends that `Expires` be less than a year ahead. `Contact` should point at the repository's public issue tracker once the repository is public at launch, not at the email address: the Q22 mailbox answers automatically and keeps nothing. One build detail from research 3: `upload-pages-artifact` leaves out dotfiles unless `include-hidden-files` is set, so `.well-known/` has to be included on purpose.

**clive** · 2026-10-03

> It feels odd for us, of all companies, to publish an expiry date.

**diane** · 2026-10-03

> It's required. Acceptance: served at that path on staging and production; `Expires` under a year out; a named person gets a reminder a month before it lapses, and renews it.

**martin** · 2026-10-03

> If the named person is me, I would be grateful for a reminder of the reminder.

## sh-012 · Check presence with an empty name issues a certificate

- **Type:** bug · **Priority:** P3 · **Status:** deferred
- **Labels:** `record` `ritual` `certificate` `current-site`
- **Opened by:** diane · **Assignee:** jules · **Opened:** 2025-05-20

Steps: Leave the name field empty. Press Check presence.

Expected: Nothing is issued, and the page says a name is needed.

Actual: A certificate with a blank where the name goes, and the seal.

**Comments**

**clive** · 2025-05-21

> Nothing remains where it is. The certificate is accurate.

**jules** · 2025-05-21

> It is accurate. The response doesn't depend on the input, including its absence. Whether an empty string is an object is a product question, not a defect in the check.

**diane** · 2025-05-21

> Then it's a product question with a blank on a certificate.

**jules** · 2026-10-03

> Still open after the interview. Q1 settles what every object gets; it doesn't settle whether an empty field is an object. Research 4 canonicalizes names (trim, collapse whitespace) before hashing, so a name of only spaces becomes the empty string, and whatever we decide for empty applies to it too.

**diane** · 2026-10-03

> Banked for Clive. Deferred until he answers it.

## sh-013 · Presence check: specification of the response

- **Type:** decision · **Priority:** P2 · **Status:** closed
- **Labels:** `record` `ritual` `spec`
- **Opened by:** jules · **Assignee:** diane · **Opened:** 2025-08-12
- **Closed:** 2025-08-13 — Approved by QA (Diane): the specification matches the source.

This documents what the presence check does, so that support, QA and the website copy describe the same thing.

Input: one string, the object's name, as typed.
Output: the result STILL HERE., with the name repeated back and the time of issue.

The check performs no lookup. It holds no state between requests, consults no inventory, and has no code path in which the result depends on the object, its name, the visitor, the time, or the object's location. The name is used only to be repeated back. There is therefore no failure mode in which an object is reported absent. The only failures available are the page failing to load or the download failing to save, and neither changes the result.

Consequences worth stating plainly:
1. Two checks of the same object, before and after it is removed, return the same result.
2. A check of an object that never existed returns the same result.
3. The check cannot be wrong about presence in the sense that matters to it, because it makes no observation.

Review requested from QA.

**Comments**

**diane** · 2025-08-13

> I've read the source. It does exactly this. Approved.

**diane** · 2025-08-13

> Finally. A man who returns what he promised.

**clive** · 2025-08-13

> Marking that off-topic. For the record, this is the first document that properly conveys the depth of the engine.

**diane** · 2025-08-13

> It describes a constant. Resolved.

## sh-014 · Define "confirmed presence" for the Vandalway portfolio report

- **Type:** task · **Priority:** P2 · **Status:** deferred
- **Labels:** `record` `vandalway` `reporting`
- **Opened by:** malcolm · **Assignee:** diane · **Opened:** 2025-09-03

Team,

The quarterly portfolio pack carries a "confirmed presence" figure for STILL HERE. Vandalway would value a definition we can stand behind, and a trajectory that tells a growth story without implying change.

Could we align on what is counted, and agree a baseline before the Q4 pack?

Malcolm

**Comments**

**jules** · 2025-09-04

> Two candidates, so the definition is explicit. The product confirms presence for every object submitted to it, but it keeps no record of submissions, so it can't supply a count. The figure in previous packs is the floor count Martin takes for the office, which counts the people on each floor at 11:50. These measure different things: the first is constant by design; the second varies with lunch.

**martin** · 2025-09-04

> Correct. I take the count at 11:50 daily. I was asked to in 2016, and nobody has asked me to stop.

**malcolm** · 2025-09-05

> Helpful. Let's use the one that trends upward.

**diane** · 2025-09-05

> Neither does.

**martin** · 2026-09-29

> Floor three, 11:50 today: 0. See sh-053. Graham was found on the stairs and counted for floor three on reflection, which makes it 1.

**len** · 2026-09-29

> are we

**len** · 2026-09-29

> counting

**len** · 2026-09-29

> people

**len** · 2026-09-29

> or

**len** · 2026-09-29

> chairs?

**diane** · 2026-09-29

> People. The chair is counted in Bev's inventory.

**bev** · 2026-09-29

> chair-01. Present. It was present at 11:50 as well.

**malcolm** · 2026-09-30

> Understood. For the Q4 pack, could we present Tuesday as a planned consolidation?

**diane** · 2026-09-30

> You can present it as Tuesday.

## sh-015 · Support address forwards to my personal mailbox

- **Type:** task · **Priority:** P3 · **Status:** deferred
- **Labels:** `record` `support` `email`
- **Opened by:** martin · **Assignee:** clive · **Opened:** 2025-10-07

Since my first week in 2014 the support address has forwarded to my personal mailbox, including on weekends, on holidays, and on each of the occasions my relocation was approved.

I would be grateful if the forwarding could stop. I am happy to discuss my reasons with anyone who has not restored me from a backup.

**Comments**

**clive** · 2025-10-08

> Martin is the voice of support. The forwarding is how customers hear it.

**diane** · 2025-10-08

> That isn't a reason to send it to his house.

**diane** · 2026-10-03

> Decided in Q22: one real address that answers at once in Martin's voice ("Your message has reached us. No one will read it.") and keeps nothing. Same on both domains. When it's built, nothing forwards anywhere.

**martin** · 2026-10-03

> Thank you. I note that the reply is in my voice. I would like the record to show that it is also accurate.

## sh-016 · Enterprise accounts for the civic rest sector

- **Type:** feature · **Priority:** P2 · **Status:** closed
- **Labels:** `record` `enterprise` `accounts`
- **Opened by:** clive · **Assignee:** jules · **Opened:** 2025-11-04
- **Closed:** 2026-10-02 — Decided: no accounts; an Enterprise page with no form (BRAINSTORM Q8).

Municipalities are telling us (one municipality, very clearly) that presence at scale needs a home.

I'd like Enterprise accounts: a dashboard of everything a council has entrusted to us, renewal reminders, a named representative, and a sense of permanence about the whole relationship.

This is how we move from objects to estates.

**Comments**

**diane** · 2025-11-05

> Accounts for what.

**jules** · 2025-11-05

> To set expectations: the product has no server-side state. Accounts or a shared database would be a separate backend decision, not a feature. An account would store the list of objects a council has checked, which the council could equally keep in a spreadsheet, and every check would still return the same result.

**clive** · 2025-11-06

> The spreadsheet is not the experience.

**diane** · 2026-10-02

> Decided (BRAINSTORM Q8): no accounts. An Enterprise page instead: bulk certification for municipalities and the civic rest sector, testimonials, and no form. It collects nothing. Call to action: "Enterprise clients: please remain where you are. A representative will be in touch." The site stays static. Closing.

**martin** · 2026-10-02

> May I ask which representative?

**clive** · 2026-10-02

> The representative will be in touch.

## sh-017 · Lunch-run receipts arrive in the support queue

- **Type:** task · **Priority:** P4 · **Status:** deferred
- **Labels:** `record` `finance` `support` `expenses`
- **Opened by:** martin · **Assignee:** susan · **Opened:** 2025-11-19

For the past three weeks the lunch-run receipts have been sent to the support address. Today's: two sandwiches, a soup, gum (sugar-free, flavor not stated), and a coffee described on the receipt as "large but not that large."

I have forwarded them to Accounts. I would be grateful if they could be sent there directly.

**Comments**

**susan** · 2025-11-19

> Thank you, Martin. Lucas: receipts go to Accounts, with the names of the people who ate the food. Gum is reimbursable once the flavor is disclosed. This is in the expenses policy, which I've reattached.

**lucas** · 2025-11-20

> Sorry Martin!! I'll keep sending them to you if that's ok, you always know where they go

**martin** · 2025-11-20

> I do not know where they go. I send them to Susan.

**lucas** · 2025-11-20

> perfect so that works!!

## sh-018 · Certificate identifier cannot be checked by anyone

- **Type:** bug · **Priority:** P2 · **Status:** deferred
- **Labels:** `record` `certificate` `verify` `identifier`
- **Opened by:** diane · **Assignee:** jules · **Opened:** 2025-12-02

Steps: Check "Folding chair" twice. Compare the identifiers. Then try to establish, from either identifier, whether we issued it.

Expected: The identifier means something. Someone holding a certificate can check that we issued it.

Actual: The identifier isn't derived from anything printed on the certificate. Nobody, including us, can tell a real one from a made-up one. It's decoration in a monospace font.

**Comments**

**clive** · 2025-12-03

> It's a serial number. Serial numbers are inherently reassuring.

**diane** · 2025-12-03

> Only if you can look them up.

**diane** · 2026-10-02

> Q7: a "Verify a certificate" page recomputes the identifier and confirms the issue ("Issued by STILL HERE for 'Memorial bench' on …"). An identifier that doesn't check out gets: "We could not locate this certificate. The object, however, is still here." It's a checksum made in the browser: it catches typos and casual edits, and anyone who reads the code can forge it. The legal page says so (sh-021).

**petra** · 2026-10-03

> Research 4 is filed. In summary, with the qualifications stated there: Crockford Base32 (no I, L, O or U; lower case accepted; `i` and `l` read as 1, `o` as 0; hyphens ignored), with Crockford's mod-37 check symbol. Every single-character substitution and every adjacent swap is caught; I derived this and then tested it exhaustively.¹ About one identifier in seven ends in one of the five extra check symbols `* ~ $ = U`, which is legitimate per the specification and occasionally surprising on paper.
>
> ¹ "Every," not "most." The distinction is the point of the exercise.

**diane** · 2026-10-03

> Q18: the identifier carries its own date (research 4, Branch B). Verify needs only the identifier and the name, and states the issue date. Records dated before 2026 quote no identifiers.

**jules** · 2026-10-03

> Edge cases for the Verify page, from research 4's published vectors:
>
> 1. Names are canonicalized before hashing (Unicode NFC, trim, collapse internal whitespace, lower-case), so `folding  CHAIR ` and `Folding chair` at 2026-10-03T10:52:00Z both give `SH-00PP-9AGR-1GTB`.
> 2. `Memorial bench` at 2026-10-03T10:52:01Z gives `SH-00PP-9AHN-M3JT`. Identifiers issued close together share a prefix. That's the date, not a collision.
> 3. A wrong name passes by chance about once in 2^20 attempts, roughly one in a million. That's the cost of four hash symbols.
> 4. The date field counts seconds from 2026-01-01T00:00:00Z, so nothing earlier can be represented.
> 5. A link dated in the future (the time capsule example is the natural test) recomputes a valid identifier. What Verify says about it is banked for Diane.
> 6. Hashing uses `crypto.subtle.digest`, which browsers provide only in secure contexts, so staging must be HTTPS (sh-043).

**diane** · 2026-10-03

> Future-dated links: open. Acceptance for the rest: all four published vectors verify; every single substitution and every adjacent swap of each vector is rejected with the Q7 sentence.

## sh-019 · The new site

- **Type:** epic · **Priority:** P1 · **Status:** deferred
- **Labels:** `record` `site` `rebuild`
- **Opened by:** clive · **Assignee:** jules · **Opened:** 2026-01-05

This is the year STILL HERE gets the website it has always deserved. Trustworthy. Expensive. A certificate so official that nobody could complain. The ritual at the center, and the company around it.

I'll write the vision down properly when it's ready. Until then, this is where it lives.

**Comments**

**diane** · 2026-01-06

> Acceptance criteria when you have them.

**clive** · 2026-09-24

> Nearly ready.

**clive** · 2026-10-02

> The vision is in the braindump.

**diane** · 2026-10-03

> Interview done: Q1 to Q24 answered, research R1 to R6 filed.

**jules** · 2026-10-03

> Handoff drafted. Priorities confirmed as drafted (Q23): the ritual and the certificate first; then the company website; the records; Vandalway's page; the privacy page. Nothing is built yet. Related: sh-009, sh-018, sh-021, sh-022, sh-039, sh-041, sh-042, sh-044.

## sh-020 · Stillness roadmap, 2026

- **Type:** epic · **Priority:** P1 · **Status:** deferred
- **Labels:** `record` `vandalway` `roadmap`
- **Opened by:** malcolm · **Assignee:** clive · **Opened:** 2026-01-12

Clive, Diane,

Vandalway would like a 2026 roadmap for STILL HERE that shows clear movement on stillness: expanded coverage, deeper engagement and new verticals, while preserving the core promise that nothing changes.

A one-page view by quarter would be ideal for the portfolio review.

Malcolm

**Comments**

**diane** · 2026-01-13

> Movement on stillness fails the acceptance criteria by definition. I can give you a page that says what we'll build.

**clive** · 2026-01-13

> Q1: pre-movement. Q2: anticipatory presence. Q3: the civic rest sector. Q4: consolidation.

**malcolm** · 2026-06-02

> We need movement on the stillness roadmap.

**diane** · 2026-06-02

> Noted. What gets built is decided here.

**malcolm** · 2026-09-28

> Following my email this morning: movement before Friday, please, without compromising the core promise that nothing has changed.

**clive** · 2026-10-02

> Posting Friday's summary here for the record:
>
> We maintained uninterrupted certification through a facilities event, expanded into theme-park-adjacent expenditure, and validated the platform against deliberate furniture displacement.
>
> No material change to the core product.

**diane** · 2026-10-02

> That last sentence is accurate.

## sh-021 · Terms of Presence and Privacy must say exactly what we do

- **Type:** task · **Priority:** P2 · **Status:** deferred
- **Labels:** `record` `legal` `site` `privacy`
- **Opened by:** diane · **Assignee:** diane · **Opened:** 2026-01-27

The legal pages are the only place a visitor can find out what the certificate does not establish. They should say it in plain words, and they should say only true things.

Draft acceptance: every limit the product has appears on the Terms of Presence page; every place a visitor's data could go appears on the Privacy page; nothing on either page is aspirational.

**Comments**

**clive** · 2026-01-28

> Can the Terms be called the Terms of Presence?

**diane** · 2026-01-28

> Yes. That's the one thing about them that can be grand.

**diane** · 2026-10-03

> Now settled. For the Terms: the footer's sentence (Q4); the identifier is a checksum made in the browser, catches typos and casual edits, and can be forged by anyone who reads the code (Q7).
>
> For Privacy: no analytics script anywhere; our host logs visitors' IP addresses for its own security and we can't read those logs (sh-035); the Presence Portfolio stays on the visitor's device, we never receive it, and Safari may clear it after seven days of browsing without a visit (Q6, research 5); a certificate link's name and time sit after the `#` and never reach a server or its logs (Q13); the mailbox replies automatically and keeps nothing (Q22).

**jules** · 2026-10-03

> A correction to my own earlier wording, which said "server logs only." On GitHub Pages the logs are GitHub's: visitors' IP addresses are logged for security, and I found no documented way for a site owner to read them. The only server whose logs we will hold is the one serving vandalwayind.com.

## sh-022 · A visitor who closes the tab loses the certificate

- **Type:** bug · **Priority:** P2 · **Status:** deferred
- **Labels:** `record` `portfolio` `certificate` `storage`
- **Opened by:** diane · **Assignee:** jules · **Opened:** 2026-02-09

Steps: Check "Wallet". Don't download. Close the tab. Come back.

Expected: Some way to get the certificate back.

Actual: None. Martin has had four emails this month asking for a lost certificate, and he can't reissue one, because we don't keep them.

**Comments**

**martin** · 2026-02-10

> Five, as of this morning. I have been explaining that the object is still here even if the certificate is not. This has not been as reassuring as I hoped.

**diane** · 2026-10-02

> Q6: the visitor's browser keeps their past certificates ("Your Presence Portfolio"), each re-downloadable. We never receive it. Clearing browser data clears it.

**diane** · 2026-10-03

> Research 5: Safari deletes all script-writable storage for a site after seven days of Safari use with no click, tap or keypress on that site. Home Screen web apps are exempt. Chrome and Firefox delete nothing on a timer. So the portfolio is best-effort, and the privacy page has to say so.

**diane** · 2026-10-03

> Q13: every certificate also gets a link carrying the object's name and time after the `#`, so it can be reopened and redrawn without storage, and a "Copy certificate link" button sits beside the downloads.

**jules** · 2026-10-03

> Storage, so nobody has to guess. The portfolio should store what is needed to redraw a certificate (name, time, zone), not the PDF or PNG; files are regenerated on demand from the same SVG. Web Storage is limited to 10 MiB per origin, commonly 5 MiB of it `localStorage`. An entry is on the order of a hundred bytes, so the limit is tens of thousands of certificates (my estimate, not measured). We should not call `navigator.storage.persist()` by default: research 5 found it isn't documented to lift Safari's seven-day rule.

**diane** · 2026-10-03

> Acceptance: issue, close the tab, come back: the certificate is in the portfolio. Clear site data: the portfolio is empty, and the certificate link still redraws it.

## sh-023 · Every download is named certificate.pdf

- **Type:** bug · **Priority:** P3 · **Status:** deferred
- **Labels:** `record` `certificate` `pdf` `current-site`
- **Opened by:** diane · **Assignee:** jules · **Opened:** 2026-02-23

Steps: Check "Car keys" and download. Check "Glasses" and download.

Expected: Two files I can tell apart.

Actual: certificate.pdf and certificate (1).pdf.

**Comments**

**clive** · 2026-02-24

> Every certificate is equally valid. A uniform name reflects that.

**diane** · 2026-02-24

> Identical certificates are a product decision. Identical filenames are a support ticket.

**martin** · 2026-02-24

> Confirmed: it is a support ticket. Several.

**jules** · 2026-10-03

> Not settled for the rebuild. Q1 makes every certificate identical in kind; it doesn't require identical filenames. A caution about the obvious choice: an identifier can end in `*`, which Windows doesn't allow in a filename, or in `$` or `=`, which are allowed but odd. So not the raw identifier. The object's name would need the same sanitizing.

**diane** · 2026-10-03

> Deferred until the export exists. Acceptance when it does: downloads of two different objects get different filenames on every platform we test.

## sh-024 · Certificate typeface must be licensed for PDF embedding

- **Type:** task · **Priority:** P2 · **Status:** deferred
- **Labels:** `record` `certificate` `typography` `licensing`
- **Opened by:** jules · **Assignee:** jules · **Opened:** 2026-03-03

Before anyone falls in love with a typeface for the certificate: whatever we choose will be embedded in every PDF we generate and served to every browser that draws the certificate. That needs a licence that permits both. Commercial licences often price those uses separately, or forbid embedding outright.

Proposal: choose from faces under the SIL Open Font License.

**Comments**

**clive** · 2026-03-04

> I'd like something that has appeared on currency.

**diane** · 2026-03-04

> Which one, and under what licence.

**clive** · 2026-03-04

> Something that feels as though it has.

**jules** · 2026-10-03

> Research 2 confirms the proposal. The OFL permits embedding in a PDF "either in full or a subset," and serving the face as a web font. We need two files of the same face: TrueType for jsPDF, which accepts TTF only, and WOFF2 for the page. The face also has to cover accented names (sh-033).

## sh-025 · Customer request: certificates for a municipal asset register (Eileen Webb)

- **Type:** task · **Priority:** P2 · **Status:** deferred
- **Labels:** `record` `support` `customer` `municipal`
- **Opened by:** martin · **Assignee:** martin · **Opened:** 2026-03-16

Ms Webb, municipal archivist, writes:

"Good afternoon. Our asset register lists 214 items of street furniture. The auditors would like evidence of each. Can each item be certified, and is a certificate acceptable for an item we cannot presently find?"

I have replied that each item can be checked individually on the site, and that a certificate confirms the form was completed. I have not addressed the second question, because I do not believe it has an answer I am authorised to give.

**Comments**

**clive** · 2026-03-17

> This is the civic rest sector, arriving.

**martin** · 2026-05-11

> Ms Webb writes: "Thank you. We have certified 38 so far. Is it a problem that several were certified from the office rather than on site?" I replied that it makes no difference to the certificate.

**diane** · 2026-05-11

> That's correct, and she should know why. Point her to the Terms when they exist (sh-021).

**martin** · 2026-10-02

> Ms Webb writes (09:14): "Good morning. The certificate came through beautifully. Does it remain valid if the bench was removed in April? We need something for the audit."

**martin** · 2026-10-02

> Replied (09:32): "The certificate confirms that our system processed the words 'Memorial bench.' It cannot establish the bench's whereabouts. I appreciate that this distinction may affect your audit and our business model."

**bev** · 2026-10-02

> bench-01: absent. Removed in April, per Ms Webb.

**diane** · 2026-10-02

> Linked: sh-051.

**clive** · 2026-10-02

> Could we invite Ms Webb to speak at something?

**martin** · 2026-10-02

> I would not.

## sh-026 · Case studies: three municipal deployments

- **Type:** feature · **Priority:** P2 · **Status:** deferred
- **Labels:** `record` `site` `case-studies` `marketing`
- **Opened by:** clive · **Assignee:** clive · **Opened:** 2026-03-30

Three case studies for the new site, one per vertical:

1. Municipal infrastructure: securing the continuity of a civic asset register.
2. Public seating: certifying a city's commitment to rest.
3. The civic rest sector: presence as a public service.

Draft copy attached. Photography to follow.

**Comments**

**diane** · 2026-03-31

> These are the same customer.

**clive** · 2026-03-31

> Three deployments.

**diane** · 2026-03-31

> One archivist. One register.

**martin** · 2026-04-02

> Has Ms Webb agreed to appear in any of them? She has not mentioned it to me.

**clive** · 2026-04-02

> She'll be delighted.

**diane** · 2026-04-02

> Acceptance: written permission from the customer for each case study, on file, before anything is published.

**malcolm** · 2026-09-28

> One customer appearing in three case studies remains one customer for reporting purposes.

## sh-027 · Accessibility audit: the check and the certificate

- **Type:** task · **Priority:** P1 · **Status:** deferred
- **Labels:** `record` `accessibility` `audit`
- **Opened by:** diane · **Assignee:** petra · **Opened:** 2026-04-08

Audit of the current check flow against WCAG 2.2 AA, by keyboard and with a screen reader. Defects are filed separately.

1. No visible focus indicator on Check presence or the download link (sh-028).
2. The result isn't announced to screen readers. The page changes silently.
3. The download link reads "Download", with no object or format.
4. The new verification sequence (sh-019) will need a reduced-motion version (sh-029).

Requesting a methodology review from Research before we call the audit complete.

**Comments**

**petra** · 2026-04-09

> Review scheduled: 2026-04-14, 10:00.

**petra** · 2026-04-13

> Moved to 2026-04-16, 15:00. The temporal coordinates remain provisional.

**petra** · 2026-04-16

> Moved to 2026-04-21, 09:00.

**petra** · 2026-04-20

> Canceled. In lieu of attendance, please review the attached note, "On the Perceivability of Here: Methodological Remarks on an Accessibility Audit" (31 pp.). The short answer is at §2.4.

**diane** · 2026-04-21

> §2.4 says "yes, with qualifications." I asked for yes or no on a checklist.

**petra** · 2026-04-21

> The qualifications are the answer. See §2.5 to §2.9.

**diane** · 2026-10-03

> Carried into the rebuild. Acceptance: WCAG 2.2 AA on the home page, Verify, and the certificate download, checked by keyboard only and with a screen reader, with results written here.

## sh-028 · No visible focus indicator on Check presence

- **Type:** bug · **Priority:** P2 · **Status:** deferred
- **Labels:** `record` `accessibility` `ritual` `current-site`
- **Opened by:** diane · **Assignee:** jules · **Opened:** 2026-04-08

Steps: Load the home page. Press Tab until focus reaches Check presence.

Expected: A visible focus indicator.

Actual: None. The stylesheet removes the outline from every button and link. A keyboard user can't tell where they are.

**Comments**

**clive** · 2026-04-09

> The outline interrupts the composition.

**diane** · 2026-04-09

> It shows people where they are. We are a company that sells that.

**jules** · 2026-10-03

> For the rebuild: never remove the outline without a replacement. Style `:focus-visible`, so the indicator appears for keyboard focus and not on every mouse click, and give it at least 3:1 contrast against the adjacent colours (WCAG 2.2, non-text contrast).

**diane** · 2026-10-03

> Acceptance: every interactive element on every page shows a visible focus indicator when tabbed to, checked by keyboard on each page.

## sh-029 · Verification sequence under reduced motion

- **Type:** task · **Priority:** P2 · **Status:** deferred
- **Labels:** `record` `accessibility` `ritual` `motion`
- **Opened by:** diane · **Assignee:** jules · **Opened:** 2026-04-09

From the audit (sh-027). Whatever the new verification sequence does, a visitor who has asked their system for reduced motion should get the same information without the animation. Raising it now so it's in the specification rather than retrofitted.

**Comments**

**diane** · 2026-10-02

> Q5: with reduced motion requested, the same three lines appear in order without animation.

**jules** · 2026-10-03

> The indicator never moves in either mode (Q5), so reduced motion changes only how the three lines enter: under `prefers-reduced-motion: reduce` each line appears at once instead of animating in. Q5 doesn't say whether the lines keep the 4 to 5 second pacing under reduced motion. I'd keep it, because the pacing is how a visitor reads three lines, not decoration. That's my recommendation, not a decision.

**diane** · 2026-10-03

> Acceptance: with reduced motion on, nothing moves or fades; the three lines appear in order; the result is the same. Pacing: banked for Clive.

## sh-030 · Copy: replace "stillness" with "pre-movement"

- **Type:** feature · **Priority:** P4 · **Status:** deferred
- **Labels:** `record` `copy` `site`
- **Opened by:** clive · **Assignee:** clive · **Opened:** 2026-05-05

"Stillness" undersells what our customers' objects are doing. I'd like every instance of "stillness" on the site replaced with "pre-movement," which captures the latent dynamism of a thing that remains.

**Comments**

**diane** · 2026-05-06

> Acceptance: someone who has never met you reads the sentence and knows what it means. Try it on Graham.

**petra** · 2026-05-07

> A note on terms. "Pre-movement" presupposes subsequent movement, which the product neither certifies nor, strictly, permits.¹ "Stillness" makes no such commitment.
>
> ¹ See my forthcoming paper, §3, "On the Directionality of Here."

**graham** · 2026-05-07

> Asked. He said "before it moves?" Then he asked what was moving.

**clive** · 2026-05-08

> Precisely the conversation we want to start.

## sh-031 · Support macro: what a certificate establishes

- **Type:** chore · **Priority:** P3 · **Status:** closed
- **Labels:** `record` `support` `copy`
- **Opened by:** martin · **Assignee:** martin · **Opened:** 2026-05-12
- **Closed:** 2026-05-12 — Wording approved by QA (Diane); macro in use.

Proposed standard reply for customers who ask what the certificate proves:

"Thank you for your question. The certificate confirms that our system processed the name you entered, at the time shown. It does not involve an inspection of the object and cannot establish where the object is. We appreciate your continued confidence."

Requesting approval from QA, so that the wording matches the certificate.

**Comments**

**clive** · 2026-05-12

> Could we say "establishes continuity of presence"?

**diane** · 2026-05-12

> No. Approved as written.

**martin** · 2026-05-12

> Thank you. In use from today.

## sh-032 · Long object names run off the certificate

- **Type:** bug · **Priority:** P3 · **Status:** deferred
- **Labels:** `record` `certificate` `typography` `current-site`
- **Opened by:** diane · **Assignee:** jules · **Opened:** 2026-05-26

Steps: Check "The memorial bench formerly outside the east entrance of the municipal courthouse". Download.

Expected: The whole name on the certificate.

Actual: The name runs past the right margin and under the seal. The PDF cuts it off after "east entrance of the".

**Comments**

**jules** · 2026-10-03

> For the rebuild: the result repeats the name the visitor gave (the ritual, step 4), so truncation is out. Proposed rule: reduce the name's size to a floor, then wrap to a second line, then a third, centred, with the seal placed below the last line. A name too long even for that needs a limit at the input, stated before Check, not after. The QR code (sh-044) also gets denser as the name grows, since the name travels in the link.

**diane** · 2026-10-03

> Acceptance: the longest example on the list, a 200-character name, and a single 60-character word each print in full on the PDF and the PNG, legible at 100%, with nothing under the seal. The input limit, if any: banked for Clive.

## sh-033 · Accented names lose their accents on the certificate

- **Type:** bug · **Priority:** P2 · **Status:** deferred
- **Labels:** `record` `certificate` `typography` `i18n` `current-site`
- **Opened by:** diane · **Assignee:** jules · **Opened:** 2026-06-10

Steps: Check "Café chair". Download.

Expected: Café chair.

Actual: "Caf? chair" in the PDF. Correct on screen.

Also tried: "Piñata" (same), "Crème brûlée torch" (three question marks).

**Comments**

**jules** · 2026-06-11

> The PDF generator's font has no glyphs outside basic Latin, and it substitutes a question mark rather than failing. Same root as sh-003: the certificate's font isn't the screen's font.

**jules** · 2026-10-03

> For the rebuild, two separate things. Glyph coverage: the embedded face must contain the characters (sh-024), and if the font is subset, the subset must include what each certificate uses. Identity: research 4 normalizes names to Unicode NFC before hashing, so "Café" typed with a composed é and with e plus a combining accent gives the same identifier.

**diane** · 2026-10-03

> Acceptance: the three names above print correctly in both exports and verify with either form of é. Coverage beyond Latin: banked for Clive.

## sh-034 · Machine-readable presence status for the portfolio dashboard

- **Type:** feature · **Priority:** P2 · **Status:** deferred
- **Labels:** `record` `vandalway` `api` `presence-json`
- **Opened by:** malcolm · **Assignee:** jules · **Opened:** 2026-06-16

Vandalway's portfolio team is consolidating company status into a single dashboard. Could STILL HERE expose its presence status in a machine-readable form? Ideally something that can show growth over time.

Malcolm

**Comments**

**clive** · 2026-06-17

> An API. At last.

**jules** · 2026-10-03

> Q19 takes `presence.json`: a static file in the site that reads `{"status": "STILL HERE"}`. What I observed of GitHub Pages today, on its own site rather than ours: any query string is accepted and ignored; a JSON file is served as `application/json` with `access-control-allow-origin: *`; responses carry `cache-control: max-age=600`. Pages doesn't let us set our own headers, so the ten-minute cache is what it is. For a constant, it is never stale. The dashboard can read the file from any origin.

**malcolm** · 2026-10-03

> Can it show growth?

**jules** · 2026-10-03

> It shows the status.

**diane** · 2026-10-03

> Acceptance: the same bytes for `presence.json` with and without any query string, on staging and production; parses as JSON; served as `application/json`.

## sh-035 · Visitor numbers for the quarterly portfolio pack

- **Type:** decision · **Priority:** P2 · **Status:** closed
- **Labels:** `record` `vandalway` `analytics` `privacy`
- **Opened by:** malcolm · **Assignee:** diane · **Opened:** 2026-06-16
- **Closed:** 2026-10-03 — Decided: no analytics anywhere (BRAINDUMP platform note; HANDOFF).

Alongside the dashboard feed (sh-034), Vandalway would like monthly visitor numbers for STILL HERE: visits, certificates issued, and top objects. Standard portfolio metrics.

**Comments**

**jules** · 2026-06-17

> We don't run an analytics script, and the new site won't. Certificates are made in the visitor's browser and never sent to us, so we don't know how many are issued, or for what.

**malcolm** · 2026-06-17

> Could we estimate?

**diane** · 2026-06-17

> No.

**jules** · 2026-10-03

> A further limit, for the record. On GitHub Pages, visitors' IP addresses are logged by GitHub for security, and I found no documented way for a site owner to read those logs or get a visit count. So we won't have visit numbers either. The privacy page says both things (sh-021).

**diane** · 2026-10-03

> Decided: no analytics, anywhere. Closing.

## sh-036 · What should the status page say?

- **Type:** decision · **Priority:** P2 · **Status:** closed
- **Labels:** `record` `status-page` `site`
- **Opened by:** martin · **Assignee:** diane · **Opened:** 2026-07-07
- **Closed:** 2026-10-03 — Decided (BRAINSTORM Q11).

I write the status updates. I would be grateful for guidance on what the status page should say when something is wrong, as distinct from what it says now, which is "All systems operational."

**Comments**

**clive** · 2026-07-08

> Nothing is ever wrong with presence.

**martin** · 2026-07-08

> Understood. And when the third floor is evacuated?

**clive** · 2026-07-08

> That's the office, not the product.

**diane** · 2026-10-03

> Decided (Q11): "All systems operational," always, plus an incident history written from the company's records, for example "Unexpected concentration of elsewhere on floor three"; "Scheduled relocation of the flagship research asset (Fridays)"; "Investigating reports of a bench." Nothing is measured live. The history is authored. Martin writes it.

**martin** · 2026-10-03

> Thank you. I will continue writing the history.

## sh-037 · Certificate footer undersells the experience

- **Type:** bug · **Priority:** P3 · **Status:** closed
- **Labels:** `record` `certificate` `copy`
- **Opened by:** clive · **Assignee:** diane · **Opened:** 2026-08-04
- **Closed:** 2026-10-02 — Decided (BRAINSTORM Q4): both; the footer stays as written.

The footer currently reads: "Confirms successful completion of this form. No physical inspection occurred."

This is the last thing a customer reads. It should leave them with confidence, not a disclaimer.

Proposed: "Presence confirmed to the standard of STILL HERE."

**Comments**

**diane** · 2026-08-04

> It tells them what the button did. It stays.

**clive** · 2026-08-05

> I have registered my position that it undersells the experience.

**diane** · 2026-10-02

> Decided (Q4): both. Clive's language takes the top of the certificate: the "This certifies that…" heading, the seal, the signatures. The footer stays at the bottom, in small type, as written: "Confirms successful completion of this form. No physical inspection occurred." Resolved.

## sh-038 · Certificate download: which formats?

- **Type:** decision · **Priority:** P2 · **Status:** closed
- **Labels:** `record` `certificate` `pdf` `png`
- **Opened by:** diane · **Assignee:** jules · **Opened:** 2026-08-11
- **Closed:** 2026-10-03 — Decided (BRAINSTORM Q3): PDF and PNG from one SVG.

The current certificate downloads as a PDF only. People ask for an image they can post or send.

Before we build anything: which formats, and how do we keep them from disagreeing with each other?

**Comments**

**clive** · 2026-08-12

> Every format. A certificate should be available wherever presence is appreciated.

**diane** · 2026-08-12

> Name them.

**diane** · 2026-10-02

> Decided (Q3): PDF and PNG, drawn once as a single vector certificate (SVG) in the visitor's browser and exported to each.

**jules** · 2026-10-03

> Research 2's recommendation: PDF through jsPDF 4.2.1 and svg2pdf.js 2.8.1; PNG through the browser's own SVG renderer onto a canvas. Both libraries are MIT-licensed. One qualification on "can never differ": the two files share one source, but the PNG is rasterized by whichever browser the visitor uses, and in the trial Chromium and WebKit produced different pixels from the same SVG. Same content, not identical pixels. And svg2pdf.js supports only part of SVG, so the certificate has to be designed inside that subset.

**diane** · 2026-10-03

> Closing as decided. Implementation acceptance goes on the export issue when it's filed.

## sh-039 · Saving a certificate on an iPhone

- **Type:** task · **Priority:** P2 · **Status:** deferred
- **Labels:** `record` `ios` `certificate` `testing`
- **Opened by:** diane · **Assignee:** clive · **Opened:** 2026-08-18

Half the support emails about downloads come from phones. Before downloads ship in the new site, someone has to save a certificate, as a PDF and as an image, on a real iPhone, and write down exactly what happened.

**Comments**

**jules** · 2026-10-03

> What research 2 established, and what it didn't.
>
> Established: the `download` attribute works in iOS Safari from 13.0. The Web Share API with files works in Safari 14 and later and in Chrome for Android 76 and later, not in Firefox, so a Share button can hand the PNG to the iOS share sheet. WebKit bug 219770 (an SVG with an embedded font can fire `onload` before the font is ready) is still open; its latest report says the test case renders correctly in Safari 26.5.2. We'll load the font with `document.fonts.load()` before drawing regardless. iOS Safari refuses canvases over 16,777,216 pixels in area, which bounds the PNG size.
>
> Not established: anything on an actual iPhone. The trial ran on a Linux build of the WebKit engine, which is not Safari on iOS.

**diane** · 2026-10-03

> Q24: Clive runs a five-minute test on his phone against staging, from a checklist. The checklist: the PDF downloads and opens in the certificate font; the PNG saves to Photos through the share sheet; the certificate link reopens it; the portfolio survives closing Safari.

**clive** · 2026-10-03

> I'll bring the chair.

## sh-040 · Example objects should rotate to feature the civic rest sector

- **Type:** feature · **Priority:** P3 · **Status:** deferred
- **Labels:** `record` `ritual` `examples` `copy`
- **Opened by:** clive · **Assignee:** clive · **Opened:** 2026-08-25

The examples under the input are our shop window. I'd like them to rotate on each visit, weighted toward municipal infrastructure: benches, bollards, a bandstand, a drinking fountain.

**Comments**

**diane** · 2026-08-26

> What does rotation change about the result?

**clive** · 2026-08-26

> Nothing. That's the beauty of it.

**diane** · 2026-10-03

> Q10 settled the list: everyday things (car keys, phone, wallet, glasses); Folding chair; and five exotic items: the Moon, a hot-air balloon, an emotional-support peacock, a time capsule (contents unknown), a lighthouse. Rotation wasn't asked or answered. An example only fills the input. Every object gets the same certificate (Q1).

**clive** · 2026-10-03

> Could we add "Memorial bench"?

**martin** · 2026-10-03

> Ms Webb may see it.

**diane** · 2026-10-03

> Not on the Q10 list. Rotation and additions are Clive's to put to the interview. Deferred.

## sh-041 · Mistyped links show a bare "Not Found"

- **Type:** bug · **Priority:** P3 · **Status:** deferred
- **Labels:** `record` `site` `copy` `hosting`
- **Opened by:** martin · **Assignee:** jules · **Opened:** 2026-09-02

Several customers this month have followed a mistyped link and reached a page reading only "404 Not Found." Two of them wrote to ask whether this meant their object was gone. I reassured them. I would be grateful if the page could reassure them itself.

**Comments**

**diane** · 2026-10-03

> Q19: the 404 reads "We could not locate this page. The page, however, is still here."

**jules** · 2026-10-03

> GitHub Pages serves a custom `404.html` from the published root. The staging server has to do the same (nginx: `error_page 404 /404.html;`) so the two behave alike. The response must still carry a 404 status, not a 200 with apologetic text, or link checkers and search engines will treat every typo as a real page.

**diane** · 2026-10-03

> Acceptance: a missing path returns status 404 and that sentence, on staging and production.

## sh-042 · Internal records in the repository must never be served as pages

- **Type:** task · **Priority:** P1 · **Status:** deferred
- **Labels:** `record` `hosting` `security` `records`
- **Opened by:** diane · **Assignee:** jules · **Opened:** 2026-09-04

Once the site and the company's records share a repository, one careless publishing setting could put the issue tracker, correspondence and inventory on the public website. That has to be impossible, not just unlikely.

**Comments**

**diane** · 2026-10-02

> Q9: the internal records live in the public repository, not on the site. The site shows only what a company would publish.

**jules** · 2026-10-03

> Research 3 recommends publishing with Actions from the site folder only, so nothing outside it is ever uploaded. The records aren't hidden; they're simply not part of the site. Anyone can read them in the repository, which is what Q9 intends.

**diane** · 2026-10-03

> Acceptance: a request for any records path returns 404 on staging and production; the published artifact contains only the site folder.

## sh-043 · Preview link for Vandalway before the portfolio review

- **Type:** task · **Priority:** P2 · **Status:** deferred
- **Labels:** `record` `vandalway` `staging` `hosting`
- **Opened by:** malcolm · **Assignee:** jules · **Opened:** 2026-09-08

Could the team share a preview link for the new site ahead of Vandalway's portfolio review? A link I can forward to colleagues would be ideal.

**Comments**

**jules** · 2026-09-09

> There's nothing to preview yet. When there is, it will be on staging, which is on our internal network only until launch; the repository stays private until launch and goes public then. So there won't be a link that can be forwarded outside the company. We can show it to you on a call.

**malcolm** · 2026-09-09

> Understood. Could the internal link be made temporarily external?

**diane** · 2026-09-09

> No.

**jules** · 2026-10-03

> Two staging requirements for whoever sets it up. It has to be HTTPS: the certificate identifier uses `crypto.subtle`, which browsers provide only in secure contexts, so a plain-HTTP staging address would break Verify. And the staging hostname doesn't get written into this tracker or the repository, which is going public.

**diane** · 2026-10-03

> Q24 uses staging for Clive's phone test (sh-039).

## sh-044 · A printed certificate can't be checked from the paper

- **Type:** feature · **Priority:** P2 · **Status:** deferred
- **Labels:** `record` `certificate` `verify` `qr` `print`
- **Opened by:** diane · **Assignee:** jules · **Opened:** 2026-09-10

Ms Webb's auditors work from printed binders (sh-025). A certificate on paper carries an identifier and nothing else: no way to get from the page to anything that confirms it. If certificates are going to be checkable at all (sh-018), the paper copy needs a way back.

**Comments**

**diane** · 2026-10-03

> Q19: a QR code inside the certificate. Opening a certificate link and verifying are one page, reached two ways.

**jules** · 2026-10-03

> The QR code is drawn inside the certificate's SVG, so it's in the PDF, the PNG and anything printed from either (Q3). It encodes the certificate link; the name and time travel after the `#` and never reach a server or its logs. Two design constraints. QR codes need a quiet zone four modules wide on every side, so nothing (seal, border) may sit within it. And the code's density grows with the length of the name, so long names (sh-032) need testing.

**clive** · 2026-10-03

> Could the code be in verification green?

**diane** · 2026-10-03

> Graphite on warm white, unless green passes the same scan test. Acceptance: the code scans and opens the right certificate from a 100% print of the PDF, from the PNG on a phone screen, and for the longest example name.

## sh-045 · Domain for the new site

- **Type:** decision · **Priority:** P1 · **Status:** closed
- **Labels:** `record` `hosting` `domain`
- **Opened by:** clive · **Assignee:** diane · **Opened:** 2026-09-14
- **Closed:** 2026-10-03 — Decided (BRAINSTORM Q13): isitstillhere.com; vandalwayind.com for Vandalway's page. Purchased; DNS not yet set.

The new site needs a domain that says what we do, with confidence.

**Comments**

**malcolm** · 2026-09-15

> Would vandalway.com not be the natural home?

**diane** · 2026-10-03

> Research 1, rechecked by registry lookup: vandalway.com belongs to an unrelated party and was registered in 2018. Nothing of ours links there.

**diane** · 2026-10-03

> Decided (Q13): isitstillhere.com for STILL HERE; the home page asks "Is it still here?" vandalwayind.com for Vandalway's page, served from our own server, because Pages allows one custom domain per repository. Both purchased today. Registrar setup pending; DNS not yet set.

## sh-046 · Site footer should acknowledge Vandalway

- **Type:** decision · **Priority:** P3 · **Status:** closed
- **Labels:** `record` `site` `vandalway`
- **Opened by:** malcolm · **Assignee:** diane · **Opened:** 2026-09-15
- **Closed:** 2026-10-03 — Decided (BRAINSTORM Q12, Q13, Q16).

Vandalway would appreciate the parent relationship being visible on the new site, ideally with a link to current Vandalway materials.

**Comments**

**diane** · 2026-10-03

> Decided (Q12): the footer reads "A Vandalway Industries company" and links to Vandalway's own website, a one-page site from the 1990s, never updated, at vandalwayind.com (Q13). MONOvision is not mentioned (Q16).

**malcolm** · 2026-10-03

> Is there nothing more current?

**clive** · 2026-10-03

> It is Vandalway's current website.

## sh-047 · Verification green as text: contrast on warm white

- **Type:** task · **Priority:** P2 · **Status:** deferred
- **Labels:** `record` `accessibility` `design` `color`
- **Opened by:** diane · **Assignee:** jules · **Opened:** 2026-09-17

The proposed palette is warm white, graphite, and one verification green. Bright greens on off-white often fail text contrast. Before the green is used for "STILL HERE." or any other text, measure it.

**Comments**

**clive** · 2026-09-18

> Green is the color of confirmation. It must be the result.

**diane** · 2026-09-18

> It can be the result if it passes. Acceptance: text at least 4.5:1 against its background; large text at least 3:1; focus indicators and controls at least 3:1. Where the green fails, the text is graphite and the green becomes a fill or a mark beside it.

**jules** · 2026-09-18

> Agreed. The palette is still a proposal; this check runs on whatever values are approved.

## sh-048 · Unreconciled: Lucas, receipts from 8 September onward

- **Type:** task · **Priority:** P3 · **Status:** deferred
- **Labels:** `record` `finance` `expenses`
- **Opened by:** susan · **Assignee:** susan · **Opened:** 2026-09-18

The following receipts were submitted by Lucas, through Martin, between 2026-09-08 and 2026-09-17. None carries a cost center, and none names the people who ate anything.

- 2026-09-08: two sandwiches. Eaters not named.
- 2026-09-10: parking, all day. Location not stated.
- 2026-09-11: batteries, AA, eight.
- 2026-09-15: lanyard holder, one.
- 2026-09-17: gum, sugar-free. Flavor not disclosed.

Please treat this list as the attachment to my email of 2026-09-18, which itself references the attachment to my email of 2026-09-12.

**Comments**

**martin** · 2026-09-18

> These came to me. I forwarded them to Susan. I do not know where Lucas is buying lunch.

**martin** · 2026-09-30

> Lucas writes (10:16): "Hi Martin! Attaching this week's stuff: fog fluid, two sandwiches, and Dracula parking. They gave me a radio now so probably best to text. Do we reimburse capes if they're technically PPE?"

**susan** · 2026-09-30

> Lucas,
>
> As previously noted, a lanyard is not a purchase order. Please identify the department authorizing the fog, the name of the person consuming the sandwiches, and whether Dracula is the driver or the location.
>
> Your gum reimbursement remains pending flavor disclosure.
>
> Susan

**susan** · 2026-10-01

> Status as of 2026-10-01: eight receipts unreconciled, no cost centers, one open question about capes.

## sh-049 · The verification sequence should feel thorough

- **Type:** decision · **Priority:** P2 · **Status:** closed
- **Labels:** `record` `ritual` `motion`
- **Opened by:** clive · **Assignee:** diane · **Opened:** 2026-09-21
- **Closed:** 2026-10-02 — Decided (BRAINSTORM Q5): about 4 to 5 seconds, identical for every object.

When a visitor presses Check presence, they should feel the full weight of verification. Twenty seconds at least. Perhaps a progress bar that reaches 100% twice.

**Comments**

**diane** · 2026-09-22

> How long, exactly, and does it differ by object?

**jules** · 2026-09-22

> It can't differ by object without inventing a difference. The result is known before the first line appears, so any duration is a choice of pacing, not of work.

**diane** · 2026-10-02

> Decided (Q5): ceremonial, about 4 to 5 seconds. Each of the three lines ("Establishing here." "Comparing here with here." "No actionable elsewhere detected.") holds long enough to read, under a calm indicator that never actually moves. Identical for every object. With reduced motion requested, the same three lines appear in order without animation (sh-029).

**clive** · 2026-10-02

> And the progress bar?

**diane** · 2026-10-02

> Never moves.

## sh-050 · Relocation request

- **Type:** task · **Priority:** P3 · **Status:** open
- **Labels:** `record` `staff` `relocation`
- **Opened by:** martin · **Assignee:** diane · **Opened:** 2026-09-25

This is my ninth relocation request. The previous eight are attached, along with a handover that has not needed updating since 2019.

I would like to relocate. Any destination is acceptable. I note that the company already recognises "elsewhere" as a category; I would be content to be detected there.

With thanks,
Martin

**Comments**

**diane** · 2026-09-25

> Approved.

**bev** · 2026-09-25

> Ninth. All nine letters are in the spreadsheet, tab "Martin".

**clive** · 2026-09-28

> Lowered to P3. Support continuity outranks relocation.

**martin** · 2026-09-28

> Thank you, Diane. I will leave this open until it is true.

**clive** · 2026-10-01

> Weekend backups verified.

**martin** · 2026-10-01

> Noted.

## sh-051 · Certificate does not distinguish present from absent objects

- **Type:** bug · **Priority:** P2 · **Status:** open
- **Labels:** `record` `bug` `certificate` `ritual`
- **Opened by:** diane · **Assignee:** jules · **Opened:** 2026-09-28
- **Record ID:** ISSUE-001

Steps: Enter “Folding chair.” Check. Remove chair. Check again.

Expected: A meaningful difference if we intend to sell physical verification.

Actual: Two certificates and no chair.

**Comments**

**jules** · 2026-09-28

> The implementation conforms to the advertised constant-presence response contract. The physical-verification requirement does not currently exist.

**diane** · 2026-09-28

> Correct. Leaving this open for the advertised part.

**clive** · 2026-09-28

> Relabeled `bug` → `market-education`. This is an opportunity to educate the market about what certification means.

**diane** · 2026-09-28

> Restored `bug`.

**clive** · 2026-10-01

> Reminder to all: Diane intends to attack the flagship research asset on Friday. Please do not move the chair.

**diane** · 2026-10-02

> 09:00. Moved the folding chair six feet to the left. This is the normal Friday test. Please stop describing it as an attack.

**diane** · 2026-10-02

> 09:01. Checked "Folding chair": STILL HERE. Location evidence: none collected.

**bev** · 2026-10-02

> chair-01: present. Six feet to the left.

**petra** · 2026-10-02

> For precision: a displacement of six feet within the office leaves the chair "here" under most operational definitions,¹ so this morning's result is not in itself evidence of the defect. The defect stands on the original steps.
>
> ¹ Voss, "Competitive Landscape: Here, There, and Emerging Elsewhere," §2.

**diane** · 2026-10-02

> Q1 answered: every object gets the chair's certificate, no exceptions. That settles what the product does, not what we sell. Open.

## sh-052 · Positional alignment meeting before Friday

- **Type:** task · **Priority:** P2 · **Status:** closed
- **Labels:** `record` `research` `meeting` `vandalway`
- **Opened by:** diane · **Assignee:** petra · **Opened:** 2026-09-28
- **Closed:** 2026-10-01 — Canceled by the organizer; paper in lieu of attendance.

Malcolm wants movement on the roadmap by Friday (sh-020). Before anyone promises anything, Research, QA and Clive should agree what "expanded coverage" could honestly mean. One hour, this week.

**Comments**

**petra** · 2026-09-28

> Scheduled: Thursday 09:00.

**adrian** · 2026-09-28

> Calendar: Adrian Vale accepted "Positional alignment meeting".

**petra** · 2026-09-29

> Moved to Thursday 13:00.

**petra** · 2026-09-30

> Moved to Friday 10:00.

**petra** · 2026-10-01

> Moved to Friday 14:00.

**petra** · 2026-10-01

> Canceled. The temporal coordinates remain provisional. Please review the attached paper in lieu of attendance: "Competitive Landscape: Here, There, and Emerging Elsewhere" (abstract attached; the full report, 86 pp., to follow).
>
> Abstract: Here remains the company's strongest position. There possesses an apparent advantage in destinations but insufficient evidence of local presence. Somewhere benefits from ambiguity and a concerning lack of oversight. WHERE-r-YOU demonstrates strong technological alignment with STILL HERE; interviews were conducted with the same developer twice to broaden the evidence base.
>
> Recommendation: commission a follow-up investigation into whether "nearby" is a market segment or an admission.

**jules** · 2026-10-01

> I can confirm both interviews.

**diane** · 2026-10-01

> Closing. The meeting isn't happening.

## sh-053 · Third-floor presence event

- **Type:** bug · **Priority:** P1 · **Status:** closed
- **Labels:** `record` `incident` `third-floor` `facilities` `status-page`
- **Opened by:** martin · **Assignee:** graham · **Opened:** 2026-09-29
- **Closed:** 2026-09-29 — Floor reoccupied 13:20; microwave test complete.

Observed: Staff have left the third floor. The product continues to confirm their presence. Graham remains available near the microwave.

Customer impact: None reported. Internal impact: Several reported, loudly.

Mitigation: Open windows. Do not ask Graham what tomorrow's lunch is.

Preceded by a facilities notice at 11:44 (Graham): "Microwave is working again. Testing with salmon. Please do not unplug equipment during a test."

**Comments**

**martin** · 2026-09-29

> 12:10. Public status posted: "All systems operational. We are investigating reports of an unexpected concentration of elsewhere on floor three."

**graham** · 2026-09-29

> Test complete. Microwave heats evenly. Salmon was the right test: if it handles salmon it handles anything. Windows can close at 13:00.

**graham** · 2026-09-29

> Nobody asked, but tomorrow is fish again.

**clive** · 2026-09-29

> For the portfolio pack: a voluntary relocation drill, executed without incident.

**bev** · 2026-09-29

> It was salmon.

**martin** · 2026-09-29

> Floor count at 11:50: zero (sh-014). Staff returned by 13:20. Closing.

## sh-054 · Unable to establish lunch status

- **Type:** task · **Priority:** P2 · **Status:** open
- **Labels:** `record` `staff` `inventory` `lunch`
- **Opened by:** martin · **Assignee:** martin · **Opened:** 2026-09-30
- **Record ID:** ISSUE-002

Lucas remains `unknown`. Receipt evidence suggests employment, but does not establish employment here. Please do not resolve this ticket solely because he answered an email.

**Comments**

**bev** · 2026-09-30

> Inventory row lucas: unknown. Last seen here 2026-09-08, 11:20, leaving on the lunch run. I'm not changing the row on receipts.

**susan** · 2026-09-30

> Receipts establish purchases. They do not establish presence. See sh-048.

**clive** · 2026-10-01

> Lucas is exploring a more distributed model of presence.

**martin** · 2026-10-01

> He has answered another email. It said "all good here!!" and did not say where here is. Leaving open.

## sh-055 · The site says Adrian Vale is still here

- **Type:** bug · **Priority:** P3 · **Status:** closed
- **Labels:** `record` `certificate` `org-chart`
- **Opened by:** bev · **Assignee:** jules · **Opened:** 2026-09-30
- **Closed:** 2026-10-02 — Duplicate of sh-051.

Steps: Typed "Adrian Vale". Pressed Check.

Result: STILL HERE.

He is not. He quit at the 2022 holiday party. See sh-007.

**Comments**

**jules** · 2026-09-30

> Behaving as specified (sh-013). The check doesn't consult anything, so "Adrian Vale" gets the same result as "Folding chair". The certificate is about the form, not about Adrian.

**bev** · 2026-09-30

> Then the certificate is wrong about Adrian.

**diane** · 2026-10-02

> Duplicate of sh-051. Same defect, different absence.

## Changelog

- 2026-10-03 — Tracker history written out in full for the repository: 55 issues, 2014 to the week of the chair test. (Diane, 2026-10-03)
