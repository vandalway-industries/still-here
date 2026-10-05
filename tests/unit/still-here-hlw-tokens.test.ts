// DS1 (still-here-hlw) — tokens and fonts.
// garage/pack/ACCEPTANCE.md § DS1, items 1–4, each a test below. Run: node --test tests/unit/
// The tokens come from DESIGN.md's front matter; CSS custom properties are `--sh-<token>` (a
// category word between, such as `--sh-color-canvas` or `--sh-space-md`, is allowed); the JS
// module's named exports hold each token once, under its name (kebab or camel case).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { abs, contrast, files, frontMatter, hexToRgb, importProduct, mustExist, python, read, readMust, run, TEXT_EXT } from '../helpers/repo.ts';

const design = () => frontMatter(read('DESIGN.md')).data as {
  colors: Record<string, string>;
  typography: Record<string, Record<string, string | number>>;
  spacing: Record<string, string>;
  rounded: Record<string, string>;
};
const camel = (k: string) => k.replace(/-([a-z0-9])/g, (_m, c) => c.toUpperCase());
const escRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Flatten a module's exports to [path, value] pairs. */
function flatten(o: unknown, prefix: string[] = [], out: [string[], unknown][] = []): [string[], unknown][] {
  if (o && typeof o === 'object' && !Array.isArray(o)) {
    for (const [k, v] of Object.entries(o)) {
      out.push([[...prefix, k], v]);
      flatten(v, [...prefix, k], out);
    }
  }
  return out;
}

