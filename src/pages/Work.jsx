import Page from '../components/Page'
import Seo from '../components/Seo'
import PageHero from '../components/PageHero'
import Work from '../components/Work'
import Testimonials from '../components/Testimonials'
import CTA from '../components/CTA'
import { useLang } from '../i18n/LanguageContext'

export default function WorkPage() {
  const { t } = useLang()
  const h = t.pageHero.work
  return (
    <Page>
      <Seo
        title={h.title}
        description={h.desc}
        path="/work"
        breadcrumbs={[
          { name: t.dir === 'rtl' ? 'בית' : 'Home', path: '/' },
          { name: h.title, path: '/work' },
        ]}
      />
      <PageHero kicker={h.kicker} title={h.title} desc={h.desc} accent="#8b5cf6" />
      <Work />
      <Testimonials />
      <CTA />
    </Page>
  )
}
