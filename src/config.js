// Every setting can be overridden with an environment variable.
const env = process.env;

export default {
  siteName: env.SITE_NAME || 'Fonbozor',
  port: Number(env.PORT) || 3000,
  host: env.HOST || '0.0.0.0',
  // Set TRUST_PROXY=1 when hosted behind a platform load balancer (Render, Railway…), so rate limits see real visitors.
  trustProxy: env.TRUST_PROXY === '1',
  // Set DEMO_DATA=1 to fill an empty site with made-up example listings (never use on the real site).
  demoData: env.DEMO_DATA === '1',

  pricing: {
    // Price list values are in units of 10,000 KRW. Prices are stored in won and shown in won or dollars.
    unitKRW: 10000,
    // Won per US dollar, for dollar prices. Mid-market rate was 1,335 on 19 Oct 2026; update it when the rate moves.
    krwPerUsd: Number(env.KRW_PER_USD) || 1335,
    // The source list is a dealer buy-back list. 1 = show those prices as they are; raise it
    // (e.g. 1.2) if you want estimates closer to private-sale prices.
    multiplier: Number(env.PRICE_MULTIPLIER) || 1,
    // Round estimates to this many won.
    roundTo: 1000,
  },

  maxPhotos: 6,
  maxPhotoBytes: 2.5 * 1024 * 1024,
};
