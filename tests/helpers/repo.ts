// Shared helpers for the unit tests in tests/unit/. Locked with them at specs-v1: a builder never
// edits this file (AGENTS.md § Guardrails). Nothing here needs product code to load: a test that
// reaches for a missing product file fails with a message naming it. (Diane, 2026-10-04)
import assert from 'node:assert/strict';
import { execFileSync, spawn, spawnSync, type ChildProcess } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, symlinkSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { basename, dirname, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

export const abs = (rel: string): string => join(ROOT, rel);
export const read = (rel: string): string => readFileSync(abs(rel), 'utf8');
export const bytes = (rel: string): Buffer => readFileSync(abs(rel));
export const exists = (rel: string): boolean => existsSync(abs(rel));

export function mustExist(rel: string, why = ''): void {
  assert.ok(exists(rel), `${rel} is missing${why ? ` (${why})` : ''}`);
}

export function readMust(rel: string, why = ''): string {
  mustExist(rel, why);
  return read(rel);
}

type ShOpts = { cwd?: string; env?: NodeJS.ProcessEnv; input?: string; timeout?: number };

export function sh(cmd: string, args: string[], opts: ShOpts = {}): string {
  return execFileSync(cmd, args, {
    cwd: opts.cwd ?? ROOT,
    encoding: 'utf8',
    env: { ...process.env, ...opts.env },
    input: opts.input,
    timeout: opts.timeout ?? 300_000,
    stdio: ['pipe', 'pipe', 'pipe'],
    maxBuffer: 256 * 1024 * 1024,
  });
}

export function run(cmd: string, args: string[], opts: ShOpts = {}): { status: number; stdout: string; stderr: string } {
  const r = spawnSync(cmd, args, {
    cwd: opts.cwd ?? ROOT,
    encoding: 'utf8',
    env: { ...process.env, ...opts.env },
    input: opts.input,
    timeout: opts.timeout ?? 300_000,
    maxBuffer: 256 * 1024 * 1024,
  });
  return { status: r.status ?? -1, stdout: r.stdout ?? '', stderr: r.stderr ?? '' };
}

const SKIP_DIRS = new Set(['node_modules', '.git', 'test-results', 'playwright-report']);

/** Every file under an absolute directory, recursively, sorted. */
export function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (SKIP_DIRS.has(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.isFile()) out.push(p);
  }
  return out;
}

/** Files under a repository-relative directory, as repository-relative paths. */
export function files(relDir: string, ext?: RegExp): string[] {
  return walk(abs(relDir))
    .map((f) => relative(ROOT, f))
    .filter((f) => !ext || ext.test(f));
}

export const TEXT_EXT = /\.(html?|css|m?js|ts|json|jsonl|md|txt|xml|xsd|ya?ml|svg|webmanifest|caddy|sh|service|timer|py|toml)$/i;

/** Tracked files (git ls-files), repository-relative. */
export function tracked(): string[] {
  return sh('git', ['ls-files', '-z']).split('\0').filter(Boolean);
}

/** Import a product module by repository-relative path; a missing file fails the test by name. */
export async function importProduct<T = Record<string, unknown>>(rel: string): Promise<T> {
  mustExist(rel, 'the product module this test exercises');
  return (await import(pathToFileURL(abs(rel)).href)) as T;
}

// ── An isolated build ───────────────────────────────────────────────────────────────────────────
// Test files run in parallel, and the build rewrites site/ from scratch. So each test process
// builds its own copy of the working tree in a temporary folder (the large, read-only folders are
// linked, not copied) and reads that copy's site/. The repository's own site/ is never touched.
let isolated: string | undefined;
const COPY_SKIP = new Set(['node_modules', '.git', 'site', 'test-results', 'playwright-report', 'assets', 'garage', '.beads']);

