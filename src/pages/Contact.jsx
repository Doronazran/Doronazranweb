import { useSearchParams } from 'react-router-dom'
import Page from '../components/Page'
import Seo from '../components/Seo'
import PageHero from '../components/PageHero'
import ContactForm from '../components/Contact'
import { useLang } from '../i18n/LanguageContext'

export default function ContactPage() {
  const { t } = useLang()
  const h = t.pageHero.contact
  const [params] = useSearchParams()
  const preselect = params.get('inquiry') || ''

  return (
    <Page>
      <Seo
        title={h.title}
        description={h.desc}
        path="/contact"
        breadcrumbs={[
          { name: t.dir === 'rtl' ? 'בית' : 'Home', path: '/' },
          { name: h.title, path: '/contact' },
        ]}
      />
      <PageHero kicker={h.kicker} title={h.title} desc={h.desc} accent="#00A47C" />
      <ContactForm preselect={preselect} />
    </Page>
  )
}
