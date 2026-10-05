#!/usr/bin/env node
// Build the published site: copy src/ into site/, the one folder the Pages workflow uploads.
// Writes inside site/ only. site/ is in .gitignore. Later phases add their steps here.
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { generateTokens } from './tokens.mjs';
import { generateBrand } from './brand.mjs';
import { generateIfStale as generateGlyphs } from './certificate-glyphs.mjs';
import { writeResearch, writeStatus } from './company-pages.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');
const OUT = join(ROOT, 'site');

if (relative(ROOT, OUT) !== 'site') throw new Error('build output must be site/');
if (!existsSync(SRC)) throw new Error('src/ is missing');

// The design tokens first: src/css/tokens.css and src/js/tokens.js from DESIGN.md's front matter
// (rewritten only when DESIGN.md changed them).
const regenerated = generateTokens(ROOT);
if (regenerated.length) console.log(`tokens: wrote ${regenerated.join(', ')}`);

// The certificate's signature paths and face metrics (scripts/certificate-glyphs.mjs), converted
// again whenever a face or the script changed since src/js/certificate/ was last written.
const glyphs = generateGlyphs(ROOT);
if (glyphs.length) console.log(`certificate glyphs: wrote ${glyphs.join(', ')}`);

// The mark and the favicon SVG, drawn from the verification-green token (scripts/brand.mjs). The
// raster icons are rendered from the same drawing by scripts/icons.mjs and committed under src/.
const brand = await generateBrand(ROOT);
if (brand.length) console.log(`brand: wrote ${brand.join(', ')}`);

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync(SRC, OUT, {
  recursive: true,
  // Nothing from the records, the pack or dotfiles reaches the site; the shell's parts are
  // included into the pages below, not published on their own.
  filter: (from) => !/(^|\/)\.[^/]/.test(relative(SRC, from)) && relative(SRC, from).split('/')[0] !== '_shell',
});

// The research papers and the status page, written from the company's records (S3, S5). The
// build reads company/research/ and company/status/status-updates.xml and nothing else under
// company/ (scripts/company-pages.mjs).
console.log(`research: ${writeResearch(ROOT, OUT)} papers`);
console.log(`status: ${writeStatus(ROOT, OUT)} updates`);

// The shell (E0): every page carries the same head (CSP, Open Graph, icons, styles), header, menu
// and footer, included from src/_shell/ at build time. A page missing a marker fails the build.
const SHELL = Object.fromEntries(
  ['head', 'header', 'footer'].map((k) => [k, readFileSync(join(SRC, '_shell', `${k}.html`), 'utf8').trimEnd()]),
);
const pages = [];
const walkHtml = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walkHtml(p);
    else if (e.name.endsWith('.html')) pages.push(p);
  }
};
walkHtml(OUT);
for (const file of pages) {
  const rel = relative(OUT, file);
  const path = '/' + rel.replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, '');
  let html = readFileSync(file, 'utf8');
  for (const k of Object.keys(SHELL)) {
    const marker = `<!-- shell:${k} -->`;
    if (html.split(marker).length !== 2) throw new Error(`${rel}: needs exactly one ${marker}`);
    let part = SHELL[k];
    if (k === 'header') part = part.replace(`<a href="${path}">`, `<a href="${path}" aria-current="page">`);
    html = html.replace(marker, () => part);
  }
  writeFileSync(file, html);
}
console.log(`shell: ${pages.length} pages`);
// The export libraries (E4), served from our own origin and loaded only when a file is prepared:
// jsPDF 4.2.1 and svg2pdf.js 2.8.1, their self-contained UMD builds, exactly as installed.
const VENDOR = {
  'jspdf.umd.min.js': 'node_modules/jspdf/dist/jspdf.umd.min.js',
  'svg2pdf.umd.min.js': 'node_modules/svg2pdf.js/dist/svg2pdf.umd.min.js',
};
mkdirSync(join(OUT, 'js/vendor'), { recursive: true });
for (const [name, from] of Object.entries(VENDOR)) {
  if (!existsSync(join(ROOT, from))) throw new Error(`${from} is missing: run npm ci`);
  cpSync(join(ROOT, from), join(OUT, 'js/vendor', name));
}

