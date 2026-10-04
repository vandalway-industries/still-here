---
updated: 2026-10-03
read_by: the handoff author (stage 8) and the build-readiness auditor (stage 9); the PLAN gate
relations:
  derived_from: garage/BRAINSTORM.md
---

# R2 — Certificate export in the browser: one SVG, a PDF and a PNG, matching type

> Research item R2. The author's answer to Q3 fixes the shape: the certificate is "drawn once as a
> single vector certificate in the visitor's browser and exported to each, so the two can never
> differ." This file names the libraries that can do that, their licences and release dates, and
> what is and is not known about mobile Safari. (Petra, 2026-10-03)

## The shape, in one paragraph

One SVG certificate is built in the page. **PDF:** the same SVG element is converted to PDF
vector drawing commands, with the certificate's TrueType font registered with the PDF library so
it is embedded in the file. **PNG:** the same SVG is serialized with its font inlined as a base64
`@font-face`, loaded into an `Image`, drawn onto a `<canvas>`, and saved with `canvas.toBlob`.
Nothing leaves the visitor's device; no server is involved (consistent with the platform note in
`## Organized`).

A qualification on "can never differ":¹ the two files share one *source*, so their *content*
cannot differ. Their *pixels* are a separate matter. The PNG is rasterized by whichever browser the
visitor uses, and in the trial below Chromium and WebKit produced different pixel hashes for the same
SVG. Nobody would see the difference; it is still a difference. If byte-identical PNGs on every
browser are ever required, see the resvg alternative under PNG.

¹ I raise it because "never" is the kind of word Diane underlines.

## Libraries (versions and dates from the npm registry, fetched 2026-10-03 [1])

### PDF

| Library | Latest | Released | Licence | Role | Assessment |
|---|---|---|---|---|---|
| **jsPDF** | 4.2.1 | 2026-03-17 | MIT | PDF document, fonts | Active. Custom fonts are **TrueType only**, added with `addFileToVFS` → `addFont` → `setFont` [2]. |
| **svg2pdf.js** | 2.8.1 | 2026-08-31 | MIT | Draws an SVG element into a jsPDF document as vectors | Active. Its README: it "supports only a limited part of the SVG specification" and is "intended to convert carefully curated SVG images" [3]. Fonts must be added to jsPDF before conversion [3]. |
| @cantoo/pdf-lib | 2.11.1 | 2026-09-15 | MIT | Fork of pdf-lib adding `drawSvg`/`embedSvg` | Active, but its maintainers say they maintain it "for our own product needs and cannot guarantee support" outside their roadmap [4]. |
| pdf-lib (upstream) | 1.17.1 | 2021-11-06 | MIT | PDF creation | No release in nearly five years. Draws SVG *paths* only, not whole SVG documents. |
| PDFKit | 0.20.2 | 2026-08-30 | MIT | PDF creation | Active. |
| SVG-to-PDFKit | 0.1.8 | 2019-11-24 | MIT | SVG into PDFKit | No release since 2019. |

### PNG

| Route | Latest | Released | Licence | Assessment |
|---|---|---|---|---|
| **Native: SVG → `Image` → `<canvas>` → `toBlob`** | — | — | — | No library. Uses the browser's own SVG renderer. Fonts must be inlined in the SVG, because an SVG loaded as an image does not fetch external resources. |
| @resvg/resvg-wasm | 2.6.2 | 2024-03-26 | MPL-2.0 | Renders SVG to PNG in WebAssembly, independent of the browser, so output is the same on every browser. **Fonts must be passed in** (`fontBuffers`); system fonts are not available in the WASM build [5]. No release in about 2.5 years. Download size not measured (unverified). |
| canvg | 4.0.3 | 2025-03-12 | MIT | Re-implements SVG drawing on canvas in JavaScript. An option if the native route fails somewhere. |

## A trial run (2026-10-03), and what it does and does not prove

I ran the recommended pipeline in two headless browsers via Playwright: **Chromium 153** and
**Playwright's WebKit 26.6** (a Linux build of the WebKit engine, *not* Safari on iOS). Font: an
OFL-licensed serif TTF, registered under a family name not installed on the machine, so a missing
font would visibly fall back.

| Check | Chromium 153 | WebKit 26.6 (Linux) |
|---|---|---|
| PNG, first draw on `onload`, font applied (ink pixels vs. no-font fallback) | yes (8,569 vs 4,186) | yes (8,583 vs 4,835) |
| Same result on second draw, and after `img.decode()` + 300 ms | identical | identical |
| PDF via jsPDF 4.2.1 + svg2pdf.js 2.8.1 contains an embedded TrueType font (`/FontFile2`) under the registered name | yes | yes |
| PDF size with a 357 KB TTF | 80,990 bytes | 80,990 bytes |

