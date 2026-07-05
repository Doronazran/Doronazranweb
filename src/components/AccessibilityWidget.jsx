import { useState, useEffect, useCallback } from 'react'
import { useLang } from '../i18n/LanguageContext'

const PREFS_KEY = 'a11y-prefs-v1'
const DEFAULTS = { fontSize: 0, contrast: false, grayscale: false, underlineLinks: false, pauseAnims: false }

function loadPrefs() {
  try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(PREFS_KEY) || '{}') } }
  catch { return { ...DEFAULTS } }
}

function applyPrefs(prefs) {
  const html = document.documentElement
  const sizes = [100, 114, 130]
  if (prefs.fontSize === 0) html.style.removeProperty('font-size')
  else html.style.setProperty('font-size', `${sizes[prefs.fontSize]}%`)
  html.classList.toggle('a11y--contrast', prefs.contrast)
  html.classList.toggle('a11y--grayscale', prefs.grayscale)
  html.classList.toggle('a11y--underline', prefs.underlineLinks)
  html.classList.toggle('a11y--no-anim', prefs.pauseAnims)
}

const LABELS = {
  he: {
    title: 'נגישות', open: 'פתח אפשרויות נגישות', close: 'סגור',
    fontSize: 'גודל טקסט', normal: 'רגיל', large: 'גדול', xlarge: 'גדול מאוד',
    contrast: 'ניגודיות גבוהה', grayscale: 'גווני אפור',
    underlineLinks: 'הדגשת קישורים', pauseAnims: 'עצור אנימציות',
    reset: 'איפוס', statement: 'הצהרת נגישות',
  },
  en: {
    title: 'Accessibility', open: 'Open accessibility options', close: 'Close',
    fontSize: 'Font Size', normal: 'Normal', large: 'Large', xlarge: 'X-Large',
    contrast: 'High Contrast', grayscale: 'Grayscale',
    underlineLinks: 'Underline Links', pauseAnims: 'Pause Animations',
    reset: 'Reset', statement: 'Accessibility Statement',
  },
}

