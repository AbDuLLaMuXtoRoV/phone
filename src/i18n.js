// Language choice per request: ?lang= (remembered in a cookie) > cookie > browser language > English.
// Currency the same way: ?cur= > cookie > the language's default (won for Korean, dollars otherwise).
import en from '../public/assets/i18n/en.js';
import ko from '../public/assets/i18n/ko.js';
import { CURRENCIES, defaultCurrency } from '../public/assets/money.js';

export const LANGS = { en, ko };
export const DEFAULT_LANG = 'en';

export function pickLang(req, url) {
  const q = url.searchParams.get('lang');
  if (q && LANGS[q]) return { lang: q, remember: true };
  const c = /(?:^|;\s*)lang=(\w+)/.exec(req.headers.cookie || '')?.[1];
  if (c && LANGS[c]) return { lang: c, remember: false };
  const first = (req.headers['accept-language'] || '').split(',')[0].trim().toLowerCase();
  return { lang: first.startsWith('ko') ? 'ko' : DEFAULT_LANG, remember: false };
}

export function pickCurrency(req, url, lang) {
  const q = String(url.searchParams.get('cur') || '').toUpperCase();
  if (CURRENCIES.includes(q)) return { cur: q, remember: true };
  const c = /(?:^|;\s*)cur=(\w+)/.exec(req.headers.cookie || '')?.[1];
  if (CURRENCIES.includes(c)) return { cur: c, remember: false };
  return { cur: defaultCurrency(lang), remember: false };
}

export const langCookie = (lang) => `lang=${lang}; Path=/; Max-Age=31536000; SameSite=Lax`;
export const curCookie = (cur) => `cur=${cur}; Path=/; Max-Age=31536000; SameSite=Lax`;
