// The certificate identifier (PRD R17–R19; Branch B; the check symbol per I-12). The one module the
// site and the records check (RC6) both import; the Crockford alphabet is written here and nowhere
// else under src/, scripts/ or deploy/.
//
//   canonicalize(name) → string
//       NFC, trimmed, internal whitespace collapsed to one space, lower-case.
//   makeIdentifier(name, time) → Promise<string>
//       'SH-XXXX-XXXX-XXXX'. time is a Date; only its whole second counts. The 12 symbols are
//       7 for the seconds since 2026-01-01T00:00:00Z, 4 for the first 20 bits of
//       SHA-256(canonical name + '|' + those 7 symbols), and Crockford's mod-37 check symbol over
//       the 11 before it (which may be one of * ~ $ = U). Throws a RangeError for a time before
//       2026 or past what seven symbols hold.
//   parseIdentifier(text) → { body, check, time } | null
//       Reads what a person types: any case, I and L as 1, O as 0, hyphens anywhere, with or
//       without 'SH-'. body is the 11 symbols, check the check symbol, time the issue Date from the
//       first seven. null when malformed or when the check symbol does not match.
//
// Hashing uses crypto.subtle, present in every browser we support and in Node. (Jules, 2026-10-04)

const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const CHECK_ALPHABET = `${ALPHABET}*~$=U`;
const EPOCH = Date.UTC(2026, 0, 1);
const TIME_SYMBOLS = 7;
const MAX_SECONDS = 32 ** TIME_SYMBOLS - 1;

export function canonicalize(name) {
  return String(name).normalize('NFC').trim().replace(/\s+/gu, ' ').toLowerCase();
}

function encode(n, len) {
  let s = '';
  for (let i = 0; i < len; i++) {
    s = ALPHABET[n % 32] + s;
    n = Math.floor(n / 32);
  }
  return s;
}

/** Crockford's check symbol: the body's value mod 37, taken digit by digit. */
function checkSymbol(body) {
  let r = 0;
  for (const ch of body) r = (r * 32 + ALPHABET.indexOf(ch)) % 37;
  return CHECK_ALPHABET[r];
}

const format = (s) => `SH-${s.slice(0, 4)}-${s.slice(4, 8)}-${s.slice(8, 12)}`;

export async function makeIdentifier(name, time) {
  const ms = time instanceof Date ? time.getTime() : new Date(time).getTime();
  const secs = Math.floor((ms - EPOCH) / 1000);
  if (!Number.isFinite(secs) || secs < 0 || secs > MAX_SECONDS) throw new RangeError('the time is outside what an identifier can record');
  const ts = encode(secs, TIME_SYMBOLS);
  const data = new TextEncoder().encode(`${canonicalize(name)}|${ts}`);
  const h = new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256', data));
  const bits = (h[0] << 12) | (h[1] << 4) | (h[2] >> 4);
  const body = ts + encode(bits, 4);
  return format(body + checkSymbol(body));
}

export function parseIdentifier(text) {
  if (typeof text !== 'string') return null;
  let s = text.trim().replace(/-/g, '').toUpperCase();
  if (s.length === 14 && s.startsWith('SH')) s = s.slice(2);
  if (s.length !== 12) return null;
  const read = (ch) => (ch === 'I' || ch === 'L' ? '1' : ch === 'O' ? '0' : ch);
  const body = [...s.slice(0, 11)].map(read).join('');
  const check = read(s[11]);
  if ([...body].some((ch) => !ALPHABET.includes(ch)) || !CHECK_ALPHABET.includes(check)) return null;
  if (checkSymbol(body) !== check) return null;
  let secs = 0;
  for (const ch of body.slice(0, TIME_SYMBOLS)) secs = secs * 32 + ALPHABET.indexOf(ch);
  return { body, check, time: new Date(EPOCH + secs * 1000) };
}
