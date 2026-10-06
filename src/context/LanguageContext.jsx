import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  ru: {
    // Header & Navigation
    nav_home: 'Главная',
    nav_about: 'О себе',
    nav_developments: 'Разработки',
    nav_publications: 'Публикации',
    nav_links: 'Ссылки',
    nav_search: 'Поиск',
    nav_firm_site: 'На сайт фирмы',
    nav_firm_title: 'Перейти на официальный сайт www.infraks.uz',

    // Search
    search_title: 'Поиск по сайту',
    search_modal_placeholder: 'Поиск по сайту: статьи, патенты, разработки, книги, акты...',
    search_tab_all: 'Все материалы',
    search_tab_dev: 'Разработки',
    search_tab_articles: 'Статьи',
    search_tab_patents: 'Патенты',
    search_tab_books: 'Книги',
    search_tab_akts: 'Акты внедрения',
    search_tab_pages: 'Разделы',
    search_found_results: 'Найдено результатов:',
    search_nothing_found: 'Ничего не найдено по запросу',
    search_try_another: 'Попробуйте изменить формулировку или выбрать категорию «Все материалы».',
    search_quick_suggestions: 'Популярные запросы:',
    search_hint_esc: 'Esc чтобы закрыть',
    search_view_all_results: 'Открыть все результаты на странице',
    
    // Developments Menu
    dev_sushka: 'Сушка овощей и фруктов',
    dev_lamp: 'Инфракрасные медицинские лампы',
    dev_kalci: 'Активный кальций',
    dev_pech: 'Жарочные печи',
    dev_plenka: 'Пленочно-керамический композит',
    dev_kraska: 'Сушка лаков и краски',
    dev_steril: 'Стерилизаторы',
    dev_cotton: 'Сушка хлопка',
    dev_bsp: 'Материалы полученные на БСП',

    // Publications Menu (без цифр)
    pub_articles: 'Научные статьи',
    pub_books: 'Монографии и книги',
    pub_patents: 'Патенты и свидетельства',
    pub_akts: 'Акты и заключения',

    // Hero Section
    hero_badge: 'Институт Материаловедения АН РУз',
    hero_title_1: 'Научные разработки &',
    hero_title_2: 'Функциональная керамика',
    hero_subtitle: 'Персональный научно-производственный портал доктора технических наук, профессора Рахимова Рустама Хакимовича. Фундаментальные и прикладные исследования в области солнечной энергетики, импульсного туннельного эффекта, резонансной сушки и биомедицины.',
    hero_btn_author: 'Об авторе',
    hero_btn_articles: 'Научные статьи (280)',
    hero_caption_name: 'Рахимов Рустам Хакимович',
    hero_caption_rank: 'Доктор технических наук, профессор',

    // Metrics
    metric_articles: 'Научных публикаций',
    metric_patents: 'Патента и свидетельства',
    metric_akts: 'Актов внедрения',
    metric_books: 'Опубликованных монографий',

    // Home Sections
    dev_section_badge: 'ИННОВАЦИИ & ТЕХНОЛОГИИ',
    dev_section_title: 'Ключевые направления разработок',
    dev_section_subtitle: 'Разработки на базе синтезированных в Большой Солнечной Печи (БСП) оксидных керамических преобразователей спектра.',
    dev_card_btn: 'Подробнее о разработке',

    // Author Preview Section
    author_section_badge: 'НАУЧНАЯ ДЕЯТЕЛЬНОСТЬ',
    author_section_title: 'Академик Рахимов Рустам Хакимович',
    author_p1: 'Руководитель лаборатории №1 «Материалы полупроводниковой гелиоэнергетики» Института Материаловедения Научно-производственного объединения «Физика-Солнце» Академии наук Республики Узбекистан.',
    author_p2: 'Автор свыше 280 фундаментальных научных публикаций, 9 монографий и более 73 патентов и авторских свидетельств СССР, Республики Узбекистан, Евразийского патентного ведомства и зарубежных стран.',
    author_badge_1: 'Доктор технических наук',
    author_badge_2: 'Профессор',
    author_badge_3: 'Академик РАЕ',
    author_badge_4: 'Лаборатория №1 «Физика-Солнце»',
    author_btn_full: 'Полная биография и награды',

    // Contacts Section
    contacts_badge: 'КОНТАКТЫ & СВЯЗЬ',
    contacts_title: 'Связаться с лабораторией',
    contacts_subtitle: 'По вопросам научно-технического сотрудничества, промышленного внедрения и приобретения оборудования.',
    contacts_address_label: 'Адрес лаборатории',
    contacts_address_val: 'Узбекистан, Ташкент, Чингиз Айтматов, 2Б (Институт Материаловедения АН РУз)',
    contacts_email_label: 'Электронная почта',
    contacts_phone_label: 'Рабочий телефон',

    // Footer
    footer_desc: 'Официальный научно-производственный портал профессора Р.Х. Рахимова. Инновационные гелиотехнологии, функциональная керамика, энергоэффективная импульсная сушка и медицинские биопрепараты.',
    footer_col_nav: 'Навигация',
    footer_col_dev: 'Разработки',
    footer_col_pub: 'Публикации',
    footer_col_contact: 'Контакты',
    footer_copyright: 'Все права защищены. Научно-производственный портал профессора Рахимова Р.Х.',

    // Common Page UI
    back_to_home: '← На главную',
    search_placeholder: 'Поиск по ключевым словам...',
    search_articles_placeholder: 'Поиск по названию статьи, автору, журналу или году...',
    search_patents_placeholder: 'Поиск по названию патента, номеру, автору...',
    search_akts_placeholder: 'Поиск по номеру акта, объекту внедрения или городу...',
    filter_all: 'Все',
    open_document: 'Открыть документ',
    read_monograph: 'Читать / Скачать монографию',
    table_num: '№',
    table_date: 'Дата',
    table_object: 'Объект / Предприятие внедрения',
    table_doc: 'Документ',

    // Author Page
    author_page_title: 'Рахимов Рустам Хакимович',
    author_page_lead: 'Доктор технических наук, профессор, ведущий ученый в области гелиоматериаловедения, импульсного туннельного эффекта и функциональной керамики.',
    author_rank_short: 'д.т.н., профессор',
    author_position: 'заведующий лабораторией в Институте Материаловедения АН РУз',
    author_org_label: 'Организация:',
    author_org_val: 'Институт Материаловедения АН РУз',
    author_object_label: 'Объект исследований:',
    author_object_val: 'Большая Солнечная Печь (БСП)',
    author_profiles: 'Научные профили',
    author_sec_title: 'Научная деятельность и достижения',
    author_results_title: 'Академические результаты',
    author_metric_articles: 'Статей в ведущих журналах',
    author_metric_patents: 'Патентов и авторских свид-в',
    author_metric_akts: 'Актов производственного внедрения',
    author_btn_articles: 'Все публикации (280)',
    author_btn_patents: 'Каталог патентов (65)',
    author_btn_akts: 'Акты внедрения (57)',

    // Development Page
    dev_breadcrumb_home: 'Главная',
    dev_breadcrumb_devs: 'Разработки',
    dev_desc_title: 'Научно-техническое описание разработки',
    dev_gallery_title: 'Иллюстрации и материалы разработки',
    dev_linked_articles: 'Связанные публикации (280)',
    dev_linked_patents: 'Патенты на разработку (65)',
    dev_linked_akts: 'Акты производственных испытаний (57)',
    dev_other_title: 'Другие разработки',
    dev_collab_title: 'Консультации и сотрудничество',
    dev_collab_text: 'По вопросам промышленного и медицинского внедрения разработки обращайтесь к автору.',
    dev_collab_btn: 'Написать письмо',

    // Drying Chart
    'dryingChart.title': 'Время сушки овощей и фруктов',
    'dryingChart.dryingTime': 'Время сушки',
    'dryingChart.yAxis': 'Время сушки, ч',
    'dryingChart.hour': 'ч',
    'dryingChart.products.onion': 'Лук',
    'dryingChart.products.eryngium': 'Eryngium',
    'dryingChart.products.dill': 'Укроп',
    'dryingChart.products.bellPepper': 'Жёлтый перец',
    'dryingChart.products.tomatoes': 'Помидоры',
    'dryingChart.products.potatoes': 'Картофель',
    'dryingChart.products.carrots': 'Морковь',
    'dryingChart.products.pineapple': 'Ананас'
  },

  en: {
    // Header & Navigation
    nav_home: 'Home',
    nav_about: 'About',
    nav_developments: 'Developments',
    nav_publications: 'Publications',
    nav_links: 'Links',
    nav_search: 'Search',
    nav_firm_site: 'Company Website',
    nav_firm_title: 'Go to official website www.infraks.uz',

    // Search
    search_title: 'Site Search',
    search_modal_placeholder: 'Search portal: articles, patents, developments, books, acts...',
    search_tab_all: 'All Materials',
    search_tab_dev: 'Developments',
    search_tab_articles: 'Articles',
    search_tab_patents: 'Patents',
    search_tab_books: 'Books',
    search_tab_akts: 'Acts',
    search_tab_pages: 'Sections',
    search_found_results: 'Results found:',
    search_nothing_found: 'No results found for',
    search_try_another: 'Try modifying your search query or select "All Materials".',
    search_quick_suggestions: 'Popular queries:',
    search_hint_esc: 'Esc to close',
    search_view_all_results: 'View all results on dedicated page',

    // Developments Menu
    dev_sushka: 'Drying of Fruits & Vegetables',
    dev_lamp: 'Infrared Medical Lamps',
    dev_kalci: 'Active Calcium',
    dev_pech: 'Frying & Roasting Furnaces',
    dev_plenka: 'Film-Ceramic Composite',
    dev_kraska: 'Drying of Paints & Varnishes',
    dev_steril: 'Sterilizers',
    dev_cotton: 'Cotton Seed Treatment',
    dev_bsp: 'Materials Synthesized in BSF',

    // Publications Menu (no numbers)
    pub_articles: 'Scientific Articles',
    pub_books: 'Monographs & Books',
    pub_patents: 'Patents & Certificates',
    pub_akts: 'Acts & Conclusions',

    // Hero Section
    hero_badge: 'Institute of Materials Science, Academy of Sciences of Uzbekistan',
    hero_title_1: 'Scientific Developments &',
    hero_title_2: 'Functional Ceramics',
    hero_subtitle: 'Personal scientific and industrial portal of Doctor of Technical Sciences, Professor Rustam Khakimovich Rakhimov. Fundamental and applied research in solar energy, pulsed tunneling effect, resonant drying, and biomedicine.',
    hero_btn_author: 'About Author',
    hero_btn_articles: 'Scientific Articles (280)',
    hero_caption_name: 'Rustam Khakimovich Rakhimov',
    hero_caption_rank: 'Doctor of Technical Sciences, Professor',

    // Metrics
    metric_articles: 'Scientific Publications',
    metric_patents: 'Patents & Certificates',
    metric_akts: 'Implementation Acts',
    metric_books: 'Published Monographs',

    // Home Sections
    dev_section_badge: 'INNOVATION & TECHNOLOGY',
    dev_section_title: 'Key Areas of Development',
    dev_section_subtitle: 'Developments based on oxide ceramic spectrum converters synthesized in the Big Solar Furnace (BSF).',
    dev_card_btn: 'Read more about development',

    // Author Preview Section
    author_section_badge: 'SCIENTIFIC CAREER',
    author_section_title: 'Academician Rustam Khakimovich Rakhimov',
    author_p1: 'Head of Laboratory No. 1 "Materials of Semiconductor Solar Energy" of the Institute of Materials Science, Scientific-Production Association "Physics-Sun", Academy of Sciences of Uzbekistan.',
    author_p2: 'Author of over 280 fundamental scientific papers, 9 monographs, and more than 73 patents and inventor certificates of the USSR, Uzbekistan, Eurasian Patent Office, and abroad.',
    author_badge_1: 'Doctor of Technical Sciences',
    author_badge_2: 'Professor',
    author_badge_3: 'Academician of RAE',
    author_badge_4: 'Laboratory No. 1 "Physics-Sun"',
    author_btn_full: 'Full Biography & Awards',

    // Contacts Section
    contacts_badge: 'CONTACTS & FEEDBACK',
    contacts_title: 'Contact the Laboratory',
    contacts_subtitle: 'For scientific cooperation, industrial implementation, and equipment inquiries.',
    contacts_address_label: 'Laboratory Address',
    contacts_address_val: 'Uzbekistan, Tashkent, Chingiz Aitmatov str., 2B (Institute of Materials Science)',
    contacts_email_label: 'Email Address',
    contacts_phone_label: 'Office Telephone',

    // Footer
    footer_desc: 'Official scientific and industrial portal of Professor R.Kh. Rakhimov. Innovative solar technologies, functional ceramics, energy-efficient pulsed drying, and biomedical products.',
    footer_col_nav: 'Navigation',
    footer_col_dev: 'Developments',
    footer_col_pub: 'Publications',
    footer_col_contact: 'Contacts',
    footer_copyright: 'All rights reserved. Scientific and industrial portal of Professor R.Kh. Rakhimov.',

    // Common Page UI
    back_to_home: '← Back to Home',
    search_placeholder: 'Search by keyword...',
    search_articles_placeholder: 'Search by title, author, journal or year...',
    search_patents_placeholder: 'Search by patent title, number, author...',
    search_akts_placeholder: 'Search by act number, implementation object or city...',
    filter_all: 'All',
    open_document: 'Open document',
    read_monograph: 'Read / Download Monograph',
    table_num: 'No.',
    table_date: 'Date',
    table_object: 'Implementation Object / Enterprise',
    table_doc: 'Document',

    // Author Page
    author_page_title: 'Rustam Khakimovich Rakhimov',
    author_page_lead: 'Doctor of Technical Sciences, Professor, leading scientist in solar materials science, pulsed tunneling effect, and functional ceramics.',
    author_rank_short: 'Dr. Sci. (Tech.), Professor',
    author_position: 'Head of Laboratory at the Institute of Materials Science, Academy of Sciences of Uzbekistan',
    author_org_label: 'Organization:',
    author_org_val: 'Institute of Materials Science, AS RUz',
    author_object_label: 'Research Object:',
    author_object_val: 'Big Solar Furnace (BSF)',
    author_profiles: 'Scientific Profiles',
    author_sec_title: 'Scientific Activities and Achievements',
    author_results_title: 'Academic Results',
    author_metric_articles: 'Articles in Leading Journals',
    author_metric_patents: 'Patents & Certificates',
    author_metric_akts: 'Industrial Implementation Acts',
    author_btn_articles: 'All Publications (280)',
    author_btn_patents: 'Patent Catalog (65)',
    author_btn_akts: 'Implementation Acts (57)',

    // Development Page
    dev_breadcrumb_home: 'Home',
    dev_breadcrumb_devs: 'Developments',
    dev_desc_title: 'Scientific and Technical Description',
    dev_gallery_title: 'Illustrations & Materials',
    dev_linked_articles: 'Related Publications (280)',
    dev_linked_patents: 'Related Patents (65)',
    dev_linked_akts: 'Implementation Acts (57)',
    dev_other_title: 'Other Developments',
    dev_collab_title: 'Consultation & Cooperation',
    dev_collab_text: 'For industrial and medical implementation inquiries, please contact the author.',
    dev_collab_btn: 'Send an Email',

    // Drying Chart
    'dryingChart.title': 'Drying Time of Fruits and Vegetables',
    'dryingChart.dryingTime': 'Drying time',
    'dryingChart.yAxis': 'Drying time, h',
    'dryingChart.hour': 'h',
    'dryingChart.products.onion': 'Onion',
    'dryingChart.products.eryngium': 'Eryngium',
    'dryingChart.products.dill': 'Dill',
    'dryingChart.products.bellPepper': 'Bell pepper',
    'dryingChart.products.tomatoes': 'Tomatoes',
    'dryingChart.products.potatoes': 'Potatoes',
    'dryingChart.products.carrots': 'Carrots',
    'dryingChart.products.pineapple': 'Pineapple'
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('site_lang') || 'ru';
  });

  useEffect(() => {
    localStorage.setItem('site_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key) => {
    if (translations[lang]?.[key] !== undefined) return translations[lang][key];
    if (translations['ru']?.[key] !== undefined) return translations['ru'][key];

    const resolve = (obj, path) => path && typeof path === 'string' ? path.split('.').reduce((acc, part) => acc && acc[part], obj) : undefined;
    const nested = resolve(translations[lang], key);
    if (nested !== undefined) return nested;
    const nestedRu = resolve(translations['ru'], key);
    if (nestedRu !== undefined) return nestedRu;

    return key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
