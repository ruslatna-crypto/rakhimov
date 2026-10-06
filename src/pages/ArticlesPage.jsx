import React, { useState, useMemo } from 'react';
import { Search, FileText, Calendar, ChevronDown, RotateCcw } from 'lucide-react';
import articles from '../data/articles.json';
import { useLanguage } from '../context/LanguageContext';
import '../styles/pages.css';

export default function ArticlesPage() {
  const [query, setQuery] = useState('');
  const [selectedJournal, setSelectedJournal] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const { lang, t } = useLanguage();

  // All distinct years sorted descending (newest first)
  const availableYears = useMemo(() => {
    const yearsSet = new Set(articles.map((a) => a.year));
    return Array.from(yearsSet).sort((a, b) => Number(b) - Number(a));
  }, []);

  // Category counts
  const categoryCounts = useMemo(() => {
    let cn = 0;
    let gelio = 0;
    let med = 0;
    articles.forEach((a) => {
      const jLower = a.journal.toLowerCase();
      if (jLower.includes('comp') || jLower.includes('nanotech')) cn++;
      if (jLower.includes('гелио') || jLower.includes('solar')) gelio++;
      if (
        jLower.includes('медицин') ||
        jLower.includes('stomat') ||
        jLower.includes('клинич') ||
        jLower.includes('терап') ||
        jLower.includes('врач') ||
        jLower.includes('health') ||
        jLower.includes('dermatol') ||
        jLower.includes('endocrine') ||
        jLower.includes('эндокрин')
      ) {
        med++;
      }
    });
    return { all: articles.length, cn, gelio, med };
  }, []);

  // Article count per year
  const yearCounts = useMemo(() => {
    const map = {};
    articles.forEach((a) => {
      map[a.year] = (map[a.year] || 0) + 1;
    });
    return map;
  }, []);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.authors.toLowerCase().includes(q) ||
        a.journal.toLowerCase().includes(q) ||
        a.year.includes(q);

      const jLower = a.journal.toLowerCase();
      const matchJournal =
        selectedJournal === 'ALL' ||
        (selectedJournal === 'CN' && (jLower.includes('comp') || jLower.includes('nanotech'))) ||
        (selectedJournal === 'GELIO' && (jLower.includes('гелио') || jLower.includes('solar'))) ||
        (selectedJournal === 'MED' &&
          (jLower.includes('медицин') ||
            jLower.includes('stomat') ||
            jLower.includes('клинич') ||
            jLower.includes('терап') ||
            jLower.includes('врач') ||
            jLower.includes('health') ||
            jLower.includes('dermatol') ||
            jLower.includes('endocrine') ||
            jLower.includes('эндокрин')));

      const matchYear = selectedYear === 'ALL' || a.year === selectedYear;

      return matchQuery && matchJournal && matchYear;
    });
  }, [query, selectedJournal, selectedYear]);

  const hasActiveFilters = selectedJournal !== 'ALL' || selectedYear !== 'ALL' || query.trim() !== '';

  const resetFilters = () => {
    setSelectedJournal('ALL');
    setSelectedYear('ALL');
    setQuery('');
  };

  return (
    <div>
      {/* Page Hero */}
      <section
        className="page-hero articles-page-hero"
        style={{
          backgroundImage: "linear-gradient(90deg, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.70) 42%, rgba(15, 23, 42, 0.20) 72%, rgba(15, 23, 42, 0.05) 100%), url('/images/fon_stat.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat',
          width: '100%',
          padding: '56px 0',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(4px)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8125rem',
              marginBottom: '14px',
              color: '#ffffff'
            }}
          >
            <span>{t('nav_publications')}</span>
            <span style={{ color: '#94a3b8' }}>/</span>
            <span style={{ color: '#38bdf8' }}>{t('pub_articles')}</span>
          </div>
          <h1 className="page-hero-title" style={{ color: '#ffffff', textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)', marginBottom: '12px' }}>
            {lang === 'en' ? 'Scientific Articles & Publications' : 'Научные статьи и публикации'}
          </h1>
          <p
            className="page-hero-lead"
            style={{
              color: '#e2e8f0',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.6)',
              maxWidth: '740px',
              lineHeight: 1.6,
              margin: 0
            }}
          >
            {lang === 'en'
              ? `Complete register of ${articles.length} scientific publications by Professor R.Kh. Rakhimov in domestic and international peer-reviewed journals (1975–2026).`
              : `Полный реестр ${articles.length} научных публикаций профессора Р.Х. Рахимова в отечественных и международных рецензируемых журналах (1975–2026 гг.).`}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-wrapper">
        <div className="container">
          <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', color: '#0f172a' }}>
            {lang === 'en' ? 'Register of Scientific Publications' : 'Реестр научных публикаций'}
          </h2>
          {/* Search & Filter Panel */}
          <div className="articles-filter-panel">
            {/* Search Input */}
            <div className="articles-search-wrap">
              <input
                type="text"
                placeholder={t('search_articles_placeholder')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
              />
              <Search size={18} className="search-icon" />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="search-clear-btn"
                  title={lang === 'en' ? 'Clear' : 'Очистить'}
                >
                  ✕
                </button>
              )}
            </div>

            {/* 1. Category Buttons (Красивые округленные кнопки) */}
            <div className="articles-category-buttons">
              <button
                type="button"
                className={`filter-btn ${selectedJournal === 'ALL' ? 'active' : ''}`}
                onClick={() => setSelectedJournal('ALL')}
              >
                <span>{lang === 'en' ? 'All' : 'Все'}</span>
                <span className="filter-btn-count">({categoryCounts.all})</span>
              </button>
              <button
                type="button"
                className={`filter-btn ${selectedJournal === 'CN' ? 'active' : ''}`}
                onClick={() => setSelectedJournal('CN')}
              >
                <span>Computational Nanotechnology</span>
                <span className="filter-btn-count">({categoryCounts.cn})</span>
              </button>
              <button
                type="button"
                className={`filter-btn ${selectedJournal === 'GELIO' ? 'active' : ''}`}
                onClick={() => setSelectedJournal('GELIO')}
              >
                <span>{lang === 'en' ? 'Applied Solar Energy / Gelio' : 'Гелиотехника'}</span>
                <span className="filter-btn-count">({categoryCounts.gelio})</span>
              </button>
              <button
                type="button"
                className={`filter-btn ${selectedJournal === 'MED' ? 'active' : ''}`}
                onClick={() => setSelectedJournal('MED')}
              >
                <span>{lang === 'en' ? 'Medicine & Therapy' : 'Медицина и терапия'}</span>
                <span className="filter-btn-count">({categoryCounts.med})</span>
              </button>
            </div>

            {/* 2. Под ними: Выпадающее меню выбора по годам (первым пунктом "Все") */}
            <div className="articles-year-row">
              <div className="year-selector-group">
                <label htmlFor="year-select" className="year-selector-label">
                  <Calendar size={16} />
                  <span>{lang === 'en' ? 'Filter by year:' : 'Выбор по годам:'}</span>
                </label>
                <div className="year-select-wrapper">
                  <select
                    id="year-select"
                    className="year-filter-select"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <option value="ALL">{lang === 'en' ? 'All' : 'Все'}</option>
                    {availableYears.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr} {lang === 'en' ? 'year' : 'год'} ({yearCounts[yr]})
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="year-select-chevron" />
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  className="filter-reset-btn"
                  onClick={resetFilters}
                  title={lang === 'en' ? 'Reset all filters' : 'Сбросить все фильтры'}
                >
                  <RotateCcw size={14} />
                  <span>{lang === 'en' ? 'Reset filters' : 'Сбросить фильтры'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Results count & status */}
          <div style={{ marginBottom: '18px', fontSize: '0.9375rem', color: 'var(--color-text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              {lang === 'en'
                ? `Found publications: ${filteredArticles.length}`
                : `Найдено публикаций: ${filteredArticles.length}`}
              {selectedYear !== 'ALL' && (
                <span style={{ marginLeft: '6px', fontWeight: 600, color: 'var(--color-primary)' }}>
                  ({selectedYear} {lang === 'en' ? 'year' : 'год'})
                </span>
              )}
            </div>
          </div>

          {/* Articles List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredArticles.map((art) => (
              <div key={art.id} className="data-card" style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
                <div
                  style={{
                    background: '#e0f2fe',
                    color: '#0284c7',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FileText size={22} />
                </div>
                <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span className="badge badge-blue">{art.id}</span>
                    <span className="badge" style={{ background: '#f1f5f9', color: '#475569', fontWeight: 600 }}>
                      {art.year}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.0625rem', marginBottom: '8px', lineHeight: 1.45, color: '#0f172a' }}>
                    {art.title}
                  </h3>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                    <strong style={{ color: '#334155' }}>{lang === 'en' ? 'Authors: ' : 'Авторы: '}</strong>
                    {art.authors}
                  </div>
                  <div style={{ fontSize: '0.84375rem', color: '#0284c7', fontStyle: 'italic', wordBreak: 'break-word' }}>
                    {art.journal}
                  </div>
                </div>
              </div>
            ))}

            {filteredArticles.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  background: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.0625rem', marginBottom: '16px' }}>
                  {lang === 'en'
                    ? 'No publications found matching your filter criteria.'
                    : 'По вашему запросу статей не найдено.'}
                </p>
                <button
                  type="button"
                  className="filter-btn"
                  onClick={resetFilters}
                  style={{ margin: '0 auto' }}
                >
                  <RotateCcw size={15} />
                  <span>{lang === 'en' ? 'Show all publications' : 'Показать все публикации'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
