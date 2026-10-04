// S9 (still-here-eg4) — Privacy. garage/pack/ACCEPTANCE.md § S9, items 1–2.
// Each required sentence is listed beside the test that proves it (item 1's map); the test checks
// the sentence is on the page and that each proving test exists.
// Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GITHUB_PAGES_LOGGING_DOC, PRIVACY, WEBKIT_TRACKING_PREVENTION_DOC } from '../../e2e/helpers/strings.ts';
import { pageFacts } from '../helpers/page-facts.ts';
import { beadIds, exists } from '../helpers/repo.ts';

// sentence number → the tests that prove it (labels resolve through docs/bead-map.md)
const PROOF: Record<number, string[]> = {
  1: ['e2e/specs/<X6>-guards.spec.ts'],
  2: ['tests/unit/<S9>-privacy.test.ts', 'e2e/specs/<X6>-guards.spec.ts'],
  3: ['e2e/specs/<E7>-portfolio.spec.ts', 'tests/unit/<E7>-portfolio.test.ts', 'e2e/specs/<X6>-guards.spec.ts'],
  4: ['tests/unit/<S9>-privacy.test.ts', 'e2e/specs/<E7>-portfolio.spec.ts'],
  5: ['tests/unit/<E5>-link.test.ts', 'e2e/specs/<E5>-link.spec.ts', 'e2e/specs/<L1>-staging.spec.ts'],
  6: ['e2e/specs/<X6>-guards.spec.ts', 'tests/unit/<E5>-link.test.ts'],
  7: ['tests/unit/<V3>-counter.test.ts'],
  8: ['tests/unit/<L3>-dns-prep.test.ts'],
};

test('1. the eight sentences, verbatim, each beside the test that proves it', async () => {
  const f = await pageFacts('legal/privacy.html');
  const ids = beadIds();
  PRIVACY.forEach((s, i) => {
    assert.ok(f.text.includes(s), `sentence ${i + 1} missing: ${s}`);
    for (const t of PROOF[i + 1]) {
      const file = t.replace(/<([A-Z]+\d+)>/, (_m, l) => ids.get(l)!);
      assert.ok(exists(file), `sentence ${i + 1} is proved by ${file}`);
    }
  });
});

test("2. another company's behaviour (sentences 2 and 4) is proved by linking that company's own documentation", async () => {
  const f = await pageFacts('legal/privacy.html');
  const hrefs = f.links.map((l) => l.href);
  assert.ok(hrefs.includes(GITHUB_PAGES_LOGGING_DOC), "GitHub's documentation of Pages' logging (Exploration 8)");
  assert.ok(hrefs.includes(WEBKIT_TRACKING_PREVENTION_DOC), "WebKit's tracking-prevention page (research 5, source 2)");
  // HUMAN-JUDGED (item 2): the critic opens each link and checks it says what the sentence says.
});
