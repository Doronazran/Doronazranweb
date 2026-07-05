import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Logo from './Logo'

const PANELS = [
  { color: 'linear-gradient(135deg, #05060d, #0b1b3a)', delay: 0 },
  { color: 'linear-gradient(135deg, #2a0f3a, #8b5cf6)', delay: 0.07 },
  { color: 'linear-gradient(135deg, #0b6b53, #5BCDDA)', delay: 0.14 },
]

export default function RouteCurtain() {
  const { pathname } = useLocation()

  return (
    <div className="route-curtain" aria-hidden="true">
      <AnimatePresence mode="sync">
        {PANELS.map((p, i) => (
          <motion.div
            key={pathname + '-' + i}
            className="route-curtain__panel"
            style={{ background: p.color }}
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.7, delay: p.delay, ease: [0.76, 0, 0.24, 1] }}
          />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        <motion.div
          key={pathname + '-label'}
          className="route-curtain__label"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Logo size={76} />
        </motion.div>
      </AnimatePresence>

      <style>{`
        .route-curtain {
          position: fixed;
          inset: 0;
          z-index: 9000;
          pointer-events: none;
          overflow: hidden;
        }
        .route-curtain__panel {
          position: absolute;
          inset: 0;
          transform-origin: top;
          will-change: transform;
        }
        .route-curtain__label {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9100;
        }
        .route-curtain__logo {
          font-family: 'Inter', sans-serif;
          font-size: 40px;
          font-weight: 900;
          letter-spacing: -0.04em;
          color: #fff;
          width: 78px;
          height: 78px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 18px;
          background: rgba(0,128,96,0.9);
          box-shadow: 0 0 60px rgba(0,164,124,0.6);
        }
        @media (prefers-reduced-motion: reduce) {
          .route-curtain { display: none; }
        }
      `}</style>
    </div>
  )
}
