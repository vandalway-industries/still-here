// The certificate's own page, `/c/#<identifier>.<name, base64url>.<zone>` (PRD R20–R21, D2).
// Reopening is verifying: the identifier must belong to the name (the same hash the home page made
// it with), and only then is the certificate drawn again, exactly as it was issued: the same name as
// typed, the second the identifier records, the issuer's zone and the same link in its QR code.
// It states "Issued by STILL HERE for '<name>' on <date> at <time> (<zone>)." in the link's zone,
// whatever the viewer's, and offers Download PDF, Download PNG, Copy certificate link and Check
// another. A link that does not hold together (malformed, altered, a name over 80 code points)
// gets the not-located sentence; one dated more than five minutes past this device's clock gets the
// not-yet-issued sentence. Neither draws a certificate. Nothing is saved: opening a link adds
// nothing to Your Presence Portfolio. Everything read here comes from after the #, which the
// browser never sends. Editing the fragment in the address bar judges the new one.
// Without a fragment the page keeps its own text (the Verify form arrives with E6).
// (Jules, 2026-10-04)
import { makeIdentifier, parseIdentifier } from './identifier.js';
import { certificateLink, readFragment } from './link.js';
import { certificateActions, certificateFaces, certificateNode, confirmation, el } from './result.js';

const MAX = 80;
const FUTURE_SLACK = 5 * 60 * 1000;
const NOT_LOCATED = 'We could not locate this certificate. The object, however, is still here.';
const FUTURE = 'This certificate has not been issued yet. The object, however, is still here.';
const FAILURE_LINKS = [
  ['Verify a certificate', '/verify'],
  ['Check an object', '/'],
];

const view = document.querySelector('.certificate-view');
const intro = document.querySelector('.certificate-intro');

const formatted = (p) => `SH-${p.body.slice(0, 4)}-${p.body.slice(4, 8)}-${p.body.slice(8, 11)}${p.check}`;

/** The judgment, in order: the link's form, the identifier, the name against it, then the clock. */
async function judge(fragment) {
  const read = readFragment(fragment);
  if (!read) return { kind: 'not-located' };
  const parsed = parseIdentifier(read.identifier);
  if (!parsed) return { kind: 'not-located' };
  const name = read.name;
  if (name.trim() === '' || [...name.normalize('NFC')].length > MAX) return { kind: 'not-located' };
  const identifier = formatted(parsed);
  let made;
  try {
    made = await makeIdentifier(name, parsed.time);
  } catch {
    return { kind: 'not-located' };
  }
  if (made !== identifier) return { kind: 'not-located' };
  if (parsed.time.getTime() > Date.now() + FUTURE_SLACK) return { kind: 'future' };
  return { kind: 'issued', name, time: parsed.time, zone: read.zone, identifier };
}

function failure(sentence) {
  const section = el('section', 'result result-failure');
  const p = el('p', 'result-sentence title', sentence);
  p.tabIndex = -1;
  const links = el('p', 'result-links');
  FAILURE_LINKS.forEach(([label, href], i) => {
    const a = el('a', '', label);
    a.href = href;
    if (i) links.append(' · ');
    links.append(a);
  });
  section.append(p, links);
  return section;
}

async function issued({ name, time, zone, identifier }) {
  const [{ drawCertificate }] = await Promise.all([import('./certificate/draw.js'), certificateFaces(name)]);
  const link = certificateLink(location.origin, identifier, name, zone);
  const svg = drawCertificate({ name, time, zone, identifier, link });
  const section = el('section', 'result result-reopened');
  const sentence = el('p', 'result-sentence title', confirmation(name, time, zone));
  sentence.tabIndex = -1;
  const cert = el('div', 'result-certificate');
  cert.append(certificateNode(svg));
  const another = el('a', 'button-secondary', 'Check another');
  another.href = '/';
  section.append(sentence, el('p', 'result-zone', `Jurisdiction of here: ${zone}`), cert, certificateActions({ svg, name, identifier, link }, another));
  return section;
}

let shown = 0;
async function render() {
  const turn = ++shown;
  const fragment = location.hash.replace(/^#/, '');
  if (!fragment) {
    view.replaceChildren();
    view.hidden = true;
    intro.hidden = false;
    return;
  }
  const verdict = await judge(fragment);
  const section =
    verdict.kind === 'issued' ? await issued(verdict).catch(() => failure(NOT_LOCATED)) : failure(verdict.kind === 'future' ? FUTURE : NOT_LOCATED);
  if (turn !== shown) return;
  intro.hidden = true;
  view.replaceChildren(section);
  view.hidden = false;
}

if (view && intro) {
  window.addEventListener('hashchange', render);
  render();
}
