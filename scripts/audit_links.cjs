const fs = require('fs');
const path = require('path');

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

const jsxFiles = walkDir('src', f => /\.(jsx|js)$/.test(f));

const validRoutes = [
  '/',
  '/autor',
  '/author',
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
  '/main',
  '/page77759756.html',
  '/Contacts'
];

const internalLinks = [];
const externalLinks = [];
const anchorLinks = [];
const fileLinks = [];

jsxFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const relFile = path.relative('.', file).replace(/\\/g, '/');

  // Match Link to="..."
  const linkMatches = content.matchAll(/<Link[^>]+to=["']([^"']+)["']/g);
  for (const m of linkMatches) {
    internalLinks.push({ file: relFile, to: m[1] });
  }

  // Match href="..."
  const hrefMatches = content.matchAll(/href=["']([^"']+)["']/g);
  for (const m of hrefMatches) {
    const url = m[1];
    if (url.startsWith('http://') || url.startsWith('https://')) {
      externalLinks.push({ file: relFile, url });
    } else if (url.startsWith('#')) {
      anchorLinks.push({ file: relFile, anchor: url });
    } else if (url.startsWith('mailto:') || url.startsWith('tel:')) {
      // mailto/tel
    } else if (url.endsWith('.pdf') || url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.webp')) {
      fileLinks.push({ file: relFile, url });
    } else {
      internalLinks.push({ file: relFile, to: url });
    }
  }
});

console.log('=== INTERNAL LINKS AUDIT ===');
const brokenInternal = [];
internalLinks.forEach(link => {
  const base = link.to.split('#')[0].split('?')[0];
  if (base && !validRoutes.includes(base) && !base.startsWith('http')) {
    brokenInternal.push(link);
  }
});
console.log('Total internal links:', internalLinks.length);
console.log('Broken internal links:', brokenInternal.length);
if (brokenInternal.length) console.log(brokenInternal);

console.log('\n=== EXTERNAL LINKS AUDIT ===');
console.log('Total external links in JSX:', externalLinks.length);
const uniqueExternal = [...new Set(externalLinks.map(e => e.url))];
console.log('Unique external URLs:', uniqueExternal.length);
uniqueExternal.forEach(u => console.log('  - ' + u));

console.log('\n=== ASSET FILE LINKS AUDIT ===');
console.log('Total asset href links:', fileLinks.length);
const brokenFiles = [];
fileLinks.forEach(f => {
  const p = path.join('public', f.url.startsWith('/') ? f.url.slice(1) : f.url);
  if (!fs.existsSync(p)) {
    brokenFiles.push({ file: f.file, url: f.url, p });
  }
});
console.log('Broken asset links:', brokenFiles.length);
if (brokenFiles.length) console.log(brokenFiles);
