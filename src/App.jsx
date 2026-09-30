import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Author from './pages/Author';
import DevelopmentPage from './pages/DevelopmentPage';
import ArticlesPage from './pages/ArticlesPage';
import BooksPage from './pages/BooksPage';
import PatentsPage from './pages/PatentsPage';
import AktsPage from './pages/AktsPage';
import NotFound from './pages/NotFound';

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
      <ScrollToTop />
      <Header />
      <main className="main-content">
        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/autor" element={<Author />} />

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
          <Route path="/book" element={<BooksPage />} />
          <Route path="/patents" element={<PatentsPage />} />
          <Route path="/akt" element={<AktsPage />} />

          {/* Aliases & Redirects from Tilda */}
          <Route path="/main" element={<Navigate to="/" replace />} />
          <Route path="/page77759756.html" element={<Navigate to="/book" replace />} />
          <Route path="/Contacts" element={<Navigate to="/#contacts" replace />} />

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </LanguageProvider>
  );
}
