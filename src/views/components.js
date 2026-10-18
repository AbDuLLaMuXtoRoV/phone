import { html, raw, money, ago } from '../util.js';
import { phoneArtSvg } from '../../public/assets/art.js';
import { icon } from './icons.js';
import { byId, colorOf } from '../catalog.js';
import { GRADES } from '../../public/assets/questions.js';
import { priceVerdict, estimate } from '../../public/assets/pricing.js';
import config from '../config.js';

export const phoneArt = (model, colorKey, { cls = '' } = {}) =>
  raw(phoneArtSvg(model?.cam, colorOf(model, colorKey)?.hex, model?.name || 'iPhone', cls));

export const gradeChip = (g, { long = false } = {}) =>
  html`<span class="grade grade-${g === 'A' || g === 'A-' ? 'a' : g === 'C' ? 'c' : 'b'}" title="${GRADES[g]?.name}">${g.replace('-', '−')}${long ? html` · ${GRADES[g]?.name}` : ''}</span>`;

// The system estimate at today's settings (exchange rate may have changed since the listing was posted).
export function estFor(l) {
  const model = byId(l.model_id);
  const e = model ? estimate(model, l.storage, l.answers, config.pricing) : null;
  return e?.status === 'ok' || e?.status === 'scrap' ? e.uzs : l.est_uzs;
}

export function verdictBadge(l, cls = '') {
  const v = priceVerdict(l.price_uzs, estFor(l));
  return v ? html`<span class="verdict verdict-${v.k} ${cls}">${v.t}</span>` : '';
}

export function media(l, model, { eager = false } = {}) {
  const p = l.photos?.[0];
  return p
    ? html`<img src="${p}" alt="${l.model_name}" width="600" height="600" ${raw(eager ? 'fetchpriority="high"' : 'loading="lazy"')} decoding="async">`
    : phoneArt(model, l.color);
}

export function card(l, { eager = false } = {}) {
  const model = byId(l.model_id);
  const sold = l.status === 'sold';
  return html`<article class="card${sold ? ' is-sold' : ''}">
  <a class="card-link" href="/telefon/${l.id}">
    <div class="card-media">${media(l, model, { eager })}${sold ? html`<span class="verdict verdict-sold">Sotilgan</span>` : verdictBadge(l)}</div>
    <div class="card-body">
      <h3 class="card-title">${l.model_name}</h3>
      <p class="card-meta">${l.storage} ${gradeChip(l.grade)} <span class="bat">${icon('battery')}${l.battery ? `${l.battery}%` : '—'}</span></p>
      <p class="card-price">${money(l.price_uzs)} <small>soʻm</small></p>
      <p class="card-foot">${l.region} · ${ago(l.created_at)}</p>
    </div>
  </a>
  <button class="fav" type="button" data-fav="${l.id}" aria-pressed="false" aria-label="Sevimlilarga qoʻshish">${icon('heart')}</button>
</article>`;
}

export const cards = (items, opts) => html`<div class="cards">${items.map((l, i) => card(l, { eager: opts?.eagerFirst && i < 2 }))}</div>`;

export const empty = (title, text, action) => html`<div class="empty">
  <div class="empty-icon">${icon('smartphone')}</div>
  <h2>${title}</h2>
  <p>${text}</p>
  ${action || ''}
</div>`;
