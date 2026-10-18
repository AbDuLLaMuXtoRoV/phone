// Every setting can be overridden with an environment variable.
const env = process.env;

export default {
  siteName: env.SITE_NAME || 'Fonbozor',
  port: Number(env.PORT) || 3000,
  host: env.HOST || '0.0.0.0',
  // Set TRUST_PROXY=1 when hosted behind a platform load balancer (Render, Railway…), so rate limits see real visitors.
  trustProxy: env.TRUST_PROXY === '1',

  pricing: {
    // Price list values are in units of 10,000 KRW.
    unitKRW: 10000,
    // 1 KRW in UZS. Published rates were 8.4–9.1 in Aug–Oct 2026; update this when the rate moves.
    krwToUzs: Number(env.KRW_TO_UZS) || 8.5,
    // The source list is a dealer buy-back list. 1 = show those prices as they are; raise it
    // (e.g. 1.2) if you want estimates closer to private-sale prices in Uzbekistan.
    multiplier: Number(env.PRICE_MULTIPLIER) || 1,
    // Round displayed prices to this many UZS.
    roundTo: 1000,
  },

  maxPhotos: 6,
  maxPhotoBytes: 2.5 * 1024 * 1024,
};
