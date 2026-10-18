// Every language pack must have exactly the same keys, so no text goes missing in one language.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import en from '../public/assets/i18n/en.js';
import ko from '../public/assets/i18n/ko.js';
import { REGIONS, LOOKS, SCREEN, BASIC, MORE, FAULT_KEYS, PARTS, EXTRAS, GRADE_KEYS, faultText } from '../public/assets/questions.js';
import { CATEGORY_KEYS, CATEGORIES } from '../public/assets/categories.js';
import { COLORS } from '../src/model-meta.js';
import { MODELS } from '../src/catalog.js';

const keys = (o, p = '') => Object.entries(o).flatMap(([k, v]) =>
  (v && typeof v === 'object' && !Array.isArray(v) ? keys(v, `${p}${k}.`) : [`${p}${k}`]));

test('English and Korean have the same keys', () => {
  assert.deepEqual(keys(ko).sort(), keys(en).sort());
  for (const k of ['steps', 'tips', 'faq', 'safeTips']) assert.equal(ko.t[k].length, en.t[k].length, k);
});

for (const L of [en, ko]) {
  test(`${L.lang}: every question, answer, fault, region, colour, grade and category is worded`, () => {
    const { connectivity, material, ...fixed } = MORE;
    for (const [q, values] of Object.entries({ ...BASIC, ...LOOKS, ...SCREEN, ...fixed, connectivity, material })) {
      assert.ok(L.q[q]?.title, `${q} title`);
      for (const v of values) assert.ok(L.q[q].opts[v], `${q}.${v}`);
    }
    for (const k of FAULT_KEYS) assert.ok(L.faults[k]?.q && L.faults[k]?.s, k);
    for (const p of PARTS.items) assert.ok(L.parts.items[p], p);
    for (const o of PARTS.options) assert.ok(L.parts.opts[o], o);
    for (const e of EXTRAS) assert.ok(L.extras[e], e);
    for (const r of REGIONS) assert.ok(L.regions[r], r);
    for (const c of Object.keys(COLORS)) assert.ok(L.colors[c], c);
    for (const g of GRADE_KEYS) assert.ok(L.grades[g]?.name, g);
    for (const c of CATEGORY_KEYS) assert.ok(L.cats[c], c);
    // Every fault a model can show has wording for that model.
    for (const m of MODELS) for (const k of CATEGORIES[m.category].faults) assert.ok(faultText(L, k, m).q, `${m.id} ${k}`);
  });
}
