// DS5 (still-here-9uk) — home and leadership candidates.
// garage/pack/ACCEPTANCE.md § DS5, items 1–4. Items 1–3 are rendered and measured in the browser
// spec (e2e/specs/still-here-9uk-home-leadership-candidate.spec.ts); this file checks the built
// pages' content and the candidate files. Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CHECK_BUTTON, EXAMPLES, HOME_HEADING, LEADERSHIP } from '../../e2e/helpers/strings.ts';
import { bytes, inDom, mustExist, pngInfo, siteText } from '../helpers/repo.ts';
import { leadership } from '../helpers/seeds.ts';

test('1. / carries the heading, one input, Check presence, the ten examples and the hero chair', async () => {
  const [r] = await inDom<{ h: string[]; inputs: number; buttons: string[]; heroes: number }>(
    [siteText('index.html')],
    `const main = doc.querySelector('main') || doc.body;
     return {
       h: [...main.querySelectorAll('h1,h2')].map(e => e.textContent.trim()),
       inputs: main.querySelectorAll('input[type=text], input:not([type]), textarea').length,
       buttons: [...main.querySelectorAll('button')].map(e => e.textContent.replace(/\\s+/g, ' ').trim()),
       heroes: [...doc.querySelectorAll('img, source')].filter(e => /hero/.test((e.getAttribute('src') || '') + (e.getAttribute('srcset') || ''))).length,
     };`,
  );
  assert.ok(r.h.includes(HOME_HEADING), 'the heading');
  assert.equal(r.inputs, 1, 'one text input');
  assert.ok(r.buttons.includes(CHECK_BUTTON), 'Check presence');
  const chips = r.buttons.filter((b) => EXAMPLES.some((e) => e.toLowerCase() === b.toLowerCase()));
  assert.deepEqual(chips.map((c) => c.toLowerCase()), EXAMPLES.map((e) => e.toLowerCase()), 'the ten examples, in order');
  assert.ok(r.heroes > 0, 'the hero chair');
});

test("2. /leadership: twelve cards in PRD R26's order, with CONTENT_SEEDS' names, titles and bios", async () => {
  const people = leadership();
  assert.equal(people.length, 12);
  assert.deepEqual(people.map((p) => p.id), LEADERSHIP.map(([id]) => id), 'CONTENT_SEEDS lists R26\'s order');
  const [text] = await inDom<string>([siteText('leadership.html')], "return (doc.querySelector('main') || doc.body).textContent.replace(/\\s+/g, ' ');");
  let at = 0;
  for (const p of people) {
    for (const s of [p.name, p.title, p.bio]) {
      const i = text.indexOf(s, at);
      assert.ok(i >= 0, `${p.id}: "${s.slice(0, 50)}" missing or out of order`);
    }
    at = text.indexOf(p.name, at) + p.name.length;
  }
});

test('3. every computed colour is a DESIGN.md colour and every family one of its four (browser spec)', () => {
  mustExist('e2e/specs/still-here-9uk-home-leadership-candidate.spec.ts', 'item 3 is measured in the browser');
});

test('4. candidates/home-390.png, home-1440.png and leadership-1440.png exist, full page', () => {
  for (const [f, w, minH] of [['home-390.png', 390, 845], ['home-1440.png', 1440, 901], ['leadership-1440.png', 1440, 901]] as const) {
    const rel = `garage/pack/exemplars/candidates/${f}`;
    mustExist(rel);
    const p = pngInfo(bytes(rel));
    assert.equal(p.width, w, `${f} is ${w} wide`);
    assert.ok(p.height >= minH, `${f} is the full page (taller than one screen)`);
  }
});
