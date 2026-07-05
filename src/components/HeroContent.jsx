import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'

export default function HeroContent() {
  const { t } = useLang()
  const h = t.hero

  const lines = [h.titleLine1, h.titleLine2, h.titleAccent]

  return (
    <>
      <div className="hero-content">
        <motion.div
          className="hero-content__badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="hero-content__badge-dot" />
          {h.badge}
        </motion.div>

        <h1 className="hero-content__title">
          {lines.map((line, i) => (
            <span key={i} className="hero-content__line">
              <motion.span
                className={i === 2 ? 'hero-content__accent' : ''}
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.35 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="hero-content__desc"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85 }}
        >
          {h.desc}
        </motion.p>

        <motion.div
          className="hero-content__actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1 }}
        >
          <Link to="/services" className="hero-content__btn hero-content__btn--primary magnetic">
            {h.ctaPrimary}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link to="/work" className="hero-content__btn hero-content__btn--ghost magnetic">
            {h.ctaSecondary}
          </Link>
        </motion.div>
      </div>

      <motion.div
        className="hero-scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
      >
        <span>{h.scroll}</span>
        <span className="hero-scroll__line" />
      </motion.div>

      <style>{`
        .hero-content {
          position: relative;
          z-index: 3;
          margin-top: auto;
          padding: 0 56px 120px;
          max-width: 760px;
        }
        .hero-content__badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 18px 7px 14px;
          font-size: 13px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          background: rgba(0, 128, 96, 0.2);
          border: 1px solid rgba(0, 128, 96, 0.4);
          border-radius: var(--radius-pill);
          margin-bottom: 28px;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .hero-content__badge-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--primary-hover);
          box-shadow: 0 0 10px var(--primary-hover);
          animation: pulse 2s ease-in-out infinite;
        }
        .hero-content__title {
          font-family: var(--font-display);
          font-size: clamp(40px, 6.5vw, 88px);
          font-weight: 900;
          line-height: 1.02;
          letter-spacing: -0.035em;
          color: #fff;
          margin-bottom: 28px;
        }
        .hero-content__line {
          display: block;
          overflow: hidden;
          padding-bottom: 0.04em;
        }
        .hero-content__line > span { display: inline-block; }
        .hero-content__accent {
          background: linear-gradient(110deg, #5BCDDA 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-content__desc {
          font-size: clamp(16px, 1.4vw, 19px);
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.65);
          margin-bottom: 36px;
          max-width: 540px;
        }
        .hero-content__actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }
        .hero-content__btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 15px 30px;
          font-family: var(--font-body);
          font-size: 16px;
          font-weight: 600;
          border-radius: var(--radius-pill);
          transition: all var(--duration-base) var(--easing);
        }
        .hero-content__btn svg {
          transition: transform var(--duration-base) var(--easing);
        }
        :root[dir="rtl"] .hero-content__btn svg { transform: scaleX(-1); }
        .hero-content__btn--primary {
          background: var(--primary);
          color: var(--on-primary);
        }
        .hero-content__btn--primary:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 128, 96, 0.4);
        }
        .hero-content__btn--ghost {
          background: rgba(255, 255, 255, 0.06);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .hero-content__btn--ghost:hover {
          background: rgba(255, 255, 255, 0.14);
          transform: translateY(-2px);
        }

        .hero-scroll {
          position: absolute;
          bottom: 40px;
          inset-inline-end: 56px;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
          writing-mode: vertical-lr;
        }
        .hero-scroll__line {
          width: 1px;
          height: 60px;
          background: linear-gradient(to bottom, var(--primary-hover), transparent);
          animation: scrollLine 2s ease-in-out infinite;
        }

        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }
        @keyframes scrollLine {
          0%, 100% { transform: scaleY(1); opacity: 1; transform-origin: top; }
          50% { transform: scaleY(0.4); opacity: 0.4; transform-origin: top; }
        }

        @media (max-width: 768px) {
          .hero-content { padding: 0 24px 64px; }
          .hero-scroll { display: none; }
        }
      `}</style>
    </>
  )
}
