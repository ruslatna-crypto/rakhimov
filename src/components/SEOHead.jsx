import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import seoConfig from '../data/seoData.json';

const { BASE_URL, DEFAULT_IMAGE, seoData } = seoConfig;
export { BASE_URL, DEFAULT_IMAGE, seoData };

/**
 * Утилита для безопасной установки/обновления meta тегов в document.head
 */
function setMetaTag(nameOrProperty, isProperty, content) {
  if (typeof document === 'undefined') return;
  const attr = isProperty ? 'property' : 'name';
  let element = document.querySelector(`meta[${attr}="${nameOrProperty}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, nameOrProperty);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Утилита для безопасной установки или удаления link[rel="canonical"]
 */
function updateCanonical(canonicalUrl) {
  if (typeof document === 'undefined') return;
  let element = document.querySelector('link[rel="canonical"]');
  if (canonicalUrl) {
    if (!element) {
      element = document.createElement('link');
      element.setAttribute('rel', 'canonical');
      document.head.appendChild(element);
    }
    element.setAttribute('href', canonicalUrl);
  } else if (element) {
    element.remove();
  }
}

/**
 * Универсальный переиспользуемый SEO-компонент
 */
export default function SEOHead() {
  const { pathname } = useLocation();
  const { lang } = useLanguage();

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const currentLang = lang === 'en' ? 'en' : 'ru';
    // Нормализация pathname: убираем завершающий слеш для всех страниц кроме главной
    const cleanPath = pathname.length > 1 && pathname.endsWith('/')
      ? pathname.replace(/\/+$/, '')
      : pathname;

    const is404 = !seoData[cleanPath];
    const pageConfig = seoData[cleanPath] || seoData['404'];
    const { title, description } = pageConfig[currentLang] || pageConfig['ru'];

    // 1. Title
    document.title = title;

    // 2. Meta Description
    setMetaTag('description', false, description);

    // 3. Meta Robots: /search и 404 закрываем от индексации
    const isNoIndex = cleanPath === '/search' || is404;
    setMetaTag('robots', false, isNoIndex ? 'noindex, follow' : 'index, follow');

    // 4. Canonical: для 404 и /search canonical не создается / удаляется
    if (!isNoIndex) {
      const canonicalUrl = cleanPath === '/' ? `${BASE_URL}/` : `${BASE_URL}${cleanPath}`;
      updateCanonical(canonicalUrl);
    } else {
      updateCanonical(null);
    }

    // 5. Open Graph
    const pageUrl = cleanPath === '/' ? `${BASE_URL}/` : `${BASE_URL}${cleanPath}`;
    setMetaTag('og:title', true, title);
    setMetaTag('og:description', true, description);
    setMetaTag('og:url', true, pageUrl);
    setMetaTag('og:image', true, DEFAULT_IMAGE);
    setMetaTag('og:type', true, 'website');
    setMetaTag(
      'og:site_name',
      true,
      currentLang === 'en'
        ? 'Prof. Rakhimov R.Kh. — Scientific Portal'
        : 'Портал профессора Рахимова Р.Х.'
    );

    // 6. Twitter Card
    setMetaTag('twitter:card', false, 'summary_large_image');
    setMetaTag('twitter:title', false, title);
    setMetaTag('twitter:description', false, description);
    setMetaTag('twitter:image', false, DEFAULT_IMAGE);

    // 7. Язык документа
    document.documentElement.lang = currentLang;
  }, [pathname, lang]);

  return null;
}
