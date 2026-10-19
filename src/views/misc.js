import { html, fold } from '../util.js';
import { icon } from './icons.js';
import { layout } from './layout.js';
import { cards, empty, phoneArt } from './components.js';
import { MODELS_NEWEST, seriesOf, seriesLabel, PRICE_SOURCE } from '../catalog.js';
import { unitsToKrw } from '../../public/assets/pricing.js';
import config from '../config.js';

export function pricesPage(L, { here }) {
  const t = L.t;
  const p = config.pricing;
  const series = seriesOf('iphone'); // the price list covers iPhones only
  return layout(L, {
    here,
    title: t.pricesTitle,
    description: t.pricesDesc,
    active: 'prices',
    body: html`
<div class="wrap section">
  <div class="page-head">
    <h1>${t.pricesH1}</h1>
    <p class="muted">${t.pricesSub(L.date(new Date(PRICE_SOURCE.importedAt)))}</p>
  </div>
  <label class="search-field search-field-lg">
    ${icon('search')}<input type="search" placeholder="${t.pricesSearch}" aria-label="${t.pricesSearch}" data-filter-input="prices">
  </label>
  <div class="chips chips-scroll">${series.map((s) => html`<a class="chip" href="#s-${s}">${seriesLabel(s)}</a>`)}</div>
  <div class="price-list" data-filter-list="prices">
    ${series.map((s) => html`<h2 class="price-series" id="s-${s}" data-filter-group>${seriesLabel(s)}</h2>
      ${MODELS_NEWEST.filter((m) => m.series === s).map((m) => html`<article class="price-card" data-filter-item="${fold(m.name)}">
        <div class="price-card-art">${phoneArt(m, m.colors[0]?.k)}</div>
        <div class="price-card-body">
          <h3>${m.name} <small class="muted">${m.year}</small></h3>
          <table class="ptable">
            <thead><tr><th scope="col">${t.colStorage}</th><th scope="col">${t.colIdeal}</th><th scope="col">${t.colUsed}</th></tr></thead>
            <tbody>${m.storages.map((r) => html`<tr><th scope="row">${r.label}</th>
              <td>${typeof r.A === 'number' ? L.price(unitsToKrw(r.A, p)) : '—'}</td>
              <td>${L.price(unitsToKrw(r.base, p))}</td></tr>`)}</tbody>
          </table>
          <a class="btn btn-ghost btn-sm" href="/sell?model=${m.id}">${t.exact} ${icon('right')}</a>
        </div>
      </article>`)}`)}
    <p class="empty-inline" data-filter-empty hidden>${t.noModelShort}</p>
  </div>
  <p class="muted small">${t.pricesNote} ${t.rateNote(L.group(L.krwPerUsd))}</p>
</div>`,
  });
}

export function favoritesPage(L, { here, items, hasIds }) {
  const t = L.t;
  return layout(L, {
    here,
    title: t.savedTitle,
    active: 'fav',
    body: html`
<div class="wrap section" data-fav-page="${hasIds ? 'loaded' : 'pending'}">
  <div class="page-head"><h1>${t.savedTitle}</h1></div>
  ${items.length
    ? cards(L, items)
    : html`<div data-fav-empty ${hasIds ? '' : 'hidden'}>${empty(t.savedEmptyTitle, t.savedEmptyText, html`<a class="btn btn-primary" href="/phones">${t.browse}</a>`)}</div>
       ${hasIds ? '' : html`<p class="muted" data-fav-loading>${t.loading}</p>`}`}
</div>`,
  });
}

export function minePage(L, { here, items, hasIds }) {
  const t = L.t;
  return layout(L, {
    here,
    title: t.mineTitle,
    active: 'mine',
    body: html`
<div class="wrap section" data-mine-page="${hasIds ? 'loaded' : 'pending'}">
  <div class="page-head"><h1>${t.mineTitle}</h1><p class="muted">${t.mineSub}</p></div>
  ${items.length
    ? cards(L, items)
    : html`<div data-mine-empty ${hasIds ? '' : 'hidden'}>${empty(t.mineEmptyTitle, t.mineEmptyText, html`<a class="btn btn-primary" href="/sell">${icon('plus')}${t.sellCta}</a>`)}</div>
       ${hasIds ? '' : html`<p class="muted" data-mine-loading>${t.loading}</p>`}`}
</div>`,
  });
}

export function notFoundPage(L, { here }) {
  const t = L.t;
  return layout(L, {
    here,
    title: t.notFoundTitle,
    body: html`<div class="wrap section">${empty(t.notFoundTitle, t.notFoundText, html`<a class="btn btn-primary" href="/phones">${t.browse}</a>`)}</div>`,
  });
}
