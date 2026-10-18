// Imports the used-iPhone price list (xlsx) into data/prices.json.
// Zero dependencies: an xlsx file is a zip of XML, so we unzip with zlib and read cells with regexes.
//
//   node scripts/import-prices.mjs [path/to/Apple_Used_Price_List_EN.xlsx]
//
// All prices in the sheet are in units of 10,000 KRW (see the "Notes & Glossary" sheet).

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { inflateRawSync } from 'node:zlib';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = process.argv[2] || join(homedir(), 'Downloads', 'Apple_Used_Price_List_EN.xlsx');
const OUT = join(ROOT, 'data', 'prices.json');

function unzip(buf) {
  let eocd = buf.length - 22;
  while (eocd >= 0 && buf.readUInt32LE(eocd) !== 0x06054b50) eocd--;
  if (eocd < 0) throw new Error('Not a zip/xlsx file');
  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const files = {};
  for (let i = 0; i < count; i++) {
    const method = buf.readUInt16LE(p + 10);
    const csize = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const localOff = buf.readUInt32LE(p + 42);
    const name = buf.toString('utf8', p + 46, p + 46 + nameLen);
    const start = localOff + 30 + buf.readUInt16LE(localOff + 26) + buf.readUInt16LE(localOff + 28);
    const data = buf.subarray(start, start + csize);
    files[name] = (method === 0 ? data : inflateRawSync(data)).toString('utf8');
    p += 46 + nameLen + extraLen + commentLen;
  }
  return files;
}

const decode = (s) => s
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
  .replace(/&amp;/g, '&');

const colIndex = (letters) => [...letters].reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0) - 1;
const parseRef = (ref) => { const m = /^([A-Z]+)(\d+)$/.exec(ref); return { c: colIndex(m[1]), r: +m[2] }; };

function readSheet(xml, shared) {
  const grid = new Map(); // "r,c" -> string
  const cellRe = /<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g;
  let m;
  while ((m = cellRe.exec(xml))) {
    const attrs = m[1];
    const inner = m[2] || '';
    const ref = /\br="([A-Z]+\d+)"/.exec(attrs)?.[1];
    if (!ref) continue;
    const type = /\bt="([^"]+)"/.exec(attrs)?.[1];
    let val = '';
    if (type === 'inlineStr') val = [...inner.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map((x) => x[1]).join('');
    else if (type === 's') val = shared[+(/<v>([\s\S]*?)<\/v>/.exec(inner)?.[1] ?? -1)] ?? '';
    else val = /<v>([\s\S]*?)<\/v>/.exec(inner)?.[1] ?? '';
    val = decode(val).trim();
    const { r, c } = parseRef(ref);
    if (val !== '') grid.set(`${r},${c}`, val);
  }
  // Merged cells only store a value in the top-left cell; copy it to the whole range.
  for (const [, range] of xml.matchAll(/<mergeCell ref="([A-Z]+\d+:[A-Z]+\d+)"/g)) {
    const [a, b] = range.split(':').map(parseRef);
    const v = grid.get(`${a.r},${a.c}`);
    if (v === undefined) continue;
    for (let r = a.r; r <= b.r; r++) for (let c = a.c; c <= b.c; c++) grid.set(`${r},${c}`, v);
  }
  const rows = [];
  for (const key of grid.keys()) rows[+key.split(',')[0]] ||= true;
  return { get: (r, c) => grid.get(`${r},${c}`) ?? '', maxRow: rows.length - 1 };
}

// Header text -> field key. Matched on the normalised start of the header cell.
const HEADERS = [
  ['model', 'model'], ['storage', 'storage'],
  ['a grade', 'A'], ['a- grade', 'A-'], ['b+ grade', 'B+'], ['b- grade', 'B'],
  ['battery below std. a', 'battA'], ['battery below std. b+', 'battBp'],
  ['used price', 'base'], ['screen broken', 'glass'], ['genuine-parts', 'tiers'],
  ['lcd', 'display'], ['fingerprint', 'biometric'], ['camera', 'camera'], ['wi-fi', 'wifi'],
  ['mic', 'mic'], ['back glass', 'backGlass'], ['true tone', 'trueTone'],
  ['non-genuine', 'nonGenuine'], ['scrap', 'scrap'], ['apple details', 'notes'],
];

const NAME_FIXES = {
  'iPhone SE 2': 'iPhone SE 2', 'iPhone SE 3': 'iPhone SE 3',
  'iPhone 6+': 'iPhone 6 Plus', 'iPhone 6S': 'iPhone 6s', 'iPhone 6S+': 'iPhone 6s Plus',
  'iPhone 7+': 'iPhone 7 Plus', 'iPhone 8+': 'iPhone 8 Plus', 'iPhone XS MAX': 'iPhone XS Max',
  'iPhone 16 E': 'iPhone 16e', 'iPhone 17 AIR': 'iPhone Air',
};
const prettyName = (raw) => NAME_FIXES[raw] || raw
  .replace(/\bPRO MAX\b/, 'Pro Max').replace(/\bPRO\b/, 'Pro').replace(/\bMINI\b/, 'mini').replace(/\bPLUS\b/, 'Plus');
