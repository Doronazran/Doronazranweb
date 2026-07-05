import { Link } from 'react-router-dom'
import Page from '../components/Page'
import Seo from '../components/Seo'
import MeetDoron from '../components/MeetDoron'
import Stats from '../components/Stats'
import CTA from '../components/CTA'
import Reveal from '../components/Reveal'
import { useLang } from '../i18n/LanguageContext'

export default function DoronProfile() {
  const { t } = useLang()
  const isRtl = t.dir === 'rtl'
  const m = t.meet

  return (
    <Page>
      <Seo
        title={isRtl ? 'תכירו את דורון אזרן' : 'Meet Doron Azran'}
        description={isRtl
          ? 'הסיפור, הניסיון והדרך של דורון אזרן — מומחה AI, שרשרת אספקה וחדשנות, מהאקדמיה לשטח.'
          : 'The story, experience and journey of Doron Azran — AI, supply chain and innovation expert, from academia to the field.'}
        path="/about/doron"
        breadcrumbs={[
          { name: isRtl ? 'בית' : 'Home', path: '/' },
          { name: isRtl ? 'אודות' : 'About', path: '/about' },
          { name: isRtl ? 'תכירו את דורון אזרן' : 'Meet Doron Azran', path: '/about/doron' },
        ]}
      />
      <div className="dp__breadcrumb">
        <Link to="/about" className="dp__back">
          {isRtl ? 'אודות' : 'About'}
        </Link>
        <span className="dp__sep">/</span>
        <span className="dp__current">{isRtl ? 'תכירו את דורון אזרן' : 'Meet Doron Azran'}</span>
      </div>

      <MeetDoron expanded />
      <Stats />
      <CTA />

      <style>{`
        .dp__breadcrumb {
          display: flex;
          align-items: center;
          gap: 10px;
          max-width: 1320px;
          margin: 140px auto 0;
          padding: 0 40px 48px;
          font-size: 14px;
          color: var(--ink-faint);
        }
        .dp__back {
          color: var(--neon-cyan);
          font-weight: 600;
          transition: opacity 0.2s;
        }
        .dp__back:hover { opacity: 0.7; }
        .dp__sep { opacity: 0.4; }
        .dp__current { color: var(--ink-faint); }
        @media (max-width: 600px) {
          .dp__breadcrumb { padding: 0 24px 32px; margin-top: 120px; }
        }
      `}</style>
    </Page>
  )
}
