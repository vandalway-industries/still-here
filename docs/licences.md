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

## Tools run by hand (not installed by npm)

| Tool | Version | Licence | Where |
|---|---|---|---|
| fontTools (Python) | 4.61.1 | MIT | `scripts/fonts.py` instances the faces; run through `uv run --no-project --with fonttools==4.61.1 --with brotli==1.1.0` |
| Brotli (Python) | 1.1.0 | MIT | WOFF2 compression for `scripts/fonts.py` |

## Changelog

- 2026-10-04 — Written at G1 with the first lockfile. (Jules, 2026-10-04)
- 2026-10-04 — DS1: the four font families and the two tools that cut them. (Jules, 2026-10-04)
