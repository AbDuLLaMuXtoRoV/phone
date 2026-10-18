// The phone catalogue = price list (data/prices.json) + model facts (src/model-meta.js).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './paths.js';
import { COLORS, MODEL_META, DEFAULT_META } from './model-meta.js';

const prices = JSON.parse(readFileSync(join(ROOT, 'data', 'prices.json'), 'utf8'));

export const MODELS = prices.models.map((m) => {
  const meta = MODEL_META[m.id];
  if (!meta) console.warn(`[catalog] No metadata for "${m.id}" — using defaults. Add it to src/model-meta.js.`);
  const { colors, name, ...facts } = meta || DEFAULT_META;
  return {
    ...facts,
    id: m.id,
    name: name || m.name,
    storages: m.storages,
    deductions: m.deductions,
    tiers: m.tiers,
    scrap: m.scrap,
    colors: colors.map((k) => ({ k, hex: COLORS[k] })),
  };
});

// Order for every list shown to people: newest series first (SE last), and inside a series
// Pro Max → Pro → Air → Plus → base → mini/e, so the cheaper side models never top the list.
const seriesRank = (s) => (s === 'SE' ? -1 : s === 'X' ? 10 : parseInt(s, 10) || 0);
const tier = (name) => (/Pro Max/.test(name) ? 0 : /Pro/.test(name) ? 1 : /Air/.test(name) ? 2
  : /Plus|Max/.test(name) ? 3 : /mini|\de$/.test(name) ? 5 : 4);
export const MODELS_NEWEST = [...MODELS].sort((a, b) =>
  seriesRank(b.series) - seriesRank(a.series) || tier(a.name) - tier(b.name) || b.year - a.year
  || MODELS.indexOf(b) - MODELS.indexOf(a));
export const SERIES = [...new Set(MODELS_NEWEST.map((m) => m.series))];
export const seriesLabel = (s) => (s === 'SE' ? 'iPhone SE' : `iPhone ${s}`);
export const byId = (id) => MODELS.find((m) => m.id === id);
export const PRICE_SOURCE = { file: prices.source, importedAt: prices.importedAt };

export const colorOf = (model, key) => model?.colors.find((c) => c.k === key) || null;
