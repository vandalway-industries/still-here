#!/usr/bin/env node
// A local server that answers the way GitHub Pages answers (garage/research/3-pages-hosting.md § 3):
//   /index            200, index.html served without the extension
//   /index.html       200
//   /index/           404
//   /folder           301 to /folder/
//   /folder/          200, folder/index.html
//   a missing path    404, with <root>/404.html as the body when present
// Anything under /api/ also carries access-control-allow-origin: *, so /api/v1/presence.json can
// be read from any origin (PRD R34). Production's own header is checked at launch (N3).
// Usage: node scripts/serve-pages.mjs <root> <port>    (the project uses: site 5320)
import { createServer } from 'node:http';
import { readFileSync, statSync } from 'node:fs';
import { extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.pdf': 'application/pdf',
};

const kind = (p) => {
  try {
    const s = statSync(p);
    return s.isDirectory() ? 'dir' : s.isFile() ? 'file' : null;
  } catch {
    return null;
  }
};

/** Resolve a request path against the root, the way Pages does. */
export function resolvePages(root, pathname) {
  const base = resolve(root);
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return { status: 400 };
  }
  if (decoded.includes('\0')) return { status: 400 };
  const target = resolve(base, '.' + decoded);
  if (target !== base && !target.startsWith(base + sep)) return { status: 404 };
  const trailing = decoded.endsWith('/');
  const k = kind(target);
  if (trailing) {
    if (k === 'dir' && kind(join(target, 'index.html')) === 'file') return { status: 200, file: join(target, 'index.html') };
    return { status: 404 };
  }
  if (k === 'file') return { status: 200, file: target };
  if (k === 'dir') return { status: 301, location: pathname + '/' };
  if (kind(target + '.html') === 'file') return { status: 200, file: target + '.html' };
  return { status: 404 };
}

export function createPagesServer(root) {
  const base = resolve(root);
  return createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    const head = req.method === 'HEAD';
    if (req.method !== 'GET' && !head) {
      res.writeHead(405, { allow: 'GET, HEAD' });
      res.end();
      return;
    }
    const r = resolvePages(base, url.pathname);
    const headers = { 'cache-control': 'max-age=600', server: 'serve-pages' };
    if (url.pathname.startsWith('/api/')) headers['access-control-allow-origin'] = '*';
    if (r.status === 301) {
      res.writeHead(301, { ...headers, location: r.location + url.search, 'content-type': 'text/html; charset=utf-8' });
      res.end(head ? undefined : `<a href="${r.location}">Moved Permanently</a>\n`);
      return;
    }
    let file = r.file;
    if (r.status !== 200) file = kind(join(base, '404.html')) === 'file' ? join(base, '404.html') : undefined;
    const body = file ? readFileSync(file) : Buffer.from('Not Found\n');
    const type = file ? (TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream') : 'text/plain; charset=utf-8';
    res.writeHead(r.status, { ...headers, 'content-type': type, 'content-length': body.length });
    res.end(head ? undefined : body);
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [root = 'site', portArg = '5320'] = process.argv.slice(2);
  if (kind(root) !== 'dir') {
    console.error(`serve-pages: ${root} is not a folder (run npm run build first)`);
    process.exit(1);
  }
  const port = Number(portArg);
  createPagesServer(root).listen(port, '127.0.0.1', () => {
    console.log(`serve-pages: ${root} on http://localhost:${port}`);
  });
}
