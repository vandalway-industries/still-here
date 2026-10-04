// The STILL HERE certificate, drawn as one SVG: US Letter landscape, 1100 × 850 user units.
//
//   drawCertificate({ name, time, zone, identifier, link }) → SVG markup (a string)
//     name        the object's name, as typed
//     time        a Date: the second of the press
//     zone        the issuer's IANA time zone
//     identifier  the printed identifier, SH-XXXX-XXXX-XXXX
//     link        the certificate link the QR code encodes
//
// Only the elements svg2pdf.js draws (PRD R9): svg, g, path, rect, circle, line, polyline, text,
// tspan, and image for a name with characters outside the face (diff item 8). No style attribute or element, no filter, mask, gradient or textPath; every position is
// explicit. Colours come from src/js/tokens.js. Text is set in the certificate faces (Cormorant
// Garamond, Inter Tight for the wordmark, JetBrains Mono for the identifier); the signatures are
// paths converted at build time (signatures.js), so no script face is ever loaded.
// Blocks carry data-field: name, date, zone, utc, identifier, qr (what varies with the issue) and
// seal, border, signature (the drawn marks). (Jules, 2026-10-04)
import { colors } from '../tokens.js';
import { MARK } from '../mark.js';
import { ADVANCES } from './metrics.js';
import { encodeQr } from './qr.js';
import { SIGNATURES } from './signatures.js';

export const WIDTH = 1100;
export const HEIGHT = 850;
export const FOOTER = 'Confirms successful completion of this form. No physical inspection occurred.';

const INK = colors.ink;
const MUTED = colors['graphite-muted'];
const PAPER = colors.paper;
const GREEN = colors['verification-green'];

const SERIF = 'Cormorant Garamond';
const SANS = 'Inter Tight';
const MONO = 'JetBrains Mono';

// ── Text helpers ────────────────────────────────────────────────────────────────────────────────
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const n = (v) => String(Math.round(v * 100) / 100);

/** Advance of one character in thousandths of an em (an average for characters not in the table). */
function advance(face, ch) {
  const table = ADVANCES[face];
  const a = table[ch.codePointAt(0)];
  return a ?? (face.startsWith(MONO) ? 600 : 520);
}

/** Width of a string in user units at a size. */
export function measure(text, face, size, tracking = 0) {
  let w = 0;
  for (const ch of text) w += advance(face, ch) / 1000 + tracking;
  return w * size;
}

/** Per-character x positions for a string centred on cx, with optional tracking (em). */
function positions(text, face, size, cx, tracking = 0, extra = {}) {
  const chars = [...text];
  const widths = chars.map((c, i) => (advance(face, c) / 1000 + (i < chars.length - 1 ? tracking : 0) + (extra[i + 1] ?? 0)) * size);
  const total = widths.reduce((a, b) => a + b, 0);
  const xs = [];
  let x = cx - total / 2;
  for (const w of widths) {
    xs.push(x);
    x += w;
  }
  return xs;
}

function text(str, { x, y, size, family = SERIF, weight = 500, fill = INK, anchor = 'middle', field, xs } = {}) {
  const attrs = [
    field ? `data-field="${field}"` : '',
    xs ? '' : `x="${n(x)}"`,
    `y="${n(y)}"`,
    `font-family="${family}"`,
    `font-size="${n(size)}"`,
    `font-weight="${weight}"`,
    `fill="${fill}"`,
    xs ? '' : `text-anchor="${anchor}"`,
  ].filter(Boolean);
  // explicit glyph positions: one tspan per character, each with its own x, because svg2pdf.js
  // reads only the first value of an x list (checked against the PDF rendered back)
  const body = xs
    ? [...str].map((c, i) => (c === ' ' ? ' ' : `<tspan x="${n(xs[i])}" y="${n(y)}">${esc(c)}</tspan>`)).join('')
    : esc(str);
  return `<text ${attrs.join(' ')}>${body}</text>`;
}

