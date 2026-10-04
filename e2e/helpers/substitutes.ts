// Walk substitutes: garage/pack/WALKS.md § Substitute evidence.
// A walk step that asks for something outside the page (a file viewer, the browser's settings, a
// home screen, a mail program, a phone camera) is played by exactly one of these helpers, and the
// critic reports the step as "played (substitute)". Steps marked † in WALKS.md stay on Clive's
// phone checklist; no helper here plays them.
import { expect, type BrowserContext, type Download, type Locator, type Page } from '@playwright/test';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { Resolver } from 'node:dns/promises';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const MODULES = join(ROOT, 'node_modules');
const PDFJS = join(MODULES, 'pdfjs-dist');
const JSQR = join(MODULES, 'jsqr', 'dist', 'jsQR.js');

/** The certificate footer (garage/pack/CONTENT_SEEDS.md § Fixed strings). */
export const CERTIFICATE_FOOTER =
  'Confirms successful completion of this form. No physical inspection occurred.';

// A private origin that never reaches a network: every request to it is answered by page.route.
const ORIGIN = 'https://substitutes.invalid';

const TYPES: Record<string, string> = {
  '.mjs': 'text/javascript',
  '.js': 'text/javascript',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.html': 'text/html',
  '.json': 'application/json',
  '.pfb': 'application/octet-stream',
  '.ttf': 'font/ttf',
  '.bcmap': 'application/octet-stream',
  '.wasm': 'application/wasm',
};
const typeOf = (p: string) => TYPES[p.slice(p.lastIndexOf('.'))] ?? 'application/octet-stream';

/**
 * Open a page on the private origin that serves pdf.js, jsQR and the given files, run `fn` in it,
 * and close it. Files are keyed by path, for example { '/file.pdf': bytes }.
 */
async function withSubstitutePage<T>(
  context: BrowserContext,
  files: Record<string, Buffer>,
  fn: (page: Page) => Promise<T>,
): Promise<T> {
  const page = await context.newPage();
  try {
    await page.route(`${ORIGIN}/**`, async (route) => {
      const path = new URL(route.request().url()).pathname;
      let body: Buffer | undefined = files[path];
      if (!body && path === '/') body = Buffer.from('<!doctype html><meta charset="utf-8"><title>substitute</title><body></body>');
      if (!body && path.startsWith('/pdfjs/') && !path.includes('..')) {
        try {
          body = readFileSync(join(PDFJS, path.slice('/pdfjs/'.length)));
        } catch {
          body = undefined;
        }
      }
      if (!body) return route.fulfill({ status: 404, body: 'not found' });
      return route.fulfill({ status: 200, body, contentType: path === '/' ? 'text/html' : typeOf(path) });
    });
    await page.goto(`${ORIGIN}/`);
    return await fn(page);
  } finally {
    await page.close();
  }
}

/** Render page 1 of the PDF at /file.pdf onto a canvas#render at `dpi`; returns its text. */
async function renderPdf(page: Page, dpi: number): Promise<{ text: string; width: number; height: number }> {
  return page.evaluate(async (scale) => {
    // @ts-ignore — the module is served by the route above
    const pdfjs = await import('/pdfjs/build/pdf.mjs');
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/build/pdf.worker.mjs';
    const doc = await pdfjs.getDocument({
      url: '/file.pdf',
      standardFontDataUrl: '/pdfjs/standard_fonts/',
      cMapUrl: '/pdfjs/cmaps/',
      cMapPacked: true,
    }).promise;
    const p = await doc.getPage(1);
    const viewport = p.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.id = 'render';
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    document.body.style.margin = '0';
    document.body.appendChild(canvas);
    await p.render({ canvasContext: canvas.getContext('2d')!, viewport, canvas }).promise;
    const content = await p.getTextContent();
    const text = content.items.map((i: { str?: string }) => i.str ?? '').join(' ');
    return { text, width: canvas.width, height: canvas.height };
  }, dpi / 72);
}

