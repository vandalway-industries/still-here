#!/usr/bin/env node
// Check the built security.txt before it is published (PRD R35, RFC 9116): it names our private
// vulnerability reporting address, and its Expires is a valid RFC 3339 time at least 30 days and at
// most 365 days away. Fewer than 30 days fails, so the Pages workflow stops before the upload and a
// file about to lapse is never published. The build takes Expires from one line in scripts/build.mjs, renewed yearly.
// Usage: node scripts/check-security-txt.mjs [site]     (npm run check:security-txt)
// (Jules, 2026-10-05)
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DAY = 86_400_000;
const MIN_DAYS = 30;
const MAX_DAYS = 365;
const CONTACT = 'Contact: https://github.com/vandalway-industries/still-here/security/advisories/new';
const RFC3339 = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(Z|[+-]\d\d:\d\d)$/;

const root = process.argv[2] ?? 'site';
const file = join(root, '.well-known', 'security.txt');
const fail = (why) => {
  console.error(`check:security-txt: ${why}`);
  process.exit(1);
};

if (!existsSync(file)) fail(`${file} is missing (run npm run build first)`);
const lines = readFileSync(file, 'utf8').split(/\r?\n/);
if (!lines.includes(CONTACT)) fail(`${file} does not carry "${CONTACT}"`);
const expiresLines = lines.filter((l) => /^Expires:/i.test(l));
if (expiresLines.length !== 1) fail(`${file} needs exactly one Expires field, found ${expiresLines.length}`);
const expires = expiresLines[0].slice(expiresLines[0].indexOf(':') + 1).trim();
if (!RFC3339.test(expires) || Number.isNaN(Date.parse(expires))) fail(`Expires "${expires}" is not an RFC 3339 time`);
const days = (Date.parse(expires) - Date.now()) / DAY;
if (days < MIN_DAYS) fail(`Expires ${expires} is ${days.toFixed(1)} days away, fewer than ${MIN_DAYS}: rebuild to renew it`);
if (days > MAX_DAYS + 1) fail(`Expires ${expires} is ${days.toFixed(1)} days away, more than ${MAX_DAYS}`);
console.log(`check:security-txt: Expires ${expires}, ${Math.floor(days)} days away`);