export function isolatedTree(): string {
  if (isolated) return isolated;
  const dir = mkdtempSync(join(tmpdir(), 'still-here-tree-'));
  for (const e of readdirSync(ROOT, { withFileTypes: true })) {
    if (COPY_SKIP.has(e.name)) continue;
    cpSync(join(ROOT, e.name), join(dir, e.name), { recursive: true, verbatimSymlinks: true });
  }
  for (const link of ['node_modules', 'assets', 'garage']) {
    if (existsSync(join(ROOT, link))) symlinkSync(join(ROOT, link), join(dir, link));
  }
  process.on('exit', () => rmSync(dir, { recursive: true, force: true }));
  isolated = dir;
  return dir;
}

let built: string | undefined;
/** Build the isolated copy once per test process; returns the absolute path of its site/. */
export function builtSite(): string {
  if (built) return built;
  const dir = isolatedTree();
  mustExist('scripts/build.mjs');
  sh(process.execPath, ['scripts/build.mjs'], { cwd: dir });
  built = join(dir, 'site');
  return built;
}

/** A built site file's text; fails by name when the build did not write it. */
export function siteText(rel: string): string {
  const p = join(builtSite(), rel);
  assert.ok(existsSync(p), `site/${rel} was not built`);
  return readFileSync(p, 'utf8');
}

export function siteFiles(ext?: RegExp): string[] {
  const root = builtSite();
  return walk(root)
    .map((f) => relative(root, f))
    .filter((f) => !ext || ext.test(f));
}

/**
 * Build a fresh copy of the working tree with every file the build opens recorded (the build's
 * read log). Returns the repository-relative paths read, and the copy's root.
 */
export function buildWithReadLog(): { reads: string[]; dir: string } {
  const dir = mkdtempSync(join(tmpdir(), 'still-here-readlog-'));
  for (const e of readdirSync(ROOT, { withFileTypes: true })) {
    if (COPY_SKIP.has(e.name)) continue;
    cpSync(join(ROOT, e.name), join(dir, e.name), { recursive: true, verbatimSymlinks: true });
  }
  for (const link of ['node_modules', 'assets', 'garage']) {
    if (existsSync(join(ROOT, link))) symlinkSync(join(ROOT, link), join(dir, link));
  }
  process.on('exit', () => rmSync(dir, { recursive: true, force: true }));
  const log = join(dir, '.read-log');
  sh(process.execPath, ['--import', pathToFileURL(join(ROOT, 'tests/helpers/read-log.mjs')).href, 'scripts/build.mjs'], {
    cwd: dir,
    env: { STILL_HERE_READ_LOG: log, STILL_HERE_READ_ROOT: dir },
  });
  const reads = existsSync(log)
    ? [...new Set(readFileSync(log, 'utf8').split('\n').filter(Boolean))]
    : [];
  return { reads, dir };
}

// ── Serving ─────────────────────────────────────────────────────────────────────────────────────
export async function freePort(): Promise<number> {
  return new Promise((ok, fail) => {
    const s = createServer();
    s.unref();
    s.on('error', fail);
    s.listen(0, '127.0.0.1', () => {
      const a = s.address();
      s.close(() => (typeof a === 'object' && a ? ok(a.port) : fail(new Error('no port'))));
    });
  });
}

