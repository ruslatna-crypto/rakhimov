const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');

// 1. Gather all files in public/images recursively
function walkDir(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(walkDir(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

const allFiles = walkDir(IMAGES_DIR);

console.log('=== STAGE 3.1 INDEPENDENT VERIFICATION ===');
console.log('Total files in public/images:', allFiles.length);

const byExt = {};
let totalBytes = 0;
let filesOver1MB = 0;
let previews = [];
let regularWebp = [];
let originalPng = [];
let originalJpg = [];
let svgFiles = [];

for (const f of allFiles) {
  const stat = fs.statSync(f);
  const size = stat.size;
  totalBytes += size;
  if (size > 1024 * 1024) filesOver1MB++;

  const ext = path.extname(f).toLowerCase();
  byExt[ext] = (byExt[ext] || 0) + 1;

  const base = path.basename(f);
  if (base.endsWith('-preview.webp')) {
    previews.push(f);
  } else if (ext === '.webp') {
    regularWebp.push(f);
  } else if (ext === '.png') {
    originalPng.push(f);
  } else if (ext === '.jpg' || ext === '.jpeg') {
    originalJpg.push(f);
  } else if (ext === '.svg') {
    svgFiles.push(f);
  }
}

console.log('By extension:', byExt);
console.log('Total disk size (MB):', (totalBytes / 1024 / 1024).toFixed(2));
console.log('Files > 1 MB on disk:', filesOver1MB);
console.log('Previews (*-preview.webp):', previews.length);
console.log('Regular WebP:', regularWebp.length);
console.log('Total WebP:', previews.length + regularWebp.length);
console.log('PNG files:', originalPng.length);
console.log('JPG/JPEG files:', originalJpg.length);

// 2. Check preview -> original pairing
console.log('\n--- PREVIEW -> ORIGINAL PAIRING CHECK ---');
let previewPairs = [];
let brokenPreviews = [];

for (const p of previews) {
  const rel = path.relative(PUBLIC_DIR, p).replace(/\\/g, '/');
  const dir = path.dirname(p);
  const base = path.basename(p, '-preview.webp');

  // Candidate originals: .jpg, .jpeg, .png
  const candidates = [
    path.join(dir, `${base}.jpg`),
    path.join(dir, `${base}.jpeg`),
    path.join(dir, `${base}.png`)
  ];

  let foundOriginal = candidates.find(c => fs.existsSync(c));
  if (foundOriginal) {
    const origRel = path.relative(PUBLIC_DIR, foundOriginal).replace(/\\/g, '/');
    const origStat = fs.statSync(foundOriginal);
    const prevStat = fs.statSync(p);
    previewPairs.push({
      preview: rel,
      original: origRel,
      prevSizeKB: (prevStat.size / 1024).toFixed(1),
      origSizeMB: (origStat.size / 1024 / 1024).toFixed(2),
      exists: true
    });
  } else {
    brokenPreviews.push(rel);
  }
}

console.log('Total previews checked:', previews.length);
console.log('Previews with valid original on disk:', previewPairs.length);
console.log('Previews without original (broken):', brokenPreviews.length);
if (brokenPreviews.length > 0) {
  console.log('Broken previews:', brokenPreviews);
}

// Write preview pairing check to json
fs.writeFileSync(
  path.join(ROOT_DIR, 'scripts', 'preview_verification.json'),
  JSON.stringify({ previewPairs, brokenPreviews }, null, 2)
);
