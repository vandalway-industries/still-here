// Offline, the way a visitor's device goes offline: the server stops answering (C2 test change,
// Phase 4 critic item 23). `context.setOffline` is not used: in WebKit it refuses even the service
// worker's cached answers, and in Firefox it leaves the service worker online.
// Locally the site is served for the one test by its own scripts/serve-pages.mjs process on a free
// port, and that process is stopped. (Diane, 2026-10-05)
// On staging, whose server cannot be stopped, the test takes staging's exact build: it copies the
// files staging serves into a private folder, checks the copy against staging's /build.txt (a
// mismatch fails the test), serves the copy the same way on a free port, visits it there, and stops
// that server. Aborting the context's requests is not used: WebKit refuses the route ("Blocked by
// Web Inspector") and Firefox's service worker goes around it (specs-v7). (Diane, 2026-10-06)
import { expect, type BrowserContext } from '@playwright/test';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { ON_STAGING, ROOT, serveDir } from './site.ts';

export type OfflineSite = {
  /** The origin the test visits: the private server's (locally, a copy of site/; on staging, a copy of staging's build). */
  origin: string;
  /** Take the network away: stop the private server. */
  goOffline: () => Promise<void>;
  /** Stop everything the helper started. */
  close: () => Promise<void>;
};

const unreachable = async (origin: string): Promise<boolean> => {
  for (let i = 0; i < 50; i++) {
    try {
      await fetch(`${origin}/build.txt`, { cache: 'no-store' });
    } catch {
      return true;
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  return false;
};

// ── staging's build, copied ───────────────────────────────────────────────────────────────────────
// What is copied: the addresses every build has (/, /404.html, /sw.js, /build.txt, the manifest),
// every address in staging's own service-worker precache (the list the build writes into /sw.js:
// every page, every style, script and font, the icons and the home chair), and everything those
// pages, styles, scripts and the manifest reference on the same origin (images, the pages they
// link). The precache is the build's own list, so what the service worker installs offline is
// exactly what staging serves; the references add what the pages show online. An address listed
// by the build that staging does not serve fails the test.

const FIXED = ['/', '/404.html', '/sw.js', '/build.txt', '/manifest.webmanifest'];
const MAX_FILES = 5_000;

const get = (url: string) => fetch(url, { cache: 'no-store', redirect: 'manual', signal: AbortSignal.timeout(30_000) });

async function buildOf(origin: string): Promise<string> {
  const r = await get(`${origin}/build.txt`);
  expect(r.status, `${origin}/build.txt answers`).toBe(200);
  return (await r.text()).trim();
}

function setByBuild(sw: string, name: 'BUILD' | 'PRECACHE'): unknown {
  const m = sw.match(new RegExp(`^const ${name} = (.*); \\/\\/ set by the build$`, 'm'));
  expect(m, `staging's /sw.js carries the ${name} line set by the build`).not.toBeNull();
  return JSON.parse(m![1]);
}

/** Same-origin references in a page, a style sheet, a script or the manifest. */
function references(body: string, type: string, base: URL): string[] {
  const raw: string[] = [];
  if (/html/.test(type)) {
    for (const m of body.matchAll(/\s(?:href|src|poster|data-src)\s*=\s*["']([^"']+)["']/gi)) raw.push(m[1]);
    for (const m of body.matchAll(/\ssrcset\s*=\s*["']([^"']+)["']/gi)) for (const c of m[1].split(',')) raw.push(c.trim().split(/\s+/)[0]);
    for (const m of body.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) raw.push(m[1]);
  } else if (/css/.test(type)) {
    for (const m of body.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) raw.push(m[1]);
    for (const m of body.matchAll(/@import\s+["']([^"']+)["']/gi)) raw.push(m[1]);
  } else if (/javascript/.test(type)) {
    for (const m of body.matchAll(/(?:\bfrom\s*|\bimport\s*\(?\s*)["']([^"'`$]+)["']/g)) raw.push(m[1]);
  } else if (/manifest|json/.test(type) && base.pathname.endsWith('.webmanifest')) {
    try {
      const j = JSON.parse(body) as { start_url?: string; icons?: { src?: string }[] };
      if (j.start_url) raw.push(j.start_url);
      for (const i of j.icons ?? []) if (i.src) raw.push(i.src);
    } catch {
      /* not JSON: nothing referenced */
    }
  }
  const out: string[] = [];
  for (const r of raw) {
    if (!r || r.startsWith('data:') || r.startsWith('blob:') || r.startsWith('#')) continue;
    try {
      const u = new URL(r.replace(/&amp;/g, '&'), base);
      if (u.origin === base.origin) out.push(u.pathname);
    } catch {
      /* not an address */
    }
  }
  return out;
}

/** Where a 200 answer for this address lives in a Pages folder. */
function fileFor(dir: string, pathname: string, type: string): string {
  let p = decodeURIComponent(pathname);
  if (p.endsWith('/')) p += 'index.html';
  else if (!/\.[^/]+$/.test(p) && /html/.test(type)) p += '.html';
  const file = resolve(dir, '.' + p);
  expect(file.startsWith(resolve(dir) + sep), `${pathname} stays inside the copy`).toBe(true);
  return file;
}

async function mirror(staging: string, dir: string): Promise<void> {
  const sw = await get(`${staging}/sw.js`);
  expect(sw.status, `${staging}/sw.js answers`).toBe(200);
  const precache = setByBuild(await sw.text(), 'PRECACHE') as string[];
  expect(Array.isArray(precache) && precache.length > 0, "staging's precache lists files").toBe(true);
  const required = new Set([...FIXED, ...precache]);
  const seen = new Set<string>();
  const queue = [...required];
  const missing: string[] = [];
  const fetchOne = async (path: string) => {
    const url = new URL(path, staging);
    const r = await get(url.href);
    if (r.status >= 300 && r.status < 400) {
      const to = r.headers.get('location');
      if (to) {
        const u = new URL(to, url);
        if (u.origin === url.origin) queue.push(u.pathname);
      }
      return;
    }
    if (r.status !== 200) {
      if (required.has(path)) missing.push(`${path} (${r.status})`);
      return;
    }
    const type = r.headers.get('content-type') ?? '';
    const body = Buffer.from(await r.arrayBuffer());
    const file = fileFor(dir, url.pathname, type);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, body);
    if (/html|css|javascript|manifest/.test(type) || url.pathname.endsWith('.webmanifest')) {
      for (const ref of references(body.toString('utf8'), url.pathname.endsWith('.webmanifest') ? 'manifest' : type, url)) queue.push(ref);
    }
  };
  while (queue.length) {
    const batch: string[] = [];
    while (queue.length && batch.length < 8) {
      const p = queue.shift()!;
      if (seen.has(p)) continue;
      seen.add(p);
      batch.push(p);
    }
    expect(seen.size, 'the copy stays a site, not a crawl of everything').toBeLessThan(MAX_FILES);
    await Promise.all(batch.map(fetchOne));
  }
  expect(missing, 'every address the build lists is served by staging').toEqual([]);
}

function htmlFiles(dir: string): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...htmlFiles(p));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

/** Copy staging's build into a private folder and check it is staging's build. */
async function stagingCopy(staging: string): Promise<string> {
  const build = await buildOf(staging);
  expect(build, "staging's /build.txt names a build").toMatch(/^[0-9A-Za-z._-]{6,64}$/);
  const dir = mkdtempSync(join(tmpdir(), 'still-here-staging-'));
  try {
    await mirror(staging, dir);
    expect(await buildOf(staging), 'staging kept the same build while it was copied').toBe(build);
    expect(readFileSync(join(dir, 'build.txt'), 'utf8').trim(), "the copy's /build.txt is staging's").toBe(build);
    expect(setByBuild(readFileSync(join(dir, 'sw.js'), 'utf8'), 'BUILD'), "the copy's service worker is staging's build").toBe(build);
    const stale = htmlFiles(dir)
      .map((f) => [relative(dir, f), readFileSync(f, 'utf8').match(/<html\b[^>]*\sdata-build="([^"]*)"/)?.[1]] as const)
      .filter(([, b]) => b !== undefined && b !== build)
      .map(([f, b]) => `${f}: ${b}`);
    expect(stale, "every copied page names staging's build").toEqual([]);
    return dir;
  } catch (e) {
    rmSync(dir, { recursive: true, force: true });
    throw e;
  }
}

export async function offlineSite(context: BrowserContext, baseURL?: string): Promise<OfflineSite> {
  void context;
  let copy: string | undefined;
  let staging: string | undefined;
  if (ON_STAGING) {
    staging = new URL(baseURL ?? process.env.STAGING_URL!).origin;
    copy = await stagingCopy(staging);
  }
  let server: Awaited<ReturnType<typeof serveDir>>;
  try {
    // serveDir takes a folder relative to the repository; the copy's is
    server = await serveDir(copy ? relative(ROOT, copy) : 'site');
  } catch (e) {
    if (copy) rmSync(copy, { recursive: true, force: true });
    throw e;
  }
  const origin = new URL(server.url).origin;
  let stopped = false;
  const stop = async () => {
    if (stopped) return;
    stopped = true;
    server.close();
    expect(await unreachable(origin), 'the server has stopped answering').toBe(true);
  };
  if (copy) {
    try {
      expect(await buildOf(origin), "the private server's /build.txt is staging's").toBe(await buildOf(staging!));
    } catch (e) {
      await stop().catch(() => undefined);
      rmSync(copy, { recursive: true, force: true });
      throw e;
    }
  }
  return {
    origin,
    goOffline: stop,
    close: async () => {
      try {
        await stop();
      } finally {
        if (copy) rmSync(copy, { recursive: true, force: true });
      }
    },
  };
}
