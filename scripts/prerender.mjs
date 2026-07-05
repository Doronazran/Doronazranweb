// Build-time prerendering: renders each route in a headless browser and writes
// a static HTML snapshot so search engines and (crucially) non-JS LLM crawlers
// receive the full page content, not an empty <div id="root">.
//
// Designed to NEVER fail the deploy: if a headless browser is unavailable, it
// logs a warning and exits 0 — the SPA still ships with rich meta + JSON-LD.
import fs from 'node:fs'
import path from 'node:path'
import { ROUTES } from './routes.mjs'

const DIST = 'dist'
const PORT = 4178

async function run() {
  let puppeteer
  try {
    puppeteer = (await import('puppeteer')).default
  } catch {
    console.warn('[prerender] puppeteer not installed — skipping prerender (SPA + meta/JSON-LD still ship).')
    return
  }

  const { preview } = await import('vite')
  const server = await preview({ preview: { port: PORT, strictPort: false } })
  const base = `http://localhost:${server.config.preview.port || PORT}`

  const baseOpts = {
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  }
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    baseOpts.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH
  }

  let browser
  try {
    browser = await puppeteer.launch(baseOpts)
  } catch {
    // Fall back to a locally-installed Chrome/Chromium channel.
    try {
      browser = await puppeteer.launch({ ...baseOpts, channel: 'chrome' })
    } catch (e2) {
      console.warn('[prerender] could not launch a headless browser — skipping. ', e2.message)
      await server.httpServer?.close?.()
      return
    }
  }

  let ok = 0
  for (const { path: route } of ROUTES) {
    const page = await browser.newPage()
    try {
      await page.goto(base + route, { waitUntil: 'networkidle0', timeout: 30000 })
      // Give React + the Seo head updates a moment to settle.
      await page.waitForSelector('#root *', { timeout: 15000 }).catch(() => {})
      await new Promise((r) => setTimeout(r, 400))

      const html = '<!doctype html>\n' + (await page.evaluate(() => document.documentElement.outerHTML))

      const outDir = route === '/' ? DIST : path.join(DIST, route)
      fs.mkdirSync(outDir, { recursive: true })
      fs.writeFileSync(path.join(outDir, 'index.html'), html)
      ok++
    } catch (e) {
      console.warn(`[prerender] skipped ${route}: ${e.message}`)
    } finally {
      await page.close().catch(() => {})
    }
  }

  await browser.close().catch(() => {})
  await server.httpServer?.close?.()
  console.log(`[prerender] wrote ${ok}/${ROUTES.length} static route snapshots.`)
}

run().catch((e) => {
  console.warn('[prerender] non-fatal error — continuing build:', e.message)
  process.exit(0)
})
