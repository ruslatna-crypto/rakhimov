const fs = require('fs');
const path = require('path');

const inv = JSON.parse(fs.readFileSync(path.join(__dirname, 'images_inventory.json'), 'utf8'));
const unused = inv.filter(x => !x.used);
console.log('Unreferenced candidates:', unused.length);

let md = `# КАНДИДАТЫ НА УДАЛЕНИЕ / НЕИСПОЛЬЗУЕМЫЕ ИЗОБРАЖЕНИЯ (IMAGE_REMOVAL_CANDIDATES.md)
**Проект:** Портал профессора Рахимова Р.Х. (\`rakhimov\`)  
**Дата составления:** 06 октября 2026 г.

> **КРИТИЧЕСКОЕ ПРАВИЛО:**  
> Ни один файл из этого списка **НЕ УДАЛЯЕТСЯ** автоматически.  
> Все файлы остаются физически на диске в рабочей директории проекта, так как они могут использоваться в архивных материалах или при прямых внешних переходах.

---

## Сводка
- Всего графических файлов без прямых статических ссылок в коде JSX/JSON/CSS: **${unused.length}**
- Общий вес файлов: **${(unused.reduce((a, b) => a + b.sizeBytes, 0) / 1024 / 1024).toFixed(2)} MB**

Большинство этих файлов представляют собой альтернативные варианты названий документов (например, русскоязычные имена файлов сертификатов с пробелами, которые были заменены на латинские идентификаторы \`cert_XX.jpg\`), либо не задействованные версии слайдов.

---

## Таблица файлов-кандидатов

| Файл | Размер | Формат | Разрешение | Статус / Причина включения |
| :--- | ---: | :---: | :---: | :--- |
`;

for (const item of unused) {
  const sizeStr = item.sizeMB >= 1.0 ? `**${item.sizeMB} MB**` : `${item.sizeKB} KB`;
  md += `| \`${item.relPath}\` | ${sizeStr} | ${item.format} | ${item.width}×${item.height} | Прямых упоминаний в коде JSX/JSON/CSS не обнаружено |\n`;
}

fs.writeFileSync(path.join(__dirname, '..', 'IMAGE_REMOVAL_CANDIDATES.md'), md);
console.log('IMAGE_REMOVAL_CANDIDATES.md written successfully.');
