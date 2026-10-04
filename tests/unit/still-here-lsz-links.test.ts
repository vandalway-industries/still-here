// E0 (still-here-lsz) — the site shell and placeholder pages.
// garage/pack/ACCEPTANCE.md § E0, items 1–6, on the built site/. The menu's behaviour at 390 is in
// the shell spec; W4 steps 1–2 in the walk. Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { FOOTER_LINKS, MENU, NOT_FOUND, NOT_FOUND_FILE, PAGES, RETURN_HOME } from '../../e2e/helpers/strings.ts';
import { builtSite, files, imageSize, inDom, read, servedSite, siteFiles, siteText, TEXT_EXT } from '../helpers/repo.ts';

type Shell = {
  h1: string[];
  placeholder: boolean;
  headerHome: boolean;
  headerMark: boolean;
  headerWordmark: boolean;
  footer: boolean;
  menu: [string, string][];
  footerLinks: [string, string][];
  csp: string[];
  og: Record<string, string>;
};

const SHELL_FN = `
  const header = doc.querySelector('header');
  const home = header ? [...header.querySelectorAll('a')].find(a => a.getAttribute('href') === '/') : null;
  const nav = [...doc.querySelectorAll('nav')].find(n => [...n.querySelectorAll('a')].some(a => a.textContent.trim() === 'Verify'));
  const footer = doc.querySelector('footer');
  return {
    h1: [...doc.querySelectorAll('h1')].map(h => h.textContent.replace(/\\s+/g, ' ').trim()),
    placeholder: !!doc.querySelector('meta[name="sh-placeholder"][content="true"]'),
    headerHome: !!home,
    headerMark: !!(home && home.querySelector('svg, img')),
    headerWordmark: !!(home && /STILL HERE/.test(home.textContent + ' ' + [...home.querySelectorAll('[aria-label], img[alt], title')].map(e => e.getAttribute('aria-label') || e.getAttribute('alt') || e.textContent).join(' '))),
    footer: !!footer,
    menu: nav ? [...nav.querySelectorAll('a')].map(a => [a.textContent.replace(/\\s+/g, ' ').trim(), a.getAttribute('href')]) : [],
    footerLinks: footer ? [...footer.querySelectorAll('a')].map(a => [a.textContent.replace(/\\s+/g, ' ').trim(), a.getAttribute('href')]) : [],
    csp: [...doc.querySelectorAll('meta[http-equiv="Content-Security-Policy" i]')].map(m => m.getAttribute('content')),
    og: Object.fromEntries([...doc.querySelectorAll('meta[property^="og:"]')].map(m => [m.getAttribute('property'), m.getAttribute('content')])),
  };`;

async function shells(): Promise<Map<string, Shell>> {
  const pages = [...PAGES.map((p) => p.file), NOT_FOUND_FILE];
  const html = pages.map((f) => siteText(f));
  const r = await inDom<Shell>(html, SHELL_FN);
  return new Map(pages.map((f, i) => [f, r[i]]));
}

test('1. every PRD R24 page is built or a placeholder with its heading, the header (mark and wordmark home) and the footer', async () => {
  for (const p of PAGES) assert.ok(existsSync(join(builtSite(), p.file)), `site/${p.file} (${p.path})`);
  for (const [file, s] of await shells()) {
    assert.equal(s.h1.length, 1, `${file}: one page heading`);
    assert.ok(s.headerHome && s.headerMark && s.headerWordmark, `${file}: the header's mark and wordmark link to /`);
    assert.ok(s.footer, `${file}: the footer`);
  }
});

test('2. the menu holds exactly the eight, in order; the footer exactly its three', async () => {
  for (const [file, s] of await shells()) {
    assert.deepEqual(s.menu, MENU.map(([n, h]) => [n, h]), `${file}: the menu`);
    assert.deepEqual(s.footerLinks, FOOTER_LINKS.map(([n, h]) => [n, h]), `${file}: the footer`);
  }
});

