// The 1997 page's markup checks: DS6 items 1–5 and 7, run again by V1 on the finished page.
// PRD R42, element by element. Locked at specs-v1. (Diane, 2026-10-04)
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { abs, exists, gifInfo, inDom, jpegInfo, read, readMust } from './repo.ts';

export const DOCTYPE = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">';

type Facts = {
  body: { background: string | null; bgcolor: string | null };
  imgs: { src: string; width: string | null; height: string | null; alt: string | null; centred: boolean; parentText: string }[];
  hrs: number;
  links: { href: string; text: string }[];
  text: string;
  banned: string[];
  captions: number;
};

export async function facts(html: string): Promise<Facts> {
  const [f] = await inDom<Facts>(
    [html],
    `const body = doc.body;
     const textBeside = (img) => {
       const p = img.parentElement;
       if (!p || p === body) return '';
       return [...p.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
     };
     return {
       body: { background: body.getAttribute('background'), bgcolor: body.getAttribute('bgcolor') },
       imgs: [...doc.images].map(i => ({ src: i.getAttribute('src') || '', width: i.getAttribute('width'), height: i.getAttribute('height'), alt: i.getAttribute('alt'), centred: !!i.closest('center') || (i.parentElement && /center/i.test(i.parentElement.getAttribute('align') || '')), parentText: textBeside(i) })),
       hrs: doc.querySelectorAll('hr').length,
       links: [...doc.querySelectorAll('a[href]')].map(a => ({ href: a.getAttribute('href'), text: a.textContent.replace(/\\s+/g, ' ').trim() })),
       text: body.textContent.replace(/\\s+/g, ' ').trim(),
       banned: [...doc.querySelectorAll('script, blink, marquee, frame, frameset, iframe, embed, bgsound')].map(e => e.localName),
       captions: doc.querySelectorAll('figcaption, caption, figure').length,
     };`,
  );
  return f;
}

/** DS6 items 1–5 on vandalwayind/index.html (and its images). */
export async function checkMarkup(): Promise<void> {
  const html = readMust('vandalwayind/index.html');
  // 1. the period doctype on the first line (quirks mode is checked in the browser)
  assert.equal(html.split(/\r?\n/)[0], DOCTYPE);
  // upper-case tags, as written in 1997
  const lower = [...html.matchAll(/<\/?([a-zA-Z][a-zA-Z0-9]*)/g)].map((m) => m[1]).filter((t) => t !== t.toUpperCase());
  assert.deepEqual([...new Set(lower)], [], 'tags in upper case');
  const f = await facts(html);
  // 2. every element of PRD R42
  assert.match(f.body.background ?? '', /\.gif$/i, 'a tiled background GIF');
  assert.ok(f.body.bgcolor, 'BGCOLOR under the tiles');
  const logo = f.imgs.find((i) => /logo/i.test(i.src));
  assert.ok(logo, 'the logo');
  assert.match(logo!.src, /\.gif$/i, 'the logo is a GIF');
  assert.ok(logo!.width && logo!.height, 'the logo has WIDTH and HEIGHT');
  assert.ok(logo!.centred, 'the logo is centred');
  assert.match(f.text, /Welcome to Vandalway Industries/, 'a "Welcome to…" paragraph');
  assert.ok(f.hrs >= 2, '<HR> between sections');
  for (const item of ['About Us', 'Our Companies', 'Guestbook', 'E-Mail']) assert.match(f.text, new RegExp(`\\[\\s*${item}\\s*\\]`), `the bracketed menu: [ ${item} ]`);
  // 4. telephone hours with a time zone and a 555-01xx number
  assert.match(f.text, /555-01\d\d/, 'a number in 555-0100–555-0199');
  assert.match(f.text, /\b(Central|Eastern|Mountain|Pacific|CST|CDT|EST|EDT|MST|MDT|PST|PDT)\b/, 'the hours name a time zone');
  assert.ok(f.links.some((l) => /^mailto:/i.test(l.href)), 'a mailto: link');
  assert.ok(f.imgs.some((i) => /construct/i.test(i.src)), 'an under-construction sign');
  const badge = f.imgs.find((i) => /netscape/i.test(i.src));
  assert.ok(badge, 'a "best viewed in Netscape" badge');
  const email = f.imgs.find((i) => /mail/i.test(i.src) && /\.gif$/i.test(i.src));
  assert.ok(email, 'an e-mail icon');
  // 5. the guestbook link
  assert.ok(f.links.some((l) => l.href === '/cgi-bin/guestbook.html'), 'the guestbook link targets /cgi-bin/guestbook.html');
  assert.ok(exists('vandalwayind/cgi-bin/guestbook.html'), 'vandalwayind/cgi-bin/guestbook.html exists');
  assert.ok(f.imgs.some((i) => /counter/i.test(i.src)), 'the counter');
  assert.match(f.text, /This page has been visited/, 'the counter line');
  assert.match(f.text, /Last Updated[^.]*1997/, 'a 1997 "Last Updated" line');
  assert.match(f.text, /in-house/i, 'an in-house credit');
  assert.match(f.text, /Copyright\s*©\s*1996\s*-\s*1997/, 'a copyright range');
  assert.equal(f.text.split(/(?<=[.!?])\s+/).filter((s) => /\b(moved|moving|relocat\w*)\b/i.test(s)).length, 1, 'one relocation line');
  assert.deepEqual(f.banned, [], 'no SCRIPT, BLINK, MARQUEE, FRAME, IFRAME, EMBED or BGSOUND');
  assert.doesNotMatch(html, /monovision/i, 'MONOvision appears nowhere');
  // 3. GIFs, except s09: a JPEG 200–410 wide with no caption beside it
  const at = (src: string) => join(abs('vandalwayind'), src.replace(/^\//, ''));
  for (const i of f.imgs) {
    assert.ok(existsSync(at(i.src)), `${i.src} exists in vandalwayind/`);
    if (/s09/i.test(i.src)) continue;
    assert.equal(readFileSync(at(i.src)).subarray(0, 3).toString('latin1'), 'GIF', `${i.src} is a GIF`);
  }
  const s09 = f.imgs.filter((i) => /s09/i.test(i.src));
  assert.equal(s09.length, 1, 's09, once');
  const j = jpegInfo(readFileSync(at(s09[0].src)));
  assert.ok(j.width >= 200 && j.width <= 410, `s09 is ${j.width} wide (200–410)`);
  assert.equal(s09[0].parentText, '', 'no text beside s09');
  assert.equal(f.captions, 0, 'no caption element');
  assert.ok(gifInfo(readFileSync(at(email!.src))).frames > 1, 'the e-mail icon is animated');
  const b = gifInfo(readFileSync(at(badge!.src)));
  assert.deepEqual([b.width, b.height], [88, 31], 'the Netscape badge is 88 × 31 (D18)');
  const gifs = exists('scripts/gifs') ? readdirSync(abs('scripts/gifs')).map((n) => read(`scripts/gifs/${n}`)).join('\n') : '';
  assert.match(gifs, /netscape/i, 'the badge is drawn by scripts/gifs/');
}