/** Serve an absolute directory with scripts/serve-pages.mjs on a free port. */
export async function serve(dir: string): Promise<{ url: string; close: () => void }> {
  mustExist('scripts/serve-pages.mjs');
  const port = await freePort();
  const child: ChildProcess = spawn(process.execPath, [abs('scripts/serve-pages.mjs'), basename(dir), String(port)], {
    cwd: dirname(dir),
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  await new Promise<void>((ok, fail) => {
    const t = setTimeout(() => fail(new Error('the Pages server did not start')), 15_000);
    child.stdout!.on('data', (b) => String(b).includes(String(port)) && (clearTimeout(t), ok()));
    child.on('exit', (code) => (clearTimeout(t), fail(new Error(`the Pages server exited ${code}`))));
  });
  // the server must not keep the test process alive: it is stopped when the process exits
  child.stdout!.destroy();
  child.stderr!.destroy();
  child.unref();
  const close = () => child.kill();
  process.on('exit', close);
  return { url: `http://127.0.0.1:${port}`, close };
}

let served: Promise<{ url: string; close: () => void }> | undefined;
/** The isolated build, served once per test process. */
export function servedSite(): Promise<{ url: string; close: () => void }> {
  served ??= serve(builtSite());
  return served;
}

// ── Browsers ────────────────────────────────────────────────────────────────────────────────────
type PW = typeof import('playwright');
let pw: PW | undefined;
export async function playwright(): Promise<PW> {
  pw ??= (await import('playwright')) as PW;
  return pw;
}

export async function withBrowser<T>(
  fn: (b: import('playwright').Browser) => Promise<T>,
  engine: 'chromium' | 'webkit' | 'firefox' = 'chromium',
): Promise<T> {
  const p = await playwright();
  const browser = await p[engine].launch();
  try {
    return await fn(browser);
  } finally {
    await browser.close();
  }
}

/** A Chromium page on the served isolated build. */
export async function withSitePage<T>(
  fn: (page: import('playwright').Page, url: string, context: import('playwright').BrowserContext) => Promise<T>,
  contextOptions: import('playwright').BrowserContextOptions = {},
): Promise<T> {
  const { url } = await servedSite();
  return withBrowser(async (b) => {
    const context = await b.newContext({ locale: 'en-GB', acceptDownloads: true, viewport: { width: 1440, height: 900 }, baseURL: url, ...contextOptions });
    // a local page answers in well under this; a missing element fails in ten seconds, not thirty
    context.setDefaultTimeout(10_000);
    const page = await context.newPage();
    try {
      return await fn(page, url, context);
    } finally {
      await context.close();
    }
  });
}

/**
 * A Chromium page on a private origin that serves an absolute directory (src/ by default), for
 * importing product modules exactly as a browser would.
 */
export async function withModulePage<T>(fn: (page: import('playwright').Page, origin: string) => Promise<T>, dir = abs('src')): Promise<T> {
  const origin = 'https://modules.invalid';
  const types: Record<string, string> = { js: 'text/javascript', mjs: 'text/javascript', css: 'text/css', svg: 'image/svg+xml', woff2: 'font/woff2', ttf: 'font/ttf', json: 'application/json', html: 'text/html', png: 'image/png' };
  return withBrowser(async (b) => {
    const context = await b.newContext({ locale: 'en-GB' });
    context.setDefaultTimeout(10_000);
    const page = await context.newPage();
    await page.route(`${origin}/**`, async (route) => {
      const path = decodeURIComponent(new URL(route.request().url()).pathname);
      if (path === '/') return route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><meta charset="utf-8"><title>modules</title><body></body>' });
      if (path === '/__node_modules/jsqr.js') return route.fulfill({ status: 200, contentType: 'text/javascript', body: readFileSync(abs('node_modules/jsqr/dist/jsQR.js')) });
      const p = join(dir, path);
      if (path.includes('..') || !existsSync(p) || !statSync(p).isFile()) return route.fulfill({ status: 404, body: 'not found' });
      return route.fulfill({ status: 200, contentType: types[p.split('.').pop()!] ?? 'application/octet-stream', body: readFileSync(p) });
    });
    await page.goto(`${origin}/`);
    try {
      return await fn(page, origin);
    } finally {
      await context.close();
    }
  });
}

// ── Python, for formats Node has no parser for ──────────────────────────────────────────────────
export function python(code: string, args: string[] = [], input?: string): string {
  return sh('python3', ['-c', code, ...args], { input });
}

/** YAML to JSON via PyYAML (dates become ISO strings). */
export function yaml(text: string): any {
  const out = python(
    'import sys, json, yaml, datetime\n' +
      'd = yaml.safe_load(sys.stdin.read())\n' +
      'print(json.dumps(d, default=lambda o: o.isoformat() if isinstance(o, (datetime.date, datetime.datetime)) else str(o)))',
    [],
    text,
  );
  return JSON.parse(out);
}

/** Front matter (between the first two `---` lines) as an object, and the body after it. */
export function frontMatter(text: string): { data: any; body: string } {
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(text);
  if (!m) return { data: {}, body: text };
  return { data: yaml(m[1]) ?? {}, body: m[2] };
}

/** Validate an XML file against an XSD with lxml; returns the error log ('' when valid). */
export function xsdErrors(xmlRel: string, xsdRel: string): string {
  mustExist(xmlRel);
  mustExist(xsdRel);
  return python(
    'import sys\nfrom lxml import etree\n' +
      'schema = etree.XMLSchema(etree.parse(sys.argv[2]))\n' +
      'doc = etree.parse(sys.argv[1])\n' +
      'print("" if schema.validate(doc) else str(schema.error_log))',
    [abs(xmlRel), abs(xsdRel)],
  ).trim();
}

/** Validate a JSON value against a JSON Schema file with the jsonschema package. */
export function jsonSchemaErrors(value: unknown, schemaRel: string): string[] {
  mustExist(schemaRel);
  const out = python(
    'import sys, json\nfrom jsonschema import Draft202012Validator, validators\n' +
      'schema = json.load(open(sys.argv[1]))\n' +
      'cls = validators.validator_for(schema, default=Draft202012Validator)\n' +
      'v = cls(schema)\n' +
      'print(json.dumps([e.message for e in v.iter_errors(json.loads(sys.stdin.read()))]))',
    [abs(schemaRel)],
    JSON.stringify(value),
  );
  return JSON.parse(out);
}

// ── Image formats ───────────────────────────────────────────────────────────────────────────────
export function pngInfo(buf: Buffer): { width: number; height: number; chunks: string[] } {
  assert.equal(buf.subarray(1, 4).toString('latin1'), 'PNG', 'not a PNG');
  const chunks: string[] = [];
  let i = 8;
  while (i + 8 <= buf.length) {
    const len = buf.readUInt32BE(i);
    chunks.push(buf.subarray(i + 4, i + 8).toString('latin1'));
    i += 12 + len;
  }
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), chunks };
}

