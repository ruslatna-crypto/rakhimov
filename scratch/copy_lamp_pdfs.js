import fs from 'fs';
import path from 'path';

const srcDir = 'g:/Сайт на GitHub Rakhimov/лампы/сертификаты/pdf';
const targetDir = 'f:/laragon/www/rakhimov/public/pdf/lamp';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);
console.log('Found', files.length, 'files in source directory:');

const pdfsData = [];

// Clean slug generator for safe web URLs
function makeSafeFileName(index, originalName) {
  const ext = path.extname(originalName);
  const base = path.basename(originalName, ext);
  // safe numbered name
  const num = String(index + 1).padStart(2, '0');
  return `lamp_doc_${num}${ext}`;
}

files.forEach((file, index) => {
  const srcPath = path.join(srcDir, file);
  const safeName = makeSafeFileName(index, file);
  const targetPath = path.join(targetDir, safeName);
  
  fs.copyFileSync(srcPath, targetPath);
  const stat = fs.statSync(targetPath);
  const sizeMb = (stat.size / (1024 * 1024)).toFixed(2);
  const sizeKb = Math.round(stat.size / 1024);

  // Derive human-readable title and category
  const titleWithoutExt = path.basename(file, path.extname(file));

  pdfsData.push({
    id: index + 1,
    originalFileName: file,
    fileName: safeName,
    url: `/pdf/lamp/${safeName}`,
    sizeMb: `${sizeMb} МБ`,
    sizeKb: `${sizeKb} КБ`,
    bytes: stat.size,
    rawTitle: titleWithoutExt
  });
});

console.log('Copied all files successfully. Details:');
console.log(JSON.stringify(pdfsData, null, 2));

fs.writeFileSync(
  'f:/laragon/www/rakhimov/src/data/lampPdfs.json',
  JSON.stringify(pdfsData, null, 2),
  'utf8'
);
