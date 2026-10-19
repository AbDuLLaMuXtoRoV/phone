// Won ↔ dollar conversion and how prices are written in each language. Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { moneyPack, fromKrw, toKrw, defaultCurrency } from '../public/assets/money.js';

const RATE = 1335;

test('Korean visitors start with won, everyone else with dollars', () => {
  assert.equal(defaultCurrency('ko'), 'KRW');
  assert.equal(defaultCurrency('en'), 'USD');
  assert.equal(moneyPack('en', 'XYZ', RATE).cur, 'USD');
});

test('won and dollar prices in both languages', () => {
  assert.equal(moneyPack('ko', 'KRW', RATE).price(640_000), '640,000원');
  assert.equal(moneyPack('en', 'KRW', RATE).price(640_000), '₩640,000');
  assert.equal(moneyPack('en', 'USD', RATE).price(640_000), '$479');
  assert.equal(moneyPack('ko', 'USD', RATE).price(640_000), '$479');
  assert.equal(moneyPack('en', 'USD', RATE).alt(640_000), '₩640,000');
  assert.equal(moneyPack('ko', 'KRW', RATE).alt(640_000), '$479');
  assert.equal(moneyPack('ko', 'USD', RATE).currency, '달러');
});

test('a dollar price typed by a seller survives the round trip through won', () => {
  for (const usd of [8, 99, 479, 1250, 3999]) assert.equal(fromKrw(toKrw(usd, 'USD', RATE), 'USD', RATE), usd);
  assert.equal(toKrw(500_000, 'KRW', RATE), 500_000);
  assert.equal(toKrw(479, 'USD', RATE), 639_000); // reads as a round number in won
});

test('quick asking prices are round numbers', () => {
  assert.equal(moneyPack('en', 'USD', RATE).round(640_000 * 1.05), 505);
  assert.equal(moneyPack('ko', 'KRW', RATE).round(640_000 * 0.95), 610_000);
});
