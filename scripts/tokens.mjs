#!/usr/bin/env node
// Generate the design tokens from DESIGN.md's front matter, the one place a colour, a type style,
// a space or a radius is defined:
//   src/css/tokens.css  — `--sh-*` custom properties on :root, and the @font-face rules for the
//                         static faces in src/fonts/
//   src/js/tokens.js    — the same tokens as named exports: colors, typography, spacing, rounded
// Run by the build (scripts/build.mjs) before it copies src/, and by hand with
// `node scripts/tokens.mjs`. A file is rewritten only when its content changes, so a build of an
// unchanged DESIGN.md leaves the working tree as it was. Never edit the two outputs by hand.
// (Jules, 2026-10-04)
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// ── The front matter ───────────────────────────────────────────────────────────────────────────
// DESIGN.md's front matter uses a small part of YAML: nested block maps by indentation, plain or
// double-quoted scalars, `{}`, and comment lines. This reads exactly that and refuses anything else,
// so a construct it does not understand stops the build instead of producing a wrong token.

function scalar(raw, where) {
  const v = raw.trim();
  if (v === '{}') return {};
  if (v.startsWith('"')) {
    if (!/^"(?:[^"\\]|\\.)*"$/.test(v)) throw new Error(`DESIGN.md front matter: unterminated string at ${where}`);
    return JSON.parse(v);
  }
  if (v.startsWith("'")) {
    if (!/^'(?:[^']|'')*'$/.test(v)) throw new Error(`DESIGN.md front matter: unterminated string at ${where}`);
    return v.slice(1, -1).replace(/''/g, "'");
  }
  if (/^[[{|>&*!]/.test(v)) throw new Error(`DESIGN.md front matter: unsupported YAML at ${where}: ${v}`);
  if (/^-?\d+(\.\d+)?$/.test(v)) return { number: Number(v), text: v };
  return v.replace(/\s+#.*$/, '');
}

export function parseFrontMatter(text) {
  const m = /^---\n([\s\S]*?)\n---\n/.exec(text);
  if (!m) throw new Error('DESIGN.md has no front matter');
  const root = {};
  const stack = [{ indent: -1, obj: root }];
  m[1].split('\n').forEach((line, i) => {
    if (!line.trim() || /^\s*#/.test(line)) return;
    const mm = /^( *)([A-Za-z0-9_-]+):(?:\s+(.*))?$/.exec(line);
    if (!mm) throw new Error(`DESIGN.md front matter: cannot read line ${i + 2}: ${line}`);
    const indent = mm[1].length;
    while (stack.length && stack[stack.length - 1].indent >= indent) stack.pop();
    const parent = stack[stack.length - 1].obj;
    const key = mm[2];
    if (key in parent) throw new Error(`DESIGN.md front matter: ${key} twice (line ${i + 2})`);
    if (mm[3] === undefined || mm[3].trim() === '') {
      parent[key] = {};
      stack.push({ indent, obj: parent[key] });
    } else {
      parent[key] = scalar(mm[3], `line ${i + 2}`);
    }
  });
  return root;
}

// ── Output ─────────────────────────────────────────────────────────────────────────────────────
const kebab = (s) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
const text = (v) => (v && typeof v === 'object' && 'text' in v ? v.text : String(v));
const value = (v) => (v && typeof v === 'object' && 'number' in v ? v.number : v);

// A face named in the typography tokens, with the generic family the browser falls back to while
// it loads. No other face is named (DESIGN.md: never invent a font).
const GENERIC = { 'Inter Tight': 'sans-serif', Inter: 'sans-serif', 'JetBrains Mono': 'monospace', 'Cormorant Garamond': 'serif' };

// The static faces scripts/fonts.py writes into src/fonts/, by file stem.
const FACES = [
  ['Inter', 'Inter', [[400, 'Regular']]],
  ['Inter Tight', 'InterTight', [[600, 'SemiBold'], [700, 'Bold']]],
  ['JetBrains Mono', 'JetBrainsMono', [[500, 'Medium']]],
  ['Cormorant Garamond', 'CormorantGaramond', [[500, 'Medium'], [600, 'SemiBold']]],
];

const HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function tokensFrom(design) {
  const fm = parseFrontMatter(design);
  for (const k of ['colors', 'typography', 'spacing', 'rounded']) {
    if (!fm[k] || typeof fm[k] !== 'object') throw new Error(`DESIGN.md front matter has no ${k}`);
  }
  for (const [k, v] of Object.entries(fm.colors)) if (!HEX.test(v)) throw new Error(`colour ${k} is not a hex value: ${v}`);
  for (const [k, t] of Object.entries(fm.typography)) {
    if (!(t.fontFamily in GENERIC)) throw new Error(`type ${k} names a face src/fonts/ does not hold: ${t.fontFamily}`);
  }
  return fm;
}

export function renderCss(fm) {
  const out = [];
  out.push('/* Generated from DESIGN.md\'s front matter by scripts/tokens.mjs. Do not edit by hand:');
  out.push('   change DESIGN.md and run the build. The only file in src/ besides src/js/tokens.js that');
  out.push('   holds a colour value. */');
  out.push('');
  for (const [family, stem, weights] of FACES) {
    for (const [w, style] of weights) {
      out.push('@font-face {');
      out.push(`  font-family: "${family}";`);
      out.push('  font-style: normal;');
      out.push(`  font-weight: ${w};`);
      out.push('  font-display: swap;');
      out.push(`  src: url("../fonts/${stem}-${style}.woff2") format("woff2");`);
      out.push('}');
    }
  }
  out.push('');
  out.push(':root {');
  for (const [k, v] of Object.entries(fm.colors)) out.push(`  --sh-color-${k}: ${v};`);
  out.push('');
  for (const [k, t] of Object.entries(fm.typography)) {
    for (const [prop, v] of Object.entries(t)) {
      const css = prop === 'fontFamily' ? `"${v}", ${GENERIC[v]}` : text(v);
      out.push(`  --sh-type-${k}-${kebab(prop)}: ${css};`);
    }
  }
  out.push('');
  for (const [k, v] of Object.entries(fm.spacing)) out.push(`  --sh-space-${k}: ${text(v)};`);
  out.push('');
  for (const [k, v] of Object.entries(fm.rounded)) out.push(`  --sh-radius-${k}: ${text(v)};`);
  out.push('}');
  return out.join('\n') + '\n';
}

export function renderJs(fm) {
  const group = (o, map = (v) => text(v)) =>
    Object.fromEntries(Object.entries(o).map(([k, v]) => [k, map(v)]));
  const typography = Object.fromEntries(
    Object.entries(fm.typography).map(([k, t]) => [k, Object.fromEntries(Object.entries(t).map(([p, v]) => [p, value(v)]))]),
  );
  const lit = (o) => JSON.stringify(o, null, 2);
  return [
    "// Generated from DESIGN.md's front matter by scripts/tokens.mjs. Do not edit by hand: change",
    '// DESIGN.md and run the build. Keys are the token names as DESIGN.md writes them.',
    '',
    `export const colors = Object.freeze(${lit(group(fm.colors))});`,
    '',
    `export const typography = Object.freeze(${lit(typography)});`,
    '',
    `export const spacing = Object.freeze(${lit(group(fm.spacing))});`,
    '',
    `export const rounded = Object.freeze(${lit(group(fm.rounded))});`,
    '',
  ].join('\n');
}

function writeIfChanged(file, content) {
  if (existsSync(file) && readFileSync(file, 'utf8') === content) return false;
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
  return true;
}

/** Generate both token files under `root`; returns the repository-relative paths rewritten. */
export function generateTokens(root = ROOT) {
  const fm = tokensFrom(readFileSync(join(root, 'DESIGN.md'), 'utf8'));
  const changed = [];
  if (writeIfChanged(join(root, 'src/css/tokens.css'), renderCss(fm))) changed.push('src/css/tokens.css');
  if (writeIfChanged(join(root, 'src/js/tokens.js'), renderJs(fm))) changed.push('src/js/tokens.js');
  return changed;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const changed = generateTokens();
  console.log(changed.length ? `tokens: wrote ${changed.join(', ')}` : 'tokens: up to date');
}
