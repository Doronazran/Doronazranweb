import { useEffect, useRef, useState } from 'react'
import { useLang } from '../i18n/LanguageContext'

// Detects a new deploy (via /version.json) and offers a one-tap refresh, so
// visitors always see the latest content without manually clearing cache.
export default function VersionWatcher() {
  const { t } = useLang()
  const isRtl = t?.dir === 'rtl'
  const initial = useRef(null)
  const [stale, setStale] = useState(false)

  useEffect(() => {
    let cancelled = false
    const check = async () => {
      try {
        const r = await fetch('/version.json', { cache: 'no-store' })
        if (!r.ok) return
        const { v } = await r.json()
        if (cancelled || v == null) return
        if (initial.current == null) initial.current = v
        else if (v !== initial.current) setStale(true)
      } catch { /* offline — ignore */ }
    }
    check()
    const id = setInterval(check, 120000) // every 2 min
    const onFocus = () => check()
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onFocus)
    return () => {
      cancelled = true
      clearInterval(id)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onFocus)
    }
  }, [])

  if (!stale) return null

  return (
    <button
      type="button"
      onClick={() => window.location.reload(true)}
      className="verw"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <span className="verw__dot" />
      {isRtl ? 'עדכון זמין — לחצו לרענון' : 'Update available — tap to refresh'}
      <style>{`
        .verw {
          position: fixed;
          inset-inline: 0;
          bottom: 0;
          margin: 0 auto 18px;
          width: max-content;
          max-width: 92vw;
          z-index: 3000;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 22px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(10,13,24,0.92);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: #fff;
          font-family: inherit;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 12px 40px rgba(0,0,0,0.4);
          animation: verwIn 0.4s ease;
        }
        .verw:hover { border-color: var(--primary, #00A47C); }
        .verw__dot {
          width: 9px; height: 9px; border-radius: 50%;
          background: var(--neon-cyan, #5bcdda);
          box-shadow: 0 0 10px currentColor;
        }
        @keyframes verwIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
      `}</style>
    </button>
  )
}
