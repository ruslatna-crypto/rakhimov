import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send, Facebook, Linkedin, Youtube } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import '../styles/footer.css';

export default function Footer() {
  const { t } = useLanguage();

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
              {t('footer_desc')}
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
            <h4 className="footer-heading">{t('footer_col_dev')}</h4>
            <ul className="footer-links-list">
              <li><Link to="/sushka" className="footer-link">{t('dev_sushka')}</Link></li>
              <li><Link to="/lamp" className="footer-link">{t('dev_lamp')}</Link></li>
              <li><Link to="/kalci" className="footer-link">{t('dev_kalci')}</Link></li>
              <li><Link to="/pech" className="footer-link">{t('dev_pech')}</Link></li>
              <li><Link to="/plenka" className="footer-link">{t('dev_plenka')}</Link></li>
              <li><Link to="/kraska" className="footer-link">{t('dev_kraska')}</Link></li>
              <li><Link to="/steril" className="footer-link">{t('dev_steril')}</Link></li>
              <li><Link to="/cotton" className="footer-link">{t('dev_cotton')}</Link></li>
              <li><Link to="/bsp" className="footer-link">{t('dev_bsp')}</Link></li>
            </ul>
          </div>

          {/* Publications Column */}
          <div>
            <h4 className="footer-heading">{t('footer_col_pub')}</h4>
            <ul className="footer-links-list">
              <li><Link to="/stat" className="footer-link">{t('pub_articles')}</Link></li>
              <li><Link to="/book" className="footer-link">{t('pub_books')}</Link></li>
              <li><Link to="/patents" className="footer-link">{t('pub_patents')}</Link></li>
              <li><Link to="/akt" className="footer-link">{t('pub_akts')}</Link></li>
              <li><Link to="/autor" className="footer-link">{t('nav_about')}</Link></li>
            </ul>
          </div>

          {/* Contacts Column */}
          <div>
            <h4 className="footer-heading">{t('footer_col_contact')}</h4>
            <div className="footer-contact-item">
              <span className="contact-label">{t('contacts_address_label')}</span>
              <span className="contact-value">{t('contacts_address_val')}</span>
            </div>
            <div className="footer-contact-item">
              <span className="contact-label">{t('contacts_email_label')}</span>
              <a href="mailto:rustam-shsul@yandex.com" className="footer-link">rustam-shsul@yandex.com</a>
            </div>
            <div className="footer-contact-item">
              <span className="contact-label">{t('contacts_phone_label')}</span>
              <a href="tel:+998712698055" className="footer-link">+998 71 269-80-55</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {t('footer_copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
