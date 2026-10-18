import { html, raw } from '../util.js';
import { phoneArtSvg } from '../../public/assets/art.js';
import { opt } from '../../public/assets/questions.js';
import { icon } from './icons.js';
import { byId, colorOf } from '../catalog.js';
import { priceVerdict, estimate } from '../../public/assets/pricing.js';
import config from '../config.js';

export const phoneArt = (model, colorKey, { cls = '' } = {}) =>
  raw(phoneArtSvg(model?.art, colorOf(model, colorKey)?.hex, model?.name || 'device', cls));

export const gradeChip = (L, g, { long = false } = {}) =>
  html`<span class="grade grade-${g === 'A' || g === 'A-' ? 'a' : g === 'C' ? 'c' : 'b'}" title="${L.grades[g]?.name}">${g.replace('-', '−')}${long ? html` · ${L.grades[g]?.name}` : ''}</span>`;

export const regionName = (L, key) => L.regions[key] || key;
export const colorName = (L, key) => (key ? L.colors[key] || key : '');

// Main specs in one line: "256 GB", "16 GB · 512 GB" (Mac: memory · SSD), "45 mm" (Watch).
export const specLine = (l) => (l.category === 'macbook' && l.answers?.ram ? `${l.answers.ram} GB · ${l.storage}` : l.storage);

// Battery as the device reports it: health %, a condition word (Galaxy, iPad) or the Mac's cycle count.
export function batteryText(L, l, { long = false } = {}) {
  const a = l.answers || {};
  if (l.battery) return `${l.battery}%`;
  if (a.batteryLevel) return opt(L, 'batteryLevel', a.batteryLevel).t;
  if (a.macBattery) {
    const cond = opt(L, 'macBattery', a.macBattery).t;
    if (!a.cycles) return cond;
    return long ? `${cond}, ${L.t.cycles(a.cycles)}` : L.t.cycles(a.cycles);
  }
  return long ? L.t.unknown : '—';
}

// The system estimate at today's settings (exchange rate may have changed since the listing was posted).
// Categories without a price list have none.
export function estFor(l) {
  const model = byId(l.model_id);
  const e = model ? estimate(model, l.storage, l.answers, config.pricing) : null;
  return e?.status === 'ok' || e?.status === 'scrap' ? e.uzs : null;
}

export function verdictBadge(L, l) {
  const v = priceVerdict(l.price_uzs, estFor(l));
  return v ? html`<span class="verdict verdict-${v.k}">${L.verdict[v.k]}</span>` : '';
}

export function card(L, l, { eager = false } = {}) {
  const model = byId(l.model_id);
  const sold = l.status === 'sold';
  const photo = l.photos?.[0];
  return html`<article class="card${sold ? ' is-sold' : ''}">
  <a class="card-link" href="/phone/${l.id}">
    <div class="card-media">
      ${photo
        ? html`<img src="${photo}" alt="${l.model_name}" width="600" height="600" ${raw(eager ? 'fetchpriority="high"' : 'loading="lazy"')} decoding="async">`
        : phoneArt(model, l.color)}
      ${sold ? html`<span class="verdict verdict-sold">${L.verdict.sold}</span>` : verdictBadge(L, l)}
    </div>
    <div class="card-body">
      <h3 class="card-title">${l.model_name}</h3>
      <p class="card-meta">${specLine(l)} ${gradeChip(L, l.grade)} <span class="bat">${icon('battery')}${batteryText(L, l)}</span></p>
      <p class="card-price">${L.money(l.price_uzs)} <small>${L.currency}</small></p>
      <p class="card-foot">${regionName(L, l.region)} · ${L.ago(l.created_at)}</p>
    </div>
  </a>
  <button class="fav" type="button" data-fav="${l.id}" aria-pressed="false" aria-label="${L.t.save}">${icon('heart')}</button>
</article>`;
}

export const cards = (L, items, opts) => html`<div class="cards">${items.map((l, i) => card(L, l, { eager: opts?.eagerFirst && i < 2 }))}</div>`;

export const empty = (title, text, action) => html`<div class="empty">
  <div class="empty-icon">${icon('smartphone')}</div>
  <h2>${title}</h2>
  <p>${text}</p>
  ${action || ''}
</div>`;
