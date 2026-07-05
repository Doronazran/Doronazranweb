import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'

const INTERVAL = 6000

export default function PressReel() {
  const { t } = useLang()
  const m = t.media
  const items = m?.items || []
  const isRtl = t.dir === 'rtl'

  const [page, setPage] = useState(0)
  const [dir, setDir] = useState(1)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef(null)

  // group into pages of 3: 1 featured + 2 side
  const pages = []
  for (let i = 0; i < Math.max(items.length, 3); i += 3) {
    pages.push(items.slice(i, i + 3))
  }
  const totalPages = pages.length

  const advance = (next) => {
    setDir(next > page ? 1 : -1)
    setPage(next)
  }

  useEffect(() => {
    if (paused || totalPages <= 1) return
    timerRef.current = setInterval(() => {
      setDir(1)
      setPage((p) => (p + 1) % totalPages)
    }, INTERVAL)
    return () => clearInterval(timerRef.current)
  }, [paused, totalPages])

  const slide = pages[page] || []
  const [featured, ...rest] = slide

  const variants = {
    enter: (d) => ({ opacity: 0, x: d > 0 ? 48 : -48 }),
    center: { opacity: 1, x: 0 },
    exit: (d) => ({ opacity: 0, x: d > 0 ? -48 : 48 }),
  }

  const newsPageLink = isRtl ? '/news' : '/news'

  return (
    <>
      <section
        className="press-reel"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="press-reel__inner">

          {/* Left column — editorial label */}
          <div className="press-reel__label-col">
            <div className="press-reel__vertical-text">
              {isRtl ? 'בתקשורת' : 'PRESS'}
            </div>
            <div className="press-reel__label-meta">
              <p className="press-reel__label-desc">
                {isRtl
                  ? 'כשהתקשורת מדברת על AI, שרשרת אספקה וחדשנות ארגונית'
                  : 'When the press covers AI, supply chain and enterprise innovation'}
              </p>
              <Link to={newsPageLink} className="press-reel__all-link">
                {isRtl ? 'כל הכתבות' : 'All coverage'}
                <span className="press-reel__arrow">{isRtl ? '←' : '→'}</span>
              </Link>
              {totalPages > 1 && (
                <div className="press-reel__controls">
                  <button
                    className="press-reel__btn"
                    onClick={() => advance((page - 1 + totalPages) % totalPages)}
                    aria-label="prev"
                  >
                    {isRtl ? '→' : '←'}
                  </button>
                  <span className="press-reel__count">
                    {String(page + 1).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
                  </span>
                  <button
                    className="press-reel__btn"
                    onClick={() => advance((page + 1) % totalPages)}
                    aria-label="next"
                  >
                    {isRtl ? '←' : '→'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Cards */}
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={page}
              className="press-reel__cards"
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Featured card — left/large */}
              {featured ? (
                <FeaturedCard item={featured} isRtl={isRtl} />
              ) : (
                <PlaceholderFeatured isRtl={isRtl} />
              )}

              {/* Stack of smaller cards */}
              <div className="press-reel__stack">
                {rest.length > 0
                  ? rest.map((item, i) => <SmallCard key={i} item={item} isRtl={isRtl} />)
                  : [0, 1].map((i) => <PlaceholderSmall key={i} isRtl={isRtl} />)
                }
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="press-reel__progress-wrap">
          <motion.div
            key={`pr-${page}`}
            className="press-reel__progress-bar"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: paused ? undefined : 1 }}
            transition={{ duration: INTERVAL / 1000, ease: 'linear' }}
          />
        </div>
      </section>

      <style>{`
        .press-reel {
          padding: 100px 0 80px;
          border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: relative;
          overflow: hidden;
        }
        .press-reel__inner {
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 40px;
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 56px;
          align-items: start;
        }
        .press-reel__label-col {
          display: flex;
          flex-direction: column;
          gap: 32px;
          padding-top: 8px;
        }
        .press-reel__vertical-text {
          font-family: var(--font-display);
          font-size: clamp(52px, 5vw, 72px);
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.03em;
          color: rgba(255,255,255,0.08);
          writing-mode: vertical-rl;
          text-orientation: mixed;
          transform: rotate(180deg);
          user-select: none;
        }
        :root[dir="rtl"] .press-reel__vertical-text {
          transform: none;
          writing-mode: vertical-lr;
        }
        .press-reel__label-meta {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .press-reel__label-desc {
          font-size: 13px;
          line-height: 1.7;
          color: var(--ink-faint);
        }
        .press-reel__all-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          color: var(--neon-cyan);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          transition: gap 0.2s;
        }
        .press-reel__all-link:hover { gap: 10px; }
        .press-reel__arrow { font-size: 15px; }
        .press-reel__controls {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 8px;
        }
        .press-reel__btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.14);
          background: none;
          color: rgba(255,255,255,0.6);
          font-size: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .press-reel__btn:hover { border-color: var(--primary); color: #fff; }
        .press-reel__count {
          font-size: 12px;
          font-weight: 600;
          color: var(--ink-faint);
          letter-spacing: 0.06em;
          font-variant-numeric: tabular-nums;
        }

        /* Card grid */
        .press-reel__cards {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 20px;
          align-items: stretch;
          min-height: 400px;
        }
        .press-reel__stack {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Featured card */
        .pr-card-featured {
          position: relative;
          background: var(--surface);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: var(--radius-xl);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: border-color 0.25s;
        }
        .pr-card-featured:hover { border-color: rgba(91,205,218,0.3); }
        .pr-card-featured__image {
          height: 220px;
          background-size: cover;
          background-position: center;
          position: relative;
          flex-shrink: 0;
        }
        .pr-card-featured__image-placeholder {
          height: 220px;
          background: linear-gradient(145deg, rgba(255,255,255,0.025) 0%, rgba(0,164,124,0.06) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .pr-card-featured__pub-name {
          font-family: var(--font-display);
          font-size: 40px;
          font-weight: 900;
          letter-spacing: -0.03em;
          color: rgba(255,255,255,0.07);
        }
        .pr-card-featured__body {
          padding: 28px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .pr-card-featured__source {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--neon-cyan);
        }
        .pr-card-featured__title {
          font-family: var(--font-display);
          font-size: 21px;
          font-weight: 800;
          line-height: 1.25;
          color: var(--ink);
        }
        .pr-card-featured__excerpt {
          font-size: 14px;
          line-height: 1.7;
          color: var(--ink-muted);
          flex: 1;
        }
        .pr-card-featured__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.07);
        }
        .pr-card-featured__date { font-size: 12px; color: var(--ink-faint); }
        .pr-card-featured__link {
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.04em;
          transition: color 0.2s;
        }
        .pr-card-featured__link:hover { color: var(--neon-cyan); }

        /* Small card */
        .pr-card-small {
          background: var(--surface);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: var(--radius-lg);
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
          transition: border-color 0.25s;
        }
        .pr-card-small:hover { border-color: rgba(91,205,218,0.3); }
        .pr-card-small__source {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--neon-cyan);
        }
        .pr-card-small__title {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 700;
          line-height: 1.3;
          color: var(--ink);
        }
        .pr-card-small__excerpt {
          font-size: 13px;
          line-height: 1.6;
          color: var(--ink-muted);
          flex: 1;
        }
        .pr-card-small__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.07);
        }
        .pr-card-small__date { font-size: 11px; color: var(--ink-faint); }
        .pr-card-small__link {
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.35);
          transition: color 0.2s;
        }
        .pr-card-small__link:hover { color: var(--neon-cyan); }

        /* Placeholder styles */
        .pr-placeholder-featured {
          border-radius: var(--radius-xl);
          border: 1px dashed rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 360px;
          background: rgba(255,255,255,0.01);
        }
        .pr-placeholder-text {
          font-size: 13px;
          color: rgba(255,255,255,0.15);
          text-align: center;
          max-width: 200px;
          line-height: 1.6;
        }
        .pr-placeholder-small {
          border-radius: var(--radius-lg);
          border: 1px dashed rgba(255,255,255,0.06);
          min-height: 120px;
          flex: 1;
          background: rgba(255,255,255,0.01);
        }

        /* Progress bar */
        .press-reel__progress-wrap {
          max-width: 1320px;
          margin: 32px auto 0;
          padding: 0 40px;
          height: 1px;
          background: rgba(255,255,255,0.06);
          overflow: hidden;
        }
        .press-reel__progress-bar {
          height: 100%;
          background: linear-gradient(to right, var(--primary), var(--neon-cyan));
          transform-origin: left;
        }
        :root[dir="rtl"] .press-reel__progress-bar { transform-origin: right; }

        @media (max-width: 1000px) {
          .press-reel__inner { grid-template-columns: 1fr; gap: 32px; }
          .press-reel__label-col { flex-direction: row; align-items: flex-start; gap: 24px; }
          .press-reel__vertical-text { writing-mode: horizontal-tb; transform: none; font-size: 36px; color: rgba(255,255,255,0.15); }
        }
        @media (max-width: 680px) {
          .press-reel__cards { grid-template-columns: 1fr; }
          .press-reel__inner { padding: 0 24px; }
        }
      `}</style>
    </>
  )
}

