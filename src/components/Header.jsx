import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ChevronDown, 
  Menu, 
  X, 
  ExternalLink, 
  Lightbulb, 
  BookOpen, 
  Mail, 
  Search,
  FileText,
  Award,
  FileCheck,
  Globe
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { searchContent } from '../utils/searchIndex';
import '../styles/header.css';
import '../styles/search.css';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDevOpen, setMobileDevOpen] = useState(false);
  const [mobilePubOpen, setMobilePubOpen] = useState(false);
  const [mobileLinksOpen, setMobileLinksOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Состояние выпадающей строки поиска под меню (как на infraks.uz)
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const timeoutRef = useRef(null);
  const searchInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, setLang, t } = useLanguage();

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileDevOpen(false);
    setMobilePubOpen(false);
    setMobileLinksOpen(false);
  };

  const handleDropdownItemClick = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(null);
    closeMobile();
    if (document.activeElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }
  };

  const handleMouseEnter = (name) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const handleFocus = (name) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(name);
  };

  const handleBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setActiveDropdown(null);
    }
  };

  // Автофокус при раскрытии строки поиска
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 60);
    } else {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [searchOpen]);

  // Живой поиск при вводе запроса
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const res = searchContent(searchQuery, 'all');
    setSearchResults(res);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      handleSelectResult(searchResults[0]);
    } else if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleSelectResult = (item) => {
    setSearchOpen(false);
    setSearchQuery('');
    if (item.externalUrl && !item.url) {
      window.open(item.externalUrl, '_blank', 'noopener,noreferrer');
    } else if (item.url) {
      navigate(item.url);
    }
  };

  const renderResultIcon = (type) => {
    switch (type) {
      case 'lightbulb':
        return <Lightbulb size={16} color="#0284c7" className="search-row-icon" />;
      case 'fileText':
        return <FileText size={16} color="#059669" className="search-row-icon" />;
      case 'award':
        return <Award size={16} color="#d97706" className="search-row-icon" />;
      case 'book':
        return <BookOpen size={16} color="#7c3aed" className="search-row-icon" />;
      case 'fileCheck':
        return <FileCheck size={16} color="#0891b2" className="search-row-icon" />;
      default:
        return <Globe size={16} color="#475569" className="search-row-icon" />;
    }
  };

  // Закрывать меню и поиск при смене страницы
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(null);
    setSearchOpen(false);
    setSearchQuery('');
    closeMobile();
  }, [location.pathname]);

  // Закрытие при клике вне меню и по клавише Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.nav-item') && !e.target.closest('.header-search-bar')) {
        setActiveDropdown(null);
      }
    };
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
        setActiveDropdown(null);
      } else if (e.key === 'Escape') {
        setActiveDropdown(null);
        setSearchOpen(false);
        setSearchQuery('');
        closeMobile();
      }
    };
    document.addEventListener('click', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

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
            <img src="/images/logo_new.svg" alt="Керамика Синтез — Профессор Рахимов Р.Х." className="brand-logo" />
          </Link>

          {/* Правая часть: Email + Виджет переключения языков + Кнопка на сайт фирмы + Бургер */}
          <div className="header-top-right">
            {/* Email текст с иконкой конвертика без рамки и ссылки */}
            <div className="header-email-text" title="rustam-shsul@yandex.com">
              <Mail size={16} className="email-icon" />
              <span>rustam-shsul@yandex.com</span>
            </div>

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
                <NavLink 
                  to="/" 
                  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} 
                  end
                  onClick={handleDropdownItemClick}
                >
                  {t('nav_home')}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  to="/autor" 
                  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                  onClick={handleDropdownItemClick}
                >
                  {t('nav_about')}
                </NavLink>
              </li>
              
              {/* Developments Dropdown */}
              <li 
                className={`nav-item ${activeDropdown === 'developments' ? 'is-open' : ''}`}
                onMouseEnter={() => handleMouseEnter('developments')}
                onMouseLeave={handleMouseLeave}
                onFocus={() => handleFocus('developments')}
                onBlur={handleBlur}
              >
                <button 
                  className="nav-link" 
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === 'developments' ? null : 'developments')}
                  aria-expanded={activeDropdown === 'developments'}
                >
                  {t('nav_developments')} <ChevronDown size={14} className="dropdown-chevron" />
                </button>
                <ul className="dropdown-menu">
                  {developments.map((dev) => (
                    <li key={dev.path}>
                      <Link 
                        to={dev.path} 
                        className="dropdown-link"
                        onClick={handleDropdownItemClick}
                      >
                        <Lightbulb size={16} color="#0284c7" />
                        <span>{dev.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Publications Dropdown (без цифр) */}
              <li 
                className={`nav-item ${activeDropdown === 'publications' ? 'is-open' : ''}`}
                onMouseEnter={() => handleMouseEnter('publications')}
                onMouseLeave={handleMouseLeave}
                onFocus={() => handleFocus('publications')}
                onBlur={handleBlur}
              >
                <button 
                  className="nav-link" 
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === 'publications' ? null : 'publications')}
                  aria-expanded={activeDropdown === 'publications'}
                >
                  {t('nav_publications')} <ChevronDown size={14} className="dropdown-chevron" />
                </button>
                <ul className="dropdown-menu">
                  {publications.map((pub) => (
                    <li key={pub.path}>
                      <Link 
                        to={pub.path} 
                        className="dropdown-link"
                        onClick={handleDropdownItemClick}
                      >
                        <BookOpen size={16} color="#0284c7" />
                        <span>{pub.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Links Dropdown */}
              <li 
                className={`nav-item ${activeDropdown === 'links' ? 'is-open' : ''}`}
                onMouseEnter={() => handleMouseEnter('links')}
                onMouseLeave={handleMouseLeave}
                onFocus={() => handleFocus('links')}
                onBlur={handleBlur}
              >
                <button 
                  className="nav-link" 
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === 'links' ? null : 'links')}
                  aria-expanded={activeDropdown === 'links'}
                >
                  {t('nav_links')} <ChevronDown size={14} className="dropdown-chevron" />
                </button>
                <ul className="dropdown-menu">
                  {externalLinks.map((link) => (
                    <li key={link.url}>
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="dropdown-link"
                        onClick={handleDropdownItemClick}
                      >
                        <ExternalLink size={16} color="#64748b" />
                        <span>{link.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Search Button */}
              <li className="nav-item">
                <button 
                  type="button" 
                  className={`nav-link search-nav-btn ${searchOpen ? 'active' : ''}`}
                  onClick={() => {
                    setActiveDropdown(null);
                    setSearchOpen(!searchOpen);
                  }}
                  title={`${t('nav_search')} (Ctrl+K)`}
                  aria-label={t('nav_search')}
                >
                  <Search size={15} className="search-nav-icon" />
                  <span>{t('nav_search')}</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* 3. Опускающаяся строка поиска под меню (как на infraks.uz) */}
      {searchOpen && (
        <div className="header-search-bar">
          <div className="container">
            <form onSubmit={handleSearchSubmit} className="search-bar-form">
              <div className="search-input-wrap">
                <Search size={17} className="search-bar-field-icon" />
                <input
                  ref={searchInputRef}
                  type="text"
                  className="search-input-field"
                  placeholder={lang === 'ru' 
                    ? 'Поиск по научным материалам, разработкам, статьям, патентам...' 
                    : 'Search scientific developments, articles, patents...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="search-bar-clear-btn"
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    title={lang === 'ru' ? 'Очистить' : 'Clear'}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <button type="submit" className="search-submit-btn">
                <Search size={15} />
                <span>{lang === 'ru' ? 'Найти' : 'Search'}</span>
              </button>
              <button 
                type="button" 
                className="search-close-btn" 
                onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                title={lang === 'ru' ? 'Закрыть' : 'Close'}
                aria-label="Закрыть"
              >
                <X size={18} />
              </button>
            </form>

            {/* Выпадающие живые результаты под строкой поиска */}
            {searchQuery.trim() && (
              <div className="search-dropdown-results">
                {searchResults.length === 0 ? (
                  <div className="search-no-results">
                    {lang === 'ru' ? 'По вашему запросу ничего не найдено' : 'No results found for your query'}
                  </div>
                ) : (
                  <div className="search-results-scroll">
                    <div className="search-results-count-bar">
                      <span>{t('search_found_results')} <strong>{searchResults.length}</strong></span>
                    </div>
                    {searchResults.slice(0, 8).map((item, idx) => (
                      <div
                        key={idx}
                        className="search-result-row"
                        onClick={() => handleSelectResult(item)}
                      >
                        <div className="search-result-row-title">
                          {renderResultIcon(item.iconType)}
                          <span className="search-row-title-text">{item.title}</span>
                          <span className={`search-row-badge cat-${item.category}`}>{item.badge}</span>
                        </div>
                        {item.subtitle && (
                          <div className="search-result-row-sub">{item.subtitle}</div>
                        )}
                        {item.description && (
                          <p className="search-result-row-snippet">
                            {item.description.slice(0, 140)}...
                          </p>
                        )}
                      </div>
                    ))}
                    {searchResults.length > 8 && (
                      <div className="search-more-wrap">
                        <button
                          type="button"
                          className="search-more-btn"
                          onClick={() => {
                            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                            setSearchOpen(false);
                            setSearchQuery('');
                          }}
                        >
                          {lang === 'ru' 
                            ? `Посмотреть все результаты (${searchResults.length}) →` 
                            : `View all results (${searchResults.length}) →`}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

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

          {/* Кнопка Поиск в мобильном меню */}
          <li className="mobile-nav-item">
            <button 
              type="button" 
              className="mobile-nav-link mobile-search-btn"
              onClick={() => {
                closeMobile();
                setSearchOpen(true);
              }}
            >
              <span className="mobile-search-label">
                <Search size={18} />
                <span>{t('nav_search')}</span>
              </span>
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}
