const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

// Tagged template that escapes interpolations unless they are already-safe HTML (raw()) or arrays of it.
const SAFE = Symbol('safe');
export const raw = (s) => ({ [SAFE]: true, s: String(s) });
const part = (v) => (v == null || v === false ? '' : Array.isArray(v) ? v.map(part).join('') : v[SAFE] ? v.s : esc(v));
export const html = (strings, ...vals) => raw(strings.reduce((out, s, i) => out + s + (i < vals.length ? part(vals[i]) : ''), ''));
export const str = (h) => (h && h[SAFE] ? h.s : String(h ?? ''));

export const money = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
export const som = (n) => `${money(n)} soʻm`;
// Short form for tight spaces: 4 250 000 → "4,25 mln"
export const somShort = (n) => (n >= 1e6 ? `${(n / 1e6).toFixed(n >= 1e7 ? 1 : 2).replace(/\.?0+$/, '').replace('.', ',')} mln` : `${money(n / 1000)} ming`);

export const formatPhone = (p) => {
  const d = String(p).replace(/\D/g, '');
  return d.length === 12 ? `+${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8, 10)} ${d.slice(10)}` : p;
};

const MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
export function ago(ts, now = Date.now()) {
  const s = Math.max(0, (now - ts) / 1000);
  if (s < 60) return 'hozirgina';
  if (s < 3600) return `${Math.floor(s / 60)} daqiqa oldin`;
  if (s < 86400) return `${Math.floor(s / 3600)} soat oldin`;
  if (s < 172800) return 'kecha';
  if (s < 7 * 86400) return `${Math.floor(s / 86400)} kun oldin`;
  const d = new Date(ts);
  return `${d.getDate()}-${MONTHS[d.getMonth()]}`;
}

// Fold Uzbek apostrophe variants so "oʻ", "o'", "o`" and "o’" all match.
export const fold = (s) => String(s || '').toLowerCase().replace(/[ʻʼ'`‘’]/g, "'").replace(/\s+/g, ' ').trim();

export const qs = (params) => {
  const u = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== '' && v != null) u.set(k, v);
  const s = u.toString();
  return s ? `?${s}` : '';
};
