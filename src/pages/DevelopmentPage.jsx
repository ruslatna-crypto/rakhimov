import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, FileText, Award, Layers } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import developments from '../data/developments.json';
import '../styles/pages.css';

export default function DevelopmentPage({ forcedSlug }) {
  const params = useParams();
  const slug = forcedSlug || params.slug;
  const { t, lang } = useLanguage();

  const dev = developments.find((d) => d.slug === slug);

  if (!dev) {
    return <Navigate to="/" replace />;
  }

  // Related other developments
  const otherDevs = developments.filter((d) => d.slug !== slug);

  // In English mode, get translated title if available
  const devTitle = t(`dev_${slug}`) !== `dev_${slug}` ? t(`dev_${slug}`) : dev.title;

  return (
    <div>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.8125rem', marginBottom: '14px' }}>
            <Link to="/" style={{ color: '#94a3b8' }}>{t('dev_breadcrumb_home')}</Link>
            <span style={{ color: '#64748b' }}>/</span>
            <span style={{ color: '#38bdf8' }}>{t('dev_breadcrumb_devs')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <img src={dev.icon} alt="" style={{ width: '40px', height: '40px' }} />
            </div>
            <div>
              <h1 className="page-hero-title">{devTitle}</h1>
              <p className="page-hero-lead">{dev.lead}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="container dev-detail-layout">
        <div className="dev-detail-grid">
          {/* Scientific Text (Verbatim) */}
          <article className="dev-text-content">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: 'var(--color-text-main)' }}>
              {t('dev_desc_title')}
            </h2>

            {dev.full_text.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}

            {/* Images associated with this development */}
            {dev.images && dev.images.length > 0 && (
              <div style={{ marginTop: '36px' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>{t('dev_gallery_title')}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                  {dev.images.map((imgUrl, i) => (
                    <div key={i} style={{ background: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                      <img
                        src={imgUrl}
                        alt={`${devTitle} - ${i+1}`}
                        style={{ maxHeight: '240px', margin: '0 auto', borderRadius: '4px' }}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick cross-links */}
            <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/stat" className="btn btn-outline">
                <FileText size={16} /> {t('dev_linked_articles')}
              </Link>
              <Link to="/patents" className="btn btn-outline">
                <Award size={16} /> {t('dev_linked_patents')}
              </Link>
              <Link to="/akt" className="btn btn-outline">
                <CheckCircle2 size={16} /> {t('dev_linked_akts')}
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="dev-sidebar">
            <div className="sidebar-box">
              <h4 className="sidebar-box-title">
                <Layers size={18} color="var(--color-primary)" /> {t('dev_other_title')}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {otherDevs.map((od) => {
                  const odTitle = t(`dev_${od.slug}`) !== `dev_${od.slug}` ? t(`dev_${od.slug}`) : od.title;
                  return (
                    <li key={od.slug}>
                      <Link
                        to={`/${od.slug}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          fontSize: '0.875rem',
                          color: 'var(--color-text-main)',
                          padding: '6px 8px',
                          borderRadius: 'var(--radius-sm)',
                          transition: 'background var(--transition-fast)'
                        }}
                      >
                        <img src={od.icon} alt="" style={{ width: '20px', height: '20px' }} />
                        <span>{odTitle}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="sidebar-box" style={{ background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '10px' }}>
                {t('dev_collab_title')}
              </h4>
              <p style={{ fontSize: '0.84375rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                {t('dev_collab_text')}
              </p>
              <a href="mailto:rustam-shsul@yandex.com" className="btn btn-primary" style={{ width: '100%' }}>
                {t('dev_collab_btn')}
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
