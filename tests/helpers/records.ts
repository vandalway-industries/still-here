// The company's records under company/, read the way the RC beads check them: which ids are
// defined where, which ids a text cites, mail headers, tracker comments, and the continuity
// fixture's phrase hashing. Locked at specs-v1. (Diane, 2026-10-04)
import { createHash } from 'node:crypto';
import { files, frontMatter, read } from './repo.ts';
import { records } from './seeds.ts';

export const ID_RE = /\b(?:MAIL|EXP|SUPPORT|CHAT|FAC|INC|STATUS|CAL|RESEARCH|NOTE|QA|CERT|ISSUE|OBS)-\d{3}\b|\bsh-\d{3}\b/g;

export type Issue = { title: string; description: string; created_at: string; created_by: string; external_ref: string; labels: string[]; status: string };

export function tracker(): Issue[] {
  return read('company/tracker/tracker.jsonl')
    .split('\n')
    .filter(Boolean)
    .map((l) => JSON.parse(l));
}

/** Comments in a tracker description: `**Name** (id) · YYYY-MM-DD` then the text. */
export function comments(issue: Issue): { author: string; date: string; text: string }[] {
  const parts = issue.description.split(/\n\*\*[^*]+\*\* \((\w+)\) · (\d{4}-\d\d-\d\d)[^\n]*\n/);
  const out: { author: string; date: string; text: string }[] = [];
  for (let i = 1; i + 2 < parts.length + 1; i += 3) out.push({ author: parts[i], date: parts[i + 1], text: (parts[i + 2] ?? '').trim() });
  return out;
}

/** Every id some record defines: file stems, front-matter ids, XML id attributes, JSON ids, tracker refs, Message-IDs. */
export function definedIds(): { ids: Set<string>; messageIds: Set<string> } {
  const ids = new Set<string>();
  const messageIds = new Set<string>();
  for (const f of files('company')) {
    const stem = f.split('/').pop()!.replace(/\.[^.]+$/, '');
    for (const m of stem.matchAll(ID_RE)) ids.add(m[0]);
    const t = read(f);
    for (const m of t.matchAll(/\bid="([^"]+)"/g)) ids.add(m[1]);
    for (const m of t.matchAll(/^id:\s*["']?([A-Za-z]+-\d{3})/gm)) ids.add(m[1]);
    for (const m of t.matchAll(/"id"\s*:\s*"([A-Za-z]+-\d{3})"/g)) ids.add(m[1]);
    for (const m of t.matchAll(/^(?:message-id|message_id)\s*:\s*["']?(<[^>\s]+>)/gim)) messageIds.add(m[1]);
  }
  for (const i of tracker()) ids.add(i.external_ref);
  // records the tracker holds as issues (CONTENT_SEEDS.md § Records: "tracker (sh-051)")
  for (const r of records()) {
    const m = /^tracker \((sh-\d{3})\)$/.exec(r.path);
    if (m && ids.has(m[1])) ids.add(r.id);
  }
  return { ids, messageIds };
}

export function cited(text: string): string[] {
  return [...new Set([...text.matchAll(ID_RE)].map((m) => m[0]))];
}

/** Mail headers, from front matter (any case) or RFC 5322 lines at the top. */
export function headers(text: string): Record<string, string> {
  const out: Record<string, string> = {};
  const fm = frontMatter(text).data as Record<string, unknown>;
  for (const [k, v] of Object.entries(fm)) out[k.toLowerCase().replace(/_/g, '-')] = Array.isArray(v) ? v.join(', ') : String(v);
  if (!Object.keys(out).length) {
    for (const line of text.split('\n')) {
      const m = /^([A-Za-z-]+):\s*(.*)$/.exec(line);
      if (!m) break;
      out[m[1].toLowerCase()] = m[2];
    }
  }
  return out;
}

// ── The continuity fixture (CONTENT_SEEDS.md § Continuity fixture) ──────────────────────────────
export function fixture(): { salt: string; confidential: string[]; 'unknown-to-staff': string[] } {
  return JSON.parse(read('tests/fixtures/continuity-hashes.json'));
}

export function normalize(text: string): string {
  return text
    .normalize('NFC')
    .toLowerCase()
    .replace(/[’ʼ]/g, "'")
    .replace(/[^\p{L}\p{Nd}']+/gu, ' ')
    .replace(/ +/g, ' ')
    .trim();
}

/** Every two- and three-word phrase of a text, hashed with the fixture's salt. */
export function phraseHashes(text: string, salt: string): Set<string> {
  const w = normalize(text).split(' ').filter(Boolean);
  const out = new Set<string>();
  for (let i = 0; i < w.length; i++) {
    for (const n of [2, 3]) {
      if (i + n > w.length) continue;
      out.add(createHash('sha256').update(`${salt}\n${w.slice(i, i + n).join(' ')}`, 'utf8').digest('hex'));
    }
  }
  return out;
}
