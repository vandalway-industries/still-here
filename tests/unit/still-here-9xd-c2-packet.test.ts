// DS7 (still-here-9xd) — the C2 packet.
// garage/pack/ACCEPTANCE.md § DS7, items 1–2. Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { abs, read, readMust } from '../helpers/repo.ts';

const PACKET = 'docs/checkpoints/c2-packet.md';
const CANDIDATES = ['certificate.png', 'certificate.pdf', 'home-390.png', 'home-1440.png', 'leadership-1440.png', 'vandalway-1997.png'];

/** The questions put to Clive at C2 (CHECKPOINTS.md § C2's row, "Questions put to him: …"). */
function c2Questions(): string[] {
  const row = read('garage/pack/CHECKPOINTS.md').split('\n').find((l) => l.startsWith('| **C2'))!;
  const q = row.split('Questions put to him:')[1].split('(The check symbol')[0];
  return q.split(/(?<=\?)\s+/).map((s) => s.trim()).filter((s) => s.endsWith('?'));
}

test('1. the packet links every candidate file and lists the C2 questions for each', () => {
  const md = readMust(PACKET);
  const links = [...md.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1]);
  for (const c of CANDIDATES) {
    const l = links.find((x) => x.endsWith(`candidates/${c}`));
    assert.ok(l, `the packet links candidates/${c}`);
    assert.ok(existsSync(join(dirname(abs(PACKET)), l!)), `${l} resolves`);
  }
  const qs = c2Questions();
  assert.equal(qs.length, 4, 'four C2 questions in CHECKPOINTS.md');
  for (const q of qs) assert.ok(md.includes(q), `the packet asks: ${q}`);
});

test('2. it reports the turns used in Phases 0 and 1', () => {
  const md = readMust(PACKET);
  for (const phase of ['Phase 0', 'Phase 1']) {
    const line = md.split('\n').find((l) => l.includes(phase) && /turn/i.test(l) && /\b\d+\b/.test(l.replace(phase, '')));
    assert.ok(line, `turns used in ${phase}`);
  }
});
