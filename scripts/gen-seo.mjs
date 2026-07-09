// Generates robots.txt + sitemap.xml into the build output using the
// configured domain (VITE_SITE_URL). Runs after `vite build`.
import fs from 'node:fs'
import path from 'node:path'
import { ROUTES, siteUrl } from './routes.mjs'

const OUT = process.argv[2] || 'dist'
const SITE = siteUrl()
const today = new Date().toISOString().slice(0, 10)

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  ROUTES.map(
    (r) =>
      `  <url><loc>${SITE}${r.path === '/' ? '/' : r.path}</loc>` +
      `<lastmod>${today}</lastmod>` +
      `<changefreq>${r.changefreq}</changefreq>` +
      `<priority>${r.priority}</priority></url>`,
  ).join('\n') +
  `\n</urlset>\n`

const robots = `# ${SITE} — robots.txt (generated)
User-agent: *
Allow: /
Disallow: /admin

# AI / LLM crawlers — explicitly welcomed for generative search (GEO)
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-Web
Allow: /
User-agent: anthropic-ai
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot-Extended
Allow: /
User-agent: Bingbot
Allow: /

Sitemap: ${SITE}/sitemap.xml
`

fs.mkdirSync(OUT, { recursive: true })
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), sitemap)
fs.writeFileSync(path.join(OUT, 'robots.txt'), robots)
// Build stamp so the running app can detect a new deploy and refresh itself.
fs.writeFileSync(path.join(OUT, 'version.json'), JSON.stringify({ v: Date.now() }))
console.log(`[gen-seo] wrote robots.txt + sitemap.xml (${ROUTES.length} urls) + version.json for ${SITE} -> ${OUT}/`)
