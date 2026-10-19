// Structure of the condition questions: keys and allowed answer values only.
// The wording lives in i18n/en.js and i18n/ko.js. Shared by the browser and the server.
// Which questions a device gets is decided in categories.js.

export const GRADE_KEYS = ['A', 'A-', 'B+', 'B', 'C'];

export const BASIC = {
  powersOn: ['yes', 'no'],
  imeiOk: ['yes', 'no'],
  icloudOff: ['yes', 'no'], // "account lock removed": iCloud for Apple, Samsung/Google account for Galaxy
  refurbished: ['no', 'yes'],
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

// Korea's 17 provinces and metropolitan cities.
export const REGIONS = [
  'seoul', 'busan', 'daegu', 'incheon', 'gwangju', 'daejeon', 'ulsan', 'sejong', 'gyeonggi',
  'gangwon', 'chungbuk', 'chungnam', 'jeonbuk', 'jeonnam', 'gyeongbuk', 'gyeongnam', 'jeju',
];

// A Korean mobile number as typed ("010-1234-5678", "+82 10 1234 5678"…) → "01012345678", or null.
export function koreanMobile(input) {
  let d = String(input ?? '').replace(/\D/g, '');
  if (d.startsWith('82')) d = `0${d.slice(2).replace(/^0/, '')}`;
  // 010 numbers always have 11 digits; the old 011 and 016–019 ones can have 10.
  return /^(010\d{8}|01[16-9]\d{7,8})$/.test(d) ? d : null;
}

// KakaoTalk contact: an ID (4–20 letters, numbers, . _ -) or an open chat link. '' when empty, null when invalid.
export function kakaoContact(input) {
  const v = String(input ?? '').trim();
  if (!v) return '';
  const link = /^(?:https?:\/\/)?open\.kakao\.com\/o\/([A-Za-z0-9]{4,20})\/?$/.exec(v);
  if (link) return `https://open.kakao.com/o/${link[1]}`;
  const id = v.replace(/^@/, '');
  return /^[A-Za-z0-9._-]{4,20}$/.test(id) ? id : null;
}

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
