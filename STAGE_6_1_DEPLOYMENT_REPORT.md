# Stage 6.1 Deployment Report

## Status

PASS

## Source

Local:

f:\laragon\www\rakhimov

## Target

https://www.rakhimovr.uz/

## Vercel

https://rakhimov-ten.vercel.app/

## Git

- branch: main
- previous commit: dad1d80 Deploy latest production version
- new commit: 269a4eb Stage 6: set www.rakhimovr.uz as canonical domain
- push: PASS (origin main up to date)
- status: clean (working tree clean)

## Build

- npm run build: PASS
- build time: 3.37s
- main JS: dist/assets/index-CH62Vzmf.js (435.28 kB)
- gzip: 132.57 kB

## Deployment

- Vercel deployment: SUCCESS
- status: Ready / Success
- commit: 269a4eb
- deployment URL: https://rakhimov-ten.vercel.app/

## Production Verification

| Test | Status |
|---|---|
| Vercel URL | PASS |
| www.rakhimovr.uz | PASS |
| rakhimovr.uz redirect | PASS |
| HTTPS | PASS |
| Home | PASS |
| Sushka | PASS |
| Lamp | PASS |
| Patents | PASS |
| Books | PASS |
| Search | PASS |
| RU/EN | PASS |
| Images | PASS |
| PDF | PASS |

### Redirect Details
- `https://rakhimovr.uz/` -> `HTTP/1.1 308 Permanent Redirect` -> `https://www.rakhimovr.uz/` (PASS)
- `https://rakhimovr.uz/sushka` -> `HTTP/1.1 308 Permanent Redirect` -> `https://www.rakhimovr.uz/sushka` (PASS)

## SEO

- Canonical: https://www.rakhimovr.uz/
- Sitemap: https://www.rakhimovr.uz/sitemap.xml (все 15 URL переведены на www, валидный XML)
- Robots: https://www.rakhimovr.uz/robots.txt (Sitemap указывает на www.rakhimovr.uz/sitemap.xml)
- OG: og:url = https://www.rakhimovr.uz/, og:image = https://www.rakhimovr.uz/images/rrh-250x300.png, og:site_name = Портал профессора Рахимова Р.Х.
- Twitter: twitter:image = https://www.rakhimovr.uz/images/rrh-250x300.png, summary_large_image

## Scientific Content

- articles.json — unchanged
- books.json — unchanged
- patents.json — unchanged
- PAT-001 — unchanged
- Images — unchanged
- PDF — unchanged

## DNS

NOT CHANGED

## Vercel Domain Settings

NOT CHANGED

## Tilda

NOT CHANGED

## Final Verdict

PASS
