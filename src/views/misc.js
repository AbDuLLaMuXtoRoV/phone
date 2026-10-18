import { html, money, fold } from '../util.js';
import { icon } from './icons.js';
import { layout } from './layout.js';
import { cards, empty, phoneArt } from './components.js';
import { MODELS_NEWEST, SERIES, seriesLabel, PRICE_SOURCE } from '../catalog.js';
import { toUzs } from '../../public/assets/pricing.js';
import config from '../config.js';

export function pricesPage() {
  const p = config.pricing;
  const updated = new Date(PRICE_SOURCE.importedAt);
  return layout({
    title: 'iPhone narxlari',
    description: 'Ishlatilgan iPhone narxlari soʻmda: har bir model va xotira hajmi boʻyicha ideal va ishlatilgan holatdagi taxminiy narxlar.',
    active: 'prices',
    body: html`
<div class="wrap section">
  <div class="page-head">
    <h1>Ishlatilgan iPhone narxlari</h1>
    <p class="muted">Ideal (A) va ishlatilgan holatdagi taxminiy narxlar, soʻmda. Yangilangan: ${updated.getDate()}.${String(updated.getMonth() + 1).padStart(2, '0')}.${updated.getFullYear()}.</p>
  </div>
  <label class="search-field search-field-lg">
    ${icon('search')}<input type="search" placeholder="Model qidirish" aria-label="Model qidirish" data-filter-input="prices">
  </label>
  <div class="chips chips-scroll">${SERIES.map((s) => html`<a class="chip" href="#s-${s}">${seriesLabel(s)}</a>`)}</div>
  <div class="price-list" data-filter-list="prices">
    ${SERIES.map((s) => html`<h2 class="price-series" id="s-${s}" data-filter-group>${seriesLabel(s)}</h2>
      ${MODELS_NEWEST.filter((m) => m.series === s).map((m) => html`<article class="price-card" data-filter-item="${fold(m.name)}">
        <div class="price-card-art">${phoneArt(m, m.colors[0]?.k)}</div>
        <div class="price-card-body">
          <h3>${m.name} <small class="muted">${m.year}</small></h3>
          <table class="ptable">
            <thead><tr><th scope="col">Xotira</th><th scope="col">Ideal holat</th><th scope="col">Ishlatilgan</th></tr></thead>
            <tbody>${m.storages.map((r) => html`<tr><th scope="row">${r.label}</th>
              <td>${typeof r.A === 'number' ? money(toUzs(r.A, p)) : '—'}</td>
              <td>${money(toUzs(r.base, p))}</td></tr>`)}</tbody>
          </table>
          <a class="btn btn-ghost btn-sm" href="/sotish?model=${m.id}">Aniq baholash ${icon('right')}</a>
        </div>
      </article>`)}`)}
    <p class="empty-inline" data-filter-empty hidden>Bunday model topilmadi.</p>
  </div>
  <p class="muted small">“Ideal holat” — chiziqsiz, batareya 90%+. “Ishlatilgan” — holat darajasidan qatʼi nazar asosiy narx. Aniq narx nosozliklar va almashtirilgan qismlarga qarab hisoblanadi.</p>
</div>`,
  });
}

export function favoritesPage({ items, hasIds }) {
  return layout({
    title: 'Sevimlilar',
    active: 'fav',
    body: html`
<div class="wrap section" data-fav-page="${hasIds ? 'loaded' : 'pending'}">
  <div class="page-head"><h1>Sevimlilar</h1></div>
  ${items.length
    ? cards(items)
    : html`<div data-fav-empty ${hasIds ? '' : 'hidden'}>${empty('Hali sevimlilar yoʻq', 'Yoqqan telefonlardagi ♡ belgisini bosing — ular shu yerda saqlanadi.', html`<a class="btn btn-primary" href="/telefonlar">Telefonlarni koʻrish</a>`)}</div>
       ${hasIds ? '' : html`<p class="muted" data-fav-loading>Yuklanmoqda…</p>`}`}
</div>`,
  });
}

export function minePage({ items, hasIds }) {
  return layout({
    title: 'Eʼlonlarim',
    active: 'mine',
    body: html`
<div class="wrap section" data-mine-page="${hasIds ? 'loaded' : 'pending'}">
  <div class="page-head"><h1>Eʼlonlarim</h1><p class="muted">Shu qurilmadan joylangan eʼlonlar. Boshqarish uchun eʼlonni oching.</p></div>
  ${items.length
    ? cards(items)
    : html`<div data-mine-empty ${hasIds ? '' : 'hidden'}>${empty('Hali eʼlon joylamagansiz', 'Telefoningizni 1 daqiqada baholang va bepul eʼlon joylang.', html`<a class="btn btn-primary" href="/sotish">${icon('plus')}Telefon sotish</a>`)}</div>
       ${hasIds ? '' : html`<p class="muted" data-mine-loading>Yuklanmoqda…</p>`}`}
</div>`,
  });
}

export function notFoundPage() {
  return layout({
    title: 'Sahifa topilmadi',
    body: html`<div class="wrap section">${empty('Sahifa topilmadi', 'Bu eʼlon oʻchirilgan yoki havola notoʻgʻri boʻlishi mumkin.', html`<a class="btn btn-primary" href="/telefonlar">Telefonlarni koʻrish</a>`)}</div>`,
  });
}