/** Decode the QR code on canvas#render (or an <img id="source"> drawn onto it) with jsQR. */
async function decodeCanvas(page: Page): Promise<string | null> {
  await page.addScriptTag({ path: JSQR });
  return page.evaluate(() => {
    const canvas = document.getElementById('render') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // @ts-ignore — jsQR is a global from the script tag
    const found = window.jsQR(data.data, canvas.width, canvas.height, { inversionAttempts: 'attemptBoth' });
    return found ? (found.data as string) : null;
  });
}

async function drawPng(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const img = new Image();
    img.src = '/file.png';
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.id = 'render';
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext('2d')!.drawImage(img, 0, 0);
    document.body.style.margin = '0';
    document.body.appendChild(canvas);
  });
}

export type OpenedDownload = {
  path: string;
  filename: string;
  kind: 'pdf' | 'png';
  /** A screenshot of what a person would see: page 1 of the PDF at 150 dpi, or the PNG in a tab. */
  screenshot: Buffer;
  /** PDF only: page 1's text, as pdf.js extracts it. */
  text?: string;
  /** PDF only: the file embeds a TrueType font program (`/FontFile2`). */
  hasFontFile2?: boolean;
  /** PDF only: the certificate footer appears in page 1's text. */
  hasFooter?: boolean;
};

/**
 * W1.6, W1.7, W6.4 — "opens the downloaded PDF or PNG and looks at it".
 * Saves the download; renders page 1 of a PDF with pdf.js at 150 dpi and screenshots it; opens a
 * PNG in a tab and screenshots it. For a PDF also reports `/FontFile2` and the footer string.
 */
export async function openDownload(page: Page, download: Download, dir?: string): Promise<OpenedDownload> {
  const filename = download.suggestedFilename();
  const path = join(dir ?? mkdtempSync(join(tmpdir(), 'still-here-download-')), filename);
  await download.saveAs(path);
  const bytes = readFileSync(path);
  const isPdf = bytes.subarray(0, 5).toString('latin1') === '%PDF-';
  const isPng = bytes.subarray(1, 4).toString('latin1') === 'PNG';
  expect(isPdf || isPng, `${filename} is neither a PDF nor a PNG`).toBe(true);
  const context = page.context();
  if (isPdf) {
    return withSubstitutePage(context, { '/file.pdf': bytes }, async (p) => {
      const { text } = await renderPdf(p, 150);
      const screenshot = await p.locator('#render').screenshot();
      const flat = text.replace(/\s+/g, ' ');
      return {
        path,
        filename,
        kind: 'pdf' as const,
        screenshot,
        text,
        hasFontFile2: bytes.toString('latin1').includes('/FontFile2'),
        hasFooter: flat.includes(CERTIFICATE_FOOTER),
      };
    });
  }
  return withSubstitutePage(context, { '/file.png': bytes }, async (p) => {
    await p.goto(`${ORIGIN}/file.png`);
    const screenshot = await p.screenshot();
    return { path, filename, kind: 'png' as const, screenshot };
  });
}

/**
 * W2.7 — "scans a printed QR code with a phone camera".
 * Decodes the QR code with jsQR from an exported PNG or from the pdf.js render of a PDF (150 dpi).
 * Returns the decoded text (the certificate link), or null when no code is found. The caller then
 * opens the decoded URL. The camera scan itself is phone checklist item 6 †.
 */
export async function decodeQr(context: BrowserContext, file: { png: Buffer } | { pdf: Buffer }): Promise<string | null> {
  if ('png' in file) {
    return withSubstitutePage(context, { '/file.png': file.png }, async (p) => {
      await drawPng(p);
      return decodeCanvas(p);
    });
  }
  return withSubstitutePage(context, { '/file.pdf': file.pdf }, async (p) => {
    await renderPdf(p, 150);
    return decodeCanvas(p);
  });
}

/**
 * W3.4 — "clears the site's data in the browser's settings".
 * Chromium: DevTools Protocol `Storage.clearDataForOrigin` with every storage type, then reload.
 * WebKit and Firefox: a new context (empty storage) at the same URL; the old context is closed.
 * Returns the page to continue the walk on.
 */
