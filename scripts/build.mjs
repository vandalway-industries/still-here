#!/usr/bin/env node
// Build the published site: copy src/ into site/, the one folder the Pages workflow uploads.
// Writes inside site/ only. site/ is in .gitignore. Later phases add their steps here.
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateTokens } from './tokens.mjs';
import { generateBrand } from './brand.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');
const OUT = join(ROOT, 'site');

if (relative(ROOT, OUT) !== 'site') throw new Error('build output must be site/');
if (!existsSync(SRC)) throw new Error('src/ is missing');

// The design tokens first: src/css/tokens.css and src/js/tokens.js from DESIGN.md's front matter
// (rewritten only when DESIGN.md changed them).
const regenerated = generateTokens(ROOT);
if (regenerated.length) console.log(`tokens: wrote ${regenerated.join(', ')}`);

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

if (!existsSync(join(OUT, '404.html'))) throw new Error('site/404.html was not written');
console.log(`built site/ from src/`);
