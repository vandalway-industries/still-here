// T0 (still-here-64t) — tests written first and locked.
// Checks garage/pack/ACCEPTANCE.md § T0 items 1–4 mechanically: every test file the acceptance
// names exists under its bead's real id; every walk of WALKS.md has its bead's walk spec, written
// with role and visible-text locators only, each substitute step calling the helper WALKS.md
// § Substitute evidence names; the run recorded at the tag was red for every bead after Phase 0 and
// green for Phase 0; and the files are locked at the tag. Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as S from '../../e2e/helpers/strings.ts';
import { exists, files, read, readMust, run, sh } from '../helpers/repo.ts';

const T0 = 'still-here-64t';
const PHASE0 = ['G0', 'G1', 'G2', 'T0'];

type Section = { label: string; body: string };
function sections(): Section[] {
  const out: Section[] = [];
  let cur: Section | null = null;
  for (const line of read('garage/pack/ACCEPTANCE.md').split('\n')) {
    const m = /^### ([A-Z]+\d+) — /.exec(line);
    if (m) {
      cur = { label: m[1], body: '' };
      out.push(cur);
    } else if (/^#{1,2} /.test(line)) cur = null;
    else if (cur) cur.body += `${line}\n`;
  }
  return out;
}

function beadMap(): Map<string, { id: string; files: string[] }> {
  const map = new Map<string, { id: string; files: string[] }>();
  for (const line of read('docs/bead-map.md').split('\n')) {
    const m = /^\| ([A-Z]+\d+) \| `([a-z0-9-]+)` \| [^|]+ \| ([^|]*) \|$/.exec(line);
    if (m) map.set(m[1], { id: m[2], files: [...m[3].matchAll(/`([^`]+)`/g)].map((x) => x[1]) });
  }
  return map;
}

/** The files a section's CODE PASS and BROWSER PASS lines name: `tests/unit/<id>-x.test.ts`, `e2e/specs/<id>-x.spec.ts`. */
const named = (body: string, id: string) =>
  body
    .split('\n')
    .filter((l) => /^- \[[ xX]\] (CODE|BROWSER) PASS/.test(l))
    .flatMap((l) => [...l.matchAll(/`((?:tests\/unit|e2e\/specs)\/<id>-[\w-]+\.(?:test|spec)\.ts)`/g)].map((m) => m[1].replace('<id>', id)));

// Which bead plays which walk steps (docs/bead-map.md § Walks): from WALKS.md's headings
// (W1: E0, E2, E4; W2: E5, E6; …) and the steps each bead's acceptance names.
export const WALK_STEPS: Record<string, string[]> = {
  E0: ['W4_1', 'W4_2'],
  E2: ['W1_1', 'W1_2', 'W1_3', 'W1_4', 'W1_5', 'W1_8', 'W1_9', 'W1_10', 'W8_1', 'W8_2'],
  E4: ['W1_6', 'W1_7'],
  E6: ['W2_1', 'W2_2', 'W2_3', 'W2_4', 'W2_5', 'W2_6', 'W2_7'],
  E7: ['W3_1', 'W3_2', 'W3_3', 'W3_4', 'W3_5'],
  S2: ['W4_leadership'],
  S3: ['W4_research'],
  S4: ['W4_caseStudies'],
  S5: ['W4_status'],
  S6: ['W4_careers'],
  S7: ['W5_1', 'W5_2', 'W5_3'],
  S8: ['W4_legal_terms'],
  S9: ['W4_legal_privacy'],
  X3: ['W4_404'],
  X4: ['W6_1', 'W6_2', 'W6_3', 'W6_4', 'W6_5', 'W6_6', 'W6_7', 'W6_8'],
  RC8: ['W9_1', 'W9_2', 'W9_3', 'W9_5'],
  V4: ['W7_1', 'W7_2', 'W7_3', 'W7_4', 'W7_5'],
  L5: [
    ...['W1_1', 'W1_2', 'W1_3', 'W1_4', 'W1_5', 'W1_6', 'W1_7', 'W1_8', 'W1_9', 'W1_10'],
    ...['W2_1', 'W2_2', 'W2_3', 'W2_4', 'W2_5', 'W2_6', 'W2_7', 'W3_1', 'W3_2', 'W3_3', 'W3_4', 'W3_5'],
    ...['W4_1', 'W4_2', 'W4_leadership', 'W4_research', 'W4_caseStudies', 'W4_status', 'W4_careers', 'W4_legal_terms', 'W4_legal_privacy', 'W4_404'],
    ...['W5_1', 'W5_2', 'W5_3', 'W6_1', 'W6_2', 'W6_3', 'W6_4', 'W6_5', 'W6_6', 'W6_7', 'W6_8'],
    ...['W7_1', 'W7_2', 'W7_3', 'W7_4', 'W7_5', 'W8_1', 'W8_2', 'W9_1', 'W9_2', 'W9_3', 'W9_5'],
  ],
  N2: ['W7_1', 'W7_2', 'W7_3', 'W7_4', 'W7_5'],
  N3: [
    ...['W1_1', 'W1_2', 'W1_3', 'W1_4', 'W1_5', 'W1_6', 'W1_7', 'W1_8', 'W1_9', 'W1_10'],
    ...['W2_1', 'W2_2', 'W2_3', 'W2_4', 'W2_5', 'W2_6', 'W2_7', 'W3_1', 'W3_2', 'W3_3', 'W3_4', 'W3_5'],
    ...['W4_1', 'W4_2', 'W4_leadership', 'W4_research', 'W4_caseStudies', 'W4_status', 'W4_careers', 'W4_legal_terms', 'W4_legal_privacy', 'W4_404'],
    ...['W5_1', 'W5_2', 'W5_3', 'W6_1', 'W6_2', 'W6_3', 'W6_4', 'W6_5', 'W6_6', 'W6_7', 'W6_8'],
    ...['W7_1', 'W7_2', 'W7_3', 'W7_4', 'W7_5', 'W8_1', 'W8_2', 'W9_1', 'W9_2', 'W9_3', 'W9_4', 'W9_5'],
  ],
};

/** A step function's name as WALKS.md writes the step: W1_6 → W1.6, W4_caseStudies → W4.case-studies. */
const stepId = (fn: string) =>
  fn
    .replace(/^W(\d)_/, 'W$1.')
    .replace('caseStudies', 'case-studies')
    .replace(/legal_(terms|privacy)$/, 'legal');

/** Every step WALKS.md writes: W1.1 … W9.5, the W4 sub-walks, W-DoD. */
function walkSteps(): string[] {
  const out: string[] = [];
  let walk = '';
  for (const line of read('garage/pack/WALKS.md').split('\n')) {
    const h = /^## (W\d|W-DoD)\b/.exec(line);
    if (h) walk = h[1];
    else if (/^## /.test(line)) walk = '';
    if (walk === 'W-DoD') continue;
    const n = /^(\d+)\. /.exec(line);
    if (/^W\d$/.test(walk) && n) out.push(`${walk}.${n[1]}`);
    const sub = /^- \*\*(W4\.[a-z0-9-]+) /.exec(line);
    if (sub) out.push(sub[1]);
  }
  return out;
}

/** WALKS.md § Substitute evidence: step id → helper name (e.g. W1.6 → openDownload). */
function substitutes(): Map<string, string> {
  const map = new Map<string, string>();
  const sec = read('garage/pack/WALKS.md').split('## Substitute evidence')[1].split('\n## ')[0];
  for (const line of sec.split('\n')) {
    const c = line.split('|').slice(1, -1).map((x) => x.trim());
    if (c.length !== 4 || !/^W\d/.test(c[0])) continue;
    const helper = /`(\w+)\(\)`/.exec(c[3])?.[1];
    if (!helper) continue;
    for (const part of c[0].split(/,\s*/)) {
      const range = /^W(\d)\.(\d+)(?:–(\d+))?$/.exec(part);
      if (!range) continue;
      for (let i = Number(range[2]); i <= Number(range[3] ?? range[2]); i++) map.set(`W${range[1]}.${i}`, helper);
    }
  }
  return map;
}

/** Each exported step function of walks.ts, with its body. */
function stepBodies(): Map<string, string> {
  const src = read('e2e/helpers/walks.ts');
  const out = new Map<string, string>();
  const heads = [...src.matchAll(/^export async function (W\w+)\(/gm)];
  heads.forEach((h, i) => out.set(h[1], src.slice(h.index!, i + 1 < heads.length ? heads[i + 1].index : src.length)));
  return out;
}

/** The text of every evaluate(...) call's argument list, bracket-matched. */
function evaluateCalls(src: string): string[] {
  const out: string[] = [];
  for (const m of src.matchAll(/\.(?:evaluate|evaluateHandle|\$eval|\$\$eval)\s*\(/g)) {
    let depth = 0;
    let i = m.index! + m[0].length - 1;
    const start = i;
    for (; i < src.length; i++) {
      if (src[i] === '(') depth++;
      else if (src[i] === ')' && --depth === 0) break;
    }
    out.push(src.slice(start, i + 1));
  }
  return out;
}

test('1. every test file named in ACCEPTANCE.md exists, named with its real bead id; docs/bead-map.md agrees', () => {
  const map = beadMap();
  const secs = sections();
  assert.equal(secs.length, 53, 'ACCEPTANCE.md has 53 sections');
  let count = 0;
  for (const s of secs) {
    const entry = map.get(s.label);
    assert.ok(entry, `${s.label} is in docs/bead-map.md`);
    const want = named(s.body, entry!.id);
    assert.ok(want.length > 0, `${s.label} names its test files`);
    for (const f of want) {
      assert.ok(exists(f), `${s.label}: ${f} exists`);
      count++;
    }
    const walk = WALK_STEPS[s.label] ? [`e2e/specs/${entry!.id}-walk.spec.ts`] : [];
    assert.deepEqual([...new Set([...want, ...walk])].sort(), [...entry!.files].sort(), `${s.label}: docs/bead-map.md lists exactly its files`);
  }
  assert.equal(map.get('T0')!.id, T0);
  assert.ok(count >= 90, `${count} named files`);
  // and no test file is named for a bead id that does not exist
  const ids = new Set([...map.values()].map((e) => e.id));
  for (const f of [...files('tests/unit', /\.test\.ts$/), ...files('e2e/specs', /\.spec\.ts$/)]) {
    const id = /\/(still-here-[a-z0-9]{3})-/.exec(f)?.[1];
    assert.ok(id && ids.has(id), `${f} is named for a bead`);
  }
});

test('2. every walk has its bead\'s walk spec; role and visible-text locators only; each substitute step calls its named helper', () => {
  const map = beadMap();
  const bodies = stepBodies();
  // every step WALKS.md writes is played by some bead's walk spec
  const owned = new Set(Object.values(WALK_STEPS).flat().map(stepId));
  for (const step of walkSteps()) assert.ok(owned.has(step), `${step} is played by a bead's walk spec`);
  // W-DoD is N3's walk
  assert.match(read(`e2e/specs/${map.get('N3')!.id}-walk.spec.ts`), /W-DoD/);
  for (const fn of new Set(Object.values(WALK_STEPS).flat())) assert.ok(bodies.has(fn), `walks.ts exports ${fn}`);

  const scanned: string[] = ['e2e/helpers/walks.ts'];
  for (const [label, fns] of Object.entries(WALK_STEPS)) {
    const spec = `e2e/specs/${map.get(label)!.id}-walk.spec.ts`;
    const src = readMust(spec);
    scanned.push(spec);
    for (const fn of fns) assert.match(src, new RegExp(`\\b${fn}\\b\\s*[(\\],]|\\bW\\.${fn}\\b`), `${label}: ${spec} plays ${fn}`);
  }
  for (const f of scanned) {
    const src = read(f).replace(/^\s*\/\/.*$/gm, '');
    assert.doesNotMatch(src, /getByTestId/, `${f}: no test ids`);
    assert.doesNotMatch(src, /\.focus\s*\(/, `${f}: no focus() call`);
    assert.doesNotMatch(src, /\.locator\s*\(|\.\$\$?\s*\(|waitForSelector|xpath=|css=/, `${f}: role and visible-text locators only`);
    for (const call of evaluateCalls(src)) assert.doesNotMatch(call, /\bclick\b|dispatchEvent|MouseEvent|PointerEvent|\.submit\s*\(/, `${f}: an evaluate that clicks`);
    const waits = [...src.matchAll(/waitForTimeout\s*\(/g)].length;
    if (f === 'e2e/helpers/walks.ts') {
      assert.equal(waits, 1, 'waitForTimeout appears once in walks.ts');
      assert.match(bodies.get('W7_2')!, /waitForTimeout\s*\(/, 'and only in W7.2');
    } else assert.equal(waits, 0, `${f}: no waitForTimeout`);
  }
  // the substitute steps
  const subs = substitutes();
  assert.ok(subs.size >= 8, `${subs.size} substitute steps in WALKS.md`);
  for (const [step, helper] of subs) {
    const fn = step.replace('.', '_');
    assert.ok(bodies.has(fn), `walks.ts plays ${step}`);
    assert.match(bodies.get(fn)!, new RegExp(`\\b${helper}\\s*\\(`), `${step} calls ${helper}()`);
    assert.match(bodies.get(fn)!, /played \(substitute\)/, `${step} reports "played (substitute)"`);
  }
  const helpers = read('e2e/helpers/index.ts');
  for (const h of new Set(subs.values())) assert.match(helpers, new RegExp(`\\b${h}\\b`), `e2e/helpers exports ${h}()`);
});

test('the fixed and interface strings the tests hold are CONTENT_SEEDS.md\'s, byte for byte', () => {
  const seeds = read('garage/pack/CONTENT_SEEDS.md');
  const strings: string[] = [
    S.HOME_HEADING, S.CHECK_BUTTON, ...S.LINES, S.RESULT_HEADING, ...S.RESULT_ACTIONS, S.FOOTER, S.ZONE_LABEL, S.NOT_LOCATED, S.FUTURE,
    S.NOT_FOUND, S.ENTERPRISE_CTA, S.STATUS_CONSTANT, ...S.STATUS_TITLES, S.FOOTER_ACK, S.JULES_PHRASE, S.RESEARCH_ENTERPRISE, S.PRESENCE_BODY,
    ...S.EXAMPLES, ...S.CAREERS_TITLES, S.GUESTBOOK_TITLE, S.UNDER_HEADING, S.EMPTY_INPUT, S.PORTFOLIO_LINE, S.BEFORE_2026, S.PREPARING_PDF,
    S.PREPARING_PNG, S.EXPORT_FAILED, S.COPIED, S.CLIPBOARD_REFUSED, ...S.FAILURE_LINKS, ...Object.values(S.VERIFY_LABELS), S.VERIFY_EMPTY,
    S.PORTFOLIO_HEADING, S.PORTFOLIO_EMPTY, ...S.PORTFOLIO_ACTIONS, S.RETURN_HOME, ...S.TERMS, ...S.PRIVACY, S.PORTFOLIO_KEY,
    ...S.VECTORS.map((v) => v.id), ...S.DERIVED_VECTORS.map((v) => v.id),
  ];
  const acc = read('garage/pack/ACCEPTANCE.md');
  for (const s of strings) assert.ok(seeds.includes(s) || acc.includes(s), `not verbatim in CONTENT_SEEDS.md or ACCEPTANCE.md: ${s}`);
  for (const [name] of S.MENU) assert.ok(read('PRD.md').includes(name));
});

type Counts = { pass: number; fail: number; skip: number };
type Baseline = { tag: string; recorded: string; unit: Record<string, Counts>; playwright: { projects: string[]; files: Record<string, Counts> } };

test('3. the run recorded at specs-v1: red for every bead after Phase 0, green for G0, G1, G2 and T0', () => {
  const b = JSON.parse(readMust('tests/fixtures/specs-v1-baseline.json')) as Baseline;
  assert.equal(b.tag, 'specs-v1');
  const map = beadMap();
  for (const [label, entry] of map) {
    const unit = entry.files.filter((f) => f.startsWith('tests/unit/'));
    const specs = entry.files.filter((f) => f.startsWith('e2e/specs/'));
    if (PHASE0.includes(label)) {
      for (const f of unit) {
        if (f === `tests/unit/${T0}-specs.test.ts`) continue; // this file is run green after the tag, below and in the close notes
        assert.ok(b.unit[f], `${f} was run`);
        assert.equal(b.unit[f].fail, 0, `${label} is green: ${f}`);
      }
      continue;
    }
    for (const f of unit) assert.ok(b.unit[f], `${f} was run`);
    const redUnit = unit.some((f) => b.unit[f].fail > 0);
    assert.ok(redUnit, `${label} is red: ${unit.join(', ')}`);
    for (const f of specs) {
      const c = b.playwright.files[f];
      assert.ok(c, `${f} was run`);
      // a spec is red, or skipped where it needs staging, the internal copy or production
      assert.ok(c.fail > 0 || (c.pass === 0 && c.skip > 0), `${f} is not green before its bead is built (${JSON.stringify(c)})`);
    }
  }
});

test('4. the commit is tagged specs-v1, and every test file, helper and fixture is locked at the tag', () => {
  const gate = read('.bd-gate');
  // specs-v1, or the re-tag a checkpoint red-pen made (CHECKPOINTS.md), as .bd-gate names it
  const tag = /^lock_tag\s*=\s*(\S+)/m.exec(gate)?.[1];
  assert.match(tag ?? '', /^specs-v\d+$/, '.bd-gate names the lock tag');
  assert.equal(run('git', ['rev-parse', '-q', '--verify', 'refs/tags/specs-v1']).status, 0, 'specs-v1 exists');
  assert.equal(run('git', ['rev-parse', '-q', '--verify', `refs/tags/${tag}`]).status, 0, `the tag ${tag} exists`);
  const locked = [
    ...[...beadMap().values()].flatMap((e) => e.files),
    ...files('tests/helpers'),
    ...files('e2e/helpers'),
    'tests/fixtures/specs-v1-baseline.json',
  ];
  for (const f of locked) {
    assert.equal(run('git', ['cat-file', '-e', `${tag}:${f}`]).status, 0, `${f} is in ${tag}`);
    assert.equal(run('git', ['diff', '--quiet', tag, '--', f]).status, 0, `${f} is unchanged since ${tag}`);
  }
  assert.ok(sh('git', ['tag', '--points-at', tag!]).includes(tag!));
});
