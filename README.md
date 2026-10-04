---
updated: 2026-10-03
read_by: anyone meeting this repository cold (a fresh clone, the organization page); AGENTS.md points here for what the product is
relations: {}
---

# STILL HERE™

STILL HERE™ is Vandalway Industries' presence-certification platform. Enter an object, initiate
verification, and receive documented reassurance that it remains here. Going nowhere. With
confidence.

This repository holds the platform's website (isitstillhere.com), Vandalway Industries' own
website (vandalwayind.com), and the company records behind both.

**Where it stands:** the build has begun. The repository, its gates and its work items are in
place; the website itself is not built yet. Progress is tracked in `PLAN.md` and
`SESSION_STATUS.md`.

## Run

What runs today:

```bash
# the unit tests (Node 24 runs the .test.ts files directly)
node --test 'tests/unit/**/*.test.ts'

# the open work items (beads)
bd ready
```

The local website server and the browser tests arrive with the next work item; this section will
say how to run them once they exist.

## Layout

- `PRD.md` — what STILL HERE does and why.
- `PLAN.md` — the build, phase by phase.
- `DESIGN.md` — how it looks.
- `SESSION_STATUS.md` — where the build stands right now.
- `garage/` — the project's shaping history and the build pack (`garage/pack/`).
- `company/` — the company's records.
- `assets/` — brand and photography originals.
- `docs/bead-map.md` — each work item's label, id, owner and test files.
- `tests/unit/`, `e2e/specs/` — the unit tests and the browser specs.

## Changelog

- 2026-10-03 — Written at promote. (Jules, 2026-10-03)
