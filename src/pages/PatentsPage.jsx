import React, { useState, useMemo } from 'react';
import { Search, Award, ShieldCheck } from 'lucide-react';
import patents from '../data/patents.json';
import '../styles/pages.css';

export default function PatentsPage() {
  const [query, setQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('ALL');

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
            <span>Публикации</span>
            <span style={{ color: '#64748b' }}>/</span>
            <span style={{ color: '#38bdf8' }}>Патенты</span>
          </div>
          <h1 className="page-hero-title">Патенты и авторские свидетельства</h1>
          <p className="page-hero-lead">
            Полный реестр 73 охраноспособных объектов интеллектуальной собственности: авторские свидетельства СССР, патенты Республики Узбекистан, США, ЕАПО, Европы (EPO) и Турции.
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
                placeholder="Поиск по номеру патента, названию или ведомству..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
              />
              <Search size={18} className="search-icon" />
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`btn ${selectedCountry === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSelectedCountry('ALL')}
              >
                Все ({patents.length})
              </button>
              <button
                type="button"
                className={`btn ${selectedCountry === 'UZ' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSelectedCountry('UZ')}
              >
                Узбекистан (25)
              </button>
              <button
                type="button"
                className={`btn ${selectedCountry === 'USSR' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSelectedCountry('USSR')}
              >
                СССР (17)
              </button>
              <button
                type="button"
                className={`btn ${selectedCountry === 'EAPO' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSelectedCountry('EAPO')}
              >
                ЕАПО (7)
              </button>
              <button
                type="button"
                className={`btn ${selectedCountry === 'INTL' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSelectedCountry('INTL')}
              >
                Зарубежные (USA / EPO / TR) (24)
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '14px', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Найдено патентов: <strong>{filteredPatents.length}</strong> из {patents.length}
          </div>

          {/* Patents Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {filteredPatents.map((pat) => (
              <div
                key={pat.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="badge badge-blue">{pat.id}</span>
                  <span className="badge badge-amber">{pat.country}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary-dark)', fontWeight: '700', fontSize: '0.9375rem', marginBottom: '8px' }}>
                  <ShieldCheck size={18} />
                  <span>{pat.number}</span>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                  {pat.type}
                </div>

                <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-main)', lineHeight: '1.5', flexGrow: 1 }}>
                  {pat.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
