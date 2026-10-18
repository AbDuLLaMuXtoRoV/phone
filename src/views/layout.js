import { html, raw, str } from '../util.js';
import { icon, sprite } from './icons.js';
import { asset } from '../assets.js';
import { LANGS } from '../i18n.js';
import config from '../config.js';

export const logo = raw(`<svg class="logo-mark" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="var(--brand)"/><rect x="10" y="6" width="12" height="20" rx="3" fill="none" stroke="#fff" stroke-width="2"/><path d="m13 16.5 2.2 2.2 4-4.4" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`);

const LANG_LABEL = { en: 'EN', ko: '한국어' };

// The same page in another language: current URL with ?lang= set (the server remembers it in a cookie).
function langHref(here, code) {
  const u = new URL(here || '/', 'http://x');
  u.searchParams.set('lang', code);
  return u.pathname + u.search;
}

/**
 * @param {object} L             language pack (public/assets/i18n/*.js)
 * @param {object} o
 * @param {string} o.here        current path + query, for the language switch
 * @param {string} [o.title]     page title (site name is appended)
 * @param {*} o.body             html`` result
 * @param {string} [o.active]    which tab/nav item is current
 * @param {{href:string,label:string}} [o.back]  back button + title in the mobile header instead of the logo
 * @param {boolean} [o.focus]    hide the bottom tab bar (pages with their own sticky action bar)
 * @param {string[]} [o.scripts] extra module scripts from /assets
 */
export function layout(L, { here, title, description, body, active = '', back = null, focus = false, scripts = [] }) {
  const t = L.t;
  const fullTitle = title ? `${title} — ${config.siteName}` : `${config.siteName} — ${t.titleDefault}`;
  const desc = description || t.descDefault;
  const cur = (key) => raw(active === key ? 'aria-current="page"' : '');
  const tabs = [
    { href: '/', key: 'home', t: t.tabHome, i: 'home' },
    { href: '/phones', key: 'buy', t: t.tabPhones, i: 'grid' },
    { href: '/sell', key: 'sell', t: t.tabSell, i: 'plus', main: true },
    { href: '/saved', key: 'fav', t: t.tabSaved, i: 'heart' },
    { href: '/my-listings', key: 'mine', t: t.tabMine, i: 'list' },
  ];
  const langSwitch = html`<nav class="lang" aria-label="${t.langSwitch}">
    ${Object.keys(LANGS).map((code) => html`<a href="${langHref(here, code)}" lang="${code}" hreflang="${code}" ${raw(code === L.lang ? 'aria-current="true"' : '')}>${LANG_LABEL[code]}</a>`)}
  </nav>`;

  return '<!doctype html>' + str(html`<html lang="${L.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${fullTitle}</title>
<meta name="description" content="${desc}">
<meta property="og:title" content="${fullTitle}">
<meta property="og:description" content="${desc}">
${Object.keys(LANGS).map((code) => html`<link rel="alternate" hreflang="${code}" href="${langHref(here, code)}">`)}
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0d1320" media="(prefers-color-scheme: dark)">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="stylesheet" href="${asset('app.css')}">
</head>
<body class="${focus ? 'is-focus' : ''}">
${sprite}
<a class="skip" href="#main">${t.skip}</a>
<header class="topbar">
  <div class="topbar-in">
    ${back
      ? html`<a class="topbar-back" href="${back.href}" data-back aria-label="${t.back}">${icon('back')}</a><span class="topbar-title">${back.label}</span>`
      : ''}
    <a class="brand${back ? ' brand-desktop' : ''}" href="/" aria-label="${config.siteName} — ${t.home}">${logo}<span>${config.siteName.replace(/bozor$/i, '')}<b>${/bozor$/i.test(config.siteName) ? 'bozor' : ''}</b></span></a>
    <nav class="topnav" aria-label="${t.navMain}">
      <a href="/phones" ${cur('buy')}>${t.navPhones}</a>
      <a href="/prices" ${cur('prices')}>${t.navPrices}</a>
      <a href="/saved" ${cur('fav')}>${t.navSaved}</a>
      <a href="/my-listings" ${cur('mine')}>${t.navMine}</a>
    </nav>
    <form class="topsearch" action="/phones" role="search">
      ${icon('search')}
      <input type="search" name="q" placeholder="${t.searchPh}" aria-label="${t.searchAria}" enterkeyhint="search">
    </form>
    ${langSwitch}
    <a class="topbar-icon" href="/phones?focus=q" aria-label="${t.searchIcon}">${icon('search')}</a>
    <a class="btn btn-primary topbar-cta" href="/sell">${icon('plus')}${t.sellCta}</a>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="footer">
  <div class="wrap footer-in">
    <div>
      <a class="brand" href="/">${logo}<span>${config.siteName}</span></a>
      <p class="muted">${t.footerBlurb}</p>
    </div>
    <nav class="footer-links" aria-label="${t.footerNav}">
      <a href="/phones">${t.footerPhones}</a>
      <a href="/sell">${t.footerSell}</a>
      <a href="/prices">${t.footerPrices}</a>
      <a href="/#safety">${t.footerSafety}</a>
      <a href="/#faq">${t.footerFaq}</a>
    </nav>
    <p class="footer-note muted">© ${new Date().getFullYear()} ${config.siteName}. ${t.footerNote}</p>
  </div>
</footer>
<nav class="tabbar" aria-label="${t.tabsAria}">
  ${tabs.map((x) => html`<a href="${x.href}" class="tab${x.main ? ' tab-main' : ''}" ${cur(x.key)}>
    <span class="tab-ic">${icon(x.i)}</span><span class="tab-t">${x.t}</span></a>`)}
</nav>
<div class="toast" role="status" aria-live="polite" hidden></div>
<script type="module" src="${asset('app.js')}"></script>
${scripts.map((s) => html`<script type="module" src="${asset(s)}"></script>`)}
</body>
</html>`);
}
