// The played-as-a-person walks of garage/pack/WALKS.md, one exported function per step.
// Each bead's walk spec (e2e/specs/<id>-walk.spec.ts) calls the steps it owns (docs/bead-map.md
// § Walks). Written the way WALKS.md asks: things are found by role and visible text only
// (getByRole, getByText, getByLabel, getByAltText), typed with the keyboard and clicked where they
// are visible. No test ids, no direct focus calls, no clicks through page.evaluate; page.evaluate
// only reads what a person can see or know (the clock, the time zone, the clipboard they pasted).
// A step a browser cannot perform calls exactly the substitute WALKS.md § Substitute evidence names
// (e2e/helpers/substitutes.ts), and is reported "played (substitute)" in the step's title.
// Locked at specs-v1; tests/unit/<T0>-specs.test.ts scans this file. (Diane, 2026-10-04)
import { expect, test, type Browser, type BrowserContext, type Download, type Locator, type Page, type TestInfo } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { offlineSite } from './offline.ts';
import { checkInstallable, checkNullMx, clearSiteData, decodeQr, openDownload } from './substitutes.ts';
import * as R from './reference.ts';
import * as S from './strings.ts';

export type Walk = {
  page: Page;
  context: BrowserContext;
  browser: Browser;
  info: TestInfo;
  engine: string;
  phone: boolean;
  /** what the visitor carries from one step to the next */
  state: {
    zone?: string;
    name?: string;
    id?: string;
    link?: string;
    downloads: Record<string, Buffer>;
    /** origins the walk served the site from besides the configured one (W6.8's private server) */
    origins: string[];
  };
};

export function startWalk(page: Page, browser: Browser, info: TestInfo): Walk {
  const vp = page.viewportSize();
  return {
    page,
    context: page.context(),
    browser,
    info,
    engine: browser.browserType().name(),
    phone: !!vp && vp.width < 600,
    state: { downloads: {}, origins: [] },
  };
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const exactly = (s: string, flags = '') => new RegExp(`^\\s*${esc(s)}\\s*$`, flags);
const ID_RE = /^\s*SH-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z*~$=U]{4}\s*$/;

// ── How a person finds things ───────────────────────────────────────────────────────────────────
const box = (w: Walk) => w.page.getByRole('main').getByRole('textbox');
const checkPresence = (w: Walk) => w.page.getByRole('button', { name: S.CHECK_BUTTON, exact: true });
const chip = (w: Walk, name: string) => w.page.getByRole('button', { name: exactly(name, 'i') });
const resultHeading = (w: Walk) => w.page.getByRole('heading', { name: S.RESULT_HEADING, exact: true });
const control = (w: Walk | Page, name: string | RegExp) => {
  const p = 'page' in w ? w.page : w;
  return p.getByRole('button', { name, exact: typeof name === 'string' }).or(p.getByRole('link', { name, exact: typeof name === 'string' })).first();
};
const menuButton = (w: Walk) => w.page.getByRole('button', { name: /menu/i }).first();
const menu = (w: Walk) => w.page.getByRole('navigation').filter({ has: w.page.getByRole('link', { name: 'Verify', exact: true }) }).first();
const footer = (w: Walk) => w.page.getByRole('contentinfo');
/** The mark and wordmark at the top left, which take a person home. */
const mark = (w: Walk) => w.page.getByRole('banner').getByRole('link', { name: /STILL HERE/i }).first();

/** Type into a field as a person does: click it, select what is there, type over it. */
async function typeInto(field: Locator, text: string): Promise<void> {
  await field.click();
  await field.press('ControlOrMeta+a');
  await field.press('Backspace');
  if (text) await field.page().keyboard.type(text);
}

async function openMenu(w: Walk): Promise<void> {
  if (await menuButton(w).isVisible()) {
    const expanded = await menuButton(w).getAttribute('aria-expanded');
    if (expanded !== 'true') await menuButton(w).click();
  }
  await expect(menu(w)).toBeVisible();
}

/** Choose a page from the menu. */
export async function go(w: Walk, item: string): Promise<void> {
  await openMenu(w);
  const link = menu(w).getByRole('link', { name: item, exact: true });
  // the new page's address first: the page being left has a level-1 heading of its own, which on a
  // networked server can still be showing when the click returns (C4 question 9, 2026-10-06)
  const path = new URL((await link.getAttribute('href'))!, w.page.url()).pathname;
  await link.click();
  await expect(w.page).toHaveURL((u) => new URL(u).pathname === path);
  await expect(w.page.getByRole('heading', { level: 1 })).toBeVisible();
}

async function goHome(w: Walk): Promise<void> {
  await mark(w).click();
  await expect(w.page).toHaveURL((u) => new URL(u).pathname === '/');
  await expect(w.page.getByRole('heading', { name: S.HOME_HEADING })).toBeVisible();
}

/** Read to the end of a page: the footer comes into view. */
async function readToEnd(w: Walk): Promise<void> {
  await w.page.keyboard.press('End');
  await expect(footer(w)).toBeInViewport();
}

async function zoneOf(page: Page): Promise<string> {
  return page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone);
}

/**
 * Timing kept inside the page (C2 test change 5): the keypress and the moment each awaited text is
 * inserted (or first shown), both by the page's own performance.now(). The test machine's wall
 * clock is not used. Installed just before the press; reads nothing a person could not see.
 */
async function startPageTimer(page: Page, texts: string[]): Promise<void> {
  await page.evaluate((wanted) => {
    const t: { pressed: number; seen: Record<string, number> } = { pressed: -1, seen: {} };
    (window as unknown as { __walkTimes: typeof t }).__walkTimes = t;
    window.addEventListener('keydown', (e) => { if (e.key === 'Enter' && t.pressed < 0) t.pressed = performance.now(); }, { capture: true });
    const shown = (el: Element) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
    const showing = (want: string) => [...document.body.querySelectorAll('*')].filter((el) => (el.textContent ?? '').trim() === want && shown(el));
    // what already shows these texts before the press does not count as their arrival
    const before = new Set(wanted.flatMap(showing));
    const look = () => {
      if (t.pressed < 0) return;
      const now = performance.now();
      for (const want of wanted) {
        if (!(want in t.seen) && showing(want).some((el) => !before.has(el))) t.seen[want] = now;
      }
    };
    new MutationObserver(look).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true });
  }, texts);
}

