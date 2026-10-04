// L2 (still-here-6m0) — the workflows. garage/pack/ACCEPTANCE.md § L2, items 1–4.
// Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEPLOY_LOG, readMust, run, yaml } from '../helpers/repo.ts';

type Step = { uses?: string; run?: string; with?: Record<string, unknown>; name?: string };
type Job = { steps?: Step[]; if?: string; environment?: string | { name: string }; permissions?: unknown; 'runs-on'?: string };
type Wf = { on?: any; true?: any; jobs: Record<string, Job>; permissions?: unknown };
const wf = (f: string) => yaml(readMust(f)) as Wf;
const on = (w: Wf) => w.on ?? w.true; // YAML 1.1 reads a bare `on:` key as true
const steps = (w: Wf) => Object.values(w.jobs).flatMap((j) => j.steps ?? []);

test('1. pages.yml: push to main and workflow_dispatch; the three pinned actions; site/ with hidden files; the github-pages environment; no schedule', () => {
  const w = wf('.github/workflows/pages.yml');
  const o = on(w);
  assert.deepEqual(o.push?.branches, ['main']);
  assert.ok('workflow_dispatch' in o);
  assert.ok(!('schedule' in o), 'no schedule');
  const uses = steps(w).map((s) => s.uses).filter(Boolean) as string[];
  for (const a of ['actions/configure-pages@v6.0.0', 'actions/upload-pages-artifact@v5.0.0', 'actions/deploy-pages@v5.0.1']) assert.ok(uses.includes(a), a);
  assert.deepEqual(uses.filter((u) => /^actions\/(configure-pages|upload-pages-artifact|deploy-pages)@/.test(u)).sort(), ['actions/configure-pages@v6.0.0', 'actions/deploy-pages@v5.0.1', 'actions/upload-pages-artifact@v5.0.0']);
  const upload = steps(w).find((s) => s.uses?.startsWith('actions/upload-pages-artifact@'))!;
  assert.equal(upload.with?.path, 'site');
  assert.equal(String(upload.with?.['include-hidden-files']), 'true');
  const env = Object.values(w.jobs).map((j) => (typeof j.environment === 'string' ? j.environment : j.environment?.name));
  assert.ok(env.includes('github-pages'), 'deploys through the github-pages environment');
});

test('2. the job runs npm ci, npm run build and check:security-txt, writes GITHUB_SHA to site/build.txt, and is skipped while private', () => {
  const w = wf('.github/workflows/pages.yml');
  const runs = steps(w).map((s) => s.run ?? '').join('\n');
  for (const c of ['npm ci', 'npm run build', 'npm run check:security-txt']) assert.ok(runs.includes(c), c);
  assert.match(runs, /GITHUB_SHA[^\n]*>\s*site\/build\.txt|echo[^\n]*github\.sha[^\n]*site\/build\.txt/);
  for (const j of Object.values(w.jobs)) assert.match(String(j.if ?? ''), /github\.event\.repository\.private\s*==\s*false|!\s*github\.event\.repository\.private/, 'each job is skipped while the repository is private');
});

test('3. both workflow files were pushed over SSH and are on main', () => {
  for (const f of ['.github/workflows/pages.yml', '.github/workflows/security-txt-reminder.yml']) {
    assert.equal(run('git', ['cat-file', '-e', `origin/main:${f}`]).status, 0, `${f} is on origin/main`);
  }
  assert.match(run('git', ['remote', 'get-url', '--push', 'origin']).stdout.trim(), /^git@github\.com:/, 'pushed over SSH');
});

test('4. the reminder: weekly and on dispatch; contents read and issues write only; commits and deploys nothing; opens "Renew security.txt" for RENEWAL_ASSIGNEE at 30 days; the dry run', () => {
  const text = readMust('.github/workflows/security-txt-reminder.yml');
  const w = wf('.github/workflows/security-txt-reminder.yml');
  const o = on(w);
  assert.ok('workflow_dispatch' in o);
  const cron: string[] = (o.schedule ?? []).map((s: { cron: string }) => s.cron);
  assert.equal(cron.length, 1);
  assert.match(cron[0], /^\S+ \S+ \* \* [0-6]$/, 'weekly');
  assert.deepEqual(w.permissions, { contents: 'read', issues: 'write' });
  for (const j of Object.values(w.jobs)) assert.ok(j.permissions === undefined, 'no job widens the permissions');
  for (const s of steps(w).filter((x) => x.uses?.startsWith('actions/checkout@'))) assert.equal(String(s.with?.['persist-credentials']), 'false', 'never checks out for writing');
  assert.doesNotMatch(text, /git (commit|push)|deploy-pages|upload-pages-artifact/, 'commits nothing and deploys nothing');
  assert.match(text, /Renew security\.txt/);
  assert.match(text, /vars\.RENEWAL_ASSIGNEE/);
  assert.match(text, /\b30\b/);
  assert.match(text, /state[=:]\s*open|--state open|state: 'open'|state: "open"/, 'looks for an open issue first');
  assert.match(readMust(DEPLOY_LOG), /security-txt-reminder[^\n]*dry run[^\n]*(opened|closed)|dry run[^\n]*Renew security\.txt/i, 'the dry run with a fabricated near date is recorded');
});
