#!/usr/bin/env node
// Build the published site: copy src/ into site/, the one folder the Pages workflow uploads.
// Writes inside site/ only. site/ is in .gitignore. Later phases add their steps here.
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');
const OUT = join(ROOT, 'site');

if (relative(ROOT, OUT) !== 'site') throw new Error('build output must be site/');
if (!existsSync(SRC)) throw new Error('src/ is missing');

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync(SRC, OUT, {
  recursive: true,
  // Nothing from the records, the pack or dotfiles reaches the site.
  filter: (from) => !/(^|\/)\.[^/]/.test(relative(SRC, from)),
});
if (!existsSync(join(OUT, '404.html'))) throw new Error('site/404.html was not written');
console.log(`built site/ from src/`);
