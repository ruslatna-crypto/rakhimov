const fs = require('fs');

function count(path) {
  try {
    const data = JSON.parse(fs.readFileSync(path, 'utf8'));
    return Array.isArray(data) ? data.length : 0;
  } catch (e) {
    return 0;
  }
}

console.log('Books:', count('src/data/books.json'));
console.log('Articles:', count('src/data/articles.json'));
console.log('Patents:', count('src/data/patents.json'));
console.log('Acts:', count('src/data/akts.json'));
const certs = count('src/data/lampCertificates.json') + count('src/data/sushkaCertificates.json') + count('src/data/kalciCertificates.json') + count('src/data/sterilCertificates.json');
console.log('Certificates:', certs);
const pdfs = count('src/data/lampPdfs.json') + count('src/data/sterilPdfs.json') + count('src/data/kalciPdfs.json');
console.log('PDF:', pdfs);
