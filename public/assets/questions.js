// Structure of the condition questions: keys and allowed answer values only.
// The wording lives in i18n/en.js and i18n/ko.js. Shared by the browser and the server.
// Which questions a device gets is decided in categories.js.

export const GRADE_KEYS = ['A', 'A-', 'B+', 'B', 'C'];

export const BASIC = {
  powersOn: ['yes', 'no'],
  imeiOk: ['yes', 'no'],
  icloudOff: ['yes', 'no'], // "account lock removed": iCloud for Apple, Samsung/Google account for Galaxy
  refurbished: ['no', 'yes'],
  sim: ['sim', 'esim'],
};

export const LOOKS = {
  screen: ['A', 'A-', 'B', 'C'],
  body: ['A', 'A-', 'B+', 'B', 'C'],
  backGlass: ['ok', 'cracked'],
  lens: ['ok', 'scratched', 'cracked'],
  bent: ['none', 'light', 'severe'],
  inner: ['ok', 'minor', 'damaged'], // foldables: inner (folding) screen
};

export const SCREEN = {
  glass: ['ok', 'cracked'],
  display: ['ok', 'minor', 'major'],
};

export const MORE = {
  batteryLevel: ['good', 'ok', 'weak'],
  macBattery: ['normal', 'service'],
  repair: ['none', 'official', 'thirdParty'],
  connectivity: ['wifi', 'cellular', 'gps'], // allowed per model: model.connectivity
  material: ['aluminum', 'steel', 'titanium'], // allowed per model: model.materials
};

// Every fault key used by any category (see categories.js for which apply).
export const FAULT_KEYS = [
  'biometric', 'fingerprint', 'touchId', 'camera', 'wifi', 'mic', 'speaker', 'charging', 'vibration', 'buttons',
  'trueTone', 'cameraButton', 'spen', 'hinge', 'pencil', 'cellular', 'keyboard', 'trackpad', 'ports', 'sensors',
];

export const PARTS = { items: ['screen', 'battery', 'camera'], options: ['none', 'genuine', 'unknown'] };
export const EXTRAS = ['box', 'cable', 'receipt', 'pencil', 'keyboard', 'band'];
export const UZIMEI = ['yes', 'no', 'unknown'];

export const REGIONS = [
  'tashkent-city', 'tashkent-region', 'andijan', 'bukhara', 'fergana', 'jizzakh', 'khorezm',
  'namangan', 'navoi', 'kashkadarya', 'karakalpakstan', 'samarkand', 'syrdarya', 'surkhandarya',
];

// ---- wording helpers ----
// Text may differ for Touch ID and Face ID devices: { face, touch }.
export const pick = (v, model) => (v && typeof v === 'object' && !Array.isArray(v) ? v[model?.bio === 'touch' ? 'touch' : 'face'] : v);

// A question's wording; a category can override parts of it with a `${key}_${category}` entry.
export function qText(L, key, cat) {
  const base = L.q[key] || { opts: {} };
  const o = (cat && L.q[`${key}_${cat}`]) || {};
  return { title: o.title ?? base.title, hint: o.hint ?? base.hint, opts: { ...base.opts, ...(o.opts || {}) } };
}
// Option text is either 'Title' or ['Title', 'Description'].
export const opt = (L, q, v, cat) => {
  const o = qText(L, q, cat).opts[v];
  return Array.isArray(o) ? { t: o[0], d: o[1] } : { t: o ?? '—', d: '' };
};
// Fault wording: q = seller question, s = short name in the buyer report.
export function faultText(L, k, model) {
  const f = { ...L.faults[k], ...((model && L.faults[`${k}_${model.category}`]) || {}) };
  return { q: pick(f.q, model), s: pick(f.s, model) };
}
