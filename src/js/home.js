// Home: the ritual (PRD R1–R7, E2). Name an object, press Check presence (or Enter), watch the
// three lines arrive under the mark that never moves, and receive the result in place of the form.
//
// Input rules (D5): at most 80 code points after NFC, counted by code point (so a chair emoji is one);
// empty or whitespace-only keeps the button aria-disabled and a press shows the empty-input
// sentence. Names are only ever set as text (textContent, and escaped inside the certificate SVG).
//
// The sequence (Q5): one press only; line 1 with the press, line 2 1,120 ms after line 1 was painted, and
// line 3 2,150 ms after line 2 was painted (comparing here with here is held longest), each counted
// from the paint so a busy device never shortens a line's time on screen; the result at 4,400 ms
// after the press, or 1,000 ms after the last line was painted if that is later, the same for
// every object. The identifier is made from the second of the press while the lines run, and
// the result is put together 200 ms after the last line, so that work never holds up a line;
// nothing is shown or saved until the result appears, and leaving the
// page before then (reload, Back, a link) cancels it. Before 2026 the clock cannot be expressed in
// an identifier: the sequence runs the same and ends with the pre-2026 sentence, and no identifier is
// made, nothing drawn and nothing saved.
//
// The certificate's drawing code is fetched when a check starts (it is needed 4.4 s later), which
// keeps the home page's first load small. The certificate's faces are loaded with the page (and preloaded in its head), so the certificate
// is never drawn in a fallback face and its PNG never waits on a font (PRD R14). (Jules, 2026-10-04)
import { makeIdentifier } from './identifier.js';
import { certificateLink } from './link.js';

