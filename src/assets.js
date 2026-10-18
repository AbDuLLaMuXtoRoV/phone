// Cache-busting URLs for /assets/*: the query string is a hash of the file, so browsers can cache forever.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { ROOT } from './paths.js';

const cache = new Map();
export function asset(name) {
  if (process.env.NODE_ENV === 'production' && cache.has(name)) return cache.get(name);
  const hash = createHash('md5').update(readFileSync(join(ROOT, 'public', 'assets', name))).digest('hex').slice(0, 8);
  const url = `/assets/${name}?v=${hash}`;
  cache.set(name, url);
  return url;
}
