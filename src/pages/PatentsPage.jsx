import React, { useState, useMemo } from 'react';
import { Search, Award } from 'lucide-react';
import patents from '../data/patents.json';
import { useLanguage } from '../context/LanguageContext';
import '../styles/pages.css';

export default function PatentsPage() {
  const [query, setQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const { lang, t } = useLanguage();

  const filteredPatents = useMemo(() => {
    return patents.filter((p) => {
      const matchQuery =
        !query ||
        p.number.toLowerCase().includes(query.toLowerCase()) ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.country.toLowerCase().includes(query.toLowerCase());

      const matchCountry =
        selectedCountry === 'ALL' ||
        (selectedCountry === 'USSR' && p.country.includes('СССР')) ||
        (selectedCountry === 'UZ' && p.country.includes('Узбекистан')) ||
        (selectedCountry === 'EAPO' && p.country.includes('ЕАПО')) ||
        (selectedCountry === 'INTL' && (p.country.includes('США') || p.country.includes('EPO') || p.country.includes('Турция')));

      return matchQuery && matchCountry;
    });
  }, [query, selectedCountry]);

  return (
    <div>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.8125rem', marginBottom: '14px' }}>
            <span>{t('nav_publications')}</span>
            <span style={{ color: '#64748b' }}>/</span>
            <span style={{ color: '#38bdf8' }}>{t('pub_patents')}</span>
          </div>
          <h1 className="page-hero-title">
            {lang === 'en' ? 'Patents & Certificates of Authorship' : 'Патенты и авторские свидетельства'}
          </h1>
          <p className="page-hero-lead">
            {lang === 'en'
              ? 'Complete register of 73 intellectual property objects: USSR author certificates, patents of the Republic of Uzbekistan, USA, EAPO, Europe (EPO), and Turkey.'
              : 'Полный реестр 73 охраноспособных объектов интеллектуальной собственности: авторские свидетельства СССР, патенты Республики Узбекистан, США, ЕАПО, Европы (EPO) и Турции.'}
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
                placeholder={t('search_patents_placeholder')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
              />
              <Search size={18} className="search-icon" />
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                className={`filter-btn ${selectedCountry === 'ALL' ? 'active' : ''}`}
                onClick={() => setSelectedCountry('ALL')}
              >
                {lang === 'en' ? 'All (73)' : 'Все (73)'}
              </button>
              <button
                className={`filter-btn ${selectedCountry === 'UZ' ? 'active' : ''}`}
                onClick={() => setSelectedCountry('UZ')}
              >
                {lang === 'en' ? 'Uzbekistan' : 'Узбекистан'}
              </button>
              <button
                className={`filter-btn ${selectedCountry === 'USSR' ? 'active' : ''}`}
                onClick={() => setSelectedCountry('USSR')}
              >
                {lang === 'en' ? 'USSR AS' : 'СССР (АС)'}
              </button>
              <button
                className={`filter-btn ${selectedCountry === 'EAPO' ? 'active' : ''}`}
                onClick={() => setSelectedCountry('EAPO')}
              >
                {lang === 'en' ? 'Eurasian (EAPO)' : 'ЕАПО'}
              </button>
              <button
                className={`filter-btn ${selectedCountry === 'INTL' ? 'active' : ''}`}
                onClick={() => setSelectedCountry('INTL')}
              >
                {lang === 'en' ? 'International (USA, EPO)' : 'Зарубежные (США, EPO)'}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '16px', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            {lang === 'en' ? `Found: ${filteredPatents.length} patents` : `Найдено патентов: ${filteredPatents.length}`}
          </div>

          {/* Patents Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {filteredPatents.map((pat) => (
              <div key={pat.id} className="data-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="badge badge-amber" style={{ fontSize: '0.8125rem' }}>{pat.number}</span>
                  <span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>{pat.country}</span>
                </div>
                
                <h3 style={{ fontSize: '1.0625rem', marginBottom: '12px', lineHeight: 1.4, flexGrow: 1 }}>
                  {pat.title}
                </h3>

                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', paddingTop: '10px', marginTop: '12px' }}>
                  <div><strong>ID:</strong> {pat.id}</div>
                  <div><strong>{lang === 'en' ? 'Author: ' : 'Автор: '}</strong>Рахимов Р.Х.</div>
                </div>
              </div>
            ))}

            {filteredPatents.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: 'var(--radius-lg)' }}>
                <p style={{ color: 'var(--color-text-muted)' }}>
                  {lang === 'en' ? 'No patents found matching your query.' : 'По вашему запросу патентов не найдено.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
