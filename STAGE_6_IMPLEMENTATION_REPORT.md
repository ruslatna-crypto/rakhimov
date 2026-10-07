# Stage 6 Implementation Report

## Status

PASS

## Objective

Перевод production canonical с:

https://rakhimovr.uz

на:

https://www.rakhimovr.uz

## Files Changed

1. `src/components/SEOHead.jsx` — перевод `BASE_URL` на canonical `https://www.rakhimovr.uz`.
2. `public/sitemap.xml` — замена базового домена для всех 15 производственных маршрутов на `https://www.rakhimovr.uz/`.
3. `public/robots.txt` — обновление директивы `Sitemap` на `https://www.rakhimovr.uz/sitemap.xml`.
4. `index.html` — обновление абсолютных production URL для `og:image` и `twitter:image` на `https://www.rakhimovr.uz/images/rrh-250x300.png`.

## SEOHead

BASE_URL old:
https://rakhimovr.uz

BASE_URL new:
https://www.rakhimovr.uz

Все динамические ссылки (`canonical`, `og:url`, `og:image`, `twitter:image`) теперь формируются с каноническим доменом `https://www.rakhimovr.uz`.

## Sitemap

Old:
https://rakhimovr.uz/sitemap.xml

New:
https://www.rakhimovr.uz/sitemap.xml

Все 15 страниц сохранены без добавления и удаления:
- `https://www.rakhimovr.uz/`
- `https://www.rakhimovr.uz/autor`
- `https://www.rakhimovr.uz/sushka`
- `https://www.rakhimovr.uz/lamp`
- `https://www.rakhimovr.uz/kalci`
- `https://www.rakhimovr.uz/pech`
- `https://www.rakhimovr.uz/plenka`
- `https://www.rakhimovr.uz/kraska`
- `https://www.rakhimovr.uz/steril`
- `https://www.rakhimovr.uz/cotton`
- `https://www.rakhimovr.uz/bsp`
- `https://www.rakhimovr.uz/stat`
- `https://www.rakhimovr.uz/book`
- `https://www.rakhimovr.uz/patents`
- `https://www.rakhimovr.uz/akt`

## Robots

Old sitemap URL:
Sitemap: https://rakhimovr.uz/sitemap.xml

New sitemap URL:
Sitemap: https://www.rakhimovr.uz/sitemap.xml

Правила `Allow: /`, `Disallow: /search`, `Disallow: /main`, `Disallow: /page*.html` сохранены без изменений.

## index.html

Файл обновлен:
- Абсолютные теги `og:image` и `twitter:image` переведены на канонический домен `https://www.rakhimovr.uz/images/rrh-250x300.png`.
- `og:site_name` проверен и сохранен без изменений:
  `og:site_name = Портал профессора Рахимова Р.Х.`
- Заголовок, описание и брендинг полностью сохранены.

## Scientific Content

articles.json — unchanged
books.json — unchanged
patents.json — unchanged
PAT-001 — unchanged
Images — unchanged
PDF — unchanged

## Build

npm run build:
PASS

Build time:
13.33s

Main JS:
dist/assets/index-CH62Vzmf.js (435.28 kB | gzip: 132.57 kB)

## Git Diff

Показать:

modified:
- `index.html`
- `public/robots.txt`
- `public/sitemap.xml`
- `src/components/SEOHead.jsx`

added:
- None

deleted:
- None

renamed:
- None

## Vercel Domain

rakhimovr.uz:
Redirect to www (HTTP 308 Permanent Redirect -> https://www.rakhimovr.uz/)

www.rakhimovr.uz:
Connected (HTTP 200 OK)

Настройки доменов на Vercel не изменялись.

## DNS

NOT CHANGED

## Tilda

NOT CHANGED

## Final Verdict

PASS
