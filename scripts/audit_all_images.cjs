const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

// Collect all references from original and current codebase
const codeFiles = [
  'index.html',
  'src/data/developments.json',
  'src/data/lampCertificates.json',
  'src/data/sterilCertificates.json',
  'src/data/kalciCertificates.json',
  'src/data/sushkaCertificates.json',
  'src/data/patents.json',
  'src/data/books.json',
  'src/data/akts.json',
  'src/components/HeroSlider.jsx',
  'src/components/Header.jsx',
  'src/components/Footer.jsx',
  'src/pages/Author.jsx',
  'src/pages/DevelopmentPage.jsx',
  'src/pages/Home.jsx',
  'src/styles/pages.css',
  'src/styles/header.css',
  'src/styles/global.css'
];

const foundImages = new Set();

for (const rel of codeFiles) {
  const full = path.join(ROOT_DIR, rel);
  if (!fs.existsSync(full)) continue;
  const content = fs.readFileSync(full, 'utf8');

  // Match /images/... or images/... with extensions
  const matches = content.match(/\/images\/[a-zA-Z0-9_\-\.\/]+?\.(jpg|jpeg|png|webp|svg|gif)/g) || [];
  for (const m of matches) {
    foundImages.add(m.replace(/^\//, ''));
  }
}

console.log(`Found ${foundImages.size} directly referenced images in current code.`);

// Also check git diff or older versions to find references that were updated to .webp
// E.g. /images/slider/slider1.png -> slider1.webp
// /images/RRKh.png -> RRKh.webp
// /images/razrabotka.png -> razrabotka.webp
// /images/razrabotka_eng.png -> razrabotka_eng.webp
// /images/sushka_uzb.png -> sushka_uzb.webp
// /images/etapi.png -> etapi.webp
// /images/etapi_eng.png -> etapi_eng.webp
// etc.

const auditTable = [];
let missingOriginals = 0;
let missingPreviews = 0;
let activeCount = 0;

// Read all 405 files from images_inventory.json created at start of Stage 3
const initialInventory = JSON.parse(fs.readFileSync(path.join(__dirname, 'images_inventory.json'), 'utf8'));

for (const item of initialInventory) {
  const origRel = item.relPath;
  const origDisk = path.join(PUBLIC_DIR, origRel);
  const origExists = fs.existsSync(origDisk);

  if (!origExists) {
    missingOriginals++;
  }

  // Check if preview exists
  const parsed = path.parse(origRel);
  const previewRel = path.join(parsed.dir, `${parsed.name}-preview.webp`).replace(/\\/g, '/');
  const previewDisk = path.join(PUBLIC_DIR, previewRel);
  const previewExists = fs.existsSync(previewDisk);

  // Check if regular webp exists
  const webpRel = path.join(parsed.dir, `${parsed.name}.webp`).replace(/\\/g, '/');
  const webpDisk = path.join(PUBLIC_DIR, webpRel);
  const webpExists = fs.existsSync(webpDisk);

  // Current active file in UI
  let newFile = origRel;
  if (previewExists) {
    newFile = previewRel;
  } else if (webpExists && item.format === 'PNG') {
    newFile = webpRel;
  }

  let status = 'PASS';
  if (!origExists) {
    status = 'FAIL (Original missing)';
  }

  auditTable.push({
    oldFile: origRel,
    usedBefore: item.used,
    newFile: newFile,
    origExists: origExists,
    previewExists: previewExists,
    webpExists: webpExists,
    sizeMB: item.sizeMB,
    status: status
  });
}

const usedItems = auditTable.filter(x => x.usedBefore);
console.log(`Total original used items checked: ${usedItems.length}`);
console.log(`Used items with original preserved: ${usedItems.filter(x => x.origExists).length}`);
console.log(`Used items missing originals: ${usedItems.filter(x => !x.origExists).length}`);

fs.writeFileSync(
  path.join(__dirname, 'images_audit_table.json'),
  JSON.stringify(auditTable, null, 2)
);
