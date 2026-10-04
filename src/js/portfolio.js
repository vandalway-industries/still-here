// Your Presence Portfolio (PRD R23, E7): every certificate issued on this device, newest first,
// read from localStorage only, under `stillhere.portfolio.v1`. The home page writes it when a
// result appears (home.js): a list, newest first, of { name, time (ISO), zone, identifier }. No
// file is stored; each entry's certificate is drawn again from those four when it is wanted.
//
// Each entry shows the name, "3 October 2026, 05:52 · America/Chicago" and the identifier, with
// Open (its certificate link, /c/#…), Download PDF and Download PNG. An empty, cleared or
// unreadable store shows the empty-portfolio sentence; a corrupt value is never thrown on, and an
// entry that does not hold together is left out. There is no delete and no clear control
// (clearing the browser's data for the site clears it), and storage is never asked to persist.
// (Jules, 2026-10-04)
import { certificateLink } from './link.js';
import { certificateFaces, el, exporter, PREPARING } from './result.js';

const KEY = 'stillhere.portfolio.v1';
const EMPTY = 'Nothing has been certified on this device yet. Everything you certify here stays here.';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** The stored entries that hold together, in stored order (newest first). */
function entries() {
  let list;
  try {
    list = JSON.parse(localStorage.getItem(KEY) ?? '[]');
  } catch {
    return [];
  }
  if (!Array.isArray(list)) return [];
  return list.filter((e) => {
    if (!e || typeof e !== 'object') return false;
    const { name, time, zone, identifier } = e;
    if (typeof name !== 'string' || typeof zone !== 'string' || typeof identifier !== 'string' || typeof time !== 'string') return false;
    if (Number.isNaN(Date.parse(time))) return false;
    try {
      new Intl.DateTimeFormat('en-GB', { timeZone: zone });
    } catch {
      return false;
    }
    return true;
  });
}

/** "3 October 2026, 05:52 · America/Chicago". */
function portfolioDate(time, zone) {
  const f = new Intl.DateTimeFormat('en-GB', { timeZone: zone, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  const p = Object.fromEntries(f.formatToParts(time).map((x) => [x.type, x.value]));
  return `${Number(p.day)} ${MONTHS[Number(p.month) - 1]} ${p.year}, ${p.hour}:${p.minute} · ${zone}`;
}

function item({ name, time, zone, identifier }) {
  const when = new Date(time);
  const link = certificateLink(location.origin, identifier, name, zone);
  const li = el('li', 'portfolio-entry');
  const actions = el('div', 'result-actions portfolio-actions');
  // the certificate is drawn when a file is asked for, exactly as it was issued
  const file = async () => {
    const [{ drawCertificate }] = await Promise.all([import('./certificate/draw.js'), certificateFaces(name)]);
    return { svg: drawCertificate({ name, time: when, zone, identifier, link }), name, identifier };
  };
  const open = el('a', 'button-secondary', 'Open');
  open.href = link.slice(location.origin.length);
  actions.append(open, exporter('pdf', 'Download PDF', PREPARING.pdf, file, actions), exporter('png', 'Download PNG', PREPARING.png, file, actions));
  li.append(el('p', 'portfolio-name', name), el('p', 'portfolio-date body-sm', portfolioDate(when, zone)), el('p', 'portfolio-identifier', identifier), actions);
  return li;
}

const host = document.querySelector('.portfolio');
if (host) {
  const list = entries();
  if (list.length === 0) {
    host.replaceChildren(el('p', 'portfolio-empty', EMPTY));
  } else {
    const ol = el('ol', 'portfolio-list');
    ol.append(...list.map(item));
    host.replaceChildren(ol);
  }
}
