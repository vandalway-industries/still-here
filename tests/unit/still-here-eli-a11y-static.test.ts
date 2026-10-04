// X5 (still-here-eli) — accessibility, the static half. garage/pack/ACCEPTANCE.md § X5: item 3 here
// (computed in Chromium on every page and in the certificate SVG) and the markup that items 1, 2 and
// 4 rest on (language, one heading, alt attributes, named controls, the live region); axe, the Tab
// walk and the announcements are in e2e/specs/still-here-eli-a11y.spec.ts.
// Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NOT_FOUND_FILE, PAGES } from '../../e2e/helpers/strings.ts';
import { draw, FOLDING_CHAIR } from '../helpers/certificate.ts';
import { inDom, servedSite, siteText, withBrowser, withModulePage } from '../helpers/repo.ts';

test('markup: a language, one h1, alt on every image, every control named, the home page\'s live region', async () => {
  const files = [...PAGES.map((p) => p.file), NOT_FOUND_FILE];
  const r = await inDom<{ lang: string; h1: number; noAlt: number; unnamed: number; live: number }>(
    files.map((f) => siteText(f)),
    `return {
       lang: doc.documentElement.getAttribute('lang') || '',
       h1: doc.querySelectorAll('h1').length,
       noAlt: [...doc.querySelectorAll('img')].filter(i => !i.hasAttribute('alt')).length,
       unnamed: [...doc.querySelectorAll('button, a[href]')].filter(b => !(b.textContent.trim() || b.getAttribute('aria-label') || b.getAttribute('aria-labelledby') || b.querySelector('img[alt]:not([alt=""]), svg[aria-label], title'))).length,
       live: doc.querySelectorAll('[aria-live="polite"]').length,
     };`,
  );
  files.forEach((f, i) => {
    assert.match(r[i].lang, /^en\b/, `${f}: lang`);
    assert.equal(r[i].h1, 1, `${f}: one h1`);
    assert.equal(r[i].noAlt, 0, `${f}: every img has alt`);
    assert.equal(r[i].unnamed, 0, `${f}: every control has a name`);
  });
  assert.ok(r[0].live >= 1, 'the home page has an aria-live="polite" region for the verification lines (item 4)');
});

test('3. no text under 24px (18.66px bold) in verification green, on any page, at 390 or 1440', async () => {
  const { url } = await servedSite();
  const offenders = await withBrowser(async (b) => {
    const out: string[] = [];
    for (const width of [390, 1440]) {
      const page = await b.newPage({ viewport: { width, height: 900 } });
      for (const p of [...PAGES.map((x) => x.path), '/no-such-page']) {
        await page.goto(url + p);
        const bad = await page.evaluate(() =>
          [...document.querySelectorAll('body *')]
            .filter((e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim()))
            .filter((e) => {
              const cs = getComputedStyle(e);
              const green = /^rgb\(6, 152, 82\)/.test(cs.color) || /^rgb\(6, 152, 82\)/.test(cs.fill);
              const size = parseFloat(cs.fontSize);
              const bold = Number(cs.fontWeight) >= 700;
              return green && e.getClientRects().length > 0 && size < (bold ? 18.66 : 24);
            })
            .map((e) => `${e.tagName.toLowerCase()} "${e.textContent!.trim().slice(0, 30)}" ${getComputedStyle(e).fontSize}`),
        );
        out.push(...bad.map((x) => `${p} @${width}: ${x}`));
      }
      await page.close();
    }
    return out;
  });
  assert.deepEqual(offenders, []);
  await withModulePage(async (page, origin) => {
    const svg = await draw(page, origin, FOLDING_CHAIR);
    const small = await page.evaluate((svg) => {
      const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
      const inherit = (e: Element | null, a: string) => {
        for (; e; e = e.parentElement) if (e.getAttribute(a)) return e.getAttribute(a)!;
        return '';
      };
      return [...doc.querySelectorAll('text, tspan')].filter((t) => /^(#069852|rgb\(6,\s*152,\s*82\))$/i.test(inherit(t, 'fill')) && parseFloat(inherit(t, 'font-size')) < 24).length;
    }, svg);
    assert.equal(small, 0, 'green text under 24 units in the certificate');
  });
});
