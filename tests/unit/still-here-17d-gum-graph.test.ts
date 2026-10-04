// RC4 (still-here-17d) — the gum graph. garage/pack/ACCEPTANCE.md § RC4, items 1–4.
// A concept is a Markdown file with front matter; its `type` names what it is. Edge concepts carry
// `observer` (or `recorded_by`), `date` (or `timestamp`) and `evidence` as record ids.
// Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { files, frontMatter, read, sh } from '../helpers/repo.ts';
import { definedIds } from '../helpers/records.ts';

type Concept = { file: string; data: Record<string, any>; body: string };
const concepts = (): Concept[] =>
  files('company/gum-graph', /\.md$/)
    .filter((f) => !/\/(index|log)\.md$/.test(f))
    .map((f) => ({ file: f, ...frontMatter(read(f)) }));
const typeOf = (c: Concept) => String(c.data.type ?? '').toLowerCase().replace(/\s+/g, '-');
const EDGES = ['observation', 'borrowing', 'reimbursement', 'access-request'];

test('1. company/gum-graph/ passes the OKF validator, --strict', () => {
  assert.match(sh('python3', ['tools/okf/okf_validate.py', 'company/gum-graph', '--strict']), /conformant/);
});

test('2. one concept per person; every edge its own concept of a stated type, with observer, date and evidence', () => {
  const all = concepts();
  const people = all.filter((c) => typeOf(c) === 'person');
  const ids = people.map((p) => p.data.person_id);
  assert.equal(new Set(ids).size, ids.length, 'one concept per person');
  const mentioned = new Set(all.flatMap((c) => [...c.body.matchAll(/\]\(\/people\/(\w+)\.md\)/g)].map((m) => m[1])));
  for (const m of mentioned) assert.ok(ids.includes(m), `${m} is linked and has a concept`);
  const edges = all.filter((c) => typeOf(c) !== 'person' && typeOf(c) !== 'claim');
  assert.ok(edges.length >= 15, 'the edges, each its own concept');
  const { ids: records } = definedIds();
  for (const e of edges) {
    assert.ok(EDGES.includes(typeOf(e)), `${e.file}: type ${e.data.type} is one of ${EDGES.join(', ')}`);
    assert.ok(e.data.observer ?? e.data.recorded_by, `${e.file}: observer`);
    assert.ok(e.data.date ?? e.data.timestamp, `${e.file}: date`);
    const ev = ([] as string[]).concat(e.data.evidence ?? []);
    assert.ok(ev.length > 0 && ev.every((r) => records.has(r)), `${e.file}: evidence as record ids that resolve (${ev})`);
  }
});

test("3. no observation states an interpretation; claims are their own concepts, with claimant and Susan's disposition", () => {
  const all = concepts();
  for (const o of all.filter((c) => typeOf(c) === 'observation')) {
    const stated = o.body.split(/^#\s+Interpretation\s*$/m)[0];
    assert.doesNotMatch(stated, /\b(because|therefore|suggests?|implies|means that|probably|likely|evidently|clearly|must be|relationship|dating|together)\b/i, `${o.file} states an interpretation`);
    assert.doesNotMatch(o.body, /^#\s+Interpretation\s*$/m, `${o.file}: an interpretation belongs in a claim`);
  }
  const claims = all.filter((c) => typeOf(c) === 'claim');
  assert.ok(claims.length >= 1, 'claims by others are recorded as claims');
  for (const c of claims) {
    assert.ok(c.data.claimant, `${c.file}: claimant`);
    assert.ok(c.data.disposition, `${c.file}: Susan's disposition`);
  }
});

test('4. the twelve access requests of sh-008, dated, each declined', () => {
  const reqs = concepts().filter((c) => typeOf(c) === 'access-request');
  assert.equal(reqs.length, 12);
  for (const r of reqs) {
    assert.ok(/^\d{4}-\d\d-\d\d/.test(String(r.data.date ?? r.data.timestamp ?? '')), `${r.file}: dated`);
    assert.match(String(r.data.outcome ?? r.data.disposition ?? r.data.status), /declined/i, `${r.file}: declined`);
  }
});
