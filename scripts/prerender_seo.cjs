const fs = require('fs');
const path = require('path');
const http = require('http');
const puppeteer = require('puppeteer');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');
const SEO_DATA_PATH = path.join(ROOT_DIR, 'src', 'data', 'seoData.json');
const BOOKS_JSON_PATH = path.join(ROOT_DIR, 'src', 'data', 'books.json');

console.log('====================================================');
console.log('    HEADLESS CHROMIUM SNAPSHOT PRERENDERING (SEO)');
console.log('====================================================\n');

// 1. Verify dist/index.html exists
if (!fs.existsSync(TEMPLATE_PATH)) {
  console.error('[FAIL] dist/index.html not found! Run "vite build" first.');
  process.exit(1);
}

const templateHtml = fs.readFileSync(TEMPLATE_PATH, 'utf8');

// 2. Load seoData, BASE_URL, DEFAULT_IMAGE from single source of truth
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

// Internal static server serving dist/ for Puppeteer prerender
function startStaticServer(distDir) {
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.json': 'application/json; charset=utf-8',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf'
  };

  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const cleanUrl = req.url.split('?')[0].split('#')[0];
      let filePath = path.join(distDir, cleanUrl === '/' ? 'index.html' : cleanUrl);

      // Directory or SPA fallback
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        const indexInDir = path.join(filePath, 'index.html');
        if (fs.existsSync(indexInDir) && fs.statSync(indexInDir).isFile()) {
          filePath = indexInDir;
        } else {
          filePath = path.join(distDir, 'index.html');
        }
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || 'application/octet-stream';

      fs.readFile(filePath, (err, content) => {
        if (err) {
          res.writeHead(500);
          res.end('Server error');
        } else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content);
        }
      });
    });

    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      resolve({ server, port });
    });
    server.on('error', reject);
  });
}

// Browser launcher with automatic executable fallbacks
async function launchBrowser() {
  const launchArgs = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check'
  ];

  // 1. If on Linux or in Vercel environment, try @sparticuz/chromium if available
  if (process.platform === 'linux' || process.env.VERCEL) {
    try {
      const chromium = require('@sparticuz/chromium');
      const execPath = await chromium.executablePath();
      if (execPath) {
        console.log(`[INFO] Launching @sparticuz/chromium on Linux/Vercel: ${execPath}`);
        return await puppeteer.launch({
          args: [...(chromium.args || []), ...launchArgs],
          defaultViewport: chromium.defaultViewport || { width: 1280, height: 800 },
          executablePath: execPath,
          headless: chromium.headless ?? true
        });
      }
    } catch (err) {
      console.warn(`[WARN] @sparticuz/chromium launch attempt failed: ${err.message}. Proceeding to standard launch...`);
    }
  }

  // 2. Try explicit environment variable paths (e.g. PUPPETEER_EXECUTABLE_PATH, CHROME_BIN)
  const envPath = process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_BIN || process.env.CHROMIUM_PATH;
  if (envPath && fs.existsSync(envPath)) {
    try {
      console.log(`[INFO] Launching Chromium from env path: ${envPath}`);
      return await puppeteer.launch({
        headless: true,
        executablePath: envPath,
        args: launchArgs
      });
    } catch (err) {
      console.warn(`[WARN] Launch with env path failed: ${err.message}`);
    }
  }

  // 3. Try standard puppeteer launch (Bundled Chrome for Testing on Windows/macOS/Linux)
  try {
    return await puppeteer.launch({
      headless: true,
      args: launchArgs
    });
  } catch (err) {
    console.warn(`[WARN] Puppeteer default launch failed: ${err.message}. Trying common system executable paths...`);
  }

  // 4. Try common system executable candidate paths
  const candidatePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  ];

  for (const execPath of candidatePaths) {
    if (fs.existsSync(execPath)) {
      try {
        console.log(`[INFO] Attempting launch with executable: ${execPath}`);
        return await puppeteer.launch({
          headless: true,
          executablePath: execPath,
          args: launchArgs
        });
      } catch (e) {
        console.warn(`[WARN] Failed to launch with ${execPath}: ${e.message}`);
      }
    }
  }

  throw new Error('Unable to launch Chromium. Please ensure Chrome, Puppeteer, or @sparticuz/chromium is available.');
}

