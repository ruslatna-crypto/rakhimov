const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');
const SEO_DATA_PATH = path.join(ROOT_DIR, 'src', 'data', 'seoData.json');
const BOOKS_JSON_PATH = path.join(ROOT_DIR, 'src', 'data', 'books.json');

console.log('====================================================');
console.log('         PRERENDERING SEO STATIC PAGES');
console.log('====================================================\n');

// 1. Verify dist/index.html exists
if (!fs.existsSync(TEMPLATE_PATH)) {
  console.error('[FAIL] dist/index.html not found! Run "vite build" first.');
  process.exit(1);
}

const templateHtml = fs.readFileSync(TEMPLATE_PATH, 'utf8');

// 2. Load seoData, BASE_URL, DEFAULT_IMAGE directly from single source of truth
if (!fs.existsSync(SEO_DATA_PATH)) {
  console.error('[FAIL] src/data/seoData.json not found!');
  process.exit(1);
}

const seoConfig = JSON.parse(fs.readFileSync(SEO_DATA_PATH, 'utf8'));
const { BASE_URL, DEFAULT_IMAGE, seoData } = seoConfig;

if (!BASE_URL || !seoData) {
  console.error('[FAIL] Invalid seoData.json: missing BASE_URL or seoData');
  process.exit(1);
}

console.log(`[PASS] Loaded ${Object.keys(seoData).length} route configurations from seoData.json`);
console.log(`[PASS] Using BASE_URL: ${BASE_URL}`);

// 3. 16 Public Routes to prerender
const publicRoutes = [
  '/',
  '/autor',
  '/sushka',
  '/lamp',
  '/kalci',
  '/pech',
  '/plenka',
  '/kraska',
  '/steril',
  '/cotton',
  '/bsp',
  '/stat',
  '/conference',
  '/book',
  '/patents',
  '/akt'
];

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function safeJsonLdStringify(obj) {
  return JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

function generateBookSchemaLd() {
  if (!fs.existsSync(BOOKS_JSON_PATH)) return '';
  const books = JSON.parse(fs.readFileSync(BOOKS_JSON_PATH, 'utf8'));
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${BASE_URL}/book#webpage`,
    'url': `${BASE_URL}/book`,
    'name': 'Монографии и книги — Научные труды профессора Рахимова Р.Х.',
    'description': 'Фундаментальные монографии по функциональной керамике, полупроводниковой гелиоэнергетике и импульсным технологиям. Скачивание в формате PDF.',
    'inLanguage': 'ru',
    'isPartOf': {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      'name': 'Портал профессора Рахимова Р.Х.',
      'url': `${BASE_URL}/`
    },
    'mainEntity': {
      '@type': 'ItemList',
      '@id': `${BASE_URL}/book#itemlist`,
      'numberOfItems': books.length,
      'itemListElement': books.map((book, index) => {
        const title = book.title;
        const description = book.description;
        const authorStr = book.author || 'Рахимов Р.Х.';
        const authors = authorStr.split(',').map((name) => ({
          '@type': 'Person',
          'name': name.trim()
        }));
        const coverUrl = book.cover
          ? (book.cover.startsWith('http') ? book.cover : `${BASE_URL}${book.cover.startsWith('/') ? '' : '/'}${book.cover}`)
          : `${BASE_URL}/images/rrh-250x300.png`;

        const bookAnchorUrl = `${BASE_URL}/book#${book.id.toLowerCase()}`;

        return {
          '@type': 'ListItem',
          'position': index + 1,
          'item': {
            '@type': 'Book',
            '@id': bookAnchorUrl,
            'url': bookAnchorUrl,
            'name': title,
            'author': authors.length === 1 ? authors[0] : authors,
            'description': description,
            'image': coverUrl,
            'inLanguage': 'ru'
          }
        };
      })
    }
  };
  return `<script id="schema-books-jsonld" type="application/ld+json">\n${safeJsonLdStringify(schema)}\n    </script>`;
}

