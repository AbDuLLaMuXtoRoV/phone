// Small helpers shared by app.js and sell.js, plus the language pack for this page.

export const $ = (s, el = document) => el.querySelector(s);
export const $$ = (s, el = document) => [...el.querySelectorAll(s)];

const lang = ['en', 'ko'].includes(document.documentElement.lang) ? document.documentElement.lang : 'en';
export const L = (await import(`./i18n/${lang}.js`)).default;

export const digits = (s) => String(s || '').replace(/\D/g, '');
export const fold = (s) => String(s || '').toLowerCase().replace(/[ʻʼ'`‘’]/g, "'").replace(/\s+/g, ' ').trim();
export const escHtml = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// localStorage can be missing or throw (private mode, blocked storage): never let that break the page.
export const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
  },
  session: {
    get(key, fallback) { try { const v = sessionStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
    set(key, value) { try { sessionStorage.setItem(key, JSON.stringify(value)); } catch { /* full or unavailable */ } },
    del(key) { try { sessionStorage.removeItem(key); } catch { /* unavailable */ } },
  },
};

let toastTimer;
export function toast(text) {
  const el = $('.toast');
  if (!el) return;
  el.textContent = text;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 2600);
}

export const icon = (name, cls = '') => `<svg class="ic ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
