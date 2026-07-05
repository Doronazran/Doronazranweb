import { Link } from 'react-router-dom'
import Page from '../components/Page'
import { useLang } from '../i18n/LanguageContext'

const CONTENT = {
  he: {
    kicker: 'פרטיות',
    title: 'מדיניות פרטיות',
    updated: 'עודכן: יוני 2026',
    sections: [
      {
        title: '1. כללי',
        body: 'מדיניות פרטיות זו מפרטת כיצד דורון אזרן ("אנחנו") אוסף, משתמש ומגן על מידע אישי שנאסף באתר doronazran.com. אנו מכבדים את פרטיותכם ומתחייבים לפעול בהתאם לחוק הגנת הפרטיות, תשמ"א-1981 ותיקוניו.',
      },
      {
        title: '2. מידע שנאסף',
        list: [
          'שם מלא ואימייל — כאשר ממלאים את טופס יצירת הקשר',
          'הודעה חופשית — תוכן הפנייה שנשלחה דרך הטופס',
          'נתוני גלישה — כתובת IP, סוג דפדפן, עמוד מבוקש (ללא זיהוי אישי)',
          'עוגיות טכניות — לצורך תפקוד תקין של האתר',
        ],
      },
      {
        title: '3. מטרות השימוש במידע',
        list: [
          'מענה לפניות ובקשות שנשלחו דרך הטופס',
          'ייצור קשר לצורך מתן שירות מבוקש',
          'שיפור חוויית המשתמש באתר',
          'ניתוח סטטיסטי של תנועת אתר (נתונים מצוברים בלבד)',
        ],
      },
      {
        title: '4. שיתוף מידע עם צדדים שלישיים',
        body: 'אנו לא מוכרים, סוחרים או מעבירים מידע אישי לצדדים שלישיים ללא הסכמתכם, למעט:\n\nספקי שירותים — כגון שירותי אחסון ואימייל — שמקבלים גישה מינימלית הכרחית לתפקוד.\nדרישות חוק — אם נדרשים לכך על פי צו שיפוטי או חוק.',
      },
      {
        title: '5. עוגיות (Cookies)',
        body: 'האתר משתמש בעוגיות טכניות הכרחיות לפעילותו התקינה (כגון שמירת הגדרות נגישות ושפה). אנו לא משתמשים בעוגיות מעקב שיווקי מצד שלישי.',
      },
      {
        title: '6. זכויות הגולש',
        body: 'בהתאם לחוק, יש לכם זכות:\n\n• לעיין במידע האישי השמור עליכם\n• לבקש תיקון מידע שגוי\n• לבקש מחיקת המידע ("זכות להישכח")\n• להגיש תלונה לרשות להגנת הפרטיות\n\nלמימוש זכויותיכם: info@doronazran.com',
      },
      {
        title: '7. שמירת מידע',
        body: 'מידע אישי שנמסר בטופס יצירת הקשר ייאחסן לפרק הזמן הנדרש לטיפול בפנייה ולא יתר על שנתיים. נתוני גלישה אנונימיים עשויים להישמר לפרק זמן ארוך יותר לצורכי ניתוח.',
      },
      {
        title: '8. אבטחת מידע',
        body: 'אנו נוקטים אמצעי אבטחה טכניים וארגוניים סבירים להגנה על המידע האישי. עם זאת, אין בידינו להבטיח אבטחה מוחלטת בסביבה הדיגיטלית.',
      },
      {
        title: '9. פניות ויצירת קשר',
        body: 'ממונה הפרטיות: דורון אזרן\nדוא"ל: info@doronazran.com\nזמן מענה: עד 14 יום',
      },
    ],
  },
  en: {
    kicker: 'Privacy',
    title: 'Privacy Policy',
    updated: 'Updated: June 2026',
    sections: [
      {
        title: '1. General',
        body: 'This Privacy Policy details how Doron Azran ("we") collects, uses and protects personal information collected on doronazran.com. We respect your privacy and are committed to acting in accordance with the Israeli Privacy Protection Law, 1981 and its amendments.',
      },
      {
        title: '2. Information We Collect',
        list: [
          'Full name and email — when filling out the contact form',
          'Free-text message — the content of the inquiry submitted via the form',
          'Browsing data — IP address, browser type, page requested (no personal identification)',
          'Technical cookies — for proper site functionality',
        ],
      },
      {
        title: '3. Purposes of Use',
        list: [
          'Responding to inquiries submitted via the contact form',
          'Contacting you to provide a requested service',
          'Improving the user experience on the site',
          'Statistical analysis of site traffic (aggregated data only)',
        ],
      },
      {
        title: '4. Sharing with Third Parties',
        body: 'We do not sell, trade or transfer personal information to third parties without your consent, except:\n\nService providers — such as hosting and email services — who receive only the minimal access required for operation.\nLegal requirements — if required by court order or applicable law.',
      },
      {
        title: '5. Cookies',
        body: 'The site uses only technical cookies necessary for its proper operation (such as saving accessibility and language preferences). We do not use third-party marketing tracking cookies.',
      },
      {
        title: '6. Your Rights',
        body: 'Under applicable law, you have the right to:\n\n• Review personal information stored about you\n• Request correction of inaccurate information\n• Request deletion of your information ("right to be forgotten")\n• File a complaint with the Israeli Privacy Protection Authority\n\nTo exercise your rights: info@doronazran.com',
      },
      {
        title: '7. Data Retention',
        body: 'Personal information provided via the contact form will be stored for the period required to handle the inquiry, and no longer than two years. Anonymous browsing data may be retained for a longer period for analysis purposes.',
      },
      {
        title: '8. Security',
        body: 'We employ reasonable technical and organizational security measures to protect personal information. However, we cannot guarantee absolute security in the digital environment.',
      },
      {
        title: '9. Contact',
        body: 'Privacy officer: Doron Azran\nEmail: info@doronazran.com\nResponse time: up to 14 days',
      },
    ],
  },
}

export default function Privacy() {
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
              {s.body && s.body.split('\n\n').map((block, i) => (
                <p key={i} className="legal-section__para">{block}</p>
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
          display: flex; flex-direction: column; gap: 36px;
        }
        .legal-section__title {
          font-family: var(--font-display);
          font-size: 1.05rem; font-weight: 700; color: #fff; margin-bottom: 10px;
        }
        .legal-section__para {
          font-size: 15px; line-height: 1.75; color: rgba(255,255,255,0.68);
          margin-bottom: 6px; white-space: pre-line;
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
          font-size: 14px; color: rgba(255,255,255,0.4); transition: color 0.2s;
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
