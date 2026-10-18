import { html, raw, formatPhone } from '../util.js';
import { icon } from './icons.js';
import { layout } from './layout.js';
import { cards, gradeChip, phoneArt, estFor, regionName, colorName } from './components.js';
import { byId, colorOf } from '../catalog.js';
import { FAULTS, PARTS, EXTRAS, pick, opt } from '../../public/assets/questions.js';
import { estimate, normalize, priceVerdict } from '../../public/assets/pricing.js';
import config from '../config.js';

const row = (label, value, state = 'ok') => ({ label, value, state });
const STATE_ICON = { ok: 'check', warn: 'alert', bad: 'close' };

function report(L, model, answers) {
  const t = L.t;
  const a = normalize(answers);
  const o = (q, v) => opt(L, q, v).t;
  const looks = [
    row(t.rowScreen, o('screen', a.screen), a.screen === 'C' ? 'bad' : a.screen === 'B' ? 'warn' : 'ok'),
    row(t.rowBody, o('body', a.body), a.body === 'C' ? 'bad' : a.body.startsWith('B') ? 'warn' : 'ok'),
    model.glassBack && row(t.rowBack, o('backGlass', a.backGlass), a.backGlass === 'ok' ? 'ok' : 'bad'),
    row(t.rowLens, o('lens', a.lens), a.lens === 'ok' ? 'ok' : a.lens === 'scratched' ? 'warn' : 'bad'),
    row(t.rowBent, o('bent', a.bent), a.bent === 'none' ? 'ok' : a.bent === 'light' ? 'warn' : 'bad'),
    row(t.rowGlass, o('glass', a.glass), a.glass === 'ok' ? 'ok' : 'bad'),
    row(t.rowDisplay, o('display', a.display), a.display === 'ok' ? 'ok' : a.display === 'minor' ? 'warn' : 'bad'),
  ].filter(Boolean);
  if (a.untested) {
    // Phone does not turn on: nothing beyond the looks could be checked.
    looks[looks.length - 1] = row(t.rowDisplay, t.cantCheck, 'warn');
    const na = [row(t.deadPhone, t.cantCheck, 'bad')];
    return { looks, funcs: na, parts: na, basics: [row(t.rowIcloud, t.signedOut, 'ok'), row(t.rowPowers, t.no, 'bad')] };
  }
  const funcs = FAULTS.filter((f) => !f.when || f.when(model)).map((f) => {
    const broken = a.faults.includes(f.k);
    return row(pick(L.faults[f.k].s, model), broken ? t.broken : t.works, broken ? 'bad' : 'ok');
  });
  const parts = PARTS.items.map((p) => row(L.parts.items[p], L.parts.opts[a.parts[p]] ?? '—', a.parts[p] === 'none' ? 'ok' : a.parts[p] === 'genuine' ? 'warn' : 'bad'));
  const basics = [
    row(t.rowIcloud, t.signedOut, 'ok'),
    row(t.rowImei, a.imeiOk === 'yes' ? t.shown : t.notShown, a.imeiOk === 'yes' ? 'ok' : 'bad'),
    row(t.rowPowers, a.powersOn === 'yes' ? t.yes : t.no, a.powersOn === 'yes' ? 'ok' : 'bad'),
    row(t.rowRefurb, a.refurbished === 'yes' ? L.q.refurbished.opts.yes : L.q.refurbished.opts.no, a.refurbished === 'yes' ? 'warn' : 'ok'),
  ];
  return { looks, funcs, parts, basics };
}

const rows = (list) => html`<ul class="report">${list.map((r) => html`<li class="is-${r.state}"><span class="report-ic">${icon(STATE_ICON[r.state])}</span><span class="report-l">${r.label}</span><span class="report-v">${r.value}</span></li>`)}</ul>`;

