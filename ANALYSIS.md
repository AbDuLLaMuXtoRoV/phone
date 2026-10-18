# Fongabi.com — what hurts phone users, and what Fonbozor does instead

Reviewed 2026-10-18 on fongabi.com (home `/fon_2` and sell page `/fon_2/sale`), rendered in Chrome with true
iPhone emulation (390 × 844) and at 1440 px desktop. Every point below was checked in the page source, the
rendered DOM, the network bundles or a screenshot. Things that could not be verified are listed separately.

## Problems found

### Speed and data use (the biggest issue on mobile networks)

| # | Problem | Evidence |
|---|---------|----------|
| 1 | **The page is blank until JavaScript loads.** The HTML is an 8 KB shell with a loading spinner; all content is drawn by a Nuxt app in the browser. On a slow 3G/4G connection the user stares at a spinner. | Raw HTML of `/` contains only `<div id="__nuxt">` + spinner CSS. |
| 2 | **3.85 MB of JavaScript** in the four entry bundles alone (one file is 2.8 MB), before page-specific code. | Downloaded `/_nuxt/*.js` entry files. |
| 3 | **45 script tags, ~20 third-party** trackers/SDKs: Facebook Pixel, Google Tag Manager, 2× Google Analytics, Google Ads, Naver analytics + Naver login, Kakao (3 scripts), Daum AdFit, Twitter pixel, Toss, Karrot pixel, Channel.io chat, FlareLane push, Tenping CPA, Apple ID login. | Rendered DOM script list. |
| 4 | **Render-blocking third-party scripts in `<head>`** without `async`/`defer` (FlareLane, Naver, Tenping, Kakao postcode, Facebook, Naver login, Apple ID, Karrot). Each one must download before the page can continue. | Raw HTML `<head>`. |
| 5 | **216 images on the home page.** | Rendered DOM. |
| 6 | **Console errors on every load**: FlareLane push SDK fails to initialise; Meta Pixel warns the same pixel ID is installed twice (double-counted analytics). | Browser console during load. |
| 7 | **Unpinned CDN dependency** `@mdi/font@latest` — any upstream release can change or break icons without warning. | `<link href=".../@mdi/font@latest/...">`. |

### Usability on phones

| # | Problem | Evidence |
|---|---------|----------|
| 8 | **Full-screen promo popup on arrival** covers more than half of the first screen (bottom-sheet carousel with “don’t show today / close”). On desktop it is a centred modal. The user must dismiss an ad before doing anything. | Screenshots at 390 px and 1440 px. |
| 9 | **The first screen is ads, not the task.** Above the fold: a rotating banner (e.g. laptop sale), then category tiles. Selling a phone, the main job, starts lower down. | 390 px screenshot. |
| 10 | **Zoom is disabled**: `maximum-scale=1, user-scalable=no`. People who need larger text (older users, small screens) cannot pinch to zoom prices and grey labels. Fails WCAG 1.4.4. | `<meta name="viewport">`. |
| 11 | **The sell page is a landing page, not a form.** Banner, stats, badges and benefits come first; the seller has to tap “판매 접수 계속하기” (continue) before the first question. | `/fon_2/sale` at 390 px. |
| 12 | **Floating chat bubble covers content** at the bottom-right of the sell page, over the text the user is reading. On desktop a floating “certified business” badge overlaps product cards. | Screenshots. |
| 13 | **Main actions are not links.** The home page has only ~30 `href`s for 216 images; the Sell/Buy tiles are JavaScript click handlers. You can’t long-press to open in a new tab or share them, and search engines can’t follow them. | Rendered DOM link list (no `/fon_2/sale` or `/fon_2/buy` href). |
| 14 | **Three different grading scales**: home “today’s price” uses A/B/C/D, the sell page uses A–E, product cards use S+/A. A seller cannot compare them. | Screenshots of each page. |
| 15 | **“Today’s price” shows one model at a time**, so you can’t look up your own phone without the full flow. Per-defect deductions are not shown up front. | Home and sell page. |
| 16 | **Light grey text on white** for release dates, review text and grade descriptions: hard to read outdoors on a phone. | Screenshots. |
| 17 | **Too many things in one product**: phones, tablets, watches, laptops, earbuds, graphics cards and mobile-plan sign-up (123 app routes). Someone who only wants to sell a phone has to find their way through all of it. | Route list in the app bundle. |

### Not a fit for Uzbekistan (by design, but it matters for us)

Korean only, KRW only, Kakao/Naver/Apple login, Korean postcode search and couriers. No Telegram (the main
messenger in Uzbekistan), no Uzbek or Russian, and nothing about IMEI registration, which decides whether
a phone works with a local SIM card in Uzbekistan.

### Could not verify

Whether login is required before getting a quote, and how the final price after inspection compares to the
online estimate. Both need a real account and a shipped device.

## How Fonbozor answers each point

| Fongabi problem | Fonbozor |
|---|---|
| 1–5 Blank page, 3.85 MB JS, 20 trackers | Pages are rendered on the server: content shows immediately, even before any script runs. Home page is **~20 KB over the network** in total (HTML 6.5 KB + CSS 9.7 KB + JS 3.3 KB, gzipped). No third-party scripts, no web fonts (system fonts), phone images are drawn as small inline SVG. |
| 6–7 Console errors, unpinned CDN | No external dependencies at all: zero npm packages, nothing loaded from a CDN. |
| 8–9 Popup, ads first | No popups or banners. The first screen asks one question: “How much is your phone worth?” with a model search box and one-tap popular models. |
| 10 Zoom disabled | Zoom allowed; text and contrast follow WCAG AA; touch targets are at least 44 px; works from 320 px wide phones up to desktop, with no sideways scrolling (tested at 320, 360, 390 and 1440 px). |
| 11 Sell page is a landing page | “Sotish” opens directly on the first question. One short step per screen, big tap targets, a live price in the bottom bar from the moment the model is chosen. The phone’s back button moves between steps, and answers survive a reload. |
| 12 Floating widgets | Nothing floats over content; the only fixed elements are the bottom tab bar (or the action bar on focused pages). |
| 13 Actions aren’t links | Every page and action is a real link or form; listings, filters and searches have shareable URLs. |
| 14–15 Three grade scales, hidden deductions | One scale everywhere: **A, A−, B+, B, C**, taken from the price list and explained in plain language. The estimate shows **every line**: base price for the grade, then each deduction in UZS. Buyers see the same breakdown and a “fair / cheap / expensive” badge comparing the asking price with the system estimate. A price guide (`/prices`) lists every model and storage. |
| 16 Low contrast | Body text ≥ 4.5:1 contrast in light and dark mode. |
| 17 Too many categories | Phones only. iPhone first (that is what the price list covers); Samsung/Xiaomi can be added the same way when price data exists. |
| Uzbekistan fit | English and Korean interface (switchable), prices in UZS, all 14 regions, contact by phone call or Telegram, no registration needed. Listings show **IMEI registration status**. **iCloud must be off** to list a phone (stops stolen and locked phones). eSIM-only (US) units are flagged and priced accordingly. |
