import { Link } from 'react-router-dom'
import Page from '../components/Page'
import Seo from '../components/Seo'
import { useLang } from '../i18n/LanguageContext'

export default function NotFound() {
  const { t } = useLang()
  const isRtl = t.dir === 'rtl'

  return (
    <Page>
      <Seo
        title={isRtl ? 'הדף לא נמצא' : 'Page Not Found'}
        description={isRtl ? 'הדף שחיפשתם לא קיים.' : 'The page you were looking for does not exist.'}
        path="/404"
        noindex
      />
      <section className="nf">
        <span className="nf__code">404</span>
        <h1 className="nf__title">{isRtl ? 'הדף לא נמצא' : 'Page not found'}</h1>
        <p className="nf__desc">
          {isRtl
            ? 'הדף שחיפשתם הוסר, שונה, או שמעולם לא היה כאן.'
            : 'The page you were looking for was moved, removed, or never existed.'}
        </p>
        <div className="nf__actions">
          <Link to="/" className="nf__btn nf__btn--primary">{isRtl ? 'חזרה לדף הבית' : 'Back to home'}</Link>
          <Link to="/services" className="nf__btn">{isRtl ? 'לשירותים' : 'View services'}</Link>
          <Link to="/contact" className="nf__btn">{isRtl ? 'יצירת קשר' : 'Contact'}</Link>
        </div>
      </section>

      <style>{`
        .nf {
          max-width: 720px;
          margin: 0 auto;
          min-height: 70vh;
          padding: 160px 24px 100px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 18px;
        }
        .nf__code {
          font-family: var(--font-display);
          font-size: clamp(80px, 18vw, 160px);
          font-weight: 900;
          line-height: 1;
          background: linear-gradient(135deg, var(--neon-cyan), var(--neon-purple));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .nf__title {
          font-family: var(--font-display);
          font-size: clamp(24px, 4vw, 36px);
          font-weight: 800;
          color: var(--ink);
        }
        .nf__desc {
          font-size: 16px;
          line-height: 1.7;
          color: var(--ink-muted);
          max-width: 480px;
        }
        .nf__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          margin-top: 12px;
        }
        .nf__btn {
          padding: 12px 24px;
          border-radius: var(--radius-pill);
          font-size: 15px;
          font-weight: 600;
          color: var(--ink);
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.14);
          transition: all 0.2s var(--easing);
        }
        .nf__btn:hover { background: rgba(255,255,255,0.12); transform: translateY(-2px); }
        .nf__btn--primary {
          color: var(--on-primary);
          background: var(--primary);
          border-color: var(--primary);
        }
        .nf__btn--primary:hover { background: var(--primary-hover); }
      `}</style>
    </Page>
  )
}
