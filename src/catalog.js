// The device catalogue: iPhones (price list + model facts) and the other categories (src/devices.js).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './paths.js';
import { COLORS, MODEL_META, DEFAULT_META } from './model-meta.js';
import { DEVICE_CATALOGS } from './devices.js';
import { CATEGORY_KEYS } from '../public/assets/categories.js';

const prices = JSON.parse(readFileSync(join(ROOT, 'data', 'prices.json'), 'utf8'));
const withColors = (keys) => keys.map((k) => ({ k, hex: COLORS[k] || '#C9CDD3' }));

const IPHONES = prices.models.map((m) => {
  const meta = MODEL_META[m.id];
  if (!meta) console.warn(`[catalog] No metadata for "${m.id}" — using defaults. Add it to src/model-meta.js.`);
  const { colors, name, cam, ...facts } = meta || DEFAULT_META;
  return {
    ...facts,
    id: m.id,
    name: name || m.name,
    category: 'iphone',
    priced: true,
    art: cam,
    storages: m.storages,
    deductions: m.deductions,
    tiers: m.tiers,
    scrap: m.scrap,
    colors: withColors(colors),
  };
});

// Other categories have no price list: storages are plain labels.
const OTHERS = CATEGORY_KEYS.filter((c) => c !== 'iphone').flatMap((c) => DEVICE_CATALOGS[c].models.map((m) => ({
  ...m,
  priced: false,
  storages: m.storages.map((label) => ({ label })),
  colors: withColors(m.colors),
})));

export const MODELS = [...IPHONES, ...OTHERS];

// ---- series ----
// iPhone series come from the price list (17, 16, … 6, SE); other categories define theirs in devices.js.
const iphoneRank = (s) => (s === 'SE' ? -1 : s === 'X' ? 10 : parseInt(s, 10) || 0);
const IPHONE_SERIES = [...new Set(IPHONES.map((m) => m.series))].sort((a, b) => iphoneRank(b) - iphoneRank(a));
const SERIES_DEF = [
  ...IPHONE_SERIES.map((key) => ({ key, label: key === 'SE' ? 'iPhone SE' : `iPhone ${key}`, short: key, category: 'iphone' })),
  ...CATEGORY_KEYS.filter((c) => c !== 'iphone').flatMap((c) => DEVICE_CATALOGS[c].series.map((s) => ({ ...s, short: s.label, category: c }))),
];
export const SERIES = SERIES_DEF.map((s) => s.key);
export const seriesOf = (cat) => SERIES_DEF.filter((s) => s.category === cat).map((s) => s.key);
export const seriesLabel = (key) => SERIES_DEF.find((s) => s.key === key)?.label || key;
export const seriesShort = (key) => SERIES_DEF.find((s) => s.key === key)?.short || key;
export const catOfSeries = (key) => SERIES_DEF.find((s) => s.key === key)?.category;

// Display order: category, then series, then (iPhone) Pro Max → Pro → Air → Plus → base → mini/e,
// (others) the order written in devices.js, which is newest and top model first.
const tier = (name) => (/Pro Max/.test(name) ? 0 : /Pro/.test(name) ? 1 : /Air/.test(name) ? 2
  : /Plus|Max/.test(name) ? 3 : /mini|\de$/.test(name) ? 5 : 4);
export const MODELS_NEWEST = [...MODELS].sort((a, b) =>
  CATEGORY_KEYS.indexOf(a.category) - CATEGORY_KEYS.indexOf(b.category)
  || SERIES.indexOf(a.series) - SERIES.indexOf(b.series)
  || (a.category === 'iphone' ? tier(a.name) - tier(b.name) || b.year - a.year || MODELS.indexOf(b) - MODELS.indexOf(a) : 0)
  || MODELS.indexOf(a) - MODELS.indexOf(b));

export const byId = (id) => MODELS.find((m) => m.id === id);
export const PRICE_SOURCE = { file: prices.source, importedAt: prices.importedAt };
export const colorOf = (model, key) => model?.colors.find((c) => c.k === key) || null;

// One model per category for category tiles and illustrations.
export const CATEGORY_SHOWCASE = {
  iphone: ['iphone-17-pro', 'orange'],
  samsung: ['galaxy-s25-ultra', 'titaniumsilver'],
  ipad: ['ipad-pro-11-m4', 'silver'],
  macbook: ['macbook-air-13-m4', 'sky'],
  watch: ['apple-watch-series-10', 'jet'],
};
