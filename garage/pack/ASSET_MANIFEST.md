---
updated: 2026-10-05
read_by: DS3 (makes every derivative listed here); every Worker before it places an image; the critic (canon vs placeholder; what an image is for); Clive at C2 and C3 (placements); L4 (the metadata rule)
relations: {}
---

# Asset manifest — every file, where it goes, canon or placeholder

Every file in `garage/assets/` plus the parent logo, measured 2026-10-03 (dimensions and sizes
with Pillow; all are PNG, 32 files, 69 MB). At promote they are copied to `assets/` unchanged; the
garage keeps its copies. (Jules, 2026-10-03)

**Rules.**
- **Provenance (D21).** Originals in `assets/` keep their embedded content credentials: 31 of the
  32 carry a C2PA manifest, 30 of which name the software that made them (`s09`'s does not);
  `s07` carries none.
  Web copies are resized, which invalidates the credentials, so web copies carry no metadata at
  all: DS3 writes them without `caBX`, `tEXt`, `iTXt`, `zTXt`, `eXIf` (PNG) or APP1/APP13 (JPEG), and
  L4 checks again before launch.
- **Derivatives** (DS3, committed under `src/images/`): WebP at 1x and 2x of the display width, 2x
  capped at the source width; each file ≤ 250 KB (PRD R54). JPEG only where named. Names:
  `<id>-<width>.webp`.
- **Canon** means the image is final and is the bar for anything drawn to match it. **Placeholder**
  means the slot is real and the image may be replaced at a checkpoint; nothing on disk is a
  placeholder today. **Drawn in code** marks the assets the audit found missing; the loop makes them.
- No image is tinted, overlaid with text, or cropped across a face. Alt text is plain description
  (drafts below; finished at C3).

## The brand

| File | Size | Use | Status | Derivatives |
|---|---|---|---|---|
| `still-here-hero-chair.png` | 1672 × 941 | Home: the chair, cropped to the bracket area (source box 1044,110 → 1656,875, 4:5; the whole callout, none of the heading), right column at 1440, above the heading at 390. Open Graph image for every page. The palette's source (`DESIGN.md`). | canon | crop: 440 and 542 wide; Open Graph: 1200 × 630 JPEG, uncropped scale, ≤ 250 KB |
| `still-here-logo-horizontal.png` | 2172 × 724, RGBA | Reference for the mark redrawn as SVG (DS2) and for the wordmark's weight. Not served. | canon (reference) | none |
| `brand/vandalway-industries-logo.png`, beside the repository (outside it) → `assets/brand/` | 1880 × 837, RGBA | The 1997 page's logo, as a GIF flattened onto the page's background colour, `WIDTH=410 HEIGHT=183` (DS6). | canon | one GIF, 410 wide, ≤ 64 colours |

## Leadership (S2) — portraits at 4:5, display 360 wide

Four portraits break the house look on purpose: Martin's badge photograph and Adrian's party
photograph (both on this page), and the two of the customer, taken outdoors (case studies and
Enterprise, below).

| File | Person | Status | Derivatives | Alt draft |
|---|---|---|---|---|
| `p01-clive.png` | clive | canon | 360, 720 | Clive Standish in a navy suit, hands pressed together, smiling. |
| `p02-diane.png` | diane | canon | 360, 720 | Diane in a white shirt, arms folded, pen in her pocket. |
| `p03-martin.png` | martin | canon (the badge photograph; breaks the house look on purpose) | 360, 720 | Martin Bell in a staff-badge photograph against a blue backdrop. |
| `p04-jules.png` | jules | canon | 360, 720 | Jules Mercer in a black sweater, holding a pack of gum. |
| `p05-petra.png` | petra | canon | 360, 720 | Dr. Petra Voss holding a thick binder of tabbed papers. |
| `p06-susan.png` | susan | canon | 360, 720 | Susan Pritt in a navy cardigan, holding a notebook. |
| `p07-lucas.png` | lucas | canon | 360, 720 | Lucas in a white shirt and lanyard, giving a thumbs up. |
| `p08-graham.png` | graham | canon | 360, 720 | Graham Pike holding a container of leftovers, keys on his belt. |
| `p09-len.png` | len | canon | 360, 720 | Len looking at his phone, mid-message. |
| `p10-adrian.png` | adrian | canon (the holiday-party photograph; breaks the house look on purpose) | 360, 720 | Adrian Vale at a holiday party, in tinsel, holding a cup. |
| `p11-bev.png` | bev | canon | 360, 720 | Bev in a grey cardigan and red lanyard, looking straight at the camera. |
| `p13-malcolm.png` | malcolm | canon | 360, 720 | Malcolm Venn in a dark suit, presenting a rising chart on a tablet. |

## The customer, the bench and the civic rest sector

| File | Size | Use | Status | Derivatives | Alt draft |
|---|---|---|---|---|---|
| `p12-eileen.png` | 1122 × 1402 | Case study 1 (municipal infrastructure), beside the empty spot | canon | 480, 960 | A municipal archivist on a riverside path, holding a framed certificate beside an empty concrete pad. |
| `b1-empty-spot.png` | 1536 × 1024 | Case study 1, lead photograph | canon | 768, 1536 | A concrete pad with four bolt holes where a bench used to stand, a memorial plaque behind it. |
| `b2-audit.png` | 1536 × 1024 | Case study 3 (the civic rest sector), lead photograph | canon | 768, 1536 | A clipboard and pen resting on the empty bench pad on a frosty morning. |
| `b3-wide.png` | 1536 × 1024 | Case study 2 (public seating), lead photograph | canon | 768, 1536 | A riverside park path with a row of benches and one gap. |
| `p12-eileen-courthouse.png` | 1122 × 1402 | Enterprise, beside the testimonials | canon | 480, 960 | A municipal archivist holding a framed certificate beside an empty concrete pad in a courthouse park. |
| `b3-wide-courthouse.png` | 1536 × 1024 | Enterprise, the municipalities section | canon | 768, 1536 | A courthouse park with benches along a path. |
| `s08-civic-rest-sector.png` | 1672 × 941 | Enterprise, lead photograph | canon | 768, 1536 | A long, perfectly regular row of empty benches on a civic plaza. |

## The office and the flagship research asset

| File | Size | Use | Status | Derivatives | Alt draft |
|---|---|---|---|---|---|
| `s01-chair-gallery.png` | 1536 × 1024 | Home, the band below the ritual (ASSET 001) | canon | 600, 1200 | A folding chair on a plinth in a dark gallery, under a single spotlight. |
| `s02-chair-detail.png` | 1254 × 1254 | Research index, beside the introduction | canon | 480, 960 | Close-up of a folding chair's hinge, lit like a watch. |
| `s03-chair-friday.png` | 1536 × 1024 | Status, STATUS-002 (Fridays) | canon | 480, 960 | A folding chair on office carpet, six feet from a taped rectangle where it stood. |
| `s05-floor-three.png` | 1536 × 1024 | Status, STATUS-001 (floor three) | canon | 480, 960 | An empty open-plan office floor with every window open. |
| `s04-stapler.png` | 1254 × 1254 | Careers, "Your equipment" | canon | 400, 800 | A black office stapler on a white backdrop. |
| `s06-microwave.png` | 1122 × 1402 | Careers, "Facilities" | canon | 400, 800 | An office microwave with a handwritten "Testing — do not unplug" sign. |
| `s07-printer.png` | 1174 × 1467 | Careers, "Your equipment", beside the stapler (placed at C3) | canon | 400, 800 | An office printer with an "Out of order" sign, covered in dated sticky notes, its bottom tray hanging open. |

## Merch

| File | Size | Use | Status | Derivatives | Alt draft |
|---|---|---|---|---|---|
| `m1-lanyard.png` | 1254 × 1254 | Careers, "Your first day" | canon | 400, 800 | A graphite STILL HERE lanyard with a blank badge holder. |
| `m2-mug.png` | 1254 × 1254 | Careers, "Your first day" | canon | 400, 800 | A white STILL HERE mug reading "Going nowhere. With confidence." |
| `m3-tote.png` | 1122 × 1402 | Careers, "Your first day" | canon | 400, 800 | An empty canvas tote bag with the STILL HERE logo, on a hook. |

## Vandalway's 1997 page

| File | Use | Status | Derivative |
|---|---|---|---|
| `s09-sunday-market-1997.png` (1264 × 843) | The page's only photograph, uncaptioned (Q12) | canon | one JPEG, 320 wide (inside research 6's 200–410 range), quality chosen so the file is under 40 KB; no caption |

