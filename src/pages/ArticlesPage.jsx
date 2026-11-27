import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Search, 
  Globe, 
  FileText, 
  Calendar, 
  RotateCcw, 
  ExternalLink, 
  ChevronDown,
  ArrowUpDown
} from 'lucide-react';
import internationalArticles from '../data/articles/internationalArticles.json';
import republicanArticles from '../data/articles/republicanArticles.json';
import { useLanguage } from '../context/LanguageContext';
import { sortItems, SORT_OPTIONS } from '../utils/sorting';
import '../styles/pages.css';

// Helper to render source/journal text with clickable external URLs
function renderSourceWithLinks(sourceText) {
  if (!sourceText) return null;
  const urlRegex = /(https?:\/\/[^\s<>"'()]+)/g;
  const parts = sourceText.split(urlRegex);

  return parts.map((part, index) => {
    if (part.startsWith('http://') || part.startsWith('https://')) {
      let cleanUrl = part;
      let trailingPunct = '';
      while (cleanUrl && /[.,;:)\]]$/.test(cleanUrl)) {
        trailingPunct = cleanUrl.slice(-1) + trailingPunct;
        cleanUrl = cleanUrl.slice(0, -1);
      }
      return (
        <React.Fragment key={index}>
          <a
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="conference-link"
            title={cleanUrl}
            onClick={(e) => e.stopPropagation()}
          >
            {cleanUrl}
          </a>
          {trailingPunct}
        </React.Fragment>
      );
    }
    return part;
  });
}

