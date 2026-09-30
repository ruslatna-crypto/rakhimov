import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ChevronDown, Menu, X, ExternalLink, Lightbulb, BookOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import '../styles/header.css';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDevOpen, setMobileDevOpen] = useState(false);
  const [mobilePubOpen, setMobilePubOpen] = useState(false);
  const [mobileLinksOpen, setMobileLinksOpen] = useState(false);

  const { lang, setLang, t } = useLanguage();

  const closeMobile = () => setMobileOpen(false);

  const developments = [
    { title: t('dev_sushka'), path: '/sushka' },
    { title: t('dev_lamp'), path: '/lamp' },
    { title: t('dev_kalci'), path: '/kalci' },
    { title: t('dev_pech'), path: '/pech' },
    { title: t('dev_plenka'), path: '/plenka' },
    { title: t('dev_kraska'), path: '/kraska' },
    { title: t('dev_steril'), path: '/steril' },
    { title: t('dev_cotton'), path: '/cotton' },
    { title: t('dev_bsp'), path: '/bsp' }
  ];

  // Внутри Меню "Публикации" цифры убраны по требованию 4
  const publications = [
    { title: t('pub_articles'), path: '/stat' },
    { title: t('pub_books'), path: '/book' },
    { title: t('pub_patents'), path: '/patents' },
    { title: t('pub_akts'), path: '/akt' }
  ];

  const externalLinks = [
    { title: 'Cyberleninka', url: 'https://cyberleninka.ru/article/n/rahimov-rustam-hakimovich' },
    { title: 'Персоналии (Math-Net.ru)', url: 'https://www.mathnet.ru/rus/person114518' },
    { title: 'ResearchGate', url: 'https://www.researchgate.net/profile/Rustam-Rakhimov' },
    { title: 'Semantic Scholar', url: 'https://www.semanticscholar.org/author/%D0%A0%D0%B0%D1%85%D0%B8%D0%BC%D0%BE%D0%B2-%D0%A0%D1%83%D1%81%D1%82%D0%B0%D0%BC-%D0%A5%D0%B0%D0%BA%D0%B8%D0%BC%D0%BE%D0%B2%D0%B8%D1%87/112831501' }
  ];

  return (
    <header className="site-header">
      {/* 1. Верхний ярус шапки: Логотип слева | Кнопки (Рус, Eng, На сайт фирмы) справа */}
      <div className="header-top">
        <div className="container header-top-inner">
          {/* Brand Logo only (текстовый блок убран по запросу) */}
          <Link to="/" className="brand-link" onClick={closeMobile} title={t('nav_home')}>
            <img src="/images/logo_new.svg" alt="Керамика Синтез — Академик Рахимов Р.Х." className="brand-logo" />
          </Link>

          {/* Правая часть: Виджет переключения языков + Кнопка на сайт фирмы + Бургер */}
          <div className="header-top-right">
            <div className="header-widget">
              <div className="lang-switcher" role="group" aria-label="Выбор языка">
                {/* Кнопка Рус */}
                <button 
                  type="button" 
                  className={`lang-btn ${lang === 'ru' ? 'active' : ''}`}
                  onClick={() => setLang('ru')}
                  title="Русский язык"
                >
                  <svg className="flag-icon" viewBox="0 0 640 480" width="18" height="13" aria-hidden="true">
                    <g fillRule="evenodd" strokeWidth="1pt">
                      <path fill="#fff" d="M0 0h640v480H0z"/>
                      <path fill="#0039a6" d="M0 160h640v320H0z"/>
                      <path fill="#d52b1e" d="M0 320h640v160H0z"/>
                    </g>
                  </svg>
                  <span className="lang-label">Рус</span>
                </button>

                {/* Кнопка Eng */}
                <button 
                  type="button" 
                  className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                  onClick={() => setLang('en')}
                  title="English language"
                >
                  <svg className="flag-icon" viewBox="0 0 640 480" width="18" height="13" aria-hidden="true">
                    <path fill="#012169" d="M0 0h640v480H0z"/>
                    <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z"/>
                    <path fill="#C8102E" d="m424 281 216 159v40L369 281h55zm-184-82L23 40V0l270 199h-53zM640 0v3L447 146l32 23L640 43V0zM0 442l193-144-31-24L0 416v26z"/>
                    <path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z"/>
                    <path fill="#C8102E" d="M267 0v480h106V0H267zM0 187v106h640V187H0z"/>
                  </svg>
                  <span className="lang-label">Eng</span>
                </button>
              </div>

              {/* Зелёная кнопка «На сайт фирмы» -> ссылка https://www.infraks.uz/ (по требованию 2) */}
              <a 
                href="https://www.infraks.uz/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="firm-site-btn"
                title={t('nav_firm_title')}
              >
                {t('nav_firm_site')}
              </a>
            </div>

            {/* Mobile hamburger button */}
            <button
              className="mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Открыть мобильное меню"
            >
              {mobileOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Нижний ярус шапки: Меню по центру с серой линией снизу и тенью */}
      <div className="header-bottom">
        <div className="container header-bottom-inner">
          <nav className="desktop-nav">
            <ul className="nav-menu">
              <li className="nav-item">
                <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end>
                  {t('nav_home')}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/autor" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  {t('nav_about')}
                </NavLink>
              </li>
              
              {/* Developments Dropdown */}
              <li className="nav-item">
                <button className="nav-link" type="button">
                  {t('nav_developments')} <ChevronDown size={14} />
                </button>
                <ul className="dropdown-menu">
                  {developments.map((dev) => (
                    <li key={dev.path}>
                      <Link to={dev.path} className="dropdown-link">
                        <Lightbulb size={16} color="#0284c7" />
                        <span>{dev.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Publications Dropdown (без цифр) */}
              <li className="nav-item">
                <button className="nav-link" type="button">
                  {t('nav_publications')} <ChevronDown size={14} />
                </button>
                <ul className="dropdown-menu">
                  {publications.map((pub) => (
                    <li key={pub.path}>
                      <Link to={pub.path} className="dropdown-link">
                        <BookOpen size={16} color="#0284c7" />
                        <span>{pub.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Links Dropdown */}
              <li className="nav-item">
                <button className="nav-link" type="button">
                  {t('nav_links')} <ChevronDown size={14} />
                </button>
                <ul className="dropdown-menu">
                  {externalLinks.map((link) => (
                    <li key={link.url}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="dropdown-link">
                        <ExternalLink size={16} color="#64748b" />
                        <span>{link.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Мобильное всплывающее меню */}
      <div className={`mobile-drawer ${mobileOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-header">
          <div className="mobile-widget-row">
            <div className="lang-switcher">
              <button 
                type="button" 
                className={`lang-btn ${lang === 'ru' ? 'active' : ''}`}
                onClick={() => setLang('ru')}
              >
                <span>🇷🇺 Рус</span>
              </button>
              <button 
                type="button" 
                className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                onClick={() => setLang('en')}
              >
                <span>🇬🇧 Eng</span>
              </button>
            </div>
            <a 
              href="https://www.infraks.uz/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="firm-site-btn mobile-firm-btn"
            >
              {t('nav_firm_site')}
            </a>
          </div>
        </div>

        <ul className="mobile-nav-list">
          <li className="mobile-nav-item">
            <Link to="/" className="mobile-nav-link" onClick={closeMobile}>{t('nav_home')}</Link>
          </li>
          <li className="mobile-nav-item">
            <Link to="/autor" className="mobile-nav-link" onClick={closeMobile}>{t('nav_about')}</Link>
          </li>
          
          <li className="mobile-nav-item">
            <div className="mobile-nav-link" onClick={() => setMobileDevOpen(!mobileDevOpen)}>
              <span>{t('nav_developments')}</span>
              <ChevronDown size={18} style={{ transform: mobileDevOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>
            {mobileDevOpen && (
              <ul className="mobile-subnav">
                {developments.map((d) => (
                  <li key={d.path}>
                    <Link to={d.path} className="mobile-subnav-link" onClick={closeMobile}>
                      {d.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li className="mobile-nav-item">
            <div className="mobile-nav-link" onClick={() => setMobilePubOpen(!mobilePubOpen)}>
              <span>{t('nav_publications')}</span>
              <ChevronDown size={18} style={{ transform: mobilePubOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>
            {mobilePubOpen && (
              <ul className="mobile-subnav">
                {publications.map((p) => (
                  <li key={p.path}>
                    <Link to={p.path} className="mobile-subnav-link" onClick={closeMobile}>
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li className="mobile-nav-item">
            <div className="mobile-nav-link" onClick={() => setMobileLinksOpen(!mobileLinksOpen)}>
              <span>{t('nav_links')}</span>
              <ChevronDown size={18} style={{ transform: mobileLinksOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>
            {mobileLinksOpen && (
              <ul className="mobile-subnav">
                {externalLinks.map((l) => (
                  <li key={l.url}>
                    <a href={l.url} target="_blank" rel="noopener noreferrer" className="mobile-subnav-link" onClick={closeMobile}>
                      {l.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}
