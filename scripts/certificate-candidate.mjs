#!/usr/bin/env node
// Render the specimen certificate for Clive's C2 review: "Folding chair", issued
// 2026-10-03T10:52:00Z in America/Chicago, identifier SH-00PP-9AGR-1GTB, to
//   garage/pack/exemplars/candidates/certificate.png   3,300 × 2,550 (300 dpi, US Letter landscape)
//   garage/pack/exemplars/candidates/certificate.pdf   US Letter landscape, vector, faces embedded
// The drawing is src/js/certificate/draw.js, run in Chromium exactly as the site will run it. The
// PNG follows PRD R14's route (the faces inlined in a <style> on a serialized copy, drawn to a
// canvas at 300 dpi); the PDF is jsPDF 4.2.1 + svg2pdf.js 2.8.1 with the TrueType faces registered
// before conversion. Run by hand: `node scripts/certificate-candidate.mjs`. (Jules, 2026-10-04)
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'garage/pack/exemplars/candidates');

export const SPECIMEN = {
  name: 'Folding chair',
  time: '2026-10-03T10:52:00Z',
  zone: 'America/Chicago',
  identifier: 'SH-00PP-9AGR-1GTB',
  link: 'https://isitstillhere.com/c/#SH-00PP-9AGR-1GTB.Rm9sZGluZyBjaGFpcg.America/Chicago',
};

// the certificate's faces: family, weight, the WOFF2 for the PNG, the TTF for the PDF
const FACES = [
  { family: 'Cormorant Garamond', weight: 500, file: 'CormorantGaramond-Medium' },
  { family: 'Cormorant Garamond', weight: 600, file: 'CormorantGaramond-SemiBold' },
  { family: 'Inter Tight', weight: 700, file: 'InterTight-Bold' },
  { family: 'JetBrains Mono', weight: 500, file: 'JetBrainsMono-Medium' },
];

const ORIGIN = 'https://candidate.invalid';
const TYPES = { js: 'text/javascript', css: 'text/css', woff2: 'font/woff2', ttf: 'font/ttf', svg: 'image/svg+xml', json: 'application/json' };

export async function renderCandidate({ out = OUT, cert = SPECIMEN } = {}) {
  const fonts = FACES.map((f) => ({
    ...f,
    woff2: readFileSync(join(ROOT, 'src/fonts', `${f.file}.woff2`)).toString('base64'),
    ttf: readFileSync(join(ROOT, 'src/fonts', `${f.file}.ttf`)).toString('base64'),
  }));
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.route(`${ORIGIN}/**`, (route) => {
    const path = decodeURIComponent(new URL(route.request().url()).pathname);
    if (path === '/') return route.fulfill({ contentType: 'text/html', body: '<!doctype html><meta charset="utf-8"><title>certificate</title><body></body>' });
    const vendor = { '/__vendor/jspdf.js': 'node_modules/jspdf/dist/jspdf.umd.min.js', '/__vendor/svg2pdf.js': 'node_modules/svg2pdf.js/dist/svg2pdf.umd.min.js' }[path];
    const file = vendor ? join(ROOT, vendor) : join(ROOT, 'src', path);
    if (path.includes('..') || !existsSync(file) || !statSync(file).isFile()) return route.fulfill({ status: 404, body: 'not found' });
    return route.fulfill({ contentType: TYPES[file.split('.').pop()] ?? 'application/octet-stream', body: readFileSync(file) });
  });
  await page.goto(`${ORIGIN}/`);
  await page.addScriptTag({ url: `${ORIGIN}/__vendor/jspdf.js` });
  await page.addScriptTag({ url: `${ORIGIN}/__vendor/svg2pdf.js` });

  const result = await page.evaluate(
    async ({ cert, fonts, origin }) => {
      const { drawCertificate } = await import(`${origin}/js/certificate/draw.js`);
      const svg = await drawCertificate({ ...cert, time: new Date(cert.time) });

      // PNG: a serialized copy with the faces inlined, at 300 dpi
      const css = fonts
        .map((f) => `@font-face{font-family:"${f.family}";font-weight:${f.weight};font-style:normal;src:url(data:font/woff2;base64,${f.woff2}) format("woff2");}`)
        .join('');
      for (const f of fonts) {
        const face = new FontFace(f.family, `url(data:font/woff2;base64,${f.woff2})`, { weight: String(f.weight) });
        document.fonts.add(await face.load());
      }
      const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
      const root = doc.documentElement;
      const style = doc.createElementNS('http://www.w3.org/2000/svg', 'style');
      style.textContent = css;
      root.insertBefore(style, root.firstChild);
      root.setAttribute('width', '3300');
      root.setAttribute('height', '2550');
      const img = new Image();
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(new XMLSerializer().serializeToString(doc))));
      await img.decode();
      await new Promise((r) => setTimeout(r, 500));
      const canvas = document.createElement('canvas');
      canvas.width = 3300;
      canvas.height = 2550;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const blob = await new Promise((r) => canvas.toBlob(r, 'image/png'));
      const b64 = (bytes) => {
        let bin = '';
        for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
        return btoa(bin);
      };
      const png = b64(new Uint8Array(await blob.arrayBuffer()));
      canvas.width = 0;
      canvas.height = 0;

      // PDF: jsPDF + svg2pdf.js, TrueType faces registered before conversion
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'letter', compress: true });
      for (const f of fonts) {
        const name = `${f.file}.ttf`;
        pdf.addFileToVFS(name, atob(f.ttf));
        pdf.addFont(name, f.family, 'normal', f.weight);
      }
      const host = document.createElement('div');
      host.innerHTML = svg;
      document.body.appendChild(host);
      await pdf.svg(host.querySelector('svg'), { x: 0, y: 0, width: 792, height: 612 });
      pdf.setProperties({ title: `STILL HERE certificate ${cert.identifier}`, creator: 'STILL HERE' });
      return { png, pdf: b64(new Uint8Array(pdf.output('arraybuffer'))), svg };
    },
    { cert, fonts, origin: ORIGIN },
  );
  await browser.close();
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, 'certificate.png'), Buffer.from(result.png, 'base64'));
  writeFileSync(join(out, 'certificate.pdf'), Buffer.from(result.pdf, 'base64'));
  return { png: join(out, 'certificate.png'), pdf: join(out, 'certificate.pdf'), svg: result.svg };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const r = await renderCandidate();
  console.log(`certificate candidate: wrote ${r.png.slice(ROOT.length + 1)}, ${r.pdf.slice(ROOT.length + 1)}`);
}
