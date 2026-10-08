const fs = require('fs');
const path = require('path');

console.log('==================================================');
console.log('   FULL VERIFICATION: ARTICLES BILINGUAL SUPPORT');
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

const articles = require('../src/data/articles.json');
check('Articles total count', articles.length === 280, `(${articles.length}/280)`);

let missingFields = 0;
let cyrillicAuthors = 0;
let cyrillicTitles = 0;

articles.forEach(art => {
  if (!art.title_en || !art.authors_en || !art.journal_en) {
    missingFields++;
  }
  // Check if authors_en contains cyrillic
  if (/[а-яА-ЯёЁ]/.test(art.authors_en)) {
    cyrillicAuthors++;
  }
  // Check if title_en contains cyrillic
  if (/[а-яА-ЯёЁ]/.test(art.title_en)) {
    cyrillicTitles++;
  }
});

check('All 280 articles have title_en, authors_en, journal_en', missingFields === 0, `(missing: ${missingFields})`);
check('All 280 article authors_en are transliterated to Latin', cyrillicAuthors === 0, `(cyrillic: ${cyrillicAuthors})`);
check('All 280 article title_en are translated to English', cyrillicTitles === 0, `(cyrillic: ${cyrillicTitles})`);

// ArticlesPage.jsx check
const articlesPagePath = path.resolve(__dirname, '../src/pages/ArticlesPage.jsx');
const articlesPageCode = fs.readFileSync(articlesPagePath, 'utf8');

check('ArticlesPage.jsx renders art.title_en', articlesPageCode.includes('art.title_en'));
check('ArticlesPage.jsx renders art.authors_en', articlesPageCode.includes('art.authors_en'));
check('ArticlesPage.jsx renders art.journal_en', articlesPageCode.includes('art.journal_en'));
check('ArticlesPage.jsx searches art.title_en', articlesPageCode.includes('a.title_en'));
check('ArticlesPage.jsx searches art.authors_en', articlesPageCode.includes('a.authors_en'));
check('ArticlesPage.jsx searches art.journal_en', articlesPageCode.includes('a.journal_en'));

// searchIndex.js check
const searchIndexPath = path.resolve(__dirname, '../src/utils/searchIndex.js');
const searchIndexCode = fs.readFileSync(searchIndexPath, 'utf8');
check('searchIndex.js formats articles with title_en and authors_en', 
  searchIndexCode.includes('art.title_en') && searchIndexCode.includes('art.authors_en')
);

console.log('\n==================================================');
if (allPassed) {
  console.log('>>> ALL ARTICLES VERIFICATION CHECKS PASSED! <<<');
} else {
  console.error('>>> SOME ARTICLES VERIFICATION CHECKS FAILED! <<<');
  process.exit(1);
}
console.log('==================================================');
