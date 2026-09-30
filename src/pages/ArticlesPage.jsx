import React, { useState, useMemo } from 'react';
import { Search, FileText, ExternalLink } from 'lucide-react';
import articles from '../data/articles.json';
import '../styles/pages.css';

export default function ArticlesPage() {
  const [query, setQuery] = useState('');
  const [selectedJournal, setSelectedJournal] = useState('ALL');

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
            <span>Публикации</span>
            <span style={{ color: '#64748b' }}>/</span>
            <span style={{ color: '#38bdf8' }}>Статьи</span>
          </div>
          <h1 className="page-hero-title">Научные статьи и публикации</h1>
          <p className="page-hero-lead">
            Полный реестр 136 научных публикаций профессора Р.Х. Рахимова в отечественных и международных рецензируемых журналах (2000–2024 гг.).
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
                placeholder="Поиск по названию статьи, автору, журналу или году..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
              />
              <Search size={18} className="search-icon" />
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`btn ${selectedJournal === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSelectedJournal('ALL')}
              >
                Все статьи ({articles.length})
              </button>
              <button
                type="button"
                className={`btn ${selectedJournal === 'CN' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSelectedJournal('CN')}
              >
                Computational Nanotechnology (92)
              </button>
              <button
                type="button"
                className={`btn ${selectedJournal === 'GELIO' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSelectedJournal('GELIO')}
              >
                Гелиотехника / Solar Energy (24)
              </button>
              <button
                type="button"
                className={`btn ${selectedJournal === 'MED' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSelectedJournal('MED')}
              >
                Медицинские издания (20)
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '14px', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Найдено публикаций: <strong>{filteredArticles.length}</strong> из {articles.length}
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>№</th>
                  <th style={{ width: '220px' }}>Авторы</th>
                  <th>Название статьи</th>
                  <th style={{ width: '280px' }}>Издание / Журнал / Выходные данные</th>
                  <th style={{ width: '80px', textAlign: 'center' }}>Год</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((art, idx) => (
                  <tr key={art.id}>
                    <td>
                      <span className="badge badge-blue">{art.id}</span>
                    </td>
                    <td style={{ fontWeight: '500', color: 'var(--color-text-main)' }}>
                      {art.authors}
                    </td>
                    <td style={{ fontWeight: '600', color: '#1e293b' }}>
                      {art.title}
                    </td>
                    <td style={{ color: 'var(--color-text-muted)' }}>
                      {art.journal}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: '600' }}>
                      {art.year}
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
