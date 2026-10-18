# Fonbozor — used Apple & Samsung device marketplace for Uzbekistan

Mobile-first marketplace where people sell and buy used **iPhone, Samsung Galaxy, iPad, MacBook and Apple Watch**.
Sellers answer condition questions tailored to the device. iPhones get an instant price in **UZS (Uzbek soʻm)**,
calculated from `Apple_Used_Price_List_EN.xlsx` with every deduction shown line by line; the other categories have
no price list yet, so the seller sets the price and buyers still get the same condition grade and report. Interface in **English and Korean**, switchable from the header.

Why it is built this way: see [ANALYSIS.md](ANALYSIS.md) (problems found on fongabi.com and how each is solved here).

## Run

Requires Node.js 22.13 or newer (uses the built-in `node:sqlite`). No `npm install` needed: there are no dependencies.

```bash
npm start          # http://localhost:3000  (also prints a LAN address to open on your phone)
npm run dev        # same, restarts on file changes
npm test           # price-engine tests
```

On first start the database (`data/app.db`) is created with 18 demo listings. Delete `data/app.db*` and
`uploads/` to start empty again.

### Settings (environment variables)

| Variable | Default | Meaning |
|---|---|---|
| `PORT` | `3000` | HTTP port |
| `KRW_TO_UZS` | `8.5` | 1 KRW in UZS. Published rates were 8.4–9.1 in Aug–Oct 2026; update when it moves. |
| `PRICE_MULTIPLIER` | `1` | The list is a Korean **dealer buy-back** list, so 1 = buy-back level. Private sales in Uzbekistan are usually higher; e.g. `1.25` raises every estimate by 25%. |
| `SITE_NAME` | `Fonbozor` | Brand name shown on the site |
| `TRUST_PROXY` | off | Set to `1` on hosting behind a load balancer (Render, Railway…) so per-visitor limits use the real IP. Not needed for a local Cloudflare tunnel. |

### Showing the demo to others

```powershell
npm start
C:\Users\abdul\tools\cloudflared\cloudflared.exe tunnel --no-autoupdate --url http://localhost:3000
```

The tunnel prints a public `https://….trycloudflare.com` address. It works while both commands run and this
computer is awake, and the address changes on every restart.

Example: `PRICE_MULTIPLIER=1.2 KRW_TO_UZS=8.7 npm start` (PowerShell: `$env:PRICE_MULTIPLIER=1.2; npm start`).

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
   cracked/stained lens −2, bent body −3 (slight) or −15 (severe), refurbished/demo −3, eSIM-only −10.
4. Never below the model's **scrap** price. A phone that doesn't turn on or shows no IMEI gets the scrap price.
   **iCloud on** = cannot be listed.
5. × 10,000 × `KRW_TO_UZS` × `PRICE_MULTIPLIER`, rounded to 1,000 UZS.

### Interpretations (the sheet does not spell these out)

