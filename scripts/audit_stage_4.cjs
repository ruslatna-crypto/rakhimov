const fs = require('fs');
const path = require('path');

// 1. Audit Patents
console.log('=== AUDITING PATENTS ===');
const patents = JSON.parse(fs.readFileSync('src/data/patents.json', 'utf8'));
console.log('Total patents:', patents.length);

let patentsWithMissingNumber = [];
let patentsWithMissingTitle = [];
let patentsWithMissingYear = [];
let patentsWithMissingAuthors = [];
let patentsWithMissingCountry = [];
let patentsWithMissingFile = [];
let patentNumbers = new Map();
let patentTitles = new Map();

patents.forEach((p, idx) => {
  const num = (p.number || p.num || '').trim();
  const title = (p.title || p.name || '').trim();
  const year = p.year;
  const authors = p.authors || p.author;
  const country = p.country;
  const file = p.image || p.file || p.preview || p.pdf || p.scan;

  if (!num) patentsWithMissingNumber.push({ idx, p });
  else {
    if (patentNumbers.has(num)) {
      patentNumbers.get(num).push({ idx, title, p });
    } else {
      patentNumbers.set(num, [{ idx, title, p }]);
    }
  }

  if (!title) patentsWithMissingTitle.push({ idx, p });
  else {
    const normTitle = title.toLowerCase().replace(/[^a-zа-яё0-9]/gi, '');
    if (patentTitles.has(normTitle)) {
      patentTitles.get(normTitle).push({ idx, num, title, year });
    } else {
      patentTitles.set(normTitle, [{ idx, num, title, year }]);
    }
  }

  if (!year) patentsWithMissingYear.push({ idx, num, title });
  if (!authors) patentsWithMissingAuthors.push({ idx, num, title });
  if (!country) patentsWithMissingCountry.push({ idx, num, title });

  // Check file existence if any file specified
  const fileToCheck = p.preview || p.image || p.pdf || p.file;
  if (fileToCheck) {
    const cleanPath = fileToCheck.startsWith('/') ? fileToCheck.slice(1) : fileToCheck;
    const fullPath = path.join('public', cleanPath);
    if (!fs.existsSync(fullPath)) {
      patentsWithMissingFile.push({ idx, num, fileToCheck, fullPath });
    }
  }
});

console.log('Patents missing number:', patentsWithMissingNumber.length);
console.log('Patents missing title:', patentsWithMissingTitle.length);
console.log('Patents missing year:', patentsWithMissingYear.length);
console.log('Patents missing authors:', patentsWithMissingAuthors.length);
console.log('Patents missing country:', patentsWithMissingCountry.length);
console.log('Patents with missing file on disk:', patentsWithMissingFile.length);
if (patentsWithMissingFile.length > 0) {
  console.log('Missing files:', patentsWithMissingFile);
}

// Check duplicates by number
console.log('\n--- Duplicate Patent Numbers ---');
let duplicateNumbers = [];
for (const [num, list] of patentNumbers.entries()) {
  if (list.length > 1) {
    console.log(`Number ${num} appears ${list.length} times:`, list.map(x => `[#${x.idx}: ${x.title}]`).join(' | '));
    duplicateNumbers.push({ num, list });
  }
}

// Check duplicate / very similar titles
console.log('\n--- Duplicate Patent Normalized Titles ---');
let duplicateTitles = [];
for (const [normTitle, list] of patentTitles.entries()) {
  if (list.length > 1) {
    console.log(`Title duplicate (${list.length} times):`, list.map(x => `[#${x.idx} (${x.num}): ${x.title} (${x.year})]`).join(' | '));
    duplicateTitles.push({ normTitle, list });
  }
}

// 2. Audit Articles
console.log('\n=== AUDITING ARTICLES ===');
const articles = JSON.parse(fs.readFileSync('src/data/articles.json', 'utf8'));
console.log('Total articles:', articles.length);

let articlesMissingAuthors = [];
let articlesMissingTitle = [];
let articlesMissingJournal = [];
let articlesMissingYear = [];
let articlesMissingPages = [];
let articleTitles = new Map();
let authorVariations = new Map();

