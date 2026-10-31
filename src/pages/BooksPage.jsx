import React, { useState, useEffect } from 'react';
import { Download, Eye, FileText } from 'lucide-react';
import books from '../data/books.json';
import { useLanguage } from '../context/LanguageContext';
import PdfModal from '../components/PdfModal';
import '../styles/pages.css';

export default function BooksPage() {
  const { lang, t } = useLanguage();
  const [activePdf, setActivePdf] = useState(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const scriptId = 'schema-books-jsonld';
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const currentLang = lang === 'en' ? 'en' : 'ru';
    const BASE_URL = 'https://www.rakhimovr.uz';

    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${BASE_URL}/book#webpage`,
      'url': `${BASE_URL}/book`,
      'name': currentLang === 'en'
        ? 'Books & Monographs by Prof. Rustam Rakhimov'
        : 'Монографии и книги — Научные труды профессора Рахимова Р.Х.',
      'description': currentLang === 'en'
        ? 'Fundamental scientific monographs on functional ceramics, solar energy materials, and pulse physics. Available with PDF downloads.'
        : 'Фундаментальные монографии по функциональной керамике, полупроводниковой гелиоэнергетике и импульсным технологиям. Скачивание в формате PDF.',
      'inLanguage': currentLang,
      'isPartOf': {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        'name': currentLang === 'en'
          ? 'Prof. Rakhimov R.Kh. — Scientific Portal'
          : 'Портал профессора Рахимова Р.Х.',
        'url': `${BASE_URL}/`
      },
      'mainEntity': {
        '@type': 'ItemList',
        '@id': `${BASE_URL}/book#itemlist`,
        'numberOfItems': books.length,
        'itemListElement': books.map((book, index) => {
          const title = currentLang === 'en' && book.title_en ? book.title_en : book.title;
          const description = currentLang === 'en' && book.description_en ? book.description_en : book.description;
          const authorStr = currentLang === 'en' && book.author_en ? book.author_en : (book.author || 'Рахимов Р.Х.');
          const authors = authorStr.split(',').map((name) => ({
            '@type': 'Person',
            'name': name.trim()
          }));
          const coverUrl = book.cover
            ? (book.cover.startsWith('http') ? book.cover : `${BASE_URL}${book.cover.startsWith('/') ? '' : '/'}${book.cover}`)
            : `${BASE_URL}/images/rrh-250x300.png`;

          const bookAnchorUrl = `${BASE_URL}/book#${book.id.toLowerCase()}`;

          return {
            '@type': 'ListItem',
            'position': index + 1,
            'item': {
              '@type': 'Book',
              '@id': bookAnchorUrl,
              'url': bookAnchorUrl,
              'name': title,
              'author': authors.length === 1 ? authors[0] : authors,
              'description': description,
              'image': coverUrl,
              'inLanguage': currentLang
            }
          };
        })
      }
    };

    script.textContent = JSON.stringify(schemaData);

    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) {
        existing.remove();
      }
    };
  }, [lang]);

  const handleOpenPdf = (book) => {
    const title = lang === 'en' && book.title_en ? book.title_en : book.title;
    const url = (lang === 'en' && book.pdf_url_en) || book.pdf_url || book.yandex_disk_url;
    const pageCountText = `${book.pages || 30} ${lang === 'en' ? 'p.' : 'стр.'}`;

    setActivePdf({
      url,
      title,
      filename: book.filename || `${book.id}.pdf`,
      size: book.size,
      pages: pageCountText
    });
  };

  return (
    <div>
      {/* Page Hero */}
      <section
        className="page-hero books-page-hero"
        style={{
          backgroundImage: "linear-gradient(90deg, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.70) 42%, rgba(15, 23, 42, 0.20) 72%, rgba(15, 23, 42, 0.05) 100%), url('/images/fon_mono.webp')",
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
          <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', color: '#0f172a', fontWeight: 700 }}>
            {lang === 'en' ? 'Catalog of Monographs' : 'Каталог монографий'}
          </h2>
          <div className="books-grid">
            {books.map((book) => {
              const title = lang === 'en' && book.title_en ? book.title_en : book.title;
              const category = lang === 'en' && book.category_en ? book.category_en : (book.category || 'НАУЧНЫЙ ТРУД / ГЛАВА КНИГИ');
              const description = lang === 'en' && book.description_en ? book.description_en : book.description;
              const pageCountText = `${book.pages || 30} ${lang === 'en' ? 'p.' : 'стр.'}`;
              const sizeText = book.size || '938 КБ';
              const webpCover = book.cover ? book.cover.replace(/\.(png|jpg)$/, '.webp') : null;
              const downloadUrl = (lang === 'en' && book.pdf_url_en) || book.pdf_url || book.yandex_disk_url;

              return (
                <article key={book.id} id={book.id.toLowerCase()} className="book-card">
                  <div className="book-card-main">
                    {/* Left: Book Cover Container with Badges */}
                    <div
                      className="book-cover-container"
                      onClick={() => handleOpenPdf(book)}
                      title={lang === 'en' ? 'Click to view PDF' : 'Нажмите для просмотра PDF'}
                      style={{ cursor: 'pointer' }}
                    >
                      <picture>
                        {webpCover && <source srcSet={webpCover} type="image/webp" />}
                        <img
                          src={book.cover}
                          alt={title}
                          className="book-cover-img"
                          loading="lazy"
                        />
                      </picture>

                      {/* Top-left PDF Badge */}
                      <div className="book-badge-pdf" aria-label="PDF Document">
                        <FileText size={11} strokeWidth={2.5} />
                        <span>PDF</span>
                      </div>

                      {/* Bottom-right Page Count Badge */}
                      <div className="book-badge-pages">
                        {pageCountText}
                      </div>
                    </div>

                    {/* Right: Book Details */}
                    <div className="book-content-container">
                      <div className="book-meta-top">
                        <span className="book-category-pill">
                          {category}
                        </span>
                        <span className="book-size-label">
                          {sizeText}
                        </span>
                      </div>

                      <h3
                        className="book-title"
                        onClick={() => handleOpenPdf(book)}
                        style={{ cursor: 'pointer' }}
                        title={lang === 'en' ? 'Click to view PDF' : 'Нажмите для просмотра PDF'}
                      >
                        {title}
                      </h3>

                      <p className="book-desc">
                        {description}
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="book-actions-bar">
                    <button
                      type="button"
                      onClick={() => handleOpenPdf(book)}
                      className="book-btn-open"
                    >
                      <Eye size={17} />
                      <span>{lang === 'en' ? 'Open PDF' : 'Открыть PDF'}</span>
                    </button>

                    <a
                      href={downloadUrl}
                      download={book.filename || `${book.id}.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="book-btn-download"
                    >
                      <Download size={17} />
                      <span>{lang === 'en' ? 'Download' : 'Скачать'}</span>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Full-screen PDF Viewer Modal with ESC key close */}
      <PdfModal
        isOpen={!!activePdf}
        pdf={activePdf}
        onClose={() => setActivePdf(null)}
        isRu={lang !== 'en'}
      />
    </div>
  );
}
