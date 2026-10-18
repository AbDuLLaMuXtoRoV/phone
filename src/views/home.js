import { html } from '../util.js';
import { icon } from './icons.js';
import { layout } from './layout.js';
import { cards, phoneArt, gradeChip } from './components.js';
import { MODELS, byId, CATEGORY_SHOWCASE } from '../catalog.js';
import { GRADE_KEYS } from '../../public/assets/questions.js';
import { CATEGORY_KEYS } from '../../public/assets/categories.js';
import { estimate } from '../../public/assets/pricing.js';
import config from '../config.js';

const TIP_ICONS = ['shield', 'sim', 'pin', 'alert'];
const showcaseArt = (cat) => { const [id, color] = CATEGORY_SHOWCASE[cat]; return phoneArt(byId(id), color); };

export function homePage(L, { here, latest, total, counts }) {
  const t = L.t;
  const sample = byId('iphone-15-pro-max');
  const sampleEst = estimate(sample, '256 GB', { battery: 93 }, config.pricing);
  return layout(L, {
    here,
    active: 'home',
    body: html`
<section class="hero">
  <div class="wrap hero-in">
    <div class="hero-copy">
      <p class="eyebrow">${icon('shield')} ${t.eyebrow}</p>
      <h1>${t.heroTitle}<span>${t.heroHighlight}</span>${t.heroTitleEnd}</h1>
      <p class="lead">${t.lead}</p>
      <form class="hero-search" action="/sell" role="search">
        ${icon('search')}
        <input name="q" type="search" placeholder="${t.heroPh}" aria-label="${t.heroAria}" enterkeyhint="go" autocomplete="off">
        <button class="btn btn-primary" type="submit">${t.heroBtn}</button>
      </form>
      <div class="chips chips-scroll" aria-label="${t.heroChipsAria}">
        ${CATEGORY_KEYS.map((c) => html`<a class="chip" href="/sell?cat=${c}">${L.cats[c]}</a>`)}
      </div>
      <a class="hero-alt" href="/phones">${t.heroAltText} <b>${t.heroAltLink(total)}</b> ${icon('right')}</a>
    </div>
    <div class="hero-demo" aria-hidden="true">
      <div class="demo-card">
        <div class="demo-art">${phoneArt(sample, 'natural')}</div>
        <div class="demo-info">
          <p class="demo-model">${sample.name} · 256 GB</p>
          <p class="demo-tags">${gradeChip(L, 'A', { long: true })} <span class="bat">${icon('battery')}93%</span></p>
          <p class="demo-label">${t.demoLabel}</p>
          <p class="demo-price">${L.price(sampleEst.uzs)}</p>
          <ul class="demo-lines">
            <li><span>${icon('check')}${t.demoFaceId}</span><span>${t.demoWorks}</span></li>
            <li><span>${icon('check')}${t.demoScreen}</span><span>${t.demoNoScratches}</span></li>
            <li><span>${icon('check')}${t.demoParts}</span><span>${t.demoOriginal}</span></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="wrap" aria-label="${t.statsAria}">
  <div class="stats">
    <div><b>${total}</b><span>${t.statListings}</span></div>
    <div><b>${MODELS.length}</b><span>${t.statModels}</span></div>
    <div><b>${t.statFreeValue}</b><span>${t.statFree}</span></div>
    <div><b>${t.statTimeValue}</b><span>${t.statTime}</span></div>
  </div>
</section>

<section class="wrap section">
  <div class="section-head"><h2>${t.categoriesTitle}</h2></div>
  <div class="cat-tiles">
    ${CATEGORY_KEYS.map((c) => html`<a class="cat-tile" href="/phones?cat=${c}">
      <span class="cat-art">${showcaseArt(c)}</span>
      <b>${L.cats[c]}</b>
      <span class="muted small">${t.listingsN(counts[c] || 0)}</span>
    </a>`)}
  </div>
</section>

<section class="wrap section">
  <div class="section-head"><h2>${t.latestTitle}</h2><a class="link" href="/phones">${t.seeAll} ${icon('right')}</a></div>
  ${cards(L, latest)}
</section>

<section class="wrap section">
  <div class="section-head"><h2>${t.howTitle}</h2></div>
  <ol class="steps">
    ${t.steps.map(([h, p], i) => html`<li><span class="step-n">${i + 1}</span><div><h3>${h}</h3><p>${p}</p></div></li>`)}
  </ol>
  <a class="btn btn-primary btn-lg btn-block-m" href="/sell">${t.howCta}</a>
</section>

<section class="wrap section">
  <div class="section-head"><h2>${t.gradesTitle}</h2></div>
  <p class="muted section-sub">${t.gradesSub}</p>
  <div class="grades">
    ${GRADE_KEYS.map((g) => html`<div class="grade-card">${gradeChip(L, g)}<div><h3>${L.grades[g].name}</h3><p>${L.grades[g].desc}</p></div></div>`)}
  </div>
</section>

<section class="wrap section" id="safety">
  <div class="section-head"><h2>${t.safetyTitle}</h2></div>
  <div class="tips">
    ${t.tips.map(([h, p], i) => html`<div class="tip">${icon(TIP_ICONS[i])}<div><h3>${h}</h3><p>${p}</p></div></div>`)}
  </div>
</section>

<section class="wrap section" id="faq">
  <div class="section-head"><h2>${t.faqTitle}</h2></div>
  <div class="faq">
    ${t.faq.map(([q, a]) => html`<details><summary>${q}${icon('down')}</summary><p>${a}</p></details>`)}
  </div>
</section>

<section class="wrap section">
  <div class="cta-band">
    <div><h2>${t.ctaTitle}</h2><p>${t.ctaText}</p></div>
    <a class="btn btn-light btn-lg" href="/sell">${t.ctaBtn} ${icon('right')}</a>
  </div>
</section>`,
  });
}
