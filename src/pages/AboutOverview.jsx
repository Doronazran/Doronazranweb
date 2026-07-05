import { Link } from 'react-router-dom'
import Page from '../components/Page'
import MeetDoron from '../components/MeetDoron'
import Stats from '../components/Stats'
import Testimonials from '../components/Testimonials'
import CTA from '../components/CTA'
import { useLang } from '../i18n/LanguageContext'

export default function AboutOverview() {
  const { t } = useLang()
  const isRtl = t.dir === 'rtl'

  return (
    <Page>
      <div className="aov__breadcrumb">
        <Link to="/about" className="aov__back">{isRtl ? 'אודות' : 'About'}</Link>
        <span className="aov__sep">/</span>
        <span className="aov__current">{isRtl ? 'אודות' : 'Overview'}</span>
      </div>

      <MeetDoron />
      <Stats />
      <Testimonials />
      <CTA />

      <style>{`
        .aov__breadcrumb {
          display: flex;
          align-items: center;
          gap: 10px;
          max-width: 1320px;
          margin: 140px auto 0;
          padding: 0 40px 48px;
          font-size: 14px;
          color: var(--ink-faint);
        }
        .aov__back { color: var(--neon-cyan); font-weight: 600; transition: opacity 0.2s; }
        .aov__back:hover { opacity: 0.7; }
        .aov__sep { opacity: 0.35; }
        .aov__current { color: var(--ink-faint); }
        @media (max-width: 600px) {
          .aov__breadcrumb { padding: 0 24px 32px; margin-top: 120px; }
        }
      `}</style>
    </Page>
  )
}
