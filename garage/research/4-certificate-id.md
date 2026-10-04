---
updated: 2026-10-03
read_by: the handoff author (stage 8) and the build-readiness auditor (stage 9); the PLAN gate
relations:
  derived_from: garage/BRAINSTORM.md
---

# R4 — The certificate identifier: short, readable, typo-catching, computed in the browser

> Research item R4. Q7 sets the contract: a "Verify a certificate" page recomputes the identifier
> from the object name and timestamp; a mismatch gets "We could not locate this certificate. The
> object, however, is still here."; the identifier "catches typos and casual edits, and it can be
> forged by anyone who reads the code," and the legal page says so. This file supplies the
> alphabet, the check symbol, and the arithmetic. (Petra, 2026-10-03)

## Requirements, restated precisely

1. **Readable aloud and by eye:** no characters that are confused with one another.
2. **Typo-catching:** detect every single-character substitution and every swap of two adjacent
   characters (the two commonest transcription errors). "Most" is not "every"; I distinguish them below.
3. **Deterministic in the browser** from object name and timestamp, so the Verify page needs no server.
4. **Short.** Under about 16 characters including separators.

## Alphabet: Crockford Base32

Crockford's Base32 uses "10 digits and 22 letters," excluding `I L O U` [1]. When decoding,
lower case is accepted, `i` and `l` are read as `1`, `o` as `0`, and hyphens are ignored [1].
A visitor who types `o` for `0` is therefore not making an error at all. Its stated aims include
being "human readable and machine readable" and pronounceable over a telephone [1].

## The check symbol: three candidates, tested

I implemented each over the Crockford alphabet and tested 3,000 random 10-symbol identifiers with
every possible single substitution and every adjacent swap (script run 2026-10-03). I then tested
the two algebraic schemes exhaustively over every symbol pair and position.

| Scheme | Specification | Single substitutions missed | Adjacent swaps missed | Extra symbols |
|---|---|---|---|---|
| **Crockford mod 37** | Check = the number mod 37, one symbol from 37; five extra symbols `* ~ $ = U` for values 32–36 [1] | 0 of 1,038,000 | 0 of 29,050 | Yes: in my sample 13.5% of identifiers end in one of `* ~ $ = U` |
| Luhn mod N (N = 32) | Generalized Luhn; requires even N [2] | 0 of 1,023,000 | 69 of 29,071, all the pair `0`/`Z` | No |
| Damm over a quasigroup of order 32 | Damm's method detects all single errors and adjacent transpositions [3]; totally anti-symmetric quasigroups exist for all orders except 2 and 6 [3] | 0 of 1,023,000 | 0 of 29,088 | No |

Two things are derivations rather than citations, and I label them so:

- **Why Crockford mod 37 catches every adjacent swap.** The spec says only that the check is the
  value mod 37, "37 being the least prime number greater than 32" [1]. Swapping symbols *a* and *b*
  at positions *i*, *i*+1 changes the value by (a−b)·32ⁱ·31. With 37 prime and 0 < |a−b| < 32, that
  is never 0 mod 37, so the swap is always caught. A substitution changes it by (a−b)·32ⁱ, also never
  0. Checked exhaustively: no violations.
- **The order-32 Damm table.** Damm's published examples are order 10 [3]. An order-32 table can be
  built over the finite field GF(32), x∘y = 2·x ⊕ y with the polynomial x⁵+x²+1. It is a Latin
  square and totally anti-symmetric (exhaustive check over all 32³ triples: 0 violations). The
  construction is mine, not taken from a published specification. Anyone adopting it should ship
  fixed test vectors.

Luhn mod N's blind spot is documented: it misses the swap of the first and last valid characters
[2], which over this alphabet is `0`↔`Z`. My test found exactly that pair and no other.

## Making the identifier (two branches; the author chooses)