export default function AccessibilityWidget() {
  const { lang } = useLang()
  const [open, setOpen] = useState(false)
  const [prefs, setPrefs] = useState(loadPrefs)
  const L = LABELS[lang] || LABELS.he

  useEffect(() => {
    applyPrefs(prefs)
    try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)) } catch {}
  }, [prefs])

  const togglePref = useCallback((key) => setPrefs(p => ({ ...p, [key]: !p[key] })), [])
  const setSize = useCallback((v) => setPrefs(p => ({ ...p, fontSize: v })), [])
  const reset = useCallback(() => setPrefs({ ...DEFAULTS }), [])

  const sizeLabels = [L.normal, L.large, L.xlarge]

  return (
    <>
      <div className="a11y-widget" role="region" aria-label={L.title}>
        <button
          className="a11y-trigger"
          onClick={() => setOpen(v => !v)}
          aria-label={L.open}
          aria-expanded={open}
          aria-haspopup="dialog"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="4.5" r="1.5" />
            <path d="M9.5 9h5l-1.2 5.5L12 17l-1.3-2.5L9.5 9z" />
            <path d="M9.5 9l-2 6M14.5 9l2 6" />
          </svg>
        </button>

        {open && (
          <div className="a11y-panel" role="dialog" aria-modal="false" aria-label={L.title}>
            <div className="a11y-panel__head">
              <span>{L.title}</span>
              <button className="a11y-panel__x" onClick={() => setOpen(false)} aria-label={L.close}>✕</button>
            </div>

            <div className="a11y-panel__body">
              <p className="a11y-group-label">{L.fontSize}</p>
              <div className="a11y-sizes">
                {[0, 1, 2].map((v) => (
                  <button
                    key={v}
                    className={`a11y-sz ${prefs.fontSize === v ? 'a11y-sz--on' : ''}`}
                    onClick={() => setSize(v)}
                    aria-pressed={prefs.fontSize === v}
                    style={{ fontSize: 12 + v * 3 }}
                  >
                    <span>A</span>
                    <span className="a11y-sz__lbl">{sizeLabels[v]}</span>
                  </button>
                ))}
              </div>

              <div className="a11y-opts">
                {[
                  { key: 'contrast', icon: '◑', label: L.contrast },
                  { key: 'grayscale', icon: '◐', label: L.grayscale },
                  { key: 'underlineLinks', icon: 'U̲', label: L.underlineLinks },
                  { key: 'pauseAnims', icon: '⏸', label: L.pauseAnims },
                ].map(({ key, icon, label }) => (
                  <button
                    key={key}
                    className={`a11y-opt ${prefs[key] ? 'a11y-opt--on' : ''}`}
                    role="switch"
                    aria-checked={prefs[key]}
                    onClick={() => togglePref(key)}
                  >
                    <span className="a11y-opt__ico" aria-hidden="true">{icon}</span>
                    <span className="a11y-opt__lbl">{label}</span>
                    <span className="a11y-opt__dot" aria-hidden="true">{prefs[key] ? '●' : '○'}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="a11y-panel__foot">
              <button className="a11y-reset-btn" onClick={reset}>{L.reset}</button>
              <a href="/accessibility" className="a11y-stmt-link" onClick={() => setOpen(false)}>
                {L.statement} →
              </a>
            </div>
          </div>
        )}
      </div>

      <style>{`
        /* Preference classes applied to <html> */
        html.a11y--contrast { filter: contrast(1.6) brightness(1.05); }
        html.a11y--grayscale { filter: grayscale(1); }
        html.a11y--underline a { text-decoration: underline !important; text-underline-offset: 3px; }
        html.a11y--no-anim *, html.a11y--no-anim *::before, html.a11y--no-anim *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }

        /* Widget anchor */
        .a11y-widget {
          position: fixed;
          bottom: 152px;
          right: 20px;
          z-index: 1800;
        }

        /* Trigger button */
        .a11y-trigger {
          width: 50px; height: 50px; border-radius: 50%;
          background: var(--primary, #008060); color: #fff; border: none;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 18px rgba(0,128,96,.45);
          transition: transform 0.2s ease, background 0.2s ease;
          cursor: pointer;
        }
        .a11y-trigger:hover { transform: scale(1.1); background: var(--primary-hover, #006e52); }
        .a11y-trigger:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }

        /* Panel */
        .a11y-panel {
          position: absolute; bottom: 62px; right: 0;
          width: 276px;
          background: rgba(10,12,22,0.97);
          backdrop-filter: blur(28px) saturate(1.4);
          -webkit-backdrop-filter: blur(28px) saturate(1.4);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 16px;
          box-shadow: 0 24px 64px rgba(0,0,0,.75);
          overflow: hidden;
        }
        .a11y-panel__head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 13px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          font-weight: 700; font-size: 13px; color: #fff;
          background: rgba(255,255,255,0.04);
        }
        .a11y-panel__x {
          width: 26px; height: 26px; border-radius: 50%;
          background: rgba(255,255,255,0.08); border: none;
          color: rgba(255,255,255,0.6); font-size: 12px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.15s;
        }
        .a11y-panel__x:hover { background: rgba(255,255,255,0.15); color: #fff; }

        .a11y-panel__body { padding: 14px 14px 10px; }

        .a11y-group-label { font-size: 11px; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; }

        /* Font size buttons */
        .a11y-sizes { display: flex; gap: 6px; margin-bottom: 12px; }
        .a11y-sz {
          flex: 1; padding: 8px 4px; border-radius: 9px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.75); font-weight: 700;
          display: flex; flex-direction: column; align-items: center; gap: 3px;
          transition: all 0.15s; cursor: pointer;
        }
        .a11y-sz--on { background: var(--primary, #008060); border-color: var(--primary, #008060); color: #fff; }
        .a11y-sz:not(.a11y-sz--on):hover { background: rgba(255,255,255,0.1); }
        .a11y-sz__lbl { font-size: 9px; font-weight: 500; opacity: 0.7; }

        /* Toggle options */
        .a11y-opts { display: flex; flex-direction: column; gap: 6px; }
        .a11y-opt {
          display: flex; align-items: center; gap: 10px; width: 100%;
          padding: 9px 11px; border-radius: 9px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.72); font-size: 13px;
          text-align: start; transition: all 0.15s; cursor: pointer;
        }
        .a11y-opt--on { background: rgba(0,128,96,0.18); border-color: rgba(0,128,96,0.35); color: #fff; }
        .a11y-opt:not(.a11y-opt--on):hover { background: rgba(255,255,255,0.08); }
        .a11y-opt__ico { font-size: 15px; width: 20px; text-align: center; flex-shrink: 0; }
        .a11y-opt__lbl { flex: 1; }
        .a11y-opt__dot { font-size: 10px; color: rgba(255,255,255,0.3); }
        .a11y-opt--on .a11y-opt__dot { color: #4ade80; }

        /* Panel footer */
        .a11y-panel__foot {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 14px;
          border-top: 1px solid rgba(255,255,255,0.07);
        }
        .a11y-reset-btn {
          font-size: 12px; color: rgba(255,255,255,0.4); background: none;
          border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 5px 11px;
          cursor: pointer; transition: all 0.15s;
        }
        .a11y-reset-btn:hover { color: #fff; border-color: rgba(255,255,255,0.25); }
        .a11y-stmt-link { font-size: 12px; color: var(--neon-cyan, #5bcdda); }
        .a11y-stmt-link:hover { text-decoration: underline; }

        /* Top of the FAB stack: chat (16) → WhatsApp (84) → a11y (148).
           Logical inset keeps it aligned with the rest of the tower in RTL/LTR. */
        @media (max-width: 960px) {
          .a11y-widget {
            bottom: calc(148px + env(safe-area-inset-bottom, 0px));
            right: auto; inset-inline-end: 19px;
          }
        }
        @media (max-width: 640px) {
          .a11y-panel { width: calc(100vw - 48px); right: auto; inset-inline-end: 0; }
        }
      `}</style>
    </>
  )
}