Cross-browser PNG pixel hashes differed, as noted above. The size drop from 357 KB of font to 81 KB
of PDF suggests subsetting or compression; I did not determine which.

**What this proves:** the pipeline works and embeds the font in current Chromium and in the WebKit
engine. **What it does not prove:** behaviour on an iPhone. The iOS item stays **unverified** until
someone runs it on a device.

## Mobile Safari: the known hazards

1. **Embedded fonts in an SVG image, first draw.** WebKit bug 219770, "SVG with embedded font
   triggers img.onload before font is available," was filed 2020-12-11 and is still **NEW**. Its
   most recent comment (2026-08-11) reports the test case now renders correctly in Safari 26.5.2 [6].
   The fix is not formally recorded. The safe pattern costs little: await `img.decode()`, load the
   same font into the page with `document.fonts.load()` before exporting, and verify the canvas
   (or draw twice). A similar first-capture blank has been reported against Chromium in another
   library [7]. It did not reproduce in the trial above.
2. **Canvas size.** iOS Safari refuses canvases over 16,777,216 pixels in area (width × height)
   [8], and separately caps *total* canvas memory (an Apple developer forum thread reports 224 MB on
   iOS 12) [9]. A US-letter certificate at 300 dpi is 3,300 × 2,550 = 8,415,000 px, which is under
   the cap. Release each canvas after export (set width and height to 0) so memory is returned.
3. **Saving the file.** The `download` attribute is supported in iOS Safari from 13.0 [10]. The Web
   Share API with **files** is supported in Safari 14+ (iOS mirrors desktop) and Chrome for Android
   76+, and **not** in Firefox [11]. A "Share" button that hands the PNG to the iOS share sheet is
   possible; what the share sheet then offers ("Save Image", etc.) is iOS behaviour I have not
   verified.
4. **Font format.** jsPDF takes TTF [2]; the page may prefer WOFF2 for loading. Ship both files,
   or ship TTF only. That is a build decision.

## Fonts and licences

Embedding an OFL font in a PDF is permitted "either in full or a subset," and embedding does not
change the document's licence. Serving it as a web font through `@font-face` is likewise allowed
[12]. A commercial font would need its own licence checked for PDF embedding; OFL avoids the
question.

## Recommendation

**PDF: jsPDF 4.2.1 + svg2pdf.js 2.8.1. PNG: the native SVG → canvas route, with resvg-wasm held
in reserve.** All MIT except resvg (MPL-2.0); the two primary libraries both released in 2026.
Trade-offs:

- svg2pdf.js covers a subset of SVG. The certificate must be designed inside that subset (seal,
  guilloche border, signatures), and a build check should render the PDF back (for example with
  pdf.js) and compare it with the PNG, so nobody discovers an unsupported feature by looking.
- The native PNG route is free and small but browser-rasterized, so pixels vary by browser. resvg-wasm
  would make PNGs identical everywhere, at the cost of a WASM download and a library with no release
  since March 2024.
- iOS Safari remains a real-device test item: the font-timing bug status, the share sheet, and the
  download flow.

## Sources

1. npm registry metadata (`https://registry.npmjs.org/<package>`), fetched 2026-10-03, for jspdf, svg2pdf.js, @cantoo/pdf-lib, pdf-lib, pdfkit, svg-to-pdfkit, @resvg/resvg-wasm, canvg.
2. jsPDF README — https://github.com/parallax/jsPDF
3. svg2pdf.js README — https://github.com/yWorks/svg2pdf.js
4. @cantoo/pdf-lib README — https://github.com/cantoo-scribe/pdf-lib
5. resvg-js README — https://github.com/thx/resvg-js
6. WebKit bug 219770 — https://bugs.webkit.org/show_bug.cgi?id=219770
7. snapdom issue 506 — https://github.com/zumerlab/snapdom/issues/506
8. PQINA, "Canvas Area Exceeds The Maximum Limit" (2022-01-12) — https://pqina.nl/blog/canvas-area-exceeds-the-maximum-limit/
9. Apple Developer Forums, "Total canvas memory use exceeds the maximum limit (224 MB)" — https://developer.apple.com/forums/thread/112218
10. caniuse data, `download.json` — https://raw.githubusercontent.com/Fyrd/caniuse/main/features-json/download.json
11. MDN browser-compat-data, `api/Navigator.json` (`share` / `canShare`, `data_files_parameter`) — https://raw.githubusercontent.com/mdn/browser-compat-data/main/api/Navigator.json
12. SIL Open Font License FAQ — https://openfontlicense.org/ofl-faq/

## Changelog

- 2026-10-03 — Written: libraries compared from registry data; pipeline trial in Chromium 153 and WebKit 26.6; iOS device behaviour left marked unverified. (Petra, 2026-10-03)
