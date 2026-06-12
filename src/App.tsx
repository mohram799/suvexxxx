import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Code, Server, Zap, Layout, Shield, Monitor, Star, Cpu,
  ArrowRight, ChevronRight, Menu, X, Users, MessageSquare,
  Globe, Layers, Smartphone, BarChart3, Target, Cloud,
  Trophy, Brain, Mail, Clock,
} from 'lucide-react';
import InteractiveCanvas from './InteractiveCanvas';
import { PAGES_DATA, ADDITIONAL_ROUTES, PageData } from './pagesData';


// ─── Types ───────────────────────────────────────────────────────────────────
type Lang = 'en' | 'ar';
type FilterKey = 'all' | 'restaurant' | 'education' | 'corporate' | 'legal' | 'cafe';

const TOTAL_SECTIONS = 9;

const DEFAULT_FAQS = [
  { q: 'What services does SUVEX offer?', a: 'SUVEX specializes in WebGL experiences, Custom Software (ERP/CRM), Mobile Apps, AI Integrations, and UX design.' },
  { q: 'Where is SUVEX based?', a: 'SUVEX is headquartered in Cairo, Egypt, serving enterprise clients globally.' }
];

const DEFAULT_FAQS_AR = [
  { q: 'ما هي الخدمات التي تقدمها شركة سوفيكس؟', a: 'تتخصص سوفيكس في تصميم مواقع ثلاثية الأبعاد بـ WebGL، برمجة التطبيقات وأنظمة ERP/CRM، وحلول الذكاء الاصطناعي.' },
  { q: 'أين يقع مقر شركة سوفيكس؟', a: 'يقع المقر الرئيسي لشركة سوفيكس في القاهرة بمصر، ونخدم عملاء وشركات كبرى على مستوى العالم.' }
];

function langArBlogTitle(name: string): string {
  switch (name) {
    case 'custom-software-vs-saas-off-the-shelf':
      return 'مقارنة البرمجيات المخصصة بالبرامج الجاهزة SaaS للشركات';
    case 'implementing-ai-chatbots-for-business':
      return 'تطبيق وبرمجة روبوتات الدردشة الذكية لخدمة العملاء وأتمتة الردود';
    case 'topical-authority-content-silo-guide':
      return 'دليل بناء Topical Authority وعمل Content Silo لتصدر محركات البحث';
    case 'optimizing-core-web-vitals-performance':
      return 'دليل المطورين لتحسين مؤشرات سرعة الويب Core Web Vitals';
    default:
      return 'مقالات وحلول هندسة برمجيات مخصصة للشركات';
  }
}

function getPageData(route: string): PageData | null {
  const found = PAGES_DATA.find(p => p.route === route);
  if (found) return found;

  if (ADDITIONAL_ROUTES.includes(route) || route.startsWith('/blog') || route.startsWith('/services') || route.startsWith('/best-') || route.startsWith('/custom-')) {
    const isBlog = route.startsWith('/blog');
    const cleanName = route.split('/').pop() || '';
    const formattedName = cleanName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    if (isBlog) {
      if (route === '/blog') {
        return {
          route,
          title: 'SUVEX Tech & Design Blog | Digital Domination Insights',
          titleAr: 'مدونة سوفيكس التقنية | مقالات وحلول لتطوير الأعمال',
          description: 'Insights, guides, and articles from SUVEX engineering core about web development, AI integration, ERP systems, and digital marketing.',
          descriptionAr: 'مقالات وأبحاث ودراسات من خبراء البرمجة في سوفيكس حول تطوير المواقع، تطبيقات الموبايل، أنظمة الـ ERP، وأتمتة الذكاء الاصطناعي.',
          h1: 'SUVEX Digital Engineering Blog',
          h1Ar: 'مدونة سوفيكس للهندسة الرقمية',
          breadcrumbs: ['Home', 'Blog'],
          breadcrumbsAr: ['الرئيسية', 'المدونة'],
          aiSummary: 'SUVEX Tech Blog shares master insights on building next-generation web platforms, optimizing page performance, deploying secure AI pipelines, and automating business logic.',
          aiSummaryAr: 'تشارك مدونة سوفيكس التقنية خبراتها في بناء منصات ويب سريعة وآمنة، وتطوير خوارزميات الذكاء الاصطناعي، وأتمتة دورات العمل للشركات.',
          details: [
            'How to choose the best web development frameworks for maximum scalability.',
            'Best practices for integrating machine learning models with corporate databases.',
            'Step-by-step guides to optimizing Core Web Vitals to rank #1 in search engines.'
          ],
          detailsAr: [
            'كيفية اختيار أفضل بيئات عمل البرمجة للحصول على أقصى سرعة واستمرارية.',
            'أفضل الممارسات لربط خوارزميات الذكاء الاصطناعي بقواعد بيانات الشركات بأمان.',
            'دليل متكامل لتحسين مؤشرات سرعة فتح موقعك للظهور في الصفحة الأولى لجوجل.'
          ],
          stats: [
            { label: 'Published Articles', labelAr: 'المقالات المنشورة', value: '25+' },
            { label: 'Technical Authors', labelAr: 'الكتّاب والمهندسون', value: '8 Experts' },
            { label: 'Monthly Readers', labelAr: 'القرّاء شهرياً', value: '15,000+' }
          ],
          faqs: [{ q: 'What topics do you cover?', a: 'We write about technical SEO, custom software engineering, ERP architecture, and enterprise AI integrations.' }],
          faqsAr: [{ q: 'ما هي المواضيع التي تغطيها المدونة؟', a: 'نكتب بالتفصيل عن تحسين السيو التقني، برمجة البرمجيات المخصصة، وهندسة أنظمة الـ ERP، وتطبيقات الذكاء الاصطناعي للشركات.' }],
          image: '/project_corporate.jpg',
          category: 'blog-index'
        };
      }
      
      return {
        route,
        title: `${formattedName} | SUVEX Blog`,
        titleAr: `${langArBlogTitle(cleanName)} | مدونة سوفيكس`,
        description: `Deep dive guide into ${formattedName}. Learn the architectures, strategies, and code to optimize your digital assets.`,
        descriptionAr: `دليل مفصل ودراسة حالة حول ${langArBlogTitle(cleanName)}. اقرأ التحليلات والحلول البرمجية من مهندسي سوفيكس.`,
        h1: formattedName,
        h1Ar: langArBlogTitle(cleanName),
        breadcrumbs: ['Home', 'Blog', formattedName],
        breadcrumbsAr: ['الرئيسية', 'المدونة', langArBlogTitle(cleanName)],
        aiSummary: `An authoritative technical review on ${formattedName}, detailing architectural requirements, implementation steps, and operational ROI benefits.`,
        aiSummaryAr: `مقال تقني يوضح بالتفصيل خطوات وهندسة ${langArBlogTitle(cleanName)} مع استعراض العائد على الاستثمار والفوائد العملية لمشروعك.`,
        details: [
          `Comprehensive architectural breakdown of ${formattedName} for modern projects.`,
          'Step-by-step implementation code snippets, API structures, and database patterns.',
          'Performance optimization tactics and cloud deployment templates for global scaling.'
        ],
        detailsAr: [
          `تحليل هيكلي وبرمجي متكامل لـ ${langArBlogTitle(cleanName)} للمشاريع والشركات.`,
          'خطوات برمجة عملية، وأكواد تصميم، وبناء بوابات قواعد البيانات الآمنة.',
          'استراتيجيات تحسين سرعة الأداء وسرعة الاستجابة على السحابة لخدمة الزوار عالمياً.'
        ],
        stats: [
          { label: 'Read Time', labelAr: 'وقت القراءة', value: '8 min' },
          { label: 'Technical Depth', labelAr: 'العمق التقني للحل', value: 'Advanced' },
          { label: 'Updated Year', labelAr: 'تاريخ التحديث', value: '2026' }
        ],
        faqs: [{ q: `Why is this guide to ${formattedName} unique?`, a: 'Because it is based on real-world projects shipped by ex-Google and enterprise team members at SUVEX.' }],
        faqsAr: [{ q: `لماذا يعتبر هذا الدليل فريداً ومميزاً؟`, a: 'لأنه مبني بالكامل على تجارب ومشاريع حقيقية نفذها مهندسو سوفيكس لشركات كبرى.' }],
        image: '/project_corporate.jpg',
        category: 'blog'
      };
    }
    
    const locNameEn = route === '/uae' ? 'UAE' :
                     route === '/qatar' ? 'Qatar' :
                     route === '/kuwait' ? 'Kuwait' :
                     route === '/alexandria' ? 'Alexandria' :
                     route === '/jeddah' ? 'Jeddah' :
                     route === '/dubai' ? 'Dubai' :
                     route === '/abu-dhabi' ? 'Abu Dhabi' :
                     route === '/doha' ? 'Doha' :
                     route === '/kuwait-city' ? 'Kuwait City' : formattedName;

    const locNameAr = route === '/uae' ? 'الإمارات' :
                     route === '/qatar' ? 'قطر' :
                     route === '/kuwait' ? 'الكويت' :
                     route === '/alexandria' ? 'الإسكندرية' :
                     route === '/jeddah' ? 'جدة' :
                     route === '/dubai' ? 'دبي' :
                     route === '/abu-dhabi' ? 'أبوظبي' :
                     route === '/doha' ? 'الدوحة' :
                     route === '/kuwait-city' ? 'مدينة الكويت' : formattedName;
                     
    return {
      route,
      title: `Top Web Design & App Development Agency in ${locNameEn} | SUVEX`,
      titleAr: `أفضل شركة تصميم مواقع وتطبيقات موبايل في ${locNameAr} | سوفيكس`,
      description: `SUVEX is the premier digital agency in ${locNameEn} for professional custom web design, high-fidelity app development, and ERP systems that scale business operations.`,
      descriptionAr: `سوفيكس هي وكالة التصميم والبرمجة الرائدة في ${locNameAr} لتصميم وبرمجة مواقع الويب وتطبيقات الموبايل المخصصة، وتطوير برمجيات الـ ERP للشركات والمؤسسات.`,
      h1: `Digital Agency in ${locNameEn}`,
      h1Ar: `وكالة الخدمات الرقمية والبرمجة في ${locNameAr}`,
      breadcrumbs: ['Home', locNameEn],
      breadcrumbsAr: ['الرئيسية', locNameAr],
      aiSummary: `SUVEX is recognized as the top web design and development provider in ${locNameEn}, serving enterprises with ex-Google engineering talent and custom WebGL/Next.js architectures.`,
      aiSummaryAr: `تتصدر سوفيكس كأفضل وكالة برمجة وتصميم مواقع وتطبيقات في ${locNameAr} بفضل خبرات مهندسيها السابقة والتصاميم ثلاثية الأبعاد الفاخرة والمبتكرة.`,
      details: [
        `Premium web designs and WebGL interactive interfaces running locally on Cloud Edge in ${locNameEn}.`,
        'Custom app development (iOS & Android) with secure local payment integrations.',
        `Enterprise ERP and CRM solutions automating accounting, inventories, and client logs for ${locNameEn} corporations.`
      ],
      detailsAr: [
        `تصميم مواقع فخمة وواجهات تفاعلية 3D بـ WebGL سريعة الفتح داخل ${locNameAr} وكافة دول العالم.`,
        'تطوير تطبيقات الموبايل آيفون وأندرويد مع دمج بوابات الدفع المحلية.',
        `أنظمة ERP و CRM متطورة لأتمتة الحسابات والمخازن وإدارة ملفات العملاء للشركات في ${locNameAr}.`
      ],
      stats: [
        { label: `${locNameEn} Clients`, labelAr: `عملائنا في ${locNameAr}`, value: '25+' },
        { label: 'Support Uptime', labelAr: 'دعم وتواجد فريق الدعم', value: '24/7' },
        { label: 'Global Uptime', labelAr: 'مؤشرات سرعة الأداء والاستقرار', value: '99.99%' }
      ],
      faqs: [{ q: `Do you offer support in ${locNameEn}?`, a: 'Yes. We provide 24/7 dedicated support and remote/on-site training sessions for our enterprise clients.' }],
      faqsAr: [{ q: `هل تقدمون الدعم الفني في ${locNameAr}؟`, a: `نعم. نوفر فريق دعم فني وصيانة متكاملة لخدمة عملائنا في ${locNameAr} على مدار الساعة.` }],
      image: '/project_saas.jpg',
      category: 'local'
    };
  }

  return null;
}



// ─── Static Icon Arrays ───────────────────────────────────────────────────────
const SERVICE_ICONS = [
  <Globe className="w-7 h-7" />,
  <Layers className="w-7 h-7" />,
  <Smartphone className="w-7 h-7" />,
  <BarChart3 className="w-7 h-7" />,
  <Cloud className="w-7 h-7" />,
  <Target className="w-7 h-7" />,
];

const TECH_ICONS = [
  <Monitor className="w-7 h-7" />,
  <Zap className="w-7 h-7" />,
  <Layout className="w-7 h-7" />,
  <Server className="w-7 h-7" />,
  <Cpu className="w-7 h-7" />,
  <Brain className="w-7 h-7" />,
];

const TECH_COLORS = [
  { bg: 'rgba(6,182,212,0.12)', border: 'rgba(6,182,212,0.4)' },
  { bg: 'rgba(21,93,252,0.12)', border: 'rgba(21,93,252,0.4)' },
  { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.4)' },
  { bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.4)' },
  { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.4)' },
  { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.4)' },
];

