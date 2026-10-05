// Offline, the way a visitor's device goes offline: the server stops answering (C2 test change,
// Phase 4 critic item 23). `context.setOffline` is not used: in WebKit it refuses even the service
// worker's cached answers, and in Firefox it leaves the service worker online.
// Locally the site is served for the one test by its own scripts/serve-pages.mjs process on a free
// port, and that process is stopped. On staging, where the server cannot be stopped, every request
// of the context is aborted instead. (Diane, 2026-10-05)
import { expect, type BrowserContext } from '@playwright/test';
import { ON_STAGING, serveDir } from './site.ts';

export type OfflineSite = {
  /** The origin the test visits: the private server's, or staging's. */
  origin: string;
  /** Take the network away: stop the server (locally) or abort every request (staging). */
  goOffline: () => Promise<void>;
  /** Stop everything the helper started. */
  close: () => Promise<void>;
};

const unreachable = async (origin: string): Promise<boolean> => {
  for (let i = 0; i < 50; i++) {
    try {
      await fetch(`${origin}/build.txt`, { cache: 'no-store' });
    } catch {
      return true;
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  return false;
};

export async function offlineSite(context: BrowserContext, baseURL?: string): Promise<OfflineSite> {
  if (ON_STAGING) {
    const origin = new URL(baseURL ?? process.env.STAGING_URL!).origin;
    const abort = (route: { abort: (code?: string) => Promise<void> }) => route.abort('internetdisconnected');
    let routed = false;
    return {
      origin,
      goOffline: async () => {
        await context.route('**/*', abort);
        routed = true;
      },
      close: async () => {
        if (routed) await context.unroute('**/*', abort).catch(() => undefined);
      },
    };
  }
  const server = await serveDir('site');
  const origin = new URL(server.url).origin;
  let stopped = false;
  const stop = async () => {
    if (stopped) return;
    stopped = true;
    server.close();
    expect(await unreachable(origin), 'the server has stopped answering').toBe(true);
  };
  return { origin, goOffline: stop, close: stop };
}
