import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import '../styles/slider.css';

const slides = [
  { id: 1, src: '/images/slider/slider1.png', alt: 'Слайд 1 - Научные разработки профессора Рахимова Р.Х.', altEn: 'Slide 1 - Scientific Developments of Professor Rakhimov R.Kh.' },
  { id: 2, src: '/images/slider/slider2.png', alt: 'Слайд 2 - Функциональная керамика и гелиоматериалы', altEn: 'Slide 2 - Functional Ceramics & Solar Materials' },
  { id: 3, src: '/images/slider/slider3.png', alt: 'Слайд 3 - Инфракрасная импульсная сушка', altEn: 'Slide 3 - Resonant Infrared Pulse Drying' },
  { id: 4, src: '/images/slider/slider4.png', alt: 'Слайд 4 - Медицинские керамические лампы INFRA-R', altEn: 'Slide 4 - Medical Ceramic Lamps INFRA-R' },
  { id: 5, src: '/images/slider/slider5.png', alt: 'Слайд 5 - Биопрепарат Активный кальций', altEn: 'Slide 5 - Active Calcium Biopreparation' },
  { id: 6, src: '/images/slider/slider6.png', alt: 'Слайд 6 - Пленочно-керамический композит', altEn: 'Slide 6 - Film-Ceramic Composite' },
  { id: 7, src: '/images/slider/slider7.png', alt: 'Слайд 7 - Стерилизация и термическая обработка', altEn: 'Slide 7 - Pulse Sterilization & Thermal Processing' },
  { id: 8, src: '/images/slider/slider8.png', alt: 'Слайд 8 - Большая Солнечная Печь БСП', altEn: 'Slide 8 - Big Solar Furnace (BSF)' },
];

export default function HeroSlider() {
  const { lang } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance slides every 3 seconds (3000 ms) in an infinite loop
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const goToSlide = (idx) => {
    setCurrentIndex(idx);
  };

  // Touch swipe support for mobile
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 40) {
      nextSlide();
    } else if (distance < -40) {
      prevSlide();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <section className="hero-slider-section">
      <div
        className="hero-slider-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides Track */}
        <div className="hero-slider-track">
          {slides.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={slide.id}
                className={`hero-slide ${isActive ? 'active' : ''}`}
                aria-hidden={!isActive}
              >
                <img
                  src={slide.src}
                  alt={lang === 'en' ? slide.altEn : slide.alt}
                  className="hero-slide-image"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </div>
            );
          })}
        </div>

        {/* Left Arrow Button */}
        <button
          type="button"
          className="slider-nav-btn prev"
          onClick={prevSlide}
          aria-label={lang === 'en' ? 'Previous slide' : 'Предыдущий слайд'}
        >
          <ArrowLeft size={24} strokeWidth={2.5} />
        </button>

        {/* Right Arrow Button */}
        <button
          type="button"
          className="slider-nav-btn next"
          onClick={nextSlide}
          aria-label={lang === 'en' ? 'Next slide' : 'Следующий слайд'}
        >
          <ArrowRight size={24} strokeWidth={2.5} />
        </button>

        {/* Left Bottom Label on all slides at exact same level */}
        <div className="slider-bottom-label">
          {lang === 'en'
            ? 'OBJECT SUN Institute of Materials Science, Academy of Sciences of Uzbekistan'
            : 'ОБЪЕКТ СОЛНЦЕ Институт Материаловедения АН РУз'}
        </div>

        {/* Pagination Indicators (Dots) */}
        <div className="slider-indicators">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`slider-dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(idx)}
              aria-label={lang === 'en' ? `Go to slide ${idx + 1}` : `Перейти к слайду ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