function processHtml(html, route, is404 = false) {
  const config = is404 ? seoData['404'] : (seoData[route] || seoData['404']);
  const title = config.ru.title;
  const description = config.ru.description;
  const canonicalUrl = is404 ? null : (route === '/' ? `${BASE_URL}/` : `${BASE_URL}${route}`);
  const robots = is404 ? 'noindex, follow' : 'index, follow';

  let res = html;

  // 1. Replace <title>
  res = res.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);

  // 2. Replace <meta name="description">
  res = res.replace(/<meta\s+name=["']description["'][\s\S]*?>/i, `<meta name="description" content="${escapeHtml(description)}" />`);

  // 3. Remove existing og:*, twitter:*, canonical, robots to avoid any duplication
  res = res.replace(/<!--\s*OpenGraph & Twitter Base[\s\S]*?-->\n?/gi, '');
  res = res.replace(/<link\s+rel=["']canonical["'][\s\S]*?>\n?/gi, '');
  res = res.replace(/<meta\s+name=["']robots["'][\s\S]*?>\n?/gi, '');
  res = res.replace(/<meta\s+property=["']og:title["'][\s\S]*?>\n?/gi, '');
  res = res.replace(/<meta\s+property=["']og:description["'][\s\S]*?>\n?/gi, '');
  res = res.replace(/<meta\s+property=["']og:url["'][\s\S]*?>\n?/gi, '');
  res = res.replace(/<meta\s+property=["']og:image["'][\s\S]*?>\n?/gi, '');
  res = res.replace(/<meta\s+property=["']og:type["'][\s\S]*?>\n?/gi, '');
  res = res.replace(/<meta\s+property=["']og:site_name["'][\s\S]*?>\n?/gi, '');
  res = res.replace(/<meta\s+name=["']twitter:card["'][\s\S]*?>\n?/gi, '');
  res = res.replace(/<meta\s+name=["']twitter:title["'][\s\S]*?>\n?/gi, '');
  res = res.replace(/<meta\s+name=["']twitter:description["'][\s\S]*?>\n?/gi, '');
  res = res.replace(/<meta\s+name=["']twitter:image["'][\s\S]*?>\n?/gi, '');

  // 4. Construct clean injection block
  const lines = [];
  lines.push(`    <meta name="robots" content="${robots}" />`);
  if (canonicalUrl) {
    lines.push(`    <link rel="canonical" href="${canonicalUrl}" />`);
  }
  lines.push(`    <meta property="og:title" content="${escapeHtml(title)}" />`);
  lines.push(`    <meta property="og:description" content="${escapeHtml(description)}" />`);
  if (canonicalUrl) {
    lines.push(`    <meta property="og:url" content="${canonicalUrl}" />`);
  }
  lines.push(`    <meta property="og:image" content="${DEFAULT_IMAGE}" />`);
  lines.push(`    <meta property="og:type" content="website" />`);
  lines.push(`    <meta property="og:site_name" content="Портал профессора Рахимова Р.Х." />`);
  lines.push(`    <meta name="twitter:card" content="summary_large_image" />`);
  lines.push(`    <meta name="twitter:title" content="${escapeHtml(title)}" />`);
  lines.push(`    <meta name="twitter:description" content="${escapeHtml(description)}" />`);
  lines.push(`    <meta name="twitter:image" content="${DEFAULT_IMAGE}" />`);

  if (route === '/book') {
    lines.push(`    ${generateBookSchemaLd()}`);
  }

  const metaBlock = lines.join('\n');

  // Insert right after <meta name="description" ... />
  res = res.replace(/(<meta name="description"[^>]*\/>)/i, `$1\n${metaBlock}`);

  return res;
}

// 4. Generate all public routes
const generatedFiles = [];

publicRoutes.forEach(r => {
  const isRoot = r === '/';
  const outHtml = processHtml(templateHtml, r, false);

  if (isRoot) {
    fs.writeFileSync(TEMPLATE_PATH, outHtml, 'utf8');
    generatedFiles.push({ route: r, file: 'dist/index.html', canonical: `${BASE_URL}/` });
  } else {
    const slug = r.replace(/^\//, '');
    const dir = path.join(DIST_DIR, slug);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const dirFilePath = path.join(dir, 'index.html');
    const flatFilePath = path.join(DIST_DIR, `${slug}.html`);

    fs.writeFileSync(dirFilePath, outHtml, 'utf8');
    fs.writeFileSync(flatFilePath, outHtml, 'utf8');

    generatedFiles.push({ route: r, file: `dist/${slug}/index.html`, canonical: `${BASE_URL}${r}` });
    generatedFiles.push({ route: r, file: `dist/${slug}.html`, canonical: `${BASE_URL}${r}` });
  }
});

// Also generate 404.html
const out404 = processHtml(templateHtml, '/404', true);
fs.writeFileSync(path.join(DIST_DIR, '404.html'), out404, 'utf8');
console.log('[PASS] Generated dist/404.html with noindex');

console.log(`\n[PASS] Successfully prerendered ${generatedFiles.length} HTML files for 16 public routes:\n`);
generatedFiles.forEach((gf, idx) => {
  console.log(`  ${(idx + 1).toString().padStart(2)}. Route: ${gf.route.padEnd(12)} -> File: ${gf.file.padEnd(26)} -> Canonical: ${gf.canonical}`);
});

// 5. Automated Validation of all generated files
console.log('\n--- VERIFYING GENERATED HTML INTEGRITY ---');
let hasErrors = false;
const routeCanonicals = new Map();

generatedFiles.forEach(gf => {
  const diskPath = path.join(ROOT_DIR, gf.file);
  if (!fs.existsSync(diskPath)) {
    console.error(`[FAIL] File missing on disk: ${gf.file}`);
    hasErrors = true;
    return;
  }
  const content = fs.readFileSync(diskPath, 'utf8');

  // Exactly one canonical
  const canonicalMatches = content.match(/<link[^>]+rel=["']canonical["'][^>]*>/gi) || [];
  if (canonicalMatches.length !== 1) {
    console.error(`[FAIL] ${gf.file} expected 1 canonical tag, found ${canonicalMatches.length}`);
    hasErrors = true;
  } else {
    const hrefMatch = canonicalMatches[0].match(/href=["']([^"']+)["']/i);
    const href = hrefMatch ? hrefMatch[1] : '';
    if (href !== gf.canonical) {
      console.error(`[FAIL] ${gf.file} canonical mismatch: expected ${gf.canonical}, got ${href}`);
      hasErrors = true;
    }
    if (routeCanonicals.has(gf.route) && routeCanonicals.get(gf.route) !== href) {
      console.error(`[FAIL] Inconsistent canonical for route ${gf.route}`);
      hasErrors = true;
    }
    routeCanonicals.set(gf.route, href);
  }

  // Exactly one title
  const titleMatches = content.match(/<title>[\s\S]*?<\/title>/gi) || [];
  if (titleMatches.length !== 1) {
    console.error(`[FAIL] ${gf.file} expected 1 title tag, found ${titleMatches.length}`);
    hasErrors = true;
  }

  // Exactly one description
  const descMatches = content.match(/<meta[^>]+name=["']description["'][^>]*>/gi) || [];
  if (descMatches.length !== 1) {
    console.error(`[FAIL] ${gf.file} expected 1 description tag, found ${descMatches.length}`);
    hasErrors = true;
  }

  // Open Graph URL matches canonical
  const ogUrlMatch = content.match(/<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']+)["']/i);
  if (!ogUrlMatch || ogUrlMatch[1] !== gf.canonical) {
    console.error(`[FAIL] ${gf.file} og:url mismatch: expected ${gf.canonical}, got ${ogUrlMatch ? ogUrlMatch[1] : 'none'}`);
    hasErrors = true;
  }

  // If route is /book, check schema
  if (gf.route === '/book') {
    if (!content.includes('id="schema-books-jsonld"')) {
      console.error(`[FAIL] ${gf.file} is missing schema-books-jsonld script tag!`);
      hasErrors = true;
    } else {
      console.log(`[PASS] ${gf.file} contains valid static Schema.org JSON-LD`);
    }
  }
});

if (routeCanonicals.size !== 16) {
  console.error(`[FAIL] Expected 16 unique route canonicals, found ${routeCanonicals.size}`);
  hasErrors = true;
}

if (hasErrors) {
  console.error('\n>>> PRERENDER VERIFICATION FAILED! <<<');
  process.exit(1);
} else {
  console.log('\n>>> ALL 16 PRERENDERED HTML FILES ARE VALID AND VERIFIED! <<<');
}
