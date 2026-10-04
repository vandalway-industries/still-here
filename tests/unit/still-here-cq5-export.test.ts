// E4 (still-here-cq5) — PDF and PNG.
// garage/pack/ACCEPTANCE.md § E4, items 1, 2, 3 and 5 in Chromium on the built site; items 4, 6
// and 7, and the download events in every engine, are in e2e/specs/still-here-cq5-export.spec.ts.
// Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { FOOTER, RESULT_HEADING } from '../../e2e/helpers/strings.ts';
import * as R from '../../e2e/helpers/reference.ts';
import { pdfFacts, pngInfo, withSitePage } from '../helpers/repo.ts';

type Page = import('playwright').Page;
const AT = '2026-10-03T10:52:00Z';

/** Canvas bookkeeping, installed before the page loads (item 5). */
const CANVAS_WATCH = `(() => {
  const seen = window.__canvases = [];
  let max = 0;
  const note = (c) => { if (!seen.includes(c)) seen.push(c); max = Math.max(max, c.width * c.height); window.__maxCanvas = max; };
  const gc = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (...a) { note(this); return gc.apply(this, a); };
  const tb = HTMLCanvasElement.prototype.toBlob;
  HTMLCanvasElement.prototype.toBlob = function (...a) { note(this); return tb.apply(this, a); };
  const tu = HTMLCanvasElement.prototype.toDataURL;
  HTMLCanvasElement.prototype.toDataURL = function (...a) { note(this); return tu.apply(this, a); };
  if (window.OffscreenCanvas) {
    const O = window.OffscreenCanvas;
    window.OffscreenCanvas = function (w, h) { const c = new O(w, h); note(c); return c; };
  }
})();`;

async function issued(page: Page, name: string): Promise<void> {
  await page.clock.install({ time: new Date(AT) });
  await page.goto('/');
  const input = page.getByRole('main').getByRole('textbox');
  await input.fill(name);
  await input.press('Enter');
  await page.clock.runFor(5500);
  await page.clock.resume();
  await page.getByRole('heading', { name: RESULT_HEADING, exact: true }).waitFor({ timeout: 5000 });
}

async function exportFile(page: Page, label: 'Download PDF' | 'Download PNG') {
  const [d] = await Promise.all([page.waitForEvent('download', { timeout: 30_000 }), page.getByRole('button', { name: label, exact: true }).or(page.getByRole('link', { name: label, exact: true })).first().click()]);
  return { name: d.suggestedFilename(), bytes: readFileSync((await d.path())!) };
}

test('1. filenames: STILL-HERE-<slug>-<11 symbols>.pdf and .png, by PRD R16\'s rule; two objects never share one', async () => {
  const names = ['Folding chair', 'Café au lait!', 'שולחן', '椅子', '🪑', 'q'.repeat(100)];
  const seen = new Set<string>();
  for (const typed of names) {
    await withSitePage(async (page) => {
      await issued(page, typed);
      const name = [...typed].slice(0, 80).join('');
      const id = R.identifier(name, AT);
      for (const [label, ext] of [['Download PDF', 'pdf'], ['Download PNG', 'png']] as const) {
        const f = await exportFile(page, label);
        assert.equal(f.name, R.filename(name, id, ext), `${typed.slice(0, 12)}: ${label}`);
        seen.add(f.name);
      }
    });
  }
  assert.equal(R.slug('Folding chair'), 'folding-chair');
  assert.equal(R.slug('Café au lait!'), 'cafe-au-lait');
  assert.equal(R.slug('🪑'), 'object');
  assert.ok(R.slug('q'.repeat(80)).length <= 40);
  assert.equal(seen.size, names.length * 2, 'different objects, different filenames');
});

