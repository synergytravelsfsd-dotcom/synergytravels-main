import React, { createContext, useContext, useState } from 'react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

interface LanguageContextType {
  selectedLanguage: Language;
  languages: Language[];
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', rtl: true },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' }
];

const translations: Translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.compare': 'Compare',
    'nav.umrah': 'Umrah',
    'nav.packages': 'Travel Packages',
    'nav.tours': 'Tours',
    'nav.visa': 'Visa Services',
    'nav.hotels': 'Hotels',
    'nav.adventure': 'Adventure',
    'nav.corporate': 'Corporate Travel',
    
    // Hero Section
    'hero.title1': 'Compare. Discover.',
    'hero.title2': 'Book Smarter.',
    'hero.subtitle': "Pakistan's smartest AI travel comparison platform — Synergy Travels & Tour compares flights, hotels, packages, Umrah & visas so you book the best deal.",
    'hero.exploreBtn': 'Explore Destinations',
    'hero.whatsapp': 'WhatsApp',
    'hero.stats.destinations': 'Global Destinations',
    'hero.stats.travelers': 'Happy Travelers',
    'hero.stats.experience': 'Years Excellence',
    'hero.stats.rating': 'Customer Rating',
    
    // Services
    'services.title': 'Comprehensive Travel Solutions',
    'services.subtitle': 'From flight bookings to complete travel packages, we provide end-to-end solutions with personalized service and competitive prices.',
    'services.flight.title': 'Flight Booking',
    'services.flight.desc': 'Live flight search with real-time pricing from 500+ airlines worldwide.',
    'services.packages.title': 'Travel Packages',
    'services.packages.desc': 'Curated travel experiences tailored to your preferences and budget.',
    'services.visa.title': 'Visa Services',
    'services.visa.desc': 'Complete visa assistance with fast-track processing and documentation.',
    'services.hotels.title': 'Hotel Reservations',
    'services.hotels.desc': 'Premium accommodations and reliable transportation worldwide.',
    'services.adventure.title': 'Adventure Tours',
    'services.adventure.desc': 'Thrilling adventures for the bold with professional safety standards.',
    'services.honeymoon.title': 'Honeymoon Packages',
    'services.honeymoon.desc': 'Romantic getaways designed for unforgettable moments together.',
    'services.corporate.title': 'Corporate Travel',
    'services.corporate.desc': 'Professional travel solutions optimized for business efficiency.',
    'services.group.title': 'Group Tours',
    'services.group.desc': 'Organized group experiences for families, friends, and organizations.',
    
    // Travel Packages
    'packages.title': 'Handcrafted Travel Packages',
    'packages.subtitle': 'Discover our carefully curated travel packages including spiritual journeys, adventure tours, and luxury experiences designed to create unforgettable memories.',
    'packages.umrah.title': 'Umrah Packages - Makkah & Madina',
    'packages.umrah.subtitle': 'Perform your sacred pilgrimage with our comprehensive Umrah packages, featuring premium accommodations and expert guidance in the holy cities.',
    'packages.international.title': 'International Travel Packages',
    'packages.international.subtitle': 'Explore the world with our premium international travel packages designed for adventure, culture, and relaxation.',
    
    // Hotels
    'hotels.title': 'Global Hotels & Sacred Accommodations',
    'hotels.subtitle': 'Discover luxury accommodations worldwide including premium hotels in Makkah and Madinah for your spiritual journey, plus international destinations for every travel need.',
    'hotels.holy.title': 'Makkah & Madinah Premium Hotels',
    'hotels.holy.subtitle': 'Sacred accommodations with Haram and Masjid Nabawi proximity for your spiritual journey',
    
    // Visa Services
    'visa.title': 'Visa & Documentation Services',
    'visa.subtitle': 'Hassle-free visa processing and complete documentation assistance for all your travel needs. Our expert team ensures smooth and fast processing with guaranteed success rates.',
    'visa.special.title': 'Special Visa Services with Expert Consultation',
    'visa.special.subtitle': 'Premium visa services with personalized consultation for Makkah, Dubai, Baku, Thailand, and Malaysia',
    
    // Common
    'common.bookNow': 'Book Now',
    'common.getQuote': 'Get Quote',
    'common.learnMore': 'Learn More',
    'common.contactUs': 'Contact Us',
    'common.perPerson': 'per person',
    'common.perNight': 'per night',
    'common.days': 'Days',
    'common.nights': 'Nights',
    'common.rating': 'Rating',
    'common.reviews': 'Reviews',
    'common.duration': 'Duration',
    'common.location': 'Location',
    'common.price': 'Price',
    'common.features': 'Features',
    'common.highlights': 'Highlights',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.apply': 'Apply',
    'common.reset': 'Reset',
    'common.close': 'Close',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.currency': 'Currency',
    'common.language': 'Language'
  },
  
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.packages': 'باقات السفر',
    'nav.tours': 'الجولات',
    'nav.visa': 'خدمات التأشيرة',
    'nav.hotels': 'الفنادق',
    'nav.adventure': 'المغامرة',
    'nav.corporate': 'السفر المؤسسي',
    
    // Hero Section
    'hero.title1': 'اكتشف',
    'hero.title2': 'عجائب العالم',
    'hero.subtitle': 'انطلق في رحلات تغير الحياة واصنع ذكريات لا تُنسى مع سينرجي ترافل آند تورز - حيث تصبح كل وجهة قصة تستحق الحكي',
    'hero.exploreBtn': 'استكشف الوجهات',
    'hero.whatsapp': 'واتساب',
    'hero.stats.destinations': 'وجهة عالمية',
    'hero.stats.travelers': 'مسافر سعيد',
    'hero.stats.experience': 'سنة من التميز',
    'hero.stats.rating': 'تقييم العملاء',
    
    // Services
    'services.title': 'حلول السفر الشاملة',
    'services.subtitle': 'من حجز الطيران إلى باقات السفر الكاملة، نقدم حلولاً شاملة مع خدمة شخصية وأسعار تنافسية.',
    'services.flight.title': 'حجز الطيران',
    'services.flight.desc': 'البحث المباشر عن الرحلات مع الأسعار الفورية من أكثر من 500 شركة طيران عالمياً.',
    'services.packages.title': 'باقات السفر',
    'services.packages.desc': 'تجارب سفر منتقاة بعناية مصممة حسب تفضيلاتك وميزانيتك.',
    'services.visa.title': 'خدمات التأشيرة',
    'services.visa.desc': 'مساعدة كاملة في التأشيرة مع معالجة سريعة والوثائق.',
    'services.hotels.title': 'حجز الفنادق',
    'services.hotels.desc': 'إقامة فاخرة ونقل موثوق في جميع أنحاء العالم.',
    'services.adventure.title': 'جولات المغامرة',
    'services.adventure.desc': 'مغامرات مثيرة للجريئين مع معايير أمان مهنية.',
    'services.honeymoon.title': 'باقات شهر العسل',
    'services.honeymoon.desc': 'رحلات رومانسية مصممة للحظات لا تُنسى معاً.',
    'services.corporate.title': 'السفر المؤسسي',
    'services.corporate.desc': 'حلول سفر مهنية محسنة لكفاءة الأعمال.',
    'services.group.title': 'الجولات الجماعية',
    'services.group.desc': 'تجارب جماعية منظمة للعائلات والأصدقاء والمنظمات.',
    
    // Travel Packages
    'packages.title': 'باقات السفر المصنوعة يدوياً',
    'packages.subtitle': 'اكتشف باقات السفر المنتقاة بعناية بما في ذلك الرحلات الروحية وجولات المغامرة والتجارب الفاخرة المصممة لخلق ذكريات لا تُنسى.',
    'packages.umrah.title': 'باقات العمرة - مكة والمدينة',
    'packages.umrah.subtitle': 'أدِّ حجك المقدس مع باقات العمرة الشاملة، مع إقامة فاخرة وإرشاد خبير في المدن المقدسة.',
    'packages.international.title': 'باقات السفر الدولية',
    'packages.international.subtitle': 'استكشف العالم مع باقات السفر الدولية المتميزة المصممة للمغامرة والثقافة والاستجمام.',
    
    // Hotels
    'hotels.title': 'الفنادق العالمية والإقامة المقدسة',
    'hotels.subtitle': 'اكتشف الإقامة الفاخرة في جميع أنحاء العالم بما في ذلك الفنادق المتميزة في مكة والمدينة لرحلتك الروحية، بالإضافة إلى الوجهات الدولية لكل احتياج سفر.',
    'hotels.holy.title': 'فنادق مكة والمدينة المتميزة',
    'hotels.holy.subtitle': 'إقامة مقدسة بقرب من الحرم والمسجد النبوي لرحلتك الروحية',
    
    // Visa Services
    'visa.title': 'خدمات التأشيرة والوثائق',
    'visa.subtitle': 'معالجة التأشيرة بدون متاعب ومساعدة كاملة في الوثائق لجميع احتياجات السفر. فريقنا الخبير يضمن معالجة سلسة وسريعة مع معدلات نجاح مضمونة.',
    'visa.special.title': 'خدمات التأشيرة الخاصة مع الاستشارة الخبيرة',
    'visa.special.subtitle': 'خدمات تأشيرة متميزة مع استشارة شخصية لمكة ودبي وباكو وتايلاند وماليزيا',
    
    // Common
    'common.bookNow': 'احجز الآن',
    'common.getQuote': 'احصل على عرض سعر',
    'common.learnMore': 'اعرف المزيد',
    'common.contactUs': 'اتصل بنا',
    'common.perPerson': 'للشخص',
    'common.perNight': 'لليلة',
    'common.days': 'أيام',
    'common.nights': 'ليالي',
    'common.rating': 'التقييم',
    'common.reviews': 'المراجعات',
    'common.duration': 'المدة',
    'common.location': 'الموقع',
    'common.price': 'السعر',
    'common.features': 'المميزات',
    'common.highlights': 'النقاط المميزة',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.sort': 'ترتيب',
    'common.apply': 'تطبيق',
    'common.reset': 'إعادة تعيين',
    'common.close': 'إغلاق',
    'common.next': 'التالي',
    'common.previous': 'السابق',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.currency': 'العملة',
    'common.language': 'اللغة'
  },
  
  ur: {
    // Navigation
    'nav.home': 'ہوم',
    'nav.packages': 'ٹریول پیکجز',
    'nav.tours': 'ٹورز',
    'nav.visa': 'ویزا سروسز',
    'nav.hotels': 'ہوٹلز',
    'nav.adventure': 'ایڈونچر',
    'nav.corporate': 'کارپوریٹ ٹریول',
    
    // Hero Section
    'hero.title1': 'دریافت کریں',
    'hero.title2': 'دنیا کے عجائبات',
    'hero.subtitle': 'زندگی بدلنے والے سفر پر نکلیں اور سینرجی ٹریول اینڈ ٹورز کے ساتھ ناقابل فراموش یادیں بنائیں - جہاں ہر منزل ایک کہانی بن جاتی ہے',
    'hero.exploreBtn': 'منزلات دیکھیں',
    'hero.whatsapp': 'واٹس ایپ',
    'hero.stats.destinations': 'عالمی منزلات',
    'hero.stats.travelers': 'خوش مسافر',
    'hero.stats.experience': 'سال کا تجربہ',
    'hero.stats.rating': 'کسٹمر ریٹنگ',
    
    // Services
    'services.title': 'جامع ٹریول حل',
    'services.subtitle': 'فلائٹ بکنگ سے لے کر مکمل ٹریول پیکجز تک، ہم ذاتی خدمت اور مسابقتی قیمتوں کے ساتھ مکمل حل فراہم کرتے ہیں۔',
    'services.flight.title': 'فلائٹ بکنگ',
    'services.flight.desc': '500+ عالمی ایئر لائنز سے ریئل ٹائم قیمتوں کے ساتھ لائیو فلائٹ سرچ۔',
    'services.packages.title': 'ٹریول پیکجز',
    'services.packages.desc': 'آپ کی ترجیحات اور بجٹ کے مطابق بنائے گئے ٹریول تجربات۔',
    'services.visa.title': 'ویزا سروسز',
    'services.visa.desc': 'تیز رفتار پروسیسنگ اور دستاویزات کے ساتھ مکمل ویزا مدد۔',
    'services.hotels.title': 'ہوٹل ریزرویشن',
    'services.hotels.desc': 'دنیا بھر میں پریمیم رہائش اور قابل اعتماد ٹرانسپورٹ۔',
    'services.adventure.title': 'ایڈونچر ٹورز',
    'services.adventure.desc': 'پیشہ ورانہ حفاظتی معیارات کے ساتھ بہادروں کے لیے دلچسپ مہم جوئی۔',
    'services.honeymoon.title': 'ہنی مون پیکجز',
    'services.honeymoon.desc': 'ساتھ ناقابل فراموش لمحات کے لیے ڈیزائن کیے گئے رومانٹک سفر۔',
    'services.corporate.title': 'کارپوریٹ ٹریول',
    'services.corporate.desc': 'کاروباری کارکردگی کے لیے بہتر بنائے گئے پیشہ ورانہ ٹریول حل۔',
    'services.group.title': 'گروپ ٹورز',
    'services.group.desc': 'خاندانوں، دوستوں اور تنظیموں کے لیے منظم گروپ تجربات۔',
    
    // Travel Packages
    'packages.title': 'ہاتھ سے بنائے گئے ٹریول پیکجز',
    'packages.subtitle': 'ہمارے احتیاط سے منتخب کردہ ٹریول پیکجز دریافت کریں جن میں روحانی سفر، ایڈونچر ٹورز، اور لگژری تجربات شامل ہیں جو ناقابل فراموش یادیں بنانے کے لیے ڈیزائن کیے گئے ہیں۔',
    'packages.umrah.title': 'عمرہ پیکجز - مکہ اور مدینہ',
    'packages.umrah.subtitle': 'ہمارے جامع عمرہ پیکجز کے ساتھ اپنا مقدس حج ادا کریں، جس میں مقدس شہروں میں پریمیم رہائش اور ماہر رہنمائی شامل ہے۔',
    'packages.international.title': 'بین الاقوامی ٹریول پیکجز',
    'packages.international.subtitle': 'مہم جوئی، ثقافت، اور آرام کے لیے ڈیزائن کیے گئے ہمارے پریمیم بین الاقوامی ٹریول پیکجز کے ساتھ دنیا کو دریافت کریں۔',
    
    // Hotels
    'hotels.title': 'عالمی ہوٹلز اور مقدس رہائش',
    'hotels.subtitle': 'دنیا بھر میں لگژری رہائش دریافت کریں جن میں آپ کے روحانی سفر کے لیے مکہ اور مدینہ کے پریمیم ہوٹلز، اور ہر ٹریول ضرورت کے لیے بین الاقوامی منزلات شامل ہیں۔',
    'hotels.holy.title': 'مکہ اور مدینہ پریمیم ہوٹلز',
    'hotels.holy.subtitle': 'آپ کے روحانی سفر کے لیے حرم اور مسجد نبوی کی قربت میں مقدس رہائش',
    
    // Visa Services
    'visa.title': 'ویزا اور دستاویزی خدمات',
    'visa.subtitle': 'آپ کی تمام ٹریول ضروریات کے لیے بغیر پریشانی ویزا پروسیسنگ اور مکمل دستاویزی مدد۔ ہماری ماہر ٹیم ضمانت شدہ کامیابی کی شرح کے ساتھ ہموار اور تیز پروسیسنگ یقینی بناتی ہے۔',
    'visa.special.title': 'ماہر مشاورت کے ساتھ خصوصی ویزا خدمات',
    'visa.special.subtitle': 'مکہ، دبئی، باکو، تھائی لینڈ، اور ملائیشیا کے لیے ذاتی مشاورت کے ساتھ پریمیم ویزا خدمات',
    
    // Common
    'common.bookNow': 'ابھی بک کریں',
    'common.getQuote': 'قیمت حاصل کریں',
    'common.learnMore': 'مزید جانیں',
    'common.contactUs': 'ہم سے رابطہ کریں',
    'common.perPerson': 'فی شخص',
    'common.perNight': 'فی رات',
    'common.days': 'دن',
    'common.nights': 'راتیں',
    'common.rating': 'ریٹنگ',
    'common.reviews': 'جائزے',
    'common.duration': 'مدت',
    'common.location': 'مقام',
    'common.price': 'قیمت',
    'common.features': 'خصوصیات',
    'common.highlights': 'نمایاں باتیں',
    'common.search': 'تلاش',
    'common.filter': 'فلٹر',
    'common.sort': 'ترتیب',
    'common.apply': 'لاگو کریں',
    'common.reset': 'ری سیٹ',
    'common.close': 'بند کریں',
    'common.next': 'اگلا',
    'common.previous': 'پچھلا',
    'common.loading': 'لوڈ ہو رہا ہے...',
    'common.error': 'خرابی',
    'common.success': 'کامیابی',
    'common.currency': 'کرنسی',
    'common.language': 'زبان'
  },
  
  pt: {
    // Navigation
    'nav.home': 'Início',
    'nav.packages': 'Pacotes de Viagem',
    'nav.tours': 'Tours',
    'nav.visa': 'Serviços de Visto',
    'nav.hotels': 'Hotéis',
    'nav.adventure': 'Aventura',
    'nav.corporate': 'Viagem Corporativa',
    
    // Hero Section
    'hero.title1': 'Descubra as',
    'hero.title2': 'Maravilhas do Mundo',
    'hero.subtitle': 'Embarque em jornadas que mudam a vida e crie memórias inesquecíveis com a Synergy Travels & Tour - onde cada destino se torna uma história que vale a pena contar',
    'hero.exploreBtn': 'Explorar Destinos',
    'hero.whatsapp': 'WhatsApp',
    'hero.stats.destinations': 'Destinos Globais',
    'hero.stats.travelers': 'Viajantes Felizes',
    'hero.stats.experience': 'Anos de Excelência',
    'hero.stats.rating': 'Avaliação do Cliente',
    
    // Services
    'services.title': 'Soluções Abrangentes de Viagem',
    'services.subtitle': 'Desde reservas de voos até pacotes completos de viagem, fornecemos soluções completas com serviço personalizado e preços competitivos.',
    'services.flight.title': 'Reserva de Voos',
    'services.flight.desc': 'Busca ao vivo de voos com preços em tempo real de mais de 500 companhias aéreas mundiais.',
    'services.packages.title': 'Pacotes de Viagem',
    'services.packages.desc': 'Experiências de viagem selecionadas sob medida para suas preferências e orçamento.',
    'services.visa.title': 'Serviços de Visto',
    'services.visa.desc': 'Assistência completa de visto com processamento rápido e documentação.',
    'services.hotels.title': 'Reservas de Hotel',
    'services.hotels.desc': 'Acomodações premium e transporte confiável em todo o mundo.',
    'services.adventure.title': 'Tours de Aventura',
    'services.adventure.desc': 'Aventuras emocionantes para os corajosos com padrões de segurança profissionais.',
    'services.honeymoon.title': 'Pacotes de Lua de Mel',
    'services.honeymoon.desc': 'Escapadas românticas projetadas para momentos inesquecíveis juntos.',
    'services.corporate.title': 'Viagem Corporativa',
    'services.corporate.desc': 'Soluções de viagem profissionais otimizadas para eficiência empresarial.',
    'services.group.title': 'Tours em Grupo',
    'services.group.desc': 'Experiências organizadas em grupo para famílias, amigos e organizações.',
    
    // Travel Packages
    'packages.title': 'Pacotes de Viagem Artesanais',
    'packages.subtitle': 'Descubra nossos pacotes de viagem cuidadosamente selecionados, incluindo jornadas espirituais, tours de aventura e experiências de luxo projetadas para criar memórias inesquecíveis.',
    'packages.umrah.title': 'Pacotes Umrah - Meca e Medina',
    'packages.umrah.subtitle': 'Realize sua peregrinação sagrada com nossos pacotes Umrah abrangentes, com acomodações premium e orientação especializada nas cidades sagradas.',
    'packages.international.title': 'Pacotes de Viagem Internacional',
    'packages.international.subtitle': 'Explore o mundo com nossos pacotes de viagem internacional premium projetados para aventura, cultura e relaxamento.',
    
    // Hotels
    'hotels.title': 'Hotéis Globais e Acomodações Sagradas',
    'hotels.subtitle': 'Descubra acomodações de luxo em todo o mundo, incluindo hotéis premium em Meca e Medina para sua jornada espiritual, além de destinos internacionais para todas as necessidades de viagem.',
    'hotels.holy.title': 'Hotéis Premium de Meca e Medina',
    'hotels.holy.subtitle': 'Acomodações sagradas com proximidade ao Haram e Masjid Nabawi para sua jornada espiritual',
    
    // Visa Services
    'visa.title': 'Serviços de Visto e Documentação',
    'visa.subtitle': 'Processamento de visto sem complicações e assistência completa de documentação para todas as suas necessidades de viagem. Nossa equipe especializada garante processamento suave e rápido com taxas de sucesso garantidas.',
    'visa.special.title': 'Serviços Especiais de Visto com Consultoria Especializada',
    'visa.special.subtitle': 'Serviços de visto premium com consultoria personalizada para Meca, Dubai, Baku, Tailândia e Malásia',
    
    // Common
    'common.bookNow': 'Reservar Agora',
    'common.getQuote': 'Obter Cotação',
    'common.learnMore': 'Saiba Mais',
    'common.contactUs': 'Contate-nos',
    'common.perPerson': 'por pessoa',
    'common.perNight': 'por noite',
    'common.days': 'Dias',
    'common.nights': 'Noites',
    'common.rating': 'Avaliação',
    'common.reviews': 'Avaliações',
    'common.duration': 'Duração',
    'common.location': 'Localização',
    'common.price': 'Preço',
    'common.features': 'Recursos',
    'common.highlights': 'Destaques',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.sort': 'Ordenar',
    'common.apply': 'Aplicar',
    'common.reset': 'Redefinir',
    'common.close': 'Fechar',
    'common.next': 'Próximo',
    'common.previous': 'Anterior',
    'common.loading': 'Carregando...',
    'common.error': 'Erro',
    'common.success': 'Sucesso',
    'common.currency': 'Moeda',
    'common.language': 'Idioma'
  },
  
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.packages': 'Forfaits Voyage',
    'nav.tours': 'Tours',
    'nav.visa': 'Services Visa',
    'nav.hotels': 'Hôtels',
    'nav.adventure': 'Aventure',
    'nav.corporate': 'Voyage d\'Affaires',
    
    // Hero Section
    'hero.title1': 'Découvrez les',
    'hero.title2': 'Merveilles du Monde',
    'hero.subtitle': 'Embarquez dans des voyages qui changent la vie et créez des souvenirs inoubliables avec Synergy Travels & Tour - où chaque destination devient une histoire qui vaut la peine d\'être racontée',
    'hero.exploreBtn': 'Explorer les Destinations',
    'hero.whatsapp': 'WhatsApp',
    'hero.stats.destinations': 'Destinations Mondiales',
    'hero.stats.travelers': 'Voyageurs Heureux',
    'hero.stats.experience': 'Années d\'Excellence',
    'hero.stats.rating': 'Évaluation Client',
    
    // Services
    'services.title': 'Solutions de Voyage Complètes',
    'services.subtitle': 'Des réservations de vols aux forfaits de voyage complets, nous fournissons des solutions de bout en bout avec un service personnalisé et des prix compétitifs.',
    'services.flight.title': 'Réservation de Vols',
    'services.flight.desc': 'Recherche de vols en direct avec tarification en temps réel de plus de 500 compagnies aériennes mondiales.',
    'services.packages.title': 'Forfaits Voyage',
    'services.packages.desc': 'Expériences de voyage sélectionnées adaptées à vos préférences et budget.',
    'services.visa.title': 'Services Visa',
    'services.visa.desc': 'Assistance visa complète avec traitement rapide et documentation.',
    'services.hotels.title': 'Réservations d\'Hôtel',
    'services.hotels.desc': 'Hébergements premium et transport fiable dans le monde entier.',
    'services.adventure.title': 'Tours d\'Aventure',
    'services.adventure.desc': 'Aventures palpitantes pour les audacieux avec des normes de sécurité professionnelles.',
    'services.honeymoon.title': 'Forfaits Lune de Miel',
    'services.honeymoon.desc': 'Escapades romantiques conçues pour des moments inoubliables ensemble.',
    'services.corporate.title': 'Voyage d\'Affaires',
    'services.corporate.desc': 'Solutions de voyage professionnelles optimisées pour l\'efficacité commerciale.',
    'services.group.title': 'Tours de Groupe',
    'services.group.desc': 'Expériences de groupe organisées pour les familles, amis et organisations.',
    
    // Travel Packages
    'packages.title': 'Forfaits de Voyage Artisanaux',
    'packages.subtitle': 'Découvrez nos forfaits de voyage soigneusement sélectionnés, y compris des voyages spirituels, des tours d\'aventure et des expériences de luxe conçues pour créer des souvenirs inoubliables.',
    'packages.umrah.title': 'Forfaits Omra - La Mecque et Médine',
    'packages.umrah.subtitle': 'Accomplissez votre pèlerinage sacré avec nos forfaits Omra complets, avec des hébergements premium et des conseils d\'experts dans les villes saintes.',
    'packages.international.title': 'Forfaits de Voyage International',
    'packages.international.subtitle': 'Explorez le monde avec nos forfaits de voyage international premium conçus pour l\'aventure, la culture et la détente.',
    
    // Hotels
    'hotels.title': 'Hôtels Mondiaux et Hébergements Sacrés',
    'hotels.subtitle': 'Découvrez des hébergements de luxe dans le monde entier, y compris des hôtels premium à La Mecque et Médine pour votre voyage spirituel, plus des destinations internationales pour tous les besoins de voyage.',
    'hotels.holy.title': 'Hôtels Premium de La Mecque et Médine',
    'hotels.holy.subtitle': 'Hébergements sacrés avec proximité du Haram et Masjid Nabawi pour votre voyage spirituel',
    
    // Visa Services
    'visa.title': 'Services de Visa et Documentation',
    'visa.subtitle': 'Traitement de visa sans tracas et assistance complète de documentation pour tous vos besoins de voyage. Notre équipe d\'experts assure un traitement fluide et rapide avec des taux de réussite garantis.',
    'visa.special.title': 'Services de Visa Spéciaux avec Consultation d\'Expert',
    'visa.special.subtitle': 'Services de visa premium avec consultation personnalisée pour La Mecque, Dubaï, Bakou, Thaïlande et Malaisie',
    
    // Common
    'common.bookNow': 'Réserver Maintenant',
    'common.getQuote': 'Obtenir un Devis',
    'common.learnMore': 'En Savoir Plus',
    'common.contactUs': 'Contactez-nous',
    'common.perPerson': 'par personne',
    'common.perNight': 'par nuit',
    'common.days': 'Jours',
    'common.nights': 'Nuits',
    'common.rating': 'Évaluation',
    'common.reviews': 'Avis',
    'common.duration': 'Durée',
    'common.location': 'Emplacement',
    'common.price': 'Prix',
    'common.features': 'Caractéristiques',
    'common.highlights': 'Points Forts',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.sort': 'Trier',
    'common.apply': 'Appliquer',
    'common.reset': 'Réinitialiser',
    'common.close': 'Fermer',
    'common.next': 'Suivant',
    'common.previous': 'Précédent',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.currency': 'Devise',
    'common.language': 'Langue'
  },
  
  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.packages': 'Reisepakete',
    'nav.tours': 'Touren',
    'nav.visa': 'Visa-Services',
    'nav.hotels': 'Hotels',
    'nav.adventure': 'Abenteuer',
    'nav.corporate': 'Geschäftsreisen',
    
    // Hero Section
    'hero.title1': 'Entdecken Sie die',
    'hero.title2': 'Wunder der Welt',
    'hero.subtitle': 'Begeben Sie sich auf lebensverändernde Reisen und schaffen Sie unvergessliche Erinnerungen mit Synergy Travels & Tour - wo jedes Ziel zu einer Geschichte wird, die es wert ist, erzählt zu werden',
    'hero.exploreBtn': 'Ziele Erkunden',
    'hero.whatsapp': 'WhatsApp',
    'hero.stats.destinations': 'Globale Ziele',
    'hero.stats.travelers': 'Glückliche Reisende',
    'hero.stats.experience': 'Jahre Exzellenz',
    'hero.stats.rating': 'Kundenbewertung',
    
    // Services
    'services.title': 'Umfassende Reiselösungen',
    'services.subtitle': 'Von Flugbuchungen bis hin zu kompletten Reisepaketen bieten wir End-to-End-Lösungen mit persönlichem Service und wettbewerbsfähigen Preisen.',
    'services.flight.title': 'Flugbuchung',
    'services.flight.desc': 'Live-Flugsuche mit Echtzeitpreisen von über 500 weltweiten Fluggesellschaften.',
    'services.packages.title': 'Reisepakete',
    'services.packages.desc': 'Kuratierte Reiseerlebnisse, die auf Ihre Vorlieben und Ihr Budget zugeschnitten sind.',
    'services.visa.title': 'Visa-Services',
    'services.visa.desc': 'Komplette Visa-Unterstützung mit schneller Bearbeitung und Dokumentation.',
    'services.hotels.title': 'Hotelreservierungen',
    'services.hotels.desc': 'Premium-Unterkünfte und zuverlässiger Transport weltweit.',
    'services.adventure.title': 'Abenteuertouren',
    'services.adventure.desc': 'Aufregende Abenteuer für Mutige mit professionellen Sicherheitsstandards.',
    'services.honeymoon.title': 'Flitterwochen-Pakete',
    'services.honeymoon.desc': 'Romantische Ausflüge für unvergessliche gemeinsame Momente.',
    'services.corporate.title': 'Geschäftsreisen',
    'services.corporate.desc': 'Professionelle Reiselösungen für Geschäftseffizienz optimiert.',
    'services.group.title': 'Gruppentouren',
    'services.group.desc': 'Organisierte Gruppenerlebnisse für Familien, Freunde und Organisationen.',
    
    // Travel Packages
    'packages.title': 'Handgefertigte Reisepakete',
    'packages.subtitle': 'Entdecken Sie unsere sorgfältig kuratierten Reisepakete, einschließlich spiritueller Reisen, Abenteuertouren und Luxuserlebnisse, die darauf ausgelegt sind, unvergessliche Erinnerungen zu schaffen.',
    'packages.umrah.title': 'Umrah-Pakete - Mekka und Medina',
    'packages.umrah.subtitle': 'Führen Sie Ihre heilige Pilgerfahrt mit unseren umfassenden Umrah-Paketen durch, mit Premium-Unterkünften und Expertenführung in den heiligen Städten.',
    'packages.international.title': 'Internationale Reisepakete',
    'packages.international.subtitle': 'Erkunden Sie die Welt mit unseren Premium-Reisepaketen für Abenteuer, Kultur und Entspannung.',
    
    // Hotels
    'hotels.title': 'Globale Hotels und Heilige Unterkünfte',
    'hotels.subtitle': 'Entdecken Sie Luxusunterkünfte weltweit, einschließlich Premium-Hotels in Mekka und Medina für Ihre spirituelle Reise, plus internationale Ziele für jeden Reisebedarf.',
    'hotels.holy.title': 'Premium-Hotels in Mekka und Medina',
    'hotels.holy.subtitle': 'Heilige Unterkünfte in der Nähe von Haram und Masjid Nabawi für Ihre spirituelle Reise',
    
    // Visa Services
    'visa.title': 'Visa- und Dokumentationsservices',
    'visa.subtitle': 'Problemlose Visa-Bearbeitung und umfassende Dokumentationsunterstützung für alle Ihre Reisebedürfnisse. Unser Expertenteam gewährleistet reibungslose und schnelle Bearbeitung mit garantierten Erfolgsraten.',
    'visa.special.title': 'Spezielle Visa-Services mit Expertenberatung',
    'visa.special.subtitle': 'Premium-Visa-Services mit persönlicher Beratung für Mekka, Dubai, Baku, Thailand und Malaysia',
    
    // Common
    'common.bookNow': 'Jetzt Buchen',
    'common.getQuote': 'Angebot Erhalten',
    'common.learnMore': 'Mehr Erfahren',
    'common.contactUs': 'Kontaktieren Sie Uns',
    'common.perPerson': 'pro Person',
    'common.perNight': 'pro Nacht',
    'common.days': 'Tage',
    'common.nights': 'Nächte',
    'common.rating': 'Bewertung',
    'common.reviews': 'Bewertungen',
    'common.duration': 'Dauer',
    'common.location': 'Standort',
    'common.price': 'Preis',
    'common.features': 'Eigenschaften',
    'common.highlights': 'Highlights',
    'common.search': 'Suchen',
    'common.filter': 'Filtern',
    'common.sort': 'Sortieren',
    'common.apply': 'Anwenden',
    'common.reset': 'Zurücksetzen',
    'common.close': 'Schließen',
    'common.next': 'Weiter',
    'common.previous': 'Zurück',
    'common.loading': 'Laden...',
    'common.error': 'Fehler',
    'common.success': 'Erfolg',
    'common.currency': 'Währung',
    'common.language': 'Sprache'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);

  const setLanguage = (language: Language) => {
    setSelectedLanguage(language);
    // Update document direction for RTL languages
    document.documentElement.dir = language.rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language.code;
  };

  const t = (key: string): string => {
    return translations[selectedLanguage.code]?.[key] || translations['en'][key] || key;
  };

  const isRTL = selectedLanguage.rtl || false;

  return (
    <LanguageContext.Provider value={{
      selectedLanguage,
      languages,
      setLanguage,
      t,
      isRTL
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;