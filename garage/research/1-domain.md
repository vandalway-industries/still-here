---
updated: 2026-10-03
read_by: the handoff author (stage 8) and the build-readiness auditor (stage 9); the PLAN gate
relations:
  derived_from: garage/BRAINSTORM.md
---

# R1 — Domain: candidate names, their availability, and where Vandalway's page lives

> Research item R1 from `BRAINSTORM.md ## Questions ### For research`. Nothing was purchased,
> registered, reserved, or "added to cart." Every lookup below is a read-only registry query (RDAP
> or port-43 WHOIS), a DNS query, or a plain HTTP request to a page anyone can see. (Petra, 2026-10-03)

## Method, and what a lookup can and cannot establish

Lookups were made on 2026-10-03 (finished 10:52 UTC). For each TLD I asked the registry the IANA
RDAP bootstrap file names [1]; for `.co`, `.io` and `.us`, which the bootstrap does not list, I used
the WHOIS server IANA names for that TLD (`whois.registry.co`, `whois.nic.io`, `whois.nic.us`).
Unregistered names were cross-checked with `dig` for NS and A records; every one returned none.

A distinction I must insist on:¹ a registry answering **404 / "not found"** means *no registration
exists in the registry database at this moment*. It does **not** establish that the name can be
bought at the ordinary price. A registry may hold names as reserved or price them as premium, and
neither state is visible in RDAP. The .US registry says so itself in its WHOIS footer: "FAILURE TO
LOCATE A RECORD IN THE WHOIS DATABASE IS NOT INDICATIVE OF THE AVAILABILITY OF A DOMAIN NAME."
Price and true availability are confirmed only at a registrar's checkout, which this item was
forbidden to touch. **Prices: unverified for every name below.**

¹ Diane will want it noted that "available" appears below only in the form "not registered at the
registry, 2026-10-03."

## Candidates, in the company's voice

Ordered as I would present them to the room. "Not registered" = registry 404 plus no DNS.

| # | Candidate | Registry result (2026-10-03) | Notes |
|---|---|---|---|
| 1 | `stillherecertified.com` | Not registered | The product's noun is the certificate. 22 characters before the dot. |
| 2 | `stillhere.industries` | Not registered | Echoes "Vandalway Industries." Short. `.industries` is an Identity Digital TLD [1]. |
| 3 | `stillhereverified.com` | Not registered | Uses the ritual's verb. Note: the certificate itself admits nothing was inspected; "verified" in the address is Clive's register, not Diane's. |
| 4 | `isitstillhere.com` | Not registered | Reads as the visitor's question. Less corporate. |
| 5 | `checkstillhere.com` | Not registered | Matches the button, **Check presence**. |
| 6 | `stillhereinc.com` | Not registered | Conventional company form. (Whether STILL HERE is incorporated, and as what, is not established anywhere in our records.) |
| 7 | `stillhere.inc` | Not registered | `.inc` is a CentralNic-operated TLD [1]; its price is unverified and should be checked before anyone becomes attached to it. |
| 8 | `stillhere.company` | Not registered | `.company` is an Identity Digital TLD [1]. |
| 9 | `presencecertified.com` | Not registered | The category, not the brand. Useful as a redirect, weaker as the home. |
| 10 | `stillhereofficial.com` | Not registered | "Official" is in the brief's spirit ("unnecessarily official"). |
| 11 | `thestillhere.com` | Not registered | The fallback form most companies use when the bare `.com` is taken. |
| 12 | `certifiedstillhere.com` | Not registered | Inverse of #1; reads less naturally aloud. |

Also not registered: `stillhere-inc.com`. Hyphenated names are listed for completeness, not
recommended; a hyphen is the first thing a visitor drops when typing from memory (judgment, not a
measured claim).

### The names we cannot have, and why each is closed

| Name | Registered | Expires | Registrar | What it serves (HTTP, 2026-10-03) |
|---|---|---|---|---|
| `stillhere.com` | 1999-04-15 | 2028-04-15 | joker.com | A page reading "StillHere.com — I'm not for sale." |
| `stillhere.net` | 2025-02-04 | 2027-02-04 | Spaceship | Responds; no title. |
| `stillhere.org` | 1999-11-04 | 2026-11-04 | NameCheap | — |
| `stillhere.app` | 2020-02-29 | 2027-02-28 | 1API | No HTTP answer. |
| `stillhere.page` | 2025-12-16 | 2027-12-16 | Squarespace Domains | Status includes `client hold` (does not resolve [2]). |
| `stillhere.info` | 2025-03-30 | 2027-03-30 | NameCheap | — |
| `stillhere.biz` | 2025-09-04 | 2026-09-04 | NameCheap | Status `auto renew period` (see below). |
| `stillhere.site` | 2025-04-20 | 2027-04-20 | Hostinger | — |
| `stillhere.online` | 2026-02-11 | 2027-02-11 | GoDaddy | — |
| `stillhere.co` | 2023-06-15 | 2027-06-15 | GoDaddy | — |
| `stillhere.io` | 2018-02-15 | 2027-02-15 | OVH | — |
| `stillhere.us` | 2009-12-27 | 2026-12-26 | No-IP | — |
| `getstillhere.com` | 2026-01-27 | 2027-01-27 | Cloudflare | — |
| `stillherehq.com`, `stillhereco.com` | registered | — | — | Not examined further. |

