// The parts of a certificate's screen that the home page's result and the certificate link's page
// (`/c/#…`) share: the dates as the result states them, the drawn certificate placed in the page,
// and the buttons beneath it: Download PDF, Download PNG (E4) and Copy certificate link (E5).
//
// Copy certificate link (PRD R20): writes exactly the link to the clipboard and says so in the
// confirmation sentence. Where the browser refuses the clipboard (permission denied, no clipboard
// on an insecure page), the clipboard-refused sentence appears with the link beneath it in a
// read-only field, focused and wholly selected, so a person can copy it by hand. Pressing again
// replaces the sentence rather than adding another. (Jules, 2026-10-04)

export const ACTIONS = ['Download PDF', 'Download PNG', 'Copy certificate link', 'Check another'];
export const PREPARING = { pdf: 'Preparing PDF…', png: 'Preparing PNG…' };
const EXPORT_FAILED = 'The file could not be prepared. Your certificate is still here: try again, or copy its link.';
export const COPIED = 'Certificate link copied.';
export const CLIPBOARD_REFUSED = 'Copy this link to keep the certificate:';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

function dateParts(time, zone) {
  const f = new Intl.DateTimeFormat('en-GB', { timeZone: zone, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
  const p = Object.fromEntries(f.formatToParts(time).map((x) => [x.type, x.value]));
  return { day: Number(p.day), month: MONTHS[Number(p.month) - 1], year: p.year, time: `${p.hour}:${p.minute}:${p.second}` };
}

/** "3 October 2026, 05:52:00": day, month name, year; 24-hour, zero-padded; English always. */
export function resultDate(time, zone) {
  const p = dateParts(time, zone);
  return `${p.day} ${p.month} ${p.year}, ${p.time}`;
}

/** "Issued by STILL HERE for '<name>' on 3 October 2026 at 05:52:00 (<zone>)." */
export function confirmation(name, time, zone) {
  const p = dateParts(time, zone);
  return `Issued by STILL HERE for '${name}' on ${p.day} ${p.month} ${p.year} at ${p.time} (${zone}).`;
}

/** The drawn SVG markup, as a node of this document. */
export function certificateNode(svgText) {
  const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
  return document.importNode(doc.documentElement, true);
}

/**
 * The faces the certificate is drawn in, loaded before it is drawn: a name with characters outside
 * the face is drawn by the browser on a canvas, and it must be drawn in the same face wherever the
 * certificate is drawn (on the result and again from its link) to come out the same.
 */
export function certificateFaces(name = '') {
  if (!document.fonts) return Promise.resolve();
  const sample = name || 'STILL HERE';
  return Promise.all([500, 600].map((w) => document.fonts.load(`${w} 1em "Cormorant Garamond"`, sample))).then(
    () => undefined,
    () => undefined,
  );
}

/**
 * Download PDF or Download PNG (E4): while the file is prepared the button reads "Preparing PDF…"
 * or "Preparing PNG…" and is aria-disabled, and a second tap does nothing. A failure restores the
 * button and puts the export-failure sentence beneath the buttons; nothing else changes. `file`
 * is the drawn certificate, or a function that draws it when the button is pressed (the portfolio).
 */
export function exporter(kind, label, busyLabel, file, actions) {
  const b = el('button', 'button-secondary', label);
  b.type = 'button';
  let busy = false;
  b.addEventListener('click', async () => {
    if (busy) return;
    busy = true;
    // the offline copy waits while a file is being made (offline.js)
    document.documentElement.setAttribute('data-exporting', '');
    b.textContent = busyLabel;
    b.setAttribute('aria-disabled', 'true');
    actions.parentElement?.querySelector('.export-note')?.remove();
    try {
      const { exportCertificate } = await import('./export.js');
      await exportCertificate(kind, typeof file === 'function' ? await file() : file);
    } catch {
      if (actions.isConnected) actions.after(el('p', 'export-note body-sm', EXPORT_FAILED));
    } finally {
      busy = false;
      document.documentElement.removeAttribute('data-exporting');
      b.textContent = label;
      b.removeAttribute('aria-disabled');
    }
  });
  return b;
}

/** Copy certificate link: the clipboard, or the link selected in a read-only field. */
function copier(link, actions) {
  const b = el('button', 'button-secondary', ACTIONS[2]);
  b.type = 'button';
  b.addEventListener('click', async () => {
    const host = actions.parentElement;
    host?.querySelector('.copy-note')?.remove();
    const note = el('div', 'copy-note');
    note.setAttribute('role', 'status');
    let copied = false;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('no clipboard');
      await navigator.clipboard.writeText(link);
      copied = true;
    } catch {
      copied = false;
    }
    if (!actions.isConnected) return;
    if (copied) {
      note.append(el('p', 'body-sm', COPIED));
      actions.after(note);
      return;
    }
    const field = el('input', 'copy-field');
    field.type = 'text';
    field.readOnly = true;
    field.value = link;
    field.setAttribute('aria-label', 'Certificate link');
    field.spellcheck = false;
    note.append(el('p', 'body-sm', CLIPBOARD_REFUSED), field);
    actions.after(note);
    field.focus();
    field.setSelectionRange(0, link.length);
  });
  return b;
}

/**
 * The four actions beneath a certificate. `another` is the Check another control (a button on the
 * home page, which returns to the empty form; a link to / on a certificate's own page).
 */
export function certificateActions({ svg, name, identifier, link }, another) {
  const actions = el('div', 'result-actions');
  const file = { svg, name, identifier };
  actions.append(
    exporter('pdf', ACTIONS[0], PREPARING.pdf, file, actions),
    exporter('png', ACTIONS[1], PREPARING.png, file, actions),
    copier(link, actions),
    another,
  );
  return actions;
}

export const NOT_LOCATED = 'We could not locate this certificate. The object, however, is still here.';
export const FUTURE = 'This certificate has not been issued yet. The object, however, is still here.';
// A valid link this device could not draw (its drawing code or faces did not load). Wording
// approved at C2 (decision 7b). (Jules, 2026-10-05)
export const NOT_DRAWN = 'This certificate could not be drawn on this device. Its link is still valid.';
const FAILURE_LINKS = [
  ['Verify a certificate', '/verify'],
  ['Check an object', '/'],
];

/**
 * A not-located or future result, on `/c/` or Verify: the sentence in title type and two text
 * links, Verify a certificate and Check an object. No certificate is drawn.
 */
export function failure(sentence) {
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
