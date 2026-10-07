const fs = require('fs');
const path = require('path');

const report = {
  summary: {},
  patents: {},
  articles: {},
  books: {},
  akts: {},
  certificates: {},
  developments: {},
  translations: {},
  headings: {},
  links: {},
  keywords: {},
  accessibility: {}
};

// ==========================================
// 1. PATENTS AUDIT
// ==========================================
const patents = JSON.parse(fs.readFileSync('src/data/patents.json', 'utf8'));
const patentNumbers = new Map();
const patentTitles = new Map();
const patentsWithMissingYear = [];
const patentsWithMissingNumber = [];
const patentsWithMissingAuthors = [];
const patentsWithMissingImage = [];

patents.forEach((p, idx) => {
  const normNum = (p.number || '').toLowerCase().replace(/[^a-zа-яё0-9]/gi, '');
  if (normNum) {
    if (!patentNumbers.has(normNum)) patentNumbers.set(normNum, []);
    patentNumbers.get(normNum).push({ id: p.id, number: p.number, title: p.title, year: p.year });
  } else {
    patentsWithMissingNumber.push(p);
  }

  const normTitle = (p.title || '').toLowerCase().replace(/[^a-zа-яё0-9]/gi, '');
  if (normTitle) {
    if (!patentTitles.has(normTitle)) patentTitles.set(normTitle, []);
    patentTitles.get(normTitle).push({ id: p.id, number: p.number, title: p.title, year: p.year, country: p.country });
  }

  if (!p.year) patentsWithMissingYear.push({ id: p.id, number: p.number, title: p.title });
  if (!p.authors) patentsWithMissingAuthors.push({ id: p.id, number: p.number, title: p.title });

  if (p.image) {
    const p1 = path.join('public', 'images', 'patent', p.image);
    const p2 = path.join('public', 'images', p.image);
    if (!fs.existsSync(p1) && !fs.existsSync(p2)) {
      patentsWithMissingImage.push({ id: p.id, image: p.image });
    }
  } else {
    patentsWithMissingImage.push({ id: p.id, image: 'NONE' });
  }
});

const duplicatePatentTitles = [];
for (const [normTitle, list] of patentTitles.entries()) {
  if (list.length > 1) {
    duplicatePatentTitles.push(list);
  }
}

report.patents = {
  total: patents.length,
  missingYear: patentsWithMissingYear,
  missingNumber: patentsWithMissingNumber,
  missingAuthors: patentsWithMissingAuthors,
  missingImage: patentsWithMissingImage,
  duplicateTitles: duplicatePatentTitles
};

// ==========================================
// 2. ARTICLES AUDIT
// ==========================================
const articles = JSON.parse(fs.readFileSync('src/data/articles.json', 'utf8'));
const articleTitles = new Map();
const articlesMissingAuthors = [];
const articlesMissingTitle = [];
const articlesMissingJournal = [];
const articlesMissingYear = [];
const authorVariants = new Map();

articles.forEach((a, idx) => {
  const normTitle = (a.title || '').toLowerCase().replace(/[^a-zа-яё0-9]/gi, '');
  if (normTitle) {
    if (!articleTitles.has(normTitle)) articleTitles.set(normTitle, []);
    articleTitles.get(normTitle).push({ id: a.id, title: a.title, year: a.year, journal: a.journal, authors: a.authors });
  } else {
    articlesMissingTitle.push({ id: a.id, idx });
  }

  if (!a.authors) articlesMissingAuthors.push({ id: a.id, title: a.title });
  if (!a.journal) articlesMissingJournal.push({ id: a.id, title: a.title });
  if (!a.year) articlesMissingYear.push({ id: a.id, title: a.title });

  // Track author variations for Rakhimov
  if (a.authors) {
    const list = a.authors.split(/[,;]/).map(s => s.trim());
    list.forEach(name => {
      if (/рахимов|rakhimov/i.test(name)) {
        authorVariants.set(name, (authorVariants.get(name) || 0) + 1);
      }
    });
  }
});

const duplicateArticleTitles = [];
for (const [normTitle, list] of articleTitles.entries()) {
  if (list.length > 1) {
    duplicateArticleTitles.push(list);
  }
}