- “B- grade” column is treated as grade **B** (the sheet's own grade criteria call it B).
- “No deduction (차감X)” = 0, including back glass on iPhone 8–15.
- Display bracket values like `-9(-2)`: −9 for a broken display, −2 for minor marks/burn-in. Where there is no
  bracket (iPhone 16/17), minor marks cost half the display deduction (the notes mention “half the LCD price”).
- iPhone SE 2/3: low battery and replaced parts count together as “items” (1 → −4, 2 → −6, 3 → −8), as written in the sheet.
- iPhone 17 rows have no scrap price; the iPhone 16 value (5) is used.
- Two camera deductions were transcribed without a minus sign (iPhone 7 “1”, XS Max “2”); they are treated as deductions.
- The Korean “domestic vs overseas” distinction is dropped (it has no meaning in Uzbekistan), except eSIM-only units.

## Categories

| Category | Models | Specs asked | Battery | Price |
|---|---|---|---|---|
| iPhone | 42 (6 → 17 Pro Max, SE) | storage, colour, SIM type | health % | automatic, from the price list |
| Samsung Galaxy | 52 (S, Z Fold/Flip, A, Note) | storage, colour | good / average / weak | set by the seller |
| iPad | 20 (iPad, mini, Air, Pro) | storage, Wi‑Fi or Cellular, colour | good / average / weak | set by the seller |
| MacBook | 24 (Air and Pro, M1 → M5) | memory, SSD, colour | condition + cycle count | set by the seller |
| Apple Watch | 12 (Series, SE, Ultra) | case size, material, GPS or Cellular, colour | health % | set by the seller |

Questions follow the device: Samsung asks about the Samsung/Google account lock, fingerprint sensor, S Pen and (on
foldables) the inner screen and hinge; iPads about Apple Pencil and cellular; MacBooks about keyboard, trackpad and
ports; Apple Watches about sensors and the Digital Crown. IMEI questions appear only for phones and cellular iPads.
To add a model, add a line to `src/devices.js`.

## Languages

English is the default. Korean is shown when the browser is set to Korean, or after choosing **한국어** in the
header; the choice is remembered in a cookie. Add `?lang=ko` (or `?lang=en`) to any link to share it in that
language. All text lives in `public/assets/i18n/en.js` and `ko.js`, which must have the same keys.
The first version had Uzbek URLs (`/sotish`, `/telefonlar`…); they redirect to the English ones.

## Pages

| URL | |
|---|---|
| `/` | Home: price check search, newest listings, how it works, grades, safety tips, FAQ |
| `/sell` | Sell wizard: pick a category and model, short condition steps, price (iPhone) or grade, listing details, publish. `?cat=`, `?series=`, `?model=` preselect |
| `/phones` | Catalogue with search, series chips, filters (bottom sheet on phones, sidebar on desktop) |
| `/phone/:id` | Listing: price vs system estimate, breakdown, condition report, call / Telegram |
| `/prices` | Price guide for every model and storage |
| `/saved`, `/my-listings` | Favourites and “my listings” (kept on the device, no account needed) |
| `POST /api/estimate` | `{model, storage, answers}` → price breakdown |
| `POST /api/listings` | Create a listing; the price estimate is always recomputed on the server |

## Project layout

```
server.js                 HTTP server, routing, validation, uploads
src/config.js             settings
src/catalog.js            price list + model facts
src/model-meta.js         iPhone facts the sheet lacks: year, colours, Face/Touch ID, eSIM, camera layout
src/devices.js            Samsung Galaxy, iPad, MacBook and Apple Watch catalogues (models, storage, RAM, sizes, colours)
public/assets/categories.js which specs, questions, faults and extras each category uses (shared)
src/db.js, src/seed.js    SQLite storage, demo data
src/views/*.js            server-rendered pages
public/assets/pricing.js  price engine (shared by browser and server)
public/assets/questions.js condition questions: keys and allowed answers (shared)
public/assets/i18n/en.js  all English text   (same keys in ko.js; shared by server and browser)
public/assets/i18n/ko.js  all Korean text
public/assets/sell.js     sell wizard
public/assets/app.css     styles (mobile-first, light + dark)
scripts/import-prices.mjs xlsx → data/prices.json
test/pricing.test.js      price-engine tests
```

## Not done yet (next steps)

- More languages: copy `public/assets/i18n/en.js`, translate it, and add it to `src/i18n.js` and the switch in `src/views/layout.js`.
- Phone-number login with SMS code, instead of the per-device owner token used now.
- Admin/moderation panel (hide listings, edit exchange rate without restart).
- Price lists for Samsung, iPad, MacBook and Apple Watch. Once one exists, give those models price rows like the
  iPhone ones in `data/prices.json` and set `priced: true`; the engine and the wizard already handle the rest.
- Hosting: any Node 22+ host works; put it behind HTTPS and back up `data/` and `uploads/`.
