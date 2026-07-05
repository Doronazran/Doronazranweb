import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Reveal from './Reveal'
import { useLang } from '../i18n/LanguageContext'

function StatItem({ num, label, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <motion.div
      ref={ref}
      className="stat-item"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="stat-item__num">{num}</span>
      <span className="stat-item__label">{label}</span>
    </motion.div>
  )
}

export default function Stats() {
  const { t } = useLang()
  const st = t.stats

  return (
    <>
      <section id="stats" className="section stats">
        <div className="section__inner">
          <div className="section__head" style={{ textAlign: 'center', margin: '0 auto 56px' }}>
            <Reveal variant="fade"><span className="section__tag">{st.tag}</span></Reveal>
            <Reveal variant="up" delay={0.05}><h2 className="section__title">{st.title}</h2></Reveal>
          </div>

          <div className="stats__grid">
            {st.items.map((item, i) => (
              <StatItem key={item.label} num={item.num} label={item.label} index={i} />
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .stats .section__head { max-width: 720px; }
        .stats__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .stat-item {
          padding: 48px 24px;
          text-align: center;
          border-inline-end: 1px solid var(--border);
        }
        .stat-item:last-child { border-inline-end: none; }
        .stat-item__num {
          display: block;
          font-family: var(--font-display);
          font-size: clamp(40px, 5vw, 64px);
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #fff 0%, var(--primary-hover) 120%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 14px;
        }
        .stat-item__label {
          font-size: 15px;
          color: var(--ink-muted);
          font-weight: 500;
        }
        @media (max-width: 768px) {
          .stats__grid { grid-template-columns: repeat(2, 1fr); }
          .stat-item:nth-child(2) { border-inline-end: none; }
          .stat-item:nth-child(1), .stat-item:nth-child(2) {
            border-bottom: 1px solid var(--border);
          }
          .stat-item { padding: 36px 16px; }
        }
      `}</style>
    </>
  )
}
