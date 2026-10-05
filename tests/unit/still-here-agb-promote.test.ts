// G0 (still-here-agb) — promote, gates, beads filed.
// Checks garage/pack/ACCEPTANCE.md § G0 items 1–9 mechanically. Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, lstatSync, readFileSync, readdirSync, readlinkSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const FACTORY = process.env.FACTORY_DIR ?? join(homedir(), 'projects', 'factory');
const G0_ID = 'still-here-agb';

const sh = (cmd: string, args: string[], env: NodeJS.ProcessEnv = {}): string =>
  execFileSync(cmd, args, {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env, ...env },
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 64 * 1024 * 1024,
  });
const read = (rel: string): string => readFileSync(join(ROOT, rel), 'utf8');

type Section = { heading: string; label: string; owner: string; body: string };

// The ACCEPTANCE.md sections: `### <label> — <title> (owner: <name>)`, body up to the next heading.
function sections(): Section[] {
  const out: Section[] = [];
  let cur: { heading: string; owner: string; lines: string[] } | null = null;
  const flush = () => {
    if (!cur) return;
    out.push({
      heading: cur.heading,
      label: cur.heading.split(' — ')[0],
      owner: cur.owner,
      body: cur.lines.join('\n').replace(/^\n+|\n+$/g, ''),
    });
    cur = null;
  };
  for (const line of read('garage/pack/ACCEPTANCE.md').split('\n')) {
    if (line.startsWith('### ')) {
      flush();
      const m = /^### (.+?) \(owner: (\w+)\)\s*$/.exec(line);
      assert.ok(m, `section heading without an owner: ${line}`);
      cur = { heading: m[1], owner: m[2], lines: [] };
    } else if (/^#{1,2} /.test(line)) {
      flush();
    } else if (cur) {
      cur.lines.push(line);
    }
  }
  flush();
  return out;
}

// Box state is the only difference allowed between a bead and its section: `- [x]` reads as
// `- [ ]`, and a box added to a numbered item when it is flipped (`1. [x] `) is removed.
const unbox = (s: string): string =>
  s
    .split('\n')
    .map((l) => l.replace(/^(\s*-\s+)\[[xX]\]/, '$1[ ]').replace(/^(\s*\d+\.\s+)\[[ xX]\] /, '$1'))
    .join('\n');

// label -> bead id, from docs/bead-map.md
function beadMap(): Map<string, { id: string; owner: string }> {
  const map = new Map<string, { id: string; owner: string }>();
  for (const line of read('docs/bead-map.md').split('\n')) {
    const m = /^\| ([A-Z]+\d+) \| `([a-z0-9-]+)` \| ([a-z]+@vandalway\.example) \|/.exec(line);
    if (m) map.set(m[1], { id: m[2], owner: m[3] });
  }
  return map;
}

type Bead = {
  id: string;
  title: string;
  acceptance_criteria?: string;
  owner?: string;
  created_by?: string;
  labels?: string[];
};
function allBeads(): Bead[] {
  return JSON.parse(sh('bd', ['list', '--all', '--limit', '0', '--json']));
}

test('1. the promoted skeleton is in place', () => {
  for (const f of ['README.md', 'AGENTS.md', 'PROJECT.md', 'PRD.md', 'PLAN.md', 'SESSION_STATUS.md', 'DESIGN.md', '.bd-gate']) {
    assert.ok(statSync(join(ROOT, f)).isFile(), `${f} missing`);
  }
  for (const d of ['garage', 'docs/archive', 'assets', 'e2e/specs', 'tests/unit', '.beads']) {
    assert.ok(statSync(join(ROOT, d)).isDirectory(), `${d}/ missing`);
  }
  assert.ok(lstatSync(join(ROOT, 'CLAUDE.md')).isSymbolicLink(), 'CLAUDE.md is not a symlink');
  assert.equal(readlinkSync(join(ROOT, 'CLAUDE.md')), 'AGENTS.md');
  // the landing gate, as factory §6 describes: the hook script plus its Stop entry
  const hook = join(ROOT, '.claude/hooks/stop-gate.sh');
  assert.ok(statSync(hook).mode & 0o111, 'stop-gate.sh is not executable');
  const settings = JSON.parse(read('.claude/settings.json'));
  const stops = JSON.stringify(settings.hooks?.Stop ?? []);
  assert.match(stops, /\.claude\/hooks\/stop-gate\.sh/);
  // .bd-gate is STRICT and configured for this repository
  const gate = read('.bd-gate');
  // specs-v1, or the re-tag a checkpoint recorded (CHECKPOINTS.md § Record; the re-tag rule)
  const lock = /^lock_tag\s*=\s*(specs-v\d+)\s*$/m.exec(gate)?.[1];
  assert.ok(lock === 'specs-v1' || (lock && (read('garage/pack/CHECKPOINTS.md').split('## Record')[1] ?? '').includes(lock)), `lock_tag ${lock} is specs-v1 or a recorded re-tag`);
  assert.match(gate, /^unit_test_dirs\s*=\s*tests\/unit/m);
  assert.match(gate, /^unit_test_cmd\s*=\s*node --test/m);
});

