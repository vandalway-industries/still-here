// X4 (still-here-dzc) — offline in every engine. garage/pack/ACCEPTANCE.md § X4 items 3 and 4
// (installability, Chromium only, is item 1 in the unit test and W6 step 1). Offline is the server
// stopped, not context.setOffline (C2 test changes; e2e/helpers/offline.ts says why).
import { expect, test, type Page } from '@playwright/test';
import { offlineSite } from '../helpers/offline.ts';
import { action, certificateSvg, objectInput } from '../helpers/site.ts';
import * as R from '../helpers/reference.ts';
import { CLIPBOARD_REFUSED, COPIED, NOT_FOUND, PORTFOLIO_HEADING, RESULT_HEADING, VERIFY_LABELS } from '../helpers/strings.ts';

async function oneVisit(page: Page, origin: string) {
  await page.goto(`${origin}/`);
  const ready = await page.evaluate(
    () =>
      new Promise<boolean>((ok) => {
        if (!('serviceWorker' in navigator)) return ok(false);
        setTimeout(() => ok(false), 15_000);
        navigator.serviceWorker.ready.then(() => ok(true));
      }),
  );
  expect(ready, 'a service worker after one visit').toBe(true);
  await page.reload();
}

test('3. after one visit, offline: the ritual, both downloads, copying and reopening a link, Verify by hand, the portfolio', async ({ page, context, browserName, baseURL }) => {
  test.setTimeout(120_000);
  const site = await offlineSite(context, baseURL);
  try {
    const origin = site.origin;
    if (browserName === 'chromium') await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin });
    await oneVisit(page, origin);
    await site.goOffline();
    await page.goto(`${origin}/`);
    await objectInput(page).fill('Wallet');
    await objectInput(page).press('Enter');
    await expect(page.getByRole('heading', { name: RESULT_HEADING, exact: true })).toBeVisible({ timeout: 8000 });
    const id = ((await page.getByText(/^SH-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z*~$=U]{4}$/).first().textContent()) ?? '').trim();
    for (const label of ['Download PDF', 'Download PNG']) {
      const [d] = await Promise.all([page.waitForEvent('download', { timeout: 30_000 }), action(page, label).click()]);
      expect(d.suggestedFilename()).toMatch(/^STILL-HERE-wallet-/);
    }
    await action(page, 'Copy certificate link').click();
    const zone = await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone);
    const link = R.link(new URL(page.url()).origin, id, 'Wallet', zone);
    // the copy works offline: the confirmation, and the link itself (on the clipboard, or shown)
    if (browserName === 'chromium') {
      await expect(page.getByText(COPIED, { exact: true })).toBeVisible();
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(link);
    } else {
      await expect(page.getByText(COPIED, { exact: true }).or(page.getByText(CLIPBOARD_REFUSED, { exact: true })).first()).toBeVisible();
      if (await page.getByText(CLIPBOARD_REFUSED, { exact: true }).isVisible()) await expect(page.locator('input[readonly], textarea[readonly]').first()).toHaveValue(link);
    }
    await page.goto(link);
    await expect(certificateSvg(page)).toBeVisible();
    await page.goto(`${origin}/verify`);
    await page.getByLabel(VERIFY_LABELS.identifier).fill(id);
    await page.getByLabel(VERIFY_LABELS.name).fill('Wallet');
    await page.getByLabel(VERIFY_LABELS.name).press('Enter');
    await expect(page.getByText(R.confirmation('Wallet', R.issued(id), 'UTC'), { exact: true })).toBeVisible();
    await page.goto(`${origin}/portfolio`);
    await expect(page.getByRole('heading', { name: PORTFOLIO_HEADING })).toBeVisible();
    await expect(page.getByText('Wallet', { exact: true }).first()).toBeVisible();
    const [d] = await Promise.all([page.waitForEvent('download', { timeout: 30_000 }), page.getByRole('main').getByRole('button', { name: 'Download PDF' }).or(page.getByRole('main').getByRole('link', { name: 'Download PDF' })).first().click()]);
    expect(d.suggestedFilename()).toBe(R.filename('Wallet', id, 'pdf'));
    await page.getByRole('main').getByRole('link', { name: 'Open' }).first().click();
    await expect(certificateSvg(page)).toBeVisible();
  } finally {
    await site.close();
  }
});

