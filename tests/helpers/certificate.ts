// The certificate drawing, exercised in Chromium (tests for DS4, E3 and X5).
// Contract with src/js/certificate/draw.js (PRD R8–R13, ACCEPTANCE DS4 and E3):
//   export function drawCertificate({ name, time, zone, identifier, link }) — or the default export
//   name: the name as typed; time: a Date (the issue second); zone: an IANA zone; identifier: the
//   printed identifier; link: the certificate link the QR code encodes.
//   Returns the SVG as markup or as an SVGSVGElement (sync or as a promise).
//   Blocks a test must find carry `data-field`: name, date, zone, utc, identifier, qr (the parts that
//   vary with the issue), and seal, border, signature (the drawn marks of DS4 item 5).
// Locked at specs-v1. (Diane, 2026-10-04)
import { readFileSync } from 'node:fs';
import { abs, files, python } from './repo.ts';

export type Cert = { name: string; time: string; zone: string; identifier: string; link: string };

/** The four families' web fonts in src/fonts/, with their name-table family and weight. */
export function webFonts(): { path: string; family: string; weight: number; italic: boolean }[] {
  const woff2 = files('src/fonts', /\.woff2$/i);
  if (!woff2.length) return [];
  return JSON.parse(
    python(
      'import sys, json\nfrom fontTools.ttLib import TTFont\nout=[]\n' +
        'for p in sys.argv[1:]:\n' +
        '  f = TTFont(p)\n' +
        '  n = f["name"]\n' +
        '  out.append({"path": p, "family": n.getDebugName(16) or n.getDebugName(1), "weight": f["OS/2"].usWeightClass, "italic": bool(f["OS/2"].fsSelection & 1)})\n' +
        'print(json.dumps(out))',
      woff2.map(abs),
    ),
  ).map((f: { path: string }) => ({ ...f, path: f.path.slice(abs('src').length) }));
}

/** @font-face rules with the fonts inlined, for SVG drawn as an image. */
export function inlineFontCss(): string {
  return webFonts()
    .map((f) => {
      const data = readFileSync(abs(`src${f.path}`)).toString('base64');
      return `@font-face{font-family:"${f.family}";font-weight:${f.weight};font-style:${f.italic ? 'italic' : 'normal'};src:url(data:font/woff2;base64,${data}) format("woff2");}`;
    })
    .join('\n');
}

/**
 * Source of an in-page async function (run with `new Function`) that imports draw.js from the
 * module origin, draws `cert`, and returns the SVG markup. Usage inside page.evaluate.
 */
export const DRAW_IN_PAGE = `
  const m = await import(origin + '/js/certificate/draw.js');
  const fn = m.drawCertificate || m.default;
  if (typeof fn !== 'function') throw new Error('draw.js exports no drawCertificate()');
  const out = await fn({ name: cert.name, time: new Date(cert.time), zone: cert.zone, identifier: cert.identifier, link: cert.link });
  return typeof out === 'string' ? out : new XMLSerializer().serializeToString(out);
`;

/** Draw a certificate with draw.js in the page (on the module origin of withModulePage). */
export async function draw(page: import('playwright').Page, origin: string, cert: Cert): Promise<string> {
  return page.evaluate(
    async ({ origin, cert, body }) => {
      // eslint-disable-next-line no-new-func
      const f = new Function('origin', 'cert', `return (async () => {${body}})();`);
      return f(origin, cert) as Promise<string>;
    },
    { origin, cert, body: DRAW_IN_PAGE },
  );
}

export const FOLDING_CHAIR: Cert = {
  name: 'Folding chair',
  time: '2026-10-03T10:52:00Z',
  zone: 'America/Chicago',
  identifier: 'SH-00PP-9AGR-1GTB',
  link: 'https://isitstillhere.com/c/#SH-00PP-9AGR-1GTB.Rm9sZGluZyBjaGFpcg.America/Chicago',
};
