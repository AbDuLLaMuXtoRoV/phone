// Catalogues for the categories that have no price list yet: Samsung Galaxy, iPad, MacBook, Apple Watch.
// iPhones come from data/prices.json + src/model-meta.js. Listed newest first inside each series.
// art: drawing in public/assets/art.js. colors: keys of COLORS in src/model-meta.js.

const slug = (s) => s.toLowerCase().replace(/"/g, '').replace(/\+/g, '-plus').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const GB = (...n) => n.map((x) => (x >= 1024 ? `${x / 1024} TB` : `${x} GB`));

// ---- Samsung Galaxy ----
const S = (name, series, year, art, storages, colors, extra = {}) => ({
  id: slug(`galaxy ${name}`), name: `Galaxy ${name}`, category: 'samsung', series, year, art, storages, colors,
  bio: 'fingerprint', glassBack: true, ...extra,
});
const ULTRA = { spen: true };
const PLASTIC = { glassBack: false };
const FOLD = { fold: true };

export const SAMSUNG = {
  series: [
    { key: 'galaxy-s', label: 'Galaxy S' }, { key: 'galaxy-z', label: 'Galaxy Z' },
    { key: 'galaxy-a', label: 'Galaxy A' }, { key: 'galaxy-note', label: 'Galaxy Note' },
  ],
  models: [
    S('S26 Ultra', 'galaxy-s', 2026, 'samsung-ultra', GB(256, 512, 1024), ['black', 'silver', 'blue', 'violet'], ULTRA),
    S('S26+', 'galaxy-s', 2026, 'samsung-s', GB(256, 512), ['black', 'silver', 'blue', 'violet']),
    S('S26', 'galaxy-s', 2026, 'samsung-s', GB(256, 512), ['black', 'silver', 'blue', 'violet']),
    S('S25 Ultra', 'galaxy-s', 2025, 'samsung-ultra', GB(256, 512, 1024), ['titaniumsilver', 'blacktitan', 'titaniumgray', 'whitetitan'], ULTRA),
    S('S25 Edge', 'galaxy-s', 2025, 'samsung-s', GB(256, 512), ['titaniumsilver', 'blacktitan', 'sky']),
    S('S25+', 'galaxy-s', 2025, 'samsung-s', GB(256, 512), ['navy', 'sky', 'mint', 'silver']),
    S('S25', 'galaxy-s', 2025, 'samsung-s', GB(128, 256, 512), ['navy', 'sky', 'mint', 'silver']),
    S('S25 FE', 'galaxy-s', 2025, 'samsung-s', GB(128, 256, 512), ['navy', 'sky', 'white', 'black']),
    S('S24 Ultra', 'galaxy-s', 2024, 'samsung-ultra', GB(256, 512, 1024), ['titaniumgray', 'blacktitan', 'violet', 'yellow'], ULTRA),
    S('S24+', 'galaxy-s', 2024, 'samsung-s', GB(256, 512), ['black', 'graphite', 'violet', 'yellow']),
    S('S24', 'galaxy-s', 2024, 'samsung-s', GB(128, 256, 512), ['black', 'graphite', 'violet', 'yellow']),
    S('S24 FE', 'galaxy-s', 2024, 'samsung-s', GB(128, 256, 512), ['blue', 'graphite', 'gray', 'mint', 'yellow']),
    S('S23 Ultra', 'galaxy-s', 2023, 'samsung-ultra', GB(256, 512, 1024), ['black', 'cream', 'green', 'lavender'], ULTRA),
    S('S23+', 'galaxy-s', 2023, 'samsung-s', GB(256, 512), ['black', 'cream', 'green', 'lavender']),
    S('S23', 'galaxy-s', 2023, 'samsung-s', GB(128, 256, 512), ['black', 'cream', 'green', 'lavender']),
    S('S23 FE', 'galaxy-s', 2023, 'samsung-s', GB(128, 256), ['mint', 'cream', 'graphite', 'purple']),
    S('S22 Ultra', 'galaxy-s', 2022, 'samsung-ultra', GB(128, 256, 512, 1024), ['black', 'white', 'green', 'red'], ULTRA),
    S('S22+', 'galaxy-s', 2022, 'samsung-bump', GB(128, 256), ['black', 'white', 'green', 'pink']),
    S('S22', 'galaxy-s', 2022, 'samsung-bump', GB(128, 256), ['black', 'white', 'green', 'pink']),
    S('S21 FE', 'galaxy-s', 2022, 'samsung-bump', GB(128, 256), ['graphite', 'white', 'lavender', 'green']),
    S('S21 Ultra', 'galaxy-s', 2021, 'samsung-bump', GB(128, 256, 512), ['black', 'silver']),
    S('S21+', 'galaxy-s', 2021, 'samsung-bump', GB(128, 256), ['black', 'silver', 'violet']),
    S('S21', 'galaxy-s', 2021, 'samsung-bump', GB(128, 256), ['gray', 'white', 'violet', 'pink']),
    S('S20 Ultra', 'galaxy-s', 2020, 'samsung-bump', GB(128, 256, 512), ['gray', 'black']),
    S('S20+', 'galaxy-s', 2020, 'samsung-bump', GB(128, 512), ['gray', 'black', 'blue']),
    S('S20', 'galaxy-s', 2020, 'samsung-bump', GB(128), ['gray', 'blue', 'pink']),

    S('Z Fold8 Ultra', 'galaxy-z', 2026, 'fold', GB(256, 512, 1024), ['black', 'silver', 'blue'], FOLD),
    S('Z Fold8', 'galaxy-z', 2026, 'fold', GB(256, 512, 1024), ['black', 'silver', 'blue'], FOLD),
    S('Z Flip8', 'galaxy-z', 2026, 'flip', GB(256, 512), ['black', 'silver', 'blue', 'mint'], FOLD),
    S('Z Fold7', 'galaxy-z', 2025, 'fold', GB(256, 512, 1024), ['navy', 'silver', 'black', 'mint'], FOLD),
    S('Z Flip7', 'galaxy-z', 2025, 'flip', GB(256, 512), ['blue', 'red', 'black', 'mint'], FOLD),
    S('Z Flip7 FE', 'galaxy-z', 2025, 'flip', GB(128, 256), ['black', 'white'], FOLD),
    S('Z Fold6', 'galaxy-z', 2024, 'fold', GB(256, 512, 1024), ['silver', 'pink', 'navy', 'white', 'black'], FOLD),
    S('Z Flip6', 'galaxy-z', 2024, 'flip', GB(256, 512), ['blue', 'yellow', 'mint', 'silver'], FOLD),
    S('Z Fold5', 'galaxy-z', 2023, 'fold', GB(256, 512, 1024), ['cream', 'gray', 'sky', 'black'], FOLD),
    S('Z Flip5', 'galaxy-z', 2023, 'flip', GB(256, 512), ['mint', 'graphite', 'cream', 'lavender'], FOLD),
    S('Z Fold4', 'galaxy-z', 2022, 'fold', GB(256, 512, 1024), ['graphite', 'green', 'gold'], FOLD),
    S('Z Flip4', 'galaxy-z', 2022, 'flip', GB(128, 256, 512), ['graphite', 'lavender', 'gold', 'blue'], FOLD),
    S('Z Fold3', 'galaxy-z', 2021, 'fold', GB(256, 512), ['black', 'green', 'silver'], FOLD),
    S('Z Flip3', 'galaxy-z', 2021, 'flip', GB(128, 256), ['black', 'cream', 'green', 'lavender'], FOLD),

    S('A56', 'galaxy-a', 2025, 'samsung-s', GB(128, 256), ['graphite', 'gray', 'pink', 'green']),
    S('A36', 'galaxy-a', 2025, 'samsung-s', GB(128, 256), ['black', 'white', 'lavender', 'green']),
    S('A26', 'galaxy-a', 2025, 'samsung-s', GB(128, 256), ['black', 'white', 'mint', 'pink'], PLASTIC),
    S('A16', 'galaxy-a', 2024, 'samsung-s', GB(128, 256), ['black', 'gray', 'green'], PLASTIC),
    S('A55', 'galaxy-a', 2024, 'samsung-s', GB(128, 256), ['navy', 'sky', 'lavender', 'yellow']),
    S('A35', 'galaxy-a', 2024, 'samsung-s', GB(128, 256), ['navy', 'sky', 'lavender', 'yellow']),
    S('A25', 'galaxy-a', 2023, 'samsung-s', GB(128, 256), ['black', 'blue', 'yellow', 'sky'], PLASTIC),
    S('A15', 'galaxy-a', 2023, 'samsung-s', GB(128, 256), ['black', 'blue', 'sky', 'yellow'], PLASTIC),
    S('A54', 'galaxy-a', 2023, 'samsung-s', GB(128, 256), ['graphite', 'white', 'violet', 'green']),
    S('A34', 'galaxy-a', 2023, 'samsung-s', GB(128, 256), ['graphite', 'silver', 'violet', 'green'], PLASTIC),

    S('Note20 Ultra', 'galaxy-note', 2020, 'samsung-bump', GB(256, 512), ['black', 'white', 'gold'], ULTRA),
    S('Note20', 'galaxy-note', 2020, 'samsung-bump', GB(256), ['gray', 'green', 'gold'], { ...ULTRA, ...PLASTIC }),
  ],
};

// ---- iPad ----
const P = (name, series, year, art, bio, storages, colors) => ({
  id: slug(name), name, category: 'ipad', series, year, art, bio, storages, colors, connectivity: ['wifi', 'cellular'],
});
const AIR_COLORS = ['gray', 'blue', 'purple', 'starlight'];
const PRO_NEW = ['spaceblack', 'silver'];
const PRO_OLD = ['gray', 'silver'];

export const IPAD = {
  series: [
    { key: 'ipad-pro', label: 'iPad Pro' }, { key: 'ipad-air', label: 'iPad Air' },
    { key: 'ipad', label: 'iPad' }, { key: 'ipad-mini', label: 'iPad mini' },
  ],
  models: [
    P('iPad Pro 13" (M5)', 'ipad-pro', 2025, 'tablet-pro', 'face', GB(256, 512, 1024, 2048), PRO_NEW),
    P('iPad Pro 11" (M5)', 'ipad-pro', 2025, 'tablet-pro', 'face', GB(256, 512, 1024, 2048), PRO_NEW),
    P('iPad Pro 13" (M4)', 'ipad-pro', 2024, 'tablet-pro', 'face', GB(256, 512, 1024, 2048), PRO_NEW),
    P('iPad Pro 11" (M4)', 'ipad-pro', 2024, 'tablet-pro', 'face', GB(256, 512, 1024, 2048), PRO_NEW),
    P('iPad Pro 12.9" (M2)', 'ipad-pro', 2022, 'tablet-pro', 'face', GB(128, 256, 512, 1024, 2048), PRO_OLD),
    P('iPad Pro 11" (M2)', 'ipad-pro', 2022, 'tablet-pro', 'face', GB(128, 256, 512, 1024, 2048), PRO_OLD),
    P('iPad Pro 12.9" (M1)', 'ipad-pro', 2021, 'tablet-pro', 'face', GB(128, 256, 512, 1024, 2048), PRO_OLD),
    P('iPad Pro 11" (M1)', 'ipad-pro', 2021, 'tablet-pro', 'face', GB(128, 256, 512, 1024, 2048), PRO_OLD),
    P('iPad Air 13" (M4)', 'ipad-air', 2026, 'tablet', 'touch', GB(128, 256, 512, 1024), AIR_COLORS),
    P('iPad Air 11" (M4)', 'ipad-air', 2026, 'tablet', 'touch', GB(128, 256, 512, 1024), AIR_COLORS),
    P('iPad Air 13" (M3)', 'ipad-air', 2025, 'tablet', 'touch', GB(128, 256, 512, 1024), AIR_COLORS),
    P('iPad Air 11" (M3)', 'ipad-air', 2025, 'tablet', 'touch', GB(128, 256, 512, 1024), AIR_COLORS),
    P('iPad Air 13" (M2)', 'ipad-air', 2024, 'tablet', 'touch', GB(128, 256, 512, 1024), AIR_COLORS),
    P('iPad Air 11" (M2)', 'ipad-air', 2024, 'tablet', 'touch', GB(128, 256, 512, 1024), AIR_COLORS),
    P('iPad Air (M1)', 'ipad-air', 2022, 'tablet', 'touch', GB(64, 256), ['gray', 'starlight', 'pink', 'purple', 'blue']),
    P('iPad (A16)', 'ipad', 2025, 'tablet', 'touch', GB(128, 256, 512), ['silver', 'blue', 'pink', 'yellow']),
    P('iPad (10th gen)', 'ipad', 2022, 'tablet', 'touch', GB(64, 256), ['silver', 'blue', 'pink', 'yellow']),
    P('iPad (9th gen)', 'ipad', 2021, 'tablet', 'touch', GB(64, 256), ['gray', 'silver']),
    P('iPad mini (A17 Pro)', 'ipad-mini', 2024, 'tablet', 'touch', GB(128, 256, 512), ['gray', 'blue', 'purple', 'starlight']),
    P('iPad mini (6th gen)', 'ipad-mini', 2021, 'tablet', 'touch', GB(64, 256), ['gray', 'pink', 'purple', 'starlight']),
  ],
};

// ---- MacBook ----
const M = (name, series, year, ram, storages, colors) => ({
  id: slug(name), name, category: 'macbook', series, year, art: 'laptop', bio: 'touch', ram, storages, colors,
});
const AIR_NEW = ['midnight', 'starlight', 'silver', 'sky'];
const AIR_OLD = ['midnight', 'starlight', 'silver', 'gray'];

export const MACBOOK = {
  series: [{ key: 'macbook-air', label: 'MacBook Air' }, { key: 'macbook-pro', label: 'MacBook Pro' }],
  models: [
    M('MacBook Air 15" (M5)', 'macbook-air', 2026, [16, 24, 32], GB(512, 1024, 2048, 4096), AIR_NEW),
    M('MacBook Air 13" (M5)', 'macbook-air', 2026, [16, 24, 32], GB(512, 1024, 2048, 4096), AIR_NEW),
    M('MacBook Air 15" (M4)', 'macbook-air', 2025, [16, 24, 32], GB(256, 512, 1024, 2048), AIR_NEW),
    M('MacBook Air 13" (M4)', 'macbook-air', 2025, [16, 24, 32], GB(256, 512, 1024, 2048), AIR_NEW),
    M('MacBook Air 15" (M3)', 'macbook-air', 2024, [8, 16, 24], GB(256, 512, 1024, 2048), AIR_OLD),
    M('MacBook Air 13" (M3)', 'macbook-air', 2024, [8, 16, 24], GB(256, 512, 1024, 2048), AIR_OLD),
    M('MacBook Air 15" (M2)', 'macbook-air', 2023, [8, 16, 24], GB(256, 512, 1024, 2048), AIR_OLD),
    M('MacBook Air 13" (M2)', 'macbook-air', 2022, [8, 16, 24], GB(256, 512, 1024, 2048), AIR_OLD),
    M('MacBook Air 13" (M1)', 'macbook-air', 2020, [8, 16], GB(256, 512, 1024, 2048), ['gold', 'silver', 'gray']),
    M('MacBook Pro 16" (M5 Pro/Max)', 'macbook-pro', 2026, [24, 36, 48, 64, 128], GB(1024, 2048, 4096, 8192), PRO_NEW),
    M('MacBook Pro 14" (M5 Pro/Max)', 'macbook-pro', 2026, [24, 36, 48, 64, 128], GB(1024, 2048, 4096, 8192), PRO_NEW),
    M('MacBook Pro 14" (M5)', 'macbook-pro', 2025, [16, 24, 32], GB(512, 1024, 2048, 4096), PRO_NEW),
    M('MacBook Pro 16" (M4 Pro/Max)', 'macbook-pro', 2024, [24, 36, 48, 64, 128], GB(512, 1024, 2048, 4096, 8192), PRO_NEW),
    M('MacBook Pro 14" (M4 Pro/Max)', 'macbook-pro', 2024, [24, 36, 48, 64, 128], GB(512, 1024, 2048, 4096, 8192), PRO_NEW),
    M('MacBook Pro 14" (M4)', 'macbook-pro', 2024, [16, 24, 32], GB(512, 1024, 2048), PRO_NEW),
    M('MacBook Pro 16" (M3 Pro/Max)', 'macbook-pro', 2023, [18, 36, 48, 64, 128], GB(512, 1024, 2048, 4096, 8192), PRO_NEW),
    M('MacBook Pro 14" (M3 Pro/Max)', 'macbook-pro', 2023, [18, 36, 48, 64, 128], GB(512, 1024, 2048, 4096, 8192), PRO_NEW),
    M('MacBook Pro 14" (M3)', 'macbook-pro', 2023, [8, 16, 24], GB(512, 1024, 2048), PRO_OLD),
    M('MacBook Pro 16" (M2 Pro/Max)', 'macbook-pro', 2023, [16, 32, 64, 96], GB(512, 1024, 2048, 4096, 8192), PRO_OLD),
    M('MacBook Pro 14" (M2 Pro/Max)', 'macbook-pro', 2023, [16, 32, 64, 96], GB(512, 1024, 2048, 4096, 8192), PRO_OLD),
    M('MacBook Pro 13" (M2)', 'macbook-pro', 2022, [8, 16, 24], GB(256, 512, 1024, 2048), PRO_OLD),
    M('MacBook Pro 16" (M1 Pro/Max)', 'macbook-pro', 2021, [16, 32, 64], GB(512, 1024, 2048, 4096, 8192), PRO_OLD),
    M('MacBook Pro 14" (M1 Pro/Max)', 'macbook-pro', 2021, [16, 32, 64], GB(512, 1024, 2048, 4096, 8192), PRO_OLD),
    M('MacBook Pro 13" (M1)', 'macbook-pro', 2020, [8, 16], GB(256, 512, 1024, 2048), PRO_OLD),
  ],
};

// ---- Apple Watch ---- (storages = case sizes, the main spec shown on cards)
const W = (name, series, year, art, sizes, materials, connectivity, colors) => ({
  id: slug(name), name, category: 'watch', series, year, art, storages: sizes, materials, connectivity, colors,
});
export const WATCH = {
  series: [
    { key: 'watch-ultra', label: 'Apple Watch Ultra' }, { key: 'watch-series', label: 'Apple Watch Series' },
    { key: 'watch-se', label: 'Apple Watch SE' },
  ],
  models: [
    W('Apple Watch Ultra 3', 'watch-ultra', 2025, 'watch-ultra', ['49 mm'], ['titanium'], ['cellular'], ['natural', 'blacktitan']),
    W('Apple Watch Ultra 2', 'watch-ultra', 2023, 'watch-ultra', ['49 mm'], ['titanium'], ['cellular'], ['natural', 'blacktitan']),
    W('Apple Watch Ultra', 'watch-ultra', 2022, 'watch-ultra', ['49 mm'], ['titanium'], ['cellular'], ['natural']),
    W('Apple Watch Series 11', 'watch-series', 2025, 'watch', ['42 mm', '46 mm'], ['aluminum', 'titanium'], ['gps', 'cellular'], ['jet', 'rose', 'silver', 'gray', 'natural', 'gold', 'blacktitan']),
    W('Apple Watch Series 10', 'watch-series', 2024, 'watch', ['42 mm', '46 mm'], ['aluminum', 'titanium'], ['gps', 'cellular'], ['jet', 'rose', 'silver', 'natural', 'gold', 'blacktitan']),
    W('Apple Watch Series 9', 'watch-series', 2023, 'watch', ['41 mm', '45 mm'], ['aluminum', 'steel'], ['gps', 'cellular'], ['midnight', 'starlight', 'silver', 'pink', 'red', 'graphite', 'gold']),
    W('Apple Watch Series 8', 'watch-series', 2022, 'watch', ['41 mm', '45 mm'], ['aluminum', 'steel'], ['gps', 'cellular'], ['midnight', 'starlight', 'silver', 'red', 'graphite', 'gold']),
    W('Apple Watch Series 7', 'watch-series', 2021, 'watch', ['41 mm', '45 mm'], ['aluminum', 'steel'], ['gps', 'cellular'], ['midnight', 'starlight', 'green', 'blue', 'red', 'graphite', 'silver', 'gold']),
    W('Apple Watch Series 6', 'watch-series', 2020, 'watch', ['40 mm', '44 mm'], ['aluminum', 'steel'], ['gps', 'cellular'], ['gray', 'silver', 'gold', 'blue', 'red', 'graphite']),
    W('Apple Watch SE 3', 'watch-se', 2025, 'watch', ['40 mm', '44 mm'], ['aluminum'], ['gps', 'cellular'], ['midnight', 'starlight']),
    W('Apple Watch SE (2nd gen)', 'watch-se', 2022, 'watch', ['40 mm', '44 mm'], ['aluminum'], ['gps', 'cellular'], ['midnight', 'starlight', 'silver']),
    W('Apple Watch SE (1st gen)', 'watch-se', 2020, 'watch', ['40 mm', '44 mm'], ['aluminum'], ['gps', 'cellular'], ['gray', 'silver', 'gold']),
  ],
};

export const DEVICE_CATALOGS = { samsung: SAMSUNG, ipad: IPAD, macbook: MACBOOK, watch: WATCH };
