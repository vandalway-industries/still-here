// The pages the build writes from the company's own records (S3, S5): the three research papers
// from company/research/*.md and the status page from company/status/status-updates.xml. These two
// are the only paths under company/ the build reads (sh-042; S3 item 4). Each page under src/ holds
// one marker that this module replaces in site/ before the shell is included:
//   <!-- research:list -->   in research/index.html, the papers, newest first
//   <!-- research:paper -->  in research/<slug>.html, the paper of company/research/<slug>.md
//   <!-- status:updates -->  in status.html, the standing line and every update in the XML's order
// Everything a record says is escaped; nothing in a record is ever written into a page as markup.
// (Jules, 2026-10-04)
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const escapeHtml = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** "2026-10-01" → "1 October 2026" (UTC; the records write dates, not instants). */
export function longDate(iso) {
  const m = /^(\d{4})-(\d\d)-(\d\d)/.exec(String(iso));
  if (!m) throw new Error(`not a date: ${iso}`);
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
}

// ── Front matter ────────────────────────────────────────────────────────────────────────────────
// The papers' front matter is flat `key: value` lines; values may be double-quoted.
export function frontMatter(text) {
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(text);
  if (!m) return { data: {}, body: text };
  const data = {};
  for (const line of m[1].split('\n')) {
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (!kv) continue;
    let v = kv[2].trim();
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    else if (v.startsWith("'") && v.endsWith("'")) v = v.slice(1, -1).replace(/''/g, "'");
    data[kv[1]] = v;
  }
  return { data, body: m[2] };
}

// ── Markdown, the subset the papers use ────────────────────────────────────────────────────────
// Headings (## to ####), paragraphs, ordered and unordered lists, block quotes, *emphasis*,
// **strong**, `code`, and footnotes ([^n] and [^n]: …). Anything else is text.
function inline(text, notes) {
  let s = escapeHtml(text);
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*\w])\*([^*\s][^*]*)\*(?!\w)/g, '$1<em>$2</em>');
  s = s.replace(/\[\^([^\]\s]+)\]/g, (_, n) => {
    if (!notes.order.includes(n)) notes.order.push(n);
    notes.refs[n] = (notes.refs[n] ?? 0) + 1;
    const k = notes.refs[n];
    return `<sup class="note-ref"><a href="#note-${escapeHtml(n)}" id="ref-${escapeHtml(n)}${k > 1 ? `-${k}` : ''}">${escapeHtml(n)}</a></sup>`;
  });
  return s;
}

