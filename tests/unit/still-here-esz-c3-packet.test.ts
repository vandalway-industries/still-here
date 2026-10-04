// RC7 (still-here-esz) — the C3 packet. garage/pack/ACCEPTANCE.md § RC7, items 1–3.
// Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import * as S from '../../e2e/helpers/strings.ts';
import { abs, files, read, readMust, TEXT_EXT } from '../helpers/repo.ts';

const PACKET = 'docs/checkpoints/c3-packet.md';
const links = (md: string) => [...md.matchAll(/\]\(([^)\s]+)\)/g)].map((m) => m[1].split('#')[0]).filter((l) => !/^[a-z]+:/.test(l));
const resolved = (l: string) => join(dirname(abs(PACKET)), l);

/** PRD § Acceptance criteria, HUMAN-JUDGED: the items C3 judges. */
function c3Items(): string[] {
  const prd = read('PRD.md');
  const line = prd.split('**HUMAN-JUDGED, and where:**')[1];
  const c3 = line.split('**C2**,')[1].split('— **C3**')[0];
  const after = c3.slice(c3.indexOf('.') + 1);
  return after
    .split(/,|\band\b/)
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .filter((s) => s.length > 3);
}

test('1. every HUMAN-JUDGED item PRD assigns to C3, each with the file and line or page where it lives', () => {
  const md = readMust(PACKET);
  const items = c3Items();
  assert.ok(items.length >= 10, `C3's items read from PRD.md (${items.length})`);
  for (const item of items) {
    const line = md.split('\n').find((l) => l.toLowerCase().includes(item.toLowerCase()));
    assert.ok(line, `the packet lists: ${item}`);
    assert.match(line!, /\]\([^)]+\)|`[\w./-]+(:\d+)?`|\/[a-z-]+/, `${item}: where it lives`);
  }
});

test('2. every authored text file under company/ and every page copy source under src/content/ is linked', () => {
  const md = readMust(PACKET);
  const linked = new Set(links(md).map((l) => resolved(l)));
  for (const l of links(md)) assert.ok(existsSync(resolved(l)), `${l} resolves`);
  const authored = files('company', TEXT_EXT).filter((f) => !/schema\.json$|\.xsd$/.test(f));
  const copy = files('src/content');
  assert.ok(copy.length > 0, 'src/content/ holds the pages\' copy');
  for (const f of [...authored, ...copy]) assert.ok(linked.has(abs(f)), `the packet links ${f}`);
});

test('3. the calls C3 judges, and for each locked string a red-pen could change, the test file that holds it', () => {
  const md = readMust(PACKET);
  assert.match(md, /testimonial/i);
  assert.match(md, /photograph placement/i);
  assert.match(md, /\bs07\b/);
  const tests = [...files('tests/unit', /\.test\.ts$/), ...files('e2e/specs', /\.spec\.ts$/), 'e2e/helpers/strings.ts'];
  const strings = Object.values(S).flatMap((v) => (typeof v === 'string' ? [v] : Array.isArray(v) ? v.flat().filter((x): x is string => typeof x === 'string') : [])).filter((s) => s.length > 12 && !/^https?:|^\//.test(s));
  for (const s of strings) {
    const line = md.split('\n').find((l) => l.includes(s));
    assert.ok(line, `the packet lists the locked string: ${s.slice(0, 60)}`);
    const held = (line!.match(/(?:tests\/unit|e2e\/(?:specs|helpers))\/[\w.-]+\.ts/g) ?? []).filter((f) => tests.includes(f));
    assert.ok(held.length > 0 && held.every((f) => read(f).includes(s) || f === 'e2e/helpers/strings.ts'), `"${s.slice(0, 40)}": the test file that holds it`);
  }
});
