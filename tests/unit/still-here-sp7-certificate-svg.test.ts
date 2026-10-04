// DS4 (still-here-sp7) — the certificate drawing and its candidate.
// garage/pack/ACCEPTANCE.md § DS4, items 1–6. Run: node --test tests/unit/
// draw.js is exercised in Chromium; its contract is in tests/helpers/certificate.ts.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { FOOTER } from '../../e2e/helpers/strings.ts';
import { draw, FOLDING_CHAIR, inlineFontCss } from '../helpers/certificate.ts';
import { abs, bytes, mustExist, pdfFacts, pngInfo, withModulePage } from '../helpers/repo.ts';

const R9 = ['svg', 'g', 'path', 'rect', 'circle', 'line', 'polyline', 'text', 'tspan', 'image'];
const GRAPHITE = [0x16, 0x16, 0x18];

test('1. draw.js returns an SVG of viewBox 0 0 1100 850 built only from PRD R9\'s elements, no style anywhere', async () => {
  mustExist('src/js/certificate/draw.js');
  await withModulePage(async (page, origin) => {
    const svg = await draw(page, origin, FOLDING_CHAIR);
    const r = await page.evaluate((svg) => {
      const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
      const root = doc.documentElement;
      const all = [root, ...root.querySelectorAll('*')];
      return {
        root: root.localName,
        viewBox: root.getAttribute('viewBox'),
        names: [...new Set(all.map((e) => e.localName))],
        styled: all.filter((e) => e.hasAttribute('style')).length,
        images: all.filter((e) => e.localName === 'image').length,
      };
    }, svg);
    assert.equal(r.root, 'svg');
    assert.equal(r.viewBox, '0 0 1100 850');
    assert.deepEqual(r.names.filter((n) => !R9.includes(n)), [], 'elements outside PRD R9 (no style, filter, mask, gradient, textPath, foreignObject)');
    assert.equal(r.styled, 0, 'no style attribute');
    assert.equal(r.images, 0, '"Folding chair" is all in the certificate face: no image element (R11)');
  });
});

test('2. the footer text node, verbatim', async () => {
  await withModulePage(async (page, origin) => {
    const svg = await draw(page, origin, FOLDING_CHAIR);
    const texts = await page.evaluate((svg) => {
      const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
      return [...doc.querySelectorAll('text')].map((t) => (t.textContent ?? '').replace(/\s+/g, ' ').trim());
    }, svg);
    assert.ok(texts.includes(FOOTER), 'no text element reads the footer verbatim');
  });
});

