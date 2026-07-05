import { lazy, Suspense } from 'react'
import Page from '../components/Page'
import Seo from '../components/Seo'
import VideoBackground from '../components/VideoBackground'
import HeroContent from '../components/HeroContent'

// Heavy three.js scene — split into its own chunk and loaded after first
// paint so it doesn't block initial render / hurt Core Web Vitals (LCP).
const Scene3D = lazy(() => import('../components/Scene3D'))
import ClientsMarquee from '../components/ClientsMarquee'
import Services from '../components/Services'
import Work from '../components/Work'
import PressReel from '../components/PressReel'
import Stats from '../components/Stats'
import MeetDoron from '../components/MeetDoron'
import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'
import CTA from '../components/CTA'
import { useLang } from '../i18n/LanguageContext'

export default function Home() {
  const { t } = useLang()
  const isRtl = t.dir === 'rtl'
  return (
    <Page>
      <Seo
        title={isRtl ? 'מומחה AI, שרשרת אספקה וחדשנות' : 'AI, Supply Chain & Innovation Expert'}
        description={isRtl
          ? 'דורון אזרן — סדנאות, הרצאות, ייעוץ והטמעת בינה מלאכותית לארגונים. הופכים את ה-AI ממילת באזז למנוע צמיחה אמיתי בשטח.'
          : 'Doron Azran — workshops, talks, consulting and AI adoption for organizations. Turning AI from a buzzword into a real growth engine on the ground.'}
        path="/"
      />
      <section id="hero" className="hero-section">
        <VideoBackground />
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>
        <HeroContent />
      </section>

      <ClientsMarquee />
      <Stats />
      <Services featured />
      <Work />
      <PressReel />
      <MeetDoron />
      <Testimonials />
      <FAQ />
      <CTA />
    </Page>
  )
}
