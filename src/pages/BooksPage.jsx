import React from 'react';
import { BookOpen, Download, ExternalLink } from 'lucide-react';
import books from '../data/books.json';
import '../styles/pages.css';

export default function BooksPage() {
  return (
    <div>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.8125rem', marginBottom: '14px' }}>
            <span>Публикации</span>
            <span style={{ color: '#64748b' }}>/</span>
            <span style={{ color: '#38bdf8' }}>Книги</span>
          </div>
          <h1 className="page-hero-title">Монографии и книги</h1>
          <p className="page-hero-lead">
            Список фундаментальных книг и монографий, написанных профессором Р.Х. Рахимовым.
            Прямой доступ к полным электронным версиям на Яндекс.Диске.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-wrapper">
        <div className="container">
          <div className="books-grid">
            {books.map((book) => (
              <div key={book.id} className="book-card">
                <div className="book-cover-wrap">
                  <img src={book.cover} alt={book.title} loading="lazy" />
                </div>
                <div className="book-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="badge badge-amber">{book.id}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Рахимов Р.Х.</span>
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
                      <Download size={14} /> Скачать на Яндекс.Диске
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
