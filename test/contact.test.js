// Seller contact details for Korea: mobile numbers, KakaoTalk, regions. Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { koreanMobile, kakaoContact, REGIONS } from '../public/assets/questions.js';
import { formatPhone } from '../src/util.js';
import en from '../public/assets/i18n/en.js';
import ko from '../public/assets/i18n/ko.js';

test('Korean mobile numbers in any common format', () => {
  for (const v of ['010-1234-5678', '01012345678', '010 1234 5678', '+82 10-1234-5678', '+82 010 1234 5678', '821012345678']) {
    assert.equal(koreanMobile(v), '01012345678', v);
  }
  assert.equal(koreanMobile('011-123-4567'), '0111234567');
  for (const v of ['', '02-123-4567', '010-1234-567', '90 123 45 67', '+998 90 123 45 67', '010-1234-56789']) assert.equal(koreanMobile(v), null, v);
});

test('phone numbers are shown the Korean way', () => {
  assert.equal(formatPhone('+821012345678'), '010-1234-5678');
  assert.equal(formatPhone('+82111234567'), '011-123-4567');
});

test('KakaoTalk: an ID or an open chat link', () => {
  assert.equal(kakaoContact(''), '');
  assert.equal(kakaoContact('minjun_92'), 'minjun_92');
  assert.equal(kakaoContact('@min.jun'), 'min.jun');
  assert.equal(kakaoContact('open.kakao.com/o/sAbC123'), 'https://open.kakao.com/o/sAbC123');
  assert.equal(kakaoContact('https://open.kakao.com/o/sAbC123/'), 'https://open.kakao.com/o/sAbC123');
  for (const v of ['abc', 'has space', 'https://evil.example/o/abc123', 'javascript:alert(1)', 'a'.repeat(21)]) assert.equal(kakaoContact(v), null, v);
});

test('every Korean region has a name in both languages', () => {
  assert.equal(REGIONS.length, 17);
  for (const r of REGIONS) {
    assert.ok(en.regions[r], `en ${r}`);
    assert.ok(ko.regions[r], `ko ${r}`);
  }
});
