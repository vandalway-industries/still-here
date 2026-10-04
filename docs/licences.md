---
updated: 2026-10-04
read_by: anyone adding or upgrading a dependency; the G1 test (every package in `package-lock.json` must have a row here)
relations:
  derived_from: ../package-lock.json
---

# Licences

Every package `npm ci` installs from `package-lock.json`, with the licence its package metadata
declares. All are development dependencies: nothing here is shipped to a visitor's browser
except what a later phase copies into `site/` on purpose, and that copy is listed again when it
happens. Optional packages are platform builds npm installs only on the matching machine.
(Jules, 2026-10-04)

| Package | Version | Licence | Why we have it |
|---|---|---|---|
| `@playwright/test` | 1.59.1 | Apache-2.0 | Browser specs in Chromium, WebKit and Firefox |
| `playwright` | 1.59.1 | Apache-2.0 | Installed by `@playwright/test` |
| `playwright-core` | 1.59.1 | Apache-2.0 | Installed by `playwright` |
| `fsevents` | 2.3.2 | MIT | Optional, macOS only; installed by `playwright` |
| `pdfjs-dist` | 6.4.299 | Apache-2.0 | Renders exported certificate PDFs for the walk substitute `openDownload()` |
| `@napi-rs/canvas` | 1.0.10 | MIT | Optional; installed by `pdfjs-dist` |
| `@napi-rs/canvas-android-arm64` | 1.0.10 | MIT | Optional platform build of `@napi-rs/canvas` |
| `@napi-rs/canvas-darwin-arm64` | 1.0.10 | MIT | Optional platform build of `@napi-rs/canvas` |
| `@napi-rs/canvas-darwin-x64` | 1.0.10 | MIT | Optional platform build of `@napi-rs/canvas` |
| `@napi-rs/canvas-linux-arm-gnueabihf` | 1.0.10 | MIT | Optional platform build of `@napi-rs/canvas` |
| `@napi-rs/canvas-linux-arm64-gnu` | 1.0.10 | MIT | Optional platform build of `@napi-rs/canvas` |
| `@napi-rs/canvas-linux-arm64-musl` | 1.0.10 | MIT | Optional platform build of `@napi-rs/canvas` |
| `@napi-rs/canvas-linux-riscv64-gnu` | 1.0.10 | MIT | Optional platform build of `@napi-rs/canvas` |
| `@napi-rs/canvas-linux-x64-gnu` | 1.0.10 | MIT | Optional platform build of `@napi-rs/canvas` |
| `@napi-rs/canvas-linux-x64-musl` | 1.0.10 | MIT | Optional platform build of `@napi-rs/canvas` |
| `@napi-rs/canvas-win32-arm64-msvc` | 1.0.10 | MIT | Optional platform build of `@napi-rs/canvas` |
| `@napi-rs/canvas-win32-x64-msvc` | 1.0.10 | MIT | Optional platform build of `@napi-rs/canvas` |
| `jsqr` | 1.4.0 | Apache-2.0 | Decodes certificate QR codes for the walk substitute `decodeQr()` |
| `@babel/runtime` | 7.29.7 | MIT | Installed by `jspdf` |
| `@types/pako` | 2.0.4 | MIT | Installed by `fast-png` |
| `@types/raf` | 3.4.3 | MIT | Optional; comes with `jspdf`'s optional `canvg` and `html2canvas` (not used) |
| `@types/trusted-types` | 2.0.7 | MIT | Optional; comes with `jspdf`'s optional `canvg` and `html2canvas` (not used) |
| `base64-arraybuffer` | 1.0.2 | MIT | Optional; comes with `jspdf`'s optional `canvg` and `html2canvas` (not used) |
| `canvg` | 3.0.11 | MIT | Optional; comes with `jspdf`'s optional `canvg` and `html2canvas` (not used) |
| `core-js` | 3.50.0 | MIT | Optional; comes with `jspdf`'s optional `canvg` and `html2canvas` (not used) |
| `css-line-break` | 2.1.0 | MIT | Optional; comes with `jspdf`'s optional `canvg` and `html2canvas` (not used) |
| `cssesc` | 3.0.0 | MIT | Installed by `svg2pdf.js` |
| `dompurify` | 3.4.16 | (MPL-2.0 OR Apache-2.0) | Optional; comes with `jspdf`'s optional `canvg` and `html2canvas` (not used) |
| `fast-png` | 6.4.0 | MIT | Installed by `jspdf` |
| `fflate` | 0.8.3 | MIT | Installed by `jspdf` |
| `font-family-papandreou` | 0.2.0-patch2 | MIT | Installed by `svg2pdf.js` |
| `html2canvas` | 1.4.1 | MIT | Optional; comes with `jspdf`'s optional `canvg` and `html2canvas` (not used) |
| `iobuffer` | 5.4.0 | MIT | Installed by `fast-png` |
| `jspdf` | 4.2.1 | MIT | Writes the certificate PDF (PRD R14); the DS4 candidate PDF is made with it |
| `pako` | 2.2.0 | (MIT AND Zlib) | Installed by `fast-png` |
| `performance-now` | 2.1.0 | MIT | Optional; comes with `jspdf`'s optional `canvg` and `html2canvas` (not used) |
| `raf` | 3.4.1 | MIT | Optional; comes with `jspdf`'s optional `canvg` and `html2canvas` (not used) |
| `regenerator-runtime` | 0.13.11 | MIT | Optional; comes with `jspdf`'s optional `canvg` and `html2canvas` (not used) |
| `rgbcolor` | 1.0.1 | MIT OR SEE LICENSE IN FEEL-FREE.md | Optional; comes with `jspdf`'s optional `canvg` and `html2canvas` (not used) |
| `specificity` | 0.4.1 | MIT | Installed by `svg2pdf.js` |
| `stackblur-canvas` | 2.7.0 | MIT | Optional; comes with `jspdf`'s optional `canvg` and `html2canvas` (not used) |
| `svg-pathdata` | 6.0.3 | MIT | Optional; comes with `jspdf`'s optional `canvg` and `html2canvas` (not used) |
| `svg2pdf.js` | 2.8.1 | MIT | Draws the certificate SVG into jsPDF (PRD R9, R14) |
| `svgpath` | 2.6.0 | MIT | Installed by `svg2pdf.js` |
| `text-segmentation` | 1.0.3 | MIT | Optional; comes with `jspdf`'s optional `canvg` and `html2canvas` (not used) |
| `utrie` | 1.0.2 | MIT | Optional; comes with `jspdf`'s optional `canvg` and `html2canvas` (not used) |

