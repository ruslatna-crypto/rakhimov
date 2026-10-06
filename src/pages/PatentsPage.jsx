import React, { useState, useMemo } from 'react';
import { Search, Award, RotateCcw } from 'lucide-react';
import patents from '../data/patents.json';
import { useLanguage } from '../context/LanguageContext';
import '../styles/pages.css';

export default function PatentsPage() {
  const [query, setQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const { lang, t } = useLanguage();

  const countryCounts = useMemo(() => {
    let uz = 0;
    let ussr = 0;
    let eapo = 0;
    let intl = 0;
    patents.forEach((p) => {
      const c = p.country;
      if (c === 'Узбекистан') uz++;
      else if (c === 'СССР') ussr++;
      else if (c === 'ЕАПО') eapo++;
      else intl++;
    });
    return { all: patents.length, uz, ussr, eapo, intl };
  }, []);

  const filteredPatents = useMemo(() => {
    return patents.filter((p) => {
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        (p.number && p.number.toLowerCase().includes(q)) ||
        (p.number_en && p.number_en.toLowerCase().includes(q)) ||
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.title_en && p.title_en.toLowerCase().includes(q)) ||
        (p.authors && p.authors.toLowerCase().includes(q)) ||
        (p.authors_en && p.authors_en.toLowerCase().includes(q)) ||
        (p.country && p.country.toLowerCase().includes(q)) ||
        (p.country_en && p.country_en.toLowerCase().includes(q)) ||
        (p.details && p.details.toLowerCase().includes(q)) ||
        (p.details_en && p.details_en.toLowerCase().includes(q));

      const matchCountry =
        selectedCountry === 'ALL' ||
        (selectedCountry === 'UZ' && p.country === 'Узбекистан') ||
        (selectedCountry === 'USSR' && p.country === 'СССР') ||
        (selectedCountry === 'EAPO' && p.country === 'ЕАПО') ||
        (selectedCountry === 'INTL' &&
          (p.country === 'США' ||
            p.country.includes('EPO') ||
            p.country === 'Турция' ||
            p.country === 'Эстония' ||
            p.country === 'Международный'));

      return matchQuery && matchCountry;
    });
  }, [query, selectedCountry]);

  const hasActiveFilters = selectedCountry !== 'ALL' || query.trim() !== '';

  const resetFilters = () => {
    setSelectedCountry('ALL');
    setQuery('');
  };

  return (
    <div>
      {/* Page Hero */}
      <section
        className="page-hero patents-page-hero"
        style={{
          backgroundImage: "linear-gradient(90deg, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.70) 42%, rgba(15, 23, 42, 0.20) 72%, rgba(15, 23, 42, 0.05) 100%), url('/images/fon_pat.png')",
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
            <span style={{ color: '#38bdf8' }}>{t('pub_patents')}</span>
          </div>
          <h1 className="page-hero-title" style={{ color: '#ffffff', textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)', marginBottom: '12px' }}>
            {lang === 'en' ? 'Patents & Certificates of Authorship' : 'Патенты и авторские свидетельства'}
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
              ? `Complete register of ${patents.length} intellectual property objects: USSR author certificates, patents of the Republic of Uzbekistan, USA, EAPO, Europe (EPO), Turkey, and Estonia.`
              : `Полный реестр ${patents.length} охраноспособных объектов интеллектуальной собственности: авторские свидетельства СССР, патенты Республики Узбекистан, США, ЕАПО, Европы (EPO), Турции и Эстонии.`}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-wrapper">
        <div className="container">
          <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', color: '#0f172a' }}>
            {lang === 'en' ? 'Catalog of Intellectual Property' : 'Каталог объектов интеллектуальной собственности'}
          </h2>
          {/* Search & Filters */}
          <div className="articles-filter-panel">
            <div className="articles-search-wrap">
              <input
                type="text"
                placeholder={t('search_patents_placeholder')}
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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div className="articles-category-buttons">
                <button
                  type="button"
                  className={`filter-btn ${selectedCountry === 'ALL' ? 'active' : ''}`}
                  onClick={() => setSelectedCountry('ALL')}
                >
                  <span>{lang === 'en' ? 'All' : 'Все'}</span>
                  <span className="filter-btn-count">({countryCounts.all})</span>
                </button>
                <button
                  type="button"
                  className={`filter-btn ${selectedCountry === 'UZ' ? 'active' : ''}`}
                  onClick={() => setSelectedCountry('UZ')}
                >
                  <span>{lang === 'en' ? 'Uzbekistan' : 'Узбекистан'}</span>
                  <span className="filter-btn-count">({countryCounts.uz})</span>
                </button>
                <button
                  type="button"
                  className={`filter-btn ${selectedCountry === 'USSR' ? 'active' : ''}`}
                  onClick={() => setSelectedCountry('USSR')}
                >
                  <span>{lang === 'en' ? 'USSR AS' : 'СССР (АС)'}</span>
                  <span className="filter-btn-count">({countryCounts.ussr})</span>
                </button>
                <button
                  type="button"
                  className={`filter-btn ${selectedCountry === 'EAPO' ? 'active' : ''}`}
                  onClick={() => setSelectedCountry('EAPO')}
                >
                  <span>{lang === 'en' ? 'Eurasian (EAPO)' : 'ЕАПО'}</span>
                  <span className="filter-btn-count">({countryCounts.eapo})</span>
                </button>
                <button
                  type="button"
                  className={`filter-btn ${selectedCountry === 'INTL' ? 'active' : ''}`}
                  onClick={() => setSelectedCountry('INTL')}
                >
                  <span>{lang === 'en' ? 'International (USA, EPO...)' : 'Зарубежные (США, EPO...)'}</span>
                  <span className="filter-btn-count">({countryCounts.intl})</span>
                </button>
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

          <div style={{ marginBottom: '16px', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            {lang === 'en' ? `Found: ${filteredPatents.length} patents` : `Найдено патентов: ${filteredPatents.length}`}
          </div>

          {/* Patents Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
            {filteredPatents.map((pat) => (
              <div
                key={pat.id}
                className="data-card patent-card"
                style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'stretch'
                }}
              >
                {/* Small Document Cover / Thumbnail */}
                <div style={{ flexShrink: 0, paddingTop: '2px' }}>
                  <div
                    style={{
                      width: '62px',
                      height: '88px',
                      borderRadius: '7px',
                      overflow: 'hidden',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
                      background: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <img
                      src={`/images/patent/${pat.image || 'uzb.jpg'}`}
                      alt={lang === 'en' && pat.number_en ? pat.number_en : pat.number}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Patent Details */}
                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span className="badge badge-amber" style={{ fontSize: '0.8125rem', whiteSpace: 'normal', lineHeight: 1.3 }}>
                      {lang === 'en' && pat.number_en ? pat.number_en : pat.number}
                    </span>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                      <span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>
                        {lang === 'en' && pat.country_en ? pat.country_en : pat.country}
                      </span>
                      {pat.year && (
                        <span className="badge" style={{ background: '#e0f2fe', color: '#0369a1' }}>
                          {pat.year}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.0625rem', marginBottom: '8px', lineHeight: 1.45, flexGrow: 1, color: '#0f172a' }}>
                    {lang === 'en' && pat.title_en ? pat.title_en : pat.title}
                  </h3>

                  <div style={{ fontSize: '0.84375rem', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                    <strong style={{ color: '#334155' }}>{lang === 'en' ? 'Authors: ' : 'Авторы: '}</strong>
                    {lang === 'en' && pat.authors_en ? pat.authors_en : pat.authors}
                  </div>

                  <div style={{ fontSize: '0.78125rem', color: '#64748b', fontStyle: 'italic', marginBottom: '10px', lineHeight: 1.4 }}>
                    {lang === 'en' && pat.details_en ? pat.details_en : pat.details}
                  </div>

                  <div
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--color-text-muted)',
                      borderTop: '1px solid var(--color-border)',
                      paddingTop: '8px',
                      marginTop: 'auto',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <strong style={{ color: '#475569' }}>ID:</strong> {pat.id}
                    </div>
                    <div style={{ color: '#0284c7', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                      <Award size={14} />
                      <span>{lang === 'en' && pat.type_en ? pat.type_en : pat.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredPatents.length === 0 && (
              <div
                style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '60px 20px',
                  background: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.0625rem', marginBottom: '16px' }}>
                  {lang === 'en' ? 'No patents found matching your query.' : 'По вашему запросу патентов не найдено.'}
                </p>
                <button
                  type="button"
                  className="filter-btn"
                  onClick={resetFilters}
                  style={{ margin: '0 auto' }}
                >
                  <RotateCcw size={15} />
                  <span>{lang === 'en' ? 'Show all patents' : 'Показать все патенты'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
