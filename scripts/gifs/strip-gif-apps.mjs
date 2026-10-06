#!/usr/bin/env node
// strip-gif-apps.mjs — takes out of a GIF what the page never needed: application blocks other than
// the looping one, and comments.
//
//   node scripts/gifs/strip-gif-apps.mjs <file.gif> [...]
//
// ImageMagick 6 writes an "ImageMagick" application block (the image's gamma) into every GIF it
// saves, and -strip does not take it out. The release scan (L4, item 4) counts it as metadata. This
// walks the GIF's blocks and drops every application extension except NETSCAPE2.0 and ANIMEXTS1.0
// (the loop count), and every comment extension. Every other byte is kept as it was, so the frames,
// their delays and their pixels do not change. The file is rewritten only when something was taken
// out. (Jules, 2026-10-06)
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const KEEP = /^(NETSCAPE2\.0|ANIMEXTS1\.0)$/;

export function stripGif(buf) {
  const sig = buf.subarray(0, 6).toString('latin1');
  if (sig !== 'GIF87a' && sig !== 'GIF89a') throw new Error('not a GIF');
  let i = 13;
  if (buf[10] & 0x80) i += 3 * (1 << ((buf[10] & 7) + 1));
  const parts = [buf.subarray(0, i)];
  const removed = [];
  const subBlocks = (from) => {
    let j = from;
    while (j < buf.length && buf[j] !== 0) j += buf[j] + 1;
    return j + 1;
  };
  while (i < buf.length) {
    const b = buf[i];
    if (b === 0x3b) {
      parts.push(buf.subarray(i, i + 1));
      i += 1;
      break;
    }
    if (b === 0x21) {
      const label = buf[i + 1];
      const end = subBlocks(i + 2);
      const app = label === 0xff ? buf.subarray(i + 3, i + 3 + buf[i + 2]).toString('latin1') : null;
      if (label === 0xfe) removed.push('comment');
      else if (app !== null && !KEEP.test(app)) removed.push(`application ${app}`);
      else parts.push(buf.subarray(i, end));
      i = end;
    } else if (b === 0x2c) {
      let j = i + 10;
      if (buf[i + 9] & 0x80) j += 3 * (1 << ((buf[i + 9] & 7) + 1));
      const end = subBlocks(j + 1);
      parts.push(buf.subarray(i, end));
      i = end;
    } else {
      throw new Error(`unexpected block 0x${b.toString(16)} at byte ${i}`);
    }
  }
  if (i < buf.length) parts.push(buf.subarray(i));
  return { buf: Buffer.concat(parts), removed };
}

if (fileURLToPath(import.meta.url) === resolve(process.argv[1] ?? '')) {
  for (const f of process.argv.slice(2)) {
    const { buf, removed } = stripGif(readFileSync(f));
    if (removed.length) writeFileSync(f, buf);
    console.log(`${f}: ${removed.length ? `removed ${removed.length} (${[...new Set(removed)].join(', ')})` : 'nothing to remove'}`);
  }
}
