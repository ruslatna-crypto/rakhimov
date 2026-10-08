import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Search, 
  Globe, 
  Award, 
  FileText, 
  Calendar, 
  RotateCcw, 
  ExternalLink, 
  ChevronDown
} from 'lucide-react';
import internationalConferences from '../data/conferences/internationalConferences.json';
import infraR2000Conferences from '../data/conferences/infraR2000.json';
import republicanConferences from '../data/conferences/republicanConferences.json';
import { useLanguage } from '../context/LanguageContext';
import '../styles/pages.css';

// Helper to render source text with clickable external URLs
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

// Single publication card component
function ConferenceCard({ item, sectionType, lang }) {
  const isInt = sectionType === 'international';
  const isInfra = sectionType === 'infra';

  const iconClass = isInt ? 'int' : isInfra ? 'infra' : 'rep';
  const IconComponent = isInt ? Globe : isInfra ? Award : FileText;

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
          {isInt && (
            <span className="badge" style={{ background: '#e0f2fe', color: '#0369a1' }}>
              {lang === 'en' ? 'International' : 'Международная'}
            </span>
          )}
          {isInfra && (
            <span className="badge" style={{ background: '#fef3c7', color: '#b45309' }}>
              Infra R
            </span>
          )}
          {!isInt && !isInfra && (
            <span className="badge" style={{ background: '#dcfce7', color: '#15803d' }}>
              {lang === 'en' ? 'Republican' : 'Республиканская'}
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

        {/* Bibliographic Source / Conference Details (under the word author) */}
        <div style={{ fontSize: '0.84375rem', color: '#475569', lineHeight: 1.5, wordBreak: 'break-word' }}>
          {renderSourceWithLinks((lang === 'en' && item.source_en) ? item.source_en : item.source)}
        </div>

        {/* Extra Note / DOI buttons if present */}
        {(item.doi || item.extra) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px', alignItems: 'center' }}>
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
            {item.extra && (
              <span className="conference-extra-badge">
                {item.extra}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Conference() {
  const { lang, t } = useLanguage();
  const location = useLocation();

  const [query, setQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('ALL'); // 'ALL' | 'INT' | 'INFRA' | 'REP'
  const [selectedYear, setSelectedYear] = useState('ALL');

  // Handle hash scrolling on page load or navigation (e.g. /conference#infra2000)
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

  // Combine and sort all distinct years descending
  const availableYears = useMemo(() => {
    const yearsSet = new Set();
    internationalConferences.forEach((c) => c.year && yearsSet.add(c.year));
    infraR2000Conferences.forEach((c) => c.year && yearsSet.add(c.year));
    republicanConferences.forEach((c) => c.year && yearsSet.add(c.year));
    return Array.from(yearsSet).sort((a, b) => Number(b) - Number(a));
  }, []);

  // Pre-calculate count of records per year
  const yearCounts = useMemo(() => {
    const map = {};
    const all = [...internationalConferences, ...infraR2000Conferences, ...republicanConferences];
    all.forEach((c) => {
      if (c.year) {
        map[c.year] = (map[c.year] || 0) + 1;
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
        item.source.toLowerCase().includes(q) ||
        (item.source_en && item.source_en.toLowerCase().includes(q)) ||
        (item.year && item.year.includes(q)) ||
        (item.extra && item.extra.toLowerCase().includes(q));

      const matchYear = selectedYear === 'ALL' || item.year === selectedYear;

      return matchQuery && matchYear;
    };
  }, [query, selectedYear]);

  // Filtered lists for each section
  const filteredInternational = useMemo(() => {
    return internationalConferences.filter(filterPredicate);
  }, [filterPredicate]);

  const filteredInfra = useMemo(() => {
    return infraR2000Conferences.filter(filterPredicate);
  }, [filterPredicate]);

  const filteredRepublican = useMemo(() => {
    return republicanConferences.filter(filterPredicate);
  }, [filterPredicate]);

  const totalFilteredCount = filteredInternational.length + filteredInfra.length + filteredRepublican.length;
  const totalAllCount = internationalConferences.length + infraR2000Conferences.length + republicanConferences.length;

  const hasActiveFilters = selectedSection !== 'ALL' || selectedYear !== 'ALL' || query.trim() !== '';

  const resetFilters = () => {
    setQuery('');
    setSelectedSection('ALL');
    setSelectedYear('ALL');
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
        className="page-hero conference-page-hero"
        style={{
          backgroundImage: "linear-gradient(90deg, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.70) 42%, rgba(15, 23, 42, 0.20) 72%, rgba(15, 23, 42, 0.05) 100%), url('/images/conference.webp')",
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
            <span style={{ color: '#38bdf8' }}>{t('pub_conferences')}</span>
          </div>

          <h1 
            className="page-hero-title" 
            style={{ 
              color: '#ffffff', 
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)', 
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.02em'
            }}
          >
            {t('conf_title')}
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
            {t('conf_hero_lead')}
          </p>

          {/* Quick Stats Badges */}
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
              <span>{lang === 'en' ? 'International' : 'Международные'}: <strong>{internationalConferences.length}</strong></span>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('infra2000')}
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
              <Award size={14} color="#fbbf24" />
              <span>Infra R: <strong>{infraR2000Conferences.length}</strong></span>
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
              <span>{lang === 'en' ? 'Republican' : 'Республиканские'}: <strong>{republicanConferences.length}</strong></span>
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
                placeholder={t('conf_search_placeholder')}
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

            {/* Section Filter Buttons */}
            <div className="articles-category-buttons">
              <button
                type="button"
                className={`filter-btn ${selectedSection === 'ALL' ? 'active' : ''}`}
                onClick={() => setSelectedSection('ALL')}
              >
                <span>{t('conf_tab_all')}</span>
                <span className="filter-btn-count">({totalAllCount})</span>
              </button>

              <button
                type="button"
                className={`filter-btn ${selectedSection === 'INT' ? 'active' : ''}`}
                onClick={() => setSelectedSection('INT')}
              >
                <span>{t('conf_sec_international')}</span>
                <span className="filter-btn-count">({internationalConferences.length})</span>
              </button>

              <button
                type="button"
                className={`filter-btn ${selectedSection === 'INFRA' ? 'active' : ''}`}
                onClick={() => setSelectedSection('INFRA')}
              >
                <span>{t('conf_sec_infra')}</span>
                <span className="filter-btn-count">({infraR2000Conferences.length})</span>
              </button>

              <button
                type="button"
                className={`filter-btn ${selectedSection === 'REP' ? 'active' : ''}`}
                onClick={() => setSelectedSection('REP')}
              >
                <span>{t('conf_sec_republican')}</span>
                <span className="filter-btn-count">({republicanConferences.length})</span>
              </button>
            </div>

            {/* Year Selector & Reset Button */}
            <div className="articles-year-row">
              <div className="year-selector-group">
                <label htmlFor="conf-year-select" className="year-selector-label">
                  <Calendar size={16} />
                  <span>{t('conf_filter_year')}</span>
                </label>
                <div className="year-select-wrapper">
                  <select
                    id="conf-year-select"
                    className="year-filter-select"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <option value="ALL">{t('conf_all_years')}</option>
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
                  title={t('conf_reset_filters')}
                >
                  <RotateCcw size={14} />
                  <span>{t('conf_reset_filters')}</span>
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
              {t('conf_found_count')}{' '}
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
                {t('conf_no_results')}
              </p>
              <button
                type="button"
                className="filter-btn"
                onClick={resetFilters}
                style={{ margin: '0 auto' }}
              >
                <RotateCcw size={15} />
                <span>{t('conf_show_all')}</span>
              </button>
            </div>
          )}

          {/* ================================================================
              РАЗДЕЛ 1: «Международные конференции»
              ================================================================ */}
          {(selectedSection === 'ALL' || selectedSection === 'INT') && filteredInternational.length > 0 && (
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
                    {t('conf_sec_international')}
                  </h2>
                  <span className="conference-section-count">
                    {filteredInternational.length}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredInternational.map((item) => (
                  <ConferenceCard
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
              РАЗДЕЛ 2: «Международная конференция "Infra R 2000"»
              ================================================================ */}
          {(selectedSection === 'ALL' || selectedSection === 'INFRA') && filteredInfra.length > 0 && (
            <section id="infra2000" className="conference-section">
              <div className="conference-section-header">
                <div className="conference-section-title-wrap">
                  <div 
                    style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '8px', 
                      background: '#fef3c7', 
                      color: '#d97706', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}
                  >
                    <Award size={20} />
                  </div>
                  <h2 className="conference-section-title">
                    {t('conf_sec_infra')}
                  </h2>
                  <span className="conference-section-count" style={{ background: '#fef3c7', color: '#b45309' }}>
                    {filteredInfra.length}
                  </span>
                </div>
              </div>

              <p className="conference-section-desc">
                {t('conf_infra_desc')}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredInfra.map((item) => (
                  <ConferenceCard
                    key={item.id}
                    item={item}
                    sectionType="infra"
                    lang={lang}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ================================================================
              РАЗДЕЛ 3: «Республиканские конференции»
              ================================================================ */}
          {(selectedSection === 'ALL' || selectedSection === 'REP') && filteredRepublican.length > 0 && (
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
                    {t('conf_sec_republican')}
                  </h2>
                  <span className="conference-section-count" style={{ background: '#dcfce7', color: '#15803d' }}>
                    {filteredRepublican.length}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredRepublican.map((item) => (
                  <ConferenceCard
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