/** The page's own times since the press, for each awaited text that has arrived. */
async function pageTimes(page: Page): Promise<Record<string, number>> {
  const t = await page.evaluate(() => (window as unknown as { __walkTimes?: { pressed: number; seen: Record<string, number> } }).__walkTimes ?? null);
  expect(t, 'the in-page timer was installed before the press').not.toBeNull();
  expect(t!.pressed, 'the in-page timer saw the keypress').toBeGreaterThanOrEqual(0);
  return Object.fromEntries(Object.entries(t!.seen).map(([k, v]) => [k, v - t!.pressed]));
}

/** Check an object from the home page, by keyboard, and wait for the result. */
async function check(w: Walk, name: string): Promise<void> {
  await typeInto(box(w), name);
  await box(w).press('Enter');
  await expect(resultHeading(w)).toBeVisible({ timeout: 8_000 });
  w.state.name = name;
  w.state.id = ((await w.page.getByText(ID_RE).first().textContent()) ?? '').trim();
}

async function save(w: Walk, label: string, d: Download): Promise<Buffer> {
  const p = await d.path();
  const b = readFileSync(p!);
  w.state.downloads[label] = b;
  return b;
}

/** The link a person copied: the clipboard where the browser lets the spec read it, else what the page showed. */
async function copiedLink(w: Walk, page: Page = w.page): Promise<string> {
  const refused = page.getByText(S.CLIPBOARD_REFUSED, { exact: true });
  if (await refused.isVisible()) return page.getByRole('textbox', { name: S.CLIPBOARD_REFUSED }).or(page.getByRole('textbox').last()).first().inputValue();
  try {
    const text = await page.evaluate(() => navigator.clipboard.readText());
    if (text) return text.trim();
  } catch {
    /* this engine does not let a page read the clipboard back */
  }
  // What a person would paste is exactly what D2 defines from the screen in front of them.
  const origin = new URL(page.url()).origin;
  return R.link(origin, w.state.id!, w.state.name!, w.state.zone!);
}

// ── W1 — the ritual ─────────────────────────────────────────────────────────────────────────────
export async function W1_1(w: Walk): Promise<void> {
  await test.step('W1.1 — the home page: heading, one box, Check presence, ten examples', async () => {
    await w.page.goto('/');
    w.state.zone = await zoneOf(w.page);
    await expect(w.page.getByRole('heading', { name: S.HOME_HEADING, exact: true })).toBeVisible();
    await expect(box(w)).toHaveCount(1);
    if (w.phone) await expect(box(w)).toBeInViewport();
    await expect(checkPresence(w)).toBeVisible();
    let prev: { x: number; y: number } | null = null;
    for (const ex of S.EXAMPLES) {
      const c = chip(w, ex);
      await expect(c).toBeVisible();
      const b = (await c.boundingBox())!;
      if (prev) expect(b.y > prev.y + 2 || (Math.abs(b.y - prev.y) <= 2 && b.x > prev.x), `${ex} follows the example before it`).toBe(true);
      prev = { x: b.x, y: b.y };
    }
  });
}

export async function W1_2(w: Walk): Promise<void> {
  await test.step('W1.2 — Check presence with the box empty, then Enter: the empty-input sentence, nothing issued', async () => {
    await checkPresence(w).click({ force: true });
    await expect(w.page.getByText(S.EMPTY_INPUT, { exact: true })).toBeVisible();
    await expect(w.page.getByText(S.LINES[0], { exact: true })).toHaveCount(0);
    await box(w).click();
    await box(w).press('Enter');
    await expect(w.page.getByText(S.EMPTY_INPUT, { exact: true })).toBeVisible();
    await w.page.waitForLoadState();
    await expect(w.page.getByText(S.LINES[0], { exact: true })).toHaveCount(0);
    await expect(resultHeading(w)).toHaveCount(0);
  });
}

export async function W1_3(w: Walk): Promise<void> {
  await test.step('W1.3 — tap "Folding chair": the box reads it, the cursor is in it, it stays editable', async () => {
    await chip(w, 'Folding chair').click();
    await expect(box(w)).toHaveValue(/^folding chair$/i);
    await expect(box(w)).toBeFocused();
    await w.page.keyboard.type(' ');
    await expect(box(w)).toHaveValue(/^folding chair $/i);
    await w.page.keyboard.press('Backspace');
    await expect(box(w)).toHaveValue(/^folding chair$/i);
    w.state.name = await box(w).inputValue();
  });
}

export async function W1_4(w: Walk): Promise<void> {
  await test.step('W1.4 — Enter: the check starts, the form stops answering, the three lines arrive in order', async () => {
    w.state.zone ??= await zoneOf(w.page);
    await startPageTimer(w.page, [S.RESULT_HEADING]);
    await box(w).press('Enter');
    await expect(w.page.getByText(S.LINES[0], { exact: true })).toBeVisible();
    // the box, the button and the examples stop answering
    const before = await box(w).inputValue();
    await w.page.keyboard.type('x');
    await expect(box(w)).toHaveValue(before);
    await chip(w, 'The Moon').click({ force: true, timeout: 2_000 }).catch(() => undefined);
    await expect(box(w)).toHaveValue(before);
    await expect(w.page.getByText(S.LINES[1], { exact: true })).toHaveCount(0);
    await expect(w.page.getByText(S.LINES[1], { exact: true })).toBeVisible({ timeout: 3_000 });
    await expect(w.page.getByText(S.LINES[2], { exact: true })).toBeVisible({ timeout: 3_000 });
  });
}

export async function W1_5(w: Walk): Promise<void> {
  await test.step('W1.5 — four to five seconds after the press: the result, in full, on the home page', async () => {
    await expect(resultHeading(w)).toBeVisible({ timeout: 6_000 });
    // from the keypress to the result's insertion, timed inside the page
    const elapsed = (await pageTimes(w.page))[S.RESULT_HEADING];
    expect(elapsed, 'the in-page timer saw the result arrive').toBeDefined();
    expect(elapsed, 'the result arrives four to five seconds after the press').toBeGreaterThanOrEqual(3_900);
    expect(elapsed).toBeLessThanOrEqual(5_600);
    await expect(w.page.getByText(w.state.name!, { exact: true }).first()).toBeVisible();
    await expect(w.page.getByText(/\b\d{1,2} (January|February|March|April|May|June|July|August|September|October|November|December) 20\d\d, \d\d:\d\d:\d\d\b/).first()).toBeVisible();
    await expect(w.page.getByText(`${S.ZONE_LABEL} ${w.state.zone}`).first()).toBeVisible();
    await expect(w.page.getByText(ID_RE).first()).toBeVisible();
    w.state.id = ((await w.page.getByText(ID_RE).first().textContent()) ?? '').trim();
    await expect(w.page.getByText(S.PORTFOLIO_LINE).first()).toBeVisible();
    for (const a of S.RESULT_ACTIONS) await expect(control(w, a)).toBeVisible();
    await expect(w.page).toHaveURL((u) => new URL(u).pathname === '/');
  });
}

