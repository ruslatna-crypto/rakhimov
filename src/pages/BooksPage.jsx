import React, { useState, useEffect, useRef } from 'react';
import { Download, Eye, FileText, Globe, X } from 'lucide-react';
import books from '../data/books.json';
import { useLanguage } from '../context/LanguageContext';
import PdfModal from '../components/PdfModal';
import '../styles/pages.css';

const downloadFileBlob = async (url, filename) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    }, 2000);
  } catch (err) {
    console.warn(`Direct link fallback for ${filename}:`, err);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
    }, 1000);
  }
};

export default function BooksPage() {
  const { lang, t } = useLanguage();
  const [activePdf, setActivePdf] = useState(null);
  const [pdfLangOverrides, setPdfLangOverrides] = useState({});
  const [downloadNotice, setDownloadNotice] = useState(null);
  const downloadingRef = useRef({});

  useEffect(() => {
    setPdfLangOverrides({});
  }, [lang]);

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

  const handleOpenPdf = (book, cardLang = null) => {
    const activeLang = cardLang || (pdfLangOverrides[book.id] || lang);
    const isEn = activeLang === 'en';
    const title = lang === 'en' && book.title_en ? book.title_en : book.title;
    const url = (isEn && book.pdf_url_en) || book.pdf_url || book.yandex_disk_url;
    const pages = isEn && book.pages_en ? book.pages_en : (book.pages || 30);
    const size = isEn && book.size_en ? book.size_en : (book.size || '938 КБ');
    const filename = isEn && book.filename_en ? book.filename_en : (book.filename || `${book.id}.pdf`);
    const pageCountText = `${pages} ${lang === 'en' ? 'p.' : 'стр.'}`;

    setActivePdf({
      url,
      title,
      filename,
      size,
      pages: pageCountText
    });
  };

  const handleToggleAndOpenPdf = (book, currentCardLang) => {
    const nextLang = currentCardLang === 'ru' ? 'en' : 'ru';
    setPdfLangOverrides((prev) => ({
      ...prev,
      [book.id]: nextLang
    }));
    handleOpenPdf(book, nextLang);
  };

  const handleDualDownload = async (e, book) => {
    e.preventDefault();

    if (downloadingRef.current[book.id]) {
      return;
    }
    downloadingRef.current[book.id] = true;

    const ruUrl = book.pdf_url;
    const enUrl = book.pdf_url_en;
    const ruFilename = book.filename || ruUrl.split('/').pop();
    const enFilename = book.filename_en || enUrl.split('/').pop();

    setDownloadNotice({
      bookId: book.id,
      status: 'downloading',
      ruUrl,
      ruFilename,
      enUrl,
      enFilename,
      message: lang === 'en'
        ? 'Downloading both editions (Russian & English). If your browser prompts to allow multiple downloads, please click "Allow".'
        : 'Скачивание двух версий книги (русская и английская). Если браузер запросит разрешение на загрузку нескольких файлов, нажмите «Разрешить».'
    });

    try {
      // 1. Download RU version
      await downloadFileBlob(ruUrl, ruFilename);

      // Stagger second download
      await new Promise((resolve) => setTimeout(resolve, 400));

      // 2. Download EN version
      await downloadFileBlob(enUrl, enFilename);

      setDownloadNotice((prev) => (prev && prev.bookId === book.id ? {
        ...prev,
        status: 'done',
        message: lang === 'en'
          ? 'Both editions (RU + EN) downloaded successfully!'
          : 'Обе версии книги (RU + EN) успешно скачаны!'
      } : prev));
    } catch (err) {
      console.error('Download error:', err);
      setDownloadNotice((prev) => (prev && prev.bookId === book.id ? {
        ...prev,
        status: 'error',
        message: lang === 'en'
          ? 'Automatic download was blocked or failed. You can download each file directly below:'
          : 'Ошибка при скачивании. Вы можете скачать файлы по отдельности:'
      } : prev));
    } finally {
      setTimeout(() => {
        downloadingRef.current[book.id] = false;
      }, 1500);

      setTimeout(() => {
        setDownloadNotice((prev) => (prev && prev.bookId === book.id && prev.status === 'done' ? null : prev));
      }, 6000);
    }
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
              const hasToggle = Boolean(book.has_lang_toggle);
              const currentCardLang = hasToggle ? (pdfLangOverrides[book.id] || lang) : lang;
              const isCardEn = currentCardLang === 'en';

              const title = lang === 'en' && book.title_en ? book.title_en : book.title;
              const category = lang === 'en' && book.category_en ? book.category_en : (book.category || 'НАУЧНЫЙ ТРУД / ГЛАВА КНИГИ');
              const description = lang === 'en' && book.description_en ? book.description_en : book.description;

              const displayPages = isCardEn && book.pages_en ? book.pages_en : (book.pages || 30);
              const pageCountText = `${displayPages} ${lang === 'en' ? 'p.' : 'стр.'}`;
              const sizeText = (isCardEn && book.size_en) || book.size || '938 КБ';
              const webpCover = book.cover ? book.cover.replace(/\.(png|jpg)$/, '.webp') : null;

              const activeDownloadUrl = (isCardEn && book.pdf_url_en) || book.pdf_url || book.yandex_disk_url;
              const activeFilename = (isCardEn && book.filename_en) || book.filename || `${book.id}.pdf`;

              return (
                <article key={book.id} id={book.id.toLowerCase()} className="book-card">
                  <div className="book-card-main">
                    {/* Left: Book Cover Container with Badges */}
                    <div
                      className="book-cover-container"
                      onClick={() => handleOpenPdf(book, currentCardLang)}
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
                        onClick={() => handleOpenPdf(book, currentCardLang)}
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
                    <div className="book-action-col">
                      <button
                        type="button"
                        onClick={() => handleOpenPdf(book, currentCardLang)}
                        className="book-btn-open"
                      >
                        <Eye size={17} />
                        <span>{lang === 'en' ? 'Open PDF' : 'Открыть PDF'}</span>
                      </button>

                      {hasToggle && (
                        <button
                          type="button"
                          onClick={() => handleToggleAndOpenPdf(book, currentCardLang)}
                          className="book-btn-lang-toggle"
                          title={isCardEn ? (lang === 'en' ? 'Open Russian version' : 'Открыть русскую версию') : (lang === 'en' ? 'Open English version' : 'Открыть английскую версию')}
                        >
                          <Globe size={15} />
                          <span>{isCardEn ? 'Русская версия' : 'English version'}</span>
                        </button>
                      )}
                    </div>

                    <div className="book-action-col">
                      <a
                        href={activeDownloadUrl}
                        download={activeFilename}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="book-btn-download"
                        onClick={hasToggle ? (e) => handleDualDownload(e, book) : undefined}
                      >
                        <Download size={17} />
                        <span>{lang === 'en' ? 'Download' : 'Скачать'}</span>
                      </a>
                    </div>
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

      {/* Toast notification for dual downloads / fallback */}
      {downloadNotice && (
        <div className="download-notice-toast" role="status" aria-live="polite">
          <div className="download-notice-content">
            <div className="download-notice-header">
              <span className="download-notice-icon">
                <Download size={18} />
              </span>
              <span className="download-notice-text">
                {downloadNotice.message}
              </span>
              <button
                type="button"
                onClick={() => setDownloadNotice(null)}
                className="download-notice-close"
                aria-label={lang === 'en' ? 'Close' : 'Закрыть'}
              >
                <X size={16} />
              </button>
            </div>

            <div className="download-notice-links">
              <a
                href={downloadNotice.ruUrl}
                download={downloadNotice.ruFilename}
                className="download-notice-link-btn"
              >
                <span>RU: {downloadNotice.ruFilename}</span>
              </a>
              <a
                href={downloadNotice.enUrl}
                download={downloadNotice.enFilename}
                className="download-notice-link-btn"
              >
                <span>EN: {downloadNotice.enFilename}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
