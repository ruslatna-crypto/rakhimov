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

const files = walkDir('src', f => /\.(jsx|js)$/.test(f));

let imgsWithoutAlt = [];
let buttonsWithoutLabel = [];
let linksWithoutLabel = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const relFile = path.relative('.', file).replace(/\\/g, '/');

  // Check <img>
  const imgTags = content.matchAll(/<img\b([^>]*?)>/gi);
  for (const match of imgTags) {
    const attrs = match[1];
    if (!/alt\s*=\s*["'{]/i.test(attrs)) {
      imgsWithoutAlt.push({ file: relFile, tag: match[0].slice(0, 80) });
    }
  }

  // Check <button> without children or text
  const buttonTags = content.matchAll(/<button\b([^>]*?)>([\s\S]*?)<\/button>/gi);
  for (const match of buttonTags) {
    const attrs = match[1];
    const inner = match[2].trim();
    const hasAria = /aria-label\s*=\s*["'{]/i.test(attrs);
    const hasTitle = /title\s*=\s*["'{]/i.test(attrs);
    const hasText = /[a-zA-Zа-яё0-9]/i.test(inner) || inner.includes('t(');
    if (!hasText && !hasAria && !hasTitle) {
      buttonsWithoutLabel.push({ file: relFile, tag: match[0].slice(0, 100) });
    }
  }
});

console.log('=== ACCESSIBILITY AUDIT ===');
console.log('Images without alt attribute:', imgsWithoutAlt.length);
if (imgsWithoutAlt.length) console.log(imgsWithoutAlt);

console.log('Buttons without text/aria-label/title:', buttonsWithoutLabel.length);
if (buttonsWithoutLabel.length) console.log(buttonsWithoutLabel);
