const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

console.log('==================================================');
console.log('   FULL VERIFICATION: CONFERENCES IMPLEMENTATION');
console.log('==================================================\n');

let allPassed = true;

function check(label, condition, detail = '') {
  if (condition) {
    console.log(`[PASS] ${label} ${detail}`);
  } else {
    console.error(`[FAIL] ${label} ${detail}`);
    allPassed = false;
  }
}

// 1. Data counts
const intConfs = require('../src/data/conferences/internationalConferences.json');
const infraConfs = require('../src/data/conferences/infraR2000.json');
const repConfs = require('../src/data/conferences/republicanConferences.json');

check('International Conferences JSON count', intConfs.length === 105, `(${intConfs.length}/105)`);
check('Infra R Conferences JSON count', infraConfs.length === 42, `(${infraConfs.length}/42)`);
check('Republican Conferences JSON count', repConfs.length === 60, `(${repConfs.length}/60)`);
const totalConfs = intConfs.length + infraConfs.length + repConfs.length;
check('Grand Total Conferences count', totalConfs === 207, `(${totalConfs}/207)`);

// Check data integrity
let hasEmptyRequired = false;
let hasMissingEnglish = false;
[...intConfs, ...infraConfs, ...repConfs].forEach(c => {
  if (!c.authors || !c.title || !c.source) {
    hasEmptyRequired = true;
    console.error('Empty fields found in:', c);
  }
  if (!c.source_en || !c.title_en || !c.authors_en) {
    hasMissingEnglish = true;
    console.error('Missing English field in:', c.id);
  }
});
check('Data integrity: all 207 records have authors, title, source', !hasEmptyRequired);
check('Bilingual completeness: all 207 records have source_en, title_en, authors_en', !hasMissingEnglish);

// 2. Header.jsx check
const headerPath = path.join(ROOT_DIR, 'src', 'components', 'Header.jsx');
const headerCode = fs.readFileSync(headerPath, 'utf8');
const statIdx = headerCode.indexOf("path: '/stat'");
const confIdx = headerCode.indexOf("path: '/conference'");
check('Header.jsx contains /conference path', confIdx !== -1);
check('Header.jsx has Conferences immediately after Scientific Articles', confIdx > statIdx && confIdx - statIdx < 120);

// 3. App.jsx check
const appPath = path.join(ROOT_DIR, 'src', 'App.jsx');
const appCode = fs.readFileSync(appPath, 'utf8');
check('App.jsx lazy imports Conference', appCode.includes("lazy(() => import('./pages/Conference'))"));
check('App.jsx has /conference route', appCode.includes('path="/conference"'));
check('App.jsx has /conferences redirect', appCode.includes('path="/conferences"'));

// 4. SEOHead.jsx check
const seoPath = path.join(ROOT_DIR, 'src', 'components', 'SEOHead.jsx');
const seoCode = fs.readFileSync(seoPath, 'utf8');
check('SEOHead.jsx has /conference route', seoCode.includes("'/conference':"));
check('SEOHead.jsx has Russian title', seoCode.includes('Конференции'));
check('SEOHead.jsx has English title', seoCode.includes('Conferences'));

// 5. LanguageContext.jsx check
const langPath = path.join(ROOT_DIR, 'src', 'context', 'LanguageContext.jsx');
const langCode = fs.readFileSync(langPath, 'utf8');
check('LanguageContext.jsx has pub_conferences (RU)', langCode.includes("pub_conferences: 'Конференции'"));
check('LanguageContext.jsx has pub_conferences (EN)', langCode.includes("pub_conferences: 'Conferences'"));
check('LanguageContext.jsx has conf_sec_international (RU)', langCode.includes("conf_sec_international: 'Международные конференции'"));
check('LanguageContext.jsx has conf_sec_international (EN)', langCode.includes("conf_sec_international: 'International Conferences'"));
check('LanguageContext.jsx has conf_sec_infra (RU)', langCode.includes('conf_sec_infra: \'Международная конференция "Infra R"\''));
check('LanguageContext.jsx has conf_sec_infra (EN)', langCode.includes('conf_sec_infra: \'International Conference "Infra R"\''));
check('LanguageContext.jsx has conf_sec_republican (RU)', langCode.includes("conf_sec_republican: 'Республиканские конференции'"));
check('LanguageContext.jsx has conf_sec_republican (EN)', langCode.includes("conf_sec_republican: 'Republican Conferences'"));

// 6. searchIndex.js check
const searchIndexPath = path.join(ROOT_DIR, 'src', 'utils', 'searchIndex.js');
const searchIndexCode = fs.readFileSync(searchIndexPath, 'utf8');
check('searchIndex.js imports conference data', searchIndexCode.includes('internationalConferences'));
check('searchIndex.js has PAGE-CONFERENCES page', searchIndexCode.includes('PAGE-CONFERENCES'));
check('searchIndex.js has formattedConferences in allSearchableItems', searchIndexCode.includes('...formattedConferences'));

// 7. Conference.jsx check
const confPath = path.join(ROOT_DIR, 'src', 'pages', 'Conference.jsx');
check('src/pages/Conference.jsx exists', fs.existsSync(confPath));
const confCode = fs.readFileSync(confPath, 'utf8');
check('Conference.jsx imports all 3 conference datasets', 
  confCode.includes('internationalConferences') &&
  confCode.includes('infraR2000Conferences') &&
  confCode.includes('republicanConferences')
);
check('Conference.jsx has Section 1 "international"', confCode.includes('id="international"'));
check('Conference.jsx has Section 2 "infra2000"', confCode.includes('id="infra2000"'));
check('Conference.jsx has Section 3 "republican"', confCode.includes('id="republican"'));
check('Conference.jsx has clickable link renderer', confCode.includes('renderSourceWithLinks'));
check('Conference.jsx has search query state', confCode.includes('const [query, setQuery]'));
check('Conference.jsx has section filter', confCode.includes('selectedSection'));
check('Conference.jsx has year filter', confCode.includes('selectedYear'));
check('Conference.jsx supports source_en under author', confCode.includes('item.source_en'));
check('Conference.jsx supports title_en', confCode.includes('item.title_en'));
check('Conference.jsx supports authors_en', confCode.includes('item.authors_en'));

console.log('\n==================================================');
if (allPassed) {
  console.log('>>> ALL VERIFICATION CHECKS PASSED SUCCESSFULLY! <<<');
} else {
  console.error('>>> SOME VERIFICATION CHECKS FAILED! <<<');
  process.exit(1);
}
console.log('==================================================');
