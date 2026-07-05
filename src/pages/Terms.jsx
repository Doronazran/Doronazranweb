import { Link } from 'react-router-dom'
import Page from '../components/Page'
import { useLang } from '../i18n/LanguageContext'

const CONTENT = {
  he: {
    kicker: 'משפטי',
    title: 'תנאי שימוש',
    updated: 'עודכן: יוני 2026',
    sections: [
      {
        title: '1. כללי',
        body: 'ברוכים הבאים לאתר doronazran.com ("האתר"), המופעל על ידי דורון אזרן ("אנחנו", "המפעיל"). הגלישה והשימוש באתר זה מהווים הסכמה מלאה לתנאי השימוש המפורטים להלן. אם אינכם מסכימים לתנאים אלה, אנא הימנעו משימוש באתר.',
      },
      {
        title: '2. שירותים המוצעים',
        body: 'האתר משמש כלי לקידום וייצוג שירותי ייעוץ, סדנאות והרצאות בתחום הבינה המלאכותית. הפרטים, התכנים, ותיאורי השירותים המופיעים באתר הם לצורך מידע כללי בלבד ואינם מהווים התחייבות חוזית.',
      },
      {
        title: '3. קניין רוחני',
        body: 'כל התכנים המופיעים באתר — לרבות טקסטים, תמונות, לוגואים, עיצוב גרפי, קוד תוכנה ומצגות — הם רכושו הבלעדי של דורון אזרן, אלא אם צוין אחרת. חל איסור מוחלט על העתקה, שכפול, פרסום או שימוש בכל תוכן מהאתר ללא אישור בכתב מראש.',
      },
      {
        title: '4. הגבלת אחריות',
        body: 'המפעיל אינו אחראי לנזק ישיר, עקיף, מקרי או תוצאתי הנובע משימוש באתר או מחוסר יכולת לעשות שימוש בו. האתר מסופק "כפי שהוא" (AS IS) ללא כל אחריות מפורשת או משתמעת. מידע באתר עשוי להשתנות ואינו תחליף לייעוץ מקצועי.',
      },
      {
        title: '5. קישורים לאתרים חיצוניים',
        body: 'האתר עשוי לכלול קישורים לאתרים חיצוניים. אנו אינם אחראים לתכנים, למדיניות הפרטיות או לפעולות של אתרים אלה. קישור לאתר חיצוני אינו מהווה המלצה או אישור של תכניו.',
      },
      {
        title: '6. שינויים בתנאי השימוש',
        body: 'אנו שומרים לעצמנו את הזכות לשנות תנאים אלה בכל עת. שינויים מהותיים יפורסמו בעמוד זה עם עדכון תאריך "עודכן". המשך השימוש באתר לאחר פרסום שינויים מהווה הסכמה לתנאים המעודכנים.',
      },
      {
        title: '7. דין ושיפוט',
        body: 'תנאי שימוש אלה כפופים לחוקי מדינת ישראל. כל מחלוקת תידון בבתי המשפט המוסמכים במחוז תל אביב-יפו, ישראל.',
      },
      {
        title: '8. יצירת קשר',
        body: 'לשאלות בנושא תנאי שימוש:\nדוא"ל: info@doronazran.com',
      },
    ],
  },
  en: {
    kicker: 'Legal',
    title: 'Terms of Use',
    updated: 'Updated: June 2026',
    sections: [
      {
        title: '1. General',
        body: 'Welcome to doronazran.com (the "Site"), operated by Doron Azran ("we", "the operator"). Browsing and using this site constitutes full agreement to the Terms of Use detailed below. If you do not agree to these terms, please refrain from using the Site.',
      },
      {
        title: '2. Services Offered',
        body: 'The Site serves as a tool for promoting and representing consulting, workshop and keynote services in the field of artificial intelligence. All details, content and service descriptions appearing on the Site are for general information purposes only and do not constitute a contractual commitment.',
      },
      {
        title: '3. Intellectual Property',
        body: 'All content on the Site — including texts, images, logos, graphic design, software code and presentations — is the sole property of Doron Azran, unless otherwise stated. Copying, reproducing, publishing or using any content from the Site without prior written permission is strictly prohibited.',
      },
      {
        title: '4. Limitation of Liability',
        body: 'The operator is not liable for direct, indirect, incidental or consequential damages arising from use of the Site or inability to use it. The Site is provided "AS IS" without any express or implied warranty. Information on the Site may change and does not substitute professional advice.',
      },
      {
        title: '5. External Links',
        body: 'The Site may include links to external websites. We are not responsible for the content, privacy policy or actions of those websites. Linking to an external site does not constitute an endorsement or approval of its content.',
      },
      {
        title: '6. Changes to Terms',
        body: 'We reserve the right to amend these terms at any time. Material changes will be published on this page with an updated "Updated" date. Continued use of the Site after changes are published constitutes acceptance of the updated terms.',
      },
      {
        title: '7. Governing Law',
        body: 'These Terms of Use are governed by the laws of the State of Israel. Any dispute will be adjudicated in the competent courts of the Tel Aviv-Jaffa district, Israel.',
      },
      {
        title: '8. Contact',
        body: 'For questions about the Terms of Use:\nEmail: info@doronazran.com',
      },
    ],
  },
}

export default function Terms() {
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
              {s.body && s.body.split('\n').map((line, i) => (
                <p key={i} className="legal-section__para">{line}</p>
              ))}
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
          margin-bottom: 4px;
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
