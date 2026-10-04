// X4 (still-here-dzc) — installable and offline. garage/pack/ACCEPTANCE.md § X4, items 1, 2, 5
// and 6 in Chromium on the built site; items 3 and 4 in every engine in the browser spec and W6.
// Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DESIGN_COLOURS, NOT_FOUND_FILE, PAGES } from '../../e2e/helpers/strings.ts';
import { builtSite, serve, servedSite, siteFiles, walk, withBrowser } from '../helpers/repo.ts';

/** Wait (at most ten seconds) for a service worker to be ready; false when none comes. */
async function swReady(page: import('playwright').Page): Promise<boolean> {
  return page.evaluate(
    () =>
      new Promise<boolean>((ok) => {
        if (!('serviceWorker' in navigator)) return ok(false);
        const t = setTimeout(() => ok(false), 10_000);
        navigator.serviceWorker.ready.then(() => (clearTimeout(t), ok(true)));
      }),
  );
}

const hex = (rgb: number[]) => `#${rgb.map((v) => v.toString(16).padStart(2, '0')).join('')}`.toLowerCase();

test('1. the manifest names the DS2 icons, display standalone, colours from the tokens; Chromium reports no installability errors', async () => {
  const file = join(builtSite(), 'manifest.webmanifest');
  assert.ok(existsSync(file), 'site/manifest.webmanifest');
  const m = JSON.parse(readFileSync(file, 'utf8'));
  assert.equal(m.display, 'standalone');
  const icons: { src: string; sizes: string; purpose?: string }[] = m.icons ?? [];
  for (const [src, size, purpose] of [['icons/icon-192.png', '192x192', /any|^$/], ['icons/icon-512.png', '512x512', /any|^$/], ['icons/maskable-512.png', '512x512', /maskable/]] as const) {
    const i = icons.find((x) => x.src.replace(/^\//, '') === src);
    assert.ok(i, `the manifest names ${src}`);
    assert.equal(i!.sizes, size);
    assert.match(i!.purpose ?? '', purpose);
  }
  const colours = Object.values(DESIGN_COLOURS).map(hex);
  for (const k of ['theme_color', 'background_color']) assert.ok(colours.includes(String(m[k]).toLowerCase()), `${k} ${m[k]} is a token colour`);
  const { url } = await servedSite();
  const errors = await withBrowser(async (b) => {
    const page = await b.newPage();
    await page.goto(`${url}/`);
    await swReady(page);
    const cdp = await page.context().newCDPSession(page);
    const r = (await cdp.send('Page.getInstallabilityErrors')) as { installabilityErrors: unknown[] };
    return r.installabilityErrors;
  });
  assert.deepEqual(errors, []);
});

/** After one visit, every cached URL, by cache name. */
async function cached(url: string): Promise<{ names: string[]; urls: string[] }> {
  return withBrowser(async (b) => {
    const page = await b.newPage();
    await page.goto(`${url}/`);
    assert.ok(await swReady(page), 'a service worker is ready after one visit');
    return page.evaluate(async () => {
      await new Promise((r) => setTimeout(r, 1500));
      const names = await caches.keys();
      const urls: string[] = [];
      for (const n of names) for (const req of await (await caches.open(n)).keys()) urls.push(req.url);
      return { names, urls };
    });
  });
}

test('2. the service worker precaches every page, the 404, all CSS, JS and fonts, the export libraries, the icons and the home chair', async () => {
  const { url } = await servedSite();
  const { urls } = await cached(url);
  const paths = new Set(urls.map((u) => new URL(u).pathname));
  const has = (...alts: string[]) => alts.some((a) => paths.has(a));
  for (const p of PAGES) assert.ok(has(p.path, `/${p.file}`, p.path.replace(/\/$/, '/index.html')), `precached: ${p.path}`);
  assert.ok(has(`/${NOT_FOUND_FILE}`, '/404'), 'precached: the 404');
  const assets = siteFiles(/\.(css|m?js|woff2|ttf)$/).filter((f) => !/(^|\/)(sw|service-worker)\.m?js$/.test(f));
  assert.ok(assets.length > 0);
  for (const f of assets) assert.ok(paths.has(`/${f}`), `precached: /${f}`);
  assert.ok(siteFiles(/jspdf/i).length > 0 && siteFiles(/svg2pdf/i).length > 0, 'the export libraries are in site/');
  for (const f of siteFiles(/^icons\//)) assert.ok(paths.has(`/${f}`), `precached: /${f}`);
  assert.ok([...paths].some((p) => /hero/.test(p) && /\.(webp|jpe?g|png)$/.test(p)), 'precached: the home chair');
});

test('5. build N, load, build N+1: the page reports N+1 (build.txt and data-build) by its second navigation', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'still-here-deploy-'));
  const site = join(dir, 'site');
  cpSync(builtSite(), site, { recursive: true });
  const n = readFileSync(join(site, 'build.txt'), 'utf8').trim();
  assert.ok(n.length >= 6, 'site/build.txt holds a build id');
  const { url, close } = await serve(site);
  try {
    await withBrowser(async (b) => {
      const page = await b.newPage();
      await page.goto(`${url}/`);
      assert.ok(await swReady(page), 'a service worker is ready');
      assert.equal(await page.getAttribute('[data-build]', 'data-build'), n);
      // deploy N+1: the same files with the next build id
      const next = `${n}-next`;
      for (const f of walk(site)) {
        const t = readFileSync(f);
        if (t.includes(n)) writeFileSync(f, t.toString('utf8').split(n).join(next));
      }
      await page.goto(`${url}/leadership`);
      await page.goto(`${url}/`);
      assert.equal(await page.getAttribute('[data-build]', 'data-build'), next, 'data-build is N+1 by the second navigation');
      assert.equal((await page.evaluate(async () => (await fetch('/build.txt', { cache: 'no-store' })).text())).trim(), next);
    });
  } finally {
    close();
  }
});

test('6. the caches hold only same-origin URLs; the cache name carries the build id', async () => {
  const { url } = await servedSite();
  const { names, urls } = await cached(url);
  const id = readFileSync(join(builtSite(), 'build.txt'), 'utf8').trim();
  assert.ok(names.length > 0, 'a cache');
  assert.ok(names.some((nm) => nm.includes(id)), `a cache named with the build id ${id}`);
  assert.deepEqual(urls.filter((u) => new URL(u).origin !== url), []);
});