// ── Dates, written out ──────────────────────────────────────────────────────────────────────────
const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const ORD = { one: 'first', two: 'second', three: 'third', five: 'fifth', eight: 'eighth', nine: 'ninth', twelve: 'twelfth' };
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function words(num) {
  if (num < 20) return ONES[num];
  if (num < 100) return TENS[Math.floor(num / 10)] + (num % 10 ? `-${ONES[num % 10]}` : '');
  if (num < 1000) return `${ONES[Math.floor(num / 100)]} hundred${num % 100 ? ` and ${words(num % 100)}` : ''}`;
  const rest = num % 1000;
  return `${words(Math.floor(num / 1000))} thousand${rest ? (rest < 100 ? ` ${words(rest)}` : ` ${words(rest)}`) : ''}`;
}

function ordinal(num) {
  const w = words(num);
  const parts = w.split('-');
  const last = parts.pop();
  const o = ORD[last] ?? (last.endsWith('y') ? `${last.slice(0, -1)}ieth` : `${last}th`);
  return [...parts, o].join('-');
}

/** The issue moment's local parts in a zone, English, 24-hour. */
export function localParts(time, zone) {
  const f = new Intl.DateTimeFormat('en-GB', {
    timeZone: zone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });
  const p = Object.fromEntries(f.formatToParts(time).map((x) => [x.type, x.value]));
  return { year: Number(p.year), month: Number(p.month), day: Number(p.day), clock: `${p.hour}:${p.minute}:${p.second}` };
}

export function dateLine(time, zone) {
  const p = localParts(time, zone);
  return `Issued on the ${ordinal(p.day)} day of ${MONTHS[p.month - 1]}, ${words(p.year)}, at ${p.clock}`;
}

export function utcLine(time) {
  const iso = time.toISOString();
  return `Recorded ${iso.slice(0, 10)} ${iso.slice(11, 19)} UTC`;
}

// ── The name: shrink to a 30-unit floor, then wrap to up to four centred lines ──────────────────
// A name is set in NFC, so a name typed composed or decomposed prints identically (R11).
const NAME_FACE = `${SERIF}/600`;
const NAME_MAX = 54;
const NAME_FLOOR = 30;
const NAME_WIDTH = 760;
// the widest a name image may run before it must take a fifth line: inside the inner rules
const NAME_WIDTH_MAX = 900;
// pixels per user unit for a name drawn as an image: 600 dpi on the 11-inch page (diff item 8)
const NAME_SCALE = 6;

function graphemes(s) {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) return [...new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(s)].map((g) => g.segment);
  return [...s];
}

/** Is every character of the name in the certificate face? */
export function inFace(name) {
  const table = ADVANCES[NAME_FACE];
  for (const ch of name) if (table[ch.codePointAt(0)] === undefined) return false;
  return true;
}

/** Lay a name out with a width function (user units at a size): one line, or four at the floor. */
function layout(name, widthAt, maxWidth = NAME_WIDTH) {
  const w = widthAt(name, 1);
  if (w * NAME_FLOOR <= maxWidth) return { size: Math.min(NAME_MAX, maxWidth / w), lines: [name] };
  const size = NAME_FLOOR;
  const lines = [];
  let line = '';
  const fits = (s) => widthAt(s, size) <= maxWidth;
  for (const word of name.split(/\s+/).filter(Boolean)) {
    const candidate = line ? `${line} ${word}` : word;
    if (fits(candidate)) {
      line = candidate;
      continue;
    }
    if (line) lines.push(line);
    line = '';
    if (fits(word)) {
      line = word;
      continue;
    }
    // a word wider than the line breaks at a grapheme boundary, with no hyphen
    for (const g of graphemes(word)) {
      if (fits(line + g)) line += g;
      else {
        lines.push(line);
        line = g;
      }
    }
  }
  if (line) lines.push(line);
  return { size, lines };
}

export function fitName(name) {
  const fit = layout(name.normalize('NFC'), (s, size) => measure(s, NAME_FACE, size));
  return { size: fit.size, lines: fit.lines.slice(0, 4) };
}

