// Vercel Serverless Function: server-side translation.
// POST /api/translate { texts: string[], targetLang, targetCode?, sourceLang? }
// -> { translations: string[], via }
//
// Works with NO configuration: uses a free translation endpoint by default, and
// upgrades to higher-quality Claude translation when ANTHROPIC_API_KEY is set.

const MODEL = process.env.TRANSLATE_MODEL || 'claude-haiku-4-5-20251001'
const SEP = '|~|'

async function fetchWithTimeout(url, opts, ms) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), ms)
  try { return await fetch(url, { ...opts, signal: ctrl.signal }) }
  finally { clearTimeout(t) }
}

const NAME_TO_CODE = {
  english: 'en', עברית: 'he', hebrew: 'he', arabic: 'ar', العربية: 'ar',
  french: 'fr', français: 'fr', german: 'de', deutsch: 'de', spanish: 'es',
  español: 'es', russian: 'ru', русский: 'ru', chinese: 'zh', 中文: 'zh',
  portuguese: 'pt', português: 'pt', japanese: 'ja', 日本語: 'ja',
}
function toCode(nameOrCode) {
  if (!nameOrCode) return 'en'
  const s = String(nameOrCode).trim()
  if (/^[a-z]{2}$/i.test(s)) return s.toLowerCase()
  return NAME_TO_CODE[s.toLowerCase()] || 'en'
}

// Free translation via Google's public gtx endpoint (no key required).
async function freeTranslate(text, code) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(code)}&dt=t&q=${encodeURIComponent(text)}`
  const r = await fetchWithTimeout(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, 12000)
  if (!r.ok) throw new Error(`gtx ${r.status}`)
  const data = await r.json()
  return (data[0] || []).map((seg) => seg[0]).join('') || text
}

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Method not allowed' }) }

  let body = req.body
  if (typeof body === 'string') { try { body = JSON.parse(body) } catch { body = {} } }
  const texts = Array.isArray(body?.texts) ? body.texts : (body?.text ? [body.text] : [])
  const targetLang = body?.targetLang
  const sourceLang = body?.sourceLang || ''
  const code = toCode(body?.targetCode || targetLang)
  if (!texts.length || !targetLang) return res.status(400).json({ error: 'texts[] and targetLang are required' })

  // Preserve order and empties; only translate non-empty segments.
  const idx = []
  const payload = []
  texts.forEach((tx, i) => { if (tx && String(tx).trim()) { idx.push(i); payload.push(String(tx)) } })
  if (!payload.length) return res.status(200).json({ translations: texts, via: 'noop' })

  // 1) Preferred: Claude (higher quality) when configured.
  const key = process.env.ANTHROPIC_API_KEY
  if (key) {
    try {
      const joined = payload.join(`\n${SEP}\n`)
      const prompt = `Translate each segment${sourceLang ? ` from ${sourceLang}` : ''} to ${targetLang}. ` +
        `Segments are separated by "${SEP}" on its own line. Return ONLY the translations in the same order, ` +
        `separated by the same "${SEP}". No notes/numbering. Preserve meaning, tone and brand names.\n\n${joined}`
      const r = await fetchWithTimeout('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
        body: JSON.stringify({ model: MODEL, max_tokens: 8192, messages: [{ role: 'user', content: prompt }] }),
      }, 45000)
      if (r.ok) {
        const data = await r.json()
        const out = (data.content?.[0]?.text || '').split(SEP).map((s) => s.trim())
        if (out.length === payload.length) {
          const translations = [...texts]
          idx.forEach((origIndex, k) => { if (out[k] != null) translations[origIndex] = out[k] })
          return res.status(200).json({ translations, via: 'claude' })
        }
      }
      // fall through to free on any mismatch/error
    } catch { /* fall through */ }
  }

  // 2) Free fallback (no key needed).
  try {
    const results = await Promise.all(payload.map((tx) => freeTranslate(tx, code).catch(() => tx)))
    const translations = [...texts]
    idx.forEach((origIndex, k) => { translations[origIndex] = results[k] })
    return res.status(200).json({ translations, via: 'free' })
  } catch (e) {
    return res.status(502).json({ error: 'Translation failed.', detail: String(e?.message || e) })
  }
}