test('3. "STILL HERE." has per-glyph x positions; the period clears the E by at least 0.12 em', async () => {
  const fontCss = inlineFontCss();
  assert.ok(fontCss.includes('Cormorant Garamond'), 'the certificate face is in src/fonts/');
  await withModulePage(async (page, origin) => {
    const svg = await draw(page, origin, FOLDING_CHAIR);
    const r = await page.evaluate(
      async ({ svg, fontCss }) => {
        const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
        const texts = [...doc.querySelectorAll('text')];
        const heading = texts.find((t) => (t.textContent ?? '').trim() === 'STILL HERE.');
        if (!heading) return { error: 'no text element reads "STILL HERE."' };
        const xs = [heading, ...heading.querySelectorAll('tspan')].flatMap((e) => (e.getAttribute('x') ?? '').trim().split(/[\s,]+/).filter(Boolean));
        const glyphs = (heading.textContent ?? '').trim().replace(/\s/g, '').length;
        let size = 0;
        for (let e: Element | null = heading; e && !size; e = e.parentElement) size = parseFloat(e.getAttribute('font-size') ?? '') || 0;
        // keep only the heading, with the faces inlined, and draw it at 4× to find the ink
        const root = doc.documentElement;
        for (const t of texts) if (t !== heading) t.remove();
        for (const e of [...root.querySelectorAll('path,rect,circle,line,polyline,image')]) e.remove();
        const style = doc.createElementNS('http://www.w3.org/2000/svg', 'style');
        style.textContent = fontCss;
        root.insertBefore(style, root.firstChild);
        root.setAttribute('width', '4400');
        root.setAttribute('height', '3400');
        const img = new Image();
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(new XMLSerializer().serializeToString(doc))));
        await img.decode();
        await new Promise((r) => setTimeout(r, 300));
        const c = document.createElement('canvas');
        c.width = 4400;
        c.height = 3400;
        const ctx = c.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        const d = ctx.getImageData(0, 0, c.width, c.height).data;
        const cols: boolean[] = new Array(c.width).fill(false);
        for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) if (d[(y * c.width + x) * 4 + 3] > 64) cols[x] = true;
        const runs: [number, number][] = [];
        for (let x = 0; x < cols.length; x++) {
          if (cols[x] && (x === 0 || !cols[x - 1])) runs.push([x, x]);
          if (cols[x]) runs[runs.length - 1][1] = x;
        }
        if (runs.length < 2) return { error: 'the heading draws no separate period' };
        const period = runs[runs.length - 1];
        const e = runs[runs.length - 2];
        return { xs: xs.length, glyphs, size, gapUnits: (period[0] - e[1] - 1) / 4 };
      },
      { svg, fontCss },
    );
    assert.ok(!('error' in r) || !r.error, (r as { error?: string }).error);
    const ok = r as { xs: number; glyphs: number; size: number; gapUnits: number };
    assert.ok(ok.xs >= ok.glyphs, `explicit x for each of the ${ok.glyphs} glyphs (found ${ok.xs})`);
    assert.ok(ok.size > 0, 'the heading has a font size');
    assert.ok(ok.gapUnits >= 0.12 * ok.size, `the period clears the E by ${(ok.gapUnits / ok.size).toFixed(3)} em (bar: 0.12 em)`);
  });
});

test('4. the QR code: graphite rects or paths that decode (jsQR) at 300 dpi to the link passed in', async () => {
  await withModulePage(async (page, origin) => {
    const svg = await draw(page, origin, FOLDING_CHAIR);
    await page.addScriptTag({ url: `${origin}/__node_modules/jsqr.js` });
    const r = await page.evaluate(async (svg) => {
      const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
      const qr = doc.querySelector('[data-field="qr"]');
      const kinds = qr ? [...new Set([...qr.querySelectorAll('*')].map((e) => e.localName))] : [];
      const root = doc.documentElement;
      root.setAttribute('width', '3300');
      root.setAttribute('height', '2550');
      const img = new Image();
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(new XMLSerializer().serializeToString(doc))));
      await img.decode();
      const c = document.createElement('canvas');
      c.width = 3300;
      c.height = 2550;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, c.width, c.height);
      // @ts-ignore jsQR is a global from the script tag
      const found = window.jsQR(data.data, c.width, c.height);
      if (!found) return { kinds, decoded: null, colour: null };
      const p = found.location.topLeftFinderPattern;
      const i = (Math.round(p.y) * c.width + Math.round(p.x)) * 4;
      return { kinds, decoded: found.data as string, colour: [data.data[i], data.data[i + 1], data.data[i + 2]] };
    }, svg);
    assert.ok(r.kinds.length > 0, 'the QR code is a data-field="qr" block');
    assert.deepEqual(r.kinds.filter((k) => !['g', 'rect', 'path'].includes(k)), [], 'the QR code is rects or paths');
    assert.equal(r.decoded, FOLDING_CHAIR.link);
    for (let i = 0; i < 3; i++) assert.ok(Math.abs(r.colour![i] - GRAPHITE[i]) <= 6, `QR modules are graphite, got rgb(${r.colour})`);
  });
});

