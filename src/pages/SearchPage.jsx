import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  X, 
  Lightbulb, 
  FileText, 
  Award, 
  BookOpen, 
  FileCheck, 
  Globe, 
  ArrowRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { searchContent } from '../utils/searchIndex';
import { useLanguage } from '../context/LanguageContext';
import '../styles/pages.css';
import '../styles/search.css';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCat = searchParams.get('cat') || 'all';

  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [results, setResults] = useState([]);

  const { lang, t } = useLanguage();

  const categories = [
    { id: 'all', label: t('search_tab_all') },
    { id: 'developments', label: t('search_tab_dev') },
    { id: 'articles', label: t('search_tab_articles') },
    { id: 'patents', label: t('search_tab_patents') },
    { id: 'books', label: t('search_tab_books') },
    { id: 'akts', label: t('search_tab_akts') },
    { id: 'pages', label: t('search_tab_pages') }
  ];

  const quickSuggestions = [
    { label: lang === 'en' ? 'Drying' : 'Сушка', q: 'сушка' },
    { label: lang === 'en' ? 'Ceramics' : 'Керамика', q: 'керамика' },
    { label: lang === 'en' ? 'Solar Furnace' : 'Солнечная печь', q: 'печь' },
    { label: lang === 'en' ? 'Medical Lamp' : 'Лампа', q: 'лампа' },
    { label: lang === 'en' ? 'Active Calcium' : 'Кальций', q: 'кальций' },
    { label: lang === 'en' ? 'Patents' : 'Патенты', q: 'патент' },
    { label: lang === 'en' ? 'Cotton' : 'Хлопок', q: 'хлопок' }
  ];

  // Синхронизация с URL
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const cat = searchParams.get('cat') || 'all';
    setQuery(q);
    setActiveCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    const res = searchContent(query, activeCategory);
    setResults(res);
  }, [query, activeCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = {};
    if (query) newParams.q = query;
    if (activeCategory !== 'all') newParams.cat = activeCategory;
    setSearchParams(newParams);
  };

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    const newParams = {};
    if (query) newParams.q = query;
    if (catId !== 'all') newParams.cat = catId;
    setSearchParams(newParams);
  };

  const renderIcon = (type) => {
    switch (type) {
      case 'lightbulb':
        return <Lightbulb size={20} className="res-icon icon-dev" />;
      case 'fileText':
        return <FileText size={20} className="res-icon icon-article" />;
      case 'award':
        return <Award size={20} className="res-icon icon-patent" />;
      case 'book':
        return <BookOpen size={20} className="res-icon icon-book" />;
      case 'fileCheck':
        return <FileCheck size={20} className="res-icon icon-akt" />;
      default:
        return <Globe size={20} className="res-icon icon-page" />;
    }
  };

  const highlightMatches = (text, termStr) => {
    if (!text) return '';
    if (!termStr || !termStr.trim()) return text;

    const terms = termStr.trim().split(/\s+/).filter(Boolean);
    const regex = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="search-highlight">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="search-page-wrapper">
      {/* Hero-секция поиска */}
      <section className="page-hero">
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.8125rem', marginBottom: '14px' }}>
            <span>{t('nav_home')}</span>
            <span style={{ color: '#64748b' }}>/</span>
            <span style={{ color: '#38bdf8' }}>{t('search_title')}</span>
          </div>
          <h1 className="page-hero-title">
            {t('search_title')}
          </h1>
          <p className="page-hero-lead">
            {lang === 'en'
              ? 'Fast full-text search across all scientific publications, patents, monographs, and technologies.'
              : 'Быстрый полнотекстовый поиск по всем научным публикациям, патентам, монографиям и технологиям профессора Рахимова Р.Х.'}
          </p>

          {/* Форма поиска */}
          <form onSubmit={handleSearchSubmit} style={{ marginTop: '24px', maxWidth: '640px' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={22} style={{ position: 'absolute', left: '16px', color: '#0284c7' }} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search_modal_placeholder')}
                style={{
                  width: '100%',
                  padding: '14px 44px 14px 48px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  fontSize: '1rem',
                  outline: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => { setQuery(''); setSearchParams({}); }}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94a3b8'
                  }}
                  title="Очистить"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* Основной контент поиска */}
      <section className="section-wrapper" style={{ paddingTop: '28px' }}>
        <div className="container">
          <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', color: '#0f172a' }}>
            {lang === 'en' ? 'Search Results' : 'Результаты поиска'}
          </h2>
          {/* Фильтры категорий */}
          <div className="search-category-tabs" style={{ borderRadius: '12px', marginBottom: '24px', padding: '12px 16px' }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`search-cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Быстрые подсказки */}
          {query.trim() === '' && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '10px' }}>
                <Sparkles size={16} color="var(--color-primary)" />
                <span>{t('search_quick_suggestions')}</span>
              </div>
              <div className="quick-tags-list">
                {quickSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="quick-tag-pill"
                    onClick={() => {
                      setQuery(item.q);
                      setSearchParams({ q: item.q, cat: activeCategory });
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Результаты */}
          {results.length > 0 ? (
            <div>
              <div className="search-results-count-bar" style={{ paddingLeft: 0, marginBottom: '12px' }}>
                <span>{t('search_found_results')} <strong>{results.length}</strong></span>
              </div>
              <div className="search-results-list">
                {results.map((item) => (
                  item.externalUrl && !item.url ? (
                    <a
                      key={item.id}
                      href={item.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="search-result-item"
                      style={{ textDecoration: 'none' }}
                    >
                      <div className="res-icon-wrap">{renderIcon(item.iconType)}</div>
                      <div className="res-content">
                        <div className="res-header-row">
                          <h4 className="res-title">{highlightMatches(item.title, query)}</h4>
                          <span className={`res-badge cat-${item.category}`}>{item.badge}</span>
                        </div>
                        {item.subtitle && <p className="res-subtitle">{highlightMatches(item.subtitle, query)}</p>}
                        {item.description && <p className="res-snippet">{highlightMatches(item.description, query)}</p>}
                      </div>
                      <div className="res-action"><ExternalLink size={18} /></div>
                    </a>
                  ) : (
                    <Link
                      key={item.id}
                      to={item.url || '/'}
                      className="search-result-item"
                      style={{ textDecoration: 'none' }}
                    >
                      <div className="res-icon-wrap">{renderIcon(item.iconType)}</div>
                      <div className="res-content">
                        <div className="res-header-row">
                          <h4 className="res-title">{highlightMatches(item.title, query)}</h4>
                          <span className={`res-badge cat-${item.category}`}>{item.badge}</span>
                        </div>
                        {item.subtitle && <p className="res-subtitle">{highlightMatches(item.subtitle, query)}</p>}
                        {item.description && <p className="res-snippet">{highlightMatches(item.description, query)}</p>}
                      </div>
                      <div className="res-action"><ArrowRight size={18} /></div>
                    </Link>
                  )
                ))}
              </div>
            </div>
          ) : (
            <div className="search-no-results">
              <div className="no-res-icon-wrap">
                <Search size={40} color="#94a3b8" />
              </div>
              <h3 className="no-res-title">
                {t('search_nothing_found')} «{query}»
              </h3>
              <p className="no-res-desc">
                {t('search_try_another')}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
