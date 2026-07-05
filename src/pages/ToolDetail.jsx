import { useParams, Link, Navigate } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import CTA from '../components/CTA'

const ICONS = ['📄', '💰', '📊', '📋', '🌐', '⭐', '🚚', '🔎', '💱']

export default function ToolDetail() {
  const { id } = useParams()
  const { t } = useLang()
  const items = t.tools?.items || []
  const idx = parseInt(id, 10)
  const tool = items[idx]

  if (!tool) return <Navigate to="/tools" replace />

  const prev = idx > 0 ? idx - 1 : null
  const next = idx < items.length - 1 ? idx + 1 : null
  const icon = tool.icon || ICONS[idx % ICONS.length]
  const isRtl = t.dir === 'rtl'

  const bodyParagraphs = tool.body
    ? tool.body.split('\n').filter(Boolean)
    : []

  return (
    <>
      <article className="tool-detail">
        {/* hero */}
        <div className="tool-detail__hero">
          <div className="tool-detail__hero-inner">
            <Link to="/tools" className="tool-detail__back">
              {isRtl ? '→' : '←'} {t.tools?.tag || 'כלים'}
            </Link>
            <div className="tool-detail__icon-wrap">
              <span className="tool-detail__icon">{icon}</span>
            </div>
            <h1 className="tool-detail__title">{tool.name}</h1>
            <p className="tool-detail__desc">{tool.desc}</p>
            {tool.url && (
              <a href={tool.url} target="_blank" rel="noopener noreferrer" className="tool-detail__cta">
                {isRtl ? 'פתח כלי ↗' : 'Open Tool ↗'}
              </a>
            )}
          </div>
        </div>

        {/* body */}
        <div className="tool-detail__body">
          {bodyParagraphs.length > 0 ? (
            bodyParagraphs.map((p, i) => <p key={i}>{p}</p>)
          ) : (
            <p className="tool-detail__placeholder">
              {isRtl
                ? 'תיאור מפורט לכלי זה יופיע כאן. ניתן לעדכן אותו דרך לוח הניהול.'
                : 'Detailed description for this tool will appear here. Update it via the admin panel.'}
            </p>
          )}
        </div>

        {/* prev / next */}
        <nav className="tool-detail__nav">
          {prev !== null ? (
            <Link to={`/tools/${prev}`} className="tool-detail__nav-btn">
              {isRtl ? '→' : '←'} {items[prev]?.name}
            </Link>
          ) : <span />}
          {next !== null ? (
            <Link to={`/tools/${next}`} className="tool-detail__nav-btn">
              {items[next]?.name} {isRtl ? '←' : '→'}
            </Link>
          ) : <span />}
        </nav>
      </article>

      <CTA />

      <style>{`
        .tool-detail { padding-top: 80px; }
        .tool-detail__hero {
          background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,128,96,0.18), transparent 70%);
          border-bottom: 1px solid var(--border);
        }
        .tool-detail__hero-inner {
          max-width: 760px; margin: 0 auto; padding: 64px 40px 56px;
          display: flex; flex-direction: column; align-items: flex-start; gap: 16px;
        }
        .tool-detail__back {
          font-size: 14px; color: var(--neon-cyan); font-weight: 600; margin-bottom: 4px;
        }
        .tool-detail__back:hover { color: #fff; }
        .tool-detail__icon-wrap {
          width: 72px; height: 72px; border-radius: var(--radius-lg);
          background: rgba(0,128,96,0.12); border: 1px solid rgba(0,128,96,0.25);
          display: grid; place-items: center; font-size: 32px;
        }
        .tool-detail__title {
          font-family: var(--font-display); font-size: clamp(26px, 5vw, 44px);
          font-weight: 800; color: #fff;
        }
        .tool-detail__desc {
          font-size: 18px; line-height: 1.65; color: rgba(255,255,255,0.72); max-width: 560px;
        }
        .tool-detail__cta {
          display: inline-flex; align-items: center; gap: 8px; padding: 13px 28px;
          background: var(--primary); color: var(--on-primary); border-radius: var(--radius-pill);
          font-weight: 700; font-size: 15px; margin-top: 4px; transition: all 0.2s ease;
        }
        .tool-detail__cta:hover { background: var(--primary-hover); transform: translateY(-2px); }
        .tool-detail__body {
          max-width: 760px; margin: 0 auto; padding: 56px 40px;
          font-size: 17px; line-height: 1.8; color: rgba(255,255,255,0.78);
          display: flex; flex-direction: column; gap: 24px;
        }
        .tool-detail__placeholder { color: rgba(255,255,255,0.4); font-style: italic; }
        .tool-detail__nav {
          max-width: 760px; margin: 0 auto; padding: 0 40px 80px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .tool-detail__nav-btn {
          display: inline-flex; align-items: center; gap: 8px; font-size: 15px;
          font-weight: 600; color: rgba(255,255,255,0.6); padding: 12px 20px;
          border-radius: var(--radius-pill); border: 1px solid rgba(255,255,255,0.12);
          transition: all 0.2s ease;
        }
        .tool-detail__nav-btn:hover { color: #fff; background: rgba(255,255,255,0.06); }
        @media (max-width: 640px) {
          .tool-detail__hero-inner { padding: 40px 24px 40px; }
          .tool-detail__body { padding: 40px 24px; }
          .tool-detail__nav { padding: 0 24px 60px; flex-direction: column; gap: 12px; }
        }
      `}</style>
    </>
  )
}
