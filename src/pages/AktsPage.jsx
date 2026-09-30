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
      return (
        !query ||
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.organization.toLowerCase().includes(query.toLowerCase()) ||
        a.full_text.toLowerCase().includes(query.toLowerCase())
      );
    });
  }, [query]);

  return (
    <div>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.8125rem', marginBottom: '14px' }}>
            <span>{t('nav_publications')}</span>
            <span style={{ color: '#64748b' }}>/</span>
            <span style={{ color: '#38bdf8' }}>{t('pub_akts')}</span>
          </div>
          <h1 className="page-hero-title">
            {lang === 'en' ? 'Implementation Acts & Test Reports' : 'Акты внедрения и отчеты об испытаниях'}
          </h1>
          <p className="page-hero-lead">
            {lang === 'en'
              ? 'Register of 57 production test acts, official reports, and clinical conclusions confirming practical application in agriculture, medicine, and industry.'
              : 'Реестр 57 актов производственных испытаний, отчетов и клинических заключений, подтверждающих практическое применение разработанных технологий в сельском хозяйстве, медицине и промышленности.'}
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
                  <th style={{ width: '80px' }}>{t('table_num')}</th>
                  <th style={{ width: '130px' }}>{t('table_date')}</th>
                  <th>{t('table_object')}</th>
                  <th style={{ width: '180px', textAlign: 'center' }}>{t('table_doc')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredAkts.map((akt) => (
                  <tr key={akt.id}>
                    <td>
                      <span className="badge badge-blue">{akt.id}</span>
                    </td>
                    <td style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                      {akt.date}
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', marginBottom: '4px', color: 'var(--color-text-main)' }}>
                        {akt.title}
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                        {akt.organization}
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
