import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import '../styles/pages.css';

export default function NotFound() {
  return (
    <div style={{ padding: '120px 20px', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: '5rem', fontWeight: '900', color: 'var(--color-primary)', lineHeight: 1 }}>
        404
      </div>
      <h1 style={{ fontSize: '2rem', margin: '20px 0 10px 0' }}>Страница не найдена</h1>
      <p style={{ color: 'var(--color-text-muted)', maxWidth: '500px', marginBottom: '30px' }}>
        Запрошенная страница не существует или была перемещена в рамках оптимизации структуры портала.
      </p>
      <Link to="/" className="btn btn-primary">
        <Home size={16} /> Вернуться на главную
      </Link>
    </div>
  );
}
