// L4 (still-here-48f) — the release scan. garage/pack/ACCEPTANCE.md § L4, items 1–5. The PII gate is
// the factory's (FACTORY_DIR, from the environment or the uncommitted .env.local), run at the public tier with the
// repository's two approved allowances (the pre-commit hook's PII_ALLOW_REGEX).
// Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { abs, builtSite, files, imageMetadata, read, run, sh, siteFiles } from '../helpers/repo.ts';
import { localPath } from '../helpers/local-env.ts';

const GATE = () => join(localPath('FACTORY_DIR'), 'scripts/pii-gate.sh');
const ALLOW = () => read('.git/hooks/pre-commit').match(/PII_ALLOW_REGEX='([^']+)'/)?.[1] ?? '';
const gate = (args: string[], cwd?: string) => run(GATE(), args, { cwd, env: { PII_PUBLIC: '1', PII_ALLOW_REGEX: ALLOW() } });

test('1. PII_PUBLIC=1 pii-gate.sh --tree . exits 0', () => {
  assert.ok(existsSync(GATE()), 'the factory PII gate');
  const r = gate(['--tree', '.']);
  assert.equal(r.status, 0, r.stdout + r.stderr);
});

test('2. the same strings over every blob in git log --all find nothing', () => {
  const blobs = sh('git', ['rev-list', '--all', '--objects'])
    .split('\n')
    .map((l) => l.split(' '))
    .filter(([sha, path]) => sha && path);
  const seen = new Set<string>();
  const dir = mkdtempSync(join(tmpdir(), 'still-here-history-'));
  sh('git', ['init', '-q'], { cwd: dir });
  let n = 0;
  for (const [sha, path] of blobs) {
    if (seen.has(sha) || sh('git', ['cat-file', '-t', sha]).trim() !== 'blob') continue;
    seen.add(sha);
    if (/^(garage\/)?assets\//.test(path)) continue;
    const out = join(dir, `${sha.slice(0, 12)}-${path.replace(/\//g, '__')}`);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, sh('git', ['cat-file', 'blob', sha]));
    n++;
  }
  sh('git', ['add', '-A'], { cwd: dir });
  assert.ok(n > 100, `${n} historical blobs scanned`);
  const r = gate(['--tree', '.'], dir);
  assert.equal(r.status, 0, r.stdout + r.stderr);
});

test("3. every author and committer is the repository's no-reply address (or GitHub's own); one name", () => {
  const own = sh('git', ['config', '--local', 'user.email']).trim();
  assert.match(own, /@users\.noreply\.github\.com$/);
  const emails = new Set(sh('git', ['log', '--all', '--format=%ae%n%ce']).split('\n').filter(Boolean));
  // The one approved exception (Clive, 2026-10-05; CHECKPOINTS.md § Record): commit 38c10f5, authored
  // in-story. It is allowed by its full sha and its exact address only; any other stray author fails.
  const EXCEPTION = { sha: '38c10f531dda680817cc631f5df2cff7855baed5', email: 'jules@vandalway.example' };
  const stray = sh('git', ['log', '--all', '--format=%H %ae %ce']).split('\n').filter(Boolean)
    .map((l) => l.split(' '))
    .filter(([h, ae, ce]) => !(h === EXCEPTION.sha && ae === EXCEPTION.email && ce === own));
  for (const [h, ae, ce] of stray) for (const e of [ae, ce]) assert.ok(e === own || e === 'noreply@github.com', `${h.slice(0, 7)}: ${e}`);
  assert.ok(emails.has(own), 'the no-reply address authors the history');
  const names = new Set(sh('git', ['log', '--all', '--format=%an%n%cn']).split('\n').filter(Boolean));
  names.delete('GitHub');
  assert.equal(names.size, 1, `one account name: ${[...names].join(', ')}`);
});

test('4. no image under site/ or vandalwayind/ carries metadata', () => {
  const site = builtSite();
  const images = [
    ...siteFiles(/\.(png|jpe?g|gif|webp)$/i).map((f) => [`site/${f}`, readFileSync(join(site, f))] as const),
    ...files('vandalwayind', /\.(png|jpe?g|gif|webp)$/i).map((f) => [f, readFileSync(abs(f))] as const),
  ];
  assert.ok(images.length >= 20, 'both sites are built and carry their images (a scan of nothing fails)');
  const carrying = images.map(([f, b]) => [f, imageMetadata(b)] as const).filter(([, m]) => m.length);
  assert.deepEqual(carrying, []);
});

test('5. the whole tree carries none of the names on the public-tier denylist', () => {
  const deny = localPath('FACTORY_PII_DENYLIST_PUBLIC');
  assert.ok(existsSync(deny), 'the public-tier denylist');
  const names = readFileSync(deny, 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  assert.ok(names.length > 0);
  const hits: string[] = [];
  for (const f of sh('git', ['ls-files', '-z']).split('\0').filter(Boolean)) {
    if (!existsSync(abs(f))) continue;
    const t = readFileSync(abs(f)).toString('latin1').toLowerCase();
    for (const n of names) if (t.includes(n.toLowerCase())) hits.push(f);
  }
  assert.deepEqual([...new Set(hits)], [], 'files naming someone from outside the company (the names are not printed)');
});
