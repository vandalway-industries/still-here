// The phone menu: the Menu button opens the full-screen list; the button or Escape closes it and
// returns focus to the button. The button reads "Menu" or "Close menu", so its name always says
// what it controls. At 1024 px and wider the list is always shown. (Jules, 2026-10-04)
const button = document.querySelector('.menu-button');
const menu = document.getElementById('site-menu');
if (button && menu) {
  const set = (open) => {
    menu.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
    button.textContent = open ? 'Close menu' : 'Menu';
  };
  button.addEventListener('click', () => set(!menu.classList.contains('is-open')));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      set(false);
      button.focus();
    }
  });
}
