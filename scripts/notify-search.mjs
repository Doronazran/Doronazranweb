// Automatic search-engine submission, run at the end of a production build.
// Uses the IndexNow protocol (Bing, Yandex, Seznam, Naver and others pick this
// up automatically). Google does not support IndexNow — its sitemap is fetched
// automatically once verified in Search Console (see DEPLOYMENT notes).
//
// Gated to production builds only, and never fails the build.
import { ROUTES, siteUrl } from './routes.mjs'

const KEY = '8f3b2a1c9d7e4f60b5a8c2e1d4f7a093'

async function run() {
  const isProd = process.env.VERCEL_ENV === 'production' || process.env.SEO_NOTIFY === '1'
  if (!isProd) {
    console.log('[notify-search] not a production deploy — skipping submission.')
    return
  }

  const SITE = siteUrl()
  if (/localhost|127\.0\.0\.1/.test(SITE)) {
    console.log('[notify-search] localhost domain — skipping submission.')
    return
  }

  const host = new URL(SITE).host
  const urlList = ROUTES.map((r) => `${SITE}${r.path === '/' ? '/' : r.path}`)
  const body = { host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    })
    console.log(`[notify-search] IndexNow submitted ${urlList.length} URLs for ${host} — status ${res.status}`)
  } catch (e) {
    console.warn('[notify-search] IndexNow ping failed (non-fatal):', e.message)
  }

  console.log('[notify-search] Note: Google picks up the sitemap automatically once the domain is verified in Search Console.')
}

run().catch((e) => {
  console.warn('[notify-search] non-fatal error:', e.message)
  process.exit(0)
})
