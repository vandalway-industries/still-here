// s07 (still-here-txf) — the second-floor printer, placed on careers beside the stapler at C3
// (garage/pack/CHECKPOINTS.md § Record, 2026-10-05). Discovered from S6 (still-here-skd).
// Run: node --test tests/unit/still-here-txf-s07.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { statSync } from 'node:fs';
import { abs, bytes, imageMetadata, imageSize, inDom, mustExist, read, readMust } from '../helpers/repo.ts';

type S07Row = { use: string; derivatives: string; alt: string };

function s07Row(): S07Row {
  let header: string[] | null = null;
  for (const line of read('garage/pack/ASSET_MANIFEST.md').split('\n')) {
    if (!line.startsWith('|')) {
      header = null;
      continue;
    }
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (!header) {
      header = cells;
      continue;
    }
    if (!/`s07-printer\.png`/.test(cells[0])) continue;
    const col = (name: RegExp) => {
      const i = header!.findIndex((h) => name.test(h));
      assert.ok(i >= 0, `ASSET_MANIFEST.md: the s07 table has a column matching ${name}`);
      return cells[i];
    };
    return { use: col(/^Use$/), derivatives: col(/^Derivatives?$/), alt: col(/^Alt/) };
  }
  assert.fail('ASSET_MANIFEST.md has no s07-printer.png row');
}

const WIDTHS = [400, 800];

test('1. the manifest places s07 on careers, under "Your equipment", at 400 and 800', () => {
  const r = s07Row();
  assert.match(r.use, /careers/i, 's07 is placed on /careers');
  assert.match(r.use, /Your equipment/, 's07 is placed under "Your equipment"');
  const widths = [...r.derivatives.matchAll(/\b(\d{3,4})\b/g)].map((m) => Number(m[1]));
  assert.deepEqual(widths, WIDTHS, 's07 derivatives are 400 and 800 wide');
  assert.ok(r.alt.length >= 10, 's07 has an alt draft');
});

test('2. s07-printer-400.webp and -800.webp exist, ≤ 250 KB, at their widths, metadata stripped', () => {
  for (const w of WIDTHS) {
    const f = `src/images/s07-printer-${w}.webp`;
    mustExist(f, 's07 derivative');
    const size = statSync(abs(f)).size;
    assert.ok(size <= 250 * 1024, `${f} is ${Math.round(size / 1024)} KB (bar: 250 KB)`);
    const buf = bytes(f);
    assert.equal(buf.subarray(8, 12).toString('latin1'), 'WEBP', `${f} is a WebP`);
    assert.equal(imageSize(buf).width, w, `${f} is ${w} pixels wide`);
    assert.deepEqual(imageMetadata(buf), [], `${f} carries no EXIF, XMP or C2PA`);
  }
});

test('3. the careers copy places s07 under "Your equipment", beside the stapler, with the manifest alt', async () => {
  const html = readMust('src/content/careers.html', 'the careers copy');
  const [facts] = await inDom<{
    found: boolean;
    heading: string;
    alt: string;
    srcset: string;
    prevSrc: string;
    sameGroupAsStapler: boolean;
  }>(
    [html],
    `const img = [...doc.querySelectorAll('img')].find(i => /\\/images\\/s07-printer-\\d+\\.webp/.test(i.getAttribute('src') || ''));
     if (!img) return { found: false, heading: '', alt: '', srcset: '', prevSrc: '', sameGroupAsStapler: false };
     let box = img.parentElement, heading = '';
     while (box && !heading) {
       const h = box.querySelector('h2, h3');
       if (h) heading = h.textContent.replace(/\\s+/g, ' ').trim();
       else box = box.parentElement;
     }
     const fig = img.closest('figure') || img;
     const prev = fig.previousElementSibling;
     const prevImg = prev ? (prev.matches('img') ? prev : prev.querySelector('img')) : null;
     const stapler = [...doc.querySelectorAll('img')].find(i => /s04-stapler/.test(i.getAttribute('src') || ''));
     const sFig = stapler ? (stapler.closest('figure') || stapler) : null;
     return {
       found: true,
       heading,
       alt: img.getAttribute('alt') || '',
       srcset: img.getAttribute('srcset') || '',
       prevSrc: prevImg ? prevImg.getAttribute('src') || '' : '',
       sameGroupAsStapler: !!sFig && sFig.parentElement === fig.parentElement,
     };`,
  );
  assert.ok(facts.found, 'src/content/careers.html has an img of /images/s07-printer-*.webp');
  assert.equal(facts.heading, 'Your equipment', 's07 sits under the "Your equipment" heading');
  assert.ok(facts.sameGroupAsStapler, 's07 shares its group with the stapler (s04)');
  assert.match(facts.prevSrc, /s04-stapler/, 's07 sits immediately after the stapler');
  for (const w of WIDTHS) assert.match(facts.srcset, new RegExp(`/images/s07-printer-${w}\\.webp ${w}w`), `srcset offers the ${w}w file`);
  assert.equal(facts.alt, s07Row().alt, 's07 alt text is the manifest alt, verbatim');
});
