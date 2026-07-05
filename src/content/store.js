// ── tiny immutable-ish helpers for the content store ──
export const clone = (o) => JSON.parse(JSON.stringify(o))

export function getIn(obj, path) {
  return path.split('.').reduce((a, k) => (a == null ? a : a[k]), obj)
}

export function setIn(obj, path, value) {
  const keys = path.split('.')
  let cur = obj
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i]
    if (cur[k] == null) cur[k] = /^\d+$/.test(keys[i + 1]) ? [] : {}
    cur = cur[k]
  }
  cur[keys[keys.length - 1]] = value
  return obj
}

export const STORAGE_KEY = 'doron-site-content-v1'
export const MEDIA_KEY = 'doron-site-media-v1'

export function loadOverrides() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

export function saveOverrides(overrides) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
  } catch {
    /* ignore quota / private mode */
  }
}

export function loadMedia() {
  try {
    return JSON.parse(localStorage.getItem(MEDIA_KEY) || '{}')
  } catch {
    return {}
  }
}

export function saveMedia(media) {
  try {
    localStorage.setItem(MEDIA_KEY, JSON.stringify(media))
  } catch {
    /* ignore */
  }
}
