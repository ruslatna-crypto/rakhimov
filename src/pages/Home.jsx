import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Award, FileText } from 'lucide-react';
import developments from '../data/developments.json';
import { useLanguage } from '../context/LanguageContext';
import HeroSlider from '../components/HeroSlider';
import '../styles/pages.css';

export default function Home() {
  const { lang, t } = useLanguage();

  return (
    <div>
      {/* 8-Image Auto-Cycling Hero Slider */}
      <HeroSlider />


      {/* 9 Developments Section */}
      <section className="section-wrapper">
        <div className="container">
          <div className="section-header" style={{ marginBottom: '40px' }}>
            <h1 className="section-title">
              {lang === 'en'
                ? 'Scientific Developments & Technologies — Prof. Rakhimov R.Kh.'
                : 'Научные разработки и технологии — Профессор Рахимов Р.Х.'}
            </h1>
            <h2 style={{ textAlign: 'center', fontSize: '1.5rem', marginTop: '10px', color: '#1e293b', fontWeight: '500' }}>
              {lang === 'en' ? 'Key Development Areas' : 'Ключевые направления разработок'}
            </h2>
          </div>

          <div className="dev-grid">
            {developments.map((dev) => (
              <Link to={`/${dev.slug}`} key={dev.slug} className="dev-card">
                <div className="dev-card-image-wrap">
                  <img src={dev.icon} alt={dev.title} className="dev-card-image" loading="lazy" />
                </div>
                <div className="dev-card-content">
                  <h3 className="dev-card-title">
                    {t(`dev_${dev.slug}`) || dev.title}
                  </h3>
                  <p className="dev-card-desc">{dev.lead}</p>
                  <div className="dev-card-link">
                    {lang === 'en' ? 'Learn more' : 'Подробнее'} <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Publications / Documents Banner */}
      <section style={{ background: '#f1f5f9', padding: '64px 0', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', alignItems: 'stretch' }}>
          {/* Box 1 */}
          <div style={{ background: '#ffffff', padding: '28px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: '#e0f2fe', padding: '10px', borderRadius: 'var(--radius-md)', color: '#0284c7' }}>
                <FileText size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0' }}>{t('pub_articles')}</h3>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '24px', flexGrow: 1, lineHeight: '1.6' }}>
              {lang === 'en'
                ? '280 fundamental scientific papers in Computational Nanotechnology, Applied Solar Energy, and international journals.'
                : '280 фундаментальных статей в журналах Computational Nanotechnology, Гелиотехника, а также международных и медицинских сборниках.'}
            </p>
            <Link to="/stat" className="btn btn-outline" style={{ width: '100%', marginTop: 'auto', textAlign: 'center' }}>
              {lang === 'en' ? 'Go to articles →' : 'Перейти к статьям →'}
            </Link>
          </div>

          {/* Box 2 */}
          <div style={{ background: '#ffffff', padding: '28px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: '#fef3c7', padding: '10px', borderRadius: 'var(--radius-md)', color: '#b45309' }}>
                <Award size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0' }}>{t('pub_patents')}</h3>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '24px', flexGrow: 1, lineHeight: '1.6' }}>
              {lang === 'en'
                ? '65 inventions protected by USSR certificates, patents of Uzbekistan, USA, Europe, EAPO, Turkey, and Estonia.'
                : '65 изобретений, защищенных авторскими свидетельствами СССР, патентами Республики Узбекистан, США, Европы, ЕАПО, Турции и Эстонии.'}
            </p>
            <Link to="/patents" className="btn btn-outline" style={{ width: '100%', marginTop: 'auto', textAlign: 'center' }}>
              {lang === 'en' ? 'Explore patents →' : 'Изучить патенты →'}
            </Link>
          </div>

          {/* Box 3 */}
          <div style={{ background: '#ffffff', padding: '28px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: '#dcfce7', padding: '10px', borderRadius: 'var(--radius-md)', color: '#15803d' }}>
                <BookOpen size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0' }}>{t('pub_books')}</h3>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '24px', flexGrow: 1, lineHeight: '1.6' }}>
              {lang === 'en'
                ? '9 published monographs with direct access to full electronic versions on Yandex.Disk.'
                : '9 опубликованных монографий с прямым доступом к полным электронным версиям на Яндекс.Диске.'}
            </p>
            <Link to="/book" className="btn btn-outline" style={{ width: '100%', marginTop: 'auto', textAlign: 'center' }}>
              {lang === 'en' ? 'Download monographs →' : 'Скачать монографии →'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
