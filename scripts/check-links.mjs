#!/usr/bin/env node
// The link checker (E0): reads every page in the built site and resolves each internal reference
// (a href, link href, img and script src, srcset entries) the way GitHub Pages would answer it
// (scripts/serve-pages.mjs). Fails on any reference that would not answer 200, and on a link to
// /research or /case-studies without its slash. Other hosts and mailto:/data:/blob:/# are skipped.
// Usage: node scripts/check-links.mjs [site]    (npm run check:links, after npm run build)
// (Jules, 2026-10-04)
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { resolvePages } from './serve-pages.mjs';

const ROOT = resolve(process.argv[2] ?? 'site');
const ORIGIN = 'https://isitstillhere.com';

const pages = [];
const walk = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) pages.push(relative(ROOT, p));
  }
};
walk(ROOT);

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const ATTR = /<(a|link|img|script|source)\b[^>]*>/gi;
const refsOf = (html) => {
  const out = [];
  for (const [tag] of html.replace(/<!--[\s\S]*?-->/g, '').matchAll(ATTR)) {
    for (const m of tag.matchAll(/\s(href|src|srcset)\s*=\s*("([^"]*)"|'([^']*)')/gi)) {
      const v = decode(m[3] ?? m[4] ?? '');
      if (!v) continue;
      if (m[1].toLowerCase() === 'srcset') out.push(...v.split(',').map((s) => s.trim().split(/\s+/)[0]).filter(Boolean));
      else out.push(v);
    }
  }
  return out;
};

const broken = [];
const unslashed = [];
let checked = 0;
for (const page of pages) {
  const base = `${ORIGIN}/${page.replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, '')}`;
  for (const ref of refsOf(readFileSync(join(ROOT, page), 'utf8'))) {
    if (/^(mailto:|tel:|data:|blob:|javascript:|#)/i.test(ref)) continue;
    const u = new URL(ref, base);
    if (u.origin !== ORIGIN) continue;
    checked++;
    if (u.pathname === '/research' || u.pathname === '/case-studies') unslashed.push(`${page} → ${u.pathname}`);
    const r = resolvePages(ROOT, u.pathname);
    if (r.status !== 200) broken.push(`${page} → ${u.pathname} (${r.status})`);
  }
}

for (const b of broken) console.error(`broken: ${b}`);
for (const b of unslashed) console.error(`without its slash: ${b}`);
console.log(`links: ${pages.length} pages, ${checked} internal references, ${broken.length} broken, ${unslashed.length} without a slash`);
if (!pages.length || broken.length || unslashed.length) process.exit(1);
