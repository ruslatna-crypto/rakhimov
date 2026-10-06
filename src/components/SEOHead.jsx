import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const BASE_URL = 'https://rakhimovr.uz';
const DEFAULT_IMAGE = `${BASE_URL}/images/rrh-250x300.png`;

export const seoData = {
  '/': {
    ru: {
      title: 'Профессор Рахимов Р.Х. — Разработки и функциональная керамика',
      description: 'Персональный научно-производственный портал д.т.н., проф. Рахимова Р.Х. Солнечная энергетика, функциональная керамика, ИК-сушка и медицина.'
    },
    en: {
      title: 'Prof. Rustam Rakhimov — Solar Tech & Functional Ceramics',
      description: 'Official portal of Prof. Rustam Rakhimov. Solar engineering, functional ceramics, pulsed resonant drying, patents and publications.'
    }
  },
  '/autor': {
    ru: {
      title: 'Об авторе — Профессор Рахимов Рустам Хакимович',
      description: 'Биография, научные звания и достижения профессора Рахимова Р.Х. Руководитель лаборатории ИМВ АН РУз «Физика-Солнце», академик РАЕ.'
    },
    en: {
      title: 'About Author — Professor Rustam Rakhimov',
      description: 'Biography, scientific achievements and career of Prof. Rustam Rakhimov. Head of Lab at Materials Science Institute, Academy of Sciences of Uzbekistan.'
    }
  },
  '/sushka': {
    ru: {
      title: 'Сушка овощей и фруктов — Импульсная ИК-технология Рахимова',
      description: 'Технология резонансной инфракрасной сушки плодоовощной продукции на функциональной керамике. Установки «Узбекистан», «Астра», акты испытаний.'
    },
    en: {
      title: 'Fruit & Vegetable Drying — Resonant Pulse IR Technology',
      description: 'Resonant infrared drying technology for fruits and vegetables using functional ceramics. Industrial units, test acts, and quality certificates.'
    }
  },
  '/lamp': {
    ru: {
      title: 'Керамические ИК-лампы INFRA-R — Медицинские излучатели',
      description: 'Терапевтические ИК-излучатели на основе функциональной керамики. Резонансная физиотерапия, клинические заключения и сертификаты соответствия.'
    },
    en: {
      title: 'Ceramic IR Lamps INFRA-R — Medical Emitters & Devices',
      description: 'Therapeutic infrared emitters based on functional ceramics. Resonant physiotherapy, clinical conclusions, and technical certifications.'
    }
  },
  '/kalci': {
    ru: {
      title: 'Препарат «Активный кальций» — Технология и клинические испытания',
      description: 'Биопрепарат активного кальция из скорлупы яиц, синтезированный с использованием импульсной керамики. Отчеты клинических испытаний и заключения.'
    },
    en: {
      title: 'Active Calcium Biopreparation — Research & Clinical Trials',
      description: 'Highly bioavailable active calcium synthesized using pulsed functional ceramics. Clinical trial reports and medical expert conclusions.'
    }
  },
  '/pech': {
    ru: {
      title: 'Жарочные печи на функциональной керамике — Энергоэффективность',
      description: 'Промышленные энергосберегающие жарочные шкафы и печи с керамическими нагревателями. Равномерный прогрев и снижение энергопотребления.'
    },
    en: {
      title: 'Ceramic Roasting Ovens — Industrial Energy-Efficient Tech',
      description: 'Industrial energy-efficient baking and roasting ovens powered by functional ceramic heaters. Uniform heating and reduced power consumption.'
    }
  },
  '/plenka': {
    ru: {
      title: 'Пленочно-керамический композит — Защитные покрытия и пленки',
      description: 'Разработка полимерных и пленочных композитов с микрочастицами функциональной керамики для теплиц, укрытий и теплосберегающих конструкций.'
    },
    en: {
      title: 'Film-Ceramic Composite — Agricultural & Industrial Films',
      description: 'Polymeric film composites modified with functional ceramic microparticles for greenhouse solar conversion and heat retention.'
    }
  },
  '/kraska': {
    ru: {
      title: 'Сушка лакокрасочных покрытий — Импульсный ИК-метод Рахимова',
      description: 'Ускоренная сушка лаков и красок керамическими излучателями. Снижение времени полимеризации без дефектов и закипания покрытия.'
    },
    en: {
      title: 'Paint & Varnish Curing — Resonant Ceramic Infrared Method',
      description: 'Accelerated infrared curing of industrial coatings using functional ceramic emitters. Rapid polymerization without surface boiling.'
    }
  },
  '/steril': {
    ru: {
      title: 'Керамические стерилизаторы — Импульсная термообработка',
      description: 'Медицинские и лабораторные стерилизаторы на функциональной керамике. Официальные акты испытаний и отчеты.'
    },
    en: {
      title: 'Ceramic Pulse Sterilizers — Medical & Laboratory Equipment',
      description: 'Medical and laboratory sterilizers utilizing functional ceramics (Feruza, Fial, KS-250). Official test acts and international reports.'
    }
  },
  '/cotton': {
    ru: {
      title: 'ИК-сушка хлопка-сырца — Сохранение всхожести и качества волокна',
      description: 'Технология ИК-сушки хлопка-сырца с сохранением посевных качеств семян и прочности волокна. Акты испытаний хлопкозаводов Узбекистана.'
    },
    en: {
      title: 'Infrared Raw Cotton Drying — Seed Viability Preservation',
      description: 'Infrared drying technology for seed raw cotton preserving germination vitality and fiber structure. Industrial ginnery test protocols.'
    }
  },
  '/bsp': {
    ru: {
      title: 'Материалы на Большой Солнечной Печи (БСП 1000 кВт)',
      description: 'Синтез тугоплавких оксидов, стекол и функциональной керамики на Большой Солнечной Печи мощностью 1000 кВт в Паркенте.'
    },
    en: {
      title: 'Materials Synthesized at the Big Solar Furnace (1000 kW)',
      description: 'High-temperature synthesis of refractory oxides and functional ceramics at the 1000 kW Big Solar Furnace in Parkent, Uzbekistan.'
    }
  },
  '/stat': {
    ru: {
      title: 'Научные статьи профессора Рахимова Р.Х. — Каталог публикаций',
      description: 'Полный библиографический каталог научных публикаций проф. Рахимова Р.Х. в отечественных и международных рецензируемых журналах.'
    },
    en: {
      title: 'Scientific Papers by Prof. R. Rakhimov — Publications',
      description: 'Comprehensive catalog of 280 scientific papers published by Prof. Rustam Rakhimov in peer-reviewed national and international journals.'
    }
  },
  '/book': {
    ru: {
      title: 'Монографии и книги — Научные труды профессора Рахимова Р.Х.',
      description: 'Фундаментальные монографии по функциональной керамике, полупроводниковой гелиоэнергетике и импульсным технологиям. Скачивание в формате PDF.'
    },
    en: {
      title: 'Books & Monographs by Prof. Rustam Rakhimov',
      description: 'Fundamental scientific monographs on functional ceramics, solar energy materials, and pulse physics. Available with PDF downloads.'
    }
  },
  '/patents': {
    ru: {
      title: 'Патенты и свидетельства на изобретения — Рахимов Р.Х.',
      description: 'Официальные патенты Республики Узбекистан и международные свидетельства на составы керамики, способы сушки и медицинские устройства.'
    },
    en: {
      title: 'Patents & Invention Certificates — Prof. Rustam Rakhimov',
      description: 'Official patents and invention certificates of Uzbekistan and international registries for ceramics, drying processes, and medical devices.'
    }
  },
  '/akt': {
    ru: {
      title: 'Акты внедрения и отчеты об испытаниях (57 документов)',
      description: 'Официальные акты производственных испытаний, внедрения в промышленность и клинических заключений по технологиям профессора Рахимова Р.Х.'
    },
    en: {
      title: 'Implementation Acts & Industrial Test Reports (57 docs)',
      description: '57 official acts of industrial testing, factory implementation, and clinical conclusions validating Prof. Rakhimov\'s technologies.'
    }
  },
  '/search': {
    ru: {
      title: 'Поиск по научным материалам и разработкам портала',
      description: 'Быстрый поиск по научным материалам, патентам, монографиям и научным разработкам профессора Рахимова Р.Х.'
    },
    en: {
      title: 'Portal Search — Papers, Patents & Technologies',
      description: 'Fast integrated search across 280 papers, 57 test acts, patents, books, and 9 scientific developments of Prof. Rakhimov.'
    }
  },
  '404': {
    ru: {
      title: '404 — Страница не найдена | Портал профессора Рахимова Р.Х.',
      description: 'Запрошенная страница не существует или была перемещена в рамках оптимизации структуры портала.'
    },
    en: {
      title: '404 — Page Not Found | Prof. Rakhimov Portal',
      description: 'The requested page does not exist or has been moved.'
    }
  }
};

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
    const is404 = !seoData[pathname];
    const pageConfig = seoData[pathname] || seoData['404'];
    const { title, description } = pageConfig[currentLang] || pageConfig['ru'];

    // 1. Title
    document.title = title;

    // 2. Meta Description
    setMetaTag('description', false, description);

    // 3. Meta Robots: /search и 404 закрываем от индексации
    const isNoIndex = pathname === '/search' || is404;
    setMetaTag('robots', false, isNoIndex ? 'noindex, follow' : 'index, follow');

    // 4. Canonical: для 404 и /search canonical не создается / удаляется
    if (!isNoIndex) {
      const canonicalUrl = pathname === '/' ? `${BASE_URL}/` : `${BASE_URL}${pathname}`;
      updateCanonical(canonicalUrl);
    } else {
      updateCanonical(null);
    }

    // 5. Open Graph
    const pageUrl = pathname === '/' ? `${BASE_URL}/` : `${BASE_URL}${pathname}`;
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