test('2. AGENTS.md carries the working rules itself, with no push block and no outside pointer', () => {
  const agents = read('AGENTS.md');
  const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
  const seeds = read('garage/pack/CONTENT_SEEDS.md');
  const sec = seeds.split('## AGENTS.md rules')[1].split(/\n## /)[0];
  const rules = sec.split(/\n(?=- )/).filter((b) => b.startsWith('- ')).map(norm);
  assert.equal(rules.length, 6, 'CONTENT_SEEDS § AGENTS.md rules has six rules');
  for (const r of rules) assert.ok(norm(agents).includes(r), `AGENTS.md lacks the rule: ${r.slice(0, 60)}…`);
  assert.doesNotMatch(agents, /BEGIN BEADS INTEGRATION|END BEADS INTEGRATION/);
  assert.doesNotMatch(agents, /bd dolt push|PUSH TO REMOTE|Session Completion/);
  assert.doesNotMatch(agents, /~\/|\/home\/|\.\.\//, 'AGENTS.md points outside the repository');
});

test('3. the pre-commit hook exports PII_PUBLIC=1 and runs the PII gate on staged files', () => {
  const p = join(ROOT, '.git/hooks/pre-commit');
  assert.ok(statSync(p).mode & 0o111, 'pre-commit is not executable');
  const hook = readFileSync(p, 'utf8');
  assert.match(hook, /^export PII_PUBLIC=1$/m);
  assert.match(hook, /scripts\/pii-gate\.sh" --staged/);
  // git must actually run .git/hooks: no hooksPath override
  let hooksPath = '';
  try {
    hooksPath = sh('git', ['config', '--get', 'core.hooksPath']).trim();
  } catch {
    hooksPath = '';
  }
  assert.equal(hooksPath, '', 'core.hooksPath bypasses .git/hooks');
});

// The one accepted exception (CHECKPOINTS.md § Record, 2026-10-05): commit 38c10f5's author is
// jules@vandalway.example; its committer is the account's own. Every other commit, and every
// committer, keeps the no-reply address.
const ACCEPTED_AUTHOR: Record<string, string> = { '38c10f5': 'jules@vandalway.example' };

test('4. commits carry only the GitHub no-reply address (one accepted author exception)', () => {
  const email = sh('git', ['config', '--local', 'user.email']).trim();
  assert.match(email, /@users\.noreply\.github\.com$/);
  const commits = sh('git', ['log', '--format=%H %ae %ce']).split('\n').filter(Boolean).map((l) => l.split(' '));
  assert.ok(commits.length > 0, 'no commits yet');
  const bad: string[] = [];
  for (const [sha, author, committer] of commits) {
    if (committer !== email) bad.push(`${sha.slice(0, 7)} committer ${committer}`);
    const exception = Object.entries(ACCEPTED_AUTHOR).find(([k]) => sha.startsWith(k));
    if (author !== email && !(exception && exception[1] === author)) bad.push(`${sha.slice(0, 7)} author ${author}`);
  }
  assert.deepEqual(bad, [], 'commits with an address other than the no-reply one');
});

test('5. main, and a private remote at vandalway-industries/still-here over SSH', () => {
  assert.equal(sh('git', ['symbolic-ref', 'HEAD']).trim(), 'refs/heads/main');
  assert.equal(sh('git', ['remote', 'get-url', 'origin']).trim(), ['git', 'github.com:vandalway-industries/still-here.git'].join('@'));
  const view = JSON.parse(sh('gh', ['repo', 'view', 'vandalway-industries/still-here', '--json', 'visibility,defaultBranchRef']));
  assert.equal(view.visibility, 'PRIVATE');
  assert.equal(view.defaultBranchRef?.name, 'main');
});

test('6. assets/ equals garage/assets/ file for file, plus the parent logo', () => {
  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
    );
  const hash = (f: string) => createHash('sha256').update(readFileSync(f)).digest('hex');
  const src = join(ROOT, 'garage/assets');
  const dst = join(ROOT, 'assets');
  const want = new Map(walk(src).map((f) => [relative(src, f), hash(f)]));
  const have = new Map(walk(dst).map((f) => [relative(dst, f), hash(f)]));
  assert.ok(have.has('brand/vandalway-industries-logo.png'), 'assets/brand/vandalway-industries-logo.png missing');
  have.delete('brand/vandalway-industries-logo.png');
  assert.deepEqual([...have.keys()].sort(), [...want.keys()].sort());
  for (const [k, h] of want) assert.equal(have.get(k), h, `${k} differs from garage/assets/`);
});

test('7. every ACCEPTANCE section is a bead, verbatim, filed by its owner; any other bead names its source', () => {
  const secs = sections();
  const map = beadMap();
  assert.equal(map.size, secs.length, 'docs/bead-map.md does not list every section');
  const beads = allBeads();
  const byId = new Map(beads.map((b) => [b.id, b]));
  // bd show --json, the field the close gate reads
  const shown: Bead[] = JSON.parse(sh('bd', ['show', ...secs.map((s) => map.get(s.label)!.id), '--json']));
  const showById = new Map(shown.map((b) => [b.id, b]));
  for (const s of secs) {
    const entry = map.get(s.label);
    assert.ok(entry, `${s.label} is not in docs/bead-map.md`);
    const b = showById.get(entry.id) ?? byId.get(entry.id);
    assert.ok(b, `${s.label}: bead ${entry.id} not found`);
    assert.equal(b.title, s.heading, `${s.label}: title`);
    assert.equal(unbox(b.acceptance_criteria ?? ''), s.body, `${s.label}: acceptance differs from ACCEPTANCE.md`);
    const addr = `${s.owner}@vandalway.example`;
    assert.equal(entry.owner, addr, `${s.label}: bead map owner`);
    assert.equal(b.owner, addr, `${s.label}: owner`);
    assert.equal(b.created_by, addr, `${s.label}: filed by`);
  }
  assert.equal(map.get('G0')!.id, G0_ID);
  // Any other bead is work found during the build (C2 test change 3): it must name the bead it was
  // found from, by a `discovered-from` dependency or a note naming that bead's id.
  const packIds = new Set(secs.map((s) => map.get(s.label)!.id));
  const others = beads.filter((b) => !packIds.has(b.id));
  if (others.length > 0) {
    const ids = new Set(beads.map((b) => b.id));
    const detail: (Bead & { dependencies?: { id: string; dependency_type?: string }[] | null; notes?: string | null })[] =
      JSON.parse(sh('bd', ['show', ...others.map((b) => b.id), '--json']));
    for (const b of detail) {
      const fromDep = (b.dependencies ?? []).some((d) => d.dependency_type === 'discovered-from' && ids.has(d.id) && d.id !== b.id);
      const named = [...(b.notes ?? '').matchAll(/\b[a-z0-9]+(?:-[a-z0-9]+)+\b/g)].map((m) => m[0]);
      const fromNote = named.some((n) => ids.has(n) && n !== b.id);
      assert.ok(fromDep || fromNote, `${b.id} is not an ACCEPTANCE section and names no bead it was found from`);
    }
  }
});

test('8. no bead is labelled record', () => {
  for (const b of allBeads()) assert.ok(!(b.labels ?? []).includes('record'), `${b.id} is labelled record`);
  const jsonl = join(ROOT, '.beads/issues.jsonl');
  if (existsSync(jsonl)) {
    for (const line of readFileSync(jsonl, 'utf8').split('\n').filter(Boolean)) {
      const issue = JSON.parse(line);
      assert.ok(!(issue.labels ?? []).includes('record'), `${issue.id} is labelled record in issues.jsonl`);
    }
  }
});

test('9. the drift check reports clean', () => {
  const out = sh(join(FACTORY, 'scripts/docs-sync-check.sh'), ['.']);
  assert.match(out, /docs-sync-check: clean/);
});
