// L5 (still-here-bhe) — staging walked; the C4 packet. garage/pack/ACCEPTANCE.md § L5, items 1–3
// (the walks themselves are e2e/specs/still-here-bhe-walk.spec.ts). Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { PAGES } from '../../e2e/helpers/strings.ts';
import { abs, beadIds, read, readMust, sh } from '../helpers/repo.ts';

const PACKET = 'docs/checkpoints/c4-packet.md';

/** Every step of W1–W9 in WALKS.md, as "W1.1", …, and the W4 sub-walks. */
function steps(): string[] {
  const out: string[] = [];
  let walk = '';
  for (const line of read('garage/pack/WALKS.md').split('\n')) {
    const h = /^## (W\d)\b/.exec(line);
    if (h) walk = h[1];
    else if (/^## /.test(line)) walk = '';
    const s = /^(\d+)\. /.exec(line);
    if (walk && s && walk !== 'W0') out.push(`${walk}.${s[1]}`);
    const sub = /^- \*\*(W4\.[a-z-]+)/.exec(line);
    if (sub) out.push(sub[1]);
  }
  return out;
}

test('1. W1–W9 played on staging in Chromium and WebKit at both sizes, each step "played" or "played (substitute)"', () => {
  const md = readMust(PACKET);
  const all = steps();
  assert.ok(all.length >= 50, `${all.length} steps in WALKS.md`);
  for (const s of all) {
    const line = md.split('\n').find((l) => new RegExp(`(^|[^\\d.])${s.replace('.', '\\.')}(?![\\d])`).test(l));
    assert.ok(line, `${s} is reported`);
    assert.match(line!, /played \(substitute\)|\bplayed\b|awaiting phone/, `${s}: played, played (substitute), or awaiting phone for a † step`);
  }
  for (const e of ['Chromium', 'WebKit', '390', '1440']) assert.ok(md.includes(e), e);
});

test('2. every bead filed from C3\'s red-pens is closed', () => {
  assert.match(read('garage/pack/CHECKPOINTS.md').split('## Record')[1] ?? '', /\*\*C3\b/, 'C3 is recorded');
  const beads: { id: string; status: string; labels?: string[] }[] = JSON.parse(sh('bd', ['--readonly', 'list', '--all', '--limit', '0', '--json']));
  const open = beads.filter((b) => (b.labels ?? []).includes('c3-red-pen') && b.status !== 'closed');
  assert.deepEqual(open.map((b) => b.id), []);
});

test('3. the packet: ordered commits, pass/fail per bead, critic reports, screenshots of every page, the phone checklist, turns per phase, the calls since C3', () => {
  const md = readMust(PACKET);
  assert.ok((md.match(/\b[0-9a-f]{7,40}\b/g) ?? []).length >= 10, 'the ordered commits');
  for (const [label, id] of beadIds()) assert.match(md, new RegExp(`${id}[^\\n]*\\b(pass|fail|PASS|FAIL)\\b|${label}\\b[^\\n]*\\b(pass|fail|PASS|FAIL)\\b`), `${label} (${id}): pass or fail`);
  const links = [...md.matchAll(/\]\(([^)\s]+)\)/g)].map((m) => m[1]);
  for (const l of links.filter((x) => !/^[a-z]+:/.test(x))) assert.ok(existsSync(join(dirname(abs(PACKET)), l.split('#')[0])), `${l} resolves`);
  assert.ok(links.some((l) => /critic/i.test(l)), 'the critic reports');
  for (const p of PAGES) assert.ok(links.some((l) => /\.png$/.test(l) && l.includes(p.path === '/' ? 'home' : p.path.replace(/^\/|\/$/g, '').replace(/\//g, '-'))), `a screenshot of ${p.path}`);
  assert.match(md, /phone checklist/i);
  assert.match(md, /internal network/i, 'the note that the phone must be on the internal network');
  for (let ph = 0; ph <= 7; ph++) assert.match(md, new RegExp(`Phase ${ph}\\b[^\\n]*\\b\\d+\\b[^\\n]*turn|turns?[^\\n]*Phase ${ph}\\b[^\\n]*\\b\\d+`, 'i'), `turns used in Phase ${ph}`);
  assert.match(md, /calls? (made )?(under a rule )?since C3/i, 'the queue of calls since C3');
});
