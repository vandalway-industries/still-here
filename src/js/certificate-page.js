// The certificate's own page, `/c/#<identifier>.<name, base64url>.<zone>` (PRD R20–R21, D2).
// Reopening is verifying: the link is judged in the same order as Verify (judge.js), and only a
// link that holds together is drawn again, exactly as it was issued: the same name as typed, the
// second the identifier records, the issuer's zone and the same link in its QR code. Above it,
// "Issued by STILL HERE for '<name>' on <date> at <time> (<zone>)." in the link's zone, whatever
// the viewer's; beneath it Download PDF, Download PNG, Copy certificate link and Check another.
// A malformed or altered link, or a name over 80 code points, gets the not-located sentence; one
// dated more than five minutes past this device's clock gets the not-yet-issued sentence. Neither
// draws a certificate. Nothing is saved: opening a link adds nothing to Your Presence Portfolio.
// Everything read here comes from after the #, which the browser never sends. Editing the fragment
// in the address bar judges the new one. With no fragment the page is the Verify form, exactly as
// on /verify. (Jules, 2026-10-04)
import { judge } from './judge.js';
import { certificateLink, readFragment } from './link.js';
import { certificateActions, certificateFaces, certificateNode, confirmation, el, failure, FUTURE, NOT_LOCATED, resultDate } from './result.js';
import { mountVerify } from './verify.js';

const view = document.querySelector('.certificate-view');
const form = document.querySelector('form.verify');
const outcome = document.querySelector('.verify-outcome');
const heading = document.querySelector('main h1');
const HEADINGS = { link: 'Certificate', form: 'Verify a certificate' };

async function judgeLink(fragment) {
  const read = readFragment(fragment);
  if (!read) return { kind: 'not-located' };
  const verdict = await judge(read.identifier, read.name);
  return verdict.kind === 'issued' ? { ...verdict, name: read.name, zone: read.zone } : verdict;
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
  section.append(
    sentence,
    el('p', 'result-name', name),
    el('p', 'result-time', resultDate(time, zone)),
    el('p', 'result-zone', `Jurisdiction of here: ${zone}`),
    el('p', 'result-identifier', identifier),
    cert,
    certificateActions({ svg, name, identifier, link }, another),
  );
  return section;
}

function showForm(on) {
  form.hidden = !on;
  outcome.hidden = !on;
  view.hidden = on;
  heading.textContent = on ? HEADINGS.form : HEADINGS.link;
}

let shown = 0;
async function render() {
  const turn = ++shown;
  const fragment = location.hash.replace(/^#/, '');
  if (!fragment) {
    view.replaceChildren();
    showForm(true);
    return;
  }
  const verdict = await judgeLink(fragment);
  const section =
    verdict.kind === 'issued' ? await issued(verdict).catch(() => failure(NOT_LOCATED)) : failure(verdict.kind === 'future' ? FUTURE : NOT_LOCATED);
  if (turn !== shown) return;
  view.replaceChildren(section);
  showForm(false);
}

if (view && form && outcome && heading) {
  mountVerify(form);
  window.addEventListener('hashchange', render);
  render();
}