test('1. tokens.css and tokens.js hold every DESIGN.md token once; no hex literal elsewhere in src/', async () => {
  const d = design();
  const css = readMust('src/css/tokens.css');
  assert.match(css, /DESIGN\.md/, 'tokens.css says it is generated from DESIGN.md');
  const decls = [...css.matchAll(/(--sh-[a-z0-9-]+)\s*:\s*([^;]+);/g)].map((m) => ({ name: m[1], value: m[2].trim() }));
  const once = (re: RegExp, what: string) => {
    const hits = decls.filter((x) => re.test(x.name));
    assert.equal(hits.length, 1, `${what}: expected exactly one --sh-* declaration, found ${hits.map((h) => h.name).join(', ') || 'none'}`);
    return hits[0];
  };
  for (const [k, hex] of Object.entries(d.colors)) {
    const h = once(new RegExp(`^--sh-(?:colou?rs?-)?${escRe(k)}$`), `colour ${k}`);
    assert.equal(h.value.toLowerCase(), hex.toLowerCase(), `colour ${k}`);
  }
  for (const [k, v] of Object.entries(d.spacing)) {
    const h = once(new RegExp(`^--sh-(?:spac(?:e|ing)-)${escRe(k)}$`), `spacing ${k}`);
    assert.equal(h.value, v, `spacing ${k}`);
  }
  for (const [k, v] of Object.entries(d.rounded)) {
    const h = once(new RegExp(`^--sh-(?:radius|rounded)-${escRe(k)}$`), `radius ${k}`);
    assert.equal(h.value, v, `radius ${k}`);
  }
  for (const [k, t] of Object.entries(d.typography)) {
    for (const [prop, v] of Object.entries(t)) {
      const kebab = prop.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
      const h = once(new RegExp(`^--sh-(?:type|font|typography)-${escRe(k)}-${escRe(kebab)}$`), `type ${k}.${prop}`);
      assert.ok(h.value.replace(/["']/g, '').includes(String(v)), `type ${k}.${prop}: ${h.value} lacks ${v}`);
    }
  }

  mustExist('src/js/tokens.js');
  const mod = await importProduct<Record<string, unknown>>('src/js/tokens.js');
  const flat = flatten(mod);
  const findOnce = (key: string, what: string) => {
    const hits = flat.filter(([p]) => p[p.length - 1] === key || p[p.length - 1] === camel(key));
    assert.equal(hits.length, 1, `${what}: expected exactly one export named ${key}, found ${hits.map(([p]) => p.join('.')).join(', ') || 'none'}`);
    return hits[0][1];
  };
  for (const [k, hex] of Object.entries(d.colors)) assert.equal(String(findOnce(k, `colour ${k}`)).toLowerCase(), hex.toLowerCase());
  for (const [k, v] of Object.entries(d.spacing)) assert.equal(String(findOnce(k, `spacing ${k}`)), v);
  for (const [k, v] of Object.entries(d.rounded)) assert.equal(String(findOnce(k, `radius ${k}`)), v);
  for (const [k, t] of Object.entries(d.typography)) {
    const v = findOnce(k, `type ${k}`) as Record<string, unknown>;
    assert.equal(typeof v, 'object', `type ${k} is an object of its properties`);
    for (const [prop, want] of Object.entries(t)) assert.ok(String(v[prop] ?? v[prop.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)]).includes(String(want)), `type ${k}.${prop}`);
  }

  const hex = /(?<![&\w])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/;
  const offenders = files('src', TEXT_EXT)
    .filter((f) => f !== 'src/css/tokens.css' && f !== 'src/js/tokens.js')
    .filter((f) => hex.test(read(f)));
  assert.deepEqual(offenders, [], 'hex colour literals outside the two token files');
});

const FAMILIES = ['Inter', 'Inter Tight', 'JetBrains Mono', 'Cormorant Garamond'];

/** name-table family, variable or static, and the cmap, via fontTools. */
function fontFacts(paths: string[]): { path: string; family: string; variable: boolean }[] {
  return JSON.parse(
    python(
      'import sys, json\nfrom fontTools.ttLib import TTFont\nout=[]\n' +
        'for p in sys.argv[1:]:\n' +
        '  f = TTFont(p)\n' +
        '  n = f["name"]\n' +
        '  fam = n.getDebugName(16) or n.getDebugName(1)\n' +
        '  out.append({"path": p, "family": fam, "variable": "fvar" in f})\n' +
        'print(json.dumps(out))',
      paths,
    ),
  );
}

test('2. static Inter, Inter Tight, JetBrains Mono and Cormorant Garamond as WOFF2 and TTF, each with its OFL; DESIGN.md lints clean', () => {
  const fonts = files('src/fonts', /\.(woff2|ttf)$/i);
  assert.ok(fonts.length > 0, 'src/fonts/ holds no fonts');
  const facts = fontFacts(fonts.map(abs));
  for (const fam of FAMILIES) {
    for (const ext of ['woff2', 'ttf']) {
      const ok = facts.filter((f) => f.path.toLowerCase().endsWith(`.${ext}`) && f.family === fam);
      assert.ok(ok.length > 0, `${fam} has no .${ext} in src/fonts/`);
      assert.ok(ok.every((f) => !f.variable), `${fam} .${ext} must be static instances`);
    }
    const slug = fam.toLowerCase().replace(/\s+/g, '');
    const licence = files('src/fonts').find((f) => /ofl|licen[cs]e/i.test(f) && f.toLowerCase().replace(/[\s_-]+/g, '').includes(slug));
    assert.ok(licence, `${fam}: no OFL licence file beside it`);
    assert.match(read(licence!), /SIL OPEN FONT LICENSE/i, `${licence} is the OFL`);
  }
  const extra = facts.filter((f) => !FAMILIES.includes(f.family));
  assert.deepEqual(extra.map((f) => f.family), [], 'only the four families are shipped');
  const lint = run('npx', ['-y', '@google/design.md@0.3.0', 'lint', 'DESIGN.md'], { timeout: 180_000 });
  assert.equal(lint.status, 0, lint.stdout + lint.stderr);
  // 0.3.0 prints JSON: { findings: [...], summary: { errors, warnings, infos } } (C2 test change 2)
  let report: { summary?: { errors?: unknown } };
  try {
    report = JSON.parse(lint.stdout);
  } catch {
    assert.fail(`the linter's output is not JSON: ${lint.stdout.slice(0, 200)}`);
  }
  assert.equal(report.summary?.errors, 0, `the linter reports errors: ${lint.stdout.slice(0, 400)}`);
});

test('3. contrast, computed from the generated tokens', async () => {
  const mod = await importProduct<Record<string, unknown>>('src/js/tokens.js');
  const flat = flatten(mod);
  const colour = (k: string) => {
    const hit = flat.find(([p, v]) => (p[p.length - 1] === k || p[p.length - 1] === camel(k)) && typeof v === 'string');
    assert.ok(hit, `tokens.js exports ${k}`);
    return hexToRgb(String(hit![1]));
  };
  const [graphite, canvas, muted, surface, green, onPrimary] = ['graphite', 'canvas', 'graphite-muted', 'surface', 'verification-green', 'on-primary'].map(colour);
  assert.ok(contrast(graphite, canvas) >= 16.8, `graphite on canvas ${contrast(graphite, canvas).toFixed(2)}`);
  assert.ok(contrast(muted, canvas) >= 7, `graphite-muted on canvas ${contrast(muted, canvas).toFixed(2)}`);
  assert.ok(contrast(muted, surface) >= 7, `graphite-muted on surface ${contrast(muted, surface).toFixed(2)}`);
  const g = contrast(green, canvas);
  assert.ok(g >= 3.0 && g <= 4.49, `verification green on canvas ${g.toFixed(2)} (large text and marks only, sh-047)`);
  assert.ok(contrast(graphite, green) >= 4.5, `graphite on verification green ${contrast(graphite, green).toFixed(2)}`);
  assert.ok(contrast(onPrimary, graphite) >= 16.8, `on-primary on graphite ${contrast(onPrimary, graphite).toFixed(2)}`);
});

// C2 Decision 1 (2026-10-05): a name in a script the certificate face lacks, Greek included, is
// drawn as an image, as emoji and CJK names are, and no second face ships. Greek is not required
// of Cormorant Garamond; test 2 keeps the shipped families to the four.
test("4. Cormorant Garamond's TTF covers Latin, Latin Extended and Cyrillic (Greek not required); coverage.json records its cmap", () => {
  const ttfs = files('src/fonts', /\.ttf$/i);
  const cormorant = fontFacts(ttfs.map(abs)).filter((f) => f.family === 'Cormorant Garamond');
  assert.ok(cormorant.length > 0, 'no Cormorant Garamond TTF');
  const cmaps: number[][] = JSON.parse(
    python(
      'import sys, json\nfrom fontTools.ttLib import TTFont\n' +
        'print(json.dumps([sorted(TTFont(p).getBestCmap().keys()) for p in sys.argv[1:]]))',
      cormorant.map((c) => c.path),
    ),
  );
  const ranges: [string, number, number][] = [
    ['Basic Latin letters', 0x41, 0x5a],
    ['Basic Latin letters', 0x61, 0x7a],
    ['Latin-1 Supplement letters', 0xc0, 0xff],
    ['Latin Extended-A', 0x100, 0x17f],
    ['Cyrillic', 0x410, 0x44f],
  ];
  for (const cmap of cmaps) {
    const set = new Set(cmap);
    for (const [what, a, b] of ranges) {
      const missing: string[] = [];
      for (let c = a; c <= b; c++) if (c !== 0xd7 && c !== 0xf7 && !set.has(c)) missing.push(c.toString(16));
      assert.deepEqual(missing, [], `Cormorant Garamond TTF lacks ${what}`);
    }
  }
  const cov = JSON.parse(readMust('src/fonts/coverage.json'));
  const listed = new Set<number>();
  const add = (v: unknown) => {
    if (typeof v === 'number') listed.add(v);
    else if (typeof v === 'string' && /^(U\+)?[0-9a-f]+$/i.test(v)) listed.add(parseInt(v.replace(/^U\+/i, ''), 16));
    else if (Array.isArray(v) && v.length === 2 && v.every((x) => typeof x === 'number')) for (let c = v[0]; c <= v[1]; c++) listed.add(c);
    else if (Array.isArray(v)) v.forEach(add);
    else if (v && typeof v === 'object') Object.values(v).forEach(add);
  };
  add(cov);
  const union = new Set(cmaps.flat());
  for (const c of union) assert.ok(listed.has(c), `coverage.json lacks U+${c.toString(16)} of the cmap`);
});