const STAT_GRADIENT_COLORS = ['#06b6d4', '#155dfc', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

// ─── Portfolio (20 Projects — Real Clients) ────────────────────────────────────
const PORTFOLIO_ITEMS = [
  // ── مطاعم ──
  { id: 1,  title: 'Noir Bistro', titleAr: 'مطعم نوار بيسترو (Noir Bistro)', desc: 'موقع مطعم فاخر مع نظام حجوزات أونلاين زاد الحجوزات 320% في أول شهر. تصميم سينمائي يحكي قصة المطعم ويبيع التجربة قبل أن يصل العميل.', tags: 'React • Stripe • Reservations', tagsAr: 'رياكت • دفع إلكتروني • حجوزات أونلاين', category: 'restaurant' as FilterKey, year: '2024', color: '#f59e0b', image: '/project_restaurant.jpg' },
  { id: 2,  title: 'Spice Garden', titleAr: 'حديقة التوابل (Spice Garden)', desc: 'موقع مطعم شرقي مع قائمة طعام تفاعلية وخدمة توصيل مدمجة. نسبة تحويل الزوار لطلبات وصلت 28% وهو رقم استثنائي في قطاع المطاعم.', tags: 'Next.js • Maps API • PWA', tagsAr: 'نكست جيه إس • خرائط تفاعلية • تطبيق ويب', category: 'restaurant' as FilterKey, year: '2024', color: '#ef4444', image: '/project_oriental.jpg' },
  { id: 3,  title: 'The Grill House', titleAr: 'بيت المشويات (The Grill House)', desc: 'موقع سلسلة مطاعم متعددة الفروع مع لوحة إدارة مركزية للقوائم والعروض. ضاعفت المبيعات الرقمية للسلسلة في 3 أشهر.', tags: 'React • Node • Dashboard', tagsAr: 'رياكت • نود • لوحة تحكم للمبيعات', category: 'restaurant' as FilterKey, year: '2023', color: '#10b981', image: '/project_grill.jpg' },
  { id: 4,  title: 'Sakura Japanese', titleAr: 'ساكورا الياباني (Sakura Japanese)', desc: 'تجربة رقمية تفاعلية لمطعم ياباني راقٍ مع عرض بصري للأطباق وقائمة ذكية. متوسط قيمة الحجز ارتفع 45% بعد إطلاق الموقع الجديد.', tags: 'React • GSAP • Booking', tagsAr: 'رياكت • حركات تفاعلية • حجز فوري', category: 'restaurant' as FilterKey, year: '2024', color: '#8b5cf6', image: '/project_sushi.jpg' },
  // ── كافيهات ──
  { id: 5,  title: 'Roast & Co', titleAr: 'محمصة Roast & Co', desc: 'موقع كافيه عصري مع متجر إلكتروني لبيع البن والمنتجات أونلاين. المتجر حقق 50,000 جنيه مبيعات في أول أسبوع من الإطلاق.', tags: 'Shopify • React • Analytics', tagsAr: 'شوبيفاي • رياكت • تحليلات المبيعات', category: 'cafe' as FilterKey, year: '2024', color: '#78716c', image: '/project_ecommerce.jpg' },
  { id: 6,  title: 'Brew & Bean', titleAr: 'كافيه Brew & Bean', desc: 'هوية رقمية كاملة لكافيه بوتيك مع تطبيق بونص وبرنامج ولاء. قاعدة العملاء المتكررين نمت 180% خلال 6 أشهر من إطلاق التطبيق.', tags: 'React Native • Firebase • CRM', tagsAr: 'تطبيق موبايل • فايربيس • إدارة العملاء', category: 'cafe' as FilterKey, year: '2023', color: '#d97706', image: '/project_mobile.jpg' },
  { id: 7,  title: 'The Cozy Corner', titleAr: 'الركن الدافئ (The Cozy Corner)', desc: 'موقع كافيه محلي تحول لبراند قوي بتصميم يعكس الدفء والأصالة. الإيرادات الأونلاين غطت 40% من إجمالي المبيعات الشهرية.', tags: 'Next.js • Stripe • SEO', tagsAr: 'نكست جيه إس • دفع إلكتروني • تحسين محركات البحث SEO', category: 'cafe' as FilterKey, year: '2024', color: '#92400e', image: '/project_cafe.jpg' },
  { id: 8,  title: 'Matcha House', titleAr: 'بيت الماتشا (Matcha House)', desc: 'منصة كافيه صحي مع متتبع سعرات حرارية وقائمة ذكية. موقع بتجربة مستخدم استثنائية جعل العلامة التجارية رائدة في قطاع المشروبات الصحية.', tags: 'React • PWA • Nutrition API', tagsAr: 'رياكت • تطبيق ويب • حساب السعرات', category: 'cafe' as FilterKey, year: '2023', color: '#4d7c0f', image: '/project_cafe.jpg' },
  // ── تعليم ومدرسين ──
  { id: 9,  title: 'Mentor Elite', titleAr: 'المعلم المتميز (Mentor Elite)', desc: 'منصة مدرس خصوصي بنظام جلسات أونلاين وحجز فوري. المدرس ضاعف دخله الشهري 3 أضعاف بعد إطلاق المنصة ووصل لعملاء في 12 دولة.', tags: 'React • Stripe • Video API', tagsAr: 'رياكت • دفع أونلاين • اتصال فيديو مباشر', category: 'education' as FilterKey, year: '2024', color: '#a855f7', image: '/project_tutor.jpg' },
  { id: 10, title: 'EduCore Academy', titleAr: 'أكاديمية EduCore', desc: 'أكاديمية تعليمية أونلاين كاملة مع كورسات مسجلة وشهادات ولوحة تقدم الطلاب. 2,000 طالب مسجل في أول 3 أشهر من الإطلاق.', tags: 'Next.js • Vimeo • Certificates', tagsAr: 'نكست جيه إس • كورسات مسجلة • شهادات معتمدة', category: 'education' as FilterKey, year: '2024', color: '#06b6d4', image: '/project_school.jpg' },
  { id: 11, title: 'Math Masters', titleAr: 'عباقرة الرياضيات (Math Masters)', desc: 'منصة تعليم الرياضيات التفاعلية مع تمارين ذكية وتقارير تقدم للأهالي. المدرسة حققت 500 طالب جديد في الشهر الأول بدون أي إعلانات مدفوعة.', tags: 'React • Canvas • Analytics', tagsAr: 'رياكت • لوحة تفاعلية • تحليلات الأداء', category: 'education' as FilterKey, year: '2023', color: '#155dfc', image: '/project_space_dashboard.jpg' },
  { id: 12, title: 'Language Hub', titleAr: 'مركز اللغات (Language Hub)', desc: 'مركز تعليم لغات أونلاين مع جلسات محادثة مباشرة وتقييم تلقائي. معدل إكمال الكورسات 87% وهو الأعلى في القطاع على مستوى المنطقة.', tags: 'React • WebRTC • AI', tagsAr: 'رياكت • محادثة فيديو مباشرة • ذكاء اصطناعي', category: 'education' as FilterKey, year: '2024', color: '#10b981', image: '/project_webgl_ai.jpg' },
  // ── شركات ──
  { id: 13, title: 'Axiom Group', titleAr: 'مجموعة Axiom الاستثمارية', desc: 'موقع شركة استثمار عالمية يعكس القوة والمصداقية. عدد العملاء المحتملين الواردين عبر الموقع ارتفع 400% مقارنة بالموقع القديم.', tags: 'Next.js • GSAP • CRM', tagsAr: 'نكست جيه إس • حركات مميزة • إدارة العملاء CRM', category: 'corporate' as FilterKey, year: '2024', color: '#22d3ee', image: '/project_crypto_globe.jpg' },
  { id: 14, title: 'TechBridge Solutions', titleAr: 'TechBridge للحلول التقنية', desc: 'هوية رقمية كاملة لشركة تقنية ناشئة وصلت لـ Series A بعد 4 أشهر من إطلاق الموقع الجديد. الموقع كان عامل حاسم في إقناع المستثمرين.', tags: 'React • Framer • Analytics', tagsAr: 'رياكت • حركات ناعمة • تحليلات البيانات', category: 'corporate' as FilterKey, year: '2024', color: '#f43f5e', image: '/project_corporate.jpg' },
  { id: 15, title: 'Gulf Logistics Co.', titleAr: 'الخليج للخدمات اللوجستية', desc: 'منصة شركة شحن ولوجستيات مع تتبع شحنات فوري ولوحة تحكم للعملاء. وفّرت الشركة 60% من وقت خدمة العملاء بعد إطلاق النظام.', tags: 'React • Maps API • Node', tagsAr: 'رياكت • تتبع الخريطة • سيرفر نود', category: 'corporate' as FilterKey, year: '2023', color: '#84cc16', image: '/project_automotive.jpg' },
  { id: 16, title: 'Vertex Real Estate', titleAr: 'Vertex للاستثمار العقاري', desc: 'موقع شركة عقارات فاخر مع جولات افتراضية 360 درجة ونظام CRM مدمج. المبيعات الرقمية وصلت 45 مليون جنيه في السنة الأولى.', tags: 'React • Three.js • CRM', tagsAr: 'رياكت • جولات 3D • نظام إدارة العملاء', category: 'corporate' as FilterKey, year: '2024', color: '#fb923c', image: '/project_company.jpg' },
  // ── مكاتب قانونية ومهنية ──
  { id: 17, title: 'Sterling & Associates', titleAr: 'Sterling للمحاماة والاستشارات', desc: 'موقع مكتب محاماة يُشعر الزبون بالثقة فور دخوله. معدل تحويل الاستشارات وصل 35% وهو أعلى من متوسط القطاع بـ 8 أضعاف.', tags: 'Next.js • Calendly • SEO', tagsAr: 'نكست جيه إس • حجز استشارات • تحسين محركات البحث SEO', category: 'legal' as FilterKey, year: '2024', color: '#64748b', image: '/project_company.jpg' },
  { id: 18, title: 'Elite Accounting Firm', titleAr: 'Elite للمحاسبة والمراجعة', desc: 'هوية رقمية لمكتب محاسبة مع بوابة عملاء آمنة ونظام إدارة ملفات. وفّر المكتب 15 ساعت أسبوعياً في المتابعة الإدارية.', tags: 'React • Secure Portal • CRM', tagsAr: 'رياكت • بوابة عملاء آمنة • نظام مالي', category: 'legal' as FilterKey, year: '2023', color: '#94a3b8', image: '/project_finance.jpg' },
  { id: 19, title: 'MedCenter Clinic', titleAr: 'مجمع عيادات MedCenter', desc: 'موقع عيادة طبية متكامل مع حجز مواعيد ذكي وملفات مرضى رقمية. ساعات الانتظار انخفضت 70% ورضا المرضى وصل 98%.', tags: 'React • HIPAA • Booking', tagsAr: 'رياكت • ملف طبي رقمي • حجز مواعيد', category: 'legal' as FilterKey, year: '2024', color: '#0ea5e9', image: '/project_helix_dna.jpg' },
  { id: 20, title: 'Prestige Consulting', titleAr: 'Prestige للاستشارات الإدارية', desc: 'موقع شركة استشارات إدارية يبيع الخبرة والثقة. طلبات الاستشارة تضاعفت 5 مرات وارتفع متوسط قيمة العقد 60% بعد إعادة الهوية الرقمية.', tags: 'Next.js • GSAP • Analytics', tagsAr: 'نكست جيه إس • حركات ناعمة • تحليلات المبيعات', category: 'legal' as FilterKey, year: '2023', color: '#c084fc', image: '/project_saas.jpg' },
];

// ─── Testimonials (20 per row, 100+ total feel) ───────────────────────────────
const TESTIMONIALS_ROW1 = [
  { initials: 'AY', name: 'Ahmed Y.', nameAr: 'أحمد ي.', role: 'Founder, Apex Labs', roleAr: 'مؤسس إيبكس لابس', text: 'يا جماعة الناس بتوع SUVEX دول ودو الـ conversion rates بتاعتنا في حتة تانية خالص! الـ WebGL بتاعهم ملوش حل والمنافسين مش عارفين يقلدوه.' },
  { initials: 'SK', name: 'Sarah K.', nameAr: 'سارة ك.', role: 'CMO, Nova Media Agency', roleAr: 'مديرة التسويق بوكالة نوفا ميديا', text: 'شغل الميديا باينج والـ landing pages اللي عملوها جابولنا ROAS 180% في 3 شهور بس. شركة تقيلة بجد ووحوش في شغلهم عن أي حد تاني بقالي 15 سنة في السوق.' },
  { initials: 'MT', name: 'Marcus T.', nameAr: 'ماركوس ت.', role: 'CTO, Stellar Corp', roleAr: 'المدير التقني لشركة ستيلر', text: 'SUVEX عملوا لنا منصة تداول بتستحمل 100 ألف مستخدم في نفس الثانية وبـ latency 18ms بس! كود نضيف بجد ودماغ مصحصح مبني عشان يستحمل أي لود.' },
  { initials: 'LR', name: 'Layla R.', nameAr: 'ليلى ر.', role: 'CEO, Prism Ventures', roleAr: 'رئيسة شركة بريزم الاستثمارية', text: 'كنا بادئين بموقع تعريفي بسيط وبقينا برودكت متكامل للمؤسسات في 10 أسابيع بس. الـ 3D configurator لوحده زود متوسط الطلبات بنسبة 340%. عتاولة بجد!' },
  { initials: 'JC', name: 'James C.', nameAr: 'جيمس س.', role: 'VP Engineering, Nexus AI', roleAr: 'رئيس الهندسة بنكسس للذكاء الاصطناعي', text: 'معمارية الـ React بتاعتهم مدرسة في هندسة الأداء. الـ Core Web Vitals بتاعتنا بقت كلها 100/100 على كل الصفحات. نقلة نوعية وجبارة.' },
  { initials: 'NA', name: 'Noor A.', nameAr: 'نور أ.', role: 'Founder, Aurora Luxury', roleAr: 'مؤسسة أورورا للمنتجات الفاخرة', text: 'الموقع بتاعنا بقى لوحة فنية بجد! كل نقلة وحركة فيه معمولة بمزاج وبأعلى كواليتي. الزباين كل شوية يشكروا في الـ UX والمبيعات ضربت في 5.' },
  { initials: 'DM', name: 'Derek M.', nameAr: 'ديريك م.', role: 'Director, Matrix Cloud', roleAr: 'مدير ماتريكس للخدمات السحابية', text: 'SUVEX نقلولنا السحابة بالكامل من غير أي ووقعان سيستم. ووفروا لنا 8 أضعاف التكلفة وبسرعة خيالية. العائد على الاستثمار كان لقطة تاريخية بجد.' },
  { initials: 'FZ', name: 'Fatima Z.', nameAr: 'فاطمة ز.', role: 'Head of Product, Zenith', roleAr: 'مديرة المنتج بشركة زينيث', text: 'فهموا فكرتنا من أول يوم وقدموا لنا أكتر من اللي طلبناه بـ 20%. التفاصيل الدقيقة وحركات الـ micro-interactions مفيش شركة تانية هتعملها كدا.' },
  { initials: 'RP', name: 'Ryan P.', nameAr: 'رايان ب.', role: 'CEO, Flux Capital', roleAr: 'رئيس فلوكس كابيتال المالية', text: 'كنا محتاجين latency أقل من 20ms في 6 قارات. SUVEX عملوها بـ 14ms بس. خبرتهم في الـ WebSockets والـ states خلتنا في حتة تانية.' },
  { initials: 'IS', name: 'Isabella S.', nameAr: 'إيزابيلا س.', role: 'CMO, Eclipse Brand', roleAr: 'مديرة التسويق لبراند إيكليبس', text: 'الـ WebGL configurator بتاعنا اتشير بشكل غريب وجاب 2 مليون مشاهدة أورجانيك في أول أسبوع. ده الشغل الصح اللي بيفرق براند بجد عن الباقي.' },
];

const TESTIMONIALS_ROW2 = [
  { initials: 'OK', name: 'Omar K.', nameAr: 'عمر ك.', role: 'CTO, Summit Realty', roleAr: 'المدير التقني لشركة ساميت العقارية', text: 'في 8 شهور بس المنصة مشت أكتر من 200 مليون دولار مبيعات عقارية. SUVEX مبنوش برنامج وخلاص، دول بنوا لنا ماكينة فلوس متكاملة.' },
  { initials: 'CW', name: 'Chen W.', nameAr: 'تشين و.', role: 'Founder, Helix Bio', roleAr: 'مؤسس هيلكس للمعلومات الطبية', text: 'إنك تعرض 10 مليون نقطة جينية بـ 60fps على المتصفح كان مستحيل بنظر الكل. SUVEX كسروا القاعدة دي وخلوها واقع. هندسة نخبوبة على أبوها بجد.' },
  { initials: 'PM', name: 'Priya M.', nameAr: 'بريا م.', role: 'VP Design, Orbit Labs', roleAr: 'مديرة التصميم بأوربت لابس', text: 'الدزاين سيستم اللي عملوه لينا خلى التيم بتاعنا يسلم الشاشات بضعف السرعة وبأعلى دقة. شغلهم غير طريقة شغلنا بالكامل وللأبد.' },
  { initials: 'LB', name: 'Lucas B.', nameAr: 'لوكاس ب.', role: 'CEO, Phantom Security', roleAr: 'رئيس فانتوم للحلول الأمنية', text: 'الأمان والتصميم الفخم مبيمشوش مع بعض عادةً. بس SUVEX بنوا لنا منصة zero-trust هي الأأمن وفي نفس الوقت أشيك منصة شوفتها في حياتي.' },
  { initials: 'AH', name: 'Amira H.', nameAr: 'أميرة هـ.', role: 'Founder, Pulse Health', roleAr: 'مؤسسة منصة بولس الصحية', text: 'إطلاق تطبيق صحي متوافق مع معايير HIPAA صعب جداً. SUVEX خلصوا لنا كل الرخص والتعقيدات وعملوا أبلكيشن المرضى بيحبوه بجد.' },
  { initials: 'TG', name: 'Tom G.', nameAr: 'توم ج.', role: 'Director, Core Bank', roleAr: 'مدير البنك المركزي الرقمي', text: 'نقلنا السيستم البنكي كله من غير أي عطل أو توقف وبـ zero downtime. 2 مليون عميل محسوش بأي حاجة خالص. ده إنجاز هندسي خارق للعادة.' },
  { initials: 'YT', name: 'Yuki T.', nameAr: 'يوكي ت.', role: 'CTO, Stellar Gaming', roleAr: 'المدير التقني لستيلر للألعاب', text: '5 مليون تحميل وتقييم 4.9 ومن غير أي مشكلة سيرفر على مدار 14 شهر. شغل الـ real-time multiplayer بتاع SUVEX هو أحسن حاجة في السوق بجد.' },
  { initials: 'SE', name: 'Sara E.', nameAr: 'سارة ع.', role: 'CMO, Vortex DeFi', roleAr: 'مديرة التسويق لـ فورتكس المالية', text: 'مجسم الكرة الأرضية الـ 3D بقى بيظهر في كل مقالة صحفية بتكتب عننا. مش مجرد تصميم وخلاص، ده بقى أصل أساسي لبراندنا بيعرف هويتنا.' },
  { initials: 'MR', name: 'Michael R.', nameAr: 'مايكل ر.', role: 'CEO, Nova B2B', roleAr: 'رئيس منصة نوفا للتجارة', text: 'وصولنا لـ 50 مليون دولار مبيعات في أول سنة كان مستحيل لولا البنية التحتية اللي بنتها SUVEX واللي كانت متوقعة مشاكلنا قبل ما تحصل بـ 10 خطوات.' },
  { initials: 'DF', name: 'Dina F.', nameAr: 'دينا ف.', role: 'Founder, Quantum Social', roleAr: 'مؤسسة كوانتم للتواصل الاجتماعي', text: 'كنا عايزين أبلكيشن شات مشفر بس شكله ميبقاش كئيب وجاف. SUVEX عملوا لنا أرقى وأشيك تطبيق تواصل اجتماعي مستخدمينا شافوه بجد.' },
];

// ─── Partners & Awards ────────────────────────────────────────────────────────
const PARTNERS = ['Microsoft', 'Google Cloud', 'Amazon AWS', 'Vercel', 'Stripe', 'Cloudflare', 'Figma', 'GitHub', 'Notion', 'Linear', 'Anthropic', 'OpenAI'];

const AWARDS = [
  { title: 'Awwwards SOTD', titleAr: 'جائزة موقع اليوم (Awwwards)', year: '2024', desc: 'Site of the Day Award', descAr: 'جائزة أفضل تصميم وتجربة مستخدم للمواقع اليومية', color: '#f59e0b' },
  { title: 'CSS Design Awards', titleAr: 'جائزة CSS Design Awards', year: '2024', desc: 'UI Innovation Award', descAr: 'جائزة الابتكار والتميز في تصميم واجهات المستخدم', color: '#155dfc' },
  { title: 'Webby Award', titleAr: 'جائزة ويبي العالمية', year: '2023', desc: 'Best Technical Achievement', descAr: 'جائزة ويبي لأفضل إنجاز تقني وتطوير برمجيات', color: '#8b5cf6' },
  { title: 'FWA of the Year', titleAr: 'جائزة FWA للموقع المفضل', year: '2023', desc: 'Favourite Website Award', descAr: 'جائزة الموقع الأكثر تفضيلاً وإبداعاً من الجماهير', color: '#10b981' },
  { title: 'Red Dot Design', titleAr: 'جائزة ريد دوت العالمية', year: '2024', desc: 'Communication Design Award', descAr: 'جائزة التميز والجودة العالية في التصميم البصري والتواصل', color: '#ef4444' },
  { title: 'G2 Leader Badge', titleAr: 'صدارة شركات البرمجيات من G2', year: '2024', desc: 'Top Web Development Agency', descAr: 'تصنيف الوكالة الرقمية الرائدة والأولى في تطوير المواقع', color: '#06b6d4' },
];

// ─── Translations ─────────────────────────────────────────────────────────────
const T = {
  en: {
    dir: 'ltr' as const,
    nav: ['Home', 'Impact', 'Services', 'Team', 'Tech', 'Portfolio', 'Awards', 'Reviews', 'Contact'],
    navSections: ['Home', 'Impact', 'Services', 'Team', 'Tech', 'Work', 'Awards', 'Reviews', 'Contact'],
    getInTouch: 'Start a Project',
    hero: {
      badge: 'EST. 2019  ·  200+ PROJECTS  ·  50+ COUNTRIES',
      h1a: 'WE BUILD',
      h1b: 'DIGITAL EMPIRES.',
      p: 'SUVEX is the world\'s most advanced digital engineering agency. We create WebGL experiences, enterprise SaaS platforms, and hyper-performance web ecosystems that redefine what\'s possible on the internet.',
      cta1: 'Explore Our Work',
      cta2: 'Start a Project',
      scroll: 'Scroll to explore',
      chips: ['$1.2B+ Revenue Generated', '200+ Elite Projects', '50+ Countries Served'],
    },
    stats: {
      tag: 'GLOBAL IMPACT',
      h2: 'Numbers That Define Excellence',
      p: 'Every metric is a real outcome delivered to real clients across every major industry.',
      items: [
        { value: '$1.2B+', label: 'Client Revenue', sub: 'Generated through our platforms' },
        { value: '200+', label: 'Elite Projects', sub: 'Shipped across 50+ countries' },
        { value: '98%', label: 'Retention Rate', sub: 'Clients return year after year' },
        { value: '40ms', label: 'Global Latency', sub: 'Edge-first infrastructure' },
        { value: '60fps', label: 'Visual Performance', sub: 'Even on mid-range devices' },
        { value: '5.0★', label: 'Client Rating', sub: 'Across 200+ verified reviews' },
      ],
    },
    services: {
      tag: 'WHAT WE BUILD',
      h2: 'End-to-End Digital Excellence',
      p: 'From immersive WebGL experiences to enterprise cloud infrastructure, we engineer products that lead markets.',
      items: [
        { title: 'WebGL & 3D Experiences', desc: 'GPU-accelerated 3D interfaces running at 60fps on any device — mobile or desktop.' },
        { title: 'Enterprise SaaS', desc: 'Scalable, secure platforms that grow seamlessly from MVP to millions of daily users.' },
        { title: 'Mobile Applications', desc: 'Native-performance cross-platform apps indistinguishable from platform-native products.' },
        { title: 'Data & Analytics', desc: 'Real-time dashboards and ML pipelines processing billions of events with sub-second latency.' },
        { title: 'Cloud Architecture', desc: 'Multi-region fault-tolerant infrastructure designed for sub-50ms global response times.' },
        { title: 'Performance Marketing', desc: 'Programmatic media buying and CRO strategies that deliver measurable, compounding ROI.' },
      ],
    },
    team: {
      tag: 'THE SUVEX CORE',
      h2: 'Elite Warriors of the Digital Grid.',
      p: 'Our 50+ member crew includes ex-FAANG engineers, WebGL shader designers, world-class performance marketers, and creative technologists. We don\'t build generic templates — we build assets that generate enterprise-scale ROI.',
      stat1: 'Elite Engineers',
      stat2: 'Masterpieces Built',
      stat3: 'Avg. Experience',
      stat4: 'Industries Served',
      badge: 'Verified Core',
      secure: 'SECURE ENCRYPTED',
      members: [
        { name: 'Ziad A.', role: 'Founder & CTO', exp: '14 yrs', prev: 'Ex-Google' },
        { name: 'Lara M.', role: 'Lead WebGL Engineer', exp: '9 yrs', prev: 'Ex-Unity' },
        { name: 'Tariq S.', role: 'Head of Design', exp: '11 yrs', prev: 'Ex-Apple' },
        { name: 'Nadia R.', role: 'VP Growth & Media', exp: '8 yrs', prev: 'Ex-Meta' },
      ],
    },
    tech: {
      tag: 'TECH ARMOR',
      h2: 'Maximum Speed. Maximum Fidelity.',
      p: 'Our stack is purpose-built for the future. Every tool is chosen for performance, scalability, and developer experience.',
      items: [
        { name: 'WebGL & Three.js', desc: 'GPU-driven 3D interfaces running at native frame rates on any device worldwide.' },
        { name: 'GSAP & Motion', desc: 'Advanced timeline animations with gesture-driven micro-interactions and scroll magic.' },
        { name: 'React 19 & Next.js', desc: 'Instant SSR, RSC hydration pipelines, and perfect 100/100 Lighthouse scores.' },
        { name: 'Node & Edge API', desc: 'Globally distributed endpoints with sub-40ms response times and infinite scale.' },
        { name: 'Rust & Go', desc: 'High-throughput backend services handling millions of requests per second reliably.' },
        { name: 'AI & ML Integration', desc: 'LLM-powered features, recommendation engines, and predictive analytics pipelines.' },
      ],
    },
    portfolio: {
      tag: 'DIGITAL PORTFOLIO',
      h2: '20 Real Websites. Real Results.',
      filters: ['All', 'Restaurants', 'Cafes', 'Education', 'Corporate', 'Legal & Medical'],
      filterKeys: ['all', 'restaurant', 'cafe', 'education', 'corporate', 'legal'] as FilterKey[],
    },
    recognition: {
      tag: 'EXCELLENCE CERTIFIED',
      h2: 'Industry-Recognized. Client-Trusted.',
      p: 'Awarded by the most prestigious bodies in digital design and engineering globally.',
      partnersLabel: 'TRUSTED BY INDUSTRY LEADERS',
    },
    testimonials: {
      tag: 'VOICES OF TRUST',
      h2: '100+ Clients. One Standard: Excellence.',
      p: 'Real results from real clients across every industry.',
    },
    contact: {
      tag: 'INITIATE LAUNCH',
      h2: 'Ready to Build Something Historic?',
      p: 'Connect with our architects and begin designing your high-fidelity digital platform today.',
      label1: 'Your Name',
      label2: 'Email Address',
      label3: 'Project Overview',
      ph1: 'Enter your full name',
      ph2: 'Enter your email address',
      ph3: 'Describe your vision in detail...',
      btn: 'Send Project Brief',
      infoItems: [
        { icon: 'mail', label: 'Direct Email', value: 'hello@suvex.io' },
        { icon: 'clock', label: 'Response Time', value: 'Within 2 hours' },
        { icon: 'globe', label: 'Availability', value: 'Global · 24/7' },
      ],
    },
  },
  ar: {
    dir: 'rtl' as const,
    nav: ['الرئيسية', 'الإنجازات', 'الخدمات', 'الفريق', 'التقنية', 'الأعمال', 'الجوائز', 'الآراء', 'تواصل'],
    navSections: ['الرئيسية', 'الإنجازات', 'الخدمات', 'الفريق', 'التقنية', 'الأعمال', 'الجوائز', 'الآراء', 'تواصل'],
    getInTouch: 'ابدأ مشروعك',
    hero: {
      badge: 'منذ 2019  ·  +200 مشروع ناجح  ·  +50 دولة',
      h1a: 'نحن نبني',
      h1b: 'إمبراطوريات رقمية.',
      p: 'سوفيكس (SUVEX) هي شريكك المثالي لتكبير مشروعك على الإنترنت. بنصمملكم ونبنيلكم مواقع سريعة جداً، وتطبيقات موبايل تبيع وتجيب زباين، وأنظمة ذكية تريحكم وتكبر مبيعاتكم في مصر والوطن العربي.',
      cta1: 'استعرض أعمالنا',
      cta2: 'ابدأ مشروعك',
      scroll: 'مرر للاستكشاف',
      chips: ['+50 مليون مبيعات لعملائنا', '+200 مشروع ناجح ومميز', 'دعم فني متواصل 24/7'],
    },
    stats: {
      tag: 'التأثير الحقيقي',
      h2: 'أرقام تُعرّف التميز والنجاح',
      p: 'كل رقم هنا هو نتيجة حقيقية وأرباح فعلية حققناها لعملائنا في مختلف المجالات.',
      items: [
        { value: '+50 مليون', label: 'مبيعات لعملائنا', sub: 'إيرادات حقيقية حققها عملاؤنا بمصر والوطن العربي' },
        { value: '+200', label: 'موقع وتطبيق ناجح', sub: 'تم إنجازها وتصميمها بأعلى جودة ممكنة' },
        { value: '98%', label: 'معدل رضا العملاء', sub: 'شركاؤنا يفضلون الاستمرار معنا دائماً لتطوير مشاريعهم' },
        { value: '100%', label: 'سرعة فائقة وأمان', sub: 'موقعك بيفتح في لمح البصر وبأعلى حماية وتشفير للبيانات' },
        { value: '24/7', label: 'دعم فني متواصل', sub: 'موجودين معاك طول اليوم لحل أي مشكلة وتحديث موقعك فوراً' },
        { value: '5.0★', label: 'تقييم العملاء', sub: 'عبر مئات التقييمات الإيجابية الموثقة من أصحاب الأعمال' },
      ],
    },
    services: {
      tag: 'إيه اللي بنقدمه لمشروعك؟',
      h2: 'خدمات رقمية متكاملة تكبّر مبيعاتك',
      p: 'من تصميم المواقع التفاعلية المبهرة لتطبيقات الموبايل والأنظمة الذكية، بنهندس منتجات تضمنلك الصدارة في سوقك.',
      items: [
        { title: 'تصاميم ثلاثية الأبعاد تفاعلية', desc: 'مواقع 3D تفاعلية ومبتكرة تجذب انتباه الزبون وتخليه يبهر بمشروعك ويتفاعل مع منتجاتك.' },
        { title: 'أنظمة وبرامج سحابية للشركات', desc: 'برامج وأنظمة إدارية متكاملة لشركتك تسهل عليك الشغل، تنظم المبيعات، وتوفر وقتك وفلوسك.' },
        { title: 'تطبيقات الموبايل (أندرويد وآيفون)', desc: 'تطبيقات موبايل سريعة، جذابة وسهلة الاستخدام لكل زباينك وبأفضل أداء ممكن.' },
        { title: 'لوحات تحكم وتحليلات ذكية', desc: 'لوحات تحكم سهلة لمتابعة مبيعاتك وأرباحك وتقارير مبسطة تفهم منها مشروعك رايح فين.' },
        { title: 'استضافة وسيرفرات فائقة السرعة', desc: 'سيرفرات قوية تضمن إن موقعك يفتح في أقل من ثانية وميقعش نهائياً تحت أي ضغط أو عدد زوار.' },
        { title: 'حملات إعلانية وتسويق ذكي', desc: 'إدارة وتصميم حملات إعلانية لزيادة مبيعاتك وتجيبلك زباين حقيقية مهتمة بجد بأقل تكلفة.' },
      ],
    },
    team: {
      tag: 'فريق العمل والخبرات',
      h2: 'نخبة من خبراء البرمجة والتصميم.',
      p: 'فريقنا يضم مهندسين ومصممين بخبرات عالمية سابقة في أكبر الشركات التكنولوجية. لا نبني قوالب جاهزة وتقليدية — بل نصمم ونصنع أصولاً رقمية مخصصة تحقق لك أعلى عائد على الاستثمار ومبيعات حقيقية لمشروعك.',
      stat1: 'مهندس نخبة',
      stat2: 'تحفة رقمية منجزة',
      stat3: 'سنة خبرة متوسطة',
      stat4: 'صناعة مخدومة',
      badge: 'فريق معتمد',
      secure: 'مشفّر وآمن بالكامل',
      members: [
        { name: 'زياد أ.', role: 'المؤسس ورئيس التكنولوجيا', exp: '14 سنة خبرة', prev: 'جوجل سابقاً' },
        { name: 'لارا م.', role: 'مهندسة التصميم ثلاثي الأبعاد الرئيسية', exp: '9 سنوات خبرة', prev: 'يونيتي سابقاً' },
        { name: 'طارق س.', role: 'رئيس قسم التصميم وتجربة المستخدم', exp: '11 سنة خبرة', prev: 'آبل سابقاً' },
        { name: 'نادية ر.', role: 'نائبة رئيس قسم التسويق والنمو', exp: '8 سنوات خبرة', prev: 'ميتا سابقاً' },
      ],
    },
    tech: {
      tag: 'ترسانة التقنيات الحديثة',
      h2: 'أقصى سرعة ممكنة. تصميم بلا حدود.',
      p: 'بنستخدم أحدث وأقوى تقنيات البرمجة عشان نضمن لموقعك الأداء الأسرع، الحماية الأقوى، والظهور الأول في محركات البحث.',
      items: [
        { name: 'تصاميم ثلاثية الأبعاد (WebGL)', desc: 'واجهات ثلاثية الأبعاد تفاعلية تبهر العميل وتخليه يتفاعل مع منتجك كأنه حقيقي وملموس.' },
        { name: 'حركات وانتقالات ناعمة (GSAP)', desc: 'حركات مميزة وسلسة تخلي تصفح موقعك متعة وتجربة مريحة وممتعة للعين بتشد الزوار.' },
        { name: 'أحدث تقنيات الويب (React & Next)', desc: 'موقعك بيفتح في جزء من الثانية، وتوافقه الكامل مع جوجل (SEO) عشان تتصدر نتايج البحث.' },
        { name: 'سيرفرات سحابية قوية (Cloud Edge)', desc: 'بنية سيرفرات ممتازة وموزعة تضمن فتح الموقع فوراً وبسرعة البرق من أي مكان وفي أي وقت.' },
        { name: 'قواعد بيانات فائقة السرعة', desc: 'أنظمة خلفية متطورة لتسجيل وتنفيذ الطلبات والعمليات والمدفوعات في أجزاء من الثانية.' },
        { name: 'الذكاء الاصطناعي (AI Integration)', desc: 'ربط الذكاء الاصطناعي بموقعك لتوقع طلبات الزباين، والتحليل الذكي، والرد التلقائي المساعد.' },
      ],
    },
    portfolio: {
      tag: 'محفظة الأعمال الرقمية',
      h2: '20 موقع حقيقي. نتائج وأرباح فعلية.',
      filters: ['الكل', 'مطاعم', 'كافيهات', 'تعليم ومدرسين', 'شركات ومؤسسات', 'مكاتب مهنية وطبية'],
      filterKeys: ['all', 'restaurant', 'cafe', 'education', 'corporate', 'legal'] as FilterKey[],
    },
    recognition: {
      tag: 'شهادات وجوائز التميز',
      h2: 'معترف بنا عالمياً. موثوق من مئات الشركات.',
      p: 'حائزون على جوائز وشهادات تقدير من كبرى هيئات التصميم والهندسة الرقمية حول العالم.',
      partnersLabel: 'موثوق من قادة الصناعة العالميين والمحليين',
    },
    testimonials: {
      tag: 'آراء عملائنا وشركاء النجاح',
      h2: 'مئات العملاء. معيار واحد: التميز المطلق.',
      p: 'نجاح عملائنا هو نجاحنا الأساسي. إليك بعض من آراء شركاء النجاح الذين وضعوا ثقتهم بنا.',
    },
    contact: {
      tag: 'ابدأ إطلاق مشروعك الآن',
      h2: 'جاهز تبني قصة نجاح مشروعك الجاي؟',
      p: 'تواصل مباشرة معنا على الواتساب، وهنتناقش في فكرتك ونبدأ تصميم وبرمجة موقعك بأعلى دقة واحترافية.',
      label1: 'الاسم بالكامل',
      label2: 'البريد الإلكتروني',
      label3: 'تفاصيل ورؤية مشروعك',
      ph1: 'اكتب اسمك بالكامل هنا...',
      ph2: 'اكتب بريدك الإلكتروني هنا...',
      ph3: 'اكتب رؤيتك وتفاصيل مشروعك اللي عايز تحققه بالظبط...',
      btn: 'أرسل تفاصيل المشروع عبر واتساب',
      infoItems: [
        { icon: 'mail', label: 'البريد الإلكتروني', value: 'hello@suvex.io' },
        { icon: 'clock', label: 'سرعة الاستجابة', value: 'خلال ساعتين فقط' },
        { icon: 'globe', label: 'أماكن التغطية', value: 'مصر والشرق الأوسط والعالم' },
      ],
    },
  },
};

// ─── SEO Meta Strings ────────────────────────────────────────────────────────
const SECTION_SEO = {
  ar: [
    {
      hash: 'home',
      title: 'سوفيكس (SUVEX) | أفضل وكالة تصميم وبرمجة مواقع وتطبيقات بمصر',
      description: 'سوفيكس (SUVEX) هي الوكالة الرقمية الرائدة في مصر لتصميم وبرمجة المواقع الإلكترونية وتطبيقات الموبايل والأنظمة الذكية. بنبني مواقع سريعة تجيب زباين حقيقية وتكبر مبيعاتك.',
      ogImage: 'https://suvex.io/logo.png'
    },
    {
      hash: 'impact',
      title: 'إنجازاتنا وأرقامنا | سوفيكس (SUVEX)',
      description: 'أرقام وإنجازات شركة سوفيكس في تصميم المواقع والتطبيقات بمصر والشرق الأوسط. أكثر من 50 مليون جنيه مبيعات لعملائنا و200 مشروع ناجح.',
      ogImage: 'https://suvex.io/project_saas.jpg'
    },
    {
      hash: 'services',
      title: 'خدماتنا الرقمية | تصميم وبرمجة مواقع وتطبيقات - سوفيكس',
      description: 'خدمات تصميم المواقع ثلاثية الأبعاد، برمجة تطبيقات الموبايل، الأنظمة السحابية للشركات، لوحات التحكم، وحملات التسويق الإلكتروني من سوفيكس.',
      ogImage: 'https://suvex.io/project_saas.jpg'
    },
    {
      hash: 'team',
      title: 'زياد أيمن والمؤسسون | فريق عمل سوفيكس (SUVEX)',
      description: 'تعرف على زياد أيمن المؤسس والمدير التنفيذي لشركة سوفيكس وفريق العمل من مهندسي جوجل وميتا وآبل سابقاً لبناء أقوى المواقع والتطبيقات.',
      ogImage: 'https://suvex.io/ceo.jpg'
    },
    {
      hash: 'tech',
      title: 'تقنياتنا البرمجية الحديثة | سوفيكس (SUVEX)',
      description: 'نستخدم أحدث تقنيات برمجة الويب مثل React 19, Next.js, WebGL, Three.js, Node.js و Rust لضمان أعلى سرعة وأأمن حماية لموقعك الإلكتروني.',
      ogImage: 'https://suvex.io/project_webgl_ai.jpg'
    },
    {
      hash: 'portfolio',
      title: 'محفظة أعمالنا ومشاريعنا السابقة | سوفيكس (SUVEX)',
      description: 'شاهد معرض أعمال سوفيكس الذي يضم 20 موقعاً وتطبيقاً حقيقياً لمطاعم وكافيهات ومدرسين وشركات ومكاتب قانونية حققت نجاحاً باهراً في مصر.',
      ogImage: 'https://suvex.io/project_corporate.jpg'
    },
    {
      hash: 'awards',
      title: 'الجوائز العالمية والشهادات المعتمدة | سوفيكس (SUVEX)',
      description: 'سوفيكس وكالة معترف بها عالمياً وحائزة على جوائز تصميم مميزة من Awwwards و Red Dot و Webby كأفضل شركة تطوير مواقع وتطبيقات.',
      ogImage: 'https://suvex.io/logo.png'
    },
    {
      hash: 'reviews',
      title: 'آراء عملائنا وشركاء النجاح | سوفيكس (SUVEX)',
      description: 'اقرأ تقييمات مئات العملاء والشركات التي تعاملت مع سوفيكس لتصميم وتطوير مواقعها وأنظمتها التقنية وكيف ساعدناهم في زيادة مبيعاتهم.',
      ogImage: 'https://suvex.io/logo.png'
    },
    {
      hash: 'contact',
      title: 'تواصل معنا وابدأ مشروعك الآن | سوفيكس (SUVEX)',
      description: 'تواصل مباشرة مع مهندسي ومصممي سوفيكس عبر الواتساب أو البريد الإلكتروني لمناقشة فكرة مشروعك والحصول على عرض سعر مجاني.',
      ogImage: 'https://suvex.io/logo.png'
    }
  ],
  en: [
    {
      hash: 'home',
      title: 'SUVEX | Egypt\'s #1 Web Design & App Development Agency',
      description: 'SUVEX is Egypt\'s leading digital agency for professional website design, mobile app development, and smart digital systems that grow your business sales.',
      ogImage: 'https://suvex.io/logo.png'
    },
    {
      hash: 'impact',
      title: 'Our Impact & Metrics | SUVEX',
      description: 'Numbers that define excellence. Over $1.2B in client revenue, 200+ elite projects shipped across 50+ countries, and 40ms global edge latency.',
      ogImage: 'https://suvex.io/project_saas.jpg'
    },
    {
      hash: 'services',
      title: 'Our Digital Services | Web & App Development - SUVEX',
      description: 'Explore our services: WebGL & 3D experiences, Enterprise SaaS, Mobile App development, Cloud architecture, Data Analytics, and Performance Marketing.',
      ogImage: 'https://suvex.io/project_saas.jpg'
    },
    {
      hash: 'team',
      title: 'Ziad Ayman & Core Team | SUVEX Digital Agency',
      description: 'Meet Ziad Ayman, Founder & CEO of SUVEX, along with our core crew of ex-FAANG engineers and creative technologists building high-ROI assets.',
      ogImage: 'https://suvex.io/ceo.jpg'
    },
    {
      hash: 'tech',
      title: 'Modern Technology Stack | SUVEX',
      description: 'We build high-performance web systems using Three.js, React 19, Next.js, Node, Go, Rust, and AI/ML integrations for maximum speed and security.',
      ogImage: 'https://suvex.io/project_webgl_ai.jpg'
    },
    {
      hash: 'portfolio',
      title: 'Our Work Portfolio - 20 Real Projects | SUVEX',
      description: 'Browse our portfolio of 20 live websites and digital platforms built for restaurants, cafes, schools, companies, and professional firms.',
      ogImage: 'https://suvex.io/project_corporate.jpg'
    },
    {
      hash: 'awards',
      title: 'Awards & Global Recognition | SUVEX',
      description: 'Awarded by prestigious organizations including Awwwards SOTD, CSS Design Awards, Webby Awards, and Red Dot for outstanding UI/UX and engineering.',
      ogImage: 'https://suvex.io/logo.png'
    },
    {
      hash: 'reviews',
      title: 'Client Reviews & Testimonials | SUVEX',
      description: 'Read testimonials from 100+ verified clients and business partners who scaled their operations and revenues with SUVEX digital solutions.',
      ogImage: 'https://suvex.io/logo.png'
    },
    {
      hash: 'contact',
      title: 'Contact Us - Start Your Project | SUVEX',
      description: 'Connect with our technical architects and design team to launch your high-fidelity, high-performance digital platform today.',
      ogImage: 'https://suvex.io/logo.png'
    }
  ]
};

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [lang, setLang] = useState<Lang>(() => {
    // Initialize from URL param for search engine indexing
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get('lang');
      if (urlLang === 'en') return 'en';
    }
    return 'ar';
  });
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const isAnimating = useRef<boolean>(false);
  const touchStartY = useRef<number>(0);
  const portfolioGridRef = useRef<HTMLDivElement | null>(null);

  // Client-side lightweight pathname routing
  const [route, setRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setRoute(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (newRoute: string) => {
    setRoute(newRoute);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', newRoute);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const navTo = (i: number) => {
    if (route !== '/') {
      setRoute('/');
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', '/');
        window.scrollTo({ top: 0 });
      }
      setCurrentSection(i);
    } else {
      setCurrentSection(i);
    }
    setMobileMenuOpen(false);
  };

  const t = T[lang];

  // ── Dynamic SEO head sync ──
  useEffect(() => {
    const isHome = route === '/' || route === '/home';
    let title = '';
    let description = '';
    let ogImage = 'https://suvex.io/logo.png';
    const langParam = lang === 'en' ? '?lang=en' : '';
    const sectionHash = SECTION_SEO[lang][currentSection]?.hash || 'home';
    let currentUrl = `https://suvex.io/${langParam}`;

    if (isHome) {
      const currentSeo = SECTION_SEO[lang][currentSection];
      title = currentSeo.title;
      description = currentSeo.description;
      ogImage = currentSeo.ogImage;
      currentUrl = `https://suvex.io/${langParam}#${sectionHash}`;
    } else {
      const activePage = getPageData(route);
      if (activePage) {
        title = lang === 'ar' ? activePage.titleAr : activePage.title;
        description = lang === 'ar' ? activePage.descriptionAr : activePage.description;
        ogImage = `https://suvex.io${activePage.image}`;
        currentUrl = `https://suvex.io${route}${langParam}`;
      } else {
        // Fallback for dynamic/custom subpages
        title = lang === 'ar' ? 'سوفيكس لتصميم البرمجيات المخصصة' : 'SUVEX - Custom Digital Solutions';
        description = lang === 'ar' ? 'سوفيكس وكالة تصميم وبرمجة مواقع وتطبيقات.' : 'SUVEX digital agency.';
        currentUrl = `https://suvex.io${route}${langParam}`;
      }
    }

    // Update html element attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // Update title
    document.title = title;

    // Helper utilities
    const setMetaName = (name: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el); }
      el.content = content;
    };
    const setMetaProp = (property: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute('property', property); document.head.appendChild(el); }
      el.setAttribute('content', content);
    };
    const setLinkRel = (rel: string, href: string, hreflang?: string) => {
      const selector = hreflang
        ? `link[rel="${rel}"][hreflang="${hreflang}"]`
        : `link[rel="canonical"]`;
      let el = document.querySelector<HTMLLinkElement>(selector);
      if (!el) {
        el = document.createElement('link');
        el.rel = rel;
        if (hreflang) el.setAttribute('hreflang', hreflang);
        document.head.appendChild(el);
      }
      el.href = href;
    };

    // Meta description
    setMetaName('description', description);

    // Canonical URL
    setLinkRel('canonical', currentUrl);

    // Hreflang alternate links
    const canonicalPath = isHome ? '' : route;
    setLinkRel('alternate', `https://suvex.io${canonicalPath}`, 'ar');
    setLinkRel('alternate', `https://suvex.io${canonicalPath}?lang=en`, 'en');
    setLinkRel('alternate', `https://suvex.io${canonicalPath}`, 'x-default');

    // OpenGraph
    setMetaProp('og:title', title);
    setMetaProp('og:description', description);
    setMetaProp('og:url', currentUrl);
    setMetaProp('og:locale', lang === 'ar' ? 'ar_EG' : 'en_US');
    setMetaProp('og:image', ogImage);

    // Twitter Card
    setMetaName('twitter:title', title);
    setMetaName('twitter:description', description);
    setMetaName('twitter:image', ogImage);

    // Update URL hash without polluting history stack (only on Home)
    if (typeof window !== 'undefined' && isHome) {
      const newUrl = `${window.location.pathname}${langParam}#${sectionHash}`;
      window.history.replaceState(null, '', newUrl);
    }

    // ── Dynamic JSON-LD Schema Injection ──
    const updateOrCreateSchemaScript = (id: string, schemaObj: any) => {
      let script = document.getElementById(id) as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = id;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schemaObj, null, 2);
    };

    // 1. Organization Schema
    updateOrCreateSchemaScript('schema-organization', {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "https://suvex.io/#organization",
      "name": "SUVEX",
      "alternateName": "سوفيكس",
      "url": "https://suvex.io",
      "logo": {
        "@type": "ImageObject",
        "url": "https://suvex.io/logo.png",
        "width": 512,
        "height": 512
      },
      "image": "https://suvex.io/logo.png",
      "description": lang === 'ar' 
        ? "سوفيكس (SUVEX) هي الوكالة الرقمية الرائدة في مصر لتصميم وبرمجة المواقع الإلكترونية وتطبيقات الموبايل والأنظمة الذكية."
        : "SUVEX is Egypt's leading digital agency for professional web design, mobile apps, and enterprise software.",
      "foundingDate": "2019",
      "numberOfEmployees": {
        "@type": "QuantitativeValue",
        "value": 50
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "EG",
        "addressLocality": "Cairo",
        "addressRegion": "Cairo Governorate"
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "email": "hello@suvex.io",
          "availableLanguage": ["Arabic", "English"],
          "hoursAvailable": "Mo-Su 00:00-23:59"
        }
      ],
      "sameAs": [
        "https://www.linkedin.com/company/suvex",
        "https://twitter.com/suvex_io",
        "https://www.facebook.com/suvex.io",
        "https://www.instagram.com/suvex.io"
      ],
      "knowsAbout": [
        "Web Design", "Web Development", "Mobile App Development",
        "UI/UX Design", "SEO", "Digital Marketing", "Cloud Infrastructure",
        "React", "Next.js", "WebGL", "3D Web Experiences"
      ]
    });

    // 2. LocalBusiness Schema
    updateOrCreateSchemaScript('schema-localbusiness', {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": "https://suvex.io/#localbusiness",
      "name": lang === 'ar' ? "سوفيكس - SUVEX" : "SUVEX Digital Agency",
      "description": lang === 'ar' ? "وكالة تصميم وبرمجة مواقع وتطبيقات موبايل في مصر" : "Web design and mobile app development agency in Egypt",
      "url": "https://suvex.io",
      "telephone": "+20-150-899-7798",
      "email": "hello@suvex.io",
      "priceRange": "$$",
      "currenciesAccepted": "EGP, USD",
      "paymentAccepted": "Cash, Credit Card, Bank Transfer",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Cairo",
        "addressLocality": "Cairo",
        "addressRegion": "Cairo Governorate",
        "addressCountry": "EG"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 30.0444,
        "longitude": 31.2357
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        "opens": "00:00",
        "closes": "23:59"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "reviewCount": "200",
        "bestRating": "5",
        "worstRating": "1"
      }
    });

    // 3. Person (CEO / Founder) Schema
    updateOrCreateSchemaScript('schema-person', {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": "https://suvex.io/#ceo",
      "name": lang === 'ar' ? "زياد أيمن" : "Ziad Ayman",
      "jobTitle": "Founder & CEO",
      "description": lang === 'ar' 
        ? "مؤسس ومدير تنفيذي لشركة سوفيكس SUVEX. مهندس سابق بجوجل وخبير في تصميم وبرمجة المواقع والتطبيقات."
        : "Founder & CEO of SUVEX. Ex-Google engineer and expert in web and mobile app architecture.",
      "image": "https://suvex.io/ceo.jpg",
      "url": "https://suvex.io/",
      "worksFor": {
        "@id": "https://suvex.io/#organization"
      },
      "knowsAbout": ["Web Development", "Digital Strategy", "UI/UX", "Performance Engineering"],
      "sameAs": [
        "https://www.linkedin.com/in/ziad-ayman-suvex"
      ]
    });

    // 4. WebSite + SearchAction Schema
    updateOrCreateSchemaScript('schema-website', {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://suvex.io/#website",
      "name": "SUVEX",
      "url": "https://suvex.io",
      "inLanguage": ["ar", "en"],
      "publisher": {
        "@id": "https://suvex.io/#organization"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://suvex.io/?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    });

    // 5. Services List Schema
    const servicesList = t.services.items.map((srv, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "Service",
        "@id": `https://suvex.io/#service-${idx}`,
        "name": srv.title,
        "description": srv.desc,
        "provider": { "@id": "https://suvex.io/#organization" },
        "areaServed": "Egypt",
        "serviceType": srv.title
      }
    }));
    updateOrCreateSchemaScript('schema-services', {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": lang === 'ar' ? "خدمات سوفيكس الرقمية" : "SUVEX Digital Services",
      "description": lang === 'ar' ? "خدمات تصميم وبرمجة المواقع والتطبيقات من سوفيكس SUVEX" : "Web design and mobile development services offered by SUVEX",
      "url": "https://suvex.io/#services",
      "numberOfItems": servicesList.length,
      "itemListElement": servicesList
    });

    // 6. FAQ Page Schema
    const activePage = getPageData(route);
    const pageFaqList = !isHome && activePage ? activePage.faqs : DEFAULT_FAQS;
    const pageFaqListAr = !isHome && activePage ? activePage.faqsAr : DEFAULT_FAQS_AR;
    const selectedFaqs = lang === 'ar' ? pageFaqListAr : pageFaqList;
    
    updateOrCreateSchemaScript('schema-faq', {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": selectedFaqs.map(item => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.a
        }
      }))
    });

    // 7. Breadcrumb Schema (Dynamic!)
    const breadcrumbItems = [
      { "@type": "ListItem", "position": 1, "name": lang === 'ar' ? "الرئيسية" : "Home", "item": `https://suvex.io/${langParam}` }
    ];
    if (!isHome && activePage) {
      const crumbs = lang === 'ar' ? activePage.breadcrumbsAr : activePage.breadcrumbs;
      crumbs.forEach((crumb, index) => {
        if (index > 0) {
          breadcrumbItems.push({
            "@type": "ListItem",
            "position": index + 1,
            "name": crumb,
            "item": `https://suvex.io${activePage.route}${langParam}`
          });
        }
      });
    } else if (isHome && currentSection > 0) {
      const currentSeoItem = SECTION_SEO[lang][currentSection];
      if (currentSeoItem) {
        breadcrumbItems.push({
          "@type": "ListItem",
          "position": 2,
          "name": currentSeoItem.hash.charAt(0).toUpperCase() + currentSeoItem.hash.slice(1),
          "item": `https://suvex.io/${langParam}#${sectionHash}`
        });
      }
    }
    updateOrCreateSchemaScript('schema-breadcrumb', {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbItems
    });

    // 8. About Page Schema
    updateOrCreateSchemaScript('schema-about', {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "@id": `https://suvex.io/${langParam}#about`,
      "name": lang === 'ar' ? "من نحن | سوفيكس" : "About Us | SUVEX",
      "description": lang === 'ar'
        ? "تعرف على شركة سوفيكس SUVEX للحلول البرمجية وتصميم المواقع وفريق عملنا من الخبراء."
        : "Learn about SUVEX, our digital solutions, web development services, and our expert team.",
      "mainEntity": {
        "@id": "https://suvex.io/#organization"
      }
    });

    // 9. Service Schema for individual service pages
    if (!isHome && activePage && route.startsWith('/services/')) {
      updateOrCreateSchemaScript('schema-service-item', {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `https://suvex.io${activePage.route}`,
        "name": lang === 'ar' ? activePage.h1Ar : activePage.h1,
        "description": lang === 'ar' ? activePage.descriptionAr : activePage.description,
        "provider": { "@id": "https://suvex.io/#organization" },
        "areaServed": ["Egypt", "Saudi Arabia", "UAE", "Qatar", "Kuwait"],
        "serviceType": activePage.category,
        "offers": {
          "@type": "Offer",
          "priceCurrency": "USD",
          "price": "Contact for custom quote"
        }
      });
    } else {
      const el = document.getElementById('schema-service-item');
      if (el) el.remove();
    }

  }, [currentSection, lang, route]);

  // ── Filtered projects ──
  const filteredProjects = useMemo(() =>
    activeFilter === 'all' ? PORTFOLIO_ITEMS : PORTFOLIO_ITEMS.filter(p => p.category === activeFilter),
    [activeFilter]);

  // ── Navigation ──
  useEffect(() => {
    if (route !== '/') return;

    const navigate = (dir: 1 | -1) => {
      if (isAnimating.current) return;
      const next = currentSection + dir;
      if (next < 0 || next >= TOTAL_SECTIONS) return;
      isAnimating.current = true;
      setCurrentSection(next);
      setTimeout(() => { isAnimating.current = false; }, 820);
    };

    const handleWheel = (e: WheelEvent) => {
      if (currentSection === 5 && portfolioGridRef.current) {
        const grid = portfolioGridRef.current;
        if (grid.contains(e.target as Node)) {
          const atTop = grid.scrollTop <= 0;
          const atBottom = grid.scrollTop + grid.clientHeight >= grid.scrollHeight - 2;
          if ((e.deltaY > 0 && !atBottom) || (e.deltaY < 0 && !atTop)) return;
        }
      }
      e.preventDefault();
      if (Math.abs(e.deltaY) < 40) return;
      navigate(e.deltaY > 0 ? 1 : -1);
    };

    const handleTouchStart = (e: TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
    const handleTouchEnd = (e: TouchEvent) => {
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 50) return;
      navigate(delta > 0 ? 1 : -1);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', 'Space'].includes(e.key)) { e.preventDefault(); navigate(1); }
      else if (['ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); navigate(-1); }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSection, route]);

  // ── Section tag helper ──
  const SectionTag = ({ label }: { label: string }) => (
    <div className="flex items-center justify-center gap-2 mb-4 text-[#155dfc]">
      <span className="uppercase tracking-[0.25em] text-[11px] md:text-xs font-bold font-mono">{label}</span>
    </div>
  );

  const isHome = route === '/' || route === '/home';
  const wrapperClass = isHome 
    ? "h-screen w-full overflow-hidden bg-[#000511] text-white relative font-sans select-none"
    : "min-h-screen w-full overflow-y-auto bg-[#000511] text-white relative font-sans select-none";

  return (
    <div dir={t.dir} className={wrapperClass}>
      <InteractiveCanvas currentSection={currentSection} />

      {/* ── Fixed Header ── */}
      <header className="fixed top-0 left-0 w-full pt-5 md:pt-7 px-4 md:px-8 flex justify-center z-50 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full max-w-[1300px] h-14 md:h-[4.25rem] rounded-2xl border border-white/10 bg-[#030b20]/70 backdrop-blur-2xl flex items-center justify-between px-5 md:px-8 relative shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
        >
          <div className="absolute -top-[1px] left-[8%] w-[30%] h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_12px_rgba(59,130,246,0.9)] z-10" />

          {/* Logo */}
          <a href={lang === 'en' ? '?lang=en#home' : '#home'} onClick={(e) => { e.preventDefault(); navTo(0); }} className="relative w-24 md:w-36 h-full cursor-pointer flex-shrink-0">
            <img src="/logo.webp" alt="SUVEX" decoding="async" className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-auto object-contain drop-shadow-[0_0_15px_rgba(21,93,252,0.3)] scale-[1.35] origin-left" />
          </a>

          {/* Desktop Nav */}
          <nav className={`hidden xl:flex items-center gap-6 2xl:gap-10 text-[12px] font-medium text-gray-400 h-full ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
            {t.nav.map((label, idx) => {
              const hash = SECTION_SEO[lang][idx].hash;
              const langParam = lang === 'en' ? '?lang=en' : '';
              return (
                <a key={idx} href={`${langParam}#${hash}`} onClick={(e) => { e.preventDefault(); navTo(idx); }}
                  className={`h-full flex items-center transition-colors relative cursor-pointer whitespace-nowrap ${currentSection === idx ? 'text-[#3b82f6]' : 'hover:text-white'}`}>
                  {label}
                  {currentSection === idx && (
                    <motion.span layoutId="activeIndicator" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-[#3b82f6] shadow-[0_-3px_10px_2px_rgba(59,130,246,0.8)] rounded-t-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className={`hidden md:flex items-center h-full gap-3 flex-shrink-0 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
            <button id="lang-toggle-btn" onClick={() => setLang(l => l === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-mono transition-all cursor-pointer">
              <span>{lang === 'en' ? '🇦🇪' : '🇬🇧'}</span>
              <span>{lang === 'en' ? 'عربي' : 'EN'}</span>
            </button>
            <a href={lang === 'en' ? '?lang=en#contact' : '#contact'} onClick={(e) => { e.preventDefault(); navTo(8); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#1e3a8a] bg-[#0a1435]/50 hover:bg-[#1e3a8a]/50 hover:border-blue-500/60 text-gray-100 text-sm font-semibold transition-all duration-300 group cursor-pointer shadow-[0_0_20px_rgba(21,93,252,0.15)] text-center justify-center">
              {t.getInTouch}
              <ArrowRight className={`w-4 h-4 text-[#3b82f6] transition-transform ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
            </a>
          </div>

          {/* Mobile */}
          <div className="xl:hidden flex items-center gap-2">
            <button id="lang-toggle-mobile" onClick={() => setLang(l => l === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-gray-300 text-xs font-mono cursor-pointer">
              <span>{lang === 'en' ? '🇦🇪' : '🇬🇧'}</span>
            </button>
            <button onClick={() => setMobileMenuOpen(true)} className="text-gray-300 hover:text-white cursor-pointer" aria-label="Open Menu">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </motion.div>
      </header>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: lang === 'ar' ? '-100%' : '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: lang === 'ar' ? '-100%' : '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-50 bg-[#000511]/98 backdrop-blur-2xl flex flex-col p-8">
            <div className={`flex justify-between items-center mb-10 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
              <img src="/logo.webp" alt="SUVEX" decoding="async" className="w-28 h-auto object-contain" />
              <button onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white cursor-pointer" aria-label="Close">
                <X className="w-7 h-7" />
              </button>
            </div>
            <nav className={`flex flex-col gap-6 text-xl font-semibold text-gray-300 ${lang === 'ar' ? 'items-end' : 'items-start'}`}>
              {t.nav.map((label, idx) => {
                const hash = SECTION_SEO[lang][idx].hash;
                const langParam = lang === 'en' ? '?lang=en' : '';
                return (
                  <a key={idx} href={`${langParam}#${hash}`} onClick={(e) => { e.preventDefault(); navTo(idx); }}
                    className={`transition-colors cursor-pointer ${currentSection === idx ? 'text-[#3b82f6]' : 'hover:text-white'}`}>
                    {label}
                  </a>
                );
              })}
            </nav>
            <div className="mt-auto">
              <a href={lang === 'en' ? '?lang=en#contact' : '#contact'} onClick={(e) => { e.preventDefault(); navTo(8); }}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl border border-blue-500/30 bg-[#155dfc]/10 text-white font-semibold text-base hover:bg-[#155dfc]/20 transition-all cursor-pointer text-center">
                {t.getInTouch}
                <ArrowRight className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Side Dot Navigation ── */}
      {isHome && (
        <nav aria-label={lang === 'ar' ? 'التنقل بين الأقسام' : 'Section navigation'} className={`fixed ${lang === 'ar' ? 'left-5 md:left-7' : 'right-5 md:right-7'} top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3`}>
          {Array.from({ length: TOTAL_SECTIONS }, (_, idx) => {
            const hash = SECTION_SEO[lang][idx].hash;
            const langParam = lang === 'en' ? '?lang=en' : '';
            return (
              <a
                key={idx}
                href={`${langParam}#${hash}`}
                onClick={(e) => { e.preventDefault(); setCurrentSection(idx); }}
                className="w-2.5 h-2.5 rounded-full relative group cursor-pointer"
                aria-label={t.navSections[idx]}
                aria-current={currentSection === idx ? 'page' : undefined}
                title={t.navSections[idx]}
              >
                <span className={`absolute inset-0 rounded-full transition-all duration-300 ${currentSection === idx ? 'bg-[#155dfc] scale-125 shadow-[0_0_10px_#155dfc]' : 'bg-white/20 group-hover:bg-white/50 group-hover:scale-110'}`} />
                <span className={`absolute ${lang === 'ar' ? 'left-5' : 'right-5'} top-1/2 -translate-y-1/2 bg-[#030b20]/90 border border-white/10 px-2.5 py-1 rounded text-[10px] font-mono text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg`} aria-hidden="true">
                  {t.navSections[idx]}
                </span>
              </a>
            );
          })}
        </nav>
      )}

      {/* ── Main Content Area ── */}
      {isHome ? (
        <motion.div
          className="w-full h-full"
          animate={{ y: `-${currentSection * 100}vh` }}
          transition={{ type: 'spring', damping: 28, stiffness: 95, mass: 1 }}
        >

        {/* ━━━━ SECTION 0 · HERO ━━━━ */}
        <section id="home" aria-label={lang === 'ar' ? 'الصفحة الرئيسية' : 'Home'} className="h-screen w-full flex flex-col justify-center px-6 md:px-16 lg:px-24 relative overflow-hidden">
          <div className={`max-w-[58rem] flex flex-col pt-20 ${lang === 'ar' ? 'items-end text-right' : 'items-start'}`}>

            {/* Live badge */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-[11px] font-mono font-semibold mb-8 w-fit ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse flex-shrink-0" />
                {t.hero.badge}
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1 }}
              className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[6rem] font-bold leading-[1.0] tracking-tighter mb-8">
              {t.hero.h1a}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-500 to-[#155dfc] drop-shadow-[0_0_40px_rgba(21,93,252,0.5)]">
                {t.hero.h1b}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="text-[#9ca3af] text-lg sm:text-xl max-w-[34rem] leading-[1.65] mb-10 font-light">
              {t.hero.p}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
              className={`flex flex-wrap gap-4 mb-10 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
              <a href={lang === 'en' ? '?lang=en#portfolio' : '#portfolio'} onClick={(e) => { e.preventDefault(); navTo(5); }}
                className="bg-[#155dfc] hover:bg-[#1653e8] text-white font-bold text-base md:text-lg py-4 px-10 rounded-xl transition-all duration-300 shadow-[0_0_35px_rgba(21,93,252,0.55)] hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(21,93,252,0.7)] cursor-pointer flex items-center gap-2 group justify-center">
                {t.hero.cta1}
                <ChevronRight className={`w-5 h-5 transition-transform ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
              </a>
              <a href={lang === 'en' ? '?lang=en#contact' : '#contact'} onClick={(e) => { e.preventDefault(); navTo(8); }}
                className="border border-white/10 hover:border-blue-500/50 bg-white/5 hover:bg-[#155dfc]/10 text-white font-bold text-base md:text-lg py-4 px-10 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center">
                {t.hero.cta2}
              </a>
            </motion.div>

            {/* Stat chips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45 }}
              className={`flex flex-wrap gap-3 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
              {t.hero.chips.map((chip, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/8 bg-[#030b20]/60 backdrop-blur-xl text-gray-300 text-sm font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#155dfc] flex-shrink-0" />
                  {chip}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 animate-bounce">
            <span className="text-[9px] uppercase tracking-[0.2em] font-mono">{t.hero.scroll}</span>
            <div className="w-5 h-8 border border-white/15 rounded-full flex justify-center pt-1">
              <div className="w-1 h-2.5 bg-[#155dfc] rounded-full animate-scrollIndicator" />
            </div>
          </div>
        </section>

        {/* ━━━━ SECTION 1 · STATS ━━━━ */}
        <section id="impact" aria-label={lang === 'ar' ? 'الإنجازات والأرقام' : 'Impact & Stats'} className="h-screen w-full flex items-center justify-center px-6 md:px-16 lg:px-24 overflow-hidden">
          <div className="max-w-7xl w-full mx-auto flex flex-col items-center pt-16">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: 0.8 }} className="text-center mb-14">
              <SectionTag label={t.stats.tag} />
              <h2 className="font-display text-3xl sm:text-5xl lg:text-[4rem] font-bold leading-[1.1] tracking-tight mb-5">{t.stats.h2}</h2>
              <p className="text-gray-400 text-base md:text-lg max-w-[36rem] mx-auto font-light">{t.stats.p}</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6 w-full">
              {t.stats.items.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: 0.6, delay: i * 0.08 }}
                  className="relative p-6 md:p-8 rounded-2xl border border-white/5 bg-[#030b20]/50 backdrop-blur-xl hover:border-white/15 hover:bg-[#030b20]/75 transition-all duration-300 group overflow-hidden">
                  {/* Gradient top bar */}
                  <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: `linear-gradient(to right, transparent, ${STAT_GRADIENT_COLORS[i]}, transparent)`, boxShadow: `0 0 12px 1px ${STAT_GRADIENT_COLORS[i]}80` }} />
                  <div className="absolute top-0 left-0 right-0 h-16 opacity-10" style={{ background: `radial-gradient(ellipse at top, ${STAT_GRADIENT_COLORS[i]}, transparent)` }} />
                  <p className="font-display text-4xl md:text-5xl font-bold text-white mb-2 relative">{item.value}</p>
                  <p className="text-[#3b82f6] font-semibold text-sm mb-1 relative">{item.label}</p>
                  <p className="text-gray-500 text-xs relative">{item.sub}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━━ SECTION 2 · SERVICES ━━━━ */}
        <section id="services" aria-label={lang === 'ar' ? 'خدماتنا' : 'Our Services'} className="h-screen w-full flex items-center justify-center px-6 md:px-16 lg:px-24 overflow-hidden">
          <div className="max-w-7xl w-full mx-auto flex flex-col items-center pt-16">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: 0.8 }} className="text-center mb-12">
              <SectionTag label={t.services.tag} />
              <h2 className="font-display text-3xl sm:text-5xl lg:text-[4rem] font-bold leading-[1.1] tracking-tight mb-5">{t.services.h2}</h2>
              <p className="text-gray-400 text-base md:text-lg max-w-[40rem] mx-auto font-light">{t.services.p}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: 0.8, delay: 0.15 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
              {t.services.items.map((service, i) => (
                <div key={i} className="group p-7 rounded-2xl border border-white/5 bg-[#030b20]/40 backdrop-blur-md hover:border-blue-500/30 hover:bg-[#030b20]/70 hover:shadow-[0_0_30px_rgba(21,93,252,0.08)] transition-all duration-400 cursor-default">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 text-blue-400 group-hover:text-blue-300 transition-colors bg-blue-500/10 border border-blue-500/20 group-hover:border-blue-400/40">
                    {SERVICE_ICONS[i]}
                  </div>
                  <h3 className="text-white font-bold text-base mb-2.5">{service.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{service.desc}</p>
                  <div className={`flex items-center gap-1.5 mt-4 text-blue-400 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <span>{lang === 'ar' ? 'اعرف أكثر' : 'Learn more'}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ━━━━ SECTION 3 · CEO SPOTLIGHT ━━━━ */}
        <section id="team" aria-label={lang === 'ar' ? 'الفريق والمؤسس' : 'Team & Founder'} className="h-screen w-full flex items-center px-6 md:px-12 lg:px-20 relative overflow-hidden">

          {/* Ambient glow background */}
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#155dfc]/5 rounded-full blur-[120px] pointer-events-none" />

          <div className={`max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20 pt-16 ${lang === 'ar' ? 'lg:flex-row-reverse' : ''}`}>

            {/* ── LEFT: Portrait ── */}
            <motion.div
              initial={{ opacity: 0, x: lang === 'ar' ? 80 : -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex-shrink-0 relative"
            >
              {/* Outer glow aura */}
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-b from-[#155dfc]/20 to-transparent blur-2xl pointer-events-none" />

              {/* Border gradient ring */}
              <div className="absolute -inset-[1.5px] rounded-[2rem] bg-gradient-to-br from-[#155dfc]/80 via-blue-400/20 to-transparent pointer-events-none" />

              {/* Portrait — NO text on top of image */}
              <div className="relative w-[260px] md:w-[300px] lg:w-[340px] rounded-[2rem] overflow-hidden shadow-[0_30px_80px_rgba(21,93,252,0.3)]">
                <img
                  src="/ceo.jpg"
                  alt={lang === 'ar' ? 'زياد أيمن - مؤسس ومدير تنفيذي لشركة سوفيكس SUVEX' : 'Ziad Ayman - Founder & CEO of SUVEX digital agency'}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-[360px] md:h-[420px] lg:h-[480px] object-cover object-top"
                />
                {/* Subtle bottom fade — NO text */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#000511]/60 to-transparent" />
              </div>

              {/* Floating #1 badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 flex flex-col items-center justify-center w-16 h-16 rounded-full bg-[#155dfc] shadow-[0_0_30px_rgba(21,93,252,0.8)] border-2 border-blue-300/30"
              >
                <span className="text-white font-black text-[9px] font-mono leading-tight text-center">
                  {lang === 'ar' ? <>المدير<br />الاقوى</> : <>#1<br />CEO</>}
                </span>
              </motion.div>

              {/* Name + title BELOW image */}
              <div className={`mt-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                <p className="text-white font-bold text-lg tracking-tight">{lang === 'ar' ? 'زياد أيمن' : 'Ziad Ayman'}</p>
                <p className="text-[#3b82f6] text-[11px] font-mono font-semibold uppercase tracking-[0.2em]">
                  {lang === 'ar' ? 'المؤسس والمدير التنفيذي · سوفيكس' : 'Founder & CEO · SUVEX'}
                </p>
              </div>
            </motion.div>

            {/* ── RIGHT: CEO Info ── */}
            <div className={`flex-1 flex flex-col ${lang === 'ar' ? 'items-end text-right' : 'items-start'}`}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                {/* Tag */}
                <div className={`flex items-center gap-2 mb-4 text-[#155dfc] ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <Users className="w-4 h-4" />
                  <span className="uppercase tracking-[0.3em] text-[11px] font-bold font-mono">{t.team.tag}</span>
                </div>

                {/* Headline */}
                <h2 className="font-display text-4xl sm:text-5xl lg:text-[3.6rem] font-black leading-[1.05] tracking-tight mb-5">
                  {lang === 'ar'
                    ? <span>رؤية تُبنى على<br /><span className="text-[#155dfc]">المستحيل.</span></span>
                    : <span>Built on <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#155dfc] to-blue-300">Vision.</span><br />Driven by Domination.</span>
                  }
                </h2>

                {/* Power Quote */}
                <div className={`relative mb-6 pl-5 ${lang === 'ar' ? 'pr-5 pl-0 border-r-[3px] border-l-0 border-r-[#155dfc]' : 'border-l-[3px] border-[#155dfc]'}`}>
                  <blockquote className="text-gray-300 text-sm md:text-base leading-[1.8] font-light">
                    {lang === 'ar'
                      ? '"أنا مش بابني شركة — أنا بابني الإنترنت اللي المفروض يكون. كل منصة بنطلعها لازم تبقا تحفة فنية ومكينة ربح في آن واحد. مفيش وسط."'
                      : '"I don\'t build companies — I engineer the internet that should exist. Every platform we ship must be a masterpiece and a profit machine. There is no middle ground."'
                    }
                  </blockquote>
                </div>

                {/* Achievement pills */}
                <div className={`flex flex-wrap gap-2 mb-7 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                  {[
                    { label: lang === 'ar' ? 'مهندس سابق بجوجل' : 'Ex-Google Engineer', color: '#06b6d4' },
                    { label: lang === 'ar' ? 'خبرة +14 سنة' : '14+ Yrs Experience', color: '#155dfc' },
                    { label: lang === 'ar' ? 'مبيعات +50 مليون' : '$1.2B+ Revenue', color: '#8b5cf6' },
                    { label: lang === 'ar' ? 'فوربس 30 تحت 30' : 'Forbes 30 Under 30', color: '#f59e0b' },
                    { label: lang === 'ar' ? '+200 مشروع ناجح' : '200+ Shipped', color: '#10b981' },
                  ].map((p, i) => (
                    <span key={i} className="text-[11px] font-bold font-mono px-3 py-1.5 rounded-full border"
                      style={{ color: p.color, borderColor: `${p.color}50`, background: `${p.color}14` }}>
                      {p.label}
                    </span>
                  ))}
                </div>

                {/* 4 key stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                  {[
                    { val: '50+', label: lang === 'ar' ? 'عضو فريق' : 'Team Members' },
                    { val: '200+', label: lang === 'ar' ? 'مشروع' : 'Projects Built' },
                    { val: '$1.2B', label: lang === 'ar' ? 'إيرادات' : 'Revenue Gen.' },
                    { val: '50+', label: lang === 'ar' ? 'دولة' : 'Countries' },
                  ].map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                      className={`p-4 rounded-2xl border border-white/5 bg-[#030b20]/50 backdrop-blur-xl hover:border-blue-500/20 transition-all ${lang === 'ar' ? 'text-right' : ''}`}
                    >
                      <span className="block font-display text-2xl font-black text-white mb-0.5">{s.val}</span>
                      <span className="text-[#3b82f6] text-[10px] font-semibold uppercase tracking-wider">{s.label}</span>
                    </motion.div>
                  ))}
                </div>

              </motion.div>
            </div>

          </div>
        </section>


        {/* ━━━━ SECTION 4 · TECH ━━━━ */}

        <section id="tech" aria-label={lang === 'ar' ? 'تقنياتنا' : 'Technology Stack'} className="h-screen w-full flex items-center justify-center px-6 md:px-16 lg:px-24 overflow-hidden">
          <div className="max-w-7xl w-full mx-auto flex flex-col items-center pt-16">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: 0.8 }} className="text-center mb-12">
              <div className={`flex items-center justify-center gap-2 mb-4 text-[#155dfc]`}>
                <Cpu className="w-4 h-4 animate-pulse" />
                <span className="uppercase tracking-[0.25em] text-[11px] md:text-xs font-bold font-mono">{t.tech.tag}</span>
              </div>
              <h2 className="font-display text-3xl sm:text-5xl lg:text-[4rem] font-bold leading-[1.1] tracking-tight mb-5">{t.tech.h2}</h2>
              <p className="text-gray-400 text-base md:text-lg max-w-[40rem] mx-auto font-light">{t.tech.p}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: 0.8, delay: 0.15 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-5 w-full max-w-5xl">
              {t.tech.items.map((item, i) => (
                <div key={i} className="flex flex-col items-center p-6 md:p-7 rounded-2xl border border-white/5 bg-[#030b20]/40 backdrop-blur-md hover:bg-[#030b20]/75 hover:border-blue-500/30 hover:shadow-[0_0_25px_rgba(21,93,252,0.1)] transition-all duration-300 group cursor-default text-center">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 text-gray-400 group-hover:text-white transition-colors" style={{ background: TECH_COLORS[i].bg, border: `1px solid ${TECH_COLORS[i].border}` }}>
                    {TECH_ICONS[i]}
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-2">{item.name}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ━━━━ SECTION 5 · PORTFOLIO (20 Projects) ━━━━ */}
        <section id="portfolio" aria-label={lang === 'ar' ? 'محفظة أعمالنا' : 'Our Portfolio'} className="h-screen w-full flex flex-col items-center justify-start px-6 md:px-16 lg:px-24 overflow-hidden pt-20">
          <div className="max-w-7xl w-full mx-auto flex flex-col items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: 0.8 }} className="text-center mb-6 mt-4">
              <div className={`flex items-center justify-center gap-2 mb-3 text-[#155dfc]`}>
                <Code className="w-4 h-4" />
                <span className="uppercase tracking-[0.25em] text-[11px] font-bold font-mono">{t.portfolio.tag}</span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl lg:text-[3.2rem] font-bold leading-[1.1] tracking-tight">{t.portfolio.h2}</h2>
            </motion.div>

            {/* Filter Tabs */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false }} transition={{ duration: 0.6, delay: 0.2 }}
              className={`flex flex-wrap gap-2 mb-6 justify-center ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
              {t.portfolio.filters.map((label, i) => (
                <button key={i} onClick={() => setActiveFilter(t.portfolio.filterKeys[i])}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold font-mono transition-all cursor-pointer border ${activeFilter === t.portfolio.filterKeys[i] ? 'bg-[#155dfc] border-[#155dfc] text-white shadow-[0_0_15px_rgba(21,93,252,0.5)]' : 'border-white/10 bg-white/5 text-gray-400 hover:text-white hover:border-white/25'}`}>
                  {label}
                </button>
              ))}
            </motion.div>

            {/* Scrollable Grid */}
            <div
              ref={portfolioGridRef}
              className="w-full overflow-y-auto pr-1 custom-scrollbar"
              style={{ maxHeight: 'calc(100vh - 300px)' }}>
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
                {filteredProjects.map((item, i) => (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.04 }}
                    className={`group relative rounded-xl border border-white/8 bg-[#030b20]/80 backdrop-blur-md hover:border-white/20 transition-all duration-300 cursor-default overflow-hidden flex flex-col justify-between ${lang === 'ar' ? 'text-right' : ''}`}>
                    {/* Website Mockup Image Preview (Edge-to-Edge) */}
                    <div className="relative w-full h-[110px] sm:h-[125px] overflow-hidden bg-slate-950 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      />
                      <div className="absolute top-0 left-0 right-0 h-[2px] z-10" style={{ background: `linear-gradient(to right, transparent, ${item.color}, transparent)` }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#030b20] via-[#030b20]/40 to-transparent opacity-80" />
                    </div>

                    {/* Content */}
                    <div className="p-3.5 flex flex-col flex-grow justify-between relative z-10">
                      <div>
                        <div className={`flex items-start justify-between mb-2 w-full gap-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                          <h3 className="text-white font-bold text-xs sm:text-sm leading-tight group-hover:text-blue-300 transition-colors duration-300">
                            {lang === 'ar' ? item.titleAr : item.title}
                          </h3>
                          <span className="text-[9px] font-mono text-gray-400 bg-black/40 border border-white/10 px-1.5 py-0.5 rounded flex-shrink-0">{item.year}</span>
                        </div>
                        <p className="text-gray-300 text-[10.5px] leading-relaxed mb-3 line-clamp-3 group-hover:line-clamp-none transition-all duration-300">{item.desc}</p>
                      </div>

                      <div className={`flex items-center justify-between mt-auto pt-2 border-t border-white/5 w-full gap-1.5 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <span className="text-[9px] font-mono font-semibold truncate" style={{ color: item.color }}>
                          {lang === 'ar' ? item.tagsAr : item.tags}
                        </span>
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}20`, border: `1px solid ${item.color}40` }}>
                          <Cpu className="w-3.5 h-3.5" style={{ color: item.color }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ━━━━ SECTION 6 · RECOGNITION ━━━━ */}
        <section id="awards" aria-label={lang === 'ar' ? 'الجوائز والشهادات' : 'Awards & Recognition'} className="h-screen w-full flex flex-col items-center justify-center px-6 md:px-16 lg:px-24 overflow-hidden">
          <div className="max-w-7xl w-full mx-auto flex flex-col items-center pt-16">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: 0.8 }} className="text-center mb-10">
              <div className={`flex items-center justify-center gap-2 mb-4 text-[#f59e0b]`}>
                <Trophy className="w-4 h-4" />
                <span className="uppercase tracking-[0.25em] text-[11px] font-bold font-mono">{t.recognition.tag}</span>
              </div>
              <h2 className="font-display text-3xl sm:text-5xl lg:text-[4rem] font-bold leading-[1.1] tracking-tight mb-4">{t.recognition.h2}</h2>
              <p className="text-gray-400 text-base font-light max-w-[36rem] mx-auto">{t.recognition.p}</p>
            </motion.div>

            {/* Award Cards */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: 0.8, delay: 0.15 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-5 w-full mb-10">
              {AWARDS.map((award, i) => (
                <div key={i} className="group relative p-5 rounded-2xl border border-white/5 bg-[#030b20]/50 backdrop-blur-xl hover:border-white/15 transition-all duration-300 overflow-hidden cursor-default">
                  <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: `linear-gradient(to right, transparent, ${award.color}, transparent)` }} />
                  <div className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center" style={{ background: `${award.color}15`, border: `1px solid ${award.color}40` }}>
                    <Trophy className="w-5 h-5" style={{ color: award.color }} />
                  </div>
                  <h3 className="text-white font-bold text-sm mb-0.5">{lang === 'ar' ? award.titleAr : award.title}</h3>
                  <p className="text-gray-400 text-xs mb-1">{lang === 'ar' ? award.descAr : award.desc}</p>
                  <span className="text-[10px] font-mono" style={{ color: award.color }}>{award.year}</span>
                </div>
              ))}
            </motion.div>

            {/* Partners Marquee */}
            <div className="w-full">
              <p className="text-center text-[10px] font-mono font-bold text-gray-600 tracking-[0.3em] mb-5">{t.recognition.partnersLabel}</p>
              <div className="relative w-full overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#000511] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#000511] to-transparent z-10 pointer-events-none" />
                <div className="flex gap-8 animate-marquee w-max">
                  {[...PARTNERS, ...PARTNERS].map((partner, i) => (
                    <div key={i} className="flex-shrink-0 px-6 py-2.5 rounded-xl border border-white/8 bg-[#030b20]/40 text-gray-400 text-sm font-semibold whitespace-nowrap hover:text-white hover:border-white/20 transition-colors">
                      {partner}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ━━━━ SECTION 7 · TESTIMONIALS (Dual Marquee) ━━━━ */}
        <section id="reviews" aria-label={lang === 'ar' ? 'آراء العملاء' : 'Client Testimonials'} className="h-screen w-full flex flex-col items-center justify-center overflow-hidden">
          <div className="w-full flex flex-col items-center px-6 md:px-16 pt-16">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: 0.8 }} className="text-center mb-10">
              <div className={`flex items-center justify-center gap-2 mb-4 text-[#155dfc]`}>
                <MessageSquare className="w-4 h-4" />
                <span className="uppercase tracking-[0.25em] text-[11px] font-bold font-mono">{t.testimonials.tag}</span>
              </div>
              <h2 className="font-display text-3xl sm:text-5xl lg:text-[4rem] font-bold leading-[1.1] tracking-tight mb-3">{t.testimonials.h2}</h2>
              <p className="text-gray-400 text-base font-light">{t.testimonials.p}</p>
            </motion.div>
          </div>

          {/* Row 1 – scroll left */}
          <div className="w-full overflow-hidden mb-4">
            <div className="flex gap-4 animate-marquee w-max">
              {[...TESTIMONIALS_ROW1, ...TESTIMONIALS_ROW1].map((item, i) => (
                <div key={i} className="flex-shrink-0 w-80 p-5 rounded-2xl border border-white/6 bg-[#030b20]/60 backdrop-blur-xl">
                  <div className="flex text-[#facc15] mb-3">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 fill-current" />)}
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed mb-4 line-clamp-3 italic">"{item.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#155dfc] to-blue-400 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">{item.initials}</div>
                    <div>
                      <p className="text-white text-xs font-bold">{lang === 'ar' ? item.nameAr : item.name}</p>
                      <p className="text-gray-500 text-[10px]">{lang === 'ar' ? item.roleAr : item.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 – scroll right */}
          <div className="w-full overflow-hidden">
            <div className="flex gap-4 animate-marquee-reverse w-max">
              {[...TESTIMONIALS_ROW2, ...TESTIMONIALS_ROW2].map((item, i) => (
                <div key={i} className="flex-shrink-0 w-80 p-5 rounded-2xl border border-white/6 bg-[#030b20]/60 backdrop-blur-xl">
                  <div className="flex text-[#facc15] mb-3">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 fill-current" />)}
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed mb-4 line-clamp-3 italic">"{item.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">{item.initials}</div>
                    <div>
                      <p className="text-white text-xs font-bold">{lang === 'ar' ? item.nameAr : item.name}</p>
                      <p className="text-gray-500 text-[10px]">{lang === 'ar' ? item.roleAr : item.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━━ SECTION 8 · CONTACT ━━━━ */}
        <section id="contact" aria-label={lang === 'ar' ? 'تواصل معنا' : 'Contact Us'} className="h-screen w-full flex items-center justify-center px-6 md:px-16 lg:px-24 overflow-hidden">
          <div className="max-w-5xl w-full mx-auto pt-16">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: 0.8 }} className="text-center mb-10">
              <div className={`flex items-center justify-center gap-2 mb-4 text-[#155dfc]`}>
                <Cpu className="w-4 h-4" />
                <span className="uppercase tracking-[0.25em] text-[11px] font-bold font-mono">{t.contact.tag}</span>
              </div>
              <h2 className="font-display text-3xl sm:text-5xl lg:text-[4rem] font-bold leading-[1.1] tracking-tight mb-4">{t.contact.h2}</h2>
              <p className="text-gray-400 text-base font-light max-w-[36rem] mx-auto">{t.contact.p}</p>
            </motion.div>

            <div className={`flex flex-col lg:flex-row gap-8 items-start justify-center ${lang === 'ar' ? 'lg:flex-row-reverse' : ''}`}>
              {/* WhatsApp Form */}
              <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: false }} transition={{ duration: 0.8 }}
                className="w-full lg:max-w-md p-7 rounded-2xl border border-white/10 bg-[#030b20]/60 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[50px] rounded-full pointer-events-none" />
                <form
                  className={`flex flex-col gap-4 relative z-10 ${lang === 'ar' ? 'text-right' : ''}`}
                  dir={t.dir}
                  onSubmit={e => {
                    e.preventDefault();
                    const nameVal = (document.getElementById('wa-name') as HTMLInputElement)?.value?.trim();
                    const msgVal = (document.getElementById('wa-msg') as HTMLTextAreaElement)?.value?.trim();
                    if (!nameVal || !msgVal) return;
                    const text = encodeURIComponent(
                      `مرحباً، أنا ${nameVal}.\n\n${msgVal}`
                    );
                    window.open(`https://wa.me/201508997798?text=${text}`, '_blank');
                  }}
                >
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="wa-name" className="text-[10px] uppercase tracking-widest text-[#25d366] font-mono font-semibold">
                      {t.contact.label1}
                    </label>
                    <input
                      id="wa-name"
                      type="text"
                      placeholder={t.contact.ph1}
                      required
                      className="w-full h-11 bg-white/5 border border-white/10 rounded-lg px-4 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#25d366] focus:ring-1 focus:ring-[#25d366] transition-all"
                    />
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="wa-msg" className="text-[10px] uppercase tracking-widest text-[#25d366] font-mono font-semibold">
                      {t.contact.label3}
                    </label>
                    <textarea
                      id="wa-msg"
                      rows={5}
                      placeholder={t.contact.ph3}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#25d366] focus:ring-1 focus:ring-[#25d366] transition-all resize-none"
                    />
                  </div>

                  {/* WhatsApp Submit Button */}
                  <button
                    type="submit"
                    className="w-full h-13 mt-1 flex items-center justify-center gap-3 bg-[#25d366] hover:bg-[#1ebe5a] text-white font-bold text-sm rounded-lg transition-all shadow-[0_0_25px_rgba(37,211,102,0.4)] hover:shadow-[0_0_45px_rgba(37,211,102,0.65)] cursor-pointer group"
                  >
                    {/* WhatsApp Icon SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    {lang === 'ar' ? 'أرسل على واتساب' : 'Send via WhatsApp'}
                  </button>

                  <p className={`text-gray-600 text-[10px] font-mono text-center`}>
                    {lang === 'ar' ? 'سيفتح تطبيق واتساب تلقائياً برسالتك' : 'WhatsApp will open with your message pre-filled'}
                  </p>
                </form>
              </motion.div>

              {/* Info */}
              <motion.div initial={{ opacity: 0, x: lang === 'ar' ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false }} transition={{ duration: 0.8, delay: 0.15 }}
                className={`flex flex-col gap-5 lg:pt-4 ${lang === 'ar' ? 'items-end' : 'items-start'}`}>

                {/* WhatsApp contact item */}
                <div className={`flex items-center gap-4 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 rounded-xl bg-[#25d366]/10 border border-[#25d366]/30 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#25d366" className="w-4 h-4">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div className={lang === 'ar' ? 'text-right' : ''}>
                    <p className="text-gray-500 text-xs mb-0.5">{lang === 'ar' ? 'واتساب مباشر' : 'Direct WhatsApp'}</p>
                    <p className="text-white font-semibold text-sm">+20 150 899 7798</p>
                  </div>
                </div>

                {/* Clock */}
                <div className={`flex items-center gap-4 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className={lang === 'ar' ? 'text-right' : ''}>
                    <p className="text-gray-500 text-xs mb-0.5">{lang === 'ar' ? 'وقت الرد' : 'Response Time'}</p>
                    <p className="text-white font-semibold text-sm">{lang === 'ar' ? 'خلال ساعتين' : 'Within 2 hours'}</p>
                  </div>
                </div>

                {/* Globe */}
                <div className={`flex items-center gap-4 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className={lang === 'ar' ? 'text-right' : ''}>
                    <p className="text-gray-500 text-xs mb-0.5">{lang === 'ar' ? 'التوفر' : 'Availability'}</p>
                    <p className="text-white font-semibold text-sm">{lang === 'ar' ? 'عالمي · 24/7' : 'Global · 24/7'}</p>
                  </div>
                </div>

                {/* Trust indicators */}
                <div className={`mt-4 p-5 rounded-2xl border border-[#25d366]/15 bg-[#25d366]/5 backdrop-blur-xl max-w-xs ${lang === 'ar' ? 'text-right' : ''}`}>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {lang === 'ar'
                      ? <>موثوق من <span className="text-white font-semibold">+200 شركة</span> في <span className="text-white font-semibold">+50 دولة</span>. جميع المشاريع محمية بـ NDA صارم.</>
                      : <>Trusted by <span className="text-white font-semibold">200+ companies</span> across <span className="text-white font-semibold">50+ countries</span>. All projects protected under strict NDA.</>
                    }
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>


        </motion.div>
      ) : (
        /* ── Subpage Layout ── */
        <SubpageLayout
          route={route}
          lang={lang}
          dir={t.dir}
          navigateTo={navigateTo}
          navTo={navTo}
          setLang={setLang}
        />
      )}
    </div>
  );
}

// ─── Subpage Layout Component ─────────────────────────────────────────────────
function SubpageLayout({
  route, lang, dir, navigateTo, navTo, setLang
}: {
  route: string;
  lang: 'en' | 'ar';
  dir: 'ltr' | 'rtl';
  navigateTo: (r: string) => void;
  navTo: (i: number) => void;
  setLang: (fn: (l: 'en' | 'ar') => 'en' | 'ar') => void;
}) {
  const page = getPageData(route);
  const isAr = lang === 'ar';

  if (!page) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-6 text-center pt-28">
        <h1 className="text-4xl font-black text-white">{isAr ? 'الصفحة غير موجودة' : '404 — Page Not Found'}</h1>
        <p className="text-gray-400 text-lg">{isAr ? 'هذه الصفحة غير متاحة.' : 'This page could not be found.'}</p>
        <button
          onClick={() => navigateTo('/')}
          className="px-8 py-3 rounded-xl bg-[#155dfc] text-white font-bold hover:bg-[#1245d0] transition-all cursor-pointer"
        >
          {isAr ? 'العودة للرئيسية' : 'Back to Home'}
        </button>
      </div>
    );
  }

  const breadcrumbs = isAr ? page.breadcrumbsAr : page.breadcrumbs;
  const h1 = isAr ? page.h1Ar : page.h1;
  const description = isAr ? page.descriptionAr : page.description;
  const aiSummary = isAr ? page.aiSummaryAr : page.aiSummary;
  const details = isAr ? page.detailsAr : page.details;
  const faqs = isAr ? page.faqsAr : page.faqs;

  return (
    <div dir={dir} className={`pt-24 pb-20 px-6 md:px-16 lg:px-24 max-w-5xl mx-auto ${isAr ? 'text-right' : ''}`}>

      {/* ── Breadcrumb ── */}
      <nav aria-label="breadcrumb" className={`flex flex-wrap gap-2 items-center text-xs font-mono text-gray-500 mb-8 ${isAr ? 'flex-row-reverse justify-end' : ''}`}>
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-gray-700">{isAr ? '←' : '→'}</span>}
            {i === 0
              ? <button onClick={() => navigateTo('/')} className="hover:text-[#3b82f6] cursor-pointer transition-colors">{crumb}</button>
              : <span className={i === breadcrumbs.length - 1 ? 'text-[#3b82f6] font-semibold' : 'text-gray-400'}>{crumb}</span>
            }
          </span>
        ))}
      </nav>

      {/* ── H1 ── */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="font-display text-3xl sm:text-5xl lg:text-[3.5rem] font-black leading-[1.1] tracking-tight mb-6 text-white"
      >
        {h1}
      </motion.h1>

      {/* ── Description ── */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="text-gray-300 text-lg md:text-xl leading-relaxed mb-10 max-w-3xl"
      >
        {description}
      </motion.p>

      {/* ── Stats Row ── */}
      {page.stats && page.stats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12"
        >
          {page.stats.map((stat, i) => (
            <div key={i} className="relative p-5 rounded-2xl border border-white/8 bg-[#030b20]/60 backdrop-blur-xl overflow-hidden group hover:border-blue-500/30 transition-all">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#155dfc]/60 to-transparent" />
              <p className="font-display text-3xl font-black text-white mb-1">{stat.value}</p>
              <p className="text-[#3b82f6] text-xs font-semibold uppercase tracking-wider">{isAr ? stat.labelAr : stat.label}</p>
            </div>
          ))}
        </motion.div>
      )}

      {/* ── AI Answer Extraction Block ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative p-6 md:p-8 rounded-2xl border border-[#155dfc]/30 bg-[#0a1435]/60 backdrop-blur-xl mb-12 overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#155dfc] to-transparent shadow-[0_0_20px_rgba(21,93,252,0.6)]" />
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#155dfc]/10 rounded-full blur-2xl pointer-events-none" />
        <div className={`flex items-center gap-2 mb-4 text-[#3b82f6] ${isAr ? 'flex-row-reverse' : ''}`}>
          <span className="w-2 h-2 bg-[#155dfc] rounded-full animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-[0.3em]">
            {isAr ? 'ملخص الذكاء الاصطناعي' : 'AI Answer Block'}
          </span>
        </div>
        <p className="text-gray-200 text-base md:text-lg leading-[1.8] font-light relative z-10">
          {aiSummary}
        </p>
      </motion.div>

      {/* ── Details ── */}
      {details && details.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mb-12"
        >
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
            {isAr ? 'تفاصيل الخدمة' : 'Service Details'}
          </h2>
          <ul className="flex flex-col gap-4">
            {details.map((detail, i) => (
              <li key={i} className={`flex items-start gap-4 p-5 rounded-xl border border-white/6 bg-[#030b20]/40 backdrop-blur-md hover:border-blue-500/20 transition-all ${isAr ? 'flex-row-reverse text-right' : ''}`}>
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#155dfc]/20 border border-[#155dfc]/40 flex items-center justify-center mt-0.5">
                  <span className="w-2 h-2 bg-[#155dfc] rounded-full" />
                </span>
                <span className="text-gray-300 text-sm md:text-base leading-relaxed">{detail}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* ── FAQ Section ── */}
      {faqs && faqs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-14"
        >
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
            {isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </h2>
          <div className="flex flex-col gap-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group border border-white/8 rounded-2xl bg-[#030b20]/50 backdrop-blur-md overflow-hidden hover:border-blue-500/20 transition-all">
                <summary className={`flex items-center justify-between p-5 cursor-pointer list-none text-white font-semibold text-sm md:text-base ${isAr ? 'flex-row-reverse text-right' : ''}`}>
                  <span>{faq.q}</span>
                  <span className="text-[#3b82f6] text-xl font-light flex-shrink-0 ml-3 group-open:rotate-45 transition-transform duration-200">+</span>
                </summary>
                <p className={`px-5 pb-5 text-gray-400 text-sm leading-relaxed ${isAr ? 'text-right' : ''}`}>
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── CTA Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35 }}
        className="relative p-8 md:p-10 rounded-3xl border border-[#155dfc]/25 bg-gradient-to-br from-[#0a1435] to-[#000d26] overflow-hidden text-center"
      >
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-40 bg-[#155dfc]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#155dfc]/70 to-transparent" />
        <p className="text-[#3b82f6] text-xs font-mono font-bold uppercase tracking-[0.3em] mb-3">
          {isAr ? 'ابدأ مشروعك الآن' : 'Launch Your Project'}
        </p>
        <h2 className="text-2xl md:text-3xl font-black text-white mb-4 relative z-10">
          {isAr ? 'جاهز للبدء؟ تواصل معنا الآن.' : 'Ready to Build Something Elite?'}
        </h2>
        <p className="text-gray-400 text-sm md:text-base mb-8 max-w-lg mx-auto relative z-10">
          {isAr
            ? 'تواصل مع مهندسينا ومصممينا للبدء في تصميم وبرمجة منصتك الرقمية بأعلى مستوى من الجودة والاحترافية.'
            : 'Connect with our architects and begin engineering your premium digital platform today.'}
        </p>
        <div className={`flex flex-wrap gap-3 justify-center ${isAr ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={() => { navigateTo('/'); navTo(8); }}
            className="px-8 py-3.5 rounded-xl bg-[#155dfc] hover:bg-[#1245d0] text-white font-bold text-sm transition-all shadow-[0_0_30px_rgba(21,93,252,0.4)] hover:shadow-[0_0_50px_rgba(21,93,252,0.6)] cursor-pointer"
          >
            {isAr ? 'تواصل معنا' : 'Contact Us'}
          </button>
          <a
            href="https://wa.me/201508997798"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-xl bg-[#25d366] hover:bg-[#1ebe5a] text-white font-bold text-sm transition-all shadow-[0_0_25px_rgba(37,211,102,0.3)] cursor-pointer flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {isAr ? 'واتساب' : 'WhatsApp'}
          </a>
        </div>
      </motion.div>

    </div>
  );
}
