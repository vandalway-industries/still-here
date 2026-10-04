// Readers for garage/pack/CONTENT_SEEDS.md tables the tests compare against (the pack is the
// authority; these only parse it). Locked at specs-v1. (Diane, 2026-10-04)
import { read } from './repo.ts';

function section(title: string): string {
  const s = read('garage/pack/CONTENT_SEEDS.md');
  const i = s.indexOf(title);
  if (i < 0) throw new Error(`CONTENT_SEEDS.md has no ${title}`);
  return s.slice(i);
}

/** § Drafts judged at C2, **Leadership**: id, name, title, bio. */
export function leadership(): { id: string; name: string; title: string; bio: string }[] {
  const out: { id: string; name: string; title: string; bio: string }[] = [];
  for (const line of section('**Leadership**').split('\n')) {
    const m = /^\| (\w+) \| ([^|]+?) \| ([^|]+?) \| ([^|]+?) \|$/.exec(line);
    if (m && m[1] !== 'id') out.push({ id: m[1], name: m[2], title: m[3], bio: m[4] });
    if (out.length === 12) break;
  }
  return out;
}

/** § Records: id, path, format, when, author, phase, tracker. */
export function records(): { id: string; path: string; format: string; when: string; phase: string; tracker: string }[] {
  const out: { id: string; path: string; format: string; when: string; phase: string; tracker: string }[] = [];
  const body = section('## Records').split('\n## ')[0];
  for (const line of body.split('\n')) {
    const c = line.split('|').slice(1, -1).map((x) => x.trim());
    if (c.length !== 7 || c[0] === 'Id' || /^-+$/.test(c[0])) continue;
    out.push({ id: c[0], path: c[1], format: c[2], when: c[3], phase: c[5], tracker: c[6] });
  }
  return out;
}
