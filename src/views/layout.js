import { html, raw, str } from '../util.js';
import { icon, sprite } from './icons.js';
import { asset } from '../assets.js';
import config from '../config.js';

export const logo = raw(`<svg class="logo-mark" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="var(--brand)"/><rect x="10" y="6" width="12" height="20" rx="3" fill="none" stroke="#fff" stroke-width="2"/><path d="m13 16.5 2.2 2.2 4-4.4" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`);

const TABS = [
  { href: '/', key: 'home', t: 'Asosiy', i: 'home' },
  { href: '/telefonlar', key: 'buy', t: 'Telefonlar', i: 'grid' },
  { href: '/sotish', key: 'sell', t: 'Sotish', i: 'plus', main: true },
  { href: '/sevimlilar', key: 'fav', t: 'Sevimlilar', i: 'heart' },
  { href: '/elonlarim', key: 'mine', t: 'Eʼlonlarim', i: 'list' },
];

/**
 * @param {object} o
 * @param {string} o.title       page title (site name is appended)
 * @param {string} [o.description]
 * @param {*} o.body             html`` result
 * @param {string} [o.active]    which tab/nav item is current
 * @param {{href:string,label:string}} [o.back]  show a back button + title in the mobile header instead of the logo
 * @param {boolean} [o.focus]    hide the bottom tab bar (pages with their own sticky action bar)
 * @param {string[]} [o.scripts] extra module scripts from /assets
 */
export function layout({ title, description, body, active = '', back = null, focus = false, scripts = [], head = '' }) {
  const fullTitle = title ? `${title} — ${config.siteName}` : `${config.siteName} — iPhone sotish va sotib olish`;
  const desc = description || 'Ishlatilgan iPhone’ni 1 daqiqada baholang va bepul eʼlon joylang. Shaffof narx, iCloud tekshiruvi, Telegram orqali aloqa.';
  return '<!doctype html>' + str(html`<html lang="uz">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${fullTitle}</title>
<meta name="description" content="${desc}">
<meta property="og:title" content="${fullTitle}">
<meta property="og:description" content="${desc}">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0d1320" media="(prefers-color-scheme: dark)">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="stylesheet" href="${asset('app.css')}">
${head}
</head>
<body class="${focus ? 'is-focus' : ''}">
${sprite}
<a class="skip" href="#main">Asosiy tarkibga oʻtish</a>
<header class="topbar">
  <div class="topbar-in">
    ${back
      ? html`<a class="topbar-back" href="${back.href}" data-back aria-label="Orqaga">${icon('back')}</a><span class="topbar-title">${back.label}</span>`
      : ''}
    <a class="brand${back ? ' brand-desktop' : ''}" href="/" aria-label="${config.siteName} — bosh sahifa">${logo}<span>${config.siteName.replace(/bozor$/i, '')}<b>${/bozor$/i.test(config.siteName) ? 'bozor' : ''}</b></span></a>
    <nav class="topnav" aria-label="Asosiy menyu">
      <a href="/telefonlar" ${raw(active === 'buy' ? 'aria-current="page"' : '')}>Telefonlar</a>
      <a href="/narxlar" ${raw(active === 'prices' ? 'aria-current="page"' : '')}>Narxlar</a>
      <a href="/sevimlilar" ${raw(active === 'fav' ? 'aria-current="page"' : '')}>Sevimlilar</a>
      <a href="/elonlarim" ${raw(active === 'mine' ? 'aria-current="page"' : '')}>Eʼlonlarim</a>
    </nav>
    <form class="topsearch" action="/telefonlar" role="search">
      ${icon('search')}
      <input type="search" name="q" placeholder="Model qidirish, masalan 13 Pro" aria-label="Telefon qidirish" enterkeyhint="search">
    </form>
    <a class="topbar-icon" href="/telefonlar?focus=q" aria-label="Qidirish">${icon('search')}</a>
    <a class="btn btn-primary topbar-cta" href="/sotish">${icon('plus')}Telefon sotish</a>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="footer">
  <div class="wrap footer-in">
    <div>
      <a class="brand" href="/">${logo}<span>${config.siteName}</span></a>
      <p class="muted">Ishlatilgan iPhone’lar uchun shaffof bozor. Narx holatga qarab avtomatik hisoblanadi.</p>
    </div>
    <nav class="footer-links" aria-label="Qoʻshimcha">
      <a href="/telefonlar">Telefonlar</a>
      <a href="/sotish">Telefon sotish</a>
      <a href="/narxlar">Narxlar jadvali</a>
      <a href="/#xavfsizlik">Xavfsiz savdo</a>
      <a href="/#savollar">Savollar</a>
    </nav>
    <p class="footer-note muted">© ${new Date().getFullYear()} ${config.siteName}. Narxlar taxminiy: ular eʼlon beruvchi bergan maʼlumotlarga asoslanadi va telefonni koʻrib tekshirish oʻrnini bosmaydi.</p>
  </div>
</footer>
<nav class="tabbar" aria-label="Pastki menyu">
  ${TABS.map((t) => html`<a href="${t.href}" class="tab${t.main ? ' tab-main' : ''}" ${raw(active === t.key ? 'aria-current="page"' : '')}>
    <span class="tab-ic">${icon(t.i)}</span><span class="tab-t">${t.t}</span></a>`)}
</nav>
<div class="toast" role="status" aria-live="polite" hidden></div>
<script type="module" src="${asset('app.js')}"></script>
${scripts.map((s) => html`<script type="module" src="${asset(s)}"></script>`)}
</body>
</html>`);
}
