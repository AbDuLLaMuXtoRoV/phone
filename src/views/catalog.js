import { html, raw, qs } from '../util.js';
import { icon } from './icons.js';
import { layout } from './layout.js';
import { cards, empty, regionName } from './components.js';
import { MODELS_NEWEST, SERIES, seriesOf, seriesLabel, seriesShort, catOfSeries, byId } from '../catalog.js';
import { REGIONS } from '../../public/assets/questions.js';
import { CATEGORY_KEYS } from '../../public/assets/categories.js';

const STORAGES = ['64 GB', '128 GB', '256 GB', '512 GB', '1 TB', '2 TB'];
const SORT_KEYS = ['new', 'cheap', 'expensive', 'battery'];
const GRADE_FILTER = ['', 'a', 'b', 'c'];
const BATTERY = ['', '80', '85', '90'];

const sel = (a, b) => raw(String(a) === String(b) ? 'selected' : '');
const chk = (a, b) => raw(String(a) === String(b) ? 'checked' : '');

export function catalogPage(L, { here, f, result, focusSearch }) {
  const t = L.t;
  const { items, total, page, pages } = result;
  // Active filters, each with a link that removes it.
  const without = (k) => `/phones${qs({ ...f, [k]: '', page: '' })}`;
  const active = [
    f.q && ['q', `“${f.q}”`],
    f.series && ['series', seriesLabel(f.series)],
    f.model && ['model', byId(f.model)?.name || f.model],
    f.storage && ['storage', f.storage],
    f.grade && ['grade', t.gradeOpts[f.grade].split(' · ')[0]],
    f.region && ['region', regionName(L, f.region)],
    f.min && ['min', t.chipFrom(L.money(f.min))],
    f.max && ['max', t.chipTo(L.money(f.max))],
    f.bat && ['bat', t.chipBattery(f.bat)],
  ].filter(Boolean);
  const filterCount = active.filter(([k]) => k !== 'q').length;
  const title = f.model ? byId(f.model)?.name : f.series ? seriesLabel(f.series) : f.cat ? L.cats[f.cat] : t.allPhones;
  const cat = f.cat || (f.series ? catOfSeries(f.series) : '');
  const groups = cat ? seriesOf(cat) : SERIES;

  return layout(L, {
    here,
    title,
    active: 'buy',
    body: html`
<form class="wrap catalog" action="/phones" method="get" id="catalog-form">
  <div class="catalog-head">
    <h1>${title} <span class="count">${total}</span></h1>
    <div class="catalog-bar">
      <label class="search-field">
        ${icon('search')}
        <input type="search" name="q" value="${f.q}" placeholder="${t.catSearchPh}" aria-label="${t.catSearchAria}" enterkeyhint="search" ${raw(focusSearch ? 'autofocus' : '')}>
      </label>
      <a class="btn btn-ghost filter-open" href="#filters" data-open-filters aria-controls="filters">
        ${icon('sliders')}<span>${t.filter}</span>${filterCount ? html`<span class="pill">${filterCount}</span>` : ''}
      </a>
      <label class="sort">
        <span class="sr">${t.sortAria}</span>
        <select name="sort" data-autosubmit>${SORT_KEYS.map((v) => html`<option value="${v}" ${sel(f.sort || 'new', v)}>${t.sorts[v]}</option>`)}</select>
      </label>
    </div>
    <div class="chips chips-scroll" aria-label="${t.catAria}">
      <a class="chip${!cat ? ' is-on' : ''}" href="/phones${qs({ ...f, cat: '', series: '', model: '', page: '' })}">${t.all}</a>
      ${CATEGORY_KEYS.map((c) => html`<a class="chip${cat === c ? ' is-on' : ''}" href="/phones${qs({ ...f, cat: c, series: '', model: '', page: '' })}">${L.cats[c]}</a>`)}
    </div>
    ${cat ? html`<div class="chips chips-scroll chips-sub">
      <a class="chip${!f.series ? ' is-on' : ''}" href="/phones${qs({ ...f, cat, series: '', model: '', page: '' })}">${t.all}</a>
      ${seriesOf(cat).map((s) => html`<a class="chip${f.series === s ? ' is-on' : ''}" href="/phones${qs({ ...f, cat, series: s, model: '', page: '' })}">${seriesShort(s)}</a>`)}
    </div>` : ''}
    ${active.length ? html`<div class="active-filters">
      ${active.map(([k, label]) => html`<a class="chip chip-x" href="${without(k)}" aria-label="${t.removeFilter(label)}">${label}${icon('close')}</a>`)}
      <a class="link" href="/phones">${t.clear}</a>
    </div>` : ''}
  </div>

  <div class="catalog-body">
    <aside class="filters" id="filters" aria-label="${t.filtersTitle}">
      <div class="sheet-backdrop" data-close-filters></div>
      <div class="sheet">
        <div class="sheet-head">
          <h2>${t.filtersTitle}</h2>
          <a class="icon-btn" href="#" data-close-filters aria-label="${t.close}">${icon('close')}</a>
        </div>
        <div class="sheet-body">
          <input type="hidden" name="cat" value="${cat}">
          <input type="hidden" name="series" value="${f.series}">
          <label class="field"><span>${t.model}</span>
            <select name="model">
              <option value="">${t.allModels}</option>
              ${groups.map((s) => html`<optgroup label="${seriesLabel(s)}">${MODELS_NEWEST.filter((m) => m.series === s).map((m) => html`<option value="${m.id}" ${sel(f.model, m.id)}>${m.name}</option>`)}</optgroup>`)}
            </select>
          </label>
          <fieldset class="field"><legend>${t.storage}</legend>
            <div class="seg seg-wrap">
              <label><input type="radio" name="storage" value="" ${chk(f.storage, '')}><span>${t.all}</span></label>
              ${STORAGES.map((s) => html`<label><input type="radio" name="storage" value="${s}" ${chk(f.storage, s)}><span>${s}</span></label>`)}
            </div>
          </fieldset>
          <fieldset class="field"><legend>${t.condition}</legend>
            <div class="seg seg-col">
              ${GRADE_FILTER.map((v) => html`<label><input type="radio" name="grade" value="${v}" ${chk(f.grade, v)}><span>${v ? t.gradeOpts[v] : t.all}</span></label>`)}
            </div>
          </fieldset>
          <fieldset class="field"><legend>${t.priceRange}</legend>
            <div class="range">
              <input type="text" inputmode="numeric" name="min" value="${f.min ? L.money(f.min) : ''}" placeholder="${t.from}" aria-label="${t.minAria}" data-money>
              <span>—</span>
              <input type="text" inputmode="numeric" name="max" value="${f.max ? L.money(f.max) : ''}" placeholder="${t.to}" aria-label="${t.maxAria}" data-money>
            </div>
          </fieldset>
          <label class="field"><span>${t.battery}</span>
            <select name="bat">${BATTERY.map((v) => html`<option value="${v}" ${sel(f.bat || '', v)}>${t.batteryOpts[v]}</option>`)}</select>
          </label>
          <label class="field"><span>${t.region}</span>
            <select name="region"><option value="">${t.allRegions}</option>${REGIONS.map((r) => html`<option value="${r}" ${sel(f.region, r)}>${regionName(L, r)}</option>`)}</select>
          </label>
        </div>
        <div class="sheet-foot">
          <a class="btn btn-ghost" href="/phones">${t.clear}</a>
          <button class="btn btn-primary" type="submit">${t.show}</button>
        </div>
      </div>
    </aside>

    <section class="results" aria-live="polite">
      ${items.length
        ? html`${cards(L, items, { eagerFirst: true })}
          ${pages > 1 ? html`<nav class="pager" aria-label="${t.pagesAria}">
            ${page > 1 ? html`<a class="btn btn-ghost" href="/phones${qs({ ...f, page: page - 1 })}">${icon('back')} ${t.prev}</a>` : html`<span></span>`}
            <span class="muted">${page} / ${pages}</span>
            ${page < pages ? html`<a class="btn btn-ghost" href="/phones${qs({ ...f, page: page + 1 })}">${t.next} ${icon('right')}</a>` : html`<span></span>`}
          </nav>` : ''}`
        : empty(t.emptyTitle, t.emptyText, html`<a class="btn btn-ghost" href="/phones">${t.emptyBtn}</a>`)}
    </section>
  </div>
</form>`,
  });
}
