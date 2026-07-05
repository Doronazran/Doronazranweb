import { Link } from 'react-router-dom'
import Page from '../components/Page'
import Seo from '../components/Seo'
import PageHero from '../components/PageHero'
import Stats from '../components/Stats'
import Testimonials from '../components/Testimonials'
import CTA from '../components/CTA'
import Reveal from '../components/Reveal'
import { useLang } from '../i18n/LanguageContext'

export default function AboutPage() {
  const { t } = useLang()
  const h = t.pageHero.about
  const isRtl = t.dir === 'rtl'

  const sections = isRtl
    ? [
        {
          to: '/about/overview',
          num: '01',
          title: 'אודותינו',
          desc: 'איך הכל התחיל — החזון, הגישה והערכים שמניעים את העבודה שלנו מאז יום הראשון.',
          accent: '#00A47C',
        },
        {
          to: '/about/vision',
          num: '02',
          title: 'חזון',
          desc: 'לאן אנחנו הולכים — המטרות הגדולות שמנחות כל החלטה שאנחנו מקבלים.',
          accent: '#e056b1',
        },
        {
          to: '/about/team',
          num: '03',
          title: 'הצוות',
          desc: 'האנשים שמאחורי הקלעים — כישרונות שמחברים עולמות.',
          accent: '#8b5cf6',
        },
        {
          to: '/about/doron',
          num: '04',
          title: 'תכירו את דורון אזרן',
          desc: 'הסיפור האישי, הניסיון והדרך שעשיתי מהאקדמיה לשטח.',
          accent: '#5BCDDA',
        },
      ]
    : [
        {
          to: '/about/overview',
          num: '01',
          title: 'About Us',
          desc: 'How it all started — the vision, approach and values that have driven our work from day one.',
          accent: '#00A47C',
        },
        {
          to: '/about/vision',
          num: '02',
          title: 'Vision',
          desc: 'Where we are headed — the big goals that guide every decision we make.',
          accent: '#e056b1',
        },
        {
          to: '/about/team',
          num: '03',
          title: 'The Team',
          desc: 'The people behind the scenes — talents bridging worlds.',
          accent: '#8b5cf6',
        },
        {
          to: '/about/doron',
          num: '04',
          title: 'Meet Doron Azran',
          desc: 'The personal story, experience and journey from academia to the field.',
          accent: '#5BCDDA',
        },
      ]

  return (
    <Page>
      <Seo
        title={h.title}
        description={h.desc}
        path="/about"
        breadcrumbs={[
          { name: isRtl ? 'בית' : 'Home', path: '/' },
          { name: h.title, path: '/about' },
        ]}
      />
      <PageHero kicker={h.kicker} title={h.title} desc={h.desc} accent="#e056b1" />

      <div className="about-hub__wrap">
        {sections.map((s, i) => (
          <Reveal key={i} variant="up" delay={i * 0.09}>
            <Link to={s.to} className="about-hub__card magnetic">
              <span className="about-hub__num" style={{ color: s.accent }}>{s.num}</span>
              <div className="about-hub__line" style={{ background: s.accent }} />
              <h2 className="about-hub__title">{s.title}</h2>
              <p className="about-hub__desc">{s.desc}</p>
              <span className="about-hub__cta" style={{ color: s.accent }}>
                {isRtl ? 'כנסו לדף' : 'View page'}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </Reveal>
        ))}
      </div>

      <Stats />
      <Testimonials />
      <CTA />

      <style>{`
        .about-hub__wrap {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 40px 100px;
        }
        .about-hub__card {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 48px 36px;
          background: var(--surface);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: var(--radius-xl);
          text-decoration: none;
          color: inherit;
          transition: transform 0.25s var(--easing), border-color 0.25s, box-shadow 0.25s;
          position: relative;
          overflow: hidden;
        }
        .about-hub__card::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0;
          background: radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.03), transparent 70%);
          transition: opacity 0.3s;
        }
        .about-hub__card:hover { transform: translateY(-8px); border-color: rgba(255,255,255,0.15); box-shadow: 0 28px 70px rgba(0,0,0,0.4); }
        .about-hub__card:hover::before { opacity: 1; }
        .about-hub__num {
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
        }
        .about-hub__line {
          width: 36px;
          height: 2px;
          border-radius: 2px;
          flex-shrink: 0;
        }
        .about-hub__title {
          font-family: var(--font-display);
          font-size: clamp(22px, 2.5vw, 30px);
          font-weight: 900;
          letter-spacing: -0.02em;
          color: var(--ink);
          line-height: 1.1;
        }
        .about-hub__desc {
          font-size: 15px;
          line-height: 1.75;
          color: var(--ink-muted);
          flex: 1;
        }
        .about-hub__cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.03em;
          margin-top: 8px;
          transition: gap 0.2s;
        }
        .about-hub__card:hover .about-hub__cta { gap: 10px; }
        :root[dir="rtl"] .about-hub__cta svg { transform: scaleX(-1); }

        @media (max-width: 1100px) { .about-hub__wrap { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 860px) { .about-hub__wrap { grid-template-columns: 1fr; } }
        @media (max-width: 600px) { .about-hub__wrap { padding: 0 24px 60px; } .about-hub__card { padding: 32px 24px; } }
      `}</style>
    </Page>
  )
}
