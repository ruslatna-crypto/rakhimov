import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ChevronDown, Menu, X, Mail, ExternalLink, Lightbulb, BookOpen, Layers, Award, FileText } from 'lucide-react';
import '../styles/header.css';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDevOpen, setMobileDevOpen] = useState(false);
  const [mobilePubOpen, setMobilePubOpen] = useState(false);
  const [mobileLinksOpen, setMobileLinksOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  const developments = [
    { title: 'Сушка овощей и фруктов', path: '/sushka' },
    { title: 'Инфракрасные медицинские лампы', path: '/lamp' },
    { title: 'Активный кальций', path: '/kalci' },
    { title: 'Жарочные печи', path: '/pech' },
    { title: 'Пленочно-керамический композит', path: '/plenka' },
    { title: 'Сушка лаков и краски', path: '/kraska' },
    { title: 'Стерилизаторы', path: '/steril' },
    { title: 'Сушка хлопка', path: '/cotton' },
    { title: 'Материалы полученные на БСП', path: '/bsp' }
  ];

  const publications = [
    { title: 'Научные статьи (136)', path: '/stat' },
    { title: 'Монографии и книги (9)', path: '/book' },
    { title: 'Патенты и свидетельства (73)', path: '/patents' },
    { title: 'Акты и заключения (57)', path: '/akt' }
  ];

  const externalLinks = [
    { title: 'Cyberleninka', url: 'https://cyberleninka.ru/article/n/rahimov-rustam-hakimovich' },
    { title: 'Персоналии (Math-Net.ru)', url: 'https://www.mathnet.ru/rus/person114518' },
    { title: 'ResearchGate', url: 'https://www.researchgate.net/profile/Rustam-Rakhimov' },
    { title: 'Semantic Scholar', url: 'https://www.semanticscholar.org/author/%D0%A0%D0%B0%D1%85%D0%B8%D0%BC%D0%BE%D0%B2-%D0%A0%D1%83%D1%81%D1%82%D0%B0%D0%BC-%D0%A5%D0%B0%D0%BA%D0%B8%D0%BC%D0%BE%D0%B2%D0%B8%D1%87/112831501' }
  ];

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* Brand */}
        <Link to="/" className="brand-link" onClick={closeMobile}>
          <img src="/images/logo_new.svg" alt="Керамика Синтез" className="brand-logo" />
          <div className="brand-text">
            <span className="brand-title">Профессор Р.Х. Рахимов</span>
            <span className="brand-subtitle">Гелиотехнологии & Функциональная керамика</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav>
          <ul className="nav-menu">
            <li className="nav-item">
              <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end>
                Главная
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/autor" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                О себе
              </NavLink>
            </li>
            
            {/* Developments Dropdown */}
            <li className="nav-item">
              <button className="nav-link" type="button">
                Разработки <ChevronDown size={14} />
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

            {/* Publications Dropdown */}
            <li className="nav-item">
              <button className="nav-link" type="button">
                Публикации <ChevronDown size={14} />
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
                Ссылки <ChevronDown size={14} />
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

        {/* Contact CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a href="mailto:rustam-shsul@yandex.com" className="header-contact-btn">
            <Mail size={14} />
            <span>Связаться</span>
          </a>

          {/* Mobile hamburger */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Открыть меню"
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${mobileOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-list">
          <li className="mobile-nav-item">
            <Link to="/" className="mobile-nav-link" onClick={closeMobile}>Главная</Link>
          </li>
          <li className="mobile-nav-item">
            <Link to="/autor" className="mobile-nav-link" onClick={closeMobile}>О себе</Link>
          </li>
          
          <li className="mobile-nav-item">
            <div className="mobile-nav-link" onClick={() => setMobileDevOpen(!mobileDevOpen)}>
              <span>Разработки</span>
              <ChevronDown size={18} style={{ transform: mobileDevOpen ? 'rotate(180deg)' : 'none' }} />
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
              <span>Публикации</span>
              <ChevronDown size={18} style={{ transform: mobilePubOpen ? 'rotate(180deg)' : 'none' }} />
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
              <span>Научные профили</span>
              <ChevronDown size={18} style={{ transform: mobileLinksOpen ? 'rotate(180deg)' : 'none' }} />
            </div>
            {mobileLinksOpen && (
              <ul className="mobile-subnav">
                {externalLinks.map((l) => (
                  <li key={l.url}>
                    <a href={l.url} target="_blank" rel="noopener noreferrer" className="mobile-subnav-link">
                      {l.title} ↗
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>

        <div style={{ marginTop: '24px' }}>
          <a
            href="mailto:rustam-shsul@yandex.com"
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            <Mail size={16} /> Написать на e-mail
          </a>
        </div>
      </div>
    </header>
  );
}