/** A 2D canvas the browser draws a name on, or null where there is none (Node). */
function canvas2d(w, h) {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

/**
 * A name with characters outside the certificate face (diff item 8): each line is drawn by the
 * visitor's browser, in the certificate face where it has the glyph and the browser's own fallback
 * where it does not, and placed as an image in the name's position. Null where no canvas exists.
 */
function nameImages(name, cx, centre) {
  const probe = canvas2d(1, 1);
  if (!probe) return null;
  const ctx = probe.getContext('2d');
  const font = (size) => `600 ${size}px "${SERIF}", serif`;
  const widthAt = (s, size) => {
    ctx.font = font(100);
    return (ctx.measureText(s).width / 100) * size;
  };
  let fit = layout(name, widthAt);
  if (fit.lines.length > 4) fit = layout(name, widthAt, NAME_WIDTH_MAX);
  const lead = fit.size * 1.08;
  const firstBase = centre - ((fit.lines.length - 1) * lead) / 2;
  const tall = fit.size * 1.3;
  const out = [];
  fit.lines.forEach((line, i) => {
    const w = widthAt(line, fit.size) + fit.size * 0.2;
    const c = canvas2d(Math.ceil(w * NAME_SCALE), Math.ceil(tall * NAME_SCALE));
    const g = c.getContext('2d');
    g.font = font(fit.size * NAME_SCALE);
    g.fillStyle = INK;
    g.textBaseline = 'alphabetic';
    g.textAlign = 'center';
    const ascent = fit.size * 0.98;
    g.fillText(line, c.width / 2, ascent * NAME_SCALE);
    const y = firstBase + i * lead - ascent;
    out.push(`<image x="${n(cx - w / 2)}" y="${n(y)}" width="${n(c.width / NAME_SCALE)}" height="${n(c.height / NAME_SCALE)}" preserveAspectRatio="none" href="${c.toDataURL('image/png')}"/>`);
  });
  return `<g data-field="name">${out.join('')}</g>`;
}

// ── The drawn marks ─────────────────────────────────────────────────────────────────────────────
/** A guilloche band: interlaced sine waves following a rounded rectangle, plus its rules. */
function border() {
  const parts = [];
  const rule = (inset, width, colour = INK) =>
    `<path d="M${inset} ${inset}H${WIDTH - inset}V${HEIGHT - inset}H${inset}Z" fill="none" stroke="${colour}" stroke-width="${width}"/>`;
  parts.push(rule(26, 1.4), rule(29.5, 0.5), rule(62.5, 0.5), rule(66, 1));
  // the centre line of the band: a rounded rectangle at inset 46 with corner radius 10
  const inset = 46;
  const rc = 10;
  const w = WIDTH - 2 * inset - 2 * rc;
  const h = HEIGHT - 2 * inset - 2 * rc;
  const arc = (Math.PI / 2) * rc;
  const perimeter = 2 * w + 2 * h + 4 * arc;
  const segments = [
    { len: w, at: (t) => [inset + rc + t, inset, 0, -1] },
    { len: arc, at: (t) => corner(WIDTH - inset - rc, inset + rc, -Math.PI / 2 + t / rc) },
    { len: h, at: (t) => [WIDTH - inset, inset + rc + t, 1, 0] },
    { len: arc, at: (t) => corner(WIDTH - inset - rc, HEIGHT - inset - rc, t / rc) },
    { len: w, at: (t) => [WIDTH - inset - rc - t, HEIGHT - inset, 0, 1] },
    { len: arc, at: (t) => corner(inset + rc, HEIGHT - inset - rc, Math.PI / 2 + t / rc) },
    { len: h, at: (t) => [inset, HEIGHT - inset - rc - t, -1, 0] },
    { len: arc, at: (t) => corner(inset + rc, inset + rc, Math.PI + t / rc) },
  ];
  function corner(cx, cy, a) {
    return [cx + rc * Math.cos(a), cy + rc * Math.sin(a), Math.cos(a), Math.sin(a)];
  }
  function along(s) {
    let t = ((s % perimeter) + perimeter) % perimeter;
    for (const seg of segments) {
      if (t <= seg.len) return seg.at(t);
      t -= seg.len;
    }
    return segments[0].at(0);
  }
  const waves = Math.round(perimeter / 18);
  const lambda = perimeter / waves;
  const steps = waves * 6;
  const curve = (phase, amp) => {
    const pts = [];
    for (let i = 0; i < steps; i++) {
      const s = (i / steps) * perimeter;
      const [x, y, nx, ny] = along(s);
      const off = amp * Math.sin((2 * Math.PI * s) / lambda + phase);
      pts.push([x + nx * off, y + ny * off]);
    }
    // closed Catmull–Rom spline through the samples, as cubic Béziers
    let d = `M${n(pts[0][0])} ${n(pts[0][1])}`;
    for (let i = 0; i < pts.length; i++) {
      const p0 = pts[(i - 1 + pts.length) % pts.length];
      const p1 = pts[i];
      const p2 = pts[(i + 1) % pts.length];
      const p3 = pts[(i + 2) % pts.length];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += `C${n(c1[0])} ${n(c1[1])} ${n(c2[0])} ${n(c2[1])} ${n(p2[0])} ${n(p2[1])}`;
    }
    return `<path d="${d}Z" fill="none" stroke="${INK}" stroke-width="0.45"/>`;
  };
  for (let k = 0; k < 4; k++) parts.push(curve((k * Math.PI) / 2, 11));
  for (let k = 0; k < 2; k++) parts.push(curve((k * Math.PI) + Math.PI / 4, 5.5));
  return `<g data-field="border">${parts.join('')}</g>`;
}

/** The mark (brackets and dot) at a position and height, in a colour. */
function mark(x, y, height, fill) {
  const k = height / MARK.height;
  return `<g transform="translate(${n(x)} ${n(y)}) scale(${n(k * 1000) / 1000})" fill="${fill}">${MARK.brackets.map((d) => `<path d="${d}"/>`).join('')}<circle cx="${MARK.dot.cx}" cy="${MARK.dot.cy}" r="${MARK.dot.r}"/></g>`;
}

/** The seal: a green rosette, its ring of letters in graphite on paper, the mark at its centre. */
function seal(cx, cy) {
  const parts = [];
  // scalloped outer edge: 48 lobes
  const lobes = 48;
  const rOut = 76;
  const rIn = 71.5;
  let d = '';
  for (let i = 0; i < lobes; i++) {
    const a0 = (i / lobes) * 2 * Math.PI;
    const a1 = ((i + 0.5) / lobes) * 2 * Math.PI;
    const a2 = ((i + 1) / lobes) * 2 * Math.PI;
    const p0 = [cx + rIn * Math.cos(a0), cy + rIn * Math.sin(a0)];
    const pc = [cx + (rOut + 4.5) * Math.cos(a1), cy + (rOut + 4.5) * Math.sin(a1)];
    const p2 = [cx + rIn * Math.cos(a2), cy + rIn * Math.sin(a2)];
    d += `${i ? '' : `M${n(p0[0])} ${n(p0[1])}`}Q${n(pc[0])} ${n(pc[1])} ${n(p2[0])} ${n(p2[1])}`;
  }
  parts.push(`<path d="${d}Z" fill="${GREEN}"/>`);
  // the paper ring that carries the letters, edged in green
  parts.push(`<circle cx="${cx}" cy="${cy}" r="66" fill="${PAPER}"/>`);
  parts.push(`<circle cx="${cx}" cy="${cy}" r="63.5" fill="none" stroke="${GREEN}" stroke-width="0.8"/>`);
  parts.push(`<circle cx="${cx}" cy="${cy}" r="46.5" fill="none" stroke="${GREEN}" stroke-width="0.8"/>`);
  // the inner rosette: a green disc with a rose of paper lines, then the mark in paper
  parts.push(`<circle cx="${cx}" cy="${cy}" r="43" fill="${GREEN}"/>`);
  let rose = '';
  const petals = 12;
  for (let i = 0; i < 360; i++) {
    const a = (i / 360) * 2 * Math.PI;
    const r = 26 + 12 * Math.abs(Math.cos((petals / 2) * a));
    rose += `${i ? 'L' : 'M'}${n(cx + r * Math.cos(a))} ${n(cy + r * Math.sin(a))}`;
  }
  parts.push(`<path d="${rose}Z" fill="none" stroke="${PAPER}" stroke-width="0.6"/>`);
  parts.push(`<circle cx="${cx}" cy="${cy}" r="24" fill="${GREEN}" stroke="${PAPER}" stroke-width="0.6"/>`);
  parts.push(mark(cx - 15.1, cy - 15, 30, PAPER));
  // the ring of letters, placed glyph by glyph
  const ring = 'STILL HERE · OFFICE OF CONTINUED PRESENCE · STILL HERE · ';
  const face = `${SERIF}/600`;
  const size = 9.6;
  const radius = 51.5;
  const chars = [...ring];
  const total = chars.reduce((a, c) => a + advance(face, c) / 1000, 0) * size;
  const spacing = (2 * Math.PI * radius - total) / chars.length;
  let s = 0;
  const glyphs = [];
  for (const c of chars) {
    const w = (advance(face, c) / 1000) * size;
    const angle = ((s + w / 2) / (2 * Math.PI * radius)) * 360;
    s += w + spacing;
    if (c === ' ') continue;
    glyphs.push(
      `<text x="${n(cx)}" y="${n(cy - radius)}" transform="rotate(${n(angle)} ${n(cx)} ${n(cy)})" font-family="${SERIF}" font-size="${size}" font-weight="600" text-anchor="middle">${esc(c)}</text>`,
    );
  }
  parts.push(`<g fill="${INK}">${glyphs.join('')}</g>`);
  return `<g data-field="seal">${parts.join('')}</g>`;
}

/** A signature over its rule, with the signatory's name and title beneath. */
function signature(id, cx, baseline, height, maxWidth, label) {
  const sig = SIGNATURES[id];
  const [x0, y0, x1, y1] = sig.box;
  const k = Math.min(height / (y1 - y0), maxWidth / (x1 - x0));
  const w = (x1 - x0) * k;
  const tx = cx - w / 2 - x0 * k;
  // the baseline of the script sits on the rule; descenders cross it
  const ty = baseline - 2;
  return [
    `<g data-field="signature" transform="translate(${n(tx)} ${n(ty)}) scale(${n(k * 10000) / 10000})"><path d="${sig.d}" fill="${INK}"/></g>`,
    `<line x1="${n(cx - 105)}" y1="${baseline}" x2="${n(cx + 105)}" y2="${baseline}" stroke="${INK}" stroke-width="0.6"/>`,
    text(label, { x: cx, y: baseline + 19, size: 14, weight: 500 }),
  ].join('');
}

/** The QR code as one graphite path of module runs, on a paper square with its quiet zone. */
function qr(link, x, y, size) {
  const { size: count, modules } = encodeQr(link);
  const quiet = 4;
  const unit = size / (count + 2 * quiet);
  let d = '';
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; ) {
      if (!modules[r][c]) {
        c++;
        continue;
      }
      let e = c;
      while (e < count && modules[r][e]) e++;
      d += `M${n(x + (quiet + c) * unit)} ${n(y + (quiet + r) * unit)}h${n((e - c) * unit)}v${n(unit)}h${n(-(e - c) * unit)}z`;
      c = e;
    }
  }
  return `<g data-field="qr"><rect x="${n(x)}" y="${n(y)}" width="${n(size)}" height="${n(size)}" fill="${PAPER}"/><path d="${d}" fill="${INK}"/></g>`;
}

