const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const SRC_DIR = path.join(ROOT_DIR, 'src');

// 1. Gather all codebase files to search usages
function getAllFiles(dir, extensions) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, extensions));
    } else {
      if (!extensions || extensions.some(ext => file.endsWith(ext))) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

const codeFiles = [
  path.join(ROOT_DIR, 'index.html'),
  ...getAllFiles(SRC_DIR, ['.js', '.jsx', '.json', '.css'])
];

const codeContents = codeFiles.map(file => ({
  file: path.relative(ROOT_DIR, file),
  content: fs.readFileSync(file, 'utf8')
}));

function findUsages(imageRelPath) {
  // imageRelPath like 'images/lamp_certificates/cert_01.jpg' or '/images/...' or 'cert_01.jpg'
  const filename = path.basename(imageRelPath);
  const normalizedRel = imageRelPath.replace(/\\/g, '/');
  const withoutSlash = normalizedRel.startsWith('/') ? normalizedRel.slice(1) : normalizedRel;
  const withSlash = '/' + withoutSlash;

  const foundIn = [];
  for (const item of codeContents) {
    if (
      item.content.includes(withSlash) ||
      item.content.includes(withoutSlash) ||
      item.content.includes(filename)
    ) {
      foundIn.push(item.file);
    }
  }
  return foundIn;
}

// Image extensions
const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg', '.gif'];

function getAllImages(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllImages(fullPath));
    } else {
      const ext = path.extname(file).toLowerCase();
      if (IMAGE_EXTS.includes(ext)) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

function determineType(relPath, filename) {
  const lower = relPath.toLowerCase();
  if (lower.includes('cert') || lower.includes('сертификат') || lower.includes('diplom') || lower.includes('диплом')) {
    return 'сертификат / диплом';
  }
  if (lower.includes('akt') || lower.includes('акт') || lower.includes('protocol') || lower.includes('протокол') || lower.includes('letter')) {
    return 'акт / скан документа';
  }
  if (lower.includes('patent') || lower.includes('патент')) {
    return 'патент';
  }
  if (lower.includes('shem') || lower.includes('схема') || lower.includes('cikl') || lower.includes('process') || lower.includes('etapi')) {
    return 'схема';
  }
  if (lower.includes('spektr') || lower.includes('graf') || lower.includes('chart') || lower.includes('pokaz') || lower.includes('dinamic') || lower.includes('sravneni')) {
    return 'график / сравнительная диаграмма';
  }
  if (lower.includes('slider') || lower.includes('rrh') || lower.includes('author') || lower.includes('portrait')) {
    return 'фотография';
  }
  if (lower.includes('logo') || lower.includes('icon')) {
    return 'логотип / иконка';
  }
  if (lower.includes('fon_')) {
    return 'декоративное изображение';
  }
  if (lower.includes('ustanovka') || lower.includes('astra') || lower.includes('gril') || lower.includes('ks250') || lower.includes('ster_') || lower.includes('infra') || lower.includes('iks')) {
    return 'изображение оборудования';
  }
  return 'обычная иллюстрация';
}

function determineRecommendation(sizeMB, type, isDocument) {
  if (sizeMB < 0.2) {
    return 'Оставить без изменений (размер оптимален, <200 KB)';
  }
  if (isDocument || type.includes('сертификат') || type.includes('акт') || type.includes('патент') || type.includes('документ')) {
    if (sizeMB >= 1.0) {
      return 'Создать crisp WebP-preview (~150–350 KB) для галереи/карточки; оригинал сохранить в исходном качестве для модального окна';
    } else {
      return 'Создать WebP-preview (~80–180 KB) для быстрого рендера; оригинал сохранить для зума';
    }
  }
  if (sizeMB >= 1.0) {
    return 'Создать оптимизированную WebP-версию (q=85–90) с сохранением четкости; оригинал сохранить в резервной структуре';
  }
  return 'Создать WebP-версию (q=85–90) для ускорения загрузки';
}

async function run() {
  const images = getAllImages(PUBLIC_DIR);
  console.log(`Found ${images.length} images in public directory.`);

  const inventory = [];

  for (const imgPath of images) {
    const relToPublic = path.relative(PUBLIC_DIR, imgPath).replace(/\\/g, '/');
    const filename = path.basename(imgPath);
    const stat = fs.statSync(imgPath);
    const sizeBytes = stat.size;
    const sizeKB = (sizeBytes / 1024).toFixed(1);
    const sizeMB = (sizeBytes / (1024 * 1024)).toFixed(2);
    const ext = path.extname(imgPath).toLowerCase();

    let width = null;
    let height = null;

    if (ext !== '.svg') {
      try {
        const meta = await sharp(imgPath).metadata();
        width = meta.width;
        height = meta.height;
      } catch (e) {
        // failed to read metadata
      }
    }

    const usages = findUsages(relToPublic);
    const type = determineType(relToPublic, filename);
    const isDoc = type.includes('сертификат') || type.includes('акт') || type.includes('патент') || type.includes('документ');
    const recommendation = determineRecommendation(parseFloat(sizeMB), type, isDoc);

    inventory.push({
      relPath: relToPublic,
      filename,
      sizeBytes,
      sizeKB: parseFloat(sizeKB),
      sizeMB: parseFloat(sizeMB),
      format: ext.replace('.', '').toUpperCase(),
      width: width || '-',
      height: height || '-',
      usages: usages.length > 0 ? usages.join(', ') : 'Прямых ссылок в коде нет (возможно динамический путь)',
      used: usages.length > 0,
      type,
      recommendation
    });
  }

  // Sort descending by size
  inventory.sort((a, b) => b.sizeBytes - a.sizeBytes);

  // Stats
  const totalImages = inventory.length;
  const imagesOver1MB = inventory.filter(x => x.sizeMB >= 1.0);
  const totalSizeBytes = inventory.reduce((acc, x) => acc + x.sizeBytes, 0);
  const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(2);
  const top1 = inventory[0];
  const avgSizeKB = (totalSizeBytes / totalImages / 1024).toFixed(1);

  console.log(`Total images: ${totalImages}`);
  console.log(`Images > 1MB: ${imagesOver1MB.length}`);
  console.log(`Total size: ${totalSizeMB} MB`);
  console.log(`Largest: ${top1.relPath} (${top1.sizeMB} MB)`);
  console.log(`Average size: ${avgSizeKB} KB`);

  // Write JSON for processing
  fs.writeFileSync(path.join(ROOT_DIR, 'scripts', 'images_inventory.json'), JSON.stringify(inventory, null, 2));

  // Generate markdown table for IMAGE_OPTIMIZATION_PLAN.md
  let md = `# ПЛАН БЕЗОПАСНОЙ ОПТИМИЗАЦИИ ИЗОБРАЖЕНИЙ (IMAGE_OPTIMIZATION_PLAN.md)
**Проект:** Портал профессора Рахимова Р.Х. (\`rakhimov\`)  
**Дата инвентаризации:** 06 октября 2026 г.  
**Рабочая директория:** \`f:\\laragon\\www\\rakhimov\`

---

## 1. Сводная статистика до оптимизации

| Показатель | Значение |
| :--- | :--- |
| **Всего графических файлов** | **${totalImages}** |
| **Файлов размером > 1 MB** | **${imagesOver1MB.length}** |
| **Общий объём графических ресурсов** | **${totalSizeMB} MB** (${(totalSizeBytes / 1024 / 1024 / 1024).toFixed(2)} GB) |
| **Самое тяжёлое изображение** | \`${top1.relPath}\` (**${top1.sizeMB} MB**, ${top1.width}×${top1.height} px) |
| **Средний размер файла** | **${avgSizeKB} KB** |

### Распределение по категориям:
- **Сертификаты, акты, патенты, документы:** ${inventory.filter(x => x.type.includes('сертификат') || x.type.includes('акт') || x.type.includes('патент')).length} шт. (основной объем веса сайта)
- **Схемы, графики, диаграммы:** ${inventory.filter(x => x.type.includes('схема') || x.type.includes('график')).length} шт.
- **Фотографии оборудования и объектов:** ${inventory.filter(x => x.type.includes('оборудования') || x.type.includes('фотография')).length} шт.
- **Служебная графика (логотипы, иконки, фоны):** ${inventory.filter(x => x.type.includes('логотип') || x.type.includes('декоративное')).length} шт.

---

## 2. Безопасная архитектура оптимизации (Strict Safety First)

1. **Неприкосновенность оригиналов:** Ни один оригинал сертификата, акта, патента или документа НЕ удаляется и НЕ пережимается на месте с потерей качества.
2. **Архитектура двойного представления (Two-Tier Delivery):**
   - **Tier 1 (Preview):** Для карточек, сеток каталогов, галерей и списков создаются легковесные превью-копии высокого разрешения (\`-preview.webp\`) с оптимизированной компрессией (сохраняющие идеальную читаемость заголовков, номеров и подписей).
   - **Tier 2 (Original Full-Res):** При клике на карточку, зуме или открытии полноэкранного модального окна открывается исходный оригинальный документ с максимальным архивным качеством.
3. **Изображения без модального зума (слайдер, иллюстрации):** создаются WebP-версии рядом с оригиналами, оригиналы сохраняются.
4. **Неиспользуемые файлы:** Ни один файл не удаляется без прямого утверждения. Создается отдельный документ \`IMAGE_REMOVAL_CANDIDATES.md\`.

---

## 3. Таблица инвентаризации изображений

| Файл | Размер | Формат | Ширина | Высота | Где используется | Тип | Рекомендация |
|---|---:|:---:|---:|---:|---|---|---|
`;

  for (const item of inventory) {
    const sizeStr = item.sizeMB >= 1.0 ? `**${item.sizeMB} MB**` : `${item.sizeKB} KB`;
    md += `| \`${item.relPath}\` | ${sizeStr} | ${item.format} | ${item.width} | ${item.height} | ${item.usages} | ${item.type} | ${item.recommendation} |\n`;
  }

  fs.writeFileSync(path.join(ROOT_DIR, 'IMAGE_OPTIMIZATION_PLAN.md'), md);
  console.log('IMAGE_OPTIMIZATION_PLAN.md created successfully.');
}

run().catch(console.error);
