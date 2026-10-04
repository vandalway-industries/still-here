// E3 (still-here-3xf) — the certificate for each issue.
// garage/pack/ACCEPTANCE.md § E3, items 1–5 with draw.js in Chromium (contract:
// tests/helpers/certificate.ts); item 6 and the issuing browser's zones are in
// e2e/specs/still-here-3xf-certificate.spec.ts; item 7 is the critic's blind pick after C2.
// Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NO_TELLS, ZONE_LABEL } from '../../e2e/helpers/strings.ts';
import * as R from '../../e2e/helpers/reference.ts';
import { draw, type Cert } from '../helpers/certificate.ts';
import { mustExist, withModulePage } from '../helpers/repo.ts';

const ORIGIN = 'https://isitstillhere.com';
const cert = (name: string, time = '2026-10-03T10:52:00Z', zone = 'America/Chicago'): Cert => {
  const identifier = R.identifier(name, time);
  return { name, time, zone, identifier, link: R.link(ORIGIN, identifier, name, zone) };
};

type Page = import('playwright').Page;

/** Text of each data-field block, and the SVG with the varying blocks removed. */
async function blocks(page: Page, svg: string) {
  return page.evaluate((svg) => {
    const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
    const text = (f: string) => [...doc.querySelectorAll(`[data-field="${f}"]`)].map((e) => (e.textContent ?? '').replace(/\s+/g, ' ').trim()).join(' ');
    const out = { name: text('name'), date: text('date'), zone: text('zone'), utc: text('utc'), identifier: text('identifier'), all: (doc.documentElement.textContent ?? '').replace(/\s+/g, ' ') };
    for (const f of ['name', 'date', 'zone', 'utc', 'identifier', 'qr']) for (const e of doc.querySelectorAll(`[data-field="${f}"]`)) e.remove();
    return { ...out, masked: new XMLSerializer().serializeToString(doc) };
  }, svg);
}

test('1. no tells: with the varying blocks removed, every R7 name\'s SVG is byte-identical to Folding chair\'s', async () => {
  mustExist('src/js/certificate/draw.js');
  await withModulePage(async (page, origin) => {
    const base = await blocks(page, await draw(page, origin, cert('Folding chair')));
    for (const f of ['name', 'date', 'zone', 'utc', 'identifier'] as const) assert.ok(base[f], `a data-field="${f}" block`);
    for (const name of NO_TELLS) {
      const b = await blocks(page, await draw(page, origin, cert(name, '2026-10-01T15:40:00Z', 'Europe/Brussels')));
      assert.equal(b.masked, base.masked, `${name}: the certificate tells something Folding chair's does not`);
    }
  });
});

test('2. Brussels, Chicago and Chatham each print "Jurisdiction of here: <zone>" and a local time that agrees', async () => {
  await withModulePage(async (page, origin) => {
    for (const zone of ['Europe/Brussels', 'America/Chicago', 'Pacific/Chatham']) {
      const b = await blocks(page, await draw(page, origin, cert('Folding chair', '2026-10-03T10:52:00Z', zone)));
      assert.ok(b.all.includes(`${ZONE_LABEL} ${zone}`), `${zone}: the label`);
      assert.ok(b.date.includes(R.localTime('2026-10-03T10:52:00Z', zone)), `${zone}: local time ${R.localTime('2026-10-03T10:52:00Z', zone)} in the date line (${b.date})`);
    }
  });
});

test('3. the UTC line is the time the identifier encodes; 23:30 in Chicago prints the local date and the next day\'s UTC date', async () => {
  await withModulePage(async (page, origin) => {
    const c = cert('Folding chair');
    const b = await blocks(page, await draw(page, origin, c));
    assert.equal(b.utc, R.utcLine(R.issued(c.identifier)));
    const late = cert('Folding chair', '2026-10-03T04:30:00Z', 'America/Chicago');
    const l = await blocks(page, await draw(page, origin, late));
    assert.match(l.date, /\b2 October\b|\bsecond day of October\b/, `the local date, 2 October (${l.date})`);
    assert.doesNotMatch(l.date, /\b3 October\b|\bthird day\b/);
    assert.match(l.date, /23:30:00/);
    assert.equal(l.utc, 'Recorded 2026-10-03 04:30:00 UTC');
  });
});

