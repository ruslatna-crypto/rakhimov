import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollTopButton from './components/ScrollTopButton';
import SEOHead from './components/SEOHead';
import PageLoader from './components/PageLoader';

// Lazy-loaded Pages for Route Code Splitting
const Home = lazy(() => import('./pages/Home'));
const Author = lazy(() => import('./pages/Author'));
const DevelopmentPage = lazy(() => import('./pages/DevelopmentPage'));
const ArticlesPage = lazy(() => import('./pages/ArticlesPage'));
const Conference = lazy(() => import('./pages/Conference'));
const BooksPage = lazy(() => import('./pages/BooksPage'));
const PatentsPage = lazy(() => import('./pages/PatentsPage'));
const AktsPage = lazy(() => import('./pages/AktsPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

import './styles/global.css';

import { LanguageProvider } from './context/LanguageContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <LanguageProvider>
      <SEOHead />
      <ScrollToTop />
      <Header />
      <main className="main-content">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Main Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/autor" element={<Author />} />
            <Route path="/author" element={<Navigate to="/autor" replace />} />

            {/* 9 Scientific Developments */}
            <Route path="/sushka" element={<DevelopmentPage forcedSlug="sushka" />} />
            <Route path="/lamp" element={<DevelopmentPage forcedSlug="lamp" />} />
            <Route path="/kalci" element={<DevelopmentPage forcedSlug="kalci" />} />
            <Route path="/pech" element={<DevelopmentPage forcedSlug="pech" />} />
            <Route path="/plenka" element={<DevelopmentPage forcedSlug="plenka" />} />
            <Route path="/kraska" element={<DevelopmentPage forcedSlug="kraska" />} />
            <Route path="/steril" element={<DevelopmentPage forcedSlug="steril" />} />
            <Route path="/cotton" element={<DevelopmentPage forcedSlug="cotton" />} />
            <Route path="/bsp" element={<DevelopmentPage forcedSlug="bsp" />} />

            {/* Publications & Patents */}
            <Route path="/stat" element={<ArticlesPage />} />
            <Route path="/conference" element={<Conference />} />
            <Route path="/conferences" element={<Navigate to="/conference" replace />} />
            <Route path="/book" element={<BooksPage />} />
            <Route path="/patents" element={<PatentsPage />} />
            <Route path="/akt" element={<AktsPage />} />

            {/* Site Search Page */}
            <Route path="/search" element={<SearchPage />} />

            {/* Aliases & Redirects from Tilda */}
            <Route path="/main" element={<Navigate to="/" replace />} />
            <Route path="/page77759756.html" element={<Navigate to="/book" replace />} />
            <Route path="/Contacts" element={<Navigate to="/#contacts" replace />} />

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <ScrollTopButton />
    </LanguageProvider>
  );
}
