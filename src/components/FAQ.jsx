import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Reveal from './Reveal'
import { useLang } from '../i18n/LanguageContext'

const FAQS_HE = [
  {
    q: 'כמה זמן לוקחת סדנת AI טיפוסית?',
    a: 'סדנה בסיסית נמשכת חצי יום (4 שעות), וסדנה מעמיקה יום שלם. לחברות שרוצות תהליך רחב יותר, אנחנו בונים סדרה של מפגשים לאורך מספר שבועות — עם תרגול בין המפגשים.',
  },
  {
    q: 'האם הסדנאות מתאימות לאנשים שלא מכירים AI בכלל?',
    a: 'בהחלט. הסדנאות מותאמות לכל רמה — מאנשים שמעולם לא השתמשו בכלי AI ועד לצוותים שרוצים להתעמק. רמת הקבוצה נקבעת מראש ומשפיעה על תוכן הסדנה.',
  },
  {
    q: 'מה ההבדל בין סדנה להרצאה?',
    a: 'הרצאה מועברת על בימה לקהל גדול ומתמקדת בהשראה ובחשיפה לעולם ה-AI. סדנה היא מפגש אינטראקטיבי קטן יותר שבו המשתתפים עובדים בפועל עם כלים — יוצאים עם מיומנויות ולא רק עם ידע.',
  },
  {
    q: 'האם ניתן לקבל ייעוץ שמתמקד ספציפית בשרשרת אספקה?',
    a: 'כן — שרשרת אספקה ותפעול הוא תחום ההתמחות הראשי שלי. אני עוסק בחיזוי ביקושים, אופטימיזציה של מלאי, ייעול לוגיסטי וצמצום עלויות מבוסס נתונים — עם ניסיון מעשי בחברות מובילות.',
  },
  {
    q: 'כמה עולה ייעוץ ראשוני?',
    a: 'פגישת היכרות וייעוץ ראשוני ניתנים ללא עלות וללא התחייבות. אני מאמין שצריך קודם להבין את הצרכים לפני שמדברים על מחיר.',
  },
  {
    q: 'האם פיתוח כלי AI מותאם מתאים גם לחברות קטנות?',
    a: 'כן. חלק מהכלים הטובים ביותר שפיתחתי היו עבור חברות בינוניות שרצו לייעל תהליך ספציפי — לא בהכרח פלטפורמה ארגונית שלמה. אנחנו תמיד מתאימים את הגודל לצורך.',
  },
  {
    q: 'כיצד מתחילים?',
    a: 'פשוט. שלחו פנייה דרך טופס יצירת הקשר, ציינו מה אתם מחפשים (הרצאה, סדנה, ייעוץ או ליווי ארגוני) — ואני אחזור אליכם תוך יום עסקים לקביעת שיחת היכרות.',
  },
]

const FAQS_EN = [
  {
    q: 'How long does a typical AI workshop take?',
    a: 'A foundational workshop runs half a day (4 hours), and a deeper one takes a full day. For companies wanting a broader process, we build a series of sessions over several weeks — with practice in between.',
  },
  {
    q: 'Are the workshops suitable for people with no AI background?',
    a: 'Absolutely. Workshops are adapted to every level — from people who have never used AI tools to teams wanting to go deeper. The group level is established in advance and shapes the content.',
  },
  {
    q: "What is the difference between a workshop and a keynote talk?",
    a: 'A keynote is delivered on a stage to a large audience, focusing on inspiration and exposure to the AI world. A workshop is a smaller interactive session where participants actually work with tools — leaving with skills, not just knowledge.',
  },
  {
    q: 'Can I get consulting focused specifically on supply chain?',
    a: 'Yes — supply chain and operations is my primary area of expertise. I work on demand forecasting, inventory optimization, logistics efficiency and data-driven cost reduction, with hands-on experience in leading companies.',
  },
  {
    q: 'How much does an initial consultation cost?',
    a: 'The first meeting and initial consultation are free, no strings attached. I believe you need to understand the needs first before talking about price.',
  },
  {
    q: 'Is custom AI tool development suitable for smaller companies?',
    a: 'Yes. Some of the best tools I have built were for mid-sized companies wanting to streamline a specific process — not necessarily a full enterprise platform. We always match the scope to the need.',
  },
  {
    q: 'How do we get started?',
    a: 'Simply send an inquiry through the contact form, mention what you are looking for (talk, workshop, consulting or organizational accompaniment) — and I will get back to you within one business day to schedule a discovery call.',
  },
]

export default function FAQ() {
  const { t } = useLang()
  const isRtl = t.dir === 'rtl'
  const faqs = isRtl ? FAQS_HE : FAQS_EN
  const [open, setOpen] = useState(null)

  return (
    <>
      <section className="section faq">
        <div className="section__inner">
          <Reveal variant="fade">
            <span className="section__tag">{isRtl ? 'שאלות נפוצות' : 'FAQ'}</span>
          </Reveal>
          <Reveal variant="up" delay={0.05}>
            <h2 className="section__title">{isRtl ? 'שאלות ותשובות' : 'Common Questions'}</h2>
          </Reveal>
          <Reveal variant="up" delay={0.1}>
            <p className="section__subtitle">
              {isRtl
                ? 'כל מה שרציתם לדעת לפני שמתחילים.'
                : 'Everything you wanted to know before getting started.'}
            </p>
          </Reveal>

          <div className="faq__list">
            {faqs.map((item, i) => {
              const isOpen = open === i
              return (
                <Reveal key={i} variant="up" delay={i * 0.04} className="faq__item">
                  <button
                    className={`faq__q ${isOpen ? 'faq__q--open' : ''}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq__num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="faq__q-text">{item.q}</span>
                    <span className={`faq__icon ${isOpen ? 'faq__icon--open' : ''}`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="faq__a-wrap"
                      >
                        <p className="faq__a">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <style>{`
        .faq { padding-bottom: 0; }
        .faq__list {
          margin-top: 56px;
          display: flex; flex-direction: column; gap: 0;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .faq__item { border-bottom: 1px solid rgba(255,255,255,0.08); }

        .faq__q {
          width: 100%; display: flex; align-items: center; gap: 20px;
          padding: 24px 0; background: none; border: none; cursor: pointer;
          text-align: start; transition: background 0.15s;
        }
        .faq__q:hover { background: rgba(255,255,255,0.02); }
        .faq__q--open { background: rgba(255,255,255,0.02); }

        .faq__num {
          font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 800;
          color: var(--primary-hover); letter-spacing: 0.1em; flex-shrink: 0; min-width: 28px;
        }
        .faq__q-text {
          flex: 1; font-family: var(--font-display); font-size: clamp(16px, 2.2vw, 20px);
          font-weight: 700; color: rgba(255,255,255,0.9); line-height: 1.3;
          text-align: start;
        }
        .faq__q--open .faq__q-text { color: #fff; }

        .faq__icon {
          flex-shrink: 0; color: rgba(255,255,255,0.4);
          transition: transform 0.3s ease, color 0.2s;
        }
        .faq__icon--open { transform: rotate(180deg); color: var(--primary-hover); }

        .faq__a-wrap { overflow: hidden; }
        .faq__a {
          padding: 0 0 24px 48px;
          font-size: 16px; line-height: 1.75;
          color: rgba(255,255,255,0.62);
        }

        @media (max-width: 640px) {
          .faq__q { gap: 14px; padding: 20px 0; }
          .faq__a { padding-inline-start: 0; }
        }
      `}</style>
    </>
  )
}
