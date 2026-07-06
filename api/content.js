// Vercel Serverless Function: the site's content backend.
//   GET  /api/content        -> public. Returns the saved content overrides.
//   POST /api/content        -> admin only. Saves overrides globally (all visitors).
//        body { verifyOnly:true }  -> just checks the password (used by admin login).
//
// Auth: the caller sends "Authorization: Bearer <password>". The password is
// checked SERVER-SIDE against the ADMIN_PASSWORD env var (never shipped to the
// browser), so this is real security -- unlike the client-side UI gate.
//
// Storage: Upstash Redis / Vercel KV. Env vars are injected automatically when
// you create the store in the Vercel dashboard (KV_REST_API_URL/TOKEN or the
// UPSTASH_REDIS_REST_URL/TOKEN pair).

import { Redis } from '@upstash/redis'

const KEY = 'site:content:v1'
const MAX_BYTES = 900_000 // Upstash free-tier request-size safety margin

function getRedis() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

function authed(req) {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return { ok: false, code: 503, msg: 'ADMIN_PASSWORD is not configured on the server.' }
  const sent = (req.headers.authorization || '').replace(/^Bearer\s+/i, '')
  if (sent !== expected) return { ok: false, code: 401, msg: 'Wrong password.' }
  return { ok: true }
}

export default async function handler(req, res) {
  const redis = getRedis()

  // Safe config diagnostic (booleans only, no secret values) -> /api/content?debug=1
  const debug = (req.query && (req.query.debug === '1' || req.query.debug === 'true')) ||
    (req.url && req.url.includes('debug=1'))
  if (req.method === 'GET' && debug) {
    return res.status(200).json({
      hasAdminPassword: !!process.env.ADMIN_PASSWORD,
      hasKv: !!redis,
      sawEnvKeys: {
        ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
        KV_REST_API_URL: !!process.env.KV_REST_API_URL,
        KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN,
        UPSTASH_REDIS_REST_URL: !!process.env.UPSTASH_REDIS_REST_URL,
        UPSTASH_REDIS_REST_TOKEN: !!process.env.UPSTASH_REDIS_REST_TOKEN,
      },
    })
  }

  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 'public, max-age=30, s-maxage=30, stale-while-revalidate=300')
    if (!redis) return res.status(200).json({})
    try {
      const data = await redis.get(KEY)
      return res.status(200).json(data || {})
    } catch {
      return res.status(200).json({})
    }
  }

  if (req.method === 'POST') {
    const auth = authed(req)
    if (!auth.ok) return res.status(auth.code).json({ error: auth.msg })

    let body = req.body
    if (typeof body === 'string') { try { body = JSON.parse(body) } catch { body = {} } }
    body = body || {}

    // Login/verification ping — password already checked above.
    if (body.verifyOnly) return res.status(200).json({ ok: true })

    if (!redis) return res.status(503).json({ error: 'Storage is not configured (create a Vercel KV / Upstash store).' })

    const payload = {
      overrides: body.overrides || {},
      media: body.media || {},
      languages: body.languages || null,
      homeServices: body.homeServices ?? null,
      updatedAt: new Date().toISOString(),
    }

    const serialized = JSON.stringify(payload)
    if (serialized.length > MAX_BYTES) {
      return res.status(413).json({ error: 'Content too large. Use image URLs instead of uploaded files.' })
    }

    try {
      await redis.set(KEY, payload)
      return res.status(200).json({ ok: true, updatedAt: payload.updatedAt })
    } catch (e) {
      return res.status(500).json({ error: 'Save failed.', detail: String(e?.message || e) })
    }
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ error: 'Method not allowed' })
}
