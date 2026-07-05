import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import { useLang } from '../i18n/LanguageContext'

export default function CTA() {
  const { t } = useLang()
  const c = t.cta

  return (
    <>
      <section className="section cta">
        <motion.div
          className="cta__blob cta__blob--1"
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="cta__blob cta__blob--2"
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="section__inner cta__inner">
          <Reveal variant="scale">
            <h2 className="cta__title">{c.title}</h2>
          </Reveal>
          <Reveal variant="up" delay={0.1}>
            <p className="cta__desc">{c.desc}</p>
          </Reveal>
          <Reveal variant="up" delay={0.2}>
            <Link to="/contact" className="cta__button magnetic">
              {c.button}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </Reveal>
        </div>
      </section>

      <style>{`
        .cta {
          background: radial-gradient(80% 120% at 50% 0%, rgba(0, 128, 96, 0.18) 0%, transparent 60%);
          text-align: center;
        }
        .cta__inner {
          max-width: 820px;
          position: relative;
          z-index: 2;
        }
        .cta__blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          z-index: 0;
        }
        .cta__blob--1 {
          width: 400px;
          height: 400px;
          background: rgba(0, 128, 96, 0.3);
          top: -100px;
          inset-inline-start: 10%;
        }
        .cta__blob--2 {
          width: 360px;
          height: 360px;
          background: rgba(91, 205, 218, 0.18);
          bottom: -120px;
          inset-inline-end: 12%;
        }
        .cta__title {
          font-family: var(--font-display);
          font-size: clamp(36px, 6vw, 72px);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: var(--ink);
          margin-bottom: 24px;
        }
        .cta__desc {
          font-size: clamp(16px, 1.6vw, 20px);
          line-height: 1.7;
          color: var(--ink-muted);
          max-width: 580px;
          margin: 0 auto 40px;
        }
        .cta__button {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 18px 40px;
          font-size: 18px;
          font-weight: 600;
          color: var(--on-primary);
          background: var(--primary);
          border-radius: var(--radius-pill);
          transition: all var(--duration-base) var(--easing);
        }
        .cta__button:hover {
          background: var(--primary-hover);
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 16px 40px rgba(0, 128, 96, 0.45);
        }
        :root[dir="rtl"] .cta__button svg { transform: scaleX(-1); }
      `}</style>
    </>
  )
}
