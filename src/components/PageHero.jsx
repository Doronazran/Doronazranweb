import { motion } from 'framer-motion'

export default function PageHero({ kicker, title, desc, accent = '#5BCDDA' }) {
  return (
    <>
      <header className="page-hero">
        <div
          className="page-hero__orb"
          style={{ background: `radial-gradient(circle, ${accent}55 0%, ${accent}10 45%, transparent 70%)` }}
        />
        <div className="page-hero__inner">
          <motion.span
            className="page-hero__kicker"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <span className="page-hero__kicker-dot" style={{ background: accent }} />
            {kicker}
          </motion.span>

          <h1 className="page-hero__title">
            <span className="page-hero__line">
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.85, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'inline-block' }}
              >
                {title}
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="page-hero__desc"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {desc}
          </motion.p>
        </div>

        <style>{`
          .page-hero {
            position: relative;
            padding: 200px 56px 80px;
            overflow: hidden;
          }
          .page-hero__orb {
            position: absolute;
            top: 10%;
            inset-inline-end: 8%;
            width: 520px;
            height: 520px;
            border-radius: 50%;
            filter: blur(20px);
            z-index: 0;
            animation: orbFloat 9s ease-in-out infinite;
          }
          .page-hero__inner {
            position: relative;
            z-index: 2;
            max-width: 1320px;
            margin: 0 auto;
          }
          .page-hero__kicker {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 8px 18px;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: #fff;
            background: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.16);
            border-radius: var(--radius-pill);
            margin-bottom: 28px;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
          }
          .page-hero__kicker-dot {
            width: 8px; height: 8px; border-radius: 50%;
            box-shadow: 0 0 10px currentColor;
          }
          .page-hero__title {
            font-family: var(--font-display);
            font-size: clamp(48px, 9vw, 130px);
            font-weight: 900;
            line-height: 0.98;
            letter-spacing: -0.04em;
            color: #fff;
          }
          .page-hero__line { display: block; overflow: hidden; padding-bottom: 0.05em; }
          .page-hero__desc {
            margin-top: 26px;
            max-width: 600px;
            font-size: clamp(16px, 1.6vw, 20px);
            line-height: 1.7;
            color: var(--ink-muted);
          }
          @keyframes orbFloat {
            0%,100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(30px) scale(1.06); }
          }
          @media (max-width: 768px) {
            .page-hero { padding: 150px 24px 56px; }
            .page-hero__orb { width: 320px; height: 320px; }
          }
        `}</style>
      </header>
    </>
  )
}
