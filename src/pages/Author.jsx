import React from 'react';
import { Link } from 'react-router-dom';
import { Award, BookOpen, FileText, CheckCircle, ExternalLink, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import '../styles/pages.css';

export default function Author() {
  const { t, lang } = useLanguage();

  return (
    <div>
      {/* Main Author Content */}
      <section className="section-wrapper">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '48px', alignItems: 'start' }}>
          {/* Left Column / Portrait Card */}
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '24px', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
            <img
              src="/images/RRKh.webp"
              alt="Рахимов Рустам Хакимович"
              style={{ width: '100%', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}
            />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>{lang === 'en' ? 'Rakhimov R.Kh.' : 'Рахимов Р.Х.'}</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '16px' }}>
              {t('author_rank_short')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', fontSize: '0.84375rem', color: '#475569' }}>
              <div style={{ lineHeight: '1.45', fontWeight: '700', fontStyle: 'italic', textAlign: 'center', color: '#1e293b' }}>
                {t('author_position')}
              </div>
              <div><strong>E-mail:</strong> <a href="mailto:rustam-shsul@yandex.com" style={{ color: 'var(--color-primary)' }}>rustam-shsul@yandex.com</a></div>
            </div>

            <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid var(--color-border)' }} />

            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '10px' }}>
                {t('author_profiles')}
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem' }}>
                <li>
                  <a href="https://cyberleninka.ru/article/n/rahimov-rustam-hakimovich" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Cyberleninka <ExternalLink size={14} />
                  </a>
                </li>
                <li>
                  <a href="https://www.mathnet.ru/rus/person114518" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Math-Net.ru ({lang === 'en' ? 'Personalia' : 'Персоналии'}) <ExternalLink size={14} />
                  </a>
                </li>
                <li>
                  <a href="https://www.researchgate.net/profile/Rustam-Rakhimov" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    ResearchGate <ExternalLink size={14} />
                  </a>
                </li>
                <li>
                  <a href="https://www.semanticscholar.org/author/%D0%A0%D0%B0%D1%85%D0%B8%D0%BC%D0%BE%D0%B2-%D0%A0%D1%83%D1%81%D1%82%D0%B0%D0%BC-%D0%A5%D0%B0%D0%BA%D0%B8%D0%BC%D0%BE%D0%B2%D0%B8%D1%87/112831501" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Semantic Scholar <ExternalLink size={14} />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column / Narrative */}
          <div className="author-biography-flow" style={{ color: '#334155' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', lineHeight: '1.6', marginBottom: '20px' }}>
              {lang === 'en'
                ? 'Doctor of Technical Sciences, Professor, scientist and developer in functional ceramic materials, infrared radiation, applied materials science, specialist in concentrated energy impacts, applied physics, catalysis, and kinetics.'
                : 'Доктор технических наук, профессор, учёный и разработчик в области функциональных керамических материалов, инфракрасного излучения, прикладного материаловедения, специалист в области концентрированных энергетических воздействий, прикладной физики, катализа и кинетики.'}
            </h1>

            {lang === 'en' ? (
              <>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>His scientific and pedagogical activity began after graduating from Lomonosov Moscow State University in 1972. In the same year, he started working as a junior researcher at the Physical-Technical Institute of the Academy of Sciences of Uzbekistan. Subsequently, his scientific activity was devoted to researching light and pulsed radiation impacts, synthesizing materials with predetermined properties, and engineering technologies for their practical industrial application.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>A major milestone in his scientific career was his participation, starting in 1974 under the leadership of Academician S. A. Azimov, in designing the unique "Sun" complex (Big Solar Furnace — BSF in Parkent) and researching the application of concentrated energy sources for synthesis of novel materials. Within these studies, destabilization mechanisms of oxide compounds melted in solar furnaces were investigated, and methods for stabilizing their stoichiometric composition were formulated.</p>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '14px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>Scientific School and Functional Materials</h2>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>One of the primary directions of Professor Rakhimov's research has been the creation of a comprehensive scientific-engineering methodology for developing materials with pre-assigned properties.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>A rigorous calculation and synthesis methodology was established, yielding more than 1,500 specialized materials for diverse fields of science and technology. Notable discoveries include pulsed resistivity modulation, spectral-pulsed transformation in oxide ceramics, and superplasticity in oxide ceramic materials.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Functional ceramics occupy a special place — materials whose unique physical characteristics enable them to serve not merely as structural materials, but as direct energy converters, heating elements, infrared emitters, thermocouples, and critical technological components.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>On the basis of these materials, high-temperature ceramic semiconductors, ceramic thermocouples, infrared emitters with targeted spectral-energy profiles, and other advanced functional materials were engineered.</p>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '14px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>From Fundamental Research to Industrial Technologies</h2>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>The defining hallmark of R. Kh. Rakhimov's work is the seamless transition from fundamental atomic and material investigation to turnkey industrial processes and commercial equipment.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '10px' }}>The author's website presents developments for:</p>
                <ul style={{ paddingLeft: '22px', margin: '0 0 18px 0', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9375rem', lineHeight: '1.6' }}>
                  <li>infrared drying of fruits and vegetables</li>
                  <li>drying of raw seed cotton</li>
                  <li>drying of paints and coatings</li>
                  <li>polymerization and vulcanization</li>
                  <li>commercial baking and food roasting ovens</li>
                  <li>sterilization systems</li>
                  <li>medical infrared therapeutic units</li>
                  <li>production of bioavailable active calcium</li>
                  <li>solar energetics</li>
                  <li>high-temperature industrial furnaces</li>
                  <li>high-temperature heaters and emitters</li>
                  <li>film-ceramic composite materials</li>
                  <li>special ceramic refractories and furnace linings.</li>
                </ul>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '14px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>Major Developments</h2>
                <div style={{ margin: '20px 0 24px 0', textAlign: 'center' }}>
                  <img
                    src="/images/razrabotka_eng.webp"
                    alt="Major Developments of Professor Rakhimov R.Kh."
                    style={{ width: '100%', maxWidth: '800px', height: 'auto', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', display: 'block', margin: '0 auto' }}
                    loading="lazy"
                  />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1e293b', marginTop: '20px', marginBottom: '10px' }}>Functional Ceramics and Infrared Emitters</h3>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>One of the central thrusts of the scientific work is the creation of ceramic materials with targeted spectral radiation profiles.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Various types of ceramic infrared emitters are presented — GI, AF, RC, RV, KL, KH, KB, ZB, and ZC. Developments encompass both linear emitters based on quartz tubes and pinpoint localized radiation sources.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Investigations into functional ceramics enabled the creation of materials for high-temperature heating, infrared emission, drying, thermal treatment, energy conversion, and other technological tasks.</p>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1e293b', marginTop: '20px', marginBottom: '10px' }}>Infrared Drying</h3>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Based on functional ceramics, specialized drying chambers for fruits and vegetables were engineered. The technology operates at gentle temperatures starting from 40 °C and is designed to preserve natural product qualities, including flavor, aroma, bioactive vitamins, and natural appearance. The website features various industrial models — "Astra", "Feruza-Vostok", "Uzbekistan", "Uzbekistan 3", "IKS-1", and "IKS-2".</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>A distinct application is the infrared drying of raw seed cotton. Published research results demonstrate that functional ceramics reduced total energy consumption by 9.4 times and electricity demand by more than 2.3 times compared to conventional drying drums. These figures represent documented results of specific test runs.</p>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1e293b', marginTop: '20px', marginBottom: '10px' }}>Paint Drying, Polymerization, and Vulcanization</h3>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>A specialized development involves the application of functional ceramics in the paint, varnish, and polymer industries.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>The ceramic material generates a synchronized train of quantum pulses accelerating polymer chain formation and crosslinking. The resulting coating exhibits exceptional adhesion and resistance to peeling under structural deformation.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Test results indicate that curing times were slashed from 2 hours down to 3.5 minutes, and energy consumption dropped from 10 to 0.4 kWh, with the complete elimination of energy-intensive preprocessing steps such as phosphating and degreasing.</p>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1e293b', marginTop: '20px', marginBottom: '10px' }}>Sterilization</h3>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Another major direction is pulsed sterilization utilizing ceramic infrared emitters.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>The proprietary technology utilizes functional ceramics to transform primary emission into pulsed radiation resonant with water molecules inside microorganisms, ensuring complete sterility within short exposure cycles.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>The portal showcases various equipment series, including IRX-2000, MC-1, "Fial", and "Feruza", along with comparative performance data.</p>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1e293b', marginTop: '20px', marginBottom: '10px' }}>Film-Ceramic Composite</h3>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Among the most prominent developments is the film-ceramic composite based on polyethylene and functional ceramics.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>According to the process, functional ceramics are introduced into polyethylene at 5–10 wt.% with an average particle size of 5–10 μm, then homogenized and extruded into functional film.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>The composite is primarily engineered for solar energetics, solar dryers, and agriculture. The mechanism performs spectral transformation of solar energy, stabilizing temperature profiles and microclimate conditions in greenhouses.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>A substantial volume of scientific publications by Rakhimov and his collaborators is devoted to this field: from three-layer composite films to radiation drying, solar air heaters, and agricultural polymer-ceramic covers.</p>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1e293b', marginTop: '20px', marginBottom: '10px' }}>High-Temperature Materials</h3>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>A large block of developments involves materials synthesized at the Big Solar Furnace (BSF).</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '10px' }}>The site presents:</p>
                <ul style={{ paddingLeft: '22px', margin: '0 0 18px 0', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9375rem', lineHeight: '1.6' }}>
                  <li>ceramic spinnerets and cutting dies</li>
                  <li>highly porous refractories and furnace linings</li>
                  <li>zirconia-based materials</li>
                  <li>magnesium-aluminate spinel</li>
                  <li>corundum ceramics</li>
                  <li>rare-earth chromites</li>
                  <li>high-temperature heating elements</li>
                  <li>infrared emitters</li>
                  <li>ceramic thermocouples</li>
                  <li>multilayer heaters</li>
                  <li>materials for ultra-high temperature furnaces.</li>
                </ul>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Operating temperature ratings up to 1800–2300 °C are specified for individual materials, including specialized refractories and heating elements.</p>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '14px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>Patent Portfolio</h2>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>The patent section illustrates that Rustam Khakimovich's innovations span multiple technology generations and diverse industrial domains.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '10px' }}>Among USSR Inventor Certificates are inventions for:</p>
                <ul style={{ paddingLeft: '22px', margin: '0 0 18px 0', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9375rem', lineHeight: '1.6' }}>
                  <li>raw batches for synthesizing ceramic materials</li>
                  <li>high-temperature electrically conductive ceramics</li>
                  <li>high-temperature heating elements</li>
                  <li>high-temperature ceramic heaters</li>
                  <li>lipase production technologies</li>
                  <li>donor dopants and impurities.</li>
                </ul>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>A distinct group comprises USSR patents, including methods and devices for sterilization, sterilizer designs, and baking methods for traditional flatbreads.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '10px' }}>Key Uzbek national patents include:</p>
                <ul style={{ paddingLeft: '22px', margin: '0 0 18px 0', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9375rem', lineHeight: '1.6' }}>
                  <li>IAP 04888 — method for producing active calcium citrate</li>
                  <li>IAP 04287 — method for obtaining calcium-containing biologically active supplements</li>
                  <li>IAP 01998 — electrically conductive ceramic material</li>
                  <li>IAP 04844 — composition for producing polyethylene-based film-ceramic composites for solar dryers</li>
                  <li>IAP 04881 — method for drying raw seed cotton</li>
                  <li>IAP 01975 — infrared-emitting ceramic material.</li>
                </ul>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Patent activity is further represented by Eurasian, European, Turkish, and US patents covering infrared-emitting ceramics, conductive matrix systems, and radiant treatment methods.</p>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '14px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>Scientific Publications</h2>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Rustam Khakimovich's publishing career extends over five decades.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>The portal documents more than 200 publications, over 300 inventions, and more than 20 monographs; over 90% of works were published abroad or presented at international symposia.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '10px' }}>Publication thematic scope includes:</p>
                <ul style={{ paddingLeft: '22px', margin: '0 0 18px 0', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9375rem', lineHeight: '1.6' }}>
                  <li>functional ceramics</li>
                  <li>synthesis of high-temperature materials</li>
                  <li>pulsed infrared radiation</li>
                  <li>solar energetics</li>
                  <li>radiant drying</li>
                  <li>film-ceramic composites</li>
                  <li>solar air heaters</li>
                  <li>cotton drying</li>
                  <li>photoenergetics</li>
                  <li>infrared medical technologies</li>
                  <li>active calcium</li>
                  <li>industrial application of functional ceramics.</li>
                </ul>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>A prominent scientific series explores film-ceramic composites: solar air heaters with three-layer composite films, radiation drying with ceramic-doped polymer films, agricultural microclimate optimization, and thermal stabilization mechanisms.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Recent works continue this direction, notably "Synthesis of Materials by the Radiation Method and Their Application" and "Investigation of the Efficiency of Using a Film-Ceramic Composite in a Solar Dryer", published in Applied Solar Energy in 2022.</p>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '14px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>International Recognition</h2>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Among honors and awards, the site highlights the German Grand Prix "EINFACH GENIAL" ("Simply Brilliant") in 2003, as well as a silver medal and diploma for the "Emir" ceramic-coated infrared therapeutic system.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>The website also records widespread industrial adoption across Uzbekistan and foreign partners, including the application of 18 unique ceramic formulations in the Soviet "Buran–Energia" aerospace shuttle program.</p>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '14px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>Scientific School of Professor Rakhimov R.Kh.</h2>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>The scientific school of R. Kh. Rakhimov received dedicated recognition in the academic journal Computational Nanotechnology in 2016, with a special thematic cycle under the banner "SCIENTIFIC SCHOOL OF RAKHIMOV R. KH." exploring functional ceramics and radiation synthesis.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Within this series, theoretical and experimental foundations for synthesizing functional ceramics, predictive modeling of stoichiometric compositions, optical and emissive properties, and industrial implementations were thoroughly examined.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>A core doctrine of the school is the causal nexus between precursor chemistry, synthesis kinetics, crystalline microstructure, and functional performance, treating each material as an engineered quantum device for a specific technological purpose.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Publications of the school examine high-temperature and oxide materials, functional ceramics, infrared emitters, pulsed radiant dynamics, conductive ceramic matrices, and materials for multifaceted industrial applications.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>The school unites several interconnected domains: synthesis of materials with pre-assigned properties; functional ceramics; infrared emission and conversion; radiation processing; refractory materials; drying and heat-treatment technologies; polymer-ceramic composites; and energy applications.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>The hallmark of this scientific-engineering methodology is the systematic progression from fundamental atomic exploration of matter to the creation of the material, functional device, technology, and commercial equipment.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Thus, the term "Scientific School of Rakhimov R. Kh." in Computational Nanotechnology reflects a mature, world-class research tradition pioneering functional materials, ceramics, radiation synthesis, and materials engineered to targeted specifications.</p>
              </>
            ) : (
              <>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Научная и педагогическая деятельность Рустама Хакимовича началась после окончания Московского государственного университета им. М. В. Ломоносова в 1972 году. В том же году он начал работу младшим научным сотрудником в Физико-техническом институте Академии наук Узбекистана. В дальнейшем его научная деятельность была связана с исследованием светового и импульсного воздействия, синтезом материалов с заданными свойствами и разработкой технологий их практического применения.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Одним из важных этапов научной работы стало участие с 1974 года под руководством академика С. А. Азимова в проектировании научно-технического объекта «Солнце» и исследованиях по использованию концентрированных видов энергии для получения новых материалов. В рамках этих исследований изучались процессы дестабилизации оксидных соединений, получаемых плавлением в солнечных печах, и были предложены методы стабилизации их стехиометрического состава.</p>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '14px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>Научная школа и функциональные материалы</h2>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Одним из основных направлений деятельности Рустама Хакимовича стало создание научно-инженерного подхода к разработке материалов с заранее заданными свойствами.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Была разработана система расчёта состава и технологии синтеза материалов с заданным комплексом характеристик. На её основе создано более 1500 материалов, предназначенных для различных областей науки и техники. Среди полученных результатов выделяется исследования импульсного изменения удельного сопротивления, спектрально-импульсного преобразования оксидной керамики и сверхпластичности оксидных керамических материалов.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Особое место занимает функциональная керамика — материалы, свойства которых позволяют использовать их не только как конструкционные материалы, но и как преобразователи энергии, нагревательные элементы, инфракрасные излучатели, термопары и компоненты технологических установок.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>На базе этих материалов были разработаны высокотемпературные керамические полупроводники, керамические термопары, инфракрасные излучатели с заданными спектрально-энергетическими характеристиками и другие функциональные материалы.</p>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '14px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>От фундаментальных исследований к промышленным технологиям</h2>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Характерная особенность работы Рустама Хакимовича Рахимова — переход от исследования свойств материалов к созданию готовых технологических процессов и оборудования.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '10px' }}>На сайте автора представлены разработки для:</p>
                <ul style={{ paddingLeft: '22px', margin: '0 0 18px 0', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9375rem', lineHeight: '1.6' }}>
                  <li>инфракрасной сушки овощей и фруктов</li>
                  <li>сушки хлопка-сырца</li>
                  <li>сушки лакокрасочных материалов</li>
                  <li>полимеризации и вулканизации</li>
                  <li>пищевых жарочных и печных установок</li>
                  <li>стерилизации</li>
                  <li>инфракрасных медицинских установок</li>
                  <li>получения активного кальция</li>
                  <li>солнечной энергетики</li>
                  <li>высокотемпературных печей</li>
                  <li>высокотемпературных нагревателей и излучателей</li>
                  <li>плёнко-керамических композитов</li>
                  <li>специальных керамических материалов и футеровок.</li>
                </ul>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Разработанные технологии получили более 100 внедрений на предприятиях и в организациях различных стран. Среди упомянутых организаций — предприятия Узбекистана, России, Германии, США, Сингапура, Малайзии и других стран. Отдельно отмечается использование разработанных керамических материалов в ряде оборонных и космических проектов.</p>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '14px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>Основные разработки</h2>
                <div style={{ margin: '20px 0 24px 0', textAlign: 'center' }}>
                  <img
                    src="/images/razrabotka.webp"
                    alt="Основные разработки профессора Рахимова Р.Х."
                    style={{ width: '100%', maxWidth: '800px', height: 'auto', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', display: 'block', margin: '0 auto' }}
                    loading="lazy"
                  />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1e293b', marginTop: '20px', marginBottom: '10px' }}>Функциональная керамика и инфракрасные излучатели</h3>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Одно из центральных направлений научной работы — создание керамических материалов с заданными спектральными характеристиками.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Представлены различные типы керамических инфракрасных излучателей — GI, AF, RC, RV, KL, KH, KB, ZB и ZC. Разработки включают как линейные излучатели на основе кварцевых трубок, так и источники локального воздействия.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Исследования функциональной керамики позволили создать материалы для высокотемпературного нагрева, инфракрасного излучения, сушки, термообработки, энергетических преобразователей и других технологических задач.</p>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1e293b', marginTop: '20px', marginBottom: '10px' }}>Инфракрасная сушка</h3>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>На основе функциональной керамики разработаны установки для сушки овощей и фруктов. Технология позволяет проводить сушку при температурах от 40 °C и ориентирована на сохранение природных свойств продукта, включая вкус, аромат, биологически активные вещества и внешний вид. На сайте представлены различные модели сушильных шкафов и установок — «Астра», «Феруза-Восток», «Узбекистан», «Узбекистан 3», «ИКС-1» и «ИКС-2».</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Отдельное направление — инфракрасная сушка хлопка-сырца. На сайте приведены результаты предварительных исследований, согласно которым применение функциональной керамики позволило снизить суммарный энергетический расход в 9,4 раза, а расход электроэнергии — более чем в 2,3 раза по сравнению с традиционным способом. Эти показатели следует рассматривать именно как опубликованные на сайте результаты конкретных исследований, а не как универсальные значения для всех условий сушки.</p>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1e293b', marginTop: '20px', marginBottom: '10px' }}>Сушка красок, полимеризация и вулканизация</h3>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Отдельная разработка связана с применением функциональной керамики в лакокрасочной и полимерной промышленности.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Керамический материал формирует последовательность импульсов, участвующих в процессах образования и роста полимерных цепей. Заявленным результатом является получение покрытия с высокой адгезией и устойчивостью к отслаиванию при деформации изделия.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>На сайте приводятся результаты испытаний, согласно которым время полимеризации/сушки сокращалось с двух часов до 3,5 минуты, а энергопотребление — с 10 до 0,4 кВт·ч. Также заявляется возможность исключения ряда энергоёмких предварительных операций, включая фосфатирование и обезжиривание.</p>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1e293b', marginTop: '20px', marginBottom: '10px' }}>Стерилизация</h3>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Ещё одно направление — стерилизация с использованием керамических инфракрасных излучателей.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Авторская технология основана на использовании функциональной керамики как преобразователя исходного излучения в импульсное излучение с заданными характеристиками. На сайте описывается механизм воздействия на содержащуюся в микроорганизмах воду и приводятся результаты испытаний, в которых заявлена стерильность после короткой экспозиции.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>На сайте представлены различные модели оборудования, в том числе IRX-2000, MC-1, «Фиал» и «Феруза», а также сравнительные характеристики стерилизаторов.</p>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1e293b', marginTop: '20px', marginBottom: '10px' }}>Плёнко-керамический композит</h3>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Одной из наиболее интересных разработок является плёнко-керамический композит на основе полиэтилена и функциональной керамики.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Согласно технологии, функциональная керамика вводится в полиэтилен в количестве 5–10 масс. %, при этом средний размер керамических частиц составляет 5–10 мкм. После смешения и грануляции полученный материал перерабатывается экструзией в плёнку.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Разработка исследуется прежде всего для применения в солнечной энергетике, гелиосушилках и сельском хозяйстве. На сайте описывается механизм спектрального преобразования солнечной энергии, а также приводится концепция использования композита для стабилизации температурного режима и изменения условий микроклимата в теплицах.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Этому направлению посвящена значительная часть научных публикаций Рахимова и его соавторов: от первых работ по трёхслойным композитным плёнкам до исследований радиационной сушки, солнечных воздухонагревателей и применения полимер-керамических плёнок в сельском хозяйстве.</p>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1e293b', marginTop: '20px', marginBottom: '10px' }}>Высокотемпературные материалы</h3>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Большой блок разработок связан с материалами, полученными на Большой солнечной печи (БСП).</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '10px' }}>На сайте представлены:</p>
                <ul style={{ paddingLeft: '22px', margin: '0 0 18px 0', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9375rem', lineHeight: '1.6' }}>
                  <li>керамические фильеры и резцы</li>
                  <li>высокопористые футеровки</li>
                  <li>материалы на основе диоксида циркония</li>
                  <li>алюмомагнезиальная шпинель</li>
                  <li>корундовые материалы</li>
                  <li>хромиты редкоземельных элементов</li>
                  <li>высокотемпературные нагреватели</li>
                  <li>инфракрасные излучатели</li>
                  <li>керамические термопары</li>
                  <li>многослойные нагреватели</li>
                  <li>материалы для высокотемпературных печей.</li>
                </ul>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Для отдельных материалов указаны рабочие температуры до 1800–2300 °C, включая футеровки и нагревательные элементы для высокотемпературных процессов.</p>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '14px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>Патентное портфолио</h2>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Патентный раздел сайта показывает, что разработки Рустама Хакимовича охватывают несколько поколений технологий и различные области применения.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '10px' }}>Среди авторских свидетельств представлены разработки по:</p>
                <ul style={{ paddingLeft: '22px', margin: '0 0 18px 0', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9375rem', lineHeight: '1.6' }}>
                  <li>шихтам для получения керамических материалов</li>
                  <li>высокотемпературным электропроводящим керамическим материалам</li>
                  <li>высокотемпературным нагревательным элементам</li>
                  <li>высокотемпературным керамическим нагревателям</li>
                  <li>технологии получения липазы</li>
                  <li>донорным примесям.</li>
                </ul>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Отдельный блок составляют патенты СССР, в том числе на способы и устройства стерилизации, стерилизатор и способ выпечки узбекских лепёшек.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '10px' }}>Среди патентов Узбекистана на сайте указаны:</p>
                <ul style={{ paddingLeft: '22px', margin: '0 0 18px 0', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9375rem', lineHeight: '1.6' }}>
                  <li>IAP 04888 — способ получения активного цитрата кальция</li>
                  <li>IAP 04287 — способ получения кальцийсодержащей биологически активной добавки</li>
                  <li>IAP 01998 — электропроводящий керамический материал</li>
                  <li>IAP 04844 — композиция для получения плёнко-керамического композита для гелиосушилок на основе полиэтилена</li>
                  <li>IAP 04881 — способ сушки хлопка-сырца</li>
                  <li>IAP 01975 — инфракрасно-излучающий керамический материал.</li>
                </ul>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Патентная деятельность также представлена евразийскими, европейскими, турецкими и американскими патентами. Среди них — разработки инфракрасно-излучающих керамических материалов, электропроводящей керамики, технологий обработки материалов инфракрасным излучением и другие разработки.</p>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '14px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>Научные публикации</h2>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Публикационная деятельность Рустама Хакимовича охватывает несколько десятилетий.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>На сайте заявлено более 200 публикаций, свыше 300 изобретений и более 20 монографий; также указано, что более 90 % работ опубликованы за рубежом либо представлялись на международных конференциях.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '10px' }}>Тематика публикаций включает:</p>
                <ul style={{ paddingLeft: '22px', margin: '0 0 18px 0', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9375rem', lineHeight: '1.6' }}>
                  <li>функциональную керамику</li>
                  <li>синтез высокотемпературных материалов</li>
                  <li>импульсное инфракрасное излучение</li>
                  <li>солнечную энергетику</li>
                  <li>радиационную сушку</li>
                  <li>плёнко-керамические композиты</li>
                  <li>солнечные воздухонагреватели</li>
                  <li>сушку хлопка</li>
                  <li>фотоэнергетику</li>
                  <li>инфракрасные медицинские технологии</li>
                  <li>активный кальций</li>
                  <li>применение функциональной керамики в промышленности.</li>
                </ul>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Особенно заметна последовательная научная линия по плёнко-керамическим композитам: публикации посвящены солнечным воздухонагревателям с трёхслойной композитной плёнкой, радиационной сушке с использованием керамико-содержащей полимерной плёнки, перспективам применения композитных плёнок в гелиотехнике и сельском хозяйстве, исследованию функциональной керамики для солнечной сушки и механизму стабилизации температуры.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Более поздние публикации продолжают это направление. В частности, на сайте указаны работы “Synthesis of Materials by the Radiation Method and Their Application” и “Investigation of the Efficiency of Using a Film-Ceramic Composite in a Solar Dryer”, опубликованные в Applied Solar Energy в 2022 году.</p>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '14px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>Международное признание</h2>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Среди наград и признания авторский сайт выделяет Гран-при Германии «EINFACH GENIAL» («Просто гениально») 2003 года, а также серебряную медаль и диплом за разработку установки инфракрасной терапии с керамическим покрытием излучателя «Эмир».</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Сайт также сообщает о применении разработанных материалов и технологий в различных промышленных организациях и проектах, включая предприятия Узбекистана и зарубежных стран. Отдельно упоминается использование 18 уникальных керамических материалов в проекте «Буран–Энергия».</p>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '14px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>Научная школа Рустама Хакимовича Рахимова</h2>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Научная школа Р. Х. Рахимова получила отдельное отражение в научной периодике. В журнале Computational nanotechnology в 2016 году был опубликован специальный цикл материалов под рубрикой «НАУЧНАЯ ШКОЛА РАХИМОВА Р. Х.», посвящённый исследованиям функциональной керамики, радиационным методам синтеза и созданию материалов с заданными свойствами.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>В рамках этого цикла последовательно рассматривались экспериментальные и теоретические основы синтеза функциональной керамики, методы прогнозирования оптимального состава и технологии получения материалов, особенности их электрических, оптических и излучательных свойств, а также возможности практического применения.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Одним из центральных принципов научной школы является связь между составом материала, технологией его получения, структурой и конечными функциональными характеристиками. Такой подход позволяет рассматривать материал не только как вещество с определённым химическим составом, но и как специально созданный функциональный элемент для решения конкретной инженерной задачи.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>В публикациях научной школы рассматриваются высокотемпературные и оксидные материалы, функциональная керамика, инфракрасные излучатели, импульсные радиационные процессы, электропроводящие керамические системы и материалы для различных технологических применений.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Научная школа Рахимова объединяет несколько взаимосвязанных направлений: синтез материалов с заданными свойствами; функциональную керамику; инфракрасное излучение и его преобразование; радиационные методы обработки; высокотемпературные материалы; технологии сушки и термообработки; полимер-керамические композиты; применение материалов в энергетике, промышленности, сельском хозяйстве и других областях.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Особенностью этого научно-инженерного подхода является последовательное движение от фундаментального исследования свойств вещества к созданию материала, функционального элемента, технологии и оборудования. В результате научные разработки получают возможность практического применения и дальнейшего промышленного развития.</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '14px' }}>Таким образом, термин «Научная школа Рахимова Р. Х.» в публикациях Computational nanotechnology отражает сформированное исследовательское направление, связанное прежде всего с функциональными материалами, керамикой, радиационными методами и разработкой материалов с заранее заданными свойствами.</p>
              </>
            )}

            {/* Quick Metrics / Summary */}
            <h3 style={{ fontSize: '1.375rem', marginTop: '36px', marginBottom: '16px' }}>{t('author_results_title')}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', margin: '24px 0' }}>
              <div style={{ background: '#ffffff', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--color-primary)' }}>280</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{t('author_metric_articles')}</div>
              </div>
              <div style={{ background: '#ffffff', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--color-primary)' }}>65</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{t('author_metric_patents')}</div>
              </div>
              <div style={{ background: '#ffffff', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--color-primary)' }}>57</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{t('author_metric_akts')}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '32px', flexWrap: 'wrap' }}>
              <Link to="/stat" className="btn btn-primary">{t('author_btn_articles')}</Link>
              <Link to="/patents" className="btn btn-outline">{t('author_btn_patents')}</Link>
              <Link to="/akt" className="btn btn-outline">{t('author_btn_akts')}</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
