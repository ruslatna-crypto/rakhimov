import internationalArticles from '../data/articles/internationalArticles.json';
import republicanArticles from '../data/articles/republicanArticles.json';
import patents from '../data/patents.json';
import akts from '../data/akts.json';
import developments from '../data/developments.json';
import books from '../data/books.json';
import internationalConferences from '../data/conferences/internationalConferences.json';
import infraR2000Conferences from '../data/conferences/infraR2000.json';
import republicanConferences from '../data/conferences/republicanConferences.json';

/**
 * Единый источник количественных показателей портала rakhimovr.uz
 * Все числа вычисляются строго автоматически на основе фактических баз данных (JSON).
 * Использование Set гарантирует исключение возможного дублирования записей по ID.
 */

// 1. Статьи
const uniqueArticleIds = new Set([
  ...internationalArticles.map(a => a.id),
  ...republicanArticles.map(a => a.id)
]);
const articlesInternational = new Set(internationalArticles.map(a => a.id)).size;
const articlesRepublican = new Set(republicanArticles.map(a => a.id)).size;
const articlesTotal = uniqueArticleIds.size;

// 2. Патенты
const uniquePatentIds = new Set(patents.map(p => p.id));
const patentsTotal = uniquePatentIds.size;
const patentsUz = patents.filter(p => p.country === 'Узбекистан').length;
const patentsUssr = patents.filter(p => p.country === 'СССР').length;
const patentsEapo = patents.filter(p => p.country === 'ЕАПО').length;
const patentsIntl = patents.filter(p => !['Узбекистан', 'СССР', 'ЕАПО'].includes(p.country)).length;

// 3. Акты внедрения и испытаний
const uniqueAktIds = new Set(akts.map(a => a.id));
const aktsTotal = uniqueAktIds.size;

// 4. Научные разработки
const developmentsTotal = developments.length;

// 5. Монографии и книги
const uniqueBookIds = new Set(books.map(b => b.id));
const booksTotal = uniqueBookIds.size;
const monographsTotal = books.filter(b => 
  (b.category && (b.category.includes('МОНОГРАФИЯ') || b.category.includes('ФУНДАМЕНТАЛЬНЫЙ ТРУД') || b.category.includes('НАУЧНЫЙ ТРУД'))) ||
  (b.id && parseInt(b.id.replace(/\D+/g, ''), 10) <= 9)
).length;

// 6. Конференции
const uniqueConferenceIds = new Set([
  ...internationalConferences.map(c => c.id),
  ...infraR2000Conferences.map(c => c.id),
  ...republicanConferences.map(c => c.id)
]);
const conferencesTotal = uniqueConferenceIds.size;
const conferencesInternational = internationalConferences.length;
const conferencesInfra = infraR2000Conferences.length;
const conferencesRepublican = republicanConferences.length;

export const stats = {
  articles: {
    total: articlesTotal,
    all: articlesTotal,
    international: articlesInternational,
    republican: articlesRepublican
  },
  patents: {
    total: patentsTotal,
    all: patentsTotal,
    uz: patentsUz,
    ussr: patentsUssr,
    eapo: patentsEapo,
    intl: patentsIntl
  },
  akts: {
    total: aktsTotal,
    all: aktsTotal
  },
  developments: {
    total: developmentsTotal,
    all: developmentsTotal
  },
  books: {
    total: booksTotal,
    all: booksTotal,
    monographs: monographsTotal
  },
  conferences: {
    total: conferencesTotal,
    all: conferencesTotal,
    international: conferencesInternational,
    infraR2000: conferencesInfra,
    republican: conferencesRepublican
  }
};

export default stats;