export async function W1_6(w: Walk): Promise<void> {
  await test.step('W1.6 — Download PDF, and open it — played (substitute): openDownload()', async () => {
    const [d] = await Promise.all([w.page.waitForEvent('download', { timeout: 30_000 }), control(w, 'Download PDF').click()]);
    expect(d.suggestedFilename()).toMatch(new RegExp(`^STILL-HERE-${esc(R.slug(w.state.name!))}-[0-9A-Z]{11}\\.pdf$`));
    const opened = await openDownload(w.page, d);
    expect(opened.kind).toBe('pdf');
    expect(opened.hasFontFile2, 'the PDF carries its own typefaces').toBe(true);
    expect(opened.hasFooter, 'the footer sentence is at the bottom').toBe(true);
    await w.info.attach('W1.6 opened PDF', { body: opened.screenshot, contentType: 'image/png' });
    w.state.downloads.pdf = readFileSync(opened.path);
  });
}

export async function W1_7(w: Walk): Promise<void> {
  await test.step('W1.7 — Download PNG, the same name stem, and open it — played (substitute): openDownload()', async () => {
    const [d] = await Promise.all([w.page.waitForEvent('download', { timeout: 30_000 }), control(w, 'Download PNG').click()]);
    expect(d.suggestedFilename()).toMatch(new RegExp(`^STILL-HERE-${esc(R.slug(w.state.name!))}-[0-9A-Z]{11}\\.png$`));
    const opened = await openDownload(w.page, d);
    expect(opened.kind).toBe('png');
    await w.info.attach('W1.7 opened PNG', { body: opened.screenshot, contentType: 'image/png' });
    w.state.downloads.png = readFileSync(opened.path);
  });
}

export async function W1_8(w: Walk): Promise<void> {
  await test.step('W1.8 — Check another: the form is back, empty, the cursor in the box', async () => {
    await control(w, 'Check another').click();
    await expect(box(w)).toBeVisible();
    await expect(box(w)).toHaveValue('');
    await expect(box(w)).toBeFocused();
  });
}

export async function W1_9(w: Walk): Promise<void> {
  await test.step('W1.9 — a name made of markup is shown exactly as typed, and nothing runs', async () => {
    const dialogs: string[] = [];
    w.page.on('dialog', (d) => {
      dialogs.push(d.message());
      void d.dismiss();
    });
    const name = '<script>alert(1)</script> & "x"';
    await typeInto(box(w), name);
    await box(w).press('Enter');
    await expect(resultHeading(w)).toBeVisible({ timeout: 8_000 });
    await expect(w.page.getByText(name, { exact: true }).first()).toBeVisible();
    expect(dialogs, 'no dialog opened').toEqual([]);
  });
}

export async function W1_10(w: Walk): Promise<void> {
  await test.step('W1.10 — no dead end: from the result the menu reaches any page, and the mark goes home to an empty form', async () => {
    await expect(resultHeading(w)).toBeVisible();
    await go(w, 'Leadership');
    await expect(w.page).toHaveURL((u) => new URL(u).pathname === '/leadership');
    await goHome(w);
    await expect(box(w)).toHaveValue('');
    await expect(resultHeading(w)).toHaveCount(0);
  });
}

// ── W2 — reopen and verify ──────────────────────────────────────────────────────────────────────
/** The second window of W2, in another time zone. */
let second: Page | undefined;
/** Called with each browser context a walk opens itself (X6 records their requests). */
export const newContextHooks: ((c: BrowserContext) => void)[] = [];

export async function W2_1(w: Walk): Promise<void> {
  await test.step('W2.1 — check "Folding chair" and copy its link', async () => {
    await w.page.goto('/');
    w.state.zone = await zoneOf(w.page);
    await check(w, 'Folding chair');
    await control(w, 'Copy certificate link').click();
    await expect(w.page.getByText(S.COPIED, { exact: true }).or(w.page.getByText(S.CLIPBOARD_REFUSED, { exact: true })).first()).toBeVisible();
    w.state.link = await copiedLink(w);
    expect(w.state.link).toBe(R.link(new URL(w.page.url()).origin, w.state.id!, 'Folding chair', w.state.zone!));
  });
}

export async function W2_2(w: Walk): Promise<void> {
  await test.step('W2.2 — the link in a new private window in another time zone: the same certificate, confirmed', async () => {
    const zone = w.state.zone === 'Pacific/Chatham' ? 'Asia/Tokyo' : 'Pacific/Chatham';
    const ctx = await w.browser.newContext({ timezoneId: zone, locale: 'en-GB', acceptDownloads: true, viewport: w.page.viewportSize() ?? undefined, baseURL: new URL(w.page.url()).origin });
    for (const hook of newContextHooks) hook(ctx);
    second = await ctx.newPage();
    await second.goto(w.state.link!);
    const issuedAt = R.issued(w.state.id!);
    await expect(second.getByText(R.confirmation('Folding chair', issuedAt, w.state.zone!), { exact: true })).toBeVisible();
    await expect(second.getByText(`${S.ZONE_LABEL} ${w.state.zone}`).first()).toBeVisible();
    await expect(second.getByText(S.FOOTER).first()).toBeVisible();
    for (const a of S.RESULT_ACTIONS) await expect(control(second, a)).toBeVisible();
  });
}

export async function W2_3(w: Walk): Promise<void> {
  await test.step('W2.3 — one character of the identifier changed in the address bar: not located, no certificate, two ways on', async () => {
    const page = second!;
    const id = w.state.id!;
    const i = 5; // the second symbol of the second group
    const sym = id[i] === '7' ? '8' : '7';
    const changed = id.slice(0, i) + sym + id.slice(i + 1);
    await page.goto(w.state.link!.replace(id, changed));
    await expect(page.getByText(S.NOT_LOCATED, { exact: true })).toBeVisible();
    await expect(page.getByText(S.FOOTER)).toHaveCount(0);
    for (const l of S.FAILURE_LINKS) await expect(page.getByRole('link', { name: l, exact: true })).toBeVisible();
  });
}

