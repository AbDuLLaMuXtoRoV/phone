# Fonbozor — used Apple & Samsung device marketplace for Korea

Mobile-first marketplace where people sell and buy used **iPhone, Samsung Galaxy, iPad, MacBook and Apple Watch**.
Sellers answer condition questions tailored to the device. iPhones get an instant price in **Korean won or US dollars**,
calculated from `Apple_Used_Price_List_EN.xlsx` with every deduction shown line by line; the other categories have
no price list yet, so the seller sets the price and buyers still get the same condition grade and report. Interface in **English and Korean**, prices in **won (₩) or dollars ($)**, both switchable from the header menu.
Korean visitors start with won, everyone else with dollars; the choice is remembered in a cookie (`?cur=KRW` or `?cur=USD` in a link sets it).
Prices are stored in won (the price list's own currency); dollar amounts use the `KRW_PER_USD` rate.

Why it is built this way: see [ANALYSIS.md](ANALYSIS.md) (problems found on fongabi.com and how each is solved here).

## Run

Requires Node.js 22.13 or newer (uses the built-in `node:sqlite`). No `npm install` needed: there are no dependencies.

```bash
npm start          # http://localhost:3000  (also prints a LAN address to open on your phone)
npm run dev        # same, restarts on file changes
npm test           # price-engine tests
```

The site starts with no listings; the database (`data/app.db`) and `uploads/` fill up as people post.
For a local demo you can add 27 made-up example listings with `DEMO_DATA=1` (PowerShell:
`$env:DEMO_DATA=1; npm start`) — never on the real site. Delete `data/app.db*` and `uploads/` to start empty again.

### Settings (environment variables)

| Variable | Default | Meaning |
|---|---|---|
| `PORT` | `3000` | HTTP port |
| `KRW_PER_USD` | `1335` | Won per US dollar, for dollar prices (mid-market rate on 19 Oct 2026). Update it when the rate moves. |
| `PRICE_MULTIPLIER` | `1` | The list is a Korean **dealer buy-back** list, so 1 = buy-back level. Private sales are usually higher; e.g. `1.25` raises every estimate by 25%. |
| `SITE_NAME` | `Fonbozor` | Brand name shown on the site |
| `DEMO_DATA` | off | Set to `1` to add made-up example listings to an empty database (local demos only). |
| `TRUST_PROXY` | off | Set to `1` on hosting behind a load balancer (Render, Railway…) so per-visitor limits use the real IP. Not needed for a local Cloudflare tunnel. |

### Showing the demo to others

```powershell
npm start
C:\Users\abdul\tools\cloudflared\cloudflared.exe tunnel --no-autoupdate --url http://localhost:3000
```

The tunnel prints a public `https://….trycloudflare.com` address. It works while both commands run and this
computer is awake, and the address changes on every restart.

Example: `PRICE_MULTIPLIER=1.2 KRW_PER_USD=1350 npm start` (PowerShell: `$env:PRICE_MULTIPLIER=1.2; npm start`).

### Updating prices

```bash
npm run import-prices -- "C:\path\to\Apple_Used_Price_List_EN.xlsx"
```

This rewrites `data/prices.json` (default path: `~/Downloads/Apple_Used_Price_List_EN.xlsx`). The importer reads
columns by their header text, so it survives reordered columns. Restart the server afterwards and run `npm test`.
A new model that is not yet in `src/model-meta.js` still works (with default colours/features) and logs a warning.

## How the price is calculated

All list values are in units of **10,000 KRW** (stated in the sheet's own notes).

1. **Grade** from the seller's answers, the worst of: screen surface, body, camera lens, display marks.
   A cracked screen glass, cracked back glass, broken display or badly bent body puts the phone at **C**
   (the list's base "as-is" price).
2. **Base price** = the model + storage price for that grade (A / A− / B+ / B).
   - Battery below the grade's requirement (A/A− ≥ 90%, B+ ≥ 85%, B ≥ 81%): use the list's
     "battery below standard" column; if the model has none, the best lower grade whose battery rule is met;
     otherwise the base price.
   - Grade marked **X** (not bought) or blank: base price.
3. **Deductions** from the list for: cracked glass, display defect (major value or the bracket "minor" value),
   Face ID / Touch ID, camera, Wi-Fi/compass/Apple Pay, microphone, back glass, True Tone, unknown-part messages
   (each part counts, they stack), genuine-part messages (series tiers: 1, 2, 3 parts).
   From the list's notes column: no vibration / no charging / buttons / speaker −2 each, Camera Control −2,
   cracked/stained lens −2, bent body −3 (slight) or −15 (severe), refurbished/demo −3. (The list's eSIM-only deduction is not used.)
4. Never below the model's **scrap** price. A phone that doesn't turn on or shows no IMEI gets the scrap price.
   **iCloud on** = cannot be listed.
5. × 10,000 × `PRICE_MULTIPLIER` = won, rounded to 1,000 won. In dollars: ÷ `KRW_PER_USD`, rounded to whole dollars.
   A seller's dollar asking price is stored as won rounded to 1,000 (under half a dollar off, so it reads back the same).

### Interpretations (the sheet does not spell these out)

- “B- grade” column is treated as grade **B** (the sheet's own grade criteria call it B).
- “No deduction (차감X)” = 0, including back glass on iPhone 8–15.
- Display bracket values like `-9(-2)`: −9 for a broken display, −2 for minor marks/burn-in. Where there is no
  bracket (iPhone 16/17), minor marks cost half the display deduction (the notes mention “half the LCD price”).
- iPhone SE 2/3: low battery and replaced parts count together as “items” (1 → −4, 2 → −6, 3 → −8), as written in the sheet.
- iPhone 17 rows have no scrap price; the iPhone 16 value (5) is used.
- Two camera deductions were transcribed without a minus sign (iPhone 7 “1”, XS Max “2”); they are treated as deductions.
- The Korean “domestic vs overseas” and eSIM-only distinctions are not used.

## Categories

| Category | Models | Specs asked | Battery | Price |
|---|---|---|---|---|
| iPhone | 42 (6 → 17 Pro Max, SE) | storage, colour | health % | automatic, from the price list |
| Samsung Galaxy | 52 (S, Z Fold/Flip, A, Note) | storage, colour | good / average / weak | set by the seller |
| iPad | 20 (iPad, mini, Air, Pro) | storage, Wi‑Fi or Cellular, colour | good / average / weak | set by the seller |
| MacBook | 24 (Air and Pro, M1 → M5) | memory, SSD, colour | condition + cycle count | set by the seller |
| Apple Watch | 12 (Series, SE, Ultra) | case size, material, GPS or Cellular, colour | health % | set by the seller |

Questions follow the device: Samsung asks about the Samsung/Google account lock, fingerprint sensor, S Pen and (on
foldables) the inner screen and hinge; iPads about Apple Pencil and cellular; MacBooks about keyboard, trackpad and
ports; Apple Watches about sensors and the Digital Crown. IMEI questions appear only for phones and cellular iPads.
To add a model, add a line to `src/devices.js`.

## Seller contact details

Sellers give a Korean mobile number (`010-1234-5678`; a pasted `+82 10…` works too), one of Korea's 17 provinces
and cities, and optionally KakaoTalk: an ID (buyers tap it to copy it and add the seller as a friend) or an
open chat link `open.kakao.com/o/…` (buyers tap it to open the chat). The site was first built for Uzbekistan;
the `telegram` and `uzimei` database columns from then are no longer used.

## Example pictures (“?” on the screen and body questions)

Next to **Screen surface** and **Body** the sell form has a **? Examples** button. It opens one picture per answer
(A, A−, B+, B, C) so sellers can compare their device; **Choose this** answers the question.

Real photos come from Wikimedia Commons under free licences, and each one shows its credit as the licence requires.
No freely licensed photo of a scratched *screen* or of a dented body exists there, so screen A−, B, C and body B are
drawings (marked “Illustration”). To use your own photos, put them in `public/assets/examples/`, point the line in
`public/assets/examples.js` at the file and delete its `credit`.

| Picture | Photo | Licence |
|---|---|---|
| Screen A | [IPhone 5 paint (top)](https://commons.wikimedia.org/wiki/File:IPhone_5_paint_(top).jpg), Neilpcronin | CC BY-SA 3.0 |
| Body A | [Compare iPhone 16 Pro with the iPhone 15 Pro](https://commons.wikimedia.org/wiki/File:Compare_iPhone_16_Pro_with_the_iPhone_15_Pro.jpg), Hannerdy | CC BY-SA 4.0 |
| Body A− | [Iphone scratched face](https://commons.wikimedia.org/wiki/File:Iphone_scratched_face.jpg), Hi-tech@Mail.Ru | CC BY 3.0 |
| Body B+ | [IPhone 5 paint (bottom)](https://commons.wikimedia.org/wiki/File:IPhone_5_paint_(bottom).jpg), Neilpcronin | CC BY-SA 3.0 |
| Body C | [Apple iPhone 2G 8GB (14)](https://commons.wikimedia.org/wiki/File:Apple_iPhone_2G_8GB_(14).jpg), Sevela.p | CC BY-SA 3.0 |

The photos are cropped and resized; those crops are shared under the same licence as the original.

## Languages

English is the default. Korean is shown when the browser is set to Korean, or after choosing **한국어** in the
header; the choice is remembered in a cookie. Add `?lang=ko` (or `?lang=en`) to any link to share it in that
language. All text lives in `public/assets/i18n/en.js` and `ko.js`, which must have the same keys.
The first version had Uzbek URLs (`/sotish`, `/telefonlar`…); they redirect to the English ones.

## Pages

| URL | |
|---|---|
| `/` | Home: price check search, newest listings, how it works, grades, safety tips, FAQ |
| `/sell` | One-page sell form: brand, device and model, then every condition question below, price (iPhone) or grade, listing details, publish. Any answer can be changed in place. `?cat=`, `?series=`, `?model=` preselect |
| `/phones` | Catalogue with search, series chips, filters (bottom sheet on phones, sidebar on desktop) |
| `/phone/:id` | Listing: price vs system estimate, breakdown, condition report, call / KakaoTalk |
| `/prices` | Price guide for every model and storage |
| `/saved`, `/my-listings` | Favourites and “my listings” (kept on the device, no account needed) |
| `POST /api/estimate` | `{model, storage, answers}` → price breakdown |
| `POST /api/listings` | Create a listing; the price estimate is always recomputed on the server |

## Project layout

```
server.js                 HTTP server, routing, validation, uploads
src/config.js             settings
src/catalog.js            price list + model facts
src/model-meta.js         iPhone facts the sheet lacks: year, colours, Face/Touch ID, camera layout
src/devices.js            Samsung Galaxy, iPad, MacBook and Apple Watch catalogues (models, storage, RAM, sizes, colours)
public/assets/categories.js which specs, questions, faults and extras each category uses (shared)
src/db.js, src/seed.js    SQLite storage, demo data
src/views/*.js            server-rendered pages
public/assets/pricing.js  price engine (shared by browser and server)
public/assets/money.js    won ↔ dollar conversion and price formatting (shared)
public/assets/examples.js example pictures for the screen and body answers (files in public/assets/examples/)
public/assets/questions.js condition questions: keys and allowed answers (shared)
public/assets/i18n/en.js  all English text   (same keys in ko.js; shared by server and browser)
public/assets/i18n/ko.js  all Korean text
public/assets/sell.js     one-page sell form
public/assets/app.css     styles (mobile-first, light + dark)
scripts/import-prices.mjs xlsx → data/prices.json
test/*.test.js            price engine, currency, language and category tests
```

## Not done yet (next steps)

- More languages: copy `public/assets/i18n/en.js`, translate it, and add it to `src/i18n.js` and the switch in `src/views/layout.js`.
- Phone-number login with SMS code, instead of the per-device owner token used now.
- Admin/moderation panel (hide listings, edit exchange rate without restart).
- Price lists for Samsung, iPad, MacBook and Apple Watch. Once one exists, give those models price rows like the
  iPhone ones in `data/prices.json` and set `priced: true`; the engine and the sell form already handle the rest.
- Hosting: any Node 22+ host works; put it behind HTTPS and back up `data/` and `uploads/`.
