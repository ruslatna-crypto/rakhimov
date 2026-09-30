import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Award, FileText, CheckCircle, Lightbulb } from 'lucide-react';
import developments from '../data/developments.json';
import '../styles/pages.css';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="home-hero">
        <div className="container home-hero-grid">
          <div>
            <div className="home-hero-badge">
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }}></span>
              Институт Материаловедения АН РУз
            </div>
            <h1 className="home-hero-title">
              Научные разработки & <span>Функциональная керамика</span>
            </h1>
            <p className="home-hero-lead">
              Персональный научно-производственный портал доктора технических наук, профессора <strong>Рахимова Рустама Хакимовича</strong>.
              Фундаментальные и прикладные исследования в области солнечной энергетики, импульсного туннельного эффекта, резонансной сушки и биомедицины.
            </p>
            <div className="home-hero-actions">
              <Link to="/autor" className="btn btn-primary">
                Об авторе <ArrowRight size={16} />
              </Link>
              <Link to="/stat" className="btn btn-outline" style={{ background: 'rgba(255,255,255,0.05)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}>
                Научные статьи (136)
              </Link>
            </div>
          </div>

          <div className="author-portrait-wrapper">
            <img src="/images/rrh-250x300.png" alt="Профессор Рахимов Р.Х." width="280" height="336" />
            <div className="author-portrait-caption">
              <strong>Рахимов Рустам Хакимович</strong><br />
              Доктор технических наук, профессор
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section style={{ background: '#ffffff', borderBottom: '1px solid var(--color-border)', padding: '28px 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-primary)' }}>136</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Научных публикаций</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-primary)' }}>73</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Патента и свидетельства</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-primary)' }}>57</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Актов внедрения</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-primary)' }}>9</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Опубликованных монографий</div>
          </div>
        </div>
      </section>

      {/* 9 Developments Section */}
      <section className="section-wrapper">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Инновации & Технологии</div>
            <h2 className="section-title">Ключевые направления разработок</h2>
            <p className="section-desc">
              Разработки на базе синтезированных в Большой Солнечной Печи (БСП) оксидных керамических преобразователей спектра.
            </p>
          </div>

          <div className="dev-grid">
            {developments.map((dev) => (
              <Link to={`/${dev.slug}`} key={dev.slug} className="dev-card">
                <div className="dev-icon-wrap">
                  <img src={dev.icon} alt={dev.title} />
                </div>
                <h3 className="dev-card-title">{dev.title}</h3>
                <p className="dev-card-desc">{dev.lead}</p>
                <div className="dev-card-link">
                  Подробнее <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Publications / Documents Banner */}
      <section style={{ background: '#f1f5f9', padding: '64px 0', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {/* Box 1 */}
          <div style={{ background: '#ffffff', padding: '28px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: '#e0f2fe', padding: '10px', borderRadius: 'var(--radius-md)', color: '#0284c7' }}>
                <FileText size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0' }}>Научные статьи</h3>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '20px' }}>
              136 фундаментальных статей в журналах Computational Nanotechnology, Гелиотехника, а также международных и медицинских сборниках.
            </p>
            <Link to="/stat" className="btn btn-outline" style={{ width: '100%' }}>
              Перейти к статьям →
            </Link>
          </div>

          {/* Box 2 */}
          <div style={{ background: '#ffffff', padding: '28px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: '#fef3c7', padding: '10px', borderRadius: 'var(--radius-md)', color: '#b45309' }}>
                <Award size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0' }}>Реестр патентов</h3>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '20px' }}>
              73 изобретения, защищенных авторскими свидетельствами СССР, патентами Республики Узбекистан, США, Европы, ЕАПО и Турции.
            </p>
            <Link to="/patents" className="btn btn-outline" style={{ width: '100%' }}>
              Изучить патенты →
            </Link>
          </div>

          {/* Box 3 */}
          <div style={{ background: '#ffffff', padding: '28px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: '#dcfce7', padding: '10px', borderRadius: 'var(--radius-md)', color: '#15803d' }}>
                <BookOpen size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0' }}>Книги и монографии</h3>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '20px' }}>
              9 опубликованных монографий с прямым доступом к полным электронным версиям на Яндекс.Диске.
            </p>
            <Link to="/book" className="btn btn-outline" style={{ width: '100%' }}>
              Скачать монографии →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
