const fs = require('fs');

const content = fs.readFileSync('src/pages/DevelopmentPage.jsx', 'utf8');

// Check sections for each slug
const slugs = ['sushka', 'lamp', 'kalci', 'pech', 'plenka', 'kraska', 'steril', 'cotton', 'bsp'];

slugs.forEach(s => {
  const count = (content.match(new RegExp(`slug === ['"\`]${s}['"\`]`, 'g')) || []).length;
  console.log(`Slug '${s}' conditional blocks: ${count}`);
});

// Check for Cyrillic strings inside DevelopmentPage that are NOT inside a ternary or russian branch
// Let's check lines that contain Cyrillic and see if they are guarded by lang === 'ru' or part of a ternary
const lines = content.split('\n');
let cyrillicOutsideTernary = [];

lines.forEach((line, idx) => {
  const lineNum = idx + 1;
  const hasCyrillic = /[а-яё]/i.test(line);
  if (!hasCyrillic) return;

  // If line has 'lang ===' or 't(' or comments
  const isComment = /^\s*(\/\/|\/\*|\*)/.test(line);
  if (isComment) return;

  const hasLangCheck = /lang\s*===/.test(line);
  const hasT = /\bt\(/.test(line);
  const hasTernary = /\?.*:/.test(line);

  // If it's pure JSX text without ternary or lang check
  if (!hasLangCheck && !hasT && !hasTernary) {
    // Check if previous line had ternary or if it's within a ternary
    cyrillicOutsideTernary.push({ lineNum, text: line.trim() });
  }
});

console.log(`\nLines with Cyrillic potentially outside ternary/lang check: ${cyrillicOutsideTernary.length}`);
cyrillicOutsideTernary.slice(0, 30).forEach(l => {
  console.log(`  L${l.lineNum}: ${l.text.slice(0, 100)}`);
});
