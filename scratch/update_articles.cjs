const fs = require('fs');

const path = 'src/data/articles.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const addDuplicate = (id) => {
    const item = data.find(i => i.id === id);
    if (item && !item.journal.includes('(Дубликат)')) {
        item.journal = item.journal.trim() + ' (Дубликат)';
    }
};

const removeDuplicate = (id) => {
    const item = data.find(i => i.id === id);
    if (item && item.journal.includes('(Дубликат)')) {
        item.journal = item.journal.replace(/\s*\(Дубликат\)$/, '');
    }
};

// Remove from 070 (013 and 064 should keep it according to instruction "У ART-013 уже имеет пометку (Дубликат)... использовать существующий формат")
removeDuplicate('ART-070');

// Add to new duplicates
addDuplicate('ART-009');
addDuplicate('ART-010');
addDuplicate('ART-011');
addDuplicate('ART-012');
addDuplicate('ART-014');
addDuplicate('ART-015');
addDuplicate('ART-016');
addDuplicate('ART-075');
addDuplicate('ART-091');
addDuplicate('ART-128');

fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
console.log('Updated articles.json successfully.');
