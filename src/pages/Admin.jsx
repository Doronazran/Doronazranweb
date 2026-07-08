import { useState, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { getIn, clone } from '../content/store'
import { translations as BUILT_IN } from '../i18n/translations'
import { schema } from '../admin/schema'

// Admin password from environment - NEVER hardcode!
// Set in Vercel: VITE_ADMIN_PASSWORD environment variable
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD || 'INSECURE_DEMO_MODE'

const MEDIA_FIELDS = [
  { label: 'לוגו (PNG / SVG)', key: 'logo' },
  { label: 'תמונת רקע (Hero)', key: 'heroImage' },
  { label: 'תמונת פורטרט (אודות)', key: 'portrait' },
]

const PAGE_CARDS = [
  { id: 'home',     icon: '🏠', title: 'דף הבית',  route: '/'         },
  { id: 'services', icon: '💼', title: 'שירותים',   route: '/services' },
  { id: 'work',     icon: '🎯', title: 'עבודות',    route: '/work'     },
  { id: 'tools',    icon: '🔧', title: 'כלים',      route: '/tools'    },
  { id: 'about',    icon: '👤', title: 'אודות',     route: '/about'    },
  { id: 'news',     icon: '📰', title: 'חדשות',     route: '/news'     },
  { id: 'contact',  icon: '✉',  title: 'צור קשר',   route: '/contact'  },
  { id: 'global',   icon: '🌐', title: 'גלובלי',    route: null        },
]

const ALL_AVAILABLE_LANGUAGES = [
  { code: 'he', name: 'עברית', dir: 'rtl', flag: '🇮🇱' },
  { code: 'en', name: 'English', dir: 'ltr', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', dir: 'rtl', flag: '🇸🇦' },
  { code: 'fr', name: 'Français', dir: 'ltr', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', dir: 'ltr', flag: '🇩🇪' },
  { code: 'es', name: 'Español', dir: 'ltr', flag: '🇪🇸' },
  { code: 'ru', name: 'Русский', dir: 'ltr', flag: '🇷🇺' },
  { code: 'zh', name: '中文', dir: 'ltr', flag: '🇨🇳' },
  { code: 'pt', name: 'Português', dir: 'ltr', flag: '🇧🇷' },
  { code: 'ja', name: '日本語', dir: 'ltr', flag: '🇯🇵' },
]

function readAsDataUrl(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(file)
  })
}

// Auto-optimize uploads: keep SVGs/small logos as-is; downscale large photos to
// a reasonable size + JPEG so they never blow past the content-store size limit.
async function optimizeImage(file) {
  const dataUrl = await readAsDataUrl(file)
  if (file.type === 'image/svg+xml' || file.size < 200 * 1024) return dataUrl
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const maxDim = 1600
      let { width, height } = img
      if (Math.max(width, height) > maxDim) {
        const s = maxDim / Math.max(width, height)
        width = Math.round(width * s); height = Math.round(height * s)
      }
      const canvas = document.createElement('canvas')
      canvas.width = width; canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.onerror = () => resolve(dataUrl)
    img.src = dataUrl
  })
}

