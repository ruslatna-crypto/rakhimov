const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const SITEMAP_PATH = path.join(ROOT_DIR, 'public', 'sitemap.xml');
const ROBOTS_PATH = path.join(ROOT_DIR, 'public', 'robots.txt');
const SEO_PATH = path.join(ROOT_DIR, 'src', 'components', 'SEOHead.jsx');
const SEO_DATA_PATH = path.join(ROOT_DIR, 'src', 'data', 'seoData.json');

const EXPECTED_PROTOCOL = 'https:';
const EXPECTED_HOSTNAME = 'www.rakhimovr.uz';
const EXPECTED_ORIGIN = `${EXPECTED_PROTOCOL}//${EXPECTED_HOSTNAME}`;

const expectedPublicRoutes = [
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

const forbiddenRoutes = [
  '/search',
  '/author',
  '/conferences',
  '/main',
  '/page77759756.html',
  '/Contacts',
  '/test1',
  '/footer'
];

console.log('==================================================');
console.log('      COMPREHENSIVE SITEMAP & SEO AUDIT');
console.log('==================================================\n');

let hasErrors = false;

// 1. Check file existence
if (!fs.existsSync(SITEMAP_PATH)) {
  console.error('[FAIL] public/sitemap.xml does not exist!');
  process.exit(1);
}
console.log('[PASS] public/sitemap.xml exists');

const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf8');

// 2. XML Declaration & Namespace check
if (!/^<\?xml\s+version="1\.0"\s+encoding="UTF-8"\?>/.test(sitemapContent.trim())) {
  console.error('[FAIL] Invalid XML declaration at start of sitemap.xml');
  hasErrors = true;
} else {
  console.log('[PASS] XML declaration is valid');
}

if (!sitemapContent.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) {
  console.error('[FAIL] Missing or invalid sitemap 0.9 namespace');
  hasErrors = true;
} else {
  console.log('[PASS] Sitemap namespace xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" is valid');
}

if (!sitemapContent.trim().endsWith('</urlset>')) {
  console.error('[FAIL] Sitemap does not properly close with </urlset>');
  hasErrors = true;
} else {
  console.log('[PASS] Sitemap root element closed properly');
}

// 3. Extract all <url> entries and validate each using strict new URL() parsing
const urlBlockRegex = /<url>([\s\S]*?)<\/url>/g;
const urlMatches = [...sitemapContent.matchAll(urlBlockRegex)];
console.log(`[PASS] Found ${urlMatches.length} <url> entries in sitemap`);

const validChangefreqs = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
const parsedEntries = [];
const seenLocs = new Set();

urlMatches.forEach((match, index) => {
  const block = match[1];

  const locMatch = block.match(/<loc>([^<]+)<\/loc>/);
  const changefreqMatch = block.match(/<changefreq>([^<]+)<\/changefreq>/);
  const priorityMatch = block.match(/<priority>([^<]+)<\/priority>/);

  if (!locMatch) {
    console.error(`[FAIL] Entry #${index + 1} has no <loc> tag!`);
    hasErrors = true;
    return;
  }

  const rawLoc = locMatch[1].trim();

  // Strict URL parsing with standard new URL()
  let parsedUrl;
  try {
    parsedUrl = new URL(rawLoc);
  } catch (err) {
    console.error(`[FAIL] Entry #${index + 1} contains an unparseable URL "${rawLoc}": ${err.message}`);
    hasErrors = true;
    return;
  }

  // Verify protocol strictly
  if (parsedUrl.protocol !== EXPECTED_PROTOCOL) {
    console.error(`[FAIL] URL "${rawLoc}" uses protocol "${parsedUrl.protocol}", expected "${EXPECTED_PROTOCOL}"`);
    hasErrors = true;
  }

  // Verify hostname strictly
  if (parsedUrl.hostname !== EXPECTED_HOSTNAME) {
    console.error(`[FAIL] URL "${rawLoc}" uses hostname "${parsedUrl.hostname}", expected "${EXPECTED_HOSTNAME}"`);
    hasErrors = true;
  }

  // Verify port (must be default/empty)
  if (parsedUrl.port) {
    console.error(`[FAIL] URL "${rawLoc}" specifies custom port "${parsedUrl.port}"`);
    hasErrors = true;
  }

  // Verify credentials (no username or password)
  if (parsedUrl.username || parsedUrl.password) {
    console.error(`[FAIL] URL "${rawLoc}" contains credentials (username/password)`);
    hasErrors = true;
  }

  // Verify query parameters and hash fragments (forbidden in sitemap)
  if (parsedUrl.search) {
    console.error(`[FAIL] URL "${rawLoc}" contains query string "${parsedUrl.search}"`);
    hasErrors = true;
  }
  if (parsedUrl.hash) {
    console.error(`[FAIL] URL "${rawLoc}" contains hash fragment "${parsedUrl.hash}"`);
    hasErrors = true;
  }

  // Verify path trailing slash policy: root '/' has slash, other pages must not have trailing slash
  if (parsedUrl.pathname !== '/' && parsedUrl.pathname.endsWith('/')) {
    console.error(`[FAIL] URL "${rawLoc}" contains an unexpected trailing slash in pathname "${parsedUrl.pathname}"`);
    hasErrors = true;
  }

  // Verify path is an allowed public route
  if (!expectedPublicRoutes.includes(parsedUrl.pathname)) {
    console.error(`[FAIL] URL "${rawLoc}" path "${parsedUrl.pathname}" is not an allowed public route`);
    hasErrors = true;
  }

  // Verify path is not a forbidden/internal/redirect route
  if (forbiddenRoutes.includes(parsedUrl.pathname)) {
    console.error(`[FAIL] URL "${rawLoc}" path "${parsedUrl.pathname}" is a forbidden/non-indexable route`);
    hasErrors = true;
  }

  // Verify canonical serialization (no extra characters, encoding discrepancies, etc.)
  if (rawLoc !== parsedUrl.href) {
    console.error(`[FAIL] URL "${rawLoc}" does not match canonical href "${parsedUrl.href}"`);
    hasErrors = true;
  }

  // Verify no duplicate URLs
  if (seenLocs.has(parsedUrl.href)) {
    console.error(`[FAIL] Duplicate URL in sitemap: "${parsedUrl.href}"`);
    hasErrors = true;
  }
  seenLocs.add(parsedUrl.href);

  // Validate changefreq
  if (changefreqMatch) {
    const cf = changefreqMatch[1].trim();
    if (!validChangefreqs.includes(cf)) {
      console.error(`[FAIL] URL "${rawLoc}" has invalid changefreq: "${cf}"`);
      hasErrors = true;
    }
  }

  // Validate priority
  if (priorityMatch) {
    const prio = parseFloat(priorityMatch[1].trim());
    if (isNaN(prio) || prio < 0.0 || prio > 1.0) {
      console.error(`[FAIL] URL "${rawLoc}" has invalid priority: "${priorityMatch[1]}"`);
      hasErrors = true;
    }
  }

  parsedEntries.push({ rawLoc, parsedUrl, pathname: parsedUrl.pathname });
});

// 4. Duplicate summary check
if (seenLocs.size === parsedEntries.length && parsedEntries.length > 0) {
  console.log('[PASS] All URLs in sitemap are unique (no duplicates)');
} else {
  console.error(`[FAIL] Duplicate check failed: ${seenLocs.size} unique vs ${parsedEntries.length} total`);
  hasErrors = true;
}

// 5. Compare with expected public routes
console.log('\n--- VERIFYING COVERAGE OF ALL 16 PUBLIC ROUTES ---');
const foundPaths = new Set(parsedEntries.map(e => e.pathname));

expectedPublicRoutes.forEach(r => {
  const fullExpectedUrl = `${EXPECTED_ORIGIN}${r === '/' ? '/' : r}`;
  if (!foundPaths.has(r)) {
    console.error(`[FAIL] Missing required public route in sitemap: ${fullExpectedUrl}`);
    hasErrors = true;
  } else {
    console.log(`[PASS] Covered: ${fullExpectedUrl}`);
  }
});

// Check if any unexpected route in sitemap
foundPaths.forEach(p => {
  if (!expectedPublicRoutes.includes(p)) {
    console.error(`[FAIL] Unexpected route found in sitemap: ${p}`);
    hasErrors = true;
  }
});

// 6. Verify non-indexable routes are EXCLUDED
forbiddenRoutes.forEach(fr => {
  if (foundPaths.has(fr)) {
    console.error(`[FAIL] Non-indexable/redirect route included in sitemap: ${fr}`);
    hasErrors = true;
  }
});
console.log('[PASS] All non-indexable, internal search and redirect routes are excluded from sitemap');

// 7. Verify robots.txt
if (!fs.existsSync(ROBOTS_PATH)) {
  console.error('[FAIL] public/robots.txt does not exist!');
  hasErrors = true;
} else {
  const robotsContent = fs.readFileSync(ROBOTS_PATH, 'utf8');
  const sitemapDirectiveMatch = robotsContent.match(/Sitemap:\s*(\S+)/i);
  if (!sitemapDirectiveMatch) {
    console.error('[FAIL] robots.txt is missing Sitemap directive');
    hasErrors = true;
  } else {
    const robotsSitemapUrl = sitemapDirectiveMatch[1].trim();
    try {
      const parsedRobotsSitemap = new URL(robotsSitemapUrl);
      if (
        parsedRobotsSitemap.protocol === EXPECTED_PROTOCOL &&
        parsedRobotsSitemap.hostname === EXPECTED_HOSTNAME &&
        parsedRobotsSitemap.pathname === '/sitemap.xml' &&
        !parsedRobotsSitemap.port &&
        !parsedRobotsSitemap.username &&
        !parsedRobotsSitemap.password &&
        !parsedRobotsSitemap.search &&
        !parsedRobotsSitemap.hash
      ) {
        console.log('[PASS] robots.txt contains valid canonical Sitemap directive:', robotsSitemapUrl);
      } else {
        console.error(`[FAIL] robots.txt Sitemap directive "${robotsSitemapUrl}" does not match canonical sitemap URL`);
        hasErrors = true;
      }
    } catch (err) {
      console.error(`[FAIL] robots.txt Sitemap URL "${robotsSitemapUrl}" is malformed: ${err.message}`);
      hasErrors = true;
    }
  }

  if (!robotsContent.includes('Allow: /')) {
    console.error('[FAIL] robots.txt missing Allow: / directive');
    hasErrors = true;
  } else {
    console.log('[PASS] robots.txt allows crawling public pages (Allow: /)');
  }
}

// 8. Verify canonical BASE_URL from single source of truth (seoData.json)
if (!fs.existsSync(SEO_DATA_PATH)) {
  console.error('[FAIL] src/data/seoData.json does not exist!');
  hasErrors = true;
} else {
  const seoConfig = JSON.parse(fs.readFileSync(SEO_DATA_PATH, 'utf8'));
  const seoBaseUrl = seoConfig.BASE_URL ? seoConfig.BASE_URL.trim() : '';
  if (!seoBaseUrl) {
    console.error('[FAIL] seoData.json does not define BASE_URL');
    hasErrors = true;
  } else {
    try {
      const parsedBaseUrl = new URL(seoBaseUrl);
      if (
        parsedBaseUrl.protocol === EXPECTED_PROTOCOL &&
        parsedBaseUrl.hostname === EXPECTED_HOSTNAME &&
        !parsedBaseUrl.port &&
        !parsedBaseUrl.username &&
        !parsedBaseUrl.password &&
        (parsedBaseUrl.pathname === '' || parsedBaseUrl.pathname === '/')
      ) {
        console.log('[PASS] seoData.json uses valid canonical BASE_URL:', seoBaseUrl);
      } else {
        console.error(`[FAIL] seoData.json BASE_URL "${seoBaseUrl}" does not match canonical origin`);
        hasErrors = true;
      }
    } catch (err) {
      console.error(`[FAIL] seoData.json BASE_URL "${seoBaseUrl}" is malformed: ${err.message}`);
      hasErrors = true;
    }
  }
}

// Also verify SEOHead imports seoData.json
const seoContent = fs.readFileSync(SEO_PATH, 'utf8');
if (!seoContent.includes('seoData.json')) {
  console.error('[FAIL] SEOHead.jsx does not import seoData.json');
  hasErrors = true;
} else {
  console.log('[PASS] SEOHead.jsx correctly imports seoData.json');
}

console.log('\n==================================================');
if (hasErrors) {
  console.error('>>> AUDIT FAILED WITH ERRORS <<<');
  process.exit(1);
} else {
  console.log('>>> ALL SITEMAP & SEO CHECKS PASSED SUCCESSFULLY! <<<');
}
console.log('==================================================\n');
