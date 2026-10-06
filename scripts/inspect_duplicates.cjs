const fs = require('fs');
const r = JSON.parse(fs.readFileSync('scripts/stage_4_audit_results.json', 'utf8'));

console.log('Total duplicate title groups in articles:', r.articles.duplicateTitles.length);
r.articles.duplicateTitles.forEach((group, idx) => {
  console.log(`\nGroup #${idx + 1} (${group.length} entries):`);
  group.forEach(a => {
    console.log(`  [${a.id} | Year: ${a.year}]: "${a.title}"`);
    console.log(`     Authors: ${a.authors}`);
    console.log(`     Journal: ${a.journal}`);
  });
});

console.log('\n========================================');
console.log('PATENT DUPLICATE TITLES AUDIT:');
console.log('Total duplicate title groups in patents:', r.patents.duplicateTitles.length);
r.patents.duplicateTitles.forEach((group, idx) => {
  console.log(`\nPatent Group #${idx + 1} (${group.length} entries):`);
  group.forEach(p => {
    console.log(`  [${p.id} | Year: ${p.year} | Country: ${p.country}]: "${p.title}" (Num: ${p.number})`);
  });
});

