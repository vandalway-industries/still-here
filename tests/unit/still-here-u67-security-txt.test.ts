// X2 (still-here-u67) — security.txt. garage/pack/ACCEPTANCE.md § X2, items 1–3.
// Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { builtSite, copyTree, readMust, run, servedSite, sh, yaml } from '../helpers/repo.ts';

const CONTACT = 'Contact: https://github.com/vandalway-industries/still-here/security/advisories/new';
const RFC3339 = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(Z|[+-]\d\d:\d\d)$/;
const DAY = 86_400_000;

function fields(text: string): Map<string, string> {
  return new Map(text.split(/\r?\n/).filter((l) => /^[A-Za-z-]+:\s/.test(l)).map((l) => [l.split(':')[0], l.slice(l.indexOf(':') + 1).trim()]));
}

test('1. Contact is the private vulnerability reporting URL; Expires is RFC 3339, at most 365 days after the build', () => {
  const file = join(builtSite(), '.well-known/security.txt');
  assert.ok(existsSync(file), 'site/.well-known/security.txt');
  const text = readFileSync(file, 'utf8');
  assert.ok(text.split(/\r?\n/).includes(CONTACT), CONTACT);
  const expires = fields(text).get('Expires');
  assert.ok(expires, 'an Expires field');
  assert.match(expires!, RFC3339);
  const t = Date.parse(expires!);
  assert.ok(t > Date.now(), 'Expires is in the future');
  assert.ok(t <= Date.now() + 365 * DAY + DAY, 'Expires is no more than 365 days after the build');
});

test('2. served as text/plain by the local server', async () => {
  const { url } = await servedSite();
  const r = await fetch(`${url}/.well-known/security.txt`);
  assert.equal(r.status, 200);
  assert.match(r.headers.get('content-type') ?? '', /^text\/plain\b/);
});

test('3. check:security-txt fails under 30 days and passes over; the Pages workflow runs it before upload', () => {
  const dir = copyTree();
  sh(process.execPath, ['scripts/build.mjs'], { cwd: dir });
  const file = join(dir, 'site/.well-known/security.txt');
  const original = readFileSync(file, 'utf8');
  const at = (days: number) => original.replace(/^Expires:.*$/m, `Expires: ${new Date(Date.now() + days * DAY).toISOString().replace(/\.\d+Z$/, 'Z')}`);
  writeFileSync(file, at(10));
  const near = run('npm', ['run', '--silent', 'check:security-txt'], { cwd: dir });
  assert.notEqual(near.status, 0, 'fails when Expires is 10 days away');
  writeFileSync(file, at(29));
  assert.notEqual(run('npm', ['run', '--silent', 'check:security-txt'], { cwd: dir }).status, 0, 'fails at 29 days');
  writeFileSync(file, at(200));
  const far = run('npm', ['run', '--silent', 'check:security-txt'], { cwd: dir });
  assert.equal(far.status, 0, `passes at 200 days: ${far.stdout}${far.stderr}`);

  const wf = yaml(readMust('.github/workflows/pages.yml'));
  const steps: { run?: string; uses?: string }[] = Object.values(wf.jobs as Record<string, { steps: { run?: string; uses?: string }[] }>).flatMap((j) => j.steps ?? []);
  const check = steps.findIndex((s) => /npm run check:security-txt/.test(s.run ?? ''));
  const upload = steps.findIndex((s) => /^actions\/upload-pages-artifact@/.test(s.uses ?? ''));
  assert.ok(check >= 0, 'the workflow runs npm run check:security-txt');
  assert.ok(upload >= 0 && check < upload, 'before the upload');
});
