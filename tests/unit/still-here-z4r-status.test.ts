// S5 (still-here-z4r) — status, with its updates written.
// garage/pack/ACCEPTANCE.md § S5, items 1–4 (the network half of item 4 is also in the browser
// spec). Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { STATUS_CONSTANT, STATUS_TITLES } from '../../e2e/helpers/strings.ts';
import { copyTree, inDom, sh, siteText, statusUpdates, xsdErrors } from '../helpers/repo.ts';

const STATUS_001 = 'All systems operational. We are investigating reports of an unexpected concentration of elsewhere on floor three.';
const WHEN = { 'STATUS-001': '2026-09-29T12:10:00Z', 'STATUS-002': '2026-10-02T09:00:00Z', 'STATUS-003': '2026-10-02T09:40:00Z' } as const;

test('1. status-updates.xml: STATUS-001 verbatim, STATUS-002 and STATUS-003 written; valid against status-updates.xsd', () => {
  const u = statusUpdates();
  assert.deepEqual(u.map((x) => x.id), ['STATUS-001', 'STATUS-002', 'STATUS-003']);
  assert.equal(u[0].body, STATUS_001);
  u.forEach((x, i) => {
    assert.equal(x.title, STATUS_TITLES[i], `${x.id}: title`);
    assert.equal(new Date(x.time).toISOString(), new Date(WHEN[x.id as keyof typeof WHEN]).toISOString(), `${x.id}: time`);
    assert.ok(x.body.split(/\s+/).length >= 15, `${x.id}: a body written in full`);
  });
  assert.equal(xsdErrors('company/status/status-updates.xml', 'company/status/status-updates.xsd'), '');
});

type Shown = { order: string[]; text: string };
async function shown(html: string): Promise<Shown> {
  const [r] = await inDom<Shown>(
    [html],
    `const main = doc.querySelector('main') || doc.body;
     const w = doc.createTreeWalker(main, 4);
     const order = [];
     for (let n = w.nextNode(); n; n = w.nextNode()) if (n.data.trim()) order.push(n.data.replace(/\\s+/g, ' ').trim());
     return { order, text: main.textContent.replace(/\\s+/g, ' ') };`,
  );
  return r;
}

test('2–3. "All systems operational" at the top; the three titles verbatim, each with its date and record id, in the XML\'s order', async () => {
  const r = await shown(siteText('status.html'));
  const first = r.order.findIndex((t) => t.includes(STATUS_CONSTANT));
  assert.ok(first >= 0, 'the constant is on the page');
  // at the top: the first thing the page says, or the first after its heading
  const [h1] = await inDom<string>([siteText('status.html')], "return (((doc.querySelector('main') || doc.body).querySelector('h1') || {}).textContent || '').replace(/\\s+/g, ' ').trim();");
  const h1At = h1 ? r.order.findIndex((t) => t === h1) : -1;
  assert.ok(first === 0 || (h1At >= 0 && first === h1At + 1) || r.order[0].includes(STATUS_CONSTANT), `"${STATUS_CONSTANT}" is the first content (found after: ${r.order.slice(0, first).join(' | ')})`);
  let at = first;
  for (const [i, t] of STATUS_TITLES.entries()) {
    const k = r.order.findIndex((x, j) => j > at && x === t);
    assert.ok(k > at, `"${t}" follows, in order`);
    const near = r.order.slice(Math.max(0, k - 4), k + 6).join(' ');
    assert.match(near, new RegExp(`STATUS-00${i + 1}`), `${t}: its record id`);
    const d = WHEN[`STATUS-00${i + 1}` as keyof typeof WHEN].slice(0, 10);
    const words = new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
    assert.ok(near.includes(d) || near.includes(words), `${t}: its date`);
    at = k;
  }
});

test('4. generated from the XML at build: a changed title in the XML changes the rebuilt page', () => {
  const dir = copyTree();
  const xml = join(dir, 'company/status/status-updates.xml');
  const changed = 'Investigating reports of a second bench';
  writeFileSync(xml, readFileSync(xml, 'utf8').replace('<title>Investigating reports of a bench</title>', `<title>${changed}</title>`));
  sh(process.execPath, ['scripts/build.mjs'], { cwd: dir });
  const page = readFileSync(join(dir, 'site/status.html'), 'utf8');
  assert.ok(page.includes(changed), 'the rebuilt page carries the changed title');
  assert.ok(!page.includes('Investigating reports of a bench<'), 'and not the old one');
});