function FeaturedCard({ item, isRtl }) {
  return (
    <div className="pr-card-featured">
      {item.image ? (
        <div className="pr-card-featured__image" style={{ backgroundImage: `url(${item.image})` }} />
      ) : (
        <div className="pr-card-featured__image-placeholder">
          <span className="pr-card-featured__pub-name">{item.source}</span>
        </div>
      )}
      <div className="pr-card-featured__body">
        <span className="pr-card-featured__source">{item.source}</span>
        <h3 className="pr-card-featured__title">{item.title}</h3>
        <p className="pr-card-featured__excerpt">{item.excerpt}</p>
        <div className="pr-card-featured__footer">
          <span className="pr-card-featured__date">{item.date}</span>
          {item.sourceUrl && (
            <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="pr-card-featured__link">
              {isRtl ? 'קרא כתבה' : 'Read article'}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function SmallCard({ item, isRtl }) {
  const inner = (
    <>
      <span className="pr-card-small__source">{item.source}</span>
      <h3 className="pr-card-small__title">{item.title}</h3>
      <p className="pr-card-small__excerpt">{item.excerpt}</p>
      <div className="pr-card-small__footer">
        <span className="pr-card-small__date">{item.date}</span>
        {item.sourceUrl && (
          <span className="pr-card-small__link">{isRtl ? 'קרא ←' : 'Read →'}</span>
        )}
      </div>
    </>
  )

  if (item.sourceUrl) {
    return (
      <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="pr-card-small">
        {inner}
      </a>
    )
  }
  return <div className="pr-card-small">{inner}</div>
}

function PlaceholderFeatured({ isRtl }) {
  return (
    <div className="pr-placeholder-featured">
      <p className="pr-placeholder-text">
        {isRtl
          ? 'כתבות שפורסמו עלינו יופיעו כאן — הוסף אותן דרך לוח הניהול'
          : 'Press coverage will appear here — add via the admin panel'}
      </p>
    </div>
  )
}

function PlaceholderSmall({ isRtl }) {
  return <div className="pr-placeholder-small" />
}
