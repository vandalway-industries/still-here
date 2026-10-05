---
updated: 2026-10-05
read_by: anyone looking for a STILL HERE record; the records checks
relations: {}
---

# STILL HERE — company records

Everything we keep, where it is, and what format it is in. Times are UTC. Every record has an id
(MAIL-001, sh-051 and so on), and an id cited in one record is the id of another record in this
folder. Staff addresses are `<id>@vandalway.example`. Our one customer on file writes from
`eileen.webb@municipal.example`. (Bev, 2026-10-05)

## The record sets

| Set | Folder | Format | Schema |
|---|---|---|---|
| Tracker | [tracker/](tracker/TRACKER.md) | JSON Lines, one issue per line, for `bd import` (`tracker.jsonl`); the same issues with every comment thread as Markdown (`TRACKER.md`) | [tracker/schema.json](tracker/schema.json) |
| Correspondence | [correspondence/](correspondence/MAIL-001.md) | Markdown mail, one message per file; the headers (from, to, date, subject, message_id, in_reply_to, references) are YAML front matter | none; the header fields are the ones listed here |
| Chat | [chat/](chat/general-2026-09-29.md) | Markdown, one file per channel per day; each message is `**sender** · HH:MM` and its text | none |
| Notes | [notes/](notes/QA-001.md) | Markdown with YAML front matter (id, kind, date, author, tracker) | none |
| Calendar | [calendar/](calendar/CAL-001.md) | Markdown with YAML front matter (organizer, attendees, created, canceled, attachment) | none |
| Certificates | [certificates/](certificates/CERT-001.json) | JSON, one certificate per file (identifier, object, issued_at, time_zone) | none |
| Status | [status/](status/status-updates.xml) | XML: the public status updates (`status-updates.xml`), and support's internal notes and 11:50 floor counts (`notes.xml`) | [status/status-updates.xsd](status/status-updates.xsd) and [status/notes.xsd](status/notes.xsd) |
| Inventory | [inventory/](inventory/inventory.yaml) | YAML (`inventory.yaml`), and the master copy as an Excel 2003 XML spreadsheet ([HERE_FINAL_2008_USE_THIS_ONE.xml](inventory/HERE_FINAL_2008_USE_THIS_ONE.xml)); both hold the same rows | [inventory/schema.json](inventory/schema.json) |
| Gum graph | [gum-graph/](gum-graph/index.md) | An Open Knowledge Format (OKF) v0.1 bundle: one Markdown concept per person and per edge, with YAML front matter | OKF v0.1; checked with `python3 tools/okf/okf_validate.py company/gum-graph --strict` |
| Research | [research/](research/competitive-landscape.md) | Markdown with YAML front matter (title, author, date, pages, abstract), one paper per file | none |
| Staff | [staff/](staff/staff.yaml) | YAML: the staff list (`staff.yaml`) and the customers we correspond with (`customers.yaml`) | none |

## Loading the tracker

The tracker loads into `bd` with `bd import`. Use a folder of its own, never this repository's
`.beads/` (the product team's work items live there, and the two are kept apart):

```bash
mkdir still-here-tracker && cd still-here-tracker
git init -q
bd init --prefix sh --quiet
bd import /path/to/still-here/company/tracker/tracker.jsonl
bd list --all
```

`bd import` reports 55 issues. Every one carries the label `record`.

## Checking the records

From the repository root, after `npm run build` (the last two read the built site too):

```bash
node scripts/validate-tracker.mjs                            # the tracker against its schema
python3 tools/okf/okf_validate.py company/gum-graph --strict  # the gum graph
node scripts/continuity-check.mjs --list all company site    # the continuity check
node scripts/identifier-check.mjs                            # every certificate identifier recomputes
```

The last two run on every push. The website never reads the inventory or the internal notes.

## Changelog

- 2026-10-05 — Written: the record sets, their formats and schemas, and loading the tracker. (Bev, 2026-10-05)
