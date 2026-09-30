import React, { useState, useMemo } from 'react';
import { Search, FileText } from 'lucide-react';
import articles from '../data/articles.json';
import { useLanguage } from '../context/LanguageContext';
import '../styles/pages.css';

export default function ArticlesPage() {
  const [query, setQuery] = useState('');
  const [selectedJournal, setSelectedJournal] = useState('ALL');
  const { lang, t } = useLanguage();

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchQuery =
        !query ||
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.authors.toLowerCase().includes(query.toLowerCase()) ||
        a.journal.toLowerCase().includes(query.toLowerCase()) ||
        a.year.includes(query);

      const matchJournal =
        selectedJournal === 'ALL' ||
        (selectedJournal === 'CN' && a.journal.includes('Comp')) ||
        (selectedJournal === 'GELIO' && (a.journal.includes('Гелио') || a.journal.includes('Solar'))) ||
        (selectedJournal === 'MED' && (a.journal.includes('медицин') || a.journal.includes('STOMAT') || a.journal.includes('клинич')));

      return matchQuery && matchJournal;
    });
  }, [query, selectedJournal]);

  return (
    <div>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.8125rem', marginBottom: '14px' }}>
            <span>{t('nav_publications')}</span>
            <span style={{ color: '#64748b' }}>/</span>
            <span style={{ color: '#38bdf8' }}>{t('pub_articles')}</span>
          </div>
          <h1 className="page-hero-title">
            {lang === 'en' ? 'Scientific Articles & Publications' : 'Научные статьи и публикации'}
          </h1>
          <p className="page-hero-lead">
            {lang === 'en' 
              ? 'Complete register of 136 scientific publications by Professor R.Kh. Rakhimov in domestic and international peer-reviewed journals (2000–2024).'
              : 'Полный реестр 136 научных публикаций профессора Р.Х. Рахимова в отечественных и международных рецензируемых журналах (2000–2024 гг.).'}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-wrapper">
        <div className="container">
          {/* Search & Filters */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <div style={{ flex: '1 1 320px', position: 'relative' }}>
              <input
                type="text"
                placeholder={t('search_articles_placeholder')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
              />
              <Search size={18} className="search-icon" />
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                className={`filter-btn ${selectedJournal === 'ALL' ? 'active' : ''}`}
                onClick={() => setSelectedJournal('ALL')}
              >
                {lang === 'en' ? 'All (136)' : 'Все (136)'}
              </button>
              <button
                className={`filter-btn ${selectedJournal === 'CN' ? 'active' : ''}`}
                onClick={() => setSelectedJournal('CN')}
              >
                Computational Nanotechnology
              </button>
              <button
                className={`filter-btn ${selectedJournal === 'GELIO' ? 'active' : ''}`}
                onClick={() => setSelectedJournal('GELIO')}
              >
                {lang === 'en' ? 'Applied Solar Energy / Gelio' : 'Гелиотехника'}
              </button>
              <button
                className={`filter-btn ${selectedJournal === 'MED' ? 'active' : ''}`}
                onClick={() => setSelectedJournal('MED')}
              >
                {lang === 'en' ? 'Medicine & Therapy' : 'Медицина и терапия'}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '16px', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            {lang === 'en' ? `Found: ${filteredArticles.length} publications` : `Найдено публикаций: ${filteredArticles.length}`}
          </div>

          {/* Articles List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredArticles.map((art) => (
              <div key={art.id} className="data-card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '10px', borderRadius: 'var(--radius-md)', flexShrink: 0 }}>
                  <FileText size={20} />
                </div>
                <div style={{ flex: '1 1 auto' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                    <span className="badge badge-blue">{art.id}</span>
                    <span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>{art.year}</span>
                  </div>
                  <h3 style={{ fontSize: '1.0625rem', marginBottom: '8px', lineHeight: 1.4 }}>
                    {art.title}
                  </h3>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                    <strong>{lang === 'en' ? 'Authors: ' : 'Авторы: '}</strong>{art.authors}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#0284c7', fontStyle: 'italic' }}>
                    {art.journal}
                  </div>
                </div>
              </div>
            ))}

            {filteredArticles.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: 'var(--radius-lg)' }}>
                <p style={{ color: 'var(--color-text-muted)' }}>
                  {lang === 'en' ? 'No publications found matching your query.' : 'По вашему запросу статей не найдено.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
