// X1 (still-here-q15) — presence.json as each engine's request sees it. garage/pack/ACCEPTANCE.md § X1.
import { expect, test } from '@playwright/test';
import { PRESENCE_BODY } from '../helpers/strings.ts';

test('the same body for every query, as JSON, open to every origin', async ({ page }) => {
  const bodies: string[] = [];
  for (const q of ['', '?object=Lucas', '?object=Adrian%20Vale']) {
    const r = await page.request.get(`/api/v1/presence.json${q}`);
    expect(r.status()).toBe(200);
    expect(r.headers()['content-type']).toMatch(/^application\/json\b/);
    expect(r.headers()['access-control-allow-origin']).toBe('*');
    bodies.push(await r.text());
  }
  expect(new Set(bodies).size).toBe(1);
  expect(JSON.parse(bodies[0])).toEqual(JSON.parse(PRESENCE_BODY));
});
