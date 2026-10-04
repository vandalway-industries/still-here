// DS2 (still-here-jw0) — the mark and icons.
// garage/pack/ACCEPTANCE.md § DS2, items 1–2. Run: node --test tests/unit/
// Pixels are compared in Chromium (rendering the SVG) and with Pillow (reading the PNGs).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { builtSite, bytes, inDom, mustExist, pngInfo, python, readMust, withBrowser } from '../helpers/repo.ts';

const GREEN = [0x06, 0x98, 0x52];

test('1. mark.svg: brackets and dot as paths and circles in verification green; within 3% of the logo, scaled', async () => {
  const svg = readMust('src/brand/mark.svg');
  const [tags] = await inDom<{ tags: string[]; paint: string[] }>(
    [svg],
    `const root = doc.querySelector('svg');
     const all = root ? [root, ...root.querySelectorAll('*')] : [];
     return { tags: all.map(e => e.localName), paint: all.flatMap(e => ['fill','stroke'].map(a => e.getAttribute(a)).filter(Boolean)) };`,
  );
  assert.ok(tags.tags.length > 1, 'mark.svg has no drawing');
  const extra = tags.tags.filter((t) => !['svg', 'g', 'path', 'circle', 'title', 'desc'].includes(t));
  assert.deepEqual(extra, [], 'only paths and circles draw the mark');
  assert.ok(tags.tags.includes('path') && tags.tags.includes('circle'), 'brackets as paths, the dot as a circle');

  const logo = bytes('assets/still-here-logo-horizontal.png').toString('base64');
  const r = await withBrowser(async (b) => {
    const page = await b.newPage();
    return page.evaluate(
      async ({ svg, logo, GREEN }) => {
        const load = async (src: string) => {
          const i = new Image();
          i.src = src;
          await i.decode();
          return i;
        };
        const isGreen = (d: Uint8ClampedArray, i: number) => d[i + 3] > 128 && d[i + 1] - d[i] > 40 && d[i + 1] - d[i + 2] > 30;
        const bbox = (d: Uint8ClampedArray, w: number, h: number) => {
          let x0 = w, y0 = h, x1 = -1, y1 = -1;
          for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (isGreen(d, (y * w + x) * 4)) {
            x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
          }
          return { x0, y0, x1, y1 };
        };
        const canvas = (w: number, h: number) => {
          const c = document.createElement('canvas');
          c.width = w; c.height = h;
          return c;
        };
        // the mark at 512 px wide
        const markImg = await load('data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg))));
        const ratio = markImg.naturalHeight / markImg.naturalWidth || 1;
        const mc = canvas(512, Math.round(512 * ratio));
        const mx = mc.getContext('2d')!;
        mx.drawImage(markImg, 0, 0, mc.width, mc.height);
        const md = mx.getImageData(0, 0, mc.width, mc.height).data;
        const mb = bbox(md, mc.width, mc.height);
        // its fill: the median green pixel
        const greens: number[][] = [];
        for (let i = 0; i < md.length; i += 4) if (isGreen(md, i) && md[i + 3] === 255) greens.push([md[i], md[i + 1], md[i + 2]]);
        const mid = greens[Math.floor(greens.length / 2)] ?? [0, 0, 0];
        // the same region of the logo: its green pixels, cropped and scaled to the mark's box
        const logoImg = await load('data:image/png;base64,' + logo);
        const lc = canvas(logoImg.naturalWidth, logoImg.naturalHeight);
        const lx = lc.getContext('2d')!;
        lx.drawImage(logoImg, 0, 0);
        const ld = lx.getImageData(0, 0, lc.width, lc.height).data;
        const lb = bbox(ld, lc.width, lc.height);
        const w = mb.x1 - mb.x0 + 1, h = mb.y1 - mb.y0 + 1;
        const sc = canvas(w, h);
        const sx = sc.getContext('2d')!;
        sx.imageSmoothingEnabled = true;
        sx.drawImage(lc, lb.x0, lb.y0, lb.x1 - lb.x0 + 1, lb.y1 - lb.y0 + 1, 0, 0, w, h);
        const sd = sx.getImageData(0, 0, w, h).data;
        let differ = 0;
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
          const a = isGreen(md, ((mb.y0 + y) * mc.width + (mb.x0 + x)) * 4);
          const b = isGreen(sd, (y * w + x) * 4);
          if (a !== b) differ++;
        }
        return { differ: differ / (w * h), colour: mid, found: greens.length, GREEN };
      },
      { svg, logo, GREEN },
    );
  });
  assert.ok(r.found > 0, 'the mark draws no green');
  for (let i = 0; i < 3; i++) assert.ok(Math.abs(r.colour[i] - GREEN[i]) <= 2, `the mark is verification green (#069852), got rgb(${r.colour.join(',')})`);
  assert.ok(r.differ < 0.03, `the mark differs from the logo's mark in ${(r.differ * 100).toFixed(2)}% of pixels (bar: < 3%)`);
});

test('2. favicons, touch icon and manifest icons at their sizes; the maskable mark inside the central 80%', () => {
  const site = builtSite();
  const at = (rel: string) => join(site, rel);
  mustExist('src/brand/mark.svg');
  const fav = readFileSync(at('favicon.svg'), 'utf8');
  assert.match(fav, /<svg[\s>]/, 'favicon.svg is an SVG');
  const ico = readFileSync(at('favicon.ico'));
  assert.equal(ico.readUInt16LE(2), 1, 'favicon.ico is an icon file');
  const n = ico.readUInt16LE(4);
  const sizes = [...Array(n).keys()].map((i) => ico[6 + i * 16] || 256).sort((a, b) => a - b);
  assert.deepEqual(sizes, [16, 32], 'favicon.ico holds 16 and 32');
  for (const [rel, size] of [['apple-touch-icon.png', 180], ['icons/icon-192.png', 192], ['icons/icon-512.png', 512], ['icons/maskable-512.png', 512]] as const) {
    const p = pngInfo(readFileSync(at(rel)));
    assert.deepEqual([p.width, p.height], [size, size], `${rel} is ${size}×${size}`);
  }
  // every mark pixel (green, opaque) lies inside the safe zone: a circle of radius 40% at the centre
  const out = python(
    'import sys\nfrom PIL import Image\n' +
      'im = Image.open(sys.argv[1]).convert("RGBA"); w, h = im.size; px = im.load(); r = 0.4 * w; bad = 0; green = 0\n' +
      'for y in range(h):\n' +
      '  for x in range(w):\n' +
      '    R, G, B, A = px[x, y]\n' +
      '    if A > 128 and G - R > 40 and G - B > 30:\n' +
      '      green += 1\n' +
      '      if ((x + 0.5 - w / 2) ** 2 + (y + 0.5 - h / 2) ** 2) ** 0.5 > r: bad += 1\n' +
      'print(green, bad)',
    [at('icons/maskable-512.png')],
  );
  const [green, bad] = out.trim().split(' ').map(Number);
  assert.ok(green > 0, 'the maskable icon carries the mark');
  assert.equal(bad, 0, `${bad} mark pixels outside the central 80% safe zone`);
});