export function listingPage(L, { here, l, similar, isNew }) {
  const t = L.t;
  const model = byId(l.model_id);
  const a = normalize(l.answers);
  const color = colorOf(model, l.color);
  const est = estimate(model, l.storage, l.answers, config.pricing);
  const sysEst = estFor(l);
  const verdict = priceVerdict(l.price_uzs, sysEst);
  const rep = report(L, model, l.answers);
  const faultsCount = a.untested ? 0 : rep.funcs.filter((r) => r.state === 'bad').length;
  const extras = EXTRAS.filter((k) => l.extras?.[k]);
  const tg = l.telegram ? l.telegram.replace(/^@/, '') : null;
  const sold = l.status === 'sold';
  const title = `${l.model_name}, ${l.storage}`;
  const photos = l.photos.length ? l.photos : null;
  const region = regionName(L, l.region);

  return layout(L, {
    here,
    title: `${title} — ${L.price(l.price_uzs)}`,
    description: t.metaDesc(title, L.grades[l.grade].name, l.battery, region, L.price(l.price_uzs)),
    back: { href: '/phones', label: l.model_name },
    focus: true,
    body: html`
<div class="wrap listing" data-listing="${l.id}">
  ${isNew ? html`<div class="notice notice-ok" role="status">
    ${icon('check')}<div><b>${t.posted}</b> ${t.postedText}</div>
    <button class="btn btn-ghost btn-sm" type="button" data-share>${icon('share')}${t.share}</button>
  </div>` : ''}
  ${sold ? html`<div class="notice notice-warn" role="status">${icon('info')}<div>${t.soldNotice}</div></div>` : ''}

  <div class="listing-grid">
    <div class="gallery">
      <div class="gallery-track" tabindex="0" aria-label="${t.photosAria}">
        ${photos
          ? photos.map((p, i) => html`<img src="${p}" alt="${t.photoAlt(title, i + 1)}" width="900" height="900" ${raw(i === 0 ? 'fetchpriority="high"' : 'loading="lazy"')} decoding="async">`)
          : html`<div class="gallery-art">${phoneArt(model, l.color)}<span class="muted">${t.noPhotos}</span></div>`}
      </div>
      ${photos && photos.length > 1 ? html`<span class="gallery-count" data-gallery-count>1 / ${photos.length}</span>` : ''}
    </div>

    <div class="listing-main">
      <div class="listing-head">
        <h1>${title}</h1>
        <p class="muted">${color ? html`${colorName(L, color.k)} · ` : ''}${region} · ${L.ago(l.created_at)}</p>
      </div>

      <div class="price-box">
        <p class="price-big">${L.price(l.price_uzs)}</p>
        ${verdict && !sold ? html`<p class="verdict-line"><span class="verdict verdict-${verdict.k}">${L.verdict[verdict.k]}</span> ${t.systemEst} <b>${L.price(sysEst)}</b></p>` : ''}
        ${est.status !== 'blocked' ? html`<details class="breakdown">
          <summary>${t.howCalc} ${icon('down')}</summary>
          <ul>${est.lines.map((x) => html`<li><span>${L.line(x, model)}</span><b class="${x.units < 0 ? 'neg' : ''}">${x.units < 0 ? '−' : ''}${L.price(Math.abs(x.uzs))}</b></li>`)}
            <li class="total"><span>${t.estTotal}</span><b>${L.price(est.uzs)}</b></li></ul>
        </details>` : ''}
      </div>

      <div class="facts">
        <div class="fact"><span>${t.factCondition}</span><b>${gradeChip(L, l.grade, { long: true })}</b></div>
        <div class="fact"><span>${t.factBattery}</span><b class="${l.battery && l.battery < 80 ? 'warn-text' : ''}">${icon('battery')}${l.battery ? `${l.battery}%` : t.unknown}</b></div>
        <div class="fact"><span>${t.factStorage}</span><b>${l.storage}</b></div>
        <div class="fact"><span>${t.factColor}</span><b>${color ? html`<i class="swatch" style="--c:${color.hex}"></i>${colorName(L, color.k)}` : '—'}</b></div>
        ${model.esimQ ? html`<div class="fact"><span>${t.factSim}</span><b>${L.q.sim.opts[a.sim] || '—'}</b></div>` : ''}
        <div class="fact"><span>${t.factImei}</span><b class="${l.uzimei === 'yes' ? 'ok-text' : 'warn-text'}">${l.uzimei === 'yes' ? t.regYes : l.uzimei === 'no' ? t.regNo : t.unknown}</b></div>
      </div>

      <section class="block">
        <h2>${t.reportTitle}</h2>
        <p class="muted small">${t.reportNote}</p>
        <h3 class="report-h">${t.basics}</h3>${rows(rep.basics)}
        <h3 class="report-h">${t.looksTitle}</h3>${rows(rep.looks)}
        ${a.untested
          ? html`<h3 class="report-h">${t.funcsTitle}</h3>${rows(rep.funcs)}`
          : html`<details class="report-more" ${raw(faultsCount ? 'open' : '')}>
          <summary><h3 class="report-h">${t.funcsTitle}</h3><span class="${faultsCount ? 'bad-text' : 'ok-text'}">${faultsCount ? t.faultsN(faultsCount) : t.allWork}</span>${icon('down')}</summary>
          ${rows(rep.funcs)}
        </details>`}
        <h3 class="report-h">${t.partsTitle}</h3>${rows(rep.parts)}
      </section>

      ${l.description ? html`<section class="block"><h2>${t.descTitle}</h2><p class="desc">${l.description}</p></section>` : ''}

      <section class="block">
        <h2>${t.boxTitle}</h2>
        <p>${extras.length ? extras.map((k) => html`<span class="tag">${icon('box')}${L.extras[k]}</span>`) : html`<span class="muted">${t.phoneOnly}</span>`}</p>
      </section>

      <section class="block seller">
        <div class="avatar" aria-hidden="true">${l.seller_name.slice(0, 1)}</div>
        <div><b>${l.seller_name}</b><p class="muted small">${icon('pin')}${region} · ${icon('eye')}${t.views(l.views)}</p></div>
      </section>

      <section class="block tips-compact">
        <h2>${icon('shield')}${t.safeTitle}</h2>
        <ul>${t.safeTips.map((x) => html`<li>${x}</li>`)}</ul>
      </section>

      <section class="block owner" data-owner-panel hidden>
        <h2>${t.manage}</h2>
        <div class="owner-actions">
          ${sold
            ? html`<button class="btn btn-ghost" type="button" data-status="active">${icon('refresh')}${t.reactivate}</button>`
            : html`<button class="btn btn-ghost" type="button" data-status="sold">${icon('check')}${t.markSold}</button>`}
          <button class="btn btn-danger-ghost" type="button" data-status="deleted">${icon('trash')}${t.remove}</button>
        </div>
      </section>
    </div>

    <aside class="contact-card">
      <p class="price-big">${L.price(l.price_uzs)}</p>
      ${verdict && !sold ? html`<p class="verdict-line"><span class="verdict verdict-${verdict.k}">${L.verdict[verdict.k]}</span></p>` : ''}
      <a class="btn btn-primary btn-lg btn-block" href="tel:${l.phone}">${icon('phone')}${formatPhone(l.phone)}</a>
      ${tg ? html`<a class="btn btn-tg btn-lg btn-block" href="https://t.me/${tg}" target="_blank" rel="noopener">${icon('send')}${t.telegram}</a>` : ''}
      <button class="btn btn-ghost btn-block" type="button" data-fav="${l.id}" aria-pressed="false">${icon('heart')}<span data-fav-label>${t.save}</span></button>
      <p class="muted small">${icon('user')}${l.seller_name} · ${region}</p>
    </aside>
  </div>

  ${similar.length ? html`<section class="section"><div class="section-head"><h2>${t.similar}</h2></div>${cards(L, similar)}</section>` : ''}
</div>

<div class="actionbar">
  <button class="icon-btn icon-btn-lg" type="button" data-fav="${l.id}" aria-pressed="false" aria-label="${t.save}">${icon('heart')}</button>
  ${tg ? html`<a class="btn btn-tg btn-lg" href="https://t.me/${tg}" target="_blank" rel="noopener">${icon('send')}${t.telegramShort}</a>` : ''}
  <a class="btn btn-primary btn-lg" href="tel:${l.phone}">${icon('phone')}${t.call}</a>
</div>`,
  });
}