export function jpegInfo(buf: Buffer): { width: number; height: number; markers: number[] } {
  assert.ok(buf[0] === 0xff && buf[1] === 0xd8, 'not a JPEG');
  const markers: number[] = [];
  let i = 2;
  let width = 0;
  let height = 0;
  while (i + 4 <= buf.length) {
    if (buf[i] !== 0xff) break;
    const marker = buf[i + 1];
    if (marker === 0xd9 || marker === 0xda) {
      markers.push(marker);
      break;
    }
    const len = buf.readUInt16BE(i + 2);
    markers.push(marker);
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      height = buf.readUInt16BE(i + 5);
      width = buf.readUInt16BE(i + 7);
    }
    i += 2 + len;
  }
  return { width, height, markers };
}

export function gifInfo(buf: Buffer): { width: number; height: number; frames: number; comments: number; apps: string[] } {
  const sig = buf.subarray(0, 6).toString('latin1');
  assert.ok(sig === 'GIF87a' || sig === 'GIF89a', 'not a GIF');
  const width = buf.readUInt16LE(6);
  const height = buf.readUInt16LE(8);
  let i = 13;
  const packed = buf[10];
  if (packed & 0x80) i += 3 * (1 << ((packed & 7) + 1));
  let frames = 0;
  let comments = 0;
  const apps: string[] = [];
  const skipBlocks = () => {
    while (i < buf.length && buf[i] !== 0) i += buf[i] + 1;
    i += 1;
  };
  while (i < buf.length) {
    const b = buf[i];
    if (b === 0x3b) break;
    if (b === 0x21) {
      const label = buf[i + 1];
      if (label === 0xfe) comments++;
      if (label === 0xff) apps.push(buf.subarray(i + 3, i + 3 + buf[i + 2]).toString('latin1'));
      i += 2;
      skipBlocks();
    } else if (b === 0x2c) {
      frames++;
      const p = buf[i + 9];
      i += 10;
      if (p & 0x80) i += 3 * (1 << ((p & 7) + 1));
      i += 1; // LZW minimum code size
      skipBlocks();
    } else break;
  }
  return { width, height, frames, comments, apps };
}

