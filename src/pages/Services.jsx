import Page from '../components/Page'
import Seo from '../components/Seo'
import PageHero from '../components/PageHero'
import Services from '../components/Services'
import Stats from '../components/Stats'
import CTA from '../components/CTA'
import { useLang } from '../i18n/LanguageContext'

export default function ServicesPage() {
  const { t } = useLang()
  const h = t.pageHero.services
  return (
    <Page>
      <Seo
        title={h.title}
        description={h.desc}
        path="/services"
        breadcrumbs={[
          { name: t.dir === 'rtl' ? 'בית' : 'Home', path: '/' },
          { name: h.title, path: '/services' },
        ]}
      />
      <PageHero kicker={h.kicker} title={h.title} desc={h.desc} accent="#5BCDDA" />
      <Services />
      <Stats />
      <CTA />
    </Page>
  )
}
