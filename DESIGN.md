---
updated: 2026-10-03
read_by: any agent touching UI in this repo, before writing markup or CSS; the critic for every visual unit (with the approved goldens); the `@google/design.md` linter; Phase 1's DS1, which generates `src/css/tokens.css` and `src/js/tokens.js` from the front matter below
relations: {}
# ── Google DESIGN.md front matter (alpha) — the machine layer. Colours measured from the brand
# files on 2026-10-03 (method in ## Colors). Lint: npx -y @google/design.md@0.3.0 lint DESIGN.md
version: alpha
name: STILL HERE
description: Vandalway Industries' presence-certification website. Swiss corporate calm, warm white and graphite, one verification green; it must look trustworthy and expensive, and never as though it is guessing.
colors:
  primary: "#161618"
  on-primary: "#FAF7F0"
  canvas: "#FAF7F0"
  surface: "#F1EEE7"
  hairline: "#DFDCD6"
  graphite: "#161618"
  graphite-muted: "#4C4C4A"
  verification-green: "#069852"
  focus: "#069852"
  paper: "#FAF7F0"
  ink: "#161618"
typography:
  display-lg:
    fontFamily: Inter Tight
    fontSize: 72px
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: -0.02em
  display-sm:
    fontFamily: Inter Tight
    fontSize: 44px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -0.02em
  headline:
    fontFamily: Inter Tight
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.01em
  title:
    fontFamily: Inter Tight
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.55
  body-sm:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.08em
  identifier:
    fontFamily: JetBrains Mono
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.04em
  certificate-display:
    fontFamily: Cormorant Garamond
    fontSize: 54px
    fontWeight: 600
    lineHeight: 1.1
  certificate-body:
    fontFamily: Cormorant Garamond
    fontSize: 19px
    fontWeight: 500
    lineHeight: 1.4
  certificate-small:
    fontFamily: Cormorant Garamond
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.35
rounded:
  none: 0px
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  xxl: 64px
  section: 120px
  gutter-mobile: 20px
  gutter-desktop: 48px
  content-max: 1200px
  text-max: 680px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: 16px 28px
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.graphite}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: 12px 20px
  input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.graphite}"
    typography: "{typography.headline}"
    rounded: "{rounded.none}"
    padding: 16px 20px
  example-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.graphite}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: 8px 14px
  verification-line:
    textColor: "{colors.graphite}"
    typography: "{typography.label}"
  result-heading:
    textColor: "{colors.verification-green}"
    typography: "{typography.display-lg}"
  certificate:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.certificate-body}"
  leadership-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.graphite}"
    typography: "{typography.body-sm}"
  status-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.graphite}"
    typography: "{typography.body-sm}"
  footer:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-sm}"
  caption:
    textColor: "{colors.graphite-muted}"
    typography: "{typography.label}"
  divider:
    backgroundColor: "{colors.hairline}"
    height: 1px
  focus-ring:
    backgroundColor: "{colors.focus}"
    width: 3px
---

# STILL HERE — DESIGN

> **Design authority.** Repo root. Authority chain: this file → the approved goldens in
> `garage/pack/exemplars/` (after C2) → shipped pages. Never reverse-engineered from shipped CSS.
> Format: the Google DESIGN.md spec (alpha). Lint: `npx -y @google/design.md@0.3.0 lint DESIGN.md`,
> 0 errors. This file covers isitstillhere.com. vandalwayind.com is deliberately outside it: that
> page is HTML 3.2 from 1997 and takes nothing from these tokens (PRD R42). (Jules, 2026-10-03)

## Overview