export function webpInfo(buf: Buffer): { width: number; height: number; chunks: string[] } {
  assert.equal(buf.subarray(0, 4).toString('latin1'), 'RIFF', 'not a WebP');
  assert.equal(buf.subarray(8, 12).toString('latin1'), 'WEBP', 'not a WebP');
  const chunks: string[] = [];
  let width = 0;
  let height = 0;
  let i = 12;
  while (i + 8 <= buf.length) {
    const id = buf.subarray(i, i + 4).toString('latin1');
    const len = buf.readUInt32LE(i + 4);
    chunks.push(id);
    const d = i + 8;
    if (id === 'VP8X') {
      width = 1 + buf.readUIntLE(d + 4, 3);
      height = 1 + buf.readUIntLE(d + 7, 3);
    } else if (id === 'VP8 ' && !width) {
      width = buf.readUInt16LE(d + 6) & 0x3fff;
      height = buf.readUInt16LE(d + 8) & 0x3fff;
    } else if (id === 'VP8L' && !width) {
      const v = buf.readUInt32LE(d + 1);
      width = (v & 0x3fff) + 1;
      height = ((v >> 14) & 0x3fff) + 1;
    }
    i = d + len + (len & 1);
  }
  return { width, height, chunks };
}

export function imageSize(buf: Buffer): { width: number; height: number } {
  if (buf.subarray(1, 4).toString('latin1') === 'PNG') return pngInfo(buf);
  if (buf[0] === 0xff && buf[1] === 0xd8) return jpegInfo(buf);
  if (buf.subarray(0, 3).toString('latin1') === 'GIF') return gifInfo(buf);
  if (buf.subarray(0, 4).toString('latin1') === 'RIFF') return webpInfo(buf);
  throw new Error('unknown image format');
}

/** Metadata the web copies must not carry (D21): returns the offending chunk or marker names. */
export function imageMetadata(buf: Buffer): string[] {
  // content credentials in any container: a C2PA manifest is a JUMBF box labelled "c2pa"
  const c2pa = buf.includes(Buffer.from('jumb', 'latin1')) || buf.includes(Buffer.from('c2pa', 'latin1')) ? ['C2PA (JUMBF)'] : [];
  return [...c2pa, ...containerMetadata(buf)];
}

function containerMetadata(buf: Buffer): string[] {
  const head = buf.subarray(0, 4).toString('latin1');
  if (buf.subarray(1, 4).toString('latin1') === 'PNG') {
    return pngInfo(buf).chunks.filter((c) => ['caBX', 'iTXt', 'tEXt', 'zTXt', 'eXIf'].includes(c));
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    return jpegInfo(buf)
      .markers.filter((m) => m === 0xe1 || m === 0xed || m === 0xeb)
      .map((m) => (m === 0xe1 ? 'APP1' : m === 0xeb ? 'APP11 (JUMBF)' : 'APP13'));
  }
  if (head === 'RIFF') return webpInfo(buf).chunks.filter((c) => ['EXIF', 'XMP ', 'C2PA', 'caBX'].includes(c));
  if (head.startsWith('GIF')) {
    const g = gifInfo(buf);
    return [
      ...(g.comments ? ['GIF comment'] : []),
      ...g.apps.filter((a) => !/^(NETSCAPE2\.0|ANIMEXTS1\.0)$/.test(a)).map((a) => `GIF application ${a}`),
    ];
  }
  return [];
}

// ── HTML, through a real parser ─────────────────────────────────────────────────────────────────
/**
 * Parse each HTML string with the browser's DOMParser and run `fn` on the document inside the page.
 * `fn` is serialized; it receives (doc, arg) and returns JSON.
 */
export async function inDom<R, A = unknown>(htmls: string[], fn: string, arg?: A): Promise<R[]> {
  return withBrowser(async (b) => {
    const page = await b.newPage();
    return page.evaluate(
      ({ htmls, fn, arg }) => {
        // eslint-disable-next-line no-new-func
        const f = new Function('doc', 'arg', fn) as (d: Document, a: unknown) => unknown;
        return htmls.map((h) => f(new DOMParser().parseFromString(h, 'text/html'), arg));
      },
      { htmls, fn, arg },
    ) as Promise<R[]>;
  });
}

