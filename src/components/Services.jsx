import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import { useLang } from '../i18n/LanguageContext'

// featured=true (home page) shows only the admin-selected subset of services.
export default function Services({ featured = false }) {
  const { t, homeServices } = useLang()
  const s = t.services

  // Keep each item's original index (used for the /services/:id link) while
  // optionally narrowing the home page to the admin-chosen selection.
  const visible = s.items
    .map((item, i) => ({ item, i }))
    .filter(({ i }) =>
      !featured || !Array.isArray(homeServices) || homeServices.includes(i),
    )

  return (
    <>
      <section id="services" className="section services">
        <span className="section__watermark">AI</span>
        <div className="section__inner">
          <div className="section__head">
            <Reveal variant="fade">
              <span className="section__tag">{s.tag}</span>
            </Reveal>
            <Reveal variant="up" delay={0.05}>
              <h2 className="section__title">{s.title}</h2>
            </Reveal>
            <Reveal variant="up" delay={0.12}>
              <p className="section__subtitle">{s.subtitle}</p>
            </Reveal>
          </div>

          <div className="services__grid">
            {visible.map(({ item, i }, pos) => (
              <Reveal key={item.num} variant="up" delay={(pos % 3) * 0.08} className="service-card magnetic">
                <span className="service-card__num">{item.num}</span>
                <span className="service-card__arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </span>
                <h3 className="service-card__title">{item.title}</h3>
                {item.short && <span className="service-card__short">{item.short}</span>}
                <p className="service-card__desc">{item.desc}</p>
                <Link to={`/services/${i}`} className="service-card__overlay" aria-label={item.title} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .services__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .service-card {
          position: relative;
          padding: 36px 32px;
          display: grid;
          grid-template-columns: 1fr auto;
          grid-template-areas:
            "num arrow"
            "title title"
            "desc desc";
          background: var(--surface);
          backdrop-filter: blur(14px) saturate(1.3);
          -webkit-backdrop-filter: blur(14px) saturate(1.3);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          transition: transform var(--duration-base) var(--easing),
            border-color var(--duration-base) var(--easing),
            background var(--duration-base) var(--easing),
            box-shadow var(--duration-base) var(--easing);
          overflow: hidden;
        }
        .service-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(120% 120% at 100% 0%, rgba(0,128,96,0.14), transparent 60%);
          opacity: 0;
          transition: opacity var(--duration-base) var(--easing);
        }
        .service-card:hover {
          transform: translateY(-6px);
          border-color: rgba(91, 205, 218, 0.6);
          background: var(--surface-2);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35), 0 0 40px rgba(91, 205, 218, 0.12);
        }
        .service-card:hover::before { opacity: 1; }
        .service-card__num {
          grid-area: num;
          align-self: center;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: var(--primary-hover);
          letter-spacing: 0.05em;
        }
        .service-card__arrow {
          grid-area: arrow;
          justify-self: end;
          align-self: center;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 1px solid var(--border);
          color: var(--ink-faint);
          transition: all var(--duration-base) var(--easing);
        }
        .service-card:hover .service-card__arrow {
          background: var(--primary);
          border-color: var(--primary);
          color: #fff;
          transform: rotate(0deg);
        }
        :root[dir="rtl"] .service-card__arrow svg { transform: scaleX(-1); }
        .service-card__title {
          grid-area: title;
          position: relative;
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 700;
          color: var(--ink);
          margin-top: 28px;
          margin-bottom: 12px;
        }
        .service-card__desc {
          grid-area: desc;
          position: relative;
          font-size: 15px;
          line-height: 1.7;
          color: var(--ink-muted);
        }
        /* Short tagline — only used in the compact mobile row */
        .service-card__short { display: none; }
        .service-card__overlay {
          position: absolute;
          inset: 0;
          z-index: 3;
          border-radius: inherit;
        }
        @media (max-width: 980px) {
          .services__grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          /* Compact single-column list: number + (title over short tagline)
             + arrow, so 12 services stay short and scannable. */
          .services__grid { grid-template-columns: 1fr; gap: 10px; }
          .service-card {
            grid-template-columns: auto 1fr auto;
            grid-template-areas:
              "num title arrow"
              "num short arrow";
            align-items: center;
            column-gap: 14px;
            row-gap: 2px;
            padding: 14px 18px;
          }
          .service-card__num { grid-row: 1 / 3; }
          .service-card__arrow { grid-row: 1 / 3; width: 30px; height: 30px; }
          .service-card__arrow svg { width: 16px; height: 16px; }
          .service-card__title {
            margin: 0;
            font-size: 16px;
            line-height: 1.25;
          }
          .service-card__short {
            display: block;
            grid-area: short;
            font-size: 12.5px;
            line-height: 1.35;
            color: var(--neon-cyan);
            opacity: 0.85;
          }
          .service-card__desc { display: none; }
        }
      `}</style>
    </>
  )
}
