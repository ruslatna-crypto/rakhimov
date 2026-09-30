import React from 'react';
import { Link } from 'react-router-dom';
import { Award, BookOpen, FileText, CheckCircle, ExternalLink, Mail } from 'lucide-react';
import '../styles/pages.css';

export default function Author() {
  return (
    <div>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <h1 className="page-hero-title">Рахимов Рустам Хакимович</h1>
          <p className="page-hero-lead">
            Доктор технических наук, профессор, ведущий ученый в области гелиоматериаловедения, импульсного туннельного эффекта и функциональной керамики.
          </p>
        </div>
      </section>

      {/* Main Author Content */}
      <section className="section-wrapper">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '48px', alignItems: 'start' }}>
          {/* Left Column / Portrait Card */}
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '24px', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
            <img
              src="/images/rrh-250x300.png"
              alt="Рахимов Рустам Хакимович"
              style={{ width: '100%', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}
            />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>Рахимов Р.Х.</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '16px' }}>
              д.т.н., профессор
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', fontSize: '0.84375rem', color: '#475569' }}>
              <div><strong>Организация:</strong> Институт Материаловедения АН РУз</div>
              <div><strong>Объект исследований:</strong> Большая Солнечная Печь (БСП)</div>
              <div><strong>E-mail:</strong> <a href="mailto:rustam-shsul@yandex.com" style={{ color: 'var(--color-primary)' }}>rustam-shsul@yandex.com</a></div>
            </div>

            <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid var(--color-border)' }} />

            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '10px' }}>
                Научные профили
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem' }}>
                <li>
                  <a href="https://cyberleninka.ru/article/n/rahimov-rustam-hakimovich" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Cyberleninka <ExternalLink size={14} />
                  </a>
                </li>
                <li>
                  <a href="https://www.mathnet.ru/rus/person114518" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Math-Net.ru (Персоналии) <ExternalLink size={14} />
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
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '36px', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '20px' }}>Научная деятельность и достижения</h2>
            
            <p style={{ fontSize: '1.0625rem', lineHeight: '1.7', color: '#334155' }}>
              Страница посвящена автору, его научной деятельности, исследованиям и вкладу в развитие материаловедения, энергетики и медицины.
            </p>
            <p style={{ fontSize: '1.0625rem', lineHeight: '1.7', color: '#334155' }}>
              Рахимов Рустам Хакимович посвятил более 50 лет фундаментальным и прикладным исследованиям в области кинетики, гетерогенного катализа и синтеза высокотемпературных оксидных материалов на уникальном оптическом объекте — Большой Солнечной Печи (БСП) в Паркенте.
            </p>
            <p style={{ fontSize: '1.0625rem', lineHeight: '1.7', color: '#334155' }}>
              Под его научным руководством открыт и теоретически обоснован импульсный туннельный эффект (PTE), позволивший разработать принципиально новые классы функциональной керамики. Эти материалы генерируют строго настроенные спектры квантового излучения, что легло в основу прорывных технологий:
            </p>

            <ul style={{ paddingLeft: '24px', margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '1rem', color: '#334155' }}>
              <li><strong>Энергосберегающая инфракрасная сушка</strong> плодоовощной продукции без химикатов с сохранением 95-98% витаминов.</li>
              <li><strong>Бережная сушка хлопка-сырца</strong> без деструкции масел и потери полевой всхожести семян.</li>
              <li><strong>Низкотемпературная импульсная стерилизация</strong> медицинских инструментов за считанные минуты.</li>
              <li><strong>Медицинские керамические лампы INFRA-R</strong> для неинвазивного лечения заболеваний ЖКТ, травм и ожогов.</li>
              <li><strong>Препарат «Активный кальций»</strong> с высокой биоусвояемостью для восстановления костной ткани.</li>
              <li><strong>Пленочно-керамический композит</strong> для теплиц, трансформирующий солнечный спектр в диапазон биологического оптимума.</li>
            </ul>

            <h3 style={{ fontSize: '1.375rem', marginTop: '36px', marginBottom: '16px' }}>Академические результаты</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', margin: '24px 0' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--color-primary)' }}>136</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Статей в ведущих журналах</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--color-primary)' }}>73</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Патентов и авторских свид-в</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--color-primary)' }}>57</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Актов производственного внедрения</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '32px', flexWrap: 'wrap' }}>
              <Link to="/stat" className="btn btn-primary">Все публикации (136)</Link>
              <Link to="/patents" className="btn btn-outline">Каталог патентов (73)</Link>
              <Link to="/akt" className="btn btn-outline">Акты внедрения (57)</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
