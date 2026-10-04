// S8 (still-here-hng) — Terms of Presence. garage/pack/ACCEPTANCE.md § S8, items 1–2.
// Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TERMS } from '../../e2e/helpers/strings.ts';
import { pageFacts } from '../helpers/page-facts.ts';

test('1. each required sentence of CONTENT_SEEDS.md § Terms, verbatim', async () => {
  const f = await pageFacts('legal/terms.html');
  for (const s of TERMS) assert.ok(f.text.includes(s), `missing: ${s}`);
});

test('2. the page title is "Terms of Presence"', async () => {
  const f = await pageFacts('legal/terms.html');
  assert.equal(f.h1, 'Terms of Presence');
  assert.match(f.title, /^Terms of Presence\b/);
});