test('3. the link checker finds zero broken internal links; our links use /research/ and /case-studies/', async () => {
  const { url } = await servedSite();
  const htmls = siteFiles(/\.html$/);
  const refs = await inDom<string[]>(
    htmls.map((f) => siteText(f)),
    `return [...doc.querySelectorAll('a[href], link[href], img[src], script[src], source[srcset], img[srcset]')].flatMap(e => {
       const out = [];
       for (const a of ['href', 'src']) if (e.getAttribute(a)) out.push(e.getAttribute(a));
       for (const a of ['srcset']) if (e.getAttribute(a)) out.push(...e.getAttribute(a).split(',').map(s => s.trim().split(/\\s+/)[0]));
       return out;
     });`,
  );
  const broken: string[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < htmls.length; i++) {
    const base = `${url}/${htmls[i].replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, '')}`;
    for (const ref of refs[i]) {
      if (/^(mailto:|data:|blob:|#)/.test(ref)) continue;
      const u = new URL(ref, base);
      if (u.origin !== url) continue;
      assert.ok(!['/research', '/case-studies'].includes(u.pathname), `${htmls[i]}: links ${u.pathname} without its slash`);
      const key = u.pathname;
      if (seen.has(key)) continue;
      seen.add(key);
      const r = await fetch(url + key, { redirect: 'manual' });
      if (r.status !== 200) broken.push(`${htmls[i]} → ${key} (${r.status})`);
    }
  }
  assert.ok(seen.size > 0, 'the site links something');
  assert.deepEqual(broken, [], 'broken internal links');
});

test('4. one Content-Security-Policy and one set of Open Graph tags on every page; og:image is the hero derivative', async () => {
  const all = [...(await shells()).values()];
  const csp = all[0].csp;
  assert.equal(csp.length, 1, 'a CSP meta tag');
  assert.match(csp[0], /default-src 'self'/);
  assert.match(csp[0], /img-src[^;]*'self'[^;]*data:[^;]*blob:|img-src[^;]*'self'[^;]*blob:[^;]*data:/, "images also from data: and blob:");
  for (const s of all) assert.deepEqual(s.csp, csp, 'the same CSP on every page');
  const og = all[0].og;
  for (const k of ['og:title', 'og:type', 'og:image', 'og:url']) assert.ok(og[k], `${k}`);
  for (const s of all) assert.deepEqual(s.og, og, 'the same Open Graph tags on every page');
  const img = new URL(og['og:image'], 'https://isitstillhere.com/').pathname;
  assert.match(img, /hero/, 'og:image is the hero photograph');
  const file = join(builtSite(), img);
  assert.ok(existsSync(file), `site${img} exists`);
  const size = imageSize(readFileSync(file));
  assert.deepEqual([size.width, size.height], [1200, 630], 'the Open Graph derivative is 1200 × 630');
});

test('5. no URL with the host vandalway.com anywhere in site/, vandalwayind/ or company/; no MONOvision in either site', () => {
  const host = /(?:https?:)?\/\/(?:www\.)?vandalway\.com(?![\w.-])/i;
  const bad: string[] = [];
  const scan = (root: string, list: string[], read1: (f: string) => string) => {
    for (const f of list) if (host.test(read1(f))) bad.push(`${root}${f}`);
  };
  scan('site/', siteFiles(TEXT_EXT), (f) => readFileSync(join(builtSite(), f), 'utf8'));
  scan('', [...files('vandalwayind', TEXT_EXT), ...files('company', TEXT_EXT)], read);
  assert.deepEqual(bad, [], 'URLs whose host is vandalway.com');
  assert.ok(files('vandalwayind').length > 0, 'vandalwayind/ exists to be scanned');
  const mono = [...siteFiles(TEXT_EXT).filter((f) => /monovision/i.test(readFileSync(join(builtSite(), f), 'utf8'))), ...files('vandalwayind', TEXT_EXT).filter((f) => /monovision/i.test(read(f)))];
  assert.deepEqual(mono, [], 'MONOvision');
});

test('6. site/404.html carries the 404 sentence and a Return home link', async () => {
  const [r] = await inDom<{ text: string; home: boolean }>(
    [siteText(NOT_FOUND_FILE)],
    `return { text: doc.body.textContent.replace(/\\s+/g, ' '), home: [...doc.querySelectorAll('a')].some(a => a.textContent.trim() === ${JSON.stringify(RETURN_HOME)} && a.getAttribute('href') === '/') };`,
  );
  assert.ok(r.text.includes(NOT_FOUND), 'the 404 sentence');
  assert.ok(r.home, 'a "Return home" link to /');
});
