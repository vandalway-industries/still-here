// RC8 (still-here-382) — the repository as a reader finds it. garage/pack/ACCEPTANCE.md § RC8,
// items 1–4 (W9, played on the rendered Markdown, is e2e/specs/still-here-382-walk.spec.ts).
// Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { abs, read, readMust, run } from '../helpers/repo.ts';
import { localPath } from '../helpers/local-env.ts';

test("1. README.md: what STILL HERE is, how to run and test it, the map, the licences", () => {
  const md = readMust('README.md');
  assert.match(md, /STILL HERE/);
  for (const cmd of ['npm ci', 'npm run build', 'npm run serve', 'npm test', 'npm run e2e']) assert.ok(md.includes(cmd), `README: ${cmd}`);
  const pkg = JSON.parse(read('package.json'));
  for (const s of ['build', 'serve', 'test', 'e2e']) assert.ok(pkg.scripts?.[s], `package.json has the "${s}" script the README names`);
  for (const p of ['src/', 'site/', 'vandalwayind/', 'company/', 'PRD.md', 'PLAN.md', 'DESIGN.md', 'garage/', 'deploy/', 'tests/', 'e2e/']) assert.ok(md.includes(p), `the map names ${p}`);
  assert.match(md, /licen[cs]e/i);
  assert.match(md, /SIL Open Font License|OFL/, 'the fonts\' licence');
});

test('2. company/README.md: every record set with folder, format and schema; loading the tracker with bd import', () => {
  const md = readMust('company/README.md');
  for (const [set, folder] of [
    ['tracker', 'tracker/'],
    ['correspondence', 'correspondence/'],
    ['chat', 'chat/'],
    ['notes', 'notes/'],
    ['calendar', 'calendar/'],
    ['certificates', 'certificates/'],
    ['status', 'status/'],
    ['inventory', 'inventory/'],
    ['gum graph', 'gum-graph/'],
    ['research', 'research/'],
    ['staff', 'staff/'],
  ]) {
    const line = md.split('\n').find((l) => new RegExp(set, 'i').test(l) && l.includes(folder));
    assert.ok(line, `${set}: its folder`);
  }
  for (const schema of ['tracker/schema.json', 'inventory/schema.json', 'status/status-updates.xsd', 'status/notes.xsd']) assert.ok(md.includes(schema), `the schema ${schema}`);
  assert.match(md, /bd import/);
});

test('3. every relative link in both READMEs resolves', () => {
  for (const f of ['README.md', 'company/README.md']) {
    const md = read(f);
    for (const m of md.matchAll(/\]\(([^)\s]+)\)/g)) {
      const l = m[1].split('#')[0];
      if (!l || /^[a-z]+:/.test(l)) continue;
      assert.ok(existsSync(join(dirname(abs(f)), l)), `${f}: ${m[1]}`);
    }
  }
});

test('4. neither README explains how the company or its story was made; the names grep and the PII gate pass on both', () => {
  const files = ['README.md', 'company/README.md'];
  for (const f of files) assert.doesNotMatch(read(f), /\b(fictional|fiction|invented|made[- ]up|parody|satire|worldbuilding|language model|AI[- ]generated|sample data|role[- ]?play)\b/i, f);
  const deny = localPath('FACTORY_PII_DENYLIST_PUBLIC');
  assert.ok(existsSync(deny), 'the public-tier denylist is readable');
  const names = readFileSync(deny, 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  for (const f of files) for (const n of names) assert.ok(!read(f).toLowerCase().includes(n.toLowerCase()), `${f} names someone from outside the company`);
  const gate = join(localPath('FACTORY_DIR'), 'scripts/pii-gate.sh');
  const allow = read('.git/hooks/pre-commit').match(/PII_ALLOW_REGEX='([^']+)'/)?.[1] ?? '';
  for (const f of files) {
    const r = run(gate, ['--tree', abs(f)], { env: { PII_PUBLIC: '1', PII_ALLOW_REGEX: allow } });
    assert.equal(r.status, 0, `${f}: ${r.stdout}${r.stderr}`);
  }
});
