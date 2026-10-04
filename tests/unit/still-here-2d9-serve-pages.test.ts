// G1 (still-here-2d9) — scaffold and the local Pages server.
// Checks garage/pack/ACCEPTANCE.md § G1 items 1–6 mechanically. Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { copyFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const read = (rel: string): string => readFileSync(join(ROOT, rel), 'utf8');
const sh = (cmd: string, args: string[], opts: { cwd?: string; env?: NodeJS.ProcessEnv } = {}): string =>
  execFileSync(cmd, args, {
    cwd: opts.cwd ?? ROOT,
    encoding: 'utf8',
    env: { ...process.env, ...opts.env },
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 64 * 1024 * 1024,
  });

const EXACT = /^\d+\.\d+\.\d+$/;

test('1. exact pins, npm ci from the lockfile, every package licensed in docs/licences.md', () => {
  const pkg = JSON.parse(read('package.json'));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.optionalDependencies, ...pkg.peerDependencies };
  assert.ok(Object.keys(deps).length > 0, 'package.json has no dependencies');
  for (const [name, range] of Object.entries(deps)) assert.match(String(range), EXACT, `${name} is not pinned exactly: ${range}`);
  for (const name of ['@playwright/test', 'pdfjs-dist', 'jsqr']) assert.ok(name in deps, `${name} missing`);
  assert.equal(deps['@playwright/test'], '1.59.1');

  const lock = JSON.parse(read('package-lock.json'));
  for (const [name, range] of Object.entries(deps)) {
    assert.equal(lock.packages[`node_modules/${name}`]?.version, range, `lockfile disagrees on ${name}`);
  }

  // npm ci, in a scratch folder, from package.json and the lockfile alone
  const dir = mkdtempSync(join(tmpdir(), 'still-here-ci-'));
  try {
    copyFileSync(join(ROOT, 'package.json'), join(dir, 'package.json'));
    copyFileSync(join(ROOT, 'package-lock.json'), join(dir, 'package-lock.json'));
    sh('npm', ['ci', '--ignore-scripts', '--prefer-offline', '--no-audit', '--no-fund'], { cwd: dir });
    for (const name of Object.keys(deps)) assert.ok(existsSync(join(dir, 'node_modules', name, 'package.json')), `${name} not installed by npm ci`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }

  // every package the lockfile can install has a row with its version and licence
  const licences = read('docs/licences.md');
  for (const [key, meta] of Object.entries<{ version?: string; license?: string }>(lock.packages)) {
    if (!key) continue;
    const name = key.replace(/^.*node_modules\//, '');
    const row = licences.split('\n').find((l) => l.startsWith(`| \`${name}\` |`));
    assert.ok(row, `docs/licences.md has no row for ${name}`);
    assert.ok(row!.includes(`| ${meta.version} |`), `docs/licences.md has the wrong version for ${name}`);
    assert.ok(meta.license && row!.includes(`| ${meta.license} |`), `docs/licences.md has the wrong licence for ${name}`);
  }
});

test('2. npm run build writes site/ and nothing outside it; site/ is ignored', () => {
  const before = sh('git', ['status', '--porcelain', '--untracked-files=all']);
  sh('npm', ['run', 'build', '--silent']);
  const after = sh('git', ['status', '--porcelain', '--untracked-files=all']);
  assert.equal(after, before, 'the build changed something git can see');
  assert.ok(statSync(join(ROOT, 'site')).isDirectory());
  assert.ok(existsSync(join(ROOT, 'site/index.html')));
  assert.ok(existsSync(join(ROOT, 'site/404.html')));
  assert.match(read('.gitignore'), /^site\/$/m);
  assert.equal(sh('git', ['check-ignore', 'site/index.html']).trim(), 'site/index.html');
});

test('3. serve-pages.mjs site 5320 answers research 3\'s table', async () => {
  if (!existsSync(join(ROOT, 'site/404.html'))) sh('npm', ['run', 'build', '--silent']);
  // the built site plus one folder, so the trailing-slash row has something to answer for
  const dir = mkdtempSync(join(tmpdir(), 'still-here-pages-'));
  const site = join(dir, 'site');
  cpSync(join(ROOT, 'site'), site, { recursive: true });
  mkdirSync(join(site, 'versions'));
  writeFileSync(join(site, 'versions/index.html'), '<!doctype html><title>versions</title>\n');
  const server = spawn(process.execPath, [join(ROOT, 'scripts/serve-pages.mjs'), 'site', '5320'], { cwd: dir, stdio: ['ignore', 'pipe', 'pipe'] });
  try {
    await new Promise<void>((ok, fail) => {
      const t = setTimeout(() => fail(new Error('server did not start')), 10_000);
      server.stdout.on('data', (b) => String(b).includes('5320') && (clearTimeout(t), ok()));
      server.on('exit', (code) => (clearTimeout(t), fail(new Error(`server exited ${code}`))));
    });
    const get = (p: string) => fetch(`http://127.0.0.1:5320${p}`, { redirect: 'manual' });
    const index = readFileSync(join(site, 'index.html'), 'utf8');
    const notFound = readFileSync(join(ROOT, 'site/404.html'), 'utf8');

    let r = await get('/index');
    assert.equal(r.status, 200);
    assert.equal(await r.text(), index);
    r = await get('/index.html');
    assert.equal(r.status, 200);
    assert.equal(await r.text(), index);
    r = await get('/index/');
    assert.equal(r.status, 404);
    r = await get('/versions');
    assert.equal(r.status, 301);
    assert.equal(r.headers.get('location'), '/versions/');
    r = await get('/versions/');
    assert.equal(r.status, 200);
    r = await get('/not-a-page-that-exists');
    assert.equal(r.status, 404);
    assert.equal(await r.text(), notFound);
    assert.match(notFound, /We could not locate this page\. The page, however, is still here\./);
    r = await get('/../package.json');
    assert.equal(r.status, 404, 'a path outside the root is not served');
    r = await get('/');
    assert.equal(r.status, 200);
    assert.equal(r.headers.get('cache-control'), 'max-age=600');
  } finally {
    server.kill();
    rmSync(dir, { recursive: true, force: true });
  }
});

test('4. playwright.config.ts: three engines, the server above; Playwright 1.59.1; browsers installed', async () => {
  const cfg = read('e2e/playwright.config.ts');
  for (const engine of ['chromium', 'webkit', 'firefox']) {
    assert.match(cfg, new RegExp(`name: '${engine}'`), `no ${engine} project`);
  }
  assert.match(cfg, /devices\['Desktop Chrome'\]/);
  assert.match(cfg, /devices\['Desktop Safari'\]/);
  assert.match(cfg, /devices\['Desktop Firefox'\]/);
  assert.match(cfg, /webServer:/);
  assert.match(cfg, /serve-pages\.mjs \.\.\/site \$\{PORT\}/);
  assert.match(cfg, /const PORT = 5320;/);
  assert.equal(sh('npx', ['playwright', '--version']).trim(), 'Version 1.59.1');
  // each engine's executable for this Playwright version exists
  const { chromium, webkit, firefox } = await import('playwright');
  for (const bt of [chromium, webkit, firefox]) {
    assert.ok(existsSync(bt.executablePath()), `${bt.name()} is not installed (npx playwright install ${bt.name()})`);
  }
  // the substitute helpers WALKS.md names exist
  const helpers = read('e2e/helpers/index.ts');
  for (const name of ['openDownload', 'clearSiteData', 'checkInstallable', 'checkNullMx', 'decodeQr']) {
    assert.match(helpers, new RegExp(`\\b${name}\\b`), `e2e/helpers lacks ${name}()`);
  }
});

test('5. .bd-gate is configured and the gate self-test passes', () => {
  const gate = read('.bd-gate');
  assert.match(gate, /^lock_tag\s*=\s*specs-v1\s*$/m);
  assert.match(gate, /^unit_test_dirs\s*=\s*tests\/unit\s*$/m);
  assert.match(gate, /^unit_test_cmd\s*=\s*node --test\s*$/m);
  assert.match(gate, /^pw_cmd\s*=\s*npx playwright test\s*$/m);
  const selftest = process.env.BD_GATE_SELFTEST ?? join(homedir(), 'bin', 'bd-gate-selftest.sh');
  assert.ok(existsSync(selftest), 'the gate self-test is not installed');
  sh('bash', [selftest]); // throws on a non-zero exit
});

test('6. the OKF validator is vendored from toolkit 0.3.3 with its MIT licence, and runs', () => {
  const py = read('tools/okf/okf_validate.py');
  const licence = read('tools/okf/LICENSE');
  assert.match(licence, /^MIT License/);
  assert.match(py, /Deterministic conformance checker for Open Knowledge Format \(OKF\) v0\.1/);
  assert.match(read('tools/okf/README.md'), /0\.3\.3/);
  const help = sh('python3', ['tools/okf/okf_validate.py', '--help']);
  assert.match(help, /usage: okf_validate\.py/);
});
