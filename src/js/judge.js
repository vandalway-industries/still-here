// The judgment of a certificate (PRD R21–R22, Q7, D3), shared by `/c/#…` and Verify. In order:
//   1. a malformed identifier (wrong length, a symbol outside the alphabet, a wrong check symbol)
//      → not located;
//   2. a name that is empty or over 80 code points, or whose hash does not match the identifier
//      (a wrong name, a typo, any altered symbol) → not located;
//   3. only then, an identifier dated more than five minutes past this device's clock → future;
//   4. otherwise → issued, at the second the identifier records.
// The identifier is read as a person types it (any case, O for zero, I and L for one, with or
// without SH-; identifier.js). The name is compared in its canonical form (identifier.js), so
// "folding chair" verifies "Folding chair"; the sentence quotes it as typed. (Jules, 2026-10-04)
import { makeIdentifier, parseIdentifier } from './identifier.js';

const MAX = 80;
export const FUTURE_SLACK = 5 * 60 * 1000;

/** The identifier as printed: SH-XXXX-XXXX-XXXX. */
export const printed = (p) => `SH-${p.body.slice(0, 4)}-${p.body.slice(4, 8)}-${p.body.slice(8, 11)}${p.check}`;

/** → { kind: 'not-located' } | { kind: 'future' } | { kind: 'issued', identifier, time } */
export async function judge(identifierText, name, now = Date.now()) {
  const parsed = parseIdentifier(String(identifierText));
  if (!parsed) return { kind: 'not-located' };
  const n = String(name);
  if (n.trim() === '' || [...n.normalize('NFC')].length > MAX) return { kind: 'not-located' };
  const identifier = printed(parsed);
  let made;
  try {
    made = await makeIdentifier(n, parsed.time);
  } catch {
    return { kind: 'not-located' };
  }
  if (made !== identifier) return { kind: 'not-located' };
  if (parsed.time.getTime() > now + FUTURE_SLACK) return { kind: 'future' };
  return { kind: 'issued', identifier, time: parsed.time };
}
