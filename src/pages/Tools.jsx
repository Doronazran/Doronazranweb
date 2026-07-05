import Page from '../components/Page'
import PageHero from '../components/PageHero'
import AITools from '../components/AITools'
import CTA from '../components/CTA'
import { useLang } from '../i18n/LanguageContext'

export default function ToolsPage() {
  const { t } = useLang()
  const h = t.pageHero.tools
  return (
    <Page>
      <PageHero kicker={h.kicker} title={h.title} desc={h.desc} accent="#00A47C" />
      <AITools />
      <CTA />
    </Page>
  )
}