test('2. the PDF: US Letter landscape, the three faces embedded as /FontFile2 under their names, the footer in its text', async () => {
  await withSitePage(async (page) => {
    await issued(page, 'Folding chair');
    const { bytes } = await exportFile(page, 'Download PDF');
    const f = await pdfFacts(bytes);
    assert.deepEqual([Math.round(f.width), Math.round(f.height)], [792, 612]);
    const raw = bytes.toString('latin1');
    assert.ok((raw.match(/\/FontFile2/g) ?? []).length >= 3, 'three embedded TrueType programs');
    const fonts = [...raw.matchAll(/\/(?:BaseFont|FontName)\s*\/([^\s/<>[\]]+)/g)].map((m) => m[1]);
    for (const [face, re] of [['Cormorant Garamond', /Cormorant\s*-?\s*Garamond/i], ['Inter Tight', /Inter\s*-?\s*Tight/i], ['JetBrains Mono', /JetBrains\s*-?\s*Mono/i]] as const) {
      assert.ok(fonts.some((n) => re.test(n.replace(/#20/g, ' '))), `${face} is registered and embedded (${fonts.join(', ')})`);
    }
    assert.ok(f.text.replace(/\s+/g, ' ').includes(FOOTER), 'the footer, verbatim, in the extracted text');
  });
});

test('3. the PNG is 3,300 × 2,550 and its ink differs from a render without the faces by more than 20%', async () => {
  await withSitePage(async (page) => {
    await issued(page, 'Folding chair');
    const { bytes } = await exportFile(page, 'Download PNG');
    const p = pngInfo(bytes);
    assert.deepEqual([p.width, p.height], [3300, 2550]);
    const r = await page.evaluate(async (png) => {
      const ink = async (src: string) => {
        const img = new Image();
        img.src = src;
        await img.decode();
        const c = document.createElement('canvas');
        c.width = 3300;
        c.height = 2550;
        const x = c.getContext('2d')!;
        x.fillStyle = '#fff';
        x.fillRect(0, 0, 3300, 2550);
        x.drawImage(img, 0, 0, 3300, 2550);
        const d = x.getImageData(0, 0, 3300, 2550).data;
        let n = 0;
        for (let i = 0; i < d.length; i += 4) if (d[i] + d[i + 1] + d[i + 2] < 384) n++;
        c.width = 0;
        c.height = 0;
        return n;
      };
      const svg = document.querySelector('svg[viewBox="0 0 1100 850"]')!.cloneNode(true) as SVGSVGElement;
      svg.setAttribute('width', '3300');
      svg.setAttribute('height', '2550');
      // the same drawing with the faces withheld: an SVG image cannot reach the page's fonts
      const fallback = await ink('data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(new XMLSerializer().serializeToString(svg)))));
      const exported = await ink('data:image/png;base64,' + png);
      return { fallback, exported };
    }, bytes.toString('base64'));
    const diff = Math.abs(r.exported - r.fallback) / r.fallback;
    assert.ok(diff > 0.2, `ink differs by ${(diff * 100).toFixed(1)}% (bar: more than 20%)`);
  });
});

test('5. after export every canvas is 0 × 0; none ever exceeds 16,777,216 pixels', async () => {
  await withSitePage(async (page) => {
    await page.addInitScript(CANVAS_WATCH);
    await issued(page, 'Folding chair');
    await exportFile(page, 'Download PNG');
    await exportFile(page, 'Download PDF');
    await page.waitForTimeout(500);
    const r = await page.evaluate(() => ({
      max: (window as unknown as { __maxCanvas?: number }).__maxCanvas ?? 0,
      // the export's canvases are never in the document; each must be released to 0 × 0
      left: ((window as unknown as { __canvases: HTMLCanvasElement[] }).__canvases ?? []).filter((c) => !c.isConnected && c.width * c.height > 0).length,
      used: ((window as unknown as { __canvases: unknown[] }).__canvases ?? []).length,
    }));
    assert.ok(r.used > 0, 'the export draws on a canvas');
    assert.ok(r.max <= 16_777_216, `a canvas reached ${r.max} pixels`);
    assert.ok(r.max >= 3300 * 2550, 'the PNG is drawn at 300 dpi');
    assert.equal(r.left, 0, 'canvases left holding pixels after export');
  });
});
