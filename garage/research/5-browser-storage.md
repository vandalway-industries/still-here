---
updated: 2026-10-03
read_by: the handoff author (stage 8) and the build-readiness auditor (stage 9); the PLAN gate
relations:
  derived_from: garage/BRAINSTORM.md
---

# R5 — How long a browser keeps the Presence Portfolio

> Research item R5. Q6 fixes the feature: the visitor's browser keeps a list of their past
> certificates ("Your Presence Portfolio"), each re-downloadable; we never receive it; "Clearing
> browser data clears the portfolio." The brief reported, unverified, that Safari "may clear it
> after a period of no interaction." It does, and the rule is narrower and stranger than "a period."
> This is the item most likely to change the plan, so I have been more precise here than is
> comfortable for anyone. (Petra, 2026-10-03)

## The answer, per browser

| Browser | Deletes a site's `localStorage` because it was not visited? | Other ways it disappears | `navigator.storage.persist()` |
|---|---|---|---|
| **Safari** (macOS, iOS, iPadOS), "Prevent cross-site tracking" on, which is the default | **Yes.** After **7 days of Safari use** with **no user interaction** on the site, all script-writable storage is deleted [1][2][3] | Over-quota LRU eviction [4]; user clearing; Private Browsing ends | Supported since Safari 15.2 [6]. Granted "based on heuristics like whether the website is opened as a Home Screen Web App" [4]. Whether it lifts the 7-day rule is **not documented** |
| **Chrome** (desktop, Android) | **No** time-based deletion for an ordinary site [3] | Storage-pressure LRU eviction of best-effort origins [3]; user clearing; Incognito ends | Supported since 55 [6]. Granted or denied silently by heuristics: engagement, installed or bookmarked, notification permission [5] |
| **Firefox** (desktop) | **No** time-based deletion for an ordinary site [3] | Storage-pressure LRU eviction [3]; user clearing; private window ends | Supported since 57 [6]. **Shows the visitor a permission prompt** [3] |

### Safari, in exact terms

- **What is deleted:** "Indexed DB, LocalStorage, Media keys, SessionStorage, Service Worker
  registrations and cache" [1]. In WebKit's words, ITP "deletes all cookies created in JavaScript
  and all other script-writeable storage after 7 days of no user interaction with the website" [2].
  The portfolio is script-written, so it is covered whichever API stores it. Moving it from
  `localStorage` to IndexedDB changes nothing.
- **"7 days" means seven days *on which Safari was used*,** not seven calendar days [1]. A visitor
  who does not open Safari for a month loses nothing. A visitor who browses daily and does not
  return to us loses the portfolio in about a week.
- **"Interaction" means "user click, tap, or keyboard entry"** [2]. MDN phrases it "no user
  interaction, such as click or tap, in the last seven days of browser use" [3]. Scrolling is not
  listed. The ritual requires pressing **Check presence**, so any visit that includes a check resets
  the counter. A visit that only reads the portfolio may not, unless the visitor clicks something
  (probably true in practice; unverified).
- **The exemption:** "The first-party domain of home screen web applications is exempt from ITP's
  7-day cap on all script-writeable storage" [2]. A visitor who adds STILL HERE to their Home
  Screen keeps the portfolio. That is the only documented exemption.
- **Not only Safari on iOS:** "in iOS 14.0 and macOS Big Sur, Intelligent Tracking Prevention
  (ITP), is enabled by default in all `WKWebView` applications" [7], and outside the EU third-party
  iOS browsers run on WebKit [3]. Whether those browsers apply the same 7-day cap, counted against
  their own days of use, is **unverified**. In the EU (iOS 17.4+), browsers using their own engine
  follow that engine's policy [3].
- **Independent corroboration** that ITP removes first-party data in practice, including
  `localStorage`, exists in a developer's forensic write-up. It documents the separate 30-day rule
  for domains ITP has *classified* as trackers [8]. We do nothing that should get us classified, but
  that is my expectation, not a guarantee.

### Chrome and Firefox: nothing time-based applies to us

- Both evict only under storage pressure (least-recently-used origin first, best-effort origins
  only), or when total browser storage is exceeded [3]. MDN notes Chrome research showing such
  deletion is "very rarely" seen for sites a person visits [3].
- Chrome's **bounce-tracking mitigation** deletes state for sites a navigation *redirected through*,
  after 45 days without interaction, and only when third-party cookies are blocked [9]. Firefox's
  **redirect tracking protection** purges storage only for origins on its tracker list [10]. STILL
  HERE redirects no one and loads no tracker (no analytics, per `## Organized`), so neither should
  apply, provided the site never adds an outbound redirect hop. That is a constraint for the plan.

