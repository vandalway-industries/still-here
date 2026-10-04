// N1 (still-here-kdn) — isitstillhere.com live. garage/pack/ACCEPTANCE.md § N1, items 1–6, against
// GitHub's API (gh) and production. Red until launch. Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { connect } from 'node:tls';
import { mkdtempSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { ROOT, sh, walk } from '../helpers/repo.ts';

const REPO = 'vandalway-industries/still-here';
const PROD = 'https://isitstillhere.com';
const gh = (path: string) => JSON.parse(sh('gh', ['api', path]));

function deployedSha(): string {
  const d = gh(`repos/${REPO}/deployments?environment=github-pages&per_page=1`);
  assert.ok(d.length, 'a Pages deployment');
  return d[0].sha;
}

test('1. private vulnerability reporting is enabled; RENEWAL_ASSIGNEE is set', () => {
  assert.equal(gh(`repos/${REPO}/private-vulnerability-reporting`).enabled, true);
  const vars = JSON.parse(sh('gh', ['variable', 'list', '-R', REPO, '--json', 'name']));
  assert.ok(vars.some((v: { name: string }) => v.name === 'RENEWAL_ASSIGNEE'));
});

test('2. the Pages API: workflow build, cname, HTTPS enforced, domain verified', () => {
  const p = gh(`repos/${REPO}/pages`);
  assert.equal(p.build_type, 'workflow');
  assert.equal(p.cname, 'isitstillhere.com');
  assert.equal(p.https_enforced, true);
  assert.equal(p.protected_domain_state, 'verified');
});

test('3. /build.txt equals the deployed commit', async () => {
  const sha = deployedSha();
  assert.equal((await (await fetch(`${PROD}/build.txt`, { cache: 'no-store' })).text()).trim(), sha);
  // within 15 minutes of the deploy: GitHub records when the deployment was created and when it
  // reported success (Pages then serves it); the gap is at most 15 minutes
  const dep = gh(`repos/${REPO}/deployments?environment=github-pages&per_page=1`)[0];
  const statuses: { state: string; created_at: string }[] = gh(`repos/${REPO}/deployments/${dep.id}/statuses`);
  const ok = statuses.filter((x) => x.state === 'success').map((x) => Date.parse(x.created_at)).sort((a, b) => a - b)[0];
  assert.ok(ok, 'the deployment reported success');
  assert.ok(ok - Date.parse(dep.created_at) <= 15 * 60_000, `served ${Math.round((ok - Date.parse(dep.created_at)) / 60_000)} minutes after the deploy`);
});

test('4. http answers 301 to https; www and the apex redirect one way; the certificate covers both names', async () => {
  const r = await fetch('http://isitstillhere.com/', { redirect: 'manual' });
  assert.equal(r.status, 301);
  assert.match(r.headers.get('location') ?? '', /^https:\/\/isitstillhere\.com\/?$/);
  const www = await fetch('https://www.isitstillhere.com/', { redirect: 'manual' });
  assert.ok([301, 308].includes(www.status));
  assert.match(www.headers.get('location') ?? '', /^https:\/\/isitstillhere\.com\/?$/);
  const apex = await fetch(`${PROD}/`, { redirect: 'manual' });
  assert.equal(apex.status, 200, 'the apex does not redirect back');
  for (const name of ['isitstillhere.com', 'www.isitstillhere.com']) {
    await new Promise<void>((ok, fail) => {
      const s = connect({ host: name, port: 443, servername: name }, () => {
        s.authorized ? ok() : fail(new Error(`${name}: ${s.authorizationError}`));
        s.end();
      });
      s.on('error', fail);
    });
  }
});

test("5. research 3's URL table, the 404 sentence, records paths 404", async () => {
  const get = (p: string) => fetch(PROD + p, { redirect: 'manual' });
  assert.equal((await get('/index')).status, 200);
  assert.equal((await get('/index.html')).status, 200);
  assert.equal((await get('/index/')).status, 404);
  assert.equal((await get('/research')).status, 301);
  const nf = await get('/no-such-page');
  assert.equal(nf.status, 404);
  assert.match(await nf.text(), /We could not locate this page\. The page, however, is still here\./);
  for (const p of ['/company/tracker/TRACKER.md', '/README.md']) assert.equal((await get(p)).status, 404, p);
});

test("6. the artifact's file list equals the site/ tree of that commit", () => {
  const sha = deployedSha();
  const runs = gh(`repos/${REPO}/actions/runs?head_sha=${sha}&per_page=5`).workflow_runs.filter((r: { path: string }) => /pages\.yml/.test(r.path));
  assert.ok(runs.length, 'the Pages run of the deployed commit');
  const dl = mkdtempSync(join(tmpdir(), 'still-here-artifact-'));
  sh('gh', ['run', 'download', String(runs[0].id), '-R', REPO, '-n', 'github-pages', '-D', dl]);
  const tar = readdirSync(dl).find((f) => f.endsWith('.tar'))!;
  const listed = sh('tar', ['-tf', join(dl, tar)]).split('\n').map((l) => l.replace(/^\.\//, '')).filter((l) => l && !l.endsWith('/')).sort();
  // that commit, built here
  const tree = mkdtempSync(join(tmpdir(), 'still-here-commit-'));
  sh('bash', ['-c', `git archive ${sha} | tar -x -C '${tree}'`]);
  sh('ln', ['-s', join(ROOT, 'node_modules'), join(tree, 'node_modules')]);
  sh('npm', ['run', 'build', '--silent'], { cwd: tree });
  const site = join(tree, 'site');
  const built = walk(site).map((f) => relative(site, f)).filter((f) => f !== 'build.txt').sort();
  assert.deepEqual(listed.filter((f) => f !== 'build.txt'), built);
});
