import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import { useLang } from '../i18n/LanguageContext'
import { IMAGES } from '../data/images'

const GRADIENTS = [
  'linear-gradient(135deg, #00A47C 0%, #043a2b 100%)',
  'linear-gradient(135deg, #5BCDDA 0%, #0e3a44 100%)',
  'linear-gradient(135deg, #8b5cf6 0%, #2a0f3a 100%)',
  'linear-gradient(135deg, #e056b1 0%, #3a0f24 100%)',
]

export default function Work() {
  const { t } = useLang()
  const w = t.work

  return (
    <>
      <section id="work" className="section work">
        <span className="section__watermark" style={{ insetInlineStart: 'auto', insetInlineEnd: '-2%' }}>WORK</span>
        <div className="section__inner">
          <div className="work__head">
            <div className="section__head" style={{ marginBottom: 0 }}>
              <Reveal variant="fade"><span className="section__tag">{w.tag}</span></Reveal>
              <Reveal variant="up" delay={0.05}><h2 className="section__title">{w.title}</h2></Reveal>
              <Reveal variant="up" delay={0.12}><p className="section__subtitle">{w.subtitle}</p></Reveal>
            </div>
            <Reveal variant="fade" delay={0.1}>
              <Link to="/work" className="work__viewall magnetic">
                {w.viewAll}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </Reveal>
          </div>

          <div className="work__grid">
            {w.items.map((item, i) => (
              <Reveal key={item.name} variant="up" delay={(i % 2) * 0.1} className="work-card magnetic">
                <Link to={`/work/${i}`} className="work-card__link" aria-label={item.name}>
                  <div className="work-card__visual">
                    <div className="work-card__photo" style={{ backgroundImage: `url(${item.image || IMAGES.work[i % IMAGES.work.length]})` }} />
                    <div className="work-card__duotone" style={{ background: GRADIENTS[i % GRADIENTS.length] }} />
                    <div className="work-card__vignette" />
                    <span className="work-card__metric">{item.metric}</span>
                    <div className="work-card__glow" />
                  </div>
                  <div className="work-card__info">
                    <div>
                      <h3 className="work-card__name">{item.name}</h3>
                      <p className="work-card__cat">{item.cat}</p>
                    </div>
                    <span className="work-card__go">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .work__head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 56px;
          flex-wrap: wrap;
        }
        .work__viewall {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          font-size: 15px;
          font-weight: 600;
          color: var(--ink);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-pill);
          transition: all var(--duration-base) var(--easing);
          white-space: nowrap;
        }
        .work__viewall:hover {
          background: var(--primary);
          border-color: var(--primary);
        }
        :root[dir="rtl"] .work__viewall svg { transform: scaleX(-1); }

        .work__grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }
        .work-card__link { display: block; }
        .work-card {
          border-radius: var(--radius-xl);
          overflow: hidden;
          background: var(--surface);
          backdrop-filter: blur(14px) saturate(1.3);
          -webkit-backdrop-filter: blur(14px) saturate(1.3);
          border: 1px solid var(--border);
          transition: transform var(--duration-base) var(--easing),
            border-color var(--duration-base) var(--easing),
            box-shadow var(--duration-base) var(--easing);
        }
        .work-card:hover {
          transform: translateY(-6px);
          border-color: rgba(139, 92, 246, 0.6);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4), 0 0 50px rgba(139, 92, 246, 0.15);
        }
        .work-card__visual {
          position: relative;
          height: 260px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .work-card__photo {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: transform 0.7s var(--easing);
        }
        .work-card:hover .work-card__photo { transform: scale(1.07); }
        .work-card__duotone {
          position: absolute;
          inset: 0;
          mix-blend-mode: color;
          opacity: 0.82;
        }
        .work-card__vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(120% 100% at 50% 40%, transparent 40%, rgba(0,0,0,0.55) 100%);
        }
        .work-card__visual::after {
          content: '';
          position: absolute;
          top: -50%;
          inset-inline-start: -60%;
          width: 50%;
          height: 200%;
          background: linear-gradient(100deg, transparent, rgba(255,255,255,0.22), transparent);
          transform: rotate(8deg);
          animation: cardShine 6s ease-in-out infinite;
        }
        @keyframes cardShine {
          0% { inset-inline-start: -60%; }
          55%, 100% { inset-inline-start: 160%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .work-card__visual::after { animation: none; opacity: 0; }
        }
        .work-card__metric {
          position: relative;
          z-index: 2;
          font-family: var(--font-display);
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
          text-shadow: 0 4px 24px rgba(0,0,0,0.3);
        }
        .work-card__glow {
          position: absolute;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 45%);
          top: -50%;
          inset-inline-start: -50%;
          opacity: 0;
          transition: opacity var(--duration-base) var(--easing);
        }
        .work-card:hover .work-card__glow { opacity: 1; }
        .work-card__info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 28px;
        }
        .work-card__name {
          font-family: var(--font-display);
          font-size: 21px;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 4px;
        }
        .work-card__cat {
          font-size: 14px;
          color: var(--ink-muted);
        }
        .work-card__go {
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: var(--surface-2);
          color: var(--ink-faint);
          transition: all var(--duration-base) var(--easing);
        }
        .work-card:hover .work-card__go {
          background: var(--primary);
          color: #fff;
        }
        :root[dir="rtl"] .work-card__go svg { transform: scaleX(-1); }

        @media (max-width: 768px) {
          .work__grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  )
}
