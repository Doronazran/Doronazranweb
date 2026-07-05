import { Link } from 'react-router-dom'
import Page from '../components/Page'
import { useLang } from '../i18n/LanguageContext'

const CONTENT = {
  he: {
    kicker: 'תקן ישראלי 5568',
    title: 'הצהרת נגישות',
    updated: 'עודכן לאחרונה: יוני 2026',
    sections: [
      {
        title: 'מחויבות לנגישות',
        body: `אתר doronazran.com מחויב להנגיש את תכניו לאנשים עם מוגבלויות, בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), תשע"ג-2013, ועל פי תקן ישראלי 5568 (המבוסס על WCAG 2.1 ברמת AA).`,
      },
      {
        title: 'רמת הנגישות',
        body: 'אנו שואפים לעמוד ברמת WCAG 2.1 AA. האתר תומך בניווט במקלדת בסיסי, שימוש בקורא מסך, ניגודיות צבע תקנית, ותיאורי alt לתמונות. חלק מהתכנים האינטראקטיביים (אנימציות תלת-מימד, שדה קלט עם הקלדה אוטומטית) עשויים להגביל חלקית את חווית הנגישות.',
      },
      {
        title: 'תכונות נגישות באתר',
        list: [
          'ניווט מלא במקלדת (Tab / Shift+Tab / Enter / Space)',
          'תוויות ARIA על אלמנטים אינטראקטיביים',
          'ניגודיות צבע תקנית בטקסטים ראשיים',
          'אפשרות להגדלת גודל הטקסט דרך תפריט הנגישות',
          'מצב ניגודיות גבוהה ומצב גוני אפור',
          'הכבדת אנימציות בהתאם להגדרת prefers-reduced-motion',
          'טקסט alt לכל התמונות הרלוונטיות',
          'מבנה כותרות היררכי (H1 → H2 → H3)',
        ],
      },
      {
        title: 'מגבלות ידועות',
        body: 'תוכן הווידאו ברקע הדף הראשי אינו מלווה בכתוביות. האנימציות התלת-מימדיות (עננת חלקיקי AI) עלולות להוות גירוי חזותי לרגישים לתנועה — ניתן לכבות אנימציות בתפריט הנגישות. נמשיך לשפר את הנגישות באופן שוטף.',
      },
      {
        title: 'פנייה בנושא נגישות',
        body: 'נתקלתם בבעיית נגישות? פנו אלינו ונפעל לתקנה בהקדם.\n\nרכז הנגישות: דורון אזרן\nדוא"ל: info@doronazran.com\nזמן מענה: עד 5 ימי עסקים',
      },
    ],
  },
  en: {
    kicker: 'Israeli Standard 5568',
    title: 'Accessibility Statement',
    updated: 'Last updated: June 2026',
    sections: [
      {
        title: 'Commitment to Accessibility',
        body: 'doronazran.com is committed to making its content accessible to people with disabilities, in accordance with Israeli Standard 5568 (based on WCAG 2.1 Level AA).',
      },
      {
        title: 'Accessibility Level',
        body: 'We aim to conform to WCAG 2.1 Level AA. The site supports basic keyboard navigation, screen reader usage, standard color contrast, and alt text for images. Some interactive content (3D animations, auto-typing chat bar) may partially limit the accessibility experience.',
      },
      {
        title: 'Accessibility Features',
        list: [
          'Full keyboard navigation (Tab / Shift+Tab / Enter / Space)',
          'ARIA labels on interactive elements',
          'Standard color contrast for primary text',
          'Font size control via the accessibility panel',
          'High contrast and grayscale modes',
          'Animation reduction honoring prefers-reduced-motion',
          'Alt text for all relevant images',
          'Hierarchical heading structure (H1 → H2 → H3)',
        ],
      },
      {
        title: 'Known Limitations',
        body: 'Background video on the home page does not include captions. The 3D particle animations may cause visual stimulation for motion-sensitive users — animations can be disabled in the accessibility panel. We will continue improving accessibility on an ongoing basis.',
      },
      {
        title: 'Contact for Accessibility',
        body: 'Encountered an accessibility issue? Contact us and we will address it promptly.\n\nAccessibility coordinator: Doron Azran\nEmail: info@doronazran.com\nResponse time: up to 5 business days',
      },
    ],
  },
}

export default function Accessibility() {
  const { lang } = useLang()
  const c = CONTENT[lang] || CONTENT.he

  return (
    <Page>
      <div className="legal-page">
        <div className="legal-hero">
          <span className="legal-kicker">{c.kicker}</span>
          <h1 className="legal-title">{c.title}</h1>
          <p className="legal-updated">{c.updated}</p>
        </div>

        <div className="legal-body">
          {c.sections.map((s) => (
            <div key={s.title} className="legal-section">
              <h2 className="legal-section__title">{s.title}</h2>
              {s.body && s.body.split('\n\n').map((para, i) => (
                <p key={i} className="legal-section__para">{para}</p>
              ))}
              {s.list && (
                <ul className="legal-section__list">
                  {s.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div className="legal-back">
            <Link to="/" className="legal-back-link">← {lang === 'he' ? 'חזרה לדף הבית' : 'Back to Home'}</Link>
          </div>
        </div>
      </div>

      <style>{`
        .legal-page { max-width: 860px; margin: 0 auto; padding: 160px 32px 100px; }

        .legal-hero { text-align: center; margin-bottom: 64px; }
        .legal-kicker {
          display: inline-block; margin-bottom: 14px; padding: 6px 16px;
          border: 1px solid rgba(91,205,218,.35); border-radius: 999px;
          font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--neon-cyan, #5bcdda);
        }
        .legal-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 800; color: #fff; margin-bottom: 12px; line-height: 1.1;
        }
        .legal-updated { font-size: 13px; color: rgba(255,255,255,0.35); }

        .legal-body {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 20px; padding: 48px;
          display: flex; flex-direction: column; gap: 40px;
        }
        .legal-section__title {
          font-family: var(--font-display);
          font-size: 1.15rem; font-weight: 700; color: #fff; margin-bottom: 12px;
        }
        .legal-section__para {
          font-size: 15px; line-height: 1.75; color: rgba(255,255,255,0.68);
          white-space: pre-line;
        }
        .legal-section__list {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 8px;
        }
        .legal-section__list li {
          font-size: 15px; color: rgba(255,255,255,0.68); line-height: 1.6;
          padding-inline-start: 20px; position: relative;
        }
        .legal-section__list li::before {
          content: '✓';
          position: absolute; inset-inline-start: 0;
          color: var(--neon-cyan, #5bcdda); font-size: 13px;
        }

        .legal-back { padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.07); }
        .legal-back-link {
          font-size: 14px; color: rgba(255,255,255,0.4);
          transition: color 0.2s;
        }
        .legal-back-link:hover { color: var(--neon-cyan, #5bcdda); }

        @media (max-width: 640px) {
          .legal-page { padding: 120px 16px 80px; }
          .legal-body { padding: 28px 22px; gap: 28px; }
        }
      `}</style>
    </Page>
  )
}