On `stillhere.biz`: its registration expired 2026-09-04 and the registry auto-renewed it into the
grace period [2]. If the holder does not pay, ICANN's published sequence is a 30-day redemption
period followed by five days before purge [2]. Whether that happens is the holder's business, and I
do not recommend planning around a name someone else might renew. Recorded because it is exact.

On `.app` and `.page`: both TLDs are on the browsers' HSTS preload list (hstspreload.org reports
`"status": "preloaded"` for `app` and `page` [3]), so they work only over HTTPS. GitHub Pages
provides HTTPS (see R3), so this would not have been an obstacle; both names are taken regardless.

## Recommendation

**`stillherecertified.com`**, with `stillhere.industries` as the alternative if the room prefers
the shorter, more knowing name. Trade-offs, honestly:

- `.com` is the ordinary choice and asks nothing of the visitor. The name is long (22 characters).
- `stillhere.industries` is short and on-theme, and the TLD is one visitors will not have seen
  much. I found no data on whether visitors trust newer TLDs less; I am not inventing any.
- Both prices are unverified. Whoever registers should also consider registering the other as a
  redirect; that is a cost, not a requirement.
- The bare `stillhere.com` has been held since 1999 by someone whose home page says, in full, that
  it is not for sale. I accept this as a statement of presence and would not pursue it.

## Vandalway's 1990s page: its own domain, or a path on ours?

**First, a finding that affects the footer link.** `vandalway.com` is registered (2018-07-23,
GoDaddy, expires 2028-07-23, several `client … prohibited` locks) and on 2026-10-03 it served a
fashion and brand blog titled "Your influencer's influencer." It is **not ours**. A footer reading
"A Vandalway Industries company" must not link to `vandalway.com`, or it sends our visitors to an
unrelated party. (Clive spells the name with a **w**; so does that party.)

Names that are **not registered** (registry 404, 2026-10-03): `vandalwayindustries.com`,
`vandalway-industries.com`, `vandalwayinc.com`, `vandalwayind.com`, `vandalway.net`,
`vandalway.org`, `vandalway.biz`, `vandalway.industries`, `vandalway.co`.

### What the period itself says

R6 examined Yahoo!'s 1996 directory category *Business and Economy › Companies › Food › Condiments
› Jams and Jellies* (archived 1996-10-19 [4]), which lists sixteen businesses. Counting the link
each one gave Yahoo!:

- **13 of 16** lived as a **path on somebody else's server**: a web designer's domain, an internet
  provider's, or an online "mall" (`/farmgifts/fontana1.html`, `/joys/index.html`, `/mmjj/mmjj.html`
  and so on).
- **2 of 16** had their own domain at the root (one of them a national brand).
- **1** sat in a tilde directory (`/~name/`) on its own organization's domain (a monastery's).
  One of the thirteen also used a tilde directory, on a provider's server.

So a small company's page living at a path, rather than at its own `.com`, is not a compromise. In
1996 it was the usual arrangement. (Sample of one category, one date; I do not generalize it to
"the web" and neither should the reader.)

### The two branches, both kept

**A. A path on our domain** (for example `/vandalway/`, or `/vandalway/index.htm` if R6's
period file naming is wanted, or a tilde path such as `/~vandalway/`).
- One repository, one deploy, one certificate, nothing more to register or renew.
- Period-accurate, per the count above.
- Diegetic cost: the parent's page appears under the subsidiary's domain. Whether that is a joke
  or a continuity problem is for the author to decide; I note it and do not decide it.

**B. Its own domain** (`vandalwayindustries.com` was not registered on 2026-10-03; price unverified).
- Reads as Vandalway's own site.
- Costs a second registration and renewal, second DNS, and a second GitHub Pages site. GitHub
  documents that a repository can carry its own custom domain, overriding an account-level one [5],
  so it is feasible; it is more to maintain.
- A third route exists: if STILL HERE were published as the account's user or organization site,
  GitHub serves the account's other repositories as paths under that domain by default (their
  example: `www.octocat.com/octo-project` [5]). That gives a separate repository at a path, but it
  constrains how the main site is published, so it is noted, not recommended.

**Recommendation: A, a path on our domain**, because the period sample favours it and it
adds nothing to maintain. Branch B stays open for the author.

## Sources

1. IANA RDAP bootstrap for DNS — https://data.iana.org/rdap/dns.json (fetched 2026-10-03); registry RDAP endpoints used: `rdap.verisign.com/com/v1/`, `rdap.verisign.com/net/v1/`, `rdap.publicinterestregistry.org/rdap/`, `pubapi.registry.google/rdap/`, `rdap.identitydigital.services/rdap/`, `rdap.centralnic.com/inc/`, `rdap.nic.biz/`, `rdap.radix.host/rdap/`; WHOIS servers per `whois.iana.org`.
2. ICANN, EPP Status Codes — https://www.icann.org/resources/pages/epp-status-codes-2014-06-16-en
3. HSTS Preload List status API — https://hstspreload.org/api/v2/status?domain=app and `?domain=page`
4. Yahoo! directory, Jams and Jellies, archived 1996-10-19 — https://web.archive.org/web/19961019072511/http://www2.yahoo.com:80/Business_and_Economy/Companies/Food/Condiments/Jams_and_Jellies/
5. GitHub Docs, About custom domains and GitHub Pages — https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages

## Changelog

- 2026-10-03 — Written: 12 candidates and 15 closed names checked read-only; `vandalway.com` found held by an unrelated party; path recommended for Vandalway's page. (Petra, 2026-10-03)
