const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

// Tagged template that escapes interpolations unless they are already-safe HTML (raw()) or arrays of it.
const SAFE = Symbol('safe');
export const raw = (s) => ({ [SAFE]: true, s: String(s) });
const part = (v) => (v == null || v === false ? '' : Array.isArray(v) ? v.map(part).join('') : v[SAFE] ? v.s : esc(v));
export const html = (strings, ...vals) => raw(strings.reduce((out, s, i) => out + s + (i < vals.length ? part(vals[i]) : ''), ''));
export const str = (h) => (h && h[SAFE] ? h.s : String(h ?? ''));

// "+821012345678" → "010-1234-5678" (older 10-digit numbers: "011-123-4567").
export const formatPhone = (p) => {
  const d = String(p).replace(/\D/g, '');
  if (!d.startsWith('82')) return p;
  const n = `0${d.slice(2)}`;
  return n.length === 11 ? `${n.slice(0, 3)}-${n.slice(3, 7)}-${n.slice(7)}` : `${n.slice(0, 3)}-${n.slice(3, 6)}-${n.slice(6)}`;
};

// Lower-case and fold apostrophe variants, for search matching.
export const fold = (s) => String(s || '').toLowerCase().replace(/[ʻʼ'`‘’]/g, "'").replace(/\s+/g, ' ').trim();

export const qs = (params) => {
  const u = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== '' && v != null) u.set(k, v);
  const s = u.toString();
  return s ? `?${s}` : '';
};
