import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import { useLang } from '../i18n/LanguageContext'

const ICONS = ['📄', '💰', '📊', '📋', '🌐', '⭐', '🚚', '🔎', '💱']

export default function AITools() {
  const { t } = useLang()
  const tools = t.tools

  return (
    <>
      <section id="tools" className="section ai-tools">
        <div className="section__inner">
          <div className="section__head">
            <Reveal variant="fade"><span className="section__tag">{tools.tag}</span></Reveal>
            <Reveal variant="up" delay={0.05}><h2 className="section__title">{tools.title}</h2></Reveal>
            <Reveal variant="up" delay={0.12}><p className="section__subtitle">{tools.subtitle}</p></Reveal>
          </div>

          <div className="ai-tools__grid">
            {tools.items.map((tool, i) => {
              const icon = tool.icon || ICONS[i % ICONS.length]
              const inner = (
                <>
                  <div className="tool-card__icon">{icon}</div>
                  <div className="tool-card__text">
                    <h4 className="tool-card__name">{tool.name}</h4>
                    <p className="tool-card__desc">{tool.desc}</p>
                  </div>
                  <span className="tool-card__arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </>
              )
              return (
              <Reveal key={tool.name + i} variant="up" delay={(i % 4) * 0.05}>
                {tool.url ? (
                  <a href={tool.url} target="_blank" rel="noopener noreferrer" className="tool-card magnetic">{inner}</a>
                ) : (
                  <Link to={`/tools/${i}`} className="tool-card magnetic">{inner}</Link>
                )}
              </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <style>{`
        .ai-tools__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .tool-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 22px 22px;
          background: var(--surface);
          backdrop-filter: blur(14px) saturate(1.3);
          -webkit-backdrop-filter: blur(14px) saturate(1.3);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          transition: all var(--duration-base) var(--easing);
        }
        .tool-card:hover {
          background: var(--surface-2);
          border-color: rgba(0,164,124,0.55);
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.35), 0 0 30px rgba(0,164,124,0.12);
        }
        .tool-card__icon {
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          border-radius: var(--radius-md);
          background: rgba(0, 128, 96, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }
        .tool-card__text { flex: 1; min-width: 0; }
        .tool-card__name {
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 3px;
        }
        .tool-card__desc {
          font-size: 13px;
          line-height: 1.45;
          color: var(--ink-muted);
        }
        .tool-card__arrow {
          flex-shrink: 0;
          color: var(--ink-faint);
          opacity: 0;
          transform: translateX(-6px);
          transition: all var(--duration-base) var(--easing);
        }
        :root[dir="rtl"] .tool-card__arrow svg { transform: scaleX(-1); }
        .tool-card:hover .tool-card__arrow {
          opacity: 1;
          transform: translateX(0);
          color: var(--primary-hover);
        }
        @media (max-width: 1100px) {
          .ai-tools__grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .ai-tools__grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  )
}
