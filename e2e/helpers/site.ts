// Helpers for the browser specs that are not walks (walks use e2e/helpers/walks.ts and find things
// only by role and visible text). Locked at specs-v1 with the specs. (Diane, 2026-10-04)
import { expect, test, type BrowserContext, type Download, type Page, type Request, type TestInfo } from '@playwright/test';
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as S from './strings.ts';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** True when the run targets staging (STAGING_URL set). */
export const ON_STAGING = !!process.env.STAGING_URL;

/** Skip a whole spec file outside these engines (a line of ACCEPTANCE names them). */
export function onlyEngines(...engines: ('chromium' | 'webkit' | 'firefox')[]): void {
  test.skip(({ browserName }) => !engines.includes(browserName), `this spec runs in ${engines.join(' and ')} only (ACCEPTANCE)`);
}

export const esc = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export const exact = (s: string, flags = ''): RegExp => new RegExp(`^\\s*${esc(s)}\\s*$`, flags);

/** The home page's single text box. */
export const objectInput = (page: Page) => page.getByRole('main').getByRole('textbox');
export const checkButton = (page: Page) => page.getByRole('button', { name: S.CHECK_BUTTON, exact: true });
export const exampleChip = (page: Page, name: string) => page.getByRole('button', { name: exact(name, 'i') });
export const resultHeading = (page: Page) => page.getByRole('heading', { name: S.RESULT_HEADING, exact: true });
/** The drawn certificate on screen: the SVG with the certificate's viewBox. */
export const certificateSvg = (page: Page) => page.locator('svg[viewBox="0 0 1100 850"]');
export const action = (page: Page, name: string) =>
  page.getByRole('button', { name, exact: true }).or(page.getByRole('link', { name, exact: true })).first();

/**
 * Issue a certificate from the home page. With `at`, the page clock is installed at that instant
 * before the page loads and run forward past the sequence (so no real waiting); the clock is then
 * resumed. Returns the identifier shown on the result screen.
 */
export async function issue(page: Page, name: string, opts: { at?: string | Date; goto?: boolean } = {}): Promise<string> {
  if (opts.at) await page.clock.install({ time: new Date(opts.at) });
  if (opts.goto !== false) await page.goto('/');
  const input = objectInput(page);
  await input.fill(name);
  await input.press('Enter');
  if (opts.at) {
    await page.clock.runFor(5_500);
    await page.clock.resume();
  }
  await expect(resultHeading(page)).toBeVisible({ timeout: 10_000 });
  const id = await page.getByText(/^SH-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z*~$=U]{4}$/).first().textContent();
  return (id ?? '').trim();
}

/** The page's IANA zone, as the browser reports it. */
export const pageZone = (page: Page): Promise<string> => page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone);

/** Record every request URL a page or context makes. */
export function requestLog(target: Page | BrowserContext): string[] {
  const urls: string[] = [];
  (target as Page).on('request', (r: Request) => urls.push(r.url()));
  return urls;
}

/** Record console errors and page errors. */
export function consoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  return errors;
}

export async function download(page: Page, button: string): Promise<Download> {
  const [d] = await Promise.all([page.waitForEvent('download', { timeout: 30_000 }), action(page, button).click()]);
  return d;
}

export async function downloadBytes(d: Download): Promise<Buffer> {
  const p = await d.path();
  return readFileSync(p!);
}

/** The visible portfolio storage value, parsed (or the raw string when it does not parse). */
export async function storedPortfolio(page: Page): Promise<unknown> {
  return page.evaluate((key) => {
    const v = localStorage.getItem(key);
    if (v == null) return null;
    try {
      return JSON.parse(v);
    } catch {
      return v;
    }
  }, S.PORTFOLIO_KEY);
}

async function freePort(): Promise<number> {
  return new Promise((ok, fail) => {
    const s = createServer();
    s.on('error', fail);
    s.listen(0, '127.0.0.1', () => {
      const a = s.address();
      s.close(() => (typeof a === 'object' && a ? ok(a.port) : fail(new Error('no port'))));
    });
  });
}

/**
 * Serve a repository folder (vandalwayind/, for example) with scripts/serve-pages.mjs on a free
 * port, for the life of a spec file.
 */
export async function serveDir(rel: string): Promise<{ url: string; close: () => void }> {
  const dir = join(ROOT, rel);
  expect(existsSync(dir), `${rel}/ exists`).toBe(true);
  const port = await freePort();
  const child = spawn(process.execPath, [join(ROOT, 'scripts/serve-pages.mjs'), rel, String(port)], { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
  await new Promise<void>((ok, fail) => {
    const t = setTimeout(() => fail(new Error(`serve-pages did not start for ${rel}`)), 15_000);
    child.stdout!.on('data', (b) => String(b).includes(String(port)) && (clearTimeout(t), ok()));
    child.on('exit', (code) => (clearTimeout(t), fail(new Error(`serve-pages exited ${code}`))));
  });
  return { url: `http://127.0.0.1:${port}`, close: () => child.kill() };
}

/** Production origins (ACCEPTANCE conventions). */
export const PRODUCTION = 'https://isitstillhere.com';
export const PRODUCTION_VANDALWAY = 'https://vandalwayind.com';

async function body(url: string): Promise<{ status: number; text: string }> {
  try {
    const r = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(8_000) });
    return { status: r.status, text: await r.text() };
  } catch {
    return { status: 0, text: '' };
  }
}

/**
 * Is our site live at this origin? Used to skip production specs cleanly before launch: a parked
 * domain answers too, so the answer must be ours. isitstillhere.com: /build.txt is 200 and a
 * commit id. vandalwayind.com: / is 200 and the page is Vandalway's 1997 page.
 */
export async function isLive(origin: string): Promise<boolean> {
  if (/vandalwayind/.test(origin)) {
    const r = await body(`${origin}/`);
    return r.status === 200 && r.text.startsWith('<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">') && /Vandalway Industries/.test(r.text);
  }
  const r = await body(`${origin}/build.txt`);
  return r.status === 200 && /^[0-9a-f]{40}\s*$/.test(r.text);
}

/** Keep a screenshot or file beside the test's output for the critic. */
export async function attach(info: TestInfo, name: string, body: Buffer, contentType = 'image/png'): Promise<void> {
  await info.attach(name, { body, contentType });
}

/** Normalise a path the way research 3's table serves it, for comparing hrefs. */
export function pathOf(url: string, base: string): string {
  return new URL(url, base).pathname;
}

export const IDENTIFIER_RE = /SH-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z*~$=U]{4}/;
