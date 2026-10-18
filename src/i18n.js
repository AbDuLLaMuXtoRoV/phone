// Language choice per request: ?lang= (remembered in a cookie) > cookie > browser language > English.
import en from '../public/assets/i18n/en.js';
import ko from '../public/assets/i18n/ko.js';

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

export const langCookie = (lang) => `lang=${lang}; Path=/; Max-Age=31536000; SameSite=Lax`;
