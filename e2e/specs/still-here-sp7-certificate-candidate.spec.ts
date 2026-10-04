// DS4 (still-here-sp7) — the certificate candidate, drawn in Chromium and WebKit.
// garage/pack/ACCEPTANCE.md § DS4 BROWSER PASS: items 1–5 hold in each engine's own rendering of
// the SVG draw.js returns (the draw.js contract: tests/helpers/certificate.ts). Item 6's files are
// checked by the unit test.
import { expect, test } from '@playwright/test';
import { join } from 'node:path';
import { onlyEngines, ROOT } from '../helpers/site.ts';
import { FOOTER } from '../helpers/strings.ts';

onlyEngines('chromium', 'webkit');
// the spec injects jsQR and imports draw.js itself; the page's own CSP would refuse both
test.use({ bypassCSP: true });

const CERT = {
  name: 'Folding chair',
  time: '2026-10-03T10:52:00Z',
  zone: 'America/Chicago',
  identifier: 'SH-00PP-9AGR-1GTB',
  link: 'https://isitstillhere.com/c/#SH-00PP-9AGR-1GTB.Rm9sZGluZyBjaGFpcg.America/Chicago',
};
const R9 = ['svg', 'g', 'path', 'rect', 'circle', 'line', 'polyline', 'text', 'tspan', 'image'];

test('items 1–5 in this engine: the allow-list, the footer, the heading drawn, the QR code decoding at 300 dpi', async ({ page }) => {
  await page.goto('/');
  await page.addScriptTag({ path: join(ROOT, 'node_modules/jsqr/dist/jsQR.js') });
  const r = await page.evaluate(async (cert) => {
    // a module import the test runner does not rewrite
    const m = await (new Function('u', 'return import(u)'))('/js/certificate/draw.js');
    const fn = m.drawCertificate || m.default;
    const out = await fn({ ...cert, time: new Date(cert.time) });
    const svg = typeof out === 'string' ? out : new XMLSerializer().serializeToString(out);
    const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
    const all = [doc.documentElement, ...doc.documentElement.querySelectorAll('*')];
    const texts = [...doc.querySelectorAll('text')].map((t) => (t.textContent ?? '').replace(/\s+/g, ' ').trim());
    // on the page, as this engine draws it
    const host = document.createElement('div');
    host.innerHTML = svg;
    document.body.appendChild(host);
    const live = host.querySelector('svg')!;
    const heading = [...live.querySelectorAll('text')].find((t) => (t.textContent ?? '').trim() === 'STILL HERE.') as SVGTextElement | undefined;
    let gap = NaN;
    let size = NaN;
    if (heading) {
      await document.fonts.ready;
      const s = heading.textContent!.trim();
      const n = heading.getNumberOfChars();
      const iDot = n - 1;
      const iE = s.lastIndexOf('E');
      const dot = heading.getExtentOfChar(iDot);
      const e = heading.getExtentOfChar(iE);
      gap = dot.x - (e.x + e.width);
      size = parseFloat(getComputedStyle(heading).fontSize);
    }
    // rasterize at 300 dpi and decode
    live.setAttribute('width', '3300');
    live.setAttribute('height', '2550');
    const img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(new XMLSerializer().serializeToString(live))));
    await img.decode();
    const c = document.createElement('canvas');
    c.width = 3300;
    c.height = 2550;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, c.width, c.height);
    // @ts-ignore jsQR global
    const found = window.jsQR(data.data, c.width, c.height);
    return {
      viewBox: doc.documentElement.getAttribute('viewBox'),
      names: [...new Set(all.map((e) => e.localName))],
      styled: all.filter((e) => e.hasAttribute('style')).length,
      texts,
      heading: !!heading,
      gap,
      size,
      decoded: found ? found.data : null,
    };
  }, CERT);
  expect(r.viewBox).toBe('0 0 1100 850');
  expect(r.names.filter((n) => !R9.includes(n))).toEqual([]);
  expect(r.styled).toBe(0);
  expect(r.texts).toContain(FOOTER);
  expect(r.heading).toBe(true);
  // advance boxes: the explicit positions leave space between the E and the period
  expect(r.gap).toBeGreaterThan(0);
  expect(r.decoded).toBe(CERT.link);
});