test('4. long names print in full in the name box: at most four lines, ≥ 30 units, nothing under the seal', async () => {
  const names = [
    'An exceptionally long object name that keeps going and going until it is eighty'.slice(0, 80).padEnd(80, 'x'),
    'Supercalifragilisticexpialidociouslyunremarkablechairlegrest'.slice(0, 60),
    '椅'.repeat(80),
    '🪑'.repeat(80),
  ];
  assert.equal([...names[0]].length, 80);
  assert.equal(names[1].length, 60);
  await withModulePage(async (page, origin) => {
    for (const name of names) {
      const svg = await draw(page, origin, cert(name));
      const r = await page.evaluate(
        ({ svg, name }) => {
          document.body.innerHTML = svg;
          const root = document.body.querySelector('svg')!;
          root.setAttribute('width', '1100');
          root.setAttribute('height', '850');
          const box = (e: Element) => e.getBoundingClientRect();
          const nameBlock = root.querySelector('[data-field="name"]');
          const seal = root.querySelector('[data-field="seal"]');
          if (!nameBlock || !seal) return { error: 'name or seal block missing' };
          const texts = [...nameBlock.querySelectorAll('text, tspan')].filter((t) => [...t.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim()));
          const images = nameBlock.querySelectorAll('image').length;
          const inherit = (e: Element | null, a: string) => {
            for (; e; e = e.parentElement) if (e.getAttribute(a)) return e.getAttribute(a)!;
            return '';
          };
          const sizes = texts.map((t) => parseFloat(inherit(t, 'font-size')));
          const lines = new Set(texts.map((t) => Math.round(box(t).top))).size;
          const n = box(nameBlock);
          const s = box(seal);
          const overlap = !(n.right <= s.left || n.left >= s.right || n.bottom <= s.top || n.top >= s.bottom);
          const content = texts.map((t) => [...t.childNodes].filter((c) => c.nodeType === 3).map((c) => c.textContent).join('')).join('');
          return { images, sizes, lines, overlap, inBounds: n.left >= 0 && n.right <= 1100, full: content.replace(/\s/g, '') === name.replace(/\s/g, ''), hyphenAdded: content.replace(/\s/g, '').length > name.replace(/\s/g, '').length };
        },
        { svg, name },
      );
      assert.ok(!('error' in r) || !r.error, (r as { error?: string }).error);
      const ok = r as { images: number; sizes: number[]; lines: number; overlap: boolean; inBounds: boolean; full: boolean; hyphenAdded: boolean };
      if (ok.images > 0) {
        // the name drawn as an image (PRD diff item 8) is held to the same bar: in full, at most four
        // lines, glyphs at the 30-unit floor. Its lines are found as ink bands; the glyphs on a line
        // are counted from the period of its ink (every test name repeats one character)
        const bands = await page.evaluate(async (svg) => {
          document.body.innerHTML = svg;
          const root = document.body.querySelector('svg')!;
          root.setAttribute('width', '1100');
          root.setAttribute('height', '850');
          const out: { height: number; glyphs: number }[] = [];
          for (const im of root.querySelectorAll('[data-field="name"] image')) {
            const box = im.getBoundingClientRect();
            const href = im.getAttribute('href') || im.getAttribute('xlink:href') || '';
            const img = new Image();
            img.src = href;
            await img.decode();
            const c = document.createElement('canvas');
            c.width = Math.round(box.width * 4);
            c.height = Math.round(box.height * 4);
            const x = c.getContext('2d')!;
            x.drawImage(img, 0, 0, c.width, c.height);
            const d = x.getImageData(0, 0, c.width, c.height).data;
            const ink = (i: number) => d[i + 3] > 40 && (d[i] + d[i + 1] + d[i + 2]) / 3 < 230;
            const rows: number[] = [];
            for (let y = 0; y < c.height; y++) {
              let n = 0;
              for (let xx = 0; xx < c.width; xx++) if (ink((y * c.width + xx) * 4)) n++;
              rows.push(n);
            }
            const raw: number[][] = [];
            let s0 = -1;
            for (let y = 0; y <= c.height; y++) {
              const on = y < c.height && rows[y] > 0;
              if (on && s0 < 0) s0 = y;
              if (!on && s0 >= 0) {
                raw.push([s0, y]);
                s0 = -1;
              }
            }
            const merged: number[][] = [];
            for (const b of raw) {
              const last = merged[merged.length - 1];
              if (last && b[0] - last[1] < (last[1] - last[0]) * 0.25) last[1] = b[1];
              else merged.push([...b]);
            }
            for (const [y0, y1] of merged) {
              const h = y1 - y0;
              const prof: number[] = [];
              for (let xx = 0; xx < c.width; xx++) {
                let n = 0;
                for (let y = y0; y < y1; y++) if (ink((y * c.width + xx) * 4)) n++;
                prof.push(n);
              }
              const first = prof.findIndex((v) => v > 0);
              let last = prof.length - 1;
              while (last > first && prof[last] === 0) last--;
              const seg = prof.slice(first, last + 1);
              const m = seg.reduce((a, b) => a + b, 0) / seg.length;
              let best = 0;
              let lag0 = 0;
              for (let lag = Math.floor(h * 0.5); lag <= Math.ceil(h * 1.8) && lag < seg.length / 2; lag++) {
                let num = 0;
                let den = 0;
                for (let i = 0; i + lag < seg.length; i++) {
                  num += (seg[i] - m) * (seg[i + lag] - m);
                  den += (seg[i] - m) ** 2;
                }
                if (den && num / den > best) {
                  best = num / den;
                  lag0 = lag;
                }
              }
              out.push({ height: h / 4, glyphs: lag0 ? Math.round(seg.length / lag0 + 0.15) : 1 });
            }
          }
          return out;
        }, svg);
        assert.ok(bands.length >= 1 && bands.length <= 4, `${name.slice(0, 4)}…: ${bands.length} lines (at most four)`);
        for (const b of bands) assert.ok(b.height >= 24, `${name.slice(0, 4)}…: glyphs ${b.height.toFixed(1)} units tall (the 30-unit floor's ink)`);
        assert.equal(bands.reduce((a, b) => a + b.glyphs, 0), [...name].length, `${name.slice(0, 4)}…: printed in full`);
      }
      if (ok.images === 0) {
        assert.ok(ok.full, `${name.slice(0, 12)}…: printed in full`);
        assert.ok(!ok.hyphenAdded, 'no hyphen added');
        assert.ok(ok.lines >= 1 && ok.lines <= 4, `${name.slice(0, 12)}…: ${ok.lines} lines (at most four)`);
        assert.ok(ok.sizes.every((x) => x >= 30), `${name.slice(0, 12)}…: size ≥ 30 units (${ok.sizes})`);
      } else {
        assert.ok(/[椅🪑]/u.test(name), 'only a name outside the certificate face is drawn as an image (R11)');
      }
      assert.ok(!ok.overlap, `${name.slice(0, 12)}…: no glyph under the seal`);
      assert.ok(ok.inBounds, `${name.slice(0, 12)}…: inside the page`);
    }
  });
});

