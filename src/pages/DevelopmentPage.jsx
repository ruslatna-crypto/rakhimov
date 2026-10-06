import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, FileText, Award, X, ChevronLeft, ChevronRight, ExternalLink, Download, Eye } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import developments from '../data/developments.json';
import lampCertificates from '../data/lampCertificates.json';
import kalciCertificates from '../data/kalciCertificates.json';
import sterilCertificates from '../data/sterilCertificates.json';
import sushkaCertificates from '../data/sushkaCertificates.json';
import lampPdfs from '../data/lampPdfs.json';
import kalciPdfs from '../data/kalciPdfs.json';
import sterilPdfs from '../data/sterilPdfs.json';
import DryingChart from '../components/DryingChart';
import '../styles/pages.css';

export default function DevelopmentPage({ forcedSlug }) {
  const params = useParams();
  const slug = forcedSlug || params.slug;
  const { t, lang } = useLanguage();
  const [activeCert, setActiveCert] = useState(null);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [modalImage, setModalImage] = useState(null);
  const [activePdf, setActivePdf] = useState(null);

  const openModalImage = (src, title) => {
    setModalImage({ src, title });
  };

  const dev = developments.find((d) => d.slug === slug);
  const activeCertList = (slug === 'sushka' || activeCert?.src?.includes('sushka') || activeCert?.cover?.includes('sushka'))
    ? sushkaCertificates
    : (slug === 'steril' || activeCert?.src?.includes('steril') || activeCert?.cover?.includes('steril'))
      ? sterilCertificates
      : (slug === 'kalci' || activeCert?.cover?.includes('kalci'))
        ? kalciCertificates
        : lampCertificates;

  const openCert = (cert) => {
    setActiveCert(cert);
    setActivePageIndex(0);
  };

  const handlePrevCert = () => {
    if (!activeCert) return;
    if (activePageIndex > 0) {
      setActivePageIndex(activePageIndex - 1);
    } else {
      const currentIndex = activeCertList.findIndex(c => c.id === activeCert.id);
      const prevIndex = (currentIndex - 1 + activeCertList.length) % activeCertList.length;
      const prevCert = activeCertList[prevIndex];
      setActiveCert(prevCert);
      setActivePageIndex((prevCert.pages?.length || 1) - 1);
    }
  };

  const handleNextCert = () => {
    if (!activeCert) return;
    const pageCount = activeCert.pages?.length || 1;
    if (activePageIndex < pageCount - 1) {
      setActivePageIndex(activePageIndex + 1);
    } else {
      const currentIndex = activeCertList.findIndex(c => c.id === activeCert.id);
      const nextIndex = (currentIndex + 1) % activeCertList.length;
      setActiveCert(activeCertList[nextIndex]);
      setActivePageIndex(0);
    }
  };

  useEffect(() => {
    if (activeCert || modalImage || activePdf) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeCert, modalImage, activePdf]);

  useEffect(() => {
    if (!activeCert && !modalImage && !activePdf) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveCert(null);
        setModalImage(null);
        setActivePdf(null);
      }
      if (e.key === 'ArrowLeft') handlePrevCert();
      if (e.key === 'ArrowRight') handleNextCert();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCert, activePageIndex, modalImage, activePdf]);

  if (!dev) {
    return <Navigate to="/" replace />;
  }

  // In English mode, get translated title if available
  const devTitle = t(`dev_${slug}`) !== `dev_${slug}` ? t(`dev_${slug}`) : dev.title;

  return (
    <div className="dev-page-wrapper">
      <div className="container">
        {/* Хлебные крошки (нормальный путь по рис. 2) */}
        <nav aria-label="breadcrumb" style={{ margin: '24px 0 20px 0' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.9375rem' }}>
            <Link to="/" style={{ color: '#64748b', textDecoration: 'none' }}>
              {t('dev_breadcrumb_home')}
            </Link>
            <span style={{ color: '#94a3b8' }}>/</span>
            <Link to="/#developments" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '500' }}>
              {t('dev_breadcrumb_devs')}
            </Link>
          </div>
        </nav>

        {/* Main Content Layout */}
        <div className="dev-detail-layout">
          <div className="dev-detail-grid">
            {/* Scientific Text (Verbatim) */}
            <article className="dev-text-content">
              <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '24px', color: '#0f172a', lineHeight: '1.25' }}>
                {devTitle}
              </h1>

              {slug === 'sushka' ? (
                <>
                  <div className="sushka-intro-row">
                    <div className="sushka-intro-text">
                      <h2>
                        {lang === 'en' ? 'Principle of Infrared Drying' : 'Принцип инфракрасной сушки'}
                      </h2>
                      <p>
                        {lang === 'en'
                          ? 'Drying is based on the use of infrared radiation, which is absorbed by water and practically not absorbed by the product itself. In installations with functional ceramics, pulsed irradiation is used, ensuring active moisture removal from the product. An essential part of the process is the extraction of resulting steam from the working chamber.'
                          : 'Сушка основана на использовании инфракрасного излучения, которое поглощается водой и практически не поглощается самим продуктом. В установках с функциональной керамикой применяется импульсное облучение, обеспечивающее активное удаление влаги из продукта. Важной частью процесса является отвод образующегося пара из рабочей зоны.'}
                      </p>
                      <p>
                        {lang === 'en'
                          ? 'Ejector and labyrinth systems are used for steam extraction. Steam retention in the working volume increases its radiation absorption and can lead to product overheating, darkening, and uneven drying.'
                          : 'Для отвода пара применяются эжекторная и лабиринтная системы. Задержка пара в рабочем объёме увеличивает его поглощение излучения и может приводить к нагреву продукта, потемнению и неоднородной сушке.'}
                      </p>
                    </div>

                    <div className="sushka-intro-img-col">
                      <img
                        src="/images/sushka_uzb.webp"
                        alt={lang === 'en' ? 'Infrared drying unit Uzbekistan' : 'Сушильная установка «Узбекистан»'}
                        className="sushka-intro-img"
                      />
                    </div>
                  </div>

                  {/* Изображение Этапы сушки (etapi.png / etapi_eng.png) */}
                  <div style={{ margin: '28px 0', textAlign: 'center' }}>
                    <img
                      src={lang === 'en' ? '/images/etapi_eng.webp' : '/images/etapi.webp'}
                      alt={lang === 'en' ? 'Drying stages diagram' : 'Схема этапов сушки'}
                      style={{
                        width: '100%',
                        maxWidth: '960px',
                        height: 'auto',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'block',
                        margin: '0 auto'
                      }}
                    />
                  </div>

                  <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '14px' }}>
                    {lang === 'en' ? 'Drying of Fruits and Vegetables' : 'Сушка овощей и фруктов'}
                  </h2>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '14px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'To refine ceramic formulations and drying regimes, various fruits and vegetables were investigated. The reported test series features onion, Eryngium, dill, yellow bell pepper, tomatoes, potatoes, carrots, and pineapple. For each item, drying temperature, initial and final moisture content, moisture reduction, and process duration are documented.'
                      : 'Для отработки состава керамики и режимов сушки исследовались различные овощи и фрукты. В приведённой серии испытаний представлены лук, Eryngium, укроп, жёлтый перец, помидоры, картофель, морковь и ананас. Для них указаны температура сушки, исходная и конечная влажность, снижение влажности и продолжительность процесса.'}
                  </p>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '14px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'For the "Vostok — InfraR" installation, operating temperatures were 55–60 °C for onion and Eryngium and 60–65 °C for all other tested products. Initial moisture ranged from 78.28% to 94.66%, and final moisture was reduced to 8.11–10.81%.'
                      : 'Для «Восток — InfraR» температура составляла 55–60 °C для лука и Eryngium и 60–65 °C для остальных перечисленных продуктов. Исходная влажность находилась в диапазоне 78,28–94,66 %, конечная — 8,11–10,81 %.'}
                  </p>

                  {/* Изображение Продолжительность сушки (time.png / time_eng.png) */}
                  <div style={{ margin: '28px 0', textAlign: 'center' }}>
                    <img
                      src={lang === 'en' ? '/images/time_eng.webp' : '/images/time.webp'}
                      alt={lang === 'en' ? 'Drying duration and parameters' : 'Параметры и продолжительность сушки'}
                      style={{
                        width: '100%',
                        maxWidth: '960px',
                        height: 'auto',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'block',
                        margin: '0 auto'
                      }}
                    />
                  </div>

                  <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '14px' }}>
                    {lang === 'en' ? 'Test Results' : 'Результаты испытаний'}
                  </h2>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '14px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'Drying duration on "Vostok — InfraR" in the reported series was 3.03–6.20 hours. For the comparative Chinese dryer, it was 7.25–14.10 hours. For all eight products, the processing time on "Vostok — InfraR" was shorter.'
                      : 'Продолжительность сушки на «Восток — InfraR» в приведённой серии составляла 3,03–6,20 часа. Для сравниваемой сушилки производства Китая — 7,25–14,10 часа. Для всех восьми продуктов указанное время на «Восток — InfraR» было меньше.'}
                  </p>

                  {/* Интерактивная диаграмма времени сушки */}
                  <DryingChart />

                  <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '14px' }}>
                    {lang === 'en' ? 'Product Quality Preservation' : 'Сохранение качества продукта'}
                  </h2>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '14px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'Under properly selected operating regimes, the product must not overheat. Descriptions of functional ceramic drying units emphasize operation at comparatively low temperatures and preservation of the dried product\'s natural appearance. For the first commercial series dryer "UZBEKISTAN", it is specifically noted that herbs retain their original visual appearance, natural aroma, and flavor after drying.'
                      : 'При правильно выбранном режиме продукт не должен перегреваться. В описании сушилок с функциональной керамикой отмечается работа при сравнительно невысоких температурах и сохранение внешнего вида высушенной продукции. Для первой серийной сушилки «УЗБЕКИСТАН» отдельно отмечено, что после сушки внешний вид зелени не меняется, а также сохраняются запах и вкус.'}
                  </p>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '14px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'When selecting the ceramic formulation, product quality was carefully balanced: overly intense exposure can degrade the outcome. For the investigated system, mullite containing more than 0.5–1% pulsed ceramics was identified as optimal.'
                      : 'При подборе состава керамики учитывалось качество овощей и фруктов: слишком жёсткое воздействие может ухудшать результат. Для исследованной системы наиболее оптимальным был признан муллит с содержанием импульсной керамики более 0,5–1 %.'}
                  </p>

                  <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '14px' }}>
                    {lang === 'en' ? 'Drying Installations' : 'Сушильные установки'}
                  </h2>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '14px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'In drying cabinets, products are loaded on trays. Emitters are mounted above and below the working area; their placement is calculated to form an exceptionally uniform irradiation field. As moisture diminishes, a finishing drying regime with reduced power may be engaged.'
                      : 'В сушильных шкафах продукция размещается на поддонах. Излучатели располагаются сверху и снизу рабочей зоны; их размещение рассчитывается для формирования равномерной зоны облучения. По мере уменьшения влажности может применяться режим досушки с уменьшением мощности.'}
                  </p>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '14px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'For the "Astra" unit, drying temperatures of 45–60 °C and processing times ranging from 15 to 400 minutes depending on the product are specified. For herbs, drying takes about 15 minutes; for dried apricots, plums, carrots, and onions — 3–4 hours.'
                      : 'Для установки «Астра» указана температура сушки 45–60 °C и время сушки от 15 до 400 минут в зависимости от продукта. Для зелени указано около 15 минут, для урюка, слив, моркови и лука — 3–4 часа.'}
                  </p>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '14px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'For the domestic dryer "Pichuga", a batch capacity of up to 1.2 kg and drying duration of 0.5–12 hours are documented. Apples require 4–5 hours, apricots 10–12 hours, grapes 18–24 hours, rosehips 3–4 hours, carrots 4–5 hours, mushrooms 3–4 hours, and herbs 0.5–1.5 hours.'
                      : 'Для бытовой сушилки «Пичуга» приведены: загрузка до 1,2 кг и время сушки 0,5–12 часов. Для яблок указано 4–5 часов, абрикосов — 10–12 часов, винограда — 18–24 часа, шиповника — 3–4 часа, моркови — 4–5 часов, грибов — 3–4 часа, зелени — 0,5–1,5 часа.'}
                  </p>
                </>
              ) : slug === 'lamp' ? (
                <>
                  {(lang === 'en' && dev.full_text_en ? dev.full_text_en.slice(0, 10) : dev.full_text.slice(0, 10)).map((paragraph, idx) => (
                    <p key={idx} style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                      {paragraph}
                    </p>
                  ))}

                  {/* Изображение Излучатели RC и ZRK (rczrk.png) */}
                  <div style={{ margin: '32px 0', textAlign: 'center' }}>
                    <figure style={{ display: 'inline-block', maxWidth: '480px', width: '100%', margin: 0 }}>
                      <div
                        style={{
                          borderRadius: 'var(--radius-lg)',
                          overflow: 'hidden',
                          border: '1px solid var(--color-border)',
                          boxShadow: 'var(--shadow-md)',
                          background: '#ffffff'
                        }}
                      >
                        <img
                          src="/images/rczrk.webp"
                          alt={lang === 'en' ? 'Local application infrared emitters' : 'Инфракрасные излучатели локального применения'}
                          style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block'
                          }}
                        />
                      </div>
                      <figcaption
                        style={{
                          fontStyle: 'italic',
                          fontSize: '0.875rem',
                          color: '#64748b',
                          marginTop: '10px',
                          textAlign: 'center',
                          lineHeight: '1.4'
                        }}
                      >
                        {lang === 'en' ? 'Local application infrared emitters' : 'Инфракрасные излучатели локального применения'}
                      </figcaption>
                    </figure>
                  </div>

                  {(lang === 'en' && dev.full_text_en ? dev.full_text_en.slice(10) : dev.full_text.slice(10)).map((paragraph, idx) => (
                    <p key={idx} style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                      {paragraph}
                    </p>
                  ))}
                </>
              ) : slug === 'kalci' ? (
                <>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? '"Active Calcium" is a dietary supplement in the form of an oral suspension, developed on the basis of several calcium-containing compounds.'
                      : '«Активный кальций» — биологически активная добавка в форме суспензии для приема внутрь, разработанная на основе нескольких кальцийсодержащих соединений.'}
                  </p>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'The technology involves special processing of calcium-containing raw materials. The design concept focuses specifically on the state of calcium in solution, its interaction with water, and the subsequent participation of calcium ions in physiological processes.'
                      : 'Технология предусматривает специальную обработку кальцийсодержащего сырья. В концепции разработки особое внимание уделяется состоянию кальция в растворе, его взаимодействию с водой и возможности последующего участия ионов кальция в физиологических процессах.'}
                  </p>

                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '32px 0 16px 0', lineHeight: '1.3' }}>
                    {lang === 'en' ? 'Why the body needs calcium' : 'Почему кальций необходим организму'}
                  </h2>

                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'Calcium is one of the most vital mineral elements of the human body.'
                      : 'Кальций — один из важнейших минеральных элементов человеческого организма.'}
                  </p>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '24px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'The major portion of body calcium is bound to bone tissue and teeth; however, a small quantity of calcium present in blood and tissues carries profound physiological significance.'
                      : 'Основная часть кальция организма связана с костной тканью и зубами, однако небольшое количество кальция, находящееся в крови и тканях, имеет большое физиологическое значение.'}
                  </p>

                  {/* КАЛЬЦИЙ УЧАСТВУЕТ В: по центру жирным */}
                  <div style={{ textAlign: 'center', margin: '36px 0 16px 0' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '0.04em' }}>
                      {lang === 'en' ? 'CALCIUM IS INVOLVED IN:' : 'КАЛЬЦИЙ УЧАСТВУЕТ В:'}
                    </div>
                  </div>

                  {/* Изображение ca.png / ca_eng.png (уменьшено на 30%) */}
                  <div style={{ margin: '16px 0 32px 0', textAlign: 'center' }}>
                    <figure style={{ display: 'inline-block', maxWidth: '590px', width: '100%', margin: 0 }}>
                      <div
                        style={{
                          borderRadius: 'var(--radius-lg)',
                          overflow: 'hidden',
                          border: '1px solid var(--color-border)',
                          boxShadow: 'var(--shadow-md)',
                          background: '#ffffff',
                          padding: '8px'
                        }}
                      >
                        <img
                          src={lang === 'en' ? '/images/ca_eng.webp' : '/images/ca.webp'}
                          alt={lang === 'en' ? 'Calcium is involved in' : 'Кальций участвует в'}
                          style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                            borderRadius: 'var(--radius-md)'
                          }}
                        />
                      </div>
                    </figure>
                  </div>

                  {/* Текст после картинки */}
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'Therefore, the significance of calcium cannot be reduced merely to bone strength. The concentration and distribution of calcium in the body are linked to an entire complex of physiological processes.'
                      : 'Поэтому значение кальция нельзя сводить только к прочности костей. Концентрация и распределение кальция в организме связаны с целым комплексом физиологических процессов.'}
                  </p>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'The developer\'s materials also explore how calcium participates in energy metabolism, including processes associated with the Krebs cycle and ATP generation.'
                      : 'На сайте разработчика также рассматривается Кальций участвует в энергетическом обмене, включая процессы, связанные с циклом Кребса и образованием АТФ.'}
                  </p>

                  {/* Раздел: Кальций в организме: не только кости */}
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '36px 0 16px 0', lineHeight: '1.3' }}>
                    {lang === 'en' ? 'Calcium in the Body: Not Just Bones' : 'Кальций в организме: не только кости'}
                  </h2>

                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '20px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'The body continuously regulates calcium levels.'
                      : 'Организм постоянно регулирует содержание кальция.'}
                  </p>

                  {/* Изображение obmen_ca.png / obmen_ca_eng.png */}
                  <div style={{ margin: '16px 0 32px 0', textAlign: 'center' }}>
                    <figure style={{ display: 'inline-block', maxWidth: '590px', width: '100%', margin: 0 }}>
                      <div
                        style={{
                          borderRadius: 'var(--radius-lg)',
                          overflow: 'hidden',
                          border: '1px solid var(--color-border)',
                          boxShadow: 'var(--shadow-md)',
                          background: '#ffffff',
                          padding: '8px'
                        }}
                      >
                        <img
                          src={lang === 'en' ? '/images/obmen_ca_eng.webp' : '/images/obmen_ca.webp'}
                          alt={lang === 'en' ? 'Calcium in the body' : 'Кальций в организме'}
                          style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                            borderRadius: 'var(--radius-md)'
                          }}
                        />
                      </div>
                    </figure>
                  </div>

                  {/* Текст после картинки obmen_ca */}
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'This is precisely why not only the amount of incoming calcium matters, but also its chemical form, solubility, absorption conditions, and regulatory mechanisms.'
                      : 'Именно поэтому важны не только количество поступающего кальция, но и его химическая форма, растворимость, условия всасывания и механизмы регуляции.'}
                  </p>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'The issue of insufficient dietary calcium intake and factors that may be associated with reduced absorption or increased excretion. Among these factors are smoking, alcohol, high consumption of sugar-containing foods and beverages, certain medications, diabetes mellitus, thyrotoxicosis, and gastrointestinal diseases.'
                      : 'Проблема недостаточного поступления кальция с пищей и факторов, которые могут быть связаны со снижением его поступления или повышенным выведением. Среди перечисленных факторов — курение, алкоголь, большое количество сахаросодержащих продуктов и напитков, некоторые лекарственные препараты, сахарный диабет, тиреотоксикоз и заболевания желудочно-кишечного тракта.'}
                  </p>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'At the same time, such factors should not be viewed as a universal cause of calcium deficiency in every individual: each specific situation depends on diet, health status, drug therapy, and other circumstances.'
                      : 'При этом такие факторы нельзя рассматривать как универсальную причину дефицита кальция у каждого человека: конкретная ситуация зависит от питания, состояния здоровья, лекарственной терапии и других обстоятельств.'}
                  </p>

                  {/* Раздел: Что представляет собой «Активный кальций» */}
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '36px 0 16px 0', lineHeight: '1.3' }}>
                    {lang === 'en' ? 'What "Active Calcium" Is' : 'Что представляет собой «Активный кальций»'}
                  </h2>

                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '20px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'The product is a suspension containing several calcium-bearing components.'
                      : 'Продукт представляет собой суспензию, содержащую несколько кальцийсодержащих компонентов.'}
                  </p>

                  {/* Изображение mineral_complex.png / mineral_complex_eng.png */}
                  <div style={{ margin: '16px 0 32px 0', textAlign: 'center' }}>
                    <figure style={{ display: 'inline-block', maxWidth: '590px', width: '100%', margin: 0 }}>
                      <div
                        style={{
                          borderRadius: 'var(--radius-lg)',
                          overflow: 'hidden',
                          border: '1px solid var(--color-border)',
                          boxShadow: 'var(--shadow-md)',
                          background: '#ffffff',
                          padding: '8px'
                        }}
                      >
                        <img
                          src={lang === 'en' ? '/images/mineral_complex_eng.webp' : '/images/mineral_complex.webp'}
                          alt={lang === 'en' ? 'Mineral complex components' : 'Компоненты минерального комплекса'}
                          style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                            borderRadius: 'var(--radius-md)'
                          }}
                        />
                      </div>
                    </figure>
                  </div>

                  {/* Раздел: Технологическая концепция «Активного кальция» */}
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '36px 0 16px 0', lineHeight: '1.3' }}>
                    {lang === 'en' ? 'Technological Concept of "Active Calcium"' : 'Технологическая концепция «Активного кальция»'}
                  </h2>

                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'One of the central features of the development is the specialized processing of calcium-containing components.'
                      : 'Одной из центральных особенностей разработки специальная обработка кальцийсодержащих компонентов.'}
                  </p>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'The concept of solvation is applied — the surrounding of an ion by solvent molecules.'
                      : 'Используется понятие сольватации — окружения иона молекулами растворителя.'}
                  </p>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '20px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'According to the presented model, the calcium ion resides within an aqueous shell, and its subsequent participation in physiological processes depends on environmental conditions and calcium concentration. The infographic describes this concept as a mechanism whereby calcium is released from its solvation shell upon changes in the body\'s calcium concentration.'
                      : 'Согласно представленной модели, ион кальция находится в водном окружении, а его дальнейшее участие в процессах зависит от условий среды и концентрации кальция. На инфографике описывается концепция как механизм, при котором кальций должен высвобождаться из сольватного окружения при изменении концентрации кальция в организме.'}
                  </p>

                  {/* Изображение koncept.png / koncept_eng.png */}
                  <div style={{ margin: '16px 0 32px 0', textAlign: 'center' }}>
                    <figure style={{ display: 'inline-block', maxWidth: '590px', width: '100%', margin: 0 }}>
                      <div
                        style={{
                          borderRadius: 'var(--radius-lg)',
                          overflow: 'hidden',
                          border: '1px solid var(--color-border)',
                          boxShadow: 'var(--shadow-md)',
                          background: '#ffffff',
                          padding: '8px'
                        }}
                      >
                        <img
                          src={lang === 'en' ? '/images/koncept_eng.webp' : '/images/koncept.webp'}
                          alt={lang === 'en' ? 'Technological concept of active calcium' : 'Технологическая концепция активного кальция'}
                          style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                            borderRadius: 'var(--radius-md)'
                          }}
                        />
                      </div>
                    </figure>
                  </div>

                  {/* Раздел: Кальций и энергетический обмен */}
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '36px 0 16px 0', lineHeight: '1.3' }}>
                    {lang === 'en' ? 'Calcium and Energy Metabolism' : 'Кальций и энергетический обмен'}
                  </h2>

                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'The product pays special attention to the relationship between calcium and cellular metabolism.'
                      : 'В продукте особое внимание уделяется связи кальция с клеточным метаболизмом.'}
                  </p>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '24px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'Calcium participates in the regulation of cellular processes and is linked to energy metabolism mechanisms, including the Krebs cycle and ATP synthesis.'
                      : 'Кальций участвует в регуляции клеточных процессов и связан с механизмами энергетического обмена, связь с циклом Кребса и синтезом АТФ.'}
                  </p>

                  {/* Раздел: Кальций и костная ткань */}
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '36px 0 16px 0', lineHeight: '1.3' }}>
                    {lang === 'en' ? 'Calcium and Bone Tissue' : 'Кальций и костная ткань'}
                  </h2>

                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'Bone tissue serves as the primary calcium reservoir.'
                      : 'Костная ткань является главным депо кальция.'}
                  </p>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '12px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'Calcium continuously takes part in the processes of bone formation and remodeling. This process is particularly critical:'
                      : 'Кальций постоянно участвует в процессах формирования и обновления костной ткани. Особенно важен этот процесс:'}
                  </p>

                  <ul style={{ margin: '0 0 18px 24px', lineHeight: '1.8', color: '#334155' }}>
                    <li>{lang === 'en' ? 'in childhood;' : 'в детском возрасте;'}</li>
                    <li>{lang === 'en' ? 'during periods of intensive growth;' : 'в период интенсивного роста;'}</li>
                    <li>{lang === 'en' ? 'during pregnancy;' : 'во время беременности;'}</li>
                    <li>{lang === 'en' ? 'during lactation;' : 'в период лактации;'}</li>
                    <li>{lang === 'en' ? 'with age-related changes in bone tissue;' : 'при возрастных изменениях костной ткани;'}</li>
                    <li>{lang === 'en' ? 'during menopause.' : 'в период менопаузы.'}</li>
                  </ul>

                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '24px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? '"Active Calcium" was studied in diverse clinical settings, including pediatric fractures and bone tissue pathologies.'
                      : '«Активный кальций» исследовался в различных клинических ситуациях, включая переломы у детей и заболевания костной ткани.'}
                  </p>

                  {/* Раздел: Кальций и зубы */}
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '36px 0 16px 0', lineHeight: '1.3' }}>
                    {lang === 'en' ? 'Calcium and Teeth' : 'Кальций и зубы'}
                  </h2>

                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'Calcium is essential for dental tissue mineralization.'
                      : 'Кальций необходим для минерализации зубных тканей.'}
                  </p>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'Adequate calcium intake is a key factor in the normal formation and maintenance of mineralized tooth tissues.'
                      : 'Достаточное поступление кальция является одним из факторов нормального формирования и поддержания минерализованных тканей зубов.'}
                  </p>

                  {/* Раздел: Кальций во время беременности */}
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '36px 0 16px 0', lineHeight: '1.3' }}>
                    {lang === 'en' ? 'Calcium During Pregnancy' : 'Кальций во время беременности'}
                  </h2>

                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'The body\'s requirement for calcium is of particular importance during pregnancy, as mineral substances are essential for the formation of the skeleton and other tissues of the developing organism.'
                      : 'Потребность организма в кальции имеет особое значение во время беременности, поскольку минеральные вещества необходимы для формирования скелета и других тканей развивающегося организма.'}
                  </p>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'The documented materials include observation results of pregnant women presenting with calcium-deficient states.'
                      : 'В материалах имеются результаты наблюдения за беременными женщинами с кальций-дефицитными состояниями.'}
                  </p>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '24px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'One study involved 27 pregnant women at gestational ages ranging from 8 to 32 weeks. The documentation describes the changes in calcium parameters following a course of "Active Calcium" administration.'
                      : 'В одном из исследований участвовали 27 беременных женщин на сроках от 8 до 32 недель. В материалах описано изменение показателей кальция после курса применения «Активного кальция».'}
                  </p>

                  {/* Раздел: Что влияет на кальциевый баланс */}
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '36px 0 16px 0', lineHeight: '1.3' }}>
                    {lang === 'en' ? 'What Influences Calcium Balance' : 'Что влияет на кальциевый баланс'}
                  </h2>

                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '12px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'Calcium metabolism depends not solely on the amount of calcium in the diet.'
                      : 'Кальциевый обмен зависит не только от количества кальция в рационе.'}
                  </p>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '12px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'The state of calcium balance can be influenced by:'
                      : 'На состояние кальциевого баланса могут влиять:'}
                  </p>

                  <ul style={{ margin: '0 0 24px 24px', lineHeight: '1.8', color: '#334155' }}>
                    <li>{lang === 'en' ? 'dietary habits;' : 'характер питания;'}</li>
                    <li>{lang === 'en' ? 'gastrointestinal tract status;' : 'состояние желудочно-кишечного тракта;'}</li>
                    <li>{lang === 'en' ? 'hormonal regulation;' : 'гормональная регуляция;'}</li>
                    <li>{lang === 'en' ? 'renal function;' : 'состояние почек;'}</li>
                    <li>{lang === 'en' ? 'age;' : 'возраст;'}</li>
                    <li>{lang === 'en' ? 'physical activity;' : 'физическая активность;'}</li>
                    <li>{lang === 'en' ? 'certain diseases;' : 'некоторые заболевания;'}</li>
                    <li>{lang === 'en' ? 'certain medications.' : 'некоторые лекарственные препараты.'}</li>
                  </ul>

                  {/* Раздел: Исследования «Активного кальция» */}
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '36px 0 16px 0', lineHeight: '1.3' }}>
                    {lang === 'en' ? 'Studies of "Active Calcium"' : 'Исследования «Активного кальция»'}
                  </h2>

                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '24px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'The portal lists publications devoted to the clinical administration of "Active Calcium" across diverse conditions. Among them are clinical studies in calcium-deficient states, internal organ diseases, hematological disorders, pediatric femoral fractures, and acute mandibular osteomyelitis in children.'
                      : 'На сайте перечислены публикации, посвященные применению «Активного кальция» при различных состояниях. Среди них исследования при кальций-дефицитных состояниях, заболеваниях внутренних органов, гематологических заболеваниях, переломах бедренной кости у детей и остром остеомиелите нижней челюсти у детей.'}
                  </p>

                  {/* Раздел: Динамика экскреции кальция */}
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '36px 0 16px 0', lineHeight: '1.3' }}>
                    {lang === 'en' ? 'Dynamics of Calcium Excretion' : 'Динамика экскреции кальция'}
                  </h2>

                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'The source materials present the following values of urinary calcium excretion:'
                      : 'В исходных материалах приведены следующие значения выделения кальция с мочой:'}
                  </p>

                  {/* Изображение dinamic_ca.png / dinamic_ca_eng.png */}
                  <div style={{ margin: '16px 0 32px 0', textAlign: 'center' }}>
                    <figure style={{ display: 'inline-block', maxWidth: '590px', width: '100%', margin: 0 }}>
                      <div
                        style={{
                          borderRadius: 'var(--radius-lg)',
                          overflow: 'hidden',
                          border: '1px solid var(--color-border)',
                          boxShadow: 'var(--shadow-md)',
                          background: '#ffffff',
                          padding: '8px'
                        }}
                      >
                        <img
                          src={lang === 'en' ? '/images/dinamic_ca_eng.webp' : '/images/dinamic_ca.webp'}
                          alt={lang === 'en' ? 'Dynamics of calcium excretion' : 'Динамика экскреции кальция'}
                          style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                            borderRadius: 'var(--radius-md)'
                          }}
                        />
                      </div>
                    </figure>
                  </div>

                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'In the original work, a statistical significance of P < 0.001 is reported for the differences.'
                      : 'В исходной работе для различий указывается P<0,001.'}
                  </p>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'Thus, under the specific conditions of this study, by day 30 the value in the "Active Calcium" group approached the normal reference value specified in the report.'
                      : 'Таким образом, в условиях именно этого исследования к 30-му дню показатель группы «Активный кальций» приблизился к указанному в работе значению нормы.'}
                  </p>

                  {/* Раздел: Исследование минеральной плотности костной ткани */}
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '36px 0 16px 0', lineHeight: '1.3' }}>
                    {lang === 'en' ? 'Bone Mineral Density Study' : 'Исследование минеральной плотности костной ткани'}
                  </h2>

                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'The same study evaluated the state of bone tissue.'
                      : 'В той же работе проводилась оценка состояния костной ткани.'}
                  </p>

                  {/* Изображение dinamic_score.png / dinamic_score_eng.png */}
                  <div style={{ margin: '16px 0 32px 0', textAlign: 'center' }}>
                    <figure style={{ display: 'inline-block', maxWidth: '590px', width: '100%', margin: 0 }}>
                      <div
                        style={{
                          borderRadius: 'var(--radius-lg)',
                          overflow: 'hidden',
                          border: '1px solid var(--color-border)',
                          boxShadow: 'var(--shadow-md)',
                          background: '#ffffff',
                          padding: '8px'
                        }}
                      >
                        <img
                          src={lang === 'en' ? '/images/dinamic_score_eng.webp' : '/images/dinamic_score.webp'}
                          alt={lang === 'en' ? 'Bone mineral density dynamics' : 'Динамика минеральной плотности костной ткани'}
                          style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                            borderRadius: 'var(--radius-md)'
                          }}
                        />
                      </div>
                    </figure>
                  </div>

                  {/* Раздел: Исследование при переломах бедренной кости у детей */}
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '36px 0 16px 0', lineHeight: '1.3' }}>
                    {lang === 'en' ? 'Study on Femoral Fractures in Children' : 'Исследование при переломах бедренной кости у детей'}
                  </h2>

                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'A separate clinical study investigated the use of "Active Calcium" dietary supplement in the comprehensive treatment of femoral fractures.'
                      : 'В отдельной работе изучалось применение БАД «Активный кальций» в комплексном лечении переломов бедренной кости.'}
                  </p>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'The study enrolled 136 children aged 3–6 years, distributed into four cohorts of 34 patients each.'
                      : 'В исследование вошли 136 детей в возрасте 3–6 лет. Они были распределены на четыре группы по 34 человека.'}
                  </p>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'After four weeks, the mean T-score values were:'
                      : 'Через четыре недели средние значения T-score составили:'}
                  </p>

                  {/* Изображение average_score.png / average_score_eng.png */}
                  <div style={{ margin: '16px 0 32px 0', textAlign: 'center' }}>
                    <figure style={{ display: 'inline-block', maxWidth: '590px', width: '100%', margin: 0 }}>
                      <div
                        style={{
                          borderRadius: 'var(--radius-lg)',
                          overflow: 'hidden',
                          border: '1px solid var(--color-border)',
                          boxShadow: 'var(--shadow-md)',
                          background: '#ffffff',
                          padding: '8px'
                        }}
                      >
                        <img
                          src={lang === 'en' ? '/images/average_score_eng.webp' : '/images/average_score.webp'}
                          alt={lang === 'en' ? 'Average T-score values in femoral fracture study' : 'Средние значения T-score при переломах бедренной кости'}
                          style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                            borderRadius: 'var(--radius-md)'
                          }}
                        />
                      </div>
                    </figure>
                  </div>

                  {/* Раздел: Исследования при кальций-дефицитных состояниях */}
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '36px 0 16px 0', lineHeight: '1.3' }}>
                    {lang === 'en' ? 'Studies in Calcium-Deficient States' : 'Исследования при кальций-дефицитных состояниях'}
                  </h2>

                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'The research materials include studies of patients with blood system disorders.'
                      : 'В материалах исследования пациентов с заболеваниями системы крови.'}
                  </p>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'A total of 69 patients were examined: 43 men and 26 women, aged 20 to 58 years. Patients with hematological conditions and reduced calcium levels were investigated.'
                      : 'Обследовано 69 пациентов: 43 мужчины и 26 женщин, возраст — от 20 до 58 лет. Исследовались пациенты с гематологическими заболеваниями и сниженным уровнем кальция.'}
                  </p>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'In the study cohort, baseline calcium levels were reduced, and a significant increase was observed following a course of the product.'
                      : 'В группе исследования исходный уровень кальция был снижен, а после курса применения продукта наблюдалось увеличение показателя.'}
                  </p>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '12px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'The source documentation reports the following values:'
                      : 'В исходных материалах приводятся значения:'}
                  </p>

                  <ul style={{ margin: '0 0 16px 24px', lineHeight: '1.8', color: '#334155' }}>
                    <li>
                      {lang === 'en'
                        ? 'cohort one: 1.85 ± 0.005 → 2.55 ± 0.05 mmol/L;'
                        : 'одна группа: 1,85 ± 0,005 → 2,55 ± 0,05 ммоль/л;'}
                    </li>
                    <li>
                      {lang === 'en'
                        ? 'cohort two: 2.23 ± 0.1 → 2.60 ± 0.1 mmol/L.'
                        : 'вторая группа: 2,23 ± 0,1 → 2,60 ± 0,1 ммоль/л.'}
                    </li>
                  </ul>

                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '24px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'A statistical significance of P < 0.005 is reported for the results.'
                      : 'Для результатов исследования указано P<0,005.'}
                  </p>

                  {/* Раздел: Экспериментальные исследования */}
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '36px 0 16px 0', lineHeight: '1.3' }}>
                    {lang === 'en' ? 'Experimental Studies' : 'Экспериментальные исследования'}
                  </h2>

                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'In addition to human clinical trials, experimental in vivo studies on animal models were conducted.'
                      : 'Помимо исследований с участием людей, имеется экспериментальная работа с использованием животных.'}
                  </p>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'The effect of "Active Calcium with Magnesium" formulation on immunogenesis parameters in mice was investigated.'
                      : 'Исследовалось влияние препарата «Активный кальций с магнием» на показатели иммуногенеза у мышей.'}
                  </p>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'The experiment evaluated the number of antibody-forming cells. In the control group, the count was approximately 2,000, whereas significantly higher values were recorded in the experimental cohorts.'
                      : 'В эксперименте оценивалось количество антителообразующих клеток. В контрольной группе показатель составлял около 2000, тогда как в экспериментальных группах были получены более высокие значения.'}
                  </p>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '24px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'Peak counts in the described experiment reached approximately 6,600 cells under a specific administration regimen.'
                      : 'Наибольшие показатели в описанном эксперименте достигали примерно 6600 клеток при определенной схеме введения.'}
                  </p>

                  {/* Раздел: Чем «Активный кальций» отличается от обычных кальцийсодержащих продуктов */}
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '36px 0 16px 0', lineHeight: '1.3' }}>
                    {lang === 'en'
                      ? 'How "Active Calcium" Differs from Conventional Calcium Products'
                      : 'Чем «Активный кальций» отличается от обычных кальцийсодержащих продуктов'}
                  </h2>

                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'The fundamental distinction is associated not merely with the quantity of calcium, but with the formulation design and specialized processing technology of the calcium-bearing components.'
                      : 'Основное отличие, связано не просто с количеством кальция, а с формой композиции и технологией обработки кальцийсодержащих компонентов.'}
                  </p>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '20px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'An additional key feature of the development is leveraging the solvated state of the calcium ion as an integral element of the proposed delivery mechanism and participation in physiological processes.'
                      : 'Дополнительной особенностью разработки считается использование сольватного состояния иона кальция как части предложенного механизма доставки и участия кальция в физиологических процессах.'}
                  </p>

                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? '"Active Calcium" is a calcium-bearing dietary supplement in suspension form, containing several calcium and magnesium compounds.'
                      : '«Активный кальций» — кальцийсодержащая биологически активная добавка в форме суспензии, содержащая несколько соединений кальция и магния.'}
                  </p>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'The development is supported by published scientific papers, clinical investigations across various medical disciplines, and patent documents. The portal lists research in the fields of calcium-deficient states, hematology, pediatric traumatology, stomatology, and experimental immunology.'
                      : 'Разработка сопровождается опубликованными материалами, исследованиями в различных медицинских направлениях и патентными документами. На сайте перечислены исследования в области кальций-дефицитных состояний, гематологии, детской травматологии, стоматологии и экспериментальной иммунологии.'}
                  </p>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '24px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'The fundamental technological feature is associated with the specialized processing of calcium-containing components and the application of the concept of the solvated state of calcium ions.'
                      : 'Основная технологическая особенность, связана со специальной обработкой кальцийсодержащих компонентов и использованием концепции сольватированного состояния ионов кальция.'}
                  </p>
                </>
              ) : slug === 'pech' ? (
                <>
                  {/* Вводный блок: текст слева, схема справа */}
                  <div className="pech-intro-row">
                    <div className="pech-intro-text">
                      <p style={{ textAlign: 'justify', textJustify: 'inter-word', margin: 0, lineHeight: '1.75' }}>
                        {lang === 'en'
                          ? 'Modern roasting and frying furnace technology is based on controlled infrared exposure and emission spectrum selection taking into account the characteristics of the product. This approach allows energy to be directed straight into the product\'s working zone and provides intensive heating without the need for constant rotation or movement of the prepared food.'
                          : 'Современная технология жарочных печей основана на управляемом инфракрасном воздействии и подборе спектра излучения с учетом особенностей продукта. Такой подход позволяет направлять энергию непосредственно в рабочую зону продукта и получать интенсивный прогрев без необходимости постоянного вращения или перемещения приготовляемой продукции.'}
                      </p>
                    </div>

                    <div className="pech-intro-img-col">
                      <button
                        type="button"
                        onClick={() => openModalImage('/images/shem.webp', lang === 'en' ? 'Furnace cutaway diagram' : 'Схема разреза печи в сборе')}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'zoom-in', display: 'block', width: '100%', textAlign: 'left' }}
                        title={lang === 'en' ? 'Click to view full size cutaway diagram' : 'Нажмите для увеличения схемы печи'}
                      >
                        <img
                          src="/images/shem.webp"
                          alt={lang === 'en' ? 'Furnace cutaway diagram' : 'Схема разреза печи в сборе'}
                          style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block'
                          }}
                          loading="lazy"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Раздел: Принцип работы технологии */}
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '32px 0 16px 0', lineHeight: '1.3' }}>
                    {lang === 'en' ? 'Operating Principle of the Technology' : 'Принцип работы технологии'}
                  </h2>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'The key principle lies in selecting an infrared emission spectrum where the organic molecules of the product effectively absorb energy, while water molecules participate in energy transfer within the product without being the primary absorption target. According to the technology description, radiation penetrates deep into the product along water molecules, ensuring more uniform exposure.'
                      : 'Ключевой принцип заключается в выборе такого спектра инфракрасного излучения, при котором молекулы органических компонентов продукта эффективно поглощают энергию, а молекулы воды участвуют в передаче энергии внутри продукта, не являясь основным объектом поглощения. Согласно описанию технологии, излучение проникает вглубь продукта по молекулам воды, что обеспечивает более равномерное воздействие.'}
                  </p>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '24px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'As a result, heating occurs not merely on the surface, but affects the internal layers. This reduces cooking time and minimizes moisture loss and drying out.'
                      : 'В результате нагрев происходит не только на поверхности, а с воздействием на внутренние слои. Это позволяет сократить продолжительность приготовления и уменьшить интенсивность пересушивания.'}
                  </p>

                  {/* Раздел: Ключевые преимущества */}
                  <section style={{ marginBottom: '36px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '32px 0 16px 0', lineHeight: '1.3' }}>
                      {lang === 'en' ? 'Key Advantages' : 'Ключевые преимущества'}
                    </h2>
                    <div style={{ textAlign: 'center' }}>
                      <figure style={{ display: 'inline-block', maxWidth: '800px', width: '100%', margin: '16px auto 24px auto' }}>
                        <div
                          style={{
                            borderRadius: 'var(--radius-lg)',
                            overflow: 'hidden',
                            border: '1px solid var(--color-border)',
                            boxShadow: 'var(--shadow-sm)',
                            background: '#ffffff',
                            padding: '8px'
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => openModalImage(
                              lang === 'en' ? '/images/preimush_eng.webp' : '/images/preimush.webp',
                              lang === 'en' ? 'Key Advantages' : 'Ключевые преимущества'
                            )}
                            style={{ background: 'none', border: 'none', padding: 0, cursor: 'zoom-in', display: 'block', width: '100%' }}
                            title={lang === 'en' ? 'Click to view full size' : 'Нажмите для увеличения'}
                          >
                            <img
                              src={lang === 'en' ? '/images/preimush_eng.webp' : '/images/preimush.webp'}
                              alt={lang === 'en' ? 'Key Advantages' : 'Ключевые преимущества'}
                              style={{
                                width: '100%',
                                height: 'auto',
                                display: 'block',
                                borderRadius: 'var(--radius-md)'
                              }}
                              loading="lazy"
                            />
                          </button>
                        </div>
                      </figure>
                    </div>
                  </section>

                  {/* Раздел: Сравнение заявленных показателей */}
                  <section style={{ marginBottom: '36px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '32px 0 16px 0', lineHeight: '1.3' }}>
                      {lang === 'en' ? 'Comparison of Stated Indicators' : 'Сравнение заявленных показателей'}
                    </h2>
                    <div style={{ textAlign: 'center' }}>
                      <figure style={{ display: 'inline-block', maxWidth: '800px', width: '100%', margin: '16px auto 24px auto' }}>
                        <div
                          style={{
                            borderRadius: 'var(--radius-lg)',
                            overflow: 'hidden',
                            border: '1px solid var(--color-border)',
                            boxShadow: 'var(--shadow-sm)',
                            background: '#ffffff',
                            padding: '8px'
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => openModalImage(
                              lang === 'en' ? '/images/sravneni_eng.webp' : '/images/sravneni.webp',
                              lang === 'en' ? 'Comparison of Stated Indicators' : 'Сравнение заявленных показателей'
                            )}
                            style={{ background: 'none', border: 'none', padding: 0, cursor: 'zoom-in', display: 'block', width: '100%' }}
                            title={lang === 'en' ? 'Click to view full size' : 'Нажмите для увеличения'}
                          >
                            <img
                              src={lang === 'en' ? '/images/sravneni_eng.webp' : '/images/sravneni.webp'}
                              alt={lang === 'en' ? 'Comparison of Stated Indicators' : 'Сравнение заявленных показателей'}
                              style={{
                                width: '100%',
                                height: 'auto',
                                display: 'block',
                                borderRadius: 'var(--radius-md)'
                              }}
                              loading="lazy"
                            />
                          </button>
                        </div>
                      </figure>
                    </div>
                  </section>

                  {/* Раздел: Что получает производитель и оператор */}
                  <section style={{ marginBottom: '36px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '32px 0 16px 0', lineHeight: '1.3' }}>
                      {lang === 'en' ? 'Benefits for Manufacturers and Operators' : 'Что получает производитель и оператор'}
                    </h2>
                    <ul style={{ margin: '0 0 24px 0', paddingLeft: '24px', listStyleType: 'disc', color: '#334155', fontSize: '1.0625rem', lineHeight: '1.8' }}>
                      <li style={{ marginBottom: '8px' }}>
                        {lang === 'en' ? 'Reduction in technological cycle duration.' : 'Сокращение продолжительности технологического цикла.'}
                      </li>
                      <li style={{ marginBottom: '8px' }}>
                        {lang === 'en' ? 'Capability to reduce product weight loss during cooking.' : 'Возможность уменьшить потери массы готового продукта.'}
                      </li>
                      <li style={{ marginBottom: '8px' }}>
                        {lang === 'en' ? 'More uniform heat exposure during cooking.' : 'Более равномерное воздействие при приготовлении.'}
                      </li>
                      <li style={{ marginBottom: '8px' }}>
                        {lang === 'en' ? 'Reduced necessity for mechanical rotation of the product.' : 'Снижение необходимости в механическом вращении продукта.'}
                      </li>
                      <li style={{ marginBottom: '8px' }}>
                        {lang === 'en' ? 'Potential energy savings under the declared operating mode.' : 'Потенциальное снижение энергозатрат при заявленном режиме работы.'}
                      </li>
                      <li style={{ marginBottom: '8px' }}>
                        {lang === 'en' ? 'Applicability of the technology for grills and roasting ovens equipped with infrared emitters.' : 'Возможность использовать технологию для грилей и жарочных шкафов с инфракрасными излучателями.'}
                      </li>
                    </ul>
                  </section>

                  {/* Раздел: Область применения */}
                  <section style={{ marginBottom: '36px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '32px 0 16px 0', lineHeight: '1.3' }}>
                      {lang === 'en' ? 'Areas of Application' : 'Область применения'}
                    </h2>
                    <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '24px', lineHeight: '1.75' }}>
                      {lang === 'en'
                        ? 'The technology is designed for use in roasting furnaces, grills, and ovens where fast and uniform cooking of food products is required. It can be of value for public catering enterprises, food manufacturing facilities, culinary workshops, and other facilities where cooking speed, consistency of results, and reduced product loss are essential.'
                        : 'Технология предназначена для применения в жарочных печах, грилях и жарочных шкафах, где требуется быстрое и равномерное приготовление пищевой продукции. Она может представлять интерес для предприятий общественного питания, пищевых производств, кулинарных цехов и других объектов, где важны скорость приготовления, стабильность результата и снижение потерь продукта.'}
                    </p>
                  </section>
                </>
              ) : slug === 'plenka' ? (
                <>
                  {/* Вводный блок: текст слева, parnik.png справа */}
                  <div className="pech-intro-row">
                    <div className="pech-intro-text">
                      <p style={{ textAlign: 'justify', textJustify: 'inter-word', margin: 0, lineHeight: '1.75' }}>
                        {lang === 'en'
                          ? 'Film-ceramic composite is an advanced material based on polyethylene and functional ceramics, developed to create more stable plant growing conditions. Unlike conventional polymer coverings, the composite not only performs the function of a translucent protective material, but also participates in converting part of solar energy, generating pulsed radiation with specified characteristics. As a result, the technology aims to regulate temperature conditions, reduce moisture evaporation, retain heat at night, and improve conditions for root system development.'
                          : 'Плёночно-керамический композит — перспективный материал на основе полиэтилена и функциональной керамики, разработанный для создания более стабильных условий выращивания растений. В отличие от обычных полимерных покрытий, композит не только выполняет функцию светопрозрачного защитного материала, но и участвует в преобразовании части солнечной энергии, формируя импульсное излучение с заданными характеристиками. Благодаря этому технология направлена на регулирование температурного режима, снижение испарения влаги, сохранение тепла в ночное время и улучшение условий для развития корневой системы растений.'}
                      </p>
                    </div>

                    <div className="pech-intro-img-col">
                      <button
                        type="button"
                        onClick={() => openModalImage('/images/parnik.webp', lang === 'en' ? 'Greenhouse with film-ceramic composite' : 'Теплица с плёночно-керамическим композитом')}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'zoom-in', display: 'block', width: '100%', textAlign: 'left' }}
                        title={lang === 'en' ? 'Click to view full size' : 'Нажмите для увеличения'}
                      >
                        <img
                          src="/images/parnik.webp"
                          alt={lang === 'en' ? 'Greenhouse with film-ceramic composite' : 'Теплица с плёночно-керамическим композитом'}
                          style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '300px',
                            objectFit: 'cover',
                            display: 'block',
                            borderRadius: 'var(--radius-md)'
                          }}
                          loading="lazy"
                        />
                      </button>
                    </div>
                  </div>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                    {lang === 'en'
                      ? 'Of particular importance is the comprehensive effect of the composite on the greenhouse microclimate: reported benefits include reduced condensation and water consumption, longer moisture retention in soil, additional soil warming, and maintenance of favorable temperature conditions. According to the test results presented on the page, the application of the composite is also associated with increased crop yields, reduced fuel consumption, and decreased necessity for covering replacement due to ultraviolet radiation exposure. Thus, the film-ceramic composite is considered not merely an alternative covering, but a functional part of the microclimate and plant growing condition management system.'
                      : 'Особое значение имеет комплексное воздействие композита на микроклимат теплицы: заявлены снижение конденсации и расхода воды, более длительное сохранение влаги в почве, дополнительный прогрев почвы и поддержание благоприятного температурного режима. Согласно представленным на странице результатам испытаний, применение композита также связывается с повышением урожайности, снижением расхода топлива и уменьшением необходимости замены покрытия вследствие воздействия ультрафиолетового излучения. Таким образом, плёночно-керамический композит рассматривается не просто как альтернативное покрытие, а как функциональная часть системы управления микроклиматом и условиями выращивания растений.'}
                  </p>

                  <div style={{ margin: '32px 0', textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => openModalImage(lang === 'en' ? '/images/princip_eng.webp' : '/images/princip.webp', lang === 'en' ? 'Conceptual diagram of the composite\'s operation according to the technology description' : 'Концептуальная схема работы композита по описанию технологии')}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'zoom-in', display: 'inline-block', width: '100%' }}
                      title={lang === 'en' ? 'Click to view full size' : 'Нажмите для увеличения'}
                    >
                      <img
                        src={lang === 'en' ? '/images/princip_eng.webp' : '/images/princip.webp'}
                        alt={lang === 'en' ? 'Conceptual diagram of the composite\'s operation according to the technology description' : 'Концептуальная схема работы композита по описанию технологии'}
                        style={{
                          width: '75%',
                          height: 'auto',
                          display: 'block',
                          borderRadius: 'var(--radius-md)',
                          margin: '0 auto'
                        }}
                        loading="lazy"
                      />
                    </button>
                    <p style={{ fontStyle: 'italic', marginTop: '12px', color: '#64748b', fontSize: '0.95rem', textAlign: 'center' }}>
                      {lang === 'en'
                        ? 'Conceptual diagram of the composite\'s operation according to the technology description'
                        : 'Концептуальная схема работы композита по описанию технологии'}
                    </p>
                  </div>

                  <section style={{ marginBottom: '36px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '32px 0 16px 0', lineHeight: '1.3' }}>
                      {lang === 'en' ? 'A Covering That Works as More Than Just a Film' : 'Покрытие, которое работает не только как плёнка'}
                    </h2>
                    <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                      {lang === 'en'
                        ? 'The film-ceramic composite based on polyethylene and functional ceramics is positioned as a material for greenhouses and other applications where light conditions, temperature, humidity, and covering durability are simultaneously important. Unlike conventional polyethylene, the composite, according to the technology description, is designed not merely to transmit sunlight, but to convert a portion of the incoming energy and generate additional pulsed radiation.'
                        : 'Плёнко-керамический композит на основе полиэтилена и функциональной керамики позиционируется как материал для теплиц и других задач, где одновременно важны световой режим, температура, влажность и долговечность покрытия. В отличие от обычного полиэтилена, композит, согласно описанию технологии, должен не просто пропускать солнечный свет, а преобразовывать часть поступающей энергии и формировать дополнительное импульсное излучение.'}
                    </p>
                    <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                      {lang === 'en'
                        ? 'The main idea behind the development is to create a more stable microenvironment for plants: to reduce sharp temperature fluctuations, decrease condensation and moisture loss, support conditions for photosynthesis, and simultaneously increase the lifespan of the covering itself.'
                        : 'Главная идея разработки — создать более стабильную микросреду для растений: уменьшить резкие температурные колебания, снизить конденсацию и потери влаги, поддерживать условия для фотосинтеза и одновременно повысить ресурс самого покрытия.'}
                    </p>
                  </section>

                  <section style={{ marginBottom: '36px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '32px 0 16px 0', lineHeight: '1.3' }}>
                      {lang === 'en' ? 'Key Claimed Characteristics' : 'Ключевые заявленные характеристики'}
                    </h2>
                    <div style={{ margin: '32px 0', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => openModalImage(lang === 'en' ? '/images/pokaz_eng.webp' : '/images/pokaz.webp', lang === 'en' ? 'Key Claimed Characteristics' : 'Ключевые заявленные характеристики')}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'zoom-in', display: 'inline-block', width: '100%' }}
                        title={lang === 'en' ? 'Click to view full size' : 'Нажмите для увеличения'}
                      >
                        <img
                          src={lang === 'en' ? '/images/pokaz_eng.webp' : '/images/pokaz.webp'}
                          alt={lang === 'en' ? 'Key Claimed Characteristics' : 'Ключевые заявленные характеристики'}
                          style={{
                            width: '75%',
                            height: 'auto',
                            display: 'block',
                            borderRadius: 'var(--radius-md)',
                            margin: '0 auto'
                          }}
                          loading="lazy"
                        />
                      </button>
                    </div>
                  </section>

                  <section style={{ marginBottom: '36px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '32px 0 16px 0', lineHeight: '1.3' }}>
                      {lang === 'en' ? 'How the Technology Works' : 'Как работает технология'}
                    </h2>
                    <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                      {lang === 'en'
                        ? 'Functional ceramics are introduced into polyethylene in the form of a fine powder. The powder is mixed with the melt, after which the mixture is granulated, and a film is formed from the resulting granules by extrusion. The introduction involves 5–10 wt.% ceramic powder with an average particle size of 5–10 μm.'
                        : 'Функциональная керамика вводится в полиэтилен в виде мелкодисперсного порошка. Порошок смешивается с расплавом, после чего смесь гранулируется и из полученных гранул методом экструзии формируется плёнка. Введение 5–10 масс.% керамического порошка со средним размером частиц 5–10 мкм.'}
                    </p>
                    <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                      {lang === 'en'
                        ? 'The technological concept is based on the controlled conversion of solar energy into pulsed radiation. For plants, the 620–680 nm range is particularly highlighted, and individual IR components are considered as part of the heat retention mechanism.'
                        : 'Технологическая концепция строится на управляемом преобразовании солнечной энергии в импульсное излучение. Для растений особенно выделяется диапазон 620–680 нм, а отдельные ИК-компоненты рассматриваются как часть механизма сохранения тепла.'}
                    </p>
                    <div style={{ margin: '32px 0', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => openModalImage(lang === 'en' ? '/images/spektr_eng.webp' : '/images/spektr.webp', lang === 'en' ? 'Spectral ranges and their application areas according to the technology description.' : 'Спектральные диапазоны и направления их использования по описанию технологии.')}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'zoom-in', display: 'inline-block', width: '100%' }}
                        title={lang === 'en' ? 'Click to view full size' : 'Нажмите для увеличения'}
                      >
                        <img
                          src={lang === 'en' ? '/images/spektr_eng.webp' : '/images/spektr.webp'}
                          alt={lang === 'en' ? 'Spectral ranges and their application areas according to the technology description.' : 'Спектральные диапазоны и направления их использования по описанию технологии.'}
                          style={{
                            width: '75%',
                            height: 'auto',
                            display: 'block',
                            borderRadius: 'var(--radius-md)',
                            margin: '0 auto'
                          }}
                          loading="lazy"
                        />
                      </button>
                      <p style={{ fontStyle: 'italic', marginTop: '12px', color: '#64748b', fontSize: '0.95rem', textAlign: 'center' }}>
                        {lang === 'en'
                          ? 'Spectral ranges and their application areas according to the technology description.'
                          : 'Спектральные диапазоны и направления их использования по описанию технологии.'}
                      </p>
                    </div>
                  </section>

                  <section style={{ marginBottom: '36px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '32px 0 16px 0', lineHeight: '1.3' }}>
                      {lang === 'en' ? 'Thermoregulation and Heat Retention' : 'Терморегуляция и сохранение тепла'}
                    </h2>
                    <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                      {lang === 'en'
                        ? 'The composite converts a significant part of solar energy into radiation with a quantum energy of 0.124–0.127 eV, corresponding to a temperature range of about 17–22 °C. The practical effect described is a tendency towards temperature stabilization: reducing overheating in hot weather, and maintaining more favorable conditions in cool weather.'
                        : 'Композит преобразует значительную часть солнечной энергии в излучение с квантовой энергией 0,124–0,127 эВ, соответствующей температурному диапазону около 17–22 °C. В качестве практического эффекта описывается стремление к стабилизации температуры: в жаркую погоду — снижение перегрева, в прохладную — поддержание более благоприятных условий.'}
                    </p>
                    <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                      {lang === 'en'
                        ? 'Pulsed radiation affects the soil, forming an additional thermal reserve. The heating depth is 50–100 cm, and in another fragment — penetration is more than 1 m.'
                        : 'Импульсное излучение воздействует на почву, формируя дополнительный тепловой резерв. Глубина прогрева 50–100 см, а в другом фрагменте — проникновение более 1 м.'}
                    </p>
                  </section>

                  <section style={{ marginBottom: '36px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '32px 0 16px 0', lineHeight: '1.3' }}>
                      {lang === 'en' ? 'Reduction of Condensation and Moisture Loss' : 'Снижение конденсации и потерь влаги'}
                    </h2>
                    <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                      {lang === 'en'
                        ? 'A smaller temperature gradient and radiation from the bottom layer of the composite prevent condensation from forming on the surface of the covering. This is important for greenhouses: water droplets and subsequent freezing can create additional stress for plants and worsen light conditions.'
                        : 'Более небольшой температурный градиент и излучение нижнего слоя композита препятствуют образованию конденсата на поверхности покрытия. Это важно для теплиц: капли воды и последующее замерзание могут создавать дополнительный стресс для растений и ухудшать световой режим.'}
                    </p>
                    <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                      {lang === 'en'
                        ? 'Retains moisture up to 6 times longer compared to conventional polyethylene.'
                        : 'Сохраняет влажность до 6 раз дольше по сравнению с обычным полиэтиленом.'}
                    </p>
                    <div style={{ margin: '32px 0', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => openModalImage(lang === 'en' ? '/images/effect_eng.webp' : '/images/effect.webp', lang === 'en' ? 'Claimed ranges of fuel savings and yield growth.' : 'Заявленные диапазоны экономии топлива и роста урожайности.')}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'zoom-in', display: 'inline-block', width: '100%' }}
                        title={lang === 'en' ? 'Click to view full size' : 'Нажмите для увеличения'}
                      >
                        <img
                          src={lang === 'en' ? '/images/effect_eng.webp' : '/images/effect.webp'}
                          alt={lang === 'en' ? 'Claimed ranges of fuel savings and yield growth.' : 'Заявленные диапазоны экономии топлива и роста урожайности.'}
                          style={{
                            width: '75%',
                            height: 'auto',
                            display: 'block',
                            borderRadius: 'var(--radius-md)',
                            margin: '0 auto'
                          }}
                          loading="lazy"
                        />
                      </button>
                      <p style={{ fontStyle: 'italic', marginTop: '12px', color: '#64748b', fontSize: '0.95rem', textAlign: 'center' }}>
                        {lang === 'en'
                          ? 'Claimed ranges of fuel savings and yield growth.'
                          : 'Заявленные диапазоны экономии топлива и роста урожайности.'}
                      </p>
                    </div>
                  </section>

                  <section style={{ marginBottom: '36px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '32px 0 16px 0', lineHeight: '1.3' }}>
                      {lang === 'en' ? 'Effect on Photosynthesis' : 'Влияние на фотосинтез'}
                    </h2>
                    <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                      {lang === 'en'
                        ? 'In the technology description, functional ceramics are considered a source of pulsed radiation in the 620–680 nm range. Special attention is given to the region around 660 nm, associated with plant photobiological processes. The claimed mechanism implies an increase in pulse density under low external illumination conditions, when ordinary light may be insufficient.'
                        : 'В описании технологии функциональная керамика рассматривается как источник импульсного излучения в диапазоне 620–680 нм. Особое внимание уделяется области около 660 нм, связанной с фотобиологическими процессами растений. Заявленный механизм предполагает повышение плотности импульса в условиях слабой внешней освещённости, когда обычного света может быть недостаточно.'}
                    </p>
                    <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                      {lang === 'en'
                        ? 'From a practical point of view, this means that the composite is not merely viewed as a translucent covering, but as a functional element of the greenhouse system capable of altering the plant\'s spectral environment.'
                        : 'С практической точки зрения это означает, что композит рассматривается не просто как светопрозрачное покрытие, а как функциональный элемент тепличной системы, способный изменять спектральную среду растения.'}
                    </p>
                  </section>

                  <section style={{ marginBottom: '36px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '32px 0 16px 0', lineHeight: '1.3' }}>
                      {lang === 'en' ? 'Durability and UV Protection' : 'Долговечность и защита от УФ-воздействия'}
                    </h2>
                    <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                      {lang === 'en'
                        ? 'Comparative tests were conducted in the Parkent territory from February to December 2021. According to the provided description, ordinary polyethylene film had to be replaced 6 times due to degradation caused by UV radiation, whereas the composite maintained its condition without noticeable changes.'
                        : 'Сравнительные испытания на Паркентской территории за период февраль–декабрь 2021 года. По представленному описанию, обычную полиэтиленовую плёнку пришлось заменить 6 раз из-за разрушения под действием УФ-излучения, тогда как композит, сохранял состояние без заметных изменений.'}
                    </p>
                    <div style={{ margin: '32px 0', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => openModalImage(lang === 'en' ? '/images/stoikost_eng.webp' : '/images/stoikost.webp', lang === 'en' ? 'Claimed comparison of covering replacements in the 2021 test.' : 'Заявленное сравнение замен покрытия в испытании 2021 года.')}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'zoom-in', display: 'inline-block', width: '100%' }}
                        title={lang === 'en' ? 'Click to view full size' : 'Нажмите для увеличения'}
                      >
                        <img
                          src={lang === 'en' ? '/images/stoikost_eng.webp' : '/images/stoikost.webp'}
                          alt={lang === 'en' ? 'Claimed comparison of covering replacements in the 2021 test.' : 'Заявленное сравнение замен покрытия в испытании 2021 года.'}
                          style={{
                            width: '75%',
                            height: 'auto',
                            display: 'block',
                            borderRadius: 'var(--radius-md)',
                            margin: '0 auto'
                          }}
                          loading="lazy"
                        />
                      </button>
                      <p style={{ fontStyle: 'italic', marginTop: '12px', color: '#64748b', fontSize: '0.95rem', textAlign: 'center' }}>
                        {lang === 'en'
                          ? 'Claimed comparison of covering replacements in the 2021 test.'
                          : 'Заявленное сравнение замен покрытия в испытании 2021 года.'}
                      </p>
                    </div>
                    <div style={{ margin: '32px 0', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => openModalImage(lang === 'en' ? '/images/dast_eng.webp' : '/images/dast.webp', lang === 'en' ? 'Additional Information' : 'Дополнительная информация')}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'zoom-in', display: 'inline-block', width: '100%' }}
                        title={lang === 'en' ? 'Click to view full size' : 'Нажмите для увеличения'}
                      >
                        <img
                          src={lang === 'en' ? '/images/dast_eng.webp' : '/images/dast.webp'}
                          alt={lang === 'en' ? 'Additional Information' : 'Дополнительная информация'}
                          style={{
                            width: '75%',
                            height: 'auto',
                            display: 'block',
                            borderRadius: 'var(--radius-md)',
                            margin: '0 auto'
                          }}
                          loading="lazy"
                        />
                      </button>
                    </div>
                  </section>

                  <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '32px 0 16px 0', lineHeight: '1.3' }}>
                      {lang === 'en' ? 'Claimed Economic Logic' : 'Заявленная экономическая логика'}
                    </h2>
                    <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                      {lang === 'en'
                        ? 'Despite the claimed increase in material cost of approximately 20–25% in mass production, the documentation indicates that additional costs can be compensated for by lower fuel and water consumption, higher yields, a longer service life of the covering, and reduced labor costs.'
                        : 'Несмотря на заявленное увеличение стоимости материала примерно на 20–25% при массовом производстве, на странице указывается, что дополнительные затраты могут компенсироваться за счёт меньшего расхода топлива и воды, более высокой урожайности, большего срока службы покрытия и снижения трудозатрат.'}
                    </p>
                    <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                      {lang === 'en'
                        ? 'For a commercial proposal, it is reasonable to calculate economics not by the price of a single roll, but by the full lifecycle cost:'
                        : 'Для коммерческого предложения разумно считать экономику не по цене одного рулона, а по стоимости полного цикла:'}
                    </p>
                    <div style={{ margin: '32px 0', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => openModalImage(
                          lang === 'en' ? '/images/zatrati_eng.webp' : '/images/zatrati.webp',
                          lang === 'en' ? 'Claimed Economic Logic' : 'Заявленная экономическая логика'
                        )}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'zoom-in', display: 'inline-block', width: '100%' }}
                        title={lang === 'en' ? 'Click to view full size' : 'Нажмите для увеличения'}
                      >
                        <img
                          src={lang === 'en' ? '/images/zatrati_eng.webp' : '/images/zatrati.webp'}
                          alt={lang === 'en' ? 'Claimed Economic Logic' : 'Заявленная экономическая логика'}
                          style={{
                            width: '75%',
                            height: 'auto',
                            display: 'block',
                            borderRadius: 'var(--radius-md)',
                            margin: '0 auto'
                          }}
                          loading="lazy"
                        />
                      </button>
                    </div>
                  </section>

                  <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '32px 0 16px 0', lineHeight: '1.3' }}>
                      {lang === 'en' ? 'Promising Application Areas' : 'Перспективные области применения'}
                    </h2>
                    <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                      {lang === 'en'
                        ? 'Among the promising directions named are the cultivation and drying of microalgae, the use of composites in arid regions, the creation of a comfortable microenvironment indoors and outdoors, as well as the further development of composites based on acrylic and polyamide.'
                        : 'Среди перспективных направлений названы выращивание и сушка микроводорослей, использование композитов в засушливых территориях, создание комфортной микросреды в помещениях и на открытом воздухе, а также дальнейшая разработка композитов на основе акрила и полиамида.'}
                    </p>
                    <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                      {lang === 'en'
                        ? 'Separately, a promising development is described: a covering with automatic spectral modification upon temperature drop—increasing the proportion of far-IR radiation (9.7–10 µm) while reducing the red component.'
                        : 'Отдельно описывается перспективная разработка покрытия с автоматическим изменением спектральной характеристики при снижении температуры: увеличение доли дальнего ИК-излучения 9,7–10 мкм и уменьшение красной составляющей.'}
                    </p>
                  </section>

                  <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '32px 0 16px 0', lineHeight: '1.3' }}>
                      {lang === 'en' ? 'Microalgae and Arid Territories' : 'Микроводоросли и засушливые территории'}
                    </h2>
                    <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                      {lang === 'en'
                        ? 'The possibility of using specialized film-ceramic composites for a continuous system of microalgae cultivation and drying is highlighted. The concept combines solar resources, reduced evaporation, and optimized temperature-light conditions. The potential application of the technology in projects for the development of arid territories is also mentioned.'
                        : 'Возможность применения специальных пленочно-керамических композитов для непрерывной системы выращивания и сушки микроводорослей. Идея заключается в объединении солнечного ресурса, снижения испарения и оптимизации температурно-светового режима. Также упоминается возможность использования технологии в проектах по освоению засушливых территорий.'}
                    </p>
                    <div style={{ margin: '32px 0', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => openModalImage(
                          lang === 'en' ? '/images/raznica_eng.webp' : '/images/raznica.webp',
                          lang === 'en' ? 'Microalgae and Arid Territories' : 'Микроводоросли и засушливые территории'
                        )}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'zoom-in', display: 'inline-block', width: '100%' }}
                        title={lang === 'en' ? 'Click to view full size' : 'Нажмите для увеличения'}
                      >
                        <img
                          src={lang === 'en' ? '/images/raznica_eng.webp' : '/images/raznica.webp'}
                          alt={lang === 'en' ? 'Microalgae and Arid Territories' : 'Микроводоросли и засушливые территории'}
                          style={{
                            width: '75%',
                            height: 'auto',
                            display: 'block',
                            borderRadius: 'var(--radius-md)',
                            margin: '0 auto'
                          }}
                          loading="lazy"
                        />
                      </button>
                    </div>
                  </section>
                </>
              ) : slug === 'steril' ? (
                <>
                  <div className="steril-intro-row">
                    <div className="steril-intro-text-col">
                      <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                        {lang === 'en'
                          ? 'Our sterilization method utilizes ceramic emitters. The approach is based on converting primary source energy with functional IR ceramics into short pulses of high energy density, tuned predominantly to the absorption spectrum of water molecules. According to the description, the pulses are absorbed by water contained in microorganisms, resulting in rapid localized energetic action. The entire sterilization process on the page is characterized as taking several minutes.'
                          : 'Наш метод стерилизации, в котором используются керамические излучатели. В основе подхода находится преобразование энергии первичного источника функциональной ИК-керамикой в короткие импульсы высокой плотности энергии, настроенные преимущественно на спектр поглощения молекул воды. По описанию, импульсы поглощаются водой, содержащейся в микроорганизмах, что приводит к быстрому локальному энергетическому воздействию. Весь процесс стерилизации на странице характеризуется как занимающий несколько минут.'}
                      </p>
                      <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: 0, lineHeight: '1.75' }}>
                        {lang === 'en'
                          ? 'It is specifically emphasized that for this approach, the determining factor is not only temperature, but the uniformity of volumetric irradiation in the sterilizer\'s working zone across different operating modes. This allows the sterilizer design to be viewed as an integrated system where the radiation source, spectral characteristics, chamber geometry, and energy distribution uniformity are all critical.'
                          : 'Отдельно подчёркивается, что для данного подхода определяющим фактором является не только температура, а равномерность объёмного облучения рабочей зоны стерилизатора при различных режимах работы. Это позволяет рассматривать конструкцию стерилизатора как систему, в которой важны источник излучения, спектральные характеристики, геометрия камеры и равномерность распределения энергии.'}
                      </p>
                    </div>

                    <div className="steril-intro-img-col">
                      <button
                        type="button"
                        onClick={() => openModalImage(
                          '/images/ks250shem.webp',
                          lang === 'en' ? 'KS-250 Sterilizer Schematic' : 'Схема стерилизатора KS-250'
                        )}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          cursor: 'zoom-in',
                          display: 'block',
                          width: '100%',
                          textAlign: 'center'
                        }}
                        title={lang === 'en' ? 'Click to view full size' : 'Нажмите для увеличения'}
                      >
                        <img
                          src="/images/ks250shem.webp"
                          alt={lang === 'en' ? 'KS-250 Sterilizer Schematic' : 'Схема стерилизатора KS-250'}
                          className="steril-intro-img"
                          loading="lazy"
                        />
                      </button>
                    </div>
                  </div>

                  <div style={{ margin: '28px 0', textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => openModalImage(
                        lang === 'en' ? '/images/steril_princip_eng.webp' : '/images/steril_princip.webp',
                        lang === 'en' ? 'Operating principle: Energy conversion sequence during sterilization' : 'Принцип действия: Последовательность преобразования энергии в процессе стерилизации'
                      )}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'zoom-in', display: 'inline-block', width: '100%' }}
                      title={lang === 'en' ? 'Click to view full size' : 'Нажмите для увеличения'}
                    >
                      <img
                        src={lang === 'en' ? '/images/steril_princip_eng.webp' : '/images/steril_princip.webp'}
                        alt={lang === 'en' ? 'Operating principle: Energy conversion sequence during sterilization' : 'Принцип действия: Последовательность преобразования энергии в процессе стерилизации'}
                        style={{
                          width: '90%',
                          maxWidth: '864px',
                          height: 'auto',
                          borderRadius: 'var(--radius-md)',
                          display: 'block',
                          margin: '0 auto'
                        }}
                        loading="lazy"
                      />
                    </button>
                  </div>

                  <section style={{ marginTop: '40px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', marginBottom: '20px', lineHeight: '1.3' }}>
                      {lang === 'en' ? 'Key Features of the Technology' : 'Ключевые особенности технологии'}
                    </h2>

                    <div style={{ margin: '24px 0 32px 0', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => openModalImage(
                          lang === 'en' ? '/images/steril_osoben_eng.webp' : '/images/steril_osoben.webp',
                          lang === 'en' ? 'Key Features of the Technology' : 'Ключевые особенности технологии'
                        )}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'zoom-in', display: 'inline-block', width: '100%' }}
                        title={lang === 'en' ? 'Click to view full size' : 'Нажмите для увеличения'}
                      >
                        <img
                          src={lang === 'en' ? '/images/steril_osoben_eng.webp' : '/images/steril_osoben.webp'}
                          alt={lang === 'en' ? 'Key Features of the Technology' : 'Ключевые особенности технологии'}
                          style={{
                            width: '90%',
                            maxWidth: '864px',
                            height: 'auto',
                            borderRadius: 'var(--radius-md)',
                            display: 'block',
                            margin: '0 auto'
                          }}
                          loading="lazy"
                        />
                      </button>
                    </div>
                  </section>

                  <section style={{ marginTop: '40px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', marginBottom: '20px', lineHeight: '1.3' }}>
                      {lang === 'en' ? 'Comparison with Traditional Methods' : 'Сравнение с традиционными методами'}
                    </h2>
                    <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '24px', lineHeight: '1.75' }}>
                      {lang === 'en'
                        ? 'The page provides a comparison of a dry heat sterilizer, autoclave, and IR sterilizer in terms of warm-up time, sterilization time, drying time, cooling time, typical cycle duration, cycles per hour, operating temperature, instrument corrosion and discoloration, pressurized operation, operating costs, cleaning requirements, portability, consumables, and retail price.'
                        : 'Страница содержит сопоставление сухожарочного шкафа, автоклава и ИК-стерилизатора по времени разогрева, стерилизации, сушки, остывания, типичной продолжительности цикла, количеству циклов в час, рабочей температуре, коррозии и изменению цвета инструментов, работе под давлением, эксплуатационным расходам, очистке, портативности, расходным материалам и розничной цене.'}
                    </p>

                    <div style={{ margin: '24px 0 32px 0', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => openModalImage(
                          lang === 'en' ? '/images/steril_sravni_eng.webp' : '/images/steril_sravni.webp',
                          lang === 'en' ? 'Comparison with Traditional Methods' : 'Сравнение с традиционными методами'
                        )}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'zoom-in', display: 'inline-block', width: '100%' }}
                        title={lang === 'en' ? 'Click to view full size' : 'Нажмите для увеличения'}
                      >
                        <img
                          src={lang === 'en' ? '/images/steril_sravni_eng.webp' : '/images/steril_sravni.webp'}
                          alt={lang === 'en' ? 'Comparison with Traditional Methods' : 'Сравнение с традиционными методами'}
                          style={{
                            width: '90%',
                            maxWidth: '864px',
                            height: 'auto',
                            borderRadius: 'var(--radius-md)',
                            display: 'block',
                            margin: '0 auto'
                          }}
                          loading="lazy"
                        />
                      </button>
                    </div>
                  </section>

                  <section style={{ marginTop: '40px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', marginBottom: '20px', lineHeight: '1.3' }}>
                      {lang === 'en' ? 'Productivity and Operating Cycle' : 'Производительность и рабочий цикл'}
                    </h2>
                    <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '16px', lineHeight: '1.75' }}>
                      {lang === 'en'
                        ? 'According to the table, the typical cycle duration for the IR sterilizer is 40 minutes, with the number of cycles per hour rated at 1.5–2.0 including warm-up. For the dry heat sterilizer, the range is 1.6–2.6 hours per cycle, and for the autoclave, 1.4–1.8 hours.'
                        : 'По приведённой на странице таблице, типичная продолжительность цикла для ИК-стерилизатора составляет 40 минут, а количество циклов в час указано на уровне 1,5–2,0 с учётом разогрева. Для сухожарочного шкафа приведён диапазон 1,6–2,6 часа на цикл, для автоклава — 1,4–1,8 часа.'}
                    </p>
                    <p style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '24px', lineHeight: '1.75' }}>
                      {lang === 'en'
                        ? 'Such a comparison is valuable for evaluating workflow organization: reducing cycle duration increases the number of potentially performed cycles per work shift while maintaining the specified treatment parameters.'
                        : 'Такое сравнение удобно для оценки организации рабочего процесса: сокращение продолжительности цикла увеличивает число потенциально выполняемых циклов за рабочую смену при сохранении заданного режима обработки.'}
                    </p>
                  </section>

                  <section style={{ marginTop: '40px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', marginBottom: '20px', lineHeight: '1.3' }}>
                      {lang === 'en' ? 'Sterilizer IRX-2000' : 'Стерилизатор IRX-2000'}
                    </h2>

                    <div className="steril-irx-row">
                      <div className="steril-irx-img-col">
                        <button
                          type="button"
                          onClick={() => openModalImage(
                            '/images/ks250.webp',
                            lang === 'en' ? 'Sterilizer IRX-2000' : 'Стерилизатор IRX-2000'
                          )}
                          style={{ background: 'none', border: 'none', padding: 0, cursor: 'zoom-in', display: 'block', width: '100%' }}
                          title={lang === 'en' ? 'Click to view full size' : 'Нажмите для увеличения'}
                        >
                          <img
                            src="/images/ks250.webp"
                            alt={lang === 'en' ? 'Sterilizer IRX-2000' : 'Стерилизатор IRX-2000'}
                            className="steril-irx-img"
                            loading="lazy"
                          />
                        </button>
                      </div>

                      <div className="steril-irx-text-col">
                        <p style={{ textAlign: 'justify', textJustify: 'inter-word', margin: 0, lineHeight: '1.75' }}>
                          {lang === 'en'
                            ? 'The IRX-2000 sterilizer is featured separately. Specified dimensions are 48.3 × 30.5 × 24.1 cm, tray dimensions 25.4 × 14.0 × 3.3 cm, and weight 3.75 kg. Power requirements are 220 V, 50 Hz. Power consumption is specified as 600/330 W. Object temperature is 160–190 °C. Nominal sterilization time is 10 minutes, total sterilization time is 15 minutes, object cooling time is 15 minutes, and full sterilization cycle is 30 minutes.'
                            : 'На странице отдельно представлен стерилизатор IRX-2000. Указаны размеры 48,3×30,5×24,1 см, размеры поддона 25,4×14,0×3,3 см и масса 3,75 кг. Требования к питанию — 220 В, 50 Гц. Потребляемая мощность указана как 600/330 Вт. Температура объекта — 160–190 °C. Номинальное время стерилизации — 10 минут, общее время стерилизации — 15 минут, время остывания объекта — 15 минут, а вся стерилизация — 30 минут.'}
                        </p>
                      </div>
                    </div>

                    <div style={{ margin: '24px 0 16px 0', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => openModalImage(
                          lang === 'en' ? '/images/cikl_eng.webp' : '/images/cikl.webp',
                          lang === 'en' ? 'IRX-2000 Cycle Timeline' : 'Временная схема рабочего цикла IRX-2000'
                        )}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'zoom-in', display: 'inline-block', width: '100%' }}
                        title={lang === 'en' ? 'Click to view full size' : 'Нажмите для увеличения'}
                      >
                        <img
                          src={lang === 'en' ? '/images/cikl_eng.webp' : '/images/cikl.webp'}
                          alt={lang === 'en' ? 'IRX-2000 Cycle Timeline' : 'Временная схема рабочего цикла IRX-2000'}
                          style={{
                            width: '90%',
                            maxWidth: '864px',
                            height: 'auto',
                            borderRadius: 'var(--radius-md)',
                            display: 'block',
                            margin: '0 auto'
                          }}
                          loading="lazy"
                        />
                      </button>
                    </div>
                  </section>

                  <section style={{ marginTop: '48px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', marginBottom: '20px', lineHeight: '1.3' }}>
                      {lang === 'en' ? 'Other Models' : 'Другие модели'}
                    </h2>

                    <div className="steril-models-grid">
                      {[
                        {
                          ru: '/images/ster_feruza.webp',
                          en: '/images/ster_feruza_eng.webp',
                          altRu: 'Стерилизатор «Феруза»',
                          altEn: 'Sterilizer "Feruza"'
                        },
                        {
                          ru: '/images/ster_fial.webp',
                          en: '/images/ster_fial_eng.webp',
                          altRu: 'Стерилизатор «Фиал»',
                          altEn: 'Sterilizer "Fial"'
                        },
                        {
                          ru: '/images/ster_is1.webp',
                          en: '/images/ster_is1_eng.webp',
                          altRu: 'Стерилизатор «ИС-1»',
                          altEn: 'Sterilizer "IS-1"'
                        },
                        {
                          ru: '/images/ster_KS-250.webp',
                          en: '/images/ster_KS-250_eng.webp',
                          altRu: 'Стерилизатор «KS-250»',
                          altEn: 'Sterilizer "KS-250"'
                        },
                        {
                          ru: '/images/ster_les100.webp',
                          en: '/images/ster_les100_eng.webp',
                          altRu: 'Стерилизатор «ЛЭС-100»',
                          altEn: 'Sterilizer "LES-100"'
                        },
                        {
                          ru: '/images/ster_mi10.webp',
                          en: '/images/ster_mi10_eng.webp',
                          altRu: 'Стерилизатор «МИ-10»',
                          altEn: 'Sterilizer "MI-10"'
                        },
                        {
                          ru: '/images/ster_ms-1.webp',
                          en: '/images/ster_ms-1_eng.webp',
                          altRu: 'Стерилизатор «МС-1»',
                          altEn: 'Sterilizer "MS-1"'
                        }
                      ].map((item, index) => {
                        const imgSrc = lang === 'en' ? item.en : item.ru;
                        const imgAlt = lang === 'en' ? item.altEn : item.altRu;
                        return (
                          <div key={index} style={{ width: '100%' }}>
                            <button
                              type="button"
                              onClick={() => openModalImage(imgSrc, imgAlt)}
                              style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                cursor: 'zoom-in',
                                display: 'block',
                                width: '100%'
                              }}
                              title={lang === 'en' ? 'Click to view full size' : 'Нажмите для увеличения'}
                            >
                              <img
                                src={imgSrc}
                                alt={imgAlt}
                                style={{
                                  width: '100%',
                                  height: 'auto',
                                  borderRadius: 'var(--radius-md)',
                                  display: 'block'
                                }}
                                loading="lazy"
                              />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  <section style={{ marginTop: '48px' }}>
                    <div style={{ marginBottom: '20px' }}>
                      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px', lineHeight: '1.3' }}>
                        {lang === 'en' ? 'Test Acts and Conclusions' : 'Акты испытаний и заключения'}
                      </h2>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', margin: 0 }}>
                        {lang === 'en'
                          ? `Official protocols, test acts, and expert conclusions for functional ceramics sterilizers (${sterilCertificates.length} documents)`
                          : `Официальные протоколы, акты испытаний и экспертные заключения по стерилизаторам на основе функциональной керамики (${sterilCertificates.length} документов)`}
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '20px' }}>
                      {sterilCertificates.map((cert) => {
                        const title = lang === 'en' ? cert.title_en : cert.title;
                        const category = lang === 'en' ? cert.category_en : cert.category;
                        return (
                          <div
                            key={cert.id}
                            onClick={() => openCert(cert)}
                            className="data-card"
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              cursor: 'pointer',
                              padding: '12px',
                              borderRadius: 'var(--radius-lg)',
                              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                              background: '#ffffff',
                              border: '1px solid var(--color-border)',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                            }}
                          >
                            <div
                              style={{
                                height: '240px',
                                background: '#f8fafc',
                                borderRadius: 'var(--radius-md)',
                                overflow: 'hidden',
                                border: '1px solid #e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative'
                              }}
                            >
                              <img
                                src={cert.preview || cert.cover || (cert.pages && cert.pages[0]) || cert.src}
                                alt={title}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'contain',
                                  padding: '6px'
                                }}
                                loading="lazy"
                              />
                              <div
                                style={{
                                  position: 'absolute',
                                  top: '8px',
                                  right: '8px',
                                  background: 'rgba(15, 23, 42, 0.75)',
                                  color: '#ffffff',
                                  borderRadius: 'var(--radius-full)',
                                  padding: '2px 8px',
                                  fontSize: '0.7rem',
                                  fontWeight: 600,
                                  backdropFilter: 'blur(4px)'
                                }}
                              >
                                № {cert.id}
                              </div>

                              {cert.pageCount > 1 && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    bottom: '8px',
                                    right: '8px',
                                    background: 'rgba(2, 132, 199, 0.92)',
                                    color: '#ffffff',
                                    borderRadius: 'var(--radius-full)',
                                    padding: '2px 8px',
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    backdropFilter: 'blur(4px)'
                                  }}
                                >
                                  <FileText size={11} />
                                  <span>{lang === 'en' ? `${cert.pageCount} pages` : `${cert.pageCount} ${cert.pageCount < 5 ? 'страницы' : 'страниц'}`}</span>
                                </div>
                              )}
                            </div>

                            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                              <span
                                className="badge badge-blue"
                                style={{ alignSelf: 'flex-start', fontSize: '0.7rem', marginBottom: '6px' }}
                              >
                                {category}
                              </span>
                              <h4
                                style={{
                                  fontSize: '0.84375rem',
                                  fontWeight: 600,
                                  color: 'var(--color-text-main)',
                                  lineHeight: 1.4,
                                  margin: 0,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden'
                                }}
                                title={title}
                              >
                                {title}
                              </h4>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Документы и акты испытаний в формате PDF для steril */}
                    <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--color-border)' }}>
                      <div style={{ marginBottom: '24px' }}>
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'rgba(239, 68, 68, 0.08)',
                            color: '#dc2626',
                            padding: '4px 12px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            marginBottom: '8px'
                          }}
                        >
                          <FileText size={14} />
                          <span>{lang === 'en' ? 'PDF Archive & Reports' : 'PDF Архив и акты'}</span>
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
                          {lang === 'en' ? 'Official Acts and Conclusions in PDF' : 'Официальные акты и заключения в формате PDF'}
                        </h3>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', margin: 0 }}>
                          {lang === 'en'
                            ? `Original test acts, research protocols, and official sanitary conclusions (${sterilPdfs.length} documents)`
                            : `Оригиналы актов испытаний, протоколы исследований и санитарно-эпидемиологические заключения (${sterilPdfs.length} документов)`}
                        </p>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                        {sterilPdfs.map((pdf) => (
                          <div
                            key={pdf.id}
                            className="data-card"
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              padding: '16px',
                              borderRadius: 'var(--radius-lg)',
                              background: '#ffffff',
                              border: '1px solid var(--color-border)',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>
                                  {lang === 'en' ? pdf.category_en : pdf.category}
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                                    {lang === 'en' ? pdf.sizeEn : pdf.sizeMb}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: '0.6875rem',
                                      fontWeight: 700,
                                      color: '#dc2626',
                                      background: '#fee2e2',
                                      padding: '1px 6px',
                                      borderRadius: '4px'
                                    }}
                                  >
                                    PDF
                                  </span>
                                </div>
                              </div>

                              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                <div
                                  style={{
                                    width: '38px',
                                    height: '38px',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    color: '#dc2626',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    marginTop: '2px'
                                  }}
                                >
                                  <FileText size={20} />
                                </div>
                                <h4
                                  style={{
                                    fontSize: '0.9375rem',
                                    fontWeight: 600,
                                    color: '#0f172a',
                                    lineHeight: 1.45,
                                    margin: 0
                                  }}
                                >
                                  {lang === 'en' ? pdf.title_en : pdf.title}
                                </h4>
                              </div>
                            </div>

                            <div
                              style={{
                                marginTop: '16px',
                                paddingTop: '12px',
                                borderTop: '1px solid #f1f5f9',
                                display: 'flex',
                                gap: '8px',
                                justifyContent: 'flex-end'
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => setActivePdf(pdf)}
                                className="btn btn-outline"
                                style={{
                                  padding: '6px 12px',
                                  fontSize: '0.8125rem',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  cursor: 'pointer'
                                }}
                              >
                                <Eye size={14} />
                                <span>{lang === 'en' ? 'Open' : 'Открыть'}</span>
                              </button>
                              <a
                                href={pdf.url}
                                download={pdf.originalFileName}
                                className="btn btn-primary"
                                style={{
                                  padding: '6px 12px',
                                  fontSize: '0.8125rem',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  textDecoration: 'none'
                                }}
                              >
                                <Download size={14} />
                                <span>{lang === 'en' ? 'Download' : 'Скачать'}</span>
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                </>
              ) : (() => {
                const textList = (lang === 'en' && dev.full_text_en ? dev.full_text_en : dev.full_text) || [];
                const blocks = [];
                let currentList = null;

                textList.forEach((item, idx) => {
                  const isBullet = typeof item === 'string' && (item.startsWith('•') || item.startsWith('- '));
                  if (isBullet) {
                    const cleanText = item.replace(/^[•\-]\s*/, '').trim();
                    if (!currentList) {
                      currentList = { type: 'list', items: [cleanText], key: `list-${idx}` };
                      blocks.push(currentList);
                    } else {
                      currentList.items.push(cleanText);
                    }
                  } else {
                    currentList = null;
                    blocks.push({ type: 'item', text: item, key: `item-${idx}` });
                  }
                });

                return blocks.map((block, idx) => {
                  if (block.type === 'list') {
                    const isAdvantagesList = block.items.some(item => item.includes('сокращение времени сушки'));
                    const isEconomicList = block.items.some(item => item.includes('меньше времени на одну операцию'));

                    return (
                      <React.Fragment key={block.key}>
                        <ul
                          style={{
                            margin: '16px 0 28px 0',
                            paddingLeft: '0',
                            listStyle: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                          }}
                        >
                          {block.items.map((bullet, bulletIdx) => (
                            <li
                              key={bulletIdx}
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px',
                                fontSize: '1rem',
                                lineHeight: '1.65',
                                color: '#334155'
                              }}
                            >
                              <span
                                style={{
                                  width: '7px',
                                  height: '7px',
                                  minWidth: '7px',
                                  borderRadius: '50%',
                                  backgroundColor: 'var(--color-primary, #0284c7)',
                                  marginTop: '9px',
                                  boxShadow: '0 0 0 2px rgba(2, 132, 199, 0.2)',
                                  flexShrink: 0
                                }}
                              />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>

                        {slug === 'kraska' && isAdvantagesList && (
                          <div style={{ margin: '32px 0 36px 0', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => openModalImage(
                                lang === 'en' ? '/images/sravni_eng.webp' : '/images/sravni.webp',
                                lang === 'en' ? 'Comparison of the Technological Process' : 'Сравнение технологического процесса'
                              )}
                              style={{ background: 'none', border: 'none', padding: 0, cursor: 'zoom-in', display: 'inline-block', width: '100%' }}
                              title={lang === 'en' ? 'Click to view full size' : 'Нажмите для увеличения'}
                            >
                              <img
                                src={lang === 'en' ? '/images/sravni_eng.webp' : '/images/sravni.webp'}
                                alt={lang === 'en' ? 'Comparison of the Technological Process' : 'Сравнение технологического процесса'}
                                style={{
                                  width: '80%',
                                  maxWidth: '768px',
                                  height: 'auto',
                                  borderRadius: 'var(--radius-md)',
                                  display: 'block',
                                  margin: '0 auto'
                                }}
                                loading="lazy"
                              />
                            </button>
                          </div>
                        )}

                        {slug === 'kraska' && isEconomicList && (
                          <div style={{ margin: '32px 0 36px 0', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => openModalImage(
                                lang === 'en' ? '/images/rek_eng.webp' : '/images/rek.webp',
                                lang === 'en' ? 'Functional Ceramics Technology Overview' : 'Функциональная керамика: сводная инфографика'
                              )}
                              style={{ background: 'none', border: 'none', padding: 0, cursor: 'zoom-in', display: 'inline-block', width: '100%' }}
                              title={lang === 'en' ? 'Click to view full size' : 'Нажмите для увеличения'}
                            >
                              <img
                                src={lang === 'en' ? '/images/rek_eng.webp' : '/images/rek.webp'}
                                alt={lang === 'en' ? 'Functional Ceramics Technology Overview' : 'Функциональная керамика: сводная инфографика'}
                                style={{
                                  width: '80%',
                                  maxWidth: '768px',
                                  height: 'auto',
                                  borderRadius: 'var(--radius-md)',
                                  display: 'block',
                                  margin: '0 auto'
                                }}
                                loading="lazy"
                              />
                            </button>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  }

                  const paragraph = block.text;
                  const isHeading = paragraph.startsWith('#') ||
                    paragraph === 'Почему кальций необходим организму' ||
                    paragraph === 'Принцип работы технологии' ||
                    paragraph === 'Функциональная керамика: новая технология сушки покрытий' ||
                    paragraph === 'Как работает технология' ||
                    paragraph === 'Ключевые преимущества' ||
                    paragraph === 'Преимущество для производства' ||
                    paragraph === 'Покрытие с высокой адгезией' ||
                    paragraph === 'Промышленный масштаб применения' ||
                    paragraph === 'Экономический эффект' ||
                    paragraph === 'Краткая формула процесса';

                  if (isHeading) {
                    const headingText = paragraph.replace(/^#+\s*/, '');
                    const isProcessHeading = slug === 'kraska' && headingText === 'Краткая формула процесса';
                    const isKraskaIntroHeading = slug === 'kraska' && headingText === 'Функциональная керамика: новая технология сушки покрытий';
                    const isCottonIndicatorsHeading = slug === 'cotton' && (headingText === 'Ключевые показатели' || headingText === 'Key Indicators');

                    if (isKraskaIntroHeading) {
                      const introP1 = textList.find(p => typeof p === 'string' && p.includes('Разработана функциональная керамика'));
                      const introP2 = textList.find(p => typeof p === 'string' && p.includes('В отличие от традиционных'));

                      return (
                        <React.Fragment key={block.key}>
                          <h2
                            style={{
                              fontSize: '1.4rem',
                              fontWeight: 700,
                              color: '#0f172a',
                              margin: idx === 0 ? '8px 0 20px 0' : '32px 0 20px 0',
                              lineHeight: '1.3'
                            }}
                          >
                            {headingText}
                          </h2>

                          <div className="kraska-intro-row">
                            <div className="kraska-intro-text">
                              {introP1 && (
                                <p
                                  style={{
                                    textAlign: 'justify',
                                    textJustify: 'inter-word',
                                    marginBottom: '16px',
                                    lineHeight: '1.75'
                                  }}
                                >
                                  {introP1}
                                </p>
                              )}
                              {introP2 && (
                                <p
                                  style={{
                                    textAlign: 'justify',
                                    textJustify: 'inter-word',
                                    marginBottom: '0',
                                    lineHeight: '1.75'
                                  }}
                                >
                                  {introP2}
                                </p>
                              )}
                            </div>

                            <div className="kraska-intro-img-col">
                              <button
                                type="button"
                                onClick={() => openModalImage(
                                  '/images/ustanovka.webp',
                                  lang === 'en' ? 'Functional Ceramics Drying Installation' : 'Установка сушки покрытий'
                                )}
                                style={{ background: 'none', border: 'none', padding: 0, cursor: 'zoom-in', display: 'inline-block', width: '100%' }}
                                title={lang === 'en' ? 'Click to view full size' : 'Нажмите для увеличения'}
                              >
                                <img
                                  src="/images/ustanovka.webp"
                                  alt={lang === 'en' ? 'Functional Ceramics Drying Installation' : 'Установка сушки покрытий'}
                                  style={{
                                    width: '100%',
                                    maxHeight: '440px',
                                    objectFit: 'contain',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'block',
                                    margin: '0 auto'
                                  }}
                                  loading="lazy"
                                />
                              </button>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    }

                    return (
                      <React.Fragment key={block.key}>
                        <h2
                          style={{
                            fontSize: '1.4rem',
                            fontWeight: 700,
                            color: '#0f172a',
                            margin: idx === 0 ? '8px 0 16px 0' : '32px 0 16px 0',
                            lineHeight: '1.3'
                          }}
                        >
                          {headingText}
                        </h2>

                        {isCottonIndicatorsHeading && (
                          <div style={{ margin: '24px 0 32px 0' }}>
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                                gap: '16px',
                                marginBottom: '24px'
                              }}
                            >
                              <div
                                style={{
                                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                                  border: '1px solid #bbf7d0',
                                  borderRadius: 'var(--radius-lg, 12px)',
                                  padding: '20px 22px',
                                  boxShadow: 'var(--shadow-sm)'
                                }}
                              >
                                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                                  {lang === 'en' ? 'Energy Efficiency' : 'Энергоэффективность'}
                                </div>
                                <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#14532d', lineHeight: '1.1', marginBottom: '6px' }}>
                                  {lang === 'en' ? '9.4× lower' : 'в 9,4 раза'}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#166534', lineHeight: '1.45' }}>
                                  {lang === 'en'
                                    ? 'Reduction in total energy consumption compared to conventional drying'
                                    : 'Снижение суммарного расхода энергии по сравнению с традиционным способом'}
                                </div>
                              </div>

                              <div
                                style={{
                                  background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                                  border: '1px solid #bfdbfe',
                                  borderRadius: 'var(--radius-lg, 12px)',
                                  padding: '20px 22px',
                                  boxShadow: 'var(--shadow-sm)'
                                }}
                              >
                                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                                  {lang === 'en' ? 'Electricity' : 'Электроэнергия'}
                                </div>
                                <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#1e3a8a', lineHeight: '1.1', marginBottom: '6px' }}>
                                  {lang === 'en' ? '> 2.3× lower' : '> 2,3 раза'}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#1e40af', lineHeight: '1.45' }}>
                                  {lang === 'en'
                                    ? 'Decrease in electric power consumption during infrared drying trials'
                                    : 'Снижение расхода электроэнергии при инфракрасной сушке'}
                                </div>
                              </div>

                              <div
                                style={{
                                  background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
                                  border: '1px solid #fed7aa',
                                  borderRadius: 'var(--radius-lg, 12px)',
                                  padding: '20px 22px',
                                  boxShadow: 'var(--shadow-sm)'
                                }}
                              >
                                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#9a3412', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                                  {lang === 'en' ? 'Liquid Fuel' : 'Жидкое топливо'}
                                </div>
                                <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#7c2d12', lineHeight: '1.1', marginBottom: '6px' }}>
                                  {lang === 'en' ? '100% eliminated' : '100% отказ'}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#9a3412', lineHeight: '1.45' }}>
                                  {lang === 'en'
                                    ? 'Complete elimination of liquid fuel combustion in the processing cycle'
                                    : 'Полное исключение необходимости сжигания жидкого топлива'}
                                </div>
                              </div>

                              <div
                                style={{
                                  background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
                                  border: '1px solid #e9d5ff',
                                  borderRadius: 'var(--radius-lg, 12px)',
                                  padding: '20px 22px',
                                  boxShadow: 'var(--shadow-sm)'
                                }}
                              >
                                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#6b21a8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                                  {lang === 'en' ? 'Uzbekistan Patent' : 'Патент Узбекистана'}
                                </div>
                                <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#581c87', lineHeight: '1.1', marginBottom: '6px' }}>
                                  IAP 04881
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#6b21a8', lineHeight: '1.45' }}>
                                  {lang === 'en'
                                    ? 'Method for drying raw seed cotton preserving seed germination qualities'
                                    : '«Способ сушки хлопка-сырца» с сохранением посевных качеств семян'}
                                </div>
                              </div>
                            </div>

                            {/* Раздел "Акты испытаний и заключения" */}
                            <div style={{ marginTop: '36px', paddingTop: '28px', borderTop: '1px solid var(--color-border)' }}>
                              <div style={{ marginBottom: '20px' }}>
                                <div
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    background: 'rgba(2, 132, 199, 0.08)',
                                    color: '#0284c7',
                                    padding: '4px 12px',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: '0.8125rem',
                                    fontWeight: 600,
                                    marginBottom: '8px'
                                  }}
                                >
                                  <CheckCircle2 size={14} />
                                  <span>{lang === 'en' ? 'Official Documentation' : 'Официальная документация'}</span>
                                </div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0', lineHeight: '1.3' }}>
                                  {lang === 'en' ? 'Test Acts and Conclusions' : 'Акты испытаний и заключения'}
                                </h3>
                                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', margin: 0 }}>
                                  {lang === 'en'
                                    ? 'Official test protocols, economic efficiency evaluations, and research reports on infrared raw cotton drying'
                                    : 'Официальные протоколы испытаний, сведения об экономической эффективности и отчёты о результатах ИК-сушки хлопка'}
                                </p>
                              </div>

                              {/* 3 Картинки в один ряд */}
                              <div className="cotton-certs-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                                {[
                                  {
                                    id: 1,
                                    file: '/images/cotton/protokol_isp.jpg',
                                    title: lang === 'en'
                                      ? 'Test Protocol (Act) of Infrared Raw Cotton Drying (05.05.2010)'
                                      : 'Синов далолатномаси (Акт испытаний ИК-сушки хлопка-сырца, 05.05.2010 г.)',
                                    org: lang === 'en'
                                      ? 'Baghdad Experimental Cotton Ginnery / Ferganapakhtasanoat'
                                      : 'Багдадский экспериментальный хлопкоочистительный завод / «Фаргонапахтасаноат»'
                                  },
                                  {
                                    id: 2,
                                    file: '/images/cotton/Svedenie.jpg',
                                    title: lang === 'en'
                                      ? 'Economic Efficiency Evaluation of Infrared Cotton Drying (25.10.2014)'
                                      : 'Сведения об экономической эффективности снижения влажности хлопка ИК-лучами (25.10.2014 г.)',
                                    org: lang === 'en'
                                      ? 'OAJ Baghdad Experimental Cotton Ginnery'
                                      : 'ОАО «Багдадский экспериментальный хлопкоочистительный завод»'
                                  },
                                  {
                                    id: 3,
                                    file: '/images/cotton/Svedenie1.jpg',
                                    title: lang === 'en'
                                      ? 'Economic Efficiency Evaluation Statement (23.11.2011)'
                                      : 'Справка об экономической эффективности снижения влажности хлопка-сырца (23.11.2011 г.)',
                                    org: lang === 'en'
                                      ? 'Baghdad Experimental Cotton Ginnery'
                                      : 'Багдадский экспериментальный хлопкоочистительный завод'
                                  }
                                ].map((cert) => (
                                  <div
                                    key={cert.id}
                                    style={{
                                      background: '#ffffff',
                                      border: '1px solid var(--color-border)',
                                      borderRadius: 'var(--radius-lg, 12px)',
                                      overflow: 'hidden',
                                      boxShadow: 'var(--shadow-sm)',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                                    }}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => openModalImage(cert.file, cert.title)}
                                      style={{
                                        background: '#f8fafc',
                                        border: 'none',
                                        padding: '12px',
                                        cursor: 'zoom-in',
                                        display: 'block',
                                        width: '100%',
                                        position: 'relative'
                                      }}
                                      title={lang === 'en' ? 'Click to enlarge' : 'Нажмите для увеличения'}
                                    >
                                      <img
                                        src={cert.file}
                                        alt={cert.title}
                                        style={{
                                          width: '100%',
                                          height: '240px',
                                          objectFit: 'contain',
                                          display: 'block',
                                          margin: '0 auto',
                                          borderRadius: '4px'
                                        }}
                                        loading="lazy"
                                      />
                                      <div
                                        style={{
                                          position: 'absolute',
                                          bottom: '8px',
                                          right: '8px',
                                          background: 'rgba(15, 23, 42, 0.75)',
                                          color: '#ffffff',
                                          padding: '3px 8px',
                                          borderRadius: 'var(--radius-sm, 4px)',
                                          fontSize: '0.6875rem',
                                          fontWeight: 600,
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '4px'
                                        }}
                                      >
                                        <Eye size={12} />
                                        <span>{lang === 'en' ? 'Zoom' : 'Увеличить'}</span>
                                      </div>
                                    </button>
                                    <div style={{ padding: '12px 14px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9' }}>
                                      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a', lineHeight: '1.4', marginBottom: '4px' }}>
                                        {cert.title}
                                      </div>
                                      <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: '1.35' }}>
                                        {cert.org}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Под картинками — PDF файлы */}
                              <div
                                style={{
                                  display: 'grid',
                                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                                  gap: '16px'
                                }}
                              >
                                {[
                                  {
                                    id: 1,
                                    title: 'Отчёт: Разработка технологии сушки хлопка-сырца инфракрасными лучами (договор № 17/01)',
                                    title_en: 'Research Report: Development of Infrared Radiation Raw Cotton Drying Technology (Contract No. 17/01)',
                                    category: 'Научно-технический отчёт',
                                    category_en: 'Research Report',
                                    originalFileName: 'Otchet.pdf',
                                    url: '/pdf/cotton/Otchet.pdf',
                                    sizeMb: '1.71 МБ',
                                    sizeEn: '1.71 MB',
                                    pages: '18 стр.'
                                  },
                                  {
                                    id: 2,
                                    title: 'Отчёт: Влияние инфракрасного излучения на полевую всхожесть семян хлопчатника и развитие всходов',
                                    title_en: 'Field Report: Effect of Infrared Radiation on Cottonseed Germination and Seedling Development',
                                    category: 'Агрономический отчёт',
                                    category_en: 'Agronomic Report',
                                    originalFileName: 'Stimul.pdf',
                                    url: '/pdf/cotton/Stimul.pdf',
                                    sizeMb: '4.35 МБ',
                                    sizeEn: '4.35 MB',
                                    pages: '4 стр.'
                                  }
                                ].map((pdf) => (
                                  <div
                                    key={pdf.id}
                                    className="data-card"
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      justifyContent: 'space-between',
                                      padding: '16px',
                                      borderRadius: 'var(--radius-lg, 12px)',
                                      background: '#ffffff',
                                      border: '1px solid var(--color-border)',
                                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                    }}
                                  >
                                    <div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                        <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>
                                          {lang === 'en' ? pdf.category_en : pdf.category}
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                                            {lang === 'en' ? pdf.sizeEn : pdf.sizeMb}
                                          </span>
                                          <span
                                            style={{
                                              background: '#fee2e2',
                                              color: '#dc2626',
                                              borderRadius: 'var(--radius-full)',
                                              padding: '1px 7px',
                                              fontSize: '0.68rem',
                                              fontWeight: 700
                                            }}
                                          >
                                            PDF
                                          </span>
                                        </div>
                                      </div>

                                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                        <div
                                          style={{
                                            flexShrink: 0,
                                            width: '42px',
                                            height: '42px',
                                            borderRadius: 'var(--radius-md)',
                                            background: '#fef2f2',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#dc2626',
                                            border: '1px solid #fecaca'
                                          }}
                                        >
                                          <FileText size={22} />
                                        </div>

                                        <div style={{ flexGrow: 1 }}>
                                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '2px' }}>
                                            № {pdf.id} • {pdf.pages}
                                          </div>
                                          <h4
                                            style={{
                                              fontSize: '0.875rem',
                                              fontWeight: 600,
                                              color: 'var(--color-text-main)',
                                              lineHeight: 1.45,
                                              margin: 0
                                            }}
                                          >
                                            {lang === 'en' ? pdf.title_en : pdf.title}
                                          </h4>
                                        </div>
                                      </div>
                                    </div>

                                    <div
                                      style={{
                                        marginTop: '16px',
                                        paddingTop: '12px',
                                        borderTop: '1px solid #f1f5f9',
                                        display: 'flex',
                                        gap: '8px',
                                        justifyContent: 'flex-end'
                                      }}
                                    >
                                      <button
                                        type="button"
                                        onClick={() => setActivePdf(pdf)}
                                        className="btn btn-outline"
                                        style={{
                                          padding: '6px 12px',
                                          fontSize: '0.8125rem',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '6px',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        <Eye size={14} />
                                        <span>{lang === 'en' ? 'Open' : 'Открыть'}</span>
                                      </button>
                                      <a
                                        href={pdf.url}
                                        download={pdf.originalFileName}
                                        className="btn btn-primary"
                                        style={{
                                          padding: '6px 12px',
                                          fontSize: '0.8125rem',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '6px',
                                          textDecoration: 'none'
                                        }}
                                      >
                                        <Download size={14} />
                                        <span>{lang === 'en' ? 'Download' : 'Скачать'}</span>
                                      </a>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {isProcessHeading && (
                          <div style={{ margin: '24px 0 36px 0', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => openModalImage(
                                lang === 'en' ? '/images/process_eng.webp' : '/images/process.webp',
                                lang === 'en' ? 'Brief Formula of the Process' : 'Краткая формула процесса'
                              )}
                              style={{ background: 'none', border: 'none', padding: 0, cursor: 'zoom-in', display: 'inline-block', width: '100%' }}
                              title={lang === 'en' ? 'Click to view full size' : 'Нажмите для увеличения'}
                            >
                              <img
                                src={lang === 'en' ? '/images/process_eng.webp' : '/images/process.webp'}
                                alt={lang === 'en' ? 'Brief Formula of the Process' : 'Краткая формула процесса'}
                                style={{
                                  width: '80%',
                                  maxWidth: '768px',
                                  height: 'auto',
                                  borderRadius: 'var(--radius-md)',
                                  display: 'block',
                                  margin: '0 auto'
                                }}
                                loading="lazy"
                              />
                            </button>

                            <div className="kraska-certs-row">
                              {[
                                { file: '/images/1.jpg', title: lang === 'en' ? 'Conclusion RPE InfraTherm - Page 1' : 'Заключение RPE InfraTherm - Стр. 1' },
                                { file: '/images/2.jpg', title: lang === 'en' ? 'Conclusion RPE InfraTherm - Page 2' : 'Заключение RPE InfraTherm - Стр. 2' },
                                { file: '/images/3.jpg', title: lang === 'en' ? 'Conclusion RPE InfraTherm - Page 3' : 'Заключение RPE InfraTherm - Стр. 3' },
                                { file: '/images/4.jpg', title: lang === 'en' ? 'Conclusion RPE InfraTherm - Page 4' : 'Заключение RPE InfraTherm - Стр. 4' },
                              ].map((doc, docIdx) => (
                                <button
                                  key={docIdx}
                                  type="button"
                                  className="kraska-cert-card"
                                  onClick={() => openModalImage(doc.file, doc.title)}
                                  title={lang === 'en' ? 'Click to view full size' : 'Нажмите для увеличения'}
                                >
                                  <img
                                    src={doc.file}
                                    alt={doc.title}
                                    loading="lazy"
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  }

                  const isKraskaIntroParagraph = slug === 'kraska' && (
                    paragraph.includes('Разработана функциональная керамика') ||
                    paragraph.includes('В отличие от традиционных методов')
                  );

                  if (isKraskaIntroParagraph) {
                    return null;
                  }

                  const isIndustrialParagraph = slug === 'kraska' && paragraph.includes('25 компаниях');

                  return (
                    <React.Fragment key={block.key}>
                      <p
                        style={{
                          textAlign: 'justify',
                          textJustify: 'inter-word',
                          marginBottom: '16px',
                          lineHeight: '1.75'
                        }}
                      >
                        {paragraph}
                      </p>

                      {isIndustrialParagraph && (
                        <div style={{ margin: '32px 0 36px 0', display: 'flex', flexDirection: 'column', gap: '32px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => openModalImage(
                              lang === 'en' ? '/images/oblast_eng.webp' : '/images/oblast.webp',
                              lang === 'en' ? 'Areas of Application' : 'Области применения'
                            )}
                            style={{ background: 'none', border: 'none', padding: 0, cursor: 'zoom-in', display: 'inline-block', width: '100%' }}
                            title={lang === 'en' ? 'Click to view full size' : 'Нажмите для увеличения'}
                          >
                            <img
                              src={lang === 'en' ? '/images/oblast_eng.webp' : '/images/oblast.webp'}
                              alt={lang === 'en' ? 'Areas of Application' : 'Области применения'}
                              style={{
                                width: '80%',
                                maxWidth: '768px',
                                height: 'auto',
                                borderRadius: 'var(--radius-md)',
                                display: 'block',
                                margin: '0 auto'
                              }}
                              loading="lazy"
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() => openModalImage(
                              lang === 'en' ? '/images/company_eng.webp' : '/images/company.webp',
                              lang === 'en' ? 'Industries and Companies' : 'Отрасли и компании'
                            )}
                            style={{ background: 'none', border: 'none', padding: 0, cursor: 'zoom-in', display: 'inline-block', width: '100%' }}
                            title={lang === 'en' ? 'Click to view full size' : 'Нажмите для увеличения'}
                          >
                            <img
                              src={lang === 'en' ? '/images/company_eng.webp' : '/images/company.webp'}
                              alt={lang === 'en' ? 'Industries and Companies' : 'Отрасли и компании'}
                              style={{
                                width: '80%',
                                maxWidth: '768px',
                                height: 'auto',
                                borderRadius: 'var(--radius-md)',
                                display: 'block',
                                margin: '0 auto'
                              }}
                              loading="lazy"
                            />
                          </button>
                        </div>
                      )}
                    </React.Fragment>
                  );
                });
              })()}

              {/* Images associated with this development */}
              {slug === 'sushka' ? (
                <div style={{ marginTop: '36px' }}>
                  <div className="sushka-installations-grid">
                    {[
                      { key: 'astra', title: 'Астра' },
                      { key: 'feruza', title: 'Феруза' },
                      { key: 'isk_1', title: 'ИКС-1' },
                      { key: 'uzbekistan_1', title: 'Узбекистан-1' },
                      { key: 'uzbekistan_3', title: 'Узбекистан-3' },
                      { key: 'iks_2', title: 'ИКС-2' },
                      { key: 'uzbekistan', title: 'Узбекистан' },
                    ].map((item) => {
                      const imgSrc = lang === 'en' ? `/images/${item.key}_eng.png` : `/images/${item.key}.png`;
                      return (
                        <div
                          key={item.key}
                          className="sushka-grid-item"
                          onClick={() => openModalImage(imgSrc, `${devTitle} - ${item.title}`)}
                          style={{ cursor: 'zoom-in' }}
                        >
                          <img
                            src={imgSrc}
                            alt={`${devTitle} - ${item.title}`}
                            loading="lazy"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (slug === 'lamp' || slug === 'kalci' || slug === 'pech' || slug === 'plenka' || slug === 'kraska' || slug === 'steril') ? null : (
                dev.images && dev.images.length > 0 && (
                  <div style={{ marginTop: '36px' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>{t('dev_gallery_title')}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                      {dev.images.map((imgUrl, i) => {
                        const isFrameless = slug === 'cotton';
                        const titleText = `${devTitle} - ${i + 1}`;
                        return (
                          <div
                            key={i}
                            style={
                              isFrameless
                                ? {
                                    overflow: 'hidden',
                                    borderRadius: 'var(--radius-md, 8px)',
                                    background: 'transparent',
                                    border: 'none',
                                    padding: 0,
                                    cursor: 'zoom-in',
                                    transition: 'transform 0.25s ease',
                                  }
                                : {
                                    background: '#f8fafc',
                                    padding: '16px',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--color-border)',
                                    textAlign: 'center',
                                  }
                            }
                            onClick={() => openModalImage(imgUrl, titleText)}
                            onMouseEnter={isFrameless ? (e) => { e.currentTarget.style.transform = 'translateY(-3px)'; } : undefined}
                            onMouseLeave={isFrameless ? (e) => { e.currentTarget.style.transform = 'translateY(0)'; } : undefined}
                          >
                            <img
                              src={imgUrl}
                              alt={titleText}
                              style={
                                isFrameless
                                  ? {
                                      width: '100%',
                                      height: '220px',
                                      aspectRatio: '16 / 9',
                                      objectFit: 'cover',
                                      borderRadius: 'var(--radius-md, 8px)',
                                      cursor: 'zoom-in',
                                      display: 'block',
                                      border: 'none',
                                    }
                                  : {
                                      maxHeight: '240px',
                                      maxWidth: '100%',
                                      margin: '0 auto',
                                      borderRadius: '4px',
                                      cursor: 'zoom-in',
                                      display: 'block',
                                    }
                              }
                              loading="lazy"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              )}

              {/* Раздел "Акты испытаний и заключения" (для /sushka, /lamp и /kalci) */}
              {(slug === 'lamp' || slug === 'kalci' || slug === 'sushka') ? (
                <section style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--color-border)' }}>
                  <div style={{ marginBottom: '24px' }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(2, 132, 199, 0.08)',
                        color: '#0284c7',
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        marginBottom: '8px'
                      }}
                    >
                      <CheckCircle2 size={14} />
                      <span>{lang === 'en' ? 'Official Documentation' : 'Официальная документация'}</span>
                    </div>
                    <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
                      {lang === 'en' ? 'Test Acts and Conclusions' : 'Акты испытаний и заключения'}
                    </h2>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', margin: 0 }}>
                      {slug === 'sushka'
                        ? (lang === 'en'
                            ? `Official protocols, test acts, quality certificates, and expert conclusions (${sushkaCertificates.length} documents, 11 scan pages)`
                            : `Официальные протоколы, акты испытаний, удостоверения качества и экспертные заключения (${sushkaCertificates.length} документов, 11 страниц сканов)`)
                        : (lang === 'en'
                            ? `Official protocols, registration certificates, test acts, and clinical conclusions (${(slug === 'kalci' ? kalciCertificates : lampCertificates).length} documents)`
                            : `Официальные протоколы, регистрационные удостоверения, акты испытаний и клинические заключения (${(slug === 'kalci' ? kalciCertificates : lampCertificates).length} документов)`)}
                    </p>
                  </div>

                  {/* Certificate Cards Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '20px' }}>
                    {(slug === 'sushka' ? sushkaCertificates : slug === 'kalci' ? kalciCertificates : lampCertificates).map((cert) => (
                      <div
                        key={cert.id}
                        onClick={() => openCert(cert)}
                        className="data-card"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          cursor: 'pointer',
                          padding: '12px',
                          borderRadius: 'var(--radius-lg)',
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                          background: '#ffffff',
                          border: '1px solid var(--color-border)'
                        }}
                      >
                        <div
                          style={{
                            height: '240px',
                            background: '#f8fafc',
                            borderRadius: 'var(--radius-md)',
                            overflow: 'hidden',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative'
                          }}
                        >
                          <img
                            src={cert.preview || cert.cover || (cert.pages && cert.pages[0]) || cert.src}
                            alt={lang === 'en' ? cert.title_en : cert.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              padding: '6px'
                            }}
                            loading="lazy"
                          />
                          <div
                            style={{
                              position: 'absolute',
                              top: '8px',
                              right: '8px',
                              background: 'rgba(15, 23, 42, 0.75)',
                              color: '#ffffff',
                              borderRadius: 'var(--radius-full)',
                              padding: '2px 8px',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              backdropFilter: 'blur(4px)'
                            }}
                          >
                            № {cert.id}
                          </div>

                          {cert.pageCount > 1 && (
                            <div
                              style={{
                                position: 'absolute',
                                bottom: '8px',
                                right: '8px',
                                background: 'rgba(2, 132, 199, 0.92)',
                                color: '#ffffff',
                                borderRadius: 'var(--radius-full)',
                                padding: '2px 8px',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                backdropFilter: 'blur(4px)'
                              }}
                            >
                              <FileText size={11} />
                              <span>{lang === 'en' ? `${cert.pageCount} pages` : `${cert.pageCount} страницы`}</span>
                            </div>
                          )}
                        </div>

                        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                          <span
                            className="badge badge-blue"
                            style={{ alignSelf: 'flex-start', fontSize: '0.7rem', marginBottom: '6px' }}
                          >
                            {lang === 'en' ? cert.category_en : cert.category}
                          </span>
                          <h4
                            style={{
                              fontSize: '0.84375rem',
                              fontWeight: 600,
                              color: 'var(--color-text-main)',
                              lineHeight: 1.4,
                              margin: 0,
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                            title={lang === 'en' ? cert.title_en : cert.title}
                          >
                            {lang === 'en' ? cert.title_en : cert.title}
                          </h4>
                          {cert.org && (
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '6px 0 0 0', lineHeight: 1.35 }}>
                              {lang === 'en' ? cert.org_en : cert.org}
                            </p>
                          )}
                          {cert.pageCount > 1 && cert.pages && (
                            <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }} onClick={(e) => e.stopPropagation()}>
                              {cert.pages.map((_, pIdx) => (
                                <button
                                  key={pIdx}
                                  type="button"
                                  onClick={() => {
                                    setActiveCert(cert);
                                    setActivePageIndex(pIdx);
                                  }}
                                  style={{
                                    border: '1px solid #cbd5e1',
                                    background: '#f8fafc',
                                    color: '#0284c7',
                                    fontWeight: 600,
                                    fontSize: '0.7rem',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                  }}
                                  title={lang === 'en' ? `Open page ${pIdx + 1}` : `Открыть стр. ${pIdx + 1}`}
                                >
                                  {lang === 'en' ? `Page ${pIdx + 1}` : `Стр. ${pIdx + 1}`}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Документы и отчеты в формате PDF (только для lamp) */}
                  {slug === 'lamp' && (
                    <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--color-border)' }}>
                      <div style={{ marginBottom: '24px' }}>
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'rgba(239, 68, 68, 0.08)',
                            color: '#dc2626',
                            padding: '4px 12px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            marginBottom: '8px'
                          }}
                        >
                          <FileText size={14} />
                          <span>{lang === 'en' ? 'PDF Archive & Reports' : 'PDF Архив и отчеты'}</span>
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
                          {lang === 'en' ? 'Original Reports and Acts in PDF' : 'Оригиналы отчетов и актов в формате PDF'}
                        </h3>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', margin: 0 }}>
                          {lang === 'en'
                            ? `Complete clinical trial reports, research studies, and official conclusions (${lampPdfs.length} documents)`
                            : `Полные отчеты о клинических испытаниях, научные исследования и официальные заключения (${lampPdfs.length} документов)`}
                        </p>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                        {lampPdfs.map((pdf) => (
                          <div
                            key={pdf.id}
                            className="data-card"
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              padding: '16px',
                              borderRadius: 'var(--radius-lg)',
                              background: '#ffffff',
                              border: '1px solid var(--color-border)',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>
                                  {lang === 'en' ? pdf.category_en : pdf.category}
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                                    {lang === 'en' ? pdf.sizeEn : pdf.sizeMb}
                                  </span>
                                  <span
                                    style={{
                                      background: '#fee2e2',
                                      color: '#dc2626',
                                      borderRadius: 'var(--radius-full)',
                                      padding: '1px 7px',
                                      fontSize: '0.68rem',
                                      fontWeight: 700
                                    }}
                                  >
                                    PDF
                                  </span>
                                </div>
                              </div>

                              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                <div
                                  style={{
                                    flexShrink: 0,
                                    width: '42px',
                                    height: '42px',
                                    borderRadius: 'var(--radius-md)',
                                    background: '#fef2f2',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#dc2626',
                                    border: '1px solid #fecaca'
                                  }}
                                >
                                  <FileText size={22} />
                                </div>

                                <div style={{ flexGrow: 1 }}>
                                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '2px' }}>
                                    № {pdf.id}
                                  </div>
                                  <h4
                                    style={{
                                      fontSize: '0.875rem',
                                      fontWeight: 600,
                                      color: 'var(--color-text-main)',
                                      lineHeight: 1.45,
                                      margin: 0
                                    }}
                                  >
                                    {lang === 'en' ? pdf.title_en : pdf.title}
                                  </h4>
                                </div>
                              </div>
                            </div>

                            <div
                              style={{
                                marginTop: '16px',
                                paddingTop: '12px',
                                borderTop: '1px solid #f1f5f9',
                                display: 'flex',
                                gap: '8px',
                                justifyContent: 'flex-end'
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => setActivePdf(pdf)}
                                className="btn btn-outline"
                                style={{
                                  padding: '6px 12px',
                                  fontSize: '0.8125rem',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  cursor: 'pointer'
                                }}
                              >
                                <Eye size={14} />
                                <span>{lang === 'en' ? 'Open' : 'Открыть'}</span>
                              </button>
                              <a
                                href={pdf.url}
                                download={pdf.originalFileName}
                                className="btn btn-primary"
                                style={{
                                  padding: '6px 12px',
                                  fontSize: '0.8125rem',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  textDecoration: 'none'
                                }}
                              >
                                <Download size={14} />
                                <span>{lang === 'en' ? 'Download' : 'Скачать'}</span>
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Дополнительная информация о «Активный кальций» в формате PDF */}
                  {slug === 'kalci' && (
                    <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--color-border)' }}>
                      <div style={{ marginBottom: '24px' }}>
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'rgba(2, 132, 199, 0.08)',
                            color: '#0284c7',
                            padding: '4px 12px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            marginBottom: '8px'
                          }}
                        >
                          <FileText size={14} />
                          <span>{lang === 'en' ? 'PDF Materials & Articles' : 'PDF Материалы и статьи'}</span>
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
                          {lang === 'en' ? 'Additional Information about "Active Calcium"' : 'Дополнительная информация о «Активный кальций»'}
                        </h3>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', margin: 0 }}>
                          {lang === 'en'
                            ? `Full scientific articles and research materials about "Active Calcium" (${kalciPdfs.length} documents)`
                            : `Полные научно-медицинские статьи и материалы исследований препарата «Активный кальций» (${kalciPdfs.length} документа)`}
                        </p>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                        {kalciPdfs.map((pdf) => (
                          <div
                            key={pdf.id}
                            className="data-card"
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              padding: '16px',
                              borderRadius: 'var(--radius-lg)',
                              background: '#ffffff',
                              border: '1px solid var(--color-border)',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>
                                  {lang === 'en' ? pdf.category_en : pdf.category}
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                                    {lang === 'en' ? pdf.sizeEn : pdf.sizeMb}
                                  </span>
                                  <span
                                    style={{
                                      background: '#fee2e2',
                                      color: '#dc2626',
                                      borderRadius: 'var(--radius-full)',
                                      padding: '1px 7px',
                                      fontSize: '0.68rem',
                                      fontWeight: 700
                                    }}
                                  >
                                    PDF
                                  </span>
                                </div>
                              </div>

                              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                <div
                                  style={{
                                    flexShrink: 0,
                                    width: '42px',
                                    height: '42px',
                                    borderRadius: 'var(--radius-md)',
                                    background: '#fef2f2',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#dc2626',
                                    border: '1px solid #fecaca'
                                  }}
                                >
                                  <FileText size={22} />
                                </div>

                                <div style={{ flexGrow: 1 }}>
                                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '2px' }}>
                                    № {pdf.id}
                                  </div>
                                  <h4
                                    style={{
                                      fontSize: '0.875rem',
                                      fontWeight: 600,
                                      color: 'var(--color-text-main)',
                                      lineHeight: 1.45,
                                      margin: 0
                                    }}
                                  >
                                    {lang === 'en' ? pdf.title_en : pdf.title}
                                  </h4>
                                </div>
                              </div>
                            </div>

                            <div
                              style={{
                                marginTop: '16px',
                                paddingTop: '12px',
                                borderTop: '1px solid #f1f5f9',
                                display: 'flex',
                                gap: '8px',
                                justifyContent: 'flex-end'
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => setActivePdf(pdf)}
                                className="btn btn-outline"
                                style={{
                                  padding: '6px 12px',
                                  fontSize: '0.8125rem',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  cursor: 'pointer'
                                }}
                              >
                                <Eye size={14} />
                                <span>{lang === 'en' ? 'Open' : 'Открыть'}</span>
                              </button>
                              <a
                                href={pdf.url}
                                download={pdf.originalFileName}
                                className="btn btn-primary"
                                style={{
                                  padding: '6px 12px',
                                  fontSize: '0.8125rem',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  textDecoration: 'none'
                                }}
                              >
                                <Download size={14} />
                                <span>{lang === 'en' ? 'Download' : 'Скачать'}</span>
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              ) : slug === 'pech' ? (
                <div style={{ marginTop: '40px', paddingTop: '28px', borderTop: '1px solid var(--color-border)' }}>
                  <div className="pech-bottom-grid">
                    <div>
                      <button
                        type="button"
                        onClick={() => openModalImage(
                          lang === 'en' ? '/images/gril_infra_eng.webp' : '/images/gril_infra.webp',
                          lang === 'en' ? 'Infrared grill diagram' : 'Схема инфракрасного гриля'
                        )}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'zoom-in', display: 'block', width: '100%' }}
                        title={lang === 'en' ? 'Click to view full size' : 'Нажмите для увеличения'}
                      >
                        <img
                          src={lang === 'en' ? '/images/gril_infra_eng.webp' : '/images/gril_infra.webp'}
                          alt={lang === 'en' ? 'Infrared grill diagram' : 'Схема инфракрасного гриля'}
                          className="pech-bottom-img"
                          loading="lazy"
                        />
                      </button>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() => openModalImage(
                          lang === 'en' ? '/images/gril_uzbekistan_eng.webp' : '/images/gril_uzbekistan.webp',
                          lang === 'en' ? 'Grill unit Uzbekistan' : 'Установка гриля Узбекистан'
                        )}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'zoom-in', display: 'block', width: '100%' }}
                        title={lang === 'en' ? 'Click to view full size' : 'Нажмите для увеличения'}
                      >
                        <img
                          src={lang === 'en' ? '/images/gril_uzbekistan_eng.webp' : '/images/gril_uzbekistan.webp'}
                          alt={lang === 'en' ? 'Grill unit Uzbekistan' : 'Установка гриля Узбекистан'}
                          className="pech-bottom-img"
                          loading="lazy"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Фирменное письмо RPE Infratherm */}
                  <div style={{ marginTop: '36px', textAlign: 'center' }}>
                    <figure style={{ display: 'inline-block', maxWidth: '580px', width: '100%', margin: '0 auto' }}>
                      <button
                        type="button"
                        onClick={() => openModalImage(
                          '/images/infratherm_letter.webp',
                          lang === 'en' ? 'RPE Infratherm official letter' : 'Фирменное письмо RPE Infratherm'
                        )}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'zoom-in', display: 'block', width: '100%' }}
                        title={lang === 'en' ? 'Click to view full size letter' : 'Нажмите для увеличения письма'}
                      >
                        <img
                          src="/images/infratherm_letter.webp"
                          alt={lang === 'en' ? 'RPE Infratherm official letter' : 'Фирменное письмо RPE Infratherm'}
                          style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                            margin: '0 auto'
                          }}
                          loading="lazy"
                        />
                      </button>
                    </figure>
                  </div>
                </div>
              ) : null}
            </article>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Certificate View */}
      {activeCert && (() => {
        const currentImgSrc = (activeCert.pages && activeCert.pages[activePageIndex]) || activeCert.cover || activeCert.src;
        const totalPages = activeCert.pageCount || (activeCert.pages ? activeCert.pages.length : 1);

        return (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(15, 23, 42, 0.90)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setActiveCert(null)}
          >
            {/* Top Bar */}
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '20px',
                right: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#ffffff',
                zIndex: 10
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ fontSize: '1rem', fontWeight: 600, textShadow: '0 1px 3px rgba(0,0,0,0.5)', maxWidth: '60%' }}>
                № {activeCert.id}. {lang === 'en' ? activeCert.title_en : activeCert.title}
                {totalPages > 1 && (
                  <span style={{ fontSize: '0.8125rem', color: '#7dd3fc', marginLeft: '10px', fontWeight: 500 }}>
                    ({lang === 'en' ? `Page ${activePageIndex + 1} of ${totalPages}` : `Стр. ${activePageIndex + 1} из ${totalPages}`})
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {totalPages > 1 && (
                  <div
                    style={{
                      display: 'inline-flex',
                      background: 'rgba(255, 255, 255, 0.15)',
                      padding: '3px',
                      borderRadius: 'var(--radius-full)',
                      gap: '4px'
                    }}
                  >
                    {activeCert.pages.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActivePageIndex(idx)}
                        style={{
                          border: 'none',
                          background: activePageIndex === idx ? '#0284c7' : 'transparent',
                          color: '#ffffff',
                          padding: '4px 12px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'background 0.2s ease'
                        }}
                      >
                        {lang === 'en' ? `Page ${idx + 1}` : `Стр. ${idx + 1}`}
                      </button>
                    ))}
                  </div>
                )}

                <a
                  href={currentImgSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)', padding: '6px 12px', fontSize: '0.8125rem' }}
                  title={lang === 'en' ? 'Open full resolution' : 'Открыть оригинал'}
                >
                  <ExternalLink size={14} /> {lang === 'en' ? 'Full size' : 'Оригинал'}
                </a>
                <button
                  type="button"
                  onClick={() => setActiveCert(null)}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    borderRadius: 'var(--radius-full)',
                    color: '#ffffff',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevCert();
              }}
              style={{
                position: 'absolute',
                left: '20px',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                color: '#ffffff',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
              title={lang === 'en' ? 'Previous page / document' : 'Предыдущая страница / документ'}
            >
              <ChevronLeft size={24} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNextCert();
              }}
              style={{
                position: 'absolute',
                right: '20px',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                color: '#ffffff',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
              title={lang === 'en' ? 'Next page / document' : 'Следующая страница / документ'}
            >
              <ChevronRight size={24} />
            </button>

            {/* Document Image Container */}
            <div
              style={{
                maxWidth: '90vw',
                maxHeight: '78vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentImgSrc}
                alt={lang === 'en' ? activeCert.title_en : activeCert.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '75vh',
                  objectFit: 'contain',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                  background: '#ffffff'
                }}
              />

              {totalPages > 1 && (
                <div
                  style={{
                    marginTop: '12px',
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center',
                    background: 'rgba(15, 23, 42, 0.75)',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    backdropFilter: 'blur(4px)',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
                  }}
                >
                  {activeCert.pages.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActivePageIndex(idx)}
                      style={{
                        border: 'none',
                        background: activePageIndex === idx ? '#0284c7' : 'rgba(255,255,255,0.2)',
                        color: '#ffffff',
                        padding: '4px 14px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {lang === 'en' ? `Page ${idx + 1}` : `Страница ${idx + 1}`}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Lightbox Modal for Image Preview (Esc to close) */}
      {modalImage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(15, 23, 42, 0.90)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setModalImage(null)}
        >
          {/* Top Bar */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '20px',
              right: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: '#ffffff',
              zIndex: 10
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '1rem', fontWeight: 600, textShadow: '0 1px 3px rgba(0,0,0,0.5)', maxWidth: '75%' }}>
              {modalImage.title || ''}
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setModalImage(null)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  color: '#ffffff',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title={lang === 'en' ? 'Close (Esc)' : 'Закрыть (Esc)'}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Image Container */}
          <div
            style={{
              maxWidth: '92vw',
              maxHeight: '86vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={modalImage.src}
              alt={modalImage.title || 'Image view'}
              style={{
                maxWidth: '92vw',
                maxHeight: '86vh',
                objectFit: 'contain',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
                background: '#ffffff'
              }}
            />
          </div>
        </div>
      )}

      {/* Fullscreen Modal for PDF Document View (Esc to close) */}
      {activePdf && (
        <div
          tabIndex={-1}
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999,
            background: '#0f172a',
            display: 'flex',
            flexDirection: 'column',
            margin: 0,
            padding: 0,
            overflow: 'hidden'
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setActivePdf(null);
          }}
        >
          {/* Top Fullscreen Header Bar */}
          <div
            style={{
              height: '54px',
              minHeight: '54px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 20px',
              background: '#0f172a',
              color: '#ffffff',
              borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              zIndex: 10
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, paddingRight: '16px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(239, 68, 68, 0.2)',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <FileText size={20} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#f8fafc',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title={lang === 'en' ? activePdf.title_en : activePdf.title}
                >
                  {lang === 'en' ? activePdf.title_en : activePdf.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', gap: '8px' }}>
                  <span>{lang === 'en' ? activePdf.category_en : activePdf.category}</span>
                  <span>•</span>
                  <span>{lang === 'en' ? activePdf.sizeEn : activePdf.sizeMb}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
              <a
                href={activePdf.url}
                download={activePdf.originalFileName}
                className="btn btn-primary"
                style={{
                  padding: '7px 16px',
                  fontSize: '0.8125rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none'
                }}
              >
                <Download size={15} />
                <span>{lang === 'en' ? 'Download' : 'Скачать'}</span>
              </a>

              <button
                type="button"
                onClick={() => setActivePdf(null)}
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: 'var(--radius-md)',
                  color: '#ffffff',
                  padding: '6px 14px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  transition: 'background 0.2s ease'
                }}
                title={lang === 'en' ? 'Close (Esc)' : 'Закрыть (Esc)'}
              >
                <X size={18} />
                <span>{lang === 'en' ? 'Close (Esc)' : 'Закрыть (Esc)'}</span>
              </button>
            </div>
          </div>

          {/* Fullscreen PDF View Container */}
          <div style={{ flex: 1, width: '100%', height: 'calc(100vh - 54px)', background: '#525659', position: 'relative' }}>
            <iframe
              src={`${activePdf.url}#toolbar=1`}
              title={lang === 'en' ? activePdf.title_en : activePdf.title}
              onLoad={(e) => {
                try {
                  const attach = (target) => {
                    target?.addEventListener('keydown', (evt) => {
                      if (evt.key === 'Escape') setActivePdf(null);
                    });
                  };
                  attach(e.target.contentWindow);
                  attach(e.target.contentDocument);
                } catch (err) {}
              }}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                display: 'block'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
