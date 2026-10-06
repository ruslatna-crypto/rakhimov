const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

// 1. Verify SEO data
const seoHeadPath = path.join(ROOT_DIR, 'src', 'components', 'SEOHead.jsx');
const seoHeadCode = fs.readFileSync(seoHeadPath, 'utf8');

const routes = [
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
  '/book',
  '/patents',
  '/akt',
  '/search',
  '404'
];

console.log('--- VERIFYING ROUTE SEO DEFINITIONS ---');
const missingSeo = [];
for (const r of routes) {
  if (!seoHeadCode.includes(`'${r}':`) && !seoHeadCode.includes(`"${r}":`)) {
    missingSeo.push(r);
  }
}
console.log('Missing SEO routes:', missingSeo.length === 0 ? 'NONE (All 17 present)' : missingSeo);

// 2. Verify all images in JSON data files physically exist
console.log('\n--- VERIFYING PHYSICAL EXISTENCE OF ALL REFERENCED ASSETS ---');
const jsonFiles = [
  'developments.json',
  'lampCertificates.json',
  'sterilCertificates.json',
  'kalciCertificates.json',
  'sushkaCertificates.json',
  'patents.json',
  'books.json',
  'akts.json'
];

let totalAssetsChecked = 0;
let missingAssets = [];

for (const jf of jsonFiles) {
  const p = path.join(ROOT_DIR, 'src', 'data', jf);
  if (!fs.existsSync(p)) continue;
  const content = fs.readFileSync(p, 'utf8');
  const matches = content.match(/\/images\/[a-zA-Z0-9_\-\.\/]+?\.(jpg|jpeg|png|webp|svg)/g) || [];

  for (const m of matches) {
    totalAssetsChecked++;
    const diskPath = path.join(PUBLIC_DIR, m.replace(/^\//, ''));
    if (!fs.existsSync(diskPath)) {
      missingAssets.push({ file: jf, asset: m });
    }
  }
}

console.log(`Total data asset references checked: ${totalAssetsChecked}`);
console.log(`Missing assets: ${missingAssets.length}`);
if (missingAssets.length > 0) {
  console.log('Missing asset list:', missingAssets);
}

// 3. Verify App.jsx routes and code splitting
console.log('\n--- VERIFYING APP.JSX CODE SPLITTING ---');
const appCode = fs.readFileSync(path.join(ROOT_DIR, 'src', 'App.jsx'), 'utf8');
const lazyPages = [
  'Home',
  'Author',
  'DevelopmentPage',
  'ArticlesPage',
  'BooksPage',
  'PatentsPage',
  'AktsPage',
  'SearchPage',
  'NotFound'
];

const missingLazy = lazyPages.filter(p => !appCode.includes(`lazy(() => import('./pages/${p}'))`));
console.log('Missing lazy-loaded pages in App.jsx:', missingLazy.length === 0 ? 'NONE (All 9 pages lazy-loaded)' : missingLazy);
console.log('Suspense with PageLoader present:', appCode.includes('<Suspense fallback={<PageLoader />}>'));
console.log('Author redirect present:', appCode.includes('<Route path="/author" element={<Navigate to="/autor" replace />} />'));