test('5. the QR code decodes to <origin>/c/#<fragment> exactly, for Folding chair and an 80-code-point four-byte name', async () => {
  await withModulePage(async (page, origin) => {
    await page.addScriptTag({ url: `${origin}/__node_modules/jsqr.js` });
    for (const c of [cert('Folding chair'), cert('🪑'.repeat(80))]) {
      const svg = await draw(page, origin, c);
      const decoded = await page.evaluate(async (svg) => {
        const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
        doc.documentElement.setAttribute('width', '3300');
        doc.documentElement.setAttribute('height', '2550');
        const img = new Image();
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(new XMLSerializer().serializeToString(doc))));
        await img.decode();
        const cv = document.createElement('canvas');
        cv.width = 3300;
        cv.height = 2550;
        const ctx = cv.getContext('2d')!;
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.drawImage(img, 0, 0);
        // @ts-ignore jsQR global
        const f = window.jsQR(ctx.getImageData(0, 0, cv.width, cv.height).data, cv.width, cv.height);
        return f ? (f.data as string) : null;
      }, svg);
      assert.equal(decoded, c.link, `${c.name.slice(0, 12)}…`);
    }
  });
});

test('6. the result screen\'s date and time format (browser spec)', () => {
  mustExist('e2e/specs/still-here-3xf-certificate.spec.ts', 'item 6 is shown on screen');
});

test('7. (after C2) critic blind pick of the exported PNG against certificate-golden.png', { skip: 'HUMAN-JUDGED after C2: the critic\'s blind pick (ACCEPTANCE conventions)' }, () => {});
