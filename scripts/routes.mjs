// Single list of public routes — shared by sitemap generation, prerendering
// and search-engine submission so they never drift apart.
export const ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/services', priority: '0.9', changefreq: 'monthly' },
  ...Array.from({ length: 12 }, (_, i) => ({ path: `/services/${i}`, priority: '0.7', changefreq: 'monthly' })),
  { path: '/work', priority: '0.8', changefreq: 'monthly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/about/overview', priority: '0.6', changefreq: 'monthly' },
  { path: '/about/vision', priority: '0.6', changefreq: 'monthly' },
  { path: '/about/team', priority: '0.6', changefreq: 'monthly' },
  { path: '/about/doron', priority: '0.7', changefreq: 'monthly' },
  { path: '/blog', priority: '0.8', changefreq: 'weekly' },
  { path: '/news', priority: '0.7', changefreq: 'weekly' },
  { path: '/contact', priority: '0.9', changefreq: 'yearly' },
  { path: '/accessibility', priority: '0.3', changefreq: 'yearly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
]

import fs from 'node:fs'

function fromDotEnv() {
  // Read the first VITE_SITE_URL found across the committed/local env files.
  for (const file of ['../.env.local', '../.env', '../.env.production']) {
    try {
      const txt = fs.readFileSync(new URL(file, import.meta.url), 'utf8')
      const m = txt.match(/^VITE_SITE_URL=(.+)$/m)
      if (m) return m[1].trim()
    } catch { /* file may not exist — try next */ }
  }
  return null
}

// Resolve the canonical site URL. Priority: Vercel/process env → .env → default.
// No trailing slash.
export function siteUrl() {
  const raw =
    process.env.VITE_SITE_URL ||
    process.env.SITE_URL ||
    fromDotEnv() ||
    'https://doronazran.com'
  return raw.replace(/\/$/, '')
}
