import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import { useLang } from '../i18n/LanguageContext'
import { IMAGES } from '../data/images'

export default function MeetDoron() {
  const { t } = useLang()
  const m = t.meet

  return (
    <>
      <section id="meet" className="section meet">
        <div className="section__inner meet__grid">
          <Reveal variant="left" className="meet__portrait magnetic">
            <div className="meet__portrait-inner">
              <div className="meet__photo" style={{ backgroundImage: `url(${IMAGES.portrait})` }} />
              <div className="meet__duotone" />
              <div className="meet__meet">
                <span className="meet__meet-kicker">{m.kicker}</span>
                <span className="meet__meet-name">{m.name}</span>
              </div>
              <div className="meet__scanline" />
            </div>
          </Reveal>

          <div className="meet__content">
            <Reveal variant="fade"><span className="section__tag">{m.tag}</span></Reveal>
            <Reveal variant="up" delay={0.05}>
              <h2 className="section__title">{m.kicker} <span className="meet__name-accent">{m.name}</span></h2>
            </Reveal>
            <Reveal variant="up" delay={0.1}>
              <p className="meet__role">{m.role}</p>
            </Reveal>
            {m.bio.map((p, i) => (
              <Reveal key={i} variant="up" delay={0.15 + i * 0.08}>
                <p className="meet__bio">{p}</p>
              </Reveal>
            ))}
            <Reveal variant="up" delay={0.35}>
              <Link to="/contact" className="meet__cta magnetic">
                {m.cta}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <style>{`
        .meet__grid {
          display: grid;
          grid-template-columns: 0.85fr 1fr;
          gap: 64px;
          align-items: center;
        }
        .meet__portrait {
          border-radius: var(--radius-xl);
          overflow: hidden;
        }
        .meet__portrait-inner {
          position: relative;
          aspect-ratio: 4 / 5;
          border-radius: var(--radius-xl);
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow: 0 30px 80px rgba(0,0,0,0.5);
        }
        .meet__photo {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center top;
          transform: scale(1.02);
          animation: duotoneDrift 14s ease-in-out infinite alternate;
        }
        .meet__duotone {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(120% 80% at 25% 8%, #5BCDDA, transparent 60%),
            radial-gradient(120% 90% at 85% 100%, #e056b1, transparent 60%),
            linear-gradient(160deg, #0b1b3a 0%, #2a0f3a 55%, #3a0f24 100%);
          mix-blend-mode: color;
          opacity: 0.72;
        }
        .meet__portrait-inner::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 35%, rgba(5,6,13,0.7) 100%);
          z-index: 1;
        }
        .meet__initials {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          font-size: clamp(120px, 18vw, 220px);
          font-weight: 900;
          letter-spacing: -0.05em;
          color: rgba(255,255,255,0.14);
          text-shadow: 0 0 60px rgba(255,255,255,0.1);
        }
        .meet__meet {
          position: absolute;
          z-index: 2;
          inset-inline-start: 28px;
          bottom: 28px;
          display: flex;
          flex-direction: column;
          line-height: 0.95;
        }
        .meet__meet-kicker {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 700;
          color: rgba(255,255,255,0.85);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .meet__meet-name {
          font-family: var(--font-display);
          font-size: clamp(44px, 6vw, 72px);
          font-weight: 900;
          color: #fff;
          letter-spacing: -0.02em;
        }
        .meet__scanline {
          position: absolute;
          inset: 0;
          background: linear-gradient(transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%);
          background-size: 100% 8px;
          mix-blend-mode: overlay;
          opacity: 0.4;
          pointer-events: none;
        }

        .meet__name-accent {
          background: linear-gradient(120deg, var(--neon-cyan), var(--neon-magenta));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .meet__role {
          font-size: 16px;
          font-weight: 600;
          color: var(--neon-cyan);
          margin: 14px 0 22px;
        }
        .meet__bio {
          font-size: 17px;
          line-height: 1.8;
          color: var(--ink-muted);
          margin-bottom: 16px;
          max-width: 520px;
        }
        .meet__cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
          padding: 15px 30px;
          font-size: 16px;
          font-weight: 600;
          color: var(--on-primary);
          background: var(--primary);
          border-radius: var(--radius-pill);
          transition: all var(--duration-base) var(--easing);
        }
        .meet__cta:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0,128,96,0.4);
        }
        :root[dir="rtl"] .meet__cta svg { transform: scaleX(-1); }

        @keyframes duotoneDrift {
          0% { transform: scale(1) translate(0,0); }
          100% { transform: scale(1.08) translate(-2%, -2%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .meet__duotone { animation: none; }
        }
        @media (max-width: 860px) {
          .meet__grid { grid-template-columns: 1fr; gap: 40px; }
          .meet__portrait { max-width: 380px; }
        }
      `}</style>
    </>
  )
}
