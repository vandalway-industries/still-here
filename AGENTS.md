---
updated: 2026-10-04
read_by: every agent session in this repository, at start (through the CLAUDE.md symlink or by name); every Worker and critic before it touches a bead
relations: {}
---

# AGENTS.md — STILL HERE

> How to work in the STILL HERE repository without breaking anything. One file, two names:
> `CLAUDE.md` is a symlink to this file. State lives elsewhere (see "Where truth lives").
> (Jules, 2026-10-03)

## Commands

```bash
# unit tests (fast; Node 24 runs .test.ts directly)
node --test 'tests/unit/**/*.test.ts'
# a single bead's unit test
node --test tests/unit/<bead-id>-*.test.ts
# browser specs (slow; the bd close gate runs them; scaffold arrives with G1)
cd e2e && npx playwright test
# open work
bd ready
bd show <bead-id> --json
```

## Command rules

- `git`: `--no-pager`, pipe through `| cat`.
- No streaming or long-running commands in a bounded turn (`tail -f`, `watch`, servers, the full
  browser suite).
- Cap large output with `| head -100`.

## Project shape

STILL HERE is Vandalway Industries' presence-certification platform: enter an object, initiate
verification, receive documented reassurance that it remains here. The product lives at the
repository root (`src/`, `scripts/`, `e2e/`, `tests/` as the phases add them). `company/` holds the
company's records. `garage/` holds the project's shaping history and the build pack
(`garage/pack/`). `assets/` holds the brand and photography originals. `docs/archive/` keeps
superseded documents; nothing is deleted.

## Conventions

- Everything in this repository is written by Vandalway Industries' STILL HERE team, about the
  product they make. Product copy, records, plans and beads speak as the company and its people.
- Each file has an author of record: `PRD.md` Diane; `PLAN.md` Jules, its Retro Bev; `DESIGN.md`
  Jules; `SESSION_STATUS.md` Martin; `PROJECT.md` Malcolm; `garage/BRAINDUMP.md` Clive;
  `garage/BRAINSTORM.md` Petra. Marks read `(Name, YYYY-MM-DD)`, with the date from `date +%F`.
  Beads are filed by the character who owns them, `<id>@vandalway.example`.
- Records keep each character's voice and knowledge: people know only what the records show they
  know. Ownership is 51% Diane, 49% Vandalway. A character's claim is not a fact about the
  software; documentation says what the code does.
- The voice may be the company's; the facts may not be invented. A status note that says the tests
  pass means they passed. Real deployments, test results and approvals are never fabricated.
  Commits keep their real author; in-story history lives in `company/`, never in git identities.
- No name of anyone outside the company appears anywhere in the repository.
- The company is Vandalway, spelled with a w.
- Bead labels and test files: `docs/bead-map.md` maps each label (G0, DS1, E2, …) to its bead id;
  a bead's tests are `tests/unit/*<bead-id>*.test.ts` and `e2e/specs/*<bead-id>*.spec.ts`.
- Commit style: one line saying what changed, in plain words or in the company's voice.

## Guardrails

- Tests are written first and locked at the tag `specs-v1`. Never edit a locked test; a test that
  must change goes to the next checkpoint packet.
- Every commit passes the PII pre-commit hook at the public tier. Never bypass it.
- The whole-tree scan, with the two approved exact allowances (our webmaster address on the 1997
  domain and GitHub's SSH host) added to the gate's default, is the factory PII gate run as
  `PII_PUBLIC=1 PII_ALLOW_REGEX='555|example\.(com|org)|test\.(com|org)|\.(example|invalid|test|localhost)\b|<embed-host>|noreply|placeholder|x@y\.com|a@b\.com|\bfoo\b|\bbar\b|users\.noreply|webmaster@vandalwayind\.com|git@github\.com' <the factory PII gate> --tree .`
- Never write a hostname, address, account handle or path outside this repository into a file
  here. Staging details live in the uncommitted `.env.staging`.
- The repository stays private until Clive switches it to public after the launch checkpoint.
- Do not close a bead without every acceptance box flipped with evidence and its tests passing;
  the STRICT close gate (`.bd-gate`) enforces it.
- The in-story issue tracker in `company/tracker/` is a company record. It never enters `.beads/`,
  and no bead carries the label `record`.

## Where truth lives

- `PROJECT.md` — what this is, the hub, stable interfaces.
- `SESSION_STATUS.md` — right now: state, last change, next, waiting on Clive.
- `PLAN.md` — phases, gates, where the build stands.
- `PRD.md` — what and why.
- `DESIGN.md` — design authority.
- `garage/pack/ACCEPTANCE.md` — each bead's acceptance, verbatim.
- `bd list` — open work.

## Landing the plane

1. Rewrite `SESSION_STATUS.md` (one block, current).
2. `PLAN.md` truth-pass: map status, Active phase, checkboxes with evidence, changelog line.
3. Beads updated; new work filed with `discovered-from`.
4. The drift check is clean (the landing gate in `.claude/hooks/stop-gate.sh` runs it).
5. Commit and push over SSH.

## Definition of done

1. Every acceptance box flipped with evidence (code, and the browser where there is a screen).
2. The bead's unit test or Playwright spec, named with its id, exists and passes.
3. `SESSION_STATUS.md` and `PLAN.md` reflect the change.

## Changelog

- 2026-10-03 — Written at promote (G0), with the team's working rules. (Jules, 2026-10-03)
- 2026-10-04 — The tree-scan command and its two approved allowances. (Jules, 2026-10-04)