## Drawn in code (the audit's missing list)

| Asset | Made by | Bead | Rule |
|---|---|---|---|
| The STILL HERE mark (brackets and dot) as SVG | `src/brand/mark.svg` from the logo PNG | DS2 | paths and one circle; green token only |
| Favicon (SVG, ICO 16/32), apple-touch-icon 180, manifest icons 192, 512 and maskable 512 | from the mark | DS2 | mark inside the central 80% on the maskable icon |
| Certificate seal, guilloche border, signatures | `src/js/certificate/` | DS4 | svg2pdf subset (PRD R9); signatures converted from an OFL script face at build time |
| Research covers (three) | `src/js/covers.js` at build | S3 | institutional typography, a chart so flat it looks unfinished |
| 1997 assets: tiled background GIF, under-construction sign GIF, "best viewed in Netscape" badge GIF (88 × 31, D18), animated e-mail icon GIF, odometer digit GIFs for the counter | `scripts/gifs/` with ImageMagick | DS6, V3 | web-safe palette; nothing copied from another site |
| Typefaces | Inter, Inter Tight, JetBrains Mono, Cormorant Garamond static instances, from the upstream OFL repositories at a pinned commit | DS1 | WOFF2 for the page, TTF for the PDF; licence beside each |

## Changelog

- 2026-10-03 — Written at stage 11: 32 files and the parent logo placed, derivative widths set, D21 rule stated, the audit's missing assets assigned to beads. (Jules, 2026-10-03)
- 2026-10-03 — Blind read applied: C2PA counts corrected; bead labels DS1–DS6; the parent logo's location stated; the four portraits named. (Jules, 2026-10-03)
- 2026-10-05 — C2, Decision 3: the hero's crop box is the build's, (1044,110) → (1656,875). C3: `s07` placed on careers beside the stapler, at 400 and 800, with its alt text. (Jules, 2026-10-05)
