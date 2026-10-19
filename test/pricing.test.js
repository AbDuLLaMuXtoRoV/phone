// Price engine checks. Expected values were worked out by hand from Apple_Used_Price_List_EN.xlsx
// (units of 10,000 KRW). Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { byId, MODELS } from '../src/catalog.js';
import { estimate, conditionGrade, priceVerdict, unitsToKrw } from '../public/assets/pricing.js';

const S = { unitKRW: 10000, multiplier: 1, roundTo: 1000 };
const units = (id, storage, answers) => estimate(byId(id), storage, answers, S).units;

test('every model from the price list has metadata and prices', () => {
  const iphones = MODELS.filter((m) => m.category === 'iphone');
  assert.equal(iphones.length, 42);
  for (const m of iphones) {
    assert.ok(m.priced, m.id);
    for (const r of m.storages) assert.equal(typeof r.base, 'number', `${m.id} ${r.label} base price`);
  }
});

test('every model in every category has specs, colours and a unique id', () => {
  assert.equal(new Set(MODELS.map((m) => m.id)).size, MODELS.length);
  for (const m of MODELS) {
    assert.ok(m.storages.length > 0, `${m.id} storages`);
    assert.ok(m.colors.length > 0 && m.colors.every((c) => c.hex), `${m.id} colours`);
    assert.ok(m.art, `${m.id} drawing`);
    if (m.category === 'macbook') assert.ok(m.ram?.length, `${m.id} RAM options`);
    if (m.category === 'watch') assert.ok(m.materials?.length && m.connectivity?.length, `${m.id} case and connectivity`);
    if (m.category === 'ipad') assert.deepEqual(m.connectivity, ['wifi', 'cellular']);
  }
});

test('devices without a price list get a condition grade but no price', () => {
  const s24u = byId('galaxy-s24-ultra');
  const r = estimate(s24u, '256 GB', { screen: 'A', body: 'A', inner: undefined }, S);
  assert.equal(r.status, 'unpriced');
  assert.equal(r.grade, 'A');
  assert.equal(r.krw, undefined);
  assert.equal(estimate(byId('galaxy-z-flip6'), '256 GB', { screen: 'A', body: 'A', inner: 'minor' }, S).grade, 'B+');
  assert.equal(estimate(byId('galaxy-z-flip6'), '256 GB', { screen: 'A', body: 'A', inner: 'damaged' }, S).grade, 'C');
  assert.equal(estimate(byId('apple-watch-series-10'), '46 mm', { icloudOff: 'no' }, S).status, 'blocked');
  assert.equal(estimate(byId('macbook-air-13-m4'), '256 GB', { powersOn: 'no' }, S).grade, 'C');
});

test('grade price for a perfect phone', () => {
  assert.equal(units('iphone-13-pro', '128 GB', {}), 45);
  assert.equal(units('iphone-17-pro-max', '2 TB', {}), 211);
});

test('battery below the grade requirement', () => {
  assert.equal(units('iphone-13-pro', '128 GB', { battery: 87 }), 39, 'uses the "battery below std. A/A-" column');
  assert.equal(units('iphone-11', '64 GB', { battery: 86 }), 18, 'no battery column: falls to B+ price');
  assert.equal(units('iphone-11', '64 GB', { battery: 70 }), 14, 'below every grade: base price');
});

test('grade marked X (not bought) uses the base price', () => {
  assert.equal(units('iphone-14', '128 GB', { screen: 'B', body: 'B' }), 31);
});

test('screen damage', () => {
  assert.equal(units('iphone-13-pro', '128 GB', { glass: 'cracked' }), 35 - 1);
  assert.equal(units('iphone-13-pro', '128 GB', { display: 'major', faults: ['biometric'] }), 35 - 15.5 - 5.5);
  assert.equal(units('iphone-13-pro', '128 GB', { display: 'minor' }), 40 - 2, 'minor mark: grade capped at B+, bracket deduction');
  assert.equal(units('iphone-16-pro-max', '256 GB', { display: 'minor' }), 118 - 19, 'no bracket value: half the display deduction');
});

test('replaced parts', () => {
  assert.equal(units('iphone-12', '64 GB', { parts: { screen: 'unknown', battery: 'unknown' } }), 25 - 2 * 7.5, 'unknown-part deductions stack');
  assert.equal(units('iphone-12', '64 GB', { parts: { screen: 'genuine', battery: 'genuine', camera: 'genuine' } }), 25 - 7.5, '3 genuine parts = non-genuine deduction');
  assert.equal(units('iphone-se-2', '64 GB', { battery: 80, parts: { battery: 'genuine' } }), 11 - 6, 'SE: low battery + part = 2 items');
});

test('the full wizard scenario from the demo', () => {
  const a = { screen: 'A-', body: 'B+', battery: 87, faults: ['trueTone'], parts: { battery: 'genuine' } };
  const r = estimate(byId('iphone-13-pro'), '256 GB', a, S);
  assert.equal(r.grade, 'B+');
  assert.equal(r.units, 46 - 8.5 - 3);
  assert.equal(r.krw, 345_000);
});

test('never below scrap; dead phones get the scrap price; iCloud blocks', () => {
  assert.equal(units('iphone-6', '64 GB', { faults: ['biometric', 'charging'] }), 0.5);
  assert.equal(estimate(byId('iphone-17-pro-max'), '2 TB', { powersOn: 'no' }, S).status, 'scrap');
  assert.equal(units('iphone-17-pro-max', '2 TB', { powersOn: 'no' }), 5);
  assert.equal(estimate(byId('iphone-15'), '128 GB', { icloudOff: 'no' }, S).status, 'blocked');
});

test('grade follows the worst cosmetic answer', () => {
  assert.equal(conditionGrade({ screen: 'A', body: 'A', backGlass: 'cracked' }), 'C');
  assert.equal(conditionGrade({ screen: 'A-', body: 'B+', lens: 'scratched' }), 'B+');
});

test('conversion and price verdicts', () => {
  assert.equal(unitsToKrw(45, S), 450_000);
  assert.equal(unitsToKrw(45, { ...S, multiplier: 1.2 }), 540_000);
  assert.equal(priceVerdict(900_000, 1_000_000).k, 'deal');
  assert.equal(priceVerdict(1_050_000, 1_000_000).k, 'fair');
  assert.equal(priceVerdict(1_200_000, 1_000_000).k, 'high');
});