// Friendly image field: drag-and-drop or click to upload, or paste a URL.
function ImageUpload({ value, onChange }) {
  const [tab, setTab] = useState('upload')
  const [drag, setDrag] = useState(false)
  const [busy, setBusy] = useState(false)
  const isData = value && value.startsWith('data:')

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image')) return
    setBusy(true)
    try { onChange(await optimizeImage(file)) } finally { setBusy(false) }
  }

  return (
    <div className="imgup">
      {value && (
        <div className="imgup__preview-wrap">
          <img src={value} alt="" className="imgup__preview" />
          <button type="button" className="imgup__remove" title="הסר תמונה" onClick={() => onChange('')}>✕</button>
        </div>
      )}
      <div className="imgup__tabs">
        <button type="button" className={tab === 'upload' ? 'is-active' : ''} onClick={() => setTab('upload')}>⬆ העלאה</button>
        <button type="button" className={tab === 'url' ? 'is-active' : ''} onClick={() => setTab('url')}>🔗 קישור</button>
      </div>
      {tab === 'upload' ? (
        <label
          className={`imgup__drop ${drag ? 'imgup__drop--over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files?.[0]) }}
        >
          <input type="file" accept="image/*,image/svg+xml" hidden onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = '' }} />
          <span className="imgup__drop-icon">{busy ? '⏳' : '⬆'}</span>
          <span className="imgup__drop-main">{busy ? 'מעבד תמונה…' : 'גררו תמונה לכאן או לחצו לבחירה'}</span>
          <span className="imgup__drop-hint">מותאם אוטומטית לגודל אופטימלי · PNG, JPG, SVG</span>
        </label>
      ) : (
        <input className="fi__input" value={isData ? '' : (value ?? '')} onChange={(e) => onChange(e.target.value)} placeholder="הדביקו כתובת URL של תמונה" dir="ltr" />
      )}
    </div>
  )
}

// ─── LinkedIn article importer ────────────────────────────────────────────────
async function fetchLinkedInArticle(url) {
  const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
  const res = await fetch(proxy)
  if (!res.ok) throw new Error('fetch failed')
  const html = await res.text()
  const doc = new DOMParser().parseFromString(html, 'text/html')

  // Try various LinkedIn article content selectors
  const bodyEl =
    doc.querySelector('.reader-article-content') ||
    doc.querySelector('[data-test-id="article-body"]') ||
    doc.querySelector('.article-body') ||
    doc.querySelector('article')

  const titleEl =
    doc.querySelector('.reader-content-blocks-article-title h1') ||
    doc.querySelector('h1.article-title') ||
    doc.querySelector('h1')

  const body = bodyEl
    ? Array.from(bodyEl.querySelectorAll('p, h2, h3, li'))
        .map((el) => el.textContent.trim())
        .filter(Boolean)
        .join('\n\n')
    : ''

  const title = titleEl?.textContent?.trim() || ''
  return { title, body }
}

// ─── single-field input ───────────────────────────────────────────────────────
function FieldInput({ type, value, onChange, dir, placeholder, onImportLinkedIn }) {
  if (type === 'linkedin-import') {
    const isUrl = value && /^https?:\/\//i.test(value)
    return (
      <div className="fi__linkedin">
        <input
          className="fi__input"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... (כתבה, פרסום, LinkedIn, אתר חדשות)"
          dir="ltr"
        />
        <div className="fi__linkedin-row">
          {value && (
            <a href={value} target="_blank" rel="noopener noreferrer" className="admin__btn admin__btn--sm">
              ↗ פתח קישור
            </a>
          )}
          {isUrl && onImportLinkedIn && (
            <button type="button" className="admin__btn admin__btn--sm admin__btn--primary" onClick={onImportLinkedIn}>
              ⬇ ייבא ותרגם אוטומטית
            </button>
          )}
        </div>
        <span className="admin__note">הדביקו קישור לכתבה/פרסום. המערכת תשלוף מקור, תאריך, כותרת, תמונה ותוכן — ותתרגם אוטומטית לעברית ואנגלית.</span>
      </div>
    )
  }
  if (type === 'image-upload') {
    return <ImageUpload value={value} onChange={onChange} />
  }
  if (type === 'textarea') {
    return (
      <textarea
        className="fi__input fi__input--area"
        dir={dir}
        rows={3}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    )
  }
  return (
    <input
      className="fi__input"
      dir={dir}
      value={value ?? ''}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

// ─── multi-language field: shows all languages for one schema field ────────────
function MultiField({ fieldSpec, languages, getVal, setVal, onTranslate, translating }) {
  if (fieldSpec.type === 'image-upload') {
    // Images are shared (not per-language) — show once with a note
    return (
      <div className="mf">
        <span className="mf__name">{fieldSpec.label} <span className="mf__shared-note">— משותף לכל השפות</span></span>
        <FieldInput
          type="image-upload"
          value={getVal('en', fieldSpec.path) || getVal('he', fieldSpec.path)}
          onChange={(v) => languages.forEach(l => setVal(l.code, fieldSpec.path, v))}
        />
      </div>
    )
  }

  return (
    <div className="mf">
      <span className="mf__name">{fieldSpec.label}</span>
      <div className="mf__langs">
        {languages.map((lang) => {
          const key = `${lang.code}:${fieldSpec.path}`
          const isTranslating = translating === key || translating === `all:${lang.code}`
          return (
            <div key={lang.code} className="mf__row">
              <span className="mf__badge" title={lang.name}>{lang.flag} {lang.code.toUpperCase()}</span>
              <div className="mf__input-wrap" dir={lang.dir}>
                <FieldInput
                  type={fieldSpec.type}
                  value={getVal(lang.code, fieldSpec.path)}
                  onChange={(v) => setVal(lang.code, fieldSpec.path, v)}
                  dir={lang.dir}
                />
              </div>
              {lang.code !== 'en' && onTranslate && (
                <button
                  type="button"
                  className={`mf__translate ${isTranslating ? 'mf__translate--busy' : ''}`}
                  title={`תרגם מאנגלית ל-${lang.name}`}
                  disabled={isTranslating}
                  onClick={() => onTranslate(lang.code, fieldSpec.path, fieldSpec.type)}
                >
                  {isTranslating ? '…' : '✦'}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── main admin component ─────────────────────────────────────────────────────
export default function Admin() {
  const {
    media,
    updateField, addListItem, removeListItem, updateMedia,
    resetContent, exportContent, importContent, baseFor,
    languages, addLanguage, removeLanguage,
    homeServices, setHomeServices,
    publishContent, verifyPassword, publishState, publishError,
  } = useLang()

  const [authed, setAuthed] = useState(() => localStorage.getItem('admin-ok') === '1')
  const [pass, setPass] = useState('')
  const [toast, setToast] = useState('')
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('admin-api-key') || '')
  const [translating, setTranslating] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [newLangCode, setNewLangCode] = useState('')
  const [activePage, setActivePage] = useState('home')
  const toastTimer = useRef(null)

  const flash = useCallback((msg) => {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2400)
  }, [])

  const saveApiKey = (key) => {
    setApiKey(key)
    try { localStorage.setItem('admin-api-key', key) } catch {}
  }

  // Get content value for a language + path
  const getVal = useCallback((langCode, path) => getIn(baseFor(langCode), path), [baseFor])
  const setVal = useCallback((langCode, path, val) => updateField(langCode, path, val), [updateField])

  // ── Auto-translate one field (server-side, no browser API key needed) ──────
  const translateField = useCallback(async (targetCode, path, type) => {
    if (type === 'image-upload') return
    const enVal = getVal('en', path)
    if (!enVal) { flash('שדה האנגלית ריק — אין מה לתרגם'); return }
    const langMeta = languages.find((l) => l.code === targetCode)
    const langName = langMeta?.name || targetCode
    setTranslating(`${targetCode}:${path}`)
    try {
      const res = await fetch('/api/translate', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ texts: [enVal], targetLang: langName, sourceLang: 'English' }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.translations?.[0]) { setVal(targetCode, path, data.translations[0]); flash(`✓ תורגם ל-${langName}`) }
      else if (res.status === 503) flash('🔑 הגדירו ANTHROPIC_API_KEY ב-Vercel כדי לתרגם')
      else flash('שגיאה בתרגום')
    } catch {
      flash('שגיאת רשת')
    } finally { setTranslating(null) }
  }, [getVal, setVal, languages, flash])

  // ── Translate ALL text fields for a language (one server call) ─────────────
  const translateAll = useCallback(async (targetCode) => {
    const langMeta = languages.find((l) => l.code === targetCode)
    const langName = langMeta?.name || targetCode
    const enContent = baseFor('en')

    const fields = []
    schema.forEach((section) => {
      section.fields?.forEach((f) => {
        if (f.type !== 'image-upload') {
          const val = getIn(enContent, f.path)
          if (val && typeof val === 'string') fields.push(f)
        }
      })
    })
    if (!fields.length) return

    setTranslating(`all:${targetCode}`)
    flash(`מתרגם ל-${langName}… (${fields.length} שדות)`)
    try {
      const texts = fields.map((f) => getIn(enContent, f.path))
      const res = await fetch('/api/translate', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ texts, targetLang: langName, sourceLang: 'English' }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && Array.isArray(data.translations)) {
        fields.forEach((f, i) => { if (data.translations[i]) updateField(targetCode, f.path, data.translations[i]) })
        flash(`✓ ${fields.length} שדות תורגמו ל-${langName}`)
      } else if (res.status === 503) flash('🔑 הגדירו ANTHROPIC_API_KEY ב-Vercel')
      else flash('שגיאה בתרגום')
    } catch {
      flash('שגיאת רשת')
    } finally { setTranslating(null) }
  }, [baseFor, languages, updateField, flash])

  // ── Add a new language ─────────────────────────────────────────────────────
  const handleAddLanguage = useCallback(async (meta, autoTranslate) => {
    const enContent = clone(baseFor('en'))
    if (meta.dir) enContent.dir = meta.dir
    addLanguage(meta, enContent)
    flash(`✓ ${meta.name} נוספה`)
    if (autoTranslate) {
      setTimeout(() => translateAll(meta.code), 300)
    }
  }, [addLanguage, baseFor, translateAll, flash])

  // ── Export / Import ────────────────────────────────────────────────────────
  const doExport = () => {
    const blob = new Blob([exportContent()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'content.json'; a.click()
    URL.revokeObjectURL(url)
    flash('יוצא content.json')
  }
  const doImport = (e) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = () => { flash(importContent(reader.result) ? '✓ התוכן יובא' : 'קובץ לא תקין') }
    reader.readAsText(file); e.target.value = ''
  }

  // ── Get max item count across all languages for a list path ───────────────
  const maxItems = useCallback((path) => {
    return Math.max(...languages.map((l) => (getIn(baseFor(l.code), path) || []).length), 0)
  }, [languages, baseFor])

  // ── Login gate ─────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="admin-gate">
        <form onSubmit={async (e) => {
          e.preventDefault()
          const r = await verifyPassword(pass)
          if (r.ok) {
            sessionStorage.setItem('admin-token', pass)
            localStorage.setItem('admin-ok', '1'); setAuthed(true)
          } else if (r.status === 0) {
            // Backend unreachable (offline / local): fall back to the client gate.
            if (pass === ADMIN_PASS) {
              sessionStorage.setItem('admin-token', pass)
              localStorage.setItem('admin-ok', '1'); setAuthed(true)
              flash('מצב לא-מקוון — עריכה מקומית בלבד')
            } else flash('סיסמה שגויה')
          } else flash('סיסמה שגויה')
        }}>
          <div className="admin-gate__logo">DA</div>
          <h1>עורך התוכן</h1>
          <p>הזינו סיסמת מנהל כדי להמשיך</p>
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="סיסמה" autoFocus />
          <button type="submit">כניסה</button>
          <Link to="/" className="admin-gate__back">← חזרה לאתר</Link>
          {toast && <div className="admin-gate__err">{toast}</div>}
        </form>
        <style>{gateCss}</style>
      </div>
    )
  }

  const availableToAdd = ALL_AVAILABLE_LANGUAGES.filter((l) => !languages.find((x) => x.code === l.code))

  // ── Main admin render ──────────────────────────────────────────────────────
  return (
    <div className="admin">
      {/* ── top bar ── */}
      <header className="admin__bar">
        <div className="admin__brand">
          <span className="admin__logo">DA</span>
          <div>
            <strong>עורך התוכן</strong>
            <span className="admin__hint">
              {publishState === 'saving' ? '● שומר לאתר…'
                : publishState === 'saved' ? '✓ נשמר — חי לכל המבקרים'
                : publishState === 'error' ? '⚠ שמירה נכשלה — לחצו "פרסם עכשיו"'
                : 'כל שינוי נשמר אוטומטית לכל המבקרים'}
            </span>
          </div>
        </div>
        <div className="admin__actions">
          <button
            className="admin__btn"
            disabled={publishState === 'saving'}
            style={{ background: '#00A47C', color: '#fff', borderColor: '#00A47C', fontWeight: 700 }}
            onClick={async () => {
              const r = await publishContent()
              if (r.ok) flash('פורסם! השינויים חיים לכל המבקרים ✓')
              else if (r.status === 401) flash('הפרסום נכשל: סיסמה שגויה')
              else if (r.status === 503) flash('הפרסום נכשל: ה-backend לא מוגדר (ראו הוראות הקמה)')
              else flash('הפרסום נכשל: ' + (r.error || publishError || 'שגיאה'))
            }}
          >
            {publishState === 'saving' ? 'שומר…' : publishState === 'saved' ? 'נשמר ✓' : '⬆ פרסם עכשיו'}
          </button>
          <button className="admin__btn" onClick={() => setShowSettings((s) => !s)}>⚙ הגדרות</button>
          <a className="admin__btn" href="/" target="_blank" rel="noreferrer">צפה באתר ↗</a>
          <button className="admin__btn" onClick={doExport}>ייצוא JSON</button>
          <label className="admin__btn admin__btn--file">ייבוא JSON<input type="file" accept="application/json" onChange={doImport} hidden /></label>
          <button className="admin__btn admin__btn--danger" onClick={() => { if (confirm('לאפס את כל התוכן לברירת המחדל?')) { resetContent(); flash('אופס לברירת מחדל') } }}>איפוס</button>
          <button className="admin__btn" onClick={() => { localStorage.removeItem('admin-ok'); setAuthed(false) }}>יציאה</button>
        </div>
      </header>

      <div className="admin__body">

        {/* ── settings panel ── */}
        {showSettings && (
          <section className="admin__card admin__card--settings">
            <h2>⚙ הגדרות</h2>

            {/* API key */}
            <div className="settings__row">
              <label className="settings__label">מפתח Anthropic API (לתרגום אוטומטי)</label>
              <div className="settings__key-row">
                <input
                  type="password"
                  className="fi__input"
                  value={apiKey}
                  onChange={(e) => saveApiKey(e.target.value)}
                  placeholder="sk-ant-..."
                  dir="ltr"
                />
                {apiKey && <span className="settings__key-ok">✓ מפתח מוגדר</span>}
              </div>
              <span className="admin__note">המפתח נשמר בדפדפן זה בלבד ואינו נשלח לשום שרת חיצוני מלבד Anthropic.</span>
            </div>

            {/* Language manager */}
            <div className="settings__langs">
              <h3>שפות פעילות</h3>
              <div className="lang-chips">
                {languages.map((l) => (
                  <div key={l.code} className="lang-chip">
                    <span>{l.flag} {l.name}</span>
                    <div className="lang-chip__actions">
                      {l.code !== 'he' && l.code !== 'en' && (
                        <button
                          className="lang-chip__btn lang-chip__btn--danger"
                          onClick={() => { if (confirm(`למחוק את ${l.name}?`)) { removeLanguage(l.code); flash(`✓ ${l.name} הוסרה`) } }}
                        >✕</button>
                      )}
                      {l.code !== 'en' && (
                        <button
                          className="lang-chip__btn lang-chip__btn--translate"
                          title={`תרגם הכל מאנגלית ל-${l.name}`}
                          disabled={!!translating}
                          onClick={() => translateAll(l.code)}
                        >
                          {translating === `all:${l.code}` ? '⏳' : '✦ תרגם הכל'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {availableToAdd.length > 0 && (
                <div className="settings__add-lang">
                  <select className="fi__input fi__input--select" value={newLangCode} onChange={(e) => setNewLangCode(e.target.value)}>
                    <option value="">+ בחרו שפה להוספה</option>
                    {availableToAdd.map((l) => (
                      <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
                    ))}
                  </select>
                  {newLangCode && (
                    <>
                      <button
                        className="admin__btn"
                        disabled={!!translating}
                        onClick={() => {
                          const meta = ALL_AVAILABLE_LANGUAGES.find((l) => l.code === newLangCode)
                          handleAddLanguage(meta, false)
                          setNewLangCode('')
                        }}
                      >הוסף (ערוך ידנית)</button>
                      <button
                        className="admin__btn admin__btn--primary"
                        disabled={!!translating || !apiKey}
                        title={!apiKey ? 'הגדירו מפתח API כדי לתרגם אוטומטית' : ''}
                        onClick={() => {
                          const meta = ALL_AVAILABLE_LANGUAGES.find((l) => l.code === newLangCode)
                          handleAddLanguage(meta, true)
                          setNewLangCode('')
                        }}
                      >
                        {translating ? '⏳ מתרגם…' : '✦ הוסף + תרגם אוטומטית'}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── page cards ── */}
        <div className="admin__page-nav">
          {PAGE_CARDS.map((p) => (
            <button
              key={p.id}
              className={`admin__page-card ${activePage === p.id ? 'admin__page-card--active' : ''}`}
              onClick={() => setActivePage(p.id)}
            >
              <span className="apc__icon">{p.icon}</span>
              <span className="apc__title">{p.title}</span>
              {p.route && (
                <a
                  href={p.route}
                  target="_blank"
                  rel="noreferrer"
                  className="apc__link"
                  onClick={(e) => e.stopPropagation()}
                  title={`פתח ${p.title}`}
                >↗</a>
              )}
            </button>
          ))}
        </div>

        {/* ── media (shared across all languages, shown on global page) ── */}
        {activePage === 'global' && (
          <section className="admin__card">
            <h2>מדיה (תמונות) — משותף לכל השפות</h2>
            {MEDIA_FIELDS.map(({ label, key }) => (
              <div key={key} className="mf">
                <span className="mf__name">{label}</span>
                <FieldInput type="image-upload" value={media[key]} onChange={(v) => updateMedia(key, v)} />
              </div>
            ))}
          </section>
        )}

        {/* ── home: choose which services appear on the home page ── */}
        {activePage === 'home' && (() => {
          const svcLang = languages.find((l) => l.code === 'he') ? 'he' : languages[0]?.code
          const services = getIn(baseFor(svcLang), 'services.items') || []
          const allIdx = services.map((_, i) => i)
          const selected = Array.isArray(homeServices) ? homeServices : allIdx
          const isOn = (i) => selected.includes(i)
          const toggle = (i) => {
            const next = isOn(i) ? selected.filter((x) => x !== i) : [...selected, i].sort((a, b) => a - b)
            setHomeServices(next.length === allIdx.length ? null : next)
          }
          return (
            <section className="admin__card">
              <h2>שירותים בדף הבית</h2>
              <p className="admin__note" style={{ marginBottom: 14 }}>
                בחרו אילו שירותים יוצגו בקטע השירותים בדף הבית (מתוך {services.length}).
                שאר השירותים עדיין יופיעו בדף השירותים המלא. נבחרו: {selected.length}.
              </p>
              <div className="home-svc__grid">
                {services.map((item, i) => (
                  <button
                    type="button"
                    key={i}
                    className={`home-svc ${isOn(i) ? 'home-svc--on' : ''}`}
                    onClick={() => toggle(i)}
                    aria-pressed={isOn(i)}
                  >
                    <span className="home-svc__box" aria-hidden="true">{isOn(i) ? '✓' : ''}</span>
                    <span className="home-svc__num">{item.num || String(i + 1).padStart(2, '0')}</span>
                    <span className="home-svc__title">{item.title}</span>
                  </button>
                ))}
              </div>
              <div className="home-svc__actions">
                <button className="admin__btn admin__btn--sm" onClick={() => setHomeServices(null)}>הצג הכל</button>
                <button className="admin__btn admin__btn--sm" onClick={() => setHomeServices([])}>נקה הכל</button>
              </div>
              <style>{`
                .home-svc__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px; }
                .home-svc {
                  display: flex; align-items: center; gap: 10px; cursor: pointer;
                  width: 100%; text-align: start; font-family: inherit;
                  padding: 12px 14px; border-radius: 10px;
                  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
                  transition: all 0.15s;
                }
                .home-svc:hover { background: rgba(255,255,255,0.07); }
                .home-svc--on { background: rgba(0,128,96,0.16); border-color: rgba(0,128,96,0.4); }
                .home-svc__box {
                  width: 20px; height: 20px; flex-shrink: 0; border-radius: 6px;
                  display: flex; align-items: center; justify-content: center;
                  border: 1px solid rgba(255,255,255,0.25); color: #fff;
                  font-size: 13px; font-weight: 800; line-height: 1;
                }
                .home-svc--on .home-svc__box { background: #00A47C; border-color: #00A47C; }
                .home-svc__num { font-size: 12px; font-weight: 700; color: var(--neon-cyan, #5bcdda); min-width: 22px; }
                .home-svc__title { font-size: 14px; font-weight: 600; color: #fff; }
                .home-svc__actions { display: flex; gap: 8px; margin-top: 14px; }
              `}</style>
            </section>
          )
        })()}

        {/* ── schema sections (filtered by active page) ── */}
        {schema.filter((s) => s.pages?.includes(activePage)).map((section) => (
          <section key={section.title} className="admin__card">
            <h2>{section.title}</h2>

            {/* simple fields */}
            {section.fields?.map((f) => (
              <MultiField
                key={f.path}
                fieldSpec={f}
                languages={languages}
                getVal={getVal}
                setVal={setVal}
                onTranslate={translateField}
                translating={translating}
              />
            ))}

            {/* list fields */}
            {section.lists?.map((list) => {
              const count = maxItems(list.path)
              const allCodes = languages.map((l) => l.code)

              return (
                <div key={list.path} className="admin__list">
                  <div className="admin__list-head">
                    <h3>{list.label}</h3>
                    <div className="admin__list-btns">
                      {list.batchUpload && (
                        <label className="admin__add admin__add--batch" title="העלה מספר קבצים בבת אחת">
                          ⬆ העלה מרובים
                          <input type="file" accept="image/*,image/svg+xml" multiple hidden
                            onChange={async (e) => {
                              const files = Array.from(e.target.files || [])
                              if (!files.length) return
                              const newItems = await Promise.all(files.map(async (f) => ({
                                name: f.name.replace(/\.[^.]+$/, ''),
                                logo: await readAsDataUrl(f),
                              })))
                              // Add to ALL languages
                              allCodes.forEach((code) => {
                                const current = getIn(baseFor(code), list.path) || []
                                updateField(code, list.path, [...current, ...newItems])
                              })
                              e.target.value = ''
                              flash(`✓ ${newItems.length} לוגואים נוספו לכל השפות`)
                            }}
                          />
                        </label>
                      )}
                      <button className="admin__add" onClick={() => addListItem(allCodes, list.path, list.template)}>
                        + הוסף לכל השפות
                      </button>
                    </div>
                  </div>

                  {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="admin__item">
                      <div className="admin__item-no">{i + 1}</div>
                      <div className="admin__item-fields">
                        {list.stringList ? (
                          /* string list (e.g. bio paragraphs) — show per language */
                          <div className="mf">
                            <span className="mf__name">פסקה {i + 1}</span>
                            <div className="mf__langs">
                              {languages.map((lang) => {
                                const items = getIn(baseFor(lang.code), list.path) || []
                                const val = items[i] ?? ''
                                return (
                                  <div key={lang.code} className="mf__row">
                                    <span className="mf__badge">{lang.flag} {lang.code.toUpperCase()}</span>
                                    <div className="mf__input-wrap" dir={lang.dir}>
                                      <FieldInput type="textarea" value={val} onChange={(v) => updateField(lang.code, `${list.path}.${i}`, v)} dir={lang.dir} />
                                    </div>
                                    {lang.code !== 'en' && (
                                      <button type="button"
                                        className={`mf__translate ${translating === `${lang.code}:${list.path}.${i}` ? 'mf__translate--busy' : ''}`}
                                        disabled={!!translating}
                                        onClick={() => translateField(lang.code, `${list.path}.${i}`, 'textarea')}
                                        title={`תרגם מאנגלית ל-${lang.name}`}
                                      >
                                        {translating === `${lang.code}:${list.path}.${i}` ? '…' : '✦'}
                                      </button>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        ) : (
                          /* object list — show each item field per language */
                          list.itemFields.map((cf) => {
                            // linkedin-import: shared URL field + import button
                            if (cf.type === 'linkedin-import' || cf.type === 'text-shared') {
                              const firstLang = languages[0]
                              const items = getIn(baseFor(firstLang.code), list.path) || []
                              const val = items[i]?.[cf.key] ?? ''
                              const handleImport = cf.type === 'linkedin-import' ? async () => {
                                if (!val || !/^https?:\/\//i.test(val)) { flash('הדביקו קישור תקין תחילה'); return }
                                flash('⏳ מייבא ומתרגם… (עד דקה)')
                                try {
                                  const res = await fetch('/api/import-article', {
                                    method: 'POST', headers: { 'content-type': 'application/json' },
                                    body: JSON.stringify({ url: val }),
                                  })
                                  const data = await res.json().catch(() => ({}))
                                  if (!res.ok) {
                                    flash(res.status === 503 ? '🔑 הגדירו ANTHROPIC_API_KEY ב-Vercel' : `שגיאת ייבוא: ${data.error || res.status}`)
                                    return
                                  }
                                  allCodes.forEach((code) => {
                                    const src = code === 'he' ? data.he : data.en
                                    if (src) {
                                      if (src.title) updateField(code, `${list.path}.${i}.title`, src.title)
                                      if (src.excerpt) updateField(code, `${list.path}.${i}.excerpt`, src.excerpt)
                                      if (src.body) updateField(code, `${list.path}.${i}.body`, src.body)
                                      if (src.tag) updateField(code, `${list.path}.${i}.tag`, src.tag)
                                    }
                                    if (data.image) updateField(code, `${list.path}.${i}.image`, data.image)
                                    if (data.date) updateField(code, `${list.path}.${i}.date`, data.date)
                                    updateField(code, `${list.path}.${i}.sourceUrl`, data.sourceUrl || val)
                                  })
                                  flash('✓ הכתבה יובאה ותורגמה אוטומטית')
                                } catch {
                                  flash('שגיאת רשת בייבוא')
                                }
                              } : undefined
                              return (
                                <div key={cf.key} className="mf">
                                  <span className="mf__name">{cf.label} <span className="mf__shared-note">— משותף</span></span>
                                  <FieldInput
                                    type={cf.type}
                                    value={val}
                                    onChange={(v) => allCodes.forEach((code) => updateField(code, `${list.path}.${i}.${cf.key}`, v))}
                                    onImportLinkedIn={handleImport}
                                  />
                                </div>
                              )
                            }
                            if (cf.type === 'image-upload') {
                              // Image fields: shared value across languages
                              const firstLang = languages[0]
                              const items = getIn(baseFor(firstLang.code), list.path) || []
                              const val = items[i]?.[cf.key] ?? ''
                              return (
                                <div key={cf.key} className="mf">
                                  <span className="mf__name">{cf.label} <span className="mf__shared-note">— משותף</span></span>
                                  <FieldInput
                                    type="image-upload"
                                    value={val}
                                    onChange={(v) => allCodes.forEach((code) => updateField(code, `${list.path}.${i}.${cf.key}`, v))}
                                  />
                                </div>
                              )
                            }
                            return (
                              <div key={cf.key} className="mf">
                                <span className="mf__name">{cf.label}</span>
                                <div className="mf__langs">
                                  {languages.map((lang) => {
                                    const items = getIn(baseFor(lang.code), list.path) || []
                                    const val = items[i]?.[cf.key] ?? ''
                                    const tKey = `${lang.code}:${list.path}.${i}.${cf.key}`
                                    return (
                                      <div key={lang.code} className="mf__row">
                                        <span className="mf__badge">{lang.flag} {lang.code.toUpperCase()}</span>
                                        <div className="mf__input-wrap" dir={lang.dir}>
                                          <FieldInput
                                            type={cf.type}
                                            value={val}
                                            onChange={(v) => updateField(lang.code, `${list.path}.${i}.${cf.key}`, v)}
                                            dir={lang.dir}
                                          />
                                        </div>
                                        {lang.code !== 'en' && (
                                          <button type="button"
                                            className={`mf__translate ${translating === tKey || translating === `all:${lang.code}` ? 'mf__translate--busy' : ''}`}
                                            disabled={!!translating}
                                            onClick={() => translateField(lang.code, `${list.path}.${i}.${cf.key}`, cf.type)}
                                            title={`תרגם ל-${lang.name}`}
                                          >
                                            {translating === tKey ? '…' : '✦'}
                                          </button>
                                        )}
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>
                      <button className="admin__remove" onClick={() => { if (confirm('למחוק פריט זה מכל השפות?')) removeListItem(allCodes, list.path, i) }} aria-label="מחק">✕</button>
                    </div>
                  ))}
                </div>
              )
            })}
          </section>
        ))}

        <p className="admin__footer-note">
          אחסון מקומי בדפדפן זה בלבד. לשמירה לכל המבקרים — ייצאו JSON ושלחו למפתח, או נחבר בהמשך שרת/CMS.
        </p>
      </div>

      {toast && <div className="admin__toast">{toast}</div>}
      <style>{adminCss}</style>
    </div>
  )
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const gateCss = `
  .admin-gate { min-height: 100vh; display: grid; place-items: center; background: #07090f; color: #fff; font-family: var(--font-body); padding: 24px; }
  .admin-gate form { width: min(380px, 100%); background: #11131c; border: 1px solid rgba(255,255,255,0.1); border-radius: 18px; padding: 36px; display: flex; flex-direction: column; gap: 14px; text-align: center; }
  .admin-gate__logo { width: 56px; height: 56px; border-radius: 14px; background: var(--primary); display: grid; place-items: center; font-weight: 800; font-family: 'Inter'; margin: 0 auto 6px; font-size: 18px; }
  .admin-gate h1 { font-size: 22px; }
  .admin-gate p { color: rgba(255,255,255,0.5); font-size: 14px; margin-bottom: 6px; }
  .admin-gate input { padding: 13px 16px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.18); background: #07090f; color: #fff; font-size: 15px; text-align: center; }
  .admin-gate button { padding: 13px; border-radius: 10px; border: none; background: var(--primary); color: #fff; font-weight: 600; font-size: 15px; cursor: pointer; }
  .admin-gate__back { color: rgba(255,255,255,0.5); font-size: 13px; }
  .admin-gate__err { color: #ff6b6b; font-size: 13px; }
`

const adminCss = `
  .admin { min-height: 100vh; background: #07090f; color: #fff; font-family: var(--font-body); direction: rtl; }

  /* top bar */
  .admin__bar { position: sticky; top: 0; z-index: 10; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; padding: 14px 24px; background: rgba(10,12,20,0.95); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(255,255,255,0.1); }
  .admin__brand { display: flex; align-items: center; gap: 12px; }
  .admin__logo { width: 40px; height: 40px; border-radius: 10px; background: var(--primary); display: grid; place-items: center; font-weight: 800; font-family: 'Inter'; flex-shrink: 0; }
  .admin__brand strong { display: block; font-size: 15px; }
  .admin__hint { font-size: 12px; color: rgba(255,255,255,0.4); }
  .admin__actions { display: flex; gap: 8px; flex-wrap: wrap; }
  .admin__btn { padding: 9px 14px; border-radius: 9px; border: 1px solid rgba(255,255,255,0.18); background: rgba(255,255,255,0.04); color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
  .admin__btn:hover { background: rgba(255,255,255,0.1); }
  .admin__btn--file { display: inline-flex; align-items: center; }
  .admin__btn--danger { border-color: rgba(216,44,13,0.45); color: #ff8a73; }
  .admin__btn--primary { background: rgba(0,128,96,0.25); border-color: var(--primary); color: #5adfb9; }
  .admin__btn--primary:hover { background: rgba(0,128,96,0.4); }
  .admin__btn--sm { padding: 7px 12px; font-size: 12px; }
  .admin__btn:disabled { opacity: 0.45; cursor: not-allowed; }

  /* body */
  .admin__body { max-width: 960px; margin: 0 auto; padding: 28px 24px 80px; display: flex; flex-direction: column; gap: 20px; }
  .admin__card { background: #11131c; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px; }
  .admin__card h2 { font-size: 17px; margin-bottom: 18px; color: var(--neon-cyan); }
  .admin__card--settings { border-color: rgba(139,92,246,0.35); }
  .admin__note { font-size: 12px; color: rgba(255,255,255,0.38); margin-top: 4px; }

  /* settings */
  .settings__row { display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px; }
  .settings__label { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.7); }
  .settings__key-row { display: flex; align-items: center; gap: 10px; }
  .settings__key-ok { font-size: 12px; color: #5adfb9; white-space: nowrap; }
  .settings__langs h3 { font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.7); margin-bottom: 12px; }
  .settings__add-lang { display: flex; align-items: center; gap: 10px; margin-top: 14px; flex-wrap: wrap; }

  /* language chips */
  .lang-chips { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 4px; }
  .lang-chip { display: flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); font-size: 14px; font-weight: 600; }
  .lang-chip__actions { display: flex; gap: 6px; }
  .lang-chip__btn { padding: 4px 10px; border-radius: 7px; border: none; font-size: 12px; font-weight: 600; cursor: pointer; }
  .lang-chip__btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .lang-chip__btn--danger { background: rgba(216,44,13,0.2); color: #ff8a73; }
  .lang-chip__btn--translate { background: rgba(139,92,246,0.2); color: #c4b5fd; border: 1px solid rgba(139,92,246,0.3); }
  .lang-chip__btn--translate:hover:not(:disabled) { background: rgba(139,92,246,0.35); }

  /* page nav cards */
  .admin__page-nav { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
  .admin__page-card { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: 16px 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); cursor: pointer; font-family: inherit; color: rgba(255,255,255,0.65); transition: all 0.18s ease; position: relative; }
  .admin__page-card:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.2); color: #fff; }
  .admin__page-card--active { background: rgba(0,128,96,0.15); border-color: var(--primary); color: #fff; }
  .apc__icon { font-size: 22px; }
  .apc__title { font-size: 13px; font-weight: 700; }
  .apc__link { position: absolute; top: 7px; inset-inline-end: 8px; font-size: 10px; color: rgba(255,255,255,0.35); text-decoration: none; padding: 2px 5px; border-radius: 4px; }
  .apc__link:hover { color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.08); }
  @media (max-width: 680px) { .admin__page-nav { grid-template-columns: repeat(2, 1fr); } }

  /* field inputs */
  .fi__input { padding: 10px 13px; border-radius: 9px; border: 1px solid rgba(255,255,255,0.13); background: #07090f; color: #fff; font-size: 14px; font-family: inherit; width: 100%; box-sizing: border-box; }
  .fi__input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 2px rgba(0,128,96,0.18); }
  .fi__input--area { resize: vertical; line-height: 1.6; min-height: 72px; }
  .fi__input--select { appearance: none; cursor: pointer; }
  .fi__linkedin { display: flex; flex-direction: column; gap: 6px; }
  .fi__linkedin-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .fi__imgup { display: flex; flex-direction: column; gap: 8px; }
  .fi__preview { max-height: 64px; max-width: 200px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.12); object-fit: contain; background: rgba(0,0,0,0.4); padding: 5px; }
  .fi__imgup-row { display: flex; gap: 8px; flex-wrap: wrap; }

  /* Friendly image uploader */
  .imgup { display: flex; flex-direction: column; gap: 10px; }
  .imgup__preview-wrap { position: relative; display: inline-block; align-self: flex-start; }
  .imgup__preview { max-height: 120px; max-width: 100%; border-radius: 10px; border: 1px solid rgba(255,255,255,0.14); object-fit: contain; background: rgba(0,0,0,0.4); padding: 6px; display: block; }
  .imgup__remove { position: absolute; top: -8px; inset-inline-end: -8px; width: 24px; height: 24px; border-radius: 50%; background: #e5484d; color: #fff; border: 2px solid #0b0d14; cursor: pointer; font-size: 12px; line-height: 1; display: flex; align-items: center; justify-content: center; }
  .imgup__tabs { display: inline-flex; gap: 4px; background: rgba(255,255,255,0.05); border-radius: 9px; padding: 3px; align-self: flex-start; }
  .imgup__tabs button { padding: 6px 16px; border-radius: 7px; border: none; background: transparent; color: rgba(255,255,255,0.6); font-family: inherit; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
  .imgup__tabs button.is-active { background: rgba(255,255,255,0.12); color: #fff; }
  .imgup__drop { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; text-align: center; padding: 24px 16px; border-radius: 12px; border: 2px dashed rgba(255,255,255,0.18); background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.75); cursor: pointer; transition: all 0.18s; }
  .imgup__drop:hover, .imgup__drop--over { border-color: var(--neon-cyan, #5bcdda); background: rgba(91,205,218,0.08); }
  .imgup__drop-icon { font-size: 24px; }
  .imgup__drop-main { font-size: 14px; font-weight: 600; }
  .imgup__drop-hint { font-size: 12px; color: rgba(255,255,255,0.45); }

  /* multi-field */
  .mf { margin-bottom: 18px; }
  .mf__name { display: block; font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.65); margin-bottom: 8px; }
  .mf__shared-note { font-size: 11px; font-weight: 400; color: rgba(255,255,255,0.35); }
  .mf__langs { display: flex; flex-direction: column; gap: 6px; }
  .mf__row { display: grid; grid-template-columns: 56px 1fr auto; gap: 8px; align-items: start; }
  .mf__badge { display: inline-flex; align-items: center; justify-content: center; height: 34px; border-radius: 8px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.7); white-space: nowrap; padding: 0 6px; }
  .mf__input-wrap { flex: 1; min-width: 0; }
  .mf__translate { width: 30px; height: 34px; border-radius: 8px; border: 1px solid rgba(139,92,246,0.35); background: rgba(139,92,246,0.1); color: #c4b5fd; cursor: pointer; font-size: 13px; display: grid; place-items: center; flex-shrink: 0; align-self: start; }
  .mf__translate:hover:not(:disabled) { background: rgba(139,92,246,0.25); }
  .mf__translate:disabled { opacity: 0.4; cursor: not-allowed; }
  .mf__translate--busy { animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* list */
  .admin__list { margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.07); padding-top: 18px; }
  .admin__list-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .admin__list-head h3 { font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.8); }
  .admin__list-btns { display: flex; gap: 8px; align-items: center; }
  .admin__add { padding: 7px 14px; border-radius: 8px; border: 1px dashed rgba(91,205,218,0.5); background: rgba(91,205,218,0.07); color: var(--neon-cyan); font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
  .admin__add--batch { border-style: solid; background: rgba(139,92,246,0.1); border-color: rgba(139,92,246,0.4); color: #c4b5fd; display: inline-flex; align-items: center; gap: 6px; }
  .admin__item { display: grid; grid-template-columns: 28px 1fr 32px; gap: 14px; align-items: start; padding: 16px; border-radius: 12px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); margin-bottom: 12px; }
  .admin__item-no { width: 28px; height: 28px; border-radius: 7px; background: rgba(255,255,255,0.06); display: grid; place-items: center; font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.55); }
  .admin__item-fields { min-width: 0; }
  .admin__item-fields .mf:last-child { margin-bottom: 0; }
  .admin__remove { width: 30px; height: 30px; border-radius: 8px; border: 1px solid rgba(216,44,13,0.4); background: rgba(216,44,13,0.08); color: #ff8a73; cursor: pointer; font-size: 13px; display: grid; place-items: center; }

  /* footer */
  .admin__footer-note { font-size: 13px; color: rgba(255,255,255,0.35); text-align: center; line-height: 1.7; margin-top: 12px; }
  .admin__toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: #11131c; border: 1px solid rgba(0,164,124,0.4); color: #5adfb9; padding: 12px 24px; border-radius: 999px; font-size: 14px; font-weight: 600; z-index: 100; box-shadow: 0 10px 30px rgba(0,0,0,0.5); white-space: nowrap; }

  @media (max-width: 640px) {
    .admin__bar { padding: 12px 16px; }
    .admin__body { padding: 16px 14px 80px; }
    .mf__row { grid-template-columns: 44px 1fr auto; }
    .admin__item { grid-template-columns: 24px 1fr 28px; }
    .settings__add-lang { flex-direction: column; align-items: stretch; }
  }
`