// Single publication card component matching /conference design
function ArticleCard({ item, sectionType, lang }) {
  const isInt = sectionType === 'international';
  const iconClass = isInt ? 'int' : 'rep';
  const IconComponent = isInt ? Globe : FileText;

  // Filter out redundant links that duplicate DOI or ROI
  const extraLinks = (item.links || []).filter((l) => {
    if (!l) return false;
    if (item.doi && l.includes(item.doi)) return false;
    if (item.roi && l.includes(item.roi)) return false;
    return true;
  });

  return (
    <div className="data-card" style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
      <div className={`conference-card-icon ${iconClass}`} aria-hidden="true">
        <IconComponent size={22} />
      </div>

      <div style={{ flex: '1 1 auto', minWidth: 0 }}>
        {/* Badges: ID + Year + Section */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
          <span className="badge badge-blue">{item.id}</span>
          {item.year && (
            <span className="badge" style={{ background: '#f1f5f9', color: '#475569', fontWeight: 600 }}>
              {item.year}
            </span>
          )}
          {isInt ? (
            <span className="badge" style={{ background: '#e0f2fe', color: '#0369a1' }}>
              {lang === 'en' ? 'International Article' : 'Международная статья'}
            </span>
          ) : (
            <span className="badge" style={{ background: '#dcfce7', color: '#15803d' }}>
              {lang === 'en' ? 'Republican Article' : 'Республиканская статья'}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1.0625rem', marginBottom: '8px', lineHeight: 1.45, color: '#0f172a' }}>
          {(lang === 'en' && item.title_en) ? item.title_en : item.title}
        </h3>

        {/* Authors */}
        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
          <strong style={{ color: '#334155' }}>
            {lang === 'en' ? 'Authors: ' : 'Авторы: '}
          </strong>
          <span>{(lang === 'en' && item.authors_en) ? item.authors_en : item.authors}</span>
        </div>

        {/* Bibliographic Source / Journal */}
        <div style={{ fontSize: '0.84375rem', color: '#475569', lineHeight: 1.5, wordBreak: 'break-word' }}>
          {renderSourceWithLinks((lang === 'en' && item.journal_en) ? item.journal_en : item.journal)}
        </div>

        {/* Identifiers and Links: DOI, EDN, ISSN, ROI, Extra Links */}
        {(item.doi || item.edn || item.issn || item.roi || extraLinks.length > 0) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px', alignItems: 'center' }}>
            {item.doi && (
              <a
                href={`https://doi.org/${item.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="conference-doi-tag"
                title={`DOI: ${item.doi}`}
              >
                <ExternalLink size={12} />
                <span>DOI: {item.doi}</span>
              </a>
            )}
            {item.edn && (
              <span className="conference-extra-badge" title={`EDN: ${item.edn}`}>
                EDN: {item.edn}
              </span>
            )}
            {item.issn && (
              <span className="conference-extra-badge" title={`ISSN: ${item.issn}`}>
                ISSN: {item.issn}
              </span>
            )}
            {item.roi && (
              <a
                href={item.roi.startsWith('http') ? item.roi : `https://${item.roi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="conference-doi-tag"
                title={`ROI: ${item.roi}`}
              >
                <ExternalLink size={12} />
                <span>ROI: {item.roi.replace(/^https?:\/\//, '')}</span>
              </a>
            )}
            {extraLinks.map((link, idx) => (
              <a
                key={idx}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="conference-doi-tag"
                title={link}
              >
                <ExternalLink size={12} />
                <span>{lang === 'en' ? 'Article Link' : 'Ссылка на статью'}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ArticlesPage() {
  const { lang, t } = useLanguage();
  const location = useLocation();

  const [query, setQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('ALL'); // 'ALL' | 'INT' | 'REP'
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('NEWEST');

  // Total publication counts
  const totalAllCount = internationalArticles.length + republicanArticles.length;

  // Handle hash scrolling on page load or navigation (e.g. /stat#international, /stat#republican)
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location.hash]);

  // Combine and sort all distinct years descending across both datasets
  const availableYears = useMemo(() => {
    const yearsSet = new Set();
    internationalArticles.forEach((a) => a.year && yearsSet.add(a.year));
    republicanArticles.forEach((a) => a.year && yearsSet.add(a.year));
    return Array.from(yearsSet).sort((a, b) => Number(b) - Number(a));
  }, []);

  // Pre-calculate count of records per year
  const yearCounts = useMemo(() => {
    const map = {};
    const all = [...internationalArticles, ...republicanArticles];
    all.forEach((a) => {
      if (a.year) {
        map[a.year] = (map[a.year] || 0) + 1;
      }
    });
    return map;
  }, []);

  // Filter predicate
  const filterPredicate = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (item) => {
      const matchQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        (item.title_en && item.title_en.toLowerCase().includes(q)) ||
        item.authors.toLowerCase().includes(q) ||
        (item.authors_en && item.authors_en.toLowerCase().includes(q)) ||
        item.journal.toLowerCase().includes(q) ||
        (item.journal_en && item.journal_en.toLowerCase().includes(q)) ||
        (item.year && item.year.includes(q)) ||
        (item.doi && item.doi.toLowerCase().includes(q)) ||
        (item.edn && item.edn.toLowerCase().includes(q)) ||
        (item.issn && item.issn.toLowerCase().includes(q)) ||
        (item.roi && item.roi.toLowerCase().includes(q));

      const matchYear = selectedYear === 'ALL' || item.year === selectedYear;

      return matchQuery && matchYear;
    };
  }, [query, selectedYear]);

  // Filtered lists for each section
  const filteredInternational = useMemo(() => {
    return internationalArticles.filter(filterPredicate);
  }, [filterPredicate]);

  const filteredRepublican = useMemo(() => {
    return republicanArticles.filter(filterPredicate);
  }, [filterPredicate]);

  // Sorted lists for each section (applies 1 of 5 sort modes; stable for equal keys)
  const sortedInternational = useMemo(() => {
    return sortItems(filteredInternational, sortOrder, lang);
  }, [filteredInternational, sortOrder, lang]);

  const sortedRepublican = useMemo(() => {
    return sortItems(filteredRepublican, sortOrder, lang);
  }, [filteredRepublican, sortOrder, lang]);

  const totalFilteredCount = sortedInternational.length + sortedRepublican.length;

  const hasActiveFilters =
    selectedSection !== 'ALL' || selectedYear !== 'ALL' || query.trim() !== '' || sortOrder !== 'NEWEST';

  const resetFilters = () => {
    setQuery('');
    setSelectedSection('ALL');
    setSelectedYear('ALL');
    setSortOrder('NEWEST');
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
          {/* Breadcrumb pill */}
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

          <h1 
            className="page-hero-title" 
            style={{ 
              color: '#ffffff', 
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)', 
              marginBottom: '12px' 
            }}
          >
            {lang === 'en' ? 'Scientific Articles & Publications' : 'Научные статьи и публикации'}
          </h1>

          <p
            className="page-hero-lead"
            style={{
              color: '#e2e8f0',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.6)',
              maxWidth: '780px',
              lineHeight: 1.6,
              margin: 0
            }}
          >
            {lang === 'en'
              ? `Complete register of ${totalAllCount} scientific publications by Professor R.Kh. Rakhimov in peer-reviewed journals (${internationalArticles.length} international and ${republicanArticles.length} republican, 1975–2026).`
              : `Полный реестр ${totalAllCount} научных публикаций профессора Р.Х. Рахимова в рецензируемых журналах (${internationalArticles.length} международных и ${republicanArticles.length} республиканских, 1975–2026 гг.).`}
          </p>

          {/* Quick Stats Badges with anchors */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => scrollToSection('international')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: 'var(--radius-full)',
                padding: '6px 14px',
                fontSize: '0.8125rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Globe size={14} color="#38bdf8" />
              <span>{lang === 'en' ? 'International' : 'Международные'}: <strong>{internationalArticles.length}</strong></span>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('republican')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: 'var(--radius-full)',
                padding: '6px 14px',
                fontSize: '0.8125rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <FileText size={14} color="#4ade80" />
              <span>{lang === 'en' ? 'Republican' : 'Республиканские'}: <strong>{republicanArticles.length}</strong></span>
            </button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section-wrapper">
        <div className="container">
          {/* Filter & Search Panel */}
          <div className="articles-filter-panel">
            {/* Search Input */}
            <div className="articles-search-wrap">
              <input
                type="text"
                placeholder={lang === 'en' ? 'Search by title, author, journal, year, DOI, EDN...' : 'Поиск по названию статьи, автору, журналу, году, DOI, EDN...'}
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

            {/* Section Filter Buttons (Все / Международные / Республиканские) */}
            <div className="articles-category-buttons">
              <button
                type="button"
                className={`filter-btn ${selectedSection === 'ALL' ? 'active' : ''}`}
                onClick={() => setSelectedSection('ALL')}
              >
                <span>{lang === 'en' ? 'All' : 'Все'}</span>
                <span className="filter-btn-count">({totalAllCount})</span>
              </button>

              <button
                type="button"
                className={`filter-btn ${selectedSection === 'INT' ? 'active' : ''}`}
                onClick={() => setSelectedSection('INT')}
              >
                <span>{lang === 'en' ? 'International Articles' : 'Международные статьи'}</span>
                <span className="filter-btn-count">({internationalArticles.length})</span>
              </button>

              <button
                type="button"
                className={`filter-btn ${selectedSection === 'REP' ? 'active' : ''}`}
                onClick={() => setSelectedSection('REP')}
              >
                <span>{lang === 'en' ? 'Republican Articles' : 'Республиканские статьи'}</span>
                <span className="filter-btn-count">({republicanArticles.length})</span>
              </button>
            </div>

            {/* Year Selector, Sort Selector & Reset Button */}
            <div className="articles-year-row">
              <div className="articles-controls-group">
                <div className="year-selector-group">
                  <label htmlFor="art-year-select" className="year-selector-label">
                    <Calendar size={16} />
                    <span>{lang === 'en' ? 'Filter by year:' : 'Выбор по годам:'}</span>
                  </label>
                  <div className="year-select-wrapper">
                    <select
                      id="art-year-select"
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

                <div className="sort-selector-group">
                  <label htmlFor="art-sort-select" className="sort-selector-label">
                    <ArrowUpDown size={16} />
                    <span>{lang === 'en' ? 'Sort:' : 'Сортировка:'}</span>
                  </label>
                  <div className="sort-select-wrapper">
                    <select
                      id="art-sort-select"
                      className="sort-filter-select"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {lang === 'en' ? opt.labelEn : opt.labelRu}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="sort-select-chevron" />
                  </div>
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

          {/* Results Summary Bar */}
          <div 
            style={{ 
              marginBottom: '24px', 
              fontSize: '0.9375rem', 
              color: 'var(--color-text-muted)', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              flexWrap: 'wrap', 
              gap: '8px' 
            }}
          >
            <div>
              {lang === 'en' ? 'Found publications: ' : 'Найдено публикаций: '}
              <strong style={{ color: '#0f172a' }}>{totalFilteredCount}</strong>
              {selectedYear !== 'ALL' && (
                <span style={{ marginLeft: '6px', fontWeight: 600, color: 'var(--color-primary)' }}>
                  ({selectedYear} {lang === 'en' ? 'year' : 'год'})
                </span>
              )}
            </div>
          </div>

          {/* Global Empty State */}
          {totalFilteredCount === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                marginBottom: '40px'
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

          {/* ================================================================
              РАЗДЕЛ 1: «Международные статьи» (187)
              ================================================================ */}
          {(selectedSection === 'ALL' || selectedSection === 'INT') && sortedInternational.length > 0 && (
            <section id="international" className="conference-section">
              <div className="conference-section-header">
                <div className="conference-section-title-wrap">
                  <div 
                    style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '8px', 
                      background: '#e0f2fe', 
                      color: '#0284c7', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}
                  >
                    <Globe size={20} />
                  </div>
                  <h2 className="conference-section-title">
                    {lang === 'en' ? 'International Articles' : 'Международные статьи'}
                  </h2>
                  <span className="conference-section-count">
                    {sortedInternational.length}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {sortedInternational.map((item) => (
                  <ArticleCard
                    key={item.id}
                    item={item}
                    sectionType="international"
                    lang={lang}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ================================================================
              РАЗДЕЛ 2: «Республиканские статьи» (26)
              ================================================================ */}
          {(selectedSection === 'ALL' || selectedSection === 'REP') && sortedRepublican.length > 0 && (
            <section id="republican" className="conference-section">
              <div className="conference-section-header">
                <div className="conference-section-title-wrap">
                  <div 
                    style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '8px', 
                      background: '#dcfce7', 
                      color: '#059669', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}
                  >
                    <FileText size={20} />
                  </div>
                  <h2 className="conference-section-title">
                    {lang === 'en' ? 'Republican Articles' : 'Республиканские статьи'}
                  </h2>
                  <span className="conference-section-count" style={{ background: '#dcfce7', color: '#15803d' }}>
                    {sortedRepublican.length}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {sortedRepublican.map((item) => (
                  <ArticleCard
                    key={item.id}
                    item={item}
                    sectionType="republican"
                    lang={lang}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </div>
  );
}