const MAX = 80;
const COUNT_FROM = 61;
const LINES = ['Establishing here.', 'Comparing here with here.', 'No actionable elsewhere detected.'];
const LINE_GAPS = [1120, 2150];
const LAST_LINE_HOLD = 1000;
const BUILD_AFTER_LAST = 200;
const RESULT_AT = 4400;
const EPOCH = Date.UTC(2026, 0, 1);
const PORTFOLIO_KEY = 'stillhere.portfolio.v1';
const EMPTY = 'Name an object to check its presence.';
const BEFORE_2026 = "Your device's clock reads earlier than 1 January 2026, a moment our records cannot express. The object, however, is still here.";
const ACTIONS = ['Download PDF', 'Download PNG', 'Copy certificate link', 'Check another'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

if (document.fonts) {
  for (const weight of [500, 600]) document.fonts.load(`${weight} 1em "Cormorant Garamond"`).catch(() => undefined);
}

const form = document.querySelector('form.check');
const input = form?.querySelector('input');
const button = form?.querySelector('button[type="submit"]');
const note = document.getElementById('object-note');
const count = document.getElementById('object-count');
const ask = document.querySelector('.ask');
const sequence = document.querySelector('.sequence');
const lines = document.querySelector('.sequence-lines');
const outcome = document.querySelector('.outcome');
const chips = [...document.querySelectorAll('.chip')];

const codePoints = (s) => [...s].length;
const blank = () => input.value.trim() === '';

// ── Input rules ─────────────────────────────────────────────────────────────────────────────────
function enforceLength() {
  const nfc = input.value.normalize('NFC');
  if (codePoints(nfc) <= MAX) return;
  const caret = input.selectionEnd ?? input.value.length;
  input.value = [...nfc].slice(0, MAX).join('');
  const at = Math.min(caret, input.value.length);
  input.setSelectionRange(at, at);
}

function reflect() {
  button.setAttribute('aria-disabled', String(blank()));
  if (!blank()) note.textContent = '';
  const n = codePoints(input.value.normalize('NFC'));
  count.hidden = n < COUNT_FROM;
  count.textContent = n < COUNT_FROM ? '' : `${n} / ${MAX}`;
}

// ── State ───────────────────────────────────────────────────────────────────────────────────────
let running = false;
let timers = [];

function setInert(on) {
  running = on;
  input.readOnly = on;
  input.setAttribute('aria-disabled', String(on));
  button.setAttribute('aria-disabled', String(on || blank()));
  for (const c of chips) c.setAttribute('aria-disabled', String(on));
  ask.classList.toggle('is-running', on);
}

function cancel() {
  for (const t of timers) clearTimeout(t);
  timers = [];
}

/** Back to the empty form: after Check another, and whenever the page is left or restored. */
function reset({ focus = false } = {}) {
  cancel();
  setInert(false);
  lines.replaceChildren();
  sequence.hidden = true;
  outcome.replaceChildren();
  outcome.hidden = true;
  ask.hidden = false;
  input.value = '';
  note.textContent = '';
  reflect();
  if (focus) input.focus();
}

// ── The result ──────────────────────────────────────────────────────────────────────────────────
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

function resultDate(time, zone) {
  const f = new Intl.DateTimeFormat('en-GB', { timeZone: zone, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
  const p = Object.fromEntries(f.formatToParts(time).map((x) => [x.type, x.value]));
  return `${Number(p.day)} ${MONTHS[Number(p.month) - 1]} ${p.year}, ${p.hour}:${p.minute}:${p.second}`;
}

function certificateNode(svgText) {
  const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
  return document.importNode(doc.documentElement, true);
}

function checkAnother() {
  const b = el('button', 'button-secondary', 'Check another');
  b.type = 'button';
  b.addEventListener('click', () => reset({ focus: true }));
  return b;
}

function buildResult({ name, time, zone, identifier }, drawCertificate) {
  const section = el('section', 'result');
  section.setAttribute('aria-labelledby', 'result-heading');
  const h = el('h2', 'result-heading', 'STILL HERE.');
  h.id = 'result-heading';
  h.tabIndex = -1;
  const cert = el('div', 'result-certificate');
  cert.append(certificateNode(drawCertificate({ name, time, zone, identifier, link: certificateLink(location.origin, identifier, name, zone) })));
  const actions = el('div', 'result-actions');
  for (const a of ACTIONS.slice(0, 3)) {
    const b = el('button', 'button-secondary', a);
    b.type = 'button';
    actions.append(b);
  }
  actions.append(checkAnother());
  const kept = el('p', 'result-portfolio body-sm', 'Kept in Your Presence ');
  const link = el('a', '', 'Portfolio on this device');
  link.href = '/portfolio';
  kept.append(link, '.');
  section.append(
    h,
    el('p', 'result-name', name),
    el('p', 'result-time', resultDate(time, zone)),
    el('p', 'result-zone', `Jurisdiction of here: ${zone}`),
    el('p', 'result-identifier', identifier),
    cert,
    actions,
    kept,
  );
  return { section, heading: h };
}

function buildBefore2026() {
  const section = el('section', 'result result-before');
  const p = el('p', 'result-sentence title', BEFORE_2026);
  p.tabIndex = -1;
  const actions = el('div', 'result-actions');
  actions.append(checkAnother());
  section.append(p, actions);
  return { section, heading: p };
}

/** Save to Your Presence Portfolio: name, time, zone and identifier only, newest first. */
function save(entry) {
  let list = [];
  try {
    const v = JSON.parse(localStorage.getItem(PORTFOLIO_KEY) ?? '[]');
    if (Array.isArray(v)) list = v;
  } catch {
    list = [];
  }
  list.unshift(entry);
  try {
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(list));
  } catch {
    /* storage refused (private mode, full): the certificate is still shown */
  }
}

// ── The sequence ────────────────────────────────────────────────────────────────────────────────
function start() {
  if (running) return;
  if (blank()) {
    note.textContent = EMPTY;
    return;
  }
  const pressed = Date.now();
  const name = input.value;
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const time = new Date(Math.floor(pressed / 1000) * 1000);
  const before = pressed < EPOCH;
  setInert(true);
  note.textContent = '';
  lines.replaceChildren();
  sequence.hidden = false;

  // the identifier and the drawing code are fetched now; the result is put together after the
  // last line and shown and saved only when it appears
  const ingredients = before ? null : Promise.all([makeIdentifier(name, time), import('./certificate/draw.js')]);
  ingredients?.catch(() => undefined);
  let preparing = null;
  const prepare = () =>
    (preparing ??= (async () => {
      if (before) return buildBefore2026();
      const [identifier, { drawCertificate }] = await ingredients;
      const entry = { name, time: time.toISOString(), zone, identifier };
      return { ...buildResult({ name, time, zone, identifier }, drawCertificate), entry };
    })());

  const pressedAt = performance.now();
  const reveal = async () => {
    timers = [];
    const r = await prepare().catch(() => null);
    if (!r || !running) return;
    ask.hidden = true;
    sequence.hidden = true;
    outcome.replaceChildren(r.section);
    outcome.hidden = false;
    running = false;
    if (r.entry) save(r.entry);
    r.heading.focus();
  };
  const show = (i) => {
    if (!running) return;
    lines.append(el('li', '', LINES[i]));
    // painted: two frames after the line is in the document
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (!running) return;
        const shown = performance.now();
        if (i + 1 < LINES.length) {
          timers.push(setTimeout(() => show(i + 1), LINE_GAPS[i]));
          return;
        }
        timers.push(setTimeout(() => prepare().catch(() => undefined), BUILD_AFTER_LAST));
        const at = Math.max(pressedAt + RESULT_AT, shown + LAST_LINE_HOLD);
        timers.push(setTimeout(reveal, at - performance.now()));
      }),
    );
  };
  show(0);
}

if (form && input && button) {
  input.removeAttribute('maxlength');
  input.addEventListener('input', (e) => {
    if (!e.isComposing) enforceLength();
    reflect();
  });
  input.addEventListener('compositionend', () => {
    enforceLength();
    reflect();
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    start();
  });
  for (const chip of chips) {
    chip.addEventListener('click', () => {
      if (running) return;
      input.value = chip.textContent.trim();
      reflect();
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    });
  }
  // leaving mid-sequence issues nothing; a page restored from the back-forward cache starts empty
  window.addEventListener('pagehide', () => {
    if (running) reset();
  });
  window.addEventListener('pageshow', (e) => {
    if (e.persisted && outcome.hidden) reset();
  });
  reset();
}
