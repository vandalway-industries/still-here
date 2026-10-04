// Home, before the ritual is built (E2): an example fills the input and leaves it editable, with
// the cursor at the end. The form does not leave the page. The certificate's faces are loaded with
// the page (and preloaded in its head), so the certificate is never drawn in a fallback face and
// its PNG never waits on a font (PRD R14). (Jules, 2026-10-04)
if (document.fonts) {
  for (const weight of [500, 600]) document.fonts.load(`${weight} 1em "Cormorant Garamond"`).catch(() => undefined);
}
const form = document.querySelector('form.check');
const input = form?.querySelector('input');
if (form && input) {
  form.addEventListener('submit', (e) => e.preventDefault());
  for (const chip of document.querySelectorAll('.chip')) {
    chip.addEventListener('click', () => {
      input.value = chip.textContent.trim();
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    });
  }
}
