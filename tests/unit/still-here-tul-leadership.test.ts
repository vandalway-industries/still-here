// S2 (still-here-tul) — leadership.
// garage/pack/ACCEPTANCE.md § S2, items 1–3 on the built page; item 4 is the critic's blind pick
// after C2. A card is the element whose id is the person's id (or ends in -<id>).
// Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JULES_PHRASE, LEADERSHIP } from '../../e2e/helpers/strings.ts';
import { inDom, sentences, siteText, words } from '../helpers/repo.ts';

type Card = { id: string; found: boolean; srcs: string; alt: string; heading: string; texts: string[] };

async function cards(): Promise<{ cards: Card[]; placeholder: boolean; p12: boolean; total: number }> {
  const [r] = await inDom<{ cards: Card[]; placeholder: boolean; p12: boolean; total: number }>(
    [siteText('leadership.html')],
    `const ids = arg;
     const main = doc.querySelector('main') || doc.body;
     const out = ids.map(id => {
       const el = main.querySelector('[id="' + id + '"], [id$="-' + id + '"]');
       if (!el) return { id, found: false, srcs: '', alt: '', heading: '', texts: [] };
       const img = el.querySelector('img');
       const srcs = [...el.querySelectorAll('img, source')].map(i => (i.getAttribute('src') || '') + ' ' + (i.getAttribute('srcset') || '')).join(' ');
       const h = el.querySelector('h2, h3, h4');
       return { id, found: true, srcs, alt: img ? (img.getAttribute('alt') || '') : '', heading: h ? h.textContent.replace(/\\s+/g, ' ').trim() : '',
                texts: [...el.querySelectorAll('p, dd, li')].map(p => p.textContent.replace(/\\s+/g, ' ').trim()).filter(Boolean) };
     });
     return { cards: out, placeholder: !!doc.querySelector('meta[name="sh-placeholder"]'),
              p12: [...main.querySelectorAll('img, source')].some(i => /p12/.test((i.getAttribute('src') || '') + (i.getAttribute('srcset') || ''))),
              total: main.querySelectorAll('img').length };`,
    LEADERSHIP.map(([id]) => id),
  );
  return r;
}

test('1. exactly twelve cards, by id and portrait; no p12; the placeholder meta gone', async () => {
  const r = await cards();
  for (const [i, [id, p]] of LEADERSHIP.entries()) {
    const c = r.cards[i];
    assert.ok(c.found, `a card for ${id}`);
    assert.match(c.srcs, new RegExp(`\\b${p}\\b`), `${id}'s portrait is ${p}`);
  }
  assert.equal(r.total, 12, 'twelve portraits');
  assert.equal(r.p12, false, 'p12 is a customer, not staff');
  assert.equal(r.placeholder, false);
});

test('2. each card: a name, a title, alt text describing the photograph, a bio of two or three sentences and 20–60 words', async () => {
  const r = await cards();
  for (const c of r.cards) {
    assert.ok(c.found, c.id);
    assert.ok(c.heading, `${c.id}: a name`);
    assert.ok(c.texts.length >= 2, `${c.id}: a title and a bio`);
    assert.ok(c.alt.length >= 20 && c.alt !== c.heading, `${c.id}: alt text that describes the photograph ("${c.alt}")`);
    const bio = [...c.texts].sort((a, b) => b.length - a.length)[0];
    const n = sentences(bio).length;
    assert.ok(n >= 2 && n <= 3, `${c.id}: ${n} sentences`);
    assert.ok(words(bio) >= 20 && words(bio) <= 60, `${c.id}: ${words(bio)} words`);
  }
});

test("3. Jules's bio says he previously created WHERE-r-YOU, with no ownership wording in that sentence", async () => {
  const jules = (await cards()).cards.find((c) => c.id === 'jules')!;
  assert.ok(jules.found);
  const s = jules.texts.flatMap((t) => sentences(t)).find((x) => x.includes(JULES_PHRASE));
  assert.ok(s, 'the phrase is in his bio');
  assert.doesNotMatch(s!, /\b(owns|owner|founded|founder|acquired)\b/i);
});

test('4. (after C2) critic blind pick at 1440 against leadership-1440-golden.png', { skip: 'HUMAN-JUDGED after C2: the critic\'s blind pick' }, () => {});