const slug = (s) => s.toLowerCase().replace(/\+/g, '-plus').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const price = (s) => {
  if (s === '' || s == null) return null;
  if (/^x$/i.test(s)) return 'X';
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};
// Deductions are stored as positive magnitudes. "No deduction (차감X)" -> 0, blank -> null.
// A few cells were transcribed without the minus sign (iPhone 7 camera "1", XS Max camera "2"); abs() fixes them.
const deduction = (s) => {
  if (s === '' || s == null) return null;
  if (/no deduction/i.test(s)) return 0;
  const m = /^(-?[\d.]+)\s*(?:\((-?[\d.]+)\))?$/.exec(s.replace(/\s+/g, ''));
  if (!m) return null;
  return m[2] !== undefined ? { main: Math.abs(+m[1]), minor: Math.abs(+m[2]) } : Math.abs(+m[1]);
};
const parseTiers = (s) => {
  if (!s) return null;
  const vals = [...s.matchAll(/(\d)\s*items?\s*:\s*(-?[\d.]+|non-genuine)/gi)]
    .sort((a, b) => a[1] - b[1]).map((m) => (/non/i.test(m[2]) ? 'nonGenuine' : Math.abs(+m[2])));
  return vals.length ? vals : null;
};

const files = unzip(readFileSync(SRC));
const shared = files['xl/sharedStrings.xml']
  ? [...files['xl/sharedStrings.xml'].matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) => decode([...m[1].matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map((x) => x[1]).join('')))
  : [];
const sheet = readSheet(files['xl/worksheets/sheet1.xml'], shared);

let cols = null;
const models = [];
for (let r = 1; r <= sheet.maxRow; r++) {
  if (/^model$/i.test(sheet.get(r, 0))) {
    cols = {};
    for (let c = 0; c < 30; c++) {
      const h = sheet.get(r, c).toLowerCase().replace(/\s+/g, ' ').trim();
      if (!h) continue;
      // Longest matching prefix wins ("a- grade" must not match "a grade").
      const hit = HEADERS.filter(([p]) => h.startsWith(p)).sort((x, y) => y[0].length - x[0].length)[0];
      if (hit && cols[hit[1]] === undefined) cols[hit[1]] = c;
    }
    continue;
  }
  if (!cols) continue;
  const raw = sheet.get(r, cols.model);
  const storage = sheet.get(r, cols.storage);
  const sm = /^(\d+)\s*([GT])B?$/i.exec(storage);
  if (!raw || !sm) continue;

  let model = models.find((m) => m.raw === raw);
  if (!model) {
    const g = (k) => (cols[k] === undefined ? '' : sheet.get(r, cols[k]));
    const display = deduction(g('display'));
    const battText = g('battA');
    // iPhone SE 2/3: the battery columns hold a combined rule instead of prices:
    // "Battery below standard / genuine-parts message: 1 item -4, 2 items -6, 3 items -8".
    const seTiers = price(battText) === null && /item/i.test(battText) ? parseTiers(battText) : null;
    model = {
      raw,
      name: prettyName(raw),
      id: slug(prettyName(raw)),
      storages: [],
      deductions: {
        glass: deduction(g('glass')),
        display: display && typeof display === 'object' ? display.main : display,
        displayMinor: display && typeof display === 'object' ? display.minor : null,
        biometric: deduction(g('biometric')),
        camera: deduction(g('camera')),
        wifi: deduction(g('wifi')),
        mic: deduction(g('mic')),
        backGlass: deduction(g('backGlass')),
        trueTone: deduction(g('trueTone')),
        nonGenuine: deduction(g('nonGenuine')),
      },
      tiers: seTiers ? { values: seTiers, batteryAsItem: true } : (parseTiers(g('tiers')) ? { values: parseTiers(g('tiers')) } : null),
      scrap: price(g('scrap')),
      notes: g('notes') || null,
    };
    models.push(model);
  }
  const gb = sm[2].toUpperCase() === 'T' ? +sm[1] * 1024 : +sm[1];
  const gp = (k) => (cols[k] === undefined ? null : price(sheet.get(r, cols[k])));
  model.storages.push({
    label: gb >= 1024 ? `${gb / 1024} TB` : `${gb} GB`,
    gb,
    A: gp('A'), 'A-': gp('A-'), 'B+': gp('B+'), B: gp('B'),
    battA: model.tiers?.batteryAsItem ? null : gp('battA'),
    battBp: model.tiers?.batteryAsItem ? null : gp('battBp'),
    base: gp('base'),
  });
}

for (const m of models) delete m.raw;
const out = {
  source: basename(SRC),
  unitKRW: 10000,
  importedAt: new Date().toISOString(),
  models,
};
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log(`Imported ${models.length} models, ${models.reduce((n, m) => n + m.storages.length, 0)} storage rows -> ${OUT}`);
