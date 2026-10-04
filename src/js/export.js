// The certificate as files (PRD R14–R16, E4): Download PDF and Download PNG.
//
//   exportCertificate(kind, { svg, name, identifier }) → Promise<void>
//     kind        'pdf' or 'png'
//     svg         the certificate's SVG markup, exactly as drawn on screen (draw.js)
//     name        the name as typed; identifier: the printed identifier
//   Resolves once the download has been handed to the browser; rejects if anything fails (a font
//   that cannot be fetched, a canvas the browser refuses). The caller shows the failure.
//
// PDF: jsPDF 4.2.1 and svg2pdf.js 2.8.1 (served from /js/vendor/, loaded on first use), the
// certificate's TrueType faces registered before conversion so each is embedded as /FontFile2
// under its family name; US Letter landscape, 792 × 612 pt.
// PNG: a serialized copy of the same SVG with the same faces inlined in a <style>, drawn to a
// canvas at 300 dpi (3,300 × 2,550, under iOS's 16,777,216-pixel cap) once the faces have loaded,
// exported with toBlob; the canvas is released to 0 × 0 afterwards.
// Filenames: STILL-HERE-<slug>-<identifier body>.<pdf|png> (CONTENT_SEEDS.md § Download filenames).
// (Jules, 2026-10-04)
import { canonicalize } from './identifier.js';

const FACES = [
  { family: 'Cormorant Garamond', weight: 500, file: 'CormorantGaramond-Medium' },
  { family: 'Cormorant Garamond', weight: 600, file: 'CormorantGaramond-SemiBold' },
  { family: 'Inter Tight', weight: 700, file: 'InterTight-Bold' },
  { family: 'JetBrains Mono', weight: 500, file: 'JetBrainsMono-Medium' },
];
const PNG_WIDTH = 3300;
const PNG_HEIGHT = 2550;

/** The download slug: ASCII, at most 40 characters, `object` when nothing is left. */
export function slug(name) {
  let s = canonicalize(name)
    .normalize('NFKD')
    .replace(/\p{M}+/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (s.length > 40) {
    const cut = s.slice(0, 41).lastIndexOf('-');
    s = cut > 0 ? s.slice(0, cut) : s.slice(0, 40);
    s = s.replace(/-+$/g, '');
  }
  return s || 'object';
}

/** STILL-HERE-<slug>-<the 11 symbols between SH- and the check symbol>.<ext> */
export function filename(name, identifier, ext) {
  const body = identifier.replace(/^SH-/, '').replace(/-/g, '').slice(0, 11);
  return `STILL-HERE-${slug(name)}-${body}.${ext}`;
}

// ── Loading what an export needs ────────────────────────────────────────────────────────────────
const scripts = new Map();
function loadScript(src) {
  if (!scripts.has(src)) {
    scripts.set(
      src,
      new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = () => resolve();
        s.onerror = () => {
          scripts.delete(src);
          s.remove();
          reject(new Error(`could not load ${src}`));
        };
        document.head.append(s);
      }),
    );
  }
  return scripts.get(src);
}

let fontCache = null;
/** The four faces as TrueType bytes (binary strings and base64). Kept once every face has loaded. */
async function fonts() {
  if (fontCache) return fontCache;
  const loaded = await Promise.all(
    FACES.map(async (f) => {
      const r = await fetch(`/fonts/${f.file}.ttf`);
      if (!r.ok) throw new Error(`font ${f.file}: ${r.status}`);
      const bytes = new Uint8Array(await r.arrayBuffer());
      let binary = '';
      for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
      return { ...f, bytes: bytes.buffer, binary, base64: btoa(binary) };
    }),
  );
  fontCache = loaded;
  return loaded;
}

function save(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.hidden = true;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

// ── PNG ─────────────────────────────────────────────────────────────────────────────────────────
async function png(svg, faces) {
  // the faces, confirmed loaded in the page before drawing (R14); made from the fetched bytes, so
  // no font is loaded from a data: address the page's Content-Security-Policy would refuse
  await Promise.all(
    faces.map(async (f) => {
      const face = new FontFace(f.family, f.bytes.slice(0), { weight: String(f.weight) });
      document.fonts.add(await face.load());
    }),
  );
  // the faces go into the serialized copy as text: a <style> added through a parsed document would
  // be refused by the page's Content-Security-Policy, while the image draws its own copy freely
  const css = faces
    .map((f) => `@font-face{font-family:"${f.family}";font-weight:${f.weight};font-style:normal;src:url(data:font/ttf;base64,${f.base64}) format("truetype");}`)
    .join('') +
    // jsPDF sets glyphs without kerning or ligatures; the PNG does the same, so both files match
    'text{font-kerning:none;font-variant-ligatures:none;font-feature-settings:"kern" 0,"liga" 0,"clig" 0}';
  const sized = svg.replace(/^<svg\b[^>]*>/, (tag) =>
    tag.replace(/\swidth="[^"]*"/, ` width="${PNG_WIDTH}"`).replace(/\sheight="[^"]*"/, ` height="${PNG_HEIGHT}"`) + `<style>${css}</style>`,
  );
  const img = new Image();
  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(sized)));
  await img.decode();
  // an SVG drawn as an image loads its own copy of the inlined faces; give it a moment to use them
  await new Promise((r) => setTimeout(r, 300));
  const canvas = document.createElement('canvas');
  canvas.width = PNG_WIDTH;
  canvas.height = PNG_HEIGHT;
  try {
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, PNG_WIDTH, PNG_HEIGHT);
    const blob = await new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('the canvas gave no PNG'))), 'image/png'));
    return blob;
  } finally {
    canvas.width = 0;
    canvas.height = 0;
  }
}

// ── PDF ─────────────────────────────────────────────────────────────────────────────────────────
async function pdf(svg, faces, identifier) {
  await loadScript('/js/vendor/jspdf.umd.min.js');
  await loadScript('/js/vendor/svg2pdf.umd.min.js');
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'letter', compress: true });
  for (const f of faces) {
    const vfs = `${f.file}.ttf`;
    doc.addFileToVFS(vfs, f.binary);
    doc.addFont(vfs, f.family, 'normal', f.weight);
  }
  // svg2pdf reads the drawing from the document: an off-screen holder outside the page's content
  const host = document.createElement('div');
  host.className = 'export-host';
  host.setAttribute('aria-hidden', 'true');
  host.innerHTML = svg;
  document.body.append(host);
  // svg2pdf measures text on throwaway canvases it never releases; note each one made while it
  // converts, and release them to 0 × 0 when it is done (R14: no canvas left holding pixels)
  const made = [];
  const create = document.createElement;
  document.createElement = function (tag, ...rest) {
    const e = create.call(this, tag, ...rest);
    if (String(tag).toLowerCase() === 'canvas') made.push(e);
    return e;
  };
  try {
    await doc.svg(host.querySelector('svg'), { x: 0, y: 0, width: 792, height: 612 });
  } finally {
    document.createElement = create;
    for (const c of made) {
      c.width = 0;
      c.height = 0;
    }
    host.remove();
  }
  doc.setProperties({ title: `STILL HERE certificate ${identifier}`, creator: 'STILL HERE' });
  return doc.output('blob');
}

export async function exportCertificate(kind, { svg, name, identifier }) {
  const faces = await fonts();
  const blob = kind === 'pdf' ? await pdf(svg, faces, identifier) : await png(svg, faces);
  save(blob, filename(name, identifier, kind));
}