Both branches canonicalize the name the same way: Unicode NFC, trim, collapse internal whitespace,
lower-case. So `"folding  CHAIR "` and `"Folding chair"` produce the same identifier. Whether
case should matter is a product question; I chose case-insensitive here because Verify asks a
visitor to retype the name. Hashing uses SHA-256 through `crypto.subtle.digest` [4], which is
available only in secure contexts (HTTPS or localhost) [4]. R3 carries the consequence for staging.

**Branch A — the identifier is a pure checksum.** `SH-` + the first 10 Crockford symbols of
SHA-256(canonical name + `|` + ISO-8601 UTC timestamp to the second) + check symbol. 50 bits.
Verify needs the name *and* the timestamp, both printed on the certificate.

**Branch B — the identifier carries its own date.** 7 symbols encode seconds since
2026-01-01T00:00:00Z (32⁷ seconds is about 1,089 years), then 4 symbols of SHA-256(canonical name +
`|` + those 7 symbols), then the check. Verify needs only the identifier and the name, and can print
"on …" from the identifier itself, which is the sentence Q7 asks for. Cost: identifiers issued close
together share a prefix (`SH-00PP-…`), and a wrong name passes by chance about once in 2²⁰ ≈ 1
million attempts.

Test vectors (computed in Node 24 with the same Web Crypto API browsers expose; check symbol
Crockford mod 37):

| Name | Timestamp (UTC) | Branch A | Branch B |
|---|---|---|---|
| `Folding chair` | 2026-10-03T10:52:00Z | `SH-P2D66-06QXG-X` | `SH-00PP-9AGR-1GTB` |
| `folding  CHAIR ` | 2026-10-03T10:52:00Z | `SH-P2D66-06QXG-X` | `SH-00PP-9AGR-1GTB` |
| `Memorial bench` | 2026-10-03T10:52:01Z | `SH-QK2XR-RNBJB-*` | `SH-00PP-9AHN-M3JT` |
| `The Moon` | 2026-10-03T10:52:00Z | `SH-P5NP4-CNE0R-=` | `SH-00PP-9AG8-3CK2` |

Note the `*` and `=` in Branch A. That is what the extra check symbols look like on a real
certificate.

On collisions: the identifier is never looked up, only recomputed, so two certificates sharing an
identifier breaks nothing. For scale, Branch A's 50 bits reach a 50% chance of *any* shared pair at
about 40 million certificates (birthday bound, my arithmetic).

## Recommendation

**Crockford Base32 with Crockford's mod-37 check symbol, in Branch B form.** The alphabet and the
check come from one published specification [1], and every single substitution and adjacent swap
is caught (derived and tested above). Branch B lets Verify state the issue date from the identifier
alone. Trade-offs:

- About one identifier in seven ends in `* ~ $ = U`. That is legitimate per the spec, but `$` and
  `=` look odd on a certificate and need URL encoding if the identifier goes in a link. If the
  design cannot accept them, use **Damm over GF(32)** (same guarantees, no extra symbols, but a
  construction with no published spec behind it). Luhn mod 32 is published but misses the `0`/`Z`
  swap.
- Branch A is simpler to explain and reveals nothing (the timestamp is printed anyway). It makes
  Verify ask for two fields instead of one.
- Neither branch is security. Q7 already says so, and the legal page will.

## Sources

1. Douglas Crockford, "Base 32" — https://www.crockford.com/base32.html
2. Wikipedia, "Luhn mod N algorithm" — https://en.wikipedia.org/wiki/Luhn_mod_N_algorithm
3. Wikipedia, "Damm algorithm" (citing H. M. Damm, *Totally anti-symmetric quasigroups*, dissertation, Philipps-Universität Marburg, 2004, and Damm 2007 on existence for all orders n ≠ 2, 6) — https://en.wikipedia.org/wiki/Damm_algorithm
4. MDN, SubtleCrypto (secure-context only) and `SubtleCrypto.digest()` — https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto ; https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest

## Changelog

- 2026-10-03 — Written: three check schemes tested by brute force and exhaustive algebra; two identifier forms with test vectors; Crockford mod 37 in the date-bearing form recommended. (Petra, 2026-10-03)
