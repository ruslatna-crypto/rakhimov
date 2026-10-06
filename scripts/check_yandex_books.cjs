const https = require('https');
const fs = require('fs');

const books = JSON.parse(fs.readFileSync('src/data/books.json', 'utf8'));

books.forEach((b) => {
  https.get(b.yandex_disk_url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const titleMatch = data.match(/<title>([^<]+)<\/title>/i);
      const ogTitle = data.match(/property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
      const filenameMatch = data.match(/"name":"([^"]+\.pdf)"/i);
      console.log(`${b.id}: Title='${titleMatch ? titleMatch[1] : 'N/A'}' | OG='${ogTitle ? ogTitle[1] : 'N/A'}' | File='${filenameMatch ? filenameMatch[1] : 'N/A'}'`);
    });
  }).on('error', err => {
    console.log(`${b.id}: Error ${err.message}`);
  });
});