// Check articles for missing pages inside journal string
const articlesMissingPages = [];
articles.forEach(a => {
  const j = a.journal || '';
  // Check if journal has page numbers or volume
  const hasPages = /(?:c\.|с\.|pp\.|p\.|стр\.|page|pages|\b\d+[-–]\d+\b)/i.test(j);
  if (!hasPages) {
    articlesMissingPages.push({ id: a.id, year: a.year, title: a.title, journal: a.journal });
  }
});

report.articles = {
  total: articles.length,
  missingAuthors: articlesMissingAuthors,
  missingTitle: articlesMissingTitle,
  missingJournal: articlesMissingJournal,
  missingYear: articlesMissingYear,
  duplicateTitles: duplicateArticleTitles,
  missingPagesCount: articlesMissingPages.length,
  missingPagesSamples: articlesMissingPages.slice(0, 10),
  authorVariants: Object.fromEntries(authorVariants)
};

// ==========================================
// 3. BOOKS AUDIT
// ==========================================
const books = JSON.parse(fs.readFileSync('src/data/books.json', 'utf8'));
const booksAudit = books.map((b, idx) => {
  const coverPath = b.cover ? path.join('public', b.cover.startsWith('/') ? b.cover.slice(1) : b.cover) : null;
  const coverExists = coverPath ? fs.existsSync(coverPath) : false;
  return {
    id: b.id,
    hasTitle: !!(b.title && b.title.trim()),
    title: b.title,
    hasDescription: !!(b.description && b.description.trim()),
    author: b.author,
    cover: b.cover,
    coverExists,
    yandexUrl: b.yandex_disk_url
  };
});
report.books = {
  total: books.length,
  items: booksAudit
};

// ==========================================
// 4. AKTS AUDIT
// ==========================================
const akts = JSON.parse(fs.readFileSync('src/data/akts.json', 'utf8'));
const aktsAudit = {
  total: akts.length,
  missingUrl: akts.filter(a => !a.google_drive_url),
  missingTitle: akts.filter(a => !a.title),
  missingOrg: akts.filter(a => !a.organization),
  missingTitleEn: akts.filter(a => !a.title_en),
  missingOrgEn: akts.filter(a => !a.organization_en)
};
report.akts = aktsAudit;

// ==========================================
// 5. CERTIFICATES & PDFS AUDIT
// ==========================================
const certFiles = ['sushkaCertificates.json', 'lampCertificates.json', 'kalciCertificates.json', 'sterilCertificates.json'];
const pdfFiles = ['kalciPdfs.json', 'lampPdfs.json', 'sterilPdfs.json'];
const certAudit = {};
certFiles.forEach(f => {
  const data = JSON.parse(fs.readFileSync(path.join('src/data', f), 'utf8'));
  let missing = [];
  data.forEach(item => {
    ['cover', 'preview', 'src'].forEach(prop => {
      if (item[prop]) {
        const full = path.join('public', item[prop].startsWith('/') ? item[prop].slice(1) : item[prop]);
        if (!fs.existsSync(full)) missing.push({ id: item.id, prop, val: item[prop] });
      }
    });
    if (item.pages && Array.isArray(item.pages)) {
      item.pages.forEach(p => {
        const full = path.join('public', p.startsWith('/') ? p.slice(1) : p);
        if (!fs.existsSync(full)) missing.push({ id: item.id, prop: 'pages', val: p });
      });
    }
  });
  certAudit[f] = { count: data.length, missingFiles: missing };
});
pdfFiles.forEach(f => {
  const data = JSON.parse(fs.readFileSync(path.join('src/data', f), 'utf8'));
  let missing = [];
  data.forEach(item => {
    if (item.url) {
      const full = path.join('public', item.url.startsWith('/') ? item.url.slice(1) : item.url);
      if (!fs.existsSync(full)) missing.push({ id: item.id, url: item.url });
    }
  });
  certAudit[f] = { count: data.length, missingFiles: missing };
});
report.certificates = certAudit;