export async function clearSiteData(page: Page): Promise<Page> {
  const url = page.url();
  const origin = new URL(url).origin;
  const context = page.context();
  const browser = context.browser();
  if (browser?.browserType().name() === 'chromium') {
    const cdp = await context.newCDPSession(page);
    await cdp.send('Storage.clearDataForOrigin', { origin, storageTypes: 'all' });
    await cdp.detach();
    await page.reload();
    return page;
  }
  expect(browser, 'clearSiteData needs a browser-owned context').toBeTruthy();
  const viewport = page.viewportSize();
  const fresh = await browser!.newContext({ viewport: viewport ?? undefined, locale: 'en-GB', acceptDownloads: true });
  const next = await fresh.newPage();
  await next.goto(url);
  await context.close();
  return next;
}

export type Installability = { errors: unknown[]; controlled: boolean; startUrl: string; offline: boolean };

/**
 * W6.1–2 — "installs the site and opens it from the home screen". Chromium only.
 * `Page.getInstallabilityErrors` returns none, a service worker controls the page, and the
 * manifest's `start_url` opens offline in the same context. The real install and Home Screen
 * launch are phone checklist item 8 †.
 */
export async function checkInstallable(page: Page): Promise<Installability> {
  const context = page.context();
  expect(context.browser()?.browserType().name(), 'checkInstallable runs in Chromium').toBe('chromium');
  const cdp = await context.newCDPSession(page);
  const { installabilityErrors } = (await cdp.send('Page.getInstallabilityErrors')) as { installabilityErrors: unknown[] };
  await cdp.detach();
  const controlled = await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return false;
    await navigator.serviceWorker.ready;
    return !!navigator.serviceWorker.controller;
  });
  const manifestHref = await page.locator('link[rel="manifest"]').first().getAttribute('href');
  expect(manifestHref, 'the page links a manifest').toBeTruthy();
  const manifestUrl = new URL(manifestHref!, page.url()).href;
  const manifest = await (await page.request.get(manifestUrl)).json();
  const startUrl = new URL(manifest.start_url ?? '.', manifestUrl).href;
  await context.setOffline(true);
  let offline = false;
  try {
    const p = await context.newPage();
    const res = await p.goto(startUrl);
    offline = !!res && res.ok();
    await p.close();
  } catch {
    offline = false;
  } finally {
    await context.setOffline(false);
  }
  expect(installabilityErrors, 'installability errors').toEqual([]);
  expect(controlled, 'a service worker controls the page').toBe(true);
  expect(offline, `start_url ${startUrl} opens offline`).toBe(true);
  return { errors: installabilityErrors, controlled, startUrl, offline };
}

/**
 * W7.3 — "sends mail and sees it bounce".
 * Asserts the link is `mailto:webmaster@vandalwayind.com`, then resolves vandalwayind.com's MX and
 * asserts it is exactly `0 .` (RFC 7505 null MX: delivery fails at the sender at once). The
 * resolver is the system's unless NULL_MX_RESOLVER names one or more public resolvers
 * (comma-separated addresses, kept out of the repository). A real send is phone checklist item 9 †.
 */
export async function checkNullMx(link: Locator, domain = 'vandalwayind.com'): Promise<{ href: string; mx: { exchange: string; priority: number }[] }> {
  const href = await link.getAttribute('href');
  expect(href).toBe(`mailto:webmaster@${domain}`);
  const resolver = new Resolver();
  const servers = process.env.NULL_MX_RESOLVER?.split(',').map((s) => s.trim()).filter(Boolean);
  if (servers?.length) resolver.setServers(servers);
  const mx = await resolver.resolveMx(domain);
  expect(mx.length, `${domain} has exactly one MX record`).toBe(1);
  expect(mx[0].priority).toBe(0);
  expect(['', '.']).toContain(mx[0].exchange);
  return { href: href!, mx };
}

/** Write a buffer next to the test's output for the critic (screenshots of substitutes). */
export function keep(path: string, bytes: Buffer): string {
  writeFileSync(path, bytes);
  return path;
}
