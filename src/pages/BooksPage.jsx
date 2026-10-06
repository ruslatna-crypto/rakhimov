import React from 'react';
import { Download } from 'lucide-react';
import books from '../data/books.json';
import { useLanguage } from '../context/LanguageContext';
import '../styles/pages.css';

export default function BooksPage() {
  const { lang, t } = useLanguage();

  return (
    <div>
      {/* Page Hero */}
      <section
        className="page-hero books-page-hero"
        style={{
          backgroundImage: "linear-gradient(90deg, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.70) 42%, rgba(15, 23, 42, 0.20) 72%, rgba(15, 23, 42, 0.05) 100%), url('/images/fon_mono.png')",
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
            <span style={{ color: '#38bdf8' }}>{t('pub_books')}</span>
          </div>
          <h1 className="page-hero-title" style={{ color: '#ffffff', textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)', marginBottom: '12px' }}>
            {lang === 'en' ? 'Monographs & Books' : 'Монографии и книги'}
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
              ? 'Fundamental books and monographs authored by Professor R.Kh. Rakhimov.'
              : 'Список фундаментальных книг и монографий, написанных профессором Р.Х. Рахимовым.'}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-wrapper">
        <div className="container">
          <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', color: '#0f172a' }}>
            {lang === 'en' ? 'Catalog of Monographs' : 'Каталог монографий'}
          </h2>
          <div className="books-grid">
            {books.map((book) => (
              <div key={book.id} className="book-card">
                <div className="book-cover-wrap">
                  <img src={book.cover} alt={book.title} loading="lazy" />
                </div>
                <div className="book-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="badge badge-amber">{book.id}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {lang === 'en' ? 'Rakhimov R.Kh.' : 'Рахимов Р.Х.'}
                    </span>
                  </div>
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-desc">{book.description}</p>
                  
                  <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
                    <a
                      href={book.yandex_disk_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ width: '100%', fontSize: '0.8125rem' }}
                    >
                      <Download size={14} /> {lang === 'en' ? 'Download on Yandex.Disk' : 'Скачать на Яндекс.Диске'}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
