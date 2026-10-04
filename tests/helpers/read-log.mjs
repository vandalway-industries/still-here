// The build's read log: loaded with `node --import` before scripts/build.mjs, it records every
// path the build opens or lists, repository-relative, one per line, in STILL_HERE_READ_LOG.
// Used by S3 item 4 and RC2/RC3 (the build reads only what it may). Locked at specs-v1.
// (Diane, 2026-10-04)
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import { syncBuiltinESMExports } from 'node:module';
import { relative, resolve } from 'node:path';

const LOG = process.env.STILL_HERE_READ_LOG;
const ROOT = process.env.STILL_HERE_READ_ROOT ?? process.cwd();

function note(p) {
  if (!LOG || p == null || typeof p === 'number') return;
  try {
    const s = p instanceof URL ? p.pathname : Buffer.isBuffer(p) ? p.toString() : String(p);
    const rel = relative(ROOT, resolve(s));
    if (!rel.startsWith('..')) fs.appendFileSync(LOG, `${rel}\n`);
  } catch {
    /* never break the build */
  }
}

const SYNC = ['readFileSync', 'openSync', 'readdirSync', 'createReadStream', 'opendirSync', 'cpSync', 'copyFileSync'];
const ASYNC = ['readFile', 'open', 'readdir', 'opendir', 'cp', 'copyFile'];

const appendFileSync = fs.appendFileSync;
for (const name of SYNC) {
  const orig = fs[name];
  if (typeof orig !== 'function') continue;
  fs[name] = function (p, ...rest) {
    if (LOG) {
      const s = p instanceof URL ? p.pathname : String(p);
      if (resolve(s) !== resolve(LOG)) note(p);
    }
    return orig.call(this, p, ...rest);
  };
}
for (const name of ASYNC) {
  const orig = fs[name];
  if (typeof orig === 'function') {
    fs[name] = function (p, ...rest) {
      note(p);
      return orig.call(this, p, ...rest);
    };
  }
  const porig = fsp[name];
  if (typeof porig === 'function') {
    fsp[name] = function (p, ...rest) {
      note(p);
      return porig.call(this, p, ...rest);
    };
  }
}
fs.appendFileSync = appendFileSync;
syncBuiltinESMExports();
