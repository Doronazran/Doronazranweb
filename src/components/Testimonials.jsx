import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Reveal from './Reveal'
import { useLang } from '../i18n/LanguageContext'

const SLIDE_INTERVAL = 7000
const PER_PAGE = 3

export default function Testimonials() {
  const { t } = useLang()
  const tm = t.testimonials
  const all = tm.items || []
  // Quoted testimonials go in the carousel; the rest are shown as real endorsers
  // (name / role / company) — never with a fabricated quote.
  const items = all.filter((x) => x && x.quote && x.quote.trim())
  const endorsers = all.filter((x) => x && (!x.quote || !x.quote.trim()) && x.name)

  // group into slides of 3
  const pages = []
  for (let i = 0; i < items.length; i += PER_PAGE) pages.push(items.slice(i, i + PER_PAGE))
  const totalPages = pages.length

  const [page, setPage] = useState(0)
  const [dir, setDir] = useState(1)
  const [paused, setPaused] = useState(false)

  const go = useCallback((next) => {
    setDir(next > page ? 1 : -1)
    setPage(next)
  }, [page])

  const prev = () => go((page - 1 + totalPages) % totalPages)
  const next = () => go((page + 1) % totalPages)

  useEffect(() => {
    if (paused || totalPages <= 1) return
    const timer = setInterval(() => {
      setDir(1)
      setPage((p) => (p + 1) % totalPages)
    }, SLIDE_INTERVAL)
    return () => clearInterval(timer)
  }, [paused, totalPages])

  if (!items.length && !endorsers.length) return null

  const slide = pages[page] || []

  const variants = {
    enter: (d) => ({ opacity: 0, x: d > 0 ? 50 : -50 }),
    center: { opacity: 1, x: 0 },
    exit: (d) => ({ opacity: 0, x: d > 0 ? -50 : 50 }),
  }

  const isRtl = t.dir === 'rtl'

  return (
    <>
      <section
        id="testimonials"
        className="section testimonials"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="section__inner">
          <div className="section__head">
            <Reveal variant="fade"><span className="section__tag">{tm.tag}</span></Reveal>
            <Reveal variant="up" delay={0.05}><h2 className="section__title">{tm.title}</h2></Reveal>
          </div>

          <div className="tc__wrap">
            {totalPages > 1 && (
              <button className="tc__arrow tc__arrow--prev" onClick={prev} aria-label="הקודם">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={isRtl ? 'M9 18l6-6-6-6' : 'M15 18l-6-6 6-6'} />
                </svg>
              </button>
            )}

            <div className="tc__viewport">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={page}
                  className="tc__grid"
                  style={{
                    gridTemplateColumns: `repeat(${Math.min(slide.length, 3)}, minmax(0, 1fr))`,
                    maxWidth: slide.length < 3 ? `${slide.length * 400}px` : 'none',
                    marginInline: 'auto',
                  }}
                  custom={dir}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  {slide.map((item, i) => (
                    <div key={i} className="tc__card">
                      <div className="tc__quote-mark">"</div>
                      {item.companyLogo && (
                        <img src={item.companyLogo} alt="" className="tc__company-logo" />
                      )}
                      <div className="tc__stars">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        ))}
                      </div>
                      <blockquote className="tc__text">"{item.quote}"</blockquote>
                      <div className="tc__author">
                        {item.avatar ? (
                          <img src={item.avatar} alt={item.name} className="tc__avatar tc__avatar--photo" />
                        ) : (
                          <div className="tc__avatar tc__avatar--initial">{item.name.charAt(0)}</div>
                        )}
                        <div className="tc__author-info">
                          <div className="tc__name">{item.name}</div>
                          <div className="tc__role">{item.role}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {totalPages > 1 && (
              <button className="tc__arrow tc__arrow--next" onClick={next} aria-label="הבא">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={isRtl ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
                </svg>
              </button>
            )}
          </div>

          {totalPages > 1 && (
            <div className="tc__dots">
              {pages.map((_, i) => (
                <button
                  key={i}
                  className={`tc__dot ${i === page ? 'tc__dot--active' : ''}`}
                  onClick={() => go(i)}
                  aria-label={`עמוד ${i + 1}`}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="tc__progress-wrap">
              <motion.div
                key={`progress-${page}`}
                className="tc__progress-bar"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: paused ? undefined : 1 }}
                transition={{ duration: SLIDE_INTERVAL / 1000, ease: 'linear' }}
              />
            </div>
          )}

          {endorsers.length > 0 && (
            <Reveal variant="up" delay={0.1} className="tc__endorsers">
              <div className="tc__endorsers-label">{isRtl ? 'ממליצים בכירים נוספים' : 'More senior endorsers'}</div>
              <div className="tc__endorsers-grid">
                {endorsers.map((e, i) => (
                  <div key={i} className="tc__endorser">
                    <div className="tc__avatar tc__avatar--initial tc__endorser-avatar">{e.name.charAt(0)}</div>
                    <div className="tc__endorser-info">
                      <div className="tc__endorser-name">{e.name}</div>
                      <div className="tc__endorser-role">{e.role}</div>
                    </div>
                    <svg className="tc__endorser-check" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  </div>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <style>{`
        .tc__wrap {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .tc__viewport { flex: 1; overflow: hidden; }
        .tc__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .tc__card {
          padding: 32px 28px;
          background: var(--surface);
          backdrop-filter: blur(20px) saturate(1.4);
          -webkit-backdrop-filter: blur(20px) saturate(1.4);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: var(--radius-xl);
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.22);
        }
        .tc__quote-mark {
          position: absolute;
          top: 14px;
          inset-inline-start: 22px;
          font-family: Georgia, serif;
          font-size: 72px;
          line-height: 1;
          color: var(--primary);
          opacity: 0.13;
          pointer-events: none;
          user-select: none;
        }
        .tc__company-logo {
          max-height: 26px;
          max-width: 110px;
          object-fit: contain;
          filter: brightness(0) invert(1);
          opacity: 0.4;
        }
        .tc__stars {
          display: flex;
          gap: 2px;
          color: #f59e0b;
        }
        .tc__text {
          font-size: clamp(13px, 1.2vw, 15px);
          line-height: 1.75;
          color: var(--ink);
          font-style: italic;
          flex: 1;
        }
        .tc__author {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid rgba(255,255,255,0.07);
        }
        .tc__avatar {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          border-radius: 50%;
          border: 2px solid rgba(0,164,124,0.28);
        }
        .tc__avatar--photo { object-fit: cover; }
        .tc__avatar--initial {
          background: linear-gradient(135deg, var(--primary), var(--primary-hover));
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
        }
        .tc__name { font-weight: 700; color: var(--ink); font-size: 13px; }
        .tc__role { font-size: 11px; color: var(--ink-muted); margin-top: 2px; }

        .tc__arrow {
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tc__arrow:hover { background: rgba(0,128,96,0.15); border-color: var(--primary); color: #fff; }

        .tc__dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 28px;
        }
        .tc__dot {
          width: 7px; height: 7px; border-radius: 50%;
          border: none; background: rgba(255,255,255,0.18);
          cursor: pointer; transition: all 0.25s; padding: 0;
        }
        .tc__dot--active { background: var(--primary); width: 22px; border-radius: 4px; }

        .tc__progress-wrap {
          margin: 14px 0 0;
          height: 1px;
          background: rgba(255,255,255,0.06);
          overflow: hidden;
        }
        .tc__progress-bar {
          height: 100%;
          background: var(--primary);
          transform-origin: left;
        }
        :root[dir="rtl"] .tc__progress-bar { transform-origin: right; }

        .tc__endorsers { margin-top: 44px; }
        .tc__endorsers-label {
          text-align: center; font-size: 12px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--ink-muted); margin-bottom: 20px;
        }
        .tc__endorsers-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(248px, 1fr)); gap: 12px;
        }
        .tc__endorser {
          display: flex; align-items: center; gap: 12px; padding: 13px 16px;
          background: var(--surface); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px; transition: border-color 0.2s;
        }
        .tc__endorser:hover { border-color: rgba(0,164,124,0.4); }
        .tc__endorser-avatar { width: 38px; height: 38px; font-size: 15px; }
        .tc__endorser-info { flex: 1; min-width: 0; }
        .tc__endorser-name { font-weight: 700; color: var(--ink); font-size: 13px; }
        .tc__endorser-role { font-size: 11px; color: var(--ink-muted); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .tc__endorser-check { color: var(--primary-hover, #00A47C); flex-shrink: 0; }

        @media (max-width: 900px) { .tc__grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 580px) {
          .tc__grid { grid-template-columns: 1fr; }
          .tc__card { padding: 22px 18px; }
          .tc__arrow { display: none; }
        }
      `}</style>
    </>
  )
}
