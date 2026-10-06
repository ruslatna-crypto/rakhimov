import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import '../styles/scrollTop.css';

export default function ScrollTopButton() {
  const [visible, setVisible] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      // Показываем кнопку, если пользователь проскроллил вниз более чем на 250px
      if (window.scrollY > 250) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`scroll-top-btn ${visible ? 'is-visible' : ''}`}
      aria-label={lang === 'en' ? 'Scroll to top' : 'Наверх'}
      title={lang === 'en' ? 'Scroll to top' : 'Наверх'}
    >
      <ChevronUp size={28} strokeWidth={2.8} className="scroll-top-icon" />
    </button>
  );
}
