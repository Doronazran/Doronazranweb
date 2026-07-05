import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { translations } from './translations'
import { IMAGES } from '../data/images'
import {
  clone, getIn, setIn,
  loadOverrides, saveOverrides, loadMedia, saveMedia,
} from '../content/store'

const LanguageContext = createContext(null)

const DEFAULT_MEDIA = {
  logo: '/logo.png',
  heroImage: IMAGES.hero,
  portrait: IMAGES.portrait,
}

export const BUILT_IN_LANGUAGES = [
  { code: 'he', name: 'עברית', dir: 'rtl', flag: '🇮🇱' },
  { code: 'en', name: 'English', dir: 'ltr', flag: '🇺🇸' },
]

const LANG_KEY = 'site-languages-v1'

function loadLanguages() {
  try {
    const s = localStorage.getItem(LANG_KEY)
    return s ? JSON.parse(s) : BUILT_IN_LANGUAGES
  } catch { return BUILT_IN_LANGUAGES }
}

function saveLangs(list) {
  try { localStorage.setItem(LANG_KEY, JSON.stringify(list)) } catch {}
}

// Which service indices are featured on the home page (language-independent).
// null = show all services.
const HOME_SERVICES_KEY = 'home-services-v1'

function loadHomeServices() {
  try {
    const s = localStorage.getItem(HOME_SERVICES_KEY)
    return s ? JSON.parse(s) : null
  } catch { return null }
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = typeof localStorage !== 'undefined' && localStorage.getItem('lang')
    return saved === 'en' || saved === 'he' ? saved : 'he'
  })

  const [overrides, setOverrides] = useState(() => loadOverrides())
  const [media, setMedia] = useState(() => ({ ...DEFAULT_MEDIA, ...loadMedia() }))
  const [languages, setLanguages] = useState(() => loadLanguages())
  const [homeServices, setHomeServicesState] = useState(() => loadHomeServices())

  const setHomeServices = useCallback((arr) => {
    setHomeServicesState(arr)
    try {
      if (arr == null) localStorage.removeItem(HOME_SERVICES_KEY)
      else localStorage.setItem(HOME_SERVICES_KEY, JSON.stringify(arr))
    } catch { /* ignore */ }
  }, [])

  const t = useMemo(
    () => overrides[lang] || translations[lang] || translations['he'],
    [overrides, lang],
  )

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = t.dir
    try { localStorage.setItem('lang', lang) } catch { /* ignore */ }
  }, [lang, t.dir])

  const toggle = () => setLang((prev) => (prev === 'he' ? 'en' : 'he'))

  // ── content editing API (used by the admin) ──
  const baseFor = useCallback(
    (lng) => {
      if (overrides[lng]) return clone(overrides[lng])
      if (translations[lng]) return clone(translations[lng])
      // dynamically added language — return empty shell based on English structure
      return clone(translations['en'] || {})
    },
    [overrides],
  )

  const updateField = useCallback((lng, path, value) => {
    setOverrides((prev) => {
      const base = prev[lng] ? clone(prev[lng]) : (translations[lng] ? clone(translations[lng]) : clone(translations['en']))
      const next = { ...prev, [lng]: base }
      setIn(next[lng], path, value)
      saveOverrides(next)
      return next
    })
  }, [])

  const addListItem = useCallback((langs, path, template) => {
    const langList = Array.isArray(langs) ? langs : [langs]
    setOverrides((prev) => {
      const next = { ...prev }
      langList.forEach((lng) => {
        const base = next[lng] ? clone(next[lng]) : (translations[lng] ? clone(translations[lng]) : clone(translations['en']))
        next[lng] = base
        const arr = getIn(next[lng], path)
        if (Array.isArray(arr)) arr.push(clone(template))
      })
      saveOverrides(next)
      return next
    })
  }, [])

  const removeListItem = useCallback((langs, path, index) => {
    const langList = Array.isArray(langs) ? langs : [langs]
    setOverrides((prev) => {
      const next = { ...prev }
      langList.forEach((lng) => {
        const base = next[lng] ? clone(next[lng]) : (translations[lng] ? clone(translations[lng]) : clone(translations['en']))
        next[lng] = base
        const arr = getIn(next[lng], path)
        if (Array.isArray(arr)) arr.splice(index, 1)
      })
      saveOverrides(next)
      return next
    })
  }, [])

  const updateMedia = useCallback((key, value) => {
    setMedia((prev) => {
      const next = { ...prev, [key]: value }
      const diff = {}
      Object.keys(next).forEach((k) => { if (next[k] !== DEFAULT_MEDIA[k]) diff[k] = next[k] })
      saveMedia(diff)
      return next
    })
  }, [])

  const resetContent = useCallback(() => {
    setOverrides({})
    saveOverrides({})
    setMedia({ ...DEFAULT_MEDIA })
    saveMedia({})
    setHomeServices(null)
  }, [setHomeServices])

  const exportContent = useCallback(
    () => JSON.stringify({ overrides, media, languages, homeServices }, null, 2),
    [overrides, media, languages, homeServices],
  )

  const importContent = useCallback((json) => {
    try {
      const data = JSON.parse(json)
      if (data.overrides) { setOverrides(data.overrides); saveOverrides(data.overrides) }
      if (data.media) { setMedia({ ...DEFAULT_MEDIA, ...data.media }); saveMedia(data.media) }
      if (data.languages) { setLanguages(data.languages); saveLangs(data.languages) }
      if (data.homeServices !== undefined) setHomeServices(data.homeServices)
      return true
    } catch {
      return false
    }
  }, [setHomeServices])

  const addLanguage = useCallback((meta, content) => {
    setLanguages((prev) => {
      if (prev.find((l) => l.code === meta.code)) return prev
      const next = [...prev, meta]
      saveLangs(next)
      return next
    })
    if (content) {
      setOverrides((prev) => {
        const next = { ...prev, [meta.code]: content }
        saveOverrides(next)
        return next
      })
    }
  }, [])

  const removeLanguage = useCallback((code) => {
    if (code === 'he' || code === 'en') return
    setLanguages((prev) => {
      const next = prev.filter((l) => l.code !== code)
      saveLangs(next)
      return next
    })
    setOverrides((prev) => {
      // eslint-disable-next-line no-unused-vars
      const { [code]: _removed, ...rest } = prev
      saveOverrides(rest)
      return rest
    })
  }, [])

  const value = {
    lang, setLang, toggle, t, dir: t.dir, media,
    languages,
    homeServices, setHomeServices,
    addLanguage,
    removeLanguage,
    isEdited: !!overrides[lang],
    updateField, addListItem, removeListItem, updateMedia,
    resetContent, exportContent, importContent, baseFor,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
