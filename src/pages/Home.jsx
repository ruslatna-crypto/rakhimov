import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Award, FileText } from 'lucide-react';
import developments from '../data/developments.json';
import { useLanguage } from '../context/LanguageContext';
import '../styles/pages.css';

export default function Home() {
  const { lang, t } = useLanguage();

  return (
    <div>
      {/* Hero Section */}
      <section className="home-hero">
        <div className="container home-hero-grid">
          <div>
            <div className="home-hero-badge">
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }}></span>
              {t('hero_badge')}
            </div>
            <h1 className="home-hero-title">
              {t('hero_title_1')} <span>{t('hero_title_2')}</span>
            </h1>
            <p className="home-hero-lead">
              {t('hero_subtitle')}
            </p>
            <div className="home-hero-actions">
              <Link to="/autor" className="btn btn-primary">
                {t('hero_btn_author')} <ArrowRight size={16} />
              </Link>
              <Link to="/stat" className="btn btn-outline" style={{ background: 'rgba(255,255,255,0.05)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}>
                {t('hero_btn_articles')}
              </Link>
            </div>
          </div>

          <div className="author-portrait-wrapper">
            <img src="/images/rrh-250x300.png" alt={t('hero_caption_name')} width="280" height="336" />
            <div className="author-portrait-caption">
              <strong>{t('hero_caption_name')}</strong><br />
              {t('hero_caption_rank')}
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section style={{ background: '#ffffff', borderBottom: '1px solid var(--color-border)', padding: '28px 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-primary)' }}>136</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>{t('metric_articles')}</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-primary)' }}>73</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>{t('metric_patents')}</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-primary)' }}>57</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>{t('metric_akts')}</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-primary)' }}>9</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>{t('metric_books')}</div>
          </div>
        </div>
      </section>

      {/* 9 Developments Section */}
      <section className="section-wrapper">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">{t('dev_section_badge')}</div>
            <h2 className="section-title">{t('dev_section_title')}</h2>
            <p className="section-desc">
              {t('dev_section_subtitle')}
            </p>
          </div>

          <div className="dev-grid">
            {developments.map((dev) => (
              <Link to={`/${dev.slug}`} key={dev.slug} className="dev-card">
                <div className="dev-icon-wrap">
                  <img src={dev.icon} alt={dev.title} />
                </div>
                <h3 className="dev-card-title">
                  {t(`dev_${dev.slug}`) || dev.title}
                </h3>
                <p className="dev-card-desc">{dev.lead}</p>
                <div className="dev-card-link">
                  {lang === 'en' ? 'Learn more' : 'Подробнее'} <ArrowRight size={14} />
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
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0' }}>{t('pub_articles')}</h3>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '20px' }}>
              {lang === 'en' 
                ? '136 fundamental scientific papers in Computational Nanotechnology, Applied Solar Energy, and international journals.'
                : '136 фундаментальных статей в журналах Computational Nanotechnology, Гелиотехника, а также международных и медицинских сборниках.'}
            </p>
            <Link to="/stat" className="btn btn-outline" style={{ width: '100%' }}>
              {lang === 'en' ? 'Go to articles →' : 'Перейти к статьям →'}
            </Link>
          </div>

          {/* Box 2 */}
          <div style={{ background: '#ffffff', padding: '28px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: '#fef3c7', padding: '10px', borderRadius: 'var(--radius-md)', color: '#b45309' }}>
                <Award size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0' }}>{t('pub_patents')}</h3>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '20px' }}>
              {lang === 'en'
                ? '73 inventions protected by USSR certificates, patents of Uzbekistan, USA, Europe, EAPO, and Turkey.'
                : '73 изобретения, защищенных авторскими свидетельствами СССР, патентами Республики Узбекистан, США, Европы, ЕАПО и Турции.'}
            </p>
            <Link to="/patents" className="btn btn-outline" style={{ width: '100%' }}>
              {lang === 'en' ? 'Explore patents →' : 'Изучить патенты →'}
            </Link>
          </div>

          {/* Box 3 */}
          <div style={{ background: '#ffffff', padding: '28px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: '#dcfce7', padding: '10px', borderRadius: 'var(--radius-md)', color: '#15803d' }}>
                <BookOpen size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0' }}>{t('pub_books')}</h3>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '20px' }}>
              {lang === 'en'
                ? '9 published monographs with direct access to full electronic versions on Yandex.Disk.'
                : '9 опубликованных монографий с прямым доступом к полным электронным версиям на Яндекс.Диске.'}
            </p>
            <Link to="/book" className="btn btn-outline" style={{ width: '100%' }}>
              {lang === 'en' ? 'Download monographs →' : 'Скачать монографии →'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