export async function W2_4(w: Walk): Promise<void> {
  await test.step('W2.4 — Verify from the menu: lower case, o for zero, no SH-, the name in lower case; Enter confirms in UTC', async () => {
    const page = second!;
    const pw: Walk = { ...w, page, context: page.context() };
    await go(pw, 'Verify');
    const typed = w.state.id!.replace(/^SH-/, '').toLowerCase().replace(/0/g, 'o');
    await typeInto(page.getByLabel(S.VERIFY_LABELS.identifier), typed);
    await typeInto(page.getByLabel(S.VERIFY_LABELS.name), 'folding chair');
    await page.getByLabel(S.VERIFY_LABELS.name).press('Enter');
    await expect(page.getByText(R.confirmation('folding chair', R.issued(w.state.id!), 'UTC'), { exact: true })).toBeVisible();
  });
}

export async function W2_5(w: Walk): Promise<void> {
  await test.step('W2.5 — an identifier from the future: the future sentence', async () => {
    const page = second!;
    await typeInto(page.getByLabel(S.VERIFY_LABELS.identifier), 'SH-01MR-P6G7-6TA1');
    await typeInto(page.getByLabel(S.VERIFY_LABELS.name), 'A time capsule (contents unknown)');
    await page.getByLabel(S.VERIFY_LABELS.name).press('Enter');
    await expect(page.getByText(S.FUTURE, { exact: true })).toBeVisible();
  });
}

export async function W2_6(w: Walk): Promise<void> {
  await test.step('W2.6 — nonsense: not located; both boxes empty and Verify pressed: enter both', async () => {
    const page = second!;
    await typeInto(page.getByLabel(S.VERIFY_LABELS.identifier), 'hello');
    await page.getByLabel(S.VERIFY_LABELS.identifier).press('Enter');
    await expect(page.getByText(S.NOT_LOCATED, { exact: true })).toBeVisible();
    await typeInto(page.getByLabel(S.VERIFY_LABELS.identifier), '');
    await typeInto(page.getByLabel(S.VERIFY_LABELS.name), '');
    await page.getByRole('button', { name: S.VERIFY_LABELS.button, exact: true }).click({ force: true });
    await expect(page.getByText(S.VERIFY_EMPTY, { exact: true })).toBeVisible();
  });
}

export async function W2_7(w: Walk): Promise<void> {
  await test.step('W2.7 — scan the printed QR code — played (substitute): decodeQr() on the PNG and the PDF, then open it († phone checklist item 6)', async () => {
    // the certificate of W2.1, downloaded as a person would before printing it
    const [png] = await Promise.all([w.page.waitForEvent('download', { timeout: 30_000 }), control(w, 'Download PNG').click()]);
    const [pdf] = await Promise.all([w.page.waitForEvent('download', { timeout: 30_000 }), control(w, 'Download PDF').click()]);
    const fromPng = await decodeQr(w.context, { png: await save(w, 'qr.png', png) });
    const fromPdf = await decodeQr(w.context, { pdf: await save(w, 'qr.pdf', pdf) });
    expect(fromPng).toBe(w.state.link);
    expect(fromPdf).toBe(w.state.link);
    const page = second ?? w.page;
    await page.goto(fromPng!);
    await expect(page.getByText(R.confirmation('Folding chair', R.issued(w.state.id!), w.state.zone!), { exact: true })).toBeVisible();
  });
}

export async function closeSecondWindow(): Promise<void> {
  if (second) await second.context().close();
  second = undefined;
}

// ── W3 — portfolio ──────────────────────────────────────────────────────────────────────────────
const entry = (w: Walk, name: string) =>
  w.page.getByRole('listitem').or(w.page.getByRole('article')).filter({ has: w.page.getByText(name, { exact: true }) }).first();

export async function W3_1(w: Walk): Promise<void> {
  await test.step('W3.1 — check three objects', async () => {
    await w.page.goto('/');
    w.state.zone = await zoneOf(w.page);
    for (const name of ['Car keys', 'The Moon', 'My car keys']) {
      await check(w, name);
      await control(w, 'Check another').click();
    }
  });
}

export async function W3_2(w: Walk): Promise<void> {
  await test.step('W3.2 — close the tab, come back, Portfolio: all three, newest first, each dated and identified', async () => {
    const ctx = w.context;
    await w.page.close();
    w.page = await ctx.newPage();
    await w.page.goto('/');
    await go(w, 'Portfolio');
    await expect(w.page.getByRole('heading', { name: S.PORTFOLIO_HEADING })).toBeVisible();
    const ys: number[] = [];
    for (const name of ['My car keys', 'The Moon', 'Car keys']) {
      const e = entry(w, name);
      await expect(e).toBeVisible();
      await expect(e.getByText(ID_RE)).toBeVisible();
      await expect(e.getByText(new RegExp(`\\d{1,2} \\w+ 20\\d\\d, \\d\\d:\\d\\d · ${esc(w.state.zone ?? '')}`))).toBeVisible();
      ys.push((await e.boundingBox())!.y);
    }
    expect([...ys].sort((a, b) => a - b), 'newest first').toEqual(ys);
  });
}

export async function W3_3(w: Walk): Promise<void> {
  await test.step('W3.3 — Download PDF beside "The Moon": its identifier matches; Open draws it', async () => {
    const e = entry(w, 'The Moon');
    const id = ((await e.getByText(ID_RE).textContent()) ?? '').trim();
    const [d] = await Promise.all([w.page.waitForEvent('download', { timeout: 30_000 }), e.getByRole('button', { name: 'Download PDF' }).or(e.getByRole('link', { name: 'Download PDF' })).first().click()]);
    const opened = await openDownload(w.page, d);
    expect(opened.text?.replace(/\s+/g, ''), 'the identifier in the file matches the list').toContain(id.replace(/\s+/g, ''));
    await e.getByRole('link', { name: 'Open' }).or(e.getByRole('button', { name: 'Open' })).first().click();
    await expect(w.page.getByText(S.FOOTER).first()).toBeVisible();
    await expect(w.page.getByText(new RegExp(`^Issued by STILL HERE for 'The Moon' on `))).toBeVisible();
  });
}

export async function W3_4(w: Walk): Promise<void> {
  await test.step("W3.4 — clear the site's data, reload Portfolio: it says it is empty — played (substitute): clearSiteData()", async () => {
    await w.page.goto('/portfolio');
    const origin = new URL(w.page.url()).origin;
    w.page = await clearSiteData(w.page);
    w.context = w.page.context();
    // a substitute's fresh context has no base address: the visitor types the full one
    await w.page.goto(`${origin}/portfolio`);
    await expect(w.page.getByRole('heading', { name: S.PORTFOLIO_HEADING })).toBeVisible();
    await expect(w.page.getByText(S.PORTFOLIO_EMPTY, { exact: true })).toBeVisible();
  });
}

