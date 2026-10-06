// X6 (still-here-xoi) — network, privacy and weight guards. garage/pack/ACCEPTANCE.md § X6:
// items 2, 4 and 5 here; items 1 and 3 in the browser (e2e/specs/still-here-xoi-guards.spec.ts).
// Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PAGES_IPV4 } from '../../e2e/helpers/strings.ts';
import { abs, builtSite, files, read, sh, siteFiles, TEXT_EXT, yaml } from '../helpers/repo.ts';

test('2. site/: nothing loaded from another host, no form action, no private key, no signing code; one scheduled workflow, the security.txt reminder', () => {
  const site = builtSite();
  const bad: string[] = [];
  // a PEM private-key header, assembled so this file does not carry one
  const key = new RegExp(`${'-'.repeat(5)}BEGIN [A-Z ]*PRIV${'ATE'} KEY${'-'.repeat(5)}`);
  for (const f of siteFiles(TEXT_EXT)) {
    const t = readFileSync(join(site, f), 'utf8');
    for (const m of t.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']?([^"'\s>]+)/gi)) if (/^(https?:)?\/\//i.test(m[1])) bad.push(`${f}: script ${m[1]}`);
    for (const m of t.matchAll(/<link\b[^>]*\bhref\s*=\s*["']?([^"'\s>]+)/gi)) if (/^(https?:)?\/\//i.test(m[1]) && !/rel\s*=\s*["']?(canonical)/i.test(m[0])) bad.push(`${f}: link ${m[1]}`);
    for (const m of t.matchAll(/url\(\s*["']?([^"')]+)/gi)) if (/^(https?:)?\/\//i.test(m[1])) bad.push(`${f}: url(${m[1]})`);
    for (const m of t.matchAll(/<form\b[^>]*>/gi)) if (/\baction\s*=/i.test(m[0])) bad.push(`${f}: form with action`);
    if (key.test(t)) bad.push(`${f}: a private key`);
    if (/\bsubtle\s*\.\s*sign\s*\(|["'](ECDSA|RSASSA-PKCS1-v1_5|RSA-PSS|Ed25519)["']/.test(t)) bad.push(`${f}: signing code`);
  }
  assert.ok(siteFiles(/\.html$/).length >= 18, 'the site is built');
  assert.deepEqual(bad, []);
  const workflows = files('.github/workflows', /\.ya?ml$/);
  const scheduled = workflows.filter((f) => yaml(read(f))?.on?.schedule || yaml(read(f))?.[true as unknown as string]?.schedule);
  assert.deepEqual(scheduled, ['.github/workflows/security-txt-reminder.yml']);
});

const URL_HOST = /\b[a-z][a-z0-9+.-]*:\/\/([^/\s"'`<>()\]\\:]+)/gi;
const BARE_HOST = /\b((?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:com|net|org|io|dev|app|example|invalid|localhost|test))\b/g;
// internal-network names: in a URL with any of these suffixes, or anywhere as a tailnet name
const INTERNAL = /\.(ts\.net|internal|lan|local|home|corp|home\.arpa)$/i;
const TAILNET = /\b[a-z0-9-]+(\.[a-z0-9-]+)*\.ts\.net\b|\.home\.arpa\b/gi;
// dotted words that are not hosts: a setting's name in bd's own config comments
const NOT_HOSTS = new Set(['github.org']);

/** Hosts of the documentation the research cites (garage/research/). */
function citedHosts(): Set<string> {
  const out = new Set<string>();
  for (const f of files('garage/research', /\.md$/)) for (const m of read(f).matchAll(URL_HOST)) out.add(m[1].toLowerCase());
  return out;
}

function allowed(host: string, cited: Set<string>): boolean {
  const h = host.toLowerCase().replace(/\.$/, '');
  if (['localhost', '127.0.0.1'].includes(h)) return true;
  if (/^(.+\.)?(isitstillhere|vandalwayind)\.com$/.test(h)) return true;
  if (h === 'github.com' || h.endsWith('.github.com')) return true;
  if (/\.(example|invalid|test|localhost)$/.test(h) || /^(.+\.)?example\.(com|net|org)$/.test(h)) return true;
  return cited.has(h);
}

function staged(): string[] {
  return sh('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'])
    .split('\0')
    .filter(Boolean)
    .filter((f) => !/^(garage|assets)\//.test(f) && existsSync(abs(f)) && TEXT_EXT.test(f));
}

function stagingHost(): string | null {
  const fromEnv = process.env.STAGING_URL;
  if (fromEnv) return new URL(fromEnv).hostname;
  if (existsSync(abs('.env.staging'))) {
    const m = /STAGING_URL\s*=\s*["']?(https?:\/\/[^\s"']+)/.exec(readFileSync(abs('.env.staging'), 'utf8'));
    if (m) return new URL(m[1]).hostname;
  }
  return null;
}

test('4. outside garage/ and assets/: no IPv4 but 127.0.0.1 and Pages\' four; no host but ours, GitHub\'s, .example and cited documentation; no staging or internal-network name', () => {
  const cited = citedHosts();
  const staging = stagingHost();
  const bad: string[] = [];
  const list = staged();
  assert.ok(list.some((f) => f.startsWith('src/')) && list.some((f) => f.startsWith('deploy/')), 'the product and its deploy scripts exist to be scanned');
  for (const f of list) {
    let t = read(f);
    // namespaces and schema dialects are identifiers, not hosts we use
    t = t.replace(/\bxmlns(:\w+)?\s*=\s*"[^"]*"/g, '').replace(/"\$schema"\s*:\s*"[^"]*"/g, '');
    if (f === 'package-lock.json') t = t.replace(/"resolved"\s*:\s*"https:\/\/registry\.npmjs\.org\/[^"]*"/g, '');
    // C2 (Phase 4 critic item 25): two hosts we do not choose and never load from. The OFL's own
    // URL inside a verbatim OFL licence text; a package's funding URL inside the npm lockfile; and
    // the prose files (Markdown, the bead export) that name them when they discuss this scan.
    if (/OFL[^/]*\.txt$/i.test(f) && /SIL OPEN FONT LICENSE/i.test(t)) t = t.replace(/(?:https?:\/\/)?scripts\.sil\.org\b/gi, '');
    if (f === 'package-lock.json') t = t.replace(/"funding"\s*:\s*\{[^{}]*?"url"\s*:\s*"https:\/\/opencollective\.com\/[^"]*"[^{}]*\}/g, '').replace(/"funding"\s*:\s*"https:\/\/opencollective\.com\/[^"]*"/g, '');
    if (/\.md$/i.test(f) || f === '.beads/issues.jsonl') t = t.replace(/(?:https?:\/\/)?(?:scripts\.sil\.org|opencollective\.com)\b/gi, '');
    for (const m of t.matchAll(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g)) if (m[0] !== '127.0.0.1' && !(PAGES_IPV4 as readonly string[]).includes(m[0])) bad.push(`${f}: IPv4 ${m[0]}`);
    for (const m of t.matchAll(URL_HOST)) {
      // a web server's placeholder after the host (Caddy's `{uri}`) is not part of it (C4, 2026-10-06)
      const host = m[1].replace(/\{[^}]*\}.*$/, '');
      if (!allowed(host, cited)) bad.push(`${f}: host ${host}`);
      if (INTERNAL.test(host)) bad.push(`${f}: internal-network host ${host}`);
    }
    for (const m of t.matchAll(TAILNET)) bad.push(`${f}: internal-network name ${m[0]}`);
    for (const m of t.matchAll(BARE_HOST)) {
      const h = m[1].toLowerCase();
      // vandalway.com is named in the records as someone else's domain (sh-045), never linked
      if (!allowed(h, cited) && !['vandalway.com', 'www.vandalway.com'].includes(h) && !NOT_HOSTS.has(h)) bad.push(`${f}: name ${h}`);
    }
    if (staging && t.includes(staging)) bad.push(`${f}: the staging hostname`);
  }
  assert.deepEqual([...new Set(bad)], []);
});

test('5. no page in site/ carries the sh-placeholder meta', () => {
  const site = builtSite();
  const html = siteFiles(/\.html$/);
  assert.ok(html.length >= 18, 'the site is built');
  assert.deepEqual(html.filter((f) => /<meta[^>]+name\s*=\s*["']?sh-placeholder/i.test(readFileSync(join(site, f), 'utf8'))), []);
});
