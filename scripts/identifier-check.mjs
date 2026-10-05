#!/usr/bin/env node
// The identifier check (PRD R40; RC6). Every certificate identifier quoted in the company's records
// (company/) or on a built page (site/**/*.html) must recompute, with src/js/identifier.js (the
// module the site ships), from an object name the same record or page gives and the time the
// identifier itself encodes. Names are read the way a person reads them: an "object" field, an
// "Object:" line, a quoted name, or a certificate file name (STILL-HERE-<slug>-<11 symbols>.pdf).
// The format's own placeholder, SH-XXXX-XXXX-XXXX, is not an identifier (its check symbol does not
// match) and is skipped wherever it appears.
//
// Usage: node scripts/identifier-check.mjs [dir…]      (default: company site)
// Prints one line per identifier and a total; exits 1 when any identifier fails to recompute, or
// when the records quote fewer than two (CERT-001's and SUPPORT-001's at least).
// (Diane, 2026-10-05)
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeIdentifier, parseIdentifier } from '../src/js/identifier.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SH = /SH-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z*~$=U]{4}/g;
const PLACEHOLDER = 'SH-XXXX-XXXX-XXXX';
const RECORD_TEXT = /\.(md|json|jsonl|xml|ya?ml|txt)$/i;
const REQUIRED = ['SH-00PK-EEC2-0EPR', 'SH-00PH-HEGC-M3YK'];

function* walk(dir) {
  for (const name of readdirSync(dir).sort()) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

const decode = (s) =>
  s
    .replace(/<[^>]+>/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

/** The texts a file holds: one per tracker issue for JSON lines, else the file (pages as text). */
function texts(file) {
  const raw = readFileSync(file, 'utf8');
  if (file.endsWith('.jsonl')) {
    return raw
      .split('\n')
      .filter(Boolean)
      .map((l) => {
        const j = JSON.parse(l);
        return { where: `${relative(ROOT, file)} (${j.external_ref})`, text: `${j.title}\n\n${j.description}\n\n${j.close_reason ?? ''}` };
      });
  }
  return [{ where: relative(ROOT, file), text: /\.html?$/i.test(file) ? decode(raw) : raw }];
}

function names(text) {
  const out = new Set();
  for (const x of text.matchAll(/"object"\s*:\s*"([^"]+)"|Object:\s*([^\n.]+)/g)) out.add((x[1] ?? x[2]).trim());
  for (const x of text.matchAll(/[“"'`]([^”"'`\n]{2,80}?)[.,]?[”"'`]/g)) out.add(x[1]);
  for (const x of text.matchAll(/STILL-HERE-([a-z0-9-]+)-[0-9A-Z]{11}\.(pdf|png)/g)) out.add(x[1].replace(/-/g, ' '));
  return out;
}

export async function check(dirs = ['company', 'site'].map((d) => join(ROOT, d))) {
  const results = [];
  for (const dir of dirs) {
    if (!existsSync(dir)) throw new Error(`${relative(ROOT, dir) || dir} does not exist (build site/ first: npm run build)`);
    const isSite = relative(ROOT, dir).split('/')[0] === 'site';
    for (const file of walk(dir)) {
      if (isSite ? !/\.html?$/i.test(file) : !RECORD_TEXT.test(file)) continue;
      for (const { where, text } of texts(file)) {
        for (const id of new Set(text.match(SH) ?? [])) {
          const parsed = parseIdentifier(id);
          if (id === PLACEHOLDER && !parsed) continue;
          let from = null;
          if (parsed) for (const n of names(text)) if ((await makeIdentifier(n, parsed.time)) === id) from = n;
          results.push({ where, id, ok: Boolean(from), from, reason: parsed ? 'no name in this record recomputes it' : 'not a valid identifier' });
        }
      }
    }
  }
  return results;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const results = await check(args.length ? args.map((a) => resolve(a)) : undefined);
  for (const r of results) console.log(r.ok ? `ok    ${r.where}: ${r.id} recomputes from "${r.from}"` : `FAIL  ${r.where}: ${r.id}: ${r.reason}`);
  const inRecords = new Set(results.filter((r) => r.where.startsWith('company/')).map((r) => r.id));
  const missing = args.length ? [] : REQUIRED.filter((id) => !inRecords.has(id));
  for (const id of missing) console.log(`FAIL  company/: ${id} is not quoted by any record`);
  const failed = results.filter((r) => !r.ok).length + missing.length;
  console.log(`identifiers: ${results.length} found, ${results.length - results.filter((r) => !r.ok).length} recompute, ${failed} failure(s)`);
  process.exit(failed ? 1 : 0);
}
