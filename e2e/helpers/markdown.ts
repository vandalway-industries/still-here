// The local checkout's rendered Markdown, for W9 (RC8): a reader opens the repository's README and
// follows its links. Locally there is no GitHub to render Markdown, so this serves the working tree
// on a private origin and renders `.md` files as plain HTML (headings, paragraphs, lists, links,
// code, tables), and every other file as text. It renders; it never rewrites a link.
// Locked at specs-v1. (Diane, 2026-10-04)
import type { Page } from '@playwright/test';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, normalize } from 'node:path';
import { ROOT } from './site.ts';

export const REPOSITORY = 'https://repository.invalid';

const escHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function inline(s: string): string {
  return escHtml(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, text, href) => `<a href="${href}">${text}</a>`);
}

export function renderMarkdown(md: string, title: string): string {
  const out: string[] = [];
  let list = false;
  let code = false;
  let para: string[] = [];
  const flush = () => {
    if (para.length) out.push(`<p>${inline(para.join(' '))}</p>`);
    para = [];
  };
  const body = md.replace(/^---\n[\s\S]*?\n---\n/, '');
  for (const line of body.split('\n')) {
    if (line.startsWith('```')) {
      flush();
      out.push(code ? '</code></pre>' : '<pre><code>');
      code = !code;
      continue;
    }
    if (code) {
      out.push(escHtml(line));
      continue;
    }
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    const li = /^\s*(?:[-*]|\d+\.)\s+(.*)$/.exec(line);
    if (h) {
      flush();
      if (list) out.push('</ul>'), (list = false);
      out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`);
    } else if (li) {
      flush();
      if (!list) out.push('<ul>'), (list = true);
      out.push(`<li>${inline(li[1])}</li>`);
    } else if (/^\|/.test(line)) {
      flush();
      if (/^\|[-\s|:]+\|$/.test(line)) continue;
      out.push(`<p>${line.split('|').slice(1, -1).map((c) => inline(c.trim())).join(' · ')}</p>`);
    } else if (!line.trim()) {
      flush();
      if (list) out.push('</ul>'), (list = false);
    } else para.push(line.trim());
  }
  flush();
  if (list) out.push('</ul>');
  return `<!doctype html><html lang="en"><meta charset="utf-8"><title>${escHtml(title)}</title><main>${out.join('\n')}</main></html>`;
}

/** Serve the working tree on REPOSITORY for this page: Markdown rendered, folders listed. */
export async function serveRepository(page: Page): Promise<void> {
  await page.route(`${REPOSITORY}/**`, async (route) => {
    let path = decodeURIComponent(new URL(route.request().url()).pathname);
    if (path === '/') path = '/README.md';
    const p = normalize(join(ROOT, path));
    if (!p.startsWith(ROOT) || !existsSync(p)) return route.fulfill({ status: 404, contentType: 'text/plain', body: 'not found' });
    if (statSync(p).isDirectory()) {
      const readme = join(p, 'README.md');
      if (existsSync(readme)) return route.fulfill({ status: 200, contentType: 'text/html', body: renderMarkdown(readFileSync(readme, 'utf8'), path) });
      const items = readdirSync(p).map((n) => `<li><a href="${join(path, n)}">${escHtml(n)}</a></li>`);
      return route.fulfill({ status: 200, contentType: 'text/html', body: `<!doctype html><title>${escHtml(path)}</title><main><h1>${escHtml(path)}</h1><ul>${items.join('')}</ul></main>` });
    }
    if (p.endsWith('.md')) return route.fulfill({ status: 200, contentType: 'text/html', body: renderMarkdown(readFileSync(p, 'utf8'), path) });
    const text = readFileSync(p, 'utf8');
    return route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: `<!doctype html><title>${escHtml(path)}</title><main><h1>${escHtml(path)}</h1><pre>${escHtml(text)}</pre></main>`,
    });
  });
}