// ── The certificate ─────────────────────────────────────────────────────────────────────────────
export function drawCertificate({ name, time, zone, identifier, link }) {
  const t = time instanceof Date ? time : new Date(time);
  const cx = WIDTH / 2;
  const out = [];
  out.push(`<rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="${PAPER}"/>`);
  out.push(border());

  // the wordmark: the mark, STILL HERE in Inter Tight, the trademark sign raised
  const wmSize = 25;
  const wmFace = `${SANS}/700`;
  const wmText = 'STILL HERE';
  const markH = 31;
  const markW = (MARK.width / MARK.height) * markH;
  const gap = 11;
  const textW = measure(wmText, wmFace, wmSize);
  const tmW = measure('™', wmFace, 9);
  const total = markW + gap + textW + tmW;
  const left = cx - total / 2;
  const base = 124;
  out.push(mark(left, base - 9 - markH / 2 - 0.5 * 0, markH, GREEN));
  out.push(text(wmText, { x: left + markW + gap, y: base, size: wmSize, family: SANS, weight: 700, anchor: 'start' }));
  out.push(text('™', { x: left + markW + gap + textW + 1, y: base - 11, size: 9, family: SANS, weight: 700, anchor: 'start' }));
  out.push(text('A Vandalway Industries company', { x: cx, y: 150, size: 13, weight: 500, fill: MUTED }));

  // the title, tracked capitals with explicit positions, and its rule
  const title = 'CERTIFICATE OF CONTINUED PRESENCE';
  out.push(text(title, { xs: positions(title, `${SERIF}/600`, 21, cx, 0.16), y: 204, size: 21, weight: 600 }));
  out.push(`<path d="M${cx - 150} 222H${cx - 8}M${cx + 8} 222H${cx + 150}M${cx} 218.5L${cx + 3.5} 222L${cx} 225.5L${cx - 3.5} 222Z" fill="${INK}" stroke="${INK}" stroke-width="0.6"/>`);

  out.push(text('This certifies that', { x: cx, y: 266, size: 22, weight: 500 }));

  // the name, as typed (in NFC): vector text in the face, or drawn by the browser (diff item 8)
  const setName = name.normalize('NFC');
  const image = inFace(setName) ? null : nameImages(setName, cx, 326);
  if (image) out.push(image);
  else {
    const fit = fitName(setName);
    const lead = fit.size * 1.08;
    const firstBase = 326 - ((fit.lines.length - 1) * lead) / 2;
    const tspans = fit.lines.map((l, i) => `<tspan x="${cx}" y="${n(firstBase + i * lead)}">${esc(l)}</tspan>`).join('');
    out.push(`<text data-field="name" font-family="${SERIF}" font-size="${n(fit.size)}" font-weight="600" fill="${INK}" text-anchor="middle">${tspans}</text>`);
  }
  out.push(`<line x1="${cx - 280}" y1="352" x2="${cx + 280}" y2="352" stroke="${MUTED}" stroke-width="0.5"/>`);

  out.push(text('was, at the moment recorded below, confirmed to be', { x: cx, y: 392, size: 20, weight: 500 }));

  // STILL HERE., with every glyph placed so the period clears the E (sh-010)
  const heading = 'STILL HERE.';
  const hSize = 50;
  // Cormorant's E and period leave 0.094 em of paper between them; 0.02 em tracking and 0.035 em
  // more before the period make it about 0.15 em, over the 0.12 em bar
  const hx = positions(heading, `${SERIF}/600`, hSize, cx, 0.02, { [heading.length - 1]: 0.035 });
  out.push(text(heading, { xs: hx, y: 450, size: hSize, weight: 600, fill: GREEN }));

  out.push(text(dateLine(t, zone), { x: cx, y: 496, size: 19, weight: 500, field: 'date' }));
  out.push(text(`Jurisdiction of here: ${zone}`, { x: cx, y: 523, size: 19, weight: 500, field: 'zone' }));

  // signatures
  out.push(signature('clive', 410, 664, 70, 228, 'Clive Standish, Founder'));
  out.push(signature('diane', 690, 664, 36, 120, 'Diane, Quality Assurance'));

  // the QR code, lower left, and where to verify
  out.push(qr(link, 92, 574, 118));
  out.push(text('Verify at isitstillhere.com/verify', { x: 151, y: 708, size: 11.5, weight: 500, fill: MUTED }));

  // the seal, lower right
  out.push(seal(948, 640));

  // the identifier and the moment in UTC, then the footer
  out.push(text(`Certificate ${identifier}`, { x: cx, y: 726, size: 12.5, family: MONO, weight: 500, field: 'identifier' }));
  out.push(text(utcLine(t), { x: cx, y: 744, size: 11.5, weight: 500, fill: MUTED, field: 'utc' }));
  out.push(text(FOOTER, { x: cx, y: 772, size: 11, weight: 500 }));

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}">${out.join('')}</svg>`;
}

export default drawCertificate;