/** Visible text of an HTML document, whitespace collapsed. */
export async function htmlText(html: string): Promise<string> {
  const [t] = await inDom<string>([html], "doc.querySelectorAll('script,style,template').forEach(e => e.remove()); return (doc.body ? doc.body.textContent : '').replace(/\\s+/g, ' ').trim();");
  return t;
}

/** Split text into sentences (ends at . ! ? followed by space or end). */
export function sentences(text: string): string[] {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+(?=[A-Z“"'(\[])/u)
    .map((s) => s.trim())
    .filter(Boolean);
}

export const words = (s: string): number => (s.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) ?? []).length;

/** The contrast ratio of two sRGB colours (WCAG 2.2). */
export function contrast(a: [number, number, number], b: [number, number, number]): number {
  const lum = ([r, g, bl]: [number, number, number]) => {
    const c = [r, g, bl].map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

/** The deploy log every server and DNS change is recorded in (V2, V3, L1, L2, L3, N2). */
export const DEPLOY_LOG = 'deploy/deploy-log.md';

/** The bead map: label → bead id. */
export function beadIds(): Map<string, string> {
  const map = new Map<string, string>();
  for (const line of read('docs/bead-map.md').split('\n')) {
    const m = /^\| ([A-Z]+\d+) \| `([a-z0-9-]+)` \|/.exec(line);
    if (m) map.set(m[1], m[2]);
  }
  return map;
}

export function mkdirp(p: string): void {
  mkdirSync(p, { recursive: true });
}

export function isDir(rel: string): boolean {
  return exists(rel) && statSync(abs(rel)).isDirectory();
}

// ── PDF, read back with pdf.js in Node ──────────────────────────────────────────────────────────
export async function pdfFacts(buf: Buffer): Promise<{ pages: number; width: number; height: number; text: string }> {
  const pdfjs = (await import('pdfjs-dist/legacy/build/pdf.mjs')) as any;
  const doc = await pdfjs.getDocument({ data: new Uint8Array(buf), useSystemFonts: false, isEvalSupported: false, verbosity: 0 }).promise;
  const page = await doc.getPage(1);
  const [x0, y0, x1, y1] = page.view;
  const content = await page.getTextContent();
  const text = content.items.map((i: { str?: string }) => i.str ?? '').join(' ');
  return { pages: doc.numPages, width: x1 - x0, height: y1 - y0, text };
}

/** A fresh copy of the working tree (large read-only folders linked), for a test that edits it. */
export function copyTree(): string {
  const dir = mkdtempSync(join(tmpdir(), 'still-here-copy-'));
  for (const e of readdirSync(ROOT, { withFileTypes: true })) {
    if (COPY_SKIP.has(e.name)) continue;
    cpSync(join(ROOT, e.name), join(dir, e.name), { recursive: true, verbatimSymlinks: true });
  }
  for (const link of ['node_modules', 'assets', 'garage']) {
    if (existsSync(join(ROOT, link))) symlinkSync(join(ROOT, link), join(dir, link));
  }
  process.on('exit', () => rmSync(dir, { recursive: true, force: true }));
  return dir;
}

/** Status updates as records: id, time, title, body (via lxml). */
export function statusUpdates(rel = 'company/status/status-updates.xml'): { id: string; time: string; title: string; body: string }[] {
  mustExist(rel);
  return JSON.parse(
    python(
      'import sys, json\nfrom lxml import etree\n' +
        'doc = etree.parse(sys.argv[1])\nout = []\n' +
        'for e in doc.iter():\n' +
        '  if not isinstance(e.tag, str): continue\n' +
        '  i = e.get("id") or ""\n' +
        '  if i.startswith("STATUS-"):\n' +
        '    t = e.find("title"); b = e.find("body")\n' +
        '    out.append({"id": i, "time": e.get("time") or "", "title": (t.text if t is not None else "") or "", "body": " ".join((b.itertext() if b is not None else [])).strip()})\n' +
        'print(json.dumps(out))',
      [abs(rel)],
    ),
  );
}
