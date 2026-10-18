// Site-wide behaviour. Every page works without it; this only adds conveniences.
import { $, $$, L, store, toast, digits, fold } from './ui.js';

const FAVS = 'fb_favs';
const MINE = 'fb_mine';

// ---- favourites (kept on this device) ----
const favs = () => store.get(FAVS, []);
function paintFavs() {
  const set = new Set(favs());
  for (const b of $$('[data-fav]')) {
    const on = set.has(+b.dataset.fav);
    b.setAttribute('aria-pressed', String(on));
    b.setAttribute('aria-label', on ? L.t.unsave : L.t.save);
    const label = b.querySelector('[data-fav-label]');
    if (label) label.textContent = on ? L.t.saved : L.t.save;
  }
}
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-fav]');
  if (!b) return;
  e.preventDefault();
  const id = +b.dataset.fav;
  const list = favs();
  const on = list.includes(id);
  store.set(FAVS, on ? list.filter((x) => x !== id) : [id, ...list].slice(0, 100));
  paintFavs();
  toast(on ? L.t.savedRemoved : L.t.savedAdded);
  if (on && $('[data-fav-page="loaded"]')) b.closest('.card')?.remove();
});
paintFavs();
window.addEventListener('pageshow', paintFavs); // back/forward cache

// Favourites and "my listings" pages: the server needs the ids, which live only in this browser.
function idsPage(attr, ids) {
  const page = $(`[data-${attr}-page]`);
  if (!page || page.dataset[`${attr}Page`] !== 'pending') return;
  if (ids.length) location.replace(`${location.pathname}?ids=${ids.join(',')}`);
  else {
    $(`[data-${attr}-loading]`)?.remove();
    $(`[data-${attr}-empty]`).hidden = false;
  }
}
idsPage('fav', favs());
idsPage('mine', store.get(MINE, []).map((x) => x.id));

// ---- listing page: owner controls, share, gallery counter ----
const listing = $('[data-listing]');
if (listing) {
  const id = +listing.dataset.listing;
  const mine = store.get(MINE, []).find((x) => x.id === id);
  const panel = $('[data-owner-panel]');
  if (mine && panel) {
    panel.hidden = false;
    panel.addEventListener('click', async (e) => {
      const b = e.target.closest('[data-status]');
      if (!b) return;
      const status = b.dataset.status;
      if (status === 'deleted' && !confirm(L.t.confirmDelete)) return;
      b.disabled = true;
      try {
        const r = await fetch(`/api/listings/${id}/status`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: mine.token, status }),
        });
        if (!r.ok) throw new Error((await r.json()).error);
        if (status === 'deleted') {
          store.set(MINE, store.get(MINE, []).filter((x) => x.id !== id));
          location.href = '/my-listings';
        } else location.reload();
      } catch (err) {
        toast(err.message || L.t.error);
        b.disabled = false;
      }
    });
  }
  $('[data-share]')?.addEventListener('click', async () => {
    const url = location.href.replace(/\?.*$/, '');
    try {
      if (navigator.share) await navigator.share({ title: document.title, url });
      else { await navigator.clipboard.writeText(url); toast(L.t.linkCopied); }
    } catch { /* user cancelled */ }
  });
  const track = $('.gallery-track');
  const count = $('[data-gallery-count]');
  if (track && count) {
    const total = track.children.length;
    track.addEventListener('scroll', () => {
      count.textContent = `${Math.round(track.scrollLeft / track.clientWidth) + 1} / ${total}`;
    }, { passive: true });
  }
}

// ---- header back button: go back within the site instead of reloading a page ----
document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-back]');
  if (!a || e.defaultPrevented) return;
  if (history.length > 1 && document.referrer.startsWith(location.origin)) {
    e.preventDefault();
    history.back();
  }
});

// ---- catalogue filters: bottom sheet on phones ----
const filters = $('#filters');
if (filters) {
  const open = () => {
    filters.classList.add('is-open');
    document.documentElement.style.overflow = 'hidden';
    filters.querySelector('select, input:not([type=hidden])')?.focus({ preventScroll: true });
  };
  const close = () => {
    filters.classList.remove('is-open');
    document.documentElement.style.overflow = '';
    if (location.hash === '#filters') history.replaceState(null, '', location.pathname + location.search);
  };
  $$('[data-open-filters]').forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); open(); }));
  $$('[data-close-filters]').forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); close(); }));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && filters.classList.contains('is-open')) close(); });
  if (location.hash === '#filters' && matchMedia('(max-width: 959px)').matches) open();
}
$$('[data-autosubmit]').forEach((el) => el.addEventListener('change', () => el.form.requestSubmit()));

// Money inputs: show "4,500,000" while typing; the server reads only the digits.
document.addEventListener('input', (e) => {
  const el = e.target;
  if (!el.matches?.('[data-money]')) return;
  const d = digits(el.value).slice(0, 10);
  el.value = d ? L.money(+d) : '';
});

// ---- client-side list filter (prices page) ----
for (const input of $$('[data-filter-input]')) {
  const list = $(`[data-filter-list="${input.dataset.filterInput}"]`);
  input.addEventListener('input', () => {
    const words = fold(input.value).replace(/iphone/g, ' ').split(' ').filter(Boolean);
    let shown = 0;
    let group = null;
    let groupShown = 0;
    const closeGroup = () => { if (group) group.hidden = groupShown === 0; };
    for (const el of list.children) {
      if (el.hasAttribute('data-filter-group')) { closeGroup(); group = el; groupShown = 0; continue; }
      if (!el.hasAttribute('data-filter-item')) continue;
      const hay = ` ${el.dataset.filterItem}`;
      const ok = words.every((w) => hay.includes(` ${w}`));
      el.hidden = !ok;
      if (ok) { shown++; groupShown++; }
    }
    closeGroup();
    const emptyEl = list.querySelector('[data-filter-empty]');
    if (emptyEl) emptyEl.hidden = shown > 0;
  });
}

// Leave empty filters out of the URL so shared links stay short: /phones?grade=a instead of ?q=&sort=new&…
$('#catalog-form')?.addEventListener('submit', (e) => {
  for (const el of e.target.elements) {
    if (!el.name) continue;
    const empty = el.type === 'radio' ? el.checked && el.value === '' : el.value === '' || (el.name === 'sort' && el.value === 'new');
    if (empty) el.disabled = true;
  }
  // Re-enable after navigation starts, so going back shows a working form.
  setTimeout(() => { for (const el of e.target.elements) el.disabled = false; }, 0);
});
