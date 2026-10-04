---
updated: 2026-10-03
read_by: T0 (names every test file with the bead ids below); every Worker before it starts a bead; the bd close gate's operator; the critic
relations:
  derived_from: ../garage/pack/ACCEPTANCE.md
---

# Bead map

Every section of `garage/pack/ACCEPTANCE.md` is one bead, filed at G0 by its owner with the
section as its acceptance field, verbatim. This table maps each label to its bead id, its owner and
the test files its acceptance names, with `<id>` replaced by the real id. A bead whose screen has a
walk in `garage/pack/WALKS.md` also gets `e2e/specs/<id>-walk.spec.ts` where its acceptance does
not already name one; T0 decides those from `WALKS.md`. (Jules, 2026-10-03)

| Label | Bead id | Owner | Test files |
|---|---|---|---|
| G0 | `still-here-agb` | jules@vandalway.example | `tests/unit/still-here-agb-promote.test.ts` |
| G1 | `still-here-2d9` | jules@vandalway.example | `tests/unit/still-here-2d9-serve-pages.test.ts` |
| G2 | `still-here-540` | diane@vandalway.example | `tests/unit/still-here-540-seeds.test.ts` |
| T0 | `still-here-64t` | diane@vandalway.example | `tests/unit/still-here-64t-specs.test.ts` · `e2e/specs/still-here-64t-walk.spec.ts` |
| DS1 | `still-here-hlw` | jules@vandalway.example | `tests/unit/still-here-hlw-tokens.test.ts` |
| DS2 | `still-here-jw0` | jules@vandalway.example | `tests/unit/still-here-jw0-icons.test.ts` |
| DS3 | `still-here-aac` | jules@vandalway.example | `tests/unit/still-here-aac-derivatives.test.ts` |
| DS4 | `still-here-sp7` | jules@vandalway.example | `tests/unit/still-here-sp7-certificate-svg.test.ts` · `e2e/specs/still-here-sp7-certificate-candidate.spec.ts` |
| DS5 | `still-here-9uk` | jules@vandalway.example | `tests/unit/still-here-9uk-candidates.test.ts` · `e2e/specs/still-here-9uk-home-leadership-candidate.spec.ts` |
| DS6 | `still-here-azk` | jules@vandalway.example | `tests/unit/still-here-azk-vandalway-markup.test.ts` · `e2e/specs/still-here-azk-vandalway-candidate.spec.ts` |
| DS7 | `still-here-9xd` | jules@vandalway.example | `tests/unit/still-here-9xd-c2-packet.test.ts` |
| E0 | `still-here-lsz` | jules@vandalway.example | `tests/unit/still-here-lsz-links.test.ts` · `e2e/specs/still-here-lsz-shell.spec.ts` · `e2e/specs/still-here-lsz-walk.spec.ts` |
| E1 | `still-here-yw2` | jules@vandalway.example | `tests/unit/still-here-yw2-identifier.test.ts` |
| E2 | `still-here-3a3` | jules@vandalway.example | `tests/unit/still-here-3a3-input-rules.test.ts` · `e2e/specs/still-here-3a3-ritual.spec.ts` · `e2e/specs/still-here-3a3-timing.spec.ts` · `e2e/specs/still-here-3a3-walk.spec.ts` |
| E3 | `still-here-3xf` | jules@vandalway.example | `tests/unit/still-here-3xf-certificate-data.test.ts` · `e2e/specs/still-here-3xf-certificate.spec.ts` |
| E4 | `still-here-cq5` | jules@vandalway.example | `tests/unit/still-here-cq5-export.test.ts` · `e2e/specs/still-here-cq5-export.spec.ts` · `e2e/specs/still-here-cq5-walk.spec.ts` |
| E5 | `still-here-wlr` | jules@vandalway.example | `tests/unit/still-here-wlr-link.test.ts` · `e2e/specs/still-here-wlr-link.spec.ts` |
| E6 | `still-here-xws` | jules@vandalway.example | `tests/unit/still-here-xws-verify.test.ts` · `e2e/specs/still-here-xws-verify.spec.ts` · `e2e/specs/still-here-xws-walk.spec.ts` |
| E7 | `still-here-c29` | jules@vandalway.example | `tests/unit/still-here-c29-portfolio.test.ts` · `e2e/specs/still-here-c29-portfolio.spec.ts` · `e2e/specs/still-here-c29-walk.spec.ts` |
| S2 | `still-here-tul` | jules@vandalway.example | `tests/unit/still-here-tul-leadership.test.ts` · `e2e/specs/still-here-tul-leadership.spec.ts` · `e2e/specs/still-here-tul-walk.spec.ts` |
| S3 | `still-here-3yo` | petra@vandalway.example | `tests/unit/still-here-3yo-research.test.ts` · `e2e/specs/still-here-3yo-research.spec.ts` · `e2e/specs/still-here-3yo-walk.spec.ts` |
| S4 | `still-here-r4r` | jules@vandalway.example | `tests/unit/still-here-r4r-case-studies.test.ts` · `e2e/specs/still-here-r4r-case-studies.spec.ts` · `e2e/specs/still-here-r4r-walk.spec.ts` |
| S5 | `still-here-z4r` | martin@vandalway.example | `tests/unit/still-here-z4r-status.test.ts` · `e2e/specs/still-here-z4r-status.spec.ts` · `e2e/specs/still-here-z4r-walk.spec.ts` |
| S6 | `still-here-skd` | jules@vandalway.example | `tests/unit/still-here-skd-careers.test.ts` · `e2e/specs/still-here-skd-careers.spec.ts` · `e2e/specs/still-here-skd-walk.spec.ts` |
| S7 | `still-here-5ki` | jules@vandalway.example | `tests/unit/still-here-5ki-enterprise.test.ts` · `e2e/specs/still-here-5ki-enterprise.spec.ts` · `e2e/specs/still-here-5ki-walk.spec.ts` |
| S8 | `still-here-hng` | jules@vandalway.example | `tests/unit/still-here-hng-terms.test.ts` · `e2e/specs/still-here-hng-terms.spec.ts` |
| S9 | `still-here-eg4` | jules@vandalway.example | `tests/unit/still-here-eg4-privacy.test.ts` · `e2e/specs/still-here-eg4-privacy.spec.ts` |
| X1 | `still-here-q15` | jules@vandalway.example | `tests/unit/still-here-q15-presence.test.ts` · `e2e/specs/still-here-q15-presence.spec.ts` |
| X2 | `still-here-u67` | jules@vandalway.example | `tests/unit/still-here-u67-security-txt.test.ts` |
| X3 | `still-here-wha` | jules@vandalway.example | `tests/unit/still-here-wha-not-found.test.ts` · `e2e/specs/still-here-wha-not-found.spec.ts` · `e2e/specs/still-here-wha-walk.spec.ts` |
| X4 | `still-here-dzc` | jules@vandalway.example | `tests/unit/still-here-dzc-offline.test.ts` · `e2e/specs/still-here-dzc-offline.spec.ts` · `e2e/specs/still-here-dzc-walk.spec.ts` |
| X5 | `still-here-eli` | diane@vandalway.example | `tests/unit/still-here-eli-a11y-static.test.ts` · `e2e/specs/still-here-eli-a11y.spec.ts` |
| X6 | `still-here-xoi` | diane@vandalway.example | `tests/unit/still-here-xoi-guards.test.ts` · `e2e/specs/still-here-xoi-guards.spec.ts` |
| RC1 | `still-here-7i1` | martin@vandalway.example | `tests/unit/still-here-7i1-correspondence.test.ts` |
| RC2 | `still-here-8je` | bev@vandalway.example | `tests/unit/still-here-8je-inventory.test.ts` |
| RC3 | `still-here-1t0` | martin@vandalway.example | `tests/unit/still-here-1t0-status-records.test.ts` |
| RC4 | `still-here-17d` | susan@vandalway.example | `tests/unit/still-here-17d-gum-graph.test.ts` |
| RC5 | `still-here-zhf` | diane@vandalway.example | `tests/unit/still-here-zhf-papers.test.ts` |
| RC6 | `still-here-62x` | diane@vandalway.example | `tests/unit/still-here-62x-continuity.test.ts` |
| RC7 | `still-here-esz` | diane@vandalway.example | `tests/unit/still-here-esz-c3-packet.test.ts` |
| RC8 | `still-here-382` | jules@vandalway.example | `tests/unit/still-here-382-readme.test.ts` · `e2e/specs/still-here-382-walk.spec.ts` |
| V1 | `still-here-bdd` | jules@vandalway.example | `tests/unit/still-here-bdd-vandalway-final.test.ts` · `e2e/specs/still-here-bdd-vandalway.spec.ts` |
| V2 | `still-here-d7l` | jules@vandalway.example | `tests/unit/still-here-d7l-caddy-config.test.ts` · `e2e/specs/still-here-d7l-vandalway-internal.spec.ts` |
| V3 | `still-here-6t3` | jules@vandalway.example | `tests/unit/still-here-6t3-counter.test.ts` · `e2e/specs/still-here-6t3-counter.spec.ts` |
| V4 | `still-here-aqv` | jules@vandalway.example | `tests/unit/still-here-aqv-vandalway-http.test.ts` · `e2e/specs/still-here-aqv-walk.spec.ts` |
| L1 | `still-here-xg9` | jules@vandalway.example | `tests/unit/still-here-xg9-staging-config.test.ts` · `e2e/specs/still-here-xg9-staging.spec.ts` |
| L2 | `still-here-6m0` | jules@vandalway.example | `tests/unit/still-here-6m0-workflow.test.ts` |
| L3 | `still-here-5v0` | jules@vandalway.example | `tests/unit/still-here-5v0-dns-prep.test.ts` |
| L4 | `still-here-48f` | diane@vandalway.example | `tests/unit/still-here-48f-release-scan.test.ts` |
| L5 | `still-here-bhe` | diane@vandalway.example | `tests/unit/still-here-bhe-c4-packet.test.ts` · `e2e/specs/still-here-bhe-walk.spec.ts` |
| N1 | `still-here-kdn` | jules@vandalway.example | `tests/unit/still-here-kdn-pages-api.test.ts` · `e2e/specs/still-here-kdn-production.spec.ts` |
| N2 | `still-here-vi0` | jules@vandalway.example | `tests/unit/still-here-vi0-vandalway-dns.test.ts` · `e2e/specs/still-here-vi0-walk.spec.ts` |
| N3 | `still-here-tfr` | diane@vandalway.example | `tests/unit/still-here-tfr-post-launch.test.ts` · `e2e/specs/still-here-tfr-walk.spec.ts` |

## Changelog

- 2026-10-03 — Written at G0: 53 beads filed. (Jules, 2026-10-03)