// ==========================================
// 6. GLOBAL SEARCH FOR PLACEHOLDERS & BRANDING
// ==========================================
const searchTerms = [
  'TODO', 'FIXME', 'TEST', 'DEMO', 'LOREM', 'PLACEHOLDER', 'DUMMY', 'EXAMPLE',
  'INFRAX', 'infraks.ru', 'infraks.uz', 'localhost', '127.0.0.1',
  'undefined', 'NaN', 'console.log', 'alert('
];

function walkDir(dir, filter) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist') {
        results = results.concat(walkDir(full, filter));
      }
    } else if (filter(full)) {
      results.push(full);
    }
  });
  return results;
}

const srcFiles = walkDir('src', f => /\.(jsx?|tsx?|css|json)$/.test(f));
srcFiles.push('index.html');

const keywordMatches = {};
searchTerms.forEach(term => {
  keywordMatches[term] = [];
});

srcFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, lineNum) => {
    searchTerms.forEach(term => {
      // Regex search with case sensitivity or boundary
      const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const isCaseSensitive = (term === 'TODO' || term === 'FIXME' || term === 'NaN');
      const regex = isCaseSensitive ? new RegExp('\\b' + escapedTerm + '\\b') : new RegExp(escapedTerm, 'i');
      if (regex.test(line)) {
        // Skip some false positives
        if (term === 'TEST' && /latest|contest|attest|greatest|fastest|protest/i.test(line) && !/\btest\b/i.test(line)) return;
        keywordMatches[term].push({
          file: path.relative('.', file).replace(/\\/g, '/'),
          line: lineNum + 1,
          snippet: line.trim().slice(0, 120)
        });
      }
    });
  });
});

report.keywords = keywordMatches;

// ==========================================
// 7. RU / EN TRANSLATIONS PARITY
// ==========================================
const langContextContent = fs.readFileSync('src/context/LanguageContext.jsx', 'utf8');
// Parse translations keys from LanguageContext
const ruMatch = langContextContent.match(/ru:\s*\{([\s\S]*?)\n\s*\},/);
const enMatch = langContextContent.match(/en:\s*\{([\s\S]*?)\n\s*\}\n\};/);

if (ruMatch && enMatch) {
  const extractKeys = (block) => {
    const keys = [];
    const keyRegex = /^\s*(?:'([^']+)'|"([^"]+)"|([a-zA-Z0-9_]+))\s*:/gm;
    let m;
    while ((m = keyRegex.exec(block)) !== null) {
      keys.push(m[1] || m[2] || m[3]);
    }
    return keys;
  };
  const ruKeys = extractKeys(ruMatch[1]);
  const enKeys = extractKeys(enMatch[1]);
  const missingInEn = ruKeys.filter(k => !enKeys.includes(k));
  const missingInRu = enKeys.filter(k => !ruKeys.includes(k));
  report.translations = {
    ruCount: ruKeys.length,
    enCount: enKeys.length,
    missingInEn,
    missingInRu
  };
}

// ==========================================
// 8. HEADING STRUCTURE (H1, H2, H3) IN PAGES
// ==========================================
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const pagesDir = 'src/pages';
const pageFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));
const headingAudit = [];

pageFiles.forEach(pf => {
  const content = fs.readFileSync(path.join(pagesDir, pf), 'utf8');
  const h1Matches = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  const h2Matches = content.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || [];
  const h3Matches = content.match(/<h3[^>]*>([\s\S]*?)<\/h3>/gi) || [];
  headingAudit.push({
    file: pf,
    h1Count: h1Matches.length,
    h2Count: h2Matches.length,
    h3Count: h3Matches.length,
    h1Snippets: h1Matches.map(h => escapeHtml(h).trim().slice(0, 60)),
    h2Snippets: h2Matches.map(h => escapeHtml(h).trim().slice(0, 60))
  });
});
report.headings = headingAudit;

// Write full audit result
fs.writeFileSync('scripts/stage_4_audit_results.json', JSON.stringify(report, null, 2), 'utf8');
console.log('Stage 4 full audit completed! Results saved to scripts/stage_4_audit_results.json');