export async function W3_5(w: Walk): Promise<void> {
  await test.step('W3.5 — the link copied in W2 still draws, with nothing stored; the portfolio stays empty', async () => {
    expect(w.state.link, 'a link copied in W2').toBeTruthy();
    await w.page.goto(w.state.link!);
    await expect(w.page.getByText(S.FOOTER).first()).toBeVisible();
    await expect(w.page.getByText(/^Issued by STILL HERE for 'Folding chair' on /)).toBeVisible();
    await go(w, 'Portfolio');
    await expect(w.page.getByText(S.PORTFOLIO_EMPTY, { exact: true })).toBeVisible();
  });
}

// ── W4 — the company ────────────────────────────────────────────────────────────────────────────
export async function W4_1(w: Walk): Promise<void> {
  await test.step('W4.1 — the menu: eight pages, each opens, the mark brings me home; the footer on every page', async () => {
    await w.page.goto('/');
    await openMenu(w);
    const names = (await menu(w).getByRole('link').allTextContents()).map((t) => t.trim());
    expect(names).toEqual(S.MENU.map(([n]) => n));
    for (const [name, href] of S.MENU) {
      await go(w, name);
      await expect(w.page).toHaveURL((u) => new URL(u).pathname === href);
      for (const [f] of S.FOOTER_LINKS) await expect(footer(w).getByRole('link', { name: f, exact: true })).toBeVisible();
      await goHome(w);
    }
    for (const [f] of S.FOOTER_LINKS) await expect(footer(w).getByRole('link', { name: f, exact: true })).toBeVisible();
  });
}

