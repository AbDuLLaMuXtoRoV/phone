// Structure of the condition questions: keys and allowed answer values only.
// The wording lives in i18n/en.js and i18n/ko.js. Shared by the browser and the server.

export const GRADE_KEYS = ['A', 'A-', 'B+', 'B', 'C'];

export const BASIC = {
  powersOn: ['yes', 'no'],
  imeiOk: ['yes', 'no'],
  icloudOff: ['yes', 'no'],
  refurbished: ['no', 'yes'],
  sim: ['sim', 'esim'],
};

export const LOOKS = {
  screen: ['A', 'A-', 'B', 'C'],
  body: ['A', 'A-', 'B+', 'B', 'C'],
  backGlass: ['ok', 'cracked'],
  lens: ['ok', 'scratched', 'cracked'],
  bent: ['none', 'light', 'severe'],
};

export const SCREEN = {
  glass: ['ok', 'cracked'],
  display: ['ok', 'minor', 'major'],
};

// `when` decides whether the fault applies to a model (features from src/model-meta.js).
export const FAULTS = [
  { k: 'biometric' }, { k: 'camera' }, { k: 'wifi' }, { k: 'mic' }, { k: 'speaker' },
  { k: 'charging' }, { k: 'vibration' }, { k: 'buttons' },
  { k: 'trueTone', when: (m) => m.trueTone },
  { k: 'cameraButton', when: (m) => m.cameraButton },
];
export const faultApplies = (k, m) => { const f = FAULTS.find((x) => x.k === k); return !!f && !!m && (!f.when || f.when(m)); };

export const PARTS = { items: ['screen', 'battery', 'camera'], options: ['none', 'genuine', 'unknown'] };
export const EXTRAS = ['box', 'cable', 'receipt'];
export const UZIMEI = ['yes', 'no', 'unknown'];

export const REGIONS = [
  'tashkent-city', 'tashkent-region', 'andijan', 'bukhara', 'fergana', 'jizzakh', 'khorezm',
  'namangan', 'navoi', 'kashkadarya', 'karakalpakstan', 'samarkand', 'syrdarya', 'surkhandarya',
];

// Wording helpers. A fault's text may differ for Touch ID and Face ID phones: { face, touch }.
export const pick = (v, model) => (v && typeof v === 'object' && !Array.isArray(v) ? v[model?.bio === 'touch' ? 'touch' : 'face'] : v);
// Option text is either 'Title' or ['Title', 'Description'].
export const opt = (L, q, v) => { const o = L.q[q]?.opts[v]; return Array.isArray(o) ? { t: o[0], d: o[1] } : { t: o ?? '—', d: '' }; };
