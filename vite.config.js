import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

// Dev-only backend: mirrors the production /api/content serverless function so
// the CMS works locally. Persists to a gitignored JSON file instead of Redis.
function devContentApi() {
  const FILE = path.resolve('.dev-content.json')
  const read = () => { try { return JSON.parse(fs.readFileSync(FILE, 'utf8')) } catch { return {} } }
  return {
    name: 'dev-content-api',
    configureServer(server) {
      server.middlewares.use('/api/content', (req, res) => {
        const expected = process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD || 'INSECURE_DEMO_MODE'
        const send = (code, obj) => {
          res.statusCode = code
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(obj))
        }
        if (req.method === 'GET') return send(200, read())
        if (req.method === 'POST') {
          const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '')
          if (token !== expected) return send(401, { error: 'Wrong password.' })
          let body = ''
          req.on('data', (c) => (body += c))
          req.on('end', () => {
            let parsed = {}
            try { parsed = JSON.parse(body) } catch { /* empty */ }
            if (parsed.verifyOnly) return send(200, { ok: true })
            const payload = {
              overrides: parsed.overrides || {},
              media: parsed.media || {},
              languages: parsed.languages || null,
              homeServices: parsed.homeServices ?? null,
              updatedAt: new Date().toISOString(),
            }
            try { fs.writeFileSync(FILE, JSON.stringify(payload, null, 2)) } catch { /* ignore */ }
            return send(200, { ok: true, updatedAt: payload.updatedAt })
          })
          return
        }
        send(405, { error: 'Method not allowed' })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), devContentApi()],
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : undefined,
    strictPort: false,
    proxy: {
      '/api/chat': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/chat/, '/v1/messages'),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            const key = process.env.ANTHROPIC_API_KEY || ''
            if (key) {
              proxyReq.setHeader('x-api-key', key)
              proxyReq.setHeader('anthropic-version', '2023-06-01')
            }
          })
        },
      },
    },
  },
})
