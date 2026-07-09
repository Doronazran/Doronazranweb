// Vercel Serverless Function: import an article/publication from a URL.
// POST /api/import-article  { url }
//
// Fetches the page, extracts source/date/title/image, then uses Claude to pull
// clean article text AND translate everything to Hebrew + English at once.
// Requires ANTHROPIC_API_KEY. Returns:
//   { image, sourceUrl, source, date, he:{title,excerpt,body,tag}, en:{...} }

const MODEL = process.env.IMPORT_MODEL || 'claude-haiku-4-5-20251001'

async function fetchWithTimeout(url, opts, ms) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), ms)
  try { return await fetch(url, { ...opts, signal: ctrl.signal }) }
  finally { clearTimeout(t) }
}

// Free translation (no key) via Google's public gtx endpoint.
async function freeT(text, code) {
  if (!text || !text.trim()) return text
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(code)}&dt=t&q=${encodeURIComponent(text.slice(0, 1800))}`
    const r = await fetchWithTimeout(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, 10000)
    if (!r.ok) return text
    const data = await r.json()
    return (data[0] || []).map((s) => s[0]).join('') || text
  } catch { return text }
}

function meta(html, prop) {
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']*)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${prop}["']`, 'i'),
  ]
  for (const re of patterns) { const m = html.match(re); if (m) return m[1] }
  return ''
}

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Method not allowed' }) }

  let body = req.body
  if (typeof body === 'string') { try { body = JSON.parse(body) } catch { body = {} } }
  const url = (body && body.url || '').trim()
  if (!/^https?:\/\//i.test(url)) return res.status(400).json({ error: 'A valid URL is required' })

  const key = process.env.ANTHROPIC_API_KEY

  // 1) Fetch the page
  let html = ''
  try {
    const r = await fetchWithTimeout(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DoronBot/1.0)' } }, 12000)
    html = await r.text()
  } catch (e) {
    return res.status(502).json({ error: 'Could not fetch the URL.', detail: String(e?.message || e) })
  }

  // 2) Structured hints from meta tags (no AI needed)
  const image = meta(html, 'og:image') || meta(html, 'twitter:image')
  const source = meta(html, 'og:site_name') || (() => { try { return new URL(url).hostname.replace(/^www\./, '') } catch { return '' } })()
  const publishedRaw = meta(html, 'article:published_time') || meta(html, 'og:updated_time') || ''
  const ogTitle = meta(html, 'og:title') || (html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || '').trim()
  const ogDesc = meta(html, 'og:description') || meta(html, 'description') || ''

  // 3) Plain text for the model / for the no-key fallback
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 14000)

  // No AI key → still return the extracted content (source/title/image/body),
  // just untranslated. The admin can translate it with the ✦ button afterward.
  if (!key) {
    const body6k = text.slice(0, 6000)
    const [heTitle, enTitle, heExcerpt, enExcerpt] = await Promise.all([
      freeT(ogTitle, 'he'), freeT(ogTitle, 'en'), freeT(ogDesc, 'he'), freeT(ogDesc, 'en'),
    ])
    return res.status(200).json({
      image, sourceUrl: url, source, date: publishedRaw || '',
      translated: true,
      he: { title: heTitle, excerpt: heExcerpt, body: body6k, tag: '' },
      en: { title: enTitle, excerpt: enExcerpt, body: body6k, tag: '' },
    })
  }

  const prompt = `You are extracting a news article / publication from raw web page text and translating it.
Page URL: ${url}
Source hint: ${source}
Published hint: ${publishedRaw}

Return ONLY a JSON object (no markdown, no commentary) with this exact shape:
{
  "date": "<human-readable publication date, or empty>",
  "tag_he": "<one short Hebrew category, e.g. בינה מלאכותית / שרשרת אספקה / חדשנות>",
  "tag_en": "<same category in English>",
  "he": { "title": "<article title in Hebrew>", "excerpt": "<1-2 sentence Hebrew summary>", "body": "<full article body in Hebrew, clean paragraphs separated by \\n\\n>" },
  "en": { "title": "<article title in English>", "excerpt": "<1-2 sentence English summary>", "body": "<full article body in English, clean paragraphs separated by \\n\\n>" }
}
Translate faithfully. If the source is Hebrew, still provide accurate English, and vice-versa. Keep the body readable and free of navigation/boilerplate text.

PAGE TEXT:
${text}`

  // 4) Claude extract + translate
  try {
    const r = await fetchWithTimeout('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: MODEL, max_tokens: 4000, messages: [{ role: 'user', content: prompt }] }),
    }, 45000)
    if (!r.ok) {
      return res.status(502).json({ error: 'Translation model error.', detail: (await r.text().catch(() => '')).slice(0, 300) })
    }
    const data = await r.json()
    let raw = (data.content?.[0]?.text || '').trim()
    raw = raw.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim()
    const start = raw.indexOf('{'); const end = raw.lastIndexOf('}')
    const parsed = JSON.parse(start >= 0 ? raw.slice(start, end + 1) : raw)

    return res.status(200).json({
      image,
      sourceUrl: url,
      source,
      date: parsed.date || publishedRaw || '',
      he: { ...parsed.he, tag: parsed.tag_he || '' },
      en: { ...parsed.en, tag: parsed.tag_en || '' },
    })
  } catch (e) {
    return res.status(502).json({ error: 'Import failed.', detail: String(e?.message || e) })
  }
}
