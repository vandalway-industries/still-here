// Reference arithmetic for the tests: the identifier as CONTENT_SEEDS.md § Identifier vectors
// constructs it, the download filename rule, the certificate link (D2) and the date formats.
// This is the tests' own reimplementation, kept apart from src/ on purpose: it reproduces every
// published and derived vector (tests/unit/*-identifier.test.ts checks that it does), so a test can
// compute the identifier a page should print for any name and second. It is never shipped.
// (Diane, 2026-10-04)
import { createHash } from 'node:crypto';

export const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
export const CHECK_ALPHABET = `${ALPHABET}*~$=U`;
export const EPOCH = Date.UTC(2026, 0, 1);

/** NFC, trim, collapse internal whitespace, lower-case (PRD R17). */
export function canonical(name: string): string {
  return name.normalize('NFC').trim().replace(/\s+/gu, ' ').toLowerCase();
}

function encode(n: number, len: number): string {
  let s = '';
  for (let i = 0; i < len; i++) {
    s = ALPHABET[n % 32] + s;
    n = Math.floor(n / 32);
  }
  return s;
}

export function checkSymbol(body: string): string {
  let v = 0n;
  for (const ch of body) v = v * 32n + BigInt(ALPHABET.indexOf(ch));
  return CHECK_ALPHABET[Number(v % 37n)];
}

/** The identifier for a name issued at `time` (the second is taken, the rest dropped). */
export function identifier(name: string, time: Date | string | number): string {
  const ms = new Date(time).getTime();
  const secs = Math.floor((ms - EPOCH) / 1000);
  if (secs < 0) throw new Error('before 2026-01-01');
  const ts = encode(secs, 7);
  const h = createHash('sha256').update(`${canonical(name)}|${ts}`, 'utf8').digest();
  const bits = (h[0] << 12) | (h[1] << 4) | (h[2] >> 4);
  const body = ts + encode(bits, 4);
  const full = body + checkSymbol(body);
  return `SH-${full.slice(0, 4)}-${full.slice(4, 8)}-${full.slice(8, 12)}`;
}

/** The 11 symbols between `SH-` and the check symbol, hyphens removed. */
export function body(id: string): string {
  return id.replace(/^SH-/, '').replace(/-/g, '').slice(0, 11);
}

/** The issue time encoded in an identifier's first seven symbols. */
export function issued(id: string): Date {
  const b = body(id);
  let secs = 0;
  for (const ch of b.slice(0, 7)) secs = secs * 32 + ALPHABET.indexOf(ch);
  return new Date(EPOCH + secs * 1000);
}

/** Download filename slug (CONTENT_SEEDS.md § Download filenames). */
export function slug(name: string): string {
  let s = canonical(name)
    .normalize('NFKD')
    .replace(/\p{M}+/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (s.length > 40) {
    const cut = s.slice(0, 41).lastIndexOf('-');
    s = cut > 0 ? s.slice(0, cut) : s.slice(0, 40);
    s = s.replace(/-+$/g, '');
  }
  return s || 'object';
}

export function filename(name: string, id: string, ext: 'pdf' | 'png'): string {
  return `STILL-HERE-${slug(name)}-${body(id)}.${ext}`;
}

export function base64url(text: string): string {
  return Buffer.from(text, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function fromBase64url(text: string): string {
  return Buffer.from(text.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
}

/** The certificate link's fragment (D2): `<identifier>.<base64url of the name as typed>.<IANA zone>`. */
export function fragment(id: string, name: string, zone: string): string {
  return `${id}.${base64url(name)}.${zone}`;
}

export function link(origin: string, id: string, name: string, zone: string): string {
  return `${origin}/c/#${fragment(id, name, zone)}`;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function parts(time: Date | string, zone: string) {
  const f = new Intl.DateTimeFormat('en-GB', {
    timeZone: zone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });
  const p = Object.fromEntries(f.formatToParts(new Date(time)).map((x) => [x.type, x.value]));
  return { day: Number(p.day), month: MONTHS[Number(p.month) - 1], year: p.year, hh: p.hour, mm: p.minute, ss: p.second };
}

/** Result screen: "3 October 2026, 05:52:00". */
export function resultDate(time: Date | string, zone: string): string {
  const p = parts(time, zone);
  return `${p.day} ${p.month} ${p.year}, ${p.hh}:${p.mm}:${p.ss}`;
}

/** Confirmation sentence: "Issued by STILL HERE for '<name>' on 3 October 2026 at 05:52:00 (America/Chicago)." */
export function confirmation(name: string, time: Date | string, zone: string): string {
  const p = parts(time, zone);
  return `Issued by STILL HERE for '${name}' on ${p.day} ${p.month} ${p.year} at ${p.hh}:${p.mm}:${p.ss} (${zone}).`;
}

/** Portfolio entry: "3 October 2026, 05:52 · America/Chicago". */
export function portfolioDate(time: Date | string, zone: string): string {
  const p = parts(time, zone);
  return `${p.day} ${p.month} ${p.year}, ${p.hh}:${p.mm} · ${zone}`;
}

/** Local "HH:MM:SS" in a zone. */
export function localTime(time: Date | string, zone: string): string {
  const p = parts(time, zone);
  return `${p.hh}:${p.mm}:${p.ss}`;
}

/** The certificate's UTC line: "Recorded 2026-10-03 10:52:00 UTC". */
export function utcLine(time: Date | string): string {
  return `Recorded ${new Date(time).toISOString().slice(0, 19).replace('T', ' ')} UTC`;
}

/** Every single substitution and adjacent swap of a printed identifier (hyphens kept in place). */
export function mutations(id: string): string[] {
  const plain = id.replace(/^SH-/, '').replace(/-/g, '');
  const out = new Set<string>();
  const fmt = (s: string) => `SH-${s.slice(0, 4)}-${s.slice(4, 8)}-${s.slice(8, 12)}`;
  for (let i = 0; i < plain.length; i++) {
    const alpha = i === plain.length - 1 ? CHECK_ALPHABET : ALPHABET;
    for (const ch of alpha) if (ch !== plain[i]) out.add(fmt(plain.slice(0, i) + ch + plain.slice(i + 1)));
  }
  for (let i = 0; i + 1 < plain.length; i++) {
    if (plain[i] === plain[i + 1]) continue;
    out.add(fmt(plain.slice(0, i) + plain[i + 1] + plain[i] + plain.slice(i + 2)));
  }
  out.delete(id);
  return [...out];
}
