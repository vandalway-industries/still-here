// The workstation's own tools, found through the uncommitted `.env.local` (never in the repository).
// A test that needs one reads it here; when it is missing, the test fails and says which line to add.
//
//   FACTORY_DIR=<the factory checkout>                       the PII gate, the docs-sync check
//   BD_GATE_SELFTEST=<the close gate's self-test script>
//   FACTORY_PII_DENYLIST_PUBLIC=<the public-tier denylist>
//
// Values already in the environment win over the file. (Jules, 2026-10-06)
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const FILE = join(ROOT, '.env.local');

function fromFile(): Record<string, string> {
  if (!existsSync(FILE)) return {};
  const out: Record<string, string> = {};
  for (const line of readFileSync(FILE, 'utf8').split('\n')) {
    const m = /^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/.exec(line);
    if (m) out[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
  return out;
}

/** The value of `name` from the environment or `.env.local`; throws, naming the line to add, when neither has it. */
export function localPath(name: 'FACTORY_DIR' | 'BD_GATE_SELFTEST' | 'FACTORY_PII_DENYLIST_PUBLIC'): string {
  const v = process.env[name] || fromFile()[name];
  if (!v) throw new Error(`${name} is not set: add "${name}=<path>" to .env.local (uncommitted) or the environment`);
  return v;
}
