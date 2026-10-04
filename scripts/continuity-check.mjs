#!/usr/bin/env node
// The continuity check (garage/pack/CONTENT_SEEDS.md § Continuity fixture).
// Hashes every overlapping two- and three-word phrase of every file under company/ and compares
// the hashes with tests/fixtures/continuity-hashes.json. The phrases themselves are never stored
// here: a match reports the file, the line and the list it matched, never the phrase.
//
// Normalization, of the text exactly as of the phrases: Unicode NFC; lower case; every character
// other than a letter, a digit or an apostrophe becomes a space; runs of spaces collapse.
// Hash: hexadecimal SHA-256 of the salt, one newline, then the normalized phrase, UTF-8.
//
// Usage: node scripts/continuity-check.mjs [--list confidential|unknown-to-staff|all] [dir…]
// Exit 1 when any phrase of the chosen list (default: confidential) matches.
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const FIXTURE = join(ROOT, 'tests/fixtures/continuity-hashes.json');

// The apostrophe: the typewriter apostrophe, and the typographer's (U+2019) read as one.
const APOSTROPHES = /[’ʼ]/g;

export function normalize(text) {
  return text
    .normalize('NFC')
    .toLowerCase()
    .replace(APOSTROPHES, "'")
    .replace(/[^\p{L}\p{Nd}']+/gu, ' ')
    .replace(/ +/g, ' ')
    .trim();
}

export function phrases(text) {
  const words = normalize(text).split(' ').filter(Boolean);
  const out = [];
  for (let i = 0; i < words.length; i++) {
    if (i + 1 < words.length) out.push(`${words[i]} ${words[i + 1]}`);
    if (i + 2 < words.length) out.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
  }
  return out;
}

export const hashPhrase = (salt, phrase) => createHash('sha256').update(`${salt}\n${phrase}`, 'utf8').digest('hex');

export function loadFixture(path = FIXTURE) {
  const f = JSON.parse(readFileSync(path, 'utf8'));
  return { salt: f.salt, confidential: new Set(f.confidential), unknown: new Set(f['unknown-to-staff']) };
}

function* files(dir) {
  for (const name of readdirSync(dir).sort()) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* files(p);
    else yield p;
  }
}

/**
 * Check every file under each dir. Phrases are read line by line and also across each file's
 * whole text, so a phrase broken over a line or by markup is still found.
 * Returns [{ file, line, list }] — never the phrase.
 */
export function check(dirs = [join(ROOT, 'company')], fixture = loadFixture()) {
  const hits = [];
  for (const dir of dirs) {
    for (const file of files(dir)) {
      const text = readFileSync(file, 'utf8');
      const seen = new Set();
      const record = (h, line) => {
        for (const [list, set] of [['confidential', fixture.confidential], ['unknown-to-staff', fixture.unknown]]) {
          if (set.has(h) && !seen.has(list + h)) {
            seen.add(list + h);
            hits.push({ file: relative(ROOT, file), line, list });
          }
        }
      };
      text.split('\n').forEach((l, i) => {
        for (const p of phrases(l)) record(hashPhrase(fixture.salt, p), i + 1);
      });
      for (const p of phrases(text)) record(hashPhrase(fixture.salt, p), 0);
    }
  }
  return hits;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  let list = 'confidential';
  const li = args.indexOf('--list');
  if (li >= 0) {
    list = args[li + 1];
    args.splice(li, 2);
  }
  const dirs = args.length ? args.map((a) => resolve(a)) : undefined;
  const hits = check(dirs).filter((h) => list === 'all' || h.list === list);
  for (const h of hits) console.log(`${h.file}:${h.line || '(across lines)'}: matches a ${h.list} phrase`);
  console.log(`continuity: ${hits.length} match(es) against ${list}`);
  process.exit(hits.length ? 1 : 0);
}
