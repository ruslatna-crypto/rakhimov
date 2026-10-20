const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const SITEMAP_PATH = path.join(ROOT_DIR, 'public', 'sitemap.xml');
const ROBOTS_PATH = path.join(ROOT_DIR, 'public', 'robots.txt');
const APP_PATH = path.join(ROOT_DIR, 'src', 'App.jsx');
const SEO_PATH = path.join(ROOT_DIR, 'src', 'components', 'SEOHead.jsx');

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
if (!sitemapContent.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
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

// 3. Extract all <url> entries
const urlBlockRegex = /<url>([\s\S]*?)<\/url>/g;
const urlMatches = [...sitemapContent.matchAll(urlBlockRegex)];
console.log(`[PASS] Found ${urlMatches.length} <url> entries in sitemap`);

const urls = [];
const validChangefreqs = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];

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

  const loc = locMatch[1].trim();
  urls.push(loc);

  // Check domain
  if (!loc.startsWith('https://www.rakhimovr.uz')) {
    console.error(`[FAIL] URL #${index + 1} (${loc}) does not use canonical domain https://www.rakhimovr.uz!`);
    hasErrors = true;
  }

  // Check no trailing slash except root
  if (loc !== 'https://www.rakhimovr.uz/' && loc.endsWith('/')) {
    console.error(`[FAIL] URL #${index + 1} (${loc}) should not have trailing slash!`);
    hasErrors = true;
  }

  // Check changefreq
  if (changefreqMatch) {
    const cf = changefreqMatch[1].trim();
    if (!validChangefreqs.includes(cf)) {
      console.error(`[FAIL] URL ${loc} has invalid changefreq: ${cf}`);
      hasErrors = true;
    }
  }

  // Check priority
  if (priorityMatch) {
    const prio = parseFloat(priorityMatch[1].trim());
    if (isNaN(prio) || prio < 0.0 || prio > 1.0) {
      console.error(`[FAIL] URL ${loc} has invalid priority: ${priorityMatch[1]}`);
      hasErrors = true;
    }
  }
});

// 4. Check for duplicates
const uniqueUrls = new Set(urls);
if (uniqueUrls.size !== urls.length) {
  console.error(`[FAIL] Found duplicate URLs in sitemap (${urls.length} total, ${uniqueUrls.size} unique)`);
  hasErrors = true;
} else {
  console.log('[PASS] All URLs in sitemap are unique (no duplicates)');
}

// 5. Compare with expected public routes
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

console.log('\n--- VERIFYING COVERAGE OF ALL 16 PUBLIC ROUTES ---');
expectedPublicRoutes.forEach(r => {
  const fullUrl = r === '/' ? 'https://www.rakhimovr.uz/' : `https://www.rakhimovr.uz${r}`;
  if (!urls.includes(fullUrl)) {
    console.error(`[FAIL] Missing required public route in sitemap: ${fullUrl}`);
    hasErrors = true;
  } else {
    console.log(`[PASS] Covered: ${fullUrl}`);
  }
});

// Check for unexpected extra URLs
urls.forEach(u => {
  const path = u.replace('https://www.rakhimovr.uz', '') || '/';
  if (!expectedPublicRoutes.includes(path)) {
    console.error(`[FAIL] Unexpected URL found in sitemap: ${u}`);
    hasErrors = true;
  }
});

// 6. Verify non-indexable routes are EXCLUDED
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

forbiddenRoutes.forEach(fr => {
  const fullUrl = `https://www.rakhimovr.uz${fr}`;
  if (urls.includes(fullUrl)) {
    console.error(`[FAIL] Non-indexable/redirect route included in sitemap: ${fullUrl}`);
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
  if (!robotsContent.includes('Sitemap: https://www.rakhimovr.uz/sitemap.xml')) {
    console.error('[FAIL] robots.txt is missing Sitemap: https://www.rakhimovr.uz/sitemap.xml directive');
    hasErrors = true;
  } else {
    console.log('[PASS] robots.txt contains correct Sitemap directive');
  }

  if (!robotsContent.includes('Allow: /')) {
    console.error('[FAIL] robots.txt missing Allow: / directive');
    hasErrors = true;
  } else {
    console.log('[PASS] robots.txt allows crawling public pages (Allow: /)');
  }
}

// 8. Verify SEOHead.jsx canonical BASE_URL
const seoContent = fs.readFileSync(SEO_PATH, 'utf8');
if (!seoContent.includes("const BASE_URL = 'https://www.rakhimovr.uz';")) {
  console.error('[FAIL] SEOHead.jsx does not use canonical BASE_URL https://www.rakhimovr.uz');
  hasErrors = true;
} else {
  console.log('[PASS] SEOHead.jsx uses canonical BASE_URL https://www.rakhimovr.uz');
}

console.log('\n==================================================');
if (hasErrors) {
  console.error('>>> AUDIT FAILED WITH ERRORS <<<');
  process.exit(1);
} else {
  console.log('>>> ALL SITEMAP & SEO CHECKS PASSED SUCCESSFULLY! <<<');
}
console.log('==================================================\n');