export function renderMarkdown(md, { headingShift = 0 } = {}) {
  const notes = { order: [], refs: {}, defs: {} };
  const body = md.replace(/^\[\^([^\]\s]+)\]:\s*(.+)$/gm, (_, n, t) => {
    notes.defs[n] = t.trim();
    return '';
  });
  const out = [];
  const blocks = body.split(/\n\s*\n/);
  for (const raw of blocks) {
    const block = raw.replace(/^\n+|\s+$/g, '');
    if (!block) continue;
    const lines = block.split('\n');
    const h = /^(#{1,6})\s+(.+?)\s*$/.exec(lines[0]);
    if (h && lines.length === 1) {
      const level = Math.min(6, h[1].length + headingShift);
      out.push(`<h${level}>${inline(h[2].replace(/[*_`]/g, ''), notes)}</h${level}>`);
      continue;
    }
    if (lines.every((l) => /^\s*(?:[-*]|\d+\.)\s/.test(l))) {
      let list = null;
      for (const l of lines) {
        const ordered = /^\s*\d+\.\s/.test(l);
        const tag = ordered ? 'ol' : 'ul';
        if (!list || list.tag !== tag) {
          if (list) out.push(`<${list.tag}>${list.items.join('')}</${list.tag}>`);
          list = { tag, items: [] };
        }
        const text = l.replace(/^\s*(?:[-*]|\d+\.)\s+/, '');
        list.items.push(`<li>${ordered ? `<span class="list-n">${escapeHtml(/^\s*(\d+)\./.exec(l)[1])}.</span> ` : ''}${inline(text, notes)}</li>`);
      }
      out.push(`<${list.tag}${list.tag === 'ol' ? ' class="numbered"' : ''}>${list.items.join('')}</${list.tag}>`);
      continue;
    }
    if (lines.every((l) => /^>/.test(l))) {
      const inner = lines.map((l) => l.replace(/^>\s?/, '')).join(' ');
      out.push(`<blockquote><p>${inline(inner, notes)}</p></blockquote>`);
      continue;
    }
    out.push(`<p>${inline(lines.join(' '), notes)}</p>`);
  }
  const used = notes.order.filter((n) => notes.defs[n] !== undefined);
  for (const n of Object.keys(notes.defs)) if (!used.includes(n)) used.push(n);
  let footnotes = '';
  if (used.length) {
    const scratch = { order: [], refs: {}, defs: {} };
    footnotes =
      `<section class="paper-notes" aria-labelledby="notes-heading"><h2 id="notes-heading" class="label">Notes</h2><ol>` +
      used
        .map((n) => `<li id="note-${escapeHtml(n)}"><span class="list-n">${escapeHtml(n)}.</span> ${inline(notes.defs[n], scratch)}${notes.refs[n] ? ` <a href="#ref-${escapeHtml(n)}" class="note-back" aria-label="Back to the text of note ${escapeHtml(n)}">↩</a>` : ''}</li>`)
        .join('') +
      `</ol></section>`;
  }
  return { html: out.join('\n'), footnotes };
}

// ── The cover, drawn in code ───────────────────────────────────────────────────────────────────
// Institutional typography and a chart so flat it looks unfinished. Colours come from site.css
// classes (the tokens); the drawing carries none of its own.
function wrapWords(text, max) {
  const lines = [];
  let line = '';
  for (const w of String(text).split(/\s+/)) {
    if (line && (line + ' ' + w).length > max) {
      lines.push(line);
      line = w;
    } else line = line ? `${line} ${w}` : w;
  }
  if (line) lines.push(line);
  return lines;
}

export function cover({ title, date, pages }) {
  const lines = wrapWords(title, 19).slice(0, 6);
  const titleSvg = lines
    .map((l, i) => `<text class="cover-title" x="24" y="${92 + i * 26}">${escapeHtml(l)}</text>`)
    .join('');
  const top = 92 + lines.length * 26 + 18;
  const chartTop = Math.max(top, 250);
  const chartBottom = 352;
  const flat = Math.round((chartTop + chartBottom) / 2);
  return (
    `<svg class="cover" viewBox="0 0 300 400" width="300" height="400" role="img" aria-label="Cover of the paper ${escapeHtml(title)}: its title, and a chart whose line does not move" focusable="false">` +
    `<rect class="cover-paper" x="0.5" y="0.5" width="299" height="399"/>` +
    `<text class="cover-label" x="24" y="36">STILL HERE · POSITIONAL RESEARCH</text>` +
    `<text class="cover-label" x="24" y="52">${escapeHtml(longDate(date).toUpperCase())}</text>` +
    `<line class="cover-rule" x1="24" y1="66" x2="276" y2="66"/>` +
    titleSvg +
    `<line class="cover-axis" x1="40" y1="${chartTop}" x2="40" y2="${chartBottom}"/>` +
    `<line class="cover-axis" x1="40" y1="${chartBottom}" x2="276" y2="${chartBottom}"/>` +
    `<line class="cover-plot" x1="40" y1="${flat}" x2="276" y2="${flat}"/>` +
    `<text class="cover-axis-label" x="24" y="${chartTop + 4}" transform="rotate(-90 24 ${chartTop + 4})" text-anchor="end">HERE</text>` +
    `<text class="cover-axis-label" x="276" y="${chartBottom + 14}" text-anchor="end">TIME</text>` +
    `<text class="cover-label" x="24" y="384">${escapeHtml(String(pages))} PP. · A VANDALWAY INDUSTRIES COMPANY</text>` +
    `</svg>`
  );
}

// ── Research ───────────────────────────────────────────────────────────────────────────────────
export function readPapers(root) {
  const dir = join(root, 'company', 'research');
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((f) => {
      const { data, body } = frontMatter(readFileSync(join(dir, f), 'utf8'));
      for (const k of ['title', 'author', 'date', 'pages', 'abstract']) {
        if (!data[k]) throw new Error(`company/research/${f}: front matter has no ${k}`);
      }
      return { slug: f.replace(/\.md$/, ''), ...data, byline: data.byline || data.author, body };
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

const authorName = (p) => String(p.byline).split(',')[0].trim();

function listing(papers) {
  return (
    `<div class="papers">` +
    papers
      .map(
        (p) =>
          `<article class="paper-entry">` +
          `<div class="paper-cover">${cover(p)}</div>` +
          `<div class="paper-summary">` +
          `<p class="label"><time datetime="${escapeHtml(p.date)}">${escapeHtml(longDate(p.date))}</time> · ${escapeHtml(p.pages)} pages</p>` +
          `<h2 class="title"><a href="/research/${p.slug}">${escapeHtml(p.title)}</a></h2>` +
          `<p class="paper-author">${escapeHtml(authorName(p))}</p>` +
          `<p class="paper-abstract body-sm">${escapeHtml(p.abstract)}</p>` +
          `</div></article>`,
      )
      .join('') +
    `</div>`
  );
}

function paperPage(p) {
  let md = p.body;
  // the record's own title line and byline are the page's heading and byline
  md = md.replace(/^\s*#\s+.+\n/, '');
  md = md.replace(new RegExp(`^\\s*${p.byline.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\n`), '');
  const { html, footnotes } = renderMarkdown(md);
  const abstractInBody = md.includes(p.abstract);
  return (
    `<article class="paper">` +
    `<header class="paper-head">` +
    `<div class="paper-head-text">` +
    `<p class="label">Positional research · <time datetime="${escapeHtml(p.date)}">${escapeHtml(longDate(p.date))}</time> · ${escapeHtml(p.pages)} pages</p>` +
    `<h1 class="headline">${escapeHtml(p.title)}</h1>` +
    `<p class="paper-byline">${escapeHtml(p.byline)}</p>` +
    `</div>` +
    `<div class="paper-head-cover">${cover(p)}</div>` +
    `</header>` +
    (abstractInBody ? '' : `<section class="paper-abstract-block" aria-labelledby="abstract-heading"><h2 id="abstract-heading" class="label">Abstract</h2><p>${escapeHtml(p.abstract)}</p></section>`) +
    `<div class="paper-body">${html}</div>` +
    footnotes +
    `<p class="paper-back"><a href="/research/">← All research</a></p>` +
    `</article>`
  );
}

function replaceOnce(file, marker, html) {
  const text = readFileSync(file, 'utf8');
  if (text.split(marker).length !== 2) throw new Error(`${file}: needs exactly one ${marker}`);
  writeFileSync(file, text.replace(marker, () => html));
}

export function writeResearch(root, out) {
  const papers = readPapers(root);
  replaceOnce(join(out, 'research', 'index.html'), '<!-- research:list -->', listing(papers));
  for (const p of papers) {
    const page = join(out, 'research', `${p.slug}.html`);
    if (!existsSync(page)) throw new Error(`src/research/${p.slug}.html is missing for company/research/${p.slug}.md`);
    replaceOnce(page, '<!-- research:paper -->', paperPage(p));
  }
  return papers.length;
}

// ── Status ─────────────────────────────────────────────────────────────────────────────────────
const unescapeXml = (s) =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&amp;/g, '&');

export function readStatus(root) {
  const xml = readFileSync(join(root, 'company', 'status', 'status-updates.xml'), 'utf8').replace(/<!--[\s\S]*?-->/g, '');
  const updates = [];
  for (const m of xml.matchAll(/<update\b([^>]*)>([\s\S]*?)<\/update>/g)) {
    const attr = Object.fromEntries([...m[1].matchAll(/([\w-]+)="([^"]*)"/g)].map((a) => [a[1], unescapeXml(a[2])]));
    const title = /<title>([\s\S]*?)<\/title>/.exec(m[2]);
    const body = /<body>([\s\S]*?)<\/body>/.exec(m[2]);
    if (!attr.id || !attr.time || !title || !body) throw new Error(`status-updates.xml: an update without id, time, title or body`);
    const paras = [...body[1].matchAll(/<p>([\s\S]*?)<\/p>/g)].map((p) => unescapeXml(p[1]).replace(/\s+/g, ' ').trim());
    updates.push({ ...attr, title: unescapeXml(title[1]).replace(/\s+/g, ' ').trim(), body: paras.length ? paras : [unescapeXml(body[1]).replace(/\s+/g, ' ').trim()] });
  }
  if (!updates.length) throw new Error('status-updates.xml holds no update');
  return updates;
}

function statusTime(iso) {
  const m = /^(\d{4}-\d\d-\d\d)T(\d\d:\d\d)/.exec(iso);
  if (!m) throw new Error(`not a time: ${iso}`);
  return `${longDate(m[1])}, ${m[2]} UTC`;
}

export function writeStatus(root, out) {
  const updates = readStatus(root);
  const html =
    `<p class="status-constant title"><img class="status-mark" src="/brand/mark.svg" width="24" height="24" alt=""><span>All systems operational</span></p>` +
    `<section class="status-history" aria-labelledby="history-heading"><h2 id="history-heading" class="label">Incident history</h2><ol class="status-rows">` +
    updates
      .map(
        (u) =>
          `<li class="status-row" id="${escapeHtml(u.id)}">` +
          `<p class="label"><time datetime="${escapeHtml(u.time)}">${escapeHtml(statusTime(u.time))}</time></p>` +
          `<h3 class="title">${escapeHtml(u.title)}</h3>` +
          `<p class="label status-id">${escapeHtml(u.id)}</p>` +
          u.body.map((p) => `<p class="body-sm">${escapeHtml(p)}</p>`).join('') +
          `</li>`,
      )
      .join('') +
    `</ol></section>`;
  replaceOnce(join(out, 'status.html'), '<!-- status:updates -->', html);
  return updates.length;
}
