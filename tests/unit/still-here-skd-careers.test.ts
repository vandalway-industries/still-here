// S6 (still-here-skd) — careers. garage/pack/ACCEPTANCE.md § S6, items 1–3.
// Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CAREERS_TITLES } from '../../e2e/helpers/strings.ts';
import { pageFacts, placed } from '../helpers/page-facts.ts';

test('1. exactly three postings with these titles', async () => {
  const f = await pageFacts('careers.html');
  const postings = f.headings.filter((h) => h !== f.h1 && (CAREERS_TITLES as readonly string[]).includes(h));
  assert.deepEqual(postings, [...CAREERS_TITLES]);
  const others = f.headings.filter((h) => /engineer|contractor|director|manager|intern|lead|officer|head of/i.test(h) && !(CAREERS_TITLES as readonly string[]).includes(h));
  assert.deepEqual(others, [], 'no fourth posting');
});

test('2. zero form, input, textarea and select elements; no mailto: link', async () => {
  const f = await pageFacts('careers.html');
  assert.equal(f.controls, 0);
  assert.deepEqual(f.links.filter((l) => /^mailto:/i.test(l.href)), []);
});

test('3. the photographs ASSET_MANIFEST.md places on careers appear with alt text', async () => {
  const f = await pageFacts('careers.html');
  for (const id of ['s04', 's06', 'm1', 'm2', 'm3']) {
    const hit = placed(f.imgs, id);
    assert.ok(hit.length > 0, `${id} on the careers page`);
    assert.ok(hit.every((i) => i.alt.trim().length >= 10), `${id} has alt text`);
  }
});
