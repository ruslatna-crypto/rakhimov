import developments from '../data/developments.json';
import articles from '../data/articles.json';
import patents from '../data/patents.json';
import books from '../data/books.json';
import akts from '../data/akts.json';
import lampCertificates from '../data/lampCertificates.json';
import lampPdfs from '../data/lampPdfs.json';
import sushkaCertificates from '../data/sushkaCertificates.json';
import internationalConferences from '../data/conferences/internationalConferences.json';
import infraR2000Conferences from '../data/conferences/infraR2000.json';
import republicanConferences from '../data/conferences/republicanConferences.json';

// Статические страницы портала
const pages = [
  {
    id: 'PAGE-HOME',
    category: 'pages',
    title: 'Главная страница — Портал профессора Рахимова Р.Х.',
    subtitle: 'Портал профессора Рахимова Рустама Хакимовича',
    description: 'Инновационные гелиотехнологии, функциональная керамика, импульсная туннельная сушка, солнечные печи БСП и биомедицина.',
    url: '/',
    badge: 'Портал'
  },
  {
    id: 'PAGE-AUTHOR',
    category: 'pages',
    title: 'Об авторе — Рахимов Рустам Хакимович',
    subtitle: 'Доктор технических наук, профессор, академик РАЕ',
    description: 'Биография, научная деятельность, руководство лабораторией №1 «Материалы полупроводниковой гелиоэнергетики» ИМВ АН РУз «Физика-Солнце», награды и достижения.',
    url: '/autor',
    badge: 'Биография'
  },
  {
    id: 'PAGE-CONTACTS',
    category: 'pages',
    title: 'Контакты лаборатории',
    subtitle: 'Институт Материаловедения АН РУз (Ташкент)',
    description: 'Связаться с профессором Рахимовым Р.Х. Адрес: Узбекистан, Ташкент, Чингиз Айтматов, 2Б. Email: rustam-shsul@yandex.com',
    url: '/#contacts',
    badge: 'Контакты'
  },
  {
    id: 'PAGE-CONFERENCES',
    category: 'pages',
    title: 'Конференции — Портал профессора Рахимова Р.Х.',
    subtitle: 'Международные и республиканские конференции',
    description: 'Материалы докладов и труды международных конференций, конференции Infra R 2000 и республиканских конференций профессора Рахимова Р.Х.',
    url: '/conference',
    badge: 'Конференции'
  }
];

// Преобразуем разработки в единый формат
const formattedDevelopments = developments.map((dev) => ({
  id: `DEV-${dev.slug.toUpperCase()}`,
  category: 'developments',
  title: dev.title,
  subtitle: 'Научно-техническая разработка',
  description: `${dev.lead || ''} ${Array.isArray(dev.full_text) ? dev.full_text.join(' ') : (dev.full_text || '')} ${dev.lead_en || ''} ${Array.isArray(dev.full_text_en) ? dev.full_text_en.join(' ') : (dev.full_text_en || '')}`,
  url: `/${dev.slug}`,
  badge: 'Разработка',
  iconType: 'lightbulb'
}));

// Преобразуем статьи
const formattedArticles = articles.map((art) => ({
  id: art.id,
  category: 'articles',
  title: art.title,
  title_en: art.title_en || art.title,
  subtitle: `${art.authors || ''} (${art.year || ''})`,
  description: `${art.journal || ''} ${art.journal_en || ''}. Авторы: ${art.authors || ''} ${art.authors_en || ''}. ${art.title_en || ''} Год публикации: ${art.year || ''}.`,
  url: '/stat',
  badge: `Статья ${art.year || ''}`,
  year: art.year,
  authors: art.authors,
  authors_en: art.authors_en,
  journal: art.journal,
  journal_en: art.journal_en,
  iconType: 'fileText'
}));

// Преобразуем патенты
const formattedPatents = patents.map((pat) => ({
  id: pat.id,
  category: 'patents',
  title: `${pat.number || ''} ${pat.title ? '— ' + pat.title : ''}`,
  subtitle: `${pat.type || 'Патент'} (${pat.country || ''})`,
  description: `${pat.title || ''} ${pat.title_en || ''}. ${pat.number || ''} ${pat.number_en || ''}, Страна: ${pat.country || ''} (${pat.country_en || ''}), Раздел: ${pat.section || ''}`,
  url: '/patents',
  badge: pat.country || 'Патент',
  iconType: 'award'
}));

