// Home: the ritual (PRD R1–R7, E2). Name an object, press Check presence (or Enter), watch the
// three lines arrive under the mark that never moves, and receive the result in place of the form.
//
// Input rules (D5): at most 80 code points after NFC, counted by code point (so a chair emoji is one);
// empty or whitespace-only keeps the button aria-disabled and a press shows the empty-input
// sentence. Names are only ever set as text (textContent, and escaped inside the certificate SVG).
//
// The sequence (Q5): one press only. Every step is set from the press itself, not from the step
// before it, so the pacing is the same for every object and the same whether or not the lines fade
// in (reduced motion only drops the fade): line 1 with the press, line 2 at 1,200 ms, line 3 at
// 3,200 ms and the result at 4,600 ms, so "Comparing here with here." is held longest (2 s) and
// the last line has 400 ms to spare before the result. A line is never cut short: if a busy device
// paints a line late, the next step waits until that line has been on screen for 1,000 ms. The identifier is
// made from the second of the press while the lines run, and the result is put together 200 ms
// after the last line, so that work never holds up a line; nothing is shown or saved until the
// result appears, and leaving the page before then (reload, Back, a link) cancels it. Before 2026
// the clock cannot be expressed in an identifier: the sequence runs the same and ends with the
// pre-2026 sentence, and no identifier is made, nothing drawn and nothing saved.
//
// The certificate's drawing code is fetched when a check starts (it is needed 4.6 s later), which
// keeps the home page's first load small. The certificate's faces are loaded with the page (and preloaded in its head), so the certificate
// is never drawn in a fallback face and its PNG never waits on a font (PRD R14); the drawing also
// waits for them, so the certificate drawn again from its link (/c/) comes out byte for byte the
// same. The result's actions, Copy certificate link among them, are in result.js. (Jules, 2026-10-04)
import { makeIdentifier } from './identifier.js';
import { certificateLink } from './link.js';
import { certificateActions, certificateFaces, certificateNode, el, resultDate } from './result.js';

const MAX = 80;
const COUNT_FROM = 61;
const LINES = ['Establishing here.', 'Comparing here with here.', 'No actionable elsewhere detected.'];
// when each step is due, in ms after the press: the three lines, then the result
const LINE_AT = [0, 1200, 3200];
const RESULT_AT = 4600;
// the least time a line stays on screen before the next step, whatever the device's load
const HOLD = 1000;
const BUILD_AFTER_LAST = 200;
const EPOCH = Date.UTC(2026, 0, 1);
const PORTFOLIO_KEY = 'stillhere.portfolio.v1';
const EMPTY = 'Name an object to check its presence.';
const BEFORE_2026 = "Your device's clock reads earlier than 1 January 2026, a moment our records cannot express. The object, however, is still here.";
// Two sentences approved at C2 (decision 7a and 7c):
// the check could not finish (the certificate's drawing code or faces did not load), and this
// device refused to keep a copy in the portfolio. (Jules, 2026-10-05)
const NOT_COMPLETED = 'This check could not be completed. Nothing was issued and nothing was kept. Please try again.';
const NOT_KEPT = 'This device did not let us keep a copy. The certificate is still yours: download it or copy its link.';

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
  const link = certificateLink(location.origin, identifier, name, zone);
  const svg = drawCertificate({ name, time, zone, identifier, link });
  cert.append(certificateNode(svg));
  const actions = certificateActions({ svg, name, identifier, link }, checkAnother());
  const kept = el('p', 'result-portfolio body-sm', 'Kept in Your Presence ');
  const portfolio = el('a', '', 'Portfolio on this device');
  portfolio.href = '/portfolio';
  kept.append(portfolio, '.');
  // shown in place of the line above when this device refuses to keep the copy
  const notKept = el('p', 'result-portfolio body-sm', NOT_KEPT);
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
  return { section, heading: h, kept, notKept };
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

/**
 * Save to Your Presence Portfolio: name, time, zone and identifier only, newest first. Returns
 * false when this device refuses storage (turned off, private mode, full): the certificate is still
 * shown, and the result says it was not kept.
 */
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
    return true;
  } catch {
    return false;
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
  const ingredients = before ? null : Promise.all([makeIdentifier(name, time), import('./certificate/draw.js'), certificateFaces(name)]);
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
    if (!running) return;
    if (!r) {
      // the certificate could not be put together: nothing is shown as issued and nothing is
      // kept; the box comes back, empty and focused, with the sentence beneath it
      reset({ focus: true });
      note.textContent = NOT_COMPLETED;
      return;
    }
    if (r.entry && !save(r.entry)) r.kept.replaceWith(r.notKept);
    ask.hidden = true;
    sequence.hidden = true;
    outcome.replaceChildren(r.section);
    outcome.hidden = false;
    // the hidden form leaves its running state too, so the page holds no stray read-only field
    setInert(false);
    r.heading.focus();
  };
  // the step after line i is due at its time from the press, and never before line i has been
  // on screen for HOLD ms
  const after = (i, shown) => {
    const due = pressedAt + (i + 1 < LINES.length ? LINE_AT[i + 1] : RESULT_AT);
    return Math.max(due, shown + HOLD) - performance.now();
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
          timers.push(setTimeout(() => show(i + 1), after(i, shown)));
          return;
        }
        timers.push(setTimeout(() => prepare().catch(() => undefined), BUILD_AFTER_LAST));
        timers.push(setTimeout(reveal, after(i, shown)));
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
