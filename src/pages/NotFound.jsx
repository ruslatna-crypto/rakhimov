import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import '../styles/pages.css';

export default function NotFound() {
  const { lang } = useLanguage();

  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'noindex, follow');
  }, []);

  return (
    <div style={{ padding: '120px 20px', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: '5rem', fontWeight: '900', color: 'var(--color-primary)', lineHeight: 1 }}>
        404
      </div>
      <h1 style={{ fontSize: '2rem', margin: '20px 0 10px 0' }}>
        {lang === 'en' ? 'Page Not Found' : 'Страница не найдена'}
      </h1>
      <p style={{ color: 'var(--color-text-muted)', maxWidth: '500px', marginBottom: '30px' }}>
        {lang === 'en'
          ? 'The requested page does not exist or has been moved.'
          : 'Запрошенная страница не существует или была перемещена в рамках оптимизации структуры портала.'}
      </p>
      <Link to="/" className="btn btn-primary">
        <Home size={16} /> {lang === 'en' ? 'Back to Home' : 'Вернуться на главную'}
      </Link>
    </div>
  );
}
