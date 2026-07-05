# SEO / GEO — Operations Guide

Everything below is wired up. This file explains how to run it and what to do
after the first deploy.

## 1. Changing the domain (one place)

The whole site (canonical tags, Open Graph, JSON-LD, `robots.txt`,
`sitemap.xml`, IndexNow) derives from **one variable**: `VITE_SITE_URL`.

- **Local / committed default:** [`.env`](.env) → `VITE_SITE_URL=https://doronazran.com`
- **Production:** set `VITE_SITE_URL` in the Vercel project → Settings →
  Environment Variables (this overrides `.env`). No trailing slash.

Change it there and redeploy — nothing else to edit.

## 2. SSL / HTTPS

- Vercel **automatically provisions and renews a free SSL certificate**
  (Let's Encrypt) for the production domain and every custom domain you add —
  nothing to configure in code.
- HTTPS is **enforced**: `vercel.json` sends `Strict-Transport-Security`
  (HSTS, 2 years, `preload`), and Vercel auto-redirects HTTP → HTTPS.
- Other security headers are set in [`vercel.json`](vercel.json):
  `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`. The site stays fully public to all visitors; only
  `/admin` is password-gated and marked `noindex`.

## 3. Prerendering (for crawlers & LLMs)

`npm run build` runs:
1. `vite build` — the SPA bundle (the heavy 3D scene is code-split).
2. `gen-seo.mjs` — writes `dist/robots.txt` + `dist/sitemap.xml` for the domain.
3. `prerender.mjs` — renders every route in headless Chrome and writes a
   static `dist/<route>/index.html` with the **full page content + per-route
   `<title>`, canonical, Open Graph and JSON-LD**. This is what non-JS LLM
   crawlers (and search engines) read. The SPA still hydrates on top for users.
4. `notify-search.mjs` — submits URLs to IndexNow on production deploys.

On Vercel, Chromium is downloaded automatically during install. Prerendering
**never breaks the build** — if a browser is unavailable it logs a warning and
ships the SPA (which still carries rich meta + JSON-LD).

`npm run build:fast` skips prerender + submission (useful for quick local builds).

## 4. Automatic search-engine submission

- **IndexNow** (Bing, Yandex, Seznam, Naver, …): runs automatically at the end
  of every **production** build (`notify-search.mjs`, gated on
  `VERCEL_ENV=production`). Key file: [`public/8f3b2a1c9d7e4f60b5a8c2e1d4f7a093.txt`](public/8f3b2a1c9d7e4f60b5a8c2e1d4f7a093.txt).
- **Google** does not support IndexNow. One-time setup: verify the domain in
  [Google Search Console](https://search.google.com/search-console) and submit
  `https://<domain>/sitemap.xml`. After that Google re-crawls the sitemap
  automatically — no per-deploy action needed.
- **Bing**: also verify in [Bing Webmaster Tools](https://www.bing.com/webmasters)
  (IndexNow already covers ongoing submission).

## 5. Vercel environment variables to set

| Variable | Purpose |
|----------|---------|
| `VITE_SITE_URL` | Canonical domain (drives all SEO). |
| `VITE_ADMIN_PASSWORD` | Admin panel password. |
| `VITE_ANTHROPIC_API_KEY` | Chat widget (optional). |

## 6. After going live — checklist
- [ ] Set `VITE_SITE_URL` to the real domain in Vercel.
- [ ] Add the custom domain in Vercel (SSL issues automatically).
- [ ] Verify the domain in Google Search Console + submit the sitemap.
- [ ] Verify in Bing Webmaster Tools.
- [ ] (Optional) Replace `public/og-image.svg` with a 1200×630 JPG/PNG for
      maximum social-platform compatibility, and update the `og:image` paths.