// The web app manifest (PRD R37): the DS2 icons, standalone, its colours read from the tokens.
const { colors } = await import(pathToFileURL(join(SRC, 'js/tokens.js')).href);
const manifest = {
  id: '/',
  name: 'STILL HERE',
  short_name: 'STILL HERE',
  description: 'Name an object. We will confirm its presence.',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  background_color: colors.canvas.toLowerCase(),
  theme_color: colors.canvas.toLowerCase(),
  icons: [
    { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
};
for (const i of manifest.icons) if (!existsSync(join(OUT, i.src))) throw new Error(`manifest: ${i.src} is missing`);
writeFileSync(join(OUT, 'manifest.webmanifest'), JSON.stringify(manifest, null, 2) + '\n');

// security.txt (PRD R35, RFC 9116): our private vulnerability reporting address, and an Expires
// 365 days from this build, so every build renews it. `npm run check:security-txt` refuses to
// publish one with fewer than 30 days left.
const DAY = 86_400_000;
const expires = new Date(Math.floor(Date.now() / 1000) * 1000 + 365 * DAY).toISOString().replace(/\.\d+Z$/, 'Z');
mkdirSync(join(OUT, '.well-known'), { recursive: true });
writeFileSync(
  join(OUT, '.well-known/security.txt'),
  [
    'Contact: https://github.com/vandalway-industries/still-here/security/advisories/new',
    `Expires: ${expires}`,
    'Preferred-Languages: en',
    'Canonical: https://isitstillhere.com/.well-known/security.txt',
    '',
  ].join('\n'),
);

// The build id (PRD R37, R48–R49): the commit being published when CI names one (GITHUB_SHA, or
// BUILD_ID for another deploy), otherwise a digest of everything built, so any change is a new
// build. It is written to /build.txt, on every page as <html data-build>, and into the service
// worker, whose cache is named with it.
const files = [];
const walkAll = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walkAll(p);
    else files.push(p);
  }
};
walkAll(OUT);
const digest = createHash('sha256');
// security.txt is left out: its Expires moves with the clock, not with what is published
for (const f of files) if (!relative(OUT, f).startsWith('.well-known/')) digest.update(relative(OUT, f)).update(readFileSync(f));
const buildId = (process.env.BUILD_ID || process.env.GITHUB_SHA || digest.digest('hex').slice(0, 16)).trim();
if (!/^[0-9A-Za-z._-]{6,64}$/.test(buildId)) throw new Error(`build id "${buildId}" is not a plain token`);
writeFileSync(join(OUT, 'build.txt'), buildId + '\n');
for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  if (!/<html\b/.test(html)) throw new Error(`${relative(OUT, file)}: no <html> element`);
  writeFileSync(file, html.replace(/<html\b/, `<html data-build="${buildId}"`));
}

// The service worker's precache (PRD R37): every page by the address it is served at, the 404
// page, all CSS, JS and fonts (the export libraries among them), the manifest, the icons and the
// home page's chair. Other images are cached when first shown.
const url = (f) => '/' + relative(OUT, f).split('/').join('/');
const precache = [];
for (const f of files) {
  const rel = relative(OUT, f);
  if (rel === 'sw.js' || rel.startsWith('.well-known/') || rel.startsWith('api/') || rel === 'build.txt') continue;
  if (rel.endsWith('.html')) precache.push(rel === '404.html' ? '/404.html' : url(f).replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, ''));
  else if (/\.(css|m?js|woff2|ttf|webmanifest)$/.test(rel) || /^icons\//.test(rel)) precache.push(url(f));
  else if (/^(favicon\.(ico|svg)|apple-touch-icon\.png|brand\/mark\.svg)$/.test(rel)) precache.push(url(f));
}
const home = readFileSync(join(OUT, 'index.html'), 'utf8');
const chair = /<img\b[^>]*\bsrcset="([^"]*hero[^"]*)"/.exec(home);
if (!chair) throw new Error('index.html: the home chair image was not found for the precache');
for (const c of chair[1].split(',')) precache.push(c.trim().split(/\s+/)[0]);
for (const u of precache) if (!existsSync(join(OUT, decodeURIComponent(u).replace(/\/$/, '/index.html').replace(/^\/$/, '/index.html'))) && !existsSync(join(OUT, u + '.html'))) throw new Error(`precache: ${u} is not in site/`);
const swFile = join(OUT, 'sw.js');
const sw = readFileSync(swFile, 'utf8');
const setBuild = /^const BUILD = .*; \/\/ set by the build$/m;
const setPrecache = /^const PRECACHE = .*; \/\/ set by the build$/m;
if (!setBuild.test(sw) || !setPrecache.test(sw)) throw new Error('sw.js: the lines set by the build are missing');
writeFileSync(
  swFile,
  sw
    .replace(setBuild, () => `const BUILD = ${JSON.stringify(buildId)}; // set by the build`)
    .replace(setPrecache, () => `const PRECACHE = ${JSON.stringify([...new Set(precache)].sort())}; // set by the build`),
);
console.log(`offline: build ${buildId}, ${new Set(precache).size} files precached`);

if (!existsSync(join(OUT, '404.html'))) throw new Error('site/404.html was not written');
console.log(`built site/ from src/`);