### Size

Web Storage is limited to 10 MiB per origin on all browsers (commonly 5 MiB `localStorage` + 5 MiB
`sessionStorage`) [3]. A portfolio entry needs only name, timestamp and identifier; the certificate
is redrawn from those (R2, R4). A few hundred bytes per entry means tens of thousands of entries fit.
Size is not the risk.

## Does `navigator.storage.persist()` help?

- **Chrome:** it protects against storage-pressure eviction if granted, and is granted silently by
  heuristics [5]. Real but small: pressure eviction is already rare [3].
- **Firefox:** same protection, but the visitor sees a **permission prompt** [3]. A browser dialog
  asking to "store data in persistent storage" on a certification page is a visible cost.
- **Safari:** this is the case that matters, and WebKit documents only that grants follow
  heuristics "like whether the website is opened as a Home Screen Web App" [4]. **WebKit has not
  documented whether a persistent grant exempts a site from the 7-day ITP deletion.** I found no
  statement either way. In an ordinary Safari tab I expect the request to be denied, but I could not
  test real Safari, so this is **unverified**.

So: `persist()` does not solve the Safari problem as far as anything published shows. Not
documented is not the same as impossible, and a device test could settle it.

## What this means for the plan (options, not choices)

The privacy page's sentence in Q6 is true but incomplete. Accurate wording would add something like:
"Safari may also clear it if you do not use STILL HERE within seven days of browsing." The ways to
make a certificate outlive that, all compatible with "we never receive it":

1. **The downloaded file is the record.** The PDF/PNG (R2) survives everything. The portfolio is a
   convenience.
2. **A certificate link.** Because the certificate is recomputed from name + timestamp (R4), a URL
   that carries them in the **fragment** (`#…`) can redraw it at any time. Browsers do not send the
   fragment to the server [11], so our server logs never see it, which keeps the privacy page's
   promise. A bookmarked link survives ITP; the portfolio does not. **Recommended.**
3. **Export/import the portfolio** as a small file the visitor keeps.
4. **Add to Home Screen** prompt copy for iOS visitors: the documented exemption [2]. It needs a web
   app manifest. Whether that is worth it is a product call.

## Recommendation

**Keep the portfolio in `localStorage` as planned, but treat it as best-effort. Do not call
`persist()` by default. Give every certificate a fragment-based link, and correct the privacy-page
sentence to name Safari's seven-day rule.** Trade-offs:

- Skipping `persist()` gives up modest protection against disk-pressure eviction in Chrome and
  Firefox, and avoids the Firefox prompt. If the room wants it anyway, call it after the visitor's
  first save, never on page load.
- The fragment link puts the object name in a URL the visitor may share. That is the visitor's
  choice, but the legal page should say what is in the link.
- iOS behaviour of `persist()` and the third-party-browser question remain device-test items.

## Sources

1. WebKit blog, "Full Third-Party Cookie Blocking and More" (2020-03-24) — https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/
2. WebKit, "Tracking Prevention in WebKit" — https://webkit.org/tracking-prevention/
3. MDN, "Storage quotas and eviction criteria" (last modified 2026-01-05; source: https://github.com/mdn/content/blob/main/files/en-us/web/api/storage_api/storage_quotas_and_eviction_criteria/index.md) — https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria
4. WebKit blog, "Updates to Storage Policy" (2023-08-10; Safari 17) — https://webkit.org/blog/14403/updates-to-storage-policy/
5. web.dev, "Persistent storage" (updated 2020-05-12) — https://web.dev/articles/persistent-storage
6. MDN browser-compat-data, `api/StorageManager.json` — https://raw.githubusercontent.com/mdn/browser-compat-data/main/api/StorageManager.json
7. WebKit blog, "App-Bound Domains" (2020-06-26) — https://webkit.org/blog/10882/app-bound-domains/
8. Lapcat Software, "Safari Un-Intelligent Tracking Prevention: Data loss by design" (2023-08-05) — https://lapcatsoftware.com/articles/2023/8/5.html
9. Privacy Sandbox, Bounce tracking mitigations — https://privacysandbox.google.com/protections/bounce-tracking-mitigations
10. MDN, Redirect tracking protection — https://developer.mozilla.org/en-US/docs/Web/Privacy/Guides/Redirect_tracking_protection
11. MDN, URI fragment — https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Fragment

## Changelog

- 2026-10-03 — Written: Safari's 7-day script-writable-storage rule confirmed and specified (days of use, click/tap/key, Home Screen exemption); Chrome and Firefox have no time-based rule; `persist()` found not to address Safari as documented; fragment-link certificates recommended. (Petra, 2026-10-03)
