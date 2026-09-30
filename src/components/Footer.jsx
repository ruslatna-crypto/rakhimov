import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import '../styles/footer.css';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="container">
        <p className="footer-copyright-text">
          © {new Date().getFullYear()} OOO "Keramika Sintez". {t('footer_copyright')}
        </p>
      </div>
    </footer>
  );
}

