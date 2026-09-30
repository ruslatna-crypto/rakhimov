import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send, Facebook, Linkedin, Youtube, ExternalLink } from 'lucide-react';
import '../styles/footer.css';

export default function Footer() {
  return (
    <footer className="site-footer" id="contacts">
      <div className="container">
        <div className="footer-top">
          {/* Brand Info */}
          <div className="footer-brand-info">
            <Link to="/">
              <img src="/images/logo_new.svg" alt="Керамика Синтез" className="footer-logo" />
            </Link>
            <p className="footer-desc">
              Научно-технический портал доктора технических наук, профессора Рустама Хакимовича Рахимова.
              Разработки в области солнечной энергетики, импульсного туннельного эффекта и функциональных материалов.
            </p>
            <div className="footer-social-links">
              <a href="https://t.me/ZapUser2690924761" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="Telegram">
                <Send size={18} />
              </a>
              <a href="https://www.facebook.com/rakhimovrkh/" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="Facebook">
                <Facebook size={18} />
              </a>
              <a href="https://www.linkedin.com/in/%D1%80%D1%83%D1%81%D1%82%D0%B0%D0%BC-%D1%85%D0%B0%D0%BA%D0%B8%D0%BC%D0%BE%D0%B2%D0%B8%D1%87-%D1%80%D0%B0%D1%85%D0%B8%D0%BC%D0%BE%D0%B2-865859bb/" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="https://www.youtube.com/channel/UCWM_y8BQDlOpUtIDcTJ4ysQ" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="YouTube">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Developments Column */}
          <div>
            <h4 className="footer-heading">Разработки</h4>
            <ul className="footer-links-list">
              <li><Link to="/sushka" className="footer-link">Сушка овощей и фруктов</Link></li>
              <li><Link to="/lamp" className="footer-link">Медицинские лампы</Link></li>
              <li><Link to="/kalci" className="footer-link">Активный кальций</Link></li>
              <li><Link to="/pech" className="footer-link">Жарочные печи</Link></li>
              <li><Link to="/plenka" className="footer-link">Пленочный композит</Link></li>
              <li><Link to="/kraska" className="footer-link">Сушка лаков и красок</Link></li>
              <li><Link to="/steril" className="footer-link">Стерилизаторы</Link></li>
              <li><Link to="/cotton" className="footer-link">Сушка хлопка</Link></li>
              <li><Link to="/bsp" className="footer-link">Материалы на БСП</Link></li>
            </ul>
          </div>

          {/* Publications Column */}
          <div>
            <h4 className="footer-heading">Публикации</h4>
            <ul className="footer-links-list">
              <li><Link to="/stat" className="footer-link">Статьи (136)</Link></li>
              <li><Link to="/book" className="footer-link">Книги и монографии (9)</Link></li>
              <li><Link to="/patents" className="footer-link">Патенты (73)</Link></li>
              <li><Link to="/akt" className="footer-link">Акты и заключения (57)</Link></li>
              <li><Link to="/autor" className="footer-link">Биография автора</Link></li>
            </ul>
          </div>

          {/* Contacts Column */}
          <div>
            <h4 className="footer-heading">Контакты</h4>
            <ul className="footer-links-list">
              <li style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>
                <strong>E-mail:</strong><br />
                <a href="mailto:rustam-shsul@yandex.com" style={{ color: '#38bdf8' }}>rustam-shsul@yandex.com</a>
              </li>
              <li style={{ color: '#cbd5e1', fontSize: '0.875rem', marginTop: '10px' }}>
                <strong>Партнерский ресурс:</strong><br />
                <a href="http://infraks.ru/" target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8' }}>infraks.ru ↗</a>
              </li>
              <li style={{ color: '#94a3b8', fontSize: '0.8125rem', marginTop: '10px' }}>
                Ташкент, Узбекистан<br />
                Институт Материаловедения АН РУз
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>
            © Все права защищены. 2025. OOO &quot;Keramika Sintez&quot;
          </div>
          <div>
            Персональный портал д.т.н., профессора Р.Х. Рахимова
          </div>
        </div>
      </div>
    </footer>
  );
}
