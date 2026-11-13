/**
 * Utility functions and constants for publication sorting across /stat and /conference.
 */

export const SORT_MODES = {
  NEWEST: 'NEWEST',
  OLDEST: 'OLDEST',
  TITLE_ASC: 'TITLE_ASC',
  TITLE_DESC: 'TITLE_DESC',
  AUTHOR: 'AUTHOR'
};

export const SORT_OPTIONS = [
  { value: 'NEWEST', labelRu: 'Сначала новые (по году)', labelEn: 'Newest first (by year)' },
  { value: 'OLDEST', labelRu: 'Сначала ранние (по году)', labelEn: 'Oldest first (by year)' },
  { value: 'TITLE_ASC', labelRu: 'По названию (А-Я)', labelEn: 'Title (A–Z)' },
  { value: 'TITLE_DESC', labelRu: 'По названию (Я-А)', labelEn: 'Title (Z–A)' },
  { value: 'AUTHOR', labelRu: 'По автору', labelEn: 'Author' }
];

/**
 * Extracts the first author's surname from a publication authors string.
 * Handles formats: "Рахимов Р.Х.", "Р.Х. Рахимов", "R.Kh. Rakhimov", "Rakhimov R.Kh.", etc.
 */
export function extractFirstAuthorSurname(authorsStr) {
  if (!authorsStr || typeof authorsStr !== 'string') return '';
  let first = authorsStr.split(/[,;]/)[0].trim();
  first = first.replace(/^(dr|prof|mr|mrs|ms|акад|проф|докт|доц)\.?\s+/i, '');
  first = first.replace(/^[0-9.\s]+/, '').trim();
  const tokens = first.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return '';
  if (tokens.length === 1) return tokens[0].replace(/[.,]/g, '');

  const nonInitials = tokens.filter((t) => !t.includes('.') && t.length > 2);
  if (nonInitials.length > 0) {
    if (!tokens[0].includes('.') && tokens[0].length > 2) {
      return tokens[0].replace(/[.,]/g, '');
    }
    return nonInitials[nonInitials.length - 1].replace(/[.,]/g, '');
  }
  const sorted = [...tokens].sort((a, b) => b.length - a.length);
  return sorted[0].replace(/[.,]/g, '');
}

/**
 * Strips leading quotes, punctuation, or brackets for clean alphabetical comparison.
 */
export function cleanSortTitle(s) {
  return (s || '').replace(/^[\s"'«»„“\(\)\[\]]+/, '').trim();
}

/**
 * Sorts a list of publications according to the specified sortOrder and language.
 * Guarantees stable sort: when sort keys are equal, preserves the original relative order.
 */
export function sortItems(list, sortOrder = 'NEWEST', lang = 'ru') {
  if (!Array.isArray(list) || list.length <= 1) return list;

  const locale = lang === 'en' ? 'en' : 'ru';
  // Decorate with original index for guaranteed stable sort across all JS environments
  const decorated = list.map((item, index) => ({ item, index }));

  decorated.sort((a, b) => {
    let diff = 0;

    if (sortOrder === 'NEWEST') {
      const yA = parseInt(a.item.year, 10) || 0;
      const yB = parseInt(b.item.year, 10) || 0;
      diff = yB - yA;
    } else if (sortOrder === 'OLDEST') {
      const yA = parseInt(a.item.year, 10) || 0;
      const yB = parseInt(b.item.year, 10) || 0;
      diff = yA - yB;
    } else if (sortOrder === 'TITLE_ASC') {
      const titleA = cleanSortTitle((lang === 'en' && a.item.title_en) ? a.item.title_en : a.item.title);
      const titleB = cleanSortTitle((lang === 'en' && b.item.title_en) ? b.item.title_en : b.item.title);
      diff = titleA.localeCompare(titleB, locale, { numeric: true });
    } else if (sortOrder === 'TITLE_DESC') {
      const titleA = cleanSortTitle((lang === 'en' && a.item.title_en) ? a.item.title_en : a.item.title);
      const titleB = cleanSortTitle((lang === 'en' && b.item.title_en) ? b.item.title_en : b.item.title);
      diff = titleB.localeCompare(titleA, locale, { numeric: true });
    } else if (sortOrder === 'AUTHOR') {
      const authStrA = (lang === 'en' && a.item.authors_en) ? a.item.authors_en : a.item.authors;
      const authStrB = (lang === 'en' && b.item.authors_en) ? b.item.authors_en : b.item.authors;
      const sA = extractFirstAuthorSurname(authStrA);
      const sB = extractFirstAuthorSurname(authStrB);
      diff = sA.localeCompare(sB, locale, { numeric: true });
    }

    if (diff !== 0) return diff;
    return a.index - b.index;
  });

  return decorated.map((d) => d.item);
}
