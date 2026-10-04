// Verify (PRD R22; E6): the form on `/verify`, and on `/c/` when the page has no link to open.
// Two fields, Certificate identifier and Object name, and the Verify button. With either field
// empty the button is aria-disabled, and pressing it (or Enter) asks for both with the
// empty-verify sentence. Enter in either field submits. A match states the issue in UTC:
// "Issued by STILL HERE for '<name>' on <date> at <time> (UTC)."; a mismatch or a future date is
// the sentence and two links, and draws no certificate (judge.js holds the order). The form stays
// on the page under its result, so the next check can be typed straight in. (Jules, 2026-10-04)
import { judge } from './judge.js';
import { confirmation, el, failure, FUTURE, NOT_LOCATED } from './result.js';

const EMPTY = "Enter the certificate identifier and the object's name.";

/** Wire a `form.verify` and the outcome region after it. */
export function mountVerify(form) {
  const id = form.querySelector('#verify-identifier');
  const name = form.querySelector('#verify-name');
  const button = form.querySelector('button[type="submit"]');
  const note = form.querySelector('.verify-note');
  const outcome = document.querySelector('.verify-outcome');
  if (!id || !name || !button || !note || !outcome) return;

  const blank = () => id.value.trim() === '' || name.value.trim() === '';
  const reflect = () => {
    button.setAttribute('aria-disabled', String(blank()));
    if (!blank()) note.textContent = '';
  };
  let turn = 0;
  const submit = async () => {
    const mine = ++turn;
    if (blank()) {
      outcome.replaceChildren();
      note.textContent = EMPTY;
      return;
    }
    note.textContent = '';
    const typed = name.value;
    const verdict = await judge(id.value, typed);
    if (mine !== turn) return;
    let section;
    if (verdict.kind === 'issued') {
      section = el('section', 'result result-verified');
      section.append(el('p', 'result-sentence title', confirmation(typed, verdict.time, 'UTC')));
    } else {
      section = failure(verdict.kind === 'future' ? FUTURE : NOT_LOCATED);
    }
    outcome.replaceChildren(section);
  };

  for (const f of [id, name]) f.addEventListener('input', reflect);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submit();
  });
  reflect();
}

const form = document.querySelector('form.verify');
if (form && !document.querySelector('.certificate-view')) mountVerify(form);
