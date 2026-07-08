// Vercel Serverless Function: server-side translation (keeps the API key off the
// browser). POST /api/translate { texts: string[], targetLang, sourceLang? }
// -> { translations: string[] }. Requires ANTHROPIC_API_KEY.

const MODEL = process.env.TRANSLATE_MODEL || 'claude-haiku-4-5-20251001'
const SEP = '|~|'

async function fetchWithTimeout(url, opts, ms) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), ms)
  try { return await fetch(url, { ...opts, signal: ctrl.signal }) }
  finally { clearTimeout(t) }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Method not allowed' }) }

  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return res.status(503).json({ error: 'ANTHROPIC_API_KEY is not configured on the server.' })

  let body = req.body
  if (typeof body === 'string') { try { body = JSON.parse(body) } catch { body = {} } }
  const texts = Array.isArray(body?.texts) ? body.texts : (body?.text ? [body.text] : [])
  const targetLang = body?.targetLang
  const sourceLang = body?.sourceLang || ''
  if (!texts.length || !targetLang) return res.status(400).json({ error: 'texts[] and targetLang are required' })

  // Preserve empty segments (translate only non-empty ones), keep order.
  const idx = []
  const payload = []
  texts.forEach((tx, i) => { if (tx && String(tx).trim()) { idx.push(i); payload.push(String(tx)) } })
  if (!payload.length) return res.status(200).json({ translations: texts })

  const joined = payload.join(`\n${SEP}\n`)
  const prompt = `Translate each segment${sourceLang ? ` from ${sourceLang}` : ''} to ${targetLang}. ` +
    `The segments are separated by the delimiter "${SEP}" on its own line. ` +
    `Return ONLY the translations in the same order, separated by the same "${SEP}" delimiter. ` +
    `Do not add notes, numbering, or extra text. Preserve meaning, tone and any brand names.\n\n${joined}`

  try {
    const r = await fetchWithTimeout('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: MODEL, max_tokens: 8192, messages: [{ role: 'user', content: prompt }] }),
    }, 45000)
    if (!r.ok) return res.status(502).json({ error: 'Translation model error.', detail: (await r.text().catch(() => '')).slice(0, 300) })
    const data = await r.json()
    const out = (data.content?.[0]?.text || '').split(SEP).map((s) => s.trim())

    const translations = [...texts]
    idx.forEach((origIndex, k) => { if (out[k] != null) translations[origIndex] = out[k] })
    return res.status(200).json({ translations })
  } catch (e) {
    return res.status(502).json({ error: 'Translation failed.', detail: String(e?.message || e) })
  }
}
