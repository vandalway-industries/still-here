// E4 (still-here-cq5) — PDF and PNG in the browser.
// garage/pack/ACCEPTANCE.md § E4: item 1's download events in every engine (Firefox included);
// items 4, 6 and 7 in Chromium and WebKit. Items 2, 3 and 5 are also in the unit test.
import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { action, downloadBytes, issue } from '../helpers/site.ts';
import * as R from '../helpers/reference.ts';
import { EXPORT_FAILED, PREPARING_PDF, PREPARING_PNG } from '../helpers/strings.ts';
import { openDownload } from '../helpers/substitutes.ts';

const AT = '2026-10-03T10:52:00Z';

async function fileOf(page: Page, label: string) {
  const [d] = await Promise.all([page.waitForEvent('download', { timeout: 30_000 }), action(page, label).click()]);
  return d;
}

test('1. Download PDF and Download PNG fire downloads named by the rule', async ({ page }) => {
  await issue(page, 'Café au lait!', { at: AT });
  const id = R.identifier('Café au lait!', AT);
  expect((await fileOf(page, 'Download PDF')).suggestedFilename()).toBe(R.filename('Café au lait!', id, 'pdf'));
  expect((await fileOf(page, 'Download PNG')).suggestedFilename()).toBe(R.filename('Café au lait!', id, 'png'));
});

