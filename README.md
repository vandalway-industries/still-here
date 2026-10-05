---
updated: 2026-10-05
read_by: anyone meeting this repository cold (a fresh clone, the organization page); AGENTS.md points here for what the product is
relations: {}
---

# STILL HERE™

STILL HERE™ is Vandalway Industries' presence-certification platform. Enter an object, initiate
verification, and receive documented reassurance that it remains here. Going nowhere. With
confidence.

On isitstillhere.com you name an object (a folding chair, a memorial bench, anything) and press
**Check presence**. A short verification sequence runs, the result reads STILL HERE., and you can
download a certificate with the object's name, the moment, your time zone and a certificate
identifier, or keep it in Your Presence Portfolio on your device.

What the software does, exactly: the check is a constant. Every object receives the same
certificate. Nothing is inspected or located, and the object's name never leaves your browser; the
certificate confirms successful completion of the form, and the identifier is a checksum calculated
in your browser. The Terms of
Presence say so, and so does every certificate.

This repository holds the STILL HERE website, Vandalway Industries' own website (vandalwayind.com),
and the company's records.

## Run it

You need Node 24 and npm.

```bash
npm ci              # install exactly what package-lock.json lists
npm run build       # build the website into site/
npm run serve       # build, then serve site/ at http://127.0.0.1:5320
```

The site is static HTML, CSS and JavaScript. Everything the check and the certificate need runs in
the visitor's browser; there is no application server and no database.

## Test it

```bash
npm test            # the unit tests (Node runs the .test.ts files directly)
npx playwright install chromium webkit firefox   # once, for the browser specs
npm run e2e         # the browser specs, in Chromium, WebKit and Firefox
```

The browser specs build the site and serve it themselves. The records have their own checks, which
also run on every push (`.github/workflows/records.yml`):

```bash
node scripts/continuity-check.mjs --list all company site
node scripts/identifier-check.mjs
```

## Where everything is

| Path | What it is |
|---|---|
| [`src/`](src/) | The website's source: page templates, each page's copy in [`src/content/`](src/content/), styles, scripts, fonts and images. |
| `site/` | The built website, written by `npm run build`. Not kept in the repository. |
| [`vandalwayind/`](vandalwayind/) | Vandalway Industries' page, vandalwayind.com, as built in 1997. |
| [`company/`](company/README.md) | The company's records: the issue tracker, correspondence, chat, the calendar, notes, status records, certificates, staff, inventory, the gum graph, research. |
| [`PRD.md`](PRD.md) | What STILL HERE does and why. |
| [`PLAN.md`](PLAN.md) | How it is being built, phase by phase. |
| [`DESIGN.md`](DESIGN.md) | How it looks: tokens, type, components. |
| [`garage/`](garage/) | The product team's working documents: the shaping history and the build pack. |
| `deploy/` | The server scripts for vandalwayind.com, each with its undo script; added when vandalwayind.com is deployed. |
| [`tests/`](tests/) | The unit tests and their fixtures. |
| [`e2e/`](e2e/) | The browser specs and the walks a person plays. |
| [`scripts/`](scripts/) | The build, the local server and the checks. |
| [`assets/`](assets/) | Brand and photography originals. |
| [`docs/`](docs/) | The work-item map, the checkpoint packets and the dependency licences. |
| [`SESSION_STATUS.md`](SESSION_STATUS.md) | Where the build stands right now. |
| [`AGENTS.md`](AGENTS.md) | The team's working rules for this repository. |

## Licences

- **The code.** The repository root carries no licence of its own: Vandalway Industries reserves
  all rights in its code. Vendored tools and fonts keep their own licences (`tools/okf/LICENSE` and
  the OFL texts in `src/fonts/`), listed in [`docs/licences.md`](docs/licences.md).
- **The fonts.** Inter, Inter Tight, JetBrains Mono and Cormorant Garamond are under the SIL Open
  Font License 1.1 (OFL-1.1); each face's licence text sits beside it in `src/fonts/`. The two
  signature faces used to draw the certificate signatures are OFL-1.1 too.
- **Everything npm installs** is listed with its licence in [`docs/licences.md`](docs/licences.md).

## Changelog

- 2026-10-03 — Written at promote. (Jules, 2026-10-03)
- 2026-10-05 — Rewritten for readers: what STILL HERE does, how to run and test it, the map, the licences. (Jules, 2026-10-05)
- 2026-10-05 — The test commands are `npm test` and `npm run e2e`; each page's copy lives in `src/content/`. (Jules, 2026-10-05)
- 2026-10-05 — The code's licence says what the root carries and what vendored tools and fonts keep; the company map names every record set. (Jules, 2026-10-05)