function processHtml(html, route, is404 = false, rootHtml = '') {
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

  // 5. Inject prerendered root HTML into <div id="root">
  if (rootHtml) {
    res = res.replace(/<div\s+id=["']root["']>\s*<\/div>/i, `<div id="root">${rootHtml}</div>`);
  }

  return res;
}

async function main() {
  const startTime = Date.now();

  // Step A: Start preview server
  console.log('Starting internal static preview server...');
  const { server, port } = await startStaticServer(DIST_DIR);
  console.log(`[PASS] Internal server listening on http://127.0.0.1:${port}`);

  // Step B: Launch Headless Chromium
  console.log('Launching Headless Chromium for full DOM snapshot prerendering...');
  const browser = await launchBrowser();
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Filter external tracking scripts (GA / YM) to keep build fast and avoid corrupting production stats
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const url = req.url();
    if (
      url.includes('google-analytics.com') ||
      url.includes('googletagmanager.com') ||
      url.includes('mc.yandex.ru')
    ) {
      req.abort();
    } else {
      req.continue();
    }
  });

  const snapshots = {};

  // Step C: Snapshot 16 Public Routes
  console.log('\n--- CAPTURING FULL DOM SNAPSHOTS FOR 16 PUBLIC ROUTES ---');
  for (const route of publicRoutes) {
    const routeStart = Date.now();
    const url = `http://127.0.0.1:${port}${route}`;

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Wait for React app container
    await page.waitForSelector('#root > *', { timeout: 15000 });

    // Wait for PageLoader / spinner removal
    await page.waitForFunction(
      () => !document.querySelector('.page-loader') && !document.querySelector('.spinner'),
      { timeout: 10000 }
    ).catch(() => {});

    // Route-specific element readiness assertions
    if (route === '/book') {
      await page.waitForSelector('.book-card', { timeout: 10000 });
    } else if (route === '/stat') {
      await page.waitForSelector('.data-card', { timeout: 10000 });
    } else if (route === '/conference' || route === '/patents' || route === '/akt') {
      await page.waitForSelector('.data-card, table, .conference-item', { timeout: 10000 }).catch(() => {});
    }

    const h1 = await page.$eval('h1', el => el.innerText.trim()).catch(() => 'NO H1');
    const rootHtml = await page.$eval('#root', el => el.innerHTML);

    if (!rootHtml || rootHtml.length < 500) {
      throw new Error(`[FAIL] Snapshot for route "${route}" is empty or too short (${rootHtml ? rootHtml.length : 0} bytes)!`);
    }

    snapshots[route] = { h1, rootHtml, size: rootHtml.length };
    const dur = ((Date.now() - routeStart) / 1000).toFixed(2);
    console.log(`[PASS] ${route.padEnd(14)} (${dur}s) -> H1: "${h1.slice(0, 38)}..." -> Size: ${rootHtml.length} bytes`);
  }

  // Snapshot 404
  await page.goto(`http://127.0.0.1:${port}/404`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForSelector('#root > *', { timeout: 10000 });
  const h1_404 = await page.$eval('h1', el => el.innerText.trim()).catch(() => '404');
  const rootHtml_404 = await page.$eval('#root', el => el.innerHTML);
  snapshots['/404'] = { h1: h1_404, rootHtml: rootHtml_404, size: rootHtml_404.length };
  console.log(`[PASS] 404.html       -> H1: "${h1_404}" -> Size: ${rootHtml_404.length} bytes`);

  // Close browser & server
  await browser.close();
  server.close();

  // Step D: Write Prerendered HTML Files
  console.log('\n--- WRITING COMPLETE PRERENDERED HTML FILES ---');
  const generatedFiles = [];

  publicRoutes.forEach(r => {
    const isRoot = r === '/';
    const snapshot = snapshots[r];
    const outHtml = processHtml(templateHtml, r, false, snapshot.rootHtml);

    if (isRoot) {
      fs.writeFileSync(TEMPLATE_PATH, outHtml, 'utf8');
      generatedFiles.push({ route: r, file: 'dist/index.html', canonical: `${BASE_URL}/`, h1: snapshot.h1, size: snapshot.size });
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

      generatedFiles.push({ route: r, file: `dist/${slug}/index.html`, canonical: `${BASE_URL}${r}`, h1: snapshot.h1, size: snapshot.size });
      generatedFiles.push({ route: r, file: `dist/${slug}.html`, canonical: `${BASE_URL}${r}`, h1: snapshot.h1, size: snapshot.size });
    }
  });

  // Write 404.html
  const out404 = processHtml(templateHtml, '/404', true, snapshots['/404'].rootHtml);
  fs.writeFileSync(path.join(DIST_DIR, '404.html'), out404, 'utf8');
  console.log('[PASS] Generated dist/404.html with noindex and full 404 page content');

  console.log(`\n[PASS] Successfully generated ${generatedFiles.length} HTML files for 16 public routes:\n`);
  generatedFiles.forEach((gf, idx) => {
    console.log(`  ${(idx + 1).toString().padStart(2)}. Route: ${gf.route.padEnd(12)} -> File: ${gf.file.padEnd(26)} -> Size: ${gf.size.toString().padStart(6)} bytes -> H1: "${gf.h1.slice(0, 30)}..."`);
  });

  // Step E: Automated Validation of All Generated Files
  console.log('\n--- VERIFYING GENERATED HTML INTEGRITY & DOM CONTENT ---');
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

    // Root container must NOT be empty!
    const rootStart = content.indexOf('<div id="root">');
    const bodyEnd = content.indexOf('</body>');
    const rootBlock = rootStart !== -1 && bodyEnd !== -1 ? content.slice(rootStart, bodyEnd) : '';
    if (!rootBlock || rootBlock.trim().length < 1000) {
      console.error(`[FAIL] ${gf.file} #root is EMPTY or too small! Length: ${rootBlock.length}`);
      hasErrors = true;
    }

    // If route is /book, check schema & book cards
    if (gf.route === '/book') {
      if (!content.includes('id="schema-books-jsonld"')) {
        console.error(`[FAIL] ${gf.file} is missing schema-books-jsonld script tag!`);
        hasErrors = true;
      }
      if (!content.includes('book-card')) {
        console.error(`[FAIL] ${gf.file} does not contain .book-card elements!`);
        hasErrors = true;
      }
    }
  });

  if (routeCanonicals.size !== 16) {
    console.error(`[FAIL] Expected 16 unique route canonicals, found ${routeCanonicals.size}`);
    hasErrors = true;
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);

  if (hasErrors) {
    console.error(`\n>>> PRERENDER VERIFICATION FAILED after ${totalTime}s! <<<`);
    process.exit(1);
  } else {
    console.log(`\n====================================================`);
    console.log(`>>> ALL 16 ROUTES FULLY PRERENDERED & VERIFIED IN ${totalTime}s! <<<`);
    console.log(`====================================================\n`);
  }
}

main().catch(err => {
  console.error('[FATAL ERROR in prerender_seo.cjs]:', err);
  process.exit(1);
});