articles.forEach((a, idx) => {
  const id = a.id || idx;
  const authors = (a.authors || a.author || '').trim();
  const title = (a.title || '').trim();
  const journal = (a.journal || a.source || '').trim();
  const year = a.year;
  const pages = a.pages || a.page;

  if (!authors) articlesMissingAuthors.push({ id, idx, a });
  if (!title) articlesMissingTitle.push({ id, idx, a });
  if (!journal) articlesMissingJournal.push({ id, idx, a });
  if (!year) articlesMissingYear.push({ id, idx, a });
  if (!pages) articlesMissingPages.push({ id, idx, title, year, journal });

  if (title) {
    const normTitle = title.toLowerCase().replace(/[^a-zа-яё0-9]/gi, '');
    if (articleTitles.has(normTitle)) {
      articleTitles.get(normTitle).push({ id, idx, title, year, journal, pages, authors });
    } else {
      articleTitles.set(normTitle, [{ id, idx, title, year, journal, pages, authors }]);
    }
  }

  // Count Rakhimov mentions
  if (authors) {
    const parts = authors.split(/[,;]/).map(s => s.trim());
    parts.forEach(p => {
      if (p.toLowerCase().includes('рахимов') || p.toLowerCase().includes('rakhimov')) {
        authorVariations.set(p, (authorVariations.get(p) || 0) + 1);
      }
    });
  }
});

console.log('Articles missing authors:', articlesMissingAuthors.length);
console.log('Articles missing title:', articlesMissingTitle.length);
console.log('Articles missing journal:', articlesMissingJournal.length);
console.log('Articles missing year:', articlesMissingYear.length);
console.log('Articles missing pages:', articlesMissingPages.length);

console.log('\n--- Duplicate Article Titles ---');
let duplicateArticles = [];
for (const [normTitle, list] of articleTitles.entries()) {
  if (list.length > 1) {
    console.log(`Duplicate article title (${list.length} times):`);
    list.forEach(x => console.log(`   [#${x.id} (${x.year})]: "${x.title}" in "${x.journal}", pages: ${x.pages}, authors: "${x.authors}"`));
    duplicateArticles.push({ normTitle, list });
  }
}

console.log('\n--- Rakhimov Author Spelling Variations in Articles ---');
for (const [variation, count] of authorVariations.entries()) {
  console.log(`   "${variation}": ${count} times`);
}

// 3. Audit Books
console.log('\n=== AUDITING BOOKS ===');
const books = JSON.parse(fs.readFileSync('src/data/books.json', 'utf8'));
console.log('Total books:', books.length);
books.forEach((b, idx) => {
  console.log(`Book #${idx + 1}: "${b.title}" (${b.year}), Authors: ${b.authors}, Publisher: ${b.publisher || 'N/A'}, City: ${b.city || 'N/A'}, Pages: ${b.pages || 'N/A'}, File: ${b.file || 'N/A'}, Cover: ${b.cover || 'N/A'}`);
  if (b.file) {
    const fPath = path.join('public', b.file.startsWith('/') ? b.file.slice(1) : b.file);
    console.log(`   File exists: ${fs.existsSync(fPath)} (${fPath})`);
  }
  if (b.cover) {
    const cPath = path.join('public', b.cover.startsWith('/') ? b.cover.slice(1) : b.cover);
    console.log(`   Cover exists: ${fs.existsSync(cPath)} (${cPath})`);
  }
});

// 4. Audit Akts
console.log('\n=== AUDITING AKTS ===');
const akts = JSON.parse(fs.readFileSync('src/data/akts.json', 'utf8'));
console.log('Total akts:', akts.length);
let missingAktFiles = [];
akts.forEach((akt, idx) => {
  const f = akt.file || akt.image || akt.preview || akt.path;
  if (f) {
    const fPath = path.join('public', f.startsWith('/') ? f.slice(1) : f);
    if (!fs.existsSync(fPath)) {
      missingAktFiles.push({ idx, title: akt.title, fPath });
    }
  } else {
    missingAktFiles.push({ idx, title: akt.title, reason: 'No file property' });
  }
});
console.log('Akts with missing or nonexistent files:', missingAktFiles.length);
if (missingAktFiles.length > 0) {
  console.log(missingAktFiles);
}
