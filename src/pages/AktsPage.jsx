import React, { useState, useMemo } from 'react';
import { Search, ExternalLink, FileCheck } from 'lucide-react';
import akts from '../data/akts.json';
import '../styles/pages.css';

export default function AktsPage() {
  const [query, setQuery] = useState('');

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
            <span>Публикации</span>
            <span style={{ color: '#64748b' }}>/</span>
            <span style={{ color: '#38bdf8' }}>Акты и заключения</span>
          </div>
          <h1 className="page-hero-title">Акты внедрения и отчеты об испытаниях</h1>
          <p className="page-hero-lead">
            Реестр 57 актов производственных испытаний, отчетов и клинических заключений, подтверждающих практическое применение разработанных технологий в сельском хозяйстве, медицине и промышленности.
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
              placeholder="Поиск по названию документа, предприятию или клинике..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
            />
            <Search size={18} className="search-icon" />
          </div>

          <div style={{ marginBottom: '14px', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Найдено документов: <strong>{filteredAkts.length}</strong> из {akts.length}
          </div>

          {/* Table with responsive horizontal scroll */}
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>ID</th>
                  <th>Наименование акта / заключение об испытаниях</th>
                  <th style={{ width: '320px' }}>Организация / Предприятие / Клиника</th>
                  <th style={{ width: '160px', textAlign: 'center' }}>Документ</th>
                </tr>
              </thead>
              <tbody>
                {filteredAkts.map((akt) => (
                  <tr key={akt.id}>
                    <td>
                      <span className="badge badge-green">{akt.id}</span>
                    </td>
                    <td style={{ fontWeight: '600', color: 'var(--color-text-main)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileCheck size={18} color="#15803d" />
                        <span>{akt.title}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: '0.84375rem' }}>
                      {akt.organization}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <a
                        href={akt.google_drive_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                        style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'inline-flex', gap: '4px' }}
                      >
                        Google Drive <ExternalLink size={12} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
