import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'

export default function AutoChatBar() {
  const { t, lang } = useLang()
  const c = t.chat
  const [typed, setTyped] = useState('')
  const idx = useRef(0)
  const char = useRef(0)
  const phase = useRef('typing') // typing | pausing | deleting

  useEffect(() => {
    // reset when language changes
    idx.current = 0
    char.current = 0
    phase.current = 'typing'
    setTyped('')

    let timeout
    const tick = () => {
      const questions = c.questions
      const current = questions[idx.current % questions.length]

      if (phase.current === 'typing') {
        char.current += 1
        setTyped(current.slice(0, char.current))
        if (char.current >= current.length) {
          phase.current = 'pausing'
          timeout = setTimeout(tick, 2200)
          return
        }
        timeout = setTimeout(tick, 45 + Math.random() * 45)
      } else if (phase.current === 'pausing') {
        phase.current = 'deleting'
        timeout = setTimeout(tick, 30)
      } else {
        char.current -= 2
        if (char.current <= 0) {
          char.current = 0
          idx.current += 1
          phase.current = 'typing'
          timeout = setTimeout(tick, 260)
          return
        }
        setTyped(current.slice(0, char.current))
        timeout = setTimeout(tick, 22)
      }
    }
    timeout = setTimeout(tick, 600)
    return () => clearTimeout(timeout)
  }, [c, lang])

  return (
    <>
      <div className="chatbar">
        <div className="chatbar__inner">
          <div className="chatbar__field magnetic">
            <span className="chatbar__icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </span>
            <span className="chatbar__label">{c.label}</span>
            <span className="chatbar__typed">
              {typed}
              <span className="chatbar__caret" />
            </span>
            <Link to="/contact" className="chatbar__send" aria-label={c.label}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <Link to="/contact" className="chatbar__cta magnetic">{c.cta}</Link>
        </div>
      </div>

      <style>{`
        .chatbar {
          position: fixed;
          bottom: 20px;
          inset-inline: 0;
          z-index: 90;
          display: flex;
          justify-content: center;
          padding: 0 16px;
          pointer-events: none;
        }
        .chatbar__inner {
          display: flex;
          align-items: center;
          gap: 10px;
          width: min(820px, 100%);
          pointer-events: auto;
        }
        .chatbar__field {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 12px 12px 20px;
          background: rgba(10, 12, 20, 0.72);
          backdrop-filter: blur(20px) saturate(1.4);
          -webkit-backdrop-filter: blur(20px) saturate(1.4);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: var(--radius-pill);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45),
            inset 0 0 0 1px rgba(255,255,255,0.02);
          min-width: 0;
        }
        :root[dir="ltr"] .chatbar__field { padding: 12px 20px 12px 12px; }
        .chatbar__icon {
          display: flex;
          color: var(--highlight);
          flex-shrink: 0;
        }
        .chatbar__label {
          font-weight: 700;
          font-size: 14px;
          color: #fff;
          flex-shrink: 0;
        }
        .chatbar__typed {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.62);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
          min-width: 0;
          font-style: italic;
        }
        .chatbar__caret {
          display: inline-block;
          width: 2px;
          height: 1em;
          background: var(--highlight);
          margin-inline-start: 2px;
          vertical-align: text-bottom;
          animation: caretBlink 1s step-end infinite;
        }
        .chatbar__send {
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          transition: all var(--duration-base) var(--easing);
        }
        .chatbar__send:hover {
          background: var(--primary);
          transform: scale(1.05);
        }
        :root[dir="rtl"] .chatbar__send svg { transform: scaleX(-1); }
        .chatbar__cta {
          flex-shrink: 0;
          padding: 14px 22px;
          font-size: 14px;
          font-weight: 700;
          color: #06131a;
          background: linear-gradient(135deg, var(--highlight), #8ee6ef);
          border-radius: var(--radius-pill);
          white-space: nowrap;
          box-shadow: 0 8px 24px rgba(91, 205, 218, 0.3);
          transition: all var(--duration-base) var(--easing);
        }
        .chatbar__cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(91, 205, 218, 0.5);
        }

        @keyframes caretBlink { 50% { opacity: 0; } }

        @media (max-width: 640px) {
          .chatbar { bottom: 12px; }
          .chatbar__label { display: none; }
          .chatbar__cta { padding: 14px 16px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .chatbar__caret { animation: none; }
        }
      `}</style>
    </>
  )
}
