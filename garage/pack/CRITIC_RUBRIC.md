---
updated: 2026-10-03
read_by: every critic sub-agent spawned in BUILD, after the factory's critic prompt (`templates/prompts/critic.md` in the factory); the Judge when it reviews a Worker's receipt; `/goal`'s final audit
relations:
  derived_from: ../../PRD.md
---

# Critic rubric — STILL HERE

You check work you did not do, against text you did not write. The factory critic's nine rules
apply in full. This file says what the bar means here. (Diane, 2026-10-03)

## Order of checks, every unit

1. **The locked tests.** `node --test tests/unit/<id>-*.test.ts`; from `e2e/`, `npx playwright test
   specs/<id>-*` in the engines the bead names. A test file that differs from `specs-v1` is a FAIL,
   with the diff quoted.
2. **The build and the guards.** `npm run build` clean; the link checker; X6's network log; no hex
   literal in `src/` outside the generated `src/css/tokens.css` and `src/js/tokens.js` (`vandalwayind/`
   is exempt: HTML 3.2 colours are attributes); for the certificate, the SVG element allow-list (PRD R9).
3. **The walk, played.** For any unit with a screen, play its walk from `WALKS.md` yourself in a real
   browser (Playwright MCP), at both sizes, in Chromium and WebKit. Every step must be doable as
   written, by looking and clicking. Mark each step "played". A step outside the browser is played
   by exactly the substitute in `WALKS.md` § Substitute evidence and marked "played (substitute)";
   a † step with no substitute is marked "awaiting phone" until Clive's checklist covers it. A step
   you could not do is a FAIL "unplayed" at that step, whatever the spec said.
4. **Strings.** Every fixed string the unit shows is compared byte for byte with `CONTENT_SEEDS.md`
   § Fixed strings. "Close" is a FAIL.
5. **The blind pick.** Only for what 1–4 cannot decide, and only against an approved golden:
   result screen vs `exemplars/home-390-golden.png` and `home-1440-golden.png`; exported PNG vs
   `exemplars/certificate-golden.png`; leadership at 1440 vs `exemplars/leadership-1440-golden.png`;
   the 1997 page vs `exemplars/vandalway-1997-golden.png`. Unlabelled pair, pick, two sentences. No
   golden approved yet: report NO BAR for the visual part; the deterministic result stands alone.
6. **Scope (rule 8).** Read the unit's commits, comments and bead notes for reduction language and
   compare against the PRD line and the ACCEPTANCE section. Delivering less than the text says is a
   FAIL "scope reduced", whatever it is called.
7. **Four levels (rule 9).** Exists, substantive, wired, data flows. Name every MISSING, STUB,
   ORPHANED and HOLLOW.

## The constant exception

The presence result is a constant **by specification**: every object receives STILL HERE (Q1; sh-013,
"has no code path in which the result depends on the object"). The same holds for the status
page's "All systems operational" (Q11) and for `presence.json` (D9). These are **not** HOLLOW: the
acceptance text names the constant as the required behaviour (critic rule 9's exception). Cite PRD
R7, R29 or R34 when you apply it.

The exception covers the constant and nothing near it. The name, the time, the zone, the identifier,
the QR code, the link and the portfolio all carry real data and are checked at all four levels. A
certificate that shows a hard-coded name or time, a Verify page that confirms without recomputing,
or a portfolio that renders a fixed list is HOLLOW.

## What is HUMAN-JUDGED here (report with evidence, never score)

Whether it looks trustworthy and expensive; the certificate's top language, seal and signatures; how
the identifier's check symbols look on paper; whether the pacing feels ceremonial; every bio,
paper, case study, testimonial, posting, status body, legal paragraph; the 1997 prose, the
relocation line, and whether the page reads as found; the wording of the examples; portrait crops;
photograph placement. Attach the screenshot or the line. These go to C2 or C3 (`CHECKPOINTS.md`).

## The cheat list for this project

- A timing spec that measures the CSS animation duration instead of when the text is on screen.
- An indicator that "never moves" because the spec samples it once.
- No tells proved on the DOM only, while the PDF or PNG differs by object.
- A Verify page that checks the identifier's format or check symbol and never recomputes the hash
  from the name.
- A PDF that "contains the font" because the font name is in the file, without `/FontFile2`.
- A QR test that decodes the SVG source rather than the exported PNG and the rendered PDF.
- A fragment test that inspects only `fetch` calls and not every request, navigation and the server log.
- A staging check that hits the local server.
- A records check that recomputes identifiers with a second implementation instead of the module
  `site/` ships.
- A "verbatim" string that differs in its quotation marks, apostrophe or final full stop.
- Any statement on the Privacy or Terms page that no test proves. A statement about another
  company's behaviour counts as proved only by a link, on the page, to that company's own
  documentation saying it; open the link and read it.
- A walk step marked "played" that was played by neither the browser nor its named substitute.
- Any page, record or commit that names a person from outside the company.

## Changelog

- 2026-10-03 — Written at stage 11. (Diane, 2026-10-03)
- 2026-10-03 — Blind read applied: hex rule scoped to `src/`; substitutes for steps outside the browser; citations as proof for third-party facts. (Diane, 2026-10-03)
