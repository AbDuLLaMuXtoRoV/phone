// Which questions each kind of device gets.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { byId } from '../src/catalog.js';
import { applies, faultsFor, stepsFor, batteryMode, extrasFor } from '../public/assets/categories.js';

test('phones and cellular iPads get the IMEI question; Wi‑Fi iPads, Macs and Watches do not', () => {
  assert.ok(applies('imeiOk', byId('iphone-13')));
  assert.ok(applies('imeiOk', byId('galaxy-s24')));
  assert.ok(!applies('imeiOk', byId('ipad-air-11-m2'), { connectivity: 'wifi' }));
  assert.ok(applies('imeiOk', byId('ipad-air-11-m2'), { connectivity: 'cellular' }));
  assert.ok(!applies('imeiOk', byId('macbook-air-13-m2')));
  assert.ok(!applies('imeiOk', byId('apple-watch-ultra-2')));
});

test('model features decide the extra questions', () => {
  assert.ok(faultsFor(byId('galaxy-s24-ultra')).includes('spen'));
  assert.ok(!faultsFor(byId('galaxy-s24')).includes('spen'));
  assert.ok(faultsFor(byId('galaxy-z-fold6')).includes('hinge'));
  assert.ok(applies('inner', byId('galaxy-z-flip6')));
  assert.ok(!applies('backGlass', byId('galaxy-a25')), 'plastic back');
  assert.ok(faultsFor(byId('iphone-16-pro')).includes('cameraButton'));
  assert.ok(!faultsFor(byId('iphone-13')).includes('cameraButton'));
  assert.ok(faultsFor(byId('ipad-pro-11-m4'), { connectivity: 'cellular' }).includes('cellular'));
  assert.ok(!faultsFor(byId('ipad-pro-11-m4'), { connectivity: 'wifi' }).includes('cellular'));
  assert.deepEqual(extrasFor(byId('apple-watch-series-9')), ['box', 'cable', 'receipt', 'band']);
});

test('battery and steps per category', () => {
  assert.equal(batteryMode(byId('iphone-15')), 'percent');
  assert.equal(batteryMode(byId('galaxy-s25')), 'level');
  assert.equal(batteryMode(byId('macbook-pro-14-m4')), 'mac');
  assert.equal(batteryMode(byId('apple-watch-se-3')), 'percent');
  assert.ok(stepsFor(byId('iphone-15')).includes('parts'));
  assert.ok(!stepsFor(byId('galaxy-s25')).includes('parts'));
  assert.ok(!stepsFor(byId('galaxy-s25'), false).includes('faults'), 'a dead device skips the function checks');
});
