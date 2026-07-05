import { Link } from 'react-router-dom'
import Page from '../components/Page'
import Stats from '../components/Stats'
import CTA from '../components/CTA'
import Reveal from '../components/Reveal'
import { useLang } from '../i18n/LanguageContext'

const PILLARS_HE = [
  {
    num: '01',
    title: 'AI נגיש לכולם',
    body: 'בינה מלאכותית לא צריכה להיות נחלתם של מומחים בלבד. אנחנו מאמינים שכל עובד, בכל מחלקה ובכל ארגון, יכול ללמוד להשתמש בכלים חכמים ולהפוך אותם לחלק מהיומיום שלו.',
    accent: '#00A47C',
  },
  {
    num: '02',
    title: 'מידע הופך לפעולה',
    body: 'הנתונים כבר קיימים בכל ארגון. החזון שלנו הוא לעזור לארגונים להפוך את הנתונים האלה לתובנות מיידיות ולהחלטות טובות יותר — מהר יותר ממה שאי פעם היה אפשרי.',
    accent: '#5BCDDA',
  },
  {
    num: '03',
    title: 'טרנספורמציה אמיתית',
    body: 'לא עוד סדנאות שנשכחות ביום למחרת. אנחנו בונים תהליכי שינוי עמוקים שמשתרשים בתרבות הארגונית ויוצרים ערך מדיד לאורך זמן.',
    accent: '#8b5cf6',
  },
]

const PILLARS_EN = [
  {
    num: '01',
    title: 'AI Accessible to Everyone',
    body: 'Artificial intelligence should not belong only to experts. We believe every employee, in every department of every organization, can learn to use smart tools and make them part of their daily work.',
    accent: '#00A47C',
  },
  {
    num: '02',
    title: 'Data Becomes Action',
    body: 'The data already exists in every organization. Our vision is to help organizations turn that data into immediate insights and better decisions — faster than was ever possible.',
    accent: '#5BCDDA',
  },
  {
    num: '03',
    title: 'Real Transformation',
    body: 'No more workshops that are forgotten the next day. We build deep change processes that take root in organizational culture and create measurable value over time.',
    accent: '#8b5cf6',
  },
]

export default function Vision() {
  const { t } = useLang()
  const isRtl = t.dir === 'rtl'
  const pillars = isRtl ? PILLARS_HE : PILLARS_EN

  return (
    <Page>
      {/* breadcrumb */}
      <div className="vision__breadcrumb">
        <Link to="/about" className="vision__back">{isRtl ? 'אודות' : 'About'}</Link>
        <span className="vision__sep">/</span>
        <span className="vision__current">{isRtl ? 'חזון' : 'Vision'}</span>
      </div>

      {/* hero text */}
      <div className="vision__hero">
        <Reveal variant="fade">
          <span className="section__tag">{isRtl ? 'החזון שלנו' : 'Our Vision'}</span>
        </Reveal>
        <Reveal variant="up" delay={0.06}>
          <h1 className="vision__title">
            {isRtl ? 'לאן אנחנו הולכים' : 'Where We Are Headed'}
          </h1>
        </Reveal>
        <Reveal variant="up" delay={0.12}>
          <p className="vision__lead">
            {isRtl
              ? 'אנחנו מאמינים שהדרך לעתיד הארגוני עוברת דרך אנשים — לא רק טכנולוגיה. המשימה שלנו היא לחבר בין השניים בצורה שיוצרת ערך אמיתי.'
              : 'We believe the path to the organizational future runs through people — not just technology. Our mission is to connect the two in a way that creates real value.'}
          </p>
        </Reveal>
      </div>

      {/* pillars */}
      <div className="vision__pillars">
        {pillars.map((p, i) => (
          <Reveal key={p.num} variant="up" delay={i * 0.1} className="vision__pillar">
            <div className="vision__pillar-num" style={{ color: p.accent }}>{p.num}</div>
            <div className="vision__pillar-line" style={{ background: p.accent }} />
            <h3 className="vision__pillar-title">{p.title}</h3>
            <p className="vision__pillar-body">{p.body}</p>
          </Reveal>
        ))}
      </div>

      {/* pull-quote */}
      <Reveal variant="up" delay={0.1} className="vision__quote-wrap">
        <blockquote className="vision__quote">
          {isRtl
            ? '"הבינה המלאכותית לא באה להחליף אנשים — היא באה לשחרר אותם לעשות את מה שרק הם יכולים."'
            : '"Artificial intelligence is not here to replace people — it is here to free them to do what only they can."'}
          <cite className="vision__cite">{isRtl ? '— דורון אזרן' : '— Doron Azran'}</cite>
        </blockquote>
      </Reveal>

      <Stats />
      <CTA />

      <style>{`
        .vision__breadcrumb {
          display: flex; align-items: center; gap: 10px;
          max-width: 1320px; margin: 140px auto 0; padding: 0 40px 48px;
          font-size: 14px; color: var(--ink-faint);
        }
        .vision__back { color: var(--neon-cyan); font-weight: 600; transition: opacity 0.2s; }
        .vision__back:hover { opacity: 0.7; }
        .vision__sep { opacity: 0.35; }
        .vision__current { color: var(--ink-faint); }

        .vision__hero {
          max-width: 800px; margin: 0 auto; padding: 0 40px 80px;
          display: flex; flex-direction: column; gap: 20px;
        }
        .vision__title {
          font-family: var(--font-display); font-size: clamp(36px, 6vw, 64px);
          font-weight: 900; color: #fff; line-height: 1.1;
        }
        .vision__lead {
          font-size: 19px; line-height: 1.7; color: rgba(255,255,255,0.65);
          max-width: 640px;
        }

        .vision__pillars {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 40px; max-width: 1200px; margin: 0 auto; padding: 0 40px 80px;
        }
        .vision__pillar {
          display: flex; flex-direction: column; gap: 16px;
        }
        .vision__pillar-num {
          font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 800;
          letter-spacing: 0.1em;
        }
        .vision__pillar-line {
          width: 40px; height: 3px; border-radius: 2px;
        }
        .vision__pillar-title {
          font-family: var(--font-display); font-size: 22px; font-weight: 800; color: #fff;
          line-height: 1.2;
        }
        .vision__pillar-body {
          font-size: 15px; line-height: 1.75; color: rgba(255,255,255,0.6);
        }

        .vision__quote-wrap {
          max-width: 760px; margin: 0 auto; padding: 0 40px 100px;
        }
        .vision__quote {
          font-family: var(--font-display); font-size: clamp(20px, 3vw, 28px);
          font-weight: 700; line-height: 1.45; color: rgba(255,255,255,0.85);
          border-inline-start: 4px solid var(--primary);
          padding-inline-start: 28px; margin: 0;
          display: flex; flex-direction: column; gap: 20px;
        }
        .vision__cite {
          font-size: 15px; font-weight: 500; color: var(--primary-hover);
          font-style: normal;
        }

        @media (max-width: 900px) {
          .vision__pillars { grid-template-columns: 1fr; gap: 32px; }
          .vision__breadcrumb { padding: 0 24px 32px; margin-top: 120px; }
          .vision__hero { padding: 0 24px 60px; }
          .vision__pillars { padding: 0 24px 60px; }
          .vision__quote-wrap { padding: 0 24px 80px; }
        }
      `}</style>
    </Page>
  )
}
