const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'pages', 'DevelopmentPage.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace all /images/...png with /images/...webp
const updated = content.replace(/\/images\/([a-zA-Z0-9_\-\.\/]+)\.png/g, (match, p1) => {
  const diskWebp = path.join(__dirname, '..', 'public', 'images', `${p1}.webp`);
  if (fs.existsSync(diskWebp)) {
    return `/images/${p1}.webp`;
  }
  return match;
});

fs.writeFileSync(filePath, updated, 'utf8');
console.log('DevelopmentPage.jsx updated with WebP images.');
