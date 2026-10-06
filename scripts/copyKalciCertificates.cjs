const fs = require('fs');
const path = require('path');

const srcDir = 'g:\\Сайт на GitHub Rakhimov\\кальций\\сертиф';
const destDir = path.join(__dirname, '..', 'public', 'images', 'kalci_certificates');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Map documents to clean web filenames and metadata
const documentsDef = [
  {
    id: 1,
    title: 'Анализ кальция',
    title_en: 'Calcium Quantitative Analysis',
    category: 'Протокол испытаний',
    category_en: 'Test Protocol',
    files: ['Анализ кальция 1.JPG']
  },
  {
    id: 2,
    title: 'Экспертное заключение Казахской академии питания',
    title_en: 'Expert Conclusion of the Kazakh Academy of Nutrition',
    category: 'Экспертное заключение',
    category_en: 'Expert Conclusion',
    files: [
      'Заключение. Академия питания.JPG',
      'Заключение. Академия питания1.JPG',
      'Заключение. Академия питания2.JPG'
    ]
  },
  {
    id: 3,
    title: 'Заключение НИИ медицинской реабилитации и физиотерапии',
    title_en: 'Conclusion of the Research Institute of Medical Rehabilitation and Physiotherapy',
    category: 'Заключение',
    category_en: 'Conclusion',
    files: ['Заключение. НИИ МР и ФТ.jpg']
  },
  {
    id: 4,
    title: 'Токсиколого-гигиеническая оценка препарата',
    title_en: 'Toxicological and Hygienic Assessment of the Preparation',
    category: 'Экспертное заключение',
    category_en: 'Expert Conclusion',
    files: [
      'Заключение. токсиколого-гигиенический оценка.jpg',
      'Заключение. токсиколого-гигиенический оценка1.jpg'
    ]
  },
  {
    id: 5,
    title: 'Отчет о клинических испытаниях (НИИ Гематологии и переливания крови)',
    title_en: 'Clinical Trial Report (Research Institute of Hematology)',
    category: 'Клинический отчет',
    category_en: 'Clinical Report',
    files: ['НИИ Гематологии.JPG']
  },
  {
    id: 6,
    title: 'Отзыв о клиническом применении (НИИ Акушерства и гинекологии, этап 1)',
    title_en: 'Clinical Evaluation Report (Research Institute of Obstetrics and Gynecology, Phase 1)',
    category: 'Отзыв',
    category_en: 'Review',
    files: [
      'Отзыв Акушерства и гинекологии 1 01.jpg',
      'Отзыв Акушерства и гинекологии 1 02.jpg'
    ]
  },
  {
    id: 7,
    title: 'Отзыв о клиническом применении (НИИ Акушерства и гинекологии, этап 2)',
    title_en: 'Clinical Evaluation Report (Research Institute of Obstetrics and Gynecology, Phase 2)',
    category: 'Отзыв',
    category_en: 'Review',
    files: [
      'Отзыв Акушерства и гинекологии 2 01.JPG',
      'Отзыв Акушерства и гинекологии 2 02.JPG'
    ]
  },
  {
    id: 8,
    title: 'Отзыв о применении препарата (Медицинская Академия)',
    title_en: 'Review of "Active Calcium" Application (Medical Academy)',
    category: 'Отзыв',
    category_en: 'Review',
    files: ['Отзыв Медицинская Академия.JPG']
  },
  {
    id: 9,
    title: 'Заключение по клинической апробации (НИИ Акушерства и гинекологии)',
    title_en: 'Conclusion on Clinical Approbation (Research Institute of Obstetrics and Gynecology)',
    category: 'Заключение',
    category_en: 'Conclusion',
    files: ['Отзыв НИИ Акушерства и гинекологии.JPG']
  },
  {
    id: 10,
    title: 'Отзыв о клинических испытаниях (Республиканский перинатальный центр)',
    title_en: 'Clinical Trial Evaluation (Republican Perinatal Center)',
    category: 'Отзыв',
    category_en: 'Review',
    files: [
      'Отзыв Перинатальный 1.JPG',
      'Отзыв Перинатальный 2.JPG'
    ]
  },
  {
    id: 11,
    title: 'Отчет по клинической апробации (Республиканский научный центр кардиологии)',
    title_en: 'Clinical Approbation Report (Republican Scientific Center of Cardiology)',
    category: 'Клинический отчет',
    category_en: 'Clinical Report',
    files: [
      'Отчет по клинической апробации. Центр кардиологии 1.jpg',
      'Отчет по клинической апробации. Центр кардиологии 2.jpg'
    ]
  },
  {
    id: 12,
    title: 'Результаты токсикологических исследований (Главное санитарно-эпидемиологическое управление)',
    title_en: 'Toxicological Evaluation Results (Main Sanitary-Epidemiological Dept.)',
    category: 'Акт исследований',
    category_en: 'Research Act',
    files: ['Результаты токсикологических исследований ГСЭН.jpg']
  },
  {
    id: 13,
    title: 'Токсикологическое заключение (Республиканская СЭС)',
    title_en: 'Toxicological Conclusion (Republican Sanitary-Epidemiological Station)',
    category: 'Заключение',
    category_en: 'Conclusion',
    files: ['Результаты токсикологических исследований РСЭС.JPG']
  },
  {
    id: 14,
    title: 'Рецензия на клиническое применение (Городской родильный комплекс №3)',
    title_en: 'Clinical Application Review (City Maternity Complex No. 3)',
    category: 'Рецензия',
    category_en: 'Review',
    files: [
      'Рецензия 3 роддом 01.JPG',
      'Рецензия 3 роддом 02.JPG'
    ]
  }
];

const resultCerts = [];

let fileIndex = 1;

for (const doc of documentsDef) {
  const pages = [];
  doc.files.forEach((originalName, pageIdx) => {
    const srcFile = path.join(srcDir, originalName);
    const ext = path.extname(originalName).toLowerCase() || '.jpg';
    const destName = `cert_ca_${String(fileIndex).padStart(2, '0')}${ext}`;
    const destFile = path.join(destDir, destName);
    
    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, destFile);
      console.log(`Copied ${originalName} -> ${destName}`);
    } else {
      console.error(`File not found: ${srcFile}`);
    }
    
    pages.push(`/images/kalci_certificates/${destName}`);
    fileIndex++;
  });

  resultCerts.push({
    id: doc.id,
    title: doc.title,
    title_en: doc.title_en,
    category: doc.category,
    category_en: doc.category_en,
    pageCount: pages.length,
    cover: pages[0],
    pages: pages
  });
}

const jsonPath = path.join(__dirname, '..', 'src', 'data', 'kalciCertificates.json');
fs.writeFileSync(jsonPath, JSON.stringify(resultCerts, null, 2), 'utf8');
console.log(`Successfully generated ${resultCerts.length} certificates in ${jsonPath}`);