## Vendored tools

| Tool | Version | Licence | Where |
|---|---|---|---|
| OKF validator (`okf_validate.py`) | OKF toolkit 0.3.3 | MIT (`tools/okf/LICENSE`) | `tools/okf/`; checks the gum graph bundle. Needs PyYAML. |

## Fonts shipped with the site

Static instances cut by `scripts/fonts.py` from the Google Fonts repository's `ofl/` folders at
commit `9710da1e`, each download checked against its SHA-256. Each family's licence sits beside
its files in `src/fonts/` and is copied into `site/fonts/` with them.

| Font | Faces | Licence | Where |
|---|---|---|---|
| Inter | 400 | OFL-1.1 (`src/fonts/Inter-OFL.txt`) | Body and interface text |
| Inter Tight | 600, 700 | OFL-1.1 (`src/fonts/InterTight-OFL.txt`) | Headlines, the wordmark |
| JetBrains Mono | 500 | OFL-1.1 (`src/fonts/JetBrainsMono-OFL.txt`) | Labels, verification lines, identifiers |
| Cormorant Garamond | 500, 600 | OFL-1.1 (`src/fonts/CormorantGaramond-OFL.txt`) | The certificate |

## Fonts kept for the build, never shipped

The two signatures on the certificate are converted to paths by `scripts/certificate-glyphs.mjs`
from these faces, taken from the same Google Fonts commit `9710da1e`. Neither face is copied into
`src/` or `site/`; the browser never loads a script font.

| Font | Licence | Where | SHA-256 |
|---|---|---|---|
| WindSong Regular | OFL-1.1 (`scripts/signature-faces/WindSong-OFL.txt`) | Clive Standish's signature | `44bea4f8cdb818e9df6eef5334c63915acb7f1877b239debb373277d16b0aac2` |
| Petemoss Regular | OFL-1.1 (`scripts/signature-faces/Petemoss-OFL.txt`) | Diane's signature | `c15315bba38c1b4fdcc6aadda5bb7aecb9d341121bbc0ea2e23f05bf6fb614c4` |

## Tools run by hand (not installed by npm)

| Tool | Version | Licence | Where |
|---|---|---|---|
| fontTools (Python) | 4.61.1 | MIT | `scripts/fonts.py` instances the faces; run through `uv run --no-project --with fonttools==4.61.1 --with brotli==1.1.0` |
| Brotli (Python) | 1.1.0 | MIT | WOFF2 compression for `scripts/fonts.py` |
| uharfbuzz (Python) | 0.51.1 | Apache-2.0 | Shapes the two signatures for `scripts/certificate-glyphs.mjs`, run with fontTools through `uv run --no-project --with fonttools==4.61.1 --with uharfbuzz==0.51.1` |

## Changelog

- 2026-10-04 — Written at G1 with the first lockfile. (Jules, 2026-10-04)
- 2026-10-04 — DS1: the four font families and the two tools that cut them. (Jules, 2026-10-04)
- 2026-10-04 — DS4: jsPDF and svg2pdf.js with what they install; the two signature faces and uharfbuzz. (Jules, 2026-10-04)
