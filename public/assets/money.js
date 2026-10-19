// Prices are stored in Korean won, the price list's own currency. Visitors see them in won or US dollars
// (switch in the header; Korean visitors start with won, everyone else with dollars). Shared by the server
// and the browser: moneyPack() is merged into the language pack, so views write L.price(krw).

export const CURRENCIES = ['KRW', 'USD'];
export const defaultCurrency = (lang) => (lang === 'ko' ? 'KRW' : 'USD');

const group = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// Won → whole won or whole dollars.
export const fromKrw = (krw, cur, krwPerUsd) => Math.round(cur === 'USD' ? krw / krwPerUsd : krw);
// An amount in won or dollars → won. Dollars become whole 1,000 won (so they read well in won); that is
// under half a dollar off, so the same whole-dollar amount comes back.
export const toKrw = (amount, cur, krwPerUsd) => (cur === 'USD' ? Math.round((amount * krwPerUsd) / 1000) * 1000 : Math.round(amount));

export function moneyPack(lang, cur, krwPerUsd) {
  if (!CURRENCIES.includes(cur)) cur = defaultCurrency(lang);
  // `n` is already in currency `c`.
  const fmt = (n, c = cur) => (c === 'USD' ? `$${group(n)}` : lang === 'ko' ? `${group(n)}원` : `₩${group(n)}`);
  const other = cur === 'USD' ? 'KRW' : 'USD';
  return {
    cur, krwPerUsd,
    // Short name next to inputs and in labels.
    currency: lang === 'ko' ? (cur === 'USD' ? '달러' : '원') : cur,
    group, // digits with thousands separators, no conversion
    fmt, // an amount already in the shown currency, with its symbol
    price: (krw) => fmt(fromKrw(krw, cur, krwPerUsd)),
    money: (krw) => group(fromKrw(krw, cur, krwPerUsd)), // for input values
    // The same price in the other currency, shown as "≈": whole dollars or whole 1,000 won.
    alt: (krw) => fmt(other === 'KRW' ? Math.round(krw / 1000) * 1000 : fromKrw(krw, other, krwPerUsd), other),
    toKrw: (n) => toKrw(n, cur, krwPerUsd),
    // A round asking price near `krw`: whole 10,000 won or whole 5 dollars.
    round: (krw) => (cur === 'USD' ? Math.round(krw / krwPerUsd / 5) * 5 : Math.round(krw / 10000) * 10000),
  };
}
