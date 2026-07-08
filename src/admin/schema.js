// pages: which site pages use this section.
// Used by the admin to show page-filtered cards.
export const schema = [
  {
    title: 'כותרת ראשית (Hero)',
    pages: ['home'],
    fields: [
      { path: 'hero.badge', label: 'תגית עליונה' },
      { path: 'hero.titleLine1', label: 'כותרת — שורה 1' },
      { path: 'hero.titleLine2', label: 'כותרת — שורה 2' },
      { path: 'hero.titleAccent', label: 'כותרת — שורה מודגשת' },
      { path: 'hero.subtitle', label: 'כותרת משנה' },
      { path: 'hero.desc', label: 'תיאור', type: 'textarea' },
      { path: 'hero.ctaPrimary', label: 'כפתור ראשי' },
      { path: 'hero.ctaSecondary', label: 'כפתור משני' },
    ],
  },
  {
    title: 'כותרות דפים (Page Heroes)',
    pages: ['services', 'work', 'tools', 'about', 'news', 'contact'],
    fields: [
      { path: 'pageHero.services.kicker', label: 'שירותים — תגית' },
      { path: 'pageHero.services.title', label: 'שירותים — כותרת' },
      { path: 'pageHero.services.desc', label: 'שירותים — תיאור', type: 'textarea' },
      { path: 'pageHero.work.kicker', label: 'עבודות — תגית' },
      { path: 'pageHero.work.title', label: 'עבודות — כותרת' },
      { path: 'pageHero.work.desc', label: 'עבודות — תיאור', type: 'textarea' },
      { path: 'pageHero.tools.kicker', label: 'כלים — תגית' },
      { path: 'pageHero.tools.title', label: 'כלים — כותרת' },
      { path: 'pageHero.tools.desc', label: 'כלים — תיאור', type: 'textarea' },
      { path: 'pageHero.about.kicker', label: 'אודות — תגית' },
      { path: 'pageHero.about.title', label: 'אודות — כותרת' },
      { path: 'pageHero.about.desc', label: 'אודות — תיאור', type: 'textarea' },
      { path: 'pageHero.news.kicker', label: 'חדשות — תגית' },
      { path: 'pageHero.news.title', label: 'חדשות — כותרת' },
      { path: 'pageHero.news.desc', label: 'חדשות — תיאור', type: 'textarea' },
      { path: 'pageHero.contact.kicker', label: 'יצירת קשר — תגית' },
      { path: 'pageHero.contact.title', label: 'יצירת קשר — כותרת' },
      { path: 'pageHero.contact.desc', label: 'יצירת קשר — תיאור', type: 'textarea' },
    ],
  },
  {
    title: 'לקוחות (Clients)',
    pages: ['home', 'global'],
    fields: [
      { path: 'clients.label', label: 'כותרת הפס' },
    ],
    lists: [
      {
        path: 'clients.items',
        label: 'לוגואים של לקוחות',
        batchUpload: true,
        template: { name: 'שם לקוח', logo: '' },
        itemFields: [
          { key: 'name', label: 'שם' },
          { key: 'logo', label: 'לוגו', type: 'image-upload' },
        ],
      },
    ],
  },
  {
    title: 'שירותים (Services)',
    pages: ['home', 'services'],
    fields: [
      { path: 'services.tag', label: 'תגית' },
      { path: 'services.title', label: 'כותרת' },
      { path: 'services.subtitle', label: 'כותרת משנה', type: 'textarea' },
    ],
    lists: [
      {
        path: 'services.items',
        label: 'פריטי שירות',
        template: { num: '00', title: 'שירות חדש', desc: 'תיאור קצר', body: '', image: '' },
        itemFields: [
          { key: 'num', label: 'מספר' },
          { key: 'title', label: 'כותרת' },
          { key: 'desc', label: 'תיאור קצר', type: 'textarea' },
          { key: 'body', label: 'תיאור מלא (לדף פרטי)', type: 'textarea' },
          { key: 'image', label: 'תמונה', type: 'image-upload' },
        ],
      },
    ],
  },
  {
    title: 'עבודות (Work)',
    pages: ['home', 'work'],
    fields: [
      { path: 'work.tag', label: 'תגית' },
      { path: 'work.title', label: 'כותרת' },
      { path: 'work.subtitle', label: 'כותרת משנה', type: 'textarea' },
      { path: 'work.viewAll', label: 'כפתור "לכל העבודות"' },
    ],
    lists: [
      {
        path: 'work.items',
        label: 'פרויקטים',
        template: { name: 'פרויקט חדש', cat: 'קטגוריה', metric: 'מדד', image: '', body: '' },
        itemFields: [
          { key: 'name', label: 'שם' },
          { key: 'cat', label: 'קטגוריה' },
          { key: 'metric', label: 'מדד' },
          { key: 'image', label: 'תמונה', type: 'image-upload' },
          { key: 'body', label: 'תיאור מלא', type: 'textarea' },
        ],
      },
    ],
  },
  {
    title: 'המלצות (Testimonials)',
    pages: ['home', 'work', 'about'],
    fields: [
      { path: 'testimonials.tag', label: 'תגית' },
      { path: 'testimonials.title', label: 'כותרת' },
    ],
    lists: [
      {
        path: 'testimonials.items',
        label: 'המלצות לקוחות',
        template: { quote: '', name: 'שם הממליץ', role: 'תפקיד · חברה', avatar: '', companyLogo: '' },
        itemFields: [
          { key: 'name', label: 'שם הממליץ' },
          { key: 'role', label: 'תפקיד · חברה' },
          { key: 'quote', label: 'תוכן ההמלצה', type: 'textarea' },
          { key: 'avatar', label: 'תמונת הממליץ', type: 'image-upload' },
          { key: 'companyLogo', label: 'לוגו החברה', type: 'image-upload' },
        ],
      },
    ],
  },
  {
    title: 'כלים (Tools)',
    pages: ['home', 'tools'],
    fields: [
      { path: 'tools.tag', label: 'תגית' },
      { path: 'tools.title', label: 'כותרת' },
      { path: 'tools.subtitle', label: 'כותרת משנה', type: 'textarea' },
    ],
    lists: [
      {
        path: 'tools.items',
        label: 'כלים',
        template: { name: 'כלי חדש', desc: 'תיאור', body: '', url: '', icon: '' },
        itemFields: [
          { key: 'icon', label: 'אייקון (emoji)' },
          { key: 'name', label: 'שם' },
          { key: 'desc', label: 'תיאור קצר', type: 'textarea' },
          { key: 'body', label: 'תיאור מלא (לדף פרטי)', type: 'textarea' },
          { key: 'url', label: 'קישור חיצוני (URL)' },
        ],
      },
    ],
  },
  {
    title: 'מספרים (Stats)',
    pages: ['home', 'services', 'about'],
    fields: [
      { path: 'stats.tag', label: 'תגית' },
      { path: 'stats.title', label: 'כותרת' },
    ],
    lists: [
      {
        path: 'stats.items',
        label: 'נתונים',
        template: { num: '0+', label: 'תווית' },
        itemFields: [
          { key: 'num', label: 'מספר' },
          { key: 'label', label: 'תווית' },
        ],
      },
    ],
  },
  {
    title: 'המלצות (Testimonials)',
    pages: ['home', 'work', 'about'],
    fields: [
      { path: 'testimonials.tag', label: 'תגית' },
      { path: 'testimonials.title', label: 'כותרת' },
    ],
    lists: [
      {
        path: 'testimonials.items',
        label: 'המלצות',
        template: { quote: 'ציטוט', name: 'שם', role: 'תפקיד', avatar: '', companyLogo: '' },
        itemFields: [
          { key: 'quote', label: 'ציטוט', type: 'textarea' },
          { key: 'name', label: 'שם' },
          { key: 'role', label: 'תפקיד' },
          { key: 'avatar', label: 'תמונת ממליץ', type: 'image-upload' },
          { key: 'companyLogo', label: 'לוגו חברה', type: 'image-upload' },
        ],
      },
    ],
  },
  {
    title: 'אודות / הכירו (About)',
    pages: ['home', 'about'],
    fields: [
      { path: 'meet.tag', label: 'תגית' },
      { path: 'meet.kicker', label: 'מילת פתיחה' },
      { path: 'meet.name', label: 'שם' },
      { path: 'meet.role', label: 'תפקיד' },
      { path: 'meet.cta', label: 'כפתור' },
    ],
    lists: [
      {
        path: 'meet.bio',
        label: 'פסקאות ביוגרפיה',
        template: 'פסקה חדשה',
        stringList: true,
      },
    ],
  },
  {
    title: 'חדשות ותובנות (Blog)',
    pages: ['news'],
    fields: [
      { path: 'news.readMore', label: 'כפתור "קראו עוד"' },
    ],
    lists: [
      {
        path: 'news.items',
        label: 'מאמרים',
        template: { tag: 'קטגוריה', date: 'תאריך', title: 'כותרת', excerpt: 'תקציר', image: '', body: '', sourceUrl: '', lang: 'he' },
        itemFields: [
          { key: 'tag', label: 'קטגוריה' },
          { key: 'date', label: 'תאריך' },
          { key: 'title', label: 'כותרת' },
          { key: 'excerpt', label: 'תקציר', type: 'textarea' },
          { key: 'image', label: 'תמונה', type: 'image-upload' },
          { key: 'body', label: 'תוכן מלא', type: 'textarea' },
          { key: 'sourceUrl', label: 'קישור מקור (LinkedIn / אחר)', type: 'linkedin-import' },
          { key: 'lang', label: 'שפת המאמר (he/en/...)', type: 'text-shared' },
        ],
      },
    ],
  },
  {
    title: 'מדיה (Press Coverage)',
    pages: ['news'],
    fields: [
      { path: 'media.tag', label: 'תגית' },
      { path: 'media.title', label: 'כותרת' },
      { path: 'media.subtitle', label: 'תת-כותרת', type: 'textarea' },
    ],
    lists: [
      {
        path: 'media.items',
        label: 'כתבות מדיה',
        template: { source: 'שם מקור', sourceLogo: '', sourceUrl: '', title: 'כותרת הכתבה', excerpt: 'תיאור קצר', date: 'תאריך', image: '' },
        itemFields: [
          { key: 'source', label: 'שם מקור (CNN, Forbes...)' },
          { key: 'date', label: 'תאריך' },
          { key: 'title', label: 'כותרת הכתבה' },
          { key: 'excerpt', label: 'תיאור קצר', type: 'textarea' },
          { key: 'sourceUrl', label: 'קישור לכתבה המקורית' },
          { key: 'sourceLogo', label: 'לוגו מקור', type: 'image-upload' },
          { key: 'image', label: 'תמונת כתבה', type: 'image-upload' },
        ],
      },
    ],
  },
  {
    title: 'יצירת קשר (Contact)',
    pages: ['contact'],
    fields: [
      { path: 'contact.tag', label: 'תגית' },
      { path: 'contact.title', label: 'כותרת' },
      { path: 'contact.desc', label: 'תיאור', type: 'textarea' },
      { path: 'contact.emailAddress', label: 'כתובת אימייל' },
      { path: 'contact.location', label: 'מיקום' },
      { path: 'contact.submit', label: 'כפתור שליחה' },
    ],
  },
  {
    title: 'פוטר ורשתות חברתיות (Footer & Social)',
    pages: ['global'],
    fields: [
      { path: 'footer.tagline', label: 'תגית פוטר' },
      { path: 'footer.social.linkedin', label: 'LinkedIn URL' },
      { path: 'footer.social.twitter', label: 'X / Twitter URL' },
      { path: 'footer.social.instagram', label: 'Instagram URL' },
    ],
  },
]