test('4. offline: a page never visited opens; an image never shown shows its alt text; an unknown path shows the cached 404', async ({ page, context, baseURL }) => {
  test.setTimeout(90_000);
  const site = await offlineSite(context, baseURL);
  try {
    const origin = site.origin;
    await oneVisit(page, origin);
    await site.goOffline();
    const r = await page.goto(`${origin}/enterprise`);
    expect(r?.ok() ?? true).toBe(true);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    // an image never shown: it is not in the cache, so it does not load, and its description is
    // painted in its place (C2 item 24: the text itself, visible inside the image's box)
    const img = page.getByRole('main').locator('img').first();
    const alt = (await img.getAttribute('alt')) ?? '';
    expect(alt, 'the image has a description').toMatch(/\S{3,}/);
    await expect.poll(() => img.evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth === 0)).toBe(true);
    await expect(img).toHaveAccessibleName(alt);
    await img.scrollIntoViewIfNeeded();
    const box = (await img.boundingBox())!;
    expect(box.width * box.height, 'the image keeps a box to show its description in').toBeGreaterThan(0);
    // the product's own laid-over description, where it draws one: the alt text, visible, in the box
    const overlay = page.getByRole('main').getByText(alt, { exact: true });
    if ((await overlay.count()) > 0) {
      await expect(overlay.first()).toBeVisible();
      const o = (await overlay.first().boundingBox())!;
      const inside = o.x >= box.x - 1 && o.y >= box.y - 1 && o.x + o.width <= box.x + box.width + 1 && o.y + o.height <= box.y + box.height + 1;
      expect(inside, 'the laid-over description sits inside the image box').toBe(true);
    }
    // painted: the image box with its text as drawn, against the same box with every text colour
    // inside it made transparent. The difference is the description's ink, the product's overlay
    // or the browser's own alt rendering; an empty box has none.
    const painted = await img.screenshot();
    const restore = await img.evaluate((e) => {
      const els = [e, ...(e.parentElement ? [e.parentElement, ...e.parentElement.querySelectorAll('*')] : [])];
      const was = els.map((el) => (el as HTMLElement).style.getPropertyValue('color'));
      for (const el of els) (el as HTMLElement).style.setProperty('color', 'transparent', 'important');
      (window as unknown as { __altRestore: () => void }).__altRestore = () => els.forEach((el, i) => (el as HTMLElement).style.setProperty('color', was[i]));
      return els.length;
    });
    expect(restore).toBeGreaterThan(0);
    const blank = await img.screenshot();
    await img.evaluate(() => (window as unknown as { __altRestore: () => void }).__altRestore());
    const viewer = await context.newPage();
    try {
      await viewer.setContent('<!doctype html><title>compare</title>');
      const ink = await viewer.evaluate(
        async ({ a, b }) => {
          const load = async (src: string) => {
            const i = new Image();
            i.src = src;
            await i.decode();
            const c = document.createElement('canvas');
            c.width = i.naturalWidth;
            c.height = i.naturalHeight;
            const x = c.getContext('2d')!;
            x.drawImage(i, 0, 0);
            return x.getImageData(0, 0, c.width, c.height).data;
          };
          const pa = await load(a);
          const pb = await load(b);
          if (pa.length !== pb.length) return -1;
          let n = 0;
          for (let i = 0; i < pa.length; i += 4) if (Math.max(Math.abs(pa[i] - pb[i]), Math.abs(pa[i + 1] - pb[i + 1]), Math.abs(pa[i + 2] - pb[i + 2])) > 48) n++;
          return n;
        },
        { a: `data:image/png;base64,${painted.toString('base64')}`, b: `data:image/png;base64,${blank.toString('base64')}` },
      );
      expect(ink, 'the description is painted inside the image box (pixels of its text)').toBeGreaterThan(100);
    } finally {
      await viewer.close();
    }
    await page.goto(`${origin}/no-such-page-${Date.now()}`);
    await expect(page.getByText(NOT_FOUND, { exact: true })).toBeVisible();
  } finally {
    await site.close();
  }
});
