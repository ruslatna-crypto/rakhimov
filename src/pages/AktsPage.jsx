import React, { useState, useMemo } from 'react';
import { Search, ExternalLink } from 'lucide-react';
import akts from '../data/akts.json';
import { useLanguage } from '../context/LanguageContext';
import '../styles/pages.css';

export default function AktsPage() {
  const [query, setQuery] = useState('');
  const { lang, t } = useLanguage();

  const filteredAkts = useMemo(() => {
    return akts.filter((a) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      const numStr = String(a.num || parseInt(a.id.replace(/\D+/g, ''), 10));
      return (
        numStr === q ||
        a.id.toLowerCase().includes(q) ||
        a.title.toLowerCase().includes(q) ||
        (a.title_en && a.title_en.toLowerCase().includes(q)) ||
        a.organization.toLowerCase().includes(q) ||
        (a.organization_en && a.organization_en.toLowerCase().includes(q)) ||
        a.full_text.toLowerCase().includes(q)
      );
    });
  }, [query]);

  return (
    <div>
      {/* Page Hero */}
      <section
        className="page-hero akts-page-hero"
        style={{
          backgroundImage: "linear-gradient(90deg, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.70) 42%, rgba(15, 23, 42, 0.20) 72%, rgba(15, 23, 42, 0.05) 100%), url('/images/fon_akt.png')",
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
            <span style={{ color: '#38bdf8' }}>{t('pub_akts')}</span>
          </div>
          <h1 className="page-hero-title" style={{ color: '#ffffff', textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)', marginBottom: '12px' }}>
            {lang === 'en' ? 'Implementation Acts & Test Reports' : 'Акты внедрения и отчеты об испытаниях'}
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
              ? 'Register of 57 production test acts, official reports, and clinical conclusions.'
              : 'Реестр 57 актов производственных испытаний, отчетов и клинических заключений.'}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-wrapper">
        <div className="container">
          {/* Search bar */}
          <div style={{ maxWidth: '600px', position: 'relative', marginBottom: '24px' }}>
            <input
              type="text"
              placeholder={t('search_akts_placeholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
            />
            <Search size={18} className="search-icon" />
          </div>

          <div style={{ marginBottom: '14px', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            {lang === 'en' 
              ? <>Found documents: <strong>{filteredAkts.length}</strong> of {akts.length}</>
              : <>Найдено документов: <strong>{filteredAkts.length}</strong> из {akts.length}</>}
          </div>

          {/* Table with responsive horizontal scroll */}
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '64px', textAlign: 'center' }}>{t('table_num')}</th>
                  <th>{t('table_object')}</th>
                  <th style={{ width: '180px', textAlign: 'center' }}>{t('table_doc')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredAkts.map((akt) => (
                  <tr key={akt.id}>
                    <td style={{ textAlign: 'center' }}>
                      <span className="badge badge-blue" style={{ minWidth: '32px', textAlign: 'center', display: 'inline-block' }}>
                        {akt.num || parseInt(akt.id.replace(/\D+/g, ''), 10)}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', marginBottom: '4px', color: 'var(--color-text-main)' }}>
                        {lang === 'en' && akt.title_en ? akt.title_en : akt.title.replace(/^\d+\s*/, '')}
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                        {lang === 'en' && akt.organization_en ? akt.organization_en : akt.organization}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                      <a
                        href={akt.google_drive_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                        style={{ padding: '6px 12px', fontSize: '0.8125rem' }}
                      >
                        <ExternalLink size={14} /> Google Drive
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAkts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: 'var(--radius-lg)', marginTop: '20px' }}>
              <p style={{ color: 'var(--color-text-muted)' }}>
                {lang === 'en' ? 'No documents found matching your search.' : 'По вашему запросу актов не найдено.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
