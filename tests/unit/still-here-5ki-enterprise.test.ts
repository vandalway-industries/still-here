// S7 (still-here-5ki) — enterprise. garage/pack/ACCEPTANCE.md § S7, items 1–4.
// Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ENTERPRISE_CTA } from '../../e2e/helpers/strings.ts';
import { pageFacts, placed } from '../helpers/page-facts.ts';
import { files, read } from '../helpers/repo.ts';

test('1. the call to action, verbatim', async () => {
  assert.ok((await pageFacts('enterprise.html')).text.includes(ENTERPRISE_CTA));
});

test('2. zero form, input, textarea and select elements', async () => {
  assert.equal((await pageFacts('enterprise.html')).controls, 0);
});

test('3. each testimonial occurs verbatim in a record (SUPPORT-001, sh-025) and is attributed "Eileen Webb, Municipal Archivist"', async () => {
  const f = await pageFacts('enterprise.html');
  assert.ok(f.blockquotes.length >= 2, 'the testimonials are quotations');
  const sources = ['company/correspondence/SUPPORT-001.md', 'company/tracker/tracker.jsonl'].map((p) => read(p).replace(/\\n/g, ' ').replace(/\s+/g, ' '));
  const all = files('company').map((p) => read(p).replace(/\\n/g, ' ').replace(/\s+/g, ' ')).join('\n');
  for (const q of f.blockquotes) {
    const t = q.text.replace(/^[“"]|[”"]$/g, '').trim();
    assert.ok(all.includes(t), `"${t}" is not verbatim in any record`);
    assert.ok(sources.some((s) => s.includes(t)), `"${t}" comes from SUPPORT-001 or sh-025`);
    assert.match(q.attribution, /Eileen Webb, Municipal Archivist/, `"${t}" is attributed to her`);
  }
});

test('4. photographs s08, b3-wide-courthouse and p12-eileen-courthouse appear with alt text', async () => {
  const f = await pageFacts('enterprise.html');
  for (const id of ['s08', 'b3-wide-courthouse', 'p12-eileen-courthouse']) {
    const hit = placed(f.imgs, id);
    assert.ok(hit.length > 0, `${id} on the enterprise page`);
    assert.ok(hit.every((i) => i.alt.trim().length >= 10), `${id} has alt text`);
  }
});