test('5. seal, border and signatures are paths; the seal is green; no text under 24 units in green; only the certificate faces', async () => {
  await withModulePage(async (page, origin) => {
    const svg = await draw(page, origin, FOLDING_CHAIR);
    const r = await page.evaluate((svg) => {
      const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
      const inherit = (e: Element | null, a: string): string | null => {
        for (; e; e = e.parentElement) if (e.getAttribute(a)) return e.getAttribute(a);
        return null;
      };
      const isGreen = (v: string | null) => !!v && /^(#069852|rgb\(\s*6\s*,\s*152\s*,\s*82\s*\))$/i.test(v.trim());
      const block = (f: string) => [...doc.querySelectorAll(`[data-field="${f}"]`)];
      const kinds = (els: Element[]) => [...new Set(els.flatMap((e) => [...e.querySelectorAll('*')].map((x) => x.localName)))];
      const seal = block('seal');
      return {
        seal: seal.length,
        sealGreen: seal.flatMap((s) => [...s.querySelectorAll('path,circle')]).filter((e) => isGreen(inherit(e, 'fill')) || isGreen(inherit(e, 'stroke'))).length,
        sealGreenKinds: seal.flatMap((s) => [...s.querySelectorAll('*')]).filter((e) => isGreen(e.getAttribute('fill')) || isGreen(e.getAttribute('stroke'))).map((e) => e.localName),
        sealTextGreen: seal.flatMap((s) => [...s.querySelectorAll('text,tspan')]).filter((t) => isGreen(inherit(t, 'fill'))).length,
        border: kinds(block('border')),
        signatures: block('signature').map((s) => kinds([s])),
        smallGreen: [...doc.querySelectorAll('text,tspan')].filter((t) => isGreen(inherit(t, 'fill')) && parseFloat(inherit(t, 'font-size') ?? '0') < 24).map((t) => t.textContent),
        families: [...new Set([...doc.querySelectorAll('text,tspan')].map((t) => inherit(t, 'font-family')).filter(Boolean) as string[])],
      };
    }, svg);
    assert.equal(r.seal, 1, 'one seal (data-field="seal")');
    assert.ok(r.sealGreen > 0, 'the seal is a green rosette');
    assert.deepEqual(r.sealGreenKinds.filter((k) => !['path', 'circle', 'g'].includes(k)), [], 'the seal\'s green marks are paths and circles');
    assert.equal(r.sealTextGreen, 0, "the seal's ring text is graphite, not green");
    assert.ok(r.border.length > 0, 'a guilloche border (data-field="border")');
    assert.deepEqual(r.border.filter((k) => !['g', 'path'].includes(k)), [], 'the border is paths');
    assert.equal(r.signatures.length, 2, 'two signatures (data-field="signature")');
    for (const s of r.signatures) assert.deepEqual(s.filter((k) => !['g', 'path'].includes(k)), [], 'a signature is paths, no text');
    assert.deepEqual(r.smallGreen, [], 'green text under 24 units (sh-047)');
    const faces = r.families.map((f) => f.split(',')[0].replace(/["']/g, '').trim());
    assert.deepEqual(faces.filter((f) => !['Cormorant Garamond', 'Inter Tight', 'JetBrains Mono'].includes(f)), [], 'only the certificate faces (no script font at runtime)');
  });
});

test('6. the candidate: certificate.png at 3,300 × 2,550 and certificate.pdf, Folding chair at 10:52:00Z in America/Chicago', async () => {
  const png = 'garage/pack/exemplars/candidates/certificate.png';
  const pdf = 'garage/pack/exemplars/candidates/certificate.pdf';
  mustExist(png);
  mustExist(pdf);
  const p = pngInfo(bytes(png));
  assert.deepEqual([p.width, p.height], [3300, 2550]);
  const f = await pdfFacts(readFileSync(abs(pdf)));
  const text = f.text.replace(/\s+/g, ' ');
  for (const s of ['Folding chair', 'SH-00PP-9AGR-1GTB', '05:52:00', 'Recorded 2026-10-03 10:52:00 UTC', 'Jurisdiction of here: America/Chicago', FOOTER]) {
    assert.ok(text.includes(s), `the candidate PDF reads "${s}"`);
  }
});