// Преобразуем книги
const formattedBooks = books.map((bk, idx) => ({
  id: bk.id,
  category: 'books',
  title: bk.title ? bk.title : `Монография ${bk.id}`,
  subtitle: `Автор: ${bk.author || 'Рахимов Р.Х.'}`,
  description: `${bk.description || ''} Фундаментальная монография профессора Рахимова Р.Х. Доступна электронная версия для скачивания на Яндекс.Диске.`,
  url: '/book',
  externalUrl: bk.yandex_disk_url,
  badge: 'Монография',
  iconType: 'book'
}));

// Преобразуем акты
const formattedAkts = akts.map((akt) => ({
  id: akt.id,
  category: 'akts',
  title: akt.title,
  subtitle: akt.organization || 'Акт внедрения',
  description: `${akt.full_text || ''} ${akt.organization || ''} ${akt.title_en || ''} ${akt.organization_en || ''}`,
  url: '/akt',
  externalUrl: akt.google_drive_url,
  badge: 'Акт внедрения',
  iconType: 'fileCheck'
}));

// Сертификаты и акты ламп
const formattedLampCertificates = lampCertificates.map((cert) => ({
  id: `LAMP-CERT-${cert.id}`,
  category: 'akts',
  title: cert.title,
  subtitle: cert.category || 'Медицинские излучатели',
  description: `${cert.title} ${cert.title_en || ''} ${cert.category} ${cert.category_en || ''} Керамические лампы и излучатели`,
  url: '/lamp',
  badge: cert.category || 'Акт испытаний',
  iconType: 'fileCheck'
}));

// PDF-документы и отчеты по лампам
const formattedLampPdfs = lampPdfs.map((pdf) => ({
  id: `LAMP-PDF-${pdf.id}`,
  category: 'akts',
  title: pdf.title,
  subtitle: `${pdf.category} (${pdf.sizeMb})`,
  description: `${pdf.title} ${pdf.title_en || ''} ${pdf.category} ${pdf.category_en || ''} Отчет об испытаниях медицинских излучателей`,
  url: '/lamp',
  externalUrl: pdf.url,
  badge: 'PDF Отчет',
  iconType: 'fileText'
}));

// Акты испытаний и заключения сушилок
const formattedSushkaCertificates = sushkaCertificates.map((cert) => ({
  id: `SUSHKA-CERT-${cert.id}`,
  category: 'akts',
  title: cert.title,
  subtitle: cert.category || 'Сушка овощей и фруктов',
  description: `${cert.title} ${cert.title_en || ''} ${cert.category} ${cert.category_en || ''} ${cert.org || ''} ${cert.description || ''} Сушильные установки и сушка`,
  url: '/sushka',
  badge: cert.category || 'Акт испытаний',
  iconType: 'fileCheck'
}));

