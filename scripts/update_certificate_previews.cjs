const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

const certFiles = [
  'lampCertificates.json',
  'sterilCertificates.json',
  'kalciCertificates.json',
  'sushkaCertificates.json'
];

let totalLinked = 0;

for (const file of certFiles) {
  const jsonPath = path.join(ROOT_DIR, 'src', 'data', file);
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  for (const item of data) {
    const mainImg = item.cover || (item.pages && item.pages[0]) || item.src;
    if (mainImg) {
      // Find corresponding -preview.webp
      const parsed = path.parse(mainImg);
      const previewRel = path.join(parsed.dir, `${parsed.name}-preview.webp`).replace(/\\/g, '/');
      const previewDisk = path.join(PUBLIC_DIR, previewRel.startsWith('/') ? previewRel.slice(1) : previewRel);

      if (fs.existsSync(previewDisk)) {
        item.preview = previewRel.startsWith('/') ? previewRel : '/' + previewRel;
        totalLinked++;
      } else {
        // Also check if .webp exists (e.g. for png)
        const webpRel = path.join(parsed.dir, `${parsed.name}.webp`).replace(/\\/g, '/');
        const webpDisk = path.join(PUBLIC_DIR, webpRel.startsWith('/') ? webpRel.slice(1) : webpRel);
        if (fs.existsSync(webpDisk)) {
          item.preview = webpRel.startsWith('/') ? webpRel : '/' + webpRel;
          totalLinked++;
        }
      }
    }
  }

  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`Updated ${file} with preview links.`);
}

console.log(`Total certificate previews linked: ${totalLinked}`);
