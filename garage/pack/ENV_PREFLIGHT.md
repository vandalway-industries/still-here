---
updated: 2026-10-03
read_by: /goal at BUILD entry, before Phase 0; G0 and G1 at their start; L1–L3 and N1–N2 before they touch anything outside this machine; anyone debugging "it worked yesterday"
relations: {}
---

# Environment pre-flight

Re-run every command on the day the build starts. A line whose answer changed is a Phase 0 step,
not a surprise. Workstation rows were checked 2026-10-03 on the build workstation; server and
account rows come from the build-readiness audit of the same day (`garage/HANDOFF.md`), which
changed nothing. No hostname, address or account handle is written here or anywhere in the
repository: they live in the uncommitted `.env.staging` and in the operator's SSH configuration.
"The production server" is the machine that will serve vandalwayind.com and hosts staging; "the
internal network" is the private network that reaches it. (Jules, 2026-10-03)

## The workstation

| Check | Command | Result 2026-10-03 |
|---|---|---|
| Node | `node --version` | v24.13.0 (runs `.test.ts` with type stripping) |
| npm | `npm --version` | 11.6.2 |
| Playwright | `npx -y playwright --version` | 1.59.1 |
| Playwright browsers | `npx playwright install --list` (from `e2e/`) | Chromium and WebKit installed; **Firefox missing** → G1 runs `npx playwright install firefox` |
| Port for the local Pages server | `ss -ltn \| grep :5320` | free |
| Python | `python3 --version`; `python3 -c "import yaml, PIL"` | 3.12.3; PyYAML 6.0.1; Pillow 12.1.0 |
| ImageMagick (period GIFs, DS6) | `convert -version \| head -1` | 6.9.12-98 |
| uv | `uv --version` | 0.11.26 |
| git | `git --version` | 2.43.0; global default branch unset → G0 uses `git init -b main` |
| GitHub CLI | `gh --version`; `gh auth status` (read the scopes line only) | 2.45.0; scopes `repo`, `read:org`, `gist`, `admin:public_key`; **no `workflow` scope** → every push goes over SSH, which carries workflow files |
| SSH push to GitHub | `ssh -T git@github.com` (exit 1 with a greeting is success) | authenticates (audit) |
| beads | `bd --version`; `command -v bd bd-gate-selftest.sh` (the gate wrapper and its self-test, on the operator's PATH) | 1.0.3; gate wrapper and self-test present |
| PII gate, both tiers | the factory's two denylists, private and public, present in the operator's factory settings; `PII_PUBLIC=1 "$FACTORY_DIR"/scripts/pii-gate.sh --tree .` (after G0; `FACTORY_DIR` is where the factory is checked out) | both lists present; the public tier runs from the first commit |
| Factory scripts | `ls "$FACTORY_DIR"/scripts/{docs-sync-check,stop-gate,pii-gate}.sh` | present |
| OKF validator (RC4) | the OKF toolkit 0.3.3 (MIT) installed as a local agent plugin; G1 copies `okf_validate.py` and `LICENSE` into `tools/okf/` | present; needs PyYAML (present) |
| Design linter | `npx -y @google/design.md@0.3.0 lint DESIGN.md` | 0 errors, 0 warnings |
| DNS and HTTP tools | `dig -v`; `curl --version` | 9.18.39; 8.5.0 |
| PDF and QR tools | `which pdftotext zbarimg` | **absent** → render-back with pdf.js in Chromium, QR decode with jsQR (both devDependencies, G1) |

## Inputs handed over at C1

| Check | How | Result 2026-10-03 |
|---|---|---|
| The brand dossier | Clive hands its location over at C1; G2 opens it and finds the five sections `CONTENT_SEEDS.md` names | not yet handed over |
| The continuity fixture | Clive hands `continuity-hashes.json` over at C1; it parses and has `salt`, `confidential` and `unknown-to-staff` | not yet handed over |

## Accounts and services

| Check | How | Result 2026-10-03 |
|---|---|---|
| GitHub organization `vandalway-industries` | `gh api orgs/vandalway-industries` | **does not exist yet**: Clive creates it in the browser (I-01) before G0 pushes |
| GitHub plan | `gh api orgs/vandalway-industries --jq .plan.name` (after creation) | unread (the token cannot read it); on the Free plan Pages needs a public repository, which Phase 8 assumes |
| Pages domain verification | organization settings → Pages → add domain | browser only (no API route found); Clive hands the TXT value over before L3 |
| Registrar DNS API | the registrar's API tools: list both domains, read records, list snapshots | reads work for both domains; **writes unproven** → L3 runs a validation dry run before its first write |
| Both domains | registrar read | isitstillhere.com and vandalwayind.com: active, registered 2026-10-03, locked, privacy on; both point at the registrar's parking address with `www` aliased to the apex; no MX, SPF, DKIM or DMARC |

## The production server (over SSH, via the internal network)

| Check | Command | Result 2026-10-03 (audit) |
|---|---|---|
| SSH | `ssh <the production server> true` | authenticates as root |
| Web server | `caddy version`; `systemctl is-active caddy` | **Caddy** (not nginx); serves other public sites; a bad reload takes all of them down → always `caddy validate` first |
| Access logs | `ls /var/log/caddy/` | empty: no site logs today; V3 adds a log for vandalwayind.com only |
| Internal network HTTPS | `tailscale serve status` | HTTPS certificates enabled; the root HTTPS path already proxies another service → staging and the internal 1997 copy each use their **own HTTPS port** (`--https=<port>`), never the root |
| Free ports for the two localhost sites | `ss -ltn` on the server | checked by V2 and L1 on the day; the chosen ports go in `.env.staging`, not in the repository |
| Outbound mail | — | port 25 open; no mail software; not used (I-03) |
| Reverse DNS | `dig -x <address>` | names another of our domains; accepted as it is (I-10) |
| Node on the server (the counter, V3) | `node --version` on the server | not checked by the audit → V2's install script installs it if absent (I-11); its undo removes only what it installed |
| Undo scripts (I-11) | `ls deploy/*-uninstall.sh` (from Phase 6) | one per install script: `vandalwayind`, `staging`, and N2's public block; each run once before its bead closes |
| systemd timers | `systemctl list-timers` | available; V3 adds one, by script, with its undo |

## Offline and failure rules

- If the web archive refuses DS6's fetches (it refused research 6 partway), DS6 records the refused
  URLs in `exemplars/1997/SOURCES.md` and the critic uses research 6's element table as the bar.
- If Google's or GitHub's font repositories are unreachable when DS1 runs, DS1 stops and reports; it
  never substitutes a font.
- If a registrar write fails its dry run, L3 stops for that domain and the C4 packet carries the
  failure; nothing is retried blind.
- If Pages has not issued the certificate within 24 hours of the DNS write, N1 reports it at the
  morning look and keeps polling; it does not remove and re-add the domain without Clive's word.

## Changelog

- 2026-10-03 — Written at stage 11 from the day's workstation checks and the audit's server and account checks. (Jules, 2026-10-03)
- 2026-10-03 — Blind read applied: inputs handed over at C1; Node and the undo scripts on the server (I-11); reverse record accepted (I-10); bead labels DS and RC. (Jules, 2026-10-03)