export async function W4_2(w: Walk): Promise<void> {
  await test.step('W4.2 — "A Vandalway Industries company" leaves for vandalwayind.com', async () => {
    const link = footer(w).getByRole('link', { name: S.FOOTER_ACK, exact: true });
    await expect(link).toHaveAttribute('href', 'https://vandalwayind.com/');
    if (new URL(w.page.url()).hostname === 'isitstillhere.com') {
      await link.click();
      await expect(w.page).toHaveURL(/^https:\/\/vandalwayind\.com\//);
    }
  });
}

export async function W4_leadership(w: Walk, people: { name: string }[]): Promise<void> {
  await test.step('W4.leadership — twelve people, each photographed, named, titled; Jules previously created WHERE-r-YOU', async () => {
    await w.page.goto('/');
    await go(w, 'Leadership');
    for (const p of people) await expect(w.page.getByRole('main').getByText(p.name, { exact: true }).first()).toBeVisible();
    await expect(w.page.getByRole('main').getByRole('img')).toHaveCount(12);
    await expect(w.page.getByText(new RegExp(esc(S.JULES_PHRASE))).first()).toBeVisible();
    await goHome(w);
  });
}

export async function W4_research(w: Walk): Promise<void> {
  await test.step('W4.research — three papers by Dr. Petra Voss with covers; the long one; each short one to the end', async () => {
    await w.page.goto('/');
    await go(w, 'Research');
    const main = w.page.getByRole('main');
    await expect(main.getByText('Dr. Petra Voss')).toHaveCount(3);
    expect(await main.getByRole('img').count(), 'a cover for each paper').toBeGreaterThanOrEqual(3);
    await main.getByRole('link', { name: /Competitive Landscape/ }).first().click();
    await expect(w.page.getByText(/Here remains the company's strongest position\./).first()).toBeVisible();
    await expect(w.page.getByText(/\b86\b/).first()).toBeVisible();
    await expect(w.page.getByText(S.RESEARCH_ENTERPRISE, { exact: true })).toBeVisible();
    await w.page.goBack();
    for (const title of [/On the Directionality of Here/, /Six Feet to the Left/]) {
      await w.page.getByRole('main').getByRole('link', { name: title }).first().click();
      await expect(w.page.getByRole('heading', { level: 1, name: title })).toBeVisible();
      await readToEnd(w);
      await w.page.goBack();
      await expect(w.page.getByRole('heading', { level: 1 })).toBeVisible();
    }
    await goHome(w);
  });
}

export async function W4_caseStudies(w: Walk): Promise<void> {
  await test.step('W4.case-studies — three, each Eileen Webb, the register, the bench no longer there, photographs', async () => {
    await w.page.goto('/');
    await go(w, 'Case studies');
    for (const subject of [/Municipal infrastructure/i, /Public seating/i, /civic rest sector/i]) {
      await w.page.getByRole('main').getByRole('link', { name: subject }).first().click();
      const main = w.page.getByRole('main');
      await expect(main.getByText(/Eileen Webb/).first()).toBeVisible();
      await expect(main.getByText(/register/i).first()).toBeVisible();
      await expect(main.getByText(/bench/i).first()).toBeVisible();
      expect(await main.getByRole('img').count(), 'photographs of the place').toBeGreaterThan(0);
      await w.page.goBack();
      await expect(w.page.getByRole('heading', { level: 1 })).toBeVisible();
    }
  });
}

export async function W4_status(w: Walk): Promise<void> {
  await test.step('W4.status — All systems operational at the top, then three incidents with dates and record numbers', async () => {
    await w.page.goto('/');
    await go(w, 'Status');
    const top = w.page.getByText(S.STATUS_CONSTANT, { exact: true }).first();
    await expect(top).toBeVisible();
    let y = (await top.boundingBox())!.y;
    for (const t of S.STATUS_TITLES) {
      const el = w.page.getByText(t, { exact: true }).first();
      await expect(el).toBeVisible();
      const b = (await el.boundingBox())!;
      expect(b.y).toBeGreaterThan(y);
      y = b.y;
    }
    for (const id of ['STATUS-001', 'STATUS-002', 'STATUS-003']) await expect(w.page.getByText(new RegExp(id)).first()).toBeVisible();
    await expect(w.page.getByText(/\b2026-09-29\b|\b29 September 2026\b/).first()).toBeVisible();
    await expect(w.page.getByText(/\b2026-10-02\b|\b2 October 2026\b/).first()).toBeVisible();
  });
}

async function nothingToSend(w: Walk): Promise<void> {
  for (const role of ['textbox', 'combobox', 'checkbox', 'radio', 'searchbox', 'spinbutton', 'listbox'] as const) {
    await expect(w.page.getByRole('main').getByRole(role)).toHaveCount(0);
  }
  await expect(w.page.getByRole('main').getByRole('button')).toHaveCount(0);
  for (const l of await w.page.getByRole('link').all()) expect((await l.getAttribute('href')) ?? '').not.toMatch(/^mailto:/i);
}

export async function W4_careers(w: Walk): Promise<void> {
  await test.step('W4.careers — three postings; nowhere to type, nothing to send', async () => {
    await w.page.goto('/');
    await go(w, 'Careers');
    for (const t of S.CAREERS_TITLES) await expect(w.page.getByRole('heading', { name: t, exact: true })).toBeVisible();
    await nothingToSend(w);
  });
}

export async function W4_legal_terms(w: Walk): Promise<void> {
  await test.step('W4.legal (Terms) — Terms of Presence from the footer, read to the end', async () => {
    await w.page.goto('/');
    await footer(w).getByRole('link', { name: 'Terms of Presence', exact: true }).click();
    await expect(w.page.getByRole('heading', { level: 1, name: 'Terms of Presence' })).toBeVisible();
    await readToEnd(w);
    for (const s of S.TERMS) await expect(w.page.getByText(s).first()).toBeAttached();
    await goHome(w);
  });
}

export async function W4_legal_privacy(w: Walk): Promise<void> {
  await test.step("W4.legal (Privacy) — what my browser keeps, what our host logs (with its own page), that mail is refused", async () => {
    await w.page.goto('/');
    await footer(w).getByRole('link', { name: 'Privacy', exact: true }).click();
    await expect(w.page.getByRole('heading', { level: 1, name: /Privacy/ })).toBeVisible();
    await expect(w.page.getByText(S.PRIVACY[2]).first()).toBeVisible();
    await expect(w.page.getByText(S.PRIVACY[1]).first()).toBeVisible();
    const hrefs = await Promise.all((await w.page.getByRole('main').getByRole('link').all()).map((l) => l.getAttribute('href')));
    expect(hrefs, "a link to the host's own page").toContain(S.GITHUB_PAGES_LOGGING_DOC);
    await readToEnd(w);
    await expect(w.page.getByText(S.PRIVACY[7]).first()).toBeVisible();
    await goHome(w);
  });
}

export async function W4_404(w: Walk): Promise<void> {
  await test.step('W4.404 — a wrong address: the 404 sentence and Return home, which works', async () => {
    const r = await w.page.goto(`/no-such-page-${Date.now()}`);
    expect(r?.status()).toBe(404);
    await expect(w.page.getByText(S.NOT_FOUND, { exact: true })).toBeVisible();
    // the 404 is a page of the site: its header and footer are there too
    await expect(w.page.getByRole('banner')).toBeVisible();
    await expect(footer(w)).toBeVisible();
    await w.page.getByRole('link', { name: S.RETURN_HOME, exact: true }).click();
    await expect(w.page).toHaveURL((u) => new URL(u).pathname === '/');
    await expect(w.page.getByRole('heading', { name: S.HOME_HEADING })).toBeVisible();
    await expect(box(w), 'home works: the box is there to check an object').toBeVisible();
  });
}

// ── W5 — Enterprise ─────────────────────────────────────────────────────────────────────────────
export async function W5_1(w: Walk): Promise<void> {
  await test.step('W5.1 — Enterprise: bulk certification, the civic rest sector, benches, Eileen Webb', async () => {
    await w.page.goto('/');
    await go(w, 'Enterprise');
    const main = w.page.getByRole('main');
    await expect(main.getByText(/bulk certification/i).first()).toBeVisible();
    await expect(main.getByText(/civic rest sector/i).first()).toBeVisible();
    expect(await main.getByRole('img').count(), 'photographs of benches').toBeGreaterThanOrEqual(3);
    await expect(main.getByText(/Eileen Webb, Municipal Archivist/).first()).toBeVisible();
  });
}

export async function W5_2(w: Walk): Promise<void> {
  await test.step('W5.2 — no form: no box, no button that sends anything', async () => {
    await nothingToSend(w);
  });
}

export async function W5_3(w: Walk): Promise<void> {
  await test.step('W5.3 — the call to action; nowhere to type; home', async () => {
    await readToEnd(w);
    await expect(w.page.getByText(S.ENTERPRISE_CTA, { exact: true })).toBeVisible();
    await expect(w.page.getByRole('textbox')).toHaveCount(0);
    await goHome(w);
  });
}

// ── W6 — offline ────────────────────────────────────────────────────────────────────────────────
async function oneVisit(w: Walk, origin = ''): Promise<void> {
  await w.page.goto(`${origin}/`);
  // a visitor's first visit lets the site finish installing itself before the network goes
  const ready = await w.page.evaluate(
    () =>
      new Promise<boolean>((ok) => {
        if (!('serviceWorker' in navigator)) return ok(false);
        // the offline copy is about 4 MB; over a network its first install can take 20 s or more
        // (C4 question 9, 2026-10-06)
        setTimeout(() => ok(false), 60_000);
        navigator.serviceWorker.ready.then(() => ok(true));
      }),
  );
  expect(ready, 'the site installs itself on the first visit').toBe(true);
  await w.page.reload();
}

export async function W6_1(w: Walk): Promise<void> {
  await test.step('W6.1 — (Chromium) open the site once; it can be installed — played (substitute): checkInstallable() († phone checklist item 8)', async () => {
    await oneVisit(w);
    const r = await checkInstallable(w.page);
    expect(r.errors).toEqual([]);
  });
}

export async function W6_2(w: Walk): Promise<void> {
  await test.step("W6.2 — network off, the site's start address opens — played (substitute): checkInstallable() opens start_url offline", async () => {
    // the substitute for opening it from the home screen: start_url, offline, in this context
    const r = await checkInstallable(w.page);
    expect(r.offline).toBe(true);
    await w.context.setOffline(true);
    await w.page.goto('/');
    await expect(w.page.getByRole('heading', { name: S.HOME_HEADING })).toBeVisible();
  });
}

export async function W6_3(w: Walk): Promise<void> {
  await test.step('W6.3 — offline: check "Wallet", the whole sequence and the certificate', async () => {
    w.state.zone = await zoneOf(w.page);
    await typeInto(box(w), 'Wallet');
    await box(w).press('Enter');
    for (const l of S.LINES) await expect(w.page.getByText(l, { exact: true })).toBeVisible({ timeout: 4_000 });
    await expect(resultHeading(w)).toBeVisible({ timeout: 6_000 });
    w.state.name = 'Wallet';
    w.state.id = ((await w.page.getByText(ID_RE).first().textContent()) ?? '').trim();
  });
}

export async function W6_4(w: Walk): Promise<void> {
  await test.step("W6.4 — offline: the PDF and the PNG, opened in the certificate's type — played (substitute): openDownload()", async () => {
    for (const [label, kind] of [['Download PDF', 'pdf'], ['Download PNG', 'png']] as const) {
      const [d] = await Promise.all([w.page.waitForEvent('download', { timeout: 30_000 }), control(w, label).click()]);
      const opened = await openDownload(w.page, d);
      expect(opened.kind).toBe(kind);
      if (kind === 'pdf') expect(opened.hasFontFile2).toBe(true);
      await w.info.attach(`W6.4 opened ${kind}`, { body: opened.screenshot, contentType: 'image/png' });
    }
  });
}

export async function W6_5(w: Walk): Promise<void> {
  await test.step('W6.5 — offline: copy its link, open it (confirms), verify it by hand (confirms)', async () => {
    await control(w, 'Copy certificate link').click();
    await expect(w.page.getByText(S.COPIED, { exact: true }).or(w.page.getByText(S.CLIPBOARD_REFUSED, { exact: true })).first()).toBeVisible();
    w.state.link = await copiedLink(w);
    await w.page.goto(w.state.link);
    await expect(w.page.getByText(R.confirmation('Wallet', R.issued(w.state.id!), w.state.zone!), { exact: true })).toBeVisible();
    await go(w, 'Verify');
    await typeInto(w.page.getByLabel(S.VERIFY_LABELS.identifier), w.state.id!);
    await typeInto(w.page.getByLabel(S.VERIFY_LABELS.name), 'Wallet');
    await w.page.getByLabel(S.VERIFY_LABELS.name).press('Enter');
    await expect(w.page.getByText(R.confirmation('Wallet', R.issued(w.state.id!), 'UTC'), { exact: true })).toBeVisible();
  });
}

export async function W6_6(w: Walk): Promise<void> {
  await test.step('W6.6 — offline: Portfolio shows "Wallet"; download it again from the list', async () => {
    await go(w, 'Portfolio');
    const e = entry(w, 'Wallet');
    await expect(e).toBeVisible();
    const [d] = await Promise.all([w.page.waitForEvent('download', { timeout: 30_000 }), e.getByRole('button', { name: 'Download PDF' }).or(e.getByRole('link', { name: 'Download PDF' })).first().click()]);
    expect(d.suggestedFilename()).toMatch(/^STILL-HERE-wallet-[0-9A-Z]{11}\.pdf$/);
  });
}

export async function W6_7(w: Walk): Promise<void> {
  await test.step('W6.7 — offline: Leadership, never visited, opens; unseen photographs show their descriptions; a wrong address shows the 404', async () => {
    await go(w, 'Leadership');
    const img = w.page.getByRole('main').getByRole('img').first();
    await expect(img).toBeAttached();
    await expect(img).toHaveAccessibleName(/\S{3,}/);
    await w.page.goto(`/no-such-page-${Date.now()}`);
    await expect(w.page.getByText(S.NOT_FOUND, { exact: true })).toBeVisible();
  });
}

export async function W6_8(w: Walk): Promise<void> {
  await test.step('W6.8 — (WebKit, no install) after one visit with the network off, steps 3–6 still work in the tab', async () => {
    // offline is the server stopped, not context.setOffline, which in WebKit refuses even the
    // service worker's answers (C2 test changes; e2e/helpers/offline.ts)
    const site = await offlineSite(w.context, w.info.project.use.baseURL);
    w.state.origins.push(site.origin);
    try {
      await oneVisit(w, site.origin);
      await site.goOffline();
      await w.page.goto(`${site.origin}/`);
      await W6_3(w);
      await W6_4(w);
      await W6_5(w);
      await W6_6(w);
    } finally {
      await site.close();
    }
  });
}

// ── W7 — 1997 ───────────────────────────────────────────────────────────────────────────────────
export async function W7_1(w: Walk, origin: string): Promise<void> {
  await test.step('W7.1 — the period page, top to bottom', async () => {
    await w.page.goto(`${origin}/`);
    const p = w.page;
    expect(await p.evaluate(() => document.compatMode), 'quirks mode').toBe('BackCompat');
    await expect(p.getByText(/Welcome to Vandalway Industries/).first()).toBeVisible();
    for (const item of ['About Us', 'Our Companies', 'Guestbook', 'E-Mail']) await expect(p.getByRole('link', { name: new RegExp(item, 'i') }).first()).toBeVisible();
    await expect(p.getByText(/555-01\d\d/).first()).toBeVisible();
    await expect(p.getByRole('link', { name: /webmaster@vandalwayind\.com|E-?mail/i }).first()).toBeVisible();
    await expect(p.getByRole('img', { name: /construction/i }).first()).toBeVisible();
    await expect(p.getByRole('img', { name: /netscape/i }).first()).toBeVisible();
    await expect(p.getByText(/This page has been visited/).first()).toBeVisible();
    await expect(p.getByText(/Last Updated.*1997/).first()).toBeVisible();
    await expect(p.getByText(/in-house/i).first()).toBeVisible();
    await expect(p.getByText(/Copyright/).first()).toBeVisible();
    expect(await p.getByRole('img').count(), 'logo, sign, badge, icon, photograph, counter').toBeGreaterThanOrEqual(6);
  });
}

export async function W7_2(w: Walk, origin: string, readCounter: (page: Page) => Promise<number>): Promise<void> {
  await test.step('W7.2 — the counter shows n; two reloads; within eleven minutes one more reload shows at least n+3', async () => {
    await w.page.goto(`${origin}/`);
    const n = await readCounter(w.page);
    await w.page.reload();
    await w.page.reload();
    const last = Date.now();
    let seen = n;
    while (Date.now() - last < 11 * 60_000) {
      // allowed only here (WALKS.md § Substitute evidence, W7.2): waiting, as a person waits
      await w.page.waitForTimeout(60_000);
      await w.page.reload();
      seen = await readCounter(w.page);
      if (seen >= n + 3) break;
    }
    expect(seen, `the counter moved from ${n}`).toBeGreaterThanOrEqual(n + 3);
  });
}

export async function W7_3(w: Walk, origin: string): Promise<void> {
  await test.step('W7.3 — the e-mail link, and the mail bounces at once — played (substitute): checkNullMx() († phone checklist item 9)', async () => {
    await w.page.goto(`${origin}/`);
    // the address line's link, found by its address (specs-v6; the menu's E-Mail may come first in the page)
    const link = w.page.getByRole('link', { name: /webmaster@vandalwayind\.com/i }).first();
    await checkNullMx(link);
  });
}

export async function W7_4(w: Walk, origin: string): Promise<void> {
  await test.step('W7.4 — the guestbook link: a 1999 page, temporarily unavailable', async () => {
    await w.page.goto(`${origin}/`);
    await w.page.getByRole('link', { name: /Guestbook/ }).first().click();
    await expect(w.page).toHaveTitle(S.GUESTBOOK_TITLE);
    await expect(w.page.getByText(/1999/).first()).toBeVisible();
  });
}

export async function W7_5(w: Walk, origin: string): Promise<void> {
  await test.step('W7.5 — nothing explains itself except the relocation line; nothing blinks or scrolls', async () => {
    await w.page.goto(`${origin}/`);
    const body = await w.page.evaluate(() => document.body.innerText);
    const moves = body.split(/(?<=[.!?])\s+/).filter((s) => /\b(moved|moving|relocat\w*)\b/i.test(s));
    expect(moves.length, 'one relocation line').toBe(1);
    expect(await w.page.evaluate(() => document.querySelectorAll('marquee, blink').length)).toBe(0);
  });
}

// ── W8 — reduced motion ─────────────────────────────────────────────────────────────────────────
export async function W8_1(w: Walk): Promise<void> {
  await test.step('W8.1 — reduced motion on; W1 steps 3–5', async () => {
    await w.page.emulateMedia({ reducedMotion: 'reduce' });
    await w.page.goto('/');
    await W1_3(w);
    await W1_4(w);
    await W1_5(w);
  });
}

export async function W8_2(w: Walk): Promise<void> {
  await test.step('W8.2 — the same three lines, the same order and pace; nothing moves, fades or slides', async () => {
    await w.page.goto('/');
    await chip(w, 'Folding chair').click();
    await startPageTimer(w.page, [...S.LINES]);
    await box(w).press('Enter');
    let moving = 0;
    for (let i = 0; i < S.LINES.length; i++) {
      await expect(w.page.getByText(S.LINES[i], { exact: true })).toBeVisible({ timeout: 3_000 });
      moving += await w.page.evaluate(() => document.getAnimations().length);
    }
    await expect(resultHeading(w)).toBeVisible({ timeout: 6_000 });
    moving += await w.page.evaluate(() => document.getAnimations().length);
    expect(moving, 'nothing moves').toBe(0);
    // each line's arrival after the keypress, timed inside the page
    const times = await pageTimes(w.page);
    const seen = S.LINES.map((l) => times[l]);
    for (const [i, v] of seen.entries()) expect(v, `the in-page timer saw line ${i + 1} arrive`).toBeDefined();
    expect(seen[1] - seen[0]).toBeGreaterThanOrEqual(900);
    expect(seen[2] - seen[1]).toBeGreaterThanOrEqual(900);
  });
}

// ── W9 — the repository ─────────────────────────────────────────────────────────────────────────
export async function W9_1(w: Walk, repo: string): Promise<void> {
  await test.step('W9.1 — the README: what STILL HERE is, how to run and test it, where everything is', async () => {
    const r = await w.page.goto(repo);
    expect(r?.status()).toBeLessThan(400);
    await expect(w.page.getByText(/STILL HERE/).first()).toBeVisible();
    for (const cmd of ['npm ci', 'npm run build', 'npm test']) await expect(w.page.getByText(cmd).first()).toBeVisible();
  });
}

const followed: { url: string; status: number }[] = [];

async function follow(w: Walk, href: (h: string) => boolean): Promise<void> {
  // The README's own links first (github.com renders it in an article), then anywhere on the page;
  // and the new address, not a navigation request, since github.com may change pages in place
  // (C4 follow-up, approved by Clive 2026-10-06).
  for (const scope of [w.page.locator('article'), w.page.locator('body')]) {
    for (const l of await scope.getByRole('link').all()) {
      const h = (await l.getAttribute('href')) ?? '';
      if (!href(h)) continue;
      const target = new URL(h, w.page.url()).pathname;
      let nav: import('@playwright/test').Response | null = null;
      const seen = (r: import('@playwright/test').Response) => {
        if (r.request().isNavigationRequest() && r.frame() === w.page.mainFrame()) nav = r;
      };
      w.page.on('response', seen);
      await l.click();
      await expect(w.page).toHaveURL((u) => new URL(u).pathname === target);
      w.page.off('response', seen);
      const status = nav ? (nav as import('@playwright/test').Response).status() : (await w.page.request.get(w.page.url())).status();
      followed.push({ url: w.page.url(), status });
      return;
    }
  }
  throw new Error('no such link on the page');
}

export async function W9_2(w: Walk): Promise<void> {
  await test.step("W9.2 — follow the README to company/: its README lists each record set with its format and schema", async () => {
    await follow(w, (h) => /(^|\/)company\/?(README\.md)?$/.test(h));
    for (const set of ['tracker', 'correspondence', 'chat', 'notes', 'calendar', 'certificates', 'status', 'inventory', 'research', 'staff']) {
      await expect(w.page.getByText(new RegExp(set, 'i')).first()).toBeVisible();
    }
    await expect(w.page.getByText(/gum graph/i).first()).toBeVisible();
    await expect(w.page.getByText(/schema/i).first()).toBeVisible();
  });
}

export async function W9_3(w: Walk): Promise<void> {
  await test.step('W9.3 — the tracker, a correspondence file, the inventory and the gum graph, each from those links', async () => {
    const back = w.page.url();
    for (const want of [/tracker/, /correspondence\//, /inventory/, /gum-graph/]) {
      await w.page.goto(back);
      await follow(w, (h) => want.test(h));
      await expect(w.page.getByRole('main').or(w.page.getByRole('article')).first()).toBeVisible();
      expect(((await w.page.getByRole('main').or(w.page.getByRole('article')).first().textContent()) ?? '').trim().length).toBeGreaterThan(20);
    }
  });
}

export async function W9_4(w: Walk, liveVerify: string): Promise<void> {
  await test.step("W9.4 — CERT-001's identifier and name, pasted into the live Verify page, confirm (N3 only)", async () => {
    const cert = JSON.parse(readFileSync(new URL('../../company/certificates/CERT-001.json', import.meta.url), 'utf8'));
    await w.page.goto(liveVerify);
    await typeInto(w.page.getByLabel(S.VERIFY_LABELS.identifier), cert.identifier);
    await typeInto(w.page.getByLabel(S.VERIFY_LABELS.name), cert.object);
    await w.page.getByLabel(S.VERIFY_LABELS.name).press('Enter');
    await expect(w.page.getByText(R.confirmation(cert.object, R.issued(cert.identifier), 'UTC'), { exact: true })).toBeVisible();
  });
}

export async function W9_5(w: Walk): Promise<void> {
  await test.step('W9.5 — every link followed worked', async () => {
    expect(followed.length, 'links were followed').toBeGreaterThan(0);
    for (const f of followed) expect(f.status, f.url).toBeLessThan(400);
  });
}