Expensive Swiss corporate design, rigorous spacing, clinical confidence, and a disproportionately
prestigious treatment of a folding chair (the brand dossier's visual direction). The hero
image `garage/assets/still-here-hero-chair.png` is the register: a huge warm-white field, graphite
type set large and tight, one small green registration mark, and a monospace annotation reading
"ASSET 001 / FOLDING CHAIR · STATUS: STILL HERE". Nothing moves unless it is a line of the
verification sequence arriving. Nothing is decorative that could be mistaken for evidence.

It must never look like a parody of a corporate site, a startup landing page, or a joke. The
joke is that it is completely serious. No exclamation marks, no emoji in the interface, no
illustration style, no rounded friendliness.

**Voice for interface copy.** Precise, calm, short. The company speaks in Clive's register only
where Clive owns the words: the top of the certificate ("This certifies that…"), the seal, the
Enterprise page. Everywhere a visitor must understand what happened, the words are Diane's:
literal and complete. The certificate footer is hers and is set verbatim, in small type, at the
bottom: "Confirms successful completion of this form. No physical inspection occurred." Never
shorten, paraphrase or restyle it into a tagline. Fixed strings (the three verification lines,
**STILL HERE.**, the mismatch and future sentences, the 404 sentence, the Enterprise call to
action, the status constant) are copied from `garage/pack/CONTENT_SEEDS.md`, never retyped.

There is no error colour, by design: the product has no failure mode in which an object is
absent (sh-013). A certificate that cannot be located is reported in the same graphite as
everything else.

## Colors

Measured 2026-10-03 with Pillow 12.1 on the brand files in `garage/assets/`: the canvas is the
most frequent colour of `still-here-hero-chair.png` (its eight most frequent colours all fall
within #F9F6EE–#FBF8F1; the median background sample is #FAF7F0); graphite is the median of the
hero's 97,774 pixels darker than RGB sum 120 (#161618; the logo's opaque dark median is #131311);
verification green is the median of the hero's 5,563 pixels where G exceeds R by 40 and B by 30
(#069852; the logo's green median is #019049, kept for the record and not used); graphite-muted is
the median of the hero's "ASSET 001" annotation (#4C4C4A). Surface and hairline are not sampled:
they are graphite mixed into canvas at 4% and 12%.

- **Canvas** (#FAF7F0): page background, input fill, certificate paper.
- **Surface** (#F1EEE7): bands, example chips, the portfolio list. Graphite on it is 15.60:1.
- **Hairline** (#DFDCD6): 1px structural dividers only (status rows, footer columns). 1.28:1 on
  canvas, so never a text colour and never the only edge of a control.
- **Graphite** (#161618): all text, primary buttons, input borders, the QR code. 16.89:1 on canvas.
- **Graphite-muted** (#4C4C4A): secondary text and labels. 8.04:1 on canvas, 7.43:1 on surface.
- **Verification green** (#069852): the mark, the result heading **STILL HERE.**, the focus ring,
  the seal on the certificate. 3.49:1 on canvas: passes for large text (≥ 24px, or ≥ 18.66px bold)
  and for non-text marks (≥ 3:1), fails for small text. **Never small text** (sh-047): where a
  small label would be green, it is graphite with a green mark beside it. Graphite on a green fill
  is 4.84:1.
- **On-primary** (#FAF7F0): text on graphite.

Light only. There is no dark mode in v1; the certificate is paper and the site matches it.

## Typography

D7: **Inter Tight** for headlines and the wordmark, **Inter** for UI and body, **JetBrains Mono**
for labels, the verification lines and identifiers (the hero's "ASSET 001" register), **Cormorant
Garamond** for the certificate. All OFL, self-hosted as static instances (no variable fonts; jsPDF
needs static TrueType). The page loads WOFF2; the PDF registers TTF files of the same faces.

- Display: Inter Tight 700, tight (−0.02em). "Is it still here?" is display-lg at 1440 and
  display-sm at 390. **STILL HERE.** on the result is display-lg in verification green.
- Labels: JetBrains Mono 500, 12px, uppercase, +0.08em. Verification lines use the same face at
  15px, sentence case, exactly as written.
- Body: Inter 17px/1.55, measure capped at 680px.
- Certificate: Cormorant Garamond 600 for the name and the heading, 500 for body and small print;
  the identifier in JetBrains Mono; the wordmark in Inter Tight 700.

## Layout

A 12-column grid, 1200px content maximum, 48px gutters at desktop and 20px at mobile, an 8px
spacing base. Sections are separated by space (120px), not by rules. The home page puts the
question, the input and the examples in the left seven columns and the chair, cropped from the
hero with its green registration brackets, in the right five; on a phone the chair sits above the
question at reduced height and the input is reachable without scrolling at 390×844.

Page anatomy: header (mark + wordmark left, menu right; on a phone the menu is a button opening a
full-screen list, closed by the button or Escape) · content · footer (graphite band). The menu holds
eight items: Verify, Portfolio, Leadership, Research, Case studies, Status, Careers, Enterprise.
The footer holds three links: Terms of Presence, Privacy, "A Vandalway Industries company". Breakpoints: 640px and 1024px.

## Elevation & Depth

None. No shadows, no blur, no glass. Hierarchy comes from size, weight and space. The certificate
preview on the result screen sits on surface with a 1px hairline edge; that is the deepest thing
on the site.

## Shapes

Square corners everywhere (`rounded.none`). The only circles are the dot inside the mark and the
seal on the certificate. Borders: 2px graphite on inputs and secondary buttons; 1px hairline on
dividers.

## Components

- **Input:** canvas fill, 2px graphite border, headline type so the object's name reads large.
  Focus: 3px verification-green outline outside the border, offset 2px (non-text contrast 3.49:1
  against canvas). A counter appears only past 60 code points ("63 / 80"). The empty-state
  sentence sits below in graphite-muted body-sm and is announced politely.
- **Button:** primary is a graphite fill with canvas text, square, title type: **Check presence**.
  Hover: graphite-muted fill. Active: no movement, no scale. Disabled (`aria-disabled="true"`):
  graphite at 40% over canvas, still focusable so the hint can be reached. Secondary buttons
  (Download PDF, Download PNG, Copy certificate link, Check another) are canvas with a 2px graphite
  border. Focus is always the green outline. Never remove an outline without the replacement
  (sh-028). While a file is prepared, its button reads "Preparing PDF…" or "Preparing PNG…" and
  is `aria-disabled`; a failure restores the button and puts the export-failure sentence beneath
  it in graphite body-sm. There is no error colour.
- **Example chips:** surface fill, no border, body-sm; ten of them in Q10's order, wrapping. Tap
  fills the input; the chip shows no selected state. During the sequence the chips and the input
  are inert and drawn at 40% graphite, like the disabled button.
- **Result:** replaces the form in the same place: **STILL HERE.** (display-lg, green), the name,
  the date and time with the zone, the identifier (identifier type), the certificate preview on
  surface, the four secondary buttons, and the portfolio line in body-sm with its link. The same
  block, under the confirmation sentence, is the reopened certificate on `/c/`. A not-located or
  future result on `/c/` or Verify is the sentence in title type and two text links; no
  certificate is drawn.
- **Verification sequence:** one fixed mark (the green registration brackets around a dot) that
  never moves, scales, spins or fades, at any time (Q5, sh-049); beneath it the three lines
  arriving one at a time in JetBrains Mono, each line fully drawn before the next. With motion
  allowed, a line enters with a 200ms opacity change; with reduced motion, it appears at once. The
  pacing is the same either way. The region is `aria-live="polite"`.
- **Certificate (SVG, US Letter landscape, 1100 × 850 user units):** paper ground, a guilloche
  border in graphite hairlines, the wordmark and "CERTIFICATE OF CONTINUED PRESENCE" at the top,
  "This certifies that" in certificate-body, the object's name in certificate-display (shrinking to
  a floor of 30 units and then wrapping to up to four lines, a word longer than the line broken at
  a grapheme boundary with no hyphen), the result line ending in **STILL HERE.**, the
  date line written out, "Jurisdiction of here: <zone>", the seal (a green rosette, its ring text in graphite on
  paper; no green text) at lower right, two
  signatures as paths over their names and titles, the identifier in JetBrains Mono and the UTC
  line, the QR code in graphite at lower left, and Diane's footer last in certificate-small. Only
  the elements in PRD R9. Do not ruin this: no drop shadows, no gradients, no textures, no
  rotated text other than the seal's ring of letters placed glyph by glyph.
- **Leadership card:** portrait at 4:5 (the source ratio), full card width, no rounding, no
  filter; name in title type; title as a label; a two- or three-sentence bio (20–60 words) in
  body-sm. Four portraits break the house look on purpose: Martin's badge photograph and Adrian's
  party photograph here, and the customer's two outdoor photographs on the case studies and
  Enterprise; never "correct" them to match.
- **Status row:** date as a label, the incident title in title type, the record id as a label in
  graphite-muted, one or two sentences of body-sm; hairline between rows; the standing line "All
  systems operational" above all rows, beside a green mark, in title type.
- **Footer:** graphite band, on-primary text, body-sm; columns separated by space; "A Vandalway
  Industries company" is a plain underlined link to `https://vandalwayind.com/`.
- **Iconography:** none beyond the mark. Arrows in links are typographic (→).
- **Imagery:** photographs full-bleed within their column, square corners, never tinted, never
  overlaid with text, always with alt text that describes what is in the picture, plainly.

## Do's and Don'ts

- Do: let the space do the work; when in doubt, add space, not a rule or a box.
- Do: set every fixed string from `garage/pack/CONTENT_SEEDS.md` exactly, punctuation included.
- Do: keep the green for the mark, the result heading, the seal and focus; nothing else.
- Don't: use green for small text, links or body copy (sh-047).
- Don't: animate the indicator, ever, or add a progress bar that moves (sh-049).
- Don't: add a red, an amber, or any status colour; the product has no failure state.
- Don't: round a corner, add a shadow, or put text on a photograph.
- Don't: show a different certificate, colour, or message for any object (Q1).
- Don't: load a font, script, image or style from another origin.

## Agent Prompt Guide

You are styling isitstillhere.com. Tokens are in the front matter; DS1 generates `src/css/tokens.css`
from them as `--sh-*` custom properties and `src/js/tokens.js` as named exports (the certificate's
fills and the manifest read the latter). Never type a hex value anywhere else in `src/`. Fixed strings come from `garage/pack/CONTENT_SEEDS.md`. The certificate is
drawn by `src/js/certificate/` into the SVG subset in PRD R9; check any new element against that
list before using it, because svg2pdf.js silently drops what it does not support. Verify in a real
browser at 390×844 and 1440×900 in Chromium and WebKit, then against the approved goldens in
`garage/pack/exemplars/` (from C2 on). Before C2 there is no visual bar: build to this file and
leave taste to the packet. Never invent a colour, a font, a radius or a shadow.

## Changelog

- 2026-10-03 — Born at stage 11 from D7 and colours measured from the hero and the logo. Clive asked for the QR code in verification green; it stays graphite unless green passes the same scan test (sh-044). Clive asked whether the progress indicator could move; it never moves (sh-049). (Jules, 2026-10-03)
- 2026-10-03 — Blind read applied: menu and footer contents; result, export-progress and failure states; inert inputs during the sequence; four-line name layout; the seal's text in graphite; bead label DS1; four portraits named. (Jules, 2026-10-03)
