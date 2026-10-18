// Price engine checks. Expected values were worked out by hand from Apple_Used_Price_List_EN.xlsx
// (units of 10,000 KRW). Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { byId, MODELS } from '../src/catalog.js';
import { estimate, conditionGrade, priceVerdict, toUzs } from '../public/assets/pricing.js';

const S = { unitKRW: 10000, krwToUzs: 8.5, multiplier: 1, roundTo: 1000 };
const units = (id, storage, answers) => estimate(byId(id), storage, answers, S).units;

test('every model from the price list has metadata and prices', () => {
  assert.equal(MODELS.length, 42);
  for (const m of MODELS) {
    assert.ok(m.storages.length > 0, m.id);
    assert.ok(m.colors.length > 0, `${m.id} colours`);
    for (const r of m.storages) assert.equal(typeof r.base, 'number', `${m.id} ${r.label} base price`);
  }
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
  assert.equal(r.uzs, 2_933_000);
});

test('never below scrap; dead phones get the scrap price; iCloud blocks', () => {
  assert.equal(units('iphone-6', '64 GB', { faults: ['biometric', 'charging'] }), 0.5);
  assert.equal(estimate(byId('iphone-17-pro-max'), '2 TB', { powersOn: 'no' }, S).status, 'scrap');
  assert.equal(units('iphone-17-pro-max', '2 TB', { powersOn: 'no' }), 5);
  assert.equal(estimate(byId('iphone-15'), '128 GB', { icloudOff: 'no' }, S).status, 'blocked');
});

test('eSIM-only and grades', () => {
  assert.equal(units('iphone-15', '128 GB', { sim: 'esim' }), 58 - 10);
  assert.equal(conditionGrade({ screen: 'A', body: 'A', backGlass: 'cracked' }), 'C');
  assert.equal(conditionGrade({ screen: 'A-', body: 'B+', lens: 'scratched' }), 'B+');
});

test('conversion and price verdicts', () => {
  assert.equal(toUzs(45, S), 3_825_000);
  assert.equal(priceVerdict(900_000, 1_000_000).k, 'deal');
  assert.equal(priceVerdict(1_050_000, 1_000_000).k, 'fair');
  assert.equal(priceVerdict(1_200_000, 1_000_000).k, 'high');
});
