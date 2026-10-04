// E1 (still-here-yw2) — the identifier.
// garage/pack/ACCEPTANCE.md § E1, items 1–5. Run: node --test tests/unit/
// Contract with src/js/identifier.js (PRD R17–R19), the one module the site and the records
// check (RC6) both import:
//   canonicalize(name) → string                 NFC, trim, collapse whitespace, lower-case
//   makeIdentifier(name, time) → Promise<string> 'SH-XXXX-XXXX-XXXX' (time: a Date, the second taken)
//   parseIdentifier(text) → { body, check, time } | null
//       accepts lower case, i/l as 1, o as 0, hyphens anywhere, with or without 'SH-'; returns
//       null when malformed or when the check symbol does not match; time is a Date decoded from
//       the first seven symbols.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { DERIVED_VECTORS, VECTORS } from '../../e2e/helpers/strings.ts';
import * as R from '../../e2e/helpers/reference.ts';
import { files, importProduct, read } from '../helpers/repo.ts';

type Mod = {
  canonicalize: (s: string) => string;
  makeIdentifier: (name: string, time: Date) => Promise<string>;
  parseIdentifier: (text: string) => { body: string; check: string; time: Date } | null;
};
const mod = () => importProduct<Mod>('src/js/identifier.js');

test('0. the tests\' reference arithmetic reproduces every vector (CONTENT_SEEDS.md § Identifier vectors)', () => {
  for (const v of [...VECTORS, ...DERIVED_VECTORS]) assert.equal(R.identifier(v.name, v.time), v.id, `${v.name} ${v.time}`);
});

test('1. the four published vectors and the three derived vectors, exactly', async () => {
  const m = await mod();
  for (const v of [...VECTORS, ...DERIVED_VECTORS]) assert.equal(await m.makeIdentifier(v.name, new Date(v.time)), v.id, `${v.name} at ${v.time}`);
  // and the second is what counts, not the millisecond
  assert.equal(await m.makeIdentifier('Folding chair', new Date('2026-10-03T10:52:00.999Z')), 'SH-00PP-9AGR-1GTB');
});

test('2. canonicalization: NFC, trim, collapse, lower-case; "Café" composed and decomposed are one identifier', async () => {
  const m = await mod();
  assert.equal(m.canonicalize('  Folding \t\n CHAIR  '), 'folding chair');
  assert.equal(m.canonicalize('Café'), 'café');
  const t = new Date('2026-10-03T10:52:00Z');
  assert.equal(await m.makeIdentifier('Café', t), await m.makeIdentifier('Café', t));
  assert.equal(await m.makeIdentifier('Café', t), R.identifier('Café', t));
  // and agrees with the reference over random names and seconds
  for (let i = 0; i < 300; i++) {
    const name = randomBytes(1 + (i % 20)).toString('base64').replace(/[+/=]/g, ' ');
    const time = new Date(R.EPOCH + Math.floor(Math.random() * 3e8) * 1000);
    assert.equal(await m.makeIdentifier(name, time), R.identifier(name, time), `${JSON.stringify(name)} at ${time.toISOString()}`);
  }
});

test('3. over 3,000 random identifiers, no single substitution and no adjacent swap passes the check', async () => {
  const m = await mod();
  let tried = 0;
  const passed: string[] = [];
  for (let i = 0; i < 3000; i++) {
    const time = new Date(R.EPOCH + Math.floor(Math.random() * 32 ** 7 * 0.9) * 1000);
    const id = R.identifier(randomBytes(8).toString('hex'), time);
    assert.ok(m.parseIdentifier(id), `${id} parses`);
    for (const bad of R.mutations(id)) {
      tried++;
      if (m.parseIdentifier(bad)) passed.push(`${id} → ${bad}`);
    }
  }
  assert.ok(tried > 3000 * 300, `every substitution and swap tried (${tried})`);
  assert.deepEqual(passed.slice(0, 20), [], `${passed.length} altered identifiers passed the check`);
});

test('4. the decoder: lower case, i/l as 1, o as 0, hyphens ignored, SH- optional; the issue time from the first seven symbols', async () => {
  const m = await mod();
  const want = new Date('2026-10-03T10:52:00Z').getTime();
  for (const text of ['SH-00PP-9AGR-1GTB', 'sh-00pp-9agr-1gtb', '00PP-9AGR-1GTB', '00PP9AGR1GTB', 'SH-OOPP-9AGR-1GTB', 'SH-00PP-9AGR-iGTB', 'SH-00PP-9AGR-lGTB', 'oopp9agrlgtb', 'SH-00PP-9AGR-1G-TB']) {
    const p = m.parseIdentifier(text);
    assert.ok(p, `${text} is read`);
    assert.equal(p!.time.getTime(), want, `${text}: issue time`);
  }
  // the odd check symbols are valid final characters (I-12)
  const odd = [...Array(4000).keys()].map((k) => R.identifier(`odd ${k}`, '2026-10-03T10:52:00Z')).find((id) => /[*~$=U]$/.test(id));
  assert.ok(odd && m.parseIdentifier(odd), `an identifier ending in an odd check symbol parses (${odd})`);
  for (const bad of ['', 'hello', 'SH-00PP-9AGR', 'SH-00PP-9AGR-1GTB-1', 'SH-00PU-9AGR-1GTB']) assert.equal(m.parseIdentifier(bad), null, `${JSON.stringify(bad)} is malformed`);
});

test('5. one module for the site and the records check; the alphabet occurs in exactly one file under src/, scripts/ and deploy/', () => {
  const importers = files('src', /\.(m?js|html)$/).filter((f) => f !== 'src/js/identifier.js' && /identifier\.js/.test(read(f)));
  assert.ok(importers.length > 0, 'the site imports src/js/identifier.js');
  const rc6 = files('tests/unit', /-continuity\.test\.ts$/);
  assert.equal(rc6.length, 1, 'the records check (RC6)');
  assert.match(read(rc6[0]), /src\/js\/identifier\.js/, 'RC6 imports the same module');
  const alphabet = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  const holders = [...files('src'), ...files('scripts'), ...files('deploy')].filter((f) => /\.(m?js|ts|html|json|sh)$/.test(f) && read(f).includes(alphabet));
  assert.deepEqual(holders, ['src/js/identifier.js']);
});
