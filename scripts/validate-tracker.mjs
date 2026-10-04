#!/usr/bin/env node
// Validate company/tracker/tracker.jsonl against company/tracker/schema.json.
// A small JSON Schema validator for exactly the keywords schema.json uses (type, enum, const,
// pattern, minLength, minimum, maximum, required, properties, additionalProperties, items,
// contains, uniqueItems, $ref to #/$defs), plus the tracker's own rules: unique external refs,
// closed issues carry closed_at, and no instant is later than updated_at.
// Usage: node scripts/validate-tracker.mjs [tracker.jsonl] [schema.json]
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const KNOWN = new Set(['$schema', '$id', '$defs', '$ref', 'title', 'description', 'type', 'enum', 'const', 'pattern', 'minLength', 'minimum', 'maximum', 'required', 'properties', 'additionalProperties', 'items', 'contains', 'uniqueItems']);

const typeOf = (v) => (v === null ? 'null' : Array.isArray(v) ? 'array' : Number.isInteger(v) ? 'integer' : typeof v);
const typeOk = (v, t) => typeOf(v) === t || (t === 'number' && typeof v === 'number');

export function validate(value, schema, root = schema, path = '$') {
  const errors = [];
  for (const k of Object.keys(schema)) if (!KNOWN.has(k)) throw new Error(`schema keyword not supported: ${k}`);
  if (schema.$ref) {
    const m = /^#\/\$defs\/(.+)$/.exec(schema.$ref);
    if (!m || !root.$defs?.[m[1]]) throw new Error(`unresolved $ref ${schema.$ref}`);
    errors.push(...validate(value, root.$defs[m[1]], root, path));
  }
  if (schema.type && !typeOk(value, schema.type)) return [...errors, `${path}: expected ${schema.type}, got ${typeOf(value)}`];
  if (schema.enum && !schema.enum.includes(value)) errors.push(`${path}: ${JSON.stringify(value)} not in ${JSON.stringify(schema.enum)}`);
  if ('const' in schema && value !== schema.const) errors.push(`${path}: expected ${JSON.stringify(schema.const)}`);
  if (typeof value === 'string') {
    if (schema.pattern && !new RegExp(schema.pattern, 'u').test(value)) errors.push(`${path}: does not match ${schema.pattern}`);
    if (schema.minLength != null && [...value].length < schema.minLength) errors.push(`${path}: shorter than ${schema.minLength}`);
  }
  if (typeof value === 'number') {
    if (schema.minimum != null && value < schema.minimum) errors.push(`${path}: below ${schema.minimum}`);
    if (schema.maximum != null && value > schema.maximum) errors.push(`${path}: above ${schema.maximum}`);
  }
  if (Array.isArray(value)) {
    if (schema.items) value.forEach((v, i) => errors.push(...validate(v, schema.items, root, `${path}[${i}]`)));
    if (schema.contains && !value.some((v) => validate(v, schema.contains, root).length === 0)) errors.push(`${path}: contains no ${JSON.stringify(schema.contains)}`);
    if (schema.uniqueItems && new Set(value.map((v) => JSON.stringify(v))).size !== value.length) errors.push(`${path}: items not unique`);
  }
  if (typeOf(value) === 'object') {
    for (const r of schema.required ?? []) if (!(r in value)) errors.push(`${path}: missing ${r}`);
    for (const [k, v] of Object.entries(value)) {
      if (schema.properties?.[k]) errors.push(...validate(v, schema.properties[k], root, `${path}.${k}`));
      else if (schema.additionalProperties === false) errors.push(`${path}: unexpected property ${k}`);
    }
  }
  return errors;
}

export function validateTracker(jsonlPath = join(ROOT, 'company/tracker/tracker.jsonl'), schemaPath = join(ROOT, 'company/tracker/schema.json')) {
  const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));
  const lines = readFileSync(jsonlPath, 'utf8').split('\n').filter((l) => l.trim());
  const errors = [];
  const refs = new Set();
  lines.forEach((line, i) => {
    let row;
    try {
      row = JSON.parse(line);
    } catch (e) {
      errors.push(`line ${i + 1}: not JSON`);
      return;
    }
    const at = `line ${i + 1} (${row.external_ref ?? '?'})`;
    errors.push(...validate(row, schema).map((e) => `${at} ${e}`));
    if (refs.has(row.external_ref)) errors.push(`${at}: duplicate external_ref`);
    refs.add(row.external_ref);
    if (row.status === 'closed' && !row.closed_at) errors.push(`${at}: closed without closed_at`);
    if (row.status !== 'closed' && row.closed_at) errors.push(`${at}: closed_at on a ${row.status} issue`);
    for (const k of ['created_at', 'closed_at']) {
      if (row[k] && row.updated_at && row[k] > row.updated_at) errors.push(`${at}: ${k} is after updated_at`);
    }
  });
  return { count: lines.length, errors };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [jsonl, schema] = process.argv.slice(2);
  const { count, errors } = validateTracker(jsonl && resolve(jsonl), schema && resolve(schema));
  for (const e of errors) console.log(e);
  console.log(`tracker: ${count} issue(s), ${errors.length} error(s)`);
  process.exit(errors.length ? 1 : 0);
}
