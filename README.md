# Fonbozor — used iPhone marketplace for Uzbekistan

Mobile-first marketplace where people sell and buy used phones. Sellers answer a short set of
condition questions and get an instant price in **soʻm**, calculated from `Apple_Used_Price_List_EN.xlsx`
with every deduction shown line by line. Interface in Uzbek (Latin).

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
| `KRW_TO_UZS` | `8.5` | 1 KRW in soʻm. Published rates were 8.4–9.1 in Aug–Oct 2026; update when it moves. |
| `PRICE_MULTIPLIER` | `1` | The list is a Korean **dealer buy-back** list, so 1 = buy-back level. Private sales in Uzbekistan are usually higher; e.g. `1.25` raises every estimate by 25%. |
| `SITE_NAME` | `Fonbozor` | Brand name shown on the site |

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
5. × 10,000 × `KRW_TO_UZS` × `PRICE_MULTIPLIER`, rounded to 1,000 soʻm.

### Interpretations (the sheet does not spell these out)

- “B- grade” column is treated as grade **B** (the sheet's own grade criteria call it B).
- “No deduction (차감X)” = 0, including back glass on iPhone 8–15.
- Display bracket values like `-9(-2)`: −9 for a broken display, −2 for minor marks/burn-in. Where there is no
  bracket (iPhone 16/17), minor marks cost half the display deduction (the notes mention “half the LCD price”).
- iPhone SE 2/3: low battery and replaced parts count together as “items” (1 → −4, 2 → −6, 3 → −8), as written in the sheet.
- iPhone 17 rows have no scrap price; the iPhone 16 value (5) is used.
- Two camera deductions were transcribed without a minus sign (iPhone 7 “1”, XS Max “2”); they are treated as deductions.
- The Korean “domestic vs overseas” distinction is dropped (it has no meaning in Uzbekistan), except eSIM-only units.

## Pages

| URL | |
|---|---|
| `/` | Home: price check search, newest listings, how it works, grades, safety tips, FAQ |
| `/sotish` | Sell wizard (9 short steps → price → listing details → publish) |
| `/telefonlar` | Catalogue with search, series chips, filters (bottom sheet on phones, sidebar on desktop) |
| `/telefon/:id` | Listing: price vs system estimate, breakdown, condition report, call / Telegram |
| `/narxlar` | Price guide for every model and storage |
| `/sevimlilar`, `/elonlarim` | Favourites and “my listings” (kept on the device, no account needed) |
| `POST /api/estimate` | `{model, storage, answers}` → price breakdown |
| `POST /api/listings` | Create a listing; the price estimate is always recomputed on the server |

## Project layout

```
server.js                 HTTP server, routing, validation, uploads
src/config.js             settings
src/catalog.js            price list + model facts
src/model-meta.js         per-model facts the sheet lacks: year, colours, Face/Touch ID, eSIM, camera layout
src/db.js, src/seed.js    SQLite storage, demo data
src/views/*.js            server-rendered pages
public/assets/pricing.js  price engine (shared by browser and server)
public/assets/questions.js condition questions and labels in Uzbek (shared)
public/assets/sell.js     sell wizard
public/assets/app.css     styles (mobile-first, light + dark)
scripts/import-prices.mjs xlsx → data/prices.json
test/pricing.test.js      price-engine tests
```

## Not done yet (next steps)

- Russian and Uzbek Cyrillic versions (all Uzbek text is already in `questions.js` and the view files).
- Phone-number login with SMS code, instead of the per-device owner token used now.
- Admin/moderation panel (hide listings, edit exchange rate without restart).
- Price lists for Samsung and Xiaomi.
- Hosting: any Node 22+ host works; put it behind HTTPS and back up `data/` and `uploads/`.
