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

## Changelog

- 2026-10-04 — Written at G1 with the first lockfile. (Jules, 2026-10-04)
