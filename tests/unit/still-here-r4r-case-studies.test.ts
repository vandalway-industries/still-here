// S4 (still-here-r4r) — case studies.
// garage/pack/ACCEPTANCE.md § S4, items 1–4. Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { files, inDom, read, sentences, siteText } from '../helpers/repo.ts';

const STUDIES = [
  { slug: 'municipal-infrastructure', vertical: /Municipal infrastructure/i },
  { slug: 'public-seating', vertical: /Public seating/i },
  { slug: 'civic-rest-sector', vertical: /civic rest sector/i },
];

type Page = { title: string; text: string; imgs: { src: string; alt: string }[]; quotes: string[] };
async function pages(): Promise<Page[]> {
  return inDom<Page>(
    STUDIES.map((s) => siteText(`case-studies/${s.slug}.html`)),
    `const main = doc.querySelector('main') || doc.body;
     const text = main.textContent.replace(/\\s+/g, ' ');
     return {
       title: (main.querySelector('h1') || {}).textContent || '',
       text,
       imgs: [...main.querySelectorAll('img')].map(i => ({ src: (i.getAttribute('src') || '') + ' ' + (i.getAttribute('srcset') || ''), alt: i.getAttribute('alt') || '' })),
       quotes: [...[...main.querySelectorAll('blockquote, q')].map(q => q.textContent.replace(/\\s+/g, ' ').trim()), ...[...text.matchAll(/[“"]([^”"]{12,})[”"]/g)].map(m => m[1].trim())],
     };`,
  );
}

test('1. /case-studies/ lists exactly three, one per sh-026 vertical, each with its own page', async () => {
  const [links] = await inDom<string[]>([siteText('case-studies/index.html')], "return [...new Set([...(doc.querySelector('main') || doc.body).querySelectorAll('a[href]')].map(a => a.getAttribute('href')).filter(h => /^\\/case-studies\\/./.test(h)))];");
  assert.deepEqual(links.sort(), STUDIES.map((s) => `/case-studies/${s.slug}`).sort());
  const ps = await pages();
  STUDIES.forEach((s, i) => assert.match(ps[i].title, s.vertical, `${s.slug}: its vertical as its subject`));
});

test('2. all three: Eileen Webb, municipal archivist, her register, the bench; nothing contradicting SUPPORT-001/002 or sh-025', async () => {
  for (const [i, p] of (await pages()).entries()) {
    const s = STUDIES[i].slug;
    assert.match(p.text, /Eileen Webb/, `${s}: names her`);
    assert.match(p.text, /municipal archivist/i, `${s}: her role`);
    assert.match(p.text, /\bregister\b/i, `${s}: her register`);
    assert.match(p.text, /\bbench\b/i, `${s}: the bench`);
    for (const m of p.text.matchAll(/\bremoved\b[^.]*?\bin (January|February|March|April|May|June|July|August|September|October|November|December)\b/gi)) assert.equal(m[1], 'April', `${s}: the bench was removed in April`);
    for (const m of p.text.matchAll(/\b(\d+)\s+items of street furniture\b/gi)) assert.equal(m[1], '214', `${s}: 214 items`);
    for (const m of p.text.matchAll(/\b(\d+)\s+(?:[a-z-]+\s+){0,2}(?:were\s+|have been\s+|had been\s+)?certified\b|\bcertified\s+(\d+)\b/gi)) {
      const n = m[1] ?? m[2];
      if (n !== '214') assert.equal(n, '38', `${s}: 38 certified (sh-025)`);
    }
    assert.doesNotMatch(p.text, /\bbench (is|was) (still )?(there|in place|present)\b/i, `${s}: the bench is not there`);
  }
});

test('3. b1, b2, b3-wide and p12-eileen each appear at least once, with alt text', async () => {
  const imgs = (await pages()).flatMap((p) => p.imgs);
  for (const id of ['b1', 'b2', 'b3-wide', 'p12-eileen']) {
    const re = new RegExp(`(^|/)${id}(-[a-z-]*)?-\\d+\\.(webp|jpe?g|png)`);
    const hit = imgs.filter((i) => re.test(i.src) && !(id === 'b3-wide' && /courthouse/.test(i.src)) && !(id === 'p12-eileen' && /courthouse/.test(i.src)));
    assert.ok(hit.length > 0, `${id} appears`);
    assert.ok(hit.every((i) => i.alt.trim().length >= 10), `${id} has alt text`);
  }
});

test('4. no claim of her permission, and no quotation of her beyond the records', async () => {
  const records = files('company').map((f) => read(f).replace(/\s+/g, ' ')).join('\n');
  for (const [i, p] of (await pages()).entries()) {
    const s = STUDIES[i].slug;
    for (const sen of sentences(p.text)) {
      if (/Eileen|Webb|archivist|she|her\b/i.test(sen)) assert.doesNotMatch(sen, /\b(permission|consent(ed)?|agreed to|approved (this|the) (case stud|publication)|with (her|the customer's) (kind )?blessing)\b/i, `${s}: "${sen}"`);
    }
    for (const q of p.quotes) assert.ok(records.includes(q), `${s}: the quotation "${q.slice(0, 60)}" is not in any record`);
  }
});