test.describe('in Chromium and WebKit', () => {
  test.skip(({ browserName }) => browserName === 'firefox', 'items 4, 6 and 7: Chromium and WebKit (ACCEPTANCE E4)');

  test('4. the PDF rendered by pdf.js at 150 dpi and the PNG at 150 dpi differ in at most 1% of pixels', async ({ page }) => {
    await issue(page, 'Folding chair', { at: AT });
    const pdf = await openDownload(page, await fileOf(page, 'Download PDF'));
    const png = readFileSync((await openDownload(page, await fileOf(page, 'Download PNG'))).path);
    expect(pdf.kind).toBe('pdf');
    const p = await page.context().newPage();
    try {
      await p.setContent('<!doctype html><title>compare</title>');
      const share = await p.evaluate(
        async ({ a, b }) => {
          const load = async (src: string) => {
            const i = new Image();
            i.src = src;
            await i.decode();
            const c = document.createElement('canvas');
            c.width = 1650;
            c.height = 1275;
            const x = c.getContext('2d')!;
            x.fillStyle = '#fff';
            x.fillRect(0, 0, c.width, c.height);
            x.drawImage(i, 0, 0, c.width, c.height);
            return x.getImageData(0, 0, c.width, c.height).data;
          };
          const pa = await load(a);
          const pb = await load(b);
          let differ = 0;
          for (let i = 0; i < pa.length; i += 4) {
            if (Math.max(Math.abs(pa[i] - pb[i]), Math.abs(pa[i + 1] - pb[i + 1]), Math.abs(pa[i + 2] - pb[i + 2])) > 64) differ++;
          }
          return differ / (pa.length / 4);
        },
        { a: `data:image/png;base64,${pdf.screenshot.toString('base64')}`, b: `data:image/png;base64,${png.toString('base64')}` },
      );
      expect(share, `${(share * 100).toFixed(2)}% of pixels differ`).toBeLessThanOrEqual(0.01);
    } finally {
      await p.close();
    }
  });

  test('6. Hebrew, Arabic, CJK and an emoji export without missing glyphs; "Café" stays vector text', async ({ page, browser, baseURL }) => {
    test.setTimeout(120_000);
    // The on-screen block is compared at device scale 2 (C2 test change 7): at 390 and scale 1 the
    // Hebrew name is 40 × 21 px, where a single pixel decides the comparison.
    const scaled = await browser.newContext({
      baseURL,
      viewport: page.viewportSize() ?? undefined,
      deviceScaleFactor: 2,
      hasTouch: !!test.info().project.use.hasTouch,
      locale: 'en-GB',
      acceptDownloads: true,
    });
    for (const name of ['שולחן', 'كرسي', '椅子', '🪑 chair']) {
      const p = await scaled.newPage();
      await issue(p, name, { at: AT });
      const block = p.locator('svg[viewBox="0 0 1100 850"] [data-field="name"]');
      const onScreen = await block.screenshot();
      const bb = (await block.boundingBox())!;
      const svgBox = (await p.locator('svg[viewBox="0 0 1100 850"]').boundingBox())!;
      const dpr = await p.evaluate(() => window.devicePixelRatio);
      const shotSize = { w: onScreen.readUInt32BE(16), h: onScreen.readUInt32BE(20) }; // PNG IHDR width and height
      const png = await downloadBytes(await fileOf(p, 'Download PNG'));
      const iou = await p.evaluate(
        async ({ shot, png, crop }: { shot: string; png: string; crop: { x: number; y: number; w: number; h: number; sx: number; sy: number } }) => {
          const img = async (src: string) => {
            const i = new Image();
            i.src = src;
            await i.decode();
            return i;
          };
          const a = await img(shot);
          const b = await img(png);
          const mask = (draw: (x: CanvasRenderingContext2D) => void) => {
            const c = document.createElement('canvas');
            c.width = a.naturalWidth;
            c.height = a.naturalHeight;
            const x = c.getContext('2d')!;
            x.fillStyle = '#fff';
            x.fillRect(0, 0, c.width, c.height);
            draw(x);
            const d = x.getImageData(0, 0, c.width, c.height).data;
            const m: boolean[] = [];
            for (let i = 0; i < d.length; i += 4) m.push(d[i] + d[i + 1] + d[i + 2] < 384);
            return m;
          };
          const ma = mask((x) => x.drawImage(a, 0, 0));
          // the best match within ±1 device pixel of the clip's origin (specs-v6)
          let best = 0;
          for (const dx of [-1, -0.5, 0, 0.5, 1]) {
            for (const dy of [-1, -0.5, 0, 0.5, 1]) {
              const cx = crop.x + dx * crop.sx;
              const cy = crop.y + dy * crop.sy;
              const mb = mask((x) => x.drawImage(b, cx * b.naturalWidth, cy * b.naturalHeight, crop.w * b.naturalWidth, crop.h * b.naturalHeight, 0, 0, a.naturalWidth, a.naturalHeight));
              let both = 0;
              let either = 0;
              for (let i = 0; i < ma.length; i++) {
                if (ma[i] && mb[i]) both++;
                if (ma[i] || mb[i]) either++;
              }
              if (either) best = Math.max(best, both / either);
            }
          }
          return best;
        },
        {
          shot: `data:image/png;base64,${onScreen.toString('base64')}`,
          png: `data:image/png;base64,${png.toString('base64')}`,
          // crop to the screenshot's actual size: the element screenshot is rounded out to whole device
          // pixels, so the export is cropped to that size rather than the fractional box (specs-v6);
          // sx/sy are one device pixel in the crop's units, for the ±1 px search above
          crop: {
            x: (bb.x - svgBox.x) / svgBox.width,
            y: (bb.y - svgBox.y) / svgBox.height,
            w: shotSize.w / dpr / svgBox.width,
            h: shotSize.h / dpr / svgBox.height,
            sx: 1 / dpr / svgBox.width,
            sy: 1 / dpr / svgBox.height,
          },
        },
      );
      expect(iou, `${name}: the exported name matches the screen's (no missing glyphs)`).toBeGreaterThanOrEqual(0.6);
      await p.close();
    }
    await scaled.close();
    const p = await page.context().newPage();
    await issue(p, 'Café', { at: AT });
    const pdf = await openDownload(p, await fileOf(p, 'Download PDF'));
    expect(pdf.text, '"Café" is text in the PDF').toContain('Café');
    await p.close();
  });

  test('7. preparing: the label and aria-disabled; a second tap does nothing; with the fonts blocked, the failure sentence in graphite and nothing else changes', async ({ page, browser }) => {
    // slow fonts, so the preparing state can be seen
    await page.route(/\.ttf(\?|$)/, async (route) => {
      await new Promise((r) => setTimeout(r, 1500));
      await route.continue();
    });
    await issue(page, 'Folding chair', { at: AT });
    for (const [label, preparing] of [['Download PDF', PREPARING_PDF], ['Download PNG', PREPARING_PNG]] as const) {
      const downloads: string[] = [];
      page.on('download', (d) => downloads.push(d.suggestedFilename()));
      // the second tap lands while the button is still busy: made inside the page the moment it reads
      // "preparing" with aria-disabled, so load on the test machine cannot delay it past the export (specs-v6)
      await page.evaluate((preparing) => {
        const w = window as unknown as { __secondTap?: boolean };
        w.__secondTap = false;
        const obs = new MutationObserver(() => {
          const el = [...document.querySelectorAll('button, a')].find((e) => e.textContent?.trim() === preparing && e.getAttribute('aria-disabled') === 'true') as HTMLElement | undefined;
          if (el && !w.__secondTap) {
            w.__secondTap = true;
            obs.disconnect();
            el.click();
          }
        });
        obs.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['aria-disabled'] });
      }, preparing);
      await action(page, label).click();
      const busy = page.getByRole('button', { name: preparing, exact: true }).or(page.getByRole('link', { name: preparing, exact: true })).first();
      await expect(busy).toBeVisible();
      await expect(busy).toHaveAttribute('aria-disabled', 'true');
      await expect.poll(() => page.evaluate(() => (window as unknown as { __secondTap?: boolean }).__secondTap), { message: `${label}: second tap made while busy` }).toBe(true);
      await expect(action(page, label)).toBeVisible({ timeout: 30_000 });
      await page.waitForTimeout(1000);
      expect(downloads.length, `${label}: one file for two taps`).toBe(1);
      page.removeAllListeners('download');
    }

    // a fresh visitor with nothing cached, the font request refused
    const ctx = await browser.newContext({ serviceWorkers: 'block', baseURL: new URL(page.url()).origin, acceptDownloads: true });
    const p = await ctx.newPage();
    await issue(p, 'Folding chair', { at: AT });
    await p.route(/\.ttf(\?|$)/, (route) => route.abort());
    const before = await p.getByRole('main').innerText();
    await action(p, 'Download PDF').click();
    const msg = p.getByText(EXPORT_FAILED, { exact: true });
    await expect(msg).toBeVisible({ timeout: 30_000 });
    expect(await msg.evaluate((e) => getComputedStyle(e).color)).toBe('rgb(22, 22, 24)');
    await expect(action(p, 'Download PDF')).toBeVisible();
    await expect(action(p, 'Download PDF')).not.toHaveAttribute('aria-disabled', 'true');
    const after = (await p.getByRole('main').innerText()).replace(EXPORT_FAILED, '');
    expect(after.replace(/\s+/g, ' ').trim()).toBe(before.replace(/\s+/g, ' ').trim());
    await ctx.close();
  });
});