// Преобразуем конференции в единый поисковый формат
const formattedConferences = [
  ...internationalConferences.map((conf) => ({
    id: conf.id,
    category: 'articles',
    title: conf.title,
    title_en: conf.title_en || conf.title,
    subtitle: `${conf.authors || ''} (${conf.year || ''})`,
    description: `Международная конференция. International conference. ${conf.source || ''} ${conf.source_en || ''}. Авторы: ${conf.authors || ''} ${conf.authors_en || ''}. ${conf.title_en || ''}`,
    url: '/conference',
    badge: `Конференция ${conf.year || ''}`,
    year: conf.year,
    authors: conf.authors,
    authors_en: conf.authors_en,
    journal: conf.source,
    journal_en: conf.source_en,
    iconType: 'fileText'
  })),
  ...infraR2000Conferences.map((conf) => ({
    id: conf.id,
    category: 'articles',
    title: conf.title,
    title_en: conf.title_en || conf.title,
    subtitle: `${conf.authors || ''} (2000)`,
    description: `Международная конференция Infra R. International conference Infra R. ${conf.source || ''} ${conf.source_en || ''}. Авторы: ${conf.authors || ''} ${conf.authors_en || ''}. ${conf.title_en || ''}`,
    url: '/conference',
    badge: 'Infra R',
    year: '2000',
    authors: conf.authors,
    authors_en: conf.authors_en,
    journal: conf.source,
    journal_en: conf.source_en,
    iconType: 'fileText'
  })),
  ...republicanConferences.map((conf) => ({
    id: conf.id,
    category: 'articles',
    title: conf.title,
    title_en: conf.title_en || conf.title,
    subtitle: `${conf.authors || ''} (${conf.year || ''})`,
    description: `Республиканская конференция. Republican conference. ${conf.source || ''} ${conf.source_en || ''}. Авторы: ${conf.authors || ''} ${conf.authors_en || ''}. ${conf.title_en || ''}`,
    url: '/conference',
    badge: `РК ${conf.year || ''}`,
    year: conf.year,
    authors: conf.authors,
    authors_en: conf.authors_en,
    journal: conf.source,
    journal_en: conf.source_en,
    iconType: 'fileText'
  }))
];

// Единый индекс всех материалов
export const allSearchableItems = [
  ...pages,
  ...formattedDevelopments,
  ...formattedArticles,
  ...formattedConferences,
  ...formattedPatents,
  ...formattedBooks,
  ...formattedAkts,
  ...formattedLampCertificates,
  ...formattedLampPdfs,
  ...formattedSushkaCertificates
];

/**
 * Поиск по сайту с взвешенным ранжированием
 * @param {string} query Поисковый запрос
 * @param {string} category Категория ('all' | 'developments' | 'articles' | 'patents' | 'books' | 'akts' | 'pages')
 * @returns {Array} Список отсортированных результатов
 */
export function searchContent(query, category = 'all') {
  if (!query || !query.trim()) {
    if (category === 'all') {
      // При пустом запросе можно показать основные разделы и популярные разработки
      return allSearchableItems.filter((i) => i.category === 'pages' || i.category === 'developments');
    }
    return allSearchableItems.filter((i) => i.category === category).slice(0, 20);
  }

  const cleanQuery = query.trim().toLowerCase();
  const terms = cleanQuery.split(/\s+/).filter((t) => t.length > 0);

  const matched = [];

  for (const item of allSearchableItems) {
    if (category !== 'all' && item.category !== category) {
      continue;
    }

    const titleStr = (item.title || '').toLowerCase();
    const subtitleStr = (item.subtitle || '').toLowerCase();
    const descStr = (item.description || '').toLowerCase();
    const idStr = (item.id || '').toLowerCase();
    const authorsStr = (item.authors || '').toLowerCase();
    const fullSearchHaystack = `${titleStr} ${subtitleStr} ${descStr} ${idStr} ${authorsStr}`;

    // Проверяем, чтобы все слова запроса содержались в элементе (или хотя бы часть)
    let matchCount = 0;
    let score = 0;

    for (const term of terms) {
      if (fullSearchHaystack.includes(term)) {
        matchCount++;

        // Точное совпадение в заголовке
        if (titleStr === term) {
          score += 200;
        } else if (titleStr.startsWith(term)) {
          score += 120;
        } else if (titleStr.includes(term)) {
          score += 70;
        }

        // Совпадение в номере/ID
        if (idStr.includes(term)) {
          score += 80;
        }

        // Совпадение в подзаголовке / авторах
        if (subtitleStr.includes(term) || authorsStr.includes(term)) {
          score += 40;
        }

        // Совпадение в тексте
        if (descStr.includes(term)) {
          score += 15;
        }
      }
    }

    // Если все слова найдены (или если одно слово и найдено)
    if (matchCount === terms.length && matchCount > 0) {
      // Дополнительный бонус за разработки и ключевые страницы для удобства пользователей
      if (item.category === 'developments') score += 10;
      if (item.category === 'pages') score += 5;

      matched.push({
        ...item,
        score
      });
    }
  }

  // Сортировка по весу релевантности (сначала наиболее релевантные)
  matched.sort((a, b) => b.score - a.score);

  return matched;
}
