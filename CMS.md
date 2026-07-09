# Content Backend (CMS) — Setup

The admin panel can now publish content that is live for **all visitors** (not
just your browser). The code is deployed; you just need to connect a database
and set the admin password on Vercel. One-time, ~3 minutes.

## How it works
- `GET /api/content` — public; the whole site loads published content from here.
- `POST /api/content` — admin only; saves content. The password is checked
  **on the server** (env var `ADMIN_PASSWORD`), so it is real security.
- Storage: **Upstash Redis / Vercel KV**.
- Locally (`npm run dev`) it uses a gitignored `.dev-content.json` file, so you
  can test without any cloud setup.

## One-time setup on Vercel

### 1. Create the database
1. Vercel → project **Doronazranweb** → **Storage** tab → **Create Database**.
2. Choose **Upstash for Redis** (a.k.a. KV) → create → **Connect** it to the project.
3. This automatically adds the env vars `KV_REST_API_URL` + `KV_REST_API_TOKEN`.

### 2. Set the admin password (server side)
Settings → **Environment Variables** → add:

| Key | Value | Notes |
|-----|-------|-------|
| `ADMIN_PASSWORD` | your real admin password | **Server-only.** This is the login + publish password on the live site. Not shipped to the browser. |

> Security tip: make `ADMIN_PASSWORD` a value **different** from `VITE_ADMIN_PASSWORD`
> (the UI-gate password, which IS visible in the page code). Then the real
> password never appears in the browser bundle. If you set them the same
> (`D@5299014`), publishing still works but the password is guessable.

### 3. Redeploy
Deployments → latest → ⋯ → **Redeploy** (or just wait for the next auto-sync push).

## Using it
1. Go to `https://<your-domain>/admin` → log in with `ADMIN_PASSWORD`.
2. Edit any text/field (all languages).
3. Click **⬆ פרסם לאתר** (Publish to site).
4. The change is now live for every visitor. Reload to confirm.

If publishing shows "backend not configured", the database (step 1) or
`ADMIN_PASSWORD` (step 2) is missing.

## AI features: auto-translate + import article from a link

Two admin superpowers, both server-side (no browser API key):
- **Auto-translate** — edit a field in English and click ✦ (or translate a whole
  language) → `POST /api/translate` translates it. Adding a new language can
  auto-translate the entire site.
- **Import article from a link** — in a news/article item, paste any URL into the
  link field and click **⬇ ייבא ותרגם אוטומטית**. `POST /api/import-article`
  fetches the page, extracts source/date/title/image/body, and translates to
  Hebrew + English automatically.

**Both work out of the box — no configuration needed** (they use a free
translation service by default). For higher-quality translation, optionally add:

| Key | Value |
|-----|-------|
| `ANTHROPIC_API_KEY` | your Anthropic API key (console.anthropic.com) — optional |

When set, translation upgrades from the free engine to Claude. Add it in
Settings → Environment Variables → Save → Redeploy.

## Contact form email

Contact submissions email you via `POST /api/contact` using **Resend**
(`RESEND_API_KEY`). In Resend test mode (no verified domain) it can only send to
the account-owner email — which is fine since the form always emails you. To send
from a branded address, verify a domain at resend.com/domains.

## Full Vercel env-var list

| Key | Purpose |
|-----|---------|
| `VITE_SITE_URL` | Canonical domain (drives all SEO). |
| `ADMIN_PASSWORD` | Server-side publish auth (the admin login password). |
| `VITE_ADMIN_PASSWORD` | Admin UI gate (offline fallback). |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Content store (auto-added by Upstash). |
| `RESEND_API_KEY` | Contact-form email. |
| `ANTHROPIC_API_KEY` | Auto-translate + article import. |

## Limits (Phase 1)
- Uploaded images are stored inline; large images can exceed the request limit.
  Prefer image **URLs** for big assets (a later phase can add Vercel Blob for
  file uploads).
